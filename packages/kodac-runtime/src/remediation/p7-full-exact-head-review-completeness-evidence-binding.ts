import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

import { buildContextBundle } from "../context-engine/context-engine.ts"
import {
  validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding,
  type P7ExactTargetHeadCompleteReviewContextEvidenceBinding,
} from "./p7-exact-target-head-complete-review-context-evidence-binding.ts"
import {
  validateP7ReviewCoverageUniverseEvidenceBinding,
  type P7ReviewCoveragePathDescriptor,
} from "./p7-review-coverage-universe-evidence-binding.ts"
import { validateP7DeterministicSecurityPrescanEvidenceBinding } from "./p7-deterministic-security-prescan-evidence-binding.ts"
import { validateP7RiskCoverageEvidenceBinding } from "./p7-risk-coverage-evidence-binding.ts"
import { validateP7SkillCoverageEvidenceBinding } from "./p7-skill-coverage-evidence-binding.ts"
import {
  validateP7ProviderAttemptTerminationEvidenceBinding,
  type P7ProviderAttemptTerminationEvidenceBinding,
  type P7ProviderAttemptTerminationEvidenceBindingBuildInput,
  type P7ProviderAttemptCompletionState,
} from "./p7-provider-attempt-termination-evidence-binding.ts"

export const P7_R28_FULL_EXACT_HEAD_REVIEW_COMPLETENESS_EVIDENCE_BINDING_VERSION =
  "p7-r28-full-exact-head-review-completeness-evidence-binding-v1" as const
export const P7_R28_BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_STATE =
  "BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY" as const

export const P7_R28_PATH_REVIEW_DISPOSITIONS = ["REVIEWED_CONTEXT", "KNOWN_NONREVIEWABLE"] as const
export const P7_R28_PATH_REVIEW_METHODS = ["R22_COMPLETE_CONTEXT", "R23_KNOWN_DISPOSITION"] as const
export const P7_R28_UNREVIEWED_REASONS = [
  "NOT_APPLICABLE",
  "OPAQUE_BINARY",
  "UNREADABLE",
  "SIZE_LIMIT",
  "UNSUPPORTED_ENCODING",
  "POLICY_EXCLUDED",
  "REQUIRES_SPECIALIZED_SKILL",
  "REQUIRES_SANDBOX",
  "UNKNOWN",
] as const

export const P7_R28_COMPLETENESS_LIMITS = Object.freeze({
  maxPaths: 64,
  maxEvidenceIdentitiesPerPath: 8,
  maxJsonNodes: 1_048_576,
  maxJsonDepth: 160,
  maxArrayEntries: 131_072,
  maxObjectFields: 512,
  maxSingleStringBytes: 1_048_576,
  maxJsonStringBytes: 134_217_728,
})

export type P7FullReviewPathDisposition = (typeof P7_R28_PATH_REVIEW_DISPOSITIONS)[number]
export type P7FullReviewMethod = (typeof P7_R28_PATH_REVIEW_METHODS)[number]
export type P7FullReviewUnreviewedReason = (typeof P7_R28_UNREVIEWED_REASONS)[number]

export interface P7FullReviewPathRecord {
  readonly path: string
  readonly disposition: P7FullReviewPathDisposition
  readonly unreviewedReason: P7FullReviewUnreviewedReason | null
  readonly reviewMethod: P7FullReviewMethod
  readonly reviewEvidenceIdentities: readonly string[]
}

export interface P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput {
  readonly sourceProviderAttemptTerminationEvidenceBinding: P7ProviderAttemptTerminationEvidenceBinding
  readonly sourceProviderAttemptTerminationEvidenceBindingInput: P7ProviderAttemptTerminationEvidenceBindingBuildInput
}

export interface P7FullExactHeadReviewCompletenessEvidenceBinding {
  readonly version: typeof P7_R28_FULL_EXACT_HEAD_REVIEW_COMPLETENESS_EVIDENCE_BINDING_VERSION
  readonly evidenceIdentity: string
  readonly state: typeof P7_R28_BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_STATE
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly targetTree: string
  readonly changedPathSetIdentity: string
  readonly reviewUniverseIdentity: string
  readonly reviewContextEvidenceIdentity: string
  readonly reviewRunIdentity: string
  readonly reviewCoverageUniverseEvidenceIdentity: string
  readonly securityPrescanEvidenceIdentity: string
  readonly riskCoverageEvidenceIdentity: string
  readonly skillCoverageEvidenceIdentity: string
  readonly providerAttemptTerminationEvidenceIdentity: string
  readonly reviewUniversePathSetIdentity: string
  readonly reviewedPathSetIdentity: string
  readonly unreviewedPathSetIdentity: string
  readonly pathCoverageDebtIdentity: string
  readonly riskCoverageDebtIdentity: string
  readonly skillCoverageDebtIdentity: string
  readonly providerCompletionDebtIdentity: string
  readonly compositeCompletenessDebtIdentity: string
  readonly reviewedPathCount: number
  readonly unreviewedPathCount: number
  readonly knownNonreviewablePathCount: number
  readonly unknownCoveragePathCount: 0
  readonly riskCoverageState: "ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN"
  readonly skillCoverageState: "ACCOUNTED_NO_COVERAGE_DEBT"
  readonly providerCompletionState: "CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION"
  readonly reviewedPaths: readonly string[]
  readonly unreviewedPaths: readonly string[]
  readonly pathReviewRecords: readonly P7FullReviewPathRecord[]
}

type UnknownRecord = Record<string, unknown>
type EvidenceCore = Omit<P7FullExactHeadReviewCompletenessEvidenceBinding, "evidenceIdentity">
type NormalizedInput = Readonly<P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput>

const SHA256 = /^[0-9a-f]{64}$/
const INPUT_KEYS = [
  "sourceProviderAttemptTerminationEvidenceBinding",
  "sourceProviderAttemptTerminationEvidenceBindingInput",
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
  let aggregateStringBytes = 0

  while (stack.length > 0) {
    const current = stack.pop()!
    nodes += 1
    if (nodes > P7_R28_COMPLETENESS_LIMITS.maxJsonNodes) fail(label, "exceeds the JSON node budget")
    if (current.depth > P7_R28_COMPLETENESS_LIMITS.maxJsonDepth) fail(label, "exceeds the JSON depth budget")

    const item = current.value
    if (item === null || typeof item === "boolean") continue
    if (typeof item === "string") {
      assertUnicodeScalars(item, current.label)
      const bytes = Buffer.byteLength(item, "utf8")
      if (bytes > P7_R28_COMPLETENESS_LIMITS.maxSingleStringBytes) fail(current.label, "exceeds the per-string UTF-8 byte budget")
      aggregateStringBytes += bytes
      if (aggregateStringBytes > P7_R28_COMPLETENESS_LIMITS.maxJsonStringBytes) fail(label, "exceeds the JSON string-byte budget")
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
      if (length > P7_R28_COMPLETENESS_LIMITS.maxArrayEntries) fail(current.label, "exceeds the array length budget")
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
    const keys = Reflect.ownKeys(item)
    if (keys.length > P7_R28_COMPLETENESS_LIMITS.maxObjectFields) fail(current.label, "exceeds the object field budget")
    for (const key of keys) {
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

function ownDataRecord(value: unknown, keys: readonly string[], label: string): UnknownRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value) || nodeTypes.isProxy(value)) {
    fail(label, "must be a plain non-Proxy object")
  }
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(label, "must use a plain object prototype")
  const actual = Reflect.ownKeys(value)
  const allowed = new Set<string>(keys)
  for (const key of actual) {
    if (typeof key !== "string" || !allowed.has(key)) fail(label, "contains an unknown or symbol field")
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}.${key}`, "must be an enumerable data property")
    }
  }
  for (const key of keys) if (!Object.hasOwn(value, key)) fail(label, `is missing required field: ${key}`)
  return value as UnknownRecord
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

function assertSha256(value: string, label: string): void {
  if (!SHA256.test(value)) fail(label, "must be a lowercase SHA-256 digest")
}

function normalizeInput(rawInput: P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput): NormalizedInput {
  const snapshot = snapshotJsonData(rawInput, "P7-R28 build input")
  const record = ownDataRecord(snapshot, INPUT_KEYS, "input")
  return Object.freeze({
    sourceProviderAttemptTerminationEvidenceBinding:
      record.sourceProviderAttemptTerminationEvidenceBinding as P7ProviderAttemptTerminationEvidenceBinding,
    sourceProviderAttemptTerminationEvidenceBindingInput:
      record.sourceProviderAttemptTerminationEvidenceBindingInput as P7ProviderAttemptTerminationEvidenceBindingBuildInput,
  })
}

function assertLineage(label: string, expected: P7ProviderAttemptTerminationEvidenceBinding, actual: {
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly targetTree: string
  readonly changedPathSetIdentity: string
  readonly reviewUniverseIdentity: string
}): void {
  if (actual.repositoryIdentity !== expected.repositoryIdentity) fail(`${label}.repositoryIdentity`, "must match R27 exactly")
  if (actual.canonicalBase !== expected.canonicalBase) fail(`${label}.canonicalBase`, "must match R27 exactly")
  if (actual.targetHead !== expected.targetHead) fail(`${label}.targetHead`, "must match R27 exactly")
  if (actual.targetTree !== expected.targetTree) fail(`${label}.targetTree`, "must match R27 exactly")
  if (actual.changedPathSetIdentity !== expected.changedPathSetIdentity) fail(`${label}.changedPathSetIdentity`, "must match R27 exactly")
  if (actual.reviewUniverseIdentity !== expected.reviewUniverseIdentity) fail(`${label}.reviewUniverseIdentity`, "must match R27 exactly")
}

function unreviewedReason(descriptor: P7ReviewCoveragePathDescriptor): P7FullReviewUnreviewedReason {
  switch (descriptor.contentDisposition) {
    case "not_applicable_deleted": return "NOT_APPLICABLE"
    case "opaque_binary_or_compiled": return "OPAQUE_BINARY"
    case "unreadable": return "UNREADABLE"
    case "oversized": return "SIZE_LIMIT"
    case "unsupported_or_suspicious_encoding": return "UNSUPPORTED_ENCODING"
    case "policy_excluded": return "POLICY_EXCLUDED"
    case "referenced_hidden_payload": return "REQUIRES_SANDBOX"
    case "generated_or_derived": return "REQUIRES_SPECIALIZED_SKILL"
    case "git_lfs_pointer": return "REQUIRES_SPECIALIZED_SKILL"
    case "reviewable_text": return "UNKNOWN"
  }
}

function pathRecord(
  descriptor: P7ReviewCoveragePathDescriptor,
  reviewed: boolean,
  reviewContext: P7ExactTargetHeadCompleteReviewContextEvidenceBinding,
  reviewUniverseEvidenceIdentity: string,
): P7FullReviewPathRecord {
  if (reviewed) {
    return deepFreeze({
      path: descriptor.path,
      disposition: "REVIEWED_CONTEXT" as const,
      unreviewedReason: null,
      reviewMethod: "R22_COMPLETE_CONTEXT" as const,
      reviewEvidenceIdentities: Object.freeze([
        reviewContext.evidenceIdentity,
        reviewContext.reviewContextBundleIdentity,
      ].sort(compareStrings)),
    })
  }

  let reason = unreviewedReason(descriptor)
  if (reason === "UNKNOWN" && descriptor.objectKind === "symlink") reason = "REQUIRES_SANDBOX"
  if (reason === "UNKNOWN" && descriptor.objectKind === "submodule_gitlink") reason = "REQUIRES_SPECIALIZED_SKILL"
  if (reason === "UNKNOWN") fail(`path coverage ${descriptor.path}`, "has unknown review coverage and blocks bounded completeness proof")
  return deepFreeze({
    path: descriptor.path,
    disposition: "KNOWN_NONREVIEWABLE" as const,
    unreviewedReason: reason,
    reviewMethod: "R23_KNOWN_DISPOSITION" as const,
    reviewEvidenceIdentities: Object.freeze([reviewUniverseEvidenceIdentity]),
  })
}

function assertEmpty(values: readonly unknown[], label: string): void {
  if (values.length !== 0) fail(label, "must be empty before bounded completeness proof may issue")
}

export async function buildP7FullExactHeadReviewCompletenessEvidenceBinding(
  rawInput: P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput,
): Promise<P7FullExactHeadReviewCompletenessEvidenceBinding> {
  const input = normalizeInput(rawInput)
  const r27Input = input.sourceProviderAttemptTerminationEvidenceBindingInput
  const providerAttempt = await validateP7ProviderAttemptTerminationEvidenceBinding(
    input.sourceProviderAttemptTerminationEvidenceBinding,
    r27Input,
  )

  const reviewContext = await validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding(
    r27Input.sourceExactTargetHeadCompleteReviewContextEvidenceBinding,
    r27Input.sourceExactTargetHeadCompleteReviewContextEvidenceBindingInput,
  )
  const skillCoverageInput = r27Input.sourceSkillCoverageEvidenceBindingInput
  const skillCoverage = validateP7SkillCoverageEvidenceBinding(
    r27Input.sourceSkillCoverageEvidenceBinding,
    skillCoverageInput,
  )
  const riskCoverageInput = skillCoverageInput.riskCoverageBuildInput
  const riskCoverage = validateP7RiskCoverageEvidenceBinding(skillCoverageInput.riskCoverageEvidence, riskCoverageInput)
  const securityPrescanInput = riskCoverageInput.securityPrescanBuildInput
  const securityPrescan = validateP7DeterministicSecurityPrescanEvidenceBinding(
    riskCoverageInput.securityPrescanEvidence,
    securityPrescanInput,
  )
  const reviewUniverseInput = securityPrescanInput.reviewUniverseBuildInput
  const reviewUniverse = validateP7ReviewCoverageUniverseEvidenceBinding(
    securityPrescanInput.reviewUniverseEvidence,
    reviewUniverseInput,
  )

  assertLineage("R23", providerAttempt, reviewUniverse)
  assertLineage("R24", providerAttempt, securityPrescan)
  assertLineage("R25", providerAttempt, riskCoverage)
  assertLineage("R26", providerAttempt, skillCoverage)
  if (reviewContext.p7RepositoryIdentity !== providerAttempt.repositoryIdentity) fail("R22.repositoryIdentity", "must match R27 exactly")
  if (reviewContext.canonicalBase !== providerAttempt.canonicalBase) fail("R22.canonicalBase", "must match R27 exactly")
  if (reviewContext.targetHead !== providerAttempt.targetHead) fail("R22.targetHead", "must match R27 exactly")
  if (reviewContext.evidenceIdentity !== providerAttempt.reviewContextEvidenceIdentity) fail("R22.evidenceIdentity", "must match the R27 binding")
  if (reviewContext.reviewRunIdentity !== providerAttempt.reviewRunIdentity) fail("R22.reviewRunIdentity", "must match the R27 binding")
  if (reviewUniverse.evidenceIdentity !== securityPrescanInput.reviewUniverseEvidence.evidenceIdentity) fail("R23.evidenceIdentity", "must remain canonical")
  if (securityPrescan.evidenceIdentity !== riskCoverage.securityPrescanEvidenceIdentity) fail("R24.evidenceIdentity", "must match R25 exactly")
  if (riskCoverage.evidenceIdentity !== skillCoverage.riskCoverageEvidenceIdentity) fail("R25.evidenceIdentity", "must match R26 exactly")
  if (skillCoverage.evidenceIdentity !== providerAttempt.skillCoverageEvidenceIdentity) fail("R26.evidenceIdentity", "must match R27 exactly")

  if (reviewContext.contextFreshness !== "current") fail("R22.contextFreshness", "must be current")
  if (reviewContext.contextCompletenessState !== "complete") fail("R22.contextCompletenessState", "must be complete")
  assertEmpty(reviewContext.contextCompletenessReasons, "R22.contextCompletenessReasons")
  if (reviewContext.contextOmittedAtLeast !== 0) fail("R22.contextOmittedAtLeast", "must be zero")

  if (riskCoverage.riskCoverageState !== "ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN") {
    fail("R25.riskCoverageState", "must be ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN")
  }
  assertEmpty(riskCoverage.unknownApplicabilityRiskSet, "R25.unknownApplicabilityRiskSet")
  assertEmpty(riskCoverage.uncoveredRiskSet, "R25.uncoveredRiskSet")

  if (skillCoverage.skillCoverageState !== "ACCOUNTED_NO_COVERAGE_DEBT") {
    fail("R26.skillCoverageState", "must be ACCOUNTED_NO_COVERAGE_DEBT")
  }
  assertEmpty(skillCoverage.unknownAdmissionSkillSet, "R26.unknownAdmissionSkillSet")
  assertEmpty(skillCoverage.unknownRelevanceSkillSet, "R26.unknownRelevanceSkillSet")
  assertEmpty(skillCoverage.notAdmittedSkillSet, "R26.notAdmittedSkillSet")
  assertEmpty(skillCoverage.unavailableSkillSet, "R26.unavailableSkillSet")

  const requiredProviderCompletionState: P7ProviderAttemptCompletionState =
    "CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION"
  if (providerAttempt.terminationReason !== "COMPLETED") fail("R27.terminationReason", "must be COMPLETED")
  if (providerAttempt.completionState !== requiredProviderCompletionState) {
    fail("R27.completionState", "must be CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION")
  }
  if (providerAttempt.completedAt === null) fail("R27.completedAt", "must be present")
  if (providerAttempt.outputTruncationState !== "NOT_TRUNCATED") fail("R27.outputTruncationState", "must be NOT_TRUNCATED")

  const contextBundle = buildContextBundle(r27Input.sourceExactTargetHeadCompleteReviewContextEvidenceBindingInput.contextEngineInput)
  if (contextBundle.bundleIdentity !== reviewContext.reviewContextBundleIdentity) fail("R22.contextBundle", "must rebuild to the exact bound bundle")
  if (contextBundle.freshness !== "current") fail("R22.contextBundle.freshness", "must be current")
  if (contextBundle.completeness.state !== "complete") fail("R22.contextBundle.completeness.state", "must be complete")
  if (contextBundle.completeness.reasons.length !== 0 || contextBundle.completeness.omittedAtLeast !== 0) {
    fail("R22.contextBundle.completeness", "must have no omission or truncation debt")
  }

  const reviewUniversePaths = [...reviewUniverse.reviewUniversePaths].sort(compareStrings)
  if (reviewUniversePaths.length > P7_R28_COMPLETENESS_LIMITS.maxPaths) fail("R23.reviewUniversePaths", "exceeds the A6 path budget")
  if (new Set(reviewUniversePaths).size !== reviewUniversePaths.length) fail("R23.reviewUniversePaths", "must not contain duplicate paths")

  const contextSubjectPaths = new Set(contextBundle.items.map((item) => item.subjectPath))
  const reviewableTextPaths = new Set(reviewUniverse.reviewableTextPaths)
  const descriptors = [...reviewUniverseInput.changedPaths].sort((left, right) => compareStrings(left.path, right.path))
  const descriptorByPath = new Map(descriptors.map((descriptor) => [descriptor.path, descriptor] as const))
  if (descriptorByPath.size !== descriptors.length) fail("R23.changedPaths", "must not contain duplicate paths")

  const records: P7FullReviewPathRecord[] = []
  const reviewedPaths: string[] = []
  const unreviewedPaths: string[] = []
  const unknownCoveragePaths: string[] = []

  for (const path of reviewUniversePaths) {
    const descriptor = descriptorByPath.get(path)
    if (descriptor === undefined) fail(`R23.changedPaths.${path}`, "must have an exact descriptor")
    const isReviewableText = reviewableTextPaths.has(path)
    const reviewed = isReviewableText && contextSubjectPaths.has(path)
    if (isReviewableText && !reviewed) {
      unknownCoveragePaths.push(path)
      continue
    }
    const record = pathRecord(descriptor, reviewed, reviewContext, reviewUniverse.evidenceIdentity)
    records.push(record)
    if (record.disposition === "REVIEWED_CONTEXT") reviewedPaths.push(path)
    else unreviewedPaths.push(path)
  }

  if (unknownCoveragePaths.length !== 0) {
    fail("A6.unknownCoveragePaths", `must be empty; missing exact R22 context for: ${unknownCoveragePaths.sort(compareStrings).join(", ")}`)
  }
  if (records.length !== reviewUniversePaths.length) fail("A6.pathReviewRecords", "must account for the exact R23 universe")

  reviewedPaths.sort(compareStrings)
  unreviewedPaths.sort(compareStrings)
  records.sort((left, right) => compareStrings(left.path, right.path))

  const reviewUniversePathSetIdentity = hashCanonical(reviewUniversePaths)
  const reviewedPathSetIdentity = hashCanonical(reviewedPaths)
  const unreviewedPathSetIdentity = hashCanonical(unreviewedPaths)
  const pathCoverageDebtIdentity = hashCanonical({
    reviewUniversePathSetIdentity,
    reviewedPathSetIdentity,
    unreviewedPathSetIdentity,
    pathReviewRecords: records,
    unknownCoveragePaths: [],
  })
  const compositeCompletenessDebtIdentity = hashCanonical({
    pathCoverageDebtIdentity,
    riskCoverageDebtIdentity: riskCoverage.coverageDebtIdentity,
    skillCoverageDebtIdentity: skillCoverage.coverageDebtIdentity,
    providerCompletionDebtIdentity: providerAttempt.completionDebtIdentity,
    riskCoverageState: riskCoverage.riskCoverageState,
    skillCoverageState: skillCoverage.skillCoverageState,
    providerCompletionState: providerAttempt.completionState,
    unknownCoveragePathCount: 0,
  })

  for (const identity of [
    reviewUniversePathSetIdentity,
    reviewedPathSetIdentity,
    unreviewedPathSetIdentity,
    pathCoverageDebtIdentity,
    compositeCompletenessDebtIdentity,
  ]) assertSha256(identity, "A6 derived identity")

  const core: EvidenceCore = {
    version: P7_R28_FULL_EXACT_HEAD_REVIEW_COMPLETENESS_EVIDENCE_BINDING_VERSION,
    state: P7_R28_BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_STATE,
    repositoryIdentity: providerAttempt.repositoryIdentity,
    canonicalBase: providerAttempt.canonicalBase,
    targetHead: providerAttempt.targetHead,
    targetTree: providerAttempt.targetTree,
    changedPathSetIdentity: providerAttempt.changedPathSetIdentity,
    reviewUniverseIdentity: providerAttempt.reviewUniverseIdentity,
    reviewContextEvidenceIdentity: reviewContext.evidenceIdentity,
    reviewRunIdentity: reviewContext.reviewRunIdentity,
    reviewCoverageUniverseEvidenceIdentity: reviewUniverse.evidenceIdentity,
    securityPrescanEvidenceIdentity: securityPrescan.evidenceIdentity,
    riskCoverageEvidenceIdentity: riskCoverage.evidenceIdentity,
    skillCoverageEvidenceIdentity: skillCoverage.evidenceIdentity,
    providerAttemptTerminationEvidenceIdentity: providerAttempt.evidenceIdentity,
    reviewUniversePathSetIdentity,
    reviewedPathSetIdentity,
    unreviewedPathSetIdentity,
    pathCoverageDebtIdentity,
    riskCoverageDebtIdentity: riskCoverage.coverageDebtIdentity,
    skillCoverageDebtIdentity: skillCoverage.coverageDebtIdentity,
    providerCompletionDebtIdentity: providerAttempt.completionDebtIdentity,
    compositeCompletenessDebtIdentity,
    reviewedPathCount: reviewedPaths.length,
    unreviewedPathCount: unreviewedPaths.length,
    knownNonreviewablePathCount: unreviewedPaths.length,
    unknownCoveragePathCount: 0,
    riskCoverageState: "ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN",
    skillCoverageState: "ACCOUNTED_NO_COVERAGE_DEBT",
    providerCompletionState: "CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION",
    reviewedPaths: Object.freeze([...reviewedPaths]),
    unreviewedPaths: Object.freeze([...unreviewedPaths]),
    pathReviewRecords: Object.freeze(records.map((record) => deepFreeze({ ...record }))),
  }

  return deepFreeze({ ...core, evidenceIdentity: hashCanonical(core) })
}

export async function validateP7FullExactHeadReviewCompletenessEvidenceBinding(
  value: unknown,
  input: P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput,
): Promise<P7FullExactHeadReviewCompletenessEvidenceBinding> {
  const actual = snapshotJsonData(value, "P7-R28 evidence")
  const expected = await buildP7FullExactHeadReviewCompletenessEvidenceBinding(input)
  if (canonicalJson(actual) !== canonicalJson(expected)) {
    fail("P7-R28 evidence", "does not match the canonical bounded completeness result for the supplied exact lineage")
  }
  return expected
}
