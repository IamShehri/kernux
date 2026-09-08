import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { runCli } from "../src/cli.ts"
import type { ModelProvider, ModelProviderRequest, ModelProviderResponse } from "../src/model/provider.ts"
import { P8_CLI_RESULT_LIMITS, validateP8CliResultEnvelope } from "../src/product/p8-cli-result-envelope.ts"

const ENVELOPE_KEYS = ["protocol", "version", "command", "sessionId", "status", "proven", "evidence", "payload"]

function assertExactEnvelopeKeySet(value: Record<string, unknown>): void {
  assert.deepEqual([...Object.keys(value)].sort(), [...ENVELOPE_KEYS].sort())
}

function capture(): { out: string[]; err: string[]; io: { stdout(line: string): void; stderr(line: string): void } } {
  const out: string[] = []
  const err: string[] = []
  return { out, err, io: { stdout(line) { out.push(line) }, stderr(line) { err.push(line) } } }
}

class FailingProvider implements ModelProvider {
  readonly name = "fixture"
  async generate(_request: ModelProviderRequest): Promise<ModelProviderResponse> {
    throw new Error("injected P8-R3 failure")
  }
}

class ScriptedProvider implements ModelProvider {
  readonly name = "fixture"
  private readonly responses: ModelProviderResponse[]
  constructor(responses: ModelProviderResponse[]) { this.responses = [...responses] }
  async generate(_request: ModelProviderRequest): Promise<ModelProviderResponse> {
    const response = this.responses.shift()
    if (!response) throw new Error("No scripted response remains")
    return response
  }
}

function assertNoLegacySolveAliases(value: Record<string, unknown>): void {
  for (const key of ["provider", "model", "assistant", "budget", "verificationRisk", "verificationCommands", "warnings", "reasons", "reason"]) {
    assert.equal(Object.hasOwn(value, key), false, key)
  }
}

test("P8-R3 solve STOPPED --json emits the exact canonical solve envelope and preserves exit code 2", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "kodac-p8-r3-stopped-workspace-"))
  const evidence = await mkdtemp(join(tmpdir(), "kodac-p8-r3-stopped-evidence-"))
  try {
    const captured = capture()
    const code = await runCli(
      ["solve", "stop safely", "--workspace", workspace, "--evidence-dir", evidence, "--max-failures", "1", "--json"],
      captured.io,
      workspace,
      { modelProvider: new FailingProvider() },
    )
    assert.equal(code, 2, captured.err.join("\n"))
    assert.deepEqual(captured.err, [])
    assert.equal(captured.out.length, 1)
    const value = JSON.parse(captured.out[0]) as Record<string, unknown>
    assertExactEnvelopeKeySet(value)
    const envelope = validateP8CliResultEnvelope(value)
    assert.equal(envelope.command, "solve")
    assert.equal(envelope.status, "STOPPED")
    assert.equal(envelope.proven, false)
    assert.equal(envelope.payload.reason, "max_failures")
    assert.match(envelope.evidence.events, /events\.jsonl$/)
    assert.match(envelope.evidence.receipts, /receipts\.jsonl$/)
    assertNoLegacySolveAliases(value)
  } finally {
    await rm(workspace, { recursive: true, force: true })
    await rm(evidence, { recursive: true, force: true })
  }
})

test("P8-R3 solve NOT_READY --json emits a bounded canonical envelope, preserves full proof reasons, and preserves exit code 3", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "kodac-p8-r3-not-ready-workspace-"))
  const evidence = await mkdtemp(join(tmpdir(), "kodac-p8-r3-not-ready-evidence-"))
  try {
    const run = async () => {
      const captured = capture()
      const code = await runCli(["solve", "inspect this", "--workspace", workspace, "--evidence-dir", evidence, "--json"], captured.io, workspace)
      assert.equal(code, 3, captured.err.join("\n"))
      assert.deepEqual(captured.err, [])
      assert.equal(captured.out.length, 1)
      const value = JSON.parse(captured.out[0]) as Record<string, unknown>
      assertExactEnvelopeKeySet(value)
      const envelope = validateP8CliResultEnvelope(value)
      assert.equal(envelope.command, "solve")
      assert.equal(envelope.status, "NOT_READY")
      assert.equal(envelope.proven, false)
      assert.equal(envelope.payload.provider, "fixture")
      assert.equal(envelope.payload.model, "fixture/deterministic-v1")
      assert.ok(envelope.payload.reasons.length > 0)
      assert.match(envelope.evidence.plan, /verification-plan\.json$/)
      assert.match(envelope.evidence.proof, /proof\.json$/)
      assertNoLegacySolveAliases(value)
      return envelope
    }

    const first = await run()
    const proof = JSON.parse(await readFile(first.evidence.proof, "utf8")) as { doneGate: { reasons: string[] } }
    const plan = JSON.parse(await readFile(first.evidence.plan, "utf8")) as { warnings: string[] }
    assert.deepEqual(first.payload.warnings, plan.warnings)
    assert.equal(first.payload.reasons.length, proof.doneGate.reasons.length)

    const oversizedIndex = proof.doneGate.reasons.findIndex((reason) => Array.from(reason).length > P8_CLI_RESULT_LIMITS.maxMessageCodePoints)
    assert.ok(oversizedIndex >= 0)
    for (let index = 0; index < proof.doneGate.reasons.length; index += 1) {
      const source = proof.doneGate.reasons[index]
      const projected = first.payload.reasons[index]
      if (Array.from(source).length <= P8_CLI_RESULT_LIMITS.maxMessageCodePoints) assert.equal(projected, source)
    }

    const original = proof.doneGate.reasons[oversizedIndex]
    const projected = first.payload.reasons[oversizedIndex]
    const originalCodePoints = Array.from(original)
    const digest = createHash("sha256").update(original, "utf8").digest("hex")
    const suffix = `\n[P8_BOUNDED_PROJECTION originalCodePoints=${originalCodePoints.length} sha256=${digest}]`
    const prefixBudget = P8_CLI_RESULT_LIMITS.maxMessageCodePoints - Array.from(suffix).length
    assert.equal(Array.from(projected).length, P8_CLI_RESULT_LIMITS.maxMessageCodePoints)
    assert.equal(projected, `${originalCodePoints.slice(0, prefixBudget).join("")}${suffix}`)
    assert.ok(original.length > projected.length)

    const second = await run()
    assert.equal(second.payload.reasons[oversizedIndex], projected)
  } finally {
    await rm(workspace, { recursive: true, force: true })
    await rm(evidence, { recursive: true, force: true })
  }
})

test("P8-R3 solve PROVEN_READY --json emits the completed canonical envelope and preserves exit code 0", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "kodac-p8-r3-ready-workspace-"))
  const evidence = await mkdtemp(join(tmpdir(), "kodac-p8-r3-ready-evidence-"))
  try {
    execFileSync("git", ["init", "-q"], { cwd: workspace })
    execFileSync("git", ["config", "user.email", "kodac-test@example.com"], { cwd: workspace })
    execFileSync("git", ["config", "user.name", "Kodac Test"], { cwd: workspace })
    await writeFile(join(workspace, "note.txt"), "alpha\n", "utf8")
    await writeFile(join(workspace, "verify.test.js"), "import assert from 'node:assert/strict'; import { readFile } from 'node:fs/promises'; import test from 'node:test'; test('note', async () => assert.equal(await readFile('note.txt','utf8'), 'ALPHA\\n'));\n", "utf8")
    execFileSync("git", ["add", "note.txt", "verify.test.js"], { cwd: workspace })
    execFileSync("git", ["commit", "-qm", "fixture"], { cwd: workspace })

    const patchText = "*** Begin Patch\n*** Update File: note.txt\n@@\n-alpha\n+ALPHA\n*** End Patch"
    const provider = new ScriptedProvider([
      { assistant: "", finishReason: "tool_calls", toolCalls: [{ id: "patch-1", name: "repo.apply_patch", input: { patchText } }] },
      { assistant: "done", finishReason: "stop", toolCalls: [] },
    ])
    const command = JSON.stringify({ id: "tests", category: "tests", executable: "node", args: ["--test", "verify.test.js"] })
    const captured = capture()
    const code = await runCli(
      ["solve", "update note", "--workspace", workspace, "--evidence-dir", evidence, "--approve-writes", "--approve-verification", "--verify-command", command, "--json"],
      captured.io,
      workspace,
      { modelProvider: provider },
    )
    assert.equal(code, 0, captured.err.join("\n"))
    assert.deepEqual(captured.err, [])
    assert.equal(captured.out.length, 1)
    const value = JSON.parse(captured.out[0]) as Record<string, unknown>
    assertExactEnvelopeKeySet(value)
    const envelope = validateP8CliResultEnvelope(value)
    assert.equal(envelope.command, "solve")
    assert.equal(envelope.status, "PROVEN_READY")
    assert.equal(envelope.proven, true)
    assert.equal(envelope.payload.assistant, "done")
    assert.deepEqual(envelope.payload.reasons, [])
    const proof = JSON.parse(await readFile(envelope.evidence.proof, "utf8")) as { doneGate: { status: string } }
    assert.equal(proof.doneGate.status, "PROVEN_READY")
    assertNoLegacySolveAliases(value)
  } finally {
    await rm(workspace, { recursive: true, force: true })
    await rm(evidence, { recursive: true, force: true })
  }
})

test("P8-R3 preserves human-readable solve output and error exit code behavior", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "kodac-p8-r3-human-workspace-"))
  const evidence = await mkdtemp(join(tmpdir(), "kodac-p8-r3-human-evidence-"))
  try {
    const human = capture()
    const humanCode = await runCli(["solve", "inspect this", "--workspace", workspace, "--evidence-dir", evidence], human.io, workspace)
    assert.equal(humanCode, 3, human.err.join("\n"))
    assert.ok(human.out.some((line) => line.includes("[fixture:fixture/deterministic-v1] inspect this")))
    assert.ok(human.out.some((line) => line.startsWith("Agent loop complete: ")))
    assert.ok(human.out.some((line) => line.startsWith("Verification plan: ")))
    assert.ok(human.out.some((line) => line.startsWith("Proof: ")))
    assert.ok(human.out.includes("NOT READY"))
    assert.equal(human.out.some((line) => line.includes("kodac.cli-result")), false)

    const invalid = capture()
    const invalidCode = await runCli(["solve", "inspect this", "--max-turns", "0"], invalid.io, workspace)
    assert.equal(invalidCode, 1)
    assert.match(invalid.err.join("\n"), /--max-turns must be a positive integer/)
  } finally {
    await rm(workspace, { recursive: true, force: true })
    await rm(evidence, { recursive: true, force: true })
  }
})
