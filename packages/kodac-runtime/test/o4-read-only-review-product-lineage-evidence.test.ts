import assert from "node:assert/strict"
import { createHash, createHmac } from "node:crypto"
import { readFileSync } from "node:fs"
import test from "node:test"

import { K3_R5_CONTEXT_BUNDLE_VERSION, K3_R5_SELECTION_STRATEGY_ID, type ContextBundle } from "../src/context-engine/contracts.ts"
import {
  createO1AuthenticatedGithubIssueCommentEvidence,
  type O1AuthenticatedGithubIssueCommentInput,
} from "../src/event-ingress/o1-authenticated-github-event-evidence.ts"
import {
  O4A_LIMITS,
  O4A_MENTION_COMMAND_KIND,
  O4A_PRODUCT_LINEAGE_EVIDENCE_KEYS,
  O4A_READ_ONLY_REVIEW_PRODUCT_LINEAGE_VERSION,
  O4A_READ_SOURCE_KIND,
  createO4aReadEvidenceInput,
  createO4aReadOnlyReviewProductLineageEvidence,
  createO4aRepositorySnapshotInput,
  validateO4aReadOnlyReviewProductLineageEvidence,
  type O4aReadOnlyReviewProductLineageInput,
} from "../src/github-review/o4-read-only-review-product-lineage-evidence.ts"
import type { FindingRecord } from "../src/reviewer-intelligence/contracts.ts"
import { ReviewerExecutionRuntime, validateReviewRunRecord } from "../src/reviewer-intelligence/executor.ts"
import type { ReviewerProvider, ReviewerProviderOutput, ReviewRunRecord } from "../src/reviewer-intelligence/provider-contracts.ts"
import { ReviewerIntelligenceRuntime } from "../src/reviewer-intelligence/runtime.ts"
import { executeReviewWithTemporalEvidence, validateReviewTemporalEvidence } from "../src/reviewer-intelligence/temporal-evidence.ts"

const BASE = "a".repeat(40)
const HEAD = "b".repeat(40)
const NEXT = "c".repeat(40)
const KEY_IDENTITY = "1".repeat(64)
const ACTOR_POLICY_IDENTITY = "2".repeat(64)
const HEAD_POLICY_IDENTITY = "3".repeat(64)
const MENTION_POLICY_IDENTITY = "4".repeat(64)
const SECRET = new TextEncoder().encode("o4a-focused-test-secret")
const PROVIDER_ID = "provider:o4a-fixture"
const PROVIDER_VERSION = "v1"
const REVIEW_POLICY = "policy:o4a-review-v1"
const TASK = "task:o4a-review"
const PRIMARY_PATH = "src/widget.ts"

type Obj = Record<string, unknown>
type ReviewMode = "completed" | "stale" | "provider-failed"
type FixtureOptions = {
  head?: string
  base?: string
  commentBody?: string
  mentionTargetLogin?: string
  mentionPolicyIdentity?: string
  changedPaths?: string[]
  supportingPaths?: string[]
  readMode?: "full" | "missing" | "truncated"
  reviewMode?: ReviewMode
  includeFinding?: boolean
  claimRange?: boolean
  providerVersion?: string
  snapshotOverrides?: Obj
  publicationBody?: string
  topLevelCount?: number
}

type Fixture = {
  input: O4aReadOnlyReviewProductLineageInput
  evidence: ReturnType<typeof createO4aReadOnlyReviewProductLineageEvidence>
  run: ReviewRunRecord
  findings: readonly FindingRecord[]
}

function cmp(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0 }
function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`
  const record = value as Obj
  return `{${Object.keys(record).sort(cmp).map((key) => `${JSON.stringify(key)}:${canonical(record[key])}`).join(",")}}`
}
function sha256(value: unknown): string {
  return createHash("sha256").update(typeof value === "string" ? value : canonical(value), "utf8").digest("hex")
}
function o4Digest(kind: string, value: unknown): string {
  return createHash("sha256")
    .update(`${O4A_READ_ONLY_REVIEW_PRODUCT_LINEAGE_VERSION}:${kind}`, "utf8")
    .update("\0", "utf8")
    .update(canonical(value), "utf8")
    .digest("hex")
}
function signature(rawBody: Uint8Array, secret: Uint8Array = SECRET): string {
  return `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`
}
function clone<T>(value: T): T { return structuredClone(value) }
function contextBundle(head: string): ContextBundle {
  const text = "working-tree-change:modified"
  const item: ContextBundle["items"][number] = {
    itemId: sha256("context-item:widget"), sourceKind: "repository-evidence", sourceIdentity: sha256("evidence:widget"),
    sourceAdapter: "builtin.git.status-porcelain-v1-z.v1", subjectPath: PRIMARY_PATH, evidenceClass: "git-derived", text,
    contextUtf8Bytes: Buffer.byteLength(text, "utf8"), provenanceRefs: ["receipt:git-status"], trust: "untrusted-repository-data",
    relevance: { score: 2050, reasons: ["exact-target-path", "working-tree-change"] },
  }
  const budget = { maxItems: 32, maxUtf8Bytes: 32 * 1024, usedItems: 1, usedUtf8Bytes: item.contextUtf8Bytes }
  const completeness = { state: "complete" as const, reasons: [], omittedAtLeast: 0 }
  const base = {
    version: K3_R5_CONTEXT_BUNDLE_VERSION, requestIdentity: sha256(`request:${head}`), repositoryIdentity: sha256("repo:o4a"),
    snapshotIdentity: sha256(`snapshot:${head}`), contentIdentity: sha256(`content:${head}`), freshness: "current" as const, taskId: TASK,
    selectionStrategy: K3_R5_SELECTION_STRATEGY_ID, budget, completeness, items: [item],
  }
  return { ...base, bundleIdentity: sha256(base), provenanceRefs: ["receipt:git-status"] }
}
function providerOutput(includeFinding: boolean, claimRange: boolean): ReviewerProviderOutput {
  if (!includeFinding) return { claims: [] }
  return { claims: [{
    claimKey: "claim-1", path: PRIMARY_PATH, ...(claimRange ? { range: { startLine: 10, endLine: 12 } } : {}),
    summary: "Widget violates the reviewed contract.", contractClaim: "Invariant X is violated.", category: "contract", severity: "high",
    confidenceBps: 9000, evidenceItemIds: [sha256("context-item:widget")],
  }] }
}
function provider(version: string, review: ReviewerProvider["review"]): ReviewerProvider {
  return { providerId: PROVIDER_ID, providerVersion: version, review }
}
function issuePayload(commentBody: string): Obj {
  return {
    action: "created",
    repository: { id: 1001, full_name: "TheHalfMoon/Kodac" },
    issue: { id: 4004, number: 42, pull_request: { url: "https://api.github.com/repos/TheHalfMoon/Kodac/pulls/42" } },
    comment: { id: 5005, node_id: "IC_kwDOO4AFixture", body: commentBody, user: { id: 3003, login: "reviewer-user", type: "User" } },
    sender: { id: 3003, login: "reviewer-user", type: "User" },
  }
}
function issueInput(head: string, commentBody: string): O1AuthenticatedGithubIssueCommentInput {
  const rawBody = new TextEncoder().encode(JSON.stringify(issuePayload(commentBody)))
  return {
    rawBody, signatureHeader: signature(rawBody), deliveryId: `o4a-delivery-${head.slice(0, 8)}`, eventName: "issue_comment",
    keyIdentity: KEY_IDENTITY, secret: SECRET, expectedRepositoryId: "1001", expectedRepositoryFullName: "TheHalfMoon/Kodac", expectedHeadSha: head,
    actorEligibility: { policyIdentity: ACTOR_POLICY_IDENTITY, actorId: "3003", actorLogin: "reviewer-user", decision: "ELIGIBLE", evidenceRefs: ["policy:o4a-fixture"] },
    previousDeliveryIdentities: [],
    pullRequestBinding: { policyIdentity: HEAD_POLICY_IDENTITY, pullRequestId: "2002", baseRepositoryId: "1001", headRepositoryId: "1001", headRepositoryFullName: "TheHalfMoon/Kodac", observedHeadSha: head, evidenceRefs: ["pr-snapshot:o4a-fixture"] },
  }
}
async function makeReview(head: string, base: string, mode: ReviewMode, includeFinding: boolean, claimRange: boolean, providerVersion: string) {
  const bundle = contextBundle(head)
  let headReads = 0
  const review: ReviewerProvider["review"] = mode === "provider-failed"
    ? async () => { throw new Error("provider unavailable") }
    : async () => providerOutput(includeFinding, claimRange)
  const runtime = new ReviewerExecutionRuntime({
    provider: provider(providerVersion, review), findingRuntime: new ReviewerIntelligenceRuntime({ adjudicatorId: "o4a-fixture-adjudicator" }),
    readCurrentHead: () => mode === "stale" ? (++headReads === 1 ? head : NEXT) : head,
  })
  let clockRead = 0
  const times = ["2026-09-11T00:00:00.000Z", "2026-09-11T00:00:01.000Z"]
  return executeReviewWithTemporalEvidence(runtime, {
    taskId: TASK, policyIdentity: REVIEW_POLICY, canonicalBase: base, reviewedHead: head,
    instructions: "Review the supplied bounded context for contract violations.", contextBundle: bundle,
  }, () => times[Math.min(clockRead++, 1)]!)
}
async function fixture(options: FixtureOptions = {}): Promise<Fixture> {
  const head = options.head ?? HEAD
  const base = options.base ?? BASE
  const target = options.mentionTargetLogin ?? "kodac"
  const commentBody = options.commentBody ?? `@${target} review`
  const changedPaths = options.changedPaths ?? [PRIMARY_PATH]
  const supportingPaths = options.supportingPaths ?? []
  const readMode = options.readMode ?? "full"
  const reviewMode = options.reviewMode ?? "completed"
  const includeFinding = options.includeFinding ?? (reviewMode === "completed" && changedPaths.includes(PRIMARY_PATH))
  const claimRange = options.claimRange ?? true
  const source = issueInput(head, commentBody)
  const triggerEvidence = createO1AuthenticatedGithubIssueCommentEvidence(source)
  const snapshotCore = {
    repositoryId: triggerEvidence.repositoryId, repositoryFullName: triggerEvidence.repositoryFullName,
    pullRequestNumber: triggerEvidence.pullRequestNumber, pullRequestId: triggerEvidence.pullRequestId,
    canonicalBase: base, reviewedHead: head, baseRepositoryId: triggerEvidence.baseRepositoryId,
    headRepositoryId: triggerEvidence.headRepositoryId, headRepositoryFullName: triggerEvidence.headRepositoryFullName,
    forkClassification: triggerEvidence.forkClassification, baseRefIdentity: sha256(`base-ref:${base}`), headRefIdentity: sha256(`head-ref:${head}`),
    snapshotObservedAt: "2026-09-11T00:00:02.000Z", ...(options.snapshotOverrides ?? {}),
  }
  const snapshot = createO4aRepositorySnapshotInput(snapshotCore)
  const review = await makeReview(head, base, reviewMode, includeFinding, claimRange, options.providerVersion ?? PROVIDER_VERSION)
  const reads = [] as ReturnType<typeof createO4aReadEvidenceInput>[]
  for (const path of changedPaths) {
    if (readMode === "missing" && path === changedPaths[0]) continue
    reads.push(createO4aReadEvidenceInput(triggerEvidence.repositoryId, triggerEvidence.pullRequestNumber, {
      path, readRole: "CHANGED_PATH", contentIdentity: sha256(`content:${path}:${head}`), byteLength: 128,
      sourceKind: O4A_READ_SOURCE_KIND, truncationState: readMode === "truncated" && path === changedPaths[0] ? "TRUNCATED" : "FULL",
      snapshotEvidenceIdentity: snapshot.snapshotEvidenceIdentity, reviewedHead: snapshot.reviewedHead,
    }))
  }
  for (const path of supportingPaths) {
    reads.push(createO4aReadEvidenceInput(triggerEvidence.repositoryId, triggerEvidence.pullRequestNumber, {
      path, readRole: "SUPPORTING_CONTEXT", contentIdentity: sha256(`support:${path}:${head}`), byteLength: 64,
      sourceKind: O4A_READ_SOURCE_KIND, truncationState: "FULL", snapshotEvidenceIdentity: snapshot.snapshotEvidenceIdentity, reviewedHead: snapshot.reviewedHead,
    }))
  }
  const topLevelCount = options.topLevelCount ?? 1
  const publicationIntents: Obj[] = Array.from({ length: topLevelCount }, (_, index) => ({
    publicationIntentClass: "TOP_LEVEL_REVIEW_SUMMARY", repositoryId: triggerEvidence.repositoryId, pullRequestNumber: triggerEvidence.pullRequestNumber,
    reviewedHead: snapshot.reviewedHead, reviewRunIdentity: review.result.run.reviewRunIdentity,
    bodyText: index === 0 ? (options.publicationBody ?? "Review complete.") : `Review summary ${index + 1}.`, findingIdentity: null, path: null, lineAnchor: null,
  }))
  if (review.result.findings.length > 0 && claimRange) {
    const finding = review.result.findings[0]!
    publicationIntents.push({
      publicationIntentClass: "INLINE_FINDING_COMMENT", repositoryId: triggerEvidence.repositoryId, pullRequestNumber: triggerEvidence.pullRequestNumber,
      reviewedHead: snapshot.reviewedHead, reviewRunIdentity: review.result.run.reviewRunIdentity, bodyText: "Inline review finding.",
      findingIdentity: finding.findingIdentity, path: finding.path, lineAnchor: finding.range!.startLine,
    })
  }
  const input: O4aReadOnlyReviewProductLineageInput = {
    triggerEvidence, triggerSourceInput: source, triggerCommentText: commentBody,
    mentionPolicy: { mentionTargetLogin: target, mentionPolicyIdentity: options.mentionPolicyIdentity ?? MENTION_POLICY_IDENTITY },
    snapshot, changedPaths, readEvidence: reads, reviewRun: review.result.run, reviewTemporal: review.temporalEvidence,
    findings: review.result.findings, publicationIntents: publicationIntents as unknown as O4aReadOnlyReviewProductLineageInput["publicationIntents"],
  }
  return { input, evidence: createO4aReadOnlyReviewProductLineageEvidence(input), run: review.result.run, findings: review.result.findings }
}
function canonicalFinding(run: ReviewRunRecord, overrides: Obj = {}): FindingRecord {
  const runtime = new ReviewerIntelligenceRuntime({ adjudicatorId: "o4a-finding-builder" })
  return runtime.createFinding({
    claimKey: "foreign-claim", review: { reviewRunId: run.reviewRunId, reviewerId: run.providerId, reviewerVersion: run.providerVersion, policyIdentity: run.policyIdentity, canonicalBase: run.canonicalBase, reviewedHead: run.reviewedHead },
    path: PRIMARY_PATH, range: { startLine: 10, endLine: 12 }, summary: "Canonical alternate finding.", contractClaim: "Contract claim.", category: "contract", severity: "high", confidenceBps: 9000, evidenceRefs: ["evidence:o4a"], ...overrides,
  }, run.evaluatedHead)
}
function assertBlocked(value: string): void { assert.match(value, /^BLOCK_/) }
function assertDeepFrozen(value: unknown, seen = new Set<object>()): void {
  if (typeof value !== "object" || value === null || seen.has(value)) return
  seen.add(value); assert.equal(Object.isFrozen(value), true)
  for (const child of Object.values(value as Obj)) assertDeepFrozen(child, seen)
}

const AUTHORIZED_PATHS = [
  "packages/kodac-runtime/src/github-review/o4-read-only-review-product-lineage-evidence.ts",
  "packages/kodac-runtime/test/o4-read-only-review-product-lineage-evidence.test.ts",
  "schema/o4-read-only-review-product-lineage-evidence.schema.json",
] as const

const cases: Array<[number, string, () => void | Promise<void>]> = [
  [1, "protocol version and limits are exact", () => {
    assert.equal(O4A_READ_ONLY_REVIEW_PRODUCT_LINEAGE_VERSION, "kodac-o4a-read-only-github-review-product-lineage-v1")
    assert.deepEqual(O4A_LIMITS, { maxChangedPaths:512, maxReadEvidenceItems:512, maxFindings:64, maxPublicationIntents:65, maxPublicationBodyUtf8Bytes:16384, maxTriggerCommentUtf8Bytes:16384, maxReadContentBytes:1048576, maxPathUtf8Bytes:1024, maxGeneralTextUtf8Bytes:4096, maxGraphDepth:32, maxGraphNodes:32768, maxLineNumber:10000000 })
  }],
  [2, "valid canonical O1 issue_comment/created trigger lineage is independently revalidated", async () => { const f=await fixture(); assert.equal(f.evidence.triggerEvidenceIdentity,f.input.triggerEvidence.eventEvidenceIdentity); assert.equal(f.evidence.continuationDecision,"READY_FOR_SEPARATE_PUBLICATION_AUTHORITY") }],
  [3, "invalid O1 HMAC signature is rejected through canonical O1 validation", async () => { const f=await fixture(); const input=clone(f.input) as any; input.triggerSourceInput.signatureHeader=`sha256=${"0".repeat(64)}`; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/signature/) }],
  [4, "unsupported O1 event/action lineage is rejected", async () => { const f=await fixture(); const input=clone(f.input) as any; input.triggerSourceInput.eventName="pull_request"; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/eventName/) }],
  [5, "headBindingSource remains caller-materialized PR snapshot", async () => { const f=await fixture(); assert.equal(f.evidence.headBindingSource,"CALLER_MATERIALIZED_PR_SNAPSHOT") }],
  [6, "raw O1 secret and raw webhook body are not serialized", async () => { const f=await fixture(); const text=JSON.stringify(f.evidence); assert.equal(text.includes("o4a-focused-test-secret"),false); assert.equal(text.includes(new TextDecoder().decode(f.input.triggerSourceInput.rawBody)),false) }],
  [7, "repository id/name mismatch is blocked", async () => { const f=await fixture({snapshotOverrides:{repositoryId:"9999"}}); assert.equal(f.evidence.continuationDecision,"BLOCK_LINEAGE_MISMATCH") }],
  [8, "PR-number or PR-id mismatch is blocked", async () => { const a=await fixture({snapshotOverrides:{pullRequestNumber:99}}); const b=await fixture({snapshotOverrides:{pullRequestId:"9999"}}); assert.equal(a.evidence.continuationDecision,"BLOCK_LINEAGE_MISMATCH"); assert.equal(b.evidence.continuationDecision,"BLOCK_LINEAGE_MISMATCH") }],
  [9, "base/head repository mismatch is blocked", async () => { const f=await fixture({snapshotOverrides:{headRepositoryId:"9999",headRepositoryFullName:"Other/Fork",forkClassification:"FORK_REPOSITORY"}}); assert.equal(f.evidence.continuationDecision,"BLOCK_LINEAGE_MISMATCH") }],
  [10, "reviewed-head mismatch is blocked", async () => { const f=await fixture({snapshotOverrides:{reviewedHead:NEXT,headRefIdentity:sha256("head-ref:next")}}); assert.equal(f.evidence.continuationDecision,"BLOCK_LINEAGE_MISMATCH") }],
  [11, "canonical-base mismatch is blocked", async () => { const f=await fixture({snapshotOverrides:{canonicalBase:NEXT,baseRefIdentity:sha256("base-ref:next")}}); assert.equal(f.evidence.continuationDecision,"BLOCK_LINEAGE_MISMATCH") }],
  [12, "actor and eligibility lineage mismatch is rejected", async () => { const f=await fixture(); const input=clone(f.input) as any; input.triggerEvidence.actorId="9999"; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/source evidence|match|identity/i) }],
  [13, "mention command identity binds exact comment identity and body digest", async () => { const f=await fixture(); assert.equal(f.evidence.mentionCommandIdentity,o4Digest("mention-command-identity",{mentionCommandKind:O4A_MENTION_COMMAND_KIND,mentionTargetLogin:"kodac",mentionPolicyIdentity:MENTION_POLICY_IDENTITY,commentIdentity:f.input.triggerEvidence.commentIdentity,commentBodySha256:f.input.triggerEvidence.commentBodySha256})) }],
  [14, "changed paths canonicalize deterministically", async () => { const a=await fixture({changedPaths:[PRIMARY_PATH,"docs/a.md"]}); const b=await fixture({changedPaths:["docs/a.md",PRIMARY_PATH]}); assert.equal(a.evidence.changedPathSetIdentity,b.evidence.changedPathSetIdentity) }],
  [15, "duplicate changed paths are rejected", async () => { const f=await fixture(); const input=clone(f.input) as any; input.changedPaths=[PRIMARY_PATH,PRIMARY_PATH]; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/duplicate/) }],
  [16, "invalid repository-relative paths are rejected", async () => { const f=await fixture(); for(const path of ["../escape.ts","/abs.ts","a\\b.ts","a//b.ts"]){ const input=clone(f.input) as any; input.changedPaths=[path]; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/repository-relative POSIX/) } }],
  [17, "supporting context does not count as changed-path coverage", async () => { const f=await fixture({readMode:"missing",supportingPaths:["docs/context.md"]}); assert.equal(f.evidence.reviewedChangedPathCount,0); assert.equal(f.evidence.supportingContextPathCount,1) }],
  [18, "missing changed-path read produces incomplete state", async () => { const f=await fixture({readMode:"missing"}); assert.equal(f.evidence.reviewCompletenessState,"INCOMPLETE_MISSING_CHANGED_PATH_READS"); assert.equal(f.evidence.continuationDecision,"BLOCK_INCOMPLETE_REVIEW") }],
  [19, "truncated changed-path read produces incomplete state", async () => { const f=await fixture({readMode:"truncated"}); assert.equal(f.evidence.reviewCompletenessState,"INCOMPLETE_TRUNCATED_READS") }],
  [20, "exact full changed-path read coverage produces complete state", async () => { const f=await fixture(); assert.equal(f.evidence.reviewCompletenessState,"COMPLETE"); assert.equal(f.evidence.reviewedChangedPathCount,1) }],
  [21, "canonical validateReviewRunRecord accepts completed exact-head run", async () => { const f=await fixture(); assert.deepEqual(validateReviewRunRecord(f.input.reviewRun),f.input.reviewRun) }],
  [22, "stale reviewer run is blocked", async () => { const f=await fixture({reviewMode:"stale",includeFinding:false}); assert.equal(f.evidence.reviewCompletenessState,"STALE_HEAD"); assert.equal(f.evidence.continuationDecision,"BLOCK_STALE_HEAD") }],
  [23, "provider failure or incomplete reviewer run is blocked", async () => { const f=await fixture({reviewMode:"provider-failed",includeFinding:false}); assert.equal(f.evidence.reviewCompletenessState,"INCOMPLETE_REVIEW_RUN"); assert.equal(f.evidence.continuationDecision,"BLOCK_INCOMPLETE_REVIEW") }],
  [24, "canonical validateReviewTemporalEvidence accepts matching completed temporal evidence", async () => { const f=await fixture(); assert.deepEqual(validateReviewTemporalEvidence(f.input.reviewTemporal),f.input.reviewTemporal) }],
  [25, "temporal review-run identity mismatch is rejected", async () => { const f=await fixture(); const input=clone(f.input) as any; input.reviewTemporal.reviewRunIdentity="f".repeat(64); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/temporal|reviewRunIdentity/i) }],
  [26, "temporal canonical-base/head mismatch is rejected", async () => { const f=await fixture(); for(const field of ["canonicalBase","reviewedHead"]){ const input=clone(f.input) as any; input.reviewTemporal[field]=NEXT; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/temporal|identity|canonical/i) } }],
  [27, "finding identity set equals reviewer run identities", async () => { const f=await fixture(); assert.deepEqual(f.evidence.findingIdentities,f.run.findingIdentities) }],
  [28, "duplicate findings are rejected", async () => { const f=await fixture(); const input=clone(f.input) as any; input.findings=[input.findings[0],input.findings[0]]; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/duplicate/) }],
  [29, "stale finding or evaluated-head mismatch is rejected", async () => { await assert.rejects(async()=>fixture({reviewMode:"stale",includeFinding:true}),/CURRENT|freshness|caller-supplied current head|evaluated head/i) }],
  [30, "inline intent binds an exact validated finding", async () => { const f=await fixture(); const input=clone(f.input) as any; input.publicationIntents[1].findingIdentity="e".repeat(64); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/validated finding/) }],
  [31, "inline intent path mismatch is rejected", async () => { const f=await fixture(); const input=clone(f.input) as any; input.publicationIntents[1].path="src/other.ts"; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/path does not match/) }],
  [32, "invalid line anchors are rejected", async () => { const f=await fixture(); for(const line of [0,9,13,O4A_LIMITS.maxLineNumber+1]){ const input=clone(f.input) as any; input.publicationIntents[1].lineAnchor=line; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/line|bounded safe integer/) } }],
  [33, "top-level summary intent is bounded", async () => { const f=await fixture(); const input=clone(f.input) as any; input.publicationIntents[0].bodyText="x".repeat(O4A_LIMITS.maxPublicationBodyUtf8Bytes+1); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/byte bound/) }],
  [34, "duplicate publication intents are rejected", async () => { const f=await fixture(); const input=clone(f.input) as any; input.publicationIntents.push(clone(input.publicationIntents[0])); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/duplicate publication/) }],
  [35, "publication bodies are not serialized in final evidence", async () => { const f=await fixture({publicationBody:"SECRET REVIEW BODY"}); assert.equal(JSON.stringify(f.evidence).includes("SECRET REVIEW BODY"),false) }],
  [36, "continuation cannot be caller-forged to READY", async () => { const f=await fixture({readMode:"missing"}); const forged={...f.evidence,continuationDecision:"READY_FOR_SEPARATE_PUBLICATION_AUTHORITY"}; assert.throws(()=>validateO4aReadOnlyReviewProductLineageEvidence(forged,f.input),/does not match/) }],
  [37, "forged derived identities fail validation", async () => { const f=await fixture(); const a=clone(f.input) as any; a.snapshot.snapshotEvidenceIdentity="f".repeat(64); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(a),/snapshotEvidenceIdentity/); const b=clone(f.input) as any; b.readEvidence[0].readEvidenceIdentity="f".repeat(64); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(b),/readEvidence identity/); assert.throws(()=>validateO4aReadOnlyReviewProductLineageEvidence({...f.evidence,productLineageEvidenceIdentity:"f".repeat(64)},f.input),/does not match/) }],
  [38, "changed head changes downstream identities", async () => { const a=await fixture({head:HEAD}); const b=await fixture({head:NEXT}); assert.notEqual(a.evidence.snapshotEvidenceIdentity,b.evidence.snapshotEvidenceIdentity); assert.notEqual(a.evidence.changedPathSetIdentity,b.evidence.changedPathSetIdentity); assert.notEqual(a.evidence.productLineageEvidenceIdentity,b.evidence.productLineageEvidenceIdentity) }],
  [39, "changed review run changes downstream identities", async () => { const a=await fixture({providerVersion:"v1"}); const b=await fixture({providerVersion:"v2"}); assert.notEqual(a.evidence.reviewRunIdentity,b.evidence.reviewRunIdentity); assert.notEqual(a.evidence.productLineageEvidenceIdentity,b.evidence.productLineageEvidenceIdentity) }],
  [40, "changed publication body changes publication intent identity", async () => { const a=await fixture({publicationBody:"Body A"}); const b=await fixture({publicationBody:"Body B"}); assert.notEqual(a.evidence.publicationIntentIdentities[0],b.evidence.publicationIntentIdentities[0]); assert.notEqual(a.evidence.productLineageEvidenceIdentity,b.evidence.productLineageEvidenceIdentity) }],
  [41, "Proxy and revoked Proxy inputs fail closed before trap-prone operations", async () => { const f=await fixture(); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(new Proxy(clone(f.input),{})),/non-proxy/); const input=clone(f.input) as any; const nested=Proxy.revocable(input.findings[0].review,{}); input.findings[0].review=nested.proxy; nested.revoke(); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/non-proxy JSON data/) }],
  [42, "accessor non-enumerable symbol and custom-prototype inputs fail closed", async () => { const f=await fixture(); const accessor=clone(f.input) as any; Object.defineProperty(accessor.snapshot,"repositoryId",{enumerable:true,get(){return "1001"}}); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(accessor),/data property/); const hidden=clone(f.input) as any; Object.defineProperty(hidden.mentionPolicy,"mentionTargetLogin",{value:"kodac",enumerable:false}); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(hidden),/enumerable defined data property|unexpected or missing/); const symbol=clone(f.input) as any; symbol.snapshot[Symbol("x")]=true; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(symbol),/symbol/); const custom=clone(f.input) as any; custom.mentionPolicy=Object.assign(Object.create({x:true}),custom.mentionPolicy); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(custom),/plain-object/) }],
  [43, "sparse and extra-property arrays fail closed", async () => { const f=await fixture(); const sparse=clone(f.input) as any; const arr=[] as any[]; arr.length=1; sparse.changedPaths=arr; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(sparse),/sparse or extra/); const extra=clone(f.input) as any; const paths=[PRIMARY_PATH] as any; paths.extra=true; extra.changedPaths=paths; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(extra),/sparse or extra/) }],
  [44, "unpaired Unicode NUL and oversized text fail closed", async () => { const f=await fixture(); for(const body of ["\ud800","bad\0body","x".repeat(O4A_LIMITS.maxPublicationBodyUtf8Bytes+1)]){ const input=clone(f.input) as any; input.publicationIntents[0].bodyText=body; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/Unicode scalar|NUL-free|byte bound/) } }],
  [45, "output is deeply frozen", async () => { const f=await fixture(); assertDeepFrozen(f.evidence) }],
  [46, "schema is Draft 2020-12 and has exact source surface parity", async () => { const f=await fixture(); const schema=JSON.parse(readFileSync(new URL("../../../schema/o4-read-only-review-product-lineage-evidence.schema.json",import.meta.url),"utf8")); assert.equal(schema.$schema,"https://json-schema.org/draft/2020-12/schema"); assert.equal(schema.additionalProperties,false); assert.deepEqual([...schema.required].sort(),[...O4A_PRODUCT_LINEAGE_EVIDENCE_KEYS].sort()); assert.deepEqual(Object.keys(schema.properties).sort(),Object.keys(f.evidence).sort()) }],
  [47, "production source imports no side-effect provider-specific or network surface", () => { const source=readFileSync(new URL("../src/github-review/o4-read-only-review-product-lineage-evidence.ts",import.meta.url),"utf8"); for(const forbidden of ["node:fs","node:child_process","node:http","node:https","node:net","node:dgram","process.env","fetch(","ExecutionGateway"]){ assert.equal(source.includes(forbidden),false,forbidden) } }],
  [48, "authorized implementation paths exclude package lockfile and workflow mutation", () => { for(const path of AUTHORIZED_PATHS){ assert.equal(/(^|\/)(package(-lock)?\.json|pnpm-lock\.yaml|yarn\.lock)$/.test(path),false); assert.equal(path.startsWith(".github/workflows/"),false) } }],
  [49, "exact implementation changed-path contract remains three paths", () => { assert.deepEqual(AUTHORIZED_PATHS,["packages/kodac-runtime/src/github-review/o4-read-only-review-product-lineage-evidence.ts","packages/kodac-runtime/test/o4-read-only-review-product-lineage-evidence.test.ts","schema/o4-read-only-review-product-lineage-evidence.schema.json"]) }],
  [50, "triggerCommentText SHA-256 and UTF-8 length must match O1 evidence", async () => { const f=await fixture(); const input=clone(f.input) as any; input.triggerCommentText="@kodac revieW"; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/digest and byte length/) }],
  [51, "mention classification is derived from exact bound text and unsupported grammar cannot continue", async () => { for(const body of ["@other review","review","@kodac review now"," @kodac review","@kodac Review"]){ await assert.rejects(async()=>fixture({commentBody:body,mentionTargetLogin:"kodac"}),/grammar/) } }],
  [52, "trigger text is absent and mention target or policy changes downstream identities", async () => { const a=await fixture(); const b=await fixture({mentionPolicyIdentity:"5".repeat(64)}); const c=await fixture({mentionTargetLogin:"kodac2"}); assert.equal(JSON.stringify(a.evidence).includes("@kodac review"),false); assert.notEqual(a.evidence.mentionCommandIdentity,b.evidence.mentionCommandIdentity); assert.notEqual(a.evidence.productLineageEvidenceIdentity,b.evidence.productLineageEvidenceIdentity); assert.notEqual(a.evidence.mentionCommandIdentity,c.evidence.mentionCommandIdentity) }],
  [53, "changed-path permutations normalize while membership changes alter set identity with repo PR head binding", async () => { const a=await fixture({changedPaths:[PRIMARY_PATH,"docs/a.md"]}); const b=await fixture({changedPaths:["docs/a.md",PRIMARY_PATH]}); const c=await fixture({changedPaths:[PRIMARY_PATH,"docs/b.md"]}); const d=await fixture({head:NEXT,changedPaths:[PRIMARY_PATH,"docs/a.md"]}); assert.equal(a.evidence.changedPathSetIdentity,b.evidence.changedPathSetIdentity); assert.notEqual(a.evidence.changedPathSetIdentity,c.evidence.changedPathSetIdentity); assert.notEqual(a.evidence.changedPathSetIdentity,d.evidence.changedPathSetIdentity) }],
  [54, "read identities bind snapshot and head duplicate paths reject and supporting context never satisfies coverage", async () => { const f=await fixture({supportingPaths:["docs/context.md"]}); const input=clone(f.input) as any; input.readEvidence[0].reviewedHead=NEXT; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/exact snapshot and reviewed head|identity/); const dup=clone(f.input) as any; dup.readEvidence.push(clone(dup.readEvidence[0])); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(dup),/duplicate normalized paths/); const miss=await fixture({readMode:"missing",supportingPaths:["docs/context.md"]}); assert.equal(miss.evidence.reviewedChangedPathCount,0) }],
  [55, "findings are canonically validated and cross-bound with exact accepted-count parity", async () => { const f=await fixture(); const wrong=canonicalFinding(f.run,{review:{reviewRunId:f.run.reviewRunId,reviewerId:"provider:wrong",reviewerVersion:f.run.providerVersion,policyIdentity:f.run.policyIdentity,canonicalBase:f.run.canonicalBase,reviewedHead:f.run.reviewedHead}}); const input=clone(f.input) as any; input.findings=[wrong]; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/reviewer identity/); assert.equal(f.run.acceptedClaimCount,f.evidence.findingIdentities.length) }],
  [56, "non-empty changed-path universes cannot use COMPLETE_NO_REVIEWABLE_PATHS", async () => { const f=await fixture(); assert.equal(f.evidence.changedPathCount>0,true); assert.notEqual(f.evidence.reviewCompletenessState,"COMPLETE_NO_REVIEWABLE_PATHS"); const z=await fixture({changedPaths:[],includeFinding:false}); assert.equal(z.evidence.reviewCompletenessState,"COMPLETE_NO_REVIEWABLE_PATHS") }],
  [57, "READY requires exactly one valid top-level summary intent and all intents valid", async () => { const good=await fixture(); assert.equal(good.evidence.continuationDecision,"READY_FOR_SEPARATE_PUBLICATION_AUTHORITY"); const none=await fixture({topLevelCount:0}); assert.equal(none.evidence.continuationDecision,"BLOCK_INVALID_PUBLICATION_INTENT"); const two=await fixture({topLevelCount:2}); assert.equal(two.evidence.continuationDecision,"BLOCK_INVALID_PUBLICATION_INTENT"); const bad=await fixture(); const input=clone(bad.input) as any; input.publicationIntents[0].repositoryId="9999"; assert.equal(createO4aReadOnlyReviewProductLineageEvidence(input).continuationDecision,"BLOCK_INVALID_PUBLICATION_INTENT") }],
  [58, "multi-defect inputs follow fixed continuation blocker precedence", async () => { const stale=await fixture({reviewMode:"stale",includeFinding:false,readMode:"missing",snapshotOverrides:{canonicalBase:NEXT,baseRefIdentity:sha256("base-next")},topLevelCount:0}); assert.equal(stale.evidence.continuationDecision,"BLOCK_STALE_HEAD"); const lineage=await fixture({readMode:"missing",snapshotOverrides:{canonicalBase:NEXT,baseRefIdentity:sha256("base-next")},topLevelCount:0}); assert.equal(lineage.evidence.continuationDecision,"BLOCK_LINEAGE_MISMATCH"); const incomplete=await fixture({readMode:"missing",topLevelCount:0}); assert.equal(incomplete.evidence.continuationDecision,"BLOCK_INCOMPLETE_REVIEW") }],
  [59, "sourceKind and truncationState accept only exact v1 enum values", async () => { const f=await fixture(); for(const [field,value] of [["sourceKind","OTHER"],["truncationState","PARTIAL"]]){ const input=clone(f.input) as any; input.readEvidence[0][field]=value; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/unsupported/) } }],
  [60, "snapshot timestamp ref identities and claimed identity are strictly validated", async () => { const f=await fixture(); for(const mutate of [(x:any)=>x.snapshot.snapshotObservedAt="2026-09-11",(x:any)=>x.snapshot.baseRefIdentity="A".repeat(64),(x:any)=>x.snapshot.snapshotEvidenceIdentity="f".repeat(64)]){ const input=clone(f.input) as any; mutate(input); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/snapshot/) } }],
  [61, "finding validation uses validation-only ReviewerIntelligenceRuntime surface with no adjudication mutation call", () => { const source=readFileSync(new URL("../src/github-review/o4-read-only-review-product-lineage-evidence.ts",import.meta.url),"utf8"); assert.equal(source.includes('new ReviewerIntelligenceRuntime({ adjudicatorId: "o4a-read-only-validation" })'),true); assert.equal(source.includes("runtime.validateFindingRecord("),true); assert.equal(source.includes("applyAdjudication("),false); assert.equal(source.includes("markStaleIfHeadMoved("),false) }],
  [62, "publication body digest and length are internal preimage evidence not standalone final fields", async () => { const a=await fixture({publicationBody:"Body A"}); const b=await fixture({publicationBody:"Body BB"}); assert.equal("bodyIdentity" in a.evidence,false); assert.equal("bodyByteLength" in a.evidence,false); assert.notEqual(a.evidence.publicationIntentIdentities[0],b.evidence.publicationIntentIdentities[0]); assert.notEqual(a.evidence.productLineageEvidenceIdentity,b.evidence.productLineageEvidenceIdentity) }],
  [63, "final serialized field set is exact rejects unknown fields and exposes completeness and publication counts", async () => { const f=await fixture(); assert.deepEqual(Object.keys(f.evidence).sort(),[...O4A_PRODUCT_LINEAGE_EVIDENCE_KEYS].sort()); assert.equal(f.evidence.publicationIntentCount,2); assert.ok(Array.isArray(f.evidence.missingChangedPathIdentities)); assert.ok(Array.isArray(f.evidence.truncatedChangedPathIdentities)); assert.throws(()=>validateO4aReadOnlyReviewProductLineageEvidence({...f.evidence,extra:true},f.input),/unexpected or missing/) }],
  [64, "O4-A identities use v1 domain-separated canonical JSON and forged identity surfaces fail closed", async () => { const f=await fixture(); const s=f.input.snapshot; const core={repositoryId:s.repositoryId,repositoryFullName:s.repositoryFullName,pullRequestNumber:s.pullRequestNumber,pullRequestId:s.pullRequestId,canonicalBase:s.canonicalBase,reviewedHead:s.reviewedHead,baseRepositoryId:s.baseRepositoryId,headRepositoryId:s.headRepositoryId,headRepositoryFullName:s.headRepositoryFullName,forkClassification:s.forkClassification,baseRefIdentity:s.baseRefIdentity,headRefIdentity:s.headRefIdentity,snapshotObservedAt:s.snapshotObservedAt}; assert.equal(s.snapshotEvidenceIdentity,o4Digest("snapshot-evidence-identity",core)); const first=f.input.publicationIntents[0]!; const bodyIdentity=o4Digest("body-identity",{bodyText:first.bodyText}); const expected=o4Digest("publication-intent-identity",{publicationIntentClass:first.publicationIntentClass,repositoryId:first.repositoryId,pullRequestNumber:first.pullRequestNumber,reviewedHead:first.reviewedHead,reviewRunIdentity:first.reviewRunIdentity,bodyIdentity,bodyByteLength:Buffer.byteLength(first.bodyText,"utf8"),findingIdentity:null,path:null,lineAnchor:null}); assert.ok(f.evidence.publicationIntentIdentities.includes(expected)); assert.throws(()=>validateO4aReadOnlyReviewProductLineageEvidence({...f.evidence,reviewCompletenessEvidenceIdentity:"f".repeat(64)},f.input),/does not match/) }],
  [65, "publication bodyText is validation input and caller-supplied digest or length fields are rejected", async () => { const f=await fixture(); const input=clone(f.input) as any; input.publicationIntents[0].bodyIdentity="f".repeat(64); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/unexpected or missing/); const input2=clone(f.input) as any; input2.publicationIntents[0].bodyByteLength=1; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input2),/unexpected or missing/) }],
  [66, "multi-defect review completeness follows fixed precedence", async () => { const stale=await fixture({reviewMode:"stale",includeFinding:false,readMode:"truncated",snapshotOverrides:{canonicalBase:NEXT,baseRefIdentity:sha256("base-next")}}); assert.equal(stale.evidence.reviewCompletenessState,"STALE_HEAD"); const lineage=await fixture({readMode:"truncated",snapshotOverrides:{canonicalBase:NEXT,baseRefIdentity:sha256("base-next")}}); assert.equal(lineage.evidence.reviewCompletenessState,"LINEAGE_MISMATCH"); const trunc=await fixture({readMode:"truncated"}); assert.equal(trunc.evidence.reviewCompletenessState,"INCOMPLETE_TRUNCATED_READS") }],
  [67, "read-evidence inputs reject unknown fields and enforce MAX_READ_CONTENT_BYTES", async () => { const f=await fixture(); const a=clone(f.input) as any; a.readEvidence[0].extra=true; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(a),/unexpected or missing/); const b=clone(f.input) as any; b.readEvidence[0].byteLength=O4A_LIMITS.maxReadContentBytes+1; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(b),/bounded safe integer/) }],
  [68, "finding inputs are exact canonical KRI records and publication-facing text is not serialized", async () => { const f=await fixture(); const input=clone(f.input) as any; input.findings[0].extra=true; assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/unknown property|unexpected/); assert.equal("summaryIdentity" in f.evidence,false); assert.equal(JSON.stringify(f.evidence).includes("Widget violates the reviewed contract"),false) }],
  [69, "inline publication requires non-null finding range and in-range line anchor", async () => { const f=await fixture({claimRange:false}); const input=clone(f.input) as any; const finding=input.findings[0]; input.publicationIntents.push({publicationIntentClass:"INLINE_FINDING_COMMENT",repositoryId:input.triggerEvidence.repositoryId,pullRequestNumber:input.triggerEvidence.pullRequestNumber,reviewedHead:input.snapshot.reviewedHead,reviewRunIdentity:input.reviewRun.reviewRunIdentity,bodyText:"Inline",findingIdentity:finding.findingIdentity,path:finding.path,lineAnchor:10}); assert.throws(()=>createO4aReadOnlyReviewProductLineageEvidence(input),/without a validated range/) }],
  [70, "mention target login uses exact O1-compatible grammar and target changes downstream identity", async () => { await assert.rejects(async()=>fixture({mentionTargetLogin:"bad login"}),/login syntax|grammar/); const a=await fixture({mentionTargetLogin:"kodac"}); const b=await fixture({mentionTargetLogin:"kodac2"}); assert.notEqual(a.evidence.mentionCommandIdentity,b.evidence.mentionCommandIdentity); assert.notEqual(a.evidence.productLineageEvidenceIdentity,b.evidence.productLineageEvidenceIdentity) }],
  [71, "predecessor identity aliases remain exact rather than replacement digests", async () => { const f=await fixture(); assert.equal(f.evidence.triggerEvidenceIdentity,f.input.triggerEvidence.eventEvidenceIdentity); assert.equal(f.evidence.reviewRunIdentity,f.input.reviewRun.reviewRunIdentity); assert.equal(f.evidence.temporalEvidenceIdentity,f.input.reviewTemporal.temporalEvidenceIdentity); assert.deepEqual(f.evidence.findingIdentities,f.input.reviewRun.findingIdentities) }],
  [72, "changed-path canonical ordering follows exact UTF-8 bytes rather than UTF-16 code units", async () => { const paths=["src/\uE000.ts","src/\u{10000}.ts"]; const f=await fixture({changedPaths:paths,includeFinding:false}); const ordered=[...paths].sort((a,b)=>Buffer.compare(Buffer.from(a,"utf8"),Buffer.from(b,"utf8"))); const entries=ordered.map(path=>({path,pathEvidenceIdentity:o4Digest("changed-path-evidence-identity",{repositoryId:f.evidence.repositoryId,pullRequestNumber:f.evidence.pullRequestNumber,reviewedHead:f.evidence.reviewedHead,path})})); const expected=o4Digest("changed-path-set-identity",{repositoryId:f.evidence.repositoryId,pullRequestNumber:f.evidence.pullRequestNumber,reviewedHead:f.evidence.reviewedHead,entries}); assert.equal(f.evidence.changedPathSetIdentity,expected); assert.notDeepEqual(ordered,[...paths].sort()) }],
]

for (const [number, name, fn] of cases) {
  test(`O4-A focused ${number}: ${name}`, fn)
}

assert.equal(cases.length,72)
