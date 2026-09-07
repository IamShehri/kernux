import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import test from "node:test"

import type {
  AdjudicationAction,
  AdjudicationRecord,
  AdjudicationResult,
  FindingRecord,
  FindingState,
} from "../src/reviewer-intelligence/contracts.ts"
import {
  P4_R1_CLAIM_ENVELOPE_VERSION,
  P4_R1_CRITIC_STATE,
  P4_R1_DECLARATION_VERSION,
  buildP4ReviewerClaimEnvelope,
  riskHypothesisIdentity,
  validateP4ReviewerClaimEnvelope,
  verifierProposalIdentity,
  type P4ClaimEnvelopeDeclaration,
  type P4RiskHypothesis,
  type P4VerifierProposal,
} from "../src/reviewer-intelligence/p4-claim-envelope.ts"

type UnknownRecord = Record<string, unknown>

const HEAD = "1".repeat(40)
const BASE = "2".repeat(40)
const OTHER_HEAD = "3".repeat(40)

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (typeof value === "object" && value !== null) {
    const record = value as UnknownRecord
    const ordered: UnknownRecord = {}
    for (const key of Object.keys(record).sort(compareStrings)) ordered[key] = canonicalize(record[key])
    return ordered
  }
  return value
}

function identity(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(canonicalize(value)), "utf8").digest("hex")
}

function gitBlobSha1(raw: Buffer): string {
  const canonical = Buffer.from(raw.toString("utf8").replace(/\r\n/g, "\n"), "utf8")
  const header = Buffer.from(`blob ${canonical.byteLength}\0`, "utf8")
  return createHash("sha1").update(header).update(canonical).digest("hex")
}

function finding(overrides: Partial<{
  evaluatedHead: string
  path: string
  range: { startLine: number; endLine: number }
  evidenceRefs: string[]
}> = {}): FindingRecord {
  const review = {
    reviewRunId: "review-run-1",
    reviewerId: "fixture-reviewer",
    reviewerVersion: "1.0.0",
    policyIdentity: "fixture-policy-v1",
    canonicalBase: BASE,
    reviewedHead: HEAD,
  }
  const historical = {
    version: "kri-r2-finding-v1" as const,
    claimKey: "claim-1",
    review,
    path: overrides.path ?? "src/example.ts",
    range: overrides.range ?? { startLine: 10, endLine: 12 },
    summary: "An authorization boundary may be bypassed.",
    contractClaim: "All protected mutations require explicit authority.",
    category: "authorization",
    severity: "high" as const,
    confidenceBps: 9200,
    evidenceRefs: [...(overrides.evidenceRefs ?? ["evidence:b", "evidence:a"])].sort(compareStrings),
  }
  const evaluatedHead = overrides.evaluatedHead ?? HEAD
  const freshness = evaluatedHead === HEAD ? "CURRENT" as const : "STALE" as const
  return {
    ...historical,
    findingIdentity: identity(historical),
    evaluatedHead,
    freshness,
    state: freshness === "CURRENT" ? "NEW" : "STALE",
  }
}

function nextState(previous: FindingState, action: AdjudicationAction): FindingState {
  if (previous === "NEW" && action === "CONFIRM") return "CONFIRMED"
  if (previous === "NEW" && action === "REJECT") return "REJECTED"
  if (previous === "NEW" && action === "MARK_DUPLICATE") return "DUPLICATE"
  if (previous === "CONFIRMED" && action === "MARK_FIXED") return "FIXED"
  if (previous === "FIXED" && action === "REVERIFY") return "REVERIFIED"
  throw new Error("unsupported fixture transition")
}

function adjudicationResult(source: FindingRecord, action: AdjudicationAction = "CONFIRM"): AdjudicationResult {
  const previousState: FindingState = action === "MARK_FIXED" ? "CONFIRMED" : action === "REVERIFY" ? "FIXED" : "NEW"
  const resultingState = nextState(previousState, action)
  const specific = action === "MARK_DUPLICATE"
    ? { duplicateOf: identity("other-finding") }
    : action === "MARK_FIXED"
      ? { correctionRef: "correction:1" }
      : action === "REVERIFY"
        ? { reverificationRef: "reverify:1" }
        : {}
  const withoutIdentity: Omit<AdjudicationRecord, "adjudicationIdentity"> = {
    version: "kri-r2-adjudication-v1",
    findingIdentity: source.findingIdentity,
    previousAdjudicationIdentity: previousState === "NEW" ? null : identity(`previous:${previousState}`),
    action,
    previousState,
    resultingState,
    adjudicatorId: "fixture-adjudicator",
    evidenceRefs: ["adjudication:evidence"],
    ...specific,
  }
  const adjudication: AdjudicationRecord = {
    ...withoutIdentity,
    adjudicationIdentity: identity(withoutIdentity),
  }
  return { finding: structuredClone(source), adjudication, state: resultingState }
}

function risk(overrides: Partial<Omit<P4RiskHypothesis, "riskHypothesisId">> = {}): P4RiskHypothesis {
  const withoutIdentity = {
    riskClass: overrides.riskClass ?? "AUTHORIZATION_DRIFT" as const,
    statement: overrides.statement ?? "The change may weaken an explicit authorization boundary.",
    evidenceRefs: overrides.evidenceRefs ?? ["risk:evidence:b", "risk:evidence:a"],
  }
  return {
    riskHypothesisId: riskHypothesisIdentity(withoutIdentity),
    ...withoutIdentity,
  }
}

function proposal(overrides: Partial<Omit<P4VerifierProposal, "proposalId">> = {}): P4VerifierProposal {
  const withoutIdentity = {
    verifierClass: overrides.verifierClass ?? "FOCUSED_TEST" as const,
    objective: overrides.objective ?? "Attempt the mutation without the required authorization and require rejection.",
    evidenceRefs: overrides.evidenceRefs ?? ["proposal:evidence:b", "proposal:evidence:a"],
  }
  return {
    proposalId: verifierProposalIdentity(withoutIdentity),
    ...withoutIdentity,
  }
}

function declaration(source: FindingRecord, overrides: Partial<P4ClaimEnvelopeDeclaration> = {}): P4ClaimEnvelopeDeclaration {
  return {
    version: P4_R1_DECLARATION_VERSION,
    sourceFindingIdentity: source.findingIdentity,
    riskHypothesis: risk(),
    evidenceRefs: ["envelope:evidence:b", "envelope:evidence:a"],
    verifierProposals: [proposal()],
    criticState: P4_R1_CRITIC_STATE,
    ...overrides,
  }
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function asSchema(value: unknown, label: string): UnknownRecord {
  assert.ok(value && typeof value === "object" && !Array.isArray(value), `${label} must be a schema object`)
  return value as UnknownRecord
}

function schemaEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right)
}

function resolveRef(root: UnknownRecord, ref: string): unknown {
  assert.ok(ref.startsWith("#/$defs/"), `unsupported schema ref ${ref}`)
  const name = ref.slice("#/$defs/".length)
  const defs = asSchema(root.$defs, "$root.$defs")
  assert.ok(Object.hasOwn(defs, name), `missing schema definition ${name}`)
  return defs[name]
}

function validates(schemaValue: unknown, value: unknown, root: UnknownRecord, path: string): boolean {
  try {
    validateWithPublishedSchema(schemaValue, value, root, path)
    return true
  } catch {
    return false
  }
}

function validateWithPublishedSchema(schemaValue: unknown, value: unknown, root: UnknownRecord, path = "$root"): void {
  const schema = asSchema(schemaValue, path)

  if (typeof schema.$ref === "string") {
    validateWithPublishedSchema(resolveRef(root, schema.$ref), value, root, path)
    return
  }
  if ("const" in schema) assert.ok(schemaEqual(value, schema.const), `${path} violates const`)
  if (Array.isArray(schema.enum)) assert.ok(schema.enum.some((item) => schemaEqual(item, value)), `${path} violates enum`)

  if (Array.isArray(schema.anyOf)) {
    assert.ok(schema.anyOf.some((branch) => validates(branch, value, root, path)), `${path} violates anyOf`)
    return
  }

  if (Array.isArray(schema.allOf)) {
    for (const branch of schema.allOf) validateWithPublishedSchema(branch, value, root, path)
  }

  if (schema.if !== undefined && validates(schema.if, value, root, `${path}.if`)) {
    if (schema.then !== undefined) validateWithPublishedSchema(schema.then, value, root, `${path}.then`)
  }

  const type = schema.type
  if (type === "null") {
    assert.equal(value, null, `${path} must be null`)
    return
  }
  if (type === "string") {
    assert.equal(typeof value, "string", `${path} must be string`)
    const text = value as string
    if (typeof schema.minLength === "number") assert.ok(text.length >= schema.minLength, `${path} shorter than minLength`)
    if (typeof schema.maxLength === "number") assert.ok(text.length <= schema.maxLength, `${path} longer than maxLength`)
    if (typeof schema.pattern === "string") assert.match(text, new RegExp(schema.pattern), `${path} violates pattern`)
    return
  }
  if (type === "integer") {
    assert.equal(Number.isInteger(value), true, `${path} must be integer`)
    const number = value as number
    if (typeof schema.minimum === "number") assert.ok(number >= schema.minimum, `${path} below minimum`)
    if (typeof schema.maximum === "number") assert.ok(number <= schema.maximum, `${path} above maximum`)
    return
  }
  if (type === "array") {
    assert.ok(Array.isArray(value), `${path} must be array`)
    const array = value as unknown[]
    if (typeof schema.minItems === "number") assert.ok(array.length >= schema.minItems, `${path} below minItems`)
    if (typeof schema.maxItems === "number") assert.ok(array.length <= schema.maxItems, `${path} above maxItems`)
    if (schema.uniqueItems === true) {
      const canonical = array.map((item) => JSON.stringify(canonicalize(item)))
      assert.equal(new Set(canonical).size, canonical.length, `${path} violates uniqueItems`)
    }
    if (schema.items !== undefined) array.forEach((item, index) => validateWithPublishedSchema(schema.items, item, root, `${path}[${index}]`))
    return
  }
  if (type === "object") {
    assert.ok(value && typeof value === "object" && !Array.isArray(value), `${path} must be object`)
    const record = value as UnknownRecord
    const properties = schema.properties === undefined ? {} : asSchema(schema.properties, `${path}.properties`)
    if (Array.isArray(schema.required)) {
      for (const required of schema.required) {
        assert.equal(typeof required, "string", `${path}.required entries must be strings`)
        assert.ok(Object.hasOwn(record, required), `${path} missing required field ${required}`)
      }
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(record)) assert.ok(Object.hasOwn(properties, key), `${path} contains unknown field ${key}`)
    }
    for (const [key, childSchema] of Object.entries(properties)) {
      if (Object.hasOwn(record, key)) validateWithPublishedSchema(childSchema, record[key], root, `${path}.${key}`)
    }
  }
}

function publishedSchema(): UnknownRecord {
  return JSON.parse(
    readFileSync(new URL("../../../schema/p4-reviewer-claim-envelope.schema.json", import.meta.url), "utf8"),
  ) as UnknownRecord
}

test("builds one deterministic current reviewer-claim envelope without inventing critic or adjudication authority", () => {
  const source = finding()
  const result = buildP4ReviewerClaimEnvelope({ finding: source, declaration: declaration(source) })
  assert.equal(result.version, P4_R1_CLAIM_ENVELOPE_VERSION)
  assert.equal(result.sourceFinding.findingIdentity, source.findingIdentity)
  assert.equal(result.sourceFinding.path, source.path)
  assert.deepEqual(result.sourceFinding.range, source.range)
  assert.equal(result.sourceFinding.severity, source.severity)
  assert.equal(result.sourceFinding.confidenceBps, source.confidenceBps)
  assert.equal(result.sourceFinding.freshness, "CURRENT")
  assert.equal(result.sourceFinding.state, "NEW")
  assert.equal(result.sourceFinding.adjudicationState, "NEW")
  assert.equal(result.sourceFinding.adjudicationIdentity, null)
  assert.equal(result.criticState, "NOT_EVALUATED")
  assert.deepEqual(result.evidenceRefs, ["envelope:evidence:a", "envelope:evidence:b"])
  assert.deepEqual(result.riskHypothesis.evidenceRefs, ["risk:evidence:a", "risk:evidence:b"])
  assert.deepEqual(result.verifierProposals[0].evidenceRefs, ["proposal:evidence:a", "proposal:evidence:b"])
  assert.equal(validateP4ReviewerClaimEnvelope(result).envelopeIdentity, result.envelopeIdentity)
})

test("set ordering and benign object-key ordering do not change structural identities", () => {
  const source = finding()
  const first = buildP4ReviewerClaimEnvelope({ finding: source, declaration: declaration(source) })
  const alternateRiskWithoutIdentity = {
    evidenceRefs: ["risk:evidence:a", "risk:evidence:b"],
    statement: "The change may weaken an explicit authorization boundary.",
    riskClass: "AUTHORIZATION_DRIFT" as const,
  }
  const alternateProposalWithoutIdentity = {
    evidenceRefs: ["proposal:evidence:a", "proposal:evidence:b"],
    objective: "Attempt the mutation without the required authorization and require rejection.",
    verifierClass: "FOCUSED_TEST" as const,
  }
  const secondDeclaration = {
    criticState: "NOT_EVALUATED" as const,
    verifierProposals: [{ proposalId: verifierProposalIdentity(alternateProposalWithoutIdentity), ...alternateProposalWithoutIdentity }],
    evidenceRefs: ["envelope:evidence:a", "envelope:evidence:b"],
    riskHypothesis: { riskHypothesisId: riskHypothesisIdentity(alternateRiskWithoutIdentity), ...alternateRiskWithoutIdentity },
    sourceFindingIdentity: source.findingIdentity,
    version: "p4-r1-reviewer-claim-declaration-v1" as const,
  }
  const second = buildP4ReviewerClaimEnvelope({ declaration: secondDeclaration, finding: clone(source) })
  assert.equal(first.riskHypothesis.riskHypothesisId, second.riskHypothesis.riskHypothesisId)
  assert.equal(first.verifierProposals[0].proposalId, second.verifierProposals[0].proposalId)
  assert.equal(first.envelopeIdentity, second.envelopeIdentity)
})

test("verifier proposal order is canonicalized because proposals are a bounded set", () => {
  const source = finding()
  const focused = proposal()
  const schema = proposal({
    verifierClass: "SCHEMA_VALIDATION",
    objective: "Validate the emitted envelope against the published P4-R1 schema.",
    evidenceRefs: ["schema:evidence"],
  })
  const first = buildP4ReviewerClaimEnvelope({
    finding: source,
    declaration: declaration(source, { verifierProposals: [focused, schema] }),
  })
  const second = buildP4ReviewerClaimEnvelope({
    finding: source,
    declaration: declaration(source, { verifierProposals: [schema, focused] }),
  })
  assert.equal(first.envelopeIdentity, second.envelopeIdentity)
  assert.deepEqual(first.verifierProposals.map((item) => item.proposalId), [...first.verifierProposals.map((item) => item.proposalId)].sort())
})

test("semantic changes alter risk, proposal, and envelope identities", () => {
  const source = finding()
  const firstRisk = risk()
  const secondRisk = risk({ statement: "A different explicit authorization-risk hypothesis." })
  assert.notEqual(firstRisk.riskHypothesisId, secondRisk.riskHypothesisId)
  const firstProposal = proposal()
  const secondProposal = proposal({ objective: "Try a distinct falsification path." })
  assert.notEqual(firstProposal.proposalId, secondProposal.proposalId)
  const first = buildP4ReviewerClaimEnvelope({ finding: source, declaration: declaration(source, { riskHypothesis: firstRisk }) })
  const second = buildP4ReviewerClaimEnvelope({ finding: source, declaration: declaration(source, { riskHypothesis: secondRisk }) })
  assert.notEqual(first.envelopeIdentity, second.envelopeIdentity)
})

test("returned evidence is deeply detached and frozen against caller mutation", () => {
  const source = finding()
  const input = { finding: source, declaration: declaration(source) }
  const result = buildP4ReviewerClaimEnvelope(input)
  const identityBefore = result.envelopeIdentity
  input.declaration.evidenceRefs[0] = "mutated"
  input.declaration.riskHypothesis.statement = "mutated"
  input.finding.evidenceRefs[0] = "mutated"
  assert.equal(result.envelopeIdentity, identityBefore)
  assert.equal(result.sourceFinding.evidenceRefs.includes("mutated"), false)
  assert.equal(result.evidenceRefs.includes("mutated"), false)
  assert.notEqual(result.riskHypothesis.statement, "mutated")
  assert.equal(Object.isFrozen(result), true)
  assert.equal(Object.isFrozen(result.sourceFinding), true)
  assert.equal(Object.isFrozen(result.sourceFinding.review), true)
  assert.equal(Object.isFrozen(result.sourceFinding.evidenceRefs), true)
  assert.equal(Object.isFrozen(result.riskHypothesis), true)
  assert.equal(Object.isFrozen(result.verifierProposals), true)
  assert.equal(Object.isFrozen(result.verifierProposals[0]), true)
})

test("stale finding truth is preserved and stale findings cannot carry adjudication results", () => {
  const source = finding({ evaluatedHead: OTHER_HEAD })
  const result = buildP4ReviewerClaimEnvelope({ finding: source, declaration: declaration(source) })
  assert.equal(result.sourceFinding.freshness, "STALE")
  assert.equal(result.sourceFinding.state, "STALE")
  assert.equal(result.sourceFinding.adjudicationState, "STALE")
  assert.equal(result.sourceFinding.adjudicationIdentity, null)
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: source, declaration: declaration(source), adjudication: adjudicationResult(source) }),
    /only a current NEW source finding can carry an adjudication result/,
  )
})

test("existing non-NEW KRI-R2 adjudication state is preserved without executing adjudication", () => {
  const source = finding()
  const existing = adjudicationResult(source, "CONFIRM")
  const result = buildP4ReviewerClaimEnvelope({ finding: source, declaration: declaration(source), adjudication: existing })
  assert.equal(result.sourceFinding.state, "NEW")
  assert.equal(result.sourceFinding.adjudicationState, "CONFIRMED")
  assert.equal(result.sourceFinding.adjudicationIdentity, existing.adjudication.adjudicationIdentity)
  assert.equal(validateP4ReviewerClaimEnvelope(result).sourceFinding.adjudicationState, "CONFIRMED")
})

test("later KRI-R2 lifecycle states remain data-only snapshots and retain their adjudication identity", () => {
  const source = finding()
  const existing = adjudicationResult(source, "MARK_FIXED")
  const result = buildP4ReviewerClaimEnvelope({ finding: source, declaration: declaration(source), adjudication: existing })
  assert.equal(result.sourceFinding.adjudicationState, "FIXED")
  assert.equal(result.sourceFinding.adjudicationIdentity, existing.adjudication.adjudicationIdentity)
})

test("unknown fields and authority injection fail closed at every P4 boundary", () => {
  const source = finding()
  const base = { finding: source, declaration: declaration(source) }
  assert.throws(() => buildP4ReviewerClaimEnvelope({ ...base, mergeApproved: true } as never), /unknown property: mergeApproved/)
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: source, declaration: { ...declaration(source), PROVEN_READY: true } as never }),
    /unknown property: PROVEN_READY/,
  )
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: source, declaration: { ...declaration(source), riskHypothesis: { ...risk(), releaseApproved: true } } as never }),
    /unknown property: releaseApproved/,
  )
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: source, declaration: { ...declaration(source), verifierProposals: [{ ...proposal(), remediationAuthorized: true }] } as never }),
    /unknown property: remediationAuthorized/,
  )
  const envelope = buildP4ReviewerClaimEnvelope(base)
  assert.throws(() => validateP4ReviewerClaimEnvelope({ ...envelope, promotion: "APPROVED" }), /unknown property: promotion/)
})

test("source finding identity, head, scope, range, refs, and declaration binding fail closed", () => {
  const source = finding()
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: { ...source, findingIdentity: "0".repeat(64) }, declaration: declaration(source) }),
    /findingIdentity does not match/,
  )
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: { ...source, evaluatedHead: "bad" }, declaration: declaration(source) }),
    /git commit identity/,
  )
  const badPath = finding({ path: "../escape.ts" })
  assert.throws(() => buildP4ReviewerClaimEnvelope({ finding: badPath, declaration: declaration(badPath) }), /parent segments/)
  const badRange = finding({ range: { startLine: 9, endLine: 2 } })
  assert.throws(() => buildP4ReviewerClaimEnvelope({ finding: badRange, declaration: declaration(badRange) }), /startLine <= endLine/)
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: source, declaration: { ...declaration(source), sourceFindingIdentity: "f".repeat(64) } }),
    /must equal the exact source finding identity/,
  )
  const duplicated = finding({ evidenceRefs: ["same", "same"] })
  assert.throws(() => buildP4ReviewerClaimEnvelope({ finding: duplicated, declaration: declaration(duplicated) }), /duplicate entries/)
})

test("risk and verifier identities are content-derived and malformed or empty proposals fail closed", () => {
  const source = finding()
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: source, declaration: { ...declaration(source), riskHypothesis: { ...risk(), riskHypothesisId: "0".repeat(64) } } }),
    /riskHypothesisId does not match canonical content/,
  )
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: source, declaration: { ...declaration(source), verifierProposals: [{ ...proposal(), proposalId: "0".repeat(64) }] } }),
    /proposalId does not match canonical content/,
  )
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: source, declaration: { ...declaration(source), verifierProposals: [{ ...proposal(), objective: "" }] } }),
    /non-empty string/,
  )
  const duplicated = proposal()
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: source, declaration: { ...declaration(source), verifierProposals: [duplicated, clone(duplicated)] } }),
    /duplicate proposal identities/,
  )
  assert.doesNotThrow(() => buildP4ReviewerClaimEnvelope({ finding: source, declaration: { ...declaration(source), verifierProposals: [] } }))
})

test("critic state cannot become a semantic verdict", () => {
  const source = finding()
  for (const criticState of ["SUPPORTED", "REJECTED", "AGREED", "DISAGREED"]) {
    assert.throws(
      () => buildP4ReviewerClaimEnvelope({ finding: source, declaration: { ...declaration(source), criticState } as never }),
      /criticState must be NOT_EVALUATED/,
    )
  }
})

test("adjudication snapshots must bind the exact source finding and canonical KRI-R2 record identity", () => {
  const source = finding()
  const existing = adjudicationResult(source)
  const different = finding({ path: "src/other.ts" })
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: different, declaration: declaration(different), adjudication: existing }),
    /must equal the exact source finding/,
  )
  const badIdentity = clone(existing)
  badIdentity.adjudication.adjudicationIdentity = "0".repeat(64)
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: source, declaration: declaration(source), adjudication: badIdentity }),
    /adjudicationIdentity does not match canonical KRI-R2 content/,
  )
  const badState = clone(existing) as unknown as UnknownRecord
  badState.state = "FIXED"
  assert.throws(
    () => buildP4ReviewerClaimEnvelope({ finding: source, declaration: declaration(source), adjudication: badState as never }),
    /state must equal adjudication.resultingState/,
  )
})

test("validated envelope identity detects any semantic mutation", () => {
  const source = finding()
  const envelope = buildP4ReviewerClaimEnvelope({ finding: source, declaration: declaration(source) })
  const mutated = clone(envelope)
  mutated.riskHypothesis.statement = "mutated semantic statement"
  assert.throws(() => validateP4ReviewerClaimEnvelope(mutated), /riskHypothesisId does not match canonical content/)

  const identityOnly = clone(envelope)
  identityOnly.envelopeIdentity = "0".repeat(64)
  assert.throws(() => validateP4ReviewerClaimEnvelope(identityOnly), /envelopeIdentity does not match canonical content/)
})

test("produced NEW, STALE, and adjudicated envelopes validate against the published JSON Schema", () => {
  const schema = publishedSchema()
  const current = finding()
  const stale = finding({ evaluatedHead: OTHER_HEAD })
  const adjudicated = adjudicationResult(current)
  for (const envelope of [
    buildP4ReviewerClaimEnvelope({ finding: current, declaration: declaration(current) }),
    buildP4ReviewerClaimEnvelope({ finding: stale, declaration: declaration(stale) }),
    buildP4ReviewerClaimEnvelope({ finding: current, declaration: declaration(current), adjudication: adjudicated }),
  ]) {
    assert.doesNotThrow(() => validateWithPublishedSchema(schema, envelope, schema))
  }

  const injected = { ...buildP4ReviewerClaimEnvelope({ finding: current, declaration: declaration(current) }), mergeApproved: true }
  assert.throws(() => validateWithPublishedSchema(schema, injected, schema), /unknown field mergeApproved/)
})

test("schema and runtime both reject a critic verdict and stale adjudication identity", () => {
  const schema = publishedSchema()
  const source = finding()
  const current = buildP4ReviewerClaimEnvelope({ finding: source, declaration: declaration(source) })
  const critic = { ...clone(current), criticState: "SUPPORTED" }
  assert.throws(() => validateP4ReviewerClaimEnvelope(critic), /criticState must be NOT_EVALUATED/)
  assert.throws(() => validateWithPublishedSchema(schema, critic, schema), /violates const/)

  const staleSource = finding({ evaluatedHead: OTHER_HEAD })
  const stale = clone(buildP4ReviewerClaimEnvelope({ finding: staleSource, declaration: declaration(staleSource) }))
  stale.sourceFinding.adjudicationIdentity = identity("forbidden")
  stale.sourceFinding.adjudicationState = "CONFIRMED"
  stale.envelopeIdentity = identity({ forged: true })
  assert.throws(() => validateP4ReviewerClaimEnvelope(stale), /inconsistent|must preserve/)
  assert.throws(() => validateWithPublishedSchema(schema, stale, schema), /violates const|must be null/)
})

test("P4-R1 production source has a pure deterministic import surface", () => {
  const source = readFileSync(new URL("../src/reviewer-intelligence/p4-claim-envelope.ts", import.meta.url), "utf8")
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]).sort()
  assert.deepEqual(imports, ["./contracts.ts", "node:crypto"])
  assert.doesNotMatch(source, /\b(fetch|XMLHttpRequest|WebSocket|child_process|ExecutionGateway|writeFile|appendFile|createWriteStream|provider\.review)\b/)
  assert.doesNotMatch(source, /from\s+["']\.\/runtime\.ts["']/)
  assert.doesNotMatch(source, /from\s+["']\.\/executor\.ts["']/)
  assert.doesNotMatch(source, /from\s+["']\.\/provider-contracts\.ts["']/)
})

test("canonical KRI-R2/KRI-R3 historical predecessors and authorized R20 executor successor remain pinned", () => {
  const expected = new Map([
    ["../src/reviewer-intelligence/contracts.ts", "5ebe91c3d98f626651230989564d367d0600863c"],
    ["../src/reviewer-intelligence/runtime.ts", "4c5d01293d37b14ad4b017ec1e7dd17055393113"],
    ["../src/reviewer-intelligence/provider-contracts.ts", "97e95f3cd19aebf63c86dba254bc8e55f919c031"],
    ["../src/reviewer-intelligence/executor.ts", "f7e969672182e3ee3209f9677522e6ffc3caa210"],
  ])
  for (const [path, blob] of expected) {
    assert.equal(gitBlobSha1(readFileSync(new URL(path, import.meta.url))), blob, path)
  }
})
