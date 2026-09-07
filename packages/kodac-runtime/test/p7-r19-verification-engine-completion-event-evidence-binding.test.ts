import assert from "node:assert/strict"
import { Buffer } from "node:buffer"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import type { ExecutionReceipt } from "../src/evidence/receipt.ts"
import { ReviewerIntelligenceRuntime } from "../src/reviewer-intelligence/runtime.ts"
import {
  buildP7ImmutablePatchProposal,
  type P7ImmutablePatchProposal,
  type P7ImmutablePatchProposalInput,
} from "../src/remediation/p7-immutable-patch-proposal.ts"
import {
  buildP7PatchApplicationAuthorization,
  type P7PatchApplicationAuthorization,
} from "../src/remediation/p7-patch-application-authorization.ts"
import {
  buildP7PatchExecutionIntentBinding,
  type P7PatchExecutionIntentBinding,
} from "../src/remediation/p7-patch-execution-intent-binding.ts"
import {
  buildP7AppliedPatchEvidenceBinding,
  type P7AppliedPatchEvidenceBindingBuildInput,
} from "../src/remediation/p7-applied-patch-evidence-binding.ts"
import {
  buildP7PostApplyVerificationPlanBinding,
  type P7PostApplyVerificationPlanBindingBuildInput,
  type P7VerificationPlanInput,
} from "../src/remediation/p7-post-apply-verification-plan-binding.ts"
import {
  buildP7PostApplyVerificationReportBinding,
  type P7PostApplyVerificationReportBindingBuildInput,
} from "../src/remediation/p7-post-apply-verification-report-binding.ts"
import {
  buildP7VerificationCommandSuccessEvidenceBinding,
  type P7VerificationCommandSuccessEvidenceBindingBuildInput,
  type P7VerificationCommandSuccessExecutionIntentPreimage,
} from "../src/remediation/p7-verification-command-success-evidence-binding.ts"
import {
  buildP7AgentCompletionEvidenceBinding,
  type P7AgentCompletionEvidenceBindingBuildInput,
} from "../src/remediation/p7-agent-completion-evidence-binding.ts"
import {
  buildP7WorkspaceReferenceEvidenceBinding,
  type P7WorkspaceReferenceEvidenceBindingBuildInput,
} from "../src/remediation/p7-workspace-reference-evidence-binding.ts"
import {
  buildP7GitChangeReportEvidenceBinding,
  type P7GitChangeReportEvidenceBindingBuildInput,
} from "../src/remediation/p7-git-change-report-evidence-binding.ts"
import {
  buildP7ReceiptReportEvidenceBinding,
  type P7ReceiptReportEvidenceBindingBuildInput,
} from "../src/remediation/p7-receipt-report-evidence-binding.ts"
import {
  buildP7PolicyReportEvidenceBinding,
  type P7PolicyReportEvidenceBindingBuildInput,
} from "../src/remediation/p7-policy-report-evidence-binding.ts"
import {
  buildP7ReceiptRecordSetEvidenceBinding,
  type P7ReceiptRecordSetEvidenceBindingBuildInput,
} from "../src/remediation/p7-receipt-record-set-evidence-binding.ts"
import {
  buildP7ReceiptLedgerSnapshotEvidenceBinding,
  type P7ReceiptLedgerSnapshotEvidenceBindingBuildInput,
} from "../src/remediation/p7-receipt-ledger-snapshot-evidence-binding.ts"
import {
  buildP7ReceiptLedgerFileReadEvidenceBinding,
  type P7ReceiptLedgerFileReadEvidenceBinding,
  type P7ReceiptLedgerFileReadEvidenceBindingBuildInput,
} from "../src/remediation/p7-receipt-ledger-file-read-evidence-binding.ts"
import {
  buildP7VerificationEngineReceiptLedgerReadEvidenceBinding,
  type P7VerificationEngineReceiptLedgerReadEvidenceBinding,
  type P7VerificationEngineReceiptLedgerReadEvidenceBindingBuildInput,
} from "../src/remediation/p7-verification-engine-receipt-ledger-read-evidence-binding.ts"
import {
  P7_R19_EVENT_PROTOCOL,
  P7_R19_EVENT_TYPE,
  P7_R19_EVENT_VERSION,
  P7_R19_VERIFICATION_ENGINE_COMPLETION_EVENT_EVIDENCE_BINDING_VERSION,
  P7_R19_VERIFICATION_ENGINE_COMPLETION_EVENT_EVIDENCE_BOUND_STATE,
  buildP7VerificationEngineCompletionEventEvidenceBinding,
  validateP7VerificationEngineCompletionEventEvidenceBinding,
  type P7VerificationEngineCompletionEventEvidenceBinding,
  type P7VerificationEngineCompletionEventEvidenceBindingBuildInput,
} from "../src/remediation/p7-verification-engine-completion-event-evidence-binding.ts"

type MutableRecord = Record<string, any>
type SchemaRecord = Record<string, any>

const BASE = "a".repeat(40)
const HEAD = "b".repeat(40)
const BLOB_A = "1".repeat(40)
const BLOB_B = "2".repeat(40)
const SHA_A = "1".repeat(64)
const SHA_B = "2".repeat(64)
const POST_STATE = "3".repeat(64)
const APPLY_RECEIPT_ID = "123e4567-e89b-42d3-a456-426614174000"
const TEST_RECEIPT_ID = "223e4567-e89b-42d3-a456-426614174001"
const TYPES_RECEIPT_ID = "323e4567-e89b-42d3-a456-426614174002"
const AGENT_EVENT_ID = "423e4567-e89b-42d3-a456-426614174003"
const GIT_DIFF_RECEIPT_ID = "523e4567-e89b-42d3-a456-426614174004"
const GIT_STATUS_RECEIPT_ID = "623e4567-e89b-42d3-a456-426614174005"
const R18_EVENT_ID = "723e4567-e89b-42d3-a456-426614174007"
const R19_EVENT_ID = "923e4567-e89b-42d3-a456-426614174009"
const R19_EVENT_ID_2 = "a23e4567-e89b-42d3-a456-42661417400a"
const GENERATED_AT = "2026-09-06T12:00:02.000Z"
const AGENT_COMPLETED_AT = "2026-09-06T12:00:02.500Z"
const REPORT_STARTED_AT = "2026-09-06T12:00:03.000Z"
const REPORT_COMPLETED_AT = "2026-09-06T12:00:04.000Z"
const R18_EVENT_AT = "2026-09-06T12:00:03.950Z"
const R19_EVENT_AT = "2026-09-06T12:00:04.100Z"
const TEST_STARTED_AT = "2026-09-06T12:00:03.100Z"
const TEST_COMPLETED_AT = "2026-09-06T12:00:03.400Z"
const TYPES_STARTED_AT = "2026-09-06T12:00:03.500Z"
const TYPES_COMPLETED_AT = "2026-09-06T12:00:03.900Z"
const WORKSPACE = "/workspace/kodac"
const SESSION_ID = "session-p7-r19"
const TEST_COMMAND_ID = "js-root-tests-123abc"
const TYPES_COMMAND_ID = "js-root-types-456def"
const GIT_SUMMARY = "Workspace changes are evidenced (diffBytes=12, statusBytes=3)."
const POLICY_SUMMARY = "Every persisted execution receipt was authorized by policy."
const RECEIPT_IDS = [APPLY_RECEIPT_ID, GIT_DIFF_RECEIPT_ID, GIT_STATUS_RECEIPT_ID, TEST_RECEIPT_ID, TYPES_RECEIPT_ID]
const RECEIPT_SUMMARY = `${RECEIPT_IDS.length} execution receipt(s) are successful and mutation post-state is attested.`

const PATCH = [
  "*** Begin Patch",
  "*** Add File: src/a.ts",
  "+export const a = 1",
  "*** Update File: src/b.ts",
  "@@",
  "-old",
  "+new",
  "*** Delete File: src/c.ts",
  "*** End Patch",
].join("\n")

const CHANGES: P7ImmutablePatchProposalInput["changes"] = [
  { path: "src/a.ts", operation: "ADD", beforeBlobIdentity: null, afterContentDigest: SHA_A },
  { path: "src/b.ts", operation: "MODIFY", beforeBlobIdentity: BLOB_A, afterContentDigest: SHA_B },
  { path: "src/c.ts", operation: "DELETE", beforeBlobIdentity: BLOB_B, afterContentDigest: null },
]

function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex")
}

function claim(): Record<string, unknown> {
  return {
    claimKey: "p7-r19-source-finding",
    review: {
      reviewRunId: "review-run-p7-r19",
      reviewerId: "provider:test",
      reviewerVersion: "v1",
      policyIdentity: "policy:p7-r19-test",
      canonicalBase: BASE,
      reviewedHead: HEAD,
    },
    path: "src/example.ts",
    range: { startLine: 10, endLine: 12 },
    summary: "A confirmed finding eligible for bounded verification completion evidence binding.",
    contractClaim: "The candidate violates one bounded invariant.",
    category: "correctness",
    severity: "high",
    confidenceBps: 9000,
    evidenceRefs: ["evidence:finding"],
  }
}

function sourceProposal(): P7ImmutablePatchProposal {
  const runtime = new ReviewerIntelligenceRuntime({ adjudicatorId: "kodac:p7-r19-test-adjudicator" })
  const finding = runtime.createFinding(claim(), HEAD)
  const { adjudication } = runtime.applyAdjudication(
    finding,
    { action: "CONFIRM", evidenceRefs: ["evidence:confirmed"] },
    HEAD,
  )
  return buildP7ImmutablePatchProposal({
    repositoryIdentity: "github.com/TheHalfMoon/Kodac",
    canonicalBase: BASE,
    targetHead: HEAD,
    sourceFinding: finding,
    sourceAdjudication: adjudication,
    proposerIdentity: "kodac:p7-r19-test-proposer",
    patchArtifactDigest: sha256(PATCH),
    changes: CHANGES,
  })
}

function sourceAuthorization(source: P7ImmutablePatchProposal): P7PatchApplicationAuthorization {
  return buildP7PatchApplicationAuthorization({
    sourceProposal: source,
    declaration: {
      authorizerIdentity: "kodac:p7-r19-test-authorizer",
      rationale: "The exact proposal has bounded authorization for one application lineage.",
      evidenceRefs: ["evidence:authorization", "evidence:risk-review"],
    },
  })
}

function sourceIntentBinding(
  source: P7ImmutablePatchProposal,
  authorization: P7PatchApplicationAuthorization,
): P7PatchExecutionIntentBinding {
  return buildP7PatchExecutionIntentBinding({ sourceProposal: source, sourceAuthorization: authorization, patchText: PATCH })
}

function applicationReceipt(): ExecutionReceipt {
  return {
    receiptId: APPLY_RECEIPT_ID,
    capability: "repo.apply_patch",
    inputDigest: sha256(PATCH),
    paths: ["src/a.ts", "src/b.ts", "src/c.ts"],
    policy: { decision: "allow", reason: "explicit bounded test policy" },
    startedAt: "2026-09-06T12:00:00.000Z",
    completedAt: "2026-09-06T12:00:01.000Z",
    result: {
      status: "success",
      affected: { added: ["src/a.ts"], modified: ["src/b.ts"], deleted: ["src/c.ts"] },
      postStateDigest: POST_STATE,
    },
  }
}

function appliedInput(): P7AppliedPatchEvidenceBindingBuildInput {
  const proposal = sourceProposal()
  const authorization = sourceAuthorization(proposal)
  return {
    sourceProposal: proposal,
    sourceAuthorization: authorization,
    sourceIntentBinding: sourceIntentBinding(proposal, authorization),
    exactPatchText: PATCH,
    executionReceipt: applicationReceipt(),
  }
}

function rebindPlanDigest(plan: MutableRecord): P7VerificationPlanInput {
  plan.planDigest = sha256(JSON.stringify({
    risk: plan.risk,
    budget: plan.budget,
    signals: plan.signals,
    changedPaths: plan.changedPaths,
    commands: plan.commands,
    warnings: plan.warnings,
  }))
  return plan as P7VerificationPlanInput
}

function verificationPlan(): P7VerificationPlanInput {
  return rebindPlanDigest({
    protocol: "kodac.verification-plan",
    version: 1,
    generatedAt: GENERATED_AT,
    workspace: WORKSPACE,
    risk: "medium",
    budget: { maxCommands: 6, maxTotalTimeoutMs: 240_000 },
    signals: ["package.json:javascript:npm"],
    changedPaths: ["src/a.ts", "src/b.ts", "src/c.ts"],
    commands: [
      {
        id: TEST_COMMAND_ID,
        category: "tests",
        executable: "node",
        args: ["scripts/run-tests.mjs"],
        timeoutMs: 120_000,
        maxOutputBytes: 1_048_576,
      },
      {
        id: TYPES_COMMAND_ID,
        category: "types",
        executable: "node",
        args: ["node_modules/typescript/bin/tsc", "-p", "tsconfig.json", "--noEmit"],
        timeoutMs: 60_000,
        maxOutputBytes: 1_048_576,
      },
    ],
    warnings: [],
    planDigest: "0".repeat(64),
  })
}

function r5Input(): P7PostApplyVerificationPlanBindingBuildInput {
  const sourceAppliedEvidenceInput = appliedInput()
  return {
    sourceAppliedEvidence: buildP7AppliedPatchEvidenceBinding(sourceAppliedEvidenceInput),
    sourceAppliedEvidenceInput,
    verificationPlan: verificationPlan(),
  }
}

function verificationReport(plan: P7VerificationPlanInput): MutableRecord {
  const commandReceiptIds = new Map([[TEST_COMMAND_ID, TEST_RECEIPT_ID], [TYPES_COMMAND_ID, TYPES_RECEIPT_ID]])
  const base = [
    {
      id: "agent.completed",
      category: "agent",
      status: "pass",
      summary: "Bounded agent loop completed normally.",
      evidence: [{ kind: "event", ref: `session:${SESSION_ID}:agent.loop.completed` }],
    },
    {
      id: "workspace.integrity",
      category: "workspace",
      status: "pass",
      summary: "Workspace root and Git metadata are present.",
      evidence: [{ kind: "workspace", ref: WORKSPACE, digest: sha256(WORKSPACE) }],
    },
    {
      id: "git.diff",
      category: "diff",
      status: "pass",
      summary: GIT_SUMMARY,
      evidence: [{ kind: "receipt", ref: GIT_STATUS_RECEIPT_ID }, { kind: "receipt", ref: GIT_DIFF_RECEIPT_ID }],
    },
    {
      id: "evidence.receipts",
      category: "receipts",
      status: "pass",
      summary: RECEIPT_SUMMARY,
      evidence: RECEIPT_IDS.map((ref) => ({ kind: "receipt", ref })),
    },
    {
      id: "evidence.policy",
      category: "policy",
      status: "pass",
      summary: POLICY_SUMMARY,
      evidence: RECEIPT_IDS.map((ref) => ({ kind: "receipt", ref })),
    },
  ]
  const commands = plan.commands.map((command) => ({
    id: `command.${command.id}`,
    category: command.category,
    status: "pass",
    summary: `Command ${command.id} passed.`,
    evidence: [{ kind: "receipt", ref: commandReceiptIds.get(command.id)! }],
  }))
  return {
    protocol: "kodac.verification",
    version: 1,
    sessionId: SESSION_ID,
    startedAt: REPORT_STARTED_AT,
    completedAt: REPORT_COMPLETED_AT,
    passed: true,
    checks: [
      ...base,
      ...commands,
      {
        id: "verification.commands",
        category: "tests",
        status: "pass",
        summary: "All verification commands passed.",
        evidence: commands.flatMap((command) => command.evidence.map((item) => ({ ...item }))),
      },
    ],
  }
}

function r6Input(): P7PostApplyVerificationReportBindingBuildInput {
  const sourceVerificationPlanBindingInput = r5Input()
  return {
    sourceVerificationPlanBinding: buildP7PostApplyVerificationPlanBinding(sourceVerificationPlanBindingInput),
    sourceVerificationPlanBindingInput,
    verificationReport: verificationReport(sourceVerificationPlanBindingInput.verificationPlan),
  }
}

function canonicalEnvironment(env: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(env).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0))
}

function testIntent(): P7VerificationCommandSuccessExecutionIntentPreimage {
  return {
    resolvedExecutable: "/usr/local/bin/node",
    args: ["scripts/run-tests.mjs"],
    allowedExitCodes: [0],
    maxOutputBytes: 1_048_576,
    timeoutMs: 120_000,
    env: { NODE_ENV: "test", KODAC_VERIFICATION: "1", NO_COLOR: "1", PATH: "/usr/local/bin:/usr/bin", TEMP: "" },
  }
}

function typesIntent(): P7VerificationCommandSuccessExecutionIntentPreimage {
  return {
    resolvedExecutable: "/usr/local/bin/node",
    args: ["node_modules/typescript/bin/tsc", "-p", "tsconfig.json", "--noEmit"],
    allowedExitCodes: [0],
    maxOutputBytes: 1_048_576,
    timeoutMs: 60_000,
    env: { NODE_ENV: "test", KODAC_VERIFICATION: "1", NO_COLOR: "1", PATH: "/usr/local/bin:/usr/bin", TMPDIR: "/tmp" },
  }
}

function gatewayInputDigest(intent: P7VerificationCommandSuccessExecutionIntentPreimage): string {
  return sha256(JSON.stringify({
    executable: intent.resolvedExecutable,
    args: [...intent.args],
    allowedExitCodes: [0],
    maxOutputBytes: intent.maxOutputBytes,
    timeoutMs: intent.timeoutMs,
    env: canonicalEnvironment({ ...intent.env }),
  }))
}

function successReceipt(
  commandId: string,
  receiptId: string,
  intent: P7VerificationCommandSuccessExecutionIntentPreimage,
  startedAt: string,
  completedAt: string,
  output: string,
): MutableRecord {
  return {
    receiptId,
    capability: `verification.command.${commandId}`,
    inputDigest: gatewayInputDigest(intent),
    paths: [],
    policy: { decision: "allow", reason: "explicit --approve-verification authorization" },
    startedAt,
    completedAt,
    result: {
      status: "success",
      outputDigest: sha256(output),
      outputBytes: Buffer.byteLength(output, "utf8"),
      exitCode: 0,
    },
  }
}

function r8Input(): P7VerificationCommandSuccessEvidenceBindingBuildInput {
  const sourceVerificationReportBindingInput = r6Input()
  const testExecutionIntentPreimage = testIntent()
  const typesExecutionIntentPreimage = typesIntent()
  return {
    sourceVerificationReportBinding: buildP7PostApplyVerificationReportBinding(sourceVerificationReportBindingInput),
    sourceVerificationReportBindingInput,
    commandExecutionEvidence: [
      {
        commandId: TEST_COMMAND_ID,
        executionIntentPreimage: testExecutionIntentPreimage,
        executionReceipt: successReceipt(TEST_COMMAND_ID, TEST_RECEIPT_ID, testExecutionIntentPreimage, TEST_STARTED_AT, TEST_COMPLETED_AT, "tests passed"),
      },
      {
        commandId: TYPES_COMMAND_ID,
        executionIntentPreimage: typesExecutionIntentPreimage,
        executionReceipt: successReceipt(TYPES_COMMAND_ID, TYPES_RECEIPT_ID, typesExecutionIntentPreimage, TYPES_STARTED_AT, TYPES_COMPLETED_AT, "types passed"),
      },
    ],
  }
}

function r9Input(): P7AgentCompletionEvidenceBindingBuildInput {
  const sourceCommandSuccessEvidenceBindingInput = r8Input()
  return {
    sourceCommandSuccessEvidenceBinding: buildP7VerificationCommandSuccessEvidenceBinding(sourceCommandSuccessEvidenceBindingInput),
    sourceCommandSuccessEvidenceBindingInput,
    agentCompletionEvent: {
      protocol: "kodac.event",
      version: 1,
      eventId: AGENT_EVENT_ID,
      sessionId: SESSION_ID,
      sequence: 17,
      emittedAt: AGENT_COMPLETED_AT,
      type: "agent.loop.completed",
      payload: { reason: "completed", budget: { turnsUsed: 2, toolCallsUsed: 1, failuresUsed: 0, elapsedMs: 1_234 } },
    },
  }
}

function r10Input(): P7WorkspaceReferenceEvidenceBindingBuildInput {
  const sourceAgentCompletionEvidenceBindingInput = r9Input()
  return {
    sourceAgentCompletionEvidenceBinding: buildP7AgentCompletionEvidenceBinding(sourceAgentCompletionEvidenceBindingInput),
    sourceAgentCompletionEvidenceBindingInput,
  }
}

function r11Input(): P7GitChangeReportEvidenceBindingBuildInput {
  const sourceWorkspaceReferenceEvidenceBindingInput = r10Input()
  return {
    sourceWorkspaceReferenceEvidenceBinding: buildP7WorkspaceReferenceEvidenceBinding(sourceWorkspaceReferenceEvidenceBindingInput),
    sourceWorkspaceReferenceEvidenceBindingInput,
  }
}

function r12Input(): P7ReceiptReportEvidenceBindingBuildInput {
  const sourceGitChangeReportEvidenceBindingInput = r11Input()
  return {
    sourceGitChangeReportEvidenceBinding: buildP7GitChangeReportEvidenceBinding(sourceGitChangeReportEvidenceBindingInput),
    sourceGitChangeReportEvidenceBindingInput,
  }
}

function r13Input(): P7PolicyReportEvidenceBindingBuildInput {
  const sourceReceiptReportEvidenceBindingInput = r12Input()
  return {
    sourceReceiptReportEvidenceBinding: buildP7ReceiptReportEvidenceBinding(sourceReceiptReportEvidenceBindingInput),
    sourceReceiptReportEvidenceBindingInput,
  }
}

function genericProcessReceipt(receiptId: string, capability: string, seed: string): MutableRecord {
  const output = `${capability}:${seed}`
  return {
    receiptId,
    capability,
    inputDigest: sha256(`input:${seed}`),
    paths: [],
    policy: { decision: "allow", reason: "bounded verification completion evidence" },
    startedAt: REPORT_STARTED_AT,
    completedAt: REPORT_COMPLETED_AT,
    result: {
      status: "success",
      outputDigest: sha256(output),
      outputBytes: Buffer.byteLength(output, "utf8"),
      exitCode: 0,
    },
  }
}

function canonicalReceiptRecords(): MutableRecord[] {
  const testExecutionIntentPreimage = testIntent()
  const typesExecutionIntentPreimage = typesIntent()
  return [
    structuredClone(applicationReceipt()) as MutableRecord,
    genericProcessReceipt(GIT_DIFF_RECEIPT_ID, "git.diff", "diff"),
    genericProcessReceipt(GIT_STATUS_RECEIPT_ID, "git.status", "status"),
    successReceipt(TEST_COMMAND_ID, TEST_RECEIPT_ID, testExecutionIntentPreimage, TEST_STARTED_AT, TEST_COMPLETED_AT, "tests passed"),
    successReceipt(TYPES_COMMAND_ID, TYPES_RECEIPT_ID, typesExecutionIntentPreimage, TYPES_STARTED_AT, TYPES_COMPLETED_AT, "types passed"),
  ]
}

function r14Input(records = canonicalReceiptRecords()): P7ReceiptRecordSetEvidenceBindingBuildInput {
  const sourcePolicyReportEvidenceBindingInput = r13Input()
  return {
    sourcePolicyReportEvidenceBinding: buildP7PolicyReportEvidenceBinding(sourcePolicyReportEvidenceBindingInput),
    sourcePolicyReportEvidenceBindingInput,
    receiptRecords: records,
  }
}

function snapshotOf(records: readonly unknown[]): string {
  return `${records.map((record) => JSON.stringify(record)).join("\n")}\n`
}

function r15Input(records = canonicalReceiptRecords()): P7ReceiptLedgerSnapshotEvidenceBindingBuildInput {
  const sourceReceiptRecordSetEvidenceBindingInput = r14Input(records)
  return {
    sourceReceiptRecordSetEvidenceBinding: buildP7ReceiptRecordSetEvidenceBinding(sourceReceiptRecordSetEvidenceBindingInput),
    sourceReceiptRecordSetEvidenceBindingInput,
    receiptLedgerSnapshot: snapshotOf(records),
  }
}

async function r16Input(root: string): Promise<P7ReceiptLedgerFileReadEvidenceBindingBuildInput> {
  const sourceReceiptLedgerSnapshotEvidenceBindingInput = r15Input()
  const receiptLedgerPath = join(root, "receipts.jsonl")
  await writeFile(receiptLedgerPath, sourceReceiptLedgerSnapshotEvidenceBindingInput.receiptLedgerSnapshot, "utf8")
  return {
    sourceReceiptLedgerSnapshotEvidenceBinding: buildP7ReceiptLedgerSnapshotEvidenceBinding(sourceReceiptLedgerSnapshotEvidenceBindingInput),
    sourceReceiptLedgerSnapshotEvidenceBindingInput,
    receiptLedgerPath,
  }
}

function readEventFor(source: P7ReceiptLedgerFileReadEvidenceBinding): MutableRecord {
  return {
    protocol: "kodac.event",
    version: 1,
    eventId: R18_EVENT_ID,
    sessionId: source.verificationSessionId,
    sequence: 23,
    emittedAt: R18_EVENT_AT,
    type: "verification.receipt_ledger.read",
    payload: {
      receiptLedgerPathSha256: source.receiptLedgerPathSha256,
      receiptLedgerPresent: true,
      receiptLedgerReadUtf8Bytes: source.receiptLedgerReadUtf8Bytes,
      receiptLedgerReadSha256: source.receiptLedgerReadSha256,
      parsedReceiptCount: source.receiptCount,
    },
  }
}

async function r18Fixture(root: string): Promise<{
  readonly input: P7VerificationEngineReceiptLedgerReadEvidenceBindingBuildInput
  readonly r16BuildInput: P7ReceiptLedgerFileReadEvidenceBindingBuildInput
}> {
  const r16BuildInput = await r16Input(root)
  const sourceReceiptLedgerFileReadEvidenceBinding = await buildP7ReceiptLedgerFileReadEvidenceBinding(r16BuildInput)
  return {
    r16BuildInput,
    input: {
      sourceReceiptLedgerFileReadEvidenceBinding,
      sourceReceiptLedgerFileReadEvidenceBindingInput: r16BuildInput,
      verificationReceiptLedgerReadEvent: readEventFor(sourceReceiptLedgerFileReadEvidenceBinding),
    },
  }
}

function sourceReportFromR18Input(input: P7VerificationEngineReceiptLedgerReadEvidenceBindingBuildInput): MutableRecord {
  return input.sourceReceiptLedgerFileReadEvidenceBindingInput
    .sourceReceiptLedgerSnapshotEvidenceBindingInput
    .sourceReceiptRecordSetEvidenceBindingInput
    .sourcePolicyReportEvidenceBindingInput
    .sourceReceiptReportEvidenceBindingInput
    .sourceGitChangeReportEvidenceBindingInput
    .sourceWorkspaceReferenceEvidenceBindingInput
    .sourceAgentCompletionEvidenceBindingInput
    .sourceCommandSuccessEvidenceBindingInput
    .sourceVerificationReportBinding as MutableRecord
}

function completionEventFor(
  source: P7VerificationEngineReceiptLedgerReadEvidenceBinding,
  sourceInput: P7VerificationEngineReceiptLedgerReadEvidenceBindingBuildInput,
): MutableRecord {
  const report = sourceReportFromR18Input(sourceInput)
  return {
    protocol: "kodac.event",
    version: 1,
    eventId: R19_EVENT_ID,
    sessionId: source.verificationSessionId,
    sequence: source.verificationReceiptLedgerReadEventSequence + 1,
    emittedAt: R19_EVENT_AT,
    type: "verification.completed",
    payload: {
      passed: true,
      checks: report.verificationReport.checks.length,
      failed: [],
    },
  }
}

async function r19Fixture(root: string): Promise<{
  readonly input: P7VerificationEngineCompletionEventEvidenceBindingBuildInput
  readonly r18: Awaited<ReturnType<typeof r18Fixture>>
}> {
  const r18 = await r18Fixture(root)
  const sourceVerificationEngineReceiptLedgerReadEvidenceBinding =
    await buildP7VerificationEngineReceiptLedgerReadEvidenceBinding(r18.input)
  return {
    r18,
    input: {
      sourceVerificationEngineReceiptLedgerReadEvidenceBinding,
      sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput: r18.input,
      verificationCompletedEvent: completionEventFor(sourceVerificationEngineReceiptLedgerReadEvidenceBinding, r18.input),
    },
  }
}

const schema = JSON.parse(
  readFileSync(new URL("../../../schema/p7-verification-engine-completion-event-evidence-binding.schema.json", import.meta.url), "utf8"),
) as SchemaRecord
const sourceText = readFileSync(
  new URL("../src/remediation/p7-verification-engine-completion-event-evidence-binding.ts", import.meta.url),
  "utf8",
)

function resolveRef(root: SchemaRecord, ref: string): SchemaRecord {
  assert.ok(ref.startsWith("#/$defs/"))
  return root.$defs[ref.slice("#/$defs/".length)] as SchemaRecord
}

function schemaAccepts(nodeValue: unknown, value: unknown, root = schema): boolean {
  if (nodeValue === false) return false
  if (nodeValue === true) return true
  const node = nodeValue as SchemaRecord
  if (node.$ref !== undefined) return schemaAccepts(resolveRef(root, node.$ref), value, root)
  if (Object.hasOwn(node, "const") && JSON.stringify(value) !== JSON.stringify(node.const)) return false
  if (node.type === "object") {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return false
    const record = value as MutableRecord
    const properties = (node.properties ?? {}) as SchemaRecord
    if (Array.isArray(node.required) && node.required.some((key: string) => !Object.hasOwn(record, key))) return false
    if (node.additionalProperties === false && Object.keys(record).some((key) => !Object.hasOwn(properties, key))) return false
    return Object.entries(properties).every(([key, child]) => !Object.hasOwn(record, key) || schemaAccepts(child, record[key], root))
  }
  if (node.type === "string") {
    if (typeof value !== "string") return false
    const length = [...value].length
    if (typeof node.minLength === "number" && length < node.minLength) return false
    if (typeof node.maxLength === "number" && length > node.maxLength) return false
    if (typeof node.pattern === "string" && !(new RegExp(node.pattern).test(value))) return false
    return true
  }
  if (node.type === "integer") {
    if (typeof value !== "number" || !Number.isInteger(value)) return false
    if (typeof node.minimum === "number" && value < node.minimum) return false
    if (typeof node.maximum === "number" && value > node.maximum) return false
    return true
  }
  if (node.type === "array") {
    if (!Array.isArray(value)) return false
    if (typeof node.minItems === "number" && value.length < node.minItems) return false
    if (typeof node.maxItems === "number" && value.length > node.maxItems) return false
    if (node.uniqueItems === true && new Set(value.map((item) => JSON.stringify(item))).size !== value.length) return false
    return node.items === undefined || value.every((item) => schemaAccepts(node.items, item, root))
  }
  return true
}

async function withTemp<T>(run: (root: string) => Promise<T>): Promise<T> {
  const root = await mkdtemp(join(tmpdir(), "kodac-p7-r19-"))
  try {
    return await run(root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

async function rejectsBuild(
  input: P7VerificationEngineCompletionEventEvidenceBindingBuildInput,
  pattern?: RegExp,
): Promise<void> {
  const promise = buildP7VerificationEngineCompletionEventEvidenceBinding(input)
  if (pattern === undefined) await assert.rejects(promise)
  else await assert.rejects(promise, pattern)
}

function clonedInput(input: P7VerificationEngineCompletionEventEvidenceBindingBuildInput): MutableRecord {
  return structuredClone(input) as MutableRecord
}

async function canonicalBuilt(root: string): Promise<{
  readonly fixture: Awaited<ReturnType<typeof r19Fixture>>
  readonly built: P7VerificationEngineCompletionEventEvidenceBinding
}> {
  const fixture = await r19Fixture(root)
  const built = await buildP7VerificationEngineCompletionEventEvidenceBinding(fixture.input)
  return { fixture, built }
}

test("P7-R19 binds an all-pass verification.completed event to the exact canonical R18/R6 lineage", async () => {
  await withTemp(async (root) => {
    const { fixture, built } = await canonicalBuilt(root)
    const source = fixture.input.sourceVerificationEngineReceiptLedgerReadEvidenceBinding
    const report = sourceReportFromR18Input(fixture.r18.input)

    assert.equal(built.version, P7_R19_VERIFICATION_ENGINE_COMPLETION_EVENT_EVIDENCE_BINDING_VERSION)
    assert.equal(built.state, P7_R19_VERIFICATION_ENGINE_COMPLETION_EVENT_EVIDENCE_BOUND_STATE)
    assert.equal(built.sourceVerificationEngineReceiptLedgerReadEvidenceIdentity, source.evidenceIdentity)
    assert.equal(built.verificationReportIdentity, source.verificationReportIdentity)
    assert.equal(built.verificationSessionId, source.verificationSessionId)
    assert.equal(built.verificationReportPassed, true)
    assert.equal(built.verificationReportCheckCount, report.verificationReport.checks.length)
    assert.deepEqual(built.verificationReportFailedCheckIds, [])
    assert.equal(built.verificationCompletedEventProtocol, P7_R19_EVENT_PROTOCOL)
    assert.equal(built.verificationCompletedEventVersion, P7_R19_EVENT_VERSION)
    assert.equal(built.verificationCompletedEventType, P7_R19_EVENT_TYPE)
    assert.equal(built.verificationCompletedEventPassed, true)
    assert.deepEqual(built.verificationCompletedEventFailedCheckIds, [])
    assert.equal(schemaAccepts(schema, built), true)
    assert.equal(Object.isFrozen(built), true)
    assert.equal(Object.isFrozen(built.verificationReportFailedCheckIds), true)
    assert.equal(Object.isFrozen(built.verificationCompletedEventFailedCheckIds), true)
    assert.deepEqual(await validateP7VerificationEngineCompletionEventEvidenceBinding(built, fixture.input), built)
  })
})

test("P7-R19 is deterministic, ignores benign object-key order, and distinguishes event occurrences", async () => {
  await withTemp(async (root) => {
    const fixture = await r19Fixture(root)
    const first = await buildP7VerificationEngineCompletionEventEvidenceBinding(fixture.input)
    const repeated = await buildP7VerificationEngineCompletionEventEvidenceBinding(fixture.input)
    assert.deepEqual(repeated, first)

    const original = fixture.input.verificationCompletedEvent as MutableRecord
    const reordered: MutableRecord = {
      type: original.type,
      emittedAt: original.emittedAt,
      sequence: original.sequence,
      sessionId: original.sessionId,
      eventId: original.eventId,
      version: original.version,
      protocol: original.protocol,
      payload: { failed: [], checks: original.payload.checks, passed: true },
    }
    const reorderedBuilt = await buildP7VerificationEngineCompletionEventEvidenceBinding({
      ...fixture.input,
      verificationCompletedEvent: reordered,
    })
    assert.equal(reorderedBuilt.evidenceIdentity, first.evidenceIdentity)
    assert.equal(reorderedBuilt.verificationCompletedEventIdentity, first.verificationCompletedEventIdentity)

    const different = structuredClone(original)
    different.eventId = R19_EVENT_ID_2
    different.sequence += 1
    const second = await buildP7VerificationEngineCompletionEventEvidenceBinding({
      ...fixture.input,
      verificationCompletedEvent: different,
    })
    assert.notEqual(second.verificationCompletedEventIdentity, first.verificationCompletedEventIdentity)
    assert.notEqual(second.evidenceIdentity, first.evidenceIdentity)
  })
})

test("P7-R19 rejects invalid completion-event envelope, sequence, and timestamp claims", async () => {
  await withTemp(async (root) => {
    const fixture = await r19Fixture(root)
    const base = fixture.input.verificationCompletedEvent as MutableRecord
    const source = fixture.input.sourceVerificationEngineReceiptLedgerReadEvidenceBinding
    const cases: Array<[string, unknown]> = [
      ["protocol", "other.event"],
      ["version", 2],
      ["type", "verification.started"],
      ["sessionId", "other-session"],
      ["eventId", "not-a-uuid"],
      ["eventId", R19_EVENT_ID.toUpperCase()],
      ["sequence", 0],
      ["sequence", -1],
      ["sequence", 1.5],
      ["sequence", Number.MAX_SAFE_INTEGER + 1],
      ["sequence", source.verificationReceiptLedgerReadEventSequence],
      ["emittedAt", "2026-09-06T12:00:04Z"],
      ["emittedAt", "2026-09-06T12:00:03.999Z"],
    ]
    for (const [field, value] of cases) {
      const event = structuredClone(base)
      event[field] = value
      await rejectsBuild({ ...fixture.input, verificationCompletedEvent: event })
    }

    const boundary = structuredClone(base)
    boundary.emittedAt = REPORT_COMPLETED_AT
    await assert.doesNotReject(buildP7VerificationEngineCompletionEventEvidenceBinding({
      ...fixture.input,
      verificationCompletedEvent: boundary,
    }))
  })
})

test("P7-R19 enforces the canonical P7-R8 all-pass predecessor domain", async () => {
  await withTemp(async (root) => {
    const fixture = await r19Fixture(root)
    const base = fixture.input.verificationCompletedEvent as MutableRecord

    const passedFalse = structuredClone(base)
    passedFalse.payload.passed = false
    await rejectsBuild({ ...fixture.input, verificationCompletedEvent: passedFalse }, /all-pass predecessor domain/)

    const nonEmptyFailed = structuredClone(base)
    nonEmptyFailed.payload.failed = ["command.js-root-tests-123abc"]
    await rejectsBuild({ ...fixture.input, verificationCompletedEvent: nonEmptyFailed }, /must be empty/)

    const wrongCount = structuredClone(base)
    wrongCount.payload.checks += 1
    await rejectsBuild({ ...fixture.input, verificationCompletedEvent: wrongCount }, /check count/)

    const failedNotArray = structuredClone(base)
    failedNotArray.payload.failed = "none"
    await rejectsBuild({ ...fixture.input, verificationCompletedEvent: failedNotArray })

    const failedSparse = structuredClone(base)
    failedSparse.payload.failed = new Array(1)
    await rejectsBuild({ ...fixture.input, verificationCompletedEvent: failedSparse })

    const predecessorFailed = clonedInput(fixture.input)
    const reportBinding = sourceReportFromR18Input(
      predecessorFailed.sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput,
    )
    reportBinding.verificationReportPassed = false
    reportBinding.verificationReport.passed = false
    reportBinding.verificationReport.checks[0].status = "fail"
    await rejectsBuild(predecessorFailed as P7VerificationEngineCompletionEventEvidenceBindingBuildInput)
  })
})

test("P7-R19 rejects nested R6 report mutation during inherited asynchronous R18 file validation", async () => {
  await withTemp(async (root) => {
    const fixture = await r19Fixture(root)
    const racing = clonedInput(fixture.input)
    racing.verificationCompletedEvent.emittedAt = "2026-09-06T12:00:03.990Z"
    const reportBinding = sourceReportFromR18Input(
      racing.sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput,
    )

    const pending = buildP7VerificationEngineCompletionEventEvidenceBinding(
      racing as P7VerificationEngineCompletionEventEvidenceBindingBuildInput,
    )

    // The inherited R18/R16 validator yields for its bounded local-file read. Mutating only
    // the nested R6 report binding after that yield must not influence R19 semantics.
    reportBinding.verificationCompletedAt = "2026-09-06T12:00:03.980Z"
    reportBinding.verificationReport.completedAt = "2026-09-06T12:00:03.980Z"

    await assert.rejects(pending, /identity changed after canonical P7-R18 validation/)
  })
})

test("P7-R19 fails closed on R18 evidence/build-input and local receipt-ledger drift", async () => {
  await withTemp(async (root) => {
    const fixture = await r19Fixture(root)

    const mutatedEvidence = clonedInput(fixture.input)
    mutatedEvidence.sourceVerificationEngineReceiptLedgerReadEvidenceBinding.evidenceIdentity = "f".repeat(64)
    await rejectsBuild(mutatedEvidence as P7VerificationEngineCompletionEventEvidenceBindingBuildInput)

    const mutatedSnapshot = clonedInput(fixture.input)
    mutatedSnapshot.sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput
      .sourceReceiptLedgerFileReadEvidenceBindingInput
      .sourceReceiptLedgerSnapshotEvidenceBindingInput.receiptLedgerSnapshot += "\n"
    await rejectsBuild(mutatedSnapshot as P7VerificationEngineCompletionEventEvidenceBindingBuildInput)

    await writeFile(fixture.r18.r16BuildInput.receiptLedgerPath, "{}\n", "utf8")
    await rejectsBuild(fixture.input)
  })
})

test("P7-R19 rejects unknown fields and hostile completion-event graphs without invoking accessors", async () => {
  await withTemp(async (root) => {
    const fixture = await r19Fixture(root)
    const base = fixture.input.verificationCompletedEvent as MutableRecord

    const unknownEvent = structuredClone(base)
    unknownEvent.extra = true
    await rejectsBuild({ ...fixture.input, verificationCompletedEvent: unknownEvent })

    const unknownPayload = structuredClone(base)
    unknownPayload.payload.extra = true
    await rejectsBuild({ ...fixture.input, verificationCompletedEvent: unknownPayload })

    await rejectsBuild({ ...fixture.input, verificationCompletedEvent: new Proxy(base, {}) })

    let accessorCalls = 0
    const accessorEvent = structuredClone(base)
    Object.defineProperty(accessorEvent, "eventId", {
      enumerable: true,
      get() {
        accessorCalls += 1
        return R19_EVENT_ID
      },
    })
    await rejectsBuild({ ...fixture.input, verificationCompletedEvent: accessorEvent })
    assert.equal(accessorCalls, 0)

    const symbolEvent = structuredClone(base)
    Object.defineProperty(symbolEvent, Symbol("hidden"), { enumerable: true, value: true })
    await rejectsBuild({ ...fixture.input, verificationCompletedEvent: symbolEvent })

    const customPrototype = Object.assign(Object.create({ inherited: true }), structuredClone(base))
    await rejectsBuild({ ...fixture.input, verificationCompletedEvent: customPrototype })
  })
})

test("P7-R19 output validation and schema are closed and fail-closed", async () => {
  await withTemp(async (root) => {
    const { fixture, built } = await canonicalBuilt(root)

    await assert.rejects(validateP7VerificationEngineCompletionEventEvidenceBinding({ ...built, extra: true }, fixture.input))
    await assert.rejects(validateP7VerificationEngineCompletionEventEvidenceBinding(new Proxy(built as MutableRecord, {}), fixture.input))

    let accessorCalls = 0
    const accessorOutput = structuredClone(built) as MutableRecord
    Object.defineProperty(accessorOutput, "evidenceIdentity", {
      enumerable: true,
      get() {
        accessorCalls += 1
        return built.evidenceIdentity
      },
    })
    await assert.rejects(validateP7VerificationEngineCompletionEventEvidenceBinding(accessorOutput, fixture.input))
    assert.equal(accessorCalls, 0)

    const mutatedIdentity = structuredClone(built) as MutableRecord
    mutatedIdentity.evidenceIdentity = "0".repeat(64)
    await assert.rejects(validateP7VerificationEngineCompletionEventEvidenceBinding(mutatedIdentity, fixture.input))

    assert.equal(schemaAccepts(schema, built), true)
    assert.equal(schemaAccepts(schema, { ...built, extra: true }), false)
    assert.equal(schemaAccepts(schema, { ...built, version: "wrong" }), false)
    assert.equal(schemaAccepts(schema, { ...built, verificationReportPassed: false }), false)
    assert.equal(schemaAccepts(schema, { ...built, verificationCompletedEventPassed: false }), false)
    assert.equal(schemaAccepts(schema, { ...built, verificationReportFailedCheckIds: ["x"] }), false)
    assert.equal(schemaAccepts(schema, { ...built, verificationCompletedEventFailedCheckIds: ["x"] }), false)
    assert.equal(schemaAccepts(schema, { ...built, verificationCompletedEventSequence: 0 }), false)
    const missing = structuredClone(built) as MutableRecord
    delete missing.verificationCompletedEventIdentity
    assert.equal(schemaAccepts(schema, missing), false)
  })
})

test("P7-R19 emits no raw local material or authority claim and imports only the authorized predecessor", async () => {
  await withTemp(async (root) => {
    const { fixture, built } = await canonicalBuilt(root)
    const serialized = JSON.stringify(built)
    const snapshot = fixture.r18.r16BuildInput.sourceReceiptLedgerSnapshotEvidenceBindingInput.receiptLedgerSnapshot

    assert.equal(serialized.includes(fixture.r18.r16BuildInput.receiptLedgerPath), false)
    assert.equal(serialized.includes(snapshot), false)
    for (const forbidden of [
      "eventProducerAuthenticity",
      "eventSignature",
      "doneGate",
      "provenReady",
      "verified",
      "fixed",
      "reverified",
      "verificationExecutionAuthority",
      "rawFilesystemMetadata",
      "eventLog",
    ]) {
      assert.equal(Object.hasOwn(built, forbidden), false)
    }

    const imports = [...sourceText.matchAll(/^import[\s\S]*?from\s+"([^"]+)"/gm)].map((match) => match[1])
    assert.deepEqual(imports, [
      "node:crypto",
      "node:util",
      "./p7-verification-engine-receipt-ledger-read-evidence-binding.ts",
    ])
    for (const forbidden of [
      "node:fs",
      "node:child_process",
      "../verification/engine",
      "../verification/done-gate",
      "../execution/gateway",
      "../evidence/ledger",
      "provider",
      "network",
      "K2",
      "K5",
    ]) {
      assert.equal(sourceText.includes(forbidden), false)
    }
  })
})
