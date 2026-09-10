import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

import {
  P9_R2_LIMITS,
  validateP9R2ImpactedSubjectResolutionResult,
  type P9R2ImpactedSubjectResolutionInput,
  type P9R2ImpactedSubjectResolutionResult,
} from "./p9-r2-impacted-subject-resolution.ts"
import type { P9R1RevisionBinding } from "./p9-r1-freshness-dependency-invalidation.ts"

export const P9_R3_TARGETED_REQUALIFICATION_REQUIREMENT_VERSION =
  "p9-r3-targeted-requalification-requirement-v1" as const

export const P9_R3_STATE = "STALE" as const
export const P9_R3_CONTINUATION = "BLOCK" as const
export const P9_R3_REQUALIFICATION = "REQUIRED" as const

export interface P9R3TargetedRequalificationRequirementInput {
  readonly sourceInput: P9R2ImpactedSubjectResolutionInput
  readonly sourceResult: P9R2ImpactedSubjectResolutionResult
}

export interface P9R3TargetedRequalificationRequirement {
  readonly subjectIdentity: string
  readonly decisionIdentity: string
  readonly matchedChangedDependencyKeys: readonly string[]
  readonly state: typeof P9_R3_STATE
  readonly continuation: typeof P9_R3_CONTINUATION
  readonly requalification: typeof P9_R3_REQUALIFICATION
  readonly requirementIdentity: string
}

export interface P9R3TargetedRequalificationRequirementResult {
  readonly version: typeof P9_R3_TARGETED_REQUALIFICATION_REQUIREMENT_VERSION
  readonly revision: P9R1RevisionBinding
  readonly sourceResultIdentity: string
  readonly changedDependencyKeys: readonly string[]
  readonly requirements: readonly P9R3TargetedRequalificationRequirement[]
  readonly resultIdentity: string
}

type UnknownRecord = Record<string, unknown>

const SHA256 = /^[0-9a-f]{64}$/
const GIT_SHA40 = /^[0-9a-f]{40}$/
const INPUT_KEYS = ["sourceInput", "sourceResult"] as const
const REVISION_KEYS = ["repositoryId", "canonicalBase", "candidateHead"] as const
const RESULT_KEYS = [
  "version",
  "revision",
  "sourceResultIdentity",
  "changedDependencyKeys",
  "requirements",
  "resultIdentity",
] as const
const REQUIREMENT_KEYS = [
  "subjectIdentity",
  "decisionIdentity",
  "matchedChangedDependencyKeys",
  "state",
  "continuation",
  "requalification",
  "requirementIdentity",
] as const
const REQUIREMENT_DOMAIN = "kodac:p9-r3:targeted-requalification-requirement:v1"
const RESULT_DOMAIN = "kodac:p9-r3:targeted-requalification-result:v1"

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

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string") fail(label, "must be a string")
  return value
}

function sha256(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) {
    fail(label, "must be 64 lowercase hexadecimal characters")
  }
  return value
}

function gitSha40(value: unknown, label: string): string {
  if (typeof value !== "string" || !GIT_SHA40.test(value)) {
    fail(label, "must be 40 lowercase hexadecimal characters")
  }
  return value
}

function digest(domain: string, value: unknown): string {
  return createHash("sha256").update(domain, "utf8").update("\0", "utf8").update(JSON.stringify(value), "utf8").digest("hex")
}

function validateInput(value: unknown): P9R3TargetedRequalificationRequirementInput {
  const input = record(value, INPUT_KEYS, "input")
  const sourceResult = validateP9R2ImpactedSubjectResolutionResult(
    input.sourceResult,
    input.sourceInput as P9R2ImpactedSubjectResolutionInput,
  )
  return Object.freeze({
    sourceInput: input.sourceInput as P9R2ImpactedSubjectResolutionInput,
    sourceResult,
  })
}

interface RequirementPreimage {
  readonly version: typeof P9_R3_TARGETED_REQUALIFICATION_REQUIREMENT_VERSION
  readonly sourceResultIdentity: string
  readonly revision: P9R1RevisionBinding
  readonly subjectIdentity: string
  readonly decisionIdentity: string
  readonly matchedChangedDependencyKeys: readonly string[]
  readonly state: typeof P9_R3_STATE
  readonly continuation: typeof P9_R3_CONTINUATION
  readonly requalification: typeof P9_R3_REQUALIFICATION
}

function requirementFromImpact(
  sourceResultIdentity: string,
  revision: P9R1RevisionBinding,
  impact: P9R2ImpactedSubjectResolutionResult["impactedSubjects"][number],
): P9R3TargetedRequalificationRequirement {
  const preimage: RequirementPreimage = Object.freeze({
    version: P9_R3_TARGETED_REQUALIFICATION_REQUIREMENT_VERSION,
    sourceResultIdentity,
    revision,
    subjectIdentity: impact.subjectIdentity,
    decisionIdentity: impact.decisionIdentity,
    matchedChangedDependencyKeys: Object.freeze([...impact.matchedChangedDependencyKeys]),
    state: P9_R3_STATE,
    continuation: P9_R3_CONTINUATION,
    requalification: P9_R3_REQUALIFICATION,
  })
  return Object.freeze({
    subjectIdentity: preimage.subjectIdentity,
    decisionIdentity: preimage.decisionIdentity,
    matchedChangedDependencyKeys: preimage.matchedChangedDependencyKeys,
    state: preimage.state,
    continuation: preimage.continuation,
    requalification: preimage.requalification,
    requirementIdentity: digest(REQUIREMENT_DOMAIN, preimage),
  })
}

interface ResultPreimage {
  readonly version: typeof P9_R3_TARGETED_REQUALIFICATION_REQUIREMENT_VERSION
  readonly revision: P9R1RevisionBinding
  readonly sourceResultIdentity: string
  readonly changedDependencyKeys: readonly string[]
  readonly requirements: readonly P9R3TargetedRequalificationRequirement[]
}

function preimageFromInput(value: unknown): ResultPreimage {
  const input = validateInput(value)
  const source = input.sourceResult
  const requirements = Object.freeze(
    source.impactedSubjects.map((impact) => requirementFromImpact(source.resultIdentity, source.revision, impact)),
  )
  return Object.freeze({
    version: P9_R3_TARGETED_REQUALIFICATION_REQUIREMENT_VERSION,
    revision: source.revision,
    sourceResultIdentity: source.resultIdentity,
    changedDependencyKeys: Object.freeze([...source.changedDependencyKeys]),
    requirements,
  })
}

function resultIdentity(preimage: ResultPreimage): string {
  return digest(RESULT_DOMAIN, preimage)
}

export function p9R3TargetedRequalificationRequirementResultIdentity(
  input: P9R3TargetedRequalificationRequirementInput,
): string {
  return resultIdentity(preimageFromInput(input))
}

export function buildP9R3TargetedRequalificationRequirement(
  input: P9R3TargetedRequalificationRequirementInput,
): P9R3TargetedRequalificationRequirementResult {
  const preimage = preimageFromInput(input)
  return Object.freeze({ ...preimage, resultIdentity: resultIdentity(preimage) })
}

function parseRevision(value: unknown, label: string): P9R1RevisionBinding {
  const input = record(value, REVISION_KEYS, label)
  return Object.freeze({
    repositoryId: requireString(input.repositoryId, `${label}.repositoryId`),
    canonicalBase: gitSha40(input.canonicalBase, `${label}.canonicalBase`),
    candidateHead: gitSha40(input.candidateHead, `${label}.candidateHead`),
  })
}

function parseStringArray(value: unknown, label: string, maximum: number): readonly string[] {
  return Object.freeze(arrayValues(value, label, maximum).map((item, index) => requireString(item, `${label}[${index}]`)))
}

function parseRequirement(value: unknown, label: string): P9R3TargetedRequalificationRequirement {
  const input = record(value, REQUIREMENT_KEYS, label)
  if (input.state !== P9_R3_STATE) fail(`${label}.state`, `must equal ${P9_R3_STATE}`)
  if (input.continuation !== P9_R3_CONTINUATION) fail(`${label}.continuation`, `must equal ${P9_R3_CONTINUATION}`)
  if (input.requalification !== P9_R3_REQUALIFICATION) fail(`${label}.requalification`, `must equal ${P9_R3_REQUALIFICATION}`)
  return Object.freeze({
    subjectIdentity: sha256(input.subjectIdentity, `${label}.subjectIdentity`),
    decisionIdentity: sha256(input.decisionIdentity, `${label}.decisionIdentity`),
    matchedChangedDependencyKeys: parseStringArray(
      input.matchedChangedDependencyKeys,
      `${label}.matchedChangedDependencyKeys`,
      P9_R2_LIMITS.maxChangedDependencyKeys,
    ),
    state: P9_R3_STATE,
    continuation: P9_R3_CONTINUATION,
    requalification: P9_R3_REQUALIFICATION,
    requirementIdentity: sha256(input.requirementIdentity, `${label}.requirementIdentity`),
  })
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index])
}

function sameRevision(left: P9R1RevisionBinding, right: P9R1RevisionBinding): boolean {
  return left.repositoryId === right.repositoryId
    && left.canonicalBase === right.canonicalBase
    && left.candidateHead === right.candidateHead
}

function sameRequirements(
  left: readonly P9R3TargetedRequalificationRequirement[],
  right: readonly P9R3TargetedRequalificationRequirement[],
): boolean {
  return left.length === right.length && left.every((item, index) => {
    const expected = right[index]!
    return item.subjectIdentity === expected.subjectIdentity
      && item.decisionIdentity === expected.decisionIdentity
      && sameStrings(item.matchedChangedDependencyKeys, expected.matchedChangedDependencyKeys)
      && item.state === expected.state
      && item.continuation === expected.continuation
      && item.requalification === expected.requalification
      && item.requirementIdentity === expected.requirementIdentity
  })
}

export function validateP9R3TargetedRequalificationRequirementResult(
  value: unknown,
  source: P9R3TargetedRequalificationRequirementInput,
): P9R3TargetedRequalificationRequirementResult {
  const input = record(value, RESULT_KEYS, "result")
  if (input.version !== P9_R3_TARGETED_REQUALIFICATION_REQUIREMENT_VERSION) {
    fail("result.version", `must equal ${P9_R3_TARGETED_REQUALIFICATION_REQUIREMENT_VERSION}`)
  }
  const revision = parseRevision(input.revision, "result.revision")
  const sourceResultIdentity = sha256(input.sourceResultIdentity, "result.sourceResultIdentity")
  const changedDependencyKeys = parseStringArray(
    input.changedDependencyKeys,
    "result.changedDependencyKeys",
    P9_R2_LIMITS.maxChangedDependencyKeys,
  )
  const requirementValues = arrayValues(input.requirements, "result.requirements", P9_R2_LIMITS.maxSubjectDecisions)
  const requirements = Object.freeze(requirementValues.map((item, index) => parseRequirement(item, `result.requirements[${index}]`)))
  const actualResultIdentity = sha256(input.resultIdentity, "result.resultIdentity")

  const expected = preimageFromInput(source)
  const expectedIdentity = resultIdentity(expected)
  if (!sameRevision(revision, expected.revision)) fail("result.revision", "does not match canonical source revision")
  if (sourceResultIdentity !== expected.sourceResultIdentity) fail("result.sourceResultIdentity", "does not match canonical P9-R2 result")
  if (!sameStrings(changedDependencyKeys, expected.changedDependencyKeys)) {
    fail("result.changedDependencyKeys", "does not match canonical P9-R2 changed-key set")
  }
  if (!sameRequirements(requirements, expected.requirements)) {
    fail("result.requirements", "does not match canonical P9-R2 impact projection")
  }
  if (actualResultIdentity !== expectedIdentity) fail("result.resultIdentity", "does not match canonical semantic content")
  return Object.freeze({ ...expected, resultIdentity: expectedIdentity })
}
