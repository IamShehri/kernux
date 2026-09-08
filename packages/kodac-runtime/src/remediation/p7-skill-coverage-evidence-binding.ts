import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

import {
  validateAgentSkillGovernanceClaimEvidence,
  type AgentSkillGovernanceClaimEvidence,
} from "../compatibility/agent-skill-governance-claim-evidence.ts"
import {
  validateAgentSkillPackageEvidence,
  type AgentSkillPackageEvidence,
} from "../compatibility/agent-skill-package-evidence.ts"
import {
  P7_R25_RISK_IDS,
  buildP7RiskCoverageEvidenceBinding,
  validateP7RiskCoverageEvidenceBinding,
  type P7RiskCoverageEvidenceBinding,
  type P7RiskCoverageEvidenceBindingBuildInput,
  type P7RiskCoverageState,
} from "./p7-risk-coverage-evidence-binding.ts"

export const P7_R26_SKILL_COVERAGE_EVIDENCE_BINDING_VERSION =
  "p7-r26-skill-coverage-evidence-binding-v1" as const
export const P7_R26_SKILL_COVERAGE_BOUND_STATE = "SKILL_COVERAGE_EVIDENCE_BOUND_ONLY" as const

export const P7_R26_SKILL_COVERAGE_LIMITS = Object.freeze({
  maxSkills: 256,
  maxEvidenceIdentitiesPerClaim: 32,
  maxRelevantRisksPerSkill: 16,
  maxGraphNodes: 262_144,
  maxGraphDepth: 64,
  maxGraphStringBytes: 33_554_432,
})

export const P7_R26_SKILL_ADMISSION_STATES = ["ADMITTED", "NOT_ADMITTED", "UNKNOWN"] as const
export const P7_R26_SKILL_RELEVANCE_STATES = ["RELEVANT", "NOT_RELEVANT", "UNKNOWN"] as const
export const P7_R26_SKILL_DISPOSITIONS = ["LOADED", "EXECUTED", "UNAVAILABLE"] as const
export const P7_R26_SKILL_COVERAGE_STATES = ["ACCOUNTED_NO_COVERAGE_DEBT", "HAS_COVERAGE_DEBT"] as const

export type P7SkillAdmissionState = (typeof P7_R26_SKILL_ADMISSION_STATES)[number]
export type P7SkillRelevanceState = (typeof P7_R26_SKILL_RELEVANCE_STATES)[number]
export type P7SkillDisposition = (typeof P7_R26_SKILL_DISPOSITIONS)[number]
export type P7SkillCoverageState = (typeof P7_R26_SKILL_COVERAGE_STATES)[number]

export interface P7SkillCoverageInput {
  readonly packageEvidence: AgentSkillPackageEvidence
  readonly governanceEvidence: AgentSkillGovernanceClaimEvidence
  readonly admission: P7SkillAdmissionState
  readonly admissionEvidenceIdentities: readonly string[]
  readonly relevance: P7SkillRelevanceState
  readonly relevantRiskIds: readonly string[]
  readonly relevanceEvidenceIdentities: readonly string[]
  readonly disposition: P7SkillDisposition
  readonly dispositionEvidenceIdentities: readonly string[]
}

export interface P7SkillCoverageEvidenceBindingBuildInput {
  readonly riskCoverageBuildInput: P7RiskCoverageEvidenceBindingBuildInput
  readonly riskCoverageEvidence: P7RiskCoverageEvidenceBinding
  readonly skills: readonly P7SkillCoverageInput[]
}

export interface P7SkillCoverageRecord {
  readonly skillIdentity: string
  readonly packageEvidenceIdentity: string
  readonly governanceEvidenceIdentity: string
  readonly packageManifestIdentity: string
  readonly sourceProvenanceIdentity: string
  readonly extensionId: string
  readonly name: string
  readonly packageBindingState: AgentSkillPackageEvidence["bindingState"]
  readonly governanceTrustStatus: AgentSkillGovernanceClaimEvidence["trustStatus"]
  readonly governanceAuthorityState: AgentSkillGovernanceClaimEvidence["authorityState"]
  readonly admission: P7SkillAdmissionState
  readonly admissionEvidenceIdentities: readonly string[]
  readonly relevance: P7SkillRelevanceState
  readonly relevantRiskIds: readonly string[]
  readonly relevanceEvidenceIdentities: readonly string[]
  readonly disposition: P7SkillDisposition
  readonly dispositionEvidenceIdentities: readonly string[]
}

export interface P7SkillCoverageEvidenceBinding {
  readonly version: typeof P7_R26_SKILL_COVERAGE_EVIDENCE_BINDING_VERSION
  readonly evidenceIdentity: string
  readonly state: typeof P7_R26_SKILL_COVERAGE_BOUND_STATE
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly targetTree: string
  readonly changedPathSetIdentity: string
  readonly reviewUniverseIdentity: string
  readonly riskCoverageEvidenceIdentity: string
  readonly riskTaxonomyIdentity: string
  readonly riskCoverageDebtIdentity: string
  readonly riskCoverageState: P7RiskCoverageState
  readonly skillCoverageSourceSetIdentity: string
  readonly skillAdmissionEvidenceIdentity: string
  readonly skillRelevanceEvidenceIdentity: string
  readonly skillDispositionEvidenceIdentity: string
  readonly relevantSkillSet: readonly string[]
  readonly notRelevantSkillSet: readonly string[]
  readonly unknownRelevanceSkillSet: readonly string[]
  readonly admittedSkillSet: readonly string[]
  readonly notAdmittedSkillSet: readonly string[]
  readonly unknownAdmissionSkillSet: readonly string[]
  readonly loadedSkillSet: readonly string[]
  readonly executedSkillSet: readonly string[]
  readonly unavailableSkillSet: readonly string[]
  readonly skillRecords: readonly P7SkillCoverageRecord[]
  readonly coverageDebtIdentity: string
  readonly skillCoverageState: P7SkillCoverageState
}

type UnknownRecord = Record<string, unknown>
type EvidenceCore = Omit<P7SkillCoverageEvidenceBinding, "evidenceIdentity">
type NormalizedSkill = Readonly<P7SkillCoverageRecord & {
  readonly packageEvidence: AgentSkillPackageEvidence
  readonly governanceEvidence: AgentSkillGovernanceClaimEvidence
}>
type NormalizedInput = Readonly<{
  riskCoverageBuildInput: P7RiskCoverageEvidenceBindingBuildInput
  riskCoverageEvidence: P7RiskCoverageEvidenceBinding
  skills: readonly NormalizedSkill[]
}>

const SHA256 = /^[0-9a-f]{64}$/
const INPUT_KEYS = ["riskCoverageBuildInput", "riskCoverageEvidence", "skills"] as const
const SKILL_INPUT_KEYS = [
  "packageEvidence",
  "governanceEvidence",
  "admission",
  "admissionEvidenceIdentities",
  "relevance",
  "relevantRiskIds",
  "relevanceEvidenceIdentities",
  "disposition",
  "dispositionEvidenceIdentities",
] as const

function fail(label: string, detail: string): never {
  throw new TypeError(`${label} ${detail}`)
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function assertUnicodeScalars(value: string, label: string): void {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code >= 0xd800 && code <= 0xdbff) {
      if (index + 1 >= value.length) fail(label, "must contain only valid Unicode scalar values")
      const next = value.charCodeAt(index + 1)
      if (next < 0xdc00 || next > 0xdfff) fail(label, "must contain only valid Unicode scalar values")
      index += 1
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      fail(label, "must contain only valid Unicode scalar values")
    }
  }
}

function assertSafeJsonGraph(value: unknown, label: string): void {
  const stack: Array<{ readonly value: unknown; readonly label: string; readonly depth: number }> = [
    { value, label, depth: 0 },
  ]
  const seen = new Set<object>()
  let nodes = 0
  let stringBytes = 0

  while (stack.length > 0) {
    const current = stack.pop()!
    nodes += 1
    if (nodes > P7_R26_SKILL_COVERAGE_LIMITS.maxGraphNodes) fail(label, "exceeds the JSON node budget")
    if (current.depth > P7_R26_SKILL_COVERAGE_LIMITS.maxGraphDepth) fail(label, "exceeds the JSON depth budget")

    const item = current.value
    if (item === null || typeof item === "boolean") continue
    if (typeof item === "string") {
      assertUnicodeScalars(item, current.label)
      stringBytes += Buffer.byteLength(item, "utf8")
      if (stringBytes > P7_R26_SKILL_COVERAGE_LIMITS.maxGraphStringBytes) fail(label, "exceeds the JSON string-byte budget")
      continue
    }
    if (typeof item === "number") {
      if (!Number.isFinite(item) || !Number.isSafeInteger(item) || Object.is(item, -0)) {
        fail(current.label, "must be a finite safe JSON integer")
      }
      continue
    }
    if (typeof item !== "object") fail(current.label, "must contain only JSON-compatible values")
    if (nodeTypes.isProxy(item)) fail(current.label, "must not contain Proxy values")
    if (seen.has(item)) fail(current.label, "must not contain aliases or cycles")
    seen.add(item)

    if (Array.isArray(item)) {
      if (Object.getPrototypeOf(item) !== Array.prototype) fail(current.label, "must use the ordinary Array prototype")
      const lengthDescriptor = Object.getOwnPropertyDescriptor(item, "length")
      if (lengthDescriptor === undefined || !("value" in lengthDescriptor) || !Number.isSafeInteger(lengthDescriptor.value)) {
        fail(current.label, "must expose an ordinary array length")
      }
      const length = lengthDescriptor.value as number
      if (length > P7_R26_SKILL_COVERAGE_LIMITS.maxGraphNodes) fail(current.label, "exceeds the array length budget")
      const expected = new Set<string>(["length"])
      for (let index = 0; index < length; index += 1) expected.add(String(index))
      const keys = Reflect.ownKeys(item)
      for (const key of keys) {
        if (typeof key !== "string" || !expected.has(key)) fail(current.label, "must not contain symbol, sparse, or extra array fields")
      }
      if (keys.length !== expected.size) fail(current.label, "must not contain sparse array slots")
      for (let index = length - 1; index >= 0; index -= 1) {
        const descriptor = Object.getOwnPropertyDescriptor(item, String(index))
        if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
          fail(`${current.label}[${index}]`, "must be an enumerable data property")
        }
        stack.push({ value: descriptor.value, label: `${current.label}[${index}]`, depth: current.depth + 1 })
      }
      continue
    }

    const prototype = Object.getPrototypeOf(item)
    if (prototype !== Object.prototype && prototype !== null) fail(current.label, "must contain only plain objects")
    for (const key of Reflect.ownKeys(item)) {
      if (typeof key !== "string") fail(current.label, "must not contain symbol fields")
      assertUnicodeScalars(key, `${current.label} property name`)
      const descriptor = Object.getOwnPropertyDescriptor(item, key)
      if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
        fail(`${current.label}.${key}`, "must be an enumerable data property")
      }
      stack.push({ value: descriptor.value, label: `${current.label}.${key}`, depth: current.depth + 1 })
    }
  }
}

function snapshotJsonData<T>(value: T, label: string): T {
  assertSafeJsonGraph(value, label)
  try {
    return structuredClone(value)
  } catch {
    return fail(label, "must be structured-cloneable JSON data")
  }
}

function ownDataRecord(
  value: unknown,
  required: readonly string[],
  allowed: readonly string[],
  label: string,
): UnknownRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value) || nodeTypes.isProxy(value)) {
    fail(label, "must be a plain non-Proxy object")
  }
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(label, "must use a plain object prototype")
  const keys = Reflect.ownKeys(value)
  const allowedSet = new Set(allowed)
  for (const key of keys) {
    if (typeof key !== "string" || !allowedSet.has(key)) fail(label, "contains an unknown or symbol field")
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}.${key}`, "must be an enumerable data property")
    }
  }
  for (const key of required) if (!Object.hasOwn(value, key)) fail(label, `is missing required field: ${key}`)
  return value as UnknownRecord
}

function denseArray(value: unknown, label: string, maxLength: number): readonly unknown[] {
  if (!Array.isArray(value) || nodeTypes.isProxy(value)) fail(label, "must be a non-Proxy array")
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(label, "must use the ordinary Array prototype")
  if (value.length > maxLength) fail(label, `must contain at most ${maxLength} entries`)
  const keys = Reflect.ownKeys(value)
  const expected = new Set<string>(["length"])
  for (let index = 0; index < value.length; index += 1) expected.add(String(index))
  for (const key of keys) {
    if (typeof key !== "string" || !expected.has(key)) fail(label, "must not contain symbol, sparse, or extra array fields")
  }
  if (keys.length !== expected.size) fail(label, "must not contain sparse array slots")
  return value
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    const encoded = JSON.stringify(value)
    if (encoded === undefined) fail("canonical JSON", "contains a non-JSON value")
    return encoded
  }
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(",")}]`
  const record = value as UnknownRecord
  return `{${Object.keys(record)
    .sort(compareStrings)
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
    .join(",")}}`
}

function hashCanonical(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value), "utf8").digest("hex")
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as UnknownRecord)) deepFreeze(child)
  }
  return value
}

function sha256(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) fail(label, "must be a lowercase SHA-256 digest")
  return value
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], label: string): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) fail(label, `must be one of: ${allowed.join(", ")}`)
  return value as T
}

function sortedUniqueSha256Array(value: unknown, label: string, maxLength: number): readonly string[] {
  const values = denseArray(value, label, maxLength).map((item, index) => sha256(item, `${label}[${index}]`))
  if (new Set(values).size !== values.length) fail(label, "must not contain duplicate evidence identities")
  return Object.freeze([...values].sort(compareStrings))
}

function sortedUniqueRiskIds(value: unknown, label: string): readonly string[] {
  const values = denseArray(value, label, P7_R26_SKILL_COVERAGE_LIMITS.maxRelevantRisksPerSkill).map((item, index) => {
    if (typeof item !== "string" || !(P7_R25_RISK_IDS as readonly string[]).includes(item)) fail(`${label}[${index}]`, "must be a canonical P7-R25 risk identifier")
    return item
  })
  if (new Set(values).size !== values.length) fail(label, "must not contain duplicate risk identifiers")
  return Object.freeze([...values].sort(compareStrings))
}

function normalizedSkill(value: unknown, index: number): NormalizedSkill {
  const label = `input.skills[${index}]`
  const record = ownDataRecord(value, SKILL_INPUT_KEYS, SKILL_INPUT_KEYS, label)
  const packageEvidence = validateAgentSkillPackageEvidence(record.packageEvidence)
  const governanceEvidence = validateAgentSkillGovernanceClaimEvidence(record.governanceEvidence, packageEvidence)
  if (governanceEvidence.packageEvidenceIdentity !== packageEvidence.evidenceIdentity) {
    fail(`${label}.governanceEvidence`, "does not bind the exact supplied package evidence")
  }

  const admission = oneOf(record.admission, P7_R26_SKILL_ADMISSION_STATES, `${label}.admission`)
  const admissionEvidenceIdentities = sortedUniqueSha256Array(
    record.admissionEvidenceIdentities,
    `${label}.admissionEvidenceIdentities`,
    P7_R26_SKILL_COVERAGE_LIMITS.maxEvidenceIdentitiesPerClaim,
  )
  if (admission !== "UNKNOWN" && admissionEvidenceIdentities.length === 0) {
    fail(`${label}.admissionEvidenceIdentities`, `${admission} requires at least one evidence identity`)
  }

  const relevance = oneOf(record.relevance, P7_R26_SKILL_RELEVANCE_STATES, `${label}.relevance`)
  const relevantRiskIds = sortedUniqueRiskIds(record.relevantRiskIds, `${label}.relevantRiskIds`)
  const relevanceEvidenceIdentities = sortedUniqueSha256Array(
    record.relevanceEvidenceIdentities,
    `${label}.relevanceEvidenceIdentities`,
    P7_R26_SKILL_COVERAGE_LIMITS.maxEvidenceIdentitiesPerClaim,
  )
  if (relevance === "RELEVANT" && relevantRiskIds.length === 0) {
    fail(`${label}.relevantRiskIds`, "RELEVANT requires at least one canonical risk identifier")
  }
  if (relevance !== "RELEVANT" && relevantRiskIds.length !== 0) {
    fail(`${label}.relevantRiskIds`, `${relevance} requires an empty risk set`)
  }
  if (relevance !== "UNKNOWN" && relevanceEvidenceIdentities.length === 0) {
    fail(`${label}.relevanceEvidenceIdentities`, `${relevance} requires at least one evidence identity`)
  }

  const disposition = oneOf(record.disposition, P7_R26_SKILL_DISPOSITIONS, `${label}.disposition`)
  const dispositionEvidenceIdentities = sortedUniqueSha256Array(
    record.dispositionEvidenceIdentities,
    `${label}.dispositionEvidenceIdentities`,
    P7_R26_SKILL_COVERAGE_LIMITS.maxEvidenceIdentitiesPerClaim,
  )
  if (dispositionEvidenceIdentities.length === 0) {
    fail(`${label}.dispositionEvidenceIdentities`, `${disposition} requires at least one evidence identity`)
  }

  if ((admission === "ADMITTED" || disposition === "LOADED" || disposition === "EXECUTED") && packageEvidence.bindingState !== "CURRENT") {
    fail(`${label}.packageEvidence.bindingState`, "positive admission/load/execution accounting requires CURRENT package binding")
  }
  if ((disposition === "LOADED" || disposition === "EXECUTED") && admission !== "ADMITTED") {
    fail(`${label}.admission`, `${disposition} requires ADMITTED accounting`)
  }
  if (disposition === "EXECUTED" && relevance !== "RELEVANT") {
    fail(`${label}.relevance`, "EXECUTED requires explicit RELEVANT accounting")
  }

  const skillIdentity = hashCanonical({
    packageEvidenceIdentity: packageEvidence.evidenceIdentity,
    governanceEvidenceIdentity: governanceEvidence.governanceEvidenceIdentity,
  })

  return deepFreeze({
    skillIdentity,
    packageEvidenceIdentity: packageEvidence.evidenceIdentity,
    governanceEvidenceIdentity: governanceEvidence.governanceEvidenceIdentity,
    packageManifestIdentity: packageEvidence.packageManifestEvidence.sha256,
    sourceProvenanceIdentity: packageEvidence.sourceProvenanceIdentity,
    extensionId: packageEvidence.extensionId,
    name: packageEvidence.name,
    packageBindingState: packageEvidence.bindingState,
    governanceTrustStatus: governanceEvidence.trustStatus,
    governanceAuthorityState: governanceEvidence.authorityState,
    admission,
    admissionEvidenceIdentities,
    relevance,
    relevantRiskIds,
    relevanceEvidenceIdentities,
    disposition,
    dispositionEvidenceIdentities,
    packageEvidence,
    governanceEvidence,
  })
}

function normalizeInput(rawInput: P7SkillCoverageEvidenceBindingBuildInput): NormalizedInput {
  const snapshot = snapshotJsonData(rawInput, "input")
  const record = ownDataRecord(snapshot, INPUT_KEYS, INPUT_KEYS, "input")
  const values = denseArray(record.skills, "input.skills", P7_R26_SKILL_COVERAGE_LIMITS.maxSkills)
  const skills = values.map((value, index) => normalizedSkill(value, index))

  const packageIds = new Set<string>()
  const governanceIds = new Set<string>()
  const skillIds = new Set<string>()
  for (const skill of skills) {
    if (packageIds.has(skill.packageEvidenceIdentity)) fail("input.skills", "contains duplicate package evidence identity")
    if (governanceIds.has(skill.governanceEvidenceIdentity)) fail("input.skills", "contains duplicate governance evidence identity")
    if (skillIds.has(skill.skillIdentity)) fail("input.skills", "contains duplicate skill identity")
    packageIds.add(skill.packageEvidenceIdentity)
    governanceIds.add(skill.governanceEvidenceIdentity)
    skillIds.add(skill.skillIdentity)
  }

  return Object.freeze({
    riskCoverageBuildInput: record.riskCoverageBuildInput as P7RiskCoverageEvidenceBindingBuildInput,
    riskCoverageEvidence: record.riskCoverageEvidence as P7RiskCoverageEvidenceBinding,
    skills: Object.freeze([...skills].sort((left, right) => compareStrings(left.skillIdentity, right.skillIdentity))),
  })
}

function skillRecord(skill: NormalizedSkill): P7SkillCoverageRecord {
  return deepFreeze({
    skillIdentity: skill.skillIdentity,
    packageEvidenceIdentity: skill.packageEvidenceIdentity,
    governanceEvidenceIdentity: skill.governanceEvidenceIdentity,
    packageManifestIdentity: skill.packageManifestIdentity,
    sourceProvenanceIdentity: skill.sourceProvenanceIdentity,
    extensionId: skill.extensionId,
    name: skill.name,
    packageBindingState: skill.packageBindingState,
    governanceTrustStatus: skill.governanceTrustStatus,
    governanceAuthorityState: skill.governanceAuthorityState,
    admission: skill.admission,
    admissionEvidenceIdentities: Object.freeze([...skill.admissionEvidenceIdentities]),
    relevance: skill.relevance,
    relevantRiskIds: Object.freeze([...skill.relevantRiskIds]),
    relevanceEvidenceIdentities: Object.freeze([...skill.relevanceEvidenceIdentities]),
    disposition: skill.disposition,
    dispositionEvidenceIdentities: Object.freeze([...skill.dispositionEvidenceIdentities]),
  })
}

export function buildP7SkillCoverageEvidenceBinding(
  rawInput: P7SkillCoverageEvidenceBindingBuildInput,
): P7SkillCoverageEvidenceBinding {
  const input = normalizeInput(rawInput)
  const rebuiltRiskCoverage = buildP7RiskCoverageEvidenceBinding(input.riskCoverageBuildInput)
  const validatedRiskCoverage = validateP7RiskCoverageEvidenceBinding(
    input.riskCoverageEvidence,
    input.riskCoverageBuildInput,
  )
  if (rebuiltRiskCoverage.evidenceIdentity !== validatedRiskCoverage.evidenceIdentity) {
    fail("input.riskCoverageEvidence", "does not equal the exact P7-R25 evidence rebuilt from riskCoverageBuildInput")
  }

  const skillRecords = Object.freeze(input.skills.map((skill) => skillRecord(skill)))
  const relevantSkillSet = Object.freeze(skillRecords.filter((skill) => skill.relevance === "RELEVANT").map((skill) => skill.skillIdentity))
  const notRelevantSkillSet = Object.freeze(skillRecords.filter((skill) => skill.relevance === "NOT_RELEVANT").map((skill) => skill.skillIdentity))
  const unknownRelevanceSkillSet = Object.freeze(skillRecords.filter((skill) => skill.relevance === "UNKNOWN").map((skill) => skill.skillIdentity))
  const admittedSkillSet = Object.freeze(skillRecords.filter((skill) => skill.admission === "ADMITTED").map((skill) => skill.skillIdentity))
  const notAdmittedSkillSet = Object.freeze(skillRecords.filter((skill) => skill.admission === "NOT_ADMITTED").map((skill) => skill.skillIdentity))
  const unknownAdmissionSkillSet = Object.freeze(skillRecords.filter((skill) => skill.admission === "UNKNOWN").map((skill) => skill.skillIdentity))
  const loadedSkillSet = Object.freeze(skillRecords.filter((skill) => skill.disposition === "LOADED").map((skill) => skill.skillIdentity))
  const executedSkillSet = Object.freeze(skillRecords.filter((skill) => skill.disposition === "EXECUTED").map((skill) => skill.skillIdentity))
  const unavailableSkillSet = Object.freeze(skillRecords.filter((skill) => skill.disposition === "UNAVAILABLE").map((skill) => skill.skillIdentity))

  const skillCoverageSourceSetIdentity = hashCanonical(skillRecords.map((skill) => ({
    skillIdentity: skill.skillIdentity,
    packageEvidenceIdentity: skill.packageEvidenceIdentity,
    governanceEvidenceIdentity: skill.governanceEvidenceIdentity,
    packageManifestIdentity: skill.packageManifestIdentity,
    sourceProvenanceIdentity: skill.sourceProvenanceIdentity,
  })))
  const skillAdmissionEvidenceIdentity = hashCanonical(skillRecords.map((skill) => ({
    skillIdentity: skill.skillIdentity,
    admission: skill.admission,
    evidenceIdentities: [...skill.admissionEvidenceIdentities],
  })))
  const skillRelevanceEvidenceIdentity = hashCanonical(skillRecords.map((skill) => ({
    skillIdentity: skill.skillIdentity,
    relevance: skill.relevance,
    relevantRiskIds: [...skill.relevantRiskIds],
    evidenceIdentities: [...skill.relevanceEvidenceIdentities],
  })))
  const skillDispositionEvidenceIdentity = hashCanonical(skillRecords.map((skill) => ({
    skillIdentity: skill.skillIdentity,
    disposition: skill.disposition,
    evidenceIdentities: [...skill.dispositionEvidenceIdentities],
  })))

  const debtCore = {
    riskCoverageEvidenceIdentity: rebuiltRiskCoverage.evidenceIdentity,
    riskCoverageDebtIdentity: rebuiltRiskCoverage.coverageDebtIdentity,
    riskCoverageState: rebuiltRiskCoverage.riskCoverageState,
    notAdmittedSkillSet,
    unknownAdmissionSkillSet,
    unknownRelevanceSkillSet,
    unavailableSkillSet,
  }
  const coverageDebtIdentity = hashCanonical(debtCore)
  const hasSkillDebt = notAdmittedSkillSet.length > 0
    || unknownAdmissionSkillSet.length > 0
    || unknownRelevanceSkillSet.length > 0
    || unavailableSkillSet.length > 0
  const hasRiskDebt = rebuiltRiskCoverage.riskCoverageState !== "ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN"
  const skillCoverageState: P7SkillCoverageState = hasSkillDebt || hasRiskDebt
    ? "HAS_COVERAGE_DEBT"
    : "ACCOUNTED_NO_COVERAGE_DEBT"

  const core: EvidenceCore = {
    version: P7_R26_SKILL_COVERAGE_EVIDENCE_BINDING_VERSION,
    state: P7_R26_SKILL_COVERAGE_BOUND_STATE,
    repositoryIdentity: rebuiltRiskCoverage.repositoryIdentity,
    canonicalBase: rebuiltRiskCoverage.canonicalBase,
    targetHead: rebuiltRiskCoverage.targetHead,
    targetTree: rebuiltRiskCoverage.targetTree,
    changedPathSetIdentity: rebuiltRiskCoverage.changedPathSetIdentity,
    reviewUniverseIdentity: rebuiltRiskCoverage.reviewUniverseIdentity,
    riskCoverageEvidenceIdentity: rebuiltRiskCoverage.evidenceIdentity,
    riskTaxonomyIdentity: rebuiltRiskCoverage.riskTaxonomyIdentity,
    riskCoverageDebtIdentity: rebuiltRiskCoverage.coverageDebtIdentity,
    riskCoverageState: rebuiltRiskCoverage.riskCoverageState,
    skillCoverageSourceSetIdentity,
    skillAdmissionEvidenceIdentity,
    skillRelevanceEvidenceIdentity,
    skillDispositionEvidenceIdentity,
    relevantSkillSet,
    notRelevantSkillSet,
    unknownRelevanceSkillSet,
    admittedSkillSet,
    notAdmittedSkillSet,
    unknownAdmissionSkillSet,
    loadedSkillSet,
    executedSkillSet,
    unavailableSkillSet,
    skillRecords,
    coverageDebtIdentity,
    skillCoverageState,
  }
  return deepFreeze({ ...core, evidenceIdentity: hashCanonical(core) })
}

export function validateP7SkillCoverageEvidenceBinding(
  value: unknown,
  input: P7SkillCoverageEvidenceBindingBuildInput,
): P7SkillCoverageEvidenceBinding {
  const actual = snapshotJsonData(value, "evidence")
  const expected = buildP7SkillCoverageEvidenceBinding(input)
  if (canonicalJson(actual) !== canonicalJson(expected)) fail("evidence", "does not match the canonical result for the supplied P7-R26 input")
  return expected
}
