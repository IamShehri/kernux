import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

import {
  validateReviewTemporalEvidence,
  type ReviewTemporalEvidence,
} from "../reviewer-intelligence/temporal-evidence.ts"
import {
  P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BOUND_STATE,
  validateP7ExactTargetHeadReviewRunEvidenceBinding,
  type P7ExactTargetHeadReviewRunEvidenceBinding,
  type P7ExactTargetHeadReviewRunEvidenceBindingBuildInput,
} from "./p7-exact-target-head-review-run-evidence-binding.ts"

export const P7_R21_TEMPORAL_POST_VERIFICATION_REVIEW_EVIDENCE_BINDING_VERSION =
  "p7-r21-temporal-post-verification-review-evidence-binding-v1" as const
export const P7_R21_TEMPORAL_POST_VERIFICATION_REVIEW_EVIDENCE_BOUND_STATE =
  "TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY" as const

export interface P7TemporalPostVerificationReviewEvidenceBindingBuildInput {
  readonly sourceExactTargetHeadReviewRunEvidenceBinding: P7ExactTargetHeadReviewRunEvidenceBinding
  readonly sourceExactTargetHeadReviewRunEvidenceBindingInput: P7ExactTargetHeadReviewRunEvidenceBindingBuildInput
  readonly temporalEvidence: unknown
}

export interface P7TemporalPostVerificationReviewEvidenceBinding {
  readonly version: typeof P7_R21_TEMPORAL_POST_VERIFICATION_REVIEW_EVIDENCE_BINDING_VERSION
  readonly evidenceIdentity: string
  readonly state: typeof P7_R21_TEMPORAL_POST_VERIFICATION_REVIEW_EVIDENCE_BOUND_STATE
  readonly sourceExactTargetHeadReviewRunEvidenceIdentity: string
  readonly sourceVerificationEngineCompletionEventEvidenceIdentity: string
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly reviewRunIdentity: string
  readonly reviewStatus: "COMPLETED"
  readonly reviewedHead: string
  readonly evaluatedHead: string
  readonly verificationCompletedEventEmittedAt: string
  readonly reviewStartedAt: string
  readonly reviewCompletedAt: string
  readonly temporalEvidenceIdentity: string
}

type UnknownRecord = Record<string, unknown>
type EvidenceCore = Omit<P7TemporalPostVerificationReviewEvidenceBinding, "evidenceIdentity">

const SHA1 = /^[0-9a-f]{40}$/
const SHA256 = /^[0-9a-f]{64}$/
const CANONICAL_TIMESTAMP = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/
const MAX_JSON_NODES = 65_536
const MAX_JSON_DEPTH = 64

const BUILD_KEYS = [
  "sourceExactTargetHeadReviewRunEvidenceBinding",
  "sourceExactTargetHeadReviewRunEvidenceBindingInput",
  "temporalEvidence",
] as const

const OUTPUT_KEYS = [
  "version",
  "evidenceIdentity",
  "state",
  "sourceExactTargetHeadReviewRunEvidenceIdentity",
  "sourceVerificationEngineCompletionEventEvidenceIdentity",
  "repositoryIdentity",
  "canonicalBase",
  "targetHead",
  "reviewRunIdentity",
  "reviewStatus",
  "reviewedHead",
  "evaluatedHead",
  "verificationCompletedEventEmittedAt",
  "reviewStartedAt",
  "reviewCompletedAt",
  "temporalEvidenceIdentity",
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

function sha1(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA1.test(value)) fail(label, "must be a lowercase 40-hex Git object")
  return value
}

function sha256(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) fail(label, "must be a lowercase SHA-256 digest")
  return value
}

function timestamp(value: unknown, label: string): string {
  if (typeof value !== "string" || !CANONICAL_TIMESTAMP.test(value)) fail(label, "must be a canonical UTC timestamp")
  const milliseconds = Date.parse(value)
  if (!Number.isFinite(milliseconds) || new Date(milliseconds).toISOString() !== value) {
    fail(label, "must be a canonical UTC timestamp")
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

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as UnknownRecord)) deepFreeze(child)
  }
  return value
}

function milliseconds(value: string): number {
  return Date.parse(value)
}

async function normalizedBuildCore(value: unknown): Promise<EvidenceCore> {
  assertSafeJsonGraph(value, "temporal post-verification review evidence build input")
  const input = ownDataRecord(
    value,
    BUILD_KEYS,
    BUILD_KEYS,
    "temporal post-verification review evidence build input",
  )

  // Snapshot the complete descriptor-checked graph before inherited asynchronous validation reaches
  // the receipt-ledger read. R20 then revalidates the exact R19 lineage from this owned snapshot.
  const snapshot = structuredClone(input) as UnknownRecord
  const sourceInput = snapshot.sourceExactTargetHeadReviewRunEvidenceBindingInput as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput
  const source = await validateP7ExactTargetHeadReviewRunEvidenceBinding(
    snapshot.sourceExactTargetHeadReviewRunEvidenceBinding,
    sourceInput,
  )
  const temporal = validateReviewTemporalEvidence(snapshot.temporalEvidence) as ReviewTemporalEvidence

  if (source.state !== P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BOUND_STATE) {
    fail("sourceExactTargetHeadReviewRunEvidenceBinding.state", "must equal the canonical P7-R20 bounded state")
  }
  if (source.reviewStatus !== "COMPLETED") fail("source reviewStatus", "must equal COMPLETED")
  if (temporal.reviewRunIdentity !== source.reviewRunIdentity) {
    fail("temporalEvidence.reviewRunIdentity", "must match the exact P7-R20 reviewRunIdentity")
  }
  if (temporal.canonicalBase !== source.canonicalBase) {
    fail("temporalEvidence.canonicalBase", "must match the exact P7-R20 canonicalBase")
  }
  if (temporal.reviewedHead !== source.reviewedHead) {
    fail("temporalEvidence.reviewedHead", "must match the exact P7-R20 reviewedHead")
  }
  if (temporal.evaluatedHead !== source.evaluatedHead) {
    fail("temporalEvidence.evaluatedHead", "must match the exact P7-R20 evaluatedHead")
  }
  if (temporal.status !== source.reviewStatus) {
    fail("temporalEvidence.status", "must match the exact P7-R20 COMPLETED review status")
  }

  // The R20 validator above canonically revalidated this exact R19 source/build-input pair from
  // the owned snapshot. Reading the timestamp from that same snapshot avoids a second external
  // receipt-ledger read while preserving R19's validated temporal predecessor.
  const sourceR19 = sourceInput.sourceVerificationEngineCompletionEventEvidenceBinding
  const sourceR19Identity = sha256(
    sourceR19.evidenceIdentity,
    "source P7-R19 verification-completion evidenceIdentity",
  )
  if (sourceR19Identity !== source.sourceVerificationEngineCompletionEventEvidenceIdentity) {
    fail("source P7-R19 evidenceIdentity", "must match the exact P7-R20-bound predecessor identity")
  }
  const verificationCompletedEventEmittedAt = timestamp(
    sourceR19.verificationCompletedEventEmittedAt,
    "source P7-R19 verificationCompletedEventEmittedAt",
  )
  const reviewStartedAt = timestamp(temporal.startedAt, "temporalEvidence.startedAt")
  const reviewCompletedAt = timestamp(temporal.completedAt, "temporalEvidence.completedAt")
  if (milliseconds(reviewStartedAt) <= milliseconds(verificationCompletedEventEmittedAt)) {
    fail("temporalEvidence.startedAt", "must be strictly later than the exact P7-R19 verification completion event")
  }
  if (milliseconds(reviewCompletedAt) < milliseconds(reviewStartedAt)) {
    fail("temporalEvidence.completedAt", "must not precede startedAt")
  }

  return deepFreeze({
    version: P7_R21_TEMPORAL_POST_VERIFICATION_REVIEW_EVIDENCE_BINDING_VERSION,
    state: P7_R21_TEMPORAL_POST_VERIFICATION_REVIEW_EVIDENCE_BOUND_STATE,
    sourceExactTargetHeadReviewRunEvidenceIdentity: sha256(source.evidenceIdentity, "source P7-R20 evidenceIdentity"),
    sourceVerificationEngineCompletionEventEvidenceIdentity: sourceR19Identity,
    repositoryIdentity: source.repositoryIdentity,
    canonicalBase: sha1(source.canonicalBase, "source canonicalBase"),
    targetHead: sha1(source.targetHead, "source targetHead"),
    reviewRunIdentity: sha256(source.reviewRunIdentity, "source reviewRunIdentity"),
    reviewStatus: "COMPLETED" as const,
    reviewedHead: sha1(source.reviewedHead, "source reviewedHead"),
    evaluatedHead: sha1(source.evaluatedHead, "source evaluatedHead"),
    verificationCompletedEventEmittedAt,
    reviewStartedAt,
    reviewCompletedAt,
    temporalEvidenceIdentity: sha256(temporal.temporalEvidenceIdentity, "temporal evidence identity"),
  })
}

function evidenceIdentity(core: EvidenceCore): string {
  return hashText(canonicalJson(core))
}

export async function buildP7TemporalPostVerificationReviewEvidenceBinding(
  input: P7TemporalPostVerificationReviewEvidenceBindingBuildInput,
): Promise<P7TemporalPostVerificationReviewEvidenceBinding> {
  const core = await normalizedBuildCore(input)
  return deepFreeze({ ...core, evidenceIdentity: evidenceIdentity(core) })
}

export async function validateP7TemporalPostVerificationReviewEvidenceBinding(
  value: unknown,
  input: P7TemporalPostVerificationReviewEvidenceBindingBuildInput,
): Promise<P7TemporalPostVerificationReviewEvidenceBinding> {
  assertSafeJsonGraph(value, "temporal post-verification review evidence binding")
  const record = ownDataRecord(
    value,
    OUTPUT_KEYS,
    OUTPUT_KEYS,
    "temporal post-verification review evidence binding",
  )
  const snapshot = structuredClone(record) as UnknownRecord
  const claimedIdentity = sha256(
    snapshot.evidenceIdentity,
    "temporal post-verification review evidence binding.evidenceIdentity",
  )
  const expected = await buildP7TemporalPostVerificationReviewEvidenceBinding(input)
  if (claimedIdentity !== expected.evidenceIdentity) {
    fail(
      "temporal post-verification review evidence binding.evidenceIdentity",
      "does not match the canonical R20/temporal-derived preimage",
    )
  }
  if (canonicalJson(snapshot) !== canonicalJson(expected)) {
    fail(
      "temporal post-verification review evidence binding",
      "does not match canonical R20/temporal-derived semantics",
    )
  }
  return expected
}
