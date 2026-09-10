import assert from "node:assert/strict"
import { createHmac } from "node:crypto"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  O1_AUTHENTICATED_GITHUB_EVENT_EVIDENCE_VERSION,
  createO1AuthenticatedGithubEventEvidence,
  validateO1AuthenticatedGithubEventEvidence,
  type O1AuthenticatedGithubEventInput,
} from "../src/event-ingress/o1-authenticated-github-event-evidence.ts"

const HEAD = "a".repeat(40)
const OTHER_HEAD = "b".repeat(40)
const KEY_IDENTITY = "1".repeat(64)
const POLICY_IDENTITY = "2".repeat(64)
const SECRET = new TextEncoder().encode("o1-unit-test-secret")

function payload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const base = {
    action: "opened",
    number: 42,
    repository: { id: 1001, full_name: "TheHalfMoon/Kodac" },
    pull_request: {
      id: 2002,
      number: 42,
      base: { repo: { id: 1001, full_name: "TheHalfMoon/Kodac" } },
      head: { sha: HEAD, repo: { id: 1001, full_name: "TheHalfMoon/Kodac" } },
    },
    sender: { id: 3003, login: "reviewer-user", type: "User" },
  }
  return { ...base, ...overrides }
}

function body(value: unknown = payload()): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(value))
}

function signature(rawBody: Uint8Array, secret: Uint8Array = SECRET): string {
  return `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`
}

function input(rawBody: Uint8Array = body(), overrides: Partial<O1AuthenticatedGithubEventInput> = {}): O1AuthenticatedGithubEventInput {
  return {
    rawBody,
    signatureHeader: signature(rawBody),
    deliveryId: "delivery-001",
    eventName: "pull_request",
    keyIdentity: KEY_IDENTITY,
    secret: SECRET,
    expectedRepositoryId: "1001",
    expectedRepositoryFullName: "TheHalfMoon/Kodac",
    expectedHeadSha: HEAD,
    actorEligibility: {
      policyIdentity: POLICY_IDENTITY,
      actorId: "3003",
      actorLogin: "reviewer-user",
      decision: "ELIGIBLE",
      evidenceRefs: ["policy:fixture"],
    },
    previousDeliveryIdentities: [],
    ...overrides,
  }
}

test("O1 authenticates and binds one same-repository pull-request event", () => {
  const source = input()
  const evidence = createO1AuthenticatedGithubEventEvidence(source)
  assert.equal(evidence.version, O1_AUTHENTICATED_GITHUB_EVENT_EVIDENCE_VERSION)
  assert.equal(evidence.ingressDecision, "ACCEPT")
  assert.equal(evidence.authenticationDecision, "AUTHENTICATED")
  assert.equal(evidence.replayDecision, "UNSEEN")
  assert.equal(evidence.forkClassification, "SAME_REPOSITORY")
  assert.equal(evidence.observedHeadSha, HEAD)
  assert.equal(evidence.expectedHeadSha, HEAD)
  assert.equal(evidence.actorEligibilityDecision, "ELIGIBLE")
  assert.match(evidence.eventEvidenceIdentity, /^[0-9a-f]{64}$/)
  assert.deepEqual(validateO1AuthenticatedGithubEventEvidence(evidence, source), evidence)
  assert.ok(Object.isFrozen(evidence))
  assert.ok(Object.isFrozen(evidence.actorEligibilityEvidenceRefs))
})

test("O1 classifies a signed fork PR from repository identities", () => {
  const value = payload()
  const pr = value.pull_request as Record<string, unknown>
  pr.head = { sha: HEAD, repo: { id: 9009, full_name: "fork-owner/Kodac" } }
  const evidence = createO1AuthenticatedGithubEventEvidence(input(body(value)))
  assert.equal(evidence.forkClassification, "FORK_REPOSITORY")
  assert.equal(evidence.headRepositoryId, "9009")
})

test("O1 accepts only the closed supported action set", () => {
  for (const action of ["opened", "reopened", "synchronize", "ready_for_review"] as const) {
    const evidence = createO1AuthenticatedGithubEventEvidence(input(body(payload({ action }))))
    assert.equal(evidence.action, action)
  }
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(body(payload({ action: "closed" })))), /action is unsupported/)
})

test("O1 rejects invalid, missing-form, malformed, and wrong-secret signatures", () => {
  const raw = body()
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(raw, { signatureHeader: `sha256=${"0".repeat(64)}` })), /signature verification failed/)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(raw, { signatureHeader: "" })), /signatureHeader/)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(raw, { signatureHeader: "sha1=abc" })), /signatureHeader/)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(raw, { secret: new TextEncoder().encode("wrong") })), /signature verification failed/)
})

test("O1 binds authentication to exact raw body bytes", () => {
  const raw = body()
  const signed = input(raw)
  const changed = Uint8Array.from(raw)
  changed[changed.length - 2] = changed[changed.length - 2] === 0x7d ? 0x20 : 0x7d
  assert.throws(() => createO1AuthenticatedGithubEventEvidence({ ...signed, rawBody: changed }), /signature verification failed/)
})

test("O1 rejects invalid UTF-8 after authenticating exact bytes", () => {
  const raw = Uint8Array.from([0xc3, 0x28])
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(raw)), /valid UTF-8/)
})

test("O1 rejects malformed JSON and duplicate JSON keys", () => {
  const malformed = new TextEncoder().encode('{"action":')
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(malformed)), /invalid JSON|invalid JSON value|unterminated/)
  const valid = new TextDecoder().decode(body())
  const duplicate = new TextEncoder().encode(`{"action":"opened",${valid.slice(1)}`)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(duplicate)), /duplicate JSON key: action/)
})

test("O1 rejects excessive JSON depth and oversized raw bodies", () => {
  const deep = new TextEncoder().encode(`${"[".repeat(66)}0${"]".repeat(66)}`)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(deep)), /JSON depth bound/)
  const huge = new Uint8Array(1024 * 1024 + 1)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(huge, { signatureHeader: `sha256=${"0".repeat(64)}` })), /rawBody has invalid byte length/)
})

test("O1 rejects unsupported event names before producing evidence", () => {
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(body(), { eventName: "push" })), /eventName is not admitted/)
})

test("O1 rejects repository mismatch and inconsistent PR base repository", () => {
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(body(), { expectedRepositoryId: "9999" })), /repository does not match/)
  const value = payload()
  const pr = value.pull_request as Record<string, unknown>
  pr.base = { repo: { id: 7777, full_name: "TheHalfMoon/Kodac" } }
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(body(value))), /base repository does not match/)
})

test("O1 rejects a moved or malformed signed head", () => {
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(body(), { expectedHeadSha: OTHER_HEAD })), /head does not match/)
  const value = payload()
  const pr = value.pull_request as Record<string, unknown>
  pr.head = { sha: "not-a-sha", repo: { id: 1001, full_name: "TheHalfMoon/Kodac" } }
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(body(value))), /40-hex/)
})

test("O1 rejects missing head repository", () => {
  const value = payload()
  const pr = value.pull_request as Record<string, unknown>
  pr.head = { sha: HEAD, repo: null }
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(body(value))), /head.repo must be an object/)
})

test("O1 rejects actor identity mismatch, ineligible actor, and unknown actor", () => {
  const source = input()
  assert.throws(() => createO1AuthenticatedGithubEventEvidence({ ...source, actorEligibility: { ...source.actorEligibility, actorId: "9999" } }), /does not match the signed actor/)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence({ ...source, actorEligibility: { ...source.actorEligibility, decision: "INELIGIBLE" } }), /not positively eligible/)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence({ ...source, actorEligibility: { ...source.actorEligibility, decision: "UNKNOWN" } }), /not positively eligible/)
})

test("O1 rejects exact duplicate delivery identity", () => {
  const firstInput = input()
  const first = createO1AuthenticatedGithubEventEvidence(firstInput)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(firstInput.rawBody, { previousDeliveryIdentities: [first.deliveryIdentity] })), /already observed/)
})

test("O1 delivery replay identity remains stable if the same delivery id is paired with different authenticated payload bytes", () => {
  const first = createO1AuthenticatedGithubEventEvidence(input())
  const changedPayload = payload({ action: "synchronize" })
  const changedBody = body(changedPayload)
  assert.throws(
    () => createO1AuthenticatedGithubEventEvidence(input(changedBody, { previousDeliveryIdentities: [first.deliveryIdentity] })),
    /already observed/,
  )
})

test("O1 rejects unpaired Unicode in authority-bearing signed and caller fields", () => {
  const value = payload()
  value.sender = { id: 3003, login: "bad\ud800", type: "User" }
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(input(body(value), { actorEligibility: { policyIdentity: POLICY_IDENTITY, actorId: "3003", actorLogin: "bad\ud800", decision: "ELIGIBLE", evidenceRefs: [] } })), /Unicode scalar values/)
  const source = input()
  assert.throws(() => createO1AuthenticatedGithubEventEvidence({ ...source, deliveryId: `delivery-${"\ud800"}` }), /deliveryId/)
})

test("O1 result is invariant to prior-delivery and actor-evidence reference order", () => {
  const base = input()
  const a = "a".repeat(64)
  const b = "b".repeat(64)
  const left = createO1AuthenticatedGithubEventEvidence({ ...base, actorEligibility: { ...base.actorEligibility, evidenceRefs: ["z", "a"] }, previousDeliveryIdentities: [b, a] })
  const right = createO1AuthenticatedGithubEventEvidence({ ...base, actorEligibility: { ...base.actorEligibility, evidenceRefs: ["a", "z"] }, previousDeliveryIdentities: [a, b] })
  assert.deepEqual(left, right)
})

test("O1 validator rejects derived-field and evidence-identity forgery", () => {
  const source = input()
  const evidence = createO1AuthenticatedGithubEventEvidence(source)
  assert.throws(() => validateO1AuthenticatedGithubEventEvidence({ ...evidence, forkClassification: "FORK_REPOSITORY" }, source), /does not match independently rederived/)
  assert.throws(() => validateO1AuthenticatedGithubEventEvidence({ ...evidence, eventEvidenceIdentity: "f".repeat(64) }, source), /does not match independently rederived/)
})

test("O1 rejects Proxy top-level, actor, array, body, and secret inputs", () => {
  const source = input()
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(new Proxy(source, {}) as O1AuthenticatedGithubEventInput), /non-proxy plain object/)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence({ ...source, actorEligibility: new Proxy(source.actorEligibility, {}) }), /non-proxy plain object/)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence({ ...source, previousDeliveryIdentities: new Proxy([], {}) }), /non-proxy array/)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence({ ...source, rawBody: new Proxy(source.rawBody, {}) }), /non-proxy Uint8Array/)
  assert.throws(() => createO1AuthenticatedGithubEventEvidence({ ...source, secret: new Proxy(source.secret, {}) }), /non-proxy Uint8Array/)
})

test("O1 rejects accessors, symbol properties, and non-enumerable structured input", () => {
  const source = input() as O1AuthenticatedGithubEventInput & Record<string | symbol, unknown>
  const accessor = { ...source } as Record<string, unknown>
  Object.defineProperty(accessor, "deliveryId", { enumerable: true, get() { throw new Error("getter executed") } })
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(accessor as unknown as O1AuthenticatedGithubEventInput), /enumerable data property/)

  const symbol = { ...source } as O1AuthenticatedGithubEventInput & Record<string | symbol, unknown>
  symbol[Symbol("hostile")] = true
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(symbol), /symbol properties/)

  const hidden = { ...source } as Record<string, unknown>
  Object.defineProperty(hidden, "hidden", { value: true, enumerable: false })
  assert.throws(() => createO1AuthenticatedGithubEventEvidence(hidden as unknown as O1AuthenticatedGithubEventInput), /enumerable data property/)
})

test("O1 output is detached from later caller mutation and never serializes secret bytes", () => {
  const refs = ["policy:one"]
  const source = input(body(), { actorEligibility: { policyIdentity: POLICY_IDENTITY, actorId: "3003", actorLogin: "reviewer-user", decision: "ELIGIBLE", evidenceRefs: refs } })
  const evidence = createO1AuthenticatedGithubEventEvidence(source)
  refs[0] = "policy:mutated"
  assert.deepEqual(evidence.actorEligibilityEvidenceRefs, ["policy:one"])
  assert.ok(!JSON.stringify(evidence).includes("o1-unit-test-secret"))
})

test("O1 schema mirrors the exact positive serialized surface", () => {
  const schema = JSON.parse(readFileSync(new URL("../../../schema/o1-authenticated-github-event-evidence.schema.json", import.meta.url), "utf8")) as { additionalProperties: boolean; required: string[]; properties: Record<string, unknown> }
  const evidence = createO1AuthenticatedGithubEventEvidence(input())
  assert.equal(schema.additionalProperties, false)
  assert.deepEqual([...schema.required].sort(), Object.keys(evidence).sort())
  assert.deepEqual(Object.keys(schema.properties).sort(), Object.keys(evidence).sort())
  assert.deepEqual(schema.properties.version, { const: O1_AUTHENTICATED_GITHUB_EVENT_EVIDENCE_VERSION })
  assert.deepEqual(schema.properties.ingressDecision, { const: "ACCEPT" })
})

test("O1 production source exposes no listener, filesystem, child-process, or network import surface", () => {
  const source = readFileSync(new URL("../src/event-ingress/o1-authenticated-github-event-evidence.ts", import.meta.url), "utf8")
  for (const forbidden of ["node:child_process", "node:fs", "node:http", "node:https", "node:net", "node:dgram", "node:worker_threads", "ExecutionGateway", "process.env"]) {
    assert.equal(source.includes(forbidden), false, `forbidden O1 source surface: ${forbidden}`)
  }
})
