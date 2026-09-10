import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

import {
  P9_R1_LIMITS,
  validateP9R1FreshnessDependencyInvalidationDecision,
  type P9R1FreshnessDependencyInvalidationDecision,
  type P9R1RevisionBinding,
} from "./p9-r1-freshness-dependency-invalidation.ts"

export const P9_R2_IMPACTED_SUBJECT_RESOLUTION_VERSION = "p9-r2-impacted-subject-resolution-v1" as const

export const P9_R2_LIMITS = Object.freeze({
  maxChangedDependencyKeys: 64,
  maxSubjectDecisions: 256,
})

export interface P9R2ImpactedSubjectResolutionInput {
  readonly revision: P9R1RevisionBinding
  readonly changedDependencyKeys: readonly string[]
  readonly subjectDecisions: readonly P9R1FreshnessDependencyInvalidationDecision[]
}

export interface P9R2ImpactedSubject {
  readonly subjectIdentity: string
  readonly decisionIdentity: string
  readonly matchedChangedDependencyKeys: readonly string[]
}

export interface P9R2ImpactedSubjectResolutionResult {
  readonly version: typeof P9_R2_IMPACTED_SUBJECT_RESOLUTION_VERSION
  readonly revision: P9R1RevisionBinding
  readonly changedDependencyKeys: readonly string[]
  readonly subjectDecisionIdentities: readonly string[]
  readonly impactedSubjects: readonly P9R2ImpactedSubject[]
  readonly unmatchedChangedDependencyKeys: readonly string[]
  readonly resultIdentity: string
}

type UnknownRecord = Record<string, unknown>

const SHA256 = /^[0-9a-f]{64}$/
const GIT_SHA40 = /^[0-9a-f]{40}$/
const DEPENDENCY_KEY = /^[a-z0-9][a-z0-9._:/-]*$/
const INPUT_KEYS = ["revision", "changedDependencyKeys", "subjectDecisions"] as const
const REVISION_KEYS = ["repositoryId", "canonicalBase", "candidateHead"] as const
const RESULT_KEYS = [
  "version",
  "revision",
  "changedDependencyKeys",
  "subjectDecisionIdentities",
  "impactedSubjects",
  "unmatchedChangedDependencyKeys",
  "resultIdentity",
] as const
const IMPACTED_SUBJECT_KEYS = ["subjectIdentity", "decisionIdentity", "matchedChangedDependencyKeys"] as const

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

function arrayValues(value: unknown, label: string, maximum: number): readonly unknown[] {
  if (typeof value === "object" && value !== null && nodeTypes.isProxy(value)) fail(label, "must not be a Proxy")
  if (!Array.isArray(value)) fail(label, "must be an array")
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(label, "must use the standard Array prototype")
  if (Object.getOwnPropertySymbols(value).length !== 0) fail(label, "must not contain symbol fields")
  const lengthDescriptor = Object.getOwnPropertyDescriptor(value, "length")
  if (
    lengthDescriptor === undefined
    || !("value" in lengthDescriptor)
    || typeof lengthDescriptor.value !== "number"
    || !Number.isSafeInteger(lengthDescriptor.value)
    || lengthDescriptor.value < 0
  ) fail(`${label}.length`, "must be a non-negative safe-integer data property")
  const length = lengthDescriptor.value
  if (length > maximum) fail(label, `exceeds ${maximum} entries`)
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

function dependencyKey(value: unknown, label: string): string {
  if (
    typeof value !== "string"
    || value.length === 0
    || value.length > P9_R1_LIMITS.maxDependencyKeyLength
  ) fail(label, `must contain 1..${P9_R1_LIMITS.maxDependencyKeyLength} ASCII characters`)
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

function sameRevision(left: P9R1RevisionBinding, right: P9R1RevisionBinding): boolean {
  return left.repositoryId === right.repositoryId
    && left.canonicalBase === right.canonicalBase
    && left.candidateHead === right.candidateHead
}

function canonicalDependencyKeys(
  value: unknown,
  label: string,
  minimum: number,
  maximum: number,
  requireCanonicalOrder: boolean,
): readonly string[] {
  const entries = arrayValues(value, label, maximum)
  if (entries.length < minimum) fail(label, `must contain at least ${minimum} entries`)
  const keys = entries.map((entry, index) => dependencyKey(entry, `${label}[${index}]`))
  if (new Set(keys).size !== keys.length) fail(label, "contains duplicate dependency keys")
  const sorted = [...keys].sort()
  if (requireCanonicalOrder && keys.some((key, index) => key !== sorted[index])) {
    fail(label, "must use canonical dependency-key order")
  }
  return Object.freeze(sorted)
}

interface NormalizedSource {
  readonly revision: P9R1RevisionBinding
  readonly changedDependencyKeys: readonly string[]
  readonly subjectDecisions: readonly P9R1FreshnessDependencyInvalidationDecision[]
}

function normalizeSource(value: unknown): NormalizedSource {
  const input = record(value, INPUT_KEYS, "input")
  const revision = normalizeRevision(input.revision, "input.revision")
  const changedDependencyKeys = canonicalDependencyKeys(
    input.changedDependencyKeys,
    "input.changedDependencyKeys",
    1,
    P9_R2_LIMITS.maxChangedDependencyKeys,
    false,
  )
  const decisionValues = arrayValues(input.subjectDecisions, "input.subjectDecisions", P9_R2_LIMITS.maxSubjectDecisions)
  if (decisionValues.length === 0) fail("input.subjectDecisions", "must contain at least 1 entry")
  const decisions = decisionValues.map((decision, index) => {
    const validated = validateP9R1FreshnessDependencyInvalidationDecision(decision)
    if (!sameRevision(revision, validated.revision)) {
      fail(`input.subjectDecisions[${index}].revision`, "must match the query revision")
    }
    return validated
  })
  const decisionIds = new Set<string>()
  const subjectIds = new Set<string>()
  for (const decision of decisions) {
    if (decisionIds.has(decision.decisionIdentity)) fail("input.subjectDecisions", "contains duplicate decisionIdentity values")
    decisionIds.add(decision.decisionIdentity)
    if (subjectIds.has(decision.subjectIdentity)) fail("input.subjectDecisions", "contains duplicate subjectIdentity values")
    subjectIds.add(decision.subjectIdentity)
  }
  decisions.sort((left, right) => left.subjectIdentity < right.subjectIdentity ? -1 : left.subjectIdentity > right.subjectIdentity ? 1 : 0)
  return Object.freeze({ revision, changedDependencyKeys, subjectDecisions: Object.freeze(decisions) })
}

interface ResultPreimage {
  readonly version: typeof P9_R2_IMPACTED_SUBJECT_RESOLUTION_VERSION
  readonly revision: P9R1RevisionBinding
  readonly changedDependencyKeys: readonly string[]
  readonly subjectDecisionIdentities: readonly string[]
  readonly impactedSubjects: readonly P9R2ImpactedSubject[]
  readonly unmatchedChangedDependencyKeys: readonly string[]
}

function preimageFromSource(value: unknown): ResultPreimage {
  const source = normalizeSource(value)
  const changed = new Set(source.changedDependencyKeys)
  const globallyMatched = new Set<string>()
  const impactedSubjects: P9R2ImpactedSubject[] = []

  for (const decision of source.subjectDecisions) {
    const matched = decision.changedDependencyKeys.filter((key) => changed.has(key))
    if (matched.length === 0) continue
    for (const key of matched) globallyMatched.add(key)
    impactedSubjects.push(Object.freeze({
      subjectIdentity: decision.subjectIdentity,
      decisionIdentity: decision.decisionIdentity,
      matchedChangedDependencyKeys: Object.freeze([...matched]),
    }))
  }

  const subjectDecisionIdentities = Object.freeze(
    source.subjectDecisions.map((decision) => decision.decisionIdentity).sort(),
  )
  const unmatchedChangedDependencyKeys = Object.freeze(
    source.changedDependencyKeys.filter((key) => !globallyMatched.has(key)),
  )

  return Object.freeze({
    version: P9_R2_IMPACTED_SUBJECT_RESOLUTION_VERSION,
    revision: source.revision,
    changedDependencyKeys: source.changedDependencyKeys,
    subjectDecisionIdentities,
    impactedSubjects: Object.freeze(impactedSubjects),
    unmatchedChangedDependencyKeys,
  })
}

function resultIdentity(preimage: ResultPreimage): string {
  return createHash("sha256").update(JSON.stringify(preimage), "utf8").digest("hex")
}

export function p9R2ImpactedSubjectResolutionIdentity(input: P9R2ImpactedSubjectResolutionInput): string {
  return resultIdentity(preimageFromSource(input))
}

export function buildP9R2ImpactedSubjectResolution(
  input: P9R2ImpactedSubjectResolutionInput,
): P9R2ImpactedSubjectResolutionResult {
  const preimage = preimageFromSource(input)
  return Object.freeze({ ...preimage, resultIdentity: resultIdentity(preimage) })
}

function canonicalShaArray(
  value: unknown,
  label: string,
  minimum: number,
  maximum: number,
): readonly string[] {
  const entries = arrayValues(value, label, maximum)
  if (entries.length < minimum) fail(label, `must contain at least ${minimum} entries`)
  const values = entries.map((entry, index) => sha256(entry, `${label}[${index}]`))
  if (new Set(values).size !== values.length) fail(label, "contains duplicate identities")
  for (let index = 1; index < values.length; index += 1) {
    if (values[index - 1]! >= values[index]!) fail(label, "must be strictly sorted and duplicate-free")
  }
  return Object.freeze(values)
}

function normalizeImpactedSubjects(value: unknown, label: string): readonly P9R2ImpactedSubject[] {
  const entries = arrayValues(value, label, P9_R2_LIMITS.maxSubjectDecisions)
  const result = entries.map((entry, index) => {
    const item = record(entry, IMPACTED_SUBJECT_KEYS, `${label}[${index}]`)
    return Object.freeze({
      subjectIdentity: sha256(item.subjectIdentity, `${label}[${index}].subjectIdentity`),
      decisionIdentity: sha256(item.decisionIdentity, `${label}[${index}].decisionIdentity`),
      matchedChangedDependencyKeys: canonicalDependencyKeys(
        item.matchedChangedDependencyKeys,
        `${label}[${index}].matchedChangedDependencyKeys`,
        1,
        P9_R2_LIMITS.maxChangedDependencyKeys,
        true,
      ),
    })
  })
  const subjects = new Set<string>()
  const decisions = new Set<string>()
  for (let index = 0; index < result.length; index += 1) {
    const item = result[index]!
    if (subjects.has(item.subjectIdentity)) fail(label, "contains duplicate subjectIdentity values")
    subjects.add(item.subjectIdentity)
    if (decisions.has(item.decisionIdentity)) fail(label, "contains duplicate decisionIdentity values")
    decisions.add(item.decisionIdentity)
    if (index > 0 && result[index - 1]!.subjectIdentity >= item.subjectIdentity) {
      fail(label, "must be strictly sorted by subjectIdentity")
    }
  }
  return Object.freeze(result)
}

function arraysEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

function impactedEqual(left: readonly P9R2ImpactedSubject[], right: readonly P9R2ImpactedSubject[]): boolean {
  return left.length === right.length && left.every((value, index) => {
    const expected = right[index]!
    return value.subjectIdentity === expected.subjectIdentity
      && value.decisionIdentity === expected.decisionIdentity
      && arraysEqual(value.matchedChangedDependencyKeys, expected.matchedChangedDependencyKeys)
  })
}

export function validateP9R2ImpactedSubjectResolutionResult(
  value: unknown,
  sourceInput: P9R2ImpactedSubjectResolutionInput,
): P9R2ImpactedSubjectResolutionResult {
  const input = record(value, RESULT_KEYS, "result")
  if (input.version !== P9_R2_IMPACTED_SUBJECT_RESOLUTION_VERSION) {
    fail("result.version", `must equal ${P9_R2_IMPACTED_SUBJECT_RESOLUTION_VERSION}`)
  }
  const revision = normalizeRevision(input.revision, "result.revision")
  const changedDependencyKeys = canonicalDependencyKeys(
    input.changedDependencyKeys,
    "result.changedDependencyKeys",
    1,
    P9_R2_LIMITS.maxChangedDependencyKeys,
    true,
  )
  const subjectDecisionIdentities = canonicalShaArray(
    input.subjectDecisionIdentities,
    "result.subjectDecisionIdentities",
    1,
    P9_R2_LIMITS.maxSubjectDecisions,
  )
  const impactedSubjects = normalizeImpactedSubjects(input.impactedSubjects, "result.impactedSubjects")
  const unmatchedChangedDependencyKeys = canonicalDependencyKeys(
    input.unmatchedChangedDependencyKeys,
    "result.unmatchedChangedDependencyKeys",
    0,
    P9_R2_LIMITS.maxChangedDependencyKeys,
    true,
  )
  const actualIdentity = sha256(input.resultIdentity, "result.resultIdentity")
  const expectedPreimage = preimageFromSource(sourceInput)
  const expectedIdentity = resultIdentity(expectedPreimage)

  if (!sameRevision(revision, expectedPreimage.revision)) fail("result.revision", "does not match the canonical source revision")
  if (!arraysEqual(changedDependencyKeys, expectedPreimage.changedDependencyKeys)) {
    fail("result.changedDependencyKeys", "does not match the canonical source changed-key set")
  }
  if (!arraysEqual(subjectDecisionIdentities, expectedPreimage.subjectDecisionIdentities)) {
    fail("result.subjectDecisionIdentities", "does not match the canonical source decision set")
  }
  if (!impactedEqual(impactedSubjects, expectedPreimage.impactedSubjects)) {
    fail("result.impactedSubjects", "does not match the canonical impact projection")
  }
  if (!arraysEqual(unmatchedChangedDependencyKeys, expectedPreimage.unmatchedChangedDependencyKeys)) {
    fail("result.unmatchedChangedDependencyKeys", "does not match the canonical unmatched-key projection")
  }
  if (actualIdentity !== expectedIdentity) fail("result.resultIdentity", "does not match canonical semantic content")

  return Object.freeze({ ...expectedPreimage, resultIdentity: expectedIdentity })
}
