import { createHash } from "node:crypto"
import { types } from "node:util"

import {
  O4A_READ_SOURCE_KIND,
  createO4aReadEvidenceInput,
  createO4aRepositorySnapshotInput,
  type O4aReadEvidenceInput,
  type O4aRepositorySnapshotInput,
} from "./o4-read-only-review-product-lineage-evidence.ts"

export const O4B_BOUNDED_READ_ONLY_GITHUB_CONTEXT_VERSION = "kodac-o4b-bounded-read-only-github-context-v1" as const
export const O4B_CONTINUATION_DECISIONS = Object.freeze([
  "READY_FOR_O4A_REVIEW",
  "BLOCK_INCOMPLETE_CHANGED_PATH_CONTEXT",
] as const)
export const O4B_CHANGED_FILE_STATUSES = Object.freeze([
  "added", "modified", "removed", "renamed", "copied", "changed", "unchanged",
] as const)
export const O4B_TRUNCATION_REASONS = Object.freeze([
  "BINARY_OR_NON_UTF8", "OVERSIZED", "MISSING_CONTENT", "UNSUPPORTED_TYPE", "UNSUPPORTED_ENCODING",
] as const)
export const O4B_LIMITS = Object.freeze({
  maxChangedPaths: 512,
  maxSupportingPaths: 128,
  maxReadItems: 640,
  maxFullFileBytes: 1_048_576,
  maxTotalMaterializedContentBytes: 8_388_608,
  maxPrResponseBytes: 262_144,
  maxFilesPageResponseBytes: 2_097_152,
  maxContentResponseBytes: 1_572_864,
  maxHttpRequests: 650,
  maxNetworkTimeoutMs: 30_000,
  maxRepositoryPathUtf8Bytes: 1_024,
  maxGeneralTextUtf8Bytes: 4_096,
  maxCredentialUtf8Bytes: 4_096,
  maxGraphDepth: 32,
  maxGraphNodes: 32_768,
})

export type O4bContinuationDecision = (typeof O4B_CONTINUATION_DECISIONS)[number]
export type O4bChangedFileStatus = (typeof O4B_CHANGED_FILE_STATUSES)[number]
export type O4bTruncationReason = (typeof O4B_TRUNCATION_REASONS)[number]
export type O4bContentRevisionKind = "HEAD" | "BASE_REMOVED"

export interface O4bBoundedReadOnlyGithubContextInput {
  readonly expectedRepositoryId: string
  readonly expectedRepositoryFullName: string
  readonly pullRequestNumber: number
  readonly expectedPullRequestId: string
  readonly expectedBaseRepositoryId: string
  readonly expectedHeadRepositoryId: string
  readonly expectedHeadRepositoryFullName: string
  readonly expectedHeadSha: string
  readonly credentialPolicyIdentity: string
  readonly supportingPaths: readonly string[]
  readonly credential: string
}

export interface O4bBoundedReadOnlyGithubContextOptions {
  readonly fetchImpl?: typeof fetch
  readonly now?: () => string
  readonly signal?: AbortSignal
  readonly timeoutMs?: number
}

export interface O4bChangedFileMetadataRecord {
  readonly path: string
  readonly status: O4bChangedFileStatus
  readonly previousPath: string | null
  readonly providerBlobSha: string | null
  readonly metadataIdentity: string
}

export interface O4bCanonicalContentRecord {
  readonly path: string
  readonly readRole: "CHANGED_PATH" | "SUPPORTING_CONTEXT"
  readonly changedFileStatus: O4bChangedFileStatus | null
  readonly previousPath: string | null
  readonly contentRepositoryId: string
  readonly contentRepositoryFullName: string
  readonly contentRevisionSha: string
  readonly contentRevisionKind: O4bContentRevisionKind
  readonly providerBlobSha: string | null
  readonly providerDeclaredSize: number
  readonly materializedByteLength: number
  readonly contentIdentity: string
  readonly truncationState: "FULL" | "TRUNCATED"
  readonly truncationReason: O4bTruncationReason | null
  readonly readEvidenceIdentity: string
  readonly contentRecordIdentity: string
}

export interface O4bTransientContentItem extends O4bCanonicalContentRecord {
  readonly contentText: string | null
}

export interface O4bReadContextEvidence {
  readonly version: typeof O4B_BOUNDED_READ_ONLY_GITHUB_CONTEXT_VERSION
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
  readonly baseRef: string
  readonly headRef: string
  readonly credentialPolicyIdentity: string
  readonly snapshotEvidenceIdentity: string
  readonly changedPaths: readonly string[]
  readonly changedPathSetIdentity: string
  readonly changedPathCount: number
  readonly changedFileMetadataRecords: readonly O4bChangedFileMetadataRecord[]
  readonly changedFileMetadataSetIdentity: string
  readonly readEvidenceIdentities: readonly string[]
  readonly readEvidenceSetIdentity: string
  readonly readEvidenceCount: number
  readonly fullReadCount: number
  readonly truncatedReadCount: number
  readonly supportingPathCount: number
  readonly contentRecords: readonly O4bCanonicalContentRecord[]
  readonly contentRecordIdentities: readonly string[]
  readonly initialSnapshotResponseIdentity: string
  readonly terminalSnapshotResponseIdentity: string
  readonly filesPageRecordIdentityGroups: readonly (readonly string[])[]
  readonly filesPageResponseIdentities: readonly string[]
  readonly requestCount: number
  readonly snapshotObservedAt: string
  readonly terminalObservedAt: string
  readonly continuationDecision: O4bContinuationDecision
  readonly readContextEvidenceIdentity: string
}

export interface O4bBoundedReadOnlyGithubContextResult {
  readonly snapshot: O4aRepositorySnapshotInput
  readonly changedPaths: readonly string[]
  readonly readEvidence: readonly O4aReadEvidenceInput[]
  readonly contentItems: readonly O4bTransientContentItem[]
  readonly readContextEvidence: O4bReadContextEvidence
}

type UnknownRecord = Record<string, unknown>
type NormalizedInput = Omit<O4bBoundedReadOnlyGithubContextInput, "supportingPaths"> & { readonly supportingPaths: readonly string[] }
type NormalizedOptions = {
  readonly fetchImpl: typeof fetch
  readonly now: () => string
  readonly signal: AbortSignal | undefined
  readonly timeoutMs: number
}
type PrSnapshot = Readonly<{
  repositoryId: string
  repositoryFullName: string
  pullRequestNumber: number
  pullRequestId: string
  canonicalBase: string
  reviewedHead: string
  baseRepositoryId: string
  baseRepositoryFullName: string
  headRepositoryId: string
  headRepositoryFullName: string
  forkClassification: "SAME_REPOSITORY" | "FORK_REPOSITORY"
  baseRef: string
  headRef: string
}>
type ContentRead = Readonly<{ item: O4bTransientContentItem, evidence: O4aReadEvidenceInput }>

type RequestState = { count: number }

const SHA256 = /^[0-9a-f]{64}$/
const GIT_SHA1 = /^[0-9a-f]{40}$/
const DECIMAL_ID = /^(?:[1-9][0-9]{0,19})$/
const REPOSITORY = /^[A-Za-z0-9_.-]{1,100}\/[A-Za-z0-9_.-]{1,100}$/
const CHANGED_STATUSES = new Set<string>(O4B_CHANGED_FILE_STATUSES)
const TRUNCATION_REASONS = new Set<string>(O4B_TRUNCATION_REASONS)
const CONTINUATION_DECISIONS = new Set<string>(O4B_CONTINUATION_DECISIONS)

const INPUT_KEYS = [
  "expectedRepositoryId", "expectedRepositoryFullName", "pullRequestNumber", "expectedPullRequestId",
  "expectedBaseRepositoryId", "expectedHeadRepositoryId", "expectedHeadRepositoryFullName", "expectedHeadSha",
  "credentialPolicyIdentity", "supportingPaths", "credential",
] as const
const OPTION_KEYS = ["fetchImpl", "now", "signal", "timeoutMs"] as const
const METADATA_KEYS = ["path", "status", "previousPath", "providerBlobSha", "metadataIdentity"] as const
const CONTENT_RECORD_KEYS = [
  "path", "readRole", "changedFileStatus", "previousPath", "contentRepositoryId", "contentRepositoryFullName",
  "contentRevisionSha", "contentRevisionKind", "providerBlobSha", "providerDeclaredSize", "materializedByteLength",
  "contentIdentity", "truncationState", "truncationReason", "readEvidenceIdentity", "contentRecordIdentity",
] as const
export const O4B_READ_CONTEXT_EVIDENCE_KEYS = Object.freeze([
  "version", "repositoryId", "repositoryFullName", "pullRequestNumber", "pullRequestId", "canonicalBase", "reviewedHead",
  "baseRepositoryId", "headRepositoryId", "headRepositoryFullName", "forkClassification", "baseRef", "headRef",
  "credentialPolicyIdentity", "snapshotEvidenceIdentity", "changedPaths", "changedPathSetIdentity", "changedPathCount",
  "changedFileMetadataRecords", "changedFileMetadataSetIdentity", "readEvidenceIdentities", "readEvidenceSetIdentity",
  "readEvidenceCount", "fullReadCount", "truncatedReadCount", "supportingPathCount", "contentRecords",
  "contentRecordIdentities", "initialSnapshotResponseIdentity", "terminalSnapshotResponseIdentity",
  "filesPageRecordIdentityGroups", "filesPageResponseIdentities", "requestCount", "snapshotObservedAt", "terminalObservedAt",
  "continuationDecision", "readContextEvidenceIdentity",
] as const)

function fail(message: string): never {
  throw new Error(`O4-B GitHub context blocked: ${message}`)
}
function compareStrings(left: string, right: string): number { return left < right ? -1 : left > right ? 1 : 0 }
function compareUtf8(left: string, right: string): number { return Buffer.compare(Buffer.from(left, "utf8"), Buffer.from(right, "utf8")) }
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
function boundedText(value: unknown, label: string, maximumBytes: number = O4B_LIMITS.maxGeneralTextUtf8Bytes, allowEmpty = false): string {
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
function providerDecimalId(value: unknown, label: string): string {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) fail(`${label} must be a positive safe integer`)
  return decimalId(String(value), label)
}
function positiveInteger(value: unknown, label: string, maximum = Number.MAX_SAFE_INTEGER, allowZero = false): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < (allowZero ? 0 : 1) || value > maximum) fail(`${label} must be a bounded safe integer`)
  return value
}
function repositoryName(value: unknown, label: string): string {
  const text = boundedText(value, label, 201)
  if (!REPOSITORY.test(text)) fail(`${label} must be an owner/repository name`)
  return text
}
function repositoryPath(value: unknown, label: string): string {
  const text = boundedText(value, label, O4B_LIMITS.maxRepositoryPathUtf8Bytes)
  if (text.startsWith("/") || text.includes("\\") || /^[A-Za-z]:\//.test(text) || text.split("/").some((part) => !part || part === "." || part === "..")) {
    fail(`${label} must be a repository-relative POSIX path`)
  }
  return text
}
function canonicalTimestamp(value: unknown, label: string): string {
  const text = boundedText(value, label, 24)
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(text) || Number.isNaN(Date.parse(text)) || new Date(text).toISOString() !== text) {
    fail(`${label} must be canonical UTC milliseconds`)
  }
  return text
}
function credentialValue(value: unknown): string {
  const text = boundedText(value, "credential", O4B_LIMITS.maxCredentialUtf8Bytes)
  for (const char of text) {
    const code = char.codePointAt(0)!
    if (code < 0x20 || code === 0x7f) fail("credential contains control characters")
  }
  return text
}
function ownExactRecord(value: unknown, expectedKeys: readonly string[], label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value) || types.isProxy(value)) fail(`${label} must be a non-proxy plain object`)
  const proto = Object.getPrototypeOf(value)
  if (proto !== Object.prototype && proto !== null) fail(`${label} must use a plain-object prototype`)
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
function ownOptionalRecord(value: unknown, allowedKeys: readonly string[], label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value) || types.isProxy(value)) fail(`${label} must be a non-proxy plain object`)
  const proto = Object.getPrototypeOf(value)
  if (proto !== Object.prototype && proto !== null) fail(`${label} must use a plain-object prototype`)
  if (Object.getOwnPropertySymbols(value).length !== 0) fail(`${label} must not contain symbol properties`)
  const allowed = new Set(allowedKeys)
  const descriptors = Object.getOwnPropertyDescriptors(value)
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (!allowed.has(key)) fail(`${label} has an unsupported property: ${key}`)
    if (!("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) fail(`${label}.${key} must be an enumerable defined data property`)
  }
  return value as UnknownRecord
}
function providerRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value) || types.isProxy(value)) fail(`${label} must be a plain JSON object`)
  const proto = Object.getPrototypeOf(value)
  if (proto !== Object.prototype && proto !== null) fail(`${label} must use a plain-object prototype`)
  if (Object.getOwnPropertySymbols(value).length !== 0) fail(`${label} must not contain symbol properties`)
  const descriptors = Object.getOwnPropertyDescriptors(value)
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (!("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) fail(`${label}.${key} must be an enumerable defined data property`)
  }
  return value as UnknownRecord
}
function denseArray(value: unknown, label: string, maximum: number): readonly unknown[] {
  if (typeof value !== "object" || value === null || !Array.isArray(value) || types.isProxy(value)) fail(`${label} must be a non-proxy array`)
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(`${label} must use the built-in Array prototype`)
  if (value.length > maximum) fail(`${label} exceeds its item bound`)
  if (Object.getOwnPropertySymbols(value).length !== 0) fail(`${label} must not contain symbol properties`)
  const descriptors = Object.getOwnPropertyDescriptors(value)
  const expected = new Set(["length", ...Array.from({ length: value.length }, (_, index) => String(index))])
  if (Reflect.ownKeys(value).length !== expected.size) fail(`${label} contains sparse or extra array properties`)
  for (let index = 0; index < value.length; index += 1) {
    const descriptor = descriptors[String(index)]
    if (!descriptor || !("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) fail(`${label}[${index}] must be an enumerable defined data property`)
  }
  return Array.from(value)
}
function assertSafeJson(value: unknown, label: string): void {
  const stack: Array<{ value: unknown, label: string, depth: number }> = [{ value, label, depth: 0 }]
  const seen = new Set<object>()
  let nodes = 0
  while (stack.length) {
    const current = stack.pop()!
    nodes += 1
    if (nodes > O4B_LIMITS.maxGraphNodes || current.depth > O4B_LIMITS.maxGraphDepth) fail(`${label} exceeds safe JSON graph bounds`)
    const item = current.value
    if (item === null || typeof item === "boolean") continue
    if (typeof item === "string") { assertUnicodeScalars(item, current.label); continue }
    if (typeof item === "number") { if (!Number.isFinite(item)) fail(`${current.label} contains a non-finite number`); continue }
    if (typeof item !== "object" || types.isProxy(item)) fail(`${current.label} must contain JSON data only`)
    if (seen.has(item)) fail(`${current.label} contains cyclic or aliased object references`)
    seen.add(item)
    const proto = Object.getPrototypeOf(item)
    if (Array.isArray(item)) {
      if (proto !== Array.prototype) fail(`${current.label} must use the built-in Array prototype`)
      const rows = denseArray(item, current.label, O4B_LIMITS.maxGraphNodes)
      rows.forEach((child, index) => stack.push({ value: child, label: `${current.label}[${index}]`, depth: current.depth + 1 }))
    } else {
      if (proto !== Object.prototype && proto !== null) fail(`${current.label} must use a plain-object prototype`)
      if (Object.getOwnPropertySymbols(item).length !== 0) fail(`${current.label} must not contain symbol properties`)
      const descriptors = Object.getOwnPropertyDescriptors(item)
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
function digest(kind: string, value: unknown): string {
  assertSafeJson(value, `digest.${kind}`)
  return createHash("sha256")
    .update(`${O4B_BOUNDED_READ_ONLY_GITHUB_CONTEXT_VERSION}:${kind}`, "utf8")
    .update("\0", "utf8")
    .update(canonicalJson(value), "utf8")
    .digest("hex")
}
function bytesSha256(bytes: Uint8Array): string { return createHash("sha256").update(bytes).digest("hex") }
function gitBlobSha1(bytes: Uint8Array): string {
  return createHash("sha1").update(`blob ${bytes.byteLength}\0`, "utf8").update(bytes).digest("hex")
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
function parseRepositoryName(fullName: string): [string, string] {
  const [owner, repo] = fullName.split("/")
  if (!owner || !repo) fail("repository full name is invalid")
  return [owner, repo]
}
function encodedRepository(fullName: string): string {
  const [owner, repo] = parseRepositoryName(fullName)
  return `${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
}
function encodedPath(path: string): string { return path.split("/").map((part) => encodeURIComponent(part)).join("/") }

function normalizeInput(raw: unknown): NormalizedInput {
  const record = ownExactRecord(raw, INPUT_KEYS, "input")
  const expectedRepositoryId = decimalId(record.expectedRepositoryId, "input.expectedRepositoryId")
  const expectedBaseRepositoryId = decimalId(record.expectedBaseRepositoryId, "input.expectedBaseRepositoryId")
  if (expectedBaseRepositoryId !== expectedRepositoryId) fail("expected base repository id must equal expected repository id")
  const supportingPaths = denseArray(record.supportingPaths, "input.supportingPaths", O4B_LIMITS.maxSupportingPaths)
    .map((value, index) => repositoryPath(value, `input.supportingPaths[${index}]`))
  if (new Set(supportingPaths).size !== supportingPaths.length) fail("input.supportingPaths contains duplicates")
  supportingPaths.sort(compareUtf8)
  return deepFreeze({
    expectedRepositoryId,
    expectedRepositoryFullName: repositoryName(record.expectedRepositoryFullName, "input.expectedRepositoryFullName"),
    pullRequestNumber: positiveInteger(record.pullRequestNumber, "input.pullRequestNumber"),
    expectedPullRequestId: decimalId(record.expectedPullRequestId, "input.expectedPullRequestId"),
    expectedBaseRepositoryId,
    expectedHeadRepositoryId: decimalId(record.expectedHeadRepositoryId, "input.expectedHeadRepositoryId"),
    expectedHeadRepositoryFullName: repositoryName(record.expectedHeadRepositoryFullName, "input.expectedHeadRepositoryFullName"),
    expectedHeadSha: gitSha(record.expectedHeadSha, "input.expectedHeadSha"),
    credentialPolicyIdentity: sha256(record.credentialPolicyIdentity, "input.credentialPolicyIdentity"),
    supportingPaths: Object.freeze(supportingPaths),
    credential: credentialValue(record.credential),
  })
}
function normalizeOptions(raw: unknown): NormalizedOptions {
  if (raw === undefined) return { fetchImpl: fetch, now: () => new Date().toISOString(), signal: undefined, timeoutMs: O4B_LIMITS.maxNetworkTimeoutMs }
  const record = ownOptionalRecord(raw, OPTION_KEYS, "options")
  const fetchImpl = record.fetchImpl === undefined ? fetch : record.fetchImpl
  const now = record.now === undefined ? (() => new Date().toISOString()) : record.now
  if (typeof fetchImpl !== "function") fail("options.fetchImpl must be a function")
  if (typeof now !== "function") fail("options.now must be a function")
  const signal = record.signal as AbortSignal | undefined
  if (signal !== undefined && (typeof signal !== "object" || signal === null || typeof signal.addEventListener !== "function" || typeof signal.removeEventListener !== "function" || typeof signal.aborted !== "boolean")) {
    fail("options.signal must be an AbortSignal")
  }
  const timeoutMs = record.timeoutMs === undefined
    ? O4B_LIMITS.maxNetworkTimeoutMs
    : positiveInteger(record.timeoutMs, "options.timeoutMs", O4B_LIMITS.maxNetworkTimeoutMs)
  return { fetchImpl: fetchImpl as typeof fetch, now: now as () => string, signal, timeoutMs }
}

async function readBoundedBody(response: Response, maximumBytes: number, controller: AbortController): Promise<Uint8Array> {
  const declared = response.headers.get("content-length")
  if (declared !== null && /^\d+$/.test(declared) && Number(declared) > maximumBytes) {
    controller.abort()
    fail("response body exceeds configured byte bound")
  }
  if (!response.body) fail("response body is missing")
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value) continue
      total += value.byteLength
      if (total > maximumBytes) {
        controller.abort()
        try { await reader.cancel() } catch { /* ignore cancellation cleanup */ }
        fail("response body exceeds configured byte bound")
      }
      chunks.push(value)
    }
  } catch {
    fail("response body read failed")
  }
  const output = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.byteLength }
  return output
}
function jsonContentType(value: string | null): boolean {
  if (!value) return false
  const media = value.split(";", 1)[0]!.trim().toLowerCase()
  return media === "application/json" || (media.startsWith("application/") && media.endsWith("+json"))
}
async function requestJson(url: URL, maximumBytes: number, input: NormalizedInput, options: NormalizedOptions, state: RequestState): Promise<unknown> {
  if (url.protocol !== "https:" || url.hostname !== "api.github.com" || url.port !== "") fail("request URL escaped the GitHub API origin")
  state.count += 1
  if (state.count > O4B_LIMITS.maxHttpRequests) fail("HTTP request budget exceeded")
  if (options.signal?.aborted) fail("request aborted")
  const controller = new AbortController()
  const onAbort = (): void => controller.abort()
  options.signal?.addEventListener("abort", onAbort, { once: true })
  const timer = setTimeout(() => controller.abort(), options.timeoutMs)
  let response: Response
  try {
    try {
      response = await options.fetchImpl(url, {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${input.credential}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "kodac-o4b-read-only-context/1",
        },
        redirect: "error",
        signal: controller.signal,
      })
    } catch {
      fail("network request failed")
    }
    if (response.status < 200 || response.status >= 300) fail(`GitHub returned non-success status ${response.status}`)
    if (!jsonContentType(response.headers.get("content-type"))) fail("GitHub response content type is not JSON")
    const bodyBytes = await readBoundedBody(response, maximumBytes, controller)
    let text: string
    try { text = new TextDecoder("utf-8", { fatal: true }).decode(bodyBytes) } catch { fail("GitHub response is not valid UTF-8 JSON") }
    assertUnicodeScalars(text, "GitHub response")
    let parsed: unknown
    try { parsed = JSON.parse(text) } catch { fail("GitHub response is malformed JSON") }
    assertSafeJson(parsed, "GitHub response JSON")
    return parsed
  } finally {
    clearTimeout(timer)
    options.signal?.removeEventListener("abort", onAbort)
  }
}

function prUrl(repositoryFullName: string, pullRequestNumber: number): URL {
  return new URL(`https://api.github.com/repos/${encodedRepository(repositoryFullName)}/pulls/${pullRequestNumber}`)
}
function filesUrl(repositoryFullName: string, pullRequestNumber: number, page: number): URL {
  const url = new URL(`https://api.github.com/repos/${encodedRepository(repositoryFullName)}/pulls/${pullRequestNumber}/files`)
  url.searchParams.set("per_page", "100")
  url.searchParams.set("page", String(page))
  return url
}
function contentUrl(repositoryFullName: string, path: string, revision: string): URL {
  const url = new URL(`https://api.github.com/repos/${encodedRepository(repositoryFullName)}/contents/${encodedPath(path)}`)
  url.searchParams.set("ref", revision)
  return url
}

function parseRepo(value: unknown, label: string): { id: string, fullName: string } {
  const record = providerRecord(value, label)
  return {
    id: providerDecimalId(record.id, `${label}.id`),
    fullName: repositoryName(record.full_name, `${label}.full_name`),
  }
}
function parsePrSnapshot(value: unknown, input: NormalizedInput, label: string): PrSnapshot {
  const record = providerRecord(value, label)
  const base = providerRecord(record.base, `${label}.base`)
  const head = providerRecord(record.head, `${label}.head`)
  const baseRepo = parseRepo(base.repo, `${label}.base.repo`)
  const headRepo = parseRepo(head.repo, `${label}.head.repo`)
  const snapshot: PrSnapshot = {
    repositoryId: baseRepo.id,
    repositoryFullName: baseRepo.fullName,
    pullRequestNumber: positiveInteger(record.number, `${label}.number`),
    pullRequestId: providerDecimalId(record.id, `${label}.id`),
    canonicalBase: gitSha(base.sha, `${label}.base.sha`),
    reviewedHead: gitSha(head.sha, `${label}.head.sha`),
    baseRepositoryId: baseRepo.id,
    baseRepositoryFullName: baseRepo.fullName,
    headRepositoryId: headRepo.id,
    headRepositoryFullName: headRepo.fullName,
    forkClassification: baseRepo.id === headRepo.id && baseRepo.fullName === headRepo.fullName ? "SAME_REPOSITORY" : "FORK_REPOSITORY",
    baseRef: boundedText(base.ref, `${label}.base.ref`, 255),
    headRef: boundedText(head.ref, `${label}.head.ref`, 255),
  }
  if (snapshot.repositoryId !== input.expectedRepositoryId || snapshot.repositoryFullName !== input.expectedRepositoryFullName) fail("repository identity mismatch")
  if (snapshot.pullRequestNumber !== input.pullRequestNumber || snapshot.pullRequestId !== input.expectedPullRequestId) fail("pull request identity mismatch")
  if (snapshot.baseRepositoryId !== input.expectedBaseRepositoryId) fail("base repository identity mismatch")
  if (snapshot.headRepositoryId !== input.expectedHeadRepositoryId || snapshot.headRepositoryFullName !== input.expectedHeadRepositoryFullName) fail("head repository identity mismatch")
  if (snapshot.reviewedHead !== input.expectedHeadSha) fail("expected head mismatch")
  return deepFreeze(snapshot)
}
function prSnapshotCore(snapshot: PrSnapshot): unknown {
  return {
    repositoryId: snapshot.repositoryId,
    repositoryFullName: snapshot.repositoryFullName,
    pullRequestNumber: snapshot.pullRequestNumber,
    pullRequestId: snapshot.pullRequestId,
    canonicalBase: snapshot.canonicalBase,
    reviewedHead: snapshot.reviewedHead,
    baseRepositoryId: snapshot.baseRepositoryId,
    baseRepositoryFullName: snapshot.baseRepositoryFullName,
    headRepositoryId: snapshot.headRepositoryId,
    headRepositoryFullName: snapshot.headRepositoryFullName,
    forkClassification: snapshot.forkClassification,
    baseRef: snapshot.baseRef,
    headRef: snapshot.headRef,
  }
}
function sameSnapshot(left: PrSnapshot, right: PrSnapshot): boolean { return canonicalJson(prSnapshotCore(left)) === canonicalJson(prSnapshotCore(right)) }
function snapshotResponseIdentity(snapshot: PrSnapshot): string { return digest("pr-snapshot-response-identity", prSnapshotCore(snapshot)) }
function refIdentity(kind: "base" | "head", snapshot: PrSnapshot): string {
  const repoId = kind === "base" ? snapshot.baseRepositoryId : snapshot.headRepositoryId
  const repoName = kind === "base" ? snapshot.baseRepositoryFullName : snapshot.headRepositoryFullName
  const ref = kind === "base" ? snapshot.baseRef : snapshot.headRef
  const revision = kind === "base" ? snapshot.canonicalBase : snapshot.reviewedHead
  return digest(`${kind}-ref-identity`, { repositoryId: repoId, repositoryFullName: repoName, ref, revision })
}
function o4aSnapshot(snapshot: PrSnapshot, observedAt: string): O4aRepositorySnapshotInput {
  return createO4aRepositorySnapshotInput({
    repositoryId: snapshot.repositoryId,
    repositoryFullName: snapshot.repositoryFullName,
    pullRequestNumber: snapshot.pullRequestNumber,
    pullRequestId: snapshot.pullRequestId,
    canonicalBase: snapshot.canonicalBase,
    reviewedHead: snapshot.reviewedHead,
    baseRepositoryId: snapshot.baseRepositoryId,
    headRepositoryId: snapshot.headRepositoryId,
    headRepositoryFullName: snapshot.headRepositoryFullName,
    forkClassification: snapshot.forkClassification,
    baseRefIdentity: refIdentity("base", snapshot),
    headRefIdentity: refIdentity("head", snapshot),
    snapshotObservedAt: observedAt,
  })
}

function nullableGitSha(value: unknown, label: string): string | null {
  return value === undefined || value === null ? null : gitSha(value, label)
}
function changedMetadataFromProvider(value: unknown, label: string): O4bChangedFileMetadataRecord {
  const record = providerRecord(value, label)
  const path = repositoryPath(record.filename, `${label}.filename`)
  const statusText = boundedText(record.status, `${label}.status`, 16)
  if (!CHANGED_STATUSES.has(statusText)) fail(`${label}.status is unsupported`)
  const status = statusText as O4bChangedFileStatus
  let previousPath: string | null = null
  if (status === "renamed") {
    previousPath = repositoryPath(record.previous_filename, `${label}.previous_filename`)
    if (previousPath === path) fail(`${label}.previous_filename must differ from filename`)
  }
  const core = {
    path,
    status,
    previousPath,
    providerBlobSha: nullableGitSha(record.sha, `${label}.sha`),
  }
  return deepFreeze({ ...core, metadataIdentity: digest("changed-file-metadata-identity", core) })
}
async function fetchChangedFiles(snapshot: PrSnapshot, input: NormalizedInput, options: NormalizedOptions, state: RequestState): Promise<{
  metadata: readonly O4bChangedFileMetadataRecord[], pageGroups: readonly (readonly string[])[], pageIdentities: readonly string[]
}> {
  const metadata: O4bChangedFileMetadataRecord[] = []
  const pageGroups: string[][] = []
  const pageIdentities: string[] = []
  const seenPaths = new Set<string>()
  for (let page = 1; page <= 6; page += 1) {
    const json = await requestJson(filesUrl(snapshot.repositoryFullName, snapshot.pullRequestNumber, page), O4B_LIMITS.maxFilesPageResponseBytes, input, options, state)
    const rows = denseArray(json, `files page ${page}`, 100)
    const pageRecords = rows.map((row, index) => changedMetadataFromProvider(row, `files page ${page}[${index}]`))
    for (const row of pageRecords) {
      if (seenPaths.has(row.path)) fail("changed files contain duplicate normalized paths")
      seenPaths.add(row.path)
      metadata.push(row)
      if (metadata.length > O4B_LIMITS.maxChangedPaths) fail("changed path count exceeds 512")
    }
    const group = pageRecords.map((row) => row.metadataIdentity)
    pageGroups.push(group)
    pageIdentities.push(digest("files-page-response-identity", { page, recordIdentities: group }))
    if (rows.length < 100) break
    if (page === 6) fail("changed file pagination exceeds the admitted bound")
  }
  metadata.sort((a, b) => compareUtf8(a.path, b.path))
  return deepFreeze({ metadata, pageGroups, pageIdentities })
}

function strictBase64(value: string, label: string): Uint8Array {
  const compact = value.replace(/\n/g, "")
  if (compact.includes("\r") || /[^A-Za-z0-9+/=]/.test(compact) || compact.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(compact)) {
    fail(`${label} is not canonical base64 content`)
  }
  return new Uint8Array(Buffer.from(compact, "base64"))
}
function contentCoreWithoutIdentity(value: Omit<O4bCanonicalContentRecord, "contentRecordIdentity">): unknown { return value }
function truncatedContentIdentity(core: {
  path: string, contentRepositoryId: string, contentRepositoryFullName: string, contentRevisionSha: string,
  contentRevisionKind: O4bContentRevisionKind, providerBlobSha: string | null, providerDeclaredSize: number,
  truncationReason: O4bTruncationReason, materializedPrefixIdentity: string | null,
}): string { return digest("truncated-content-identity", core) }

async function fetchContent(
  path: string,
  readRole: "CHANGED_PATH" | "SUPPORTING_CONTEXT",
  changed: O4bChangedFileMetadataRecord | null,
  snapshot: PrSnapshot,
  snapshotInput: O4aRepositorySnapshotInput,
  input: NormalizedInput,
  options: NormalizedOptions,
  state: RequestState,
): Promise<ContentRead> {
  const removed = changed?.status === "removed"
  const contentRepositoryId = removed ? snapshot.baseRepositoryId : snapshot.headRepositoryId
  const contentRepositoryFullName = removed ? snapshot.baseRepositoryFullName : snapshot.headRepositoryFullName
  const contentRevisionSha = removed ? snapshot.canonicalBase : snapshot.reviewedHead
  const contentRevisionKind: O4bContentRevisionKind = removed ? "BASE_REMOVED" : "HEAD"
  const json = await requestJson(contentUrl(contentRepositoryFullName, path, contentRevisionSha), O4B_LIMITS.maxContentResponseBytes, input, options, state)
  const record = providerRecord(json, `content ${path}`)
  const responsePath = repositoryPath(record.path, `content ${path}.path`)
  if (responsePath !== path) fail("content response path mismatch")
  const providerBlobSha = nullableGitSha(record.sha, `content ${path}.sha`)
  if (changed?.providerBlobSha && providerBlobSha && changed.providerBlobSha !== providerBlobSha) fail("content provider blob identity disagrees with PR file metadata")
  const providerDeclaredSize = positiveInteger(record.size, `content ${path}.size`, Number.MAX_SAFE_INTEGER, true)
  const type = boundedText(record.type, `content ${path}.type`, 32)
  const encoding = record.encoding === undefined || record.encoding === null ? null : boundedText(record.encoding, `content ${path}.encoding`, 32, true)

  let truncationState: "FULL" | "TRUNCATED" = "TRUNCATED"
  let truncationReason: O4bTruncationReason | null = null
  let materializedByteLength = 0
  let contentText: string | null = null
  let contentIdentity: string
  let rawBytes: Uint8Array | null = null

  if (type !== "file") {
    truncationReason = "UNSUPPORTED_TYPE"
  } else if (encoding !== "base64") {
    truncationReason = providerDeclaredSize > O4B_LIMITS.maxFullFileBytes ? "OVERSIZED" : "UNSUPPORTED_ENCODING"
  } else if (typeof record.content !== "string") {
    truncationReason = providerDeclaredSize > O4B_LIMITS.maxFullFileBytes ? "OVERSIZED" : "MISSING_CONTENT"
  } else {
    rawBytes = strictBase64(record.content, `content ${path}.content`)
    if (rawBytes.byteLength !== providerDeclaredSize) fail("content declared-size mismatch")
    if (!providerBlobSha || gitBlobSha1(rawBytes) !== providerBlobSha) fail("content Git blob SHA mismatch")
    if (rawBytes.byteLength > O4B_LIMITS.maxFullFileBytes) {
      truncationReason = "OVERSIZED"
    } else {
      try {
        contentText = new TextDecoder("utf-8", { fatal: true }).decode(rawBytes)
        assertUnicodeScalars(contentText, `content ${path}`)
        truncationState = "FULL"
        materializedByteLength = rawBytes.byteLength
      } catch {
        contentText = null
        truncationReason = "BINARY_OR_NON_UTF8"
      }
    }
  }

  if (truncationState === "FULL") {
    if (!rawBytes || contentText === null || truncationReason !== null) fail("internal full-content state is inconsistent")
    contentIdentity = bytesSha256(rawBytes)
  } else {
    if (!truncationReason) fail("truncated content requires a reason")
    if (!providerBlobSha && type === "file") fail("truncated file content lacks a provider blob identity")
    contentIdentity = truncatedContentIdentity({
      path, contentRepositoryId, contentRepositoryFullName, contentRevisionSha, contentRevisionKind,
      providerBlobSha, providerDeclaredSize, truncationReason,
      materializedPrefixIdentity: rawBytes ? bytesSha256(rawBytes) : null,
    })
  }

  const evidence = createO4aReadEvidenceInput(snapshot.repositoryId, snapshot.pullRequestNumber, {
    path,
    readRole,
    contentIdentity,
    byteLength: materializedByteLength,
    sourceKind: O4A_READ_SOURCE_KIND,
    truncationState,
    snapshotEvidenceIdentity: snapshotInput.snapshotEvidenceIdentity,
    reviewedHead: snapshot.reviewedHead,
  })
  const core: Omit<O4bCanonicalContentRecord, "contentRecordIdentity"> = {
    path,
    readRole,
    changedFileStatus: changed?.status ?? null,
    previousPath: changed?.previousPath ?? null,
    contentRepositoryId,
    contentRepositoryFullName,
    contentRevisionSha,
    contentRevisionKind,
    providerBlobSha,
    providerDeclaredSize,
    materializedByteLength,
    contentIdentity,
    truncationState,
    truncationReason,
    readEvidenceIdentity: evidence.readEvidenceIdentity,
  }
  const contentRecordIdentity = digest("content-record-identity", contentCoreWithoutIdentity(core))
  return deepFreeze({ item: { ...core, contentRecordIdentity, contentText }, evidence })
}

function metadataCore(record: O4bChangedFileMetadataRecord): unknown {
  return { path: record.path, status: record.status, previousPath: record.previousPath, providerBlobSha: record.providerBlobSha }
}
function evidenceWithoutIdentity(evidence: Omit<O4bReadContextEvidence, "readContextEvidenceIdentity">): unknown { return evidence }
function buildEvidence(
  snapshot: PrSnapshot,
  snapshotInput: O4aRepositorySnapshotInput,
  input: NormalizedInput,
  changed: readonly O4bChangedFileMetadataRecord[],
  pageGroups: readonly (readonly string[])[],
  pageIdentities: readonly string[],
  contentItems: readonly O4bTransientContentItem[],
  initialSnapshotResponseIdentity: string,
  terminalSnapshotResponseIdentity: string,
  requestCount: number,
  snapshotObservedAt: string,
  terminalObservedAt: string,
): O4bReadContextEvidence {
  const changedPaths = changed.map((row) => row.path)
  const changedMetadataIdentities = changed.map((row) => row.metadataIdentity).sort(compareStrings)
  const contentRecords: O4bCanonicalContentRecord[] = contentItems.map(({ contentText: _contentText, ...record }) => record)
  contentRecords.sort((a, b) => compareUtf8(a.path, b.path) || compareStrings(a.readRole, b.readRole))
  const readEvidenceIdentities = contentRecords.map((row) => row.readEvidenceIdentity).sort(compareStrings)
  const contentRecordIdentities = contentRecords.map((row) => row.contentRecordIdentity).sort(compareStrings)
  const fullReadCount = contentRecords.filter((row) => row.truncationState === "FULL").length
  const truncatedReadCount = contentRecords.length - fullReadCount
  const supportingPathCount = contentRecords.filter((row) => row.readRole === "SUPPORTING_CONTEXT").length
  const changedRecords = contentRecords.filter((row) => row.readRole === "CHANGED_PATH")
  const completeChanged = changedRecords.length === changedPaths.length
    && changedRecords.every((row) => row.truncationState === "FULL")
    && sameStrings(changedRecords.map((row) => row.path).sort(compareUtf8), changedPaths)
  const continuationDecision: O4bContinuationDecision = completeChanged ? "READY_FOR_O4A_REVIEW" : "BLOCK_INCOMPLETE_CHANGED_PATH_CONTEXT"
  const base: Omit<O4bReadContextEvidence, "readContextEvidenceIdentity"> = {
    version: O4B_BOUNDED_READ_ONLY_GITHUB_CONTEXT_VERSION,
    repositoryId: snapshot.repositoryId,
    repositoryFullName: snapshot.repositoryFullName,
    pullRequestNumber: snapshot.pullRequestNumber,
    pullRequestId: snapshot.pullRequestId,
    canonicalBase: snapshot.canonicalBase,
    reviewedHead: snapshot.reviewedHead,
    baseRepositoryId: snapshot.baseRepositoryId,
    headRepositoryId: snapshot.headRepositoryId,
    headRepositoryFullName: snapshot.headRepositoryFullName,
    forkClassification: snapshot.forkClassification,
    baseRef: snapshot.baseRef,
    headRef: snapshot.headRef,
    credentialPolicyIdentity: input.credentialPolicyIdentity,
    snapshotEvidenceIdentity: snapshotInput.snapshotEvidenceIdentity,
    changedPaths: Object.freeze([...changedPaths]),
    changedPathSetIdentity: digest("changed-path-set-identity", { repositoryId: snapshot.repositoryId, pullRequestNumber: snapshot.pullRequestNumber, reviewedHead: snapshot.reviewedHead, changedPaths }),
    changedPathCount: changedPaths.length,
    changedFileMetadataRecords: Object.freeze([...changed]),
    changedFileMetadataSetIdentity: digest("changed-file-metadata-set-identity", { metadataIdentities: changedMetadataIdentities }),
    readEvidenceIdentities: Object.freeze(readEvidenceIdentities),
    readEvidenceSetIdentity: digest("read-evidence-set-identity", { snapshotEvidenceIdentity: snapshotInput.snapshotEvidenceIdentity, readEvidenceIdentities }),
    readEvidenceCount: contentRecords.length,
    fullReadCount,
    truncatedReadCount,
    supportingPathCount,
    contentRecords: Object.freeze(contentRecords),
    contentRecordIdentities: Object.freeze(contentRecordIdentities),
    initialSnapshotResponseIdentity,
    terminalSnapshotResponseIdentity,
    filesPageRecordIdentityGroups: Object.freeze(pageGroups.map((group) => Object.freeze([...group]))),
    filesPageResponseIdentities: Object.freeze([...pageIdentities]),
    requestCount,
    snapshotObservedAt,
    terminalObservedAt,
    continuationDecision,
  }
  return deepFreeze({ ...base, readContextEvidenceIdentity: digest("read-context-evidence-identity", evidenceWithoutIdentity(base)) })
}

export async function acquireO4bBoundedReadOnlyGithubContext(
  rawInput: O4bBoundedReadOnlyGithubContextInput,
  rawOptions?: O4bBoundedReadOnlyGithubContextOptions,
): Promise<O4bBoundedReadOnlyGithubContextResult> {
  const input = normalizeInput(rawInput)
  const options = normalizeOptions(rawOptions)
  const state: RequestState = { count: 0 }
  const initialJson = await requestJson(prUrl(input.expectedRepositoryFullName, input.pullRequestNumber), O4B_LIMITS.maxPrResponseBytes, input, options, state)
  const initial = parsePrSnapshot(initialJson, input, "initial PR snapshot")
  const snapshotObservedAt = canonicalTimestamp(options.now(), "snapshotObservedAt")
  const snapshotInput = o4aSnapshot(initial, snapshotObservedAt)
  const initialSnapshotResponseIdentity = snapshotResponseIdentity(initial)

  const files = await fetchChangedFiles(initial, input, options, state)
  const changedByPath = new Map(files.metadata.map((row) => [row.path, row]))
  const supportingPaths = input.supportingPaths.filter((path) => !changedByPath.has(path))
  if (files.metadata.length + supportingPaths.length > O4B_LIMITS.maxReadItems) fail("read item count exceeds the admitted bound")

  const reads: ContentRead[] = []
  let materializedTotal = 0
  for (const row of files.metadata) {
    const read = await fetchContent(row.path, "CHANGED_PATH", row, initial, snapshotInput, input, options, state)
    if (read.item.truncationState === "FULL") {
      if (materializedTotal + read.item.materializedByteLength > O4B_LIMITS.maxTotalMaterializedContentBytes) fail("aggregate materialized content byte budget exceeded")
      materializedTotal += read.item.materializedByteLength
    }
    reads.push(read)
  }
  for (const path of supportingPaths) {
    const read = await fetchContent(path, "SUPPORTING_CONTEXT", null, initial, snapshotInput, input, options, state)
    if (read.item.truncationState === "FULL") {
      if (materializedTotal + read.item.materializedByteLength > O4B_LIMITS.maxTotalMaterializedContentBytes) fail("aggregate materialized content byte budget exceeded")
      materializedTotal += read.item.materializedByteLength
    }
    reads.push(read)
  }

  const terminalJson = await requestJson(prUrl(input.expectedRepositoryFullName, input.pullRequestNumber), O4B_LIMITS.maxPrResponseBytes, input, options, state)
  const terminal = parsePrSnapshot(terminalJson, input, "terminal PR snapshot")
  if (!sameSnapshot(initial, terminal)) fail("PR snapshot moved during context acquisition")
  const terminalObservedAt = canonicalTimestamp(options.now(), "terminalObservedAt")
  if (Date.parse(terminalObservedAt) < Date.parse(snapshotObservedAt)) fail("terminal observation precedes initial observation")
  const terminalSnapshotResponseIdentity = snapshotResponseIdentity(terminal)

  const contentItems = reads.map((read) => read.item).sort((a, b) => compareUtf8(a.path, b.path) || compareStrings(a.readRole, b.readRole))
  const readEvidence = reads.map((read) => read.evidence).sort((a, b) => compareUtf8(a.path, b.path))
  const evidence = buildEvidence(
    terminal, snapshotInput, input, files.metadata, files.pageGroups, files.pageIdentities, contentItems,
    initialSnapshotResponseIdentity, terminalSnapshotResponseIdentity, state.count, snapshotObservedAt, terminalObservedAt,
  )
  validateO4bReadContextEvidence(evidence)
  return deepFreeze({
    snapshot: snapshotInput,
    changedPaths: Object.freeze(files.metadata.map((row) => row.path)),
    readEvidence: Object.freeze(readEvidence),
    contentItems: Object.freeze(contentItems),
    readContextEvidence: evidence,
  })
}

function normalizeMetadataRecord(raw: unknown, index: number): O4bChangedFileMetadataRecord {
  const record = ownExactRecord(raw, METADATA_KEYS, `evidence.changedFileMetadataRecords[${index}]`)
  const statusText = boundedText(record.status, `metadata[${index}].status`, 16)
  if (!CHANGED_STATUSES.has(statusText)) fail(`metadata[${index}].status is unsupported`)
  const status = statusText as O4bChangedFileStatus
  const path = repositoryPath(record.path, `metadata[${index}].path`)
  const previousPath = record.previousPath === null ? null : repositoryPath(record.previousPath, `metadata[${index}].previousPath`)
  if (status === "renamed" && (!previousPath || previousPath === path)) fail("renamed metadata requires a distinct previous path")
  if (status !== "renamed" && previousPath !== null) fail("non-renamed metadata must not carry previous-path authority")
  const core = { path, status, previousPath, providerBlobSha: record.providerBlobSha === null ? null : gitSha(record.providerBlobSha, `metadata[${index}].providerBlobSha`) }
  const expected = digest("changed-file-metadata-identity", core)
  if (sha256(record.metadataIdentity, `metadata[${index}].metadataIdentity`) !== expected) fail("changed-file metadata identity mismatch")
  return deepFreeze({ ...core, metadataIdentity: expected })
}
function normalizeContentRecord(raw: unknown, index: number): O4bCanonicalContentRecord {
  const record = ownExactRecord(raw, CONTENT_RECORD_KEYS, `evidence.contentRecords[${index}]`)
  const readRole = boundedText(record.readRole, `contentRecords[${index}].readRole`, 32)
  if (readRole !== "CHANGED_PATH" && readRole !== "SUPPORTING_CONTEXT") fail("content record readRole is unsupported")
  const changedStatusRaw = record.changedFileStatus
  let changedFileStatus: O4bChangedFileStatus | null = null
  if (changedStatusRaw !== null) {
    const text = boundedText(changedStatusRaw, `contentRecords[${index}].changedFileStatus`, 16)
    if (!CHANGED_STATUSES.has(text)) fail("content record changedFileStatus is unsupported")
    changedFileStatus = text as O4bChangedFileStatus
  }
  if ((readRole === "CHANGED_PATH") !== (changedFileStatus !== null)) fail("content record changed-file status/read-role mismatch")
  const truncationState = boundedText(record.truncationState, `contentRecords[${index}].truncationState`, 16)
  if (truncationState !== "FULL" && truncationState !== "TRUNCATED") fail("content record truncationState is unsupported")
  let truncationReason: O4bTruncationReason | null = null
  if (record.truncationReason !== null) {
    const text = boundedText(record.truncationReason, `contentRecords[${index}].truncationReason`, 32)
    if (!TRUNCATION_REASONS.has(text)) fail("content record truncationReason is unsupported")
    truncationReason = text as O4bTruncationReason
  }
  if ((truncationState === "FULL") !== (truncationReason === null)) fail("content record truncation reason/state mismatch")
  const revisionKind = boundedText(record.contentRevisionKind, `contentRecords[${index}].contentRevisionKind`, 16)
  if (revisionKind !== "HEAD" && revisionKind !== "BASE_REMOVED") fail("content record revision kind is unsupported")
  const core: Omit<O4bCanonicalContentRecord, "contentRecordIdentity"> = {
    path: repositoryPath(record.path, `contentRecords[${index}].path`),
    readRole,
    changedFileStatus,
    previousPath: record.previousPath === null ? null : repositoryPath(record.previousPath, `contentRecords[${index}].previousPath`),
    contentRepositoryId: decimalId(record.contentRepositoryId, `contentRecords[${index}].contentRepositoryId`),
    contentRepositoryFullName: repositoryName(record.contentRepositoryFullName, `contentRecords[${index}].contentRepositoryFullName`),
    contentRevisionSha: gitSha(record.contentRevisionSha, `contentRecords[${index}].contentRevisionSha`),
    contentRevisionKind: revisionKind,
    providerBlobSha: record.providerBlobSha === null ? null : gitSha(record.providerBlobSha, `contentRecords[${index}].providerBlobSha`),
    providerDeclaredSize: positiveInteger(record.providerDeclaredSize, `contentRecords[${index}].providerDeclaredSize`, Number.MAX_SAFE_INTEGER, true),
    materializedByteLength: positiveInteger(record.materializedByteLength, `contentRecords[${index}].materializedByteLength`, O4B_LIMITS.maxFullFileBytes, true),
    contentIdentity: sha256(record.contentIdentity, `contentRecords[${index}].contentIdentity`),
    truncationState,
    truncationReason,
    readEvidenceIdentity: sha256(record.readEvidenceIdentity, `contentRecords[${index}].readEvidenceIdentity`),
  }
  if (core.truncationState === "TRUNCATED" && core.materializedByteLength !== 0) fail("truncated content must not claim reviewable materialized bytes")
  if (core.truncationState === "FULL" && (core.providerBlobSha === null || core.materializedByteLength !== core.providerDeclaredSize)) fail("full content size/blob evidence mismatch")
  const expected = digest("content-record-identity", contentCoreWithoutIdentity(core))
  if (sha256(record.contentRecordIdentity, `contentRecords[${index}].contentRecordIdentity`) !== expected) fail("content record identity mismatch")
  return deepFreeze({ ...core, contentRecordIdentity: expected })
}

export function validateO4bReadContextEvidence(raw: unknown): O4bReadContextEvidence {
  const record = ownExactRecord(raw, O4B_READ_CONTEXT_EVIDENCE_KEYS, "evidence")
  if (record.version !== O4B_BOUNDED_READ_ONLY_GITHUB_CONTEXT_VERSION) fail("evidence version mismatch")
  const repositoryId = decimalId(record.repositoryId, "evidence.repositoryId")
  const repositoryFullName = repositoryName(record.repositoryFullName, "evidence.repositoryFullName")
  const pullRequestNumber = positiveInteger(record.pullRequestNumber, "evidence.pullRequestNumber")
  const pullRequestId = decimalId(record.pullRequestId, "evidence.pullRequestId")
  const canonicalBase = gitSha(record.canonicalBase, "evidence.canonicalBase")
  const reviewedHead = gitSha(record.reviewedHead, "evidence.reviewedHead")
  const baseRepositoryId = decimalId(record.baseRepositoryId, "evidence.baseRepositoryId")
  const headRepositoryId = decimalId(record.headRepositoryId, "evidence.headRepositoryId")
  const headRepositoryFullName = repositoryName(record.headRepositoryFullName, "evidence.headRepositoryFullName")
  const forkClassification = record.forkClassification
  if (forkClassification !== "SAME_REPOSITORY" && forkClassification !== "FORK_REPOSITORY") fail("evidence fork classification is unsupported")
  if ((baseRepositoryId === headRepositoryId && repositoryFullName === headRepositoryFullName) !== (forkClassification === "SAME_REPOSITORY")) fail("evidence fork classification mismatch")
  const baseRef = boundedText(record.baseRef, "evidence.baseRef", 255)
  const headRef = boundedText(record.headRef, "evidence.headRef", 255)
  const credentialPolicyIdentity = sha256(record.credentialPolicyIdentity, "evidence.credentialPolicyIdentity")
  const snapshotObservedAt = canonicalTimestamp(record.snapshotObservedAt, "evidence.snapshotObservedAt")
  const terminalObservedAt = canonicalTimestamp(record.terminalObservedAt, "evidence.terminalObservedAt")
  if (Date.parse(terminalObservedAt) < Date.parse(snapshotObservedAt)) fail("terminal observation precedes initial observation")
  const snapshotLike: PrSnapshot = {
    repositoryId, repositoryFullName, pullRequestNumber, pullRequestId, canonicalBase, reviewedHead,
    baseRepositoryId, baseRepositoryFullName: repositoryFullName, headRepositoryId, headRepositoryFullName,
    forkClassification, baseRef, headRef,
  }
  const snapshot = o4aSnapshot(snapshotLike, snapshotObservedAt)
  if (sha256(record.snapshotEvidenceIdentity, "evidence.snapshotEvidenceIdentity") !== snapshot.snapshotEvidenceIdentity) fail("snapshot evidence identity mismatch")

  const changedPaths = denseArray(record.changedPaths, "evidence.changedPaths", O4B_LIMITS.maxChangedPaths)
    .map((value, index) => repositoryPath(value, `evidence.changedPaths[${index}]`))
  const sortedChanged = [...changedPaths].sort(compareUtf8)
  if (!sameStrings(changedPaths, sortedChanged) || new Set(changedPaths).size !== changedPaths.length) fail("evidence.changedPaths must be unique canonical UTF-8 order")
  if (positiveInteger(record.changedPathCount, "evidence.changedPathCount", O4B_LIMITS.maxChangedPaths, true) !== changedPaths.length) fail("changed path count mismatch")
  const expectedChangedSet = digest("changed-path-set-identity", { repositoryId, pullRequestNumber, reviewedHead, changedPaths })
  if (sha256(record.changedPathSetIdentity, "evidence.changedPathSetIdentity") !== expectedChangedSet) fail("changed path set identity mismatch")

  const metadata = denseArray(record.changedFileMetadataRecords, "evidence.changedFileMetadataRecords", O4B_LIMITS.maxChangedPaths).map(normalizeMetadataRecord)
  const orderedMetadata = [...metadata].sort((a, b) => compareUtf8(a.path, b.path))
  if (!sameStrings(metadata.map((row) => row.path), orderedMetadata.map((row) => row.path)) || !sameStrings(metadata.map((row) => row.path), changedPaths)) fail("changed metadata/path universe mismatch")
  const metadataIdentities = metadata.map((row) => row.metadataIdentity).sort(compareStrings)
  const expectedMetadataSet = digest("changed-file-metadata-set-identity", { metadataIdentities })
  if (sha256(record.changedFileMetadataSetIdentity, "evidence.changedFileMetadataSetIdentity") !== expectedMetadataSet) fail("changed metadata set identity mismatch")

  const contentRecords = denseArray(record.contentRecords, "evidence.contentRecords", O4B_LIMITS.maxReadItems).map(normalizeContentRecord)
  const orderedContent = [...contentRecords].sort((a, b) => compareUtf8(a.path, b.path) || compareStrings(a.readRole, b.readRole))
  if (!sameStrings(contentRecords.map((row) => `${row.path}\0${row.readRole}`), orderedContent.map((row) => `${row.path}\0${row.readRole}`))) fail("content records are not canonical order")
  if (new Set(contentRecords.map((row) => row.path)).size !== contentRecords.length) fail("content records contain duplicate paths")
  const metadataByPath = new Map(metadata.map((row) => [row.path, row]))
  for (const row of contentRecords) {
    const meta = metadataByPath.get(row.path)
    if (row.readRole === "CHANGED_PATH") {
      if (!meta || row.changedFileStatus !== meta.status || row.previousPath !== meta.previousPath) fail("changed content metadata mismatch")
      if (meta.providerBlobSha !== null && row.providerBlobSha !== null && meta.providerBlobSha !== row.providerBlobSha) fail("changed content provider blob mismatch")
      const removed = meta.status === "removed"
      if (row.contentRevisionKind !== (removed ? "BASE_REMOVED" : "HEAD")) fail("changed content revision kind mismatch")
      if (row.contentRepositoryId !== (removed ? baseRepositoryId : headRepositoryId)) fail("changed content repository id mismatch")
      if (row.contentRepositoryFullName !== (removed ? repositoryFullName : headRepositoryFullName)) fail("changed content repository name mismatch")
      if (row.contentRevisionSha !== (removed ? canonicalBase : reviewedHead)) fail("changed content revision SHA mismatch")
    } else {
      if (meta || row.changedFileStatus !== null || row.previousPath !== null || row.contentRevisionKind !== "HEAD" || row.contentRepositoryId !== headRepositoryId || row.contentRepositoryFullName !== headRepositoryFullName || row.contentRevisionSha !== reviewedHead) {
        fail("supporting content authority mismatch")
      }
    }
    const reread = createO4aReadEvidenceInput(repositoryId, pullRequestNumber, {
      path: row.path,
      readRole: row.readRole,
      contentIdentity: row.contentIdentity,
      byteLength: row.materializedByteLength,
      sourceKind: O4A_READ_SOURCE_KIND,
      truncationState: row.truncationState,
      snapshotEvidenceIdentity: snapshot.snapshotEvidenceIdentity,
      reviewedHead,
    })
    if (reread.readEvidenceIdentity !== row.readEvidenceIdentity) fail("O4-A read evidence identity mismatch")
  }
  const changedContentPaths = contentRecords.filter((row) => row.readRole === "CHANGED_PATH").map((row) => row.path).sort(compareUtf8)
  if (!sameStrings(changedContentPaths, changedPaths)) fail("changed content coverage is incomplete")

  const readEvidenceIdentities = denseArray(record.readEvidenceIdentities, "evidence.readEvidenceIdentities", O4B_LIMITS.maxReadItems).map((value, index) => sha256(value, `evidence.readEvidenceIdentities[${index}]`))
  const expectedReadIds = contentRecords.map((row) => row.readEvidenceIdentity).sort(compareStrings)
  if (!sameStrings(readEvidenceIdentities, expectedReadIds)) fail("read evidence identity set mismatch")
  const expectedReadSet = digest("read-evidence-set-identity", { snapshotEvidenceIdentity: snapshot.snapshotEvidenceIdentity, readEvidenceIdentities })
  if (sha256(record.readEvidenceSetIdentity, "evidence.readEvidenceSetIdentity") !== expectedReadSet) fail("read evidence set identity mismatch")
  const readEvidenceCount = positiveInteger(record.readEvidenceCount, "evidence.readEvidenceCount", O4B_LIMITS.maxReadItems, true)
  if (readEvidenceCount !== contentRecords.length) fail("read evidence count mismatch")
  const fullReadCount = positiveInteger(record.fullReadCount, "evidence.fullReadCount", O4B_LIMITS.maxReadItems, true)
  const truncatedReadCount = positiveInteger(record.truncatedReadCount, "evidence.truncatedReadCount", O4B_LIMITS.maxReadItems, true)
  if (fullReadCount !== contentRecords.filter((row) => row.truncationState === "FULL").length || truncatedReadCount !== contentRecords.filter((row) => row.truncationState === "TRUNCATED").length || fullReadCount + truncatedReadCount !== readEvidenceCount) fail("read completeness counts mismatch")
  const supportingPathCount = positiveInteger(record.supportingPathCount, "evidence.supportingPathCount", O4B_LIMITS.maxSupportingPaths, true)
  if (supportingPathCount !== contentRecords.filter((row) => row.readRole === "SUPPORTING_CONTEXT").length) fail("supporting path count mismatch")

  const contentRecordIdentities = denseArray(record.contentRecordIdentities, "evidence.contentRecordIdentities", O4B_LIMITS.maxReadItems).map((value, index) => sha256(value, `evidence.contentRecordIdentities[${index}]`))
  const expectedContentIds = contentRecords.map((row) => row.contentRecordIdentity).sort(compareStrings)
  if (!sameStrings(contentRecordIdentities, expectedContentIds)) fail("content record identity set mismatch")

  const pageGroups = denseArray(record.filesPageRecordIdentityGroups, "evidence.filesPageRecordIdentityGroups", 6).map((group, pageIndex) =>
    denseArray(group, `evidence.filesPageRecordIdentityGroups[${pageIndex}]`, 100).map((value, itemIndex) => sha256(value, `page group ${pageIndex}[${itemIndex}]`)))
  const flattened = pageGroups.flat().sort(compareStrings)
  if (!sameStrings(flattened, metadataIdentities)) fail("files page metadata accounting mismatch")
  const expectedPageIdentities = pageGroups.map((group, index) => digest("files-page-response-identity", { page: index + 1, recordIdentities: group }))
  const pageIdentities = denseArray(record.filesPageResponseIdentities, "evidence.filesPageResponseIdentities", 6).map((value, index) => sha256(value, `evidence.filesPageResponseIdentities[${index}]`))
  if (!sameStrings(pageIdentities, expectedPageIdentities)) fail("files page response identity mismatch")

  const expectedSnapshotResponse = snapshotResponseIdentity(snapshotLike)
  if (sha256(record.initialSnapshotResponseIdentity, "evidence.initialSnapshotResponseIdentity") !== expectedSnapshotResponse || sha256(record.terminalSnapshotResponseIdentity, "evidence.terminalSnapshotResponseIdentity") !== expectedSnapshotResponse) fail("PR snapshot response identity mismatch")
  const requestCount = positiveInteger(record.requestCount, "evidence.requestCount", O4B_LIMITS.maxHttpRequests)
  if (requestCount !== 2 + pageGroups.length + contentRecords.length) fail("request count mismatch")

  const changedRows = contentRecords.filter((row) => row.readRole === "CHANGED_PATH")
  const expectedContinuation: O4bContinuationDecision = changedRows.length === changedPaths.length && changedRows.every((row) => row.truncationState === "FULL")
    ? "READY_FOR_O4A_REVIEW" : "BLOCK_INCOMPLETE_CHANGED_PATH_CONTEXT"
  const continuation = boundedText(record.continuationDecision, "evidence.continuationDecision", 64)
  if (!CONTINUATION_DECISIONS.has(continuation) || continuation !== expectedContinuation) fail("continuation decision mismatch")

  const normalized: Omit<O4bReadContextEvidence, "readContextEvidenceIdentity"> = {
    version: O4B_BOUNDED_READ_ONLY_GITHUB_CONTEXT_VERSION,
    repositoryId, repositoryFullName, pullRequestNumber, pullRequestId, canonicalBase, reviewedHead, baseRepositoryId,
    headRepositoryId, headRepositoryFullName, forkClassification, baseRef, headRef, credentialPolicyIdentity,
    snapshotEvidenceIdentity: snapshot.snapshotEvidenceIdentity,
    changedPaths: Object.freeze(changedPaths), changedPathSetIdentity: expectedChangedSet, changedPathCount: changedPaths.length,
    changedFileMetadataRecords: Object.freeze(metadata), changedFileMetadataSetIdentity: expectedMetadataSet,
    readEvidenceIdentities: Object.freeze(readEvidenceIdentities), readEvidenceSetIdentity: expectedReadSet, readEvidenceCount,
    fullReadCount, truncatedReadCount, supportingPathCount, contentRecords: Object.freeze(contentRecords),
    contentRecordIdentities: Object.freeze(contentRecordIdentities), initialSnapshotResponseIdentity: expectedSnapshotResponse,
    terminalSnapshotResponseIdentity: expectedSnapshotResponse,
    filesPageRecordIdentityGroups: Object.freeze(pageGroups.map((group) => Object.freeze(group))),
    filesPageResponseIdentities: Object.freeze(pageIdentities), requestCount, snapshotObservedAt, terminalObservedAt,
    continuationDecision: expectedContinuation,
  }
  const expectedIdentity = digest("read-context-evidence-identity", evidenceWithoutIdentity(normalized))
  if (sha256(record.readContextEvidenceIdentity, "evidence.readContextEvidenceIdentity") !== expectedIdentity) fail("read context evidence identity mismatch")
  return deepFreeze({ ...normalized, readContextEvidenceIdentity: expectedIdentity })
}
