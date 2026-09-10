import { createHash } from "node:crypto"
import { types } from "node:util"

import {
  validateAgentSkillPackageEvidence,
  type AgentSkillPackageEvidence,
} from "../compatibility/agent-skill-package-evidence.ts"
import {
  K4_R5_AGENT_SKILL_GOVERNANCE_AUTHORITY_STATE,
  K4_R5_AGENT_SKILL_GOVERNANCE_TRUST_STATUS,
  validateAgentSkillGovernanceClaimEvidence,
  type AgentSkillGovernanceClaimEvidence,
} from "../compatibility/agent-skill-governance-claim-evidence.ts"

export const O3_PROGRESSIVE_SKILL_TRUST_GATE_VERSION = "kodac-o3-progressive-skill-trust-gate-v1" as const
export const O3_SKILL_SOURCE_CLASSES = Object.freeze([
  "CANONICAL_KODAC_SKILL",
  "ADMITTED_REPOSITORY_SKILL",
  "CANDIDATE_REPOSITORY_SKILL",
  "EXTERNAL_REFERENCE_SKILL",
] as const)
export const O3_SELECTION_DECISIONS = Object.freeze(["SELECTED", "NOT_SELECTED"] as const)
export const O3_ADMISSION_DECISIONS = Object.freeze(["ADMITTED", "NOT_ADMITTED", "UNKNOWN"] as const)
export const O3_LOAD_DECISIONS = Object.freeze(["ALLOW", "BLOCK"] as const)
export const O3_LIMITS = Object.freeze({
  maxSelectionEvidenceIdentities: 32,
  maxSourceClassificationEvidenceIdentities: 32,
  maxAdmissionEvidenceIdentities: 32,
  maxLoadEvidenceIdentities: 32,
  maxDescriptionUtf8Bytes: 4_096,
  maxSkillFileUtf8Bytes: 1_048_576,
  maxBoundedTextUtf8Bytes: 4_096,
  maxGraphDepth: 32,
  maxGraphNodes: 16_384,
})

export type O3SkillSourceClass = (typeof O3_SKILL_SOURCE_CLASSES)[number]
export type O3SelectionDecision = (typeof O3_SELECTION_DECISIONS)[number]
export type O3AdmissionDecision = (typeof O3_ADMISSION_DECISIONS)[number]
export type O3LoadDecision = (typeof O3_LOAD_DECISIONS)[number]

export interface O3SkillSelectionInput {
  readonly packageEvidence: AgentSkillPackageEvidence
  readonly governanceEvidence: AgentSkillGovernanceClaimEvidence
  readonly sourceClass: O3SkillSourceClass
  readonly sourceClassificationEvidenceIdentities: readonly string[]
  readonly disclosedName: string
  readonly disclosedDescription: string
  readonly selectionDecision: O3SelectionDecision
  readonly selectionEvidenceIdentities: readonly string[]
  readonly subjectRepositoryIdentity: string
  readonly canonicalBase: string
  readonly subjectRevisionIdentity: string
  readonly workflowRunIdentity: string | null
}

export interface O3SkillSelectionEvidence {
  readonly version: typeof O3_PROGRESSIVE_SKILL_TRUST_GATE_VERSION
  readonly skillIdentity: string
  readonly packageEvidenceIdentity: string
  readonly governanceEvidenceIdentity: string
  readonly packageManifestIdentity: string
  readonly sourceProvenanceIdentity: string
  readonly packageBindingState: AgentSkillPackageEvidence["bindingState"]
  readonly governanceTrustStatus: typeof K4_R5_AGENT_SKILL_GOVERNANCE_TRUST_STATUS
  readonly governanceAuthorityState: typeof K4_R5_AGENT_SKILL_GOVERNANCE_AUTHORITY_STATE
  readonly sourceClass: O3SkillSourceClass
  readonly sourceClassificationEvidenceIdentities: readonly string[]
  readonly name: string
  readonly descriptionIdentity: string
  readonly descriptionByteLength: number
  readonly metadataDisclosureIdentity: string
  readonly selectionDecision: O3SelectionDecision
  readonly selectionEvidenceIdentities: readonly string[]
  readonly workflowRunIdentity: string | null
  readonly subjectRepositoryIdentity: string
  readonly canonicalBase: string
  readonly subjectRevisionIdentity: string
  readonly selectionIdentity: string
}

export interface O3SkillAdmissionInput {
  readonly selectionInput: O3SkillSelectionInput
  readonly selectionEvidence: O3SkillSelectionEvidence
  readonly admissionDecision: O3AdmissionDecision
  readonly admissionPolicyIdentity: string
  readonly admissionAuthorityIdentity: string
  readonly admissionEvidenceIdentities: readonly string[]
}

export interface O3SkillAdmissionEvidence {
  readonly version: typeof O3_PROGRESSIVE_SKILL_TRUST_GATE_VERSION
  readonly skillIdentity: string
  readonly selectionIdentity: string
  readonly sourceClass: O3SkillSourceClass
  readonly packageBindingState: AgentSkillPackageEvidence["bindingState"]
  readonly admissionDecision: O3AdmissionDecision
  readonly admissionPolicyIdentity: string
  readonly admissionAuthorityIdentity: string
  readonly admissionEvidenceIdentities: readonly string[]
  readonly workflowRunIdentity: string | null
  readonly subjectRepositoryIdentity: string
  readonly canonicalBase: string
  readonly subjectRevisionIdentity: string
  readonly admissionIdentity: string
}

export interface O3SkillLoadDecisionInput {
  readonly admissionInput: O3SkillAdmissionInput
  readonly admissionEvidence: O3SkillAdmissionEvidence
}

export interface O3SkillLoadDecisionEvidence {
  readonly version: typeof O3_PROGRESSIVE_SKILL_TRUST_GATE_VERSION
  readonly skillIdentity: string
  readonly selectionIdentity: string
  readonly admissionIdentity: string
  readonly sourceClass: O3SkillSourceClass
  readonly packageBindingState: AgentSkillPackageEvidence["bindingState"]
  readonly loadDecision: O3LoadDecision
  readonly workflowRunIdentity: string | null
  readonly subjectRepositoryIdentity: string
  readonly canonicalBase: string
  readonly subjectRevisionIdentity: string
  readonly loadDecisionIdentity: string
}

export interface O3LoadedSkillInput {
  readonly loadDecisionInput: O3SkillLoadDecisionInput
  readonly loadDecisionEvidence: O3SkillLoadDecisionEvidence
  readonly skillFileContent: string
  readonly loadEvidenceIdentities: readonly string[]
}

export interface O3LoadedSkillEvidence {
  readonly version: typeof O3_PROGRESSIVE_SKILL_TRUST_GATE_VERSION
  readonly skillIdentity: string
  readonly packageEvidenceIdentity: string
  readonly governanceEvidenceIdentity: string
  readonly packageManifestIdentity: string
  readonly sourceProvenanceIdentity: string
  readonly packageBindingState: "CURRENT"
  readonly governanceTrustStatus: typeof K4_R5_AGENT_SKILL_GOVERNANCE_TRUST_STATUS
  readonly governanceAuthorityState: typeof K4_R5_AGENT_SKILL_GOVERNANCE_AUTHORITY_STATE
  readonly sourceClass: "CANONICAL_KODAC_SKILL" | "ADMITTED_REPOSITORY_SKILL"
  readonly sourceClassificationEvidenceIdentities: readonly string[]
  readonly name: string
  readonly descriptionIdentity: string
  readonly descriptionByteLength: number
  readonly metadataDisclosureIdentity: string
  readonly selectionDecision: "SELECTED"
  readonly selectionEvidenceIdentities: readonly string[]
  readonly selectionIdentity: string
  readonly admissionDecision: "ADMITTED"
  readonly admissionPolicyIdentity: string
  readonly admissionAuthorityIdentity: string
  readonly admissionEvidenceIdentities: readonly string[]
  readonly admissionIdentity: string
  readonly loadDecision: "ALLOW"
  readonly loadDecisionIdentity: string
  readonly skillFileIdentity: string
  readonly skillFileByteLength: number
  readonly loadEvidenceIdentities: readonly string[]
  readonly workflowRunIdentity: string | null
  readonly subjectRepositoryIdentity: string
  readonly canonicalBase: string
  readonly subjectRevisionIdentity: string
  readonly loadedSkillEvidenceIdentity: string
}

type UnknownRecord = Record<string, unknown>
const SHA256 = /^[0-9a-f]{64}$/
const GIT_SHA1 = /^[0-9a-f]{40}$/
const SOURCE_CLASSES = new Set<string>(O3_SKILL_SOURCE_CLASSES)
const SELECTION_DECISIONS = new Set<string>(O3_SELECTION_DECISIONS)
const ADMISSION_DECISIONS = new Set<string>(O3_ADMISSION_DECISIONS)
const ALLOWED_ADMISSION_SOURCES = new Set<O3SkillSourceClass>(["CANONICAL_KODAC_SKILL", "ADMITTED_REPOSITORY_SKILL"])

const SELECTION_INPUT_KEYS = [
  "packageEvidence", "governanceEvidence", "sourceClass", "sourceClassificationEvidenceIdentities",
  "disclosedName", "disclosedDescription", "selectionDecision", "selectionEvidenceIdentities",
  "subjectRepositoryIdentity", "canonicalBase", "subjectRevisionIdentity", "workflowRunIdentity",
] as const
const ADMISSION_INPUT_KEYS = [
  "selectionInput", "selectionEvidence", "admissionDecision", "admissionPolicyIdentity",
  "admissionAuthorityIdentity", "admissionEvidenceIdentities",
] as const
const LOAD_DECISION_INPUT_KEYS = ["admissionInput", "admissionEvidence"] as const
const LOADED_INPUT_KEYS = ["loadDecisionInput", "loadDecisionEvidence", "skillFileContent", "loadEvidenceIdentities"] as const
const SELECTION_OUTPUT_KEYS = [
  "version", "skillIdentity", "packageEvidenceIdentity", "governanceEvidenceIdentity", "packageManifestIdentity",
  "sourceProvenanceIdentity", "packageBindingState", "governanceTrustStatus", "governanceAuthorityState", "sourceClass",
  "sourceClassificationEvidenceIdentities", "name", "descriptionIdentity", "descriptionByteLength",
  "metadataDisclosureIdentity", "selectionDecision", "selectionEvidenceIdentities", "workflowRunIdentity",
  "subjectRepositoryIdentity", "canonicalBase", "subjectRevisionIdentity", "selectionIdentity",
] as const
const ADMISSION_OUTPUT_KEYS = [
  "version", "skillIdentity", "selectionIdentity", "sourceClass", "packageBindingState", "admissionDecision",
  "admissionPolicyIdentity", "admissionAuthorityIdentity", "admissionEvidenceIdentities", "workflowRunIdentity",
  "subjectRepositoryIdentity", "canonicalBase", "subjectRevisionIdentity", "admissionIdentity",
] as const
const LOAD_DECISION_OUTPUT_KEYS = [
  "version", "skillIdentity", "selectionIdentity", "admissionIdentity", "sourceClass", "packageBindingState",
  "loadDecision", "workflowRunIdentity", "subjectRepositoryIdentity", "canonicalBase", "subjectRevisionIdentity",
  "loadDecisionIdentity",
] as const
export const O3_LOADED_SKILL_EVIDENCE_KEYS = Object.freeze([
  "version", "skillIdentity", "packageEvidenceIdentity", "governanceEvidenceIdentity", "packageManifestIdentity",
  "sourceProvenanceIdentity", "packageBindingState", "governanceTrustStatus", "governanceAuthorityState", "sourceClass",
  "sourceClassificationEvidenceIdentities", "name", "descriptionIdentity", "descriptionByteLength",
  "metadataDisclosureIdentity", "selectionDecision", "selectionEvidenceIdentities", "selectionIdentity",
  "admissionDecision", "admissionPolicyIdentity", "admissionAuthorityIdentity", "admissionEvidenceIdentities",
  "admissionIdentity", "loadDecision", "loadDecisionIdentity", "skillFileIdentity", "skillFileByteLength",
  "loadEvidenceIdentities", "workflowRunIdentity", "subjectRepositoryIdentity", "canonicalBase",
  "subjectRevisionIdentity", "loadedSkillEvidenceIdentity",
] as const)

function fail(message: string): never {
  throw new TypeError(`O3 progressive skill trust gate blocked: ${message}`)
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function assertUnicodeScalars(value: string, label: string): void {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1)
      if (!(next >= 0xdc00 && next <= 0xdfff)) fail(`${label} must contain only Unicode scalar values`)
      index += 1
    } else if (code >= 0xdc00 && code <= 0xdfff) fail(`${label} must contain only Unicode scalar values`)
  }
}

function boundedText(value: unknown, label: string, maximumBytes: number = O3_LIMITS.maxBoundedTextUtf8Bytes): string {
  if (typeof value !== "string" || value.length === 0 || value.includes("\0")) fail(`${label} must be non-empty NUL-free text`)
  assertUnicodeScalars(value, label)
  if (Buffer.byteLength(value, "utf8") > maximumBytes) fail(`${label} exceeds its UTF-8 byte bound`)
  return value
}

function sha256Identity(value: unknown, label: string): string {
  const text = boundedText(value, label, 64)
  if (!SHA256.test(text)) fail(`${label} must be a lowercase SHA-256 identity`)
  return text
}

function gitSha(value: unknown, label: string): string {
  const text = boundedText(value, label, 40)
  if (!GIT_SHA1.test(text)) fail(`${label} must be a lowercase 40-hex Git SHA-1`)
  return text
}

function enumValue<T extends string>(value: unknown, allowed: ReadonlySet<string>, label: string): T {
  if (typeof value !== "string" || !allowed.has(value)) fail(`${label} is unsupported`)
  return value as T
}

function ownDataRecord(value: unknown, expectedKeys: readonly string[], label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || types.isProxy(value) || Array.isArray(value)) fail(`${label} must be a non-proxy plain object`)
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(`${label} must use a plain-object prototype`)
  if (Object.getOwnPropertySymbols(value).length !== 0) fail(`${label} must not contain symbol properties`)
  const descriptors = Object.getOwnPropertyDescriptors(value)
  const actual = Object.keys(descriptors).sort(compareStrings)
  const expected = [...expectedKeys].sort(compareStrings)
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) fail(`${label} has unexpected or missing properties`)
  for (const key of actual) {
    const descriptor = descriptors[key]
    if (!descriptor || !("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) {
      fail(`${label}.${key} must be an enumerable defined data property`)
    }
  }
  return value as UnknownRecord
}

function denseArray(value: unknown, label: string, maximum: number): readonly unknown[] {
  if (typeof value !== "object" || value === null || types.isProxy(value) || !Array.isArray(value)) fail(`${label} must be a non-proxy array`)
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(`${label} must use the built-in Array prototype`)
  if (value.length > maximum) fail(`${label} exceeds its item bound`)
  if (Object.getOwnPropertySymbols(value).length !== 0) fail(`${label} must not contain symbol properties`)
  const descriptors = Object.getOwnPropertyDescriptors(value)
  const expected = new Set<string>(["length", ...Array.from({ length: value.length }, (_, index) => String(index))])
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string" || !expected.has(key)) fail(`${label} contains sparse or extra array properties`)
    if (key === "length") continue
    const descriptor = descriptors[key]
    if (!descriptor || !("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) fail(`${label}[${key}] must be an enumerable defined data property`)
  }
  if (Reflect.ownKeys(value).length !== expected.size) fail(`${label} contains sparse array slots`)
  return Array.from(value)
}

function evidenceIdentities(value: unknown, label: string, maximum: number, requireNonEmpty: boolean): readonly string[] {
  const values = denseArray(value, label, maximum).map((item, index) => sha256Identity(item, `${label}[${index}]`))
  if (requireNonEmpty && values.length === 0) fail(`${label} must not be empty`)
  if (new Set(values).size !== values.length) fail(`${label} must not contain duplicates`)
  return Object.freeze([...values].sort(compareStrings))
}

function assertSafeJsonGraph(value: unknown, label: string): void {
  const stack: Array<{ value: unknown, label: string, depth: number }> = [{ value, label, depth: 0 }]
  const seen = new Set<object>()
  let nodes = 0
  while (stack.length > 0) {
    const current = stack.pop()!
    nodes += 1
    if (nodes > O3_LIMITS.maxGraphNodes) fail(`${label} exceeds graph node bound`)
    if (current.depth > O3_LIMITS.maxGraphDepth) fail(`${label} exceeds graph depth bound`)
    const item = current.value
    if (item === null || typeof item === "boolean") continue
    if (typeof item === "string") { boundedText(item, current.label); continue }
    if (typeof item === "number") { if (!Number.isFinite(item)) fail(`${current.label} contains a non-finite number`); continue }
    if (typeof item !== "object" || types.isProxy(item)) fail(`${current.label} must contain only non-proxy JSON data`)
    if (seen.has(item)) fail(`${current.label} must not contain cyclic or aliased object references`)
    const prototype = Object.getPrototypeOf(item)
    if (Array.isArray(item)) {
      if (prototype !== Array.prototype) fail(`${current.label} must use the built-in Array prototype`)
    } else if (prototype !== Object.prototype && prototype !== null) fail(`${current.label} must use a plain-object prototype`)
    if (Object.getOwnPropertySymbols(item).length !== 0) fail(`${current.label} must not contain symbol properties`)
    seen.add(item)
    const descriptors = Object.getOwnPropertyDescriptors(item)
    if (Array.isArray(item)) {
      const expected = new Set<string>(["length", ...Array.from({ length: item.length }, (_, index) => String(index))])
      if (Reflect.ownKeys(item).length !== expected.size) fail(`${current.label} contains sparse or extra array properties`)
      for (let index = 0; index < item.length; index += 1) {
        const descriptor = descriptors[String(index)]
        if (!descriptor || !("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) fail(`${current.label}[${index}] must be an enumerable defined data property`)
        stack.push({ value: descriptor.value, label: `${current.label}[${index}]`, depth: current.depth + 1 })
      }
    } else {
      for (const [key, descriptor] of Object.entries(descriptors)) {
        if (!("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) fail(`${current.label}.${key} must be an enumerable defined data property`)
        stack.push({ value: descriptor.value, label: `${current.label}.${key}`, depth: current.depth + 1 })
      }
    }
  }
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    const encoded = JSON.stringify(value)
    if (encoded === undefined) fail("canonical JSON contains non-JSON data")
    return encoded
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`
  const record = value as UnknownRecord
  return `{${Object.keys(record).sort(compareStrings).map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`
}

function hashCanonical(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value), "utf8").digest("hex")
}

function domainDigest(domain: string, value: unknown): string {
  return createHash("sha256").update(domain, "utf8").update("\0", "utf8").update(canonicalJson(value), "utf8").digest("hex")
}

function textDigest(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex")
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as UnknownRecord)) deepFreeze(child)
  }
  return value
}

function normalizeSelection(raw: O3SkillSelectionInput): Readonly<{
  packageEvidence: AgentSkillPackageEvidence
  governanceEvidence: AgentSkillGovernanceClaimEvidence
  sourceClass: O3SkillSourceClass
  sourceClassificationEvidenceIdentities: readonly string[]
  disclosedName: string
  disclosedDescription: string
  selectionDecision: O3SelectionDecision
  selectionEvidenceIdentities: readonly string[]
  subjectRepositoryIdentity: string
  canonicalBase: string
  subjectRevisionIdentity: string
  workflowRunIdentity: string | null
}> {
  const input = ownDataRecord(raw, SELECTION_INPUT_KEYS, "selection input")
  assertSafeJsonGraph(input.packageEvidence, "selection input.packageEvidence")
  assertSafeJsonGraph(input.governanceEvidence, "selection input.governanceEvidence")
  const packageEvidence = validateAgentSkillPackageEvidence(input.packageEvidence)
  const governanceEvidence = validateAgentSkillGovernanceClaimEvidence(input.governanceEvidence, packageEvidence)
  if (governanceEvidence.packageEvidenceIdentity !== packageEvidence.evidenceIdentity) fail("governance evidence does not bind the exact package evidence")
  if (governanceEvidence.trustStatus !== K4_R5_AGENT_SKILL_GOVERNANCE_TRUST_STATUS || governanceEvidence.authorityState !== K4_R5_AGENT_SKILL_GOVERNANCE_AUTHORITY_STATE) {
    fail("governance evidence must preserve K4-R5 UNASSESSED/NONE posture")
  }
  const sourceClass = enumValue<O3SkillSourceClass>(input.sourceClass, SOURCE_CLASSES, "sourceClass")
  const sourceClassificationEvidenceIdentities = evidenceIdentities(input.sourceClassificationEvidenceIdentities, "sourceClassificationEvidenceIdentities", O3_LIMITS.maxSourceClassificationEvidenceIdentities, true)
  const disclosedName = boundedText(input.disclosedName, "disclosedName")
  const disclosedDescription = boundedText(input.disclosedDescription, "disclosedDescription", O3_LIMITS.maxDescriptionUtf8Bytes)
  if (disclosedName !== packageEvidence.name) fail("disclosedName does not equal the canonical K4 package name")
  if (textDigest(disclosedDescription) !== packageEvidence.descriptionEvidence.sha256 || Buffer.byteLength(disclosedDescription, "utf8") !== packageEvidence.descriptionEvidence.byteLength) {
    fail("disclosedDescription does not equal the exact K4 description evidence")
  }
  const selectionDecision = enumValue<O3SelectionDecision>(input.selectionDecision, SELECTION_DECISIONS, "selectionDecision")
  const selectionEvidenceIdentities = evidenceIdentities(input.selectionEvidenceIdentities, "selectionEvidenceIdentities", O3_LIMITS.maxSelectionEvidenceIdentities, true)
  if (selectionDecision === "SELECTED" && packageEvidence.bindingState !== "CURRENT") fail("SELECTED requires CURRENT K4 package binding")
  const subjectRepositoryIdentity = boundedText(input.subjectRepositoryIdentity, "subjectRepositoryIdentity")
  const canonicalBase = gitSha(input.canonicalBase, "canonicalBase")
  const subjectRevisionIdentity = gitSha(input.subjectRevisionIdentity, "subjectRevisionIdentity")
  const workflowRunIdentity = input.workflowRunIdentity === null ? null : sha256Identity(input.workflowRunIdentity, "workflowRunIdentity")
  return deepFreeze({ packageEvidence, governanceEvidence, sourceClass, sourceClassificationEvidenceIdentities, disclosedName, disclosedDescription, selectionDecision, selectionEvidenceIdentities, subjectRepositoryIdentity, canonicalBase, subjectRevisionIdentity, workflowRunIdentity })
}

function skillIdentity(packageEvidenceIdentity: string, governanceEvidenceIdentity: string): string {
  return hashCanonical({ packageEvidenceIdentity, governanceEvidenceIdentity })
}

export function createO3SkillSelectionEvidence(raw: O3SkillSelectionInput): O3SkillSelectionEvidence {
  const input = normalizeSelection(raw)
  const identity = skillIdentity(input.packageEvidence.evidenceIdentity, input.governanceEvidence.governanceEvidenceIdentity)
  const descriptionIdentity = input.packageEvidence.descriptionEvidence.sha256
  const descriptionByteLength = input.packageEvidence.descriptionEvidence.byteLength
  const metadataDisclosureIdentity = domainDigest("KODAC-O3-METADATA-DISCLOSURE-V1", {
    skillIdentity: identity,
    packageEvidenceIdentity: input.packageEvidence.evidenceIdentity,
    governanceEvidenceIdentity: input.governanceEvidence.governanceEvidenceIdentity,
    name: input.packageEvidence.name,
    descriptionIdentity,
    descriptionByteLength,
  })
  const core = {
    version: O3_PROGRESSIVE_SKILL_TRUST_GATE_VERSION,
    skillIdentity: identity,
    packageEvidenceIdentity: input.packageEvidence.evidenceIdentity,
    governanceEvidenceIdentity: input.governanceEvidence.governanceEvidenceIdentity,
    packageManifestIdentity: input.packageEvidence.packageManifestEvidence.sha256,
    sourceProvenanceIdentity: input.packageEvidence.sourceProvenanceIdentity,
    packageBindingState: input.packageEvidence.bindingState,
    governanceTrustStatus: K4_R5_AGENT_SKILL_GOVERNANCE_TRUST_STATUS,
    governanceAuthorityState: K4_R5_AGENT_SKILL_GOVERNANCE_AUTHORITY_STATE,
    sourceClass: input.sourceClass,
    sourceClassificationEvidenceIdentities: input.sourceClassificationEvidenceIdentities,
    name: input.packageEvidence.name,
    descriptionIdentity,
    descriptionByteLength,
    metadataDisclosureIdentity,
    selectionDecision: input.selectionDecision,
    selectionEvidenceIdentities: input.selectionEvidenceIdentities,
    workflowRunIdentity: input.workflowRunIdentity,
    subjectRepositoryIdentity: input.subjectRepositoryIdentity,
    canonicalBase: input.canonicalBase,
    subjectRevisionIdentity: input.subjectRevisionIdentity,
  }
  return deepFreeze({ ...core, selectionIdentity: domainDigest("KODAC-O3-SKILL-SELECTION-V1", core) })
}

export function validateO3SkillSelectionEvidence(value: unknown, input: O3SkillSelectionInput): O3SkillSelectionEvidence {
  assertSafeJsonGraph(value, "selection evidence")
  ownDataRecord(value, SELECTION_OUTPUT_KEYS, "selection evidence")
  const expected = createO3SkillSelectionEvidence(input)
  if (canonicalJson(value) !== canonicalJson(expected)) fail("selection evidence does not match independently rederived evidence")
  return expected
}

function normalizeAdmission(raw: O3SkillAdmissionInput): Readonly<{
  selection: O3SkillSelectionEvidence
  admissionDecision: O3AdmissionDecision
  admissionPolicyIdentity: string
  admissionAuthorityIdentity: string
  admissionEvidenceIdentities: readonly string[]
}> {
  const input = ownDataRecord(raw, ADMISSION_INPUT_KEYS, "admission input")
  const selection = validateO3SkillSelectionEvidence(input.selectionEvidence, input.selectionInput as O3SkillSelectionInput)
  const admissionDecision = enumValue<O3AdmissionDecision>(input.admissionDecision, ADMISSION_DECISIONS, "admissionDecision")
  const admissionPolicyIdentity = sha256Identity(input.admissionPolicyIdentity, "admissionPolicyIdentity")
  const admissionAuthorityIdentity = sha256Identity(input.admissionAuthorityIdentity, "admissionAuthorityIdentity")
  const admissionEvidenceIdentities = evidenceIdentities(input.admissionEvidenceIdentities, "admissionEvidenceIdentities", O3_LIMITS.maxAdmissionEvidenceIdentities, admissionDecision !== "UNKNOWN")
  if (admissionDecision === "ADMITTED") {
    if (selection.selectionDecision !== "SELECTED") fail("ADMITTED requires SELECTED evidence")
    if (selection.packageBindingState !== "CURRENT") fail("ADMITTED requires CURRENT K4 package binding")
    if (!ALLOWED_ADMISSION_SOURCES.has(selection.sourceClass)) fail("candidate or external-reference skill cannot self-authorize ADMITTED state")
  }
  return deepFreeze({ selection, admissionDecision, admissionPolicyIdentity, admissionAuthorityIdentity, admissionEvidenceIdentities })
}

export function createO3SkillAdmissionEvidence(raw: O3SkillAdmissionInput): O3SkillAdmissionEvidence {
  const input = normalizeAdmission(raw)
  const core = {
    version: O3_PROGRESSIVE_SKILL_TRUST_GATE_VERSION,
    skillIdentity: input.selection.skillIdentity,
    selectionIdentity: input.selection.selectionIdentity,
    sourceClass: input.selection.sourceClass,
    packageBindingState: input.selection.packageBindingState,
    admissionDecision: input.admissionDecision,
    admissionPolicyIdentity: input.admissionPolicyIdentity,
    admissionAuthorityIdentity: input.admissionAuthorityIdentity,
    admissionEvidenceIdentities: input.admissionEvidenceIdentities,
    workflowRunIdentity: input.selection.workflowRunIdentity,
    subjectRepositoryIdentity: input.selection.subjectRepositoryIdentity,
    canonicalBase: input.selection.canonicalBase,
    subjectRevisionIdentity: input.selection.subjectRevisionIdentity,
  }
  return deepFreeze({ ...core, admissionIdentity: domainDigest("KODAC-O3-SKILL-ADMISSION-V1", core) })
}

export function validateO3SkillAdmissionEvidence(value: unknown, input: O3SkillAdmissionInput): O3SkillAdmissionEvidence {
  assertSafeJsonGraph(value, "admission evidence")
  ownDataRecord(value, ADMISSION_OUTPUT_KEYS, "admission evidence")
  const expected = createO3SkillAdmissionEvidence(input)
  if (canonicalJson(value) !== canonicalJson(expected)) fail("admission evidence does not match independently rederived evidence")
  return expected
}

function normalizeLoadDecision(raw: O3SkillLoadDecisionInput): Readonly<{ admission: O3SkillAdmissionEvidence }> {
  const input = ownDataRecord(raw, LOAD_DECISION_INPUT_KEYS, "load-decision input")
  const admission = validateO3SkillAdmissionEvidence(input.admissionEvidence, input.admissionInput as O3SkillAdmissionInput)
  return Object.freeze({ admission })
}

export function createO3SkillLoadDecisionEvidence(raw: O3SkillLoadDecisionInput): O3SkillLoadDecisionEvidence {
  const input = normalizeLoadDecision(raw)
  const loadDecision: O3LoadDecision = input.admission.admissionDecision === "ADMITTED"
    && input.admission.packageBindingState === "CURRENT"
    && ALLOWED_ADMISSION_SOURCES.has(input.admission.sourceClass)
    ? "ALLOW" : "BLOCK"
  const core = {
    version: O3_PROGRESSIVE_SKILL_TRUST_GATE_VERSION,
    skillIdentity: input.admission.skillIdentity,
    selectionIdentity: input.admission.selectionIdentity,
    admissionIdentity: input.admission.admissionIdentity,
    sourceClass: input.admission.sourceClass,
    packageBindingState: input.admission.packageBindingState,
    loadDecision,
    workflowRunIdentity: input.admission.workflowRunIdentity,
    subjectRepositoryIdentity: input.admission.subjectRepositoryIdentity,
    canonicalBase: input.admission.canonicalBase,
    subjectRevisionIdentity: input.admission.subjectRevisionIdentity,
  }
  return deepFreeze({ ...core, loadDecisionIdentity: domainDigest("KODAC-O3-SKILL-LOAD-DECISION-V1", core) })
}

export function validateO3SkillLoadDecisionEvidence(value: unknown, input: O3SkillLoadDecisionInput): O3SkillLoadDecisionEvidence {
  assertSafeJsonGraph(value, "load-decision evidence")
  ownDataRecord(value, LOAD_DECISION_OUTPUT_KEYS, "load-decision evidence")
  const expected = createO3SkillLoadDecisionEvidence(input)
  if (canonicalJson(value) !== canonicalJson(expected)) fail("load-decision evidence does not match independently rederived evidence")
  return expected
}

function loadedCore(raw: O3LoadedSkillInput): Omit<O3LoadedSkillEvidence, "loadedSkillEvidenceIdentity"> {
  const input = ownDataRecord(raw, LOADED_INPUT_KEYS, "loaded-skill input")
  const loadDecision = validateO3SkillLoadDecisionEvidence(input.loadDecisionEvidence, input.loadDecisionInput as O3SkillLoadDecisionInput)
  if (loadDecision.loadDecision !== "ALLOW") fail("loaded-skill evidence requires an exact ALLOW load decision")
  const loadDecisionInput = ownDataRecord(input.loadDecisionInput, LOAD_DECISION_INPUT_KEYS, "loaded-skill input.loadDecisionInput")
  const admissionInput = ownDataRecord(loadDecisionInput.admissionInput, ADMISSION_INPUT_KEYS, "loaded-skill admission input")
  const selection = validateO3SkillSelectionEvidence(
    ownDataRecord(admissionInput, ADMISSION_INPUT_KEYS, "loaded-skill admission input").selectionEvidence,
    admissionInput.selectionInput as O3SkillSelectionInput,
  )
  const admission = validateO3SkillAdmissionEvidence(loadDecisionInput.admissionEvidence, loadDecisionInput.admissionInput as O3SkillAdmissionInput)
  if (admission.admissionDecision !== "ADMITTED" || selection.selectionDecision !== "SELECTED" || selection.packageBindingState !== "CURRENT") fail("positive loaded-skill lineage is not admitted")
  if (!ALLOWED_ADMISSION_SOURCES.has(selection.sourceClass)) fail("positive loaded-skill lineage has an unadmitted source class")
  const skillFileContent = boundedText(input.skillFileContent, "skillFileContent", O3_LIMITS.maxSkillFileUtf8Bytes)
  const skillFileIdentity = textDigest(skillFileContent)
  const skillFileByteLength = Buffer.byteLength(skillFileContent, "utf8")
  const packageEvidence = validateAgentSkillPackageEvidence((admissionInput.selectionInput as O3SkillSelectionInput).packageEvidence)
  if (skillFileIdentity !== packageEvidence.skillFileEvidence.sha256) fail("skillFileContent SHA-256 does not match K4 skill-file evidence")
  if (skillFileByteLength !== packageEvidence.skillFileEvidence.byteLength) fail("skillFileContent byte length does not match K4 skill-file evidence")
  const loadEvidenceIdentities = evidenceIdentities(input.loadEvidenceIdentities, "loadEvidenceIdentities", O3_LIMITS.maxLoadEvidenceIdentities, true)
  return deepFreeze({
    version: O3_PROGRESSIVE_SKILL_TRUST_GATE_VERSION,
    skillIdentity: selection.skillIdentity,
    packageEvidenceIdentity: selection.packageEvidenceIdentity,
    governanceEvidenceIdentity: selection.governanceEvidenceIdentity,
    packageManifestIdentity: selection.packageManifestIdentity,
    sourceProvenanceIdentity: selection.sourceProvenanceIdentity,
    packageBindingState: "CURRENT" as const,
    governanceTrustStatus: K4_R5_AGENT_SKILL_GOVERNANCE_TRUST_STATUS,
    governanceAuthorityState: K4_R5_AGENT_SKILL_GOVERNANCE_AUTHORITY_STATE,
    sourceClass: selection.sourceClass as "CANONICAL_KODAC_SKILL" | "ADMITTED_REPOSITORY_SKILL",
    sourceClassificationEvidenceIdentities: Object.freeze([...selection.sourceClassificationEvidenceIdentities]),
    name: selection.name,
    descriptionIdentity: selection.descriptionIdentity,
    descriptionByteLength: selection.descriptionByteLength,
    metadataDisclosureIdentity: selection.metadataDisclosureIdentity,
    selectionDecision: "SELECTED" as const,
    selectionEvidenceIdentities: Object.freeze([...selection.selectionEvidenceIdentities]),
    selectionIdentity: selection.selectionIdentity,
    admissionDecision: "ADMITTED" as const,
    admissionPolicyIdentity: admission.admissionPolicyIdentity,
    admissionAuthorityIdentity: admission.admissionAuthorityIdentity,
    admissionEvidenceIdentities: Object.freeze([...admission.admissionEvidenceIdentities]),
    admissionIdentity: admission.admissionIdentity,
    loadDecision: "ALLOW" as const,
    loadDecisionIdentity: loadDecision.loadDecisionIdentity,
    skillFileIdentity,
    skillFileByteLength,
    loadEvidenceIdentities,
    workflowRunIdentity: selection.workflowRunIdentity,
    subjectRepositoryIdentity: selection.subjectRepositoryIdentity,
    canonicalBase: selection.canonicalBase,
    subjectRevisionIdentity: selection.subjectRevisionIdentity,
  })
}

export function createO3LoadedSkillEvidence(raw: O3LoadedSkillInput): O3LoadedSkillEvidence {
  const core = loadedCore(raw)
  return deepFreeze({ ...core, loadedSkillEvidenceIdentity: domainDigest("KODAC-O3-LOADED-SKILL-EVIDENCE-V1", core) })
}

export function validateO3LoadedSkillEvidence(value: unknown, input: O3LoadedSkillInput): O3LoadedSkillEvidence {
  assertSafeJsonGraph(value, "loaded-skill evidence")
  ownDataRecord(value, O3_LOADED_SKILL_EVIDENCE_KEYS, "loaded-skill evidence")
  const expected = createO3LoadedSkillEvidence(input)
  if (canonicalJson(value) !== canonicalJson(expected)) fail("loaded-skill evidence does not match independently rederived evidence")
  return expected
}
