import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  P8_CLI_COMMANDS,
  P8_CLI_RESULT_LIMITS,
  P8_CLI_RESULT_PROTOCOL,
  P8_CLI_RESULT_VERSION,
  P8_SOLVE_STATUSES,
  P8_SOLVE_STOP_REASONS,
  P8_VERIFICATION_RISKS,
  buildP8CliResultEnvelope,
  validateP8CliResultEnvelope,
  type P8CliResultEnvelopeInput,
} from "../src/product/p8-cli-result-envelope.ts"

type MutableRecord = Record<string, any>
type SchemaRecord = Record<string, any>

const schema = JSON.parse(
  readFileSync(new URL("../../../schema/p8-cli-result-envelope.schema.json", import.meta.url), "utf8"),
) as SchemaRecord
const sourceText = readFileSync(
  new URL("../src/product/p8-cli-result-envelope.ts", import.meta.url),
  "utf8",
)

function applyInput(): MutableRecord {
  return {
    command: "apply-patch",
    sessionId: "session-apply",
    status: "PATCH_APPLIED",
    proven: false,
    evidence: { events: "/tmp/events.jsonl", receipts: "/tmp/receipts.jsonl" },
    payload: {
      affected: { added: ["src/a.ts"], modified: ["src/b.ts"], deleted: [] },
      receiptId: "receipt-1",
    },
  }
}

function askInput(): MutableRecord {
  return {
    command: "ask",
    sessionId: "session-ask",
    status: "COMPLETE",
    proven: false,
    evidence: { events: "/tmp/events.jsonl" },
    payload: {
      provider: "fixture",
      model: "fixture/deterministic-v1",
      assistant: "hello\nworld",
    },
  }
}

function budget(): MutableRecord {
  return { turnsUsed: 2, toolCallsUsed: 1, failuresUsed: 0, elapsedMs: 42 }
}

function solveCompletedInput(status: "PROVEN_READY" | "NOT_READY"): MutableRecord {
  return {
    command: "solve",
    sessionId: `session-${status.toLowerCase()}`,
    status,
    proven: status === "PROVEN_READY",
    evidence: {
      events: "/tmp/events.jsonl",
      receipts: "/tmp/receipts.jsonl",
      plan: "/tmp/verification-plan.json",
      proof: "/tmp/proof.json",
    },
    payload: {
      provider: "fixture",
      model: "fixture/deterministic-v1",
      assistant: "done",
      budget: budget(),
      verificationRisk: "low",
      verificationCommands: ["command.tests"],
      warnings: [],
      reasons: status === "PROVEN_READY" ? [] : ["verification.commands: approval required"],
    },
  }
}

function solveStoppedInput(): MutableRecord {
  return {
    command: "solve",
    sessionId: "session-stopped",
    status: "STOPPED",
    proven: false,
    evidence: { events: "/tmp/events.jsonl", receipts: "/tmp/receipts.jsonl" },
    payload: { reason: "max_turns", budget: budget() },
  }
}

function full(input: MutableRecord): MutableRecord {
  return { protocol: P8_CLI_RESULT_PROTOCOL, version: P8_CLI_RESULT_VERSION, ...structuredClone(input) }
}

function resolveRef(root: SchemaRecord, ref: string): unknown {
  assert.match(ref, /^#\/\$defs\//)
  return root.$defs[ref.slice("#/$defs/".length)]
}

function schemaAccepts(nodeValue: unknown, value: unknown, root: SchemaRecord = schema): boolean {
  if (nodeValue === true) return true
  if (nodeValue === false || typeof nodeValue !== "object" || nodeValue === null) return false
  const node = nodeValue as SchemaRecord
  if (node.$ref !== undefined) return schemaAccepts(resolveRef(root, node.$ref), value, root)
  if (node.allOf !== undefined && !(node.allOf as unknown[]).every((part) => schemaAccepts(part, value, root))) return false
  if (node.oneOf !== undefined) {
    const matches = (node.oneOf as unknown[]).filter((part) => schemaAccepts(part, value, root)).length
    if (matches !== 1) return false
  }
  if (node.const !== undefined && !Object.is(value, node.const)) return false
  if (node.enum !== undefined && !(node.enum as unknown[]).some((candidate) => Object.is(candidate, value))) return false

  if (node.type === "object") {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false
    const record = value as Record<string, unknown>
    for (const required of (node.required ?? []) as string[]) if (!Object.hasOwn(record, required)) return false
    const properties = (node.properties ?? {}) as Record<string, unknown>
    if (node.additionalProperties === false) {
      for (const key of Object.keys(record)) if (!Object.hasOwn(properties, key)) return false
    }
    for (const [key, childSchema] of Object.entries(properties)) {
      if (Object.hasOwn(record, key) && !schemaAccepts(childSchema, record[key], root)) return false
    }
  }

  if (node.type === "array") {
    if (!Array.isArray(value)) return false
    if (node.minItems !== undefined && value.length < node.minItems) return false
    if (node.maxItems !== undefined && value.length > node.maxItems) return false
    if (node.items !== undefined && !value.every((item) => schemaAccepts(node.items, item, root))) return false
  }

  if (node.type === "string") {
    if (typeof value !== "string") return false
    const length = Array.from(value).length
    if (node.minLength !== undefined && length < node.minLength) return false
    if (node.maxLength !== undefined && length > node.maxLength) return false
    if (node.pattern !== undefined && !new RegExp(node.pattern, "u").test(value)) return false
  }

  if (node.type === "integer") {
    if (!Number.isInteger(value)) return false
    const number = value as number
    if (node.minimum !== undefined && number < node.minimum) return false
    if (node.maximum !== undefined && number > node.maximum) return false
  }

  return true
}

function runtimeAccepts(value: unknown): boolean {
  try {
    validateP8CliResultEnvelope(value)
    return true
  } catch {
    return false
  }
}

function assertFrozenDeep(value: unknown): void {
  if (typeof value !== "object" || value === null) return
  assert.ok(Object.isFrozen(value))
  for (const child of Object.values(value as Record<string, unknown>)) assertFrozenDeep(child)
}

test("P8-R1 exports the bounded protocol and closed discriminators", () => {
  assert.equal(P8_CLI_RESULT_PROTOCOL, "kodac.cli-result")
  assert.equal(P8_CLI_RESULT_VERSION, 1)
  assert.deepEqual(P8_CLI_COMMANDS, ["apply-patch", "ask", "solve"])
  assert.deepEqual(P8_SOLVE_STATUSES, ["STOPPED", "PROVEN_READY", "NOT_READY"])
  assert.deepEqual(P8_SOLVE_STOP_REASONS, [
    "max_turns",
    "max_tool_calls",
    "max_elapsed",
    "max_failures",
    "duplicate_tool_call",
    "cycle_detected",
    "aborted",
  ])
  assert.deepEqual(P8_VERIFICATION_RISKS, ["low", "medium", "high"])
})

test("P8-R1 builds and validates every authorized command/status family", () => {
  for (const input of [applyInput(), askInput(), solveStoppedInput(), solveCompletedInput("NOT_READY"), solveCompletedInput("PROVEN_READY")]) {
    const built = buildP8CliResultEnvelope(input as P8CliResultEnvelopeInput)
    assert.equal(built.protocol, P8_CLI_RESULT_PROTOCOL)
    assert.equal(built.version, P8_CLI_RESULT_VERSION)
    assert.deepEqual(validateP8CliResultEnvelope(built), built)
    assert.equal(schemaAccepts(schema, built), true)
  }
})

test("P8-R1 preserves proof semantics and rejects false readiness claims", () => {
  const invalid: MutableRecord[] = []

  const apply = applyInput()
  apply.proven = true
  invalid.push(full(apply))

  const ask = askInput()
  ask.proven = true
  invalid.push(full(ask))

  const stopped = solveStoppedInput()
  stopped.proven = true
  invalid.push(full(stopped))

  const notReady = solveCompletedInput("NOT_READY")
  notReady.proven = true
  invalid.push(full(notReady))

  const ready = solveCompletedInput("PROVEN_READY")
  ready.proven = false
  invalid.push(full(ready))

  const readyWithReasons = solveCompletedInput("PROVEN_READY")
  readyWithReasons.payload.reasons = ["contradicts PROVEN_READY"]
  invalid.push(full(readyWithReasons))

  const notReadyWithoutReasons = solveCompletedInput("NOT_READY")
  notReadyWithoutReasons.payload.reasons = []
  invalid.push(full(notReadyWithoutReasons))

  for (const candidate of invalid) {
    assert.equal(runtimeAccepts(candidate), false)
    assert.equal(schemaAccepts(schema, candidate), false)
  }
})

test("P8-R1 rejects command/status/payload/evidence discriminator mismatches", () => {
  const wrongStatus = full(askInput())
  wrongStatus.status = "PATCH_APPLIED"
  assert.equal(runtimeAccepts(wrongStatus), false)

  const wrongPayload = full(askInput())
  wrongPayload.payload = applyInput().payload
  assert.equal(runtimeAccepts(wrongPayload), false)

  const stoppedWithProof = full(solveStoppedInput())
  stoppedWithProof.evidence.proof = "/tmp/proof.json"
  assert.equal(runtimeAccepts(stoppedWithProof), false)

  const completedStopReason = full(solveStoppedInput())
  completedStopReason.payload.reason = "completed"
  assert.equal(runtimeAccepts(completedStopReason), false)
  assert.equal(schemaAccepts(schema, completedStopReason), false)

  const completedWithoutProof = full(solveCompletedInput("NOT_READY"))
  delete completedWithoutProof.evidence.proof
  assert.equal(runtimeAccepts(completedWithoutProof), false)

  const unknownCommand = full(askInput())
  unknownCommand.command = "publish"
  assert.equal(runtimeAccepts(unknownCommand), false)
})

test("P8-R1 rejects unknown fields at every object level", () => {
  const cases = [
    (() => { const value = full(askInput()); value.authorized = true; return value })(),
    (() => { const value = full(askInput()); value.evidence.receipts = "unexpected"; return value })(),
    (() => { const value = full(askInput()); value.payload.release = true; return value })(),
    (() => { const value = full(solveCompletedInput("NOT_READY")); value.payload.budget.extra = 1; return value })(),
    (() => { const value = full(applyInput()); value.payload.affected.extra = []; return value })(),
  ]
  for (const candidate of cases) {
    assert.equal(runtimeAccepts(candidate), false)
    assert.equal(schemaAccepts(schema, candidate), false)
  }
})

test("P8-R1 enforces deterministic string, collection, and numeric bounds", () => {
  const badSession = full(askInput())
  badSession.sessionId = "x".repeat(P8_CLI_RESULT_LIMITS.maxSessionIdCodePoints + 1)
  assert.equal(runtimeAccepts(badSession), false)

  const controlIdentity = full(askInput())
  controlIdentity.payload.provider = "bad\nprovider"
  assert.equal(runtimeAccepts(controlIdentity), false)
  assert.equal(schemaAccepts(schema, controlIdentity), false)

  const nulContent = full(askInput())
  nulContent.payload.assistant = "line one\nbad\u0000content"
  assert.equal(runtimeAccepts(nulContent), false)
  assert.equal(schemaAccepts(schema, nulContent), false)

  const assistantOverflow = full(askInput())
  assistantOverflow.payload.assistant = "x".repeat(P8_CLI_RESULT_LIMITS.maxAssistantCodePoints + 1)
  assert.equal(runtimeAccepts(assistantOverflow), false)

  const affectedOverflow = full(applyInput())
  affectedOverflow.payload.affected.added = Array.from(
    { length: P8_CLI_RESULT_LIMITS.maxAffectedPathsPerClass + 1 },
    (_, index) => `src/${index}.ts`,
  )
  assert.equal(runtimeAccepts(affectedOverflow), false)

  const counterOverflow = full(solveStoppedInput())
  counterOverflow.payload.budget.elapsedMs = P8_CLI_RESULT_LIMITS.maxCounter + 1
  assert.equal(runtimeAccepts(counterOverflow), false)

  const negativeCounter = full(solveStoppedInput())
  negativeCounter.payload.budget.failuresUsed = -1
  assert.equal(runtimeAccepts(negativeCounter), false)
})

test("P8-R1 accepts bounded multiline assistant/message content without weakening identity fields", () => {
  const ask = askInput()
  ask.payload.assistant = "line one\nline two\tindented"
  assert.doesNotThrow(() => buildP8CliResultEnvelope(ask as P8CliResultEnvelopeInput))
  assert.equal(schemaAccepts(schema, full(ask)), true)

  const solve = solveCompletedInput("NOT_READY")
  solve.payload.warnings = ["warning line one\nwarning line two"]
  solve.payload.reasons = ["reason\twith detail"]
  assert.doesNotThrow(() => buildP8CliResultEnvelope(solve as P8CliResultEnvelopeInput))
  assert.equal(schemaAccepts(schema, full(solve)), true)
})

test("P8-R1 returns detached deeply immutable records", () => {
  const input = solveCompletedInput("NOT_READY")
  const built = buildP8CliResultEnvelope(input as P8CliResultEnvelopeInput)
  const snapshot = structuredClone(built)

  input.sessionId = "mutated"
  input.evidence.events = "mutated"
  input.payload.budget.turnsUsed = 999
  input.payload.verificationCommands[0] = "mutated"
  input.payload.reasons.push("mutated")

  assert.deepEqual(built, snapshot)
  assertFrozenDeep(built)
})

test("P8-R1 fails closed on accessors, proxies, custom prototypes, aliases, cycles, and non-JSON data", () => {
  const accessor = askInput()
  Object.defineProperty(accessor, "sessionId", {
    enumerable: true,
    get() { return "getter-session" },
  })
  assert.throws(() => buildP8CliResultEnvelope(accessor as P8CliResultEnvelopeInput), /data property|data-property|descriptor|JSON data/)

  const proxy = new Proxy(askInput(), {})
  assert.throws(() => buildP8CliResultEnvelope(proxy as P8CliResultEnvelopeInput), /Proxy/)

  const custom = askInput()
  Object.setPrototypeOf(custom.payload, { polluted: true })
  assert.throws(() => buildP8CliResultEnvelope(custom as P8CliResultEnvelopeInput), /plain object/)

  const aliased = askInput()
  const shared = { events: "/tmp/events.jsonl" }
  aliased.evidence = shared
  aliased.payload = { provider: "fixture", model: "fixture/model", assistant: "ok", nested: shared }
  assert.throws(() => buildP8CliResultEnvelope(aliased as P8CliResultEnvelopeInput), /aliased|unknown field/)

  const cyclic = askInput()
  cyclic.self = cyclic
  assert.throws(() => buildP8CliResultEnvelope(cyclic as P8CliResultEnvelopeInput), /acyclic/)

  const nonJson = askInput()
  nonJson.payload.assistant = 1n
  assert.throws(() => buildP8CliResultEnvelope(nonJson as P8CliResultEnvelopeInput), /JSON data/)
})

test("P8-R1 runtime and schema agree on representative accepted and rejected JSON values", () => {
  const accepted = [
    full(applyInput()),
    full(askInput()),
    full(solveStoppedInput()),
    full(solveCompletedInput("NOT_READY")),
    full(solveCompletedInput("PROVEN_READY")),
  ]

  const rejected: MutableRecord[] = []
  const wrongProtocol = full(askInput()); wrongProtocol.protocol = "kodac.other"; rejected.push(wrongProtocol)
  const wrongVersion = full(askInput()); wrongVersion.version = 2; rejected.push(wrongVersion)
  const unknownField = full(askInput()); unknownField.payload.extra = true; rejected.push(unknownField)
  const wrongProof = full(solveCompletedInput("PROVEN_READY")); wrongProof.proven = false; rejected.push(wrongProof)
  const readyReason = full(solveCompletedInput("PROVEN_READY")); readyReason.payload.reasons = ["bad reason"]; rejected.push(readyReason)
  const missingNotReadyReason = full(solveCompletedInput("NOT_READY")); missingNotReadyReason.payload.reasons = []; rejected.push(missingNotReadyReason)
  const wrongRisk = full(solveCompletedInput("NOT_READY")); wrongRisk.payload.verificationRisk = "critical"; rejected.push(wrongRisk)
  const wrongStop = full(solveStoppedInput()); wrongStop.payload.reason = "timeout"; rejected.push(wrongStop)
  const completedStop = full(solveStoppedInput()); completedStop.payload.reason = "completed"; rejected.push(completedStop)
  const badCounter = full(solveStoppedInput()); badCounter.payload.budget.turnsUsed = 1.5; rejected.push(badCounter)
  const blankProvider = full(askInput()); blankProvider.payload.provider = "   "; rejected.push(blankProvider)
  const multilineNul = full(askInput()); multilineNul.payload.assistant = "ok\nno\u0000pe"; rejected.push(multilineNul)

  for (const candidate of accepted) {
    assert.equal(runtimeAccepts(candidate), true)
    assert.equal(schemaAccepts(schema, candidate), true)
  }
  for (const candidate of rejected) {
    assert.equal(runtimeAccepts(candidate), false)
    assert.equal(schemaAccepts(schema, candidate), false)
  }
})

test("P8-R1 source stays pure and does not acquire execution, network, persistence, or product-wiring imports", () => {
  const forbidden = [
    "node:fs",
    "node:child_process",
    "node:net",
    "node:http",
    "node:https",
    "ExecutionGateway",
    "ProviderRegistry",
    "JsonlReceiptLedger",
    "runCli",
    "cli.ts",
    "package.json",
  ]
  for (const marker of forbidden) assert.equal(sourceText.includes(marker), false, marker)
  assert.match(sourceText, /node:util/)
})
