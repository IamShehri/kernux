import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

import {
  validateP5EvidenceProvenanceBinding,
  type P5EvidenceProvenanceBinding,
} from "../verification/p5-evidence-provenance.ts"
import {
  validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding,
  type P7ExactTargetHeadCompleteReviewContextEvidenceBinding,
  type P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput,
} from "./p7-exact-target-head-complete-review-context-evidence-binding.ts"
import {
  validateP7SkillCoverageEvidenceBinding,
  type P7SkillCoverageEvidenceBinding,
  type P7SkillCoverageEvidenceBindingBuildInput,
} from "./p7-skill-coverage-evidence-binding.ts"

export const P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BINDING_VERSION =
  "p7-r27-provider-attempt-termination-evidence-binding-v1" as const
export const P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_STATE =
  "PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY" as const

export const P7_R27_TERMINATION_REASONS = [
  "COMPLETED",
  "TOKEN_LIMIT",
  "TOOL_LIMIT",
  "TIMEOUT",
  "CANCELLED",
  "PROVIDER_ERROR",
  "POLICY_STOP",
  "BUDGET_EXHAUSTED",
  "UNKNOWN",
] as const

export const P7_R27_OUTPUT_TRUNCATION_STATES = ["NOT_TRUNCATED", "TRUNCATED", "UNKNOWN"] as const
export const P7_R27_COMPLETION_STATES = ["CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION", "COMPLETION_DEBT"] as const

export const P7_R27_PROVIDER_ATTEMPT_LIMITS = Object.freeze({
  maxProvenanceEvidence: 32,
  maxRetryLineageEvidence: 32,
  maxJsonNodes: 524_288,
  maxJsonDepth: 128,
  maxArrayEntries: 65_536,
  maxObjectFields: 256,
  maxSingleStringBytes: 1_048_576,
  maxJsonStringBytes: 67_108_864,
})

export type P7ProviderAttemptTerminationReason = (typeof P7_R27_TERMINATION_REASONS)[number]
export type P7ProviderAttemptOutputTruncationState = (typeof P7_R27_OUTPUT_TRUNCATION_STATES)[number]
export type P7ProviderAttemptCompletionState = (typeof P7_R27_COMPLETION_STATES)[number]

export interface P7ProviderAttemptDescriptor {
  readonly attemptIdentity: string
  readonly providerIdentity: string
  readonly modelIdentity: string
  readonly configurationIdentity: string
  readonly promptPolicyIdentity: string
  readonly toolPolicyIdentity: string
  readonly startedAt: string
  readonly completedAt: string | null
  readonly terminationReason: P7ProviderAttemptTerminationReason
  readonly inputTokenOrBudgetEvidenceIdentity: string
  readonly outputTruncationState: P7ProviderAttemptOutputTruncationState
  readonly outputTruncationEvidenceIdentity: string
  readonly toolCallCount: number
  readonly retryLineageEvidenceIdentities: readonly string[]
}

export interface P7ProviderAttemptTerminationEvidenceBindingBuildInput {
  readonly sourceExactTargetHeadCompleteReviewContextEvidenceBinding: P7ExactTargetHeadCompleteReviewContextEvidenceBinding
  readonly sourceExactTargetHeadCompleteReviewContextEvidenceBindingInput: P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput
  readonly sourceSkillCoverageEvidenceBinding: P7SkillCoverageEvidenceBinding
  readonly sourceSkillCoverageEvidenceBindingInput: P7SkillCoverageEvidenceBindingBuildInput
  readonly provenanceEvidence: readonly P5EvidenceProvenanceBinding[]
  readonly attempt: P7ProviderAttemptDescriptor
}

export interface P7ProviderAttemptTerminationEvidenceBinding {
  readonly version: typeof P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BINDING_VERSION
  readonly evidenceIdentity: string
  readonly state: typeof P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_STATE
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly targetTree: string
  readonly changedPathSetIdentity: string
  readonly reviewUniverseIdentity: string
  readonly reviewContextEvidenceIdentity: string
  readonly reviewRunIdentity: string
  readonly skillCoverageEvidenceIdentity: string
  readonly provenanceEvidenceSetIdentity: string
  readonly attemptIdentity: string
  readonly providerIdentity: string
  readonly modelIdentity: string
  readonly configurationIdentity: string
  readonly promptPolicyIdentity: string
  readonly toolPolicyIdentity: string
  readonly startedAt: string
  readonly completedAt: string | null
  readonly terminationReason: P7ProviderAttemptTerminationReason
  readonly inputTokenOrBudgetEvidenceIdentity: string
  readonly outputTruncationState: P7ProviderAttemptOutputTruncationState
  readonly outputTruncationEvidenceIdentity: string
  readonly toolCallCount: number
  readonly retryLineageIdentity: string
  readonly completionDebtIdentity: string
  readonly completionState: P7ProviderAttemptCompletionState
}

type UnknownRecord = Record<string, unknown>
type EvidenceCore = Omit<P7ProviderAttemptTerminationEvidenceBinding, "evidenceIdentity">
type NormalizedInput = Readonly<{
  sourceExactTargetHeadCompleteReviewContextEvidenceBinding: P7ExactTargetHeadCompleteReviewContextEvidenceBinding
  sourceExactTargetHeadCompleteReviewContextEvidenceBindingInput: P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput
  sourceSkillCoverageEvidenceBinding: P7SkillCoverageEvidenceBinding
  sourceSkillCoverageEvidenceBindingInput: P7SkillCoverageEvidenceBindingBuildInput
  provenanceEvidence: readonly P5EvidenceProvenanceBinding[]
  attempt: P7ProviderAttemptDescriptor
}>

const SHA256 = /^[0-9a-f]{64}$/
const CANONICAL_TIMESTAMP = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/
const INPUT_KEYS = [
  "sourceExactTargetHeadCompleteReviewContextEvidenceBinding",
  "sourceExactTargetHeadCompleteReviewContextEvidenceBindingInput",
  "sourceSkillCoverageEvidenceBinding",
  "sourceSkillCoverageEvidenceBindingInput",
  "provenanceEvidence",
  "attempt",
] as const
const ATTEMPT_KEYS = [
  "attemptIdentity",
  "providerIdentity",
  "modelIdentity",
  "configurationIdentity",
  "promptPolicyIdentity",
  "toolPolicyIdentity",
  "startedAt",
  "completedAt",
  "terminationReason",
  "inputTokenOrBudgetEvidenceIdentity",
  "outputTruncationState",
  "outputTruncationEvidenceIdentity",
  "toolCallCount",
  "retryLineageEvidenceIdentities",
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
    if (nodes > P7_R27_PROVIDER_ATTEMPT_LIMITS.maxJsonNodes) fail(label, "exceeds the JSON node budget")
    if (current.depth > P7_R27_PROVIDER_ATTEMPT_LIMITS.maxJsonDepth) fail(label, "exceeds the JSON depth budget")

    const item = current.value
    if (item === null || typeof item === "boolean") continue
    if (typeof item === "string") {
      assertUnicodeScalars(item, current.label)
      const itemBytes = Buffer.byteLength(item, "utf8")
      if (itemBytes > P7_R27_PROVIDER_ATTEMPT_LIMITS.maxSingleStringBytes) {
        fail(current.label, "exceeds the per-string UTF-8 byte budget")
      }
      stringBytes += itemBytes
      if (stringBytes > P7_R27_PROVIDER_ATTEMPT_LIMITS.maxJsonStringBytes) fail(label, "exceeds the JSON string-byte budget")
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
      if (length > P7_R27_PROVIDER_ATTEMPT_LIMITS.maxArrayEntries) fail(current.label, "exceeds the array length budget")
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
    const objectKeys = Reflect.ownKeys(item)
    if (objectKeys.length > P7_R27_PROVIDER_ATTEMPT_LIMITS.maxObjectFields) fail(current.label, "exceeds the object field budget")
    for (const key of objectKeys) {
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
  const actualKeys = Reflect.ownKeys(value)
  const allowed = new Set<string>(keys)
  for (const key of actualKeys) {
    if (typeof key !== "string" || !allowed.has(key)) fail(label, "contains an unknown or symbol field")
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}.${key}`, "must be an enumerable data property")
    }
  }
  for (const key of keys) if (!Object.hasOwn(value, key)) fail(label, `is missing required field: ${key}`)
  return value as UnknownRecord
}

function denseArray(value: unknown, label: string, maxLength: number): readonly unknown[] {
  if (!Array.isArray(value) || nodeTypes.isProxy(value)) fail(label, "must be a non-Proxy array")
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(label, "must use the ordinary Array prototype")
  if (value.length > maxLength) fail(label, `must contain at most ${maxLength} entries`)
  const expected = new Set<string>(["length"])
  for (let index = 0; index < value.length; index += 1) expected.add(String(index))
  const keys = Reflect.ownKeys(value)
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

function timestamp(value: unknown, label: string): string {
  if (typeof value !== "string" || !CANONICAL_TIMESTAMP.test(value)) {
    fail(label, "must use canonical UTC timestamp grammar YYYY-MM-DDTHH:mm:ss.sssZ")
  }
  return value
}

function safeInteger(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0 || Object.is(value, -0)) {
    fail(label, "must be a non-negative safe integer")
  }
  return value
}

function sortedUniqueSha256Array(value: unknown, label: string, maxLength: number): readonly string[] {
  const identities = denseArray(value, label, maxLength).map((item, index) => sha256(item, `${label}[${index}]`))
  if (new Set(identities).size !== identities.length) fail(label, "must not contain duplicate identities")
  return Object.freeze([...identities].sort(compareStrings))
}

function normalizeAttempt(value: unknown): P7ProviderAttemptDescriptor {
  const record = ownDataRecord(value, ATTEMPT_KEYS, "input.attempt")
  const startedAt = timestamp(record.startedAt, "input.attempt.startedAt")
  const completedAt = record.completedAt === null ? null : timestamp(record.completedAt, "input.attempt.completedAt")
  if (completedAt !== null && completedAt < startedAt) {
    fail("input.attempt.completedAt", "must not precede startedAt")
  }
  const terminationReason = oneOf(record.terminationReason, P7_R27_TERMINATION_REASONS, "input.attempt.terminationReason")
  const outputTruncationState = oneOf(
    record.outputTruncationState,
    P7_R27_OUTPUT_TRUNCATION_STATES,
    "input.attempt.outputTruncationState",
  )
  if (terminationReason === "COMPLETED") {
    if (completedAt === null) fail("input.attempt.completedAt", "is required when terminationReason is COMPLETED")
    if (outputTruncationState !== "NOT_TRUNCATED") {
      fail("input.attempt.outputTruncationState", "must be NOT_TRUNCATED when terminationReason is COMPLETED")
    }
  }

  return deepFreeze({
    attemptIdentity: sha256(record.attemptIdentity, "input.attempt.attemptIdentity"),
    providerIdentity: sha256(record.providerIdentity, "input.attempt.providerIdentity"),
    modelIdentity: sha256(record.modelIdentity, "input.attempt.modelIdentity"),
    configurationIdentity: sha256(record.configurationIdentity, "input.attempt.configurationIdentity"),
    promptPolicyIdentity: sha256(record.promptPolicyIdentity, "input.attempt.promptPolicyIdentity"),
    toolPolicyIdentity: sha256(record.toolPolicyIdentity, "input.attempt.toolPolicyIdentity"),
    startedAt,
    completedAt,
    terminationReason,
    inputTokenOrBudgetEvidenceIdentity: sha256(
      record.inputTokenOrBudgetEvidenceIdentity,
      "input.attempt.inputTokenOrBudgetEvidenceIdentity",
    ),
    outputTruncationState,
    outputTruncationEvidenceIdentity: sha256(
      record.outputTruncationEvidenceIdentity,
      "input.attempt.outputTruncationEvidenceIdentity",
    ),
    toolCallCount: safeInteger(record.toolCallCount, "input.attempt.toolCallCount"),
    retryLineageEvidenceIdentities: sortedUniqueSha256Array(
      record.retryLineageEvidenceIdentities,
      "input.attempt.retryLineageEvidenceIdentities",
      P7_R27_PROVIDER_ATTEMPT_LIMITS.maxRetryLineageEvidence,
    ),
  })
}

function normalizeInput(rawInput: P7ProviderAttemptTerminationEvidenceBindingBuildInput): NormalizedInput {
  const snapshot = snapshotJsonData(rawInput, "P7-R27 build input")
  const record = ownDataRecord(snapshot, INPUT_KEYS, "input")
  const provenanceValues = denseArray(
    record.provenanceEvidence,
    "input.provenanceEvidence",
    P7_R27_PROVIDER_ATTEMPT_LIMITS.maxProvenanceEvidence,
  )
  const provenanceEvidence = provenanceValues.map((value) => validateP5EvidenceProvenanceBinding(value))
  const provenanceIdentities = provenanceEvidence.map((item) => item.bindingIdentity)
  if (new Set(provenanceIdentities).size !== provenanceIdentities.length) {
    fail("input.provenanceEvidence", "must not contain duplicate binding identities")
  }
  provenanceEvidence.sort((left, right) => compareStrings(left.bindingIdentity, right.bindingIdentity))

  return Object.freeze({
    sourceExactTargetHeadCompleteReviewContextEvidenceBinding:
      record.sourceExactTargetHeadCompleteReviewContextEvidenceBinding as P7ExactTargetHeadCompleteReviewContextEvidenceBinding,
    sourceExactTargetHeadCompleteReviewContextEvidenceBindingInput:
      record.sourceExactTargetHeadCompleteReviewContextEvidenceBindingInput as P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput,
    sourceSkillCoverageEvidenceBinding: record.sourceSkillCoverageEvidenceBinding as P7SkillCoverageEvidenceBinding,
    sourceSkillCoverageEvidenceBindingInput:
      record.sourceSkillCoverageEvidenceBindingInput as P7SkillCoverageEvidenceBindingBuildInput,
    provenanceEvidence: Object.freeze([...provenanceEvidence]),
    attempt: normalizeAttempt(record.attempt),
  })
}

export async function buildP7ProviderAttemptTerminationEvidenceBinding(
  rawInput: P7ProviderAttemptTerminationEvidenceBindingBuildInput,
): Promise<P7ProviderAttemptTerminationEvidenceBinding> {
  const input = normalizeInput(rawInput)
  const reviewContext = await validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding(
    input.sourceExactTargetHeadCompleteReviewContextEvidenceBinding,
    input.sourceExactTargetHeadCompleteReviewContextEvidenceBindingInput,
  )
  const skillCoverage = validateP7SkillCoverageEvidenceBinding(
    input.sourceSkillCoverageEvidenceBinding,
    input.sourceSkillCoverageEvidenceBindingInput,
  )

  if (reviewContext.p7RepositoryIdentity !== skillCoverage.repositoryIdentity) {
    fail("P7-R22/P7-R26 repositoryIdentity", "must match exactly")
  }
  if (reviewContext.canonicalBase !== skillCoverage.canonicalBase) {
    fail("P7-R22/P7-R26 canonicalBase", "must match exactly")
  }
  if (reviewContext.targetHead !== skillCoverage.targetHead) {
    fail("P7-R22/P7-R26 targetHead", "must match exactly")
  }

  for (let index = 0; index < input.provenanceEvidence.length; index += 1) {
    const provenance = input.provenanceEvidence[index]!
    if (provenance.revision.repositoryId !== skillCoverage.repositoryIdentity) {
      fail(`input.provenanceEvidence[${index}].revision.repositoryId`, "must match the validated R22/R26 repository identity")
    }
    if (provenance.revision.canonicalBase !== skillCoverage.canonicalBase) {
      fail(`input.provenanceEvidence[${index}].revision.canonicalBase`, "must match the validated R22/R26 canonical base")
    }
    if (provenance.revision.candidateHead !== skillCoverage.targetHead) {
      fail(`input.provenanceEvidence[${index}].revision.candidateHead`, "must match the validated R22/R26 target head")
    }
  }

  const provenanceEvidenceSetIdentity = hashCanonical(input.provenanceEvidence.map((item) => item.bindingIdentity))
  const retryLineageIdentity = hashCanonical([...input.attempt.retryLineageEvidenceIdentities])
  const completionState: P7ProviderAttemptCompletionState = input.attempt.terminationReason === "COMPLETED"
    ? "CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION"
    : "COMPLETION_DEBT"
  const completionDebtIdentity = hashCanonical({
    terminationReason: input.attempt.terminationReason,
    startedAt: input.attempt.startedAt,
    completedAt: input.attempt.completedAt,
    inputTokenOrBudgetEvidenceIdentity: input.attempt.inputTokenOrBudgetEvidenceIdentity,
    outputTruncationState: input.attempt.outputTruncationState,
    outputTruncationEvidenceIdentity: input.attempt.outputTruncationEvidenceIdentity,
    toolCallCount: input.attempt.toolCallCount,
    retryLineageIdentity,
    completionState,
  })

  const core: EvidenceCore = {
    version: P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BINDING_VERSION,
    state: P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_STATE,
    repositoryIdentity: skillCoverage.repositoryIdentity,
    canonicalBase: skillCoverage.canonicalBase,
    targetHead: skillCoverage.targetHead,
    targetTree: skillCoverage.targetTree,
    changedPathSetIdentity: skillCoverage.changedPathSetIdentity,
    reviewUniverseIdentity: skillCoverage.reviewUniverseIdentity,
    reviewContextEvidenceIdentity: reviewContext.evidenceIdentity,
    reviewRunIdentity: reviewContext.reviewRunIdentity,
    skillCoverageEvidenceIdentity: skillCoverage.evidenceIdentity,
    provenanceEvidenceSetIdentity,
    attemptIdentity: input.attempt.attemptIdentity,
    providerIdentity: input.attempt.providerIdentity,
    modelIdentity: input.attempt.modelIdentity,
    configurationIdentity: input.attempt.configurationIdentity,
    promptPolicyIdentity: input.attempt.promptPolicyIdentity,
    toolPolicyIdentity: input.attempt.toolPolicyIdentity,
    startedAt: input.attempt.startedAt,
    completedAt: input.attempt.completedAt,
    terminationReason: input.attempt.terminationReason,
    inputTokenOrBudgetEvidenceIdentity: input.attempt.inputTokenOrBudgetEvidenceIdentity,
    outputTruncationState: input.attempt.outputTruncationState,
    outputTruncationEvidenceIdentity: input.attempt.outputTruncationEvidenceIdentity,
    toolCallCount: input.attempt.toolCallCount,
    retryLineageIdentity,
    completionDebtIdentity,
    completionState,
  }
  return deepFreeze({ ...core, evidenceIdentity: hashCanonical(core) })
}

export async function validateP7ProviderAttemptTerminationEvidenceBinding(
  value: unknown,
  input: P7ProviderAttemptTerminationEvidenceBindingBuildInput,
): Promise<P7ProviderAttemptTerminationEvidenceBinding> {
  const actual = snapshotJsonData(value, "P7-R27 evidence")
  const expected = await buildP7ProviderAttemptTerminationEvidenceBinding(input)
  if (canonicalJson(actual) !== canonicalJson(expected)) {
    fail("P7-R27 evidence", "does not match the canonical result for the supplied exact lineage and attempt input")
  }
  return expected
}
