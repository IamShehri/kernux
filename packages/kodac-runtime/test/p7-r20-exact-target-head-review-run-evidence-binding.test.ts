import assert from "node:assert/strict"
import { Buffer } from "node:buffer"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import type { ExecutionReceipt } from "../src/evidence/receipt.ts"
import {
  ReviewerExecutionRuntime,
  validateReviewRunRecord,
} from "../src/reviewer-intelligence/executor.ts"
import type { ReviewRunRecord } from "../src/reviewer-intelligence/provider-contracts.ts"
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
  buildP7VerificationEngineCompletionEventEvidenceBinding,
  type P7VerificationEngineCompletionEventEvidenceBinding,
  type P7VerificationEngineCompletionEventEvidenceBindingBuildInput,
} from "../src/remediation/p7-verification-engine-completion-event-evidence-binding.ts"
import {
  P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BINDING_VERSION,
  P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BOUND_STATE,
  buildP7ExactTargetHeadReviewRunEvidenceBinding,
  validateP7ExactTargetHeadReviewRunEvidenceBinding,
  type P7ExactTargetHeadReviewRunEvidenceBinding,
  type P7ExactTargetHeadReviewRunEvidenceBindingBuildInput,
} from "../src/remediation/p7-exact-target-head-review-run-evidence-binding.ts"

type MutableRecord = Record<string, any>
type SchemaRecord = Record<string, any>

const BASE = "a".repeat(40)
const HEAD = "b".repeat(40)
const OTHER_HEAD = "c".repeat(40)
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
const SESSION_ID = "session-p7-r20"
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

function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`
  const record = value as MutableRecord
  const keys = Object.keys(record).sort((left, right) => left < right ? -1 : left > right ? 1 : 0)
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonical(record[key])}`).join(",")}}`
}

function claim(): Record<string, unknown> {
  return {
    claimKey: "p7-r20-source-finding",
    review: {
      reviewRunId: "review-run-p7-r20-source",
      reviewerId: "provider:test",
      reviewerVersion: "v1",
      policyIdentity: "policy:p7-r20-source",
      canonicalBase: BASE,
      reviewedHead: HEAD,
    },
    path: "src/example.ts",
    range: { startLine: 10, endLine: 12 },
    summary: "A confirmed finding eligible for bounded exact-target-head review-run evidence binding.",
    contractClaim: "The candidate violates one bounded invariant.",
    category: "correctness",
    severity: "high",
    confidenceBps: 9000,
    evidenceRefs: ["evidence:finding"],
  }
}

function sourceProposal(): P7ImmutablePatchProposal {
  const runtime = new ReviewerIntelligenceRuntime({ adjudicatorId: "kodac:p7-r20-test-adjudicator" })
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
    proposerIdentity: "kodac:p7-r20-test-proposer",
    patchArtifactDigest: sha256(PATCH),
    changes: CHANGES,
  })
}

function sourceAuthorization(source: P7ImmutablePatchProposal): P7PatchApplicationAuthorization {
  return buildP7PatchApplicationAuthorization({
    sourceProposal: source,
    declaration: {
      authorizerIdentity: "kodac:p7-r20-test-authorizer",
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

async function r18Fixture(root: string): Promise<P7VerificationEngineReceiptLedgerReadEvidenceBindingBuildInput> {
  const r16BuildInput = await r16Input(root)
  const sourceReceiptLedgerFileReadEvidenceBinding = await buildP7ReceiptLedgerFileReadEvidenceBinding(r16BuildInput)
  return {
    sourceReceiptLedgerFileReadEvidenceBinding,
    sourceReceiptLedgerFileReadEvidenceBindingInput: r16BuildInput,
    verificationReceiptLedgerReadEvent: readEventFor(sourceReceiptLedgerFileReadEvidenceBinding),
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

async function r19Fixture(root: string): Promise<P7VerificationEngineCompletionEventEvidenceBindingBuildInput> {
  const r18 = await r18Fixture(root)
  const sourceVerificationEngineReceiptLedgerReadEvidenceBinding =
    await buildP7VerificationEngineReceiptLedgerReadEvidenceBinding(r18)
  return {
    sourceVerificationEngineReceiptLedgerReadEvidenceBinding,
    sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput: r18,
    verificationCompletedEvent: completionEventFor(sourceVerificationEngineReceiptLedgerReadEvidenceBinding, r18),
  }
}

function reviewRunFor(source: P7VerificationEngineCompletionEventEvidenceBinding): ReviewRunRecord {
  const base: Omit<ReviewRunRecord, "reviewRunIdentity"> = {
    version: "kri-r3-review-run-v1",
    reviewRunId: sha256("p7-r20-review-run"),
    status: "COMPLETED",
    providerId: "provider:test",
    providerVersion: "v1",
    policyIdentity: "policy:p7-r20-test",
    canonicalBase: source.canonicalBase,
    reviewedHead: source.targetHead,
    evaluatedHead: source.targetHead,
    contextBundleIdentity: sha256("p7-r20-context-bundle"),
    taskId: "p7-r20-exact-target-head-review",
    instructionsIdentity: sha256("p7-r20-review-instructions"),
    acceptedClaimCount: 0,
    findingIdentities: [],
    failureCode: null,
  }
  return { ...base, reviewRunIdentity: sha256(canonical(base)) }
}

function rebindReviewRun(value: MutableRecord): MutableRecord {
  const base = structuredClone(value) as MutableRecord
  delete base.reviewRunIdentity
  value.reviewRunIdentity = sha256(canonical(base))
  return value
}

async function r20Fixture(root: string): Promise<{
  readonly input: P7ExactTargetHeadReviewRunEvidenceBindingBuildInput
  readonly source: P7VerificationEngineCompletionEventEvidenceBinding
}> {
  const sourceInput = await r19Fixture(root)
  const source = await buildP7VerificationEngineCompletionEventEvidenceBinding(sourceInput)
  return {
    source,
    input: {
      sourceVerificationEngineCompletionEventEvidenceBinding: source,
      sourceVerificationEngineCompletionEventEvidenceBindingInput: sourceInput,
      reviewRun: reviewRunFor(source),
    },
  }
}

const schema = JSON.parse(
  readFileSync(new URL("../../../schema/p7-exact-target-head-review-run-evidence-binding.schema.json", import.meta.url), "utf8"),
) as SchemaRecord
const sourceText = readFileSync(
  new URL("../src/remediation/p7-exact-target-head-review-run-evidence-binding.ts", import.meta.url),
  "utf8",
)
const executorText = readFileSync(new URL("../src/reviewer-intelligence/executor.ts", import.meta.url), "utf8")

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
    if (typeof node.maxItems === "number" && value.length > node.maxItems) return false
    return node.items === undefined || value.every((item) => schemaAccepts(node.items, item, root))
  }
  return true
}

async function withTemp<T>(run: (root: string) => Promise<T>): Promise<T> {
  const root = await mkdtemp(join(tmpdir(), "kodac-p7-r20-"))
  try {
    return await run(root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

async function canonicalBuilt(root: string): Promise<{
  readonly fixture: Awaited<ReturnType<typeof r20Fixture>>
  readonly built: P7ExactTargetHeadReviewRunEvidenceBinding
}> {
  const fixture = await r20Fixture(root)
  const built = await buildP7ExactTargetHeadReviewRunEvidenceBinding(fixture.input)
  return { fixture, built }
}

test("P7-R20 binds one canonical COMPLETED zero-finding review run to the exact R19 target head", async () => {
  await withTemp(async (root) => {
    const { fixture, built } = await canonicalBuilt(root)
    const reviewRun = fixture.input.reviewRun as ReviewRunRecord

    assert.equal(built.version, P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BINDING_VERSION)
    assert.equal(built.state, P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BOUND_STATE)
    assert.equal(built.sourceVerificationEngineCompletionEventEvidenceIdentity, fixture.source.evidenceIdentity)
    assert.equal(built.canonicalBase, fixture.source.canonicalBase)
    assert.equal(built.targetHead, fixture.source.targetHead)
    assert.equal(built.reviewRunId, reviewRun.reviewRunId)
    assert.equal(built.reviewRunIdentity, reviewRun.reviewRunIdentity)
    assert.equal(built.reviewStatus, "COMPLETED")
    assert.equal(built.reviewedHead, fixture.source.targetHead)
    assert.equal(built.evaluatedHead, fixture.source.targetHead)
    assert.equal(built.acceptedClaimCount, 0)
    assert.deepEqual(built.findingIdentities, [])
    assert.equal(Object.isFrozen(built), true)
    assert.equal(Object.isFrozen(built.findingIdentities), true)
    assert.equal(schemaAccepts(schema, built), true)
    assert.deepEqual(await validateP7ExactTargetHeadReviewRunEvidenceBinding(built, fixture.input), built)
  })
})

test("P7-R20 standalone review-run validator is the existing KRI validator semantics", async () => {
  await withTemp(async (root) => {
    const fixture = await r20Fixture(root)
    const run = fixture.input.reviewRun
    const runtime = new ReviewerExecutionRuntime({
      provider: { providerId: "provider:test", providerVersion: "v1", async review() { return { claims: [] } } },
      findingRuntime: new ReviewerIntelligenceRuntime({ adjudicatorId: "kodac:p7-r20-validator-parity" }),
      readCurrentHead: () => HEAD,
    })
    assert.deepEqual(validateReviewRunRecord(run), runtime.validateReviewRunRecord(run))

    const tampered = structuredClone(run) as MutableRecord
    tampered.reviewRunIdentity = "0".repeat(64)
    assert.throws(() => validateReviewRunRecord(tampered), /review run identity mismatch/)
    assert.throws(() => runtime.validateReviewRunRecord(tampered), /review run identity mismatch/)

    assert.match(executorText, /export function validateReviewRunRecord\(input: unknown\): ReviewRunRecord \{ return validateRun\(input\) \}/)
    assert.match(executorText, /validateReviewRunRecord\(input: unknown\): ReviewRunRecord \{ return validateReviewRunRecord\(input\) \}/)
  })
})

test("P7-R20 is deterministic and content-addresses the exact normalized review-run identity", async () => {
  await withTemp(async (root) => {
    const fixture = await r20Fixture(root)
    const first = await buildP7ExactTargetHeadReviewRunEvidenceBinding(fixture.input)
    const repeated = await buildP7ExactTargetHeadReviewRunEvidenceBinding(fixture.input)
    assert.deepEqual(repeated, first)

    const changed = structuredClone(fixture.input) as MutableRecord
    changed.reviewRun.reviewRunId = sha256("p7-r20-review-run-second-occurrence")
    rebindReviewRun(changed.reviewRun)
    const second = await buildP7ExactTargetHeadReviewRunEvidenceBinding(changed as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput)
    assert.notEqual(second.reviewRunIdentity, first.reviewRunIdentity)
    assert.notEqual(second.evidenceIdentity, first.evidenceIdentity)
  })
})

test("P7-R20 rejects every non-COMPLETED canonical KRI run state", async () => {
  await withTemp(async (root) => {
    const fixture = await r20Fixture(root)
    const cases: Array<[ReviewRunRecord["status"], ReviewRunRecord["failureCode"]]> = [
      ["STALE", null],
      ["PROVIDER_FAILED", "provider-error"],
      ["TIMED_OUT", "timeout"],
      ["INVALID_PROVIDER_OUTPUT", "invalid-output"],
    ]
    for (const [status, failureCode] of cases) {
      const candidate = structuredClone(fixture.input) as MutableRecord
      candidate.reviewRun.status = status
      candidate.reviewRun.failureCode = failureCode
      if (status === "STALE") candidate.reviewRun.evaluatedHead = OTHER_HEAD
      rebindReviewRun(candidate.reviewRun)
      await assert.rejects(
        buildP7ExactTargetHeadReviewRunEvidenceBinding(candidate as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput),
        /reviewRun\.status must equal COMPLETED/,
      )
    }
  })
})

test("P7-R20 rejects base/head mismatch and any accepted claim or finding", async () => {
  await withTemp(async (root) => {
    const fixture = await r20Fixture(root)

    const baseMismatch = structuredClone(fixture.input) as MutableRecord
    baseMismatch.reviewRun.canonicalBase = OTHER_HEAD
    rebindReviewRun(baseMismatch.reviewRun)
    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(baseMismatch as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput), /canonicalBase/)

    const headMismatch = structuredClone(fixture.input) as MutableRecord
    headMismatch.reviewRun.reviewedHead = OTHER_HEAD
    headMismatch.reviewRun.evaluatedHead = OTHER_HEAD
    rebindReviewRun(headMismatch.reviewRun)
    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(headMismatch as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput), /reviewedHead/)

    const evaluatedMismatch = structuredClone(fixture.input) as MutableRecord
    evaluatedMismatch.reviewRun.evaluatedHead = OTHER_HEAD
    rebindReviewRun(evaluatedMismatch.reviewRun)
    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(evaluatedMismatch as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput))

    const finding = structuredClone(fixture.input) as MutableRecord
    finding.reviewRun.acceptedClaimCount = 1
    finding.reviewRun.findingIdentities = [sha256("p7-r20-finding")]
    rebindReviewRun(finding.reviewRun)
    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(finding as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput), /acceptedClaimCount/)
  })
})

test("P7-R20 fails closed on review-run identity tampering and exact R19 predecessor drift", async () => {
  await withTemp(async (root) => {
    const fixture = await r20Fixture(root)

    const reviewTamper = structuredClone(fixture.input) as MutableRecord
    reviewTamper.reviewRun.reviewRunIdentity = "f".repeat(64)
    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(reviewTamper as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput), /review run identity mismatch/)

    const predecessorTamper = structuredClone(fixture.input) as MutableRecord
    predecessorTamper.sourceVerificationEngineCompletionEventEvidenceBinding.evidenceIdentity = "f".repeat(64)
    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(predecessorTamper as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput))

    const lineageTamper = structuredClone(fixture.input) as MutableRecord
    lineageTamper.sourceVerificationEngineCompletionEventEvidenceBindingInput.verificationCompletedEvent.eventId =
      "a23e4567-e89b-42d3-a456-42661417400a"
    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(lineageTamper as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput))
  })
})

test("P7-R20 snapshots the safe predecessor/review graph before inherited asynchronous validation", async () => {
  await withTemp(async (root) => {
    const fixture = await r20Fixture(root)
    const mutable = structuredClone(fixture.input) as MutableRecord
    const pending = buildP7ExactTargetHeadReviewRunEvidenceBinding(mutable as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput)

    mutable.reviewRun.reviewRunIdentity = "0".repeat(64)
    mutable.sourceVerificationEngineCompletionEventEvidenceBinding.evidenceIdentity = "0".repeat(64)

    const built = await pending
    assert.equal(built.reviewRunIdentity, (fixture.input.reviewRun as ReviewRunRecord).reviewRunIdentity)
    assert.equal(built.sourceVerificationEngineCompletionEventEvidenceIdentity, fixture.source.evidenceIdentity)
  })
})

test("P7-R20 rejects unknown fields, Proxy/accessor/symbol input, aliases, and cycles without invoking accessors", async () => {
  await withTemp(async (root) => {
    const fixture = await r20Fixture(root)

    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding({ ...fixture.input, extra: true } as any))

    const unknownRun = structuredClone(fixture.input) as MutableRecord
    unknownRun.reviewRun.extra = true
    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(unknownRun as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput))

    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(new Proxy(fixture.input as any, {})))

    let accessorCalls = 0
    const accessor = structuredClone(fixture.input) as MutableRecord
    Object.defineProperty(accessor.reviewRun, "reviewRunId", {
      enumerable: true,
      get() {
        accessorCalls += 1
        return sha256("p7-r20-review-run")
      },
    })
    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(accessor as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput))
    assert.equal(accessorCalls, 0)

    const symbol = structuredClone(fixture.input) as MutableRecord
    Object.defineProperty(symbol.reviewRun, Symbol("hidden"), { enumerable: true, value: true })
    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(symbol as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput))

    const alias = structuredClone(fixture.input) as MutableRecord
    const shared: any[] = []
    alias.reviewRun.reviewRunId = shared
    alias.reviewRun.findingIdentities = shared
    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(alias as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput), /aliases or cycles/)

    const cycle = structuredClone(fixture.input) as MutableRecord
    cycle.reviewRun.findingIdentities.push(cycle.reviewRun.findingIdentities)
    await assert.rejects(buildP7ExactTargetHeadReviewRunEvidenceBinding(cycle as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput), /aliases or cycles/)
  })
})

test("P7-R20 output validation and schema reject tampering, hostile fields, additional properties, and non-SHA1 heads", async () => {
  await withTemp(async (root) => {
    const { fixture, built } = await canonicalBuilt(root)

    await assert.rejects(validateP7ExactTargetHeadReviewRunEvidenceBinding({ ...built, extra: true }, fixture.input))
    await assert.rejects(validateP7ExactTargetHeadReviewRunEvidenceBinding(new Proxy(built as any, {}), fixture.input))

    let accessorCalls = 0
    const accessor = structuredClone(built) as MutableRecord
    Object.defineProperty(accessor, "evidenceIdentity", {
      enumerable: true,
      get() {
        accessorCalls += 1
        return built.evidenceIdentity
      },
    })
    await assert.rejects(validateP7ExactTargetHeadReviewRunEvidenceBinding(accessor, fixture.input))
    assert.equal(accessorCalls, 0)

    const symbol = structuredClone(built) as MutableRecord
    Object.defineProperty(symbol, Symbol("hidden"), { enumerable: true, value: true })
    await assert.rejects(validateP7ExactTargetHeadReviewRunEvidenceBinding(symbol, fixture.input))

    const identityTamper = { ...built, evidenceIdentity: "0".repeat(64) }
    await assert.rejects(validateP7ExactTargetHeadReviewRunEvidenceBinding(identityTamper, fixture.input))

    assert.equal(schemaAccepts(schema, built), true)
    assert.equal(schemaAccepts(schema, { ...built, extra: true }), false)
    assert.equal(schemaAccepts(schema, { ...built, version: "wrong" }), false)
    assert.equal(schemaAccepts(schema, { ...built, reviewStatus: "STALE" }), false)
    assert.equal(schemaAccepts(schema, { ...built, acceptedClaimCount: 1 }), false)
    assert.equal(schemaAccepts(schema, { ...built, findingIdentities: [sha256("finding")] }), false)
    assert.equal(schemaAccepts(schema, { ...built, targetHead: "d".repeat(64) }), false)
    assert.equal(schemaAccepts(schema, { ...built, reviewedHead: "d".repeat(64) }), false)
    const missing = structuredClone(built) as MutableRecord
    delete missing.reviewRunIdentity
    assert.equal(schemaAccepts(schema, missing), false)
  })
})

test("P7-R20 emits only bounded identity/status facts and has no forbidden runtime or side-effect surface", async () => {
  await withTemp(async (root) => {
    const { fixture, built } = await canonicalBuilt(root)
    const serialized = JSON.stringify(built)
    const sourceInput = fixture.input.sourceVerificationEngineCompletionEventEvidenceBindingInput
    const receiptPath = sourceInput.sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput
      .sourceReceiptLedgerFileReadEvidenceBindingInput.receiptLedgerPath
    const receiptSnapshot = sourceInput.sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput
      .sourceReceiptLedgerFileReadEvidenceBindingInput.sourceReceiptLedgerSnapshotEvidenceBindingInput.receiptLedgerSnapshot

    assert.equal(serialized.includes(receiptPath), false)
    assert.equal(serialized.includes(receiptSnapshot), false)
    for (const forbidden of [
      "providerResponse",
      "contextText",
      "repositoryContent",
      "rawPath",
      "secret",
      "networkResponse",
      "filesystemMutation",
      "toolInvocation",
      "temporalPostVerificationReview",
      "reviewerAuthenticity",
      "doneGate",
      "verified",
      "fixed",
      "reverified",
      "autofix",
      "patchRetryAuthority",
    ]) {
      assert.equal(Object.hasOwn(built, forbidden), false)
    }

    const imports = [...sourceText.matchAll(/^import[\s\S]*?from\s+"([^"]+)"/gm)].map((match) => match[1])
    assert.deepEqual(imports, [
      "node:crypto",
      "node:util",
      "../reviewer-intelligence/executor.ts",
      "../reviewer-intelligence/provider-contracts.ts",
      "./p7-verification-engine-completion-event-evidence-binding.ts",
    ])
    for (const forbidden of [
      "node:fs",
      "node:child_process",
      "node:net",
      "node:http",
      "node:https",
      "fetch(",
      "process.env",
      "writeFile",
      "appendFile",
      "spawn(",
      "exec(",
      ".review(",
    ]) {
      assert.equal(sourceText.includes(forbidden), false)
    }
  })
})
