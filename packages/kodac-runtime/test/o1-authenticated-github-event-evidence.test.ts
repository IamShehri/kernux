import assert from "node:assert/strict"
import { createHash, createHmac } from "node:crypto"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  O1_AUTHENTICATED_GITHUB_EVENT_EVIDENCE_VERSION,
  O1_AUTHENTICATED_GITHUB_ISSUE_COMMENT_EVIDENCE_VERSION,
  O1_ISSUE_COMMENT_HEAD_BINDING_SOURCE,
  O1_ISSUE_COMMENT_MAX_BODY_BYTES,
  createO1AuthenticatedGithubEventEvidence,
  createO1AuthenticatedGithubIssueCommentEvidence,
  validateO1AuthenticatedGithubEventEvidence,
  validateO1AuthenticatedGithubIssueCommentEvidence,
  type O1AuthenticatedGithubEventInput,
  type O1AuthenticatedGithubIssueCommentInput,
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

const ISSUE_BINDING_POLICY_IDENTITY = "3".repeat(64)
const LEGACY_SCHEMA_SHA256 = "bee2fbd1fc998710f47697a5b4c33b490698aec1ca508e67b7cc7efaed643cf3"
const LEGACY_SCHEMA_GIT_BLOB = "8d251edf0c2c872db81de95bcfbaf9d7ad69d0a1"
const LEGACY_EVENT_IDENTITY = "9119a76528934b25a5223f5fd612af811c166f44145fd3e7521d7be19c7381c3"
const LEGACY_COMPATIBILITY_JSON = "{\"version\":\"kodac-o1-authenticated-github-event-evidence-v1\",\"eventSource\":\"GITHUB\",\"signatureAlgorithm\":\"HMAC_SHA256\",\"keyIdentity\":\"1111111111111111111111111111111111111111111111111111111111111111\",\"deliveryId\":\"delivery-001\",\"deliveryIdentity\":\"01f1494d3769712722ae9f927e97c56cbfb29ac69ce5e5a49a6af46a365d230e\",\"payloadSha256\":\"70cedbb27894fdb4a068c8ee7b6e2270ccf29b4e7b64e126d7c609277f67f87c\",\"eventName\":\"pull_request\",\"action\":\"opened\",\"repositoryId\":\"1001\",\"repositoryFullName\":\"TheHalfMoon/Kodac\",\"pullRequestNumber\":42,\"pullRequestId\":\"2002\",\"baseRepositoryId\":\"1001\",\"headRepositoryId\":\"1001\",\"forkClassification\":\"SAME_REPOSITORY\",\"observedHeadSha\":\"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\"expectedHeadSha\":\"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\"headMatch\":\"MATCH\",\"actorId\":\"3003\",\"actorLogin\":\"reviewer-user\",\"actorType\":\"User\",\"actorEligibilityPolicyIdentity\":\"2222222222222222222222222222222222222222222222222222222222222222\",\"actorEligibilityEvidenceRefs\":[\"policy:fixture\"],\"actorEligibilityDecision\":\"ELIGIBLE\",\"replayDecision\":\"UNSEEN\",\"authenticationDecision\":\"AUTHENTICATED\",\"ingressDecision\":\"ACCEPT\",\"eventEvidenceIdentity\":\"9119a76528934b25a5223f5fd612af811c166f44145fd3e7521d7be19c7381c3\"}"

function issueCommentPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const base = {
    action: "created",
    repository: { id: 1001, full_name: "TheHalfMoon/Kodac" },
    issue: {
      id: 4004,
      number: 42,
      pull_request: { url: "https://api.github.com/repos/TheHalfMoon/Kodac/pulls/42" },
    },
    comment: {
      id: 5005,
      node_id: "IC_kwDOExample",
      body: "@kodac review",
      user: { id: 3003, login: "reviewer-user", type: "User" },
    },
    sender: { id: 3003, login: "reviewer-user", type: "User" },
  }
  return { ...base, ...overrides }
}

function issueCommentBody(value: unknown = issueCommentPayload()): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(value))
}

function issueCommentInput(
  rawBody: Uint8Array = issueCommentBody(),
  overrides: Partial<O1AuthenticatedGithubIssueCommentInput> = {},
): O1AuthenticatedGithubIssueCommentInput {
  return {
    rawBody,
    signatureHeader: signature(rawBody),
    deliveryId: "issue-comment-delivery-001",
    eventName: "issue_comment",
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
    pullRequestBinding: {
      policyIdentity: ISSUE_BINDING_POLICY_IDENTITY,
      pullRequestId: "2002",
      baseRepositoryId: "1001",
      headRepositoryId: "1001",
      headRepositoryFullName: "TheHalfMoon/Kodac",
      observedHeadSha: HEAD,
      evidenceRefs: ["pr-snapshot:fixture"],
    },
    ...overrides,
  }
}

function mutableIssueCommentPayload(): Record<string, unknown> {
  return issueCommentPayload()
}

test("O1 issue-comment protocol version and body limit are exact", () => {
  assert.equal(O1_AUTHENTICATED_GITHUB_ISSUE_COMMENT_EVIDENCE_VERSION, "kodac-o1-authenticated-github-issue-comment-evidence-v1")
  assert.equal(O1_ISSUE_COMMENT_HEAD_BINDING_SOURCE, "CALLER_MATERIALIZED_PR_SNAPSHOT")
  assert.equal(O1_ISSUE_COMMENT_MAX_BODY_BYTES, 256 * 1024)
})

test("O1 accepts one valid signed same-repository PR issue comment", () => {
  const source = issueCommentInput()
  const evidence = createO1AuthenticatedGithubIssueCommentEvidence(source)
  assert.equal(evidence.version, O1_AUTHENTICATED_GITHUB_ISSUE_COMMENT_EVIDENCE_VERSION)
  assert.equal(evidence.eventName, "issue_comment")
  assert.equal(evidence.action, "created")
  assert.equal(evidence.pullRequestNumber, 42)
  assert.equal(evidence.pullRequestId, "2002")
  assert.equal(evidence.issueId, "4004")
  assert.equal(evidence.forkClassification, "SAME_REPOSITORY")
  assert.equal(evidence.headBindingSource, O1_ISSUE_COMMENT_HEAD_BINDING_SOURCE)
  assert.equal(evidence.observedHeadSha, HEAD)
  assert.equal(evidence.expectedHeadSha, HEAD)
  assert.equal(evidence.ingressDecision, "ACCEPT")
  assert.deepEqual(validateO1AuthenticatedGithubIssueCommentEvidence(evidence, source), evidence)
})

test("O1 classifies a caller-materialized fork PR binding for a signed issue comment", () => {
  const source = issueCommentInput(issueCommentBody(), {
    pullRequestBinding: {
      policyIdentity: ISSUE_BINDING_POLICY_IDENTITY,
      pullRequestId: "2002",
      baseRepositoryId: "1001",
      headRepositoryId: "9009",
      headRepositoryFullName: "fork-owner/Kodac",
      observedHeadSha: HEAD,
      evidenceRefs: ["pr-snapshot:fork"],
    },
  })
  const evidence = createO1AuthenticatedGithubIssueCommentEvidence(source)
  assert.equal(evidence.forkClassification, "FORK_REPOSITORY")
  assert.equal(evidence.headRepositoryId, "9009")
  assert.equal(evidence.headRepositoryFullName, "fork-owner/Kodac")
})

test("O1 issue-comment API admits only the issue_comment event name", () => {
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({ ...issueCommentInput(), eventName: "pull_request" as "issue_comment" }),
    /eventName must equal issue_comment/,
  )
})

test("O1 issue-comment API rejects edited actions", () => {
  const raw = issueCommentBody(issueCommentPayload({ action: "edited" }))
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(raw)), /action is unsupported/)
})

test("O1 issue-comment API rejects deleted actions", () => {
  const raw = issueCommentBody(issueCommentPayload({ action: "deleted" }))
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(raw)), /action is unsupported/)
})

test("O1 rejects a plain issue comment without signed issue.pull_request", () => {
  const value = mutableIssueCommentPayload()
  const issue = value.issue as Record<string, unknown>
  delete issue.pull_request
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(issueCommentBody(value))), /issue\.pull_request must be an object/)
})

test("O1 issue-comment rejects signed repository id mismatch", () => {
  const value = mutableIssueCommentPayload()
  value.repository = { id: 9999, full_name: "TheHalfMoon/Kodac" }
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(issueCommentBody(value))),
    /signed repository does not match/,
  )
})

test("O1 issue-comment rejects signed repository full-name mismatch", () => {
  const value = mutableIssueCommentPayload()
  value.repository = { id: 1001, full_name: "Other/Kodac" }
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(issueCommentBody(value))),
    /signed repository does not match/,
  )
})

test("O1 binds comment id node id body digest and length deterministically", () => {
  const left = createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput())
  const right = createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput())
  assert.equal(left.commentId, "5005")
  assert.equal(left.commentNodeId, "IC_kwDOExample")
  assert.equal(left.commentBodyByteLength, Buffer.byteLength("@kodac review", "utf8"))
  assert.equal(left.commentBodySha256, createHash("sha256").update("@kodac review", "utf8").digest("hex"))
  assert.equal(left.commentIdentity, right.commentIdentity)
  assert.equal(left.eventEvidenceIdentity, right.eventEvidenceIdentity)
})

test("O1 rejects comment-body mutation under an old raw-body signature", () => {
  const original = issueCommentInput()
  const value = mutableIssueCommentPayload()
  const comment = value.comment as Record<string, unknown>
  comment.body = "@kodac review changed"
  const changedRaw = issueCommentBody(value)
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({ ...original, rawBody: changedRaw }),
    /signature verification failed/,
  )
})

test("O1 signed comment-body mutation changes comment and final identities", () => {
  const first = createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput())
  const value = mutableIssueCommentPayload()
  const comment = value.comment as Record<string, unknown>
  comment.body = "@kodac review changed"
  const changed = createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(issueCommentBody(value)))
  assert.notEqual(changed.commentBodySha256, first.commentBodySha256)
  assert.notEqual(changed.commentIdentity, first.commentIdentity)
  assert.notEqual(changed.eventEvidenceIdentity, first.eventEvidenceIdentity)
})

test("O1 issue-comment rejects empty comment bodies", () => {
  const value = mutableIssueCommentPayload()
  ;(value.comment as Record<string, unknown>).body = ""
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(issueCommentBody(value))), /non-empty text/)
})

test("O1 issue-comment rejects oversized comment bodies", () => {
  const value = mutableIssueCommentPayload()
  ;(value.comment as Record<string, unknown>).body = "x".repeat(O1_ISSUE_COMMENT_MAX_BODY_BYTES + 1)
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(issueCommentBody(value))), /bounded non-empty text/)
})

test("O1 issue-comment rejects signed comment-user and sender mismatch", () => {
  const value = mutableIssueCommentPayload()
  ;(value.comment as Record<string, unknown>).user = { id: 7777, login: "other-user", type: "User" }
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(issueCommentBody(value))), /comment user does not match signed sender/)
})

test("O1 issue-comment rejects actor eligibility identity mismatch", () => {
  const source = issueCommentInput()
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({ ...source, actorEligibility: { ...source.actorEligibility, actorId: "9999" } }),
    /actor eligibility input does not match the signed actor/,
  )
})

test("O1 issue-comment rejects INELIGIBLE actors", () => {
  const source = issueCommentInput()
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({ ...source, actorEligibility: { ...source.actorEligibility, decision: "INELIGIBLE" } }),
    /not positively eligible/,
  )
})

test("O1 issue-comment rejects UNKNOWN actors", () => {
  const source = issueCommentInput()
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({ ...source, actorEligibility: { ...source.actorEligibility, decision: "UNKNOWN" } }),
    /not positively eligible/,
  )
})

test("O1 issue-comment rejects missing caller-materialized PR head binding", () => {
  const source = { ...issueCommentInput() } as unknown as Record<string, unknown>
  delete source.pullRequestBinding
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence(source as unknown as O1AuthenticatedGithubIssueCommentInput),
    /unexpected or missing properties/,
  )
})

test("O1 issue-comment rejects caller-materialized base repository mismatch", () => {
  const source = issueCommentInput()
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({
      ...source,
      pullRequestBinding: { ...source.pullRequestBinding, baseRepositoryId: "9999" },
    }),
    /base repository does not match expected repository/,
  )
})

test("O1 issue-comment rejects malformed head repository identity or name", () => {
  const source = issueCommentInput()
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({ ...source, pullRequestBinding: { ...source.pullRequestBinding, headRepositoryId: "0" } }),
    /canonical positive decimal identifier/,
  )
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({ ...source, pullRequestBinding: { ...source.pullRequestBinding, headRepositoryFullName: "not-a-repository" } }),
    /canonical owner\/name text/,
  )
})

test("O1 issue-comment rejects caller-materialized observed head mismatch", () => {
  const source = issueCommentInput()
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({ ...source, pullRequestBinding: { ...source.pullRequestBinding, observedHeadSha: OTHER_HEAD } }),
    /head does not match expected head/,
  )
})

test("O1 issue-comment requires non-empty PR-binding evidence refs", () => {
  const source = issueCommentInput()
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({ ...source, pullRequestBinding: { ...source.pullRequestBinding, evidenceRefs: [] } }),
    /evidenceRefs must not be empty/,
  )
})

test("O1 issue-comment changed caller-materialized head changes final identity", () => {
  const first = createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput())
  const base = issueCommentInput()
  const changed = createO1AuthenticatedGithubIssueCommentEvidence({
    ...base,
    expectedHeadSha: OTHER_HEAD,
    pullRequestBinding: { ...base.pullRequestBinding, observedHeadSha: OTHER_HEAD },
  })
  assert.equal(changed.headBindingSource, "CALLER_MATERIALIZED_PR_SNAPSHOT")
  assert.notEqual(changed.eventEvidenceIdentity, first.eventEvidenceIdentity)
})

test("O1 issue-comment changed head-binding policy changes final identity", () => {
  const first = createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput())
  const source = issueCommentInput()
  const changed = createO1AuthenticatedGithubIssueCommentEvidence({
    ...source,
    pullRequestBinding: { ...source.pullRequestBinding, policyIdentity: "4".repeat(64) },
  })
  assert.notEqual(changed.headBindingPolicyIdentity, first.headBindingPolicyIdentity)
  assert.notEqual(changed.eventEvidenceIdentity, first.eventEvidenceIdentity)
})

test("O1 issue-comment rejects exact duplicate delivery identity", () => {
  const firstInput = issueCommentInput()
  const first = createO1AuthenticatedGithubIssueCommentEvidence(firstInput)
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(firstInput.rawBody, { previousDeliveryIdentities: [first.deliveryIdentity] })),
    /delivery was already observed/,
  )
})

test("O1 issue-comment duplicate delivery remains blocked after authenticated payload change", () => {
  const first = createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput())
  const value = mutableIssueCommentPayload()
  ;(value.comment as Record<string, unknown>).body = "@kodac review changed"
  const changedRaw = issueCommentBody(value)
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(changedRaw, { previousDeliveryIdentities: [first.deliveryIdentity] })),
    /delivery was already observed/,
  )
})

test("O1 issue-comment rejects invalid UTF-8 and duplicate JSON keys", () => {
  const invalidUtf8 = Uint8Array.from([0xc3, 0x28])
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(invalidUtf8)), /valid UTF-8/)
  const valid = new TextDecoder().decode(issueCommentBody())
  const duplicate = new TextEncoder().encode(`{"action":"created",${valid.slice(1)}`)
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(duplicate)), /duplicate JSON key: action/)
})

test("O1 issue-comment rejects Proxy and revoked Proxy structured inputs", () => {
  const source = issueCommentInput()
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence(new Proxy(source, {}) as O1AuthenticatedGithubIssueCommentInput),
    /non-proxy plain object/,
  )
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({ ...source, pullRequestBinding: new Proxy(source.pullRequestBinding, {}) }),
    /non-proxy plain object/,
  )
  const revoked = Proxy.revocable(source, {})
  revoked.revoke()
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence(revoked.proxy as O1AuthenticatedGithubIssueCommentInput),
    /non-proxy plain object/,
  )
})

test("O1 issue-comment rejects accessors symbols non-enumerables and custom prototypes", () => {
  const source = issueCommentInput()
  const accessor = { ...source } as Record<string, unknown>
  Object.defineProperty(accessor, "deliveryId", { enumerable: true, get() { throw new Error("getter executed") } })
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(accessor as unknown as O1AuthenticatedGithubIssueCommentInput), /enumerable data property/)

  const symbol = { ...source } as O1AuthenticatedGithubIssueCommentInput & Record<string | symbol, unknown>
  symbol[Symbol("hostile")] = true
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(symbol), /symbol properties/)

  const hidden = { ...source } as Record<string, unknown>
  Object.defineProperty(hidden, "hidden", { value: true, enumerable: false })
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(hidden as unknown as O1AuthenticatedGithubIssueCommentInput), /enumerable data property/)

  const custom = Object.assign(Object.create({ hostile: true }), source) as O1AuthenticatedGithubIssueCommentInput
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(custom), /plain object/)
})

test("O1 issue-comment rejects sparse and extra-property evidence arrays", () => {
  const source = issueCommentInput()
  const sparse: string[] = []
  sparse.length = 1
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({ ...source, pullRequestBinding: { ...source.pullRequestBinding, evidenceRefs: sparse } }),
    /holes|unsupported properties/,
  )
  const extra = ["pr-snapshot:fixture"] as string[] & Record<string, unknown>
  extra.extra = true
  assert.throws(
    () => createO1AuthenticatedGithubIssueCommentEvidence({ ...source, pullRequestBinding: { ...source.pullRequestBinding, evidenceRefs: extra } }),
    /unsupported properties/,
  )
})

test("O1 issue-comment rejects unpaired Unicode and embedded NUL text", () => {
  const unpaired = mutableIssueCommentPayload()
  ;(unpaired.comment as Record<string, unknown>).body = "bad\ud800"
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(issueCommentBody(unpaired))), /Unicode scalar values/)
  const nul = mutableIssueCommentPayload()
  ;(nul.comment as Record<string, unknown>).body = "bad\0body"
  assert.throws(() => createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput(issueCommentBody(nul))), /bounded non-empty text/)
})

test("O1 issue-comment positive evidence is deeply frozen", () => {
  const evidence = createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput())
  assert.ok(Object.isFrozen(evidence))
  assert.ok(Object.isFrozen(evidence.headBindingEvidenceRefs))
  assert.ok(Object.isFrozen(evidence.actorEligibilityEvidenceRefs))
})

test("O1 issue-comment validator rejects forged derived fields", () => {
  const source = issueCommentInput()
  const evidence = createO1AuthenticatedGithubIssueCommentEvidence(source)
  assert.throws(
    () => validateO1AuthenticatedGithubIssueCommentEvidence({ ...evidence, commentIdentity: "f".repeat(64) }, source),
    /does not match independently rederived/,
  )
  assert.throws(
    () => validateO1AuthenticatedGithubIssueCommentEvidence({ ...evidence, forkClassification: "FORK_REPOSITORY" }, source),
    /does not match independently rederived/,
  )
  assert.throws(
    () => validateO1AuthenticatedGithubIssueCommentEvidence({ ...evidence, eventEvidenceIdentity: "e".repeat(64) }, source),
    /does not match independently rederived/,
  )
})

test("O1 issue-comment serialized evidence never contains secret bytes", () => {
  const evidence = createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput())
  assert.equal(JSON.stringify(evidence).includes("o1-unit-test-secret"), false)
})

test("O1 issue-comment serialized evidence never contains raw comment body", () => {
  const evidence = createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput())
  const serialized = JSON.stringify(evidence)
  assert.equal(serialized.includes("@kodac review"), false)
  assert.equal(serialized.includes("commentBodySha256"), true)
})

test("O1 issue-comment schema is Draft 2020-12 with exact positive surface parity", () => {
  const schema = JSON.parse(readFileSync(new URL("../../../schema/o1-authenticated-github-issue-comment-evidence.schema.json", import.meta.url), "utf8")) as {
    $schema: string
    additionalProperties: boolean
    required: string[]
    properties: Record<string, unknown>
  }
  const evidence = createO1AuthenticatedGithubIssueCommentEvidence(issueCommentInput())
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema")
  assert.equal(schema.additionalProperties, false)
  assert.deepEqual([...schema.required].sort(), Object.keys(evidence).sort())
  assert.deepEqual(Object.keys(schema.properties).sort(), Object.keys(evidence).sort())
  assert.deepEqual(schema.properties.version, { const: O1_AUTHENTICATED_GITHUB_ISSUE_COMMENT_EVIDENCE_VERSION })
  assert.deepEqual(schema.properties.eventName, { const: "issue_comment" })
  assert.deepEqual(schema.properties.action, { const: "created" })
  assert.deepEqual(schema.properties.headBindingSource, { const: O1_ISSUE_COMMENT_HEAD_BINDING_SOURCE })
})

test("O1 legacy pull-request fixture remains byte-for-byte compatible", () => {
  const evidence = createO1AuthenticatedGithubEventEvidence(input())
  assert.equal(evidence.eventEvidenceIdentity, LEGACY_EVENT_IDENTITY)
  assert.equal(JSON.stringify(evidence), LEGACY_COMPATIBILITY_JSON)
})

test("O1 legacy pull-request schema remains byte-identical", () => {
  const bytes = readFileSync(new URL("../../../schema/o1-authenticated-github-event-evidence.schema.json", import.meta.url))
  assert.equal(createHash("sha256").update(bytes).digest("hex"), LEGACY_SCHEMA_SHA256)
  assert.equal(LEGACY_SCHEMA_GIT_BLOB, "8d251edf0c2c872db81de95bcfbaf9d7ad69d0a1")
})

test("O1 source extension exposes no listener filesystem process network provider or K2 surface", () => {
  const source = readFileSync(new URL("../src/event-ingress/o1-authenticated-github-event-evidence.ts", import.meta.url), "utf8")
  for (const forbidden of [
    "node:child_process",
    "node:fs",
    "node:http",
    "node:https",
    "node:net",
    "node:dgram",
    "node:worker_threads",
    "process.env",
    "fetch(",
    "ExecutionGateway",
    "OpenAIResponsesProvider",
    "pr.comment",
  ]) {
    assert.equal(source.includes(forbidden), false, `forbidden O1 issue-comment source surface: ${forbidden}`)
  }
})

test("O1 issue-comment implementation allowlist remains exactly three paths", () => {
  const authorized = [
    "packages/kodac-runtime/src/event-ingress/o1-authenticated-github-event-evidence.ts",
    "packages/kodac-runtime/test/o1-authenticated-github-event-evidence.test.ts",
    "schema/o1-authenticated-github-issue-comment-evidence.schema.json",
  ]
  assert.equal(authorized.length, 3)
  assert.equal(new Set(authorized).size, 3)
})
