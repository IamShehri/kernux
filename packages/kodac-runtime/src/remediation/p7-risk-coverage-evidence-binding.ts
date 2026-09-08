import { createHash } from "node:crypto"
import { types as nodeTypes } from "node:util"

import {
  P7_R23_CONTENT_DISPOSITIONS,
  buildP7ReviewCoverageUniverseEvidenceBinding,
  validateP7ReviewCoverageUniverseEvidenceBinding,
  type P7ReviewCoverageContentDisposition,
} from "./p7-review-coverage-universe-evidence-binding.ts"
import {
  P7_R24_DETERMINISTIC_SECURITY_PRESCAN_RULE_SET_IDENTITY,
  buildP7DeterministicSecurityPrescanEvidenceBinding,
  validateP7DeterministicSecurityPrescanEvidenceBinding,
  type P7DeterministicSecurityPrescanBuildInput,
  type P7DeterministicSecurityPrescanEvidenceBinding,
} from "./p7-deterministic-security-prescan-evidence-binding.ts"

export const P7_R25_RISK_COVERAGE_EVIDENCE_BINDING_VERSION =
  "p7-r25-risk-coverage-evidence-binding-v1" as const
export const P7_R25_RISK_COVERAGE_BOUND_STATE = "RISK_COVERAGE_EVIDENCE_BOUND_ONLY" as const

export const P7_R25_RISK_COVERAGE_LIMITS = Object.freeze({
  maxRisks: 16,
  maxApplicabilityEvidenceIdentitiesPerRisk: 16,
  maxReviewerFindingReferences: 256,
  maxReviewerFindingReferencesPerRisk: 64,
  maxStaticSignalsPerRisk: 4_096,
  maxExternalMappingsPerRisk: 16,
  maxIdentifierCodePoints: 128,
  maxMappingCodePoints: 512,
  maxGraphNodes: 131_072,
  maxGraphDepth: 64,
  maxGraphStringBytes: 16_777_216,
})

export const P7_R25_RISK_APPLICABILITIES = ["APPLICABLE", "NOT_APPLICABLE", "UNKNOWN"] as const
export const P7_R25_RISK_COVERAGE_METHODS = ["DETERMINISTIC_PRESCAN", "REVIEWER_FINDING_REFERENCE"] as const
export const P7_R25_RISK_COVERAGE_DISPOSITIONS = [
  "COVERED_BY_BOUNDED_METHOD",
  "UNCOVERED_APPLICABLE",
  "NOT_APPLICABLE",
  "UNKNOWN_APPLICABILITY",
] as const
export const P7_R25_RISK_COVERAGE_STATES = [
  "ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN",
  "HAS_UNCOVERED_RISK",
  "HAS_UNKNOWN_APPLICABILITY",
  "HAS_UNCOVERED_AND_UNKNOWN",
] as const

export type P7RiskApplicability = (typeof P7_R25_RISK_APPLICABILITIES)[number]
export type P7RiskCoverageMethod = (typeof P7_R25_RISK_COVERAGE_METHODS)[number]
export type P7RiskCoverageDisposition = (typeof P7_R25_RISK_COVERAGE_DISPOSITIONS)[number]
export type P7RiskCoverageState = (typeof P7_R25_RISK_COVERAGE_STATES)[number]

type RiskDefinition = Readonly<{
  riskId: string
  riskVersion: string
  staticRuleIds: readonly string[]
  externalTaxonomyMappings: readonly string[]
}>

const R24_RULE_IDS = Object.freeze([
  "cloud_metadata_access",
  "credential_path_access",
  "decode_then_execute",
  "persistence_mechanism_indicator",
  "prompt_injection_indicator",
  "remote_pipe_to_shell",
  "reverse_shell_indicator",
  "sensitive_data_exfiltration_indicator",
  "ssh_key_write_indicator",
  "suspicious_executable_download",
] as const)

const RISK_TAXONOMY: readonly RiskDefinition[] = Object.freeze([
  Object.freeze({
    riskId: "credential_access",
    riskVersion: "1",
    staticRuleIds: Object.freeze(["cloud_metadata_access", "credential_path_access"]),
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:cloud_metadata_access",
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:credential_file_access",
    ]),
  }),
  Object.freeze({
    riskId: "data_exfiltration",
    riskVersion: "1",
    staticRuleIds: Object.freeze(["sensitive_data_exfiltration_indicator"]),
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:outbound_data_exfil",
    ]),
  }),
  Object.freeze({
    riskId: "encoded_execution",
    riskVersion: "1",
    staticRuleIds: Object.freeze(["decode_then_execute"]),
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:encoded_payload",
    ]),
  }),
  Object.freeze({
    riskId: "persistence",
    riskVersion: "1",
    staticRuleIds: Object.freeze(["persistence_mechanism_indicator", "ssh_key_write_indicator"]),
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:crontab_persistence",
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:ssh_key_write",
    ]),
  }),
  Object.freeze({
    riskId: "prompt_injection",
    riskVersion: "1",
    staticRuleIds: Object.freeze(["prompt_injection_indicator"]),
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:prompt_injection",
    ]),
  }),
  Object.freeze({
    riskId: "remote_execution",
    riskVersion: "1",
    staticRuleIds: Object.freeze(["remote_pipe_to_shell", "reverse_shell_indicator"]),
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:curl_pipe_exec",
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:reverse_shell",
    ]),
  }),
  Object.freeze({
    riskId: "semantic_logic_abuse",
    riskVersion: "1",
    staticRuleIds: Object.freeze([]),
    externalTaxonomyMappings: Object.freeze([]),
  }),
  Object.freeze({
    riskId: "supply_chain_payload",
    riskVersion: "1",
    staticRuleIds: Object.freeze(["suspicious_executable_download"]),
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:non_official_download",
    ]),
  }),
])

export const P7_R25_RISK_IDS = Object.freeze(RISK_TAXONOMY.map((risk) => risk.riskId))

export interface P7RiskCoverageApplicabilityInput {
  readonly riskId: string
  readonly applicability: P7RiskApplicability
  readonly evidenceIdentities: readonly string[]
}

export interface P7RiskCoverageReviewerFindingReferenceInput {
  readonly riskId: string
  readonly reviewerFindingEvidenceIdentity: string
}

export interface P7RiskCoverageEvidenceBindingBuildInput {
  readonly securityPrescanBuildInput: P7DeterministicSecurityPrescanBuildInput
  readonly securityPrescanEvidence: P7DeterministicSecurityPrescanEvidenceBinding
  readonly riskApplicability: readonly P7RiskCoverageApplicabilityInput[]
  readonly reviewerFindingReferences: readonly P7RiskCoverageReviewerFindingReferenceInput[]
}

export interface P7RiskCoverageDispositionCount {
  readonly contentDisposition: Exclude<P7ReviewCoverageContentDisposition, "reviewable_text">
  readonly count: number
}

export interface P7RiskCoverageRecord {
  readonly riskId: string
  readonly riskVersion: string
  readonly applicability: P7RiskApplicability
  readonly applicabilityEvidenceIdentities: readonly string[]
  readonly staticRuleIds: readonly string[]
  readonly staticSignalEvidenceIdentities: readonly string[]
  readonly reviewerFindingEvidenceIdentities: readonly string[]
  readonly coverageMethods: readonly P7RiskCoverageMethod[]
  readonly coverageDisposition: P7RiskCoverageDisposition
}

export interface P7RiskCoverageEvidenceBinding {
  readonly version: typeof P7_R25_RISK_COVERAGE_EVIDENCE_BINDING_VERSION
  readonly evidenceIdentity: string
  readonly state: typeof P7_R25_RISK_COVERAGE_BOUND_STATE
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly targetTree: string
  readonly changedPathSetIdentity: string
  readonly reviewUniverseIdentity: string
  readonly securityPrescanEvidenceIdentity: string
  readonly sourceSetIdentity: string
  readonly ruleSetIdentity: string
  readonly riskTaxonomyIdentity: string
  readonly riskApplicabilityEvidenceIdentity: string
  readonly reviewUniversePathCount: number
  readonly reviewableTextPathCount: number
  readonly nonReviewablePathCount: number
  readonly nonReviewableDispositionCounts: readonly P7RiskCoverageDispositionCount[]
  readonly coverageDebtIdentity: string
  readonly applicableRiskSet: readonly string[]
  readonly notApplicableRiskSet: readonly string[]
  readonly unknownApplicabilityRiskSet: readonly string[]
  readonly coveredRiskSet: readonly string[]
  readonly uncoveredRiskSet: readonly string[]
  readonly riskRecords: readonly P7RiskCoverageRecord[]
  readonly riskCoverageState: P7RiskCoverageState
}

type UnknownRecord = Record<string, unknown>
type EvidenceCore = Omit<P7RiskCoverageEvidenceBinding, "evidenceIdentity">

type NormalizedInput = Readonly<{
  securityPrescanBuildInput: P7DeterministicSecurityPrescanBuildInput
  securityPrescanEvidence: P7DeterministicSecurityPrescanEvidenceBinding
  riskApplicability: readonly Readonly<P7RiskCoverageApplicabilityInput>[]
  reviewerFindingReferences: readonly Readonly<P7RiskCoverageReviewerFindingReferenceInput>[]
}>

const SHA256 = /^[0-9a-f]{64}$/
const IDENTIFIER = /^[a-z][a-z0-9_]{0,127}$/
const POSITIVE_DECIMAL_VERSION = /^[1-9][0-9]{0,15}$/
const INPUT_KEYS = [
  "securityPrescanBuildInput",
  "securityPrescanEvidence",
  "riskApplicability",
  "reviewerFindingReferences",
] as const
const APPLICABILITY_KEYS = ["riskId", "applicability", "evidenceIdentities"] as const
const REVIEWER_REFERENCE_KEYS = ["riskId", "reviewerFindingEvidenceIdentity"] as const

function fail(label: string, detail: string): never {
  throw new TypeError(`${label} ${detail}`)
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
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

function assertSafeJsonGraph(value: unknown, label: string): void {
  const stack: Array<{ readonly value: unknown; readonly label: string; readonly depth: number }> = [
    { value, label, depth: 0 },
  ]
  const seen = new Set<object>()
  let nodes = 0
  let stringBytes = 0

  while (stack.length > 0) {
    const current = stack.pop()!
    nodes += 1
    if (nodes > P7_R25_RISK_COVERAGE_LIMITS.maxGraphNodes) fail(label, "exceeds the JSON node budget")
    if (current.depth > P7_R25_RISK_COVERAGE_LIMITS.maxGraphDepth) fail(label, "exceeds the JSON depth budget")

    const item = current.value
    if (item === null || typeof item === "boolean") continue
    if (typeof item === "string") {
      assertUnicodeScalars(item, current.label)
      stringBytes += Buffer.byteLength(item, "utf8")
      if (stringBytes > P7_R25_RISK_COVERAGE_LIMITS.maxGraphStringBytes) fail(label, "exceeds the JSON string-byte budget")
      continue
    }
    if (typeof item === "number") {
      if (!Number.isFinite(item) || !Number.isSafeInteger(item) || Object.is(item, -0)) {
        fail(current.label, "must be a finite safe JSON integer")
      }
      continue
    }
    if (typeof item !== "object") fail(current.label, "must contain only JSON-compatible values")
    if (nodeTypes.isProxy(item)) fail(current.label, "must not contain Proxy values")
    if (seen.has(item)) fail(current.label, "must not contain aliases or cycles")
    seen.add(item)

    if (Array.isArray(item)) {
      if (Object.getPrototypeOf(item) !== Array.prototype) fail(current.label, "must use the ordinary Array prototype")
      const lengthDescriptor = Object.getOwnPropertyDescriptor(item, "length")
      if (lengthDescriptor === undefined || !("value" in lengthDescriptor) || !Number.isSafeInteger(lengthDescriptor.value)) {
        fail(current.label, "must expose an ordinary array length")
      }
      const length = lengthDescriptor.value as number
      if (length > P7_R25_RISK_COVERAGE_LIMITS.maxGraphNodes) fail(current.label, "exceeds the array length budget")
      const expected = new Set<string>(["length"])
      for (let index = 0; index < length; index += 1) expected.add(String(index))
      const keys = Reflect.ownKeys(item)
      for (const key of keys) {
        if (typeof key !== "string" || !expected.has(key)) fail(current.label, "must not contain symbol, sparse, or extra array fields")
      }
      if (keys.length !== expected.size) fail(current.label, "must not contain sparse array slots")
      for (let index = length - 1; index >= 0; index -= 1) {
        const descriptor = Object.getOwnPropertyDescriptor(item, String(index))
        if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
          fail(`${current.label}[${index}]`, "must be an enumerable data property")
        }
        stack.push({ value: descriptor.value, label: `${current.label}[${index}]`, depth: current.depth + 1 })
      }
      continue
    }

    const prototype = Object.getPrototypeOf(item)
    if (prototype !== Object.prototype && prototype !== null) fail(current.label, "must contain only plain objects")
    for (const key of Reflect.ownKeys(item)) {
      if (typeof key !== "string") fail(current.label, "must not contain symbol fields")
      assertUnicodeScalars(key, `${current.label} property name`)
      const descriptor = Object.getOwnPropertyDescriptor(item, key)
      if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
        fail(`${current.label}.${key}`, "must be an enumerable data property")
      }
      stack.push({ value: descriptor.value, label: `${current.label}.${key}`, depth: current.depth + 1 })
    }
  }
}

function snapshotJsonData<T>(value: T, label: string): T {
  assertSafeJsonGraph(value, label)
  try {
    return structuredClone(value)
  } catch {
    return fail(label, "must be structured-cloneable JSON data")
  }
}

function ownDataRecord(
  value: unknown,
  allowedKeys: readonly string[],
  requiredKeys: readonly string[],
  label: string,
): UnknownRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value) || nodeTypes.isProxy(value)) {
    fail(label, "must be a non-Proxy plain object")
  }
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(label, "must be a plain object")
  const allowed = new Set(allowedKeys)
  const record: UnknownRecord = {}
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string") fail(label, "must not contain symbol fields")
    if (!allowed.has(key)) fail(label, `contains unknown field: ${key}`)
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true) {
      fail(`${label}.${key}`, "must be an enumerable data property")
    }
    record[key] = descriptor.value
  }
  for (const key of requiredKeys) if (!Object.hasOwn(record, key)) fail(label, `is missing required field: ${key}`)
  return record
}

function denseArray(value: unknown, label: string, maxLength: number): readonly unknown[] {
  if (!Array.isArray(value) || nodeTypes.isProxy(value)) fail(label, "must be a non-Proxy array")
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(label, "must use the ordinary Array prototype")
  if (value.length > maxLength) fail(label, `must contain at most ${maxLength} entries`)
  const keys = Reflect.ownKeys(value)
  const expected = new Set<string>(["length"])
  for (let index = 0; index < value.length; index += 1) expected.add(String(index))
  for (const key of keys) {
    if (typeof key !== "string" || !expected.has(key)) fail(label, "must not contain symbol, sparse, or extra array fields")
  }
  if (keys.length !== expected.size) fail(label, "must not contain sparse array slots")
  return value
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    const encoded = JSON.stringify(value)
    if (encoded === undefined) fail("canonical JSON", "contains a non-JSON value")
    return encoded
  }
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(",")}]`
  const record = value as UnknownRecord
  return `{${Object.keys(record)
    .sort(compareStrings)
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
    .join(",")}}`
}

function hashCanonical(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value), "utf8").digest("hex")
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as UnknownRecord)) deepFreeze(child)
  }
  return value
}

function sha256(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) fail(label, "must be a lowercase SHA-256 digest")
  return value
}

function boundedIdentifier(value: unknown, label: string): string {
  if (typeof value !== "string" || !IDENTIFIER.test(value)) fail(label, "must be a bounded inert identifier")
  assertUnicodeScalars(value, label)
  if ([...value].length > P7_R25_RISK_COVERAGE_LIMITS.maxIdentifierCodePoints) fail(label, "exceeds the identifier code-point budget")
  return value
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], label: string): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) fail(label, `must be one of: ${allowed.join(", ")}`)
  return value as T
}

function sortedUniqueSha256Array(value: unknown, label: string, maxLength: number): readonly string[] {
  const values = denseArray(value, label, maxLength).map((item, index) => sha256(item, `${label}[${index}]`))
  return Object.freeze([...new Set(values)].sort(compareStrings))
}

function riskProjection(risk: RiskDefinition): UnknownRecord {
  return {
    riskId: risk.riskId,
    riskVersion: risk.riskVersion,
    staticRuleIds: [...risk.staticRuleIds],
    externalTaxonomyMappings: [...risk.externalTaxonomyMappings],
  }
}

function validateRiskTaxonomy(): void {
  if (RISK_TAXONOMY.length === 0 || RISK_TAXONOMY.length > P7_R25_RISK_COVERAGE_LIMITS.maxRisks) {
    fail("risk taxonomy", "must contain a bounded non-empty risk set")
  }
  const knownRules = new Set<string>(R24_RULE_IDS)
  const riskIds = new Set<string>()
  let previousRiskId: string | null = null
  for (const [index, risk] of RISK_TAXONOMY.entries()) {
    boundedIdentifier(risk.riskId, `riskTaxonomy[${index}].riskId`)
    if (!POSITIVE_DECIMAL_VERSION.test(risk.riskVersion)) fail(`riskTaxonomy[${index}].riskVersion`, "must be a positive decimal version")
    if (riskIds.has(risk.riskId)) fail("risk taxonomy", "must not contain duplicate risk IDs")
    riskIds.add(risk.riskId)
    if (previousRiskId !== null && compareStrings(previousRiskId, risk.riskId) >= 0) fail("risk taxonomy", "must be canonically sorted")
    previousRiskId = risk.riskId

    const staticRules = [...risk.staticRuleIds]
    if (new Set(staticRules).size !== staticRules.length) fail(`riskTaxonomy[${index}].staticRuleIds`, "must be unique")
    if (canonicalJson(staticRules) !== canonicalJson([...staticRules].sort(compareStrings))) fail(`riskTaxonomy[${index}].staticRuleIds`, "must be sorted")
    for (const ruleId of staticRules) if (!knownRules.has(ruleId)) fail(`riskTaxonomy[${index}].staticRuleIds`, `references unknown R24 rule: ${ruleId}`)

    const mappings = [...risk.externalTaxonomyMappings]
    if (mappings.length > P7_R25_RISK_COVERAGE_LIMITS.maxExternalMappingsPerRisk) fail(`riskTaxonomy[${index}].externalTaxonomyMappings`, "exceeds the mapping-count budget")
    if (new Set(mappings).size !== mappings.length) fail(`riskTaxonomy[${index}].externalTaxonomyMappings`, "must be unique")
    if (canonicalJson(mappings) !== canonicalJson([...mappings].sort(compareStrings))) fail(`riskTaxonomy[${index}].externalTaxonomyMappings`, "must be sorted")
    for (const [mappingIndex, mapping] of mappings.entries()) {
      assertUnicodeScalars(mapping, `riskTaxonomy[${index}].externalTaxonomyMappings[${mappingIndex}]`)
      if (mapping.length === 0 || [...mapping].length > P7_R25_RISK_COVERAGE_LIMITS.maxMappingCodePoints) {
        fail(`riskTaxonomy[${index}].externalTaxonomyMappings[${mappingIndex}]`, "must be bounded non-empty text")
      }
    }
  }
}

validateRiskTaxonomy()

export const P7_R25_RISK_TAXONOMY_IDENTITY = hashCanonical({
  r24RuleSetIdentity: P7_R24_DETERMINISTIC_SECURITY_PRESCAN_RULE_SET_IDENTITY,
  risks: RISK_TAXONOMY.map((risk) => riskProjection(risk)),
})

function normalizeInput(rawInput: P7RiskCoverageEvidenceBindingBuildInput): NormalizedInput {
  const snapshot = snapshotJsonData(rawInput, "input")
  const record = ownDataRecord(snapshot, INPUT_KEYS, INPUT_KEYS, "input")
  const riskApplicabilityValues = denseArray(record.riskApplicability, "input.riskApplicability", P7_R25_RISK_COVERAGE_LIMITS.maxRisks)
  const riskApplicability = riskApplicabilityValues.map((value, index) => {
    const item = ownDataRecord(value, APPLICABILITY_KEYS, APPLICABILITY_KEYS, `input.riskApplicability[${index}]`)
    const riskId = boundedIdentifier(item.riskId, `input.riskApplicability[${index}].riskId`)
    if (!P7_R25_RISK_IDS.includes(riskId)) fail(`input.riskApplicability[${index}].riskId`, "is not a canonical P7-R25 risk")
    const applicability = oneOf(item.applicability, P7_R25_RISK_APPLICABILITIES, `input.riskApplicability[${index}].applicability`)
    const evidenceIdentities = sortedUniqueSha256Array(
      item.evidenceIdentities,
      `input.riskApplicability[${index}].evidenceIdentities`,
      P7_R25_RISK_COVERAGE_LIMITS.maxApplicabilityEvidenceIdentitiesPerRisk,
    )
    if ((applicability === "APPLICABLE" || applicability === "NOT_APPLICABLE") && evidenceIdentities.length === 0) {
      fail(`input.riskApplicability[${index}].evidenceIdentities`, `${applicability} requires at least one evidence identity`)
    }
    return Object.freeze({ riskId, applicability, evidenceIdentities })
  })

  const seenApplicability = new Set<string>()
  for (const item of riskApplicability) {
    if (seenApplicability.has(item.riskId)) fail("input.riskApplicability", `contains duplicate risk: ${item.riskId}`)
    seenApplicability.add(item.riskId)
  }
  const sortedApplicability = Object.freeze([...riskApplicability].sort((left, right) => compareStrings(left.riskId, right.riskId)))
  if (
    sortedApplicability.length !== P7_R25_RISK_IDS.length ||
    sortedApplicability.some((item, index) => item.riskId !== P7_R25_RISK_IDS[index])
  ) {
    fail("input.riskApplicability", "must contain exactly one applicability record for every canonical P7-R25 risk")
  }

  const reviewerValues = denseArray(
    record.reviewerFindingReferences,
    "input.reviewerFindingReferences",
    P7_R25_RISK_COVERAGE_LIMITS.maxReviewerFindingReferences,
  )
  const reviewerPairs = new Map<string, P7RiskCoverageReviewerFindingReferenceInput>()
  for (const [index, value] of reviewerValues.entries()) {
    const item = ownDataRecord(value, REVIEWER_REFERENCE_KEYS, REVIEWER_REFERENCE_KEYS, `input.reviewerFindingReferences[${index}]`)
    const riskId = boundedIdentifier(item.riskId, `input.reviewerFindingReferences[${index}].riskId`)
    if (!P7_R25_RISK_IDS.includes(riskId)) fail(`input.reviewerFindingReferences[${index}].riskId`, "is not a canonical P7-R25 risk")
    const reviewerFindingEvidenceIdentity = sha256(
      item.reviewerFindingEvidenceIdentity,
      `input.reviewerFindingReferences[${index}].reviewerFindingEvidenceIdentity`,
    )
    const key = `${riskId}\0${reviewerFindingEvidenceIdentity}`
    if (!reviewerPairs.has(key)) reviewerPairs.set(key, Object.freeze({ riskId, reviewerFindingEvidenceIdentity }))
  }
  const reviewerFindingReferences = Object.freeze(
    [...reviewerPairs.values()].sort(
      (left, right) => compareStrings(left.riskId, right.riskId) || compareStrings(left.reviewerFindingEvidenceIdentity, right.reviewerFindingEvidenceIdentity),
    ),
  )
  const reviewerCounts = new Map<string, number>()
  for (const item of reviewerFindingReferences) reviewerCounts.set(item.riskId, (reviewerCounts.get(item.riskId) ?? 0) + 1)
  for (const [riskId, count] of reviewerCounts) {
    if (count > P7_R25_RISK_COVERAGE_LIMITS.maxReviewerFindingReferencesPerRisk) fail(`input.reviewerFindingReferences for ${riskId}`, "exceeds the per-risk reference budget")
  }

  return Object.freeze({
    securityPrescanBuildInput: record.securityPrescanBuildInput as P7DeterministicSecurityPrescanBuildInput,
    securityPrescanEvidence: record.securityPrescanEvidence as P7DeterministicSecurityPrescanEvidenceBinding,
    riskApplicability: sortedApplicability,
    reviewerFindingReferences,
  })
}

function coverageDebt(input: NormalizedInput, reviewUniverseIdentity: string): Readonly<{
  reviewUniversePathCount: number
  reviewableTextPathCount: number
  nonReviewablePathCount: number
  nonReviewableDispositionCounts: readonly P7RiskCoverageDispositionCount[]
  coverageDebtIdentity: string
}> {
  const rebuiltUniverse = buildP7ReviewCoverageUniverseEvidenceBinding(input.securityPrescanBuildInput.reviewUniverseBuildInput)
  const validatedUniverse = validateP7ReviewCoverageUniverseEvidenceBinding(
    input.securityPrescanBuildInput.reviewUniverseEvidence,
    input.securityPrescanBuildInput.reviewUniverseBuildInput,
  )
  if (rebuiltUniverse.evidenceIdentity !== validatedUniverse.evidenceIdentity) {
    fail("input.securityPrescanBuildInput.reviewUniverseEvidence", "does not equal the exact R23 evidence rebuilt from the R24 input")
  }
  if (rebuiltUniverse.reviewUniverseIdentity !== reviewUniverseIdentity) {
    fail("input.securityPrescanBuildInput", "reconstructs an R23 review universe different from the exact R24 subject")
  }

  const nonReviewableDispositions = P7_R23_CONTENT_DISPOSITIONS.filter(
    (disposition): disposition is Exclude<P7ReviewCoverageContentDisposition, "reviewable_text"> => disposition !== "reviewable_text",
  )
  const counts = new Map<Exclude<P7ReviewCoverageContentDisposition, "reviewable_text">, number>(
    nonReviewableDispositions.map((disposition) => [disposition, 0]),
  )
  for (const descriptor of input.securityPrescanBuildInput.reviewUniverseBuildInput.changedPaths) {
    if (descriptor.contentDisposition !== "reviewable_text") {
      counts.set(descriptor.contentDisposition, (counts.get(descriptor.contentDisposition) ?? 0) + 1)
    }
  }
  const nonReviewableDispositionCounts = Object.freeze(
    nonReviewableDispositions.map((contentDisposition) => Object.freeze({ contentDisposition, count: counts.get(contentDisposition) ?? 0 })),
  )
  const reviewUniversePathCount = rebuiltUniverse.reviewUniversePaths.length
  const reviewableTextPathCount = rebuiltUniverse.reviewableTextPaths.length
  const nonReviewablePathCount = reviewUniversePathCount - reviewableTextPathCount
  if (nonReviewableDispositionCounts.reduce((sum, item) => sum + item.count, 0) !== nonReviewablePathCount) {
    fail("coverage debt", "does not account for every non-reviewable R23 path")
  }
  const debtCore = {
    reviewUniverseIdentity,
    reviewUniversePathCount,
    reviewableTextPathCount,
    nonReviewablePathCount,
    nonReviewableDispositionCounts,
  }
  return deepFreeze({ ...debtCore, coverageDebtIdentity: hashCanonical(debtCore) })
}

function riskCoverageState(uncoveredCount: number, unknownCount: number): P7RiskCoverageState {
  if (uncoveredCount > 0 && unknownCount > 0) return "HAS_UNCOVERED_AND_UNKNOWN"
  if (uncoveredCount > 0) return "HAS_UNCOVERED_RISK"
  if (unknownCount > 0) return "HAS_UNKNOWN_APPLICABILITY"
  return "ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN"
}

export function buildP7RiskCoverageEvidenceBinding(
  rawInput: P7RiskCoverageEvidenceBindingBuildInput,
): P7RiskCoverageEvidenceBinding {
  const input = normalizeInput(rawInput)
  const rebuiltPrescan = buildP7DeterministicSecurityPrescanEvidenceBinding(input.securityPrescanBuildInput)
  const validatedPrescan = validateP7DeterministicSecurityPrescanEvidenceBinding(
    input.securityPrescanEvidence,
    input.securityPrescanBuildInput,
  )
  if (rebuiltPrescan.evidenceIdentity !== validatedPrescan.evidenceIdentity) {
    fail("input.securityPrescanEvidence", "does not equal the exact R24 evidence rebuilt from securityPrescanBuildInput")
  }
  if (rebuiltPrescan.ruleSetIdentity !== P7_R24_DETERMINISTIC_SECURITY_PRESCAN_RULE_SET_IDENTITY) {
    fail("input.securityPrescanEvidence.ruleSetIdentity", "does not bind the canonical R24 deterministic rule set")
  }

  const debt = coverageDebt(input, rebuiltPrescan.reviewUniverseIdentity)
  const applicabilityByRisk = new Map(input.riskApplicability.map((item) => [item.riskId, item]))
  const reviewerByRisk = new Map<string, string[]>()
  for (const item of input.reviewerFindingReferences) {
    const existing = reviewerByRisk.get(item.riskId) ?? []
    existing.push(item.reviewerFindingEvidenceIdentity)
    reviewerByRisk.set(item.riskId, existing)
  }

  const riskApplicabilityEvidenceIdentity = hashCanonical(
    input.riskApplicability.map((item) => ({
      riskId: item.riskId,
      applicability: item.applicability,
      evidenceIdentities: [...item.evidenceIdentities],
    })),
  )

  const riskRecords = Object.freeze(
    RISK_TAXONOMY.map((risk): P7RiskCoverageRecord => {
      const applicability = applicabilityByRisk.get(risk.riskId)
      if (applicability === undefined) fail("input.riskApplicability", `is missing canonical risk: ${risk.riskId}`)
      const staticSignalEvidenceIdentities = Object.freeze(
        [...new Set(
          rebuiltPrescan.signals
            .filter((signal) => risk.staticRuleIds.includes(signal.ruleId))
            .map((signal) => signal.signalIdentity),
        )].sort(compareStrings),
      )
      if (staticSignalEvidenceIdentities.length > P7_R25_RISK_COVERAGE_LIMITS.maxStaticSignalsPerRisk) {
        fail(`risk ${risk.riskId}`, "exceeds the static-signal reference budget")
      }
      const reviewerFindingEvidenceIdentities = Object.freeze([...(reviewerByRisk.get(risk.riskId) ?? [])].sort(compareStrings))
      const coverageMethods: P7RiskCoverageMethod[] = []
      if (applicability.applicability === "APPLICABLE") {
        if (risk.staticRuleIds.length > 0) coverageMethods.push("DETERMINISTIC_PRESCAN")
        if (reviewerFindingEvidenceIdentities.length > 0) coverageMethods.push("REVIEWER_FINDING_REFERENCE")
      }
      coverageMethods.sort(compareStrings)

      let coverageDisposition: P7RiskCoverageDisposition
      if (applicability.applicability === "NOT_APPLICABLE") coverageDisposition = "NOT_APPLICABLE"
      else if (applicability.applicability === "UNKNOWN") coverageDisposition = "UNKNOWN_APPLICABILITY"
      else if (coverageMethods.length > 0) coverageDisposition = "COVERED_BY_BOUNDED_METHOD"
      else coverageDisposition = "UNCOVERED_APPLICABLE"

      return deepFreeze({
        riskId: risk.riskId,
        riskVersion: risk.riskVersion,
        applicability: applicability.applicability,
        applicabilityEvidenceIdentities: Object.freeze([...applicability.evidenceIdentities]),
        staticRuleIds: Object.freeze([...risk.staticRuleIds]),
        staticSignalEvidenceIdentities,
        reviewerFindingEvidenceIdentities,
        coverageMethods: Object.freeze(coverageMethods),
        coverageDisposition,
      })
    }),
  )

  const applicableRiskSet = Object.freeze(riskRecords.filter((risk) => risk.applicability === "APPLICABLE").map((risk) => risk.riskId))
  const notApplicableRiskSet = Object.freeze(riskRecords.filter((risk) => risk.applicability === "NOT_APPLICABLE").map((risk) => risk.riskId))
  const unknownApplicabilityRiskSet = Object.freeze(riskRecords.filter((risk) => risk.applicability === "UNKNOWN").map((risk) => risk.riskId))
  const coveredRiskSet = Object.freeze(
    riskRecords.filter((risk) => risk.applicability === "APPLICABLE" && risk.coverageMethods.length > 0).map((risk) => risk.riskId),
  )
  const uncoveredRiskSet = Object.freeze(
    riskRecords.filter((risk) => risk.applicability === "APPLICABLE" && risk.coverageMethods.length === 0).map((risk) => risk.riskId),
  )

  const core: EvidenceCore = {
    version: P7_R25_RISK_COVERAGE_EVIDENCE_BINDING_VERSION,
    state: P7_R25_RISK_COVERAGE_BOUND_STATE,
    repositoryIdentity: rebuiltPrescan.repositoryIdentity,
    canonicalBase: rebuiltPrescan.canonicalBase,
    targetHead: rebuiltPrescan.targetHead,
    targetTree: rebuiltPrescan.targetTree,
    changedPathSetIdentity: rebuiltPrescan.changedPathSetIdentity,
    reviewUniverseIdentity: rebuiltPrescan.reviewUniverseIdentity,
    securityPrescanEvidenceIdentity: rebuiltPrescan.evidenceIdentity,
    sourceSetIdentity: rebuiltPrescan.sourceSetIdentity,
    ruleSetIdentity: rebuiltPrescan.ruleSetIdentity,
    riskTaxonomyIdentity: P7_R25_RISK_TAXONOMY_IDENTITY,
    riskApplicabilityEvidenceIdentity,
    reviewUniversePathCount: debt.reviewUniversePathCount,
    reviewableTextPathCount: debt.reviewableTextPathCount,
    nonReviewablePathCount: debt.nonReviewablePathCount,
    nonReviewableDispositionCounts: debt.nonReviewableDispositionCounts,
    coverageDebtIdentity: debt.coverageDebtIdentity,
    applicableRiskSet,
    notApplicableRiskSet,
    unknownApplicabilityRiskSet,
    coveredRiskSet,
    uncoveredRiskSet,
    riskRecords,
    riskCoverageState: riskCoverageState(uncoveredRiskSet.length, unknownApplicabilityRiskSet.length),
  }
  return deepFreeze({ ...core, evidenceIdentity: hashCanonical(core) })
}

export function validateP7RiskCoverageEvidenceBinding(
  value: unknown,
  input: P7RiskCoverageEvidenceBindingBuildInput,
): P7RiskCoverageEvidenceBinding {
  const actual = snapshotJsonData(value, "evidence")
  const expected = buildP7RiskCoverageEvidenceBinding(input)
  if (canonicalJson(actual) !== canonicalJson(expected)) fail("evidence", "does not match the canonical result for the supplied P7-R25 input")
  return expected
}
