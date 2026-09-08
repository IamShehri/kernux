import { createHash, randomUUID } from "node:crypto"
import { readFile } from "node:fs/promises"
import { homedir } from "node:os"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { BoundedAgentLoop, DEFAULT_AGENT_LOOP_LIMITS, type AgentLoopLimits } from "./agent/loop.ts"
import { NodeWorkspaceFileSystem } from "./edit/filesystem.ts"
import { JsonlReceiptLedger, readReceiptLedger } from "./evidence/ledger.ts"
import {
  DEFAULT_EVIDENCE_RETENTION_DAYS,
  MAX_EVIDENCE_RETENTION_DAYS,
  prepareEvidenceSession,
  writePrivateUtf8File,
} from "./evidence/store.ts"
import { ExecutionGateway } from "./execution/gateway.ts"
import { FixtureModelProvider } from "./model/fixture.ts"
import { ProviderRegistry, type ModelProvider } from "./model/provider.ts"
import { AgentTurnRunner } from "./model/turn.ts"
import { JsonlEventSink } from "./protocol/event.ts"
import { buildP8CliResultEnvelope, P8_CLI_RESULT_LIMITS } from "./product/p8-cli-result-envelope.ts"
import { RuntimeOrchestrator } from "./runtime/orchestrator.ts"
import { RuntimeSession } from "./session/session.ts"
import { createApplyPatchTool, type ApplyPatchToolInput, type ApplyPatchToolOutput } from "./tools/apply-patch.ts"
import { ToolRegistry } from "./tools/registry.ts"
import { registerWorkspaceToolSurface } from "./tools/workspace-surface.ts"
import { fixedPolicy } from "./trust/policy.ts"
import { parseVerificationCommandSpec } from "./verification/commands.ts"
import { DoneGate, type DoneGateResult } from "./verification/done-gate.ts"
import { runVerificationEngine } from "./verification/engine.ts"
import { planVerification, type VerificationPlan } from "./verification/planner.ts"
import type { VerificationCommandSpec, VerificationReport } from "./verification/types.ts"

export interface CliIO {
  stdout(line: string): void
  stderr(line: string): void
}

export interface CliRuntimeOptions {
  modelProvider?: ModelProvider
}

interface CommonArgs {
  workspace: string
  evidenceDir?: string
  evidenceRetentionDays: number
  json: boolean
}

interface ApplyPatchArgs extends CommonArgs {
  command: "apply-patch"
  patchFile: string
}

interface AskArgs extends CommonArgs {
  command: "ask"
  prompt: string
  provider: string
  model: string
}

interface SolveArgs extends CommonArgs {
  command: "solve"
  prompt: string
  provider: string
  model: string
  approveWrites: boolean
  approveVerification: boolean
  verificationCommands: VerificationCommandSpec[]
  limits: AgentLoopLimits
}

type CliArgs = ApplyPatchArgs | AskArgs | SolveArgs

type ActivateSession = (session: RuntimeSession) => void
type ActivateEvidenceLease = (release: () => Promise<void>) => void

const CLI_HELP = [
  "Kodac CLI",
  "",
  "Usage:",
  "  kodac apply-patch <patch-file> [--workspace <dir>] [--evidence-dir <dir>] [--evidence-retention-days <n>] [--json]",
  "  kodac ask <prompt> [--provider fixture] [--model <id>] [--workspace <dir>] [--evidence-dir <dir>] [--evidence-retention-days <n>] [--json]",
  "  kodac solve <task> [--provider fixture] [--model <id>] [--approve-writes] [--approve-verification] [--verify-command <json>] [--max-turns <n>] [--max-tool-calls <n>] [--max-elapsed-ms <n>] [--max-failures <n>] [--workspace <dir>] [--evidence-dir <dir>] [--evidence-retention-days <n>] [--json]",
  "",
  "Commands:",
  "  apply-patch  Apply an explicit patch through the existing guarded patch path.",
  "  ask          Run the existing read-oriented model request path.",
  "  solve        Run the existing bounded agent-loop solve path.",
].join("\n")

function workspaceKey(workspace: string): string {
  return createHash("sha256").update(resolve(workspace), "utf8").digest("hex").slice(0, 16)
}

function defaultEvidenceRoot(workspace: string): string {
  return join(homedir(), ".kodac", "evidence", workspaceKey(workspace))
}

function parsePositiveInteger(option: string, value: string): number {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`${option} must be a positive integer`)
  return parsed
}

function parseCommonOptions(argv: string[], startIndex: number, cwd: string, target: CommonArgs & Record<string, unknown>): void {
  for (let index = startIndex; index < argv.length; index++) {
    const token = argv[index]
    if (token === "--json") {
      target.json = true
      continue
    }
    if (token === "--approve-writes") {
      target.approveWrites = true
      continue
    }
    if (token === "--approve-verification") {
      target.approveVerification = true
      continue
    }
    if (token === "--verify-command") {
      const value = argv[++index]
      if (!value) throw new Error("Missing value for --verify-command")
      const existing = (target.verificationCommands as VerificationCommandSpec[] | undefined) ?? []
      target.verificationCommands = [...existing, parseVerificationCommandSpec(value)]
      continue
    }
    if (
      token === "--workspace" || token === "--evidence-dir" || token === "--evidence-retention-days" ||
      token === "--provider" || token === "--model" ||
      token === "--max-turns" || token === "--max-tool-calls" || token === "--max-elapsed-ms" || token === "--max-failures"
    ) {
      const value = argv[++index]
      if (!value) throw new Error(`Missing value for ${token}`)
      if (token === "--workspace") target.workspace = resolve(cwd, value)
      else if (token === "--evidence-dir") target.evidenceDir = resolve(cwd, value)
      else if (token === "--evidence-retention-days") {
        const days = parsePositiveInteger(token, value)
        if (days > MAX_EVIDENCE_RETENTION_DAYS) {
          throw new Error(`--evidence-retention-days must not exceed ${MAX_EVIDENCE_RETENTION_DAYS}`)
        }
        target.evidenceRetentionDays = days
      } else if (token === "--provider") target.provider = value
      else if (token === "--model") target.model = value
      else if (token === "--max-turns") target.maxTurns = parsePositiveInteger(token, value)
      else if (token === "--max-tool-calls") target.maxToolCalls = parsePositiveInteger(token, value)
      else if (token === "--max-elapsed-ms") target.maxElapsedMs = parsePositiveInteger(token, value)
      else target.maxFailures = parsePositiveInteger(token, value)
      continue
    }
    throw new Error(`Unknown option: ${token}`)
  }
}

function hasSolveOnlyOptions(value: object): boolean {
  return "approveWrites" in value || "approveVerification" in value || "verificationCommands" in value ||
    "maxTurns" in value || "maxToolCalls" in value || "maxElapsedMs" in value || "maxFailures" in value
}

function parseCliArgs(argv: string[], cwd: string): CliArgs {
  if (argv[0] === "apply-patch" && argv[1]) {
    const result: ApplyPatchArgs = {
      command: "apply-patch",
      patchFile: resolve(cwd, argv[1]),
      workspace: resolve(cwd),
      evidenceRetentionDays: DEFAULT_EVIDENCE_RETENTION_DAYS,
      json: false,
    }
    parseCommonOptions(argv, 2, cwd, result as ApplyPatchArgs & Record<string, unknown>)
    if ("provider" in result || "model" in result || hasSolveOnlyOptions(result)) {
      throw new Error("Model, write, verification, and agent-loop options are not valid with kodac apply-patch")
    }
    return result
  }

  if (argv[0] === "ask" && argv[1]) {
    const result: AskArgs = {
      command: "ask",
      prompt: argv[1],
      workspace: resolve(cwd),
      evidenceRetentionDays: DEFAULT_EVIDENCE_RETENTION_DAYS,
      provider: "fixture",
      model: "fixture/deterministic-v1",
      json: false,
    }
    parseCommonOptions(argv, 2, cwd, result as AskArgs & Record<string, unknown>)
    if (hasSolveOnlyOptions(result)) throw new Error("Write, verification, and agent-loop options are only valid with kodac solve")
    return result
  }

  if (argv[0] === "solve" && argv[1]) {
    const mutable: CommonArgs & Record<string, unknown> & {
      command: "solve"
      prompt: string
      provider: string
      model: string
      approveWrites: boolean
      approveVerification: boolean
      verificationCommands: VerificationCommandSpec[]
      maxTurns: number
      maxToolCalls: number
      maxElapsedMs: number
      maxFailures: number
      evidenceRetentionDays: number
    } = {
      command: "solve",
      prompt: argv[1],
      workspace: resolve(cwd),
      evidenceRetentionDays: DEFAULT_EVIDENCE_RETENTION_DAYS,
      provider: "fixture",
      model: "fixture/deterministic-v1",
      json: false,
      approveWrites: false,
      approveVerification: false,
      verificationCommands: [],
      maxTurns: DEFAULT_AGENT_LOOP_LIMITS.maxTurns,
      maxToolCalls: DEFAULT_AGENT_LOOP_LIMITS.maxToolCalls,
      maxElapsedMs: DEFAULT_AGENT_LOOP_LIMITS.maxElapsedMs,
      maxFailures: DEFAULT_AGENT_LOOP_LIMITS.maxFailures,
    }
    parseCommonOptions(argv, 2, cwd, mutable)
    const ids = new Set<string>()
    for (const command of mutable.verificationCommands) {
      if (ids.has(command.id)) throw new Error(`Duplicate verification command id: ${command.id}`)
      ids.add(command.id)
    }
    return {
      command: "solve",
      prompt: mutable.prompt,
      workspace: mutable.workspace,
      evidenceDir: mutable.evidenceDir as string | undefined,
      evidenceRetentionDays: mutable.evidenceRetentionDays,
      provider: mutable.provider,
      model: mutable.model,
      json: mutable.json,
      approveWrites: mutable.approveWrites,
      approveVerification: mutable.approveVerification,
      verificationCommands: mutable.verificationCommands,
      limits: {
        ...DEFAULT_AGENT_LOOP_LIMITS,
        maxTurns: mutable.maxTurns,
        maxToolCalls: mutable.maxToolCalls,
        maxElapsedMs: mutable.maxElapsedMs,
        maxFailures: mutable.maxFailures,
      },
    }
  }

  throw new Error(
    "Usage: kodac apply-patch <patch-file> [--workspace <dir>] [--evidence-dir <dir>] [--evidence-retention-days <n>] [--json]\n" +
      "   or: kodac ask <prompt> [--provider fixture] [--model <id>] [--workspace <dir>] [--evidence-dir <dir>] [--evidence-retention-days <n>] [--json]\n" +
      "   or: kodac solve <task> [--provider fixture] [--model <id>] [--approve-writes] [--approve-verification] " +
      "[--verify-command <json>] [--max-turns <n>] [--max-tool-calls <n>] [--max-elapsed-ms <n>] [--max-failures <n>] " +
      "[--workspace <dir>] [--evidence-dir <dir>] [--evidence-retention-days <n>] [--json]",
  )
}

function defaultIO(): CliIO {
  return {
    stdout: (line) => process.stdout.write(`${line}\n`),
    stderr: (line) => process.stderr.write(`${line}\n`),
  }
}

async function sessionPaths(args: CommonArgs, sessionId: string, activateEvidenceLease: ActivateEvidenceLease): Promise<{
  eventPath: string
  receiptPath: string
  planPath: string
  proofPath: string
}> {
  const evidenceRoot = args.evidenceDir ?? defaultEvidenceRoot(args.workspace)
  const prepared = await prepareEvidenceSession({
    root: evidenceRoot,
    sessionId,
    retentionDays: args.evidenceRetentionDays,
  })
  activateEvidenceLease(prepared.release)
  const sessionEvidenceDir = prepared.sessionDir
  return {
    eventPath: join(sessionEvidenceDir, "events.jsonl"),
    receiptPath: join(sessionEvidenceDir, "receipts.jsonl"),
    planPath: join(sessionEvidenceDir, "verification-plan.json"),
    proofPath: join(sessionEvidenceDir, "proof.json"),
  }
}

async function writePlanArtifact(path: string, plan: VerificationPlan): Promise<void> {
  await writePrivateUtf8File(path, `${JSON.stringify(plan, null, 2)}\n`)
}

async function writeProofArtifact(
  path: string,
  plan: VerificationPlan,
  report: VerificationReport,
  gate: DoneGateResult,
): Promise<void> {
  await writePrivateUtf8File(
    path,
    `${JSON.stringify({
      protocol: "kodac.proof",
      version: 1,
      sessionId: report.sessionId,
      verificationPlan: plan,
      verification: report,
      doneGate: gate,
    }, null, 2)}\n`,
  )
}

async function changedPathsFromReceipts(receiptPath: string): Promise<string[]> {
  try {
    const receipts = await readReceiptLedger(receiptPath)
    const changed = new Set<string>()
    for (const receipt of receipts) {
      if (receipt.capability !== "repo.apply_patch" || receipt.result.status !== "success" || !("affected" in receipt.result)) continue
      for (const path of receipt.result.affected.added) changed.add(path)
      for (const path of receipt.result.affected.modified) changed.add(path)
      for (const path of receipt.result.affected.deleted) changed.add(path)
    }
    return [...changed].sort()
  } catch {
    return []
  }
}

function p8MessageCodePoints(value: string): string[] {
  const codePoints: string[] = []
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code === 0 || code === 0x7f) throw new TypeError("P8 bounded projection source must not contain NUL or DEL control characters")
    if (code >= 0xd800 && code <= 0xdbff) {
      if (index + 1 >= value.length) throw new TypeError("P8 bounded projection source must contain only valid Unicode scalar values")
      const next = value.charCodeAt(index + 1)
      if (next < 0xdc00 || next > 0xdfff) throw new TypeError("P8 bounded projection source must contain only valid Unicode scalar values")
      codePoints.push(value.slice(index, index + 2))
      index += 1
      continue
    }
    if (code >= 0xdc00 && code <= 0xdfff) throw new TypeError("P8 bounded projection source must contain only valid Unicode scalar values")
    codePoints.push(value[index])
  }
  return codePoints
}

function projectP8BoundedMessage(value: string): string {
  const codePoints = p8MessageCodePoints(value)
  const limit = P8_CLI_RESULT_LIMITS.maxMessageCodePoints
  if (codePoints.length <= limit) return value
  const digest = createHash("sha256").update(value, "utf8").digest("hex")
  const suffix = `
[P8_BOUNDED_PROJECTION originalCodePoints=${codePoints.length} sha256=${digest}]`
  const suffixCodePoints = p8MessageCodePoints(suffix)
  if (suffixCodePoints.length > limit) throw new TypeError("P8 bounded projection suffix exceeds the canonical message limit")
  const prefixBudget = limit - suffixCodePoints.length
  return `${codePoints.slice(0, prefixBudget).join("")}${suffix}`
}

function projectP8BoundedMessages(values: readonly string[]): string[] {
  return values.map(projectP8BoundedMessage)
}

function modelRuntime(
  session: RuntimeSession,
  input: {
    workspace: string
    receiptPath: string
    approveWrites: boolean
    workspaceTools: boolean
    modelProvider?: ModelProvider
  },
): {
  tools: ToolRegistry
  orchestrator: RuntimeOrchestrator
  providers: ProviderRegistry
  runner: AgentTurnRunner
} {
  const tools = new ToolRegistry()
  if (input.workspaceTools) {
    registerWorkspaceToolSurface(tools, {
      workspace: input.workspace,
      receipts: new JsonlReceiptLedger(input.receiptPath),
      approveWrites: input.approveWrites,
    })
  }
  const orchestrator = new RuntimeOrchestrator(tools, session)
  const providers = new ProviderRegistry()
  providers.register(input.modelProvider ?? new FixtureModelProvider())
  return { tools, orchestrator, providers, runner: new AgentTurnRunner(providers, tools, orchestrator, session) }
}

async function runApplyPatch(args: ApplyPatchArgs, io: CliIO, activateSession: ActivateSession, activateEvidenceLease: ActivateEvidenceLease): Promise<number> {
  const patchText = await readFile(args.patchFile, "utf8")
  const sessionId = randomUUID()
  const { eventPath, receiptPath } = await sessionPaths(args, sessionId, activateEvidenceLease)
  const session = new RuntimeSession(new JsonlEventSink(eventPath), sessionId)
  activateSession(session)
  const receipts = new JsonlReceiptLedger(receiptPath)
  const fs = new NodeWorkspaceFileSystem(args.workspace)
  const gateway = new ExecutionGateway(fs, fixedPolicy("allow", "human-cli-explicit-apply-patch"))
  const registry = new ToolRegistry()
  registry.register(createApplyPatchTool(gateway, receipts))
  const orchestrator = new RuntimeOrchestrator(registry, session)

  await session.start({ workspace: args.workspace, command: "apply-patch", runtimeSlice: "k2-s6" })
  const result = await orchestrator.invoke<ApplyPatchToolInput, ApplyPatchToolOutput>("repo.apply_patch", { patchText })
  await session.complete({ receiptId: result.receipt.receiptId, tool: "repo.apply_patch", mode: "tool", verified: false })

  if (args.json) {
    io.stdout(JSON.stringify(buildP8CliResultEnvelope({
      command: "apply-patch",
      sessionId,
      status: "PATCH_APPLIED",
      proven: false,
      evidence: { events: eventPath, receipts: receiptPath },
      payload: { affected: result.affected, receiptId: result.receipt.receiptId },
    })))
  } else {
    io.stdout(`Session: ${sessionId}`)
    io.stdout("✓ intent created")
    io.stdout("✓ policy evaluated")
    io.stdout("✓ workspace boundary verified")
    io.stdout("✓ patch applied")
    io.stdout(`✓ receipt written: ${receiptPath}`)
    io.stdout("PATCH APPLIED — VERIFICATION NOT RUN")
  }
  return 0
}

async function runAsk(
  args: AskArgs,
  io: CliIO,
  activateSession: ActivateSession,
  activateEvidenceLease: ActivateEvidenceLease,
  runtimeOptions: CliRuntimeOptions,
): Promise<number> {
  const sessionId = randomUUID()
  const { eventPath, receiptPath } = await sessionPaths(args, sessionId, activateEvidenceLease)
  const session = new RuntimeSession(new JsonlEventSink(eventPath), sessionId)
  activateSession(session)
  const { runner } = modelRuntime(session, {
    workspace: args.workspace,
    receiptPath,
    approveWrites: false,
    workspaceTools: false,
    modelProvider: runtimeOptions.modelProvider,
  })

  await session.start({ workspace: args.workspace, command: "ask", runtimeSlice: "k2-s3" })
  const result = await runner.run({
    provider: args.provider,
    model: args.model,
    messages: [{ role: "user", content: args.prompt }],
  })
  await session.complete({ mode: "model_turn", provider: args.provider, model: args.model })

  if (args.json) {
    io.stdout(JSON.stringify(buildP8CliResultEnvelope({
      command: "ask",
      sessionId,
      status: "COMPLETE",
      proven: false,
      evidence: { events: eventPath },
      payload: {
        provider: args.provider,
        model: args.model,
        assistant: result.assistant,
      },
    })))
  } else {
    io.stdout(result.assistant)
    io.stdout(`Evidence: ${eventPath}`)
  }
  return 0
}

async function runSolve(
  args: SolveArgs,
  io: CliIO,
  activateSession: ActivateSession,
  activateEvidenceLease: ActivateEvidenceLease,
  runtimeOptions: CliRuntimeOptions,
): Promise<number> {
  const sessionId = randomUUID()
  const { eventPath, receiptPath, planPath, proofPath } = await sessionPaths(args, sessionId, activateEvidenceLease)
  const session = new RuntimeSession(new JsonlEventSink(eventPath), sessionId)
  activateSession(session)
  const { runner } = modelRuntime(session, {
    workspace: args.workspace,
    receiptPath,
    approveWrites: args.approveWrites,
    workspaceTools: true,
    modelProvider: runtimeOptions.modelProvider,
  })
  const loop = new BoundedAgentLoop(runner, session)

  await session.start({ workspace: args.workspace, command: "solve", runtimeSlice: "k2-s7" })
  const result = await loop.run({
    provider: args.provider,
    model: args.model,
    messages: [{ role: "user", content: args.prompt }],
    limits: args.limits,
  })

  if (result.status === "stopped") {
    if (result.reason === "completed") throw new Error("Stopped agent loop returned an invalid completed reason")
    await session.fail(new Error(`Agent loop stopped: ${result.reason}`))
    if (args.json) {
      io.stdout(JSON.stringify(buildP8CliResultEnvelope({
        command: "solve",
        sessionId,
        status: "STOPPED",
        proven: false,
        evidence: { events: eventPath, receipts: receiptPath },
        payload: { reason: result.reason, budget: result.budget },
      })))
    } else {
      io.stderr(`Agent loop stopped: ${result.reason}`)
      io.stderr(`Evidence: ${eventPath}`)
    }
    return 2
  }

  const changedPaths = await changedPathsFromReceipts(receiptPath)
  const plan = await planVerification({
    workspace: args.workspace,
    changedPaths,
    manualCommands: args.verificationCommands,
  })
  await session.emit("verification.plan.created", {
    risk: plan.risk,
    budget: plan.budget,
    planDigest: plan.planDigest,
    changedPaths: plan.changedPaths,
    signals: plan.signals,
    warnings: plan.warnings,
    commands: plan.commands.map((command) => ({
      id: command.id,
      category: command.category,
      executable: command.executable,
    })),
  })
  await writePlanArtifact(planPath, plan)

  const report = await runVerificationEngine({
    workspace: args.workspace,
    sessionId,
    receiptPath,
    session,
    agentCompleted: true,
    approveVerification: args.approveVerification,
    commands: plan.commands,
  })
  const gate = new DoneGate().evaluate(report)
  await session.emit("done_gate.evaluated", {
    status: gate.status,
    reasons: gate.reasons,
    evidenceCount: gate.evidence.length,
    planDigest: plan.planDigest,
  })
  await writeProofArtifact(proofPath, plan, report, gate)
  await session.complete({
    mode: "agent_loop",
    provider: args.provider,
    model: args.model,
    doneGate: gate.status,
    proof: proofPath,
  })

  if (args.json) {
    const payload = {
      provider: args.provider,
      model: args.model,
      assistant: result.assistant,
      budget: result.budget,
      verificationRisk: plan.risk,
      verificationCommands: plan.commands.map((command) => command.id),
      warnings: projectP8BoundedMessages(plan.warnings),
      reasons: projectP8BoundedMessages(gate.reasons),
    }
    const evidence = { events: eventPath, receipts: receiptPath, plan: planPath, proof: proofPath }
    if (gate.status === "PROVEN_READY") {
      io.stdout(JSON.stringify(buildP8CliResultEnvelope({
        command: "solve",
        sessionId,
        status: "PROVEN_READY",
        proven: true,
        evidence,
        payload,
      })))
    } else {
      io.stdout(JSON.stringify(buildP8CliResultEnvelope({
        command: "solve",
        sessionId,
        status: "NOT_READY",
        proven: false,
        evidence,
        payload,
      })))
    }
  } else {
    if (result.assistant) io.stdout(result.assistant)
    io.stdout(`Agent loop complete: ${result.budget.turnsUsed} turn(s), ${result.budget.toolCallsUsed} tool call(s)`)
    io.stdout(`Verification plan: ${plan.risk} risk, ${plan.commands.length} command(s)`)
    for (const warning of plan.warnings) io.stdout(`! ${warning}`)
    io.stdout(`Plan: ${planPath}`)
    io.stdout(`Proof: ${proofPath}`)
    if (gate.status === "PROVEN_READY") {
      io.stdout("PROVEN READY")
    } else {
      io.stdout("NOT READY")
      for (const reason of gate.reasons) io.stdout(`✗ ${reason}`)
    }
  }
  return gate.status === "PROVEN_READY" ? 0 : 3
}

export async function runCli(
  argv: string[],
  io: CliIO = defaultIO(),
  cwd = process.cwd(),
  runtimeOptions: CliRuntimeOptions = {},
): Promise<number> {
  if (argv.length === 1 && argv[0] === "--help") {
    io.stdout(CLI_HELP)
    return 0
  }

  let session: RuntimeSession | undefined
  let releaseEvidenceLease: (() => Promise<void>) | undefined
  const activateSession: ActivateSession = (created) => {
    session = created
  }
  const activateEvidenceLease: ActivateEvidenceLease = (release) => {
    releaseEvidenceLease = release
  }

  try {
    const args = parseCliArgs(argv, cwd)
    if (args.command === "apply-patch") return await runApplyPatch(args, io, activateSession, activateEvidenceLease)
    if (args.command === "ask") return await runAsk(args, io, activateSession, activateEvidenceLease, runtimeOptions)
    return await runSolve(args, io, activateSession, activateEvidenceLease, runtimeOptions)
  } catch (error) {
    if (session) {
      try {
        await session.fail(error)
      } catch {
        // The original failure remains authoritative if evidence persistence is also unavailable.
      }
    }
    io.stderr(error instanceof Error ? error.message : String(error))
    return 1
  } finally {
    if (releaseEvidenceLease) {
      try {
        await releaseEvidenceLease()
      } catch {
        // A retained lease fails cleanup conservative; it must not replace the command's authoritative outcome.
      }
    }
  }
}

const isDirectInvocation = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isDirectInvocation) {
  process.exitCode = await runCli(process.argv.slice(2))
}
