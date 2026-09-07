import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

import { buildContextBundle } from "../context-engine/context-engine.ts"
import {
  K3_R5_SELECTION_STRATEGY_ID,
  type ContextEngineInput,
} from "../context-engine/contracts.ts"
import {
  P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BOUND_STATE,
  validateP7ExactTargetHeadReviewRunEvidenceBinding,
  type P7ExactTargetHeadReviewRunEvidenceBinding,
  type P7ExactTargetHeadReviewRunEvidenceBindingBuildInput,
} from "./p7-exact-target-head-review-run-evidence-binding.ts"
import {
  P7_R21_TEMPORAL_POST_VERIFICATION_REVIEW_EVIDENCE_BOUND_STATE,
  validateP7TemporalPostVerificationReviewEvidenceBinding,
  type P7TemporalPostVerificationReviewEvidenceBinding,
  type P7TemporalPostVerificationReviewEvidenceBindingBuildInput,
} from "./p7-temporal-post-verification-review-evidence-binding.ts"

export const P7_R22_EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BINDING_VERSION =
  "p7-r22-exact-target-head-complete-review-context-evidence-binding-v1" as const
export const P7_R22_EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_STATE =
  "EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY" as const

export interface P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput {
  readonly sourceTemporalPostVerificationReviewEvidenceBinding: P7TemporalPostVerificationReviewEvidenceBinding
  readonly sourceTemporalPostVerificationReviewEvidenceBindingInput: P7TemporalPostVerificationReviewEvidenceBindingBuildInput
  readonly contextEngineInput: ContextEngineInput
}

export interface P7ExactTargetHeadCompleteReviewContextEvidenceBinding {
  readonly version: typeof P7_R22_EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BINDING_VERSION
  readonly evidenceIdentity: string
  readonly state: typeof P7_R22_EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_STATE
  readonly sourceTemporalPostVerificationReviewEvidenceIdentity: string
  readonly sourceExactTargetHeadReviewRunEvidenceIdentity: string
  readonly p7RepositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly reviewRunIdentity: string
  readonly reviewTaskId: string
  readonly reviewContextBundleIdentity: string
  readonly contextRepositoryIdentity: string
  readonly contextSnapshotIdentity: string
  readonly contextContentIdentity: string
  readonly contextRequestIdentity: string
  readonly contextSelectionStrategy: typeof K3_R5_SELECTION_STRATEGY_ID
  readonly contextSnapshotGitHead: string
  readonly contextFreshness: "current"
  readonly contextCompletenessState: "complete"
  readonly contextCompletenessReasons: readonly []
  readonly contextOmittedAtLeast: 0
  readonly contextBudgetMaxItems: number
  readonly contextBudgetMaxUtf8Bytes: number
  readonly contextBudgetUsedItems: number
  readonly contextBudgetUsedUtf8Bytes: number
  readonly contextItemCount: number
  readonly contextItemIdentities: readonly string[]
  readonly contextProvenanceIdentity: string
}

type UnknownRecord = Record<string, unknown>
type EvidenceCore = Omit<P7ExactTargetHeadCompleteReviewContextEvidenceBinding, "evidenceIdentity">

const SHA1 = /^[0-9a-f]{40}$/
const SHA256 = /^[0-9a-f]{64}$/
const MAX_JSON_NODES = 65_536
const MAX_JSON_DEPTH = 64
const MAX_TEXT_BYTES = 2_048

const BUILD_KEYS = [
  "sourceTemporalPostVerificationReviewEvidenceBinding",
  "sourceTemporalPostVerificationReviewEvidenceBindingInput",
  "contextEngineInput",
] as const

const OUTPUT_KEYS = [
  "version",
  "evidenceIdentity",
  "state",
  "sourceTemporalPostVerificationReviewEvidenceIdentity",
  "sourceExactTargetHeadReviewRunEvidenceIdentity",
  "p7RepositoryIdentity",
  "canonicalBase",
  "targetHead",
  "reviewRunIdentity",
  "reviewTaskId",
  "reviewContextBundleIdentity",
  "contextRepositoryIdentity",
  "contextSnapshotIdentity",
  "contextContentIdentity",
  "contextRequestIdentity",
  "contextSelectionStrategy",
  "contextSnapshotGitHead",
  "contextFreshness",
  "contextCompletenessState",
  "contextCompletenessReasons",
  "contextOmittedAtLeast",
  "contextBudgetMaxItems",
  "contextBudgetMaxUtf8Bytes",
  "contextBudgetUsedItems",
  "contextBudgetUsedUtf8Bytes",
  "contextItemCount",
  "contextItemIdentities",
  "contextProvenanceIdentity",
] as const

function fail(label: string, detail: string): never {
  throw new TypeError(`${label} ${detail}`)
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function hashText(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex")
}

function ownDataRecord(
  value: unknown,
  allowedKeys: readonly string[],
  requiredKeys: readonly string[],
  label: string,
): UnknownRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value) || nodeTypes.isProxy(value)) {
    fail(label, "must be a non-Proxy plain object")
  }
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(label, "must be a plain object")
  const allowed = new Set(allowedKeys)
  const record: UnknownRecord = {}
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string") fail(label, "must not contain symbol fields")
    if (!allowed.has(key)) fail(label, `contains unknown field: ${key}`)
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}.${key}`, "must be an enumerable data property")
    }
    record[key] = descriptor.value
  }
  for (const key of requiredKeys) if (!Object.hasOwn(record, key)) fail(label, `is missing required field: ${key}`)
  return record
}

function denseArray(value: unknown, label: string): readonly unknown[] {
  if (!Array.isArray(value) || nodeTypes.isProxy(value)) fail(label, "must be a non-Proxy array")
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(label, "must use the ordinary Array prototype")
  const lengthDescriptor = Object.getOwnPropertyDescriptor(value, "length")
  if (
    lengthDescriptor === undefined ||
    !("value" in lengthDescriptor) ||
    !Number.isSafeInteger(lengthDescriptor.value) ||
    (lengthDescriptor.value as number) > MAX_JSON_NODES
  ) {
    fail(label, "must expose an ordinary bounded array length")
  }
  const length = lengthDescriptor.value as number
  const expected = new Set<string>(["length"])
  for (let index = 0; index < length; index += 1) expected.add(String(index))
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string" || !expected.has(key)) fail(label, "must not contain symbol, sparse, or extra array fields")
  }
  if (Reflect.ownKeys(value).length !== expected.size) fail(label, "must not contain sparse array slots")
  const result: unknown[] = []
  for (let index = 0; index < length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index))
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}[${index}]`, "must be an enumerable data property")
    }
    result.push(descriptor.value)
  }
  return result
}

function assertSafeJsonGraph(value: unknown, label: string): void {
  const stack: Array<{ readonly value: unknown; readonly label: string; readonly depth: number }> = [
    { value, label, depth: 0 },
  ]
  const seen = new Set<object>()
  let nodes = 0
  while (stack.length > 0) {
    const current = stack.pop()!
    nodes += 1
    if (nodes > MAX_JSON_NODES) fail(label, "exceeds the JSON node budget")
    if (current.depth > MAX_JSON_DEPTH) fail(label, "exceeds the JSON depth budget")
    const item = current.value
    if (item === null || typeof item === "boolean" || typeof item === "string") continue
    if (typeof item === "number") {
      if (!Number.isFinite(item) || !Number.isSafeInteger(item) || Object.is(item, -0)) {
        fail(current.label, "must be a finite safe JSON integer")
      }
      continue
    }
    if (typeof item !== "object") fail(current.label, "must contain only JSON-compatible values")
    if (nodeTypes.isProxy(item)) fail(current.label, "must not contain Proxy values")
    if (seen.has(item)) fail(current.label, "must not contain aliases or cycles")
    seen.add(item)
    if (Array.isArray(item)) {
      const values = denseArray(item, current.label)
      for (let index = values.length - 1; index >= 0; index -= 1) {
        stack.push({ value: values[index], label: `${current.label}[${index}]`, depth: current.depth + 1 })
      }
      continue
    }
    const prototype = Object.getPrototypeOf(item)
    if (prototype !== Object.prototype && prototype !== null) fail(current.label, "must contain only plain objects")
    for (const key of Reflect.ownKeys(item)) {
      if (typeof key !== "string") fail(current.label, "must not contain symbol fields")
      const descriptor = Object.getOwnPropertyDescriptor(item, key)
      if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
        fail(`${current.label}.${key}`, "must be an enumerable data property")
      }
      stack.push({ value: descriptor.value, label: `${current.label}.${key}`, depth: current.depth + 1 })
    }
  }
}

function sha1(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA1.test(value)) fail(label, "must be a lowercase 40-hex Git object")
  return value
}

function sha256(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) fail(label, "must be a lowercase SHA-256 digest")
  return value
}

function boundedText(value: unknown, label: string, maxBytes = MAX_TEXT_BYTES): string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.includes("\0") ||
    Buffer.byteLength(value, "utf8") > maxBytes
  ) {
    fail(label, "must be bounded non-empty NUL-free text")
  }
  return value
}

function integer(value: unknown, label: string, minimum = 0): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < minimum) {
    fail(label, `must be a safe integer >= ${minimum}`)
  }
  return value
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    const encoded = JSON.stringify(value)
    if (encoded === undefined) fail("canonical JSON", "contains a non-JSON value")
    return encoded
  }
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(",")}]`
  const record = value as UnknownRecord
  const keys = Object.keys(record).sort(compareStrings)
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as UnknownRecord)) deepFreeze(child)
  }
  return value
}

async function normalizedBuildCore(value: unknown): Promise<EvidenceCore> {
  assertSafeJsonGraph(value, "exact-target-head complete review-context evidence build input")
  const input = ownDataRecord(
    value,
    BUILD_KEYS,
    BUILD_KEYS,
    "exact-target-head complete review-context evidence build input",
  )

  // Snapshot the complete descriptor-checked graph before any inherited asynchronous lineage
  // validation can reach the canonical receipt-ledger read. All R21/R20/K3 reconstruction below
  // therefore observes one owned immutable-by-construction source graph.
  const snapshot = structuredClone(input) as UnknownRecord
  const sourceR21Input = snapshot.sourceTemporalPostVerificationReviewEvidenceBindingInput as P7TemporalPostVerificationReviewEvidenceBindingBuildInput
  const sourceR21 = await validateP7TemporalPostVerificationReviewEvidenceBinding(
    snapshot.sourceTemporalPostVerificationReviewEvidenceBinding,
    sourceR21Input,
  )
  if (sourceR21.state !== P7_R21_TEMPORAL_POST_VERIFICATION_REVIEW_EVIDENCE_BOUND_STATE) {
    fail("sourceTemporalPostVerificationReviewEvidenceBinding.state", "must equal the canonical P7-R21 bounded state")
  }

  // Revalidate the exact transitive R20 source/build-input pair separately rather than relying on
  // the R21 summary fields alone. This preserves the historical zero-finding review-run identity
  // that carries the exact contextBundleIdentity and taskId used by the review.
  const sourceR20Input = sourceR21Input.sourceExactTargetHeadReviewRunEvidenceBindingInput as P7ExactTargetHeadReviewRunEvidenceBindingBuildInput
  const sourceR20 = await validateP7ExactTargetHeadReviewRunEvidenceBinding(
    sourceR21Input.sourceExactTargetHeadReviewRunEvidenceBinding as P7ExactTargetHeadReviewRunEvidenceBinding,
    sourceR20Input,
  )
  if (sourceR20.state !== P7_R20_EXACT_TARGET_HEAD_REVIEW_RUN_EVIDENCE_BOUND_STATE) {
    fail("sourceExactTargetHeadReviewRunEvidenceBinding.state", "must equal the canonical P7-R20 bounded state")
  }
  if (sourceR21.sourceExactTargetHeadReviewRunEvidenceIdentity !== sourceR20.evidenceIdentity) {
    fail("source P7-R20 evidenceIdentity", "must match the exact P7-R21-bound predecessor identity")
  }

  const contextInput = snapshot.contextEngineInput as ContextEngineInput
  const context = buildContextBundle(contextInput)
  const targetHead = sha1(sourceR21.targetHead, "source P7-R21 targetHead")
  const contextSnapshotGitHead = sha1(contextInput.snapshot.gitHead, "contextEngineInput.snapshot.gitHead")
  if (contextSnapshotGitHead !== targetHead) {
    fail("contextEngineInput.snapshot.gitHead", "must match the exact P7-R21 targetHead")
  }
  if (context.bundleIdentity !== sourceR20.reviewContextBundleIdentity) {
    fail("context bundleIdentity", "must match the exact P7-R20 reviewContextBundleIdentity")
  }
  if (context.taskId !== sourceR20.reviewTaskId) {
    fail("context taskId", "must match the exact P7-R20 reviewTaskId")
  }
  if (context.freshness !== "current") fail("context freshness", "must equal current")
  if (
    context.completeness.state !== "complete" ||
    context.completeness.reasons.length !== 0 ||
    context.completeness.omittedAtLeast !== 0
  ) {
    fail("context completeness", "must be complete with no reasons or omissions")
  }

  const itemIdentities = context.items.map((item, index) => sha256(item.itemId, `context.items[${index}].itemId`))
  if (new Set(itemIdentities).size !== itemIdentities.length) {
    fail("context item identities", "must not contain duplicates")
  }
  const provenanceRefs = [...context.provenanceRefs]
  const sortedProvenanceRefs = [...provenanceRefs].sort(compareStrings)
  if (canonicalJson(provenanceRefs) !== canonicalJson(sortedProvenanceRefs) || new Set(provenanceRefs).size !== provenanceRefs.length) {
    fail("context provenanceRefs", "must be a canonical ordered unique set")
  }

  return deepFreeze({
    version: P7_R22_EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BINDING_VERSION,
    state: P7_R22_EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_STATE,
    sourceTemporalPostVerificationReviewEvidenceIdentity: sha256(sourceR21.evidenceIdentity, "source P7-R21 evidenceIdentity"),
    sourceExactTargetHeadReviewRunEvidenceIdentity: sha256(sourceR20.evidenceIdentity, "source P7-R20 evidenceIdentity"),
    p7RepositoryIdentity: boundedText(sourceR21.repositoryIdentity, "source P7-R21 repositoryIdentity"),
    canonicalBase: sha1(sourceR21.canonicalBase, "source P7-R21 canonicalBase"),
    targetHead,
    reviewRunIdentity: sha256(sourceR21.reviewRunIdentity, "source P7-R21 reviewRunIdentity"),
    reviewTaskId: boundedText(sourceR20.reviewTaskId, "source P7-R20 reviewTaskId", 128),
    reviewContextBundleIdentity: sha256(sourceR20.reviewContextBundleIdentity, "source P7-R20 reviewContextBundleIdentity"),
    contextRepositoryIdentity: sha256(context.repositoryIdentity, "context repositoryIdentity"),
    contextSnapshotIdentity: sha256(context.snapshotIdentity, "context snapshotIdentity"),
    contextContentIdentity: sha256(context.contentIdentity, "context contentIdentity"),
    contextRequestIdentity: sha256(context.requestIdentity, "context requestIdentity"),
    contextSelectionStrategy: K3_R5_SELECTION_STRATEGY_ID,
    contextSnapshotGitHead,
    contextFreshness: "current" as const,
    contextCompletenessState: "complete" as const,
    contextCompletenessReasons: Object.freeze([]) as readonly [],
    contextOmittedAtLeast: 0 as const,
    contextBudgetMaxItems: integer(context.budget.maxItems, "context budget.maxItems", 1),
    contextBudgetMaxUtf8Bytes: integer(context.budget.maxUtf8Bytes, "context budget.maxUtf8Bytes", 1),
    contextBudgetUsedItems: integer(context.budget.usedItems, "context budget.usedItems"),
    contextBudgetUsedUtf8Bytes: integer(context.budget.usedUtf8Bytes, "context budget.usedUtf8Bytes"),
    contextItemCount: integer(context.items.length, "context item count"),
    contextItemIdentities: Object.freeze(itemIdentities),
    contextProvenanceIdentity: hashText(canonicalJson(provenanceRefs)),
  })
}

function evidenceIdentity(core: EvidenceCore): string {
  return hashText(canonicalJson(core))
}

export async function buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(
  input: P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput,
): Promise<P7ExactTargetHeadCompleteReviewContextEvidenceBinding> {
  const core = await normalizedBuildCore(input)
  return deepFreeze({ ...core, evidenceIdentity: evidenceIdentity(core) })
}

export async function validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding(
  value: unknown,
  input: P7ExactTargetHeadCompleteReviewContextEvidenceBindingBuildInput,
): Promise<P7ExactTargetHeadCompleteReviewContextEvidenceBinding> {
  assertSafeJsonGraph(value, "exact-target-head complete review-context evidence binding")
  const record = ownDataRecord(
    value,
    OUTPUT_KEYS,
    OUTPUT_KEYS,
    "exact-target-head complete review-context evidence binding",
  )
  const snapshot = structuredClone(record) as UnknownRecord
  const claimedIdentity = sha256(
    snapshot.evidenceIdentity,
    "exact-target-head complete review-context evidence binding.evidenceIdentity",
  )
  const expected = await buildP7ExactTargetHeadCompleteReviewContextEvidenceBinding(input)
  if (claimedIdentity !== expected.evidenceIdentity) {
    fail(
      "exact-target-head complete review-context evidence binding.evidenceIdentity",
      "does not match the canonical R21/R20/K3-R5-derived preimage",
    )
  }
  if (canonicalJson(snapshot) !== canonicalJson(expected)) {
    fail(
      "exact-target-head complete review-context evidence binding",
      "does not match canonical R21/R20/K3-R5-derived semantics",
    )
  }
  return expected
}
