import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  buildP9R1FreshnessDependencyInvalidationDecision,
  type P9R1DependencyInput,
  type P9R1FreshnessDependencyInvalidationDecision,
  type P9R1RevisionBinding,
} from "../src/continuous-assurance/p9-r1-freshness-dependency-invalidation.ts"
import {
  buildP9R2ImpactedSubjectResolution,
  type P9R2ImpactedSubjectResolutionInput,
} from "../src/continuous-assurance/p9-r2-impacted-subject-resolution.ts"
import {
  P9_R3_CONTINUATION,
  P9_R3_REQUALIFICATION,
  P9_R3_STATE,
  P9_R3_TARGETED_REQUALIFICATION_REQUIREMENT_VERSION,
  buildP9R3TargetedRequalificationRequirement,
  p9R3TargetedRequalificationRequirementResultIdentity,
  validateP9R3TargetedRequalificationRequirementResult,
  type P9R3TargetedRequalificationRequirementInput,
} from "../src/continuous-assurance/p9-r3-targeted-requalification-requirement.ts"

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
  new URL("../../../schema/p9-r3-targeted-requalification-requirement.schema.json", import.meta.url),
  "utf8",
)) as SchemaRecord

function dependency(
  key: string,
  expectedIdentity = SHA_A,
  observedIdentity: string | null = SHA_B,
  dependencyClass: P9R1DependencyInput["dependencyClass"] = "RULESET",
): P9R1DependencyInput {
  return { dependencyClass, dependencyKey: key, expectedIdentity, observedIdentity }
}

function decision(
  subjectIdentity: string,
  dependencies: readonly P9R1DependencyInput[],
  revision: P9R1RevisionBinding = REVISION,
): P9R1FreshnessDependencyInvalidationDecision {
  return buildP9R1FreshnessDependencyInvalidationDecision({ subjectIdentity, revision, dependencies })
}

function staleDecision(
  subjectIdentity = SHA_D,
  key = "ruleset/main",
  revision: P9R1RevisionBinding = REVISION,
): P9R1FreshnessDependencyInvalidationDecision {
  return decision(subjectIdentity, [dependency(key)], revision)
}

function currentDecision(subjectIdentity = SHA_E): P9R1FreshnessDependencyInvalidationDecision {
  return decision(subjectIdentity, [dependency("pr/head", SHA_A, SHA_A, "PR_HEAD")])
}

function unknownDecision(subjectIdentity = SHA_F): P9R1FreshnessDependencyInvalidationDecision {
  return decision(subjectIdentity, [dependency("skill/reviewer", SHA_A, null, "SKILL")])
}

function r2Source(
  changedDependencyKeys: readonly string[] = ["ruleset/main"],
  subjectDecisions: readonly P9R1FreshnessDependencyInvalidationDecision[] = [staleDecision()],
  revision: P9R1RevisionBinding = REVISION,
): P9R2ImpactedSubjectResolutionInput {
  return { revision, changedDependencyKeys, subjectDecisions }
}

function r3Input(sourceInput: P9R2ImpactedSubjectResolutionInput = r2Source()): P9R3TargetedRequalificationRequirementInput {
  return { sourceInput, sourceResult: buildP9R2ImpactedSubjectResolution(sourceInput) }
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

function runtimeAccepts(value: unknown, source: P9R3TargetedRequalificationRequirementInput): boolean {
  try {
    validateP9R3TargetedRequalificationRequirementResult(value, source)
    return true
  } catch {
    return false
  }
}

test("P9-R3 projects one impacted subject into one STALE BLOCK REQUIRED requirement", () => {
  const input = r3Input()
  const result = buildP9R3TargetedRequalificationRequirement(input)
  assert.equal(result.version, P9_R3_TARGETED_REQUALIFICATION_REQUIREMENT_VERSION)
  assert.equal(result.sourceResultIdentity, input.sourceResult.resultIdentity)
  assert.deepEqual(result.changedDependencyKeys, ["ruleset/main"])
  assert.equal(result.requirements.length, 1)
  assert.deepEqual(result.requirements[0]?.matchedChangedDependencyKeys, ["ruleset/main"])
  assert.equal(result.requirements[0]?.state, P9_R3_STATE)
  assert.equal(result.requirements[0]?.continuation, P9_R3_CONTINUATION)
  assert.equal(result.requirements[0]?.requalification, P9_R3_REQUALIFICATION)
})

test("P9-R3 projects multiple impacted subjects in canonical R2 subject order", () => {
  const source = r2Source(["ruleset/main"], [staleDecision(SHA_E), staleDecision(SHA_D)])
  const result = buildP9R3TargetedRequalificationRequirement(r3Input(source))
  assert.deepEqual(result.requirements.map((item) => item.subjectIdentity), [SHA_D, SHA_E])
  assert.equal(new Set(result.requirements.map((item) => item.requirementIdentity)).size, 2)
})

test("P9-R3 emits empty requirements when canonical R2 has zero impacted subjects", () => {
  const source = r2Source(["skill/reviewer"], [staleDecision(SHA_D, "ruleset/main")])
  const input = r3Input(source)
  assert.deepEqual(input.sourceResult.impactedSubjects, [])
  const result = buildP9R3TargetedRequalificationRequirement(input)
  assert.deepEqual(result.requirements, [])
  assert.deepEqual(result.changedDependencyKeys, ["skill/reviewer"])
})

test("P9-R3 does not create requirements for CURRENT or UNKNOWN decisions", () => {
  const source = r2Source(["pr/head", "skill/reviewer"], [currentDecision(), unknownDecision()])
  const result = buildP9R3TargetedRequalificationRequirement(r3Input(source))
  assert.deepEqual(result.requirements, [])
})

test("P9-R3 preserves exact matched-key projection and never adds unmatched query keys", () => {
  const stale = decision(SHA_D, [
    dependency("authorization/main", SHA_A, SHA_B, "AUTHORIZATION"),
    dependency("ruleset/main", SHA_A, SHA_C, "RULESET"),
  ])
  const source = r2Source(["authorization/main", "ruleset/main", "skill/reviewer"], [stale])
  const result = buildP9R3TargetedRequalificationRequirement(r3Input(source))
  assert.deepEqual(result.requirements[0]?.matchedChangedDependencyKeys, ["authorization/main", "ruleset/main"])
})

test("P9-R3 requires exact P9-R2 source/result revalidation", () => {
  const input = clone(r3Input()) as unknown as MutableRecord
  const sourceResult = input.sourceResult as MutableRecord
  sourceResult.resultIdentity = SHA_F
  assert.throws(() => buildP9R3TargetedRequalificationRequirement(input as never), /resultIdentity/)
})

test("P9-R3 rejects forged P9-R2 impact projection before deriving requirement truth", () => {
  const input = clone(r3Input()) as unknown as MutableRecord
  const sourceResult = input.sourceResult as MutableRecord
  ;(sourceResult.impactedSubjects as MutableRecord[])[0]!.subjectIdentity = SHA_E
  assert.throws(() => buildP9R3TargetedRequalificationRequirement(input as never), /impact projection/)
})

test("P9-R3 rejects cross-revision P9-R2 source/result substitution", () => {
  const original = r3Input()
  const otherRevision = { ...REVISION, candidateHead: OTHER_HEAD }
  const otherSource = r2Source(["ruleset/main"], [staleDecision(SHA_D, "ruleset/main", otherRevision)], otherRevision)
  assert.throws(
    () => buildP9R3TargetedRequalificationRequirement({ sourceInput: otherSource, sourceResult: original.sourceResult }),
    /revision|canonical source/,
  )
})

test("P9-R3 result validator accepts canonical result and rejects literal forgery", () => {
  const input = r3Input()
  const result = buildP9R3TargetedRequalificationRequirement(input)
  assert.equal(validateP9R3TargetedRequalificationRequirementResult(result, input).resultIdentity, result.resultIdentity)
  for (const [field, value] of [
    ["state", "CURRENT"],
    ["continuation", "ALLOW"],
    ["requalification", "OPTIONAL"],
  ] as const) {
    const forged = clone(result) as unknown as MutableRecord
    ;((forged.requirements as MutableRecord[])[0]!)[field] = value
    assert.throws(() => validateP9R3TargetedRequalificationRequirementResult(forged, input), new RegExp(field))
  }
})

test("P9-R3 validator rejects missing extra duplicate reordered and substituted requirements", () => {
  const source = r2Source(["ruleset/main"], [staleDecision(SHA_D), staleDecision(SHA_E)])
  const input = r3Input(source)
  const result = buildP9R3TargetedRequalificationRequirement(input)
  const missing = clone(result) as unknown as MutableRecord
  ;(missing.requirements as unknown[]).pop()
  assert.throws(() => validateP9R3TargetedRequalificationRequirementResult(missing, input), /requirements/)
  const extra = clone(result) as unknown as MutableRecord
  ;(extra.requirements as unknown[]).push(clone((extra.requirements as unknown[])[0]))
  assert.throws(() => validateP9R3TargetedRequalificationRequirementResult(extra, input), /requirements/)
  const reordered = clone(result) as unknown as MutableRecord
  ;(reordered.requirements as unknown[]).reverse()
  assert.throws(() => validateP9R3TargetedRequalificationRequirementResult(reordered, input), /requirements/)
  const substituted = clone(result) as unknown as MutableRecord
  ;((substituted.requirements as MutableRecord[])[0]!).subjectIdentity = SHA_F
  assert.throws(() => validateP9R3TargetedRequalificationRequirementResult(substituted, input), /requirements/)
})

test("P9-R3 validator rejects requirement and result identity tampering", () => {
  const input = r3Input()
  const result = buildP9R3TargetedRequalificationRequirement(input)
  const requirement = clone(result) as unknown as MutableRecord
  ;((requirement.requirements as MutableRecord[])[0]!).requirementIdentity = SHA_F
  assert.throws(() => validateP9R3TargetedRequalificationRequirementResult(requirement, input), /requirements/)
  const aggregate = clone(result) as unknown as MutableRecord
  aggregate.resultIdentity = SHA_F
  assert.throws(() => validateP9R3TargetedRequalificationRequirementResult(aggregate, input), /resultIdentity/)
})

test("P9-R3 identities bind source R2 identity and impact semantics", () => {
  const base = r3Input()
  const extraQuery = r3Input(r2Source(["ruleset/main", "skill/reviewer"], [staleDecision()]))
  const otherSubject = r3Input(r2Source(["ruleset/main"], [staleDecision(SHA_E)]))
  const a = buildP9R3TargetedRequalificationRequirement(base)
  const b = buildP9R3TargetedRequalificationRequirement(extraQuery)
  const c = buildP9R3TargetedRequalificationRequirement(otherSubject)
  assert.notEqual(a.resultIdentity, b.resultIdentity)
  assert.notEqual(a.resultIdentity, c.resultIdentity)
  assert.notEqual(a.requirements[0]?.requirementIdentity, b.requirements[0]?.requirementIdentity)
  assert.notEqual(a.requirements[0]?.requirementIdentity, c.requirements[0]?.requirementIdentity)
})

test("P9-R3 ignores benign root object-key insertion order", () => {
  const canonical = r3Input()
  const reordered = {
    sourceResult: canonical.sourceResult,
    sourceInput: canonical.sourceInput,
  } as P9R3TargetedRequalificationRequirementInput
  assert.equal(
    p9R3TargetedRequalificationRequirementResultIdentity(canonical),
    p9R3TargetedRequalificationRequirementResultIdentity(reordered),
  )
})

test("P9-R3 output is detached deeply frozen and caller mutation cannot alter it", () => {
  const mutable = clone(r3Input())
  const result = buildP9R3TargetedRequalificationRequirement(mutable)
  assertDeepFrozen(result)
  ;(mutable.sourceResult.impactedSubjects as any)[0].subjectIdentity = SHA_F
  assert.equal(result.requirements[0]?.subjectIdentity, SHA_D)
  const validated = validateP9R3TargetedRequalificationRequirementResult(result, r3Input())
  assertDeepFrozen(validated)
  assert.notEqual(validated, result)
})

test("P9-R3 fails closed on active and revoked Proxy root input before traps execute", () => {
  let traps = 0
  const active = new Proxy(r3Input() as unknown as object, {
    get() { traps += 1; throw new Error("trap") },
    ownKeys() { traps += 1; throw new Error("trap") },
    getPrototypeOf() { traps += 1; throw new Error("trap") },
  })
  assert.throws(() => buildP9R3TargetedRequalificationRequirement(active as never), /must not be a Proxy/)
  assert.equal(traps, 0)
  const pair = Proxy.revocable(r3Input() as unknown as object, {})
  pair.revoke()
  assert.throws(() => buildP9R3TargetedRequalificationRequirement(pair.proxy as never), /must not be a Proxy/)
})

test("P9-R3 rejects nested Proxy predecessor objects without caller trap execution", () => {
  let traps = 0
  const canonical = r3Input()
  const proxied = new Proxy(canonical.sourceResult as unknown as object, {
    get() { traps += 1; throw new Error("trap") },
    ownKeys() { traps += 1; throw new Error("trap") },
    getPrototypeOf() { traps += 1; throw new Error("trap") },
  })
  assert.throws(
    () => buildP9R3TargetedRequalificationRequirement({ sourceInput: canonical.sourceInput, sourceResult: proxied as never }),
    /must not be a Proxy/,
  )
  assert.equal(traps, 0)
})

test("P9-R3 validator rejects accessor symbol non-enumerable and sparse R3-owned structures", () => {
  const input = r3Input()
  const result = buildP9R3TargetedRequalificationRequirement(input)
  const accessor = clone(result) as unknown as MutableRecord
  Object.defineProperty(accessor, "resultIdentity", { enumerable: true, get() { throw new Error("getter") } })
  assert.throws(() => validateP9R3TargetedRequalificationRequirementResult(accessor, input), /enumerable data property/)
  const symbol = clone(result) as unknown as MutableRecord
  Object.defineProperty(symbol, Symbol("hidden"), { value: true })
  assert.throws(() => validateP9R3TargetedRequalificationRequirementResult(symbol, input), /symbol/)
  const hidden = clone(result) as unknown as MutableRecord
  Object.defineProperty(hidden, "hidden", { enumerable: false, value: true })
  assert.throws(() => validateP9R3TargetedRequalificationRequirementResult(hidden, input), /invalid key set/)
  const sparse = clone(result) as unknown as MutableRecord
  const requirements = new Array(2)
  requirements[0] = (sparse.requirements as unknown[])[0]
  sparse.requirements = requirements
  assert.throws(() => validateP9R3TargetedRequalificationRequirementResult(sparse, input), /dense/)
})

test("P9-R3 rejects custom-prototype and cyclic root input", () => {
  const custom = Object.assign(Object.create({ inherited: true }), r3Input())
  assert.throws(() => buildP9R3TargetedRequalificationRequirement(custom), /plain object/)
  const cyclic = clone(r3Input()) as unknown as MutableRecord
  cyclic.sourceInput = cyclic
  assert.throws(() => buildP9R3TargetedRequalificationRequirement(cyclic as never))
})

test("P9-R3 schema and runtime agree on canonical serialized structural fixtures", () => {
  const input = r3Input()
  const canonical = buildP9R3TargetedRequalificationRequirement(input)
  const fixtures: unknown[] = [
    canonical,
    { ...canonical, version: "wrong" },
    { ...canonical, resultIdentity: "A".repeat(64) },
    { ...canonical, extra: true },
    { ...canonical, requirements: [{ ...canonical.requirements[0], state: "CURRENT" }] },
    { ...canonical, requirements: [{ ...canonical.requirements[0], continuation: "ALLOW" }] },
    { ...canonical, requirements: [{ ...canonical.requirements[0], requalification: "OPTIONAL" }] },
  ]
  for (const fixture of fixtures) {
    assert.equal(schemaAccepts(schema, fixture), runtimeAccepts(fixture, input), JSON.stringify(fixture))
  }
})

test("P9-R3 schema mirrors exact serialized keys literals and cardinality bounds", () => {
  assert.equal(schema.additionalProperties, false)
  assert.deepEqual(Object.keys(schema.properties).sort(), [
    "changedDependencyKeys", "requirements", "resultIdentity", "revision", "sourceResultIdentity", "version",
  ])
  assert.equal(schema.properties.changedDependencyKeys.minItems, 1)
  assert.equal(schema.properties.changedDependencyKeys.maxItems, 64)
  assert.equal(schema.properties.requirements.maxItems, 256)
  assert.equal(schema.$defs.requirement.properties.state.const, "STALE")
  assert.equal(schema.$defs.requirement.properties.continuation.const, "BLOCK")
  assert.equal(schema.$defs.requirement.properties.requalification.const, "REQUIRED")
})

test("P9-R3 production surface remains pure and contains no execution or persistence authority", () => {
  const source = readFileSync(
    new URL("../src/continuous-assurance/p9-r3-targeted-requalification-requirement.ts", import.meta.url),
    "utf8",
  )
  for (const forbidden of [
    "node:fs", "node:child_process", "node:http", "node:https", "node:net", "node:dns",
    "fetch(", "spawn(", "exec(", "writeFile", "setTimeout(", "setInterval(", "process.env",
    "K2Mutation", "applyPatch", "provider.invoke", "reviewer.execute",
  ]) {
    assert.equal(source.includes(forbidden), false, forbidden)
  }
  assert.match(source, /validateP9R2ImpactedSubjectResolutionResult/)
})
