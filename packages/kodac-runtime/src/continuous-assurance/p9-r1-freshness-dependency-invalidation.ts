import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

export const P9_R1_FRESHNESS_DEPENDENCY_INVALIDATION_VERSION =
  "p9-r1-freshness-dependency-invalidation-v1" as const

export const P9_R1_DEPENDENCY_CLASSES = Object.freeze([
  "PR_HEAD",
  "RULESET",
  "AUTHORIZATION",
  "SKILL",
  "WORKFLOW_DEFINITION",
  "PROVIDER_MODEL_CONFIG",
  "SANDBOX_IMAGE",
  "DEPENDENCY_LOCKFILE",
  "SECURITY_INTELLIGENCE",
] as const)

export const P9_R1_LIMITS = Object.freeze({
  maxDependencies: 64,
  maxDependencyKeyLength: 256,
  maxRepositoryIdCodePoints: 512,
})

export type P9R1DependencyClass = (typeof P9_R1_DEPENDENCY_CLASSES)[number]
export type P9R1FreshnessState = "CURRENT" | "STALE" | "UNKNOWN"
export type P9R1Continuation = "ALLOW" | "BLOCK"
export interface P9R1RevisionBinding {
  readonly repositoryId: string
  readonly canonicalBase: string
  readonly candidateHead: string
}

export interface P9R1DependencyInput {
  readonly dependencyClass: P9R1DependencyClass
  readonly dependencyKey: string
  readonly expectedIdentity: string
  readonly observedIdentity: string | null
}

export interface P9R1FreshnessDependencyInvalidationInput {
  readonly subjectIdentity: string
  readonly revision: P9R1RevisionBinding
  readonly dependencies: readonly P9R1DependencyInput[]
}

export interface P9R1FreshnessDependencyInvalidationDecision {
  readonly version: typeof P9_R1_FRESHNESS_DEPENDENCY_INVALIDATION_VERSION
  readonly subjectIdentity: string
  readonly revision: P9R1RevisionBinding
  readonly dependencies: readonly P9R1DependencyInput[]
  readonly state: P9R1FreshnessState
  readonly continuation: P9R1Continuation
  readonly changedDependencyKeys: readonly string[]
  readonly unknownDependencyKeys: readonly string[]
  readonly decisionIdentity: string
}
type UnknownRecord = Record<string, unknown>

const SHA256 = /^[0-9a-f]{64}$/
const GIT_SHA40 = /^[0-9a-f]{40}$/
const DEPENDENCY_KEY = /^[a-z0-9][a-z0-9._:/-]*$/
const DEPENDENCY_CLASSES = new Set<string>(P9_R1_DEPENDENCY_CLASSES)
const INPUT_KEYS = ["subjectIdentity", "revision", "dependencies"] as const
const REVISION_KEYS = ["repositoryId", "canonicalBase", "candidateHead"] as const
const DEPENDENCY_KEYS = ["dependencyClass", "dependencyKey", "expectedIdentity", "observedIdentity"] as const
const DECISION_KEYS = [
  "version", "subjectIdentity", "revision", "dependencies", "state", "continuation",
  "changedDependencyKeys", "unknownDependencyKeys", "decisionIdentity",
] as const

function fail(label: string, detail: string): never {
  throw new TypeError(`${label} ${detail}`)
}

function record(value: unknown, keys: readonly string[], label: string): UnknownRecord {
  if (typeof value !== "object" || value === null) fail(label, "must be a plain object")
  if (nodeTypes.isProxy(value)) fail(label, "must not be a Proxy")
  if (Array.isArray(value)) fail(label, "must be a plain object")
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(label, "must be a plain object")
  if (Object.getOwnPropertySymbols(value).length !== 0) fail(label, "must not contain symbol fields")
  const names = Object.getOwnPropertyNames(value)
  if (names.length !== keys.length) fail(label, "has an invalid key set")
  const allowed = new Set<string>(keys)
  const result = Object.create(null) as UnknownRecord
  for (const name of names) {
    if (!allowed.has(name)) fail(label, `contains unknown field: ${name}`)
    const descriptor = Object.getOwnPropertyDescriptor(value, name)
    if (descriptor === undefined || !("value" in descriptor) || !descriptor.enumerable) {
      fail(`${label}.${name}`, "must be an enumerable data property")
    }
    result[name] = descriptor.value
  }
  for (const key of keys) {
    if (!Object.hasOwn(result, key)) fail(label, `is missing required field: ${key}`)
  }
  return result
}

function arrayValues(value: unknown, label: string): readonly unknown[] {
  if (typeof value === "object" && value !== null && nodeTypes.isProxy(value)) fail(label, "must not be a Proxy")
  if (!Array.isArray(value)) fail(label, "must be an array")
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(label, "must use the standard Array prototype")
  if (Object.getOwnPropertySymbols(value).length !== 0) fail(label, "must not contain symbol fields")
  const lengthDescriptor = Object.getOwnPropertyDescriptor(value, "length")
  if (lengthDescriptor === undefined || !("value" in lengthDescriptor) || typeof lengthDescriptor.value !== "number") {
    fail(`${label}.length`, "must be a data property")
  }
  const length = lengthDescriptor.value
  const names = Object.getOwnPropertyNames(value)
  if (names.length !== length + 1) fail(label, "must be dense and contain no extra fields")
  const result: unknown[] = []
  for (let index = 0; index < length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index))
    if (descriptor === undefined || !("value" in descriptor) || !descriptor.enumerable) {
      fail(`${label}[${index}]`, "must be an enumerable data property")
    }
    result.push(descriptor.value)
  }
  return result
}

function codePointLength(value: string): number {
  let length = 0
  for (const _character of value) length += 1
  return length
}

function assertUnicodeScalars(value: string, label: string): void {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code >= 0xd800 && code <= 0xdbff) {
      if (index + 1 >= value.length) fail(label, "must contain only valid Unicode scalar values")
      const next = value.charCodeAt(index + 1)
      if (next < 0xdc00 || next > 0xdfff) fail(label, "must contain only valid Unicode scalar values")
      index += 1
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      fail(label, "must contain only valid Unicode scalar values")
    }
  }
}

function repositoryId(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0 || value.includes("\0")) {
    fail(label, "must be non-empty NUL-free text")
  }
  assertUnicodeScalars(value, label)
  if (codePointLength(value) > P9_R1_LIMITS.maxRepositoryIdCodePoints) {
    fail(label, `exceeds ${P9_R1_LIMITS.maxRepositoryIdCodePoints} Unicode code points`)
  }
  return value
}

function sha256(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) fail(label, "must be 64 lowercase hexadecimal characters")
  return value
}

function gitSha40(value: unknown, label: string): string {
  if (typeof value !== "string" || !GIT_SHA40.test(value)) fail(label, "must be 40 lowercase hexadecimal characters")
  return value
}
function dependencyClass(value: unknown, label: string): P9R1DependencyClass {
  if (typeof value !== "string" || !DEPENDENCY_CLASSES.has(value)) fail(label, "is unsupported")
  return value as P9R1DependencyClass
}

function dependencyKey(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0 || value.length > P9_R1_LIMITS.maxDependencyKeyLength) {
    fail(label, `must contain 1..${P9_R1_LIMITS.maxDependencyKeyLength} ASCII characters`)
  }
  if (!DEPENDENCY_KEY.test(value)) fail(label, "must match [a-z0-9][a-z0-9._:/-]*")
  return value
}

function normalizeRevision(value: unknown, label: string): P9R1RevisionBinding {
  const input = record(value, REVISION_KEYS, label)
  return Object.freeze({
    repositoryId: repositoryId(input.repositoryId, `${label}.repositoryId`),
    canonicalBase: gitSha40(input.canonicalBase, `${label}.canonicalBase`),
    candidateHead: gitSha40(input.candidateHead, `${label}.candidateHead`),
  })
}

function normalizeDependency(value: unknown, label: string): P9R1DependencyInput {
  const input = record(value, DEPENDENCY_KEYS, label)
  return Object.freeze({
    dependencyClass: dependencyClass(input.dependencyClass, `${label}.dependencyClass`),
    dependencyKey: dependencyKey(input.dependencyKey, `${label}.dependencyKey`),
    expectedIdentity: sha256(input.expectedIdentity, `${label}.expectedIdentity`),
    observedIdentity: input.observedIdentity === null ? null : sha256(input.observedIdentity, `${label}.observedIdentity`),
  })
}
function normalizeDependencies(value: unknown, label: string, requireCanonicalOrder: boolean): readonly P9R1DependencyInput[] {
  const entries = arrayValues(value, label)
  if (entries.length === 0 || entries.length > P9_R1_LIMITS.maxDependencies) {
    fail(label, `must contain 1..${P9_R1_LIMITS.maxDependencies} dependencies`)
  }
  const normalized = entries.map((entry, index) => normalizeDependency(entry, `${label}[${index}]`))
  const sorted = [...normalized].sort((left, right) => left.dependencyKey < right.dependencyKey ? -1 : left.dependencyKey > right.dependencyKey ? 1 : 0)
  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index - 1]!.dependencyKey === sorted[index]!.dependencyKey) fail(label, "contains duplicate dependencyKey values")
  }
  if (requireCanonicalOrder) {
    for (let index = 0; index < normalized.length; index += 1) {
      if (normalized[index]!.dependencyKey !== sorted[index]!.dependencyKey) fail(label, "must use canonical dependencyKey order")
    }
  }
  return Object.freeze(sorted)
}

function stringArray(value: unknown, label: string): readonly string[] {
  const entries = arrayValues(value, label)
  const result = entries.map((entry, index) => dependencyKey(entry, `${label}[${index}]`))
  for (let index = 1; index < result.length; index += 1) {
    if (result[index - 1]! >= result[index]!) fail(label, "must be strictly sorted and duplicate-free")
  }
  return Object.freeze(result)
}
function derive(dependencies: readonly P9R1DependencyInput[]): {
  state: P9R1FreshnessState
  continuation: P9R1Continuation
  changedDependencyKeys: readonly string[]
  unknownDependencyKeys: readonly string[]
} {
  const changedDependencyKeys = Object.freeze(dependencies
    .filter((dependency) => dependency.observedIdentity !== null && dependency.observedIdentity !== dependency.expectedIdentity)
    .map((dependency) => dependency.dependencyKey))
  const unknownDependencyKeys = Object.freeze(dependencies
    .filter((dependency) => dependency.observedIdentity === null)
    .map((dependency) => dependency.dependencyKey))
  const state: P9R1FreshnessState = changedDependencyKeys.length > 0
    ? "STALE"
    : unknownDependencyKeys.length > 0
      ? "UNKNOWN"
      : "CURRENT"
  return Object.freeze({
    state,
    continuation: state === "CURRENT" ? "ALLOW" : "BLOCK",
    changedDependencyKeys,
    unknownDependencyKeys,
  })
}

interface DecisionPreimage {
  readonly version: typeof P9_R1_FRESHNESS_DEPENDENCY_INVALIDATION_VERSION
  readonly subjectIdentity: string
  readonly revision: P9R1RevisionBinding
  readonly dependencies: readonly P9R1DependencyInput[]
  readonly state: P9R1FreshnessState
  readonly continuation: P9R1Continuation
  readonly changedDependencyKeys: readonly string[]
  readonly unknownDependencyKeys: readonly string[]
}
function decisionIdentity(preimage: DecisionPreimage): string {
  return createHash("sha256").update(JSON.stringify(preimage), "utf8").digest("hex")
}

function preimageFromInput(value: unknown): DecisionPreimage {
  const input = record(value, INPUT_KEYS, "input")
  const subjectIdentity = sha256(input.subjectIdentity, "input.subjectIdentity")
  const revision = normalizeRevision(input.revision, "input.revision")
  const dependencies = normalizeDependencies(input.dependencies, "input.dependencies", false)
  const derived = derive(dependencies)
  return Object.freeze({
    version: P9_R1_FRESHNESS_DEPENDENCY_INVALIDATION_VERSION,
    subjectIdentity,
    revision,
    dependencies,
    state: derived.state,
    continuation: derived.continuation,
    changedDependencyKeys: derived.changedDependencyKeys,
    unknownDependencyKeys: derived.unknownDependencyKeys,
  })
}

export function p9R1FreshnessDecisionIdentity(input: P9R1FreshnessDependencyInvalidationInput): string {
  return decisionIdentity(preimageFromInput(input))
}

export function buildP9R1FreshnessDependencyInvalidationDecision(
  input: P9R1FreshnessDependencyInvalidationInput,
): P9R1FreshnessDependencyInvalidationDecision {
  const preimage = preimageFromInput(input)
  return Object.freeze({ ...preimage, decisionIdentity: decisionIdentity(preimage) })
}
function arraysEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

export function validateP9R1FreshnessDependencyInvalidationDecision(
  value: unknown,
): P9R1FreshnessDependencyInvalidationDecision {
  const input = record(value, DECISION_KEYS, "decision")
  if (input.version !== P9_R1_FRESHNESS_DEPENDENCY_INVALIDATION_VERSION) {
    fail("decision.version", `must equal ${P9_R1_FRESHNESS_DEPENDENCY_INVALIDATION_VERSION}`)
  }
  const subjectIdentity = sha256(input.subjectIdentity, "decision.subjectIdentity")
  const revision = normalizeRevision(input.revision, "decision.revision")
  const dependencies = normalizeDependencies(input.dependencies, "decision.dependencies", true)
  const changedDependencyKeys = stringArray(input.changedDependencyKeys, "decision.changedDependencyKeys")
  const unknownDependencyKeys = stringArray(input.unknownDependencyKeys, "decision.unknownDependencyKeys")
  const derived = derive(dependencies)
  if (input.state !== derived.state) fail("decision.state", "does not match derived freshness state")
  if (input.continuation !== derived.continuation) fail("decision.continuation", "does not match derived continuation")
  if (!arraysEqual(changedDependencyKeys, derived.changedDependencyKeys)) {
    fail("decision.changedDependencyKeys", "does not match derived changed dependencies")
  }
  if (!arraysEqual(unknownDependencyKeys, derived.unknownDependencyKeys)) {
    fail("decision.unknownDependencyKeys", "does not match derived unknown dependencies")
  }
  const preimage: DecisionPreimage = Object.freeze({
    version: P9_R1_FRESHNESS_DEPENDENCY_INVALIDATION_VERSION,
    subjectIdentity,
    revision,
    dependencies,
    state: derived.state,
    continuation: derived.continuation,
    changedDependencyKeys: derived.changedDependencyKeys,
    unknownDependencyKeys: derived.unknownDependencyKeys,
  })
  const actualIdentity = sha256(input.decisionIdentity, "decision.decisionIdentity")
  const expectedIdentity = decisionIdentity(preimage)
  if (actualIdentity !== expectedIdentity) fail("decision.decisionIdentity", "does not match canonical semantic content")

  return Object.freeze({
    ...preimage,
    decisionIdentity: actualIdentity,
  })
}
