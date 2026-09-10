import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  buildP9R1FreshnessDependencyInvalidationDecision,
  type P9R1DependencyInput,
  type P9R1FreshnessDependencyInvalidationDecision,
  type P9R1FreshnessDependencyInvalidationInput,
  type P9R1RevisionBinding,
} from "../src/continuous-assurance/p9-r1-freshness-dependency-invalidation.ts"
import {
  P9_R2_IMPACTED_SUBJECT_RESOLUTION_VERSION,
  P9_R2_LIMITS,
  buildP9R2ImpactedSubjectResolution,
  p9R2ImpactedSubjectResolutionIdentity,
  validateP9R2ImpactedSubjectResolutionResult,
  type P9R2ImpactedSubjectResolutionInput,
} from "../src/continuous-assurance/p9-r2-impacted-subject-resolution.ts"

type MutableRecord = Record<string, unknown>
type SchemaRecord = Record<string, any>

const BASE = "1".repeat(40)
const HEAD = "2".repeat(40)
const OTHER_HEAD = "3".repeat(40)
const SHA_A = "a".repeat(64)
const SHA_B = "b".repeat(64)
const SHA_C = "c".repeat(64)
const SHA_D = "d".repeat(64)
const SHA_E = "e".repeat(64)
const SHA_F = "f".repeat(64)

const REVISION: P9R1RevisionBinding = Object.freeze({
  repositoryId: "github.com/TheHalfMoon/Kodac",
  canonicalBase: BASE,
  candidateHead: HEAD,
})

const schema = JSON.parse(readFileSync(
  new URL("../../../schema/p9-r2-impacted-subject-resolution.schema.json", import.meta.url),
  "utf8",
)) as SchemaRecord

function dependency(
  dependencyKey: string,
  expectedIdentity = SHA_A,
  observedIdentity: string | null = expectedIdentity,
  dependencyClass: P9R1DependencyInput["dependencyClass"] = "PR_HEAD",
): P9R1DependencyInput {
  return { dependencyClass, dependencyKey, expectedIdentity, observedIdentity }
}

function r1Decision(
  subjectIdentity: string,
  dependencies: readonly P9R1DependencyInput[],
  revision: P9R1RevisionBinding = REVISION,
): P9R1FreshnessDependencyInvalidationDecision {
  const input: P9R1FreshnessDependencyInvalidationInput = { subjectIdentity, revision, dependencies }
  return buildP9R1FreshnessDependencyInvalidationDecision(input)
}

function staleDecision(
  subjectIdentity = SHA_D,
  dependencyKey = "ruleset/main",
  revision: P9R1RevisionBinding = REVISION,
): P9R1FreshnessDependencyInvalidationDecision {
  return r1Decision(subjectIdentity, [dependency(dependencyKey, SHA_A, SHA_B, "RULESET")], revision)
}

function source(
  changedDependencyKeys: readonly string[] = ["ruleset/main"],
  subjectDecisions: readonly P9R1FreshnessDependencyInvalidationDecision[] = [staleDecision()],
  revision: P9R1RevisionBinding = REVISION,
): P9R2ImpactedSubjectResolutionInput {
  return { revision, changedDependencyKeys, subjectDecisions }
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function assertDeepFrozen(value: unknown): void {
  if (value === null || typeof value !== "object") return
  assert.equal(Object.isFrozen(value), true)
  for (const child of Object.values(value as Record<string, unknown>)) assertDeepFrozen(child)
}

function schemaAccepts(nodeValue: unknown, value: unknown, root = schema): boolean {
  if (nodeValue === true) return true
  if (nodeValue === false || nodeValue === null || typeof nodeValue !== "object") return false
  const node = nodeValue as SchemaRecord
  if (typeof node.$ref === "string") {
    if (!node.$ref.startsWith("#/$defs/")) return false
    return schemaAccepts(root.$defs[node.$ref.slice("#/$defs/".length)], value, root)
  }
  if (Array.isArray(node.oneOf)) {
    if (node.oneOf.filter((child: unknown) => schemaAccepts(child, value, root)).length !== 1) return false
  }
  if (Object.hasOwn(node, "const") && JSON.stringify(value) !== JSON.stringify(node.const)) return false
  if (Array.isArray(node.enum) && !node.enum.some((candidate: unknown) => JSON.stringify(candidate) === JSON.stringify(value))) return false
  if (node.type === "string") {
    if (typeof value !== "string") return false
    const length = [...value].length
    if (typeof node.minLength === "number" && length < node.minLength) return false
    if (typeof node.maxLength === "number" && length > node.maxLength) return false
    if (typeof node.pattern === "string" && !new RegExp(node.pattern).test(value)) return false
    return true
  }
  if (node.type === "array") {
    if (!Array.isArray(value)) return false
    if (typeof node.minItems === "number" && value.length < node.minItems) return false
    if (typeof node.maxItems === "number" && value.length > node.maxItems) return false
    if (node.uniqueItems === true) {
      const serialized = value.map((item) => JSON.stringify(item))
      if (new Set(serialized).size !== serialized.length) return false
    }
    return node.items === undefined || value.every((item) => schemaAccepts(node.items, item, root))
  }
  if (node.type === "object" || node.properties !== undefined || node.required !== undefined || node.additionalProperties !== undefined) {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return false
    const record = value as MutableRecord
    const properties = (node.properties ?? {}) as SchemaRecord
    if (Array.isArray(node.required) && node.required.some((key: string) => !Object.hasOwn(record, key))) return false
    if (node.additionalProperties === false && Object.keys(record).some((key) => !Object.hasOwn(properties, key))) return false
    return Object.entries(properties).every(([key, child]) => !Object.hasOwn(record, key) || schemaAccepts(child, record[key], root))
  }
  return true
}

function runtimeAccepts(value: unknown, input: P9R2ImpactedSubjectResolutionInput): boolean {
  try {
    validateP9R2ImpactedSubjectResolutionResult(value, input)
    return true
  } catch {
    return false
  }
}

test("P9-R2 resolves one stale subject for one queried changed dependency", () => {
  const input = source()
  const result = buildP9R2ImpactedSubjectResolution(input)
  assert.equal(result.version, P9_R2_IMPACTED_SUBJECT_RESOLUTION_VERSION)
  assert.deepEqual(result.changedDependencyKeys, ["ruleset/main"])
  assert.equal(result.impactedSubjects.length, 1)
  assert.equal(result.impactedSubjects[0]?.subjectIdentity, SHA_D)
  assert.deepEqual(result.impactedSubjects[0]?.matchedChangedDependencyKeys, ["ruleset/main"])
  assert.deepEqual(result.unmatchedChangedDependencyKeys, [])
  assert.equal(validateP9R2ImpactedSubjectResolutionResult(result, input).resultIdentity, result.resultIdentity)
})

test("P9-R2 does not infer impact from CURRENT or UNKNOWN decisions merely because a key is queried", () => {
  const current = r1Decision(SHA_D, [dependency("ruleset/main", SHA_A, SHA_A, "RULESET")])
  const unknown = r1Decision(SHA_E, [dependency("ruleset/main", SHA_A, null, "RULESET")])
  const result = buildP9R2ImpactedSubjectResolution(source(["ruleset/main"], [current, unknown]))
  assert.deepEqual(result.impactedSubjects, [])
  assert.deepEqual(result.unmatchedChangedDependencyKeys, ["ruleset/main"])
})

test("P9-R2 excludes a stale subject whose changed keys are disjoint from the query", () => {
  const result = buildP9R2ImpactedSubjectResolution(source(["skill/reviewer"], [staleDecision(SHA_D, "ruleset/main")]))
  assert.deepEqual(result.impactedSubjects, [])
  assert.deepEqual(result.unmatchedChangedDependencyKeys, ["skill/reviewer"])
})

test("P9-R2 preserves multiple matched keys and derives unmatched keys exactly", () => {
  const decision = r1Decision(SHA_D, [
    dependency("authorization/main", SHA_A, SHA_B, "AUTHORIZATION"),
    dependency("ruleset/main", SHA_A, SHA_C, "RULESET"),
    dependency("skill/reviewer", SHA_A, SHA_A, "SKILL"),
  ])
  const result = buildP9R2ImpactedSubjectResolution(source(
    ["workflow/definition", "ruleset/main", "authorization/main"],
    [decision],
  ))
  assert.deepEqual(result.changedDependencyKeys, ["authorization/main", "ruleset/main", "workflow/definition"])
  assert.deepEqual(result.impactedSubjects[0]?.matchedChangedDependencyKeys, ["authorization/main", "ruleset/main"])
  assert.deepEqual(result.unmatchedChangedDependencyKeys, ["workflow/definition"])
})

test("P9-R2 canonicalizes changed keys and subject order without changing semantic identity", () => {
  const a = staleDecision(SHA_D, "ruleset/main")
  const b = staleDecision(SHA_E, "skill/reviewer")
  const left = source(["skill/reviewer", "ruleset/main"], [b, a])
  const right = source(["ruleset/main", "skill/reviewer"], [a, b])
  const first = buildP9R2ImpactedSubjectResolution(left)
  const second = buildP9R2ImpactedSubjectResolution(right)
  assert.deepEqual(first, second)
  assert.equal(p9R2ImpactedSubjectResolutionIdentity(left), p9R2ImpactedSubjectResolutionIdentity(right))
  assert.deepEqual(first.impactedSubjects.map((item) => item.subjectIdentity), [SHA_D, SHA_E])
  assert.deepEqual(first.subjectDecisionIdentities, [...first.subjectDecisionIdentities].sort())
})

test("P9-R2 resolves multiple subjects deterministically and keeps one decision identity per subject", () => {
  const decisions = [
    staleDecision(SHA_F, "ruleset/main"),
    staleDecision(SHA_D, "ruleset/main"),
    staleDecision(SHA_E, "ruleset/main"),
  ]
  const result = buildP9R2ImpactedSubjectResolution(source(["ruleset/main"], decisions))
  assert.deepEqual(result.impactedSubjects.map((item) => item.subjectIdentity), [SHA_D, SHA_E, SHA_F])
  assert.equal(new Set(result.impactedSubjects.map((item) => item.decisionIdentity)).size, 3)
})

test("P9-R2 rejects empty, duplicate, oversized, and malformed changed dependency keys", () => {
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source([], [staleDecision()])), /at least 1/)
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source(["ruleset/main", "ruleset/main"])), /duplicate dependency keys/)
  const tooMany = Array.from({ length: P9_R2_LIMITS.maxChangedDependencyKeys + 1 }, (_, index) => `dep/${index}`)
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source(tooMany)), /exceeds 64 entries/)
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source(["Ruleset/Main"])), /must match/)
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source(["dépendency"])), /must match/)
})

test("P9-R2 rejects empty, oversized, duplicate-decision, and duplicate-subject decision sets", () => {
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source(["ruleset/main"], [])), /at least 1/)
  const one = staleDecision(SHA_D)
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source(["ruleset/main"], [one, one])), /duplicate decisionIdentity/)
  const sameSubjectDifferentDecision = staleDecision(SHA_D, "authorization/main")
  assert.throws(
    () => buildP9R2ImpactedSubjectResolution(source(["ruleset/main"], [one, sameSubjectDifferentDecision])),
    /duplicate subjectIdentity/,
  )
  const oversized = Array.from({ length: P9_R2_LIMITS.maxSubjectDecisions + 1 }, (_, index) => {
    const prefix = index.toString(16).padStart(4, "0")
    return staleDecision((prefix + "a".repeat(64)).slice(0, 64), `dep/${index}`)
  })
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source(["dep/0"], oversized)), /exceeds 256 entries/)
})

test("P9-R2 rejects any subject decision bound to a different revision", () => {
  const otherRevision = { ...REVISION, candidateHead: OTHER_HEAD }
  const decision = staleDecision(SHA_D, "ruleset/main", otherRevision)
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source(["ruleset/main"], [decision])), /must match the query revision/)
})

test("P9-R2 validates every supplied P9-R1 decision and rejects forged derived state or identity", () => {
  const valid = staleDecision()
  const forgedState = clone(valid) as unknown as MutableRecord
  forgedState.state = "CURRENT"
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source(["ruleset/main"], [forgedState as never])), /freshness state/)
  const forgedKeys = clone(valid) as unknown as MutableRecord
  forgedKeys.changedDependencyKeys = []
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source(["ruleset/main"], [forgedKeys as never])), /changedDependencyKeys/)
  const forgedIdentity = clone(valid) as unknown as MutableRecord
  forgedIdentity.decisionIdentity = SHA_F
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source(["ruleset/main"], [forgedIdentity as never])), /decisionIdentity/)
})

test("P9-R2 rejects malformed revision and unknown or missing input fields", () => {
  const invalidRevision = clone(source()) as unknown as MutableRecord
  ;(invalidRevision.revision as MutableRecord).candidateHead = "A".repeat(40)
  assert.throws(() => buildP9R2ImpactedSubjectResolution(invalidRevision as never), /candidateHead/)
  const extra = { ...source(), extra: true }
  assert.throws(() => buildP9R2ImpactedSubjectResolution(extra as never), /invalid key set/)
  const missing = clone(source()) as unknown as MutableRecord
  delete missing.revision
  assert.throws(() => buildP9R2ImpactedSubjectResolution(missing as never), /invalid key set/)
})

test("P9-R2 result validator accepts canonical output and rejects forged semantic projections", () => {
  const input = source(["authorization/main", "ruleset/main"], [r1Decision(SHA_D, [
    dependency("authorization/main", SHA_A, SHA_B, "AUTHORIZATION"),
    dependency("ruleset/main", SHA_A, SHA_C, "RULESET"),
  ])])
  const result = buildP9R2ImpactedSubjectResolution(input)
  assert.equal(runtimeAccepts(result, input), true)
  const cases: Array<(value: MutableRecord) => void> = [
    (value) => { value.changedDependencyKeys = ["ruleset/main"] },
    (value) => { value.subjectDecisionIdentities = [SHA_F] },
    (value) => { value.impactedSubjects = [] },
    (value) => { value.unmatchedChangedDependencyKeys = ["authorization/main"] },
    (value) => { value.resultIdentity = SHA_F },
    (value) => { (value.revision as MutableRecord).candidateHead = OTHER_HEAD },
  ]
  for (const mutate of cases) {
    const forged = clone(result) as unknown as MutableRecord
    mutate(forged)
    assert.equal(runtimeAccepts(forged, input), false)
  }
})

test("P9-R2 result validator rejects noncanonical output ordering and duplicates", () => {
  const input = source(["skill/reviewer", "ruleset/main"], [
    staleDecision(SHA_D, "ruleset/main"),
    staleDecision(SHA_E, "skill/reviewer"),
  ])
  const result = buildP9R2ImpactedSubjectResolution(input)
  const changed = clone(result) as unknown as MutableRecord
  changed.changedDependencyKeys = [...result.changedDependencyKeys].reverse()
  assert.throws(() => validateP9R2ImpactedSubjectResolutionResult(changed, input), /canonical dependency-key order/)
  const subjects = clone(result) as unknown as MutableRecord
  subjects.impactedSubjects = [...(subjects.impactedSubjects as unknown[])].reverse()
  assert.throws(() => validateP9R2ImpactedSubjectResolutionResult(subjects, input), /sorted by subjectIdentity/)
  const decisions = clone(result) as unknown as MutableRecord
  decisions.subjectDecisionIdentities = [result.subjectDecisionIdentities[0], result.subjectDecisionIdentities[0]]
  assert.throws(() => validateP9R2ImpactedSubjectResolutionResult(decisions, input), /duplicate identities/)
})

test("P9-R2 result identity binds revision, query key set, decision set, and impact projection", () => {
  const baseInput = source(["ruleset/main"], [staleDecision(SHA_D)])
  const base = buildP9R2ImpactedSubjectResolution(baseInput)
  const variants = [
    source(["ruleset/main", "skill/reviewer"], [staleDecision(SHA_D)]),
    source(["ruleset/main"], [staleDecision(SHA_E)]),
    source(["ruleset/main"], [staleDecision(SHA_D)], { ...REVISION, candidateHead: OTHER_HEAD }),
  ]
  for (let variant of variants) {
    if (variant.revision.candidateHead === OTHER_HEAD) {
      variant = source(["ruleset/main"], [staleDecision(SHA_D, "ruleset/main", variant.revision)], variant.revision)
    }
    assert.notEqual(buildP9R2ImpactedSubjectResolution(variant).resultIdentity, base.resultIdentity)
  }
})

test("P9-R2 builder and validator return detached deeply frozen results", () => {
  const mutable = clone(source())
  const built = buildP9R2ImpactedSubjectResolution(mutable)
  assertDeepFrozen(built)
  ;(mutable.changedDependencyKeys as string[])[0] = "other/key"
  ;(mutable.subjectDecisions[0] as any).changedDependencyKeys = ["other/key"]
  assert.deepEqual(built.changedDependencyKeys, ["ruleset/main"])
  assert.deepEqual(built.impactedSubjects[0]?.matchedChangedDependencyKeys, ["ruleset/main"])
  const validated = validateP9R2ImpactedSubjectResolutionResult(built, source())
  assertDeepFrozen(validated)
  assert.notEqual(validated, built)
})

test("P9-R2 fails closed on active and revoked Proxy source objects before traps execute", () => {
  let traps = 0
  const active = new Proxy(source() as unknown as object, {
    get() { traps += 1; throw new Error("trap") },
    ownKeys() { traps += 1; throw new Error("trap") },
    getPrototypeOf() { traps += 1; throw new Error("trap") },
  })
  assert.throws(() => buildP9R2ImpactedSubjectResolution(active as never), /must not be a Proxy/)
  assert.equal(traps, 0)
  const revoked = Proxy.revocable(source() as unknown as object, {})
  revoked.revoke()
  assert.throws(() => buildP9R2ImpactedSubjectResolution(revoked.proxy as never), /must not be a Proxy/)
})

test("P9-R2 rejects proxied arrays, sparse arrays, subclasses, symbols, and accessors", () => {
  let traps = 0
  const proxiedKeys = new Proxy(["ruleset/main"], {
    get() { traps += 1; throw new Error("trap") },
    getPrototypeOf() { traps += 1; throw new Error("trap") },
  })
  assert.throws(() => buildP9R2ImpactedSubjectResolution({ ...source(), changedDependencyKeys: proxiedKeys }), /must not be a Proxy/)
  assert.equal(traps, 0)

  const sparse = new Array(1) as string[]
  assert.throws(() => buildP9R2ImpactedSubjectResolution({ ...source(), changedDependencyKeys: sparse }), /dense/)

  class KeyArray extends Array<string> {}
  assert.throws(() => buildP9R2ImpactedSubjectResolution({ ...source(), changedDependencyKeys: new KeyArray("ruleset/main") }), /standard Array prototype/)

  const symbolInput = { ...source() } as any
  symbolInput[Symbol("hidden")] = true
  assert.throws(() => buildP9R2ImpactedSubjectResolution(symbolInput), /symbol fields/)

  let getterCalls = 0
  const accessor = Object.create(Object.prototype)
  Object.defineProperties(accessor, {
    revision: { enumerable: true, get() { getterCalls += 1; return REVISION } },
    changedDependencyKeys: { enumerable: true, value: ["ruleset/main"] },
    subjectDecisions: { enumerable: true, value: [staleDecision()] },
  })
  assert.throws(() => buildP9R2ImpactedSubjectResolution(accessor), /enumerable data property/)
  assert.equal(getterCalls, 0)
})

test("P9-R2 rejects proxied P9-R1 decisions through the canonical R1 validator without trap execution", () => {
  let traps = 0
  const proxiedDecision = new Proxy(staleDecision() as unknown as object, {
    get() { traps += 1; throw new Error("trap") },
    ownKeys() { traps += 1; throw new Error("trap") },
  })
  assert.throws(() => buildP9R2ImpactedSubjectResolution(source(["ruleset/main"], [proxiedDecision as never])), /must not be a Proxy/)
  assert.equal(traps, 0)
})

test("P9-R2 schema and runtime agree on canonical serialized structural boundary fixtures", () => {
  const input = source(["authorization/main", "ruleset/main"], [r1Decision(SHA_D, [
    dependency("authorization/main", SHA_A, SHA_B, "AUTHORIZATION"),
    dependency("ruleset/main", SHA_A, SHA_C, "RULESET"),
  ])])
  const valid = buildP9R2ImpactedSubjectResolution(input)
  assert.equal(schemaAccepts(schema, valid), true)
  assert.equal(runtimeAccepts(valid, input), true)

  const invalidCases: unknown[] = [
    { ...clone(valid), extra: true },
    { ...clone(valid), version: "other" },
    { ...clone(valid), resultIdentity: "A".repeat(64) },
    { ...clone(valid), changedDependencyKeys: [] },
    { ...clone(valid), subjectDecisionIdentities: [] },
    { ...clone(valid), impactedSubjects: [{ ...clone(valid.impactedSubjects[0]), matchedChangedDependencyKeys: [] }] },
  ]
  for (const invalid of invalidCases) {
    assert.equal(schemaAccepts(schema, invalid), false)
    assert.equal(runtimeAccepts(invalid, input), false)
  }
})

test("P9-R2 schema mirrors exact serialized keys and cardinality bounds", () => {
  assert.equal(schema.properties.version.const, P9_R2_IMPACTED_SUBJECT_RESOLUTION_VERSION)
  assert.equal(schema.properties.changedDependencyKeys.maxItems, P9_R2_LIMITS.maxChangedDependencyKeys)
  assert.equal(schema.properties.subjectDecisionIdentities.maxItems, P9_R2_LIMITS.maxSubjectDecisions)
  assert.equal(schema.properties.impactedSubjects.maxItems, P9_R2_LIMITS.maxSubjectDecisions)
  assert.deepEqual(new Set(schema.required), new Set([
    "version", "revision", "changedDependencyKeys", "subjectDecisionIdentities", "impactedSubjects",
    "unmatchedChangedDependencyKeys", "resultIdentity",
  ]))
  assert.equal(schema.additionalProperties, false)
})

test("P9-R2 production surface remains pure and contains no external observation or side-effect channel", () => {
  const text = readFileSync(
    new URL("../src/continuous-assurance/p9-r2-impacted-subject-resolution.ts", import.meta.url),
    "utf8",
  )
  assert.match(text, /from "node:crypto"/)
  assert.match(text, /from "node:util"/)
  assert.match(text, /from "\.\/p9-r1-freshness-dependency-invalidation\.ts"/)
  for (const forbidden of [
    /node:fs/, /node:child_process/, /node:http/, /node:https/, /fetch\s*\(/, /process\.env/,
    /Date\.now/, /Math\.random/, /setTimeout/, /setInterval/, /exec\s*\(/, /spawn\s*\(/,
  ]) assert.doesNotMatch(text, forbidden)
})
