import { createHash } from "node:crypto"
import { types } from "node:util"

import {
  O1_ISSUE_COMMENT_HEAD_BINDING_SOURCE,
  validateO1AuthenticatedGithubIssueCommentEvidence,
  type O1AuthenticatedGithubIssueCommentEvidence,
  type O1AuthenticatedGithubIssueCommentInput,
} from "../event-ingress/o1-authenticated-github-event-evidence.ts"
import type { FindingRecord } from "../reviewer-intelligence/contracts.ts"
import { validateReviewRunRecord } from "../reviewer-intelligence/executor.ts"
import type { ReviewRunRecord } from "../reviewer-intelligence/provider-contracts.ts"
import { ReviewerIntelligenceRuntime } from "../reviewer-intelligence/runtime.ts"
import {
  validateReviewTemporalEvidence,
  type ReviewTemporalEvidence,
} from "../reviewer-intelligence/temporal-evidence.ts"

export const O4A_READ_ONLY_REVIEW_PRODUCT_LINEAGE_VERSION = "kodac-o4a-read-only-github-review-product-lineage-v1" as const
export const O4A_MENTION_COMMAND_KIND = "REVIEW" as const
export const O4A_READ_ROLES = Object.freeze(["CHANGED_PATH", "SUPPORTING_CONTEXT"] as const)
export const O4A_READ_SOURCE_KIND = "CALLER_MATERIALIZED_READ_EVIDENCE" as const
export const O4A_TRUNCATION_STATES = Object.freeze(["FULL", "TRUNCATED"] as const)
export const O4A_REVIEW_COMPLETENESS_STATES = Object.freeze([
  "COMPLETE",
  "COMPLETE_NO_REVIEWABLE_PATHS",
  "INCOMPLETE_MISSING_CHANGED_PATH_READS",
  "INCOMPLETE_TRUNCATED_READS",
  "INCOMPLETE_REVIEW_RUN",
  "STALE_HEAD",
  "LINEAGE_MISMATCH",
] as const)
export const O4A_PUBLICATION_INTENT_CLASSES = Object.freeze(["TOP_LEVEL_REVIEW_SUMMARY", "INLINE_FINDING_COMMENT"] as const)
export const O4A_CONTINUATION_DECISIONS = Object.freeze([
  "READY_FOR_SEPARATE_PUBLICATION_AUTHORITY",
  "BLOCK_STALE_HEAD",
  "BLOCK_LINEAGE_MISMATCH",
  "BLOCK_INCOMPLETE_REVIEW",
  "BLOCK_INVALID_PUBLICATION_INTENT",
] as const)
export const O4A_LIMITS = Object.freeze({
  maxChangedPaths: 512,
  maxReadEvidenceItems: 512,
  maxFindings: 64,
  maxPublicationIntents: 65,
  maxPublicationBodyUtf8Bytes: 16_384,
  maxTriggerCommentUtf8Bytes: 16_384,
  maxReadContentBytes: 1_048_576,
  maxPathUtf8Bytes: 1_024,
  maxGeneralTextUtf8Bytes: 4_096,
  maxGraphDepth: 32,
  maxGraphNodes: 32_768,
  maxLineNumber: 10_000_000,
})

export type O4aReadRole = (typeof O4A_READ_ROLES)[number]
export type O4aTruncationState = (typeof O4A_TRUNCATION_STATES)[number]
export type O4aReviewCompletenessState = (typeof O4A_REVIEW_COMPLETENESS_STATES)[number]
export type O4aPublicationIntentClass = (typeof O4A_PUBLICATION_INTENT_CLASSES)[number]
export type O4aContinuationDecision = (typeof O4A_CONTINUATION_DECISIONS)[number]

export interface O4aMentionPolicyInput {
  readonly mentionTargetLogin: string
  readonly mentionPolicyIdentity: string
}

export interface O4aRepositorySnapshotInput {
  readonly repositoryId: string
  readonly repositoryFullName: string
  readonly pullRequestNumber: number
  readonly pullRequestId: string
  readonly canonicalBase: string
  readonly reviewedHead: string
  readonly baseRepositoryId: string
  readonly headRepositoryId: string
  readonly headRepositoryFullName: string
  readonly forkClassification: "SAME_REPOSITORY" | "FORK_REPOSITORY"
  readonly baseRefIdentity: string
  readonly headRefIdentity: string
  readonly snapshotObservedAt: string
  readonly snapshotEvidenceIdentity: string
}

export interface O4aRepositorySnapshotCoreInput extends Omit<O4aRepositorySnapshotInput, "snapshotEvidenceIdentity"> {}

export interface O4aReadEvidenceInput {
  readonly path: string
  readonly readRole: O4aReadRole
  readonly contentIdentity: string
  readonly byteLength: number
  readonly sourceKind: typeof O4A_READ_SOURCE_KIND
  readonly truncationState: O4aTruncationState
  readonly snapshotEvidenceIdentity: string
  readonly reviewedHead: string
  readonly readEvidenceIdentity: string
}

export interface O4aReadEvidenceCoreInput extends Omit<O4aReadEvidenceInput, "readEvidenceIdentity"> {}

export interface O4aPublicationIntentInput {
  readonly publicationIntentClass: O4aPublicationIntentClass
  readonly repositoryId: string
  readonly pullRequestNumber: number
  readonly reviewedHead: string
  readonly reviewRunIdentity: string
  readonly bodyText: string
  readonly findingIdentity: string | null
  readonly path: string | null
  readonly lineAnchor: number | null
}

export interface O4aReadOnlyReviewProductLineageInput {
  readonly triggerEvidence: O1AuthenticatedGithubIssueCommentEvidence
  readonly triggerSourceInput: O1AuthenticatedGithubIssueCommentInput
  readonly triggerCommentText: string
  readonly mentionPolicy: O4aMentionPolicyInput
  readonly snapshot: O4aRepositorySnapshotInput
  readonly changedPaths: readonly string[]
  readonly readEvidence: readonly O4aReadEvidenceInput[]
  readonly reviewRun: ReviewRunRecord
  readonly reviewTemporal: ReviewTemporalEvidence
  readonly findings: readonly FindingRecord[]
  readonly publicationIntents: readonly O4aPublicationIntentInput[]
}

export interface O4aReadOnlyReviewProductLineageEvidence {
  readonly version: typeof O4A_READ_ONLY_REVIEW_PRODUCT_LINEAGE_VERSION
  readonly triggerEvidenceIdentity: string
  readonly repositoryId: string
  readonly repositoryFullName: string
  readonly pullRequestNumber: number
  readonly pullRequestId: string
  readonly canonicalBase: string
  readonly reviewedHead: string
  readonly baseRepositoryId: string
  readonly headRepositoryId: string
  readonly headRepositoryFullName: string
  readonly forkClassification: "SAME_REPOSITORY" | "FORK_REPOSITORY"
  readonly actorId: string
  readonly actorLogin: string
  readonly actorType: O1AuthenticatedGithubIssueCommentEvidence["actorType"]
  readonly actorEligibilityPolicyIdentity: string
  readonly actorEligibilityEvidenceRefs: readonly string[]
  readonly headBindingSource: typeof O1_ISSUE_COMMENT_HEAD_BINDING_SOURCE
  readonly headBindingPolicyIdentity: string
  readonly headBindingEvidenceRefs: readonly string[]
  readonly deliveryIdentity: string
  readonly payloadSha256: string
  readonly commentIdentity: string
  readonly commentBodySha256: string
  readonly commentBodyByteLength: number
  readonly mentionTargetLogin: string
  readonly mentionPolicyIdentity: string
  readonly mentionCommandKind: typeof O4A_MENTION_COMMAND_KIND
  readonly mentionCommandIdentity: string
  readonly snapshotEvidenceIdentity: string
  readonly changedPathSetIdentity: string
  readonly changedPathCount: number
  readonly readEvidenceSetIdentity: string
  readonly readEvidenceCount: number
  readonly reviewRunIdentity: string
  readonly temporalEvidenceIdentity: string
  readonly providerId: string
  readonly providerVersion: string
  readonly policyIdentity: string
  readonly contextBundleIdentity: string
  readonly instructionsIdentity: string
  readonly findingIdentities: readonly string[]
  readonly reviewedChangedPathCount: number
  readonly missingChangedPathIdentities: readonly string[]
  readonly truncatedChangedPathIdentities: readonly string[]
  readonly supportingContextPathCount: number
  readonly reviewCompletenessState: O4aReviewCompletenessState
  readonly reviewCompletenessEvidenceIdentity: string
  readonly publicationIntentIdentities: readonly string[]
  readonly publicationIntentCount: number
  readonly continuationDecision: O4aContinuationDecision
  readonly productLineageEvidenceIdentity: string
}

type UnknownRecord = Record<string, unknown>
type NormalizedSnapshot = O4aRepositorySnapshotInput
type NormalizedRead = O4aReadEvidenceInput & { readonly pathEvidenceIdentity: string }
type FindingBinding = Readonly<{
  findingIdentity: string
  path: string
  startLine: number | null
  endLine: number | null
  severity: FindingRecord["severity"]
  summaryIdentity: string
  contractClaimIdentity: string
}>
type PublicationDerived = Readonly<{
  publicationIntentIdentity: string
  publicationIntentClass: O4aPublicationIntentClass
  findingIdentity: string | null
}>

const SHA256 = /^[0-9a-f]{64}$/
const GIT_SHA1 = /^[0-9a-f]{40}$/
const DECIMAL_ID = /^(?:[1-9][0-9]{0,19})$/
const REPOSITORY = /^[A-Za-z0-9_.-]{1,100}\/[A-Za-z0-9_.-]{1,100}$/
const LOGIN = /^[A-Za-z0-9_.\-\[\]]{1,100}$/
const TIMESTAMP = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/
const READ_ROLES = new Set<string>(O4A_READ_ROLES)
const TRUNCATION_STATES = new Set<string>(O4A_TRUNCATION_STATES)
const PUBLICATION_CLASSES = new Set<string>(O4A_PUBLICATION_INTENT_CLASSES)

const INPUT_KEYS = [
  "triggerEvidence", "triggerSourceInput", "triggerCommentText", "mentionPolicy", "snapshot", "changedPaths",
  "readEvidence", "reviewRun", "reviewTemporal", "findings", "publicationIntents",
] as const
const MENTION_POLICY_KEYS = ["mentionTargetLogin", "mentionPolicyIdentity"] as const
const SNAPSHOT_KEYS = [
  "repositoryId", "repositoryFullName", "pullRequestNumber", "pullRequestId", "canonicalBase", "reviewedHead",
  "baseRepositoryId", "headRepositoryId", "headRepositoryFullName", "forkClassification", "baseRefIdentity",
  "headRefIdentity", "snapshotObservedAt", "snapshotEvidenceIdentity",
] as const
const SNAPSHOT_CORE_KEYS = SNAPSHOT_KEYS.filter((key) => key !== "snapshotEvidenceIdentity")
const READ_KEYS = [
  "path", "readRole", "contentIdentity", "byteLength", "sourceKind", "truncationState",
  "snapshotEvidenceIdentity", "reviewedHead", "readEvidenceIdentity",
] as const
const READ_CORE_KEYS = READ_KEYS.filter((key) => key !== "readEvidenceIdentity")
const PUBLICATION_KEYS = [
  "publicationIntentClass", "repositoryId", "pullRequestNumber", "reviewedHead", "reviewRunIdentity", "bodyText",
  "findingIdentity", "path", "lineAnchor",
] as const
export const O4A_PRODUCT_LINEAGE_EVIDENCE_KEYS = Object.freeze([
  "version", "triggerEvidenceIdentity", "repositoryId", "repositoryFullName", "pullRequestNumber", "pullRequestId",
  "canonicalBase", "reviewedHead", "baseRepositoryId", "headRepositoryId", "headRepositoryFullName", "forkClassification",
  "actorId", "actorLogin", "actorType", "actorEligibilityPolicyIdentity", "actorEligibilityEvidenceRefs", "headBindingSource",
  "headBindingPolicyIdentity", "headBindingEvidenceRefs", "deliveryIdentity", "payloadSha256", "commentIdentity", "commentBodySha256",
  "commentBodyByteLength", "mentionTargetLogin", "mentionPolicyIdentity", "mentionCommandKind", "mentionCommandIdentity",
  "snapshotEvidenceIdentity", "changedPathSetIdentity", "changedPathCount", "readEvidenceSetIdentity", "readEvidenceCount",
  "reviewRunIdentity", "temporalEvidenceIdentity", "providerId", "providerVersion", "policyIdentity", "contextBundleIdentity",
  "instructionsIdentity", "findingIdentities", "reviewedChangedPathCount", "missingChangedPathIdentities",
  "truncatedChangedPathIdentities", "supportingContextPathCount", "reviewCompletenessState", "reviewCompletenessEvidenceIdentity",
  "publicationIntentIdentities", "publicationIntentCount", "continuationDecision", "productLineageEvidenceIdentity",
] as const)

function fail(message: string): never {
  throw new TypeError(`O4-A read-only review product lineage blocked: ${message}`)
}
function compareStrings(left: string, right: string): number { return left < right ? -1 : left > right ? 1 : 0 }
function compareUtf8Bytes(left: string, right: string): number { return Buffer.compare(Buffer.from(left, "utf8"), Buffer.from(right, "utf8")) }
function assertUnicodeScalars(value: string, label: string): void {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1)
      if (!(next >= 0xdc00 && next <= 0xdfff)) fail(`${label} must contain only Unicode scalar values`)
      index += 1
    } else if (code >= 0xdc00 && code <= 0xdfff) fail(`${label} must contain only Unicode scalar values`)
  }
}
function boundedText(value: unknown, label: string, maximumBytes: number = O4A_LIMITS.maxGeneralTextUtf8Bytes, allowEmpty = false): string {
  if (typeof value !== "string" || (!allowEmpty && value.length === 0) || value.includes("\0")) fail(`${label} must be bounded NUL-free text`)
  assertUnicodeScalars(value, label)
  if (Buffer.byteLength(value, "utf8") > maximumBytes) fail(`${label} exceeds its UTF-8 byte bound`)
  return value
}
function sha256(value: unknown, label: string): string {
  const text = boundedText(value, label, 64)
  if (!SHA256.test(text)) fail(`${label} must be a lowercase SHA-256 identity`)
  return text
}
function gitSha(value: unknown, label: string): string {
  const text = boundedText(value, label, 40)
  if (!GIT_SHA1.test(text)) fail(`${label} must be a lowercase 40-hex Git SHA-1`)
  return text
}
function decimalId(value: unknown, label: string): string {
  const text = boundedText(value, label, 20)
  if (!DECIMAL_ID.test(text)) fail(`${label} must be a positive decimal identifier`)
  return text
}
function positiveInteger(value: unknown, label: string, maximum = Number.MAX_SAFE_INTEGER, allowZero = false): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < (allowZero ? 0 : 1) || value > maximum) {
    fail(`${label} must be a bounded safe integer`)
  }
  return value
}
function repositoryName(value: unknown, label: string): string {
  const text = boundedText(value, label, 201)
  if (!REPOSITORY.test(text)) fail(`${label} must be an owner/repository name`)
  return text
}
function login(value: unknown, label: string): string {
  const text = boundedText(value, label, 100)
  if (!LOGIN.test(text)) fail(`${label} has unsupported GitHub login syntax`)
  return text
}
function canonicalTimestamp(value: unknown, label: string): string {
  const text = boundedText(value, label, 24)
  if (!TIMESTAMP.test(text) || Number.isNaN(Date.parse(text)) || new Date(text).toISOString() !== text) fail(`${label} must be canonical UTC milliseconds`)
  return text
}
function repositoryPath(value: unknown, label: string): string {
  const path = boundedText(value, label, O4A_LIMITS.maxPathUtf8Bytes)
  if (path.startsWith("/") || path.includes("\\") || /^[A-Za-z]:\//.test(path) || path.split("/").some((part) => !part || part === "." || part === "..")) {
    fail(`${label} must be a repository-relative POSIX path`)
  }
  return path
}
function ownDataRecord(value: unknown, expectedKeys: readonly string[], label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || types.isProxy(value) || Array.isArray(value)) fail(`${label} must be a non-proxy plain object`)
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(`${label} must use a plain-object prototype`)
  if (Object.getOwnPropertySymbols(value).length !== 0) fail(`${label} must not contain symbol properties`)
  const descriptors = Object.getOwnPropertyDescriptors(value)
  const actual = Object.keys(descriptors).sort(compareStrings)
  const expected = [...expectedKeys].sort(compareStrings)
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) fail(`${label} has unexpected or missing properties`)
  for (const key of actual) {
    const descriptor = descriptors[key]
    if (!descriptor || !("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) fail(`${label}.${key} must be an enumerable defined data property`)
  }
  return value as UnknownRecord
}
function denseArray(value: unknown, label: string, maximum: number): readonly unknown[] {
  if (typeof value !== "object" || value === null || types.isProxy(value) || !Array.isArray(value)) fail(`${label} must be a non-proxy array`)
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(`${label} must use the built-in Array prototype`)
  if (value.length > maximum) fail(`${label} exceeds its item bound`)
  if (Object.getOwnPropertySymbols(value).length !== 0) fail(`${label} must not contain symbol properties`)
  const descriptors = Object.getOwnPropertyDescriptors(value)
  const expected = new Set<string>(["length", ...Array.from({ length: value.length }, (_, index) => String(index))])
  const ownKeys = Reflect.ownKeys(value)
  if (ownKeys.length !== expected.size) fail(`${label} contains sparse or extra array properties`)
  for (const key of ownKeys) {
    if (typeof key !== "string" || !expected.has(key)) fail(`${label} contains sparse or extra array properties`)
    if (key === "length") continue
    const descriptor = descriptors[key]
    if (!descriptor || !("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) fail(`${label}[${key}] must be an enumerable defined data property`)
  }
  return Array.from(value)
}
function assertSafeJsonGraph(value: unknown, label: string): void {
  const stack: Array<{ value: unknown, label: string, depth: number }> = [{ value, label, depth: 0 }]
  const seen = new Set<object>()
  let nodes = 0
  while (stack.length > 0) {
    const current = stack.pop()!
    nodes += 1
    if (nodes > O4A_LIMITS.maxGraphNodes) fail(`${label} exceeds graph node bound`)
    if (current.depth > O4A_LIMITS.maxGraphDepth) fail(`${label} exceeds graph depth bound`)
    const item = current.value
    if (item === null || typeof item === "boolean") continue
    if (typeof item === "string") { assertUnicodeScalars(item, current.label); continue }
    if (typeof item === "number") { if (!Number.isFinite(item)) fail(`${current.label} contains a non-finite number`); continue }
    if (typeof item !== "object" || types.isProxy(item)) fail(`${current.label} must contain only non-proxy JSON data`)
    if (seen.has(item)) fail(`${current.label} must not contain cyclic or aliased object references`)
    const prototype = Object.getPrototypeOf(item)
    if (Array.isArray(item)) {
      if (prototype !== Array.prototype) fail(`${current.label} must use the built-in Array prototype`)
    } else if (prototype !== Object.prototype && prototype !== null) fail(`${current.label} must use a plain-object prototype`)
    if (Object.getOwnPropertySymbols(item).length !== 0) fail(`${current.label} must not contain symbol properties`)
    seen.add(item)
    const descriptors = Object.getOwnPropertyDescriptors(item)
    if (Array.isArray(item)) {
      const expected = new Set<string>(["length", ...Array.from({ length: item.length }, (_, index) => String(index))])
      if (Reflect.ownKeys(item).length !== expected.size) fail(`${current.label} contains sparse or extra array properties`)
      for (let index = 0; index < item.length; index += 1) {
        const descriptor = descriptors[String(index)]
        if (!descriptor || !("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) fail(`${current.label}[${index}] must be an enumerable defined data property`)
        stack.push({ value: descriptor.value, label: `${current.label}[${index}]`, depth: current.depth + 1 })
      }
    } else {
      for (const [key, descriptor] of Object.entries(descriptors)) {
        if (!("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) fail(`${current.label}.${key} must be an enumerable defined data property`)
        stack.push({ value: descriptor.value, label: `${current.label}.${key}`, depth: current.depth + 1 })
      }
    }
  }
}
function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    const encoded = JSON.stringify(value)
    if (encoded === undefined) fail("canonical JSON contains non-JSON data")
    return encoded
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`
  const record = value as UnknownRecord
  return `{${Object.keys(record).sort(compareStrings).map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`
}
function rawTextSha256(value: string): string { return createHash("sha256").update(value, "utf8").digest("hex") }
function domainDigest(kind: string, value: unknown): string {
  const domain = `${O4A_READ_ONLY_REVIEW_PRODUCT_LINEAGE_VERSION}:${kind}`
  return createHash("sha256").update(domain, "utf8").update("\0", "utf8").update(canonicalJson(value), "utf8").digest("hex")
}
function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as UnknownRecord)) deepFreeze(child)
  }
  return value
}
function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index])
}
function nullableSha256(value: unknown, label: string): string | null { return value === null ? null : sha256(value, label) }
function nullablePath(value: unknown, label: string): string | null { return value === null ? null : repositoryPath(value, label) }
function nullableLine(value: unknown, label: string): number | null { return value === null ? null : positiveInteger(value, label, O4A_LIMITS.maxLineNumber) }

function snapshotCore(raw: unknown): O4aRepositorySnapshotCoreInput {
  const record = ownDataRecord(raw, SNAPSHOT_CORE_KEYS, "snapshot core")
  const fork = record.forkClassification
  if (fork !== "SAME_REPOSITORY" && fork !== "FORK_REPOSITORY") fail("snapshot core.forkClassification is unsupported")
  return deepFreeze({
    repositoryId: decimalId(record.repositoryId, "snapshot core.repositoryId"),
    repositoryFullName: repositoryName(record.repositoryFullName, "snapshot core.repositoryFullName"),
    pullRequestNumber: positiveInteger(record.pullRequestNumber, "snapshot core.pullRequestNumber"),
    pullRequestId: decimalId(record.pullRequestId, "snapshot core.pullRequestId"),
    canonicalBase: gitSha(record.canonicalBase, "snapshot core.canonicalBase"),
    reviewedHead: gitSha(record.reviewedHead, "snapshot core.reviewedHead"),
    baseRepositoryId: decimalId(record.baseRepositoryId, "snapshot core.baseRepositoryId"),
    headRepositoryId: decimalId(record.headRepositoryId, "snapshot core.headRepositoryId"),
    headRepositoryFullName: repositoryName(record.headRepositoryFullName, "snapshot core.headRepositoryFullName"),
    forkClassification: fork,
    baseRefIdentity: sha256(record.baseRefIdentity, "snapshot core.baseRefIdentity"),
    headRefIdentity: sha256(record.headRefIdentity, "snapshot core.headRefIdentity"),
    snapshotObservedAt: canonicalTimestamp(record.snapshotObservedAt, "snapshot core.snapshotObservedAt"),
  })
}
export function deriveO4aSnapshotEvidenceIdentity(raw: O4aRepositorySnapshotCoreInput): string {
  const core = snapshotCore(raw)
  return domainDigest("snapshot-evidence-identity", core)
}
export function createO4aRepositorySnapshotInput(raw: O4aRepositorySnapshotCoreInput): O4aRepositorySnapshotInput {
  const core = snapshotCore(raw)
  return deepFreeze({ ...core, snapshotEvidenceIdentity: domainDigest("snapshot-evidence-identity", core) })
}
function normalizeSnapshot(raw: unknown): NormalizedSnapshot {
  const record = ownDataRecord(raw, SNAPSHOT_KEYS, "snapshot")
  const coreRaw: UnknownRecord = {}
  for (const key of SNAPSHOT_CORE_KEYS) coreRaw[key] = record[key]
  const core = snapshotCore(coreRaw)
  const claimed = sha256(record.snapshotEvidenceIdentity, "snapshot.snapshotEvidenceIdentity")
  const expected = domainDigest("snapshot-evidence-identity", core)
  if (claimed !== expected) fail("snapshot.snapshotEvidenceIdentity does not match the canonical snapshot preimage")
  return deepFreeze({ ...core, snapshotEvidenceIdentity: expected })
}

function normalizeChangedPaths(raw: unknown, repositoryId: string, pullRequestNumber: number, reviewedHead: string): Readonly<{
  paths: readonly string[], pathIdentities: ReadonlyMap<string, string>, setIdentity: string
}> {
  const paths = denseArray(raw, "changedPaths", O4A_LIMITS.maxChangedPaths).map((value, index) => repositoryPath(value, `changedPaths[${index}]`))
  if (new Set(paths).size !== paths.length) fail("changedPaths must not contain duplicates")
  paths.sort(compareUtf8Bytes)
  const entries = paths.map((path) => ({
    path,
    pathEvidenceIdentity: domainDigest("changed-path-evidence-identity", { repositoryId, pullRequestNumber, reviewedHead, path }),
  }))
  const pathIdentities = new Map(entries.map((entry) => [entry.path, entry.pathEvidenceIdentity]))
  const setIdentity = domainDigest("changed-path-set-identity", { repositoryId, pullRequestNumber, reviewedHead, entries })
  return deepFreeze({ paths: Object.freeze(paths), pathIdentities, setIdentity })
}

function readCore(raw: unknown): O4aReadEvidenceCoreInput {
  const record = ownDataRecord(raw, READ_CORE_KEYS, "read evidence core")
  const readRole = boundedText(record.readRole, "read evidence core.readRole", 32) as O4aReadRole
  if (!READ_ROLES.has(readRole)) fail("read evidence core.readRole is unsupported")
  if (record.sourceKind !== O4A_READ_SOURCE_KIND) fail("read evidence core.sourceKind is unsupported")
  const truncationState = boundedText(record.truncationState, "read evidence core.truncationState", 16) as O4aTruncationState
  if (!TRUNCATION_STATES.has(truncationState)) fail("read evidence core.truncationState is unsupported")
  return deepFreeze({
    path: repositoryPath(record.path, "read evidence core.path"),
    readRole,
    contentIdentity: sha256(record.contentIdentity, "read evidence core.contentIdentity"),
    byteLength: positiveInteger(record.byteLength, "read evidence core.byteLength", O4A_LIMITS.maxReadContentBytes, true),
    sourceKind: O4A_READ_SOURCE_KIND,
    truncationState,
    snapshotEvidenceIdentity: sha256(record.snapshotEvidenceIdentity, "read evidence core.snapshotEvidenceIdentity"),
    reviewedHead: gitSha(record.reviewedHead, "read evidence core.reviewedHead"),
  })
}
export function deriveO4aReadEvidenceIdentity(repositoryIdValue: string, pullRequestNumberValue: number, raw: O4aReadEvidenceCoreInput): string {
  const repositoryId = decimalId(repositoryIdValue, "read context.repositoryId")
  const pullRequestNumber = positiveInteger(pullRequestNumberValue, "read context.pullRequestNumber")
  const core = readCore(raw)
  return domainDigest("read-evidence-identity", { repositoryId, pullRequestNumber, ...core })
}
export function createO4aReadEvidenceInput(repositoryIdValue: string, pullRequestNumberValue: number, raw: O4aReadEvidenceCoreInput): O4aReadEvidenceInput {
  const repositoryId = decimalId(repositoryIdValue, "read context.repositoryId")
  const pullRequestNumber = positiveInteger(pullRequestNumberValue, "read context.pullRequestNumber")
  const core = readCore(raw)
  return deepFreeze({ ...core, readEvidenceIdentity: domainDigest("read-evidence-identity", { repositoryId, pullRequestNumber, ...core }) })
}
function normalizeReads(raw: unknown, repositoryId: string, pullRequestNumber: number, snapshot: NormalizedSnapshot, changed: ReturnType<typeof normalizeChangedPaths>): Readonly<{
  reads: readonly NormalizedRead[], setIdentity: string, supportingCount: number, reviewedCount: number,
  missingPathIdentities: readonly string[], truncatedPathIdentities: readonly string[]
}> {
  const rows = denseArray(raw, "readEvidence", O4A_LIMITS.maxReadEvidenceItems)
  const reads: NormalizedRead[] = []
  const seenPaths = new Set<string>()
  for (let index = 0; index < rows.length; index += 1) {
    const record = ownDataRecord(rows[index], READ_KEYS, `readEvidence[${index}]`)
    const coreRaw: UnknownRecord = {}
    for (const key of READ_CORE_KEYS) coreRaw[key] = record[key]
    const core = readCore(coreRaw)
    if (seenPaths.has(core.path)) fail("readEvidence must not contain duplicate normalized paths")
    seenPaths.add(core.path)
    if (core.snapshotEvidenceIdentity !== snapshot.snapshotEvidenceIdentity || core.reviewedHead !== snapshot.reviewedHead) {
      fail("readEvidence item does not bind the exact snapshot and reviewed head")
    }
    const isChanged = changed.pathIdentities.has(core.path)
    if (core.readRole === "CHANGED_PATH" && !isChanged) fail("CHANGED_PATH read must belong to the changed-path universe")
    if (core.readRole === "SUPPORTING_CONTEXT" && isChanged) fail("changed path cannot be relabeled as supporting context")
    const claimed = sha256(record.readEvidenceIdentity, `readEvidence[${index}].readEvidenceIdentity`)
    const expected = domainDigest("read-evidence-identity", { repositoryId, pullRequestNumber, ...core })
    if (claimed !== expected) fail("readEvidence identity does not match its canonical preimage")
    reads.push(deepFreeze({ ...core, readEvidenceIdentity: expected, pathEvidenceIdentity: changed.pathIdentities.get(core.path) ?? domainDigest("changed-path-evidence-identity", { repositoryId, pullRequestNumber, reviewedHead: snapshot.reviewedHead, path: core.path }) }))
  }
  reads.sort((a, b) => compareUtf8Bytes(a.path, b.path))
  const setIdentity = domainDigest("read-evidence-set-identity", {
    repositoryId, pullRequestNumber, snapshotEvidenceIdentity: snapshot.snapshotEvidenceIdentity, reviewedHead: snapshot.reviewedHead,
    readEvidenceIdentities: reads.map((row) => row.readEvidenceIdentity).sort(compareStrings),
  })
  const changedReads = new Map(reads.filter((row) => row.readRole === "CHANGED_PATH").map((row) => [row.path, row]))
  const missing: string[] = []
  const truncated: string[] = []
  let reviewedCount = 0
  for (const path of changed.paths) {
    const row = changedReads.get(path)
    const pathIdentity = changed.pathIdentities.get(path)!
    if (!row) missing.push(pathIdentity)
    else if (row.truncationState === "TRUNCATED") truncated.push(pathIdentity)
    else reviewedCount += 1
  }
  return deepFreeze({
    reads: Object.freeze(reads), setIdentity, supportingCount: reads.filter((row) => row.readRole === "SUPPORTING_CONTEXT").length,
    reviewedCount, missingPathIdentities: Object.freeze(missing.sort(compareStrings)), truncatedPathIdentities: Object.freeze(truncated.sort(compareStrings)),
  })
}

function validateReviewLineage(rawRun: unknown, rawTemporal: unknown, snapshot: NormalizedSnapshot): Readonly<{
  run: ReviewRunRecord, temporal: ReviewTemporalEvidence, stale: boolean, lineageMismatch: boolean, incomplete: boolean
}> {
  assertSafeJsonGraph(rawRun, "reviewRun")
  assertSafeJsonGraph(rawTemporal, "reviewTemporal")
  const run = validateReviewRunRecord(rawRun)
  const temporal = validateReviewTemporalEvidence(rawTemporal)
  if (temporal.reviewRunIdentity !== run.reviewRunIdentity) fail("review temporal evidence does not bind the exact review run identity")
  if (temporal.status !== run.status || temporal.canonicalBase !== run.canonicalBase || temporal.reviewedHead !== run.reviewedHead || temporal.evaluatedHead !== run.evaluatedHead) {
    fail("review temporal evidence does not match the canonical review run semantics")
  }
  const lineageMismatch = run.canonicalBase !== snapshot.canonicalBase || run.reviewedHead !== snapshot.reviewedHead
  const stale = run.status === "STALE" || run.evaluatedHead !== run.reviewedHead
  const incomplete = run.status !== "COMPLETED" && run.status !== "STALE"
  return Object.freeze({ run, temporal, stale, lineageMismatch, incomplete })
}

function validateFindings(raw: unknown, run: ReviewRunRecord, changed: ReturnType<typeof normalizeChangedPaths>): readonly FindingBinding[] {
  const values = denseArray(raw, "findings", O4A_LIMITS.maxFindings)
  const runtime = new ReviewerIntelligenceRuntime({ adjudicatorId: "o4a-read-only-validation" })
  const bindings: FindingBinding[] = []
  const identities: string[] = []
  for (let index = 0; index < values.length; index += 1) {
    assertSafeJsonGraph(values[index], `findings[${index}]`)
    const finding = runtime.validateFindingRecord(values[index], run.evaluatedHead)
    if (finding.review.reviewRunId !== run.reviewRunId) fail("finding reviewRunId does not match the exact review run")
    if (finding.review.reviewerId !== run.providerId || finding.review.reviewerVersion !== run.providerVersion) fail("finding reviewer identity does not match the exact provider")
    if (finding.review.policyIdentity !== run.policyIdentity || finding.review.canonicalBase !== run.canonicalBase || finding.review.reviewedHead !== run.reviewedHead) fail("finding review policy/base/head lineage mismatch")
    if (finding.evaluatedHead !== run.evaluatedHead) fail("finding evaluated head does not match review run")
    if (finding.freshness !== "CURRENT") fail("finding must be CURRENT for O4-A publication lineage")
    if (!changed.pathIdentities.has(finding.path)) fail("finding path must belong to the changed-path universe")
    const startLine = finding.range?.startLine ?? null
    const endLine = finding.range?.endLine ?? null
    if ((startLine === null) !== (endLine === null)) fail("finding range must be fully present or null")
    if (startLine !== null && (startLine <= 0 || endLine! < startLine || endLine! > O4A_LIMITS.maxLineNumber)) fail("finding range is outside O4-A bounds")
    identities.push(finding.findingIdentity)
    bindings.push(deepFreeze({
      findingIdentity: finding.findingIdentity,
      path: finding.path,
      startLine,
      endLine,
      severity: finding.severity,
      summaryIdentity: domainDigest("summary-identity", { findingIdentity: finding.findingIdentity, summary: finding.summary }),
      contractClaimIdentity: domainDigest("contract-claim-identity", { findingIdentity: finding.findingIdentity, contractClaim: finding.contractClaim }),
    }))
  }
  if (new Set(identities).size !== identities.length) fail("findings must not contain duplicate finding identities")
  const sorted = [...identities].sort(compareStrings)
  if (!sameStrings(sorted, run.findingIdentities)) fail("finding identity set does not equal the canonical review run finding identities")
  if (run.acceptedClaimCount !== bindings.length || run.acceptedClaimCount !== run.findingIdentities.length) fail("review run accepted finding count does not match findings")
  bindings.sort((a, b) => compareStrings(a.findingIdentity, b.findingIdentity))
  return Object.freeze(bindings)
}

function normalizeMention(raw: unknown, trigger: O1AuthenticatedGithubIssueCommentEvidence, triggerCommentTextValue: unknown): Readonly<{
  target: string, policyIdentity: string, commandIdentity: string
}> {
  const policy = ownDataRecord(raw, MENTION_POLICY_KEYS, "mentionPolicy")
  const target = login(policy.mentionTargetLogin, "mentionPolicy.mentionTargetLogin")
  const policyIdentity = sha256(policy.mentionPolicyIdentity, "mentionPolicy.mentionPolicyIdentity")
  const triggerCommentText = boundedText(triggerCommentTextValue, "triggerCommentText", O4A_LIMITS.maxTriggerCommentUtf8Bytes)
  const bodySha = rawTextSha256(triggerCommentText)
  if (bodySha !== trigger.commentBodySha256 || Buffer.byteLength(triggerCommentText, "utf8") !== trigger.commentBodyByteLength) {
    fail("triggerCommentText does not match the authenticated O1 comment body digest and byte length")
  }
  if (triggerCommentText !== `@${target} review`) fail("triggerCommentText does not match the exact O4-A v1 review mention grammar")
  const commandIdentity = domainDigest("mention-command-identity", {
    mentionCommandKind: O4A_MENTION_COMMAND_KIND,
    mentionTargetLogin: target,
    mentionPolicyIdentity: policyIdentity,
    commentIdentity: trigger.commentIdentity,
    commentBodySha256: trigger.commentBodySha256,
  })
  return Object.freeze({ target, policyIdentity, commandIdentity })
}

function normalizePublications(raw: unknown, repositoryId: string, pullRequestNumber: number, reviewedHead: string, run: ReviewRunRecord, bindings: readonly FindingBinding[]): Readonly<{
  derived: readonly PublicationDerived[], globallyValid: boolean
}> {
  const values = denseArray(raw, "publicationIntents", O4A_LIMITS.maxPublicationIntents)
  const findingById = new Map(bindings.map((binding) => [binding.findingIdentity, binding]))
  const derived: PublicationDerived[] = []
  const inlineFindings = new Set<string>()
  let topLevelCount = 0
  let globallyValid = true
  for (let index = 0; index < values.length; index += 1) {
    const record = ownDataRecord(values[index], PUBLICATION_KEYS, `publicationIntents[${index}]`)
    const publicationIntentClass = boundedText(record.publicationIntentClass, `publicationIntents[${index}].publicationIntentClass`, 32) as O4aPublicationIntentClass
    if (!PUBLICATION_CLASSES.has(publicationIntentClass)) fail("publication intent class is unsupported")
    const intentRepositoryId = decimalId(record.repositoryId, `publicationIntents[${index}].repositoryId`)
    const intentPr = positiveInteger(record.pullRequestNumber, `publicationIntents[${index}].pullRequestNumber`)
    const intentHead = gitSha(record.reviewedHead, `publicationIntents[${index}].reviewedHead`)
    const intentRun = sha256(record.reviewRunIdentity, `publicationIntents[${index}].reviewRunIdentity`)
    if (intentRepositoryId !== repositoryId || intentPr !== pullRequestNumber || intentHead !== reviewedHead || intentRun !== run.reviewRunIdentity) globallyValid = false
    const bodyText = boundedText(record.bodyText, `publicationIntents[${index}].bodyText`, O4A_LIMITS.maxPublicationBodyUtf8Bytes)
    const bodyIdentity = domainDigest("body-identity", { bodyText })
    const bodyByteLength = Buffer.byteLength(bodyText, "utf8")
    const findingIdentity = nullableSha256(record.findingIdentity, `publicationIntents[${index}].findingIdentity`)
    const path = nullablePath(record.path, `publicationIntents[${index}].path`)
    const lineAnchor = nullableLine(record.lineAnchor, `publicationIntents[${index}].lineAnchor`)
    if (publicationIntentClass === "TOP_LEVEL_REVIEW_SUMMARY") {
      topLevelCount += 1
      if (findingIdentity !== null || path !== null || lineAnchor !== null) fail("top-level review summary must not contain finding/path/line anchors")
    } else {
      if (findingIdentity === null || path === null || lineAnchor === null) fail("inline finding comment requires finding/path/line anchors")
      const finding = findingById.get(findingIdentity)
      if (!finding) fail("inline publication does not bind a validated finding")
      if (finding.path !== path) fail("inline publication path does not match the validated finding path")
      if (finding.startLine === null || finding.endLine === null) fail("finding without a validated range is not eligible for inline publication")
      if (lineAnchor < finding.startLine || lineAnchor > finding.endLine) fail("inline publication line anchor is outside the validated finding range")
      if (inlineFindings.has(findingIdentity)) fail("at most one inline publication intent is allowed per finding")
      inlineFindings.add(findingIdentity)
    }
    const publicationIntentIdentity = domainDigest("publication-intent-identity", {
      publicationIntentClass, repositoryId: intentRepositoryId, pullRequestNumber: intentPr, reviewedHead: intentHead,
      reviewRunIdentity: intentRun, bodyIdentity, bodyByteLength, findingIdentity, path, lineAnchor,
    })
    derived.push(Object.freeze({ publicationIntentIdentity, publicationIntentClass, findingIdentity }))
  }
  const identities = derived.map((item) => item.publicationIntentIdentity)
  if (new Set(identities).size !== identities.length) fail("publicationIntents must not contain duplicate publication intent identities")
  if (topLevelCount !== 1) globallyValid = false
  derived.sort((a, b) => compareStrings(a.publicationIntentIdentity, b.publicationIntentIdentity))
  return Object.freeze({ derived: Object.freeze(derived), globallyValid })
}

function buildEvidence(raw: O4aReadOnlyReviewProductLineageInput): Omit<O4aReadOnlyReviewProductLineageEvidence, "productLineageEvidenceIdentity"> {
  const input = ownDataRecord(raw, INPUT_KEYS, "O4-A input")
  const trigger = validateO1AuthenticatedGithubIssueCommentEvidence(input.triggerEvidence, input.triggerSourceInput as O1AuthenticatedGithubIssueCommentInput)
  if (trigger.eventName !== "issue_comment" || trigger.action !== "created" || trigger.headBindingSource !== O1_ISSUE_COMMENT_HEAD_BINDING_SOURCE || trigger.authenticationDecision !== "AUTHENTICATED" || trigger.replayDecision !== "UNSEEN" || trigger.ingressDecision !== "ACCEPT" || trigger.actorEligibilityDecision !== "ELIGIBLE") {
    fail("O1 trigger is not the exact positive issue_comment/created lineage")
  }
  const mention = normalizeMention(input.mentionPolicy, trigger, input.triggerCommentText)
  const snapshot = normalizeSnapshot(input.snapshot)
  const triggerLineageMismatch = snapshot.repositoryId !== trigger.repositoryId
    || snapshot.repositoryFullName !== trigger.repositoryFullName
    || snapshot.pullRequestNumber !== trigger.pullRequestNumber
    || snapshot.pullRequestId !== trigger.pullRequestId
    || snapshot.baseRepositoryId !== trigger.baseRepositoryId
    || snapshot.headRepositoryId !== trigger.headRepositoryId
    || snapshot.headRepositoryFullName !== trigger.headRepositoryFullName
    || snapshot.forkClassification !== trigger.forkClassification
    || snapshot.reviewedHead !== trigger.observedHeadSha
    || snapshot.reviewedHead !== trigger.expectedHeadSha
  const changed = normalizeChangedPaths(input.changedPaths, trigger.repositoryId, trigger.pullRequestNumber, snapshot.reviewedHead)
  const reads = normalizeReads(input.readEvidence, trigger.repositoryId, trigger.pullRequestNumber, snapshot, changed)
  const review = validateReviewLineage(input.reviewRun, input.reviewTemporal, snapshot)
  const findings = validateFindings(input.findings, review.run, changed)
  const publications = normalizePublications(input.publicationIntents, trigger.repositoryId, trigger.pullRequestNumber, snapshot.reviewedHead, review.run, findings)

  const lineageMismatch = triggerLineageMismatch || review.lineageMismatch
  let reviewCompletenessState: O4aReviewCompletenessState
  if (review.stale) reviewCompletenessState = "STALE_HEAD"
  else if (lineageMismatch) reviewCompletenessState = "LINEAGE_MISMATCH"
  else if (review.incomplete) reviewCompletenessState = "INCOMPLETE_REVIEW_RUN"
  else if (reads.truncatedPathIdentities.length > 0) reviewCompletenessState = "INCOMPLETE_TRUNCATED_READS"
  else if (reads.missingPathIdentities.length > 0) reviewCompletenessState = "INCOMPLETE_MISSING_CHANGED_PATH_READS"
  else if (changed.paths.length === 0) reviewCompletenessState = "COMPLETE_NO_REVIEWABLE_PATHS"
  else reviewCompletenessState = "COMPLETE"

  const reviewCompletenessEvidenceIdentity = domainDigest("review-completeness-evidence-identity", {
    repositoryId: trigger.repositoryId,
    pullRequestNumber: trigger.pullRequestNumber,
    snapshotEvidenceIdentity: snapshot.snapshotEvidenceIdentity,
    reviewedHead: snapshot.reviewedHead,
    changedPathSetIdentity: changed.setIdentity,
    changedPathCount: changed.paths.length,
    readEvidenceSetIdentity: reads.setIdentity,
    readEvidenceCount: reads.reads.length,
    reviewedChangedPathCount: reads.reviewedCount,
    missingChangedPathIdentities: reads.missingPathIdentities,
    truncatedChangedPathIdentities: reads.truncatedPathIdentities,
    supportingContextPathCount: reads.supportingCount,
    reviewRunIdentity: review.run.reviewRunIdentity,
    temporalEvidenceIdentity: review.temporal.temporalEvidenceIdentity,
    reviewCompletenessState,
  })

  let continuationDecision: O4aContinuationDecision
  if (reviewCompletenessState === "STALE_HEAD") continuationDecision = "BLOCK_STALE_HEAD"
  else if (reviewCompletenessState === "LINEAGE_MISMATCH") continuationDecision = "BLOCK_LINEAGE_MISMATCH"
  else if (reviewCompletenessState !== "COMPLETE" && reviewCompletenessState !== "COMPLETE_NO_REVIEWABLE_PATHS") continuationDecision = "BLOCK_INCOMPLETE_REVIEW"
  else if (!publications.globallyValid) continuationDecision = "BLOCK_INVALID_PUBLICATION_INTENT"
  else continuationDecision = "READY_FOR_SEPARATE_PUBLICATION_AUTHORITY"

  return deepFreeze({
    version: O4A_READ_ONLY_REVIEW_PRODUCT_LINEAGE_VERSION,
    triggerEvidenceIdentity: trigger.eventEvidenceIdentity,
    repositoryId: trigger.repositoryId,
    repositoryFullName: trigger.repositoryFullName,
    pullRequestNumber: trigger.pullRequestNumber,
    pullRequestId: trigger.pullRequestId,
    canonicalBase: snapshot.canonicalBase,
    reviewedHead: snapshot.reviewedHead,
    baseRepositoryId: trigger.baseRepositoryId,
    headRepositoryId: trigger.headRepositoryId,
    headRepositoryFullName: trigger.headRepositoryFullName,
    forkClassification: trigger.forkClassification,
    actorId: trigger.actorId,
    actorLogin: trigger.actorLogin,
    actorType: trigger.actorType,
    actorEligibilityPolicyIdentity: trigger.actorEligibilityPolicyIdentity,
    actorEligibilityEvidenceRefs: Object.freeze([...trigger.actorEligibilityEvidenceRefs]),
    headBindingSource: O1_ISSUE_COMMENT_HEAD_BINDING_SOURCE,
    headBindingPolicyIdentity: trigger.headBindingPolicyIdentity,
    headBindingEvidenceRefs: Object.freeze([...trigger.headBindingEvidenceRefs]),
    deliveryIdentity: trigger.deliveryIdentity,
    payloadSha256: trigger.payloadSha256,
    commentIdentity: trigger.commentIdentity,
    commentBodySha256: trigger.commentBodySha256,
    commentBodyByteLength: trigger.commentBodyByteLength,
    mentionTargetLogin: mention.target,
    mentionPolicyIdentity: mention.policyIdentity,
    mentionCommandKind: O4A_MENTION_COMMAND_KIND,
    mentionCommandIdentity: mention.commandIdentity,
    snapshotEvidenceIdentity: snapshot.snapshotEvidenceIdentity,
    changedPathSetIdentity: changed.setIdentity,
    changedPathCount: changed.paths.length,
    readEvidenceSetIdentity: reads.setIdentity,
    readEvidenceCount: reads.reads.length,
    reviewRunIdentity: review.run.reviewRunIdentity,
    temporalEvidenceIdentity: review.temporal.temporalEvidenceIdentity,
    providerId: review.run.providerId,
    providerVersion: review.run.providerVersion,
    policyIdentity: review.run.policyIdentity,
    contextBundleIdentity: review.run.contextBundleIdentity,
    instructionsIdentity: review.run.instructionsIdentity,
    findingIdentities: Object.freeze([...review.run.findingIdentities]),
    reviewedChangedPathCount: reads.reviewedCount,
    missingChangedPathIdentities: reads.missingPathIdentities,
    truncatedChangedPathIdentities: reads.truncatedPathIdentities,
    supportingContextPathCount: reads.supportingCount,
    reviewCompletenessState,
    reviewCompletenessEvidenceIdentity,
    publicationIntentIdentities: Object.freeze(publications.derived.map((item) => item.publicationIntentIdentity)),
    publicationIntentCount: publications.derived.length,
    continuationDecision,
  })
}

export function createO4aReadOnlyReviewProductLineageEvidence(raw: O4aReadOnlyReviewProductLineageInput): O4aReadOnlyReviewProductLineageEvidence {
  const core = buildEvidence(raw)
  return deepFreeze({ ...core, productLineageEvidenceIdentity: domainDigest("product-lineage-evidence-identity", core) })
}

export function validateO4aReadOnlyReviewProductLineageEvidence(value: unknown, sourceInput: O4aReadOnlyReviewProductLineageInput): O4aReadOnlyReviewProductLineageEvidence {
  assertSafeJsonGraph(value, "O4-A serialized evidence")
  ownDataRecord(value, O4A_PRODUCT_LINEAGE_EVIDENCE_KEYS, "O4-A serialized evidence")
  const expected = createO4aReadOnlyReviewProductLineageEvidence(sourceInput)
  if (canonicalJson(value) !== canonicalJson(expected)) fail("serialized evidence does not match independently rederived source evidence")
  return expected
}
