import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

import {
  validateP7VerificationEngineReceiptLedgerReadEvidenceBinding,
  type P7VerificationEngineReceiptLedgerReadEvidenceBinding,
  type P7VerificationEngineReceiptLedgerReadEvidenceBindingBuildInput,
} from "./p7-verification-engine-receipt-ledger-read-evidence-binding.ts"

export const P7_R19_VERIFICATION_ENGINE_COMPLETION_EVENT_EVIDENCE_BINDING_VERSION =
  "p7-r19-verification-engine-completion-event-evidence-binding-v1" as const
export const P7_R19_VERIFICATION_ENGINE_COMPLETION_EVENT_EVIDENCE_BOUND_STATE =
  "VERIFICATION_ENGINE_COMPLETION_EVENT_EVIDENCE_BOUND_ONLY" as const
export const P7_R19_EVENT_PROTOCOL = "kodac.event" as const
export const P7_R19_EVENT_VERSION = 1 as const
export const P7_R19_EVENT_TYPE = "verification.completed" as const

export interface P7VerificationEngineCompletionEventEvidenceBindingBuildInput {
  readonly sourceVerificationEngineReceiptLedgerReadEvidenceBinding: P7VerificationEngineReceiptLedgerReadEvidenceBinding
  readonly sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput: P7VerificationEngineReceiptLedgerReadEvidenceBindingBuildInput
  readonly verificationCompletedEvent: unknown
}

export interface P7VerificationEngineCompletionEventEvidenceBinding {
  readonly version: typeof P7_R19_VERIFICATION_ENGINE_COMPLETION_EVENT_EVIDENCE_BINDING_VERSION
  readonly evidenceIdentity: string
  readonly state: typeof P7_R19_VERIFICATION_ENGINE_COMPLETION_EVENT_EVIDENCE_BOUND_STATE
  readonly sourceVerificationEngineReceiptLedgerReadEvidenceIdentity: string
  readonly sourceReceiptLedgerFileReadEvidenceIdentity: string
  readonly sourceReceiptLedgerSnapshotEvidenceIdentity: string
  readonly sourceReceiptRecordSetEvidenceIdentity: string
  readonly sourcePolicyReportEvidenceIdentity: string
  readonly sourceReceiptReportEvidenceIdentity: string
  readonly sourceCommandSuccessEvidenceIdentity: string
  readonly sourceAppliedEvidenceIdentity: string
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly postStateDigest: string
  readonly verificationReportIdentity: string
  readonly verificationSessionId: string
  readonly verificationReportPassed: true
  readonly verificationReportCheckCount: number
  readonly verificationReportFailedCheckIds: readonly string[]
  readonly verificationReceiptLedgerReadEventIdentity: string
  readonly verificationReceiptLedgerReadEventSequence: number
  readonly verificationReceiptLedgerReadEventEmittedAt: string
  readonly verificationCompletedEventIdentity: string
  readonly verificationCompletedEventProtocol: typeof P7_R19_EVENT_PROTOCOL
  readonly verificationCompletedEventVersion: typeof P7_R19_EVENT_VERSION
  readonly verificationCompletedEventId: string
  readonly verificationCompletedEventSequence: number
  readonly verificationCompletedEventEmittedAt: string
  readonly verificationCompletedEventType: typeof P7_R19_EVENT_TYPE
  readonly verificationCompletedEventPassed: true
  readonly verificationCompletedEventCheckCount: number
  readonly verificationCompletedEventFailedCheckIds: readonly string[]
}

type UnknownRecord = Record<string, unknown>
type EvidenceCore = Omit<P7VerificationEngineCompletionEventEvidenceBinding, "evidenceIdentity">

type VerificationEvidenceKind = "receipt" | "artifact" | "event" | "workspace"
type VerificationCategory =
  | "agent"
  | "workspace"
  | "diff"
  | "receipts"
  | "policy"
  | "syntax"
  | "types"
  | "lint"
  | "tests"
  | "custom"
type VerificationStatus = "pass" | "fail"

type VerificationEvidenceProjection = Readonly<{
  kind: VerificationEvidenceKind
  ref: string
  digest?: string
}>
type VerificationCheckProjection = Readonly<{
  id: string
  category: VerificationCategory
  status: VerificationStatus
  summary: string
  evidence: readonly VerificationEvidenceProjection[]
}>
type VerificationReportProjection = Readonly<{
  protocol: "kodac.verification"
  version: 1
  sessionId: string
  startedAt: string
  completedAt: string
  passed: boolean
  checks: readonly VerificationCheckProjection[]
}>
type NormalizedCompletionEvent = Readonly<{
  protocol: typeof P7_R19_EVENT_PROTOCOL
  version: typeof P7_R19_EVENT_VERSION
  eventId: string
  sessionId: string
  sequence: number
  emittedAt: string
  type: typeof P7_R19_EVENT_TYPE
  payload: Readonly<{
    passed: true
    checks: number
    failed: readonly []
  }>
}>

const SHA256 = /^[0-9a-f]{64}$/
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const CANONICAL_TIMESTAMP = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/
const CHECK_ID = /^[a-z0-9][a-z0-9._-]{0,127}$/i
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u
const MAX_CHECKS = 512
const MAX_EVIDENCE_PER_CHECK = 256
const MAX_SESSION_ID_CODE_POINTS = 256
const MAX_SUMMARY_CODE_POINTS = 4_096
const MAX_EVIDENCE_REF_CODE_POINTS = 1_024
const MAX_JSON_NODES = 16_384
const MAX_JSON_DEPTH = 24

const CATEGORIES = new Set<VerificationCategory>([
  "agent", "workspace", "diff", "receipts", "policy", "syntax", "types", "lint", "tests", "custom",
])
const STATUSES = new Set<VerificationStatus>(["pass", "fail"])
const EVIDENCE_KINDS = new Set<VerificationEvidenceKind>(["receipt", "artifact", "event", "workspace"])
const BUILD_KEYS = [
  "sourceVerificationEngineReceiptLedgerReadEvidenceBinding",
  "sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput",
  "verificationCompletedEvent",
] as const
const EVENT_KEYS = ["protocol", "version", "eventId", "sessionId", "sequence", "emittedAt", "type", "payload"] as const
const PAYLOAD_KEYS = ["passed", "checks", "failed"] as const
const REPORT_KEYS = ["protocol", "version", "sessionId", "startedAt", "completedAt", "passed", "checks"] as const
const CHECK_KEYS = ["id", "category", "status", "summary", "evidence"] as const
const EVIDENCE_ALLOWED_KEYS = ["kind", "ref", "digest"] as const
const EVIDENCE_REQUIRED_KEYS = ["kind", "ref"] as const
const REPORT_BINDING_PATH = [
  "sourceReceiptLedgerFileReadEvidenceBindingInput",
  "sourceReceiptLedgerSnapshotEvidenceBindingInput",
  "sourceReceiptRecordSetEvidenceBindingInput",
  "sourcePolicyReportEvidenceBindingInput",
  "sourceReceiptReportEvidenceBindingInput",
  "sourceGitChangeReportEvidenceBindingInput",
  "sourceWorkspaceReferenceEvidenceBindingInput",
  "sourceAgentCompletionEvidenceBindingInput",
  "sourceCommandSuccessEvidenceBindingInput",
  "sourceVerificationReportBinding",
] as const
const OUTPUT_KEYS = [
  "version",
  "evidenceIdentity",
  "state",
  "sourceVerificationEngineReceiptLedgerReadEvidenceIdentity",
  "sourceReceiptLedgerFileReadEvidenceIdentity",
  "sourceReceiptLedgerSnapshotEvidenceIdentity",
  "sourceReceiptRecordSetEvidenceIdentity",
  "sourcePolicyReportEvidenceIdentity",
  "sourceReceiptReportEvidenceIdentity",
  "sourceCommandSuccessEvidenceIdentity",
  "sourceAppliedEvidenceIdentity",
  "repositoryIdentity",
  "canonicalBase",
  "targetHead",
  "postStateDigest",
  "verificationReportIdentity",
  "verificationSessionId",
  "verificationReportPassed",
  "verificationReportCheckCount",
  "verificationReportFailedCheckIds",
  "verificationReceiptLedgerReadEventIdentity",
  "verificationReceiptLedgerReadEventSequence",
  "verificationReceiptLedgerReadEventEmittedAt",
  "verificationCompletedEventIdentity",
  "verificationCompletedEventProtocol",
  "verificationCompletedEventVersion",
  "verificationCompletedEventId",
  "verificationCompletedEventSequence",
  "verificationCompletedEventEmittedAt",
  "verificationCompletedEventType",
  "verificationCompletedEventPassed",
  "verificationCompletedEventCheckCount",
  "verificationCompletedEventFailedCheckIds",
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

function codePointLength(value: string): number {
  let length = 0
  for (const _character of value) length += 1
  return length
}

function assertUnicodeScalars(value: string, label: string): void {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1)
      if (!(next >= 0xdc00 && next <= 0xdfff)) fail(label, "must contain only valid Unicode scalar values")
      index += 1
      continue
    }
    if (code >= 0xdc00 && code <= 0xdfff) fail(label, "must contain only valid Unicode scalar values")
  }
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

function ownDataProperty(value: unknown, key: string, label: string): unknown {
  if (value === null || typeof value !== "object" || Array.isArray(value) || nodeTypes.isProxy(value)) {
    fail(label, "must be a non-Proxy plain object")
  }
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(label, "must be a plain object")
  const descriptor = Object.getOwnPropertyDescriptor(value, key)
  if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
    fail(`${label}.${key}`, "must be an enumerable own data property")
  }
  return descriptor.value
}

function denseArray(value: unknown, label: string, maximum: number): readonly unknown[] {
  if (!Array.isArray(value) || nodeTypes.isProxy(value)) fail(label, "must be a non-Proxy array")
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(label, "must use the ordinary Array prototype")
  const lengthDescriptor = Object.getOwnPropertyDescriptor(value, "length")
  if (
    lengthDescriptor === undefined ||
    !("value" in lengthDescriptor) ||
    !Number.isSafeInteger(lengthDescriptor.value) ||
    (lengthDescriptor.value as number) > maximum
  ) {
    fail(label, `must expose an ordinary array length <= ${maximum}`)
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
    if (item === null || typeof item === "boolean") continue
    if (typeof item === "string") {
      assertUnicodeScalars(item, current.label)
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
      const values = denseArray(item, current.label, MAX_JSON_NODES)
      for (let index = values.length - 1; index >= 0; index -= 1) {
        stack.push({ value: values[index], label: `${current.label}[${index}]`, depth: current.depth + 1 })
      }
      continue
    }
    const prototype = Object.getPrototypeOf(item)
    if (prototype !== Object.prototype && prototype !== null) fail(current.label, "must contain only plain objects")
    for (const key of Reflect.ownKeys(item)) {
      if (typeof key !== "string") fail(current.label, "must not contain symbol fields")
      assertUnicodeScalars(key, `${current.label} key`)
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

function uuidV4(value: unknown, label: string): string {
  if (typeof value !== "string" || !UUID_V4.test(value)) fail(label, "must be a canonical lowercase UUID v4")
  return value
}

function boundedText(value: unknown, label: string, maximumCodePoints: number): string {
  if (typeof value !== "string") fail(label, "must be a string")
  assertUnicodeScalars(value, label)
  if (value.length === 0) fail(label, "must not be empty")
  if (codePointLength(value) > maximumCodePoints) fail(label, `exceeds ${maximumCodePoints} Unicode code points`)
  if (CONTROL_CHARACTERS.test(value)) fail(label, "must not contain control characters")
  return value
}

function canonicalTimestamp(value: unknown, label: string): string {
  if (typeof value !== "string") fail(label, "must be a string")
  assertUnicodeScalars(value, label)
  if (!CANONICAL_TIMESTAMP.test(value)) fail(label, "must be a canonical UTC millisecond timestamp")
  const epoch = Date.parse(value)
  if (!Number.isFinite(epoch) || new Date(epoch).toISOString() !== value) {
    fail(label, "must be a valid canonical UTC millisecond timestamp")
  }
  return value
}

function positiveSafeInteger(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1 || Object.is(value, -0)) {
    fail(label, "must be a safe integer >= 1")
  }
  return value
}

function normalizeVerificationEvidence(value: unknown, label: string): VerificationEvidenceProjection {
  const record = ownDataRecord(value, EVIDENCE_ALLOWED_KEYS, EVIDENCE_REQUIRED_KEYS, label)
  if (typeof record.kind !== "string" || !EVIDENCE_KINDS.has(record.kind as VerificationEvidenceKind)) {
    fail(`${label}.kind`, "is unsupported")
  }
  const normalized: { kind: VerificationEvidenceKind; ref: string; digest?: string } = {
    kind: record.kind as VerificationEvidenceKind,
    ref: boundedText(record.ref, `${label}.ref`, MAX_EVIDENCE_REF_CODE_POINTS),
  }
  if (Object.hasOwn(record, "digest")) normalized.digest = sha256(record.digest, `${label}.digest`)
  return Object.freeze(normalized)
}

function normalizeVerificationCheck(value: unknown, index: number): VerificationCheckProjection {
  const label = `source verification report.checks[${index}]`
  const record = ownDataRecord(value, CHECK_KEYS, CHECK_KEYS, label)
  const id = boundedText(record.id, `${label}.id`, 128)
  if (!CHECK_ID.test(id)) fail(`${label}.id`, "must match the canonical verification check id grammar")
  if (typeof record.category !== "string" || !CATEGORIES.has(record.category as VerificationCategory)) {
    fail(`${label}.category`, "is unsupported")
  }
  if (typeof record.status !== "string" || !STATUSES.has(record.status as VerificationStatus)) {
    fail(`${label}.status`, "is unsupported")
  }
  const evidence = denseArray(record.evidence, `${label}.evidence`, MAX_EVIDENCE_PER_CHECK)
    .map((item, evidenceIndex) => normalizeVerificationEvidence(item, `${label}.evidence[${evidenceIndex}]`))
  const evidenceKeys = evidence.map((item) => `${item.kind}\u0000${item.ref}\u0000${item.digest ?? ""}`)
  if (new Set(evidenceKeys).size !== evidenceKeys.length) fail(`${label}.evidence`, "must not contain duplicate evidence references")
  const orderedEvidence = [...evidence].sort((left, right) =>
    compareStrings(left.kind, right.kind) || compareStrings(left.ref, right.ref) || compareStrings(left.digest ?? "", right.digest ?? ""),
  )
  return Object.freeze({
    id,
    category: record.category as VerificationCategory,
    status: record.status as VerificationStatus,
    summary: boundedText(record.summary, `${label}.summary`, MAX_SUMMARY_CODE_POINTS),
    evidence: Object.freeze(orderedEvidence),
  })
}

function normalizeVerificationReport(value: unknown): VerificationReportProjection {
  assertSafeJsonGraph(value, "source verification report")
  const record = ownDataRecord(value, REPORT_KEYS, REPORT_KEYS, "source verification report")
  if (record.protocol !== "kodac.verification") fail("source verification report.protocol", "is unsupported")
  if (record.version !== 1) fail("source verification report.version", "is unsupported")
  const sessionId = boundedText(record.sessionId, "source verification report.sessionId", MAX_SESSION_ID_CODE_POINTS)
  const startedAt = canonicalTimestamp(record.startedAt, "source verification report.startedAt")
  const completedAt = canonicalTimestamp(record.completedAt, "source verification report.completedAt")
  if (Date.parse(completedAt) < Date.parse(startedAt)) {
    fail("source verification report.completedAt", "must not precede startedAt")
  }
  if (typeof record.passed !== "boolean") fail("source verification report.passed", "must be a boolean")
  const rawChecks = denseArray(record.checks, "source verification report.checks", MAX_CHECKS)
  if (rawChecks.length === 0) fail("source verification report.checks", "must contain at least one check")
  const checks = rawChecks.map((item, index) => normalizeVerificationCheck(item, index))
  const ids = checks.map((check) => check.id)
  if (new Set(ids).size !== ids.length) fail("source verification report.checks", "must not contain duplicate check ids")
  const orderedChecks = [...checks].sort((left, right) => compareStrings(left.id, right.id))
  return Object.freeze({
    protocol: "kodac.verification" as const,
    version: 1 as const,
    sessionId,
    startedAt,
    completedAt,
    passed: record.passed,
    checks: Object.freeze(orderedChecks),
  })
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

function currentVerificationReport(
  input: P7VerificationEngineReceiptLedgerReadEvidenceBindingBuildInput,
): VerificationReportProjection {
  let current: unknown = input
  let label = "sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput"
  for (const key of REPORT_BINDING_PATH) {
    current = ownDataProperty(current, key, label)
    label = `${label}.${key}`
  }
  const rawReport = ownDataProperty(current, "verificationReport", label)
  return normalizeVerificationReport(rawReport)
}

function normalizeCompletionEvent(
  value: unknown,
  source: P7VerificationEngineReceiptLedgerReadEvidenceBinding,
  report: VerificationReportProjection,
): NormalizedCompletionEvent {
  assertSafeJsonGraph(value, "verificationCompletedEvent")
  const record = ownDataRecord(value, EVENT_KEYS, EVENT_KEYS, "verificationCompletedEvent")
  if (record.protocol !== P7_R19_EVENT_PROTOCOL) fail("verificationCompletedEvent.protocol", "is unsupported")
  if (record.version !== P7_R19_EVENT_VERSION) fail("verificationCompletedEvent.version", "is unsupported")
  if (record.type !== P7_R19_EVENT_TYPE) fail("verificationCompletedEvent.type", "is unsupported")
  if (record.sessionId !== source.verificationSessionId) {
    fail("verificationCompletedEvent.sessionId", "must match the exact canonical verification session")
  }
  const eventId = uuidV4(record.eventId, "verificationCompletedEvent.eventId")
  const sequence = positiveSafeInteger(record.sequence, "verificationCompletedEvent.sequence")
  if (sequence <= source.verificationReceiptLedgerReadEventSequence) {
    fail("verificationCompletedEvent.sequence", "must be greater than the exact P7-R18 ledger-read event sequence")
  }
  const emittedAt = canonicalTimestamp(record.emittedAt, "verificationCompletedEvent.emittedAt")
  if (Date.parse(emittedAt) < Date.parse(report.completedAt)) {
    fail("verificationCompletedEvent.emittedAt", "must not precede the exact canonical verification report completion")
  }
  if (Date.parse(emittedAt) < Date.parse(source.verificationReceiptLedgerReadEventEmittedAt)) {
    fail("verificationCompletedEvent.emittedAt", "must not precede the exact P7-R18 ledger-read event")
  }
  const payload = ownDataRecord(record.payload, PAYLOAD_KEYS, PAYLOAD_KEYS, "verificationCompletedEvent.payload")
  if (payload.passed !== true) {
    fail("verificationCompletedEvent.payload.passed", "must equal true in the canonical P7-R8 all-pass predecessor domain")
  }
  const checks = positiveSafeInteger(payload.checks, "verificationCompletedEvent.payload.checks")
  if (checks !== report.checks.length) {
    fail("verificationCompletedEvent.payload.checks", "must match the exact canonical verification report check count")
  }
  const failed = denseArray(payload.failed, "verificationCompletedEvent.payload.failed", MAX_CHECKS)
  if (failed.length !== 0) {
    fail("verificationCompletedEvent.payload.failed", "must be empty in the canonical P7-R8 all-pass predecessor domain")
  }
  return deepFreeze({
    protocol: P7_R19_EVENT_PROTOCOL,
    version: P7_R19_EVENT_VERSION,
    eventId,
    sessionId: source.verificationSessionId,
    sequence,
    emittedAt,
    type: P7_R19_EVENT_TYPE,
    payload: deepFreeze({ passed: true as const, checks, failed: Object.freeze([]) as readonly [] }),
  })
}

async function normalizedBuildCore(value: unknown): Promise<EvidenceCore> {
  const input = ownDataRecord(
    value,
    BUILD_KEYS,
    BUILD_KEYS,
    "verification-engine completion-event evidence build input",
  )
  const sourceInput = input.sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput as P7VerificationEngineReceiptLedgerReadEvidenceBindingBuildInput
  const source = await validateP7VerificationEngineReceiptLedgerReadEvidenceBinding(
    input.sourceVerificationEngineReceiptLedgerReadEvidenceBinding,
    sourceInput,
  )

  // R18/R16 validation contains an asynchronous filesystem read. Re-read the exact nested
  // report through data descriptors only after that await, canonicalize it exactly as R6 does
  // for report identity, and bind the recomputed identity to the frozen R18 result. This closes
  // a mutable-caller TOCTOU window without a second filesystem read or a second R18 validation.
  const report = currentVerificationReport(sourceInput)
  const recomputedReportIdentity = hashText(JSON.stringify(report))
  if (recomputedReportIdentity !== source.verificationReportIdentity) {
    fail("source verification report", "identity changed after canonical P7-R18 validation")
  }
  if (report.sessionId !== source.verificationSessionId) {
    fail("source verification report", "session must match the exact P7-R18 lineage")
  }
  if (report.passed !== true || report.checks.some((candidate) => candidate.status !== "pass")) {
    fail("source verification report", "must be all-pass through the canonical P7-R8 predecessor")
  }

  const event = normalizeCompletionEvent(input.verificationCompletedEvent, source, report)
  const verificationCompletedEventIdentity = hashText(canonicalJson(event))

  return deepFreeze({
    version: P7_R19_VERIFICATION_ENGINE_COMPLETION_EVENT_EVIDENCE_BINDING_VERSION,
    state: P7_R19_VERIFICATION_ENGINE_COMPLETION_EVENT_EVIDENCE_BOUND_STATE,
    sourceVerificationEngineReceiptLedgerReadEvidenceIdentity: source.evidenceIdentity,
    sourceReceiptLedgerFileReadEvidenceIdentity: source.sourceReceiptLedgerFileReadEvidenceIdentity,
    sourceReceiptLedgerSnapshotEvidenceIdentity: source.sourceReceiptLedgerSnapshotEvidenceIdentity,
    sourceReceiptRecordSetEvidenceIdentity: source.sourceReceiptRecordSetEvidenceIdentity,
    sourcePolicyReportEvidenceIdentity: source.sourcePolicyReportEvidenceIdentity,
    sourceReceiptReportEvidenceIdentity: source.sourceReceiptReportEvidenceIdentity,
    sourceCommandSuccessEvidenceIdentity: source.sourceCommandSuccessEvidenceIdentity,
    sourceAppliedEvidenceIdentity: source.sourceAppliedEvidenceIdentity,
    repositoryIdentity: source.repositoryIdentity,
    canonicalBase: source.canonicalBase,
    targetHead: source.targetHead,
    postStateDigest: source.postStateDigest,
    verificationReportIdentity: source.verificationReportIdentity,
    verificationSessionId: source.verificationSessionId,
    verificationReportPassed: true as const,
    verificationReportCheckCount: report.checks.length,
    verificationReportFailedCheckIds: Object.freeze([]),
    verificationReceiptLedgerReadEventIdentity: source.verificationReceiptLedgerReadEventIdentity,
    verificationReceiptLedgerReadEventSequence: source.verificationReceiptLedgerReadEventSequence,
    verificationReceiptLedgerReadEventEmittedAt: source.verificationReceiptLedgerReadEventEmittedAt,
    verificationCompletedEventIdentity,
    verificationCompletedEventProtocol: event.protocol,
    verificationCompletedEventVersion: event.version,
    verificationCompletedEventId: event.eventId,
    verificationCompletedEventSequence: event.sequence,
    verificationCompletedEventEmittedAt: event.emittedAt,
    verificationCompletedEventType: event.type,
    verificationCompletedEventPassed: true as const,
    verificationCompletedEventCheckCount: event.payload.checks,
    verificationCompletedEventFailedCheckIds: Object.freeze([]),
  })
}

function evidenceIdentity(core: EvidenceCore): string {
  return hashText(canonicalJson(core))
}

export async function buildP7VerificationEngineCompletionEventEvidenceBinding(
  input: P7VerificationEngineCompletionEventEvidenceBindingBuildInput,
): Promise<P7VerificationEngineCompletionEventEvidenceBinding> {
  const core = await normalizedBuildCore(input)
  return deepFreeze({ ...core, evidenceIdentity: evidenceIdentity(core) })
}

export async function validateP7VerificationEngineCompletionEventEvidenceBinding(
  value: unknown,
  input: P7VerificationEngineCompletionEventEvidenceBindingBuildInput,
): Promise<P7VerificationEngineCompletionEventEvidenceBinding> {
  assertSafeJsonGraph(value, "verification-engine completion-event evidence binding")
  const record = ownDataRecord(
    value,
    OUTPUT_KEYS,
    OUTPUT_KEYS,
    "verification-engine completion-event evidence binding",
  )
  const claimedIdentity = sha256(record.evidenceIdentity, "verification-engine completion-event evidence binding.evidenceIdentity")
  const expected = await buildP7VerificationEngineCompletionEventEvidenceBinding(input)
  if (claimedIdentity !== expected.evidenceIdentity) {
    fail("verification-engine completion-event evidence binding.evidenceIdentity", "does not match the canonical source/event-derived preimage")
  }
  if (canonicalJson(record) !== canonicalJson(expected)) {
    fail("verification-engine completion-event evidence binding", "does not match canonical source/event-derived semantics")
  }
  return expected
}
