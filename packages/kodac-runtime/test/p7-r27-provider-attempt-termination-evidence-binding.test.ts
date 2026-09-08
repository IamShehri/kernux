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
import { validateReviewRunRecord } from "../src/reviewer-intelligence/executor.ts"
import type { ReviewRunRecord } from "../src/reviewer-intelligence/provider-contracts.ts"
import { ReviewerIntelligenceRuntime } from "../src/reviewer-intelligence/runtime.ts"
import {
  KRI_R3_REVIEW_TEMPORAL_EVIDENCE_VERSION,
  type ReviewTemporalEvidence,
} from "../src/reviewer-intelligence/temporal-evidence.ts"
import {
  buildP5EvidenceProvenanceBinding,
  type P5EvidenceProvenanceBinding,
} from "../src/verification/p5-evidence-provenance.ts"
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
  buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding,
  type P7ExactTargetHeadCompleteReviewContextEvidenceBinding,
  type P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput,
} from "../src/remediation/p7-exact-target-head-complete-review-context-evidence-binding.ts"
import {
  buildP7ReviewCoverageUniverseEvidenceBinding,
  type P7ReviewCoveragePathDescriptor,
  type P7ReviewCoverageUniverseEvidenceBindingBuildInput,
} from "../src/remediation/p7-review-coverage-universe-evidence-binding.ts"
import {
  buildP7DeterministicSecurityPrescanEvidenceBinding,
  type P7DeterministicSecurityPrescanBuildInput,
  type P7DeterministicSecurityPrescanSourceInput,
} from "../src/remediation/p7-deterministic-security-prescan-evidence-binding.ts"
import {
  P7_R25_RISK_IDS,
  buildP7RiskCoverageEvidenceBinding,
  type P7RiskCoverageEvidenceBindingBuildInput,
} from "../src/remediation/p7-risk-coverage-evidence-binding.ts"
import {
  buildP7SkillCoverageEvidenceBinding,
  type P7SkillCoverageEvidenceBindingBuildInput,
} from "../src/remediation/p7-skill-coverage-evidence-binding.ts"
import {
  P7_R27_COMPLETION_STATES,
  P7_R27_OUTPUT_TRUNCATION_STATES,
  P7_R27_PROVIDER_ATTEMPT_LIMITS,
  P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BINDING_VERSION,
  P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_STATE,
  P7_R27_TERMINATION_REASONS,
  buildP7ProviderAttemptTerminationEvidenceBinding,
  validateP7ProviderAttemptTerminationEvidenceBinding,
  type P7ProviderAttemptDescriptor,
  type P7ProviderAttemptTerminationEvidenceBindingBuildInput,
} from "../src/remediation/p7-provider-attempt-termination-evidence-binding.ts"

type MutableRecord = Record<string, any>
type SchemaRecord = Record<string, any>

const REPOSITORY = "github.com/TheHalfMoon/Kodac"
const BASE = "a".repeat(40)
const HEAD = "b".repeat(40)
const TREE = "c".repeat(40)
const PATH_SET = "1".repeat(64)
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
const ATTEMPT_STARTED_AT = "2026-09-06T12:00:04.400Z"
const ATTEMPT_COMPLETED_AT = "2026-09-06T12:00:05.000Z"
const TEST_STARTED_AT = "2026-09-06T12:00:03.100Z"
const TEST_COMPLETED_AT = "2026-09-06T12:00:03.400Z"
const TYPES_STARTED_AT = "2026-09-06T12:00:03.500Z"
const TYPES_COMPLETED_AT = "2026-09-06T12:00:03.900Z"
const WORKSPACE = "/workspace/kodac"
const SESSION_ID = "session-p7-r27"
const TEST_COMMAND_ID = "js-root-tests-123abc"
const TYPES_COMMAND_ID = "js-root-types-456def"
const GIT_SUMMARY = "Workspace changes are evidenced (diffBytes=12, statusBytes=3)."
const POLICY_SUMMARY = "Every persisted execution receipt was authorized by policy."
const RECEIPT_IDS = [APPLY_RECEIPT_ID, GIT_DIFF_RECEIPT_ID, GIT_STATUS_RECEIPT_ID, TEST_RECEIPT_ID, TYPES_RECEIPT_ID]
const RECEIPT_SUMMARY = `${RECEIPT_IDS.length} execution receipt(s) are successful and mutation post-state is attested.`
const CONTEXT_REPOSITORY_ID = "d".repeat(64)
const CONTEXT_PATH = "src/widget.ts"
const ARCHITECTURE_PATH = "docs/architecture/review.md"
const CONTEXT_TASK = "p7-r27-exact-target-head-review"

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
    claimKey: "p7-r27-source-finding",
    review: {
      reviewRunId: "review-run-p7-r27-source",
      reviewerId: "provider:test",
      reviewerVersion: "v1",
      policyIdentity: "policy:p7-r27-source",
      canonicalBase: BASE,
      reviewedHead: HEAD,
    },
    path: "src/example.ts",
    range: { startLine: 10, endLine: 12 },
    summary: "A confirmed finding eligible for bounded R27 lineage construction.",
    contractClaim: "The candidate violates one bounded invariant.",
    category: "correctness",
    severity: "high",
    confidenceBps: 9000,
    evidenceRefs: ["evidence:finding"],
  }
}

function sourceProposal(): P7ImmutablePatchProposal {
  const runtime = new ReviewerIntelligenceRuntime({ adjudicatorId: "kodac:p7-r27-test-adjudicator" })
  const finding = runtime.createFinding(claim(), HEAD)
  const { adjudication } = runtime.applyAdjudication(
    finding,
    { action: "CONFIRM", evidenceRefs: ["evidence:confirmed"] },
    HEAD,
  )
  return buildP7ImmutablePatchProposal({
    repositoryIdentity: REPOSITORY,
    canonicalBase: BASE,
    targetHead: HEAD,
    sourceFinding: finding,
    sourceAdjudication: adjudication,
    proposerIdentity: "kodac:p7-r27-test-proposer",
    patchArtifactDigest: sha256(PATCH),
    changes: CHANGES,
  })
}

function sourceAuthorization(source: P7ImmutablePatchProposal): P7PatchApplicationAuthorization {
  return buildP7PatchApplicationAuthorization({
    sourceProposal: source,
    declaration: {
      authorizerIdentity: "kodac:p7-r27-test-authorizer",
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

function contextInput(): ContextEngineInput {
  return {
    request: contextRequest(),
    snapshot: contextSnapshot(),
  }
}

function reviewRunFor(source: P7VerificationEngineCompletionEventEvidenceBinding, context: ContextBundle): ReviewRunRecord {
  const base: Omit<ReviewRunRecord, "reviewRunIdentity"> = {
    version: "kri-r3-review-run-v1",
    reviewRunId: sha256("p7-r27-review-run"),
    status: "COMPLETED",
    providerId: "provider:test",
    providerVersion: "v1",
    policyIdentity: "policy:p7-r27-test",
    canonicalBase: source.canonicalBase,
    reviewedHead: source.targetHead,
    evaluatedHead: source.targetHead,
    contextBundleIdentity: context.bundleIdentity,
    taskId: context.taskId,
    instructionsIdentity: sha256("p7-r27-review-instructions"),
    acceptedClaimCount: 0,
    findingIdentities: [],
    failureCode: null,
  }
  return { ...base, reviewRunIdentity: sha256(base) }
}

async function r20Fixture(root: string, contextEngineInput: ContextEngineInput): Promise<{
  readonly input: P7ExactTargetHeadReviewRunEvidenceBindingBuildInput
}> {
  const sourceInput = await r19Fixture(root)
  const sourceR19 = await buildP7VerificationEngineCompletionEventEvidenceBinding(sourceInput)
  const context = buildContextBundle(contextEngineInput)
  return {
    input: {
      sourceVerificationEngineCompletionEventEvidenceBinding: sourceR19,
      sourceVerificationEngineCompletionEventEvidenceBindingInput: sourceInput,
      reviewRun: reviewRunFor(sourceR19, context),
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

async function r21Fixture(root: string, canonicalContextInput: ContextEngineInput): Promise<{
  readonly sourceR20: P7ExactTargetHeadReviewRunEvidenceBinding
  readonly input: P7TemporalPostVerificationReviewEvidenceBindingBuildInput
}> {
  const r20 = await r20Fixture(root, canonicalContextInput)
  const sourceR20 = await buildP7ExactTargetHeadReviewRunEvidenceBinding(r20.input)
  const run = validateReviewRunRecord(r20.input.reviewRun)
  return {
    sourceR20,
    input: {
      sourceExactTargetHeadReviewRunEvidenceBinding: sourceR20,
      sourceExactTargetHeadReviewRunEvidenceBindingInput: r20.input,
      temporalEvidence: temporalEvidenceFor(run),
    },
  }
}

async function r22Fixture(root: string): Promise<{
  readonly input: P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput
  readonly evidence: P7ExactTargetHeadCompleteReviewContextEvidenceBinding
}> {
  const canonicalContextInput = contextInput()
  const r21 = await r21Fixture(root, canonicalContextInput)
  const sourceR21 = await buildP7TemporalPostVerificationReviewEvidenceBinding(r21.input)
  const input: P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput = {
    sourceTemporalPostVerificationReviewEvidenceBinding: sourceR21,
    sourceTemporalPostVerificationReviewEvidenceBindingInput: r21.input,
    contextEngineInput: canonicalContextInput,
  }
  return { input, evidence: await buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(input) }
}

function gitBlobIdentity(raw: Buffer): string {
  return createHash("sha1")
    .update(Buffer.from(`blob ${raw.byteLength}\0`, "utf8"))
    .update(raw)
    .digest("hex")
}

function sourceRecord(path: string, raw: Buffer): P7DeterministicSecurityPrescanSourceInput {
  return {
    path,
    rawByteIdentity: createHash("sha256").update(raw).digest("hex"),
    rawByteLength: raw.byteLength,
    rawBytesBase64: raw.toString("base64"),
  }
}

function reviewableDescriptor(path: string, raw: Buffer): P7ReviewCoveragePathDescriptor {
  return {
    path,
    previousPath: null,
    changeKind: "modified",
    objectKind: "regular_file",
    objectIdentity: gitBlobIdentity(raw),
    byteSize: raw.byteLength,
    fileMode: "100644",
    contentDisposition: "reviewable_text",
    encodingDisposition: "utf8",
    isGeneratedOrDerived: false,
    isReferencedHiddenPayload: false,
    policyDisposition: "included",
    policyReason: null,
  }
}

function r26Input(
  repositoryIdentity = REPOSITORY,
  canonicalBase = BASE,
  targetHead = HEAD,
  targetTree = TREE,
): P7SkillCoverageEvidenceBindingBuildInput {
  const path = "src/review-target.ts"
  const raw = Buffer.from("export const safe = true\n", "utf8")
  const reviewUniverseBuildInput: P7ReviewCoverageUniverseEvidenceBindingBuildInput = {
    repositoryIdentity,
    canonicalBase,
    targetHead,
    targetTree,
    changedPathSetIdentity: PATH_SET,
    changedPaths: [reviewableDescriptor(path, raw)],
  }
  const securityPrescanBuildInput: P7DeterministicSecurityPrescanBuildInput = {
    reviewUniverseBuildInput,
    reviewUniverseEvidence: buildP7ReviewCoverageUniverseEvidenceBinding(reviewUniverseBuildInput),
    sources: [sourceRecord(path, raw)],
  }
  const riskCoverageBuildInput: P7RiskCoverageEvidenceBindingBuildInput = {
    securityPrescanBuildInput,
    securityPrescanEvidence: buildP7DeterministicSecurityPrescanEvidenceBinding(securityPrescanBuildInput),
    riskApplicability: P7_R25_RISK_IDS.map((riskId) => ({
      riskId,
      applicability: "NOT_APPLICABLE" as const,
      evidenceIdentities: [sha256(`not-applicable:${riskId}`)],
    })),
    reviewerFindingReferences: [],
  }
  return {
    riskCoverageBuildInput,
    riskCoverageEvidence: buildP7RiskCoverageEvidenceBinding(riskCoverageBuildInput),
    skills: [],
  }
}

function provenance(seed: string): P5EvidenceProvenanceBinding {
  return buildP5EvidenceProvenanceBinding({
    source: {
      sourceKind: "provider_attempt",
      evidenceIdentity: sha256(`provenance-source:${seed}`),
      sourceRef: `provider-attempt:${seed}`,
      sourceDigest: sha256(`provenance-digest:${seed}`),
    },
    revision: { repositoryId: REPOSITORY, canonicalBase: BASE, candidateHead: HEAD },
    producer: {
      producerId: `kodac:p7-r27-test:${seed}`,
      producerVersion: "v1",
      configurationIdentity: sha256(`provenance-configuration:${seed}`),
    },
    policyIdentity: sha256(`provenance-policy:${seed}`),
    scopeIdentity: sha256(`provenance-scope:${seed}`),
    inputIdentity: sha256(`provenance-input:${seed}`),
    environmentIdentity: sha256(`provenance-environment:${seed}`),
    freshness: { state: "CURRENT", basisIdentity: sha256(`provenance-freshness:${seed}`) },
  })
}

function attempt(overrides: Partial<P7ProviderAttemptDescriptor> = {}): P7ProviderAttemptDescriptor {
  return {
    attemptIdentity: sha256("attempt"),
    providerIdentity: sha256("provider"),
    modelIdentity: sha256("model"),
    configurationIdentity: sha256("configuration"),
    promptPolicyIdentity: sha256("prompt-policy"),
    toolPolicyIdentity: sha256("tool-policy"),
    startedAt: ATTEMPT_STARTED_AT,
    completedAt: ATTEMPT_COMPLETED_AT,
    terminationReason: "COMPLETED",
    inputTokenOrBudgetEvidenceIdentity: sha256("token-budget-evidence"),
    outputTruncationState: "NOT_TRUNCATED",
    outputTruncationEvidenceIdentity: sha256("not-truncated-evidence"),
    toolCallCount: 2,
    retryLineageEvidenceIdentities: [sha256("retry-z"), sha256("retry-a")],
    ...overrides,
  }
}

async function r27Input(root: string): Promise<P7ProviderAttemptTerminationEvidenceBindingBuildInput> {
  const r22 = await r22Fixture(root)
  const skillCoverageInput = r26Input()
  return {
    sourceExactTargetHeadCompleteReviewContextEvidenceBinding: r22.evidence,
    sourceExactTargetHeadCompleteReviewContextEvidenceBindingInput: r22.input,
    sourceSkillCoverageEvidenceBinding: buildP7SkillCoverageEvidenceBinding(skillCoverageInput),
    sourceSkillCoverageEvidenceBindingInput: skillCoverageInput,
    provenanceEvidence: [provenance("z"), provenance("a")],
    attempt: attempt(),
  }
}

async function withTemp<T>(run: (root: string) => Promise<T>): Promise<T> {
  const root = await mkdtemp(join(tmpdir(), "kodac-p7-r27-"))
  try {
    return await run(root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

function assertDeepFrozen(value: unknown): void {
  if (value === null || typeof value !== "object") return
  assert.equal(Object.isFrozen(value), true)
  for (const child of Object.values(value as Record<string, unknown>)) assertDeepFrozen(child)
}

const schema = JSON.parse(
  readFileSync(new URL("../../../schema/p7-provider-attempt-termination-evidence-binding.schema.json", import.meta.url), "utf8"),
) as SchemaRecord
const production = readFileSync(
  new URL("../src/remediation/p7-provider-attempt-termination-evidence-binding.ts", import.meta.url),
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
  if (Array.isArray(node.anyOf)) return node.anyOf.some((candidate: unknown) => schemaAccepts(candidate, value, root))
  if (Object.hasOwn(node, "const") && JSON.stringify(value) !== JSON.stringify(node.const)) return false
  if (Array.isArray(node.enum) && !node.enum.some((candidate: unknown) => JSON.stringify(candidate) === JSON.stringify(value))) return false
  if (node.type === "null") return value === null
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
  return true
}

function rebindLocalR22Identity(value: P7ExactTargetHeadCompleteReviewContextEvidenceBinding): P7ExactTargetHeadCompleteReviewContextEvidenceBinding {
  const clone = structuredClone(value) as MutableRecord
  const { evidenceIdentity: _ignored, ...core } = clone
  clone.evidenceIdentity = sha256(core)
  return clone as P7ExactTargetHeadCompleteReviewContextEvidenceBinding
}

test("P7-R27 deterministically binds exact R22/R26 lineage, optional P5 provenance, and caller attempt evidence", async () => {
  await withTemp(async (root) => {
    const input = await r27Input(root)
    const first = await buildP7ProviderAttemptTerminationEvidenceBinding(input)
    const reordered = structuredClone(input) as MutableRecord
    reordered.provenanceEvidence.reverse()
    reordered.attempt.retryLineageEvidenceIdentities.reverse()
    const second = await buildP7ProviderAttemptTerminationEvidenceBinding(
      reordered as P7ProviderAttemptTerminationEvidenceBindingBuildInput,
    )

    assert.deepEqual(second, first)
    assert.equal(first.version, P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BINDING_VERSION)
    assert.equal(first.state, P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_STATE)
    assert.equal(first.repositoryIdentity, REPOSITORY)
    assert.equal(first.canonicalBase, BASE)
    assert.equal(first.targetHead, HEAD)
    assert.equal(first.targetTree, TREE)
    assert.equal(first.changedPathSetIdentity, PATH_SET)
    assert.equal(first.reviewContextEvidenceIdentity, input.sourceExactTargetHeadCompleteReviewContextEvidenceBinding.evidenceIdentity)
    assert.equal(first.reviewRunIdentity, input.sourceExactTargetHeadCompleteReviewContextEvidenceBinding.reviewRunIdentity)
    assert.equal(first.skillCoverageEvidenceIdentity, input.sourceSkillCoverageEvidenceBinding.evidenceIdentity)
    assert.equal(Object.hasOwn(input.sourceExactTargetHeadCompleteReviewContextEvidenceBinding, "targetTree"), false)
    assert.equal(first.completionState, "CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION")
    assert.match(first.provenanceEvidenceSetIdentity, /^[0-9a-f]{64}$/)
    assert.match(first.retryLineageIdentity, /^[0-9a-f]{64}$/)
    assert.match(first.completionDebtIdentity, /^[0-9a-f]{64}$/)
    assert.equal(schemaAccepts(schema, first), true)
    assert.deepEqual(await validateP7ProviderAttemptTerminationEvidenceBinding(first, input), first)
    assertDeepFrozen(first)

    const serialized = JSON.stringify(first)
    assert.equal(serialized.includes("provider-attempt:z"), false)
    assert.equal(serialized.includes("provider-attempt:a"), false)
    assert.equal(Object.hasOwn(first, "providerInvocationProof"), false)
    assert.equal(Object.hasOwn(first, "verifiedProviderIdentity"), false)
    assert.equal(Object.hasOwn(first, "verifiedCompleteReview"), false)
    assert.equal(Object.hasOwn(first, "externalClockAuthenticityProof"), false)
    assert.equal(Object.hasOwn(first, "retryAuthority"), false)
  })
})

test("P7-R27 keeps every non-COMPLETED termination disposition as explicit completion debt", async () => {
  await withTemp(async (root) => {
    const input = await r27Input(root)
    const completed = await buildP7ProviderAttemptTerminationEvidenceBinding(input)
    const nonCompleted = P7_R27_TERMINATION_REASONS.filter((reason) => reason !== "COMPLETED")

    for (const terminationReason of nonCompleted) {
      const output = await buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        attempt: attempt({
          terminationReason,
          completedAt: terminationReason === "UNKNOWN" ? null : ATTEMPT_COMPLETED_AT,
          outputTruncationState: terminationReason === "TOKEN_LIMIT" ? "TRUNCATED" : "UNKNOWN",
          outputTruncationEvidenceIdentity: sha256(`truncation:${terminationReason}`),
        }),
      })
      assert.equal(output.completionState, "COMPLETION_DEBT", terminationReason)
      assert.notEqual(output.completionDebtIdentity, completed.completionDebtIdentity, terminationReason)
    }

    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({ ...structuredClone(input), attempt: attempt({ completedAt: null }) }),
      /completedAt.*required.*COMPLETED/,
    )
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        attempt: attempt({ outputTruncationState: "TRUNCATED", outputTruncationEvidenceIdentity: sha256("truncated") }),
      }),
      /outputTruncationState.*NOT_TRUNCATED/,
    )
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        attempt: attempt({ outputTruncationState: "UNKNOWN", outputTruncationEvidenceIdentity: sha256("unknown-truncation") }),
      }),
      /outputTruncationState.*NOT_TRUNCATED/,
    )
  })
})

test("P7-R27 invokes exact R22 validation and exact R26 validation, and rejects cross-lineage or provenance tampering", async () => {
  await withTemp(async (root) => {
    const input = await r27Input(root)

    const fakeR22 = structuredClone(input.sourceExactTargetHeadCompleteReviewContextEvidenceBinding) as MutableRecord
    fakeR22.reviewTaskId = "self-consistent-but-not-canonical"
    const reboundFakeR22 = rebindLocalR22Identity(
      fakeR22 as P7ExactTargetHeadCompleteReviewContextEvidenceBinding,
    )
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        sourceExactTargetHeadCompleteReviewContextEvidenceBinding: reboundFakeR22,
      }),
      /R22|review-context|canonical|semantics|preimage|task/i,
    )

    const alternateR26Input = r26Input("github.com/TheHalfMoon/Other")
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        sourceSkillCoverageEvidenceBinding: buildP7SkillCoverageEvidenceBinding(alternateR26Input),
        sourceSkillCoverageEvidenceBindingInput: alternateR26Input,
      }),
      /repositoryIdentity.*match exactly/,
    )

    const tamperedR26 = structuredClone(input.sourceSkillCoverageEvidenceBinding) as MutableRecord
    tamperedR26.evidenceIdentity = "0".repeat(64)
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        sourceSkillCoverageEvidenceBinding: tamperedR26 as typeof input.sourceSkillCoverageEvidenceBinding,
      }),
      /P7-R26|canonical|evidence/i,
    )

    const tamperedProvenance = structuredClone(input.provenanceEvidence[0]!) as MutableRecord
    tamperedProvenance.bindingIdentity = "0".repeat(64)
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        provenanceEvidence: [tamperedProvenance as P5EvidenceProvenanceBinding],
      }),
      /bindingIdentity.*canonical semantic content/,
    )

    const canonicalProvenance = input.provenanceEvidence[0]!
    const wrongRevision = buildP5EvidenceProvenanceBinding({
      source: canonicalProvenance.source,
      revision: { repositoryId: REPOSITORY, canonicalBase: BASE, candidateHead: "f".repeat(40) },
      producer: canonicalProvenance.producer,
      policyIdentity: canonicalProvenance.policyIdentity,
      scopeIdentity: canonicalProvenance.scopeIdentity,
      inputIdentity: canonicalProvenance.inputIdentity,
      environmentIdentity: canonicalProvenance.environmentIdentity,
      freshness: canonicalProvenance.freshness,
    })
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        provenanceEvidence: [wrongRevision],
      }),
      /candidateHead.*validated R22\/R26 target head/,
    )
  })
})

test("P7-R27 rejects duplicate, malformed, inconsistent, unknown, and hostile attempt input fail-closed", async () => {
  await withTemp(async (root) => {
    const input = await r27Input(root)

    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        provenanceEvidence: [
          structuredClone(input.provenanceEvidence[0]!),
          structuredClone(input.provenanceEvidence[0]!),
        ],
      }),
      /duplicate binding identities/,
    )
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        attempt: attempt({ retryLineageEvidenceIdentities: [sha256("duplicate"), sha256("duplicate")] }),
      }),
      /duplicate identities/,
    )
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        attempt: attempt({ toolCallCount: -1 }),
      }),
      /non-negative safe integer/,
    )
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        attempt: attempt({ toolCallCount: Number.MAX_SAFE_INTEGER + 1 }),
      }),
      /safe JSON integer|non-negative safe integer/,
    )
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        attempt: attempt({ providerIdentity: "not-a-sha256" }),
      }),
      /providerIdentity.*SHA-256/,
    )
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        attempt: { ...attempt(), terminationReason: "SILENT_SUCCESS" } as any,
      }),
      /terminationReason.*must be one of/,
    )
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        attempt: attempt({ startedAt: "2026-09-06T12:00:06.000Z", completedAt: ATTEMPT_COMPLETED_AT }),
      }),
      /completedAt.*must not precede startedAt/,
    )
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        attempt: { ...attempt(), unexpected: true } as any,
      }),
      /unknown|symbol field/,
    )

    const proxy = new Proxy(structuredClone(input), {})
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding(proxy as P7ProviderAttemptTerminationEvidenceBindingBuildInput),
      /Proxy/,
    )

    let getterCalls = 0
    const accessor = structuredClone(input) as MutableRecord
    Object.defineProperty(accessor, "attempt", {
      enumerable: true,
      get() {
        getterCalls += 1
        return attempt()
      },
    })
    await assert.rejects(buildP7ProviderAttemptTerminationEvidenceBinding(accessor as P7ProviderAttemptTerminationEvidenceBindingBuildInput), /data property/)
    assert.equal(getterCalls, 0)

    const symbol = structuredClone(input) as MutableRecord
    Object.defineProperty(symbol, Symbol("hidden"), { enumerable: true, value: true })
    await assert.rejects(buildP7ProviderAttemptTerminationEvidenceBinding(symbol as P7ProviderAttemptTerminationEvidenceBindingBuildInput), /symbol/)

    const sparse = structuredClone(input) as MutableRecord
    sparse.provenanceEvidence = new Array(2)
    sparse.provenanceEvidence[0] = structuredClone(input.provenanceEvidence[0])
    await assert.rejects(buildP7ProviderAttemptTerminationEvidenceBinding(sparse as P7ProviderAttemptTerminationEvidenceBindingBuildInput), /sparse/)

    const alias = structuredClone(input) as MutableRecord
    alias.provenanceEvidence = [alias.provenanceEvidence[0], alias.provenanceEvidence[0]]
    await assert.rejects(buildP7ProviderAttemptTerminationEvidenceBinding(alias as P7ProviderAttemptTerminationEvidenceBindingBuildInput), /aliases or cycles/)

    const cycle = structuredClone(input) as MutableRecord
    cycle.attempt.self = cycle.attempt
    await assert.rejects(buildP7ProviderAttemptTerminationEvidenceBinding(cycle as P7ProviderAttemptTerminationEvidenceBindingBuildInput), /aliases or cycles/)

    const unexpectedPrototype = structuredClone(input) as MutableRecord
    Object.setPrototypeOf(unexpectedPrototype.attempt, { inherited: true })
    await assert.rejects(buildP7ProviderAttemptTerminationEvidenceBinding(unexpectedPrototype as P7ProviderAttemptTerminationEvidenceBindingBuildInput), /plain objects/)

    const nonJson = structuredClone(input) as MutableRecord
    nonJson.attempt.providerIdentity = () => true
    await assert.rejects(buildP7ProviderAttemptTerminationEvidenceBinding(nonJson as P7ProviderAttemptTerminationEvidenceBindingBuildInput), /JSON-compatible/)

    const malformedUnicode = structuredClone(input) as MutableRecord
    malformedUnicode.attempt.providerIdentity = "\ud800"
    await assert.rejects(buildP7ProviderAttemptTerminationEvidenceBinding(malformedUnicode as P7ProviderAttemptTerminationEvidenceBindingBuildInput), /Unicode scalar/)

    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding({
        ...structuredClone(input),
        attempt: attempt({
          retryLineageEvidenceIdentities: Array.from(
            { length: P7_R27_PROVIDER_ATTEMPT_LIMITS.maxRetryLineageEvidence + 1 },
            (_, index) => sha256(`retry:${index}`),
          ),
        }),
      }),
      /at most 32 entries/,
    )

    const oversizedString = structuredClone(input) as MutableRecord
    oversizedString.attempt.providerIdentity = "a".repeat(P7_R27_PROVIDER_ATTEMPT_LIMITS.maxSingleStringBytes + 1)
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding(oversizedString as P7ProviderAttemptTerminationEvidenceBindingBuildInput),
      /per-string UTF-8 byte budget/,
    )

    const oversizedObject = structuredClone(input) as MutableRecord
    for (let index = 0; index <= P7_R27_PROVIDER_ATTEMPT_LIMITS.maxObjectFields; index += 1) {
      oversizedObject.attempt[`extra${index}`] = index
    }
    await assert.rejects(
      buildP7ProviderAttemptTerminationEvidenceBinding(oversizedObject as P7ProviderAttemptTerminationEvidenceBindingBuildInput),
      /object field budget/,
    )
  })
})

test("P7-R27 schema is strict and production exposes no provider, network, secret, retry, persistence, K2, or K5 execution surface", () => {
  assert.equal(schema.additionalProperties, false)
  assert.equal(schema.properties.version.const, P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BINDING_VERSION)
  assert.equal(schema.properties.state.const, P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_STATE)
  assert.deepEqual(schema.properties.terminationReason.enum, [...P7_R27_TERMINATION_REASONS])
  assert.deepEqual(schema.properties.outputTruncationState.enum, [...P7_R27_OUTPUT_TRUNCATION_STATES])
  assert.deepEqual(schema.properties.completionState.enum, [...P7_R27_COMPLETION_STATES])
  assert.equal(schema.$defs.sha256.pattern, "^[0-9a-f]{64}$")
  assert.equal(schema.$defs.gitSha.pattern, "^[0-9a-f]{40}$")

  assert.ok(production.includes("validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding"))
  assert.ok(production.includes("validateP7SkillCoverageEvidenceBinding"))
  assert.ok(production.includes("validateP5EvidenceProvenanceBinding"))
  assert.equal(/node:(?:fs|child_process|http|https|http2|net|tls|dgram|worker_threads|os|path|vm)/.test(production), false)
  assert.equal(/\b(?:fetch|setTimeout|setInterval|randomUUID|getRandomValues|eval)\s*\(/.test(production), false)
  assert.equal(/\bprocess\s*\.|\bDate\s*\(|\bDate\.now|\bMath\.random/.test(production), false)
  assert.equal(/\bExecutionGateway\b|\bTrustKernel\b|\.register\s*\(|\.dispose\s*\(/.test(production), false)
  assert.equal(/\bimport\s*\(/.test(production), false)
  assert.equal(/\b(?:writeFile|appendFile|mkdir|rm|unlink|rename|copyFile)\s*\(/.test(production), false)
  assert.equal(/\b(?:retry|replay|resume)\s*\(/i.test(production), false)
  assert.equal(/\b(?:provider|model|tool)\.(?:invoke|call|run|execute)\s*\(/i.test(production), false)
})
