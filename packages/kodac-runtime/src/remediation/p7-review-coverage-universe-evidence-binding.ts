import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

export const P7_R23_REVIEW_COVERAGE_UNIVERSE_EVIDENCE_BINDING_VERSION =
  "p7-r23-review-coverage-universe-evidence-binding-v1" as const
export const P7_R23_REVIEW_COVERAGE_UNIVERSE_BOUND_STATE =
  "REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY" as const

export const P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS = Object.freeze({
  maxChangedPaths: 64,
  maxPathCodePoints: 1_024,
  maxRepositoryIdentityBytes: 2_048,
  maxPolicyReasonBytes: 2_048,
  maxJsonNodes: 65_536,
  maxJsonDepth: 64,
})

export const P7_R23_CHANGE_KINDS = [
  "added",
  "modified",
  "deleted",
  "renamed",
  "mode_changed",
] as const

export const P7_R23_OBJECT_KINDS = [
  "regular_file",
  "symlink",
  "submodule_gitlink",
  "missing_after_change",
] as const

export const P7_R23_CONTENT_DISPOSITIONS = [
  "reviewable_text",
  "opaque_binary_or_compiled",
  "generated_or_derived",
  "referenced_hidden_payload",
  "unreadable",
  "unsupported_or_suspicious_encoding",
  "oversized",
  "git_lfs_pointer",
  "policy_excluded",
  "not_applicable_deleted",
] as const

export const P7_R23_ENCODING_DISPOSITIONS = [
  "utf8",
  "utf8_bom",
  "non_utf8_declared_or_detected",
  "suspicious_or_recovered",
  "binary",
  "unknown",
  "not_applicable",
] as const

export const P7_R23_POLICY_DISPOSITIONS = [
  "included",
  "excluded_with_reason",
  "not_applicable",
] as const

export type P7ReviewCoverageChangeKind = (typeof P7_R23_CHANGE_KINDS)[number]
export type P7ReviewCoverageObjectKind = (typeof P7_R23_OBJECT_KINDS)[number]
export type P7ReviewCoverageContentDisposition = (typeof P7_R23_CONTENT_DISPOSITIONS)[number]
export type P7ReviewCoverageEncodingDisposition = (typeof P7_R23_ENCODING_DISPOSITIONS)[number]
export type P7ReviewCoveragePolicyDisposition = (typeof P7_R23_POLICY_DISPOSITIONS)[number]

export interface P7ReviewCoveragePathDescriptor {
  readonly path: string
  readonly previousPath: string | null
  readonly changeKind: P7ReviewCoverageChangeKind
  readonly objectKind: P7ReviewCoverageObjectKind
  readonly objectIdentity: string | null
  readonly byteSize: number
  readonly fileMode: "100644" | "100755" | "120000" | "160000" | "000000"
  readonly contentDisposition: P7ReviewCoverageContentDisposition
  readonly encodingDisposition: P7ReviewCoverageEncodingDisposition
  readonly isGeneratedOrDerived: boolean
  readonly isReferencedHiddenPayload: boolean
  readonly policyDisposition: P7ReviewCoveragePolicyDisposition
  readonly policyReason: string | null
}

export interface P7ReviewCoverageUniverseEvidenceBindingBuildInput {
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly targetTree: string
  readonly changedPathSetIdentity: string
  readonly changedPaths: readonly P7ReviewCoveragePathDescriptor[]
}

export interface P7ReviewCoverageUniverseEvidenceBinding {
  readonly version: typeof P7_R23_REVIEW_COVERAGE_UNIVERSE_EVIDENCE_BINDING_VERSION
  readonly evidenceIdentity: string
  readonly state: typeof P7_R23_REVIEW_COVERAGE_UNIVERSE_BOUND_STATE
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly targetTree: string
  readonly changedPathSetIdentity: string
  readonly reviewUniverseIdentity: string
  readonly changedPathCount: number
  readonly reviewUniversePaths: readonly string[]
  readonly reviewableTextPaths: readonly string[]
  readonly opaqueBinaryPaths: readonly string[]
  readonly generatedOrDerivedPaths: readonly string[]
  readonly referencedHiddenPayloadPaths: readonly string[]
  readonly unreadablePaths: readonly string[]
  readonly unsupportedEncodingPaths: readonly string[]
  readonly oversizedPaths: readonly string[]
  readonly symlinkPaths: readonly string[]
  readonly submodulePaths: readonly string[]
  readonly lfsPointerPaths: readonly string[]
  readonly policyExcludedPaths: readonly string[]
  readonly deletedPaths: readonly string[]
}

type UnknownRecord = Record<string, unknown>
type EvidenceCore = Omit<P7ReviewCoverageUniverseEvidenceBinding, "evidenceIdentity">

const SHA1 = /^[0-9a-f]{40}$/
const SHA256 = /^[0-9a-f]{64}$/
const CONTROL_CHARACTERS = /[\p{Cc}\p{Cf}\p{Cs}]/u

const BUILD_KEYS = [
  "repositoryIdentity",
  "canonicalBase",
  "targetHead",
  "targetTree",
  "changedPathSetIdentity",
  "changedPaths",
] as const

const DESCRIPTOR_KEYS = [
  "path",
  "previousPath",
  "changeKind",
  "objectKind",
  "objectIdentity",
  "byteSize",
  "fileMode",
  "contentDisposition",
  "encodingDisposition",
  "isGeneratedOrDerived",
  "isReferencedHiddenPayload",
  "policyDisposition",
  "policyReason",
] as const

const OUTPUT_KEYS = [
  "version",
  "evidenceIdentity",
  "state",
  "repositoryIdentity",
  "canonicalBase",
  "targetHead",
  "targetTree",
  "changedPathSetIdentity",
  "reviewUniverseIdentity",
  "changedPathCount",
  "reviewUniversePaths",
  "reviewableTextPaths",
  "opaqueBinaryPaths",
  "generatedOrDerivedPaths",
  "referencedHiddenPayloadPaths",
  "unreadablePaths",
  "unsupportedEncodingPaths",
  "oversizedPaths",
  "symlinkPaths",
  "submodulePaths",
  "lfsPointerPaths",
  "policyExcludedPaths",
  "deletedPaths",
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
    (lengthDescriptor.value as number) > P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS.maxJsonNodes
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
    if (nodes > P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS.maxJsonNodes) fail(label, "exceeds the JSON node budget")
    if (current.depth > P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS.maxJsonDepth) fail(label, "exceeds the JSON depth budget")
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

function sha1(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA1.test(value)) fail(label, "must be a lowercase 40-hex Git object")
  return value
}

function sha256(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) fail(label, "must be a lowercase SHA-256 digest")
  return value
}

function boundedText(value: unknown, label: string, maxBytes: number): string {
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

function canonicalPath(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) fail(label, "must be a non-empty repository-relative POSIX path")
  if (value !== value.normalize("NFC")) fail(label, "must use NFC-normalized Unicode")
  if (value.startsWith("/") || value.endsWith("/") || value.includes("\\") || CONTROL_CHARACTERS.test(value)) {
    fail(label, "must be a canonical repository-relative POSIX path")
  }
  const segments = value.split("/")
  if (segments.some((segment) => segment === "" || segment === "." || segment === "..")) {
    fail(label, "must not contain empty, dot, or dot-dot path segments")
  }
  if ([...value].length > P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS.maxPathCodePoints) {
    fail(label, "exceeds the path code-point budget")
  }
  return value
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], label: string): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) fail(label, "contains an unsupported value")
  return value as T
}

function booleanValue(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") fail(label, "must be boolean")
  return value
}

function safeInteger(value: unknown, label: string, minimum = 0): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < minimum) {
    fail(label, `must be a safe integer >= ${minimum}`)
  }
  return value
}

function fileMode(value: unknown, label: string): P7ReviewCoveragePathDescriptor["fileMode"] {
  if (value === "100644" || value === "100755" || value === "120000" || value === "160000" || value === "000000") {
    return value
  }
  fail(label, "must be one canonical Git file mode")
}

function nullableSha1(value: unknown, label: string): string | null {
  if (value === null) return null
  return sha1(value, label)
}

function nullablePath(value: unknown, label: string): string | null {
  if (value === null) return null
  return canonicalPath(value, label)
}

function nullableReason(value: unknown, label: string): string | null {
  if (value === null) return null
  return boundedText(value, label, P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS.maxPolicyReasonBytes)
}

function normalizeDescriptor(value: unknown, index: number): P7ReviewCoveragePathDescriptor {
  const label = `changedPaths[${index}]`
  const input = ownDataRecord(value, DESCRIPTOR_KEYS, DESCRIPTOR_KEYS, label)
  const path = canonicalPath(input.path, `${label}.path`)
  const previousPath = nullablePath(input.previousPath, `${label}.previousPath`)
  const changeKind = oneOf(input.changeKind, P7_R23_CHANGE_KINDS, `${label}.changeKind`)
  const objectKind = oneOf(input.objectKind, P7_R23_OBJECT_KINDS, `${label}.objectKind`)
  const objectIdentity = nullableSha1(input.objectIdentity, `${label}.objectIdentity`)
  const byteSize = safeInteger(input.byteSize, `${label}.byteSize`)
  const normalizedMode = fileMode(input.fileMode, `${label}.fileMode`)
  const contentDisposition = oneOf(input.contentDisposition, P7_R23_CONTENT_DISPOSITIONS, `${label}.contentDisposition`)
  const encodingDisposition = oneOf(input.encodingDisposition, P7_R23_ENCODING_DISPOSITIONS, `${label}.encodingDisposition`)
  const isGeneratedOrDerived = booleanValue(input.isGeneratedOrDerived, `${label}.isGeneratedOrDerived`)
  const isReferencedHiddenPayload = booleanValue(input.isReferencedHiddenPayload, `${label}.isReferencedHiddenPayload`)
  const policyDisposition = oneOf(input.policyDisposition, P7_R23_POLICY_DISPOSITIONS, `${label}.policyDisposition`)
  const policyReason = nullableReason(input.policyReason, `${label}.policyReason`)

  if (changeKind === "renamed") {
    if (previousPath === null || previousPath === path) fail(`${label}.previousPath`, "must identify a distinct canonical source path for renamed changes")
  } else if (previousPath !== null) {
    fail(`${label}.previousPath`, "must be null unless changeKind is renamed")
  }

  if (changeKind === "deleted") {
    if (objectKind !== "missing_after_change") fail(`${label}.objectKind`, "must be missing_after_change for deleted paths")
    if (objectIdentity !== null) fail(`${label}.objectIdentity`, "must be null for deleted paths")
    if (byteSize !== 0) fail(`${label}.byteSize`, "must equal 0 for deleted paths")
    if (normalizedMode !== "000000") fail(`${label}.fileMode`, "must equal 000000 for deleted paths")
    if (contentDisposition !== "not_applicable_deleted") fail(`${label}.contentDisposition`, "must be not_applicable_deleted for deleted paths")
    if (encodingDisposition !== "not_applicable") fail(`${label}.encodingDisposition`, "must be not_applicable for deleted paths")
    if (isGeneratedOrDerived || isReferencedHiddenPayload) fail(label, "deleted paths must not assert generated or hidden-payload state")
    if (policyDisposition !== "not_applicable" || policyReason !== null) fail(label, "deleted paths must use not_applicable policy disposition without a reason")
  } else {
    if (objectKind === "missing_after_change") fail(`${label}.objectKind`, "is only valid for deleted paths")
    if (objectIdentity === null) fail(`${label}.objectIdentity`, "must be present for non-deleted paths")
    if (normalizedMode === "000000") fail(`${label}.fileMode`, "is only valid for deleted paths")
    if (contentDisposition === "not_applicable_deleted") fail(`${label}.contentDisposition`, "is only valid for deleted paths")
  }

  if (objectKind === "regular_file" && normalizedMode !== "100644" && normalizedMode !== "100755") {
    fail(`${label}.fileMode`, "must be 100644 or 100755 for regular files")
  }
  if (objectKind === "symlink" && normalizedMode !== "120000") fail(`${label}.fileMode`, "must be 120000 for symlinks")
  if (objectKind === "submodule_gitlink" && normalizedMode !== "160000") fail(`${label}.fileMode`, "must be 160000 for submodule gitlinks")

  if (contentDisposition === "reviewable_text" && encodingDisposition !== "utf8" && encodingDisposition !== "utf8_bom") {
    fail(`${label}.encodingDisposition`, "must be utf8 or utf8_bom for reviewable text")
  }
  if (contentDisposition === "opaque_binary_or_compiled" && encodingDisposition !== "binary") {
    fail(`${label}.encodingDisposition`, "must be binary for opaque binary or compiled content")
  }
  if (
    contentDisposition === "unsupported_or_suspicious_encoding" &&
    encodingDisposition !== "non_utf8_declared_or_detected" &&
    encodingDisposition !== "suspicious_or_recovered" &&
    encodingDisposition !== "unknown"
  ) {
    fail(`${label}.encodingDisposition`, "must identify a non-UTF8, suspicious/recovered, or unknown encoding")
  }
  if ((objectKind === "symlink" || objectKind === "submodule_gitlink") && encodingDisposition !== "not_applicable") {
    fail(`${label}.encodingDisposition`, "must be not_applicable for symlink or submodule descriptors")
  }
  if (contentDisposition === "git_lfs_pointer" && objectKind !== "regular_file") {
    fail(`${label}.objectKind`, "must be regular_file for Git LFS pointer content")
  }
  if (contentDisposition === "generated_or_derived" && !isGeneratedOrDerived) {
    fail(`${label}.isGeneratedOrDerived`, "must be true for generated_or_derived content")
  }
  if (contentDisposition === "referenced_hidden_payload" && !isReferencedHiddenPayload) {
    fail(`${label}.isReferencedHiddenPayload`, "must be true for referenced_hidden_payload content")
  }
  if (contentDisposition === "policy_excluded" && policyDisposition !== "excluded_with_reason") {
    fail(`${label}.policyDisposition`, "must be excluded_with_reason for policy_excluded content")
  }

  if (policyDisposition === "excluded_with_reason") {
    if (policyReason === null) fail(`${label}.policyReason`, "must be present for excluded_with_reason")
  } else if (policyReason !== null) {
    fail(`${label}.policyReason`, "must be null unless policyDisposition is excluded_with_reason")
  }

  return deepFreeze({
    path,
    previousPath,
    changeKind,
    objectKind,
    objectIdentity,
    byteSize,
    fileMode: normalizedMode,
    contentDisposition,
    encodingDisposition,
    isGeneratedOrDerived,
    isReferencedHiddenPayload,
    policyDisposition,
    policyReason,
  })
}

function normalizeBuildInput(value: unknown): {
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly targetTree: string
  readonly changedPathSetIdentity: string
  readonly changedPaths: readonly P7ReviewCoveragePathDescriptor[]
} {
  assertSafeJsonGraph(value, "review coverage universe evidence build input")
  const input = ownDataRecord(value, BUILD_KEYS, BUILD_KEYS, "review coverage universe evidence build input")
  const repositoryIdentity = boundedText(
    input.repositoryIdentity,
    "repositoryIdentity",
    P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS.maxRepositoryIdentityBytes,
  )
  const canonicalBase = sha1(input.canonicalBase, "canonicalBase")
  const targetHead = sha1(input.targetHead, "targetHead")
  const targetTree = sha1(input.targetTree, "targetTree")
  const changedPathSetIdentity = sha256(input.changedPathSetIdentity, "changedPathSetIdentity")
  const rawPaths = denseArray(input.changedPaths, "changedPaths")
  if (rawPaths.length === 0 || rawPaths.length > P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS.maxChangedPaths) {
    fail("changedPaths", `must contain between 1 and ${P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS.maxChangedPaths} descriptors`)
  }
  const changedPaths = rawPaths.map((item, index) => normalizeDescriptor(item, index)).sort((left, right) => compareStrings(left.path, right.path))
  for (let index = 1; index < changedPaths.length; index += 1) {
    if (changedPaths[index - 1]!.path === changedPaths[index]!.path) fail("changedPaths", "must not contain duplicate canonical paths")
  }
  return deepFreeze({ repositoryIdentity, canonicalBase, targetHead, targetTree, changedPathSetIdentity, changedPaths })
}

function projectPaths(
  descriptors: readonly P7ReviewCoveragePathDescriptor[],
  predicate: (descriptor: P7ReviewCoveragePathDescriptor) => boolean,
): readonly string[] {
  return Object.freeze(descriptors.filter(predicate).map((descriptor) => descriptor.path))
}

function normalizedBuildCore(value: unknown): EvidenceCore {
  const input = normalizeBuildInput(value)
  const reviewUniversePaths = Object.freeze(input.changedPaths.map((descriptor) => descriptor.path))
  const reviewUniverseIdentity = hashText(
    canonicalJson({
      repositoryIdentity: input.repositoryIdentity,
      canonicalBase: input.canonicalBase,
      targetHead: input.targetHead,
      targetTree: input.targetTree,
      changedPathSetIdentity: input.changedPathSetIdentity,
      changedPaths: input.changedPaths,
    }),
  )

  return deepFreeze({
    version: P7_R23_REVIEW_COVERAGE_UNIVERSE_EVIDENCE_BINDING_VERSION,
    state: P7_R23_REVIEW_COVERAGE_UNIVERSE_BOUND_STATE,
    repositoryIdentity: input.repositoryIdentity,
    canonicalBase: input.canonicalBase,
    targetHead: input.targetHead,
    targetTree: input.targetTree,
    changedPathSetIdentity: input.changedPathSetIdentity,
    reviewUniverseIdentity,
    changedPathCount: input.changedPaths.length,
    reviewUniversePaths,
    reviewableTextPaths: projectPaths(input.changedPaths, (descriptor) => descriptor.contentDisposition === "reviewable_text"),
    opaqueBinaryPaths: projectPaths(input.changedPaths, (descriptor) => descriptor.contentDisposition === "opaque_binary_or_compiled"),
    generatedOrDerivedPaths: projectPaths(input.changedPaths, (descriptor) => descriptor.isGeneratedOrDerived),
    referencedHiddenPayloadPaths: projectPaths(input.changedPaths, (descriptor) => descriptor.isReferencedHiddenPayload),
    unreadablePaths: projectPaths(input.changedPaths, (descriptor) => descriptor.contentDisposition === "unreadable"),
    unsupportedEncodingPaths: projectPaths(input.changedPaths, (descriptor) => descriptor.contentDisposition === "unsupported_or_suspicious_encoding"),
    oversizedPaths: projectPaths(input.changedPaths, (descriptor) => descriptor.contentDisposition === "oversized"),
    symlinkPaths: projectPaths(input.changedPaths, (descriptor) => descriptor.objectKind === "symlink"),
    submodulePaths: projectPaths(input.changedPaths, (descriptor) => descriptor.objectKind === "submodule_gitlink"),
    lfsPointerPaths: projectPaths(input.changedPaths, (descriptor) => descriptor.contentDisposition === "git_lfs_pointer"),
    policyExcludedPaths: projectPaths(input.changedPaths, (descriptor) => descriptor.policyDisposition === "excluded_with_reason"),
    deletedPaths: projectPaths(input.changedPaths, (descriptor) => descriptor.changeKind === "deleted"),
  })
}

export function buildP7ReviewCoverageUniverseEvidenceBinding(
  input: P7ReviewCoverageUniverseEvidenceBindingBuildInput,
): P7ReviewCoverageUniverseEvidenceBinding {
  const core = normalizedBuildCore(input)
  return deepFreeze({ ...core, evidenceIdentity: hashText(canonicalJson(core)) })
}

function outputRecord(value: unknown): UnknownRecord {
  assertSafeJsonGraph(value, "review coverage universe evidence binding")
  return ownDataRecord(value, OUTPUT_KEYS, OUTPUT_KEYS, "review coverage universe evidence binding")
}

export function validateP7ReviewCoverageUniverseEvidenceBinding(
  value: unknown,
  input: P7ReviewCoverageUniverseEvidenceBindingBuildInput,
): P7ReviewCoverageUniverseEvidenceBinding {
  const record = outputRecord(value)
  const expected = buildP7ReviewCoverageUniverseEvidenceBinding(input)
  sha256(record.evidenceIdentity, "evidenceIdentity")
  sha256(record.reviewUniverseIdentity, "reviewUniverseIdentity")
  sha256(record.changedPathSetIdentity, "changedPathSetIdentity")
  sha1(record.canonicalBase, "canonicalBase")
  sha1(record.targetHead, "targetHead")
  sha1(record.targetTree, "targetTree")
  if (canonicalJson(record) !== canonicalJson(expected)) {
    fail("review coverage universe evidence binding", "does not match the deterministic canonical projection")
  }
  return expected
}
