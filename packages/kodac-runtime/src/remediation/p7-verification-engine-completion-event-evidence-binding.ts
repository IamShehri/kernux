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
const MAX_CHECKS = 512
const MAX_JSON_NODES = 16_384
const MAX_JSON_DEPTH = 24

const BUILD_KEYS = [
  "sourceVerificationEngineReceiptLedgerReadEvidenceBinding",
  "sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput",
  "verificationCompletedEvent",
] as const
const EVENT_KEYS = ["protocol", "version", "eventId", "sessionId", "sequence", "emittedAt", "type", "payload"] as const
const PAYLOAD_KEYS = ["passed", "checks", "failed"] as const
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

function sourceVerificationReportBinding(
  input: P7VerificationEngineReceiptLedgerReadEvidenceBindingBuildInput,
) {
  return input.sourceReceiptLedgerFileReadEvidenceBindingInput
    .sourceReceiptLedgerSnapshotEvidenceBindingInput
    .sourceReceiptRecordSetEvidenceBindingInput
    .sourcePolicyReportEvidenceBindingInput
    .sourceReceiptReportEvidenceBindingInput
    .sourceGitChangeReportEvidenceBindingInput
    .sourceWorkspaceReferenceEvidenceBindingInput
    .sourceAgentCompletionEvidenceBindingInput
    .sourceCommandSuccessEvidenceBindingInput
    .sourceVerificationReportBinding
}

function normalizeCompletionEvent(
  value: unknown,
  source: P7VerificationEngineReceiptLedgerReadEvidenceBinding,
  report: ReturnType<typeof sourceVerificationReportBinding>,
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
  if (Date.parse(emittedAt) < Date.parse(report.verificationCompletedAt)) {
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
  if (checks !== report.verificationReport.checks.length) {
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
  const report = sourceVerificationReportBinding(sourceInput)
  if (report.verificationReportIdentity !== source.verificationReportIdentity) {
    fail("source verification report", "identity must match the exact P7-R18 lineage")
  }
  if (report.verificationSessionId !== source.verificationSessionId) {
    fail("source verification report", "session must match the exact P7-R18 lineage")
  }
  if (report.verificationReportPassed !== true || report.verificationReport.passed !== true) {
    fail("source verification report", "must be all-pass through the canonical P7-R8 predecessor")
  }
  if (report.verificationReport.checks.some((candidate) => candidate.status !== "pass")) {
    fail("source verification report", "must contain only passing checks through the canonical P7-R8 predecessor")
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
    verificationReportCheckCount: report.verificationReport.checks.length,
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
