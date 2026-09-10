import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { TextDecoder, types } from "node:util"

export const O1_AUTHENTICATED_GITHUB_EVENT_EVIDENCE_VERSION = "kodac-o1-authenticated-github-event-evidence-v1" as const
export const O1_EVENT_SOURCE = "GITHUB" as const
export const O1_SIGNATURE_ALGORITHM = "HMAC_SHA256" as const

const SHA1_RE = /^[0-9a-f]{40}$/
const SHA256_RE = /^[0-9a-f]{64}$/
const DECIMAL_ID_RE = /^(?:[1-9][0-9]{0,19})$/
const DELIVERY_RE = /^[A-Za-z0-9._:-]{1,128}$/
const REPOSITORY_RE = /^[A-Za-z0-9_.-]{1,100}\/[A-Za-z0-9_.-]{1,100}$/
const LOGIN_RE = /^[A-Za-z0-9_.\-\[\]]{1,100}$/
const SUPPORTED_ACTIONS = new Set(["opened", "reopened", "synchronize", "ready_for_review"] as const)
const ACTOR_TYPES = new Set(["User", "Bot", "Organization"] as const)
const ACTOR_DECISIONS = new Set(["ELIGIBLE", "INELIGIBLE", "UNKNOWN"] as const)

const MAX_RAW_BODY_BYTES = 1024 * 1024
const MAX_SECRET_BYTES = 4096
const MAX_JSON_DEPTH = 64
const MAX_JSON_MEMBERS = 50_000
const MAX_PREVIOUS_DELIVERIES = 4096
const MAX_EVIDENCE_REFS = 64
const MAX_EVIDENCE_REF_BYTES = 1024

type JsonPrimitive = null | boolean | number | string
type JsonValue = JsonPrimitive | JsonValue[] | JsonObject
type JsonObject = { [key: string]: JsonValue }
type RecordValue = Record<string, unknown>

export type O1ActorEligibilityDecision = "ELIGIBLE" | "INELIGIBLE" | "UNKNOWN"
export type O1ActorType = "User" | "Bot" | "Organization"
export type O1ForkClassification = "SAME_REPOSITORY" | "FORK_REPOSITORY"

export interface O1ActorEligibilityInput {
  readonly policyIdentity: string
  readonly actorId: string
  readonly actorLogin: string
  readonly decision: O1ActorEligibilityDecision
  readonly evidenceRefs: readonly string[]
}

export interface O1AuthenticatedGithubEventInput {
  readonly rawBody: Uint8Array
  readonly signatureHeader: string
  readonly deliveryId: string
  readonly eventName: string
  readonly keyIdentity: string
  readonly secret: Uint8Array
  readonly expectedRepositoryId: string
  readonly expectedRepositoryFullName: string
  readonly expectedHeadSha: string
  readonly actorEligibility: O1ActorEligibilityInput
  readonly previousDeliveryIdentities: readonly string[]
}

export interface O1AuthenticatedGithubEventEvidence {
  readonly version: typeof O1_AUTHENTICATED_GITHUB_EVENT_EVIDENCE_VERSION
  readonly eventSource: typeof O1_EVENT_SOURCE
  readonly signatureAlgorithm: typeof O1_SIGNATURE_ALGORITHM
  readonly keyIdentity: string
  readonly deliveryId: string
  readonly deliveryIdentity: string
  readonly payloadSha256: string
  readonly eventName: "pull_request"
  readonly action: "opened" | "reopened" | "synchronize" | "ready_for_review"
  readonly repositoryId: string
  readonly repositoryFullName: string
  readonly pullRequestNumber: number
  readonly pullRequestId: string
  readonly baseRepositoryId: string
  readonly headRepositoryId: string
  readonly forkClassification: O1ForkClassification
  readonly observedHeadSha: string
  readonly expectedHeadSha: string
  readonly headMatch: "MATCH"
  readonly actorId: string
  readonly actorLogin: string
  readonly actorType: O1ActorType
  readonly actorEligibilityPolicyIdentity: string
  readonly actorEligibilityEvidenceRefs: readonly string[]
  readonly actorEligibilityDecision: "ELIGIBLE"
  readonly replayDecision: "UNSEEN"
  readonly authenticationDecision: "AUTHENTICATED"
  readonly ingressDecision: "ACCEPT"
  readonly eventEvidenceIdentity: string
}

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

function fail(message: string): never {
  throw new TypeError(`O1 authenticated GitHub event blocked: ${message}`)
}

function ownDataRecord(value: unknown, label: string): RecordValue {
  if (typeof value !== "object" || value === null || types.isProxy(value) || Array.isArray(value)) fail(`${label} must be a non-proxy plain object`)
  const proto = Object.getPrototypeOf(value)
  if (proto !== Object.prototype && proto !== null) fail(`${label} must be a plain object`)
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string") fail(`${label} must not contain symbol properties`)
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (!descriptor || !descriptor.enumerable || !("value" in descriptor) || descriptor.get || descriptor.set) fail(`${label}.${key} must be an enumerable data property`)
  }
  return value as RecordValue
}

function exactKeys(record: RecordValue, required: readonly string[], label: string): void {
  const actual = Object.keys(record).sort(compareStrings)
  const expected = [...required].sort(compareStrings)
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) fail(`${label} has unexpected or missing properties`)
}

function boundedText(value: unknown, label: string, maxBytes: number): string {
  if (typeof value !== "string" || value.length === 0 || value.includes("\0") || Buffer.byteLength(value, "utf8") > maxBytes) fail(`${label} must be bounded non-empty text`)
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1)
      if (!(next >= 0xdc00 && next <= 0xdfff)) fail(`${label} must contain only Unicode scalar values`)
      index += 1
      continue
    }
    if (code >= 0xdc00 && code <= 0xdfff) fail(`${label} must contain only Unicode scalar values`)
  }
  return value
}

function sha1(value: unknown, label: string): string {
  const text = boundedText(value, label, 40)
  if (!SHA1_RE.test(text)) fail(`${label} must be lowercase 40-hex`)
  return text
}

function sha256(value: unknown, label: string): string {
  const text = boundedText(value, label, 64)
  if (!SHA256_RE.test(text)) fail(`${label} must be lowercase 64-hex`)
  return text
}

function decimalId(value: unknown, label: string): string {
  const text = boundedText(value, label, 20)
  if (!DECIMAL_ID_RE.test(text)) fail(`${label} must be a canonical positive decimal identifier`)
  return text
}

function jsonId(value: JsonValue | undefined, label: string): string {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) fail(`${label} must be a positive safe integer in the signed payload`)
  return String(value)
}

function githubLogin(value: unknown, label: string): string {
  const text = boundedText(value, label, 100)
  if (!LOGIN_RE.test(text)) fail(`${label} has unsupported GitHub login syntax`)
  return text
}

function repositoryName(value: unknown, label: string): string {
  const text = boundedText(value, label, 201)
  if (!REPOSITORY_RE.test(text)) fail(`${label} must be canonical owner/name text`)
  return text
}

function safeStringArray(value: unknown, label: string, maxItems: number, itemMaxBytes: number, itemValidator?: (value: unknown, label: string) => string): string[] {
  if (typeof value !== "object" || value === null || types.isProxy(value) || !Array.isArray(value)) fail(`${label} must be a non-proxy array`)
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(`${label} must use the built-in Array prototype`)
  if (value.length > maxItems) fail(`${label} exceeds item bound`)
  const allowed = new Set<string>(["length", ...Array.from({ length: value.length }, (_, index) => String(index))])
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string" || !allowed.has(key)) fail(`${label} contains unsupported properties`)
    if (key === "length") continue
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (!descriptor || !descriptor.enumerable || !("value" in descriptor) || descriptor.get || descriptor.set) fail(`${label}[${key}] must be an enumerable data property`)
  }
  const result: string[] = []
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, index)) fail(`${label} must not contain holes`)
    const item = value[index]
    result.push(itemValidator ? itemValidator(item, `${label}[${index}]`) : boundedText(item, `${label}[${index}]`, itemMaxBytes))
  }
  if (new Set(result).size !== result.length) fail(`${label} must not contain duplicates`)
  return result.sort(compareStrings)
}

function copyBytes(value: unknown, label: string, maxBytes: number, allowEmpty = false): Uint8Array {
  if (typeof value !== "object" || value === null || types.isProxy(value) || !(value instanceof Uint8Array)) fail(`${label} must be a non-proxy Uint8Array`)
  const copy = Uint8Array.prototype.slice.call(value) as Uint8Array
  if ((!allowEmpty && copy.byteLength === 0) || copy.byteLength > maxBytes) fail(`${label} has invalid byte length`)
  return copy
}

function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`
  const record = value as RecordValue
  return `{${Object.keys(record).sort(compareStrings).map((key) => `${JSON.stringify(key)}:${canonical(record[key])}`).join(",")}}`
}

function digest(value: unknown): string {
  return createHash("sha256").update(typeof value === "string" ? value : canonical(value), "utf8").digest("hex")
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as RecordValue)) deepFreeze(child)
  }
  return value
}

class StrictJsonParser {
  private index = 0
  private members = 0
  private readonly text: string

  constructor(text: string) {
    this.text = text
  }

  parse(): JsonValue {
    const value = this.parseValue(0)
    this.skipWhitespace()
    if (this.index !== this.text.length) fail("signed payload contains trailing JSON data")
    return value
  }

  private skipWhitespace(): void {
    while (this.index < this.text.length && /[\t\n\r ]/.test(this.text[this.index] as string)) this.index += 1
  }

  private parseValue(depth: number): JsonValue {
    if (depth > MAX_JSON_DEPTH) fail("signed payload exceeds JSON depth bound")
    this.skipWhitespace()
    const char = this.text[this.index]
    if (char === "{") return this.parseObject(depth)
    if (char === "[") return this.parseArray(depth)
    if (char === '"') return this.parseString()
    if (char === "t" && this.text.slice(this.index, this.index + 4) === "true") { this.index += 4; return true }
    if (char === "f" && this.text.slice(this.index, this.index + 5) === "false") { this.index += 5; return false }
    if (char === "n" && this.text.slice(this.index, this.index + 4) === "null") { this.index += 4; return null }
    return this.parseNumber()
  }

  private countMember(): void {
    this.members += 1
    if (this.members > MAX_JSON_MEMBERS) fail("signed payload exceeds JSON member bound")
  }

  private parseObject(depth: number): JsonObject {
    this.index += 1
    const result: JsonObject = Object.create(null) as JsonObject
    const keys = new Set<string>()
    this.skipWhitespace()
    if (this.text[this.index] === "}") { this.index += 1; return result }
    for (;;) {
      this.skipWhitespace()
      if (this.text[this.index] !== '"') fail("signed payload object key must be a JSON string")
      const key = this.parseString()
      if (keys.has(key)) fail(`signed payload contains duplicate JSON key: ${key}`)
      keys.add(key)
      this.countMember()
      this.skipWhitespace()
      if (this.text[this.index] !== ":") fail("signed payload object is missing colon")
      this.index += 1
      result[key] = this.parseValue(depth + 1)
      this.skipWhitespace()
      const separator = this.text[this.index]
      if (separator === "}") { this.index += 1; return result }
      if (separator !== ",") fail("signed payload object is missing comma")
      this.index += 1
    }
  }

  private parseArray(depth: number): JsonValue[] {
    this.index += 1
    const result: JsonValue[] = []
    this.skipWhitespace()
    if (this.text[this.index] === "]") { this.index += 1; return result }
    for (;;) {
      this.countMember()
      result.push(this.parseValue(depth + 1))
      this.skipWhitespace()
      const separator = this.text[this.index]
      if (separator === "]") { this.index += 1; return result }
      if (separator !== ",") fail("signed payload array is missing comma")
      this.index += 1
    }
  }

  private parseString(): string {
    const start = this.index
    this.index += 1
    let escaped = false
    while (this.index < this.text.length) {
      const code = this.text.charCodeAt(this.index)
      if (!escaped && code === 0x22) {
        this.index += 1
        try {
          return JSON.parse(this.text.slice(start, this.index)) as string
        } catch {
          fail("signed payload contains invalid JSON string escape")
        }
      }
      if (!escaped && code < 0x20) fail("signed payload contains control character in JSON string")
      if (!escaped && code === 0x5c) escaped = true
      else escaped = false
      this.index += 1
    }
    fail("signed payload contains unterminated JSON string")
  }

  private parseNumber(): number {
    const rest = this.text.slice(this.index)
    const match = /^-(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?|^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/.exec(rest)
    if (!match) fail("signed payload contains invalid JSON value")
    this.index += match[0].length
    const value = Number(match[0])
    if (!Number.isFinite(value)) fail("signed payload number must be finite")
    return value
  }
}

function jsonObject(value: JsonValue | undefined, label: string): JsonObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail(`${label} must be an object in the signed payload`)
  return value
}

function jsonString(value: JsonValue | undefined, label: string, maxBytes: number): string {
  if (typeof value !== "string") fail(`${label} must be a string in the signed payload`)
  return boundedText(value, label, maxBytes)
}

function normalizeInput(value: unknown): {
  rawBody: Uint8Array
  signatureHeader: string
  deliveryId: string
  eventName: "pull_request"
  keyIdentity: string
  secret: Uint8Array
  expectedRepositoryId: string
  expectedRepositoryFullName: string
  expectedHeadSha: string
  actorEligibility: O1ActorEligibilityInput
  previousDeliveryIdentities: string[]
} {
  const record = ownDataRecord(value, "input")
  exactKeys(record, ["rawBody", "signatureHeader", "deliveryId", "eventName", "keyIdentity", "secret", "expectedRepositoryId", "expectedRepositoryFullName", "expectedHeadSha", "actorEligibility", "previousDeliveryIdentities"], "input")
  const rawBody = copyBytes(record.rawBody, "rawBody", MAX_RAW_BODY_BYTES)
  const secret = copyBytes(record.secret, "secret", MAX_SECRET_BYTES)
  const signatureHeader = boundedText(record.signatureHeader, "signatureHeader", 71)
  if (!/^sha256=[0-9a-f]{64}$/.test(signatureHeader)) fail("signatureHeader must use exact sha256=<64 lowercase hex> form")
  const deliveryId = boundedText(record.deliveryId, "deliveryId", 128)
  if (!DELIVERY_RE.test(deliveryId)) fail("deliveryId has unsupported syntax")
  if (record.eventName !== "pull_request") fail("eventName is not admitted by the first O1 slice")
  const keyIdentity = sha256(record.keyIdentity, "keyIdentity")
  const expectedRepositoryId = decimalId(record.expectedRepositoryId, "expectedRepositoryId")
  const expectedRepositoryFullName = repositoryName(record.expectedRepositoryFullName, "expectedRepositoryFullName")
  const expectedHeadSha = sha1(record.expectedHeadSha, "expectedHeadSha")

  const actor = ownDataRecord(record.actorEligibility, "actorEligibility")
  exactKeys(actor, ["policyIdentity", "actorId", "actorLogin", "decision", "evidenceRefs"], "actorEligibility")
  const decision = boundedText(actor.decision, "actorEligibility.decision", 16)
  if (!ACTOR_DECISIONS.has(decision as O1ActorEligibilityDecision)) fail("actorEligibility.decision is unsupported")
  const evidenceRefs = safeStringArray(actor.evidenceRefs, "actorEligibility.evidenceRefs", MAX_EVIDENCE_REFS, MAX_EVIDENCE_REF_BYTES)
  const actorEligibility: O1ActorEligibilityInput = {
    policyIdentity: sha256(actor.policyIdentity, "actorEligibility.policyIdentity"),
    actorId: decimalId(actor.actorId, "actorEligibility.actorId"),
    actorLogin: githubLogin(actor.actorLogin, "actorEligibility.actorLogin"),
    decision: decision as O1ActorEligibilityDecision,
    evidenceRefs,
  }
  const previousDeliveryIdentities = safeStringArray(record.previousDeliveryIdentities, "previousDeliveryIdentities", MAX_PREVIOUS_DELIVERIES, 64, sha256)
  return { rawBody, signatureHeader, deliveryId, eventName: "pull_request", keyIdentity, secret, expectedRepositoryId, expectedRepositoryFullName, expectedHeadSha, actorEligibility, previousDeliveryIdentities }
}

function verifySignature(rawBody: Uint8Array, secret: Uint8Array, signatureHeader: string): void {
  const expected = createHmac("sha256", secret).update(rawBody).digest()
  const supplied = Buffer.from(signatureHeader.slice("sha256=".length), "hex")
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) fail("signature verification failed")
}

function evidenceValue(value: unknown): O1AuthenticatedGithubEventEvidence {
  const record = ownDataRecord(value, "evidence")
  const keys = ["version", "eventSource", "signatureAlgorithm", "keyIdentity", "deliveryId", "deliveryIdentity", "payloadSha256", "eventName", "action", "repositoryId", "repositoryFullName", "pullRequestNumber", "pullRequestId", "baseRepositoryId", "headRepositoryId", "forkClassification", "observedHeadSha", "expectedHeadSha", "headMatch", "actorId", "actorLogin", "actorType", "actorEligibilityPolicyIdentity", "actorEligibilityEvidenceRefs", "actorEligibilityDecision", "replayDecision", "authenticationDecision", "ingressDecision", "eventEvidenceIdentity"] as const
  exactKeys(record, keys, "evidence")
  if (record.version !== O1_AUTHENTICATED_GITHUB_EVENT_EVIDENCE_VERSION || record.eventSource !== O1_EVENT_SOURCE || record.signatureAlgorithm !== O1_SIGNATURE_ALGORITHM) fail("evidence protocol constants mismatch")
  if (record.eventName !== "pull_request" || !SUPPORTED_ACTIONS.has(record.action as typeof SUPPORTED_ACTIONS extends Set<infer T> ? T : never)) fail("evidence event/action mismatch")
  if (record.headMatch !== "MATCH" || record.actorEligibilityDecision !== "ELIGIBLE" || record.replayDecision !== "UNSEEN" || record.authenticationDecision !== "AUTHENTICATED" || record.ingressDecision !== "ACCEPT") fail("evidence positive decision constants mismatch")
  if (record.forkClassification !== "SAME_REPOSITORY" && record.forkClassification !== "FORK_REPOSITORY") fail("evidence fork classification mismatch")
  if (!ACTOR_TYPES.has(record.actorType as O1ActorType)) fail("evidence actor type unsupported")
  if (typeof record.pullRequestNumber !== "number" || !Number.isSafeInteger(record.pullRequestNumber) || record.pullRequestNumber <= 0) fail("evidence pullRequestNumber invalid")
  const evidenceRefs = safeStringArray(record.actorEligibilityEvidenceRefs, "evidence.actorEligibilityEvidenceRefs", MAX_EVIDENCE_REFS, MAX_EVIDENCE_REF_BYTES)
  return {
    version: O1_AUTHENTICATED_GITHUB_EVENT_EVIDENCE_VERSION,
    eventSource: O1_EVENT_SOURCE,
    signatureAlgorithm: O1_SIGNATURE_ALGORITHM,
    keyIdentity: sha256(record.keyIdentity, "evidence.keyIdentity"),
    deliveryId: boundedText(record.deliveryId, "evidence.deliveryId", 128),
    deliveryIdentity: sha256(record.deliveryIdentity, "evidence.deliveryIdentity"),
    payloadSha256: sha256(record.payloadSha256, "evidence.payloadSha256"),
    eventName: "pull_request",
    action: record.action as O1AuthenticatedGithubEventEvidence["action"],
    repositoryId: decimalId(record.repositoryId, "evidence.repositoryId"),
    repositoryFullName: repositoryName(record.repositoryFullName, "evidence.repositoryFullName"),
    pullRequestNumber: record.pullRequestNumber,
    pullRequestId: decimalId(record.pullRequestId, "evidence.pullRequestId"),
    baseRepositoryId: decimalId(record.baseRepositoryId, "evidence.baseRepositoryId"),
    headRepositoryId: decimalId(record.headRepositoryId, "evidence.headRepositoryId"),
    forkClassification: record.forkClassification as O1ForkClassification,
    observedHeadSha: sha1(record.observedHeadSha, "evidence.observedHeadSha"),
    expectedHeadSha: sha1(record.expectedHeadSha, "evidence.expectedHeadSha"),
    headMatch: "MATCH",
    actorId: decimalId(record.actorId, "evidence.actorId"),
    actorLogin: githubLogin(record.actorLogin, "evidence.actorLogin"),
    actorType: record.actorType as O1ActorType,
    actorEligibilityPolicyIdentity: sha256(record.actorEligibilityPolicyIdentity, "evidence.actorEligibilityPolicyIdentity"),
    actorEligibilityEvidenceRefs: evidenceRefs,
    actorEligibilityDecision: "ELIGIBLE",
    replayDecision: "UNSEEN",
    authenticationDecision: "AUTHENTICATED",
    ingressDecision: "ACCEPT",
    eventEvidenceIdentity: sha256(record.eventEvidenceIdentity, "evidence.eventEvidenceIdentity"),
  }
}

export function createO1AuthenticatedGithubEventEvidence(inputValue: O1AuthenticatedGithubEventInput): O1AuthenticatedGithubEventEvidence {
  const input = normalizeInput(inputValue)
  verifySignature(input.rawBody, input.secret, input.signatureHeader)

  let text: string
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(input.rawBody)
  } catch {
    fail("signed payload is not valid UTF-8")
  }
  const parsed = new StrictJsonParser(text).parse()
  const root = jsonObject(parsed, "payload")
  const action = jsonString(root.action, "payload.action", 32)
  if (!SUPPORTED_ACTIONS.has(action as O1AuthenticatedGithubEventEvidence["action"])) fail("payload action is unsupported")

  const repository = jsonObject(root.repository, "payload.repository")
  const repositoryId = jsonId(repository.id, "payload.repository.id")
  const repositoryFullName = repositoryName(jsonString(repository.full_name, "payload.repository.full_name", 201), "payload.repository.full_name")
  if (repositoryId !== input.expectedRepositoryId || repositoryFullName !== input.expectedRepositoryFullName) fail("signed repository does not match expected repository")

  const outerNumber = root.number
  if (typeof outerNumber !== "number" || !Number.isSafeInteger(outerNumber) || outerNumber <= 0) fail("payload.number must be a positive safe integer")
  const pullRequest = jsonObject(root.pull_request, "payload.pull_request")
  const prNumber = pullRequest.number
  if (typeof prNumber !== "number" || !Number.isSafeInteger(prNumber) || prNumber !== outerNumber) fail("signed pull request number is missing or inconsistent")
  const pullRequestId = jsonId(pullRequest.id, "payload.pull_request.id")
  const base = jsonObject(pullRequest.base, "payload.pull_request.base")
  const baseRepository = jsonObject(base.repo, "payload.pull_request.base.repo")
  const baseRepositoryId = jsonId(baseRepository.id, "payload.pull_request.base.repo.id")
  const baseRepositoryFullName = repositoryName(jsonString(baseRepository.full_name, "payload.pull_request.base.repo.full_name", 201), "payload.pull_request.base.repo.full_name")
  if (baseRepositoryId !== repositoryId || baseRepositoryFullName !== repositoryFullName) fail("pull request base repository does not match signed repository")

  const head = jsonObject(pullRequest.head, "payload.pull_request.head")
  const observedHeadSha = sha1(jsonString(head.sha, "payload.pull_request.head.sha", 40), "payload.pull_request.head.sha")
  if (observedHeadSha !== input.expectedHeadSha) fail("signed pull request head does not match expected head")
  const headRepository = jsonObject(head.repo, "payload.pull_request.head.repo")
  const headRepositoryId = jsonId(headRepository.id, "payload.pull_request.head.repo.id")
  repositoryName(jsonString(headRepository.full_name, "payload.pull_request.head.repo.full_name", 201), "payload.pull_request.head.repo.full_name")
  const forkClassification: O1ForkClassification = headRepositoryId === baseRepositoryId ? "SAME_REPOSITORY" : "FORK_REPOSITORY"

  const sender = jsonObject(root.sender, "payload.sender")
  const actorId = jsonId(sender.id, "payload.sender.id")
  const actorLogin = githubLogin(jsonString(sender.login, "payload.sender.login", 100), "payload.sender.login")
  const actorType = jsonString(sender.type, "payload.sender.type", 32)
  if (!ACTOR_TYPES.has(actorType as O1ActorType)) fail("payload sender type is unsupported")
  if (actorId !== input.actorEligibility.actorId || actorLogin !== input.actorEligibility.actorLogin) fail("actor eligibility input does not match the signed actor")
  if (input.actorEligibility.decision !== "ELIGIBLE") fail("actor is not positively eligible")

  const payloadSha256 = createHash("sha256").update(input.rawBody).digest("hex")
  const deliveryIdentity = digest({
    domain: "KODAC-O1-DELIVERY-IDENTITY-V1",
    eventSource: O1_EVENT_SOURCE,
    eventName: input.eventName,
    deliveryId: input.deliveryId,
  })
  if (input.previousDeliveryIdentities.includes(deliveryIdentity)) fail("delivery was already observed")

  const baseEvidence = {
    version: O1_AUTHENTICATED_GITHUB_EVENT_EVIDENCE_VERSION,
    eventSource: O1_EVENT_SOURCE,
    signatureAlgorithm: O1_SIGNATURE_ALGORITHM,
    keyIdentity: input.keyIdentity,
    deliveryId: input.deliveryId,
    deliveryIdentity,
    payloadSha256,
    eventName: "pull_request" as const,
    action: action as O1AuthenticatedGithubEventEvidence["action"],
    repositoryId,
    repositoryFullName,
    pullRequestNumber: outerNumber,
    pullRequestId,
    baseRepositoryId,
    headRepositoryId,
    forkClassification,
    observedHeadSha,
    expectedHeadSha: input.expectedHeadSha,
    headMatch: "MATCH" as const,
    actorId,
    actorLogin,
    actorType: actorType as O1ActorType,
    actorEligibilityPolicyIdentity: input.actorEligibility.policyIdentity,
    actorEligibilityEvidenceRefs: [...input.actorEligibility.evidenceRefs],
    actorEligibilityDecision: "ELIGIBLE" as const,
    replayDecision: "UNSEEN" as const,
    authenticationDecision: "AUTHENTICATED" as const,
    ingressDecision: "ACCEPT" as const,
  }
  const eventEvidenceIdentity = digest({ domain: "KODAC-O1-AUTHENTICATED-GITHUB-EVENT-EVIDENCE-V1", evidence: baseEvidence })
  return deepFreeze({ ...baseEvidence, eventEvidenceIdentity })
}

export function validateO1AuthenticatedGithubEventEvidence(value: unknown, sourceInput: O1AuthenticatedGithubEventInput): O1AuthenticatedGithubEventEvidence {
  const actual = evidenceValue(value)
  const expected = createO1AuthenticatedGithubEventEvidence(sourceInput)
  if (canonical(actual) !== canonical(expected)) fail("serialized evidence does not match independently rederived source evidence")
  return expected
}
