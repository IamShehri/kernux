import assert from "node:assert/strict"
import { Buffer } from "node:buffer"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { buildContextBundle } from "../src/context-engine/context-engine.ts"
import {
  K3_R5_CONTEXT_REQUEST_VERSION,
  type ContextBundle,
  type ContextBundleRequest,
  type ContextEngineInput,
} from "../src/context-engine/contracts.ts"
import type { ExecutionReceipt } from "../src/evidence/receipt.ts"
import type { RepositoryEvidence, RepositorySnapshot } from "../src/repository/contracts.ts"
import type { AstGrepStructuralQueryResult } from "../src/repository-intelligence/contracts.ts"
import { validateReviewRunRecord } from "../src/reviewer-intelligence/executor.ts"
import type { ReviewRunRecord } from "../src/reviewer-intelligence/provider-contracts.ts"
import { ReviewerIntelligenceRuntime } from "../src/reviewer-intelligence/runtime.ts"
import {
  KRI_R3_REVIEW_TEMPORAL_EVIDENCE_VERSION,
  type ReviewTemporalEvidence,
} from "../src/reviewer-intelligence/temporal-evidence.ts"
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
  buildP7ExactTargetHeadReviewRunEvidenceBinding,
  type P7ExactTargetHeadReviewRunEvidenceBinding,
  type P7ExactTargetHeadReviewRunEvidenceBindingBuildInput,
} from "../src/remediation/p7-exact-target-head-review-run-evidence-binding.ts"
import {
  buildP7TemporalPostVerificationReviewEvidenceBinding,
  type P7TemporalPostVerificationReviewEvidenceBinding,
  type P7TemporalPostVerificationReviewEvidenceBindingBuildInput,
} from "../src/remediation/p7-temporal-post-verification-review-evidence-binding.ts"
import {
  P7_R22_EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BINDING_VERSION,
  P7_R22_EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_STATE,
  buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding,
  validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding,
  type P7ExactTargetHeadCompleteReviewContextEvidenceBinding,
  type P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput,
} from "../src/remediation/p7-exact-target-head-complete-review-context-evidence-binding.ts"

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
const R21_STARTED_AT = "2026-09-06T12:00:04.200Z"
const R21_COMPLETED_AT = "2026-09-06T12:00:04.300Z"
const TEST_STARTED_AT = "2026-09-06T12:00:03.100Z"
const TEST_COMPLETED_AT = "2026-09-06T12:00:03.400Z"
const TYPES_STARTED_AT = "2026-09-06T12:00:03.500Z"
const TYPES_COMPLETED_AT = "2026-09-06T12:00:03.900Z"
const WORKSPACE = "/workspace/kodac"
const SESSION_ID = "session-p7-r22"
const TEST_COMMAND_ID = "js-root-tests-123abc"
const TYPES_COMMAND_ID = "js-root-types-456def"
const GIT_SUMMARY = "Workspace changes are evidenced (diffBytes=12, statusBytes=3)."
const POLICY_SUMMARY = "Every persisted execution receipt was authorized by policy."
const RECEIPT_IDS = [APPLY_RECEIPT_ID, GIT_DIFF_RECEIPT_ID, GIT_STATUS_RECEIPT_ID, TEST_RECEIPT_ID, TYPES_RECEIPT_ID]
const RECEIPT_SUMMARY = `${RECEIPT_IDS.length} execution receipt(s) are successful and mutation post-state is attested.`
const CONTEXT_REPOSITORY_ID = "d".repeat(64)
const CONTEXT_PATH = "src/widget.ts"
const ARCHITECTURE_PATH = "docs/architecture/review.md"
const CONTEXT_TASK = "p7-r22-exact-target-head-review"

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

function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`
  const record = value as MutableRecord
  const keys = Object.keys(record).sort((left, right) => left < right ? -1 : left > right ? 1 : 0)
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonical(record[key])}`).join(",")}}`
}

function sha256(value: unknown): string {
  const input = typeof value === "string" ? value : canonical(value)
  return createHash("sha256").update(input, "utf8").digest("hex")
}

function claim(): Record<string, unknown> {
  return {
    claimKey: "p7-r22-source-finding",
    review: {
      reviewRunId: "review-run-p7-r22-source",
      reviewerId: "provider:test",
      reviewerVersion: "v1",
      policyIdentity: "policy:p7-r22-source",
      canonicalBase: BASE,
      reviewedHead: HEAD,
    },
    path: "src/example.ts",
    range: { startLine: 10, endLine: 12 },
    summary: "A confirmed finding eligible for bounded R22 context evidence binding.",
    contractClaim: "The candidate violates one bounded invariant.",
    category: "correctness",
    severity: "high",
    confidenceBps: 9000,
    evidenceRefs: ["evidence:finding"],
  }
}

function sourceProposal(): P7ImmutablePatchProposal {
  const runtime = new ReviewerIntelligenceRuntime({ adjudicatorId: "kodac:p7-r22-test-adjudicator" })
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
    proposerIdentity: "kodac:p7-r22-test-proposer",
    patchArtifactDigest: sha256(PATCH),
    changes: CHANGES,
  })
}

function sourceAuthorization(source: P7ImmutablePatchProposal): P7PatchApplicationAuthorization {
  return buildP7PatchApplicationAuthorization({
    sourceProposal: source,
    declaration: {
      authorizerIdentity: "kodac:p7-r22-test-authorizer",
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
      { id: TEST_COMMAND_ID, category: "tests", executable: "node", args: ["scripts/run-tests.mjs"], timeoutMs: 120_000, maxOutputBytes: 1_048_576 },
      { id: TYPES_COMMAND_ID, category: "types", executable: "node", args: ["node_modules/typescript/bin/tsc", "-p", "tsconfig.json", "--noEmit"], timeoutMs: 60_000, maxOutputBytes: 1_048_576 },
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
    { id: "agent.completed", category: "agent", status: "pass", summary: "Bounded agent loop completed normally.", evidence: [{ kind: "event", ref: `session:${SESSION_ID}:agent.loop.completed` }] },
    { id: "workspace.integrity", category: "workspace", status: "pass", summary: "Workspace root and Git metadata are present.", evidence: [{ kind: "workspace", ref: WORKSPACE, digest: sha256(WORKSPACE) }] },
    { id: "git.diff", category: "diff", status: "pass", summary: GIT_SUMMARY, evidence: [{ kind: "receipt", ref: GIT_STATUS_RECEIPT_ID }, { kind: "receipt", ref: GIT_DIFF_RECEIPT_ID }] },
    { id: "evidence.receipts", category: "receipts", status: "pass", summary: RECEIPT_SUMMARY, evidence: RECEIPT_IDS.map((ref) => ({ kind: "receipt", ref })) },
    { id: "evidence.policy", category: "policy", status: "pass", summary: POLICY_SUMMARY, evidence: RECEIPT_IDS.map((ref) => ({ kind: "receipt", ref })) },
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
      { id: "verification.commands", category: "tests", status: "pass", summary: "All verification commands passed.", evidence: commands.flatMap((command) => command.evidence.map((item) => ({ ...item }))) },
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
    result: { status: "success", outputDigest: sha256(output), outputBytes: Buffer.byteLength(output, "utf8"), exitCode: 0 },
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
      { commandId: TEST_COMMAND_ID, executionIntentPreimage: testExecutionIntentPreimage, executionReceipt: successReceipt(TEST_COMMAND_ID, TEST_RECEIPT_ID, testExecutionIntentPreimage, TEST_STARTED_AT, TEST_COMPLETED_AT, "tests passed") },
      { commandId: TYPES_COMMAND_ID, executionIntentPreimage: typesExecutionIntentPreimage, executionReceipt: successReceipt(TYPES_COMMAND_ID, TYPES_RECEIPT_ID, typesExecutionIntentPreimage, TYPES_STARTED_AT, TYPES_COMPLETED_AT, "types passed") },
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
  return { sourceAgentCompletionEvidenceBinding: buildP7AgentCompletionEvidenceBinding(sourceAgentCompletionEvidenceBindingInput), sourceAgentCompletionEvidenceBindingInput }
}

function r11Input(): P7GitChangeReportEvidenceBindingBuildInput {
  const sourceWorkspaceReferenceEvidenceBindingInput = r10Input()
  return { sourceWorkspaceReferenceEvidenceBinding: buildP7WorkspaceReferenceEvidenceBinding(sourceWorkspaceReferenceEvidenceBindingInput), sourceWorkspaceReferenceEvidenceBindingInput }
}

function r12Input(): P7ReceiptReportEvidenceBindingBuildInput {
  const sourceGitChangeReportEvidenceBindingInput = r11Input()
  return { sourceGitChangeReportEvidenceBinding: buildP7GitChangeReportEvidenceBinding(sourceGitChangeReportEvidenceBindingInput), sourceGitChangeReportEvidenceBindingInput }
}

function r13Input(): P7PolicyReportEvidenceBindingBuildInput {
  const sourceReceiptReportEvidenceBindingInput = r12Input()
  return { sourceReceiptReportEvidenceBinding: buildP7ReceiptReportEvidenceBinding(sourceReceiptReportEvidenceBindingInput), sourceReceiptReportEvidenceBindingInput }
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
    result: { status: "success", outputDigest: sha256(output), outputBytes: Buffer.byteLength(output, "utf8"), exitCode: 0 },
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
  return { sourcePolicyReportEvidenceBinding: buildP7PolicyReportEvidenceBinding(sourcePolicyReportEvidenceBindingInput), sourcePolicyReportEvidenceBindingInput, receiptRecords: records }
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
    payload: { passed: true, checks: report.verificationReport.checks.length, failed: [] },
  }
}

async function r19Fixture(root: string): Promise<P7VerificationEngineCompletionEventEvidenceBindingBuildInput> {
  const r18 = await r18Fixture(root)
  const sourceVerificationEngineReceiptLedgerReadEvidenceBinding = await buildP7VerificationEngineReceiptLedgerReadEvidenceBinding(r18)
  return {
    sourceVerificationEngineReceiptLedgerReadEvidenceBinding,
    sourceVerificationEngineReceiptLedgerReadEvidenceBindingInput: r18,
    verificationCompletedEvent: completionEventFor(sourceVerificationEngineReceiptLedgerReadEvidenceBinding, r18),
  }
}

function contextCanonicalChange(change: RepositorySnapshot["workingTree"][number]): object {
  return {
    path: change.path,
    state: change.state,
    indexStatus: change.indexStatus,
    worktreeStatus: change.worktreeStatus,
    sourcePath: change.sourcePath ?? null,
  }
}

function contextContentIdentity(
  gitHead: string,
  workingTree: RepositorySnapshot["workingTree"],
  inventory: RepositorySnapshot["inventory"],
): string {
  return sha256(JSON.stringify({
    version: "k3-r2-snapshot-v1",
    gitHead,
    workingTree: workingTree.map(contextCanonicalChange),
    inventory: inventory.map((entry) => ({ path: entry.path, type: entry.type, gitObjectId: entry.gitObjectId ?? null })),
    completeness: { state: "complete", reasons: [], omittedAtLeast: 0 },
  }))
}

function contextSnapshotIdentity(contentIdentity: string): string {
  return sha256(JSON.stringify({
    version: "k3-r2-snapshot-v1",
    repositoryIdentity: { scheme: "workspace-root-sha256-v1", scope: "workspace-local", value: CONTEXT_REPOSITORY_ID },
    contentIdentity: { scheme: "sha256-canonical-repository-content-v1", value: contentIdentity },
    freshness: "current",
    completeness: { state: "complete", reasons: [], omittedAtLeast: 0 },
  }))
}

function contextSnapshot(gitHead = HEAD): RepositorySnapshot {
  const change: RepositorySnapshot["workingTree"][number] = {
    path: CONTEXT_PATH,
    state: "modified",
    indexStatus: " ",
    worktreeStatus: "M",
  }
  const workingTree = [change]
  const inventory: RepositorySnapshot["inventory"] = [
    { path: "docs", type: "directory" },
    { path: "docs/architecture", type: "directory" },
    { path: ARCHITECTURE_PATH, type: "file", gitObjectId: "e".repeat(40) },
    { path: "src", type: "directory" },
    { path: CONTEXT_PATH, type: "file", gitObjectId: "f".repeat(40) },
  ]
  const contentIdentity = contextContentIdentity(gitHead, workingTree, inventory)
  const gitEvidenceId = sha256(`${contentIdentity}\0git-derived\0${JSON.stringify(contextCanonicalChange(change))}`)
  const architectureEvidenceId = sha256(`${contentIdentity}\0heuristic-inference\0architecture-candidate\0${ARCHITECTURE_PATH}`)
  const evidence: RepositoryEvidence[] = [
    {
      evidenceId: gitEvidenceId,
      contentIdentity,
      evidenceClass: "git-derived",
      source: { id: "builtin.git.status-porcelain-v1-z.v1", kind: "builtin", provenanceRefs: ["receipt:git-status"] },
      subjectPath: CONTEXT_PATH,
      claim: { kind: "working-tree-change", value: "modified" },
    },
    {
      evidenceId: architectureEvidenceId,
      contentIdentity,
      evidenceClass: "heuristic-inference",
      source: { id: "builtin.inventory-path-heuristic.v1", kind: "builtin", provenanceRefs: [] },
      subjectPath: ARCHITECTURE_PATH,
      claim: { kind: "architecture-candidate", value: "candidate" },
    },
  ]
  return {
    version: "k3-r2-snapshot-v1",
    repositoryIdentity: { scheme: "workspace-root-sha256-v1", scope: "workspace-local", value: CONTEXT_REPOSITORY_ID },
    contentIdentity: { scheme: "sha256-canonical-repository-content-v1", value: contentIdentity },
    snapshotIdentity: { scheme: "sha256-k3-r2-snapshot-v1", value: contextSnapshotIdentity(contentIdentity) },
    gitHead,
    freshness: "current",
    completeness: { state: "complete", reasons: [], omittedAtLeast: 0 },
    workingTree,
    inventory,
    sources: [
      { id: "builtin.git.status-porcelain-v1-z.v1", kind: "builtin", provenanceRefs: ["receipt:git-status"] },
      { id: "builtin.inventory-path-heuristic.v1", kind: "builtin", provenanceRefs: [] },
    ],
    evidence,
  }
}

function contextRequest(overrides: Partial<ContextBundleRequest> = {}): ContextBundleRequest {
  return {
    version: K3_R5_CONTEXT_REQUEST_VERSION,
    kind: "build_context_bundle",
    taskId: CONTEXT_TASK,
    objective: "Review the exact target head with complete bounded canonical context.",
    targetPaths: [CONTEXT_PATH, ARCHITECTURE_PATH],
    symbolHints: ["Widget"],
    maxItems: 32,
    maxUtf8Bytes: 32 * 1024,
    ...overrides,
  }
}

function structuralIdentity(result: AstGrepStructuralQueryResult): string {
  return sha256(canonical({
    version: result.version,
    query: { kind: result.query.kind, symbol: result.query.symbol, scope: result.query.scope },
    repositoryIdentity: result.repositoryIdentity,
    snapshotIdentity: result.snapshotIdentity,
    contentIdentity: result.contentIdentity,
    candidateFiles: result.candidateFiles,
    completeness: result.completeness,
    matches: result.matches,
    source: {
      adapterId: result.source.adapterId,
      candidate: result.source.candidate,
      upstreamRepository: result.source.upstreamRepository,
      upstreamTag: result.source.upstreamTag,
      upstreamCommit: result.source.upstreamCommit,
      measuredVersion: result.source.measuredVersion,
      platformQualification: result.source.platformQualification,
      executableSha256: result.source.executableSha256,
      kodacConfigSha256: result.source.kodacConfigSha256,
      semanticStrength: result.source.semanticStrength,
    },
  }))
}

function truncatedStructuralResult(snapshot: RepositorySnapshot): AstGrepStructuralQueryResult {
  const result: AstGrepStructuralQueryResult = {
    version: "k3-r4-ast-grep-query-v1",
    query: { kind: "find_symbol_candidates", symbol: "Widget", scope: "." },
    repositoryIdentity: snapshot.repositoryIdentity.value,
    snapshotIdentity: snapshot.snapshotIdentity.value,
    contentIdentity: snapshot.contentIdentity.value,
    freshness: "current",
    candidateFiles: { included: 1, omitted: 1, identity: "7".repeat(64) },
    completeness: { state: "truncated", reasons: ["max-results"], omittedAtLeast: 1 },
    matches: [],
    source: {
      adapterId: "kodac.ast-grep-cli.structural.v1",
      candidate: "ast-grep",
      upstreamRepository: "ast-grep/ast-grep",
      upstreamTag: "0.45.1",
      upstreamCommit: "dc3d655b9edf3b2bc266d9bc46eb60f18e66b818",
      measuredVersion: "ast-grep 0.45.1",
      platformQualification: "linux-x64-k3-r3",
      executableSha256: "6a66162e0a2447af4b7524ee04195239eb1911d07f4868f918909e7d4f453eea",
      kodacConfigSha256: "ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356",
      semanticStrength: "structural-only-not-compiler-resolved",
      provenanceRefs: ["receipt:ast-grep"],
    },
    deterministic: true,
    resultIdentity: "0".repeat(64),
  }
  result.resultIdentity = structuralIdentity(result)
  return result
}

function contextInput(overrides: { gitHead?: string; request?: Partial<ContextBundleRequest>; structuralResults?: AstGrepStructuralQueryResult[] } = {}): ContextEngineInput {
  const snapshot = contextSnapshot(overrides.gitHead)
  return {
    request: contextRequest(overrides.request),
    snapshot,
    ...(overrides.structuralResults !== undefined ? { structuralResults: overrides.structuralResults } : {}),
  }
}

function reviewRunFor(
  source: P7VerificationEngineCompletionEventEvidenceBinding,
  context: ContextBundle,
  overrides: Partial<Pick<ReviewRunRecord, "taskId" | "contextBundleIdentity">> = {},
): ReviewRunRecord {
  const base: Omit<ReviewRunRecord, "reviewRunIdentity"> = {
    version: "kri-r3-review-run-v1",
    reviewRunId: sha256("p7-r22-review-run"),
    status: "COMPLETED",
    providerId: "provider:test",
    providerVersion: "v1",
    policyIdentity: "policy:p7-r22-test",
    canonicalBase: source.canonicalBase,
    reviewedHead: source.targetHead,
    evaluatedHead: source.targetHead,
    contextBundleIdentity: overrides.contextBundleIdentity ?? context.bundleIdentity,
    taskId: overrides.taskId ?? context.taskId,
    instructionsIdentity: sha256("p7-r22-review-instructions"),
    acceptedClaimCount: 0,
    findingIdentities: [],
    failureCode: null,
  }
  return { ...base, reviewRunIdentity: sha256(base) }
}

async function r20Fixture(
  root: string,
  contextEngineInput: ContextEngineInput,
  reviewOverrides: Partial<Pick<ReviewRunRecord, "taskId" | "contextBundleIdentity">> = {},
): Promise<{
  readonly sourceR19: P7VerificationEngineCompletionEventEvidenceBinding
  readonly input: P7ExactTargetHeadReviewRunEvidenceBindingBuildInput
}> {
  const sourceInput = await r19Fixture(root)
  const sourceR19 = await buildP7VerificationEngineCompletionEventEvidenceBinding(sourceInput)
  const context = buildContextBundle(contextEngineInput)
  return {
    sourceR19,
    input: {
      sourceVerificationEngineCompletionEventEvidenceBinding: sourceR19,
      sourceVerificationEngineCompletionEventEvidenceBindingInput: sourceInput,
      reviewRun: reviewRunFor(sourceR19, context, reviewOverrides),
    },
  }
}

function temporalEvidenceFor(run: ReviewRunRecord): ReviewTemporalEvidence {
  const core = {
    version: KRI_R3_REVIEW_TEMPORAL_EVIDENCE_VERSION,
    reviewRunIdentity: run.reviewRunIdentity,
    canonicalBase: run.canonicalBase,
    reviewedHead: run.reviewedHead,
    evaluatedHead: run.evaluatedHead,
    status: run.status,
    startedAt: R21_STARTED_AT,
    completedAt: R21_COMPLETED_AT,
  }
  return { ...core, temporalEvidenceIdentity: sha256(core) }
}

async function r21Fixture(
  root: string,
  canonicalContextInput: ContextEngineInput,
  reviewOverrides: Partial<Pick<ReviewRunRecord, "taskId" | "contextBundleIdentity">> = {},
): Promise<{
  readonly sourceR19: P7VerificationEngineCompletionEventEvidenceBinding
  readonly sourceR20: P7ExactTargetHeadReviewRunEvidenceBinding
  readonly input: P7TemporalPostVerificationReviewEvidenceBindingBuildInput
}> {
  const r20 = await r20Fixture(root, canonicalContextInput, reviewOverrides)
  const sourceR20 = await buildP7ExactTargetHeadReviewRunEvidenceBinding(r20.input)
  const run = validateReviewRunRecord(r20.input.reviewRun)
  return {
    sourceR19: r20.sourceR19,
    sourceR20,
    input: {
      sourceExactTargetHeadReviewRunEvidenceBinding: sourceR20,
      sourceExactTargetHeadReviewRunEvidenceBindingInput: r20.input,
      temporalEvidence: temporalEvidenceFor(run),
    },
  }
}

async function r22Fixture(
  root: string,
  options: {
    canonicalContextInput?: ContextEngineInput
    candidateContextInput?: ContextEngineInput
    reviewOverrides?: Partial<Pick<ReviewRunRecord, "taskId" | "contextBundleIdentity">>
  } = {},
): Promise<{
  readonly sourceR20: P7ExactTargetHeadReviewRunEvidenceBinding
  readonly sourceR21: P7TemporalPostVerificationReviewEvidenceBinding
  readonly input: P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput
}> {
  const canonicalContextInput = options.canonicalContextInput ?? contextInput()
  const r21 = await r21Fixture(root, canonicalContextInput, options.reviewOverrides)
  const sourceR21 = await buildP7TemporalPostVerificationReviewEvidenceBinding(r21.input)
  return {
    sourceR20: r21.sourceR20,
    sourceR21,
    input: {
      sourceTemporalPostVerificationReviewEvidenceBinding: sourceR21,
      sourceTemporalPostVerificationReviewEvidenceBindingInput: r21.input,
      contextEngineInput: options.candidateContextInput ?? canonicalContextInput,
    },
  }
}

const schema = JSON.parse(
  readFileSync(new URL("../../../schema/p7-exact-target-head-complete-review-context-evidence-binding.schema.json", import.meta.url), "utf8"),
) as SchemaRecord
const bindingSourceText = readFileSync(new URL("../src/remediation/p7-exact-target-head-complete-review-context-evidence-binding.ts", import.meta.url), "utf8")

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
    if (!Number.isInteger(value)) return false
    if (typeof node.minimum === "number" && (value as number) < node.minimum) return false
    if (typeof node.maximum === "number" && (value as number) > node.maximum) return false
    return true
  }
  if (node.type === "array") {
    if (!Array.isArray(value)) return false
    if (typeof node.minItems === "number" && value.length < node.minItems) return false
    if (typeof node.maxItems === "number" && value.length > node.maxItems) return false
    if (node.uniqueItems === true && new Set(value.map((item) => JSON.stringify(item))).size !== value.length) return false
    if (node.items !== undefined && value.some((item) => !schemaAccepts(node.items, item, root))) return false
    return true
  }
  return true
}

async function withTemp<T>(run: (root: string) => Promise<T>): Promise<T> {
  const root = await mkdtemp(join(tmpdir(), "kodac-p7-r22-"))
  try {
    return await run(root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

async function canonicalBuilt(root: string): Promise<{
  readonly fixture: Awaited<ReturnType<typeof r22Fixture>>
  readonly built: P7ExactTargetHeadCompleteReviewContextEvidenceBinding
}> {
  const fixture = await r22Fixture(root)
  const built = await buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(fixture.input)
  return { fixture, built }
}

test("P7-R22 binds the exact R21/R20 review lineage to a reproducible exact-head complete K3-R5 context bundle", async () => {
  await withTemp(async (root) => {
    const { fixture, built } = await canonicalBuilt(root)
    const rebuiltContext = buildContextBundle(fixture.input.contextEngineInput)

    assert.equal(built.version, P7_R22_EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BINDING_VERSION)
    assert.equal(built.state, P7_R22_EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_STATE)
    assert.equal(built.sourceTemporalPostVerificationReviewEvidenceIdentity, fixture.sourceR21.evidenceIdentity)
    assert.equal(built.sourceExactTargetHeadReviewRunEvidenceIdentity, fixture.sourceR20.evidenceIdentity)
    assert.equal(built.targetHead, HEAD)
    assert.equal(built.contextSnapshotGitHead, HEAD)
    assert.equal(built.reviewContextBundleIdentity, rebuiltContext.bundleIdentity)
    assert.equal(built.reviewTaskId, rebuiltContext.taskId)
    assert.equal(built.contextFreshness, "current")
    assert.equal(built.contextCompletenessState, "complete")
    assert.deepEqual(built.contextCompletenessReasons, [])
    assert.equal(built.contextOmittedAtLeast, 0)
    assert.deepEqual(built.contextItemIdentities, rebuiltContext.items.map((item) => item.itemId))
    assert.equal(built.contextItemCount, rebuiltContext.items.length)
    assert.equal(Object.isFrozen(built), true)
    assert.equal(Object.isFrozen(built.contextItemIdentities), true)
    assert.equal(Object.isFrozen(built.contextCompletenessReasons), true)
    assert.equal(schemaAccepts(schema, built), true)
    assert.deepEqual(await validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding(built, fixture.input), built)

    const serialized = JSON.stringify(built)
    assert.equal(serialized.includes("working-tree-change:modified"), false)
    assert.equal(serialized.includes("receipt:git-status"), false)
    assert.equal(Object.hasOwn(built, "contextItems"), false)
    assert.equal(Object.hasOwn(built, "providerOutput"), false)
  })
})

test("P7-R22 is deterministic for identical lineage and context source", async () => {
  await withTemp(async (root) => {
    const fixture = await r22Fixture(root)
    const first = await buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(fixture.input)
    const second = await buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(fixture.input)
    assert.deepEqual(second, first)
    assert.equal(second.evidenceIdentity, first.evidenceIdentity)
  })
})

test("P7-R22 rejects review context-bundle identity, task, and exact snapshot-head mismatches", async () => {
  await withTemp(async (root) => {
    const canonicalContext = contextInput()

    const bundleMismatch = await r22Fixture(root, {
      canonicalContextInput: canonicalContext,
      reviewOverrides: { contextBundleIdentity: "9".repeat(64) },
    })
    await assert.rejects(
      buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(bundleMismatch.input),
      /bundleIdentity.*P7-R20 reviewContextBundleIdentity/,
    )

    const taskMismatch = await r22Fixture(root, {
      canonicalContextInput: canonicalContext,
      reviewOverrides: { taskId: "different-review-task" },
    })
    await assert.rejects(
      buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(taskMismatch.input),
      /taskId.*P7-R20 reviewTaskId/,
    )

    const wrongHead = await r22Fixture(root, {
      canonicalContextInput: canonicalContext,
      candidateContextInput: contextInput({ gitHead: OTHER_HEAD }),
    })
    await assert.rejects(
      buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(wrongHead.input),
      /snapshot.gitHead.*P7-R21 targetHead/,
    )
  })
})

test("P7-R22 rejects item-budget, byte-budget, source-input-limit, and unsupported-evidence context sources", async () => {
  await withTemp(async (root) => {
    const canonicalContext = contextInput()
    const itemBudget = await r22Fixture(root, {
      canonicalContextInput: canonicalContext,
      candidateContextInput: contextInput({ request: { maxItems: 1 } }),
    })
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(itemBudget.input))

    const byteBudget = await r22Fixture(root, {
      canonicalContextInput: canonicalContext,
      candidateContextInput: contextInput({ request: { maxUtf8Bytes: 1 } }),
    })
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(byteBudget.input))

    const structuralSnapshot = contextSnapshot()
    const sourceLimited = await r22Fixture(root, {
      canonicalContextInput: canonicalContext,
      candidateContextInput: {
        request: contextRequest(),
        snapshot: structuralSnapshot,
        structuralResults: [truncatedStructuralResult(structuralSnapshot)],
      },
    })
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(sourceLimited.input))

    const unsupported = contextInput()
    const bad = structuredClone(unsupported) as MutableRecord
    bad.snapshot.evidence[0].evidenceClass = "model-hypothesis"
    const unsupportedFixture = await r22Fixture(root, {
      canonicalContextInput: canonicalContext,
      candidateContextInput: bad as ContextEngineInput,
    })
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(unsupportedFixture.input))
  })
})

test("P7-R22 rejects predecessor and context-source tampering", async () => {
  await withTemp(async (root) => {
    const fixture = await r22Fixture(root)

    const r21Tamper = structuredClone(fixture.input) as MutableRecord
    r21Tamper.sourceTemporalPostVerificationReviewEvidenceBinding.evidenceIdentity = "0".repeat(64)
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(r21Tamper as P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput))

    const r20Tamper = structuredClone(fixture.input) as MutableRecord
    r20Tamper.sourceTemporalPostVerificationReviewEvidenceBindingInput.sourceExactTargetHeadReviewRunEvidenceBinding.evidenceIdentity = "0".repeat(64)
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(r20Tamper as P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput))

    const sourceIdentityTamper = structuredClone(fixture.input) as MutableRecord
    sourceIdentityTamper.contextEngineInput.snapshot.snapshotIdentity.value = "0".repeat(64)
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(sourceIdentityTamper as P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput))

    const requestTamper = structuredClone(fixture.input) as MutableRecord
    requestTamper.contextEngineInput.request.objective = "Different bounded review objective"
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(requestTamper as P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput))
  })
})

test("P7-R22 output validator rejects selected-item, completeness, identity, and unknown-field tampering", async () => {
  await withTemp(async (root) => {
    const { fixture, built } = await canonicalBuilt(root)

    const selected = structuredClone(built) as MutableRecord
    selected.contextItemIdentities[0] = "0".repeat(64)
    await assert.rejects(validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding(selected, fixture.input))

    const nonzero = structuredClone(built) as MutableRecord
    nonzero.contextOmittedAtLeast = 1
    await assert.rejects(validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding(nonzero, fixture.input))

    const reasons = structuredClone(built) as MutableRecord
    reasons.contextCompletenessReasons = ["item-budget"]
    await assert.rejects(validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding(reasons, fixture.input))

    const identity = structuredClone(built) as MutableRecord
    identity.evidenceIdentity = "0".repeat(64)
    await assert.rejects(validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding(identity, fixture.input))

    const extra = { ...structuredClone(built), unexpected: true }
    await assert.rejects(validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding(extra, fixture.input))
    assert.equal(schemaAccepts(schema, extra), false)
    assert.equal(schema.additionalProperties, false)
  })
})

test("P7-R22 rejects Proxy, accessor, symbol, alias/cycle, and non-JSON source graphs before inherited builders observe them", async () => {
  await withTemp(async (root) => {
    const fixture = await r22Fixture(root)

    const proxy = new Proxy(structuredClone(fixture.input), {})
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(proxy as P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput), /Proxy/)

    let getterCalls = 0
    const accessor = structuredClone(fixture.input) as MutableRecord
    Object.defineProperty(accessor, "contextEngineInput", {
      enumerable: true,
      get() {
        getterCalls += 1
        return fixture.input.contextEngineInput
      },
    })
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(accessor as P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput), /data property/)
    assert.equal(getterCalls, 0)

    const symbol = structuredClone(fixture.input) as MutableRecord
    Object.defineProperty(symbol, Symbol("hidden"), { enumerable: true, value: "hidden" })
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(symbol as P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput), /symbol/)

    const alias = structuredClone(fixture.input) as MutableRecord
    alias.contextEngineInput.request.symbolHints = alias.contextEngineInput.request.targetPaths
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(alias as P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput), /aliases or cycles/)

    const cycle = structuredClone(fixture.input) as MutableRecord
    cycle.contextEngineInput.self = cycle.contextEngineInput
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(cycle as P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput), /aliases or cycles/)

    const nonJson = structuredClone(fixture.input) as MutableRecord
    nonJson.contextEngineInput.request.extra = () => true
    await assert.rejects(buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(nonJson as P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput), /JSON-compatible/)
  })
})

test("P7-R22 schema is closed and production source exposes no forbidden side-effect surface", async () => {
  await withTemp(async (root) => {
    const { built } = await canonicalBuilt(root)
    assert.equal(schemaAccepts(schema, built), true)
    assert.equal(schema.additionalProperties, false)
    assert.ok(Array.isArray(schema.required))
    assert.deepEqual(new Set(schema.required), new Set(Object.keys(built)))
  })

  const importLines = bindingSourceText.split("\n").filter((line) => line.startsWith("import ") || line.trimStart().startsWith("} from "))
  const imports = importLines.join("\n")
  for (const forbidden of ["node:fs", "node:child_process", "node:http", "node:https", "node:net", "node:tls", "node:dgram", "node:worker_threads"]) {
    assert.equal(imports.includes(forbidden), false, `forbidden production import: ${forbidden}`)
  }
  assert.equal(bindingSourceText.includes("fetch("), false)
  assert.equal(bindingSourceText.includes("process.env"), false)
  assert.equal(bindingSourceText.includes("writeFile"), false)
})
