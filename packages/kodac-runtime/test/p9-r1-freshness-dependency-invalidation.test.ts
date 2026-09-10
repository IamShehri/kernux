import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  P9_R1_DEPENDENCY_CLASSES,
  P9_R1_FRESHNESS_DEPENDENCY_INVALIDATION_VERSION,
  P9_R1_LIMITS,
  buildP9R1FreshnessDependencyInvalidationDecision,
  p9R1FreshnessDecisionIdentity,
  validateP9R1FreshnessDependencyInvalidationDecision,
  type P9R1DependencyInput,
  type P9R1FreshnessDependencyInvalidationInput,
} from "../src/continuous-assurance/p9-r1-freshness-dependency-invalidation.ts"

type MutableRecord = Record<string, unknown>
type SchemaRecord = Record<string, any>

const BASE = "1".repeat(40)
const HEAD = "2".repeat(40)
const SHA_A = "a".repeat(64)
const SHA_B = "b".repeat(64)
const SHA_C = "c".repeat(64)
const SHA_D = "d".repeat(64)

const schema = JSON.parse(readFileSync(
  new URL("../../../schema/p9-r1-freshness-dependency-invalidation.schema.json", import.meta.url),
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

function input(dependencies: readonly P9R1DependencyInput[] = [dependency("pr/head")]): P9R1FreshnessDependencyInvalidationInput {
  return {
    subjectIdentity: SHA_D,
    revision: {
      repositoryId: "github.com/TheHalfMoon/Kodac",
      canonicalBase: BASE,
      candidateHead: HEAD,
    },
    dependencies,
  }
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
  if (Array.isArray(node.allOf) && !node.allOf.every((child: unknown) => schemaAccepts(child, value, root))) return false
  if (Array.isArray(node.oneOf)) {
    if (node.oneOf.filter((child: unknown) => schemaAccepts(child, value, root)).length !== 1) return false
  }
  if (Object.hasOwn(node, "const") && JSON.stringify(value) !== JSON.stringify(node.const)) return false
  if (Array.isArray(node.enum) && !node.enum.some((candidate: unknown) => JSON.stringify(candidate) === JSON.stringify(value))) return false
  if (node.if !== undefined && schemaAccepts(node.if, value, root) && node.then !== undefined && !schemaAccepts(node.then, value, root)) return false
  if (node.type === "null") return value === null
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

function runtimeAccepts(value: unknown): boolean {
  try {
    validateP9R1FreshnessDependencyInvalidationDecision(value)
    return true
  } catch {
    return false
  }
}
test("P9-R1 derives CURRENT and ALLOW only when every dependency matches", () => {
  const decision = buildP9R1FreshnessDependencyInvalidationDecision(input([
    dependency("authorization/main", SHA_A, SHA_A, "AUTHORIZATION"),
    dependency("pr/head", SHA_B, SHA_B, "PR_HEAD"),
  ]))
  assert.equal(decision.version, P9_R1_FRESHNESS_DEPENDENCY_INVALIDATION_VERSION)
  assert.equal(decision.state, "CURRENT")
  assert.equal(decision.continuation, "ALLOW")
  assert.deepEqual(decision.changedDependencyKeys, [])
  assert.deepEqual(decision.unknownDependencyKeys, [])
  assert.equal(validateP9R1FreshnessDependencyInvalidationDecision(decision).decisionIdentity, decision.decisionIdentity)
})

test("P9-R1 canonicalizes dependency order without changing semantic identity", () => {
  const left = input([
    dependency("workflow/definition", SHA_B, SHA_B, "WORKFLOW_DEFINITION"),
    dependency("authorization/main", SHA_A, SHA_A, "AUTHORIZATION"),
  ])
  const right = input([...left.dependencies].reverse())
  const a = buildP9R1FreshnessDependencyInvalidationDecision(left)
  const b = buildP9R1FreshnessDependencyInvalidationDecision(right)
  assert.deepEqual(a, b)
  assert.equal(p9R1FreshnessDecisionIdentity(left), p9R1FreshnessDecisionIdentity(right))
  assert.deepEqual(a.dependencies.map((item) => item.dependencyKey), ["authorization/main", "workflow/definition"])
})
test("P9-R1 derives STALE with precedence over UNKNOWN and preserves both key sets", () => {
  const decision = buildP9R1FreshnessDependencyInvalidationDecision(input([
    dependency("ruleset/main", SHA_A, SHA_B, "RULESET"),
    dependency("security/feed", SHA_C, null, "SECURITY_INTELLIGENCE"),
    dependency("authorization/main", SHA_A, SHA_D, "AUTHORIZATION"),
  ]))
  assert.equal(decision.state, "STALE")
  assert.equal(decision.continuation, "BLOCK")
  assert.deepEqual(decision.changedDependencyKeys, ["authorization/main", "ruleset/main"])
  assert.deepEqual(decision.unknownDependencyKeys, ["security/feed"])
})

test("P9-R1 derives UNKNOWN and BLOCK when observations are missing without a known mismatch", () => {
  const decision = buildP9R1FreshnessDependencyInvalidationDecision(input([
    dependency("pr/head", SHA_A, SHA_A, "PR_HEAD"),
    dependency("skill/reviewer", SHA_B, null, "SKILL"),
  ]))
  assert.equal(decision.state, "UNKNOWN")
  assert.equal(decision.continuation, "BLOCK")
  assert.deepEqual(decision.changedDependencyKeys, [])
  assert.deepEqual(decision.unknownDependencyKeys, ["skill/reviewer"])
})
test("P9-R1 rejects duplicate, empty, oversized, and unsupported dependency sets", () => {
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(input([
    dependency("same/key"), dependency("same/key", SHA_B, SHA_B, "RULESET"),
  ])), /duplicate dependencyKey/)
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(input([])), /1\.\.64 dependencies/)
  const oversized = Array.from({ length: P9_R1_LIMITS.maxDependencies + 1 }, (_, index) => dependency(`dep/${index}`))
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(input(oversized)), /1\.\.64 dependencies/)
  const invalid = clone(input()) as unknown as MutableRecord
  ;((invalid.dependencies as MutableRecord[])[0]!).dependencyClass = "OTHER"
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(invalid as never), /dependencyClass is unsupported/)
})

test("P9-R1 rejects malformed identities, revisions, and dependency keys", () => {
  const cases: Array<[string, (value: MutableRecord) => void]> = [
    ["subject uppercase", (value) => { value.subjectIdentity = SHA_A.toUpperCase() }],
    ["subject length", (value) => { value.subjectIdentity = "a".repeat(63) }],
    ["base uppercase", (value) => { (value.revision as MutableRecord).canonicalBase = "A".repeat(40) }],
    ["head length", (value) => { (value.revision as MutableRecord).candidateHead = "2".repeat(39) }],
    ["repository NUL", (value) => { (value.revision as MutableRecord).repositoryId = "repo\0bad" }],
    ["key uppercase", (value) => { ((value.dependencies as MutableRecord[])[0]!).dependencyKey = "PR/Head" }],
    ["key non-ASCII", (value) => { ((value.dependencies as MutableRecord[])[0]!).dependencyKey = "pr/héad" }],
    ["key empty", (value) => { ((value.dependencies as MutableRecord[])[0]!).dependencyKey = "" }],
    ["key overlong", (value) => { ((value.dependencies as MutableRecord[])[0]!).dependencyKey = `a${"b".repeat(256)}` }],
  ]
  for (const [, mutate] of cases) {
    const value = clone(input()) as unknown as MutableRecord
    mutate(value)
    assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(value as never))
  }
})
test("P9-R1 fails closed on hostile structured input without invoking accessors", () => {
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(null as never), /plain object/)
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision([] as never), /plain object/)
  const extra = { ...input(), extra: true }
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(extra as never), /invalid key set|unknown field/)
  const missing = clone(input()) as unknown as MutableRecord
  delete missing.subjectIdentity
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(missing as never), /invalid key set|missing/)
  const foreign = Object.assign(Object.create({ inherited: true }), input())
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(foreign as never), /plain object/)
  const symbol = clone(input()) as unknown as MutableRecord
  Object.defineProperty(symbol, Symbol("hidden"), { value: true, enumerable: true })
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(symbol as never), /symbol fields/)
  let getterCalls = 0
  const accessor = clone(input()) as unknown as MutableRecord
  Object.defineProperty(accessor, "subjectIdentity", { enumerable: true, get() { getterCalls += 1; return SHA_D } })
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(accessor as never), /enumerable data property/)
  assert.equal(getterCalls, 0)
  const hidden = clone(input()) as unknown as MutableRecord
  Object.defineProperty(hidden, "subjectIdentity", { value: SHA_D, enumerable: false })
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(hidden as never), /enumerable data property/)
})

test("P9-R1 rejects hostile arrays without invoking index accessors", () => {
  let dependencyGetterCalls = 0
  const accessorDependencies = [dependency("pr/head")]
  Object.defineProperty(accessorDependencies, "0", {
    enumerable: true,
    configurable: true,
    get() { dependencyGetterCalls += 1; return dependency("pr/head") },
  })
  const accessorInput = clone(input()) as unknown as MutableRecord
  accessorInput.dependencies = accessorDependencies
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(accessorInput as never), /enumerable data property/)
  assert.equal(dependencyGetterCalls, 0)

  const hiddenDependencies = [dependency("pr/head")]
  Object.defineProperty(hiddenDependencies, "0", { value: dependency("pr/head"), enumerable: false })
  const hiddenInput = clone(input()) as unknown as MutableRecord
  hiddenInput.dependencies = hiddenDependencies
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(hiddenInput as never), /enumerable data property/)

  const sparseInput = clone(input()) as unknown as MutableRecord
  sparseInput.dependencies = new Array(1)
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(sparseInput as never), /dense/)

  const extraDependencies = [dependency("pr/head")] as unknown[] & { extra?: boolean }
  extraDependencies.extra = true
  const extraInput = clone(input()) as unknown as MutableRecord
  extraInput.dependencies = extraDependencies
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(extraInput as never), /no extra fields/)

  const symbolDependencies = [dependency("pr/head")]
  Object.defineProperty(symbolDependencies, Symbol("hidden"), { value: true, enumerable: true })
  const symbolInput = clone(input()) as unknown as MutableRecord
  symbolInput.dependencies = symbolDependencies
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(symbolInput as never), /symbol fields/)

  class DependencyArray extends Array<P9R1DependencyInput> {}
  const subclassInput = clone(input()) as unknown as MutableRecord
  subclassInput.dependencies = new DependencyArray(dependency("pr/head"))
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(subclassInput as never), /standard Array prototype/)
})

test("P9-R1 rejects active and revoked Proxy inputs before caller traps execute", () => {
  let traps = 0
  const proxy = new Proxy(input() as unknown as object, { ownKeys() { traps += 1; return [] } })
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(proxy as never), /Proxy/)
  assert.equal(traps, 0)
  const revoked = Proxy.revocable(input() as unknown as object, {})
  revoked.revoke()
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(revoked.proxy as never), /Proxy/)
})

test("P9-R1 rejects proxied dependency and derived-key arrays before traps execute", () => {
  let traps = 0
  const baseInput = clone(input()) as unknown as MutableRecord
  baseInput.dependencies = new Proxy(baseInput.dependencies as unknown[], {
    get() { traps += 1; return undefined },
  })
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(baseInput as never), /Proxy/)
  assert.equal(traps, 0)

  const revokedDependencies = Proxy.revocable(clone(input()).dependencies as unknown as object, {})
  revokedDependencies.revoke()
  const revokedInput = clone(input()) as unknown as MutableRecord
  revokedInput.dependencies = revokedDependencies.proxy
  assert.throws(() => buildP9R1FreshnessDependencyInvalidationDecision(revokedInput as never), /Proxy/)

  const decision = clone(buildP9R1FreshnessDependencyInvalidationDecision(input())) as unknown as MutableRecord
  const revokedChanged = Proxy.revocable(decision.changedDependencyKeys as unknown as object, {})
  revokedChanged.revoke()
  decision.changedDependencyKeys = revokedChanged.proxy
  assert.throws(() => validateP9R1FreshnessDependencyInvalidationDecision(decision), /Proxy/)
})

test("P9-R1 validator rejects forged derived state, continuation, sets, order, and identity", () => {
  const base = buildP9R1FreshnessDependencyInvalidationDecision(input([
    dependency("authorization/main", SHA_A, SHA_A, "AUTHORIZATION"),
    dependency("ruleset/main", SHA_B, SHA_B, "RULESET"),
  ]))
  const mutations: Array<(value: MutableRecord) => void> = [
    (value) => { value.state = "STALE" },
    (value) => { value.continuation = "BLOCK" },
    (value) => { value.changedDependencyKeys = ["authorization/main"] },
    (value) => { value.unknownDependencyKeys = ["ruleset/main"] },
    (value) => { value.decisionIdentity = SHA_C },
    (value) => { value.dependencies = [...(value.dependencies as unknown[])].reverse() },
  ]
  for (const mutate of mutations) {
    const value = clone(base) as unknown as MutableRecord
    mutate(value)
    assert.throws(() => validateP9R1FreshnessDependencyInvalidationDecision(value))
  }
})

test("P9-R1 decision identity changes for every semantic subject revision or dependency change", () => {
  const base = input([dependency("pr/head", SHA_A, SHA_A, "PR_HEAD")])
  const baseline = p9R1FreshnessDecisionIdentity(base)
  const variants = [
    { ...base, subjectIdentity: SHA_B },
    { ...base, revision: { ...base.revision, canonicalBase: "3".repeat(40) } },
    { ...base, revision: { ...base.revision, candidateHead: "4".repeat(40) } },
    input([dependency("ruleset/main", SHA_A, SHA_A, "RULESET")]),
    input([dependency("pr/head", SHA_A, SHA_A, "RULESET")]),
    input([dependency("pr/head", SHA_B, SHA_B, "PR_HEAD")]),
    input([dependency("pr/head", SHA_A, SHA_B, "PR_HEAD")]),
    input([dependency("pr/head", SHA_A, null, "PR_HEAD")]),
  ]
  for (const variant of variants) assert.notEqual(p9R1FreshnessDecisionIdentity(variant), baseline)
})
test("P9-R1 builder and validator return detached deeply frozen decisions", () => {
  const source = clone(input([dependency("pr/head", SHA_A, SHA_A)]))
  const built = buildP9R1FreshnessDependencyInvalidationDecision(source)
  assertDeepFrozen(built)
  ;(source.revision as { repositoryId: string }).repositoryId = "changed"
  ;(source.dependencies[0] as { observedIdentity: string | null }).observedIdentity = SHA_B
  assert.equal(built.revision.repositoryId, "github.com/TheHalfMoon/Kodac")
  assert.equal(built.dependencies[0]!.observedIdentity, SHA_A)
  const serialized = JSON.parse(JSON.stringify(built)) as unknown
  const validated = validateP9R1FreshnessDependencyInvalidationDecision(serialized)
  assertDeepFrozen(validated)
  assert.deepEqual(validated, built)
})

test("P9-R1 exposes exactly the nine canonical dependency classes and fixed limits", () => {
  assert.deepEqual(P9_R1_DEPENDENCY_CLASSES, [
    "PR_HEAD", "RULESET", "AUTHORIZATION", "SKILL", "WORKFLOW_DEFINITION",
    "PROVIDER_MODEL_CONFIG", "SANDBOX_IMAGE", "DEPENDENCY_LOCKFILE", "SECURITY_INTELLIGENCE",
  ])
  assert.deepEqual(P9_R1_LIMITS, {
    maxDependencies: 64,
    maxDependencyKeyLength: 256,
    maxRepositoryIdCodePoints: 512,
  })
})
test("P9-R1 runtime and JSON Schema agree on canonical structural boundary fixtures", () => {
  const current = buildP9R1FreshnessDependencyInvalidationDecision(input())
  const unknown = buildP9R1FreshnessDependencyInvalidationDecision(input([
    dependency("security/feed", SHA_A, null, "SECURITY_INTELLIGENCE"),
  ]))
  const stale = buildP9R1FreshnessDependencyInvalidationDecision(input([
    dependency("ruleset/main", SHA_A, SHA_B, "RULESET"),
  ]))
  for (const value of [current, unknown, stale]) {
    assert.equal(schemaAccepts(schema, value), true)
    assert.equal(runtimeAccepts(value), true)
  }

  const negatives: unknown[] = []
  const badVersion = clone(current) as unknown as MutableRecord
  badVersion.version = "p9-r1-other"
  negatives.push(badVersion)
  const badSubject = clone(current) as unknown as MutableRecord
  badSubject.subjectIdentity = SHA_A.toUpperCase()
  negatives.push(badSubject)
  const extra = { ...clone(current), unexpected: true }
  negatives.push(extra)
  const emptyDependencies = clone(current) as unknown as MutableRecord
  emptyDependencies.dependencies = []
  negatives.push(emptyDependencies)
  const invalidClass = clone(current) as unknown as MutableRecord
  ;((invalidClass.dependencies as MutableRecord[])[0]!).dependencyClass = "OTHER"
  negatives.push(invalidClass)
  const invalidKey = clone(current) as unknown as MutableRecord
  ;((invalidKey.dependencies as MutableRecord[])[0]!).dependencyKey = "Bad Key"
  negatives.push(invalidKey)
  const contradictory = clone(current) as unknown as MutableRecord
  contradictory.continuation = "BLOCK"
  negatives.push(contradictory)

  for (const value of negatives) {
    assert.equal(schemaAccepts(schema, value), false)
    assert.equal(runtimeAccepts(value), false)
  }
})

test("P9-R1 implementation remains pure and side-effect free by construction", () => {
  const source = readFileSync(
    new URL("../src/continuous-assurance/p9-r1-freshness-dependency-invalidation.ts", import.meta.url),
    "utf8",
  )
  assert.match(source, /from "node:crypto"/)
  assert.match(source, /from "node:util"/)
  for (const forbidden of ["node:fs", "node:http", "node:https", "node:child_process", "fetch(", "process.env", "K2", "telemetry", "database"]) {
    assert.equal(source.includes(forbidden), false, `forbidden side-effect surface: ${forbidden}`)
  }
})
