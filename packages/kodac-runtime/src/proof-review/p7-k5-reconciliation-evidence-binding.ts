import { createHash } from "node:crypto"
import { types as utilTypes } from "node:util"

import {
  P7_R28_BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_STATE,
  validateP7FullExactHeadReviewCompletenessEvidenceBinding,
  type P7FullExactHeadReviewCompletenessEvidenceBinding,
  type P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput,
} from "../remediation/p7-full-exact-head-review-completeness-evidence-binding.ts"
import {
  validateK5R1ProofJudgment,
  validateK5R1ProofPackage,
  type K5R1ProofJudgment,
  type K5R1ProofPackage,
} from "./contracts.ts"
import { judgeK5R1ProofPackage } from "./judge.ts"
import { linkK5R2Evidence } from "./linkage.ts"
import { linkK5R3ReviewAdjudicationEvidence } from "./review-adjudication.ts"
import {
  validateK5R4ProofStateReconciliation,
  type K5R4ProofStateReconciliation,
} from "./reconciliation-contracts.ts"
import { reconcileK5R4ProofState } from "./reconciliation.ts"

export const P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BINDING_VERSION =
  "p7-r29-p7-k5-reconciliation-evidence-binding-v1" as const
export const P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_STATE =
  "P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY" as const
export const P7_R29_BRIDGE_REQUIREMENT_ID = "p7.full-exact-head-review-completeness" as const
export const P7_R29_BRIDGE_EVIDENCE_ID = "p7-r28.full-exact-head-review-completeness" as const

export interface P7ToK5ReconciliationEvidenceBindingBuildInput {
  readonly sourceP7FullExactHeadReviewCompletenessEvidenceBinding: P7FullExactHeadReviewCompletenessEvidenceBinding
  readonly sourceP7FullExactHeadReviewCompletenessEvidenceBindingBuildInput: P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput
  readonly sourceK5R1ProofPackage: K5R1ProofPackage
  readonly sourceK5R1ProofJudgment: K5R1ProofJudgment
  readonly sourceK5R4ProofStateReconciliation: K5R4ProofStateReconciliation
}

export interface P7ToK5ReconciliationEvidenceBinding {
  readonly version: typeof P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BINDING_VERSION
  readonly evidenceIdentity: string
  readonly state: typeof P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_STATE
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly targetTree: string
  readonly changedPathSetIdentity: string
  readonly reviewUniverseIdentity: string
  readonly p7CompletenessEvidenceIdentity: string
  readonly k5PackageIdentity: string
  readonly k5JudgmentIdentity: string
  readonly k5ReconciliationIdentity: string
  readonly bridgeRequirementId: typeof P7_R29_BRIDGE_REQUIREMENT_ID
  readonly bridgeEvidenceId: typeof P7_R29_BRIDGE_EVIDENCE_ID
  readonly k5PackageStatus: "SUFFICIENT_PACKAGE"
  readonly k5R4Status: "NOT_APPLICABLE"
}

type UnknownRecord = Record<string, unknown>
type BindingCore = Omit<P7ToK5ReconciliationEvidenceBinding, "evidenceIdentity">

const SHA40 = /^[0-9a-f]{40}$/
const SHA256 = /^[0-9a-f]{64}$/
const BUILD_INPUT_KEYS = [
  "sourceP7FullExactHeadReviewCompletenessEvidenceBinding",
  "sourceP7FullExactHeadReviewCompletenessEvidenceBindingBuildInput",
  "sourceK5R1ProofPackage",
  "sourceK5R1ProofJudgment",
  "sourceK5R4ProofStateReconciliation",
] as const
const OUTPUT_KEYS = [
  "version",
  "evidenceIdentity",
  "state",
  "repositoryIdentity",
  "canonicalBase",
  "targetHead",
  "targetTree",
  "changedPathSetIdentity",
  "reviewUniverseIdentity",
  "p7CompletenessEvidenceIdentity",
  "k5PackageIdentity",
  "k5JudgmentIdentity",
  "k5ReconciliationIdentity",
  "bridgeRequirementId",
  "bridgeEvidenceId",
  "k5PackageStatus",
  "k5R4Status",
] as const

function fail(label: string, detail: string): never {
  throw new TypeError(`${label} ${detail}`)
}

function unicodeScalarString(value: unknown, label: string, maxBytes = 1024): string {
  if (typeof value !== "string" || value.length === 0) fail(label, "must be a non-empty string")
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
  if (Buffer.byteLength(value, "utf8") > maxBytes) fail(label, `must be at most ${maxBytes} UTF-8 bytes`)
  return value
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

function fixed(value: unknown, expected: string, label: string): string {
  if (value !== expected) fail(label, `must equal ${expected}`)
  return expected
}

function sha40(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA40.test(value)) fail(label, "must be a lowercase 40-hex Git object identity")
  return value
}

function sha256(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) fail(label, "must be a lowercase SHA-256 identity")
  return value
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

function normalizeBuildInput(value: P7ToK5ReconciliationEvidenceBindingBuildInput): P7ToK5ReconciliationEvidenceBindingBuildInput {
  const record = strictRecord(value, BUILD_INPUT_KEYS, "input")
  return Object.freeze({
    sourceP7FullExactHeadReviewCompletenessEvidenceBinding:
      record.sourceP7FullExactHeadReviewCompletenessEvidenceBinding as P7FullExactHeadReviewCompletenessEvidenceBinding,
    sourceP7FullExactHeadReviewCompletenessEvidenceBindingBuildInput:
      record.sourceP7FullExactHeadReviewCompletenessEvidenceBindingBuildInput as P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput,
    sourceK5R1ProofPackage: record.sourceK5R1ProofPackage as K5R1ProofPackage,
    sourceK5R1ProofJudgment: record.sourceK5R1ProofJudgment as K5R1ProofJudgment,
    sourceK5R4ProofStateReconciliation: record.sourceK5R4ProofStateReconciliation as K5R4ProofStateReconciliation,
  })
}

function requireBridgePackage(
  p7: P7FullExactHeadReviewCompletenessEvidenceBinding,
  proofPackage: K5R1ProofPackage,
): void {
  if (proofPackage.subject.subjectKind !== "VERIFICATION") fail("sourceK5R1ProofPackage.subject.subjectKind", "must equal VERIFICATION")
  if (proofPackage.subject.subjectId !== p7.evidenceIdentity) fail("sourceK5R1ProofPackage.subject.subjectId", "must equal the P7-R28 evidence identity")
  if (proofPackage.revision.repositoryId !== p7.repositoryIdentity) fail("sourceK5R1ProofPackage.revision.repositoryId", "must equal the P7 repository identity")
  if (proofPackage.revision.canonicalBase !== p7.canonicalBase) fail("sourceK5R1ProofPackage.revision.canonicalBase", "must equal the P7 canonical base")
  if (proofPackage.revision.candidateHead !== p7.targetHead) fail("sourceK5R1ProofPackage.revision.candidateHead", "must equal the P7 target head")
  if (proofPackage.requirements.length !== 1) fail("sourceK5R1ProofPackage.requirements", "must contain exactly one bridge requirement")
  if (proofPackage.evidence.length !== 1) fail("sourceK5R1ProofPackage.evidence", "must contain exactly one bridge evidence record")

  const requirement = proofPackage.requirements[0]
  if (requirement.requirementId !== P7_R29_BRIDGE_REQUIREMENT_ID) fail("sourceK5R1ProofPackage.requirements[0].requirementId", `must equal ${P7_R29_BRIDGE_REQUIREMENT_ID}`)
  if (requirement.kind !== "CUSTOM") fail("sourceK5R1ProofPackage.requirements[0].kind", "must equal CUSTOM")
  if (requirement.minimumEvidence !== 1) fail("sourceK5R1ProofPackage.requirements[0].minimumEvidence", "must equal 1")

  const evidence = proofPackage.evidence[0]
  if (evidence.evidenceId !== P7_R29_BRIDGE_EVIDENCE_ID) fail("sourceK5R1ProofPackage.evidence[0].evidenceId", `must equal ${P7_R29_BRIDGE_EVIDENCE_ID}`)
  if (evidence.kind !== "CUSTOM") fail("sourceK5R1ProofPackage.evidence[0].kind", "must equal CUSTOM")
  if (evidence.requirementIds.length !== 1 || evidence.requirementIds[0] !== P7_R29_BRIDGE_REQUIREMENT_ID) {
    fail("sourceK5R1ProofPackage.evidence[0].requirementIds", "must contain exactly the P7-R29 bridge requirement")
  }
  if (evidence.canonicalBase !== p7.canonicalBase) fail("sourceK5R1ProofPackage.evidence[0].canonicalBase", "must equal the P7 canonical base")
  if (evidence.candidateHead !== p7.targetHead) fail("sourceK5R1ProofPackage.evidence[0].candidateHead", "must equal the P7 target head")
  if (evidence.ref !== `p7-r28:${p7.evidenceIdentity}`) fail("sourceK5R1ProofPackage.evidence[0].ref", "must bind the exact P7-R28 evidence identity")
  if (evidence.digest !== p7.evidenceIdentity) fail("sourceK5R1ProofPackage.evidence[0].digest", "must equal the P7-R28 evidence identity")
  if (evidence.status !== "SATISFIED") fail("sourceK5R1ProofPackage.evidence[0].status", "must equal SATISFIED")
}

function requireBridgeJudgment(proofPackage: K5R1ProofPackage, judgment: K5R1ProofJudgment): void {
  const expected = judgeK5R1ProofPackage(proofPackage)
  if (!sameCanonical(judgment, expected)) fail("sourceK5R1ProofJudgment", "must equal the canonical judgment recomputation for the exact bridge package")
  if (judgment.packageIdentity !== proofPackage.packageIdentity) fail("sourceK5R1ProofJudgment.packageIdentity", "must equal the bridge package identity")
  if (judgment.status !== "SUFFICIENT_PACKAGE") fail("sourceK5R1ProofJudgment.status", "must equal SUFFICIENT_PACKAGE")
  if (judgment.reasons.length !== 0) fail("sourceK5R1ProofJudgment.reasons", "must be empty")
  if (judgment.evidenceIds.length !== 1 || judgment.evidenceIds[0] !== P7_R29_BRIDGE_EVIDENCE_ID) {
    fail("sourceK5R1ProofJudgment.evidenceIds", "must contain exactly the P7-R29 bridge evidence id")
  }
  if (judgment.requirementResults.length !== 1) fail("sourceK5R1ProofJudgment.requirementResults", "must contain exactly one bridge requirement result")
  const result = judgment.requirementResults[0]
  if (
    result.requirementId !== P7_R29_BRIDGE_REQUIREMENT_ID ||
    result.kind !== "CUSTOM" ||
    result.minimumEvidence !== 1 ||
    result.satisfiedFingerprintCount !== 1 ||
    result.status !== "SATISFIED"
  ) {
    fail("sourceK5R1ProofJudgment.requirementResults[0]", "must be the exact satisfied P7-R29 bridge requirement result")
  }
}

function requireBridgeReconciliation(
  proofPackage: K5R1ProofPackage,
  reconciliation: K5R4ProofStateReconciliation,
): void {
  const r2 = linkK5R2Evidence(proofPackage, [])
  const r3 = linkK5R3ReviewAdjudicationEvidence(proofPackage, [])
  const expected = reconcileK5R4ProofState(proofPackage, r2, r3)
  if (!sameCanonical(reconciliation, expected)) {
    fail("sourceK5R4ProofStateReconciliation", "must equal the canonical K5-R4 recomputation for the exact custom-only bridge package")
  }
  if (reconciliation.packageIdentity !== proofPackage.packageIdentity) fail("sourceK5R4ProofStateReconciliation.packageIdentity", "must equal the bridge package identity")
  if (reconciliation.status !== "NOT_APPLICABLE") fail("sourceK5R4ProofStateReconciliation.status", "must equal NOT_APPLICABLE")
  if (reconciliation.results.length !== 0) fail("sourceK5R4ProofStateReconciliation.results", "must be empty for the custom-only bridge package")
  if (reconciliation.outOfScopeEvidenceIds.length !== 1 || reconciliation.outOfScopeEvidenceIds[0] !== P7_R29_BRIDGE_EVIDENCE_ID) {
    fail("sourceK5R4ProofStateReconciliation.outOfScopeEvidenceIds", "must contain exactly the P7-R29 bridge evidence id")
  }
}

async function buildValidated(inputValue: P7ToK5ReconciliationEvidenceBindingBuildInput): Promise<P7ToK5ReconciliationEvidenceBinding> {
  const input = normalizeBuildInput(inputValue)
  const p7 = await validateP7FullExactHeadReviewCompletenessEvidenceBinding(
    input.sourceP7FullExactHeadReviewCompletenessEvidenceBinding,
    input.sourceP7FullExactHeadReviewCompletenessEvidenceBindingBuildInput,
  )
  if (p7.state !== P7_R28_BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_STATE) fail("sourceP7FullExactHeadReviewCompletenessEvidenceBinding.state", "must equal the bounded R28 completeness state")
  if (p7.unknownCoveragePathCount !== 0) fail("sourceP7FullExactHeadReviewCompletenessEvidenceBinding.unknownCoveragePathCount", "must equal 0")
  if (p7.riskCoverageState !== "ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN") fail("sourceP7FullExactHeadReviewCompletenessEvidenceBinding.riskCoverageState", "must have no uncovered or unknown risk debt")
  if (p7.skillCoverageState !== "ACCOUNTED_NO_COVERAGE_DEBT") fail("sourceP7FullExactHeadReviewCompletenessEvidenceBinding.skillCoverageState", "must have no skill coverage debt")
  if (p7.providerCompletionState !== "CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION") fail("sourceP7FullExactHeadReviewCompletenessEvidenceBinding.providerCompletionState", "must be caller-asserted completed with no known truncation")

  const proofPackage = validateK5R1ProofPackage(input.sourceK5R1ProofPackage)
  requireBridgePackage(p7, proofPackage)
  const judgment = validateK5R1ProofJudgment(input.sourceK5R1ProofJudgment)
  requireBridgeJudgment(proofPackage, judgment)
  const reconciliation = validateK5R4ProofStateReconciliation(input.sourceK5R4ProofStateReconciliation)
  requireBridgeReconciliation(proofPackage, reconciliation)

  const core = Object.freeze({
    version: P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BINDING_VERSION,
    state: P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_STATE,
    repositoryIdentity: p7.repositoryIdentity,
    canonicalBase: p7.canonicalBase,
    targetHead: p7.targetHead,
    targetTree: p7.targetTree,
    changedPathSetIdentity: p7.changedPathSetIdentity,
    reviewUniverseIdentity: p7.reviewUniverseIdentity,
    p7CompletenessEvidenceIdentity: p7.evidenceIdentity,
    k5PackageIdentity: proofPackage.packageIdentity,
    k5JudgmentIdentity: judgment.judgmentIdentity,
    k5ReconciliationIdentity: reconciliation.reconciliationIdentity,
    bridgeRequirementId: P7_R29_BRIDGE_REQUIREMENT_ID,
    bridgeEvidenceId: P7_R29_BRIDGE_EVIDENCE_ID,
    k5PackageStatus: "SUFFICIENT_PACKAGE" as const,
    k5R4Status: "NOT_APPLICABLE" as const,
  }) satisfies BindingCore

  return Object.freeze({ ...core, evidenceIdentity: hashCanonical(core) })
}

function normalizeBinding(value: unknown): P7ToK5ReconciliationEvidenceBinding {
  const record = strictRecord(value, OUTPUT_KEYS, "p7ToK5ReconciliationEvidenceBinding")
  const core = Object.freeze({
    version: fixed(record.version, P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BINDING_VERSION, "p7ToK5ReconciliationEvidenceBinding.version") as typeof P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BINDING_VERSION,
    state: fixed(record.state, P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_STATE, "p7ToK5ReconciliationEvidenceBinding.state") as typeof P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_STATE,
    repositoryIdentity: unicodeScalarString(record.repositoryIdentity, "p7ToK5ReconciliationEvidenceBinding.repositoryIdentity", 512),
    canonicalBase: sha40(record.canonicalBase, "p7ToK5ReconciliationEvidenceBinding.canonicalBase"),
    targetHead: sha40(record.targetHead, "p7ToK5ReconciliationEvidenceBinding.targetHead"),
    targetTree: sha40(record.targetTree, "p7ToK5ReconciliationEvidenceBinding.targetTree"),
    changedPathSetIdentity: sha256(record.changedPathSetIdentity, "p7ToK5ReconciliationEvidenceBinding.changedPathSetIdentity"),
    reviewUniverseIdentity: sha256(record.reviewUniverseIdentity, "p7ToK5ReconciliationEvidenceBinding.reviewUniverseIdentity"),
    p7CompletenessEvidenceIdentity: sha256(record.p7CompletenessEvidenceIdentity, "p7ToK5ReconciliationEvidenceBinding.p7CompletenessEvidenceIdentity"),
    k5PackageIdentity: sha256(record.k5PackageIdentity, "p7ToK5ReconciliationEvidenceBinding.k5PackageIdentity"),
    k5JudgmentIdentity: sha256(record.k5JudgmentIdentity, "p7ToK5ReconciliationEvidenceBinding.k5JudgmentIdentity"),
    k5ReconciliationIdentity: sha256(record.k5ReconciliationIdentity, "p7ToK5ReconciliationEvidenceBinding.k5ReconciliationIdentity"),
    bridgeRequirementId: fixed(record.bridgeRequirementId, P7_R29_BRIDGE_REQUIREMENT_ID, "p7ToK5ReconciliationEvidenceBinding.bridgeRequirementId") as typeof P7_R29_BRIDGE_REQUIREMENT_ID,
    bridgeEvidenceId: fixed(record.bridgeEvidenceId, P7_R29_BRIDGE_EVIDENCE_ID, "p7ToK5ReconciliationEvidenceBinding.bridgeEvidenceId") as typeof P7_R29_BRIDGE_EVIDENCE_ID,
    k5PackageStatus: fixed(record.k5PackageStatus, "SUFFICIENT_PACKAGE", "p7ToK5ReconciliationEvidenceBinding.k5PackageStatus") as "SUFFICIENT_PACKAGE",
    k5R4Status: fixed(record.k5R4Status, "NOT_APPLICABLE", "p7ToK5ReconciliationEvidenceBinding.k5R4Status") as "NOT_APPLICABLE",
  }) satisfies BindingCore
  const evidenceIdentity = sha256(record.evidenceIdentity, "p7ToK5ReconciliationEvidenceBinding.evidenceIdentity")
  const expectedIdentity = hashCanonical(core)
  if (evidenceIdentity !== expectedIdentity) fail("p7ToK5ReconciliationEvidenceBinding.evidenceIdentity", "does not match the canonical output preimage")
  return Object.freeze({ ...core, evidenceIdentity })
}

export async function buildP7ToK5ReconciliationEvidenceBinding(
  input: P7ToK5ReconciliationEvidenceBindingBuildInput,
): Promise<P7ToK5ReconciliationEvidenceBinding> {
  return buildValidated(input)
}

export async function validateP7ToK5ReconciliationEvidenceBinding(
  value: unknown,
  input: P7ToK5ReconciliationEvidenceBindingBuildInput,
): Promise<P7ToK5ReconciliationEvidenceBinding> {
  const normalized = normalizeBinding(value)
  const expected = await buildValidated(input)
  if (!sameCanonical(normalized, expected)) fail("p7ToK5ReconciliationEvidenceBinding", "does not equal the canonical rebuild from bound P7/K5 predecessor evidence")
  return expected
}
