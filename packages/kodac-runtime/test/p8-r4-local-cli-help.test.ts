import assert from "node:assert/strict"
import { mkdtemp, readdir, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { runCli } from "../src/cli.ts"

function capture(): { out: string[]; err: string[]; io: { stdout(line: string): void; stderr(line: string): void } } {
  const out: string[] = []
  const err: string[] = []
  return { out, err, io: { stdout(line) { out.push(line) }, stderr(line) { err.push(line) } } }
}

const EXPECTED_HELP = [
  "Kodac CLI",
  "",
  "Usage:",
  "  kodac apply-patch <patch-file> [--workspace <dir>] [--evidence-dir <dir>] [--evidence-retention-days <n>] [--json]",
  "  kodac ask <prompt> [--provider fixture] [--model <id>] [--workspace <dir>] [--evidence-dir <dir>] [--evidence-retention-days <n>] [--static-fallback] [--json]",
  "  kodac solve <task> [--provider fixture] [--model <id>] [--approve-writes] [--approve-verification] [--verify-command <json>] [--max-turns <n>] [--max-tool-calls <n>] [--max-elapsed-ms <n>] [--max-failures <n>] [--workspace <dir>] [--evidence-dir <dir>] [--evidence-retention-days <n>] [--json]",
  "",
  "Commands:",
  "  apply-patch  Apply an explicit patch through the existing guarded patch path.",
  "  ask          Run the existing read-oriented model request path; --static-fallback is human-output-only.",
  "  solve        Run the existing bounded agent-loop solve path.",
].join("\n")

test("P8-R4 exact --help is deterministic, side-effect-free local discoverability", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "kodac-p8-r4-help-"))
  try {
    const captured = capture()
    const code = await runCli(["--help"], captured.io, workspace, {
      modelProvider: {
        name: "must-not-run",
        async generate() { throw new Error("help must not invoke a model provider") },
      },
    })

    assert.equal(code, 0)
    assert.deepEqual(captured.err, [])
    assert.deepEqual(captured.out, [EXPECTED_HELP])
    assert.deepEqual(await readdir(workspace), [])

    const help = captured.out[0]
    for (const command of ["apply-patch", "ask", "solve"]) assert.match(help, new RegExp(`\\b${command}\\b`))
    assert.match(help, /--static-fallback/)
    assert.match(help, /--static-fallback is human-output-only/)
    for (const unauthorized of ["--version", "GitHub", "MCP", "daemon", "SDK", "publication", "release"]) {
      assert.doesNotMatch(help, new RegExp(unauthorized, "i"))
    }
  } finally {
    await rm(workspace, { recursive: true, force: true })
  }
})

test("P8-R4 does not admit help or version aliases and preserves usage failures", async () => {
  for (const argv of [[], ["-h"], ["help"], ["--version"], ["version"], ["unknown-command"]]) {
    const captured = capture()
    const code = await runCli(argv, captured.io)
    assert.equal(code, 1, `unexpected code for ${JSON.stringify(argv)}`)
    assert.deepEqual(captured.out, [])
    assert.equal(captured.err.length, 1)
    assert.match(captured.err[0], /^Usage: kodac apply-patch /)
  }
})
