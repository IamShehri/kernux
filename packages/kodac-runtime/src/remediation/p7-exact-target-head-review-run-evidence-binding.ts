import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

import { validateReviewRunRecord } from "../reviewer-intelligence/executor.ts"
import type { ReviewRunRecord } from "../reviewer-intelligence/provider-contracts.ts"
import {
  validateP7VerificationEngineCompletionEventEvidenceBinding,
  type P7VerificationEngineCompletionEventEvidenceBinding,
  type P7VerificationEngineCompletionEventEvidenceBindingBuildInput,
} from "./p7-verification-engine-completion-event-evidence-binding.ts"

export const P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BINDING_VERSION =
  "p7-r20-exact-target-head-review-run-evidence-binding-v1" as const
export const P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BOUND_STATE =
  "EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY" as const

export interface P7ExactTargetHeadReviewRunEvidenceBindingBuildInput {
  readonly sourceVerificationEngineCompletionEventEvidenceBinding: P7VerificationEngineCompletionEventEvidenceBinding
  readonly sourceVerificationEngineCompletionEventEvidenceBindingInput: P7VerificationEngineCompletionEventEvidenceBindingBuildInput
  readonly reviewRun: unknown
}

export interface P7ExactTargetHeadReviewRunEvidenceBinding {
  readonly version: typeof P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BINDING_VERSION
  readonly evidenceIdentity: string
  readonly state: typeof P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BOUND_STATE
  readonly sourceVerificationEngineCompletionEventEvidenceIdentity: string
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly verificationReportIdentity: string
  readonly verificationSessionId: string
  readonly reviewRunId: string
  readonly reviewRunIdentity: string
  readonly reviewProviderId: string
  readonly reviewProviderVersion: string
  readonly reviewPolicyIdentity: string
  readonly reviewContextBundleIdentity: string
  readonly reviewTaskId: string
  readonly reviewInstructionsIdentity: string
  readonly reviewStatus: "COMPLETED"
  readonly reviewedHead: string
  readonly evaluatedHead: string
  readonly acceptedClaimCount: 0
  readonly findingIdentities: readonly []
}

type UnknownRecord = Record<string, unknown>
type EvidenceCore = Omit<P7ExactTargetHeadReviewRunEvidenceBinding, "evidenceIdentity">

const SHA1 = /^[0-9a-f]{40}$/
const SHA256 = /^[0-9a-f]{64}$/
const MAX_JSON_NODES = 65_536
const MAX_JSON_DEPTH = 64

const BUILD_KEYS = [
  "sourceVerificationEngineCompletionEventEvidenceBinding",
  "sourceVerificationEngineCompletionEventEvidenceBindingInput",
  "reviewRun",
] as const

const OUTPUT_KEYS = [
  "version",
  "evidenceIdentity",
  "state",
  "sourceVerificationEngineCompletionEventEvidenceIdentity",
  "repositoryIdentity",
  "canonicalBase",
  "targetHead",
  "verificationReportIdentity",
  "verificationSessionId",
  "reviewRunId",
  "reviewRunIdentity",
  "reviewProviderId",
  "reviewProviderVersion",
  "reviewPolicyIdentity",
  "reviewContextBundleIdentity",
  "reviewTaskId",
  "reviewInstructionsIdentity",
  "reviewStatus",
  "reviewedHead",
  "evaluatedHead",
  "acceptedClaimCount",
  "findingIdentities",
] as const

function fail(label: string, detail: string): never {
  throw new TypeError(`${label} ${detail}`)
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function hashText(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex")
}

function ownDataRecord(
  value: unknown,
  allowedKeys: readonly string[],
  requiredKeys: readonly string[],
  label: string,
): UnknownRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value) || nodeTypes.isProxy(value)) {
    fail(label, "must be a non-Proxy plain object")
  }
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(label, "must be a plain object")
  const allowed = new Set(allowedKeys)
  const record: UnknownRecord = {}
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string") fail(label, "must not contain symbol fields")
    if (!allowed.has(key)) fail(label, `contains unknown field: ${key}`)
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}.${key}`, "must be an enumerable data property")
    }
    record[key] = descriptor.value
  }
  for (const key of requiredKeys) if (!Object.hasOwn(record, key)) fail(label, `is missing required field: ${key}`)
  return record
}

function denseArray(value: unknown, label: string): readonly unknown[] {
  if (!Array.isArray(value) || nodeTypes.isProxy(value)) fail(label, "must be a non-Proxy array")
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(label, "must use the ordinary Array prototype")
  const lengthDescriptor = Object.getOwnPropertyDescriptor(value, "length")
  if (
    lengthDescriptor === undefined ||
    !("value" in lengthDescriptor) ||
    !Number.isSafeInteger(lengthDescriptor.value) ||
    (lengthDescriptor.value as number) > MAX_JSON_NODES
  ) {
    fail(label, "must expose an ordinary bounded array length")
  }
  const length = lengthDescriptor.value as number
  const expected = new Set<string>(["length"])
  for (let index = 0; index < length; index += 1) expected.add(String(index))
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string" || !expected.has(key)) fail(label, "must not contain symbol, sparse, or extra array fields")
  }
  if (Reflect.ownKeys(value).length !== expected.size) fail(label, "must not contain sparse array slots")
  const result: unknown[] = []
  for (let index = 0; index < length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index))
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}[${index}]`, "must be an enumerable data property")
    }
    result.push(descriptor.value)
  }
  return result
}

function assertSafeJsonGraph(value: unknown, label: string): void {
  const stack: Array<{ readonly value: unknown; readonly label: string; readonly depth: number }> = [
    { value, label, depth: 0 },
  ]
  const seen = new Set<object>()
  let nodes = 0
  while (stack.length > 0) {
    const current = stack.pop()!
    nodes += 1
    if (nodes > MAX_JSON_NODES) fail(label, "exceeds the JSON node budget")
    if (current.depth > MAX_JSON_DEPTH) fail(label, "exceeds the JSON depth budget")
    const item = current.value
    if (item === null || typeof item === "boolean" || typeof item === "string") continue
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
      const values = denseArray(item, current.label)
      for (let index = values.length - 1; index >= 0; index -= 1) {
        stack.push({ value: values[index], label: `${current.label}[${index}]`, depth: current.depth + 1 })
      }
      continue
    }
    const prototype = Object.getPrototypeOf(item)
    if (prototype !== Object.prototype && prototype !== null) fail(current.label, "must contain only plain objects")
    for (const key of Reflect.ownKeys(item)) {
      if (typeof key !== "string") fail(current.label, "must not contain symbol fields")
      const descriptor = Object.getOwnPropertyDescriptor(item, key)
      if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
        fail(`${current.label}.${key}`, "must be an enumerable data property")
      }
      stack.push({ value: descriptor.value, label: `${current.label}.${key}`, depth: current.depth + 1 })
    }
  }
}

function sha256(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) fail(label, "must be a lowercase SHA-256 digest")
  return value
}

function sha1(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA1.test(value)) fail(label, "must be a lowercase 40-hex Git object")
  return value
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as UnknownRecord)) deepFreeze(child)
  }
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
  const keys = Object.keys(record).sort(compareStrings)
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`
}

function normalizedReviewRun(value: unknown): ReviewRunRecord {
  assertSafeJsonGraph(value, "reviewRun")
  return validateReviewRunRecord(value)
}

async function normalizedBuildCore(value: unknown): Promise<EvidenceCore> {
  assertSafeJsonGraph(value, "exact-target-head review-run evidence build input")
  const input = ownDataRecord(
    value,
    BUILD_KEYS,
    BUILD_KEYS,
    "exact-target-head review-run evidence build input",
  )

  // Snapshot the fully descriptor-checked JSON graph before the inherited R19 validator reaches
  // its asynchronous receipt-ledger read. This prevents caller mutation from changing either the
  // predecessor lineage or the review-run semantics while the canonical predecessor revalidation
  // is in flight.
  const snapshot = structuredClone(input) as UnknownRecord
  const source = await validateP7VerificationEngineCompletionEventEvidenceBinding(
    snapshot.sourceVerificationEngineCompletionEventEvidenceBinding,
    snapshot.sourceVerificationEngineCompletionEventEvidenceBindingInput as P7VerificationEngineCompletionEventEvidenceBindingBuildInput,
  )
  const reviewRun = normalizedReviewRun(snapshot.reviewRun)

  const canonicalBase = sha1(source.canonicalBase, "source canonicalBase")
  const targetHead = sha1(source.targetHead, "source targetHead")
  if (reviewRun.status !== "COMPLETED") fail("reviewRun.status", "must equal COMPLETED")
  if (reviewRun.failureCode !== null) fail("reviewRun.failureCode", "must be null")
  if (reviewRun.canonicalBase !== canonicalBase) fail("reviewRun.canonicalBase", "must match the exact P7-R19 canonicalBase")
  if (reviewRun.reviewedHead !== targetHead) fail("reviewRun.reviewedHead", "must match the exact P7-R19 targetHead")
  if (reviewRun.evaluatedHead !== targetHead) fail("reviewRun.evaluatedHead", "must match the exact P7-R19 targetHead")
  if (reviewRun.acceptedClaimCount !== 0) fail("reviewRun.acceptedClaimCount", "must equal zero")
  if (reviewRun.findingIdentities.length !== 0) fail("reviewRun.findingIdentities", "must be empty")

  return deepFreeze({
    version: P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BINDING_VERSION,
    state: P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BOUND_STATE,
    sourceVerificationEngineCompletionEventEvidenceIdentity: source.evidenceIdentity,
    repositoryIdentity: source.repositoryIdentity,
    canonicalBase,
    targetHead,
    verificationReportIdentity: source.verificationReportIdentity,
    verificationSessionId: source.verificationSessionId,
    reviewRunId: reviewRun.reviewRunId,
    reviewRunIdentity: reviewRun.reviewRunIdentity,
    reviewProviderId: reviewRun.providerId,
    reviewProviderVersion: reviewRun.providerVersion,
    reviewPolicyIdentity: reviewRun.policyIdentity,
    reviewContextBundleIdentity: reviewRun.contextBundleIdentity,
    reviewTaskId: reviewRun.taskId,
    reviewInstructionsIdentity: reviewRun.instructionsIdentity,
    reviewStatus: "COMPLETED" as const,
    reviewedHead: reviewRun.reviewedHead,
    evaluatedHead: reviewRun.evaluatedHead,
    acceptedClaimCount: 0 as const,
    findingIdentities: Object.freeze([]) as readonly [],
  })
}

function evidenceIdentity(core: EvidenceCore): string {
  return hashText(canonicalJson(core))
}

export async function buildP7ExactTargetHeadReviewRunEvidenceBinding(
  input: P7ExactTargetHeadReviewRunEvidenceBindingBuildInput,
): Promise<P7ExactTargetHeadReviewRunEvidenceBinding> {
  const core = await normalizedBuildCore(input)
  return deepFreeze({ ...core, evidenceIdentity: evidenceIdentity(core) })
}

export async function validateP7ExactTargetHeadReviewRunEvidenceBinding(
  value: unknown,
  input: P7ExactTargetHeadReviewRunEvidenceBindingBuildInput,
): Promise<P7ExactTargetHeadReviewRunEvidenceBinding> {
  assertSafeJsonGraph(value, "exact-target-head review-run evidence binding")
  const record = ownDataRecord(
    value,
    OUTPUT_KEYS,
    OUTPUT_KEYS,
    "exact-target-head review-run evidence binding",
  )
  const claimedIdentity = sha256(record.evidenceIdentity, "exact-target-head review-run evidence binding.evidenceIdentity")
  const expected = await buildP7ExactTargetHeadReviewRunEvidenceBinding(input)
  if (claimedIdentity !== expected.evidenceIdentity) {
    fail("exact-target-head review-run evidence binding.evidenceIdentity", "does not match the canonical source/review-run-derived preimage")
  }
  if (canonicalJson(record) !== canonicalJson(expected)) {
    fail("exact-target-head review-run evidence binding", "does not match canonical source/review-run-derived semantics")
  }
  return expected
}
