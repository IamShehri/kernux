import { createHash } from "node:crypto"
import { types as utilTypes } from "node:util"

import {
  P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_STATE,
  validateP7ToK5ReconciliationEvidenceBinding,
  type P7ToK5ReconciliationEvidenceBinding,
  type P7ToK5ReconciliationEvidenceBindingBuildInput,
} from "../proof-review/p7-k5-reconciliation-evidence-binding.ts"
import {
  P7_R6_VERIFICATION_REPORT_BOUND_STATE,
  validateP7PostApplyVerificationReportBinding,
  type P7PostApplyVerificationReportBinding,
  type P7PostApplyVerificationReportBindingBuildInput,
} from "../remediation/p7-post-apply-verification-report-binding.ts"
import { DoneGate } from "./done-gate.ts"
import type { VerificationEvidenceRef, VerificationReport } from "./types.ts"

export const P7_R30_DONE_GATE_PROOF_BINDING_VERSION = "p7-r30-done-gate-proof-binding-v1" as const
export const P7_R30_DONE_GATE_PROOF_BOUND_STATE = "P7_DONE_GATE_PROOF_BOUND_ONLY" as const

export interface P7DoneGateProofBindingBuildInput {
  readonly sourceP7ToK5ReconciliationEvidenceBinding: P7ToK5ReconciliationEvidenceBinding
  readonly sourceP7ToK5ReconciliationEvidenceBindingBuildInput: P7ToK5ReconciliationEvidenceBindingBuildInput
  readonly sourceP7PostApplyVerificationReportBinding: P7PostApplyVerificationReportBinding
  readonly sourceP7PostApplyVerificationReportBindingBuildInput: P7PostApplyVerificationReportBindingBuildInput
}

export interface P7DoneGateProofBinding {
  readonly version: typeof P7_R30_DONE_GATE_PROOF_BINDING_VERSION
  readonly proofIdentity: string
  readonly state: typeof P7_R30_DONE_GATE_PROOF_BOUND_STATE
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly p7VerificationReportBindingIdentity: string
  readonly p7VerificationReportIdentity: string
  readonly p7ToK5ReconciliationEvidenceIdentity: string
  readonly k5PackageIdentity: string
  readonly k5JudgmentIdentity: string
  readonly k5ReconciliationIdentity: string
  readonly doneGateStatus: "PROVEN_READY"
  readonly doneGateEvidence: readonly VerificationEvidenceRef[]
}

type UnknownRecord = Record<string, unknown>
type ProofCore = Omit<P7DoneGateProofBinding, "proofIdentity">

const SHA40 = /^[0-9a-f]{40}$/
const SHA256 = /^[0-9a-f]{64}$/
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u
const MAX_REPOSITORY_IDENTITY_CODE_POINTS = 512
const MAX_EVIDENCE_REF_CODE_POINTS = 1_024
const MAX_DONE_GATE_EVIDENCE = 1_536
const EVIDENCE_KINDS = new Set<VerificationEvidenceRef["kind"]>(["receipt", "artifact", "event", "workspace"])
const BUILD_INPUT_KEYS = [
  "sourceP7ToK5ReconciliationEvidenceBinding",
  "sourceP7ToK5ReconciliationEvidenceBindingBuildInput",
  "sourceP7PostApplyVerificationReportBinding",
  "sourceP7PostApplyVerificationReportBindingBuildInput",
] as const
const OUTPUT_KEYS = [
  "version",
  "proofIdentity",
  "state",
  "repositoryIdentity",
  "canonicalBase",
  "targetHead",
  "p7VerificationReportBindingIdentity",
  "p7VerificationReportIdentity",
  "p7ToK5ReconciliationEvidenceIdentity",
  "k5PackageIdentity",
  "k5JudgmentIdentity",
  "k5ReconciliationIdentity",
  "doneGateStatus",
  "doneGateEvidence",
] as const
const EVIDENCE_ALLOWED_KEYS = ["kind", "ref", "digest"] as const

function fail(label: string, detail: string): never {
  throw new TypeError(`${label} ${detail}`)
}

function strictRecord(value: unknown, expectedKeys: readonly string[], label: string): UnknownRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value)) fail(label, "must be a plain object")
  if (utilTypes.isProxy(value)) fail(label, "must not be a Proxy")
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(label, "must be a plain object")
  const keys = Reflect.ownKeys(value)
  if (keys.some((key) => typeof key !== "string")) fail(label, "must not contain symbol fields")
  const names = keys as string[]
  if (names.length !== expectedKeys.length || names.some((key) => !expectedKeys.includes(key))) {
    fail(label, `must contain exactly: ${expectedKeys.join(", ")}`)
  }
  for (const key of expectedKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}.${key}`, "must be an enumerable data property")
    }
  }
  return value as UnknownRecord
}

function denseArray(value: unknown, label: string, maximum: number): readonly unknown[] {
  if (!Array.isArray(value) || utilTypes.isProxy(value)) fail(label, "must be a non-proxy array")
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(label, "must use the ordinary Array prototype")
  const lengthDescriptor = Object.getOwnPropertyDescriptor(value, "length")
  if (
    lengthDescriptor === undefined ||
    !("value" in lengthDescriptor) ||
    !Number.isSafeInteger(lengthDescriptor.value) ||
    (lengthDescriptor.value as number) > maximum
  ) fail(label, `must expose an ordinary array length <= ${maximum}`)
  const length = lengthDescriptor.value as number
  const expected = new Set<string>(["length"])
  for (let index = 0; index < length; index += 1) expected.add(String(index))
  const keys = Reflect.ownKeys(value)
  if (keys.some((key) => typeof key !== "string" || !expected.has(key)) || keys.length !== expected.size) {
    fail(label, "must not contain symbol, accessor, sparse, or extra array properties")
  }
  const result: unknown[] = []
  for (let index = 0; index < length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index))
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}[${index}]`, "must be an enumerable data property")
    }
    result.push(descriptor.value)
  }
  return result
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

function codePointLength(value: string): number {
  let length = 0
  for (const _character of value) length += 1
  return length
}

function boundedText(value: unknown, label: string, maximumCodePoints: number): string {
  if (typeof value !== "string" || value.length === 0) fail(label, "must be a non-empty string")
  assertUnicodeScalars(value, label)
  if (CONTROL_CHARACTERS.test(value)) fail(label, "must not contain control characters")
  if (codePointLength(value) > maximumCodePoints) fail(label, `must be at most ${maximumCodePoints} Unicode code points`)
  return value
}

function sha40(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA40.test(value)) fail(label, "must be a lowercase 40-hex Git object identity")
  return value
}

function sha256(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) fail(label, "must be a lowercase SHA-256 identity")
  return value
}

function fixed<T extends string>(value: unknown, expected: T, label: string): T {
  if (value !== expected) fail(label, `must equal ${expected}`)
  return expected
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (value !== null && typeof value === "object") {
    const source = value as UnknownRecord
    const ordered: UnknownRecord = {}
    for (const key of Object.keys(source).sort()) ordered[key] = canonicalize(source[key])
    return ordered
  }
  return value
}

function canonicalJson(value: unknown): string {
  return JSON.stringify(canonicalize(value))
}

function hashCanonical(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value), "utf8").digest("hex")
}

function sameCanonical(left: unknown, right: unknown): boolean {
  return canonicalJson(left) === canonicalJson(right)
}

function normalizeBuildInput(value: P7DoneGateProofBindingBuildInput): P7DoneGateProofBindingBuildInput {
  const record = strictRecord(value, BUILD_INPUT_KEYS, "input")
  return Object.freeze({
    sourceP7ToK5ReconciliationEvidenceBinding:
      record.sourceP7ToK5ReconciliationEvidenceBinding as P7ToK5ReconciliationEvidenceBinding,
    sourceP7ToK5ReconciliationEvidenceBindingBuildInput:
      record.sourceP7ToK5ReconciliationEvidenceBindingBuildInput as P7ToK5ReconciliationEvidenceBindingBuildInput,
    sourceP7PostApplyVerificationReportBinding:
      record.sourceP7PostApplyVerificationReportBinding as P7PostApplyVerificationReportBinding,
    sourceP7PostApplyVerificationReportBindingBuildInput:
      record.sourceP7PostApplyVerificationReportBindingBuildInput as P7PostApplyVerificationReportBindingBuildInput,
  })
}

function reportForDoneGate(source: P7PostApplyVerificationReportBinding): VerificationReport {
  return {
    protocol: source.verificationReport.protocol,
    version: source.verificationReport.version,
    sessionId: source.verificationReport.sessionId,
    startedAt: source.verificationReport.startedAt,
    completedAt: source.verificationReport.completedAt,
    passed: source.verificationReport.passed,
    checks: source.verificationReport.checks.map((check) => ({
      id: check.id,
      category: check.category,
      status: check.status,
      summary: check.summary,
      evidence: check.evidence.map((item) => ({
        kind: item.kind,
        ref: item.ref,
        ...(item.digest === undefined ? {} : { digest: item.digest }),
      })),
    })),
  }
}

function normalizeEvidence(value: unknown, label: string): Readonly<VerificationEvidenceRef> {
  if (value === null || typeof value !== "object" || Array.isArray(value) || utilTypes.isProxy(value)) {
    fail(label, "must be a non-proxy plain object")
  }
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(label, "must be a plain object")
  const keys = Reflect.ownKeys(value)
  if (keys.some((key) => typeof key !== "string")) fail(label, "must not contain symbol fields")
  const names = keys as string[]
  if (
    names.some((key) => !EVIDENCE_ALLOWED_KEYS.includes(key as (typeof EVIDENCE_ALLOWED_KEYS)[number])) ||
    !names.includes("kind") ||
    !names.includes("ref") ||
    names.length < 2 ||
    names.length > 3
  ) fail(label, "must contain kind, ref, and optional digest only")
  for (const key of names) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}.${key}`, "must be an enumerable data property")
    }
  }
  const record = value as UnknownRecord
  if (typeof record.kind !== "string" || !EVIDENCE_KINDS.has(record.kind as VerificationEvidenceRef["kind"])) {
    fail(`${label}.kind`, "is unsupported")
  }
  const normalized: VerificationEvidenceRef = {
    kind: record.kind as VerificationEvidenceRef["kind"],
    ref: boundedText(record.ref, `${label}.ref`, MAX_EVIDENCE_REF_CODE_POINTS),
  }
  if (Object.hasOwn(record, "digest")) normalized.digest = sha256(record.digest, `${label}.digest`)
  return Object.freeze(normalized)
}

function normalizeDoneGateEvidence(value: unknown, label: string): readonly Readonly<VerificationEvidenceRef>[] {
  const items = denseArray(value, label, MAX_DONE_GATE_EVIDENCE)
  if (items.length === 0) fail(label, "must contain at least one evidence reference")
  const evidence = items.map((item, index) => normalizeEvidence(item, `${label}[${index}]`))
  const membership = evidence.map((item) => `${item.kind}\u0000${item.ref}`)
  if (new Set(membership).size !== membership.length) fail(label, "must preserve Done Gate kind/ref deduplication")
  const ordered = [...evidence].sort((left, right) =>
    compareStrings(left.kind, right.kind) ||
    compareStrings(left.ref, right.ref) ||
    compareStrings(left.digest ?? "", right.digest ?? ""),
  )
  return Object.freeze(ordered)
}

async function buildValidated(inputValue: P7DoneGateProofBindingBuildInput): Promise<P7DoneGateProofBinding> {
  const input = normalizeBuildInput(inputValue)
  const r29 = await validateP7ToK5ReconciliationEvidenceBinding(
    input.sourceP7ToK5ReconciliationEvidenceBinding,
    input.sourceP7ToK5ReconciliationEvidenceBindingBuildInput,
  )
  const r6 = validateP7PostApplyVerificationReportBinding(
    input.sourceP7PostApplyVerificationReportBinding,
    input.sourceP7PostApplyVerificationReportBindingBuildInput,
  )

  if (r29.state !== P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_STATE) {
    fail("sourceP7ToK5ReconciliationEvidenceBinding.state", `must equal ${P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_STATE}`)
  }
  if (r6.state !== P7_R6_VERIFICATION_REPORT_BOUND_STATE) {
    fail("sourceP7PostApplyVerificationReportBinding.state", `must equal ${P7_R6_VERIFICATION_REPORT_BOUND_STATE}`)
  }
  if (r29.repositoryIdentity !== r6.repositoryIdentity) fail("input.repositoryIdentity", "must converge between R29 and R6")
  if (r29.canonicalBase !== r6.canonicalBase) fail("input.canonicalBase", "must converge between R29 and R6")
  if (r29.targetHead !== r6.targetHead) fail("input.targetHead", "must converge between R29 and R6")
  if (r6.verificationReport.protocol !== "kodac.verification") fail("sourceP7PostApplyVerificationReportBinding.verificationReport.protocol", "must equal kodac.verification")
  if (r6.verificationReport.version !== 1) fail("sourceP7PostApplyVerificationReportBinding.verificationReport.version", "must equal 1")
  if (r6.verificationReportPassed !== true || r6.verificationReport.passed !== true) {
    fail("sourceP7PostApplyVerificationReportBinding.verificationReportPassed", "must be true before Done Gate proof binding")
  }

  const gate = new DoneGate().evaluate(reportForDoneGate(r6))
  if (gate.status !== "PROVEN_READY") fail("doneGate.status", "must equal PROVEN_READY")
  if (gate.reasons.length !== 0) fail("doneGate.reasons", "must be empty for PROVEN_READY")
  const doneGateEvidence = normalizeDoneGateEvidence(gate.evidence, "doneGate.evidence")

  const core = Object.freeze({
    version: P7_R30_DONE_GATE_PROOF_BINDING_VERSION,
    state: P7_R30_DONE_GATE_PROOF_BOUND_STATE,
    repositoryIdentity: r29.repositoryIdentity,
    canonicalBase: r29.canonicalBase,
    targetHead: r29.targetHead,
    p7VerificationReportBindingIdentity: r6.bindingIdentity,
    p7VerificationReportIdentity: r6.verificationReportIdentity,
    p7ToK5ReconciliationEvidenceIdentity: r29.evidenceIdentity,
    k5PackageIdentity: r29.k5PackageIdentity,
    k5JudgmentIdentity: r29.k5JudgmentIdentity,
    k5ReconciliationIdentity: r29.k5ReconciliationIdentity,
    doneGateStatus: "PROVEN_READY" as const,
    doneGateEvidence,
  }) satisfies ProofCore

  return Object.freeze({ ...core, proofIdentity: hashCanonical(core) })
}

function normalizeBinding(value: unknown): P7DoneGateProofBinding {
  const record = strictRecord(value, OUTPUT_KEYS, "p7DoneGateProofBinding")
  const core = Object.freeze({
    version: fixed(record.version, P7_R30_DONE_GATE_PROOF_BINDING_VERSION, "p7DoneGateProofBinding.version"),
    state: fixed(record.state, P7_R30_DONE_GATE_PROOF_BOUND_STATE, "p7DoneGateProofBinding.state"),
    repositoryIdentity: boundedText(record.repositoryIdentity, "p7DoneGateProofBinding.repositoryIdentity", MAX_REPOSITORY_IDENTITY_CODE_POINTS),
    canonicalBase: sha40(record.canonicalBase, "p7DoneGateProofBinding.canonicalBase"),
    targetHead: sha40(record.targetHead, "p7DoneGateProofBinding.targetHead"),
    p7VerificationReportBindingIdentity: sha256(record.p7VerificationReportBindingIdentity, "p7DoneGateProofBinding.p7VerificationReportBindingIdentity"),
    p7VerificationReportIdentity: sha256(record.p7VerificationReportIdentity, "p7DoneGateProofBinding.p7VerificationReportIdentity"),
    p7ToK5ReconciliationEvidenceIdentity: sha256(record.p7ToK5ReconciliationEvidenceIdentity, "p7DoneGateProofBinding.p7ToK5ReconciliationEvidenceIdentity"),
    k5PackageIdentity: sha256(record.k5PackageIdentity, "p7DoneGateProofBinding.k5PackageIdentity"),
    k5JudgmentIdentity: sha256(record.k5JudgmentIdentity, "p7DoneGateProofBinding.k7PackageIdentity"),
    k5ReconciliationIdentity: sha256(record.k5ReconciliationIdentity, "p7DoneGateProofBinding.k5ReconciliationIdentity"),
    doneGateStatus: fixed(record.doneGateStatus, "PROVEN_READY", "p7DoneGateProofBinding.doneGateStatus"),
    doneGateEvidence: normalizeDoneGateEvidence(record.doneGateEvidence, "p7DoneGateProofBinding.doneGateEvidence"),
  }) satisfies ProofCore
  const proofIdentity = sha256(record.proofIdentity, "p7DoneGateProofBinding.proofIdentity")
  if (proofIdentity !== hashCanonical(core)) fail("p7DoneGateProofBinding.proofIdentity", "does not match the canonical output preimage")
  return Object.freeze({ ...core, proofIdentity })
}

export async function buildP7DoneGateProofBinding(
  input: P7DoneGateProofBindingBuildInput,
): Promise<P7DoneGateProofBinding> {
  return buildValidated(input)
}

export async function validateP7DoneGateProofBinding(
  value: unknown,
  input: P7DoneGateProofBindingBuildInput,
): Promise<P7DoneGateProofBinding> {
  const normalized = normalizeBinding(value)
  const expected = await buildValidated(input)
  if (!sameCanonical(normalized, expected)) {
    fail("p7DoneGateProofBinding", "does not equal the canonical rebuild from bound R29/R6 predecessor evidence and Done Gate verdict")
  }
  return expected
}
