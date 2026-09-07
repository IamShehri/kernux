import assert from "node:assert/strict"
import { Buffer } from "node:buffer"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { K3_R5_CONTEXT_BUNDLE_VERSION, K3_R5_SELECTION_STRATEGY_ID, type ContextBundle } from "../src/context-engine/contracts.ts"
import type { ExecutionReceipt } from "../src/evidence/receipt.ts"
import { ReviewerExecutionRuntime, validateReviewRunRecord } from "../src/reviewer-intelligence/executor.ts"
import type { ReviewRunRecord } from "../src/reviewer-intelligence/provider-contracts.ts"
import { ReviewerIntelligenceRuntime } from "../src/reviewer-intelligence/runtime.ts"
import {
  KRI_R3_REVIEW_TEMPORAL_EVIDENCE_VERSION,
  executeReviewWithTemporalEvidence,
  validateReviewTemporalEvidence,
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
  P7_R21_TEMPORAL_POST_VERIFICATION_REVIEW_EVIDENCE_BINDING_VERSION,
  P7_R21_TEMPORAL_POST_VERIFICATION_REVIEW_EVIDENCE_BOUND_STATE,
  buildP7TemporalPostVerificationReviewEvidenceBinding,
  validateP7TemporalPostVerificationReviewEvidenceBinding,
  type P7TemporalPostVerificationReviewEvidenceBinding,
  type P7TemporalPostVerificationReviewEvidenceBindingBuildInput,
} from "../src/remediation/p7-temporal-post-verification-review-evidence-binding.ts"

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
const SESSION_ID = "session-p7-r21"
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
    claimKey: "p7-r21-source-finding",
    review: {
      reviewRunId: "review-run-p7-r21-source",
      reviewerId: "provider:test",
      reviewerVersion: "v1",
      policyIdentity: "policy:p7-r21-source",
      canonicalBase: BASE,
      reviewedHead: HEAD,
    },
    path: "src/example.ts",
    range: { startLine: 10, endLine: 12 },
    summary: "A confirmed finding eligible for bounded temporal post-verification review evidence binding.",
    contractClaim: "The candidate violates one bounded invariant.",
    category: "correctness",
    severity: "high",
    confidenceBps: 9000,
    evidenceRefs: ["evidence:finding"],
  }
}

function sourceProposal(): P7ImmutablePatchProposal {
  const runtime = new ReviewerIntelligenceRuntime({ adjudicatorId: "kodac:p7-r21-test-adjudicator" })
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
    proposerIdentity: "kodac:p7-r21-test-proposer",
    patchArtifactDigest: sha256(PATCH),
    changes: CHANGES,
  })
}

function sourceAuthorization(source: P7ImmutablePatchProposal): P7PatchApplicationAuthorization {
  return buildP7PatchApplicationAuthorization({
    sourceProposal: source,
    declaration: {
      authorizerIdentity: "kodac:p7-r21-test-authorizer",
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

function reviewRunFor(source: P7VerificationEngineCompletionEventEvidenceBinding): ReviewRunRecord {
  const base: Omit<ReviewRunRecord, "reviewRunIdentity"> = {
    version: "kri-r3-review-run-v1",
    reviewRunId: sha256("p7-r21-review-run"),
    status: "COMPLETED",
    providerId: "provider:test",
    providerVersion: "v1",
    policyIdentity: "policy:p7-r21-test",
    canonicalBase: source.canonicalBase,
    reviewedHead: source.targetHead,
    evaluatedHead: source.targetHead,
    contextBundleIdentity: sha256("p7-r21-context-bundle"),
    taskId: "p7-r21-exact-target-head-review",
    instructionsIdentity: sha256("p7-r21-review-instructions"),
    acceptedClaimCount: 0,
    findingIdentities: [],
    failureCode: null,
  }
  return { ...base, reviewRunIdentity: sha256(base) }
}

async function r20Fixture(root: string): Promise<{
  readonly sourceR19: P7VerificationEngineCompletionEventEvidenceBinding
  readonly input: P7ExactTargetHeadReviewRunEvidenceBindingBuildInput
}> {
  const sourceInput = await r19Fixture(root)
  const sourceR19 = await buildP7VerificationEngineCompletionEventEvidenceBinding(sourceInput)
  return {
    sourceR19,
    input: {
      sourceVerificationEngineCompletionEventEvidenceBinding: sourceR19,
      sourceVerificationEngineCompletionEventEvidenceBindingInput: sourceInput,
      reviewRun: reviewRunFor(sourceR19),
    },
  }
}

function temporalEvidenceFor(
  run: ReviewRunRecord,
  startedAt = R21_STARTED_AT,
  completedAt = R21_COMPLETED_AT,
  overrides: Partial<Omit<ReviewTemporalEvidence, "temporalEvidenceIdentity">> = {},
): ReviewTemporalEvidence {
  const core = {
    version: KRI_R3_REVIEW_TEMPORAL_EVIDENCE_VERSION,
    reviewRunIdentity: run.reviewRunIdentity,
    canonicalBase: run.canonicalBase,
    reviewedHead: run.reviewedHead,
    evaluatedHead: run.evaluatedHead,
    status: run.status,
    startedAt,
    completedAt,
    ...overrides,
  }
  return { ...core, temporalEvidenceIdentity: sha256(core) }
}

function rebindTemporal(value: MutableRecord): MutableRecord {
  const core = structuredClone(value) as MutableRecord
  delete core.temporalEvidenceIdentity
  value.temporalEvidenceIdentity = sha256(core)
  return value
}

async function r21Fixture(root: string): Promise<{
  readonly sourceR19: P7VerificationEngineCompletionEventEvidenceBinding
  readonly sourceR20: P7ExactTargetHeadReviewRunEvidenceBinding
  readonly input: P7TemporalPostVerificationReviewEvidenceBindingBuildInput
}> {
  const r20 = await r20Fixture(root)
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

const schema = JSON.parse(
  readFileSync(new URL("../../../schema/p7-temporal-post-verification-review-evidence-binding.schema.json", import.meta.url), "utf8"),
) as SchemaRecord
const temporalSourceText = readFileSync(new URL("../src/reviewer-intelligence/temporal-evidence.ts", import.meta.url), "utf8")
const bindingSourceText = readFileSync(new URL("../src/remediation/p7-temporal-post-verification-review-evidence-binding.ts", import.meta.url), "utf8")

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
  return true
}

async function withTemp<T>(run: (root: string) => Promise<T>): Promise<T> {
  const root = await mkdtemp(join(tmpdir(), "kodac-p7-r21-"))
  try {
    return await run(root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

async function canonicalBuilt(root: string): Promise<{
  readonly fixture: Awaited<ReturnType<typeof r21Fixture>>
  readonly built: P7TemporalPostVerificationReviewEvidenceBinding
}> {
  const fixture = await r21Fixture(root)
  const built = await buildP7TemporalPostVerificationReviewEvidenceBinding(fixture.input)
  return { fixture, built }
}

function contextBundle(): ContextBundle {
  const text = "working-tree-change:modified"
  const item: ContextBundle["items"][number] = {
    itemId: sha256("context-item:r21"),
    sourceKind: "repository-evidence",
    sourceIdentity: sha256("evidence:r21"),
    sourceAdapter: "builtin.git.status-porcelain-v1-z.v1",
    subjectPath: "src/widget.ts",
    evidenceClass: "git-derived",
    text,
    contextUtf8Bytes: Buffer.byteLength(text, "utf8"),
    provenanceRefs: ["receipt:git-status"],
    trust: "untrusted-repository-data",
    relevance: { score: 2050, reasons: ["exact-target-path", "working-tree-change"] },
  }
  const budget = { maxItems: 32, maxUtf8Bytes: 32 * 1024, usedItems: 1, usedUtf8Bytes: item.contextUtf8Bytes }
  const completeness = { state: "complete" as const, reasons: [], omittedAtLeast: 0 }
  const base = {
    version: K3_R5_CONTEXT_BUNDLE_VERSION,
    requestIdentity: sha256("request:p7-r21"),
    repositoryIdentity: sha256("repo:p7-r21"),
    snapshotIdentity: sha256("snapshot:p7-r21"),
    contentIdentity: sha256("content:p7-r21"),
    freshness: "current" as const,
    taskId: "task:p7-r21",
    selectionStrategy: K3_R5_SELECTION_STRATEGY_ID,
    budget,
    completeness,
    items: [item],
  }
  return { ...base, bundleIdentity: sha256(base), provenanceRefs: ["receipt:git-status"] }
}

function reviewerRequest(): MutableRecord {
  return {
    taskId: "task:p7-r21",
    policyIdentity: "policy:p7-r21-wrapper",
    canonicalBase: BASE,
    reviewedHead: HEAD,
    instructions: "Review the supplied bounded context for contract violations.",
    contextBundle: contextBundle(),
  }
}

function zeroFindingRuntime(providerCalls?: { count: number }): ReviewerExecutionRuntime {
  return new ReviewerExecutionRuntime({
    provider: {
      providerId: "provider:fixture",
      providerVersion: "v1",
      async review() {
        if (providerCalls !== undefined) providerCalls.count += 1
        return { claims: [] }
      },
    },
    findingRuntime: new ReviewerIntelligenceRuntime({ adjudicatorId: "kodac:p7-r21-wrapper-adjudicator" }),
    readCurrentHead: () => HEAD,
  })
}

test("P7-R21 wrapper captures a validated sibling temporal record without changing KRI run semantics", async () => {
  const direct = await zeroFindingRuntime().execute(reviewerRequest())
  const times = [R21_STARTED_AT, R21_COMPLETED_AT]
  const wrapped = await executeReviewWithTemporalEvidence(zeroFindingRuntime(), reviewerRequest(), () => times.shift()!)

  assert.deepEqual(wrapped.result.run, direct.run)
  assert.equal(wrapped.temporalEvidence.reviewRunIdentity, wrapped.result.run.reviewRunIdentity)
  assert.equal(wrapped.temporalEvidence.canonicalBase, BASE)
  assert.equal(wrapped.temporalEvidence.reviewedHead, HEAD)
  assert.equal(wrapped.temporalEvidence.evaluatedHead, HEAD)
  assert.equal(wrapped.temporalEvidence.status, "COMPLETED")
  assert.equal(wrapped.temporalEvidence.startedAt, R21_STARTED_AT)
  assert.equal(wrapped.temporalEvidence.completedAt, R21_COMPLETED_AT)
  assert.deepEqual(validateReviewTemporalEvidence(wrapped.temporalEvidence), wrapped.temporalEvidence)
})

test("P7-R21 wrapper rejects invalid start clocks before provider execution and reversed completion clocks", async () => {
  const calls = { count: 0 }
  await assert.rejects(
    executeReviewWithTemporalEvidence(zeroFindingRuntime(calls), reviewerRequest(), () => "2026-09-06T12:00:04Z"),
    /canonical UTC timestamp/,
  )
  assert.equal(calls.count, 0)

  const reversed = [R21_COMPLETED_AT, R21_STARTED_AT]
  await assert.rejects(
    executeReviewWithTemporalEvidence(zeroFindingRuntime(), reviewerRequest(), () => reversed.shift()!),
    /must not precede startedAt/,
  )
})

test("P7-R21 binds one exact R20 zero-finding review to a strictly later temporal window", async () => {
  await withTemp(async (root) => {
    const { fixture, built } = await canonicalBuilt(root)
    assert.equal(built.version, P7_R21_TEMPORAL_POST_VERIFICATION_REVIEW_EVIDENCE_BINDING_VERSION)
    assert.equal(built.state, P7_R21_TEMPORAL_POST_VERIFICATION_REVIEW_EVIDENCE_BOUND_STATE)
    assert.equal(built.sourceExactTargetHeadReviewRunEvidenceIdentity, fixture.sourceR20.evidenceIdentity)
    assert.equal(built.sourceVerificationEngineCompletionEventEvidenceIdentity, fixture.sourceR19.evidenceIdentity)
    assert.equal(built.reviewRunIdentity, fixture.sourceR20.reviewRunIdentity)
    assert.equal(built.verificationCompletedEventEmittedAt, R19_EVENT_AT)
    assert.equal(built.reviewStartedAt, R21_STARTED_AT)
    assert.equal(built.reviewCompletedAt, R21_COMPLETED_AT)
    assert.equal(Object.isFrozen(built), true)
    assert.equal(schemaAccepts(schema, built), true)
    assert.deepEqual(await validateP7TemporalPostVerificationReviewEvidenceBinding(built, fixture.input), built)
  })
})

test("P7-R21 is deterministic and content-addresses the exact temporal sibling identity", async () => {
  await withTemp(async (root) => {
    const fixture = await r21Fixture(root)
    const first = await buildP7TemporalPostVerificationReviewEvidenceBinding(fixture.input)
    const repeated = await buildP7TemporalPostVerificationReviewEvidenceBinding(fixture.input)
    assert.deepEqual(repeated, first)

    const changed = structuredClone(fixture.input) as MutableRecord
    changed.temporalEvidence.startedAt = "2026-09-06T12:00:04.201Z"
    rebindTemporal(changed.temporalEvidence)
    const second = await buildP7TemporalPostVerificationReviewEvidenceBinding(changed as P7TemporalPostVerificationReviewEvidenceBindingBuildInput)
    assert.notEqual(second.temporalEvidenceIdentity, first.temporalEvidenceIdentity)
    assert.notEqual(second.evidenceIdentity, first.evidenceIdentity)
  })
})

test("P7-R21 rejects review start equal to or before the exact R19 verification completion event", async () => {
  await withTemp(async (root) => {
    const fixture = await r21Fixture(root)
    for (const startedAt of [R19_EVENT_AT, "2026-09-06T12:00:04.000Z"]) {
      const candidate = structuredClone(fixture.input) as MutableRecord
      candidate.temporalEvidence.startedAt = startedAt
      candidate.temporalEvidence.completedAt = R21_COMPLETED_AT
      rebindTemporal(candidate.temporalEvidence)
      await assert.rejects(
        buildP7TemporalPostVerificationReviewEvidenceBinding(candidate as P7TemporalPostVerificationReviewEvidenceBindingBuildInput),
        /strictly later/,
      )
    }
  })
})

test("P7-R21 temporal validator rejects reversed or noncanonical timestamps", async () => {
  await withTemp(async (root) => {
    const fixture = await r21Fixture(root)
    const valid = fixture.input.temporalEvidence as ReviewTemporalEvidence

    const reversed = structuredClone(valid) as MutableRecord
    reversed.completedAt = "2026-09-06T12:00:04.150Z"
    rebindTemporal(reversed)
    assert.throws(() => validateReviewTemporalEvidence(reversed), /must not precede startedAt/)

    for (const [field, value] of [["startedAt", "2026-09-06T12:00:04.2Z"], ["completedAt", "2026-09-06T12:00:04.30Z"]] as const) {
      const candidate = structuredClone(valid) as MutableRecord
      candidate[field] = value
      rebindTemporal(candidate)
      assert.throws(() => validateReviewTemporalEvidence(candidate), /canonical UTC timestamp/)
    }
  })
})

test("P7-R21 rejects temporal review identity/base/head/status mismatch even with a rebound temporal identity", async () => {
  await withTemp(async (root) => {
    const fixture = await r21Fixture(root)
    const cases: Array<[string, unknown, RegExp]> = [
      ["reviewRunIdentity", sha256("other-review-run"), /reviewRunIdentity/],
      ["canonicalBase", OTHER_HEAD, /canonicalBase/],
      ["reviewedHead", OTHER_HEAD, /reviewedHead/],
      ["evaluatedHead", OTHER_HEAD, /evaluatedHead/],
      ["status", "STALE", /status/],
    ]
    for (const [field, value, pattern] of cases) {
      const candidate = structuredClone(fixture.input) as MutableRecord
      candidate.temporalEvidence[field] = value
      rebindTemporal(candidate.temporalEvidence)
      await assert.rejects(
        buildP7TemporalPostVerificationReviewEvidenceBinding(candidate as P7TemporalPostVerificationReviewEvidenceBindingBuildInput),
        pattern,
      )
    }
  })
})

test("P7-R21 fails closed on temporal identity, R20 predecessor identity, and transitive R19 lineage tampering", async () => {
  await withTemp(async (root) => {
    const fixture = await r21Fixture(root)

    const temporalTamper = structuredClone(fixture.input) as MutableRecord
    temporalTamper.temporalEvidence.temporalEvidenceIdentity = "f".repeat(64)
    await assert.rejects(buildP7TemporalPostVerificationReviewEvidenceBinding(temporalTamper as P7TemporalPostVerificationReviewEvidenceBindingBuildInput), /temporalEvidenceIdentity/)

    const r20Tamper = structuredClone(fixture.input) as MutableRecord
    r20Tamper.sourceExactTargetHeadReviewRunEvidenceBinding.evidenceIdentity = "f".repeat(64)
    await assert.rejects(buildP7TemporalPostVerificationReviewEvidenceBinding(r20Tamper as P7TemporalPostVerificationReviewEvidenceBindingBuildInput))

    const r19Tamper = structuredClone(fixture.input) as MutableRecord
    r19Tamper.sourceExactTargetHeadReviewRunEvidenceBindingInput
      .sourceVerificationEngineCompletionEventEvidenceBindingInput.verificationCompletedEvent.eventId =
      "a23e4567-e89b-42d3-a456-42661417400a"
    await assert.rejects(buildP7TemporalPostVerificationReviewEvidenceBinding(r19Tamper as P7TemporalPostVerificationReviewEvidenceBindingBuildInput))
  })
})

test("P7-R21 snapshots the safe R20/temporal graph before inherited asynchronous validation", async () => {
  await withTemp(async (root) => {
    const fixture = await r21Fixture(root)
    const mutable = structuredClone(fixture.input) as MutableRecord
    const pending = buildP7TemporalPostVerificationReviewEvidenceBinding(mutable as P7TemporalPostVerificationReviewEvidenceBindingBuildInput)
    mutable.temporalEvidence.temporalEvidenceIdentity = "0".repeat(64)
    mutable.sourceExactTargetHeadReviewRunEvidenceBinding.evidenceIdentity = "0".repeat(64)
    const built = await pending
    assert.equal(built.temporalEvidenceIdentity, (fixture.input.temporalEvidence as ReviewTemporalEvidence).temporalEvidenceIdentity)
    assert.equal(built.sourceExactTargetHeadReviewRunEvidenceIdentity, fixture.sourceR20.evidenceIdentity)
  })
})

test("P7-R21 rejects unknown fields, Proxy/accessor/symbol input, aliases, and cycles without invoking accessors", async () => {
  await withTemp(async (root) => {
    const fixture = await r21Fixture(root)
    await assert.rejects(buildP7TemporalPostVerificationReviewEvidenceBinding({ ...fixture.input, extra: true } as any))
    await assert.rejects(buildP7TemporalPostVerificationReviewEvidenceBinding(new Proxy(fixture.input as any, {})))

    let accessorCalls = 0
    const accessor = structuredClone(fixture.input) as MutableRecord
    Object.defineProperty(accessor.temporalEvidence, "reviewRunIdentity", {
      enumerable: true,
      get() {
        accessorCalls += 1
        return fixture.sourceR20.reviewRunIdentity
      },
    })
    await assert.rejects(buildP7TemporalPostVerificationReviewEvidenceBinding(accessor as P7TemporalPostVerificationReviewEvidenceBindingBuildInput))
    assert.equal(accessorCalls, 0)

    const symbol = structuredClone(fixture.input) as MutableRecord
    Object.defineProperty(symbol.temporalEvidence, Symbol("hidden"), { enumerable: true, value: true })
    await assert.rejects(buildP7TemporalPostVerificationReviewEvidenceBinding(symbol as P7TemporalPostVerificationReviewEvidenceBindingBuildInput))

    const alias = structuredClone(fixture.input) as MutableRecord
    alias.temporalEvidence = alias.sourceExactTargetHeadReviewRunEvidenceBinding
    alias.sharedAgain = alias.temporalEvidence
    await assert.rejects(buildP7TemporalPostVerificationReviewEvidenceBinding(alias as P7TemporalPostVerificationReviewEvidenceBindingBuildInput), /aliases or cycles|unknown field/)

    const cycle = structuredClone(fixture.input) as MutableRecord
    cycle.temporalEvidence.self = cycle.temporalEvidence
    await assert.rejects(buildP7TemporalPostVerificationReviewEvidenceBinding(cycle as P7TemporalPostVerificationReviewEvidenceBindingBuildInput), /aliases or cycles/)
  })
})

test("P7-R21 temporal record validator rejects identity tampering and hostile fields", async () => {
  await withTemp(async (root) => {
    const fixture = await r21Fixture(root)
    const valid = fixture.input.temporalEvidence as ReviewTemporalEvidence
    assert.deepEqual(validateReviewTemporalEvidence(valid), valid)
    assert.throws(() => validateReviewTemporalEvidence({ ...valid, extra: true }))
    assert.throws(() => validateReviewTemporalEvidence(new Proxy(valid as any, {})))
    assert.throws(() => validateReviewTemporalEvidence({ ...valid, temporalEvidenceIdentity: "0".repeat(64) }), /temporalEvidenceIdentity/)

    let accessorCalls = 0
    const accessor = structuredClone(valid) as MutableRecord
    Object.defineProperty(accessor, "startedAt", {
      enumerable: true,
      get() {
        accessorCalls += 1
        return R21_STARTED_AT
      },
    })
    assert.throws(() => validateReviewTemporalEvidence(accessor))
    assert.equal(accessorCalls, 0)

    const symbol = structuredClone(valid) as MutableRecord
    Object.defineProperty(symbol, Symbol("hidden"), { enumerable: true, value: true })
    assert.throws(() => validateReviewTemporalEvidence(symbol))
  })
})

test("P7-R21 output validation and schema reject tampering, hostile fields, and additional properties", async () => {
  await withTemp(async (root) => {
    const { fixture, built } = await canonicalBuilt(root)
    await assert.rejects(validateP7TemporalPostVerificationReviewEvidenceBinding({ ...built, extra: true }, fixture.input))
    await assert.rejects(validateP7TemporalPostVerificationReviewEvidenceBinding(new Proxy(built as any, {}), fixture.input))
    await assert.rejects(validateP7TemporalPostVerificationReviewEvidenceBinding({ ...built, evidenceIdentity: "0".repeat(64) }, fixture.input))

    let accessorCalls = 0
    const accessor = structuredClone(built) as MutableRecord
    Object.defineProperty(accessor, "evidenceIdentity", {
      enumerable: true,
      get() {
        accessorCalls += 1
        return built.evidenceIdentity
      },
    })
    await assert.rejects(validateP7TemporalPostVerificationReviewEvidenceBinding(accessor, fixture.input))
    assert.equal(accessorCalls, 0)

    assert.equal(schemaAccepts(schema, built), true)
    assert.equal(schemaAccepts(schema, { ...built, extra: true }), false)
    assert.equal(schemaAccepts(schema, { ...built, version: "wrong" }), false)
    assert.equal(schemaAccepts(schema, { ...built, state: "wrong" }), false)
    assert.equal(schemaAccepts(schema, { ...built, reviewStatus: "STALE" }), false)
    assert.equal(schemaAccepts(schema, { ...built, targetHead: "d".repeat(64) }), false)
    assert.equal(schemaAccepts(schema, { ...built, reviewStartedAt: "2026-09-06T12:00:04Z" }), false)
    const missing = structuredClone(built) as MutableRecord
    delete missing.temporalEvidenceIdentity
    assert.equal(schemaAccepts(schema, missing), false)
  })
})

test("P7-R21 emits only bounded identities/timestamps and has no forbidden runtime side-effect surface", async () => {
  await withTemp(async (root) => {
    const { built } = await canonicalBuilt(root)
    const serialized = JSON.stringify(built)
    assert.doesNotMatch(serialized, /provider:test|context text|secret|token|raw repository|filesystem/)
    assert.deepEqual(Object.keys(built).sort(), [
      "canonicalBase",
      "evaluatedHead",
      "evidenceIdentity",
      "repositoryIdentity",
      "reviewCompletedAt",
      "reviewRunIdentity",
      "reviewStartedAt",
      "reviewStatus",
      "reviewedHead",
      "sourceExactTargetHeadReviewRunEvidenceIdentity",
      "sourceVerificationEngineCompletionEventEvidenceIdentity",
      "state",
      "targetHead",
      "temporalEvidenceIdentity",
      "verificationCompletedEventEmittedAt",
      "version",
    ].sort())

    for (const text of [temporalSourceText, bindingSourceText]) {
      assert.doesNotMatch(text, /node:(?:fs|child_process|net|http|https)/)
      assert.doesNotMatch(text, /\bfetch\s*\(/)
      assert.doesNotMatch(text, /process\.env/)
      assert.doesNotMatch(text, /\b(?:writeFile|appendFile|execFile|spawn)\s*\(/)
    }
  })
})
