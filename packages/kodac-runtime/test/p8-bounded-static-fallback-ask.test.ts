import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { createHash } from "node:crypto"
import { access, mkdtemp, readFile, readdir, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import test from "node:test"

import { runCli } from "../src/cli.ts"
import {
  ModelProviderError,
  type ModelProvider,
  type ModelProviderRequest,
  type ModelProviderResponse,
} from "../src/model/provider.ts"

const STATIC_FALLBACK_TEXT = "Kodac static fallback: requested model provider is unavailable because required credentials are not configured."

type EventRow = { type: string; payload: Record<string, unknown> }

function capture(): { out: string[]; err: string[]; io: { stdout(line: string): void; stderr(line: string): void } } {
  const out: string[] = []
  const err: string[] = []
  return { out, err, io: { stdout(line) { out.push(line) }, stderr(line) { err.push(line) } } }
}

class ScriptedProvider implements ModelProvider {
  readonly name: string
  private readonly outcome: ModelProviderResponse | Error
  calls = 0

  constructor(name: string, outcome: ModelProviderResponse | Error) {
    this.name = name
    this.outcome = outcome
  }

  async generate(_request: ModelProviderRequest): Promise<ModelProviderResponse> {
    this.calls += 1
    if (this.outcome instanceof Error) throw this.outcome
    return {
      ...this.outcome,
      toolCalls: this.outcome.toolCalls.map((call) => ({ ...call })),
    }
  }
}

function successfulResponse(assistant: string): ModelProviderResponse {
  return { assistant, toolCalls: [], finishReason: "stop" }
}

async function readOnlySessionEvents(evidenceRoot: string): Promise<EventRow[]> {
  const sessions = await readdir(evidenceRoot)
  assert.equal(sessions.length, 1)
  const text = await readFile(join(evidenceRoot, sessions[0], "events.jsonl"), "utf8")
  return text.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line) as EventRow)
}

async function runAskCase(input: {
  provider: ModelProvider
  requestedProvider?: string
  model?: string
  prompt?: string
  staticFallback?: boolean
  json?: boolean
}): Promise<{ code: number; out: string[]; err: string[]; events: EventRow[]; root: string }> {
  const root = await mkdtemp(join(tmpdir(), "kodac-p8-static-fallback-"))
  const evidence = join(root, "evidence")
  const captured = capture()
  const argv = [
    "ask",
    input.prompt ?? "private fallback prompt",
    "--provider",
    input.requestedProvider ?? input.provider.name,
    "--model",
    input.model ?? "test/model",
    "--workspace",
    root,
    "--evidence-dir",
    evidence,
  ]
  if (input.staticFallback) argv.push("--static-fallback")
  if (input.json) argv.push("--json")
  const code = await runCli(argv, captured.io, root, { modelProvider: input.provider })
  const events = await readOnlySessionEvents(evidence)
  return { code, out: captured.out, err: captured.err, events, root }
}

function gitTextBlobSha1(text: string): string {
  const canonical = text.replace(/\r\n/g, "\n")
  const body = Buffer.from(canonical, "utf8")
  return createHash("sha1").update(`blob ${body.byteLength}\0`).update(body).digest("hex")
}

test("P8 bounded static fallback handles exact openai credential absence with deterministic terminal evidence", async () => {
  const provider = new ScriptedProvider(
    "openai",
    new ModelProviderError("credential_missing", "credential secret must not leak"),
  )
  const prompt = "private prompt must not appear in fallback text"
  const model = "private-model-id"
  const result = await runAskCase({ provider, model, prompt, staticFallback: true })
  try {
    assert.equal(result.code, 0)
    assert.deepEqual(result.err, [])
    assert.equal(result.out[0], STATIC_FALLBACK_TEXT)
    assert.match(result.out[1], /^Evidence: /)
    assert.equal(provider.calls, 1)
    assert.equal(result.out[0].includes(prompt), false)
    assert.equal(result.out[0].includes("openai"), false)
    assert.equal(result.out[0].includes(model), false)
    assert.equal(result.out[0].includes("credential secret"), false)

    const types = result.events.map((event) => event.type)
    assert.ok(types.includes("model.failed"))
    assert.equal(types.includes("session.failed"), false)
    const completed = result.events.filter((event) => event.type === "session.completed")
    assert.equal(completed.length, 1)
    assert.deepEqual(completed[0].payload, { status: "complete", mode: "static_fallback" })
  } finally {
    await rm(result.root, { recursive: true, force: true })
  }
})

test("P8 bounded static fallback admits only the exact provider and credential-code pairs", async () => {
  const eligible = new ScriptedProvider(
    "openai-compatible",
    new ModelProviderError("credentials_missing", "missing compatible credential"),
  )
  const allowed = await runAskCase({ provider: eligible, staticFallback: true })
  try {
    assert.equal(allowed.code, 0)
    assert.deepEqual(allowed.err, [])
    assert.equal(allowed.out[0], STATIC_FALLBACK_TEXT)
  } finally {
    await rm(allowed.root, { recursive: true, force: true })
  }

  for (const [name, code] of [
    ["openai", "credentials_missing"],
    ["openai-compatible", "credential_missing"],
  ] as const) {
    const provider = new ScriptedProvider(name, new ModelProviderError(code, `mismatched ${code}`))
    const rejected = await runAskCase({ provider, staticFallback: true })
    try {
      assert.equal(rejected.code, 1)
      assert.deepEqual(rejected.out, [])
      assert.match(rejected.err[0], /mismatched/)
      assert.ok(rejected.events.some((event) => event.type === "session.failed"))
      assert.equal(rejected.events.some((event) => event.type === "session.completed"), false)
    } finally {
      await rm(rejected.root, { recursive: true, force: true })
    }
  }
})

test("P8 bounded static fallback preserves generic and non-credential provider failures", async () => {
  const errors: Error[] = [
    new Error("generic provider failure"),
    new ModelProviderError("http_error", "http failed", { retryable: true, status: 503 }),
    new ModelProviderError("network_error", "network failed", { retryable: true }),
    new ModelProviderError("incomplete_stream", "stream failed", { retryable: true }),
    new ModelProviderError("aborted", "aborted", { retryable: false }),
    new ModelProviderError("other_code", "other provider failure", { retryable: true }),
  ]

  for (const error of errors) {
    const provider = new ScriptedProvider("openai", error)
    const result = await runAskCase({ provider, staticFallback: true })
    try {
      assert.equal(result.code, 1, error.message)
      assert.deepEqual(result.out, [])
      assert.equal(result.err.length, 1)
      assert.ok(result.events.some((event) => event.type === "model.failed"), error.message)
      assert.ok(result.events.some((event) => event.type === "session.failed"), error.message)
      assert.equal(result.events.some((event) => event.type === "session.completed"), false, error.message)
    } finally {
      await rm(result.root, { recursive: true, force: true })
    }
  }
})

test("P8 bounded static fallback leaves unknown providers fail closed", async () => {
  const root = await mkdtemp(join(tmpdir(), "kodac-p8-static-unknown-"))
  const evidence = join(root, "evidence")
  const captured = capture()
  try {
    const code = await runCli(
      ["ask", "private prompt", "--provider", "missing", "--static-fallback", "--workspace", root, "--evidence-dir", evidence],
      captured.io,
      root,
    )
    assert.equal(code, 1)
    assert.deepEqual(captured.out, [])
    assert.match(captured.err[0], /Unknown provider: missing/)
    const events = await readOnlySessionEvents(evidence)
    assert.ok(events.some((event) => event.type === "session.failed"))
    assert.equal(events.some((event) => event.type === "session.completed"), false)
    assert.equal(events.some((event) => event.type === "model.request.snapshot"), false)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("P8 bounded static fallback does not fabricate model.failed when built-in credential failure occurs before model dispatch", async () => {
  const root = await mkdtemp(join(tmpdir(), "kodac-p8-static-pre-dispatch-"))
  const evidence = join(root, "evidence")
  const cliPath = fileURLToPath(new URL("../src/cli.ts", import.meta.url))
  const childEnv: NodeJS.ProcessEnv = {
    NODE_NO_WARNINGS: "1",
    PATH: process.env.PATH ?? "",
    SystemRoot: process.env.SystemRoot ?? "",
    WINDIR: process.env.WINDIR ?? "",
    TMPDIR: process.env.TMPDIR ?? "",
    TMP: process.env.TMP ?? "",
    TEMP: process.env.TEMP ?? "",
  }

  try {
    const childResult = await new Promise<{ code: number | null; stdout: string; stderr: string }>((resolve, reject) => {
      const child = spawn(
        process.execPath,
        [
          "--experimental-strip-types",
          cliPath,
          "ask",
          "private prompt",
          "--provider",
          "openai-compatible",
          "--model",
          "test/model",
          "--static-fallback",
          "--workspace",
          root,
          "--evidence-dir",
          evidence,
        ],
        { cwd: root, env: childEnv, stdio: ["ignore", "pipe", "pipe"] },
      )
      let stdout = ""
      let stderr = ""
      child.stdout.setEncoding("utf8")
      child.stderr.setEncoding("utf8")
      child.stdout.on("data", (chunk: string) => { stdout += chunk })
      child.stderr.on("data", (chunk: string) => { stderr += chunk })
      child.once("error", reject)
      child.once("close", (code) => resolve({ code, stdout, stderr }))
    })

    assert.equal(childResult.code, 0)
    assert.equal(childResult.stderr, "")
    assert.equal(childResult.stdout.split(/\r?\n/)[0], STATIC_FALLBACK_TEXT)
    const events = await readOnlySessionEvents(evidence)
    assert.equal(events.some((event) => event.type === "model.failed"), false)
    const completed = events.filter((event) => event.type === "session.completed")
    assert.equal(completed.length, 1)
    assert.deepEqual(completed[0].payload, { status: "complete", mode: "static_fallback" })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("P8 bounded static fallback remains opt-in for an otherwise eligible credential failure", async () => {
  const provider = new ScriptedProvider(
    "openai",
    new ModelProviderError("credential_missing", "credential unavailable"),
  )
  const result = await runAskCase({ provider, staticFallback: false })
  try {
    assert.equal(result.code, 1)
    assert.deepEqual(result.out, [])
    assert.match(result.err[0], /credential unavailable/)
    assert.ok(result.events.some((event) => event.type === "model.failed"))
    assert.ok(result.events.some((event) => event.type === "session.failed"))
    assert.equal(result.events.some((event) => event.type === "session.completed"), false)
  } finally {
    await rm(result.root, { recursive: true, force: true })
  }
})

test("P8 bounded static fallback does not alter a successful provider request", async () => {
  const provider = new ScriptedProvider("fixture", successfulResponse("ordinary provider result"))
  const result = await runAskCase({ provider, staticFallback: true })
  try {
    assert.equal(result.code, 0)
    assert.deepEqual(result.err, [])
    assert.equal(result.out[0], "ordinary provider result")
    assert.notEqual(result.out[0], STATIC_FALLBACK_TEXT)
    const completed = result.events.filter((event) => event.type === "session.completed")
    assert.equal(completed.length, 1)
    assert.equal(completed[0].payload.mode, "model_turn")
    assert.equal(completed[0].payload.provider, "fixture")
    assert.equal(result.events.some((event) => event.payload.mode === "static_fallback"), false)
  } finally {
    await rm(result.root, { recursive: true, force: true })
  }
})

test("P8 bounded static fallback rejects invalid command and JSON combinations before session creation", async () => {
  for (const argv of [
    ["ask", "task", "--static-fallback", "--json"],
    ["solve", "task", "--static-fallback"],
    ["apply-patch", "missing.patch", "--static-fallback"],
  ]) {
    const root = await mkdtemp(join(tmpdir(), "kodac-p8-static-parse-"))
    const evidence = join(root, "evidence")
    const captured = capture()
    const provider = new ScriptedProvider("fixture", new Error("provider must not run"))
    try {
      const code = await runCli([...argv, "--workspace", root, "--evidence-dir", evidence], captured.io, root, { modelProvider: provider })
      assert.equal(code, 1, JSON.stringify(argv))
      assert.deepEqual(captured.out, [])
      assert.equal(captured.err.length, 1)
      assert.equal(provider.calls, 0)
      await assert.rejects(() => access(evidence), { code: "ENOENT" })
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  }
})

test("P8 bounded static fallback keeps ordinary ask JSON payload shape unchanged", async () => {
  const provider = new ScriptedProvider("fixture", successfulResponse("json result"))
  const result = await runAskCase({ provider, json: true })
  try {
    assert.equal(result.code, 0)
    assert.deepEqual(result.err, [])
    assert.equal(result.out.length, 1)
    const envelope = JSON.parse(result.out[0]) as Record<string, unknown> & { payload: Record<string, unknown> }
    assert.equal(envelope.protocol, "kodac.cli-result")
    assert.equal(envelope.version, 1)
    assert.equal(envelope.command, "ask")
    assert.equal(envelope.status, "COMPLETE")
    assert.equal(envelope.proven, false)
    assert.deepEqual(Object.keys(envelope.payload).sort(), ["assistant", "model", "provider"])
    assert.equal(Object.hasOwn(envelope.payload, "fallback"), false)
  } finally {
    await rm(result.root, { recursive: true, force: true })
  }
})

test("P8 bounded static fallback preserves forbidden session event and P8 envelope source identities", async () => {
  const sessionSource = await readFile(new URL("../src/session/session.ts", import.meta.url), "utf8")
  const eventSource = await readFile(new URL("../src/protocol/event.ts", import.meta.url), "utf8")
  const envelopeSource = await readFile(new URL("../src/product/p8-cli-result-envelope.ts", import.meta.url), "utf8")

  assert.equal(gitTextBlobSha1(sessionSource), "d5f2334b18e89f7bac2bac7422ed8a33669b8afd")
  assert.equal(gitTextBlobSha1(eventSource), "c357a2cdee4d94bfa083e92210c7e5ad59c16d29")
  assert.equal(gitTextBlobSha1(envelopeSource), "943b27c5fefb449e3d56955f113bcd420aa35de7")
})
