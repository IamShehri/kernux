import assert from "node:assert/strict"
import { mkdir, mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { runCli } from "../src/cli.ts"
import { validateP8CliResultEnvelope } from "../src/product/p8-cli-result-envelope.ts"

function capture(): { out: string[]; err: string[]; io: { stdout(line: string): void; stderr(line: string): void } } {
  const out: string[] = []
  const err: string[] = []
  return { out, err, io: { stdout(line) { out.push(line) }, stderr(line) { err.push(line) } } }
}

const ENVELOPE_KEYS = ["protocol", "version", "command", "sessionId", "status", "proven", "evidence", "payload"]

test("P8-R2 wires apply-patch --json through the exact P8-R1 envelope without legacy aliases", async () => {
  const root = await mkdtemp(join(tmpdir(), "kodac-p8-r2-apply-"))
  const workspace = join(root, "workspace")
  const evidence = join(root, "evidence")
  const patchFile = join(root, "task.patch")
  await mkdir(workspace, { recursive: true })
  await writeFile(patchFile, ["*** Begin Patch", "*** Add File: hello.txt", "+hello", "*** End Patch", ""].join("\n"), "utf8")

  const captured = capture()
  const code = await runCli(
    ["apply-patch", patchFile, "--workspace", workspace, "--evidence-dir", evidence, "--json"],
    captured.io,
    root,
  )

  assert.equal(code, 0, captured.err.join("\n"))
  assert.deepEqual(captured.err, [])
  assert.equal(captured.out.length, 1)
  const value = JSON.parse(captured.out[0]) as Record<string, unknown>
  assert.deepEqual(Object.keys(value), ENVELOPE_KEYS)
  const envelope = validateP8CliResultEnvelope(value)
  assert.equal(envelope.protocol, "kodac.cli-result")
  assert.equal(envelope.version, 1)
  assert.equal(envelope.command, "apply-patch")
  assert.equal(envelope.status, "PATCH_APPLIED")
  assert.equal(envelope.proven, false)
  assert.deepEqual(envelope.payload.affected, { added: ["hello.txt"], modified: [], deleted: [] })
  assert.match(envelope.payload.receiptId, /\S+/)
  assert.match(envelope.evidence.events, /events\.jsonl$/)
  assert.match(envelope.evidence.receipts, /receipts\.jsonl$/)
  assert.equal(Object.hasOwn(value, "affected"), false)
  assert.equal(Object.hasOwn(value, "receiptId"), false)
})

test("P8-R2 wires ask --json through the exact P8-R1 envelope without legacy aliases", async () => {
  const root = await mkdtemp(join(tmpdir(), "kodac-p8-r2-ask-"))
  const evidence = join(root, "evidence")
  const captured = capture()
  const code = await runCli(
    ["ask", "hello envelope", "--workspace", root, "--evidence-dir", evidence, "--json"],
    captured.io,
    root,
  )

  assert.equal(code, 0, captured.err.join("\n"))
  assert.deepEqual(captured.err, [])
  assert.equal(captured.out.length, 1)
  const value = JSON.parse(captured.out[0]) as Record<string, unknown>
  assert.deepEqual(Object.keys(value), ENVELOPE_KEYS)
  const envelope = validateP8CliResultEnvelope(value)
  assert.equal(envelope.protocol, "kodac.cli-result")
  assert.equal(envelope.version, 1)
  assert.equal(envelope.command, "ask")
  assert.equal(envelope.status, "COMPLETE")
  assert.equal(envelope.proven, false)
  assert.equal(envelope.payload.provider, "fixture")
  assert.equal(envelope.payload.model, "fixture/deterministic-v1")
  assert.equal(envelope.payload.assistant, "[fixture:fixture/deterministic-v1] hello envelope")
  assert.match(envelope.evidence.events, /events\.jsonl$/)
  assert.equal(Object.hasOwn(value, "provider"), false)
  assert.equal(Object.hasOwn(value, "model"), false)
  assert.equal(Object.hasOwn(value, "assistant"), false)
})

test("P8-R2 preserves human-readable apply-patch and ask output", async () => {
  const root = await mkdtemp(join(tmpdir(), "kodac-p8-r2-human-"))
  const workspace = join(root, "workspace")
  const evidence = join(root, "apply-evidence")
  const patchFile = join(root, "task.patch")
  await mkdir(workspace, { recursive: true })
  await writeFile(patchFile, ["*** Begin Patch", "*** Add File: human.txt", "+human", "*** End Patch", ""].join("\n"), "utf8")

  const apply = capture()
  const applyCode = await runCli(
    ["apply-patch", patchFile, "--workspace", workspace, "--evidence-dir", evidence],
    apply.io,
    root,
  )
  assert.equal(applyCode, 0, apply.err.join("\n"))
  assert.ok(apply.out.includes("PATCH APPLIED — VERIFICATION NOT RUN"))
  assert.equal(apply.out.some((line) => line.includes("kodac.cli-result")), false)

  const ask = capture()
  const askEvidence = join(root, "ask-evidence")
  const askCode = await runCli(
    ["ask", "human output", "--workspace", root, "--evidence-dir", askEvidence],
    ask.io,
    root,
  )
  assert.equal(askCode, 0, ask.err.join("\n"))
  assert.equal(ask.out[0], "[fixture:fixture/deterministic-v1] human output")
  assert.match(ask.out[1], /^Evidence: .*events\.jsonl$/)
  assert.equal(ask.out.some((line) => line.includes("kodac.cli-result")), false)
})
