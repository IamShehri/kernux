import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

import { ReviewerExecutionRuntime, validateReviewRunRecord } from "./executor.ts"
import type { ReviewerExecutionResult, ReviewerRunStatus } from "./provider-contracts.ts"

export const KRI_R3_REVIEW_TEMPORAL_EVIDENCE_VERSION = "kri-r3-review-temporal-evidence-v1" as const

export interface ReviewTemporalEvidence {
  readonly version: typeof KRI_R3_REVIEW_TEMPORAL_EVIDENCE_VERSION
  readonly temporalEvidenceIdentity: string
  readonly reviewRunIdentity: string
  readonly canonicalBase: string
  readonly reviewedHead: string
  readonly evaluatedHead: string
  readonly status: ReviewerRunStatus
  readonly startedAt: string
  readonly completedAt: string
}

export interface ReviewerExecutionTemporalResult {
  readonly result: ReviewerExecutionResult
  readonly temporalEvidence: ReviewTemporalEvidence
}

export type ReviewTemporalClock = () => string

type UnknownRecord = Record<string, unknown>
type TemporalCore = Omit<ReviewTemporalEvidence, "temporalEvidenceIdentity">

const SHA1 = /^[0-9a-f]{40}$/
const SHA256 = /^[0-9a-f]{64}$/
const CANONICAL_TIMESTAMP = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/
const OUTPUT_KEYS = [
  "version",
  "temporalEvidenceIdentity",
  "reviewRunIdentity",
  "canonicalBase",
  "reviewedHead",
  "evaluatedHead",
  "status",
  "startedAt",
  "completedAt",
] as const
const REVIEW_STATUSES = new Set<ReviewerRunStatus>([
  "COMPLETED",
  "STALE",
  "PROVIDER_FAILED",
  "TIMED_OUT",
  "INVALID_PROVIDER_OUTPUT",
])

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

function assertSafeFlatRecord(value: unknown, label: string): void {
  if (value === null || typeof value !== "object" || Array.isArray(value) || nodeTypes.isProxy(value)) {
    fail(label, "must be a non-Proxy plain object")
  }
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(label, "must be a plain object")
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string") fail(label, "must not contain symbol fields")
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}.${key}`, "must be an enumerable data property")
    }
    if (descriptor.value !== null && typeof descriptor.value === "object") {
      fail(`${label}.${key}`, "must not contain nested object values")
    }
  }
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    const encoded = JSON.stringify(value)
    if (encoded === undefined) fail("canonical JSON", "contains a non-JSON value")
    return encoded
  }
  const record = value as UnknownRecord
  const keys = Object.keys(record).sort(compareStrings)
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`
}

function sha1(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA1.test(value)) fail(label, "must be a lowercase 40-hex Git object")
  return value
}

function sha256(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) fail(label, "must be a lowercase SHA-256 digest")
  return value
}

function status(value: unknown, label: string): ReviewerRunStatus {
  if (typeof value !== "string" || !REVIEW_STATUSES.has(value as ReviewerRunStatus)) {
    fail(label, "must be a canonical reviewer-run status")
  }
  return value as ReviewerRunStatus
}

function timestamp(value: unknown, label: string): string {
  if (typeof value !== "string" || !CANONICAL_TIMESTAMP.test(value)) fail(label, "must be a canonical UTC timestamp")
  const milliseconds = Date.parse(value)
  if (!Number.isFinite(milliseconds) || new Date(milliseconds).toISOString() !== value) {
    fail(label, "must be a canonical UTC timestamp")
  }
  return value
}

function milliseconds(value: string): number {
  return Date.parse(value)
}

function temporalCore(value: unknown): TemporalCore {
  assertSafeFlatRecord(value, "review temporal evidence")
  const record = ownDataRecord(value, OUTPUT_KEYS, OUTPUT_KEYS, "review temporal evidence")
  if (record.version !== KRI_R3_REVIEW_TEMPORAL_EVIDENCE_VERSION) {
    fail("review temporal evidence.version", `must equal ${KRI_R3_REVIEW_TEMPORAL_EVIDENCE_VERSION}`)
  }
  const startedAt = timestamp(record.startedAt, "review temporal evidence.startedAt")
  const completedAt = timestamp(record.completedAt, "review temporal evidence.completedAt")
  if (milliseconds(completedAt) < milliseconds(startedAt)) {
    fail("review temporal evidence.completedAt", "must not precede startedAt")
  }
  return Object.freeze({
    version: KRI_R3_REVIEW_TEMPORAL_EVIDENCE_VERSION,
    reviewRunIdentity: sha256(record.reviewRunIdentity, "review temporal evidence.reviewRunIdentity"),
    canonicalBase: sha1(record.canonicalBase, "review temporal evidence.canonicalBase"),
    reviewedHead: sha1(record.reviewedHead, "review temporal evidence.reviewedHead"),
    evaluatedHead: sha1(record.evaluatedHead, "review temporal evidence.evaluatedHead"),
    status: status(record.status, "review temporal evidence.status"),
    startedAt,
    completedAt,
  })
}

function buildTemporalEvidence(core: TemporalCore): ReviewTemporalEvidence {
  return Object.freeze({ ...core, temporalEvidenceIdentity: hashText(canonicalJson(core)) })
}

function systemClock(): string {
  return new Date().toISOString()
}

export function validateReviewTemporalEvidence(value: unknown): ReviewTemporalEvidence {
  const core = temporalCore(value)
  const record = value as UnknownRecord
  const claimedIdentity = sha256(record.temporalEvidenceIdentity, "review temporal evidence.temporalEvidenceIdentity")
  const expected = buildTemporalEvidence(core)
  if (claimedIdentity !== expected.temporalEvidenceIdentity) {
    fail("review temporal evidence.temporalEvidenceIdentity", "does not match the canonical temporal preimage")
  }
  if (canonicalJson(record) !== canonicalJson(expected)) {
    fail("review temporal evidence", "does not match canonical temporal semantics")
  }
  return expected
}

export async function executeReviewWithTemporalEvidence(
  runtime: ReviewerExecutionRuntime,
  input: unknown,
  clock: ReviewTemporalClock = systemClock,
): Promise<ReviewerExecutionTemporalResult> {
  if (!(runtime instanceof ReviewerExecutionRuntime)) fail("review runtime", "must be a ReviewerExecutionRuntime instance")
  if (typeof clock !== "function") fail("review temporal clock", "must be a function")

  const startedAt = timestamp(clock(), "review temporal clock startedAt")
  const result = await runtime.execute(input)
  const completedAt = timestamp(clock(), "review temporal clock completedAt")
  if (milliseconds(completedAt) < milliseconds(startedAt)) {
    fail("review temporal clock completedAt", "must not precede startedAt")
  }

  const run = validateReviewRunRecord(result.run)
  const temporalEvidence = buildTemporalEvidence(Object.freeze({
    version: KRI_R3_REVIEW_TEMPORAL_EVIDENCE_VERSION,
    reviewRunIdentity: run.reviewRunIdentity,
    canonicalBase: run.canonicalBase,
    reviewedHead: run.reviewedHead,
    evaluatedHead: run.evaluatedHead,
    status: run.status,
    startedAt,
    completedAt,
  }))

  return Object.freeze({ result, temporalEvidence })
}
