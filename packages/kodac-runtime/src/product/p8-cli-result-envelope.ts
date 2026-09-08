import { types as nodeTypes } from "node:util"

export const P8_CLI_RESULT_PROTOCOL = "kodac.cli-result" as const
export const P8_CLI_RESULT_VERSION = 1 as const
export const P8_CLI_COMMANDS = Object.freeze(["apply-patch", "ask", "solve"] as const)
export const P8_SOLVE_STATUSES = Object.freeze(["STOPPED", "PROVEN_READY", "NOT_READY"] as const)
export const P8_SOLVE_STOP_REASONS = Object.freeze([
  "completed",
  "max_turns",
  "max_tool_calls",
  "max_elapsed",
  "max_failures",
  "duplicate_tool_call",
  "cycle_detected",
  "aborted",
] as const)
export const P8_VERIFICATION_RISKS = Object.freeze(["low", "medium", "high"] as const)

export const P8_CLI_RESULT_LIMITS = Object.freeze({
  maxSessionIdCodePoints: 256,
  maxIdentityCodePoints: 256,
  maxReferenceCodePoints: 4_096,
  maxAssistantCodePoints: 65_536,
  maxMessageCodePoints: 4_096,
  maxPathCodePoints: 1_024,
  maxAffectedPathsPerClass: 256,
  maxVerificationCommands: 256,
  maxMessages: 256,
  maxGraphDepth: 24,
  maxGraphContainers: 2_048,
  maxGraphArrayLength: 512,
  maxGraphObjectKeys: 64,
  maxGraphStringCodePoints: 65_536,
  maxCounter: 1_000_000_000,
} as const)

export type P8CliCommand = (typeof P8_CLI_COMMANDS)[number]
export type P8SolveStatus = (typeof P8_SOLVE_STATUSES)[number]
export type P8SolveStopReason = (typeof P8_SOLVE_STOP_REASONS)[number]
export type P8VerificationRisk = (typeof P8_VERIFICATION_RISKS)[number]

export interface P8ApplyPatchEvidence {
  readonly events: string
  readonly receipts: string
}

export interface P8AskEvidence {
  readonly events: string
}

export interface P8SolveStoppedEvidence {
  readonly events: string
  readonly receipts: string
}

export interface P8SolveCompletedEvidence extends P8SolveStoppedEvidence {
  readonly plan: string
  readonly proof: string
}

export interface P8AffectedPaths {
  readonly added: readonly string[]
  readonly modified: readonly string[]
  readonly deleted: readonly string[]
}

export interface P8ApplyPatchPayload {
  readonly affected: P8AffectedPaths
  readonly receiptId: string
}

export interface P8AskPayload {
  readonly provider: string
  readonly model: string
  readonly assistant: string
}

export interface P8AgentLoopBudget {
  readonly turnsUsed: number
  readonly toolCallsUsed: number
  readonly failuresUsed: number
  readonly elapsedMs: number
}

export interface P8SolveStoppedPayload {
  readonly reason: P8SolveStopReason
  readonly budget: P8AgentLoopBudget
}

export interface P8SolveCompletedPayload {
  readonly provider: string
  readonly model: string
  readonly assistant: string
  readonly budget: P8AgentLoopBudget
  readonly verificationRisk: P8VerificationRisk
  readonly verificationCommands: readonly string[]
  readonly warnings: readonly string[]
  readonly reasons: readonly string[]
}

interface P8BaseEnvelope {
  readonly protocol: typeof P8_CLI_RESULT_PROTOCOL
  readonly version: typeof P8_CLI_RESULT_VERSION
  readonly command: P8CliCommand
  readonly sessionId: string
  readonly status: string
  readonly proven: boolean
  readonly evidence: object
  readonly payload: object
}

export interface P8ApplyPatchEnvelope extends P8BaseEnvelope {
  readonly command: "apply-patch"
  readonly status: "PATCH_APPLIED"
  readonly proven: false
  readonly evidence: P8ApplyPatchEvidence
  readonly payload: P8ApplyPatchPayload
}

export interface P8AskEnvelope extends P8BaseEnvelope {
  readonly command: "ask"
  readonly status: "COMPLETE"
  readonly proven: false
  readonly evidence: P8AskEvidence
  readonly payload: P8AskPayload
}

export interface P8SolveStoppedEnvelope extends P8BaseEnvelope {
  readonly command: "solve"
  readonly status: "STOPPED"
  readonly proven: false
  readonly evidence: P8SolveStoppedEvidence
  readonly payload: P8SolveStoppedPayload
}

export interface P8SolveNotReadyEnvelope extends P8BaseEnvelope {
  readonly command: "solve"
  readonly status: "NOT_READY"
  readonly proven: false
  readonly evidence: P8SolveCompletedEvidence
  readonly payload: P8SolveCompletedPayload
}

export interface P8SolveProvenReadyEnvelope extends P8BaseEnvelope {
  readonly command: "solve"
  readonly status: "PROVEN_READY"
  readonly proven: true
  readonly evidence: P8SolveCompletedEvidence
  readonly payload: P8SolveCompletedPayload
}

export type P8CliResultEnvelope =
  | P8ApplyPatchEnvelope
  | P8AskEnvelope
  | P8SolveStoppedEnvelope
  | P8SolveNotReadyEnvelope
  | P8SolveProvenReadyEnvelope

export type P8CliResultEnvelopeInput =
  | Omit<P8ApplyPatchEnvelope, "protocol" | "version">
  | Omit<P8AskEnvelope, "protocol" | "version">
  | Omit<P8SolveStoppedEnvelope, "protocol" | "version">
  | Omit<P8SolveNotReadyEnvelope, "protocol" | "version">
  | Omit<P8SolveProvenReadyEnvelope, "protocol" | "version">

type UnknownRecord = Record<string, unknown>

const COMMANDS = new Set<string>(P8_CLI_COMMANDS)
const SOLVE_STATUSES = new Set<string>(P8_SOLVE_STATUSES)
const SOLVE_STOP_REASONS = new Set<string>(P8_SOLVE_STOP_REASONS)
const VERIFICATION_RISKS = new Set<string>(P8_VERIFICATION_RISKS)
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u
const NUL_OR_DEL = /[\u0000\u007f]/u
const INPUT_KEYS = ["command", "sessionId", "status", "proven", "evidence", "payload"] as const
const ENVELOPE_KEYS = ["protocol", "version", ...INPUT_KEYS] as const

function fail(label: string, detail: string): never {
  throw new TypeError(`${label} ${detail}`)
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
      if (index + 1 >= value.length) fail(label, "must contain only valid Unicode scalar values")
      const next = value.charCodeAt(index + 1)
      if (next < 0xdc00 || next > 0xdfff) fail(label, "must contain only valid Unicode scalar values")
      index += 1
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      fail(label, "must contain only valid Unicode scalar values")
    }
  }
}

function ownKeys(value: object, label: string): (string | symbol)[] {
  try {
    return Reflect.ownKeys(value)
  } catch {
    return fail(label, "must expose a stable own-key set")
  }
}

function ownDescriptor(value: object, key: string | symbol, label: string): PropertyDescriptor {
  try {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor === undefined) fail(label, "has an unstable property descriptor")
    return descriptor
  } catch {
    return fail(label, "must expose stable data-property descriptors")
  }
}

function prototypeOf(value: object, label: string): object | null {
  try {
    return Object.getPrototypeOf(value)
  } catch {
    return fail(label, "must expose a stable prototype")
  }
}

function assertJsonDataGraph(
  value: unknown,
  label: string,
  seen: WeakSet<object>,
  depth: number,
  budget: { containers: number },
): void {
  if (value === null || typeof value === "boolean") return
  if (typeof value === "number") {
    if (!Number.isFinite(value)) fail(label, "must not contain non-finite numbers")
    return
  }
  if (typeof value === "string") {
    assertUnicodeScalars(value, label)
    if (codePointLength(value) > P8_CLI_RESULT_LIMITS.maxGraphStringCodePoints) {
      fail(label, `exceeds ${P8_CLI_RESULT_LIMITS.maxGraphStringCodePoints} Unicode code points`)
    }
    return
  }
  if (typeof value !== "object") fail(label, "must contain JSON data only")
  if (nodeTypes.isProxy(value)) fail(label, "must not contain Proxy objects")
  if (depth > P8_CLI_RESULT_LIMITS.maxGraphDepth) fail(label, `exceeds maximum object depth ${P8_CLI_RESULT_LIMITS.maxGraphDepth}`)
  if (seen.has(value)) fail(label, "must be an acyclic non-aliased JSON data graph")
  seen.add(value)
  budget.containers += 1
  if (budget.containers > P8_CLI_RESULT_LIMITS.maxGraphContainers) {
    fail(label, `exceeds maximum container count ${P8_CLI_RESULT_LIMITS.maxGraphContainers}`)
  }

  const prototype = prototypeOf(value, label)
  if (Array.isArray(value)) {
    if (prototype !== Array.prototype) fail(label, "must use the ordinary Array prototype")
    const lengthDescriptor = ownDescriptor(value, "length", `${label}.length`)
    if (!("value" in lengthDescriptor) || !Number.isSafeInteger(lengthDescriptor.value)) {
      fail(label, "must expose an ordinary array length")
    }
    const length = lengthDescriptor.value as number
    if (length > P8_CLI_RESULT_LIMITS.maxGraphArrayLength) {
      fail(label, `exceeds maximum array length ${P8_CLI_RESULT_LIMITS.maxGraphArrayLength}`)
    }
    const keys = ownKeys(value, label)
    const expected = new Set<string>(["length"])
    for (let index = 0; index < length; index += 1) expected.add(String(index))
    for (const key of keys) {
      if (typeof key !== "string" || !expected.has(key)) {
        fail(label, "must not contain symbol, accessor, sparse, or extra array properties")
      }
    }
    if (keys.length !== expected.size) fail(label, "must not contain sparse array slots")
    for (let index = 0; index < length; index += 1) {
      const descriptor = ownDescriptor(value, String(index), `${label}[${index}]`)
      if (!("value" in descriptor) || descriptor.enumerable !== true) {
        fail(`${label}[${index}]`, "must be an enumerable data property")
      }
      assertJsonDataGraph(descriptor.value, `${label}[${index}]`, seen, depth + 1, budget)
    }
    return
  }

  if (prototype !== Object.prototype && prototype !== null) fail(label, "must be a plain object")
  const keys = ownKeys(value, label)
  if (keys.length > P8_CLI_RESULT_LIMITS.maxGraphObjectKeys) {
    fail(label, `exceeds maximum own-key count ${P8_CLI_RESULT_LIMITS.maxGraphObjectKeys}`)
  }
  for (const key of keys) {
    if (typeof key !== "string") fail(label, "must not contain symbol properties")
    assertUnicodeScalars(key, `${label} property name`)
    const descriptor = ownDescriptor(value, key, `${label}.${key}`)
    if (!("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}.${key}`, "must be an enumerable data property")
    }
    assertJsonDataGraph(descriptor.value, `${label}.${key}`, seen, depth + 1, budget)
  }
}

function snapshotJsonData<T>(value: T, label: string): T {
  assertJsonDataGraph(value, label, new WeakSet<object>(), 0, { containers: 0 })
  try {
    return structuredClone(value)
  } catch {
    return fail(label, "must be structured-cloneable JSON data")
  }
}

function record(value: unknown, allowedKeys: readonly string[], requiredKeys: readonly string[], label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail(label, "must be a plain object")
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(label, "must be a plain object")
  const allowed = new Set<string>(allowedKeys)
  for (const name of Object.keys(value)) if (!allowed.has(name)) fail(label, `contains unknown field: ${name}`)
  for (const name of requiredKeys) if (!Object.hasOwn(value, name)) fail(label, `is missing required field: ${name}`)
  return value as UnknownRecord
}

function boundedIdentity(value: unknown, label: string, maxCodePoints: number): string {
  if (typeof value !== "string" || value.length === 0) fail(label, "must be a non-empty string")
  assertUnicodeScalars(value, label)
  if (codePointLength(value) > maxCodePoints) fail(label, `exceeds ${maxCodePoints} Unicode code points`)
  if (CONTROL_CHARACTERS.test(value) || !/\S/u.test(value)) fail(label, "must be non-blank text without control characters")
  return value
}

function boundedContent(value: unknown, label: string, maxCodePoints: number): string {
  if (typeof value !== "string") fail(label, "must be a string")
  assertUnicodeScalars(value, label)
  if (codePointLength(value) > maxCodePoints) fail(label, `exceeds ${maxCodePoints} Unicode code points`)
  if (NUL_OR_DEL.test(value)) fail(label, "must not contain NUL or DEL control characters")
  return value
}

function exactBoolean(value: unknown, expected: boolean, label: string): boolean {
  if (value !== expected) fail(label, `must equal ${expected}`)
  return expected
}

function boundedCounter(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0 || (value as number) > P8_CLI_RESULT_LIMITS.maxCounter) {
    fail(label, `must be an integer in 0..${P8_CLI_RESULT_LIMITS.maxCounter}`)
  }
  return value as number
}

function normalizeStringArray(
  value: unknown,
  label: string,
  maxItems: number,
  maxCodePoints: number,
  mode: "identity" | "content",
): readonly string[] {
  if (!Array.isArray(value)) fail(label, "must be an array")
  if (value.length > maxItems) fail(label, `must contain at most ${maxItems} entries`)
  const normalized = value.map((entry, index) => mode === "identity"
    ? boundedIdentity(entry, `${label}[${index}]`, maxCodePoints)
    : boundedContent(entry, `${label}[${index}]`, maxCodePoints))
  return Object.freeze(normalized)
}

function normalizeBudget(value: unknown, label: string): P8AgentLoopBudget {
  const input = record(value, ["turnsUsed", "toolCallsUsed", "failuresUsed", "elapsedMs"], ["turnsUsed", "toolCallsUsed", "failuresUsed", "elapsedMs"], label)
  return Object.freeze({
    turnsUsed: boundedCounter(input.turnsUsed, `${label}.turnsUsed`),
    toolCallsUsed: boundedCounter(input.toolCallsUsed, `${label}.toolCallsUsed`),
    failuresUsed: boundedCounter(input.failuresUsed, `${label}.failuresUsed`),
    elapsedMs: boundedCounter(input.elapsedMs, `${label}.elapsedMs`),
  })
}

function normalizeApplyPatchEvidence(value: unknown): P8ApplyPatchEvidence {
  const input = record(value, ["events", "receipts"], ["events", "receipts"], "envelope.evidence")
  return Object.freeze({
    events: boundedIdentity(input.events, "envelope.evidence.events", P8_CLI_RESULT_LIMITS.maxReferenceCodePoints),
    receipts: boundedIdentity(input.receipts, "envelope.evidence.receipts", P8_CLI_RESULT_LIMITS.maxReferenceCodePoints),
  })
}

function normalizeAskEvidence(value: unknown): P8AskEvidence {
  const input = record(value, ["events"], ["events"], "envelope.evidence")
  return Object.freeze({ events: boundedIdentity(input.events, "envelope.evidence.events", P8_CLI_RESULT_LIMITS.maxReferenceCodePoints) })
}

function normalizeSolveStoppedEvidence(value: unknown): P8SolveStoppedEvidence {
  return normalizeApplyPatchEvidence(value)
}

function normalizeSolveCompletedEvidence(value: unknown): P8SolveCompletedEvidence {
  const input = record(value, ["events", "receipts", "plan", "proof"], ["events", "receipts", "plan", "proof"], "envelope.evidence")
  return Object.freeze({
    events: boundedIdentity(input.events, "envelope.evidence.events", P8_CLI_RESULT_LIMITS.maxReferenceCodePoints),
    receipts: boundedIdentity(input.receipts, "envelope.evidence.receipts", P8_CLI_RESULT_LIMITS.maxReferenceCodePoints),
    plan: boundedIdentity(input.plan, "envelope.evidence.plan", P8_CLI_RESULT_LIMITS.maxReferenceCodePoints),
    proof: boundedIdentity(input.proof, "envelope.evidence.proof", P8_CLI_RESULT_LIMITS.maxReferenceCodePoints),
  })
}

function normalizeAffected(value: unknown): P8AffectedPaths {
  const input = record(value, ["added", "modified", "deleted"], ["added", "modified", "deleted"], "envelope.payload.affected")
  return Object.freeze({
    added: normalizeStringArray(input.added, "envelope.payload.affected.added", P8_CLI_RESULT_LIMITS.maxAffectedPathsPerClass, P8_CLI_RESULT_LIMITS.maxPathCodePoints, "identity"),
    modified: normalizeStringArray(input.modified, "envelope.payload.affected.modified", P8_CLI_RESULT_LIMITS.maxAffectedPathsPerClass, P8_CLI_RESULT_LIMITS.maxPathCodePoints, "identity"),
    deleted: normalizeStringArray(input.deleted, "envelope.payload.affected.deleted", P8_CLI_RESULT_LIMITS.maxAffectedPathsPerClass, P8_CLI_RESULT_LIMITS.maxPathCodePoints, "identity"),
  })
}

function normalizeApplyPatchPayload(value: unknown): P8ApplyPatchPayload {
  const input = record(value, ["affected", "receiptId"], ["affected", "receiptId"], "envelope.payload")
  return Object.freeze({
    affected: normalizeAffected(input.affected),
    receiptId: boundedIdentity(input.receiptId, "envelope.payload.receiptId", P8_CLI_RESULT_LIMITS.maxIdentityCodePoints),
  })
}

function normalizeAskPayload(value: unknown): P8AskPayload {
  const input = record(value, ["provider", "model", "assistant"], ["provider", "model", "assistant"], "envelope.payload")
  return Object.freeze({
    provider: boundedIdentity(input.provider, "envelope.payload.provider", P8_CLI_RESULT_LIMITS.maxIdentityCodePoints),
    model: boundedIdentity(input.model, "envelope.payload.model", P8_CLI_RESULT_LIMITS.maxIdentityCodePoints),
    assistant: boundedContent(input.assistant, "envelope.payload.assistant", P8_CLI_RESULT_LIMITS.maxAssistantCodePoints),
  })
}

function normalizeSolveStoppedPayload(value: unknown): P8SolveStoppedPayload {
  const input = record(value, ["reason", "budget"], ["reason", "budget"], "envelope.payload")
  if (typeof input.reason !== "string" || !SOLVE_STOP_REASONS.has(input.reason)) fail("envelope.payload.reason", "is unsupported")
  return Object.freeze({ reason: input.reason as P8SolveStopReason, budget: normalizeBudget(input.budget, "envelope.payload.budget") })
}

function normalizeSolveCompletedPayload(value: unknown): P8SolveCompletedPayload {
  const keys = ["provider", "model", "assistant", "budget", "verificationRisk", "verificationCommands", "warnings", "reasons"] as const
  const input = record(value, keys, keys, "envelope.payload")
  if (typeof input.verificationRisk !== "string" || !VERIFICATION_RISKS.has(input.verificationRisk)) {
    fail("envelope.payload.verificationRisk", "is unsupported")
  }
  return Object.freeze({
    provider: boundedIdentity(input.provider, "envelope.payload.provider", P8_CLI_RESULT_LIMITS.maxIdentityCodePoints),
    model: boundedIdentity(input.model, "envelope.payload.model", P8_CLI_RESULT_LIMITS.maxIdentityCodePoints),
    assistant: boundedContent(input.assistant, "envelope.payload.assistant", P8_CLI_RESULT_LIMITS.maxAssistantCodePoints),
    budget: normalizeBudget(input.budget, "envelope.payload.budget"),
    verificationRisk: input.verificationRisk as P8VerificationRisk,
    verificationCommands: normalizeStringArray(input.verificationCommands, "envelope.payload.verificationCommands", P8_CLI_RESULT_LIMITS.maxVerificationCommands, P8_CLI_RESULT_LIMITS.maxIdentityCodePoints, "identity"),
    warnings: normalizeStringArray(input.warnings, "envelope.payload.warnings", P8_CLI_RESULT_LIMITS.maxMessages, P8_CLI_RESULT_LIMITS.maxMessageCodePoints, "content"),
    reasons: normalizeStringArray(input.reasons, "envelope.payload.reasons", P8_CLI_RESULT_LIMITS.maxMessages, P8_CLI_RESULT_LIMITS.maxMessageCodePoints, "content"),
  })
}

function normalizeCore(value: unknown): P8CliResultEnvelope {
  const safe = snapshotJsonData(value, "envelope")
  const input = record(safe, INPUT_KEYS, INPUT_KEYS, "envelope")
  const sessionId = boundedIdentity(input.sessionId, "envelope.sessionId", P8_CLI_RESULT_LIMITS.maxSessionIdCodePoints)
  if (typeof input.command !== "string" || !COMMANDS.has(input.command)) fail("envelope.command", "is unsupported")

  if (input.command === "apply-patch") {
    if (input.status !== "PATCH_APPLIED") fail("envelope.status", "must equal PATCH_APPLIED for apply-patch")
    return Object.freeze({
      protocol: P8_CLI_RESULT_PROTOCOL,
      version: P8_CLI_RESULT_VERSION,
      command: "apply-patch",
      sessionId,
      status: "PATCH_APPLIED",
      proven: exactBoolean(input.proven, false, "envelope.proven") as false,
      evidence: normalizeApplyPatchEvidence(input.evidence),
      payload: normalizeApplyPatchPayload(input.payload),
    })
  }

  if (input.command === "ask") {
    if (input.status !== "COMPLETE") fail("envelope.status", "must equal COMPLETE for ask")
    return Object.freeze({
      protocol: P8_CLI_RESULT_PROTOCOL,
      version: P8_CLI_RESULT_VERSION,
      command: "ask",
      sessionId,
      status: "COMPLETE",
      proven: exactBoolean(input.proven, false, "envelope.proven") as false,
      evidence: normalizeAskEvidence(input.evidence),
      payload: normalizeAskPayload(input.payload),
    })
  }

  if (typeof input.status !== "string" || !SOLVE_STATUSES.has(input.status)) fail("envelope.status", "is unsupported for solve")
  if (input.status === "STOPPED") {
    return Object.freeze({
      protocol: P8_CLI_RESULT_PROTOCOL,
      version: P8_CLI_RESULT_VERSION,
      command: "solve",
      sessionId,
      status: "STOPPED",
      proven: exactBoolean(input.proven, false, "envelope.proven") as false,
      evidence: normalizeSolveStoppedEvidence(input.evidence),
      payload: normalizeSolveStoppedPayload(input.payload),
    })
  }

  const completed = {
    protocol: P8_CLI_RESULT_PROTOCOL,
    version: P8_CLI_RESULT_VERSION,
    command: "solve" as const,
    sessionId,
    evidence: normalizeSolveCompletedEvidence(input.evidence),
    payload: normalizeSolveCompletedPayload(input.payload),
  }
  if (input.status === "PROVEN_READY") {
    return Object.freeze({ ...completed, status: "PROVEN_READY", proven: exactBoolean(input.proven, true, "envelope.proven") as true })
  }
  return Object.freeze({ ...completed, status: "NOT_READY", proven: exactBoolean(input.proven, false, "envelope.proven") as false })
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as UnknownRecord)) deepFreeze(child)
  }
  return value
}

export function buildP8CliResultEnvelope(input: P8CliResultEnvelopeInput): P8CliResultEnvelope {
  return deepFreeze(normalizeCore(input))
}

export function validateP8CliResultEnvelope(value: unknown): P8CliResultEnvelope {
  const safe = snapshotJsonData(value, "envelope")
  const input = record(safe, ENVELOPE_KEYS, ENVELOPE_KEYS, "envelope")
  if (input.protocol !== P8_CLI_RESULT_PROTOCOL) fail("envelope.protocol", `must equal ${P8_CLI_RESULT_PROTOCOL}`)
  if (input.version !== P8_CLI_RESULT_VERSION) fail("envelope.version", `must equal ${P8_CLI_RESULT_VERSION}`)
  const core: UnknownRecord = {}
  for (const key of INPUT_KEYS) core[key] = input[key]
  return deepFreeze(normalizeCore(core))
}
