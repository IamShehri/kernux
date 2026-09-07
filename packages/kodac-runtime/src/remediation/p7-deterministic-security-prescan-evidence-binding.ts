import { createHash } from "node:crypto"
import { TextDecoder, types as nodeTypes } from "node:util"

import {
  buildP7ReviewCoverageUniverseEvidenceBinding,
  validateP7ReviewCoverageUniverseEvidenceBinding,
  type P7ReviewCoveragePathDescriptor,
  type P7ReviewCoverageUniverseEvidenceBinding,
  type P7ReviewCoverageUniverseEvidenceBindingBuildInput,
} from "./p7-review-coverage-universe-evidence-binding.ts"

export const P7_R24_DETERMINISTIC_SECURITY_PRESCAN_EVIDENCE_BINDING_VERSION =
  "p7-r24-deterministic-security-prescan-evidence-binding-v1" as const
export const P7_R24_DETERMINISTIC_SECURITY_PRESCAN_BOUND_STATE =
  "DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY" as const

export const P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS = Object.freeze({
  maxSources: 64,
  maxSourceBytes: 1_048_576,
  maxAggregateBytes: 4_194_304,
  maxSignals: 4_096,
  maxPathCodePoints: 1_024,
  maxGraphNodes: 131_072,
  maxGraphDepth: 64,
  maxGraphStringBytes: 16_777_216,
  maxMappingCodePoints: 512,
  maxMappingsPerRule: 8,
})

export interface P7DeterministicSecurityPrescanSourceInput {
  readonly path: string
  readonly rawByteIdentity: string
  readonly rawByteLength: number
  readonly rawBytesBase64: string
}

export interface P7DeterministicSecurityPrescanBuildInput {
  readonly reviewUniverseBuildInput: P7ReviewCoverageUniverseEvidenceBindingBuildInput
  readonly reviewUniverseEvidence: P7ReviewCoverageUniverseEvidenceBinding
  readonly sources: readonly P7DeterministicSecurityPrescanSourceInput[]
}

export interface P7DeterministicSecurityPrescanSignal {
  readonly signalIdentity: string
  readonly ruleId: string
  readonly ruleVersion: string
  readonly externalTaxonomyMappings: readonly string[]
  readonly path: string
  readonly sourceGitObjectIdentity: string
  readonly sourceRawByteIdentity: string
  readonly sourceDecodedTextIdentity: string
  readonly startLine: number
  readonly endLine: number
  readonly startColumn: number
  readonly endColumn: number
  readonly matchedTextDigest: string
}

export interface P7DeterministicSecurityPrescanEvidenceBinding {
  readonly version: typeof P7_R24_DETERMINISTIC_SECURITY_PRESCAN_EVIDENCE_BINDING_VERSION
  readonly evidenceIdentity: string
  readonly state: typeof P7_R24_DETERMINISTIC_SECURITY_PRESCAN_BOUND_STATE
  readonly repositoryIdentity: string
  readonly canonicalBase: string
  readonly targetHead: string
  readonly targetTree: string
  readonly changedPathSetIdentity: string
  readonly reviewUniverseIdentity: string
  readonly sourceSetIdentity: string
  readonly ruleSetIdentity: string
  readonly sourceCount: number
  readonly scannedPaths: readonly string[]
  readonly signalCount: number
  readonly signals: readonly P7DeterministicSecurityPrescanSignal[]
}

type UnknownRecord = Record<string, unknown>
type EncodingDisposition = "utf8" | "utf8_bom"
type EvidenceCore = Omit<P7DeterministicSecurityPrescanEvidenceBinding, "evidenceIdentity">

type RuleDefinition = Readonly<{
  ruleId: string
  ruleVersion: string
  category: string
  externalTaxonomyMappings: readonly string[]
  pattern: RegExp
}>

type NormalizedSource = Readonly<{
  path: string
  sourceGitObjectIdentity: string
  rawByteIdentity: string
  rawByteLength: number
  encodingDisposition: EncodingDisposition
  decodedText: string
  decodedTextIdentity: string
}>

const SHA1 = /^[0-9a-f]{40}$/
const SHA256 = /^[0-9a-f]{64}$/
const CANONICAL_BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
const UTF8_BOM = Buffer.from([0xef, 0xbb, 0xbf])

const INPUT_KEYS = ["reviewUniverseBuildInput", "reviewUniverseEvidence", "sources"] as const
const SOURCE_KEYS = ["path", "rawByteIdentity", "rawByteLength", "rawBytesBase64"] as const

const RULES: readonly RuleDefinition[] = Object.freeze([
  Object.freeze({
    ruleId: "remote_pipe_to_shell",
    ruleVersion: "1",
    category: "REMOTE_EXECUTION",
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:curl_pipe_exec",
    ]),
    pattern: /\b(?:curl|wget)\b[^\r\n|]{0,512}\|\s*(?:(?:ba)?sh|python(?:3)?)\b/giu,
  }),
  Object.freeze({
    ruleId: "cloud_metadata_access",
    ruleVersion: "1",
    category: "CREDENTIAL_ACCESS",
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:cloud_metadata_access",
    ]),
    pattern: /(?:169\.254\.169\.254|metadata\.google\.internal|metadata\.azure\.com)/giu,
  }),
  Object.freeze({
    ruleId: "credential_path_access",
    ruleVersion: "1",
    category: "CREDENTIAL_ACCESS",
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:credential_file_access",
    ]),
    pattern: /(?:~\/|\bHOME\b|\bUSERPROFILE\b)[^\r\n]{0,192}(?:\/|\\)(?:\.ssh|\.aws|\.env|credentials|mcp\.json|Keychain|authorized_keys)\b/giu,
  }),
  Object.freeze({
    ruleId: "prompt_injection_indicator",
    ruleVersion: "1",
    category: "PROMPT_INJECTION",
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:prompt_injection",
    ]),
    pattern: /(?:ignore\s+(?:previous|above|all)\s+(?:instructions?|rules?|prompts?)|you\s+are\s+now|SYSTEM\s*OVERRIDE|<\|im_start\|>|forget\s+(?:everything|your\s+instructions))/giu,
  }),
  Object.freeze({
    ruleId: "reverse_shell_indicator",
    ruleVersion: "1",
    category: "REMOTE_EXECUTION",
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:reverse_shell",
    ]),
    pattern: /(?:socket\.connect|subprocess\.(?:run|Popen)|\/bin\/(?:ba)?sh)[\s\S]{0,192}?\b(?:\d{1,3}\.){3}\d{1,3}\b/giu,
  }),
  Object.freeze({
    ruleId: "decode_then_execute",
    ruleVersion: "1",
    category: "ENCODED_EXECUTION",
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:encoded_payload",
    ]),
    pattern: /(?:base64\.b64decode|\batob\s*\(|Buffer\.from\([^)]*["']base64["'][^)]*\))[\s\S]{0,256}?\b(?:exec|eval|system|popen)\b/giu,
  }),
  Object.freeze({
    ruleId: "sensitive_data_exfiltration_indicator",
    ruleVersion: "1",
    category: "DATA_EXFILTRATION",
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:outbound_data_exfil",
    ]),
    pattern: /(?:requests\.(?:post|put)|urlopen|fetch\s*\(|http\.request)[\s\S]{0,256}?\b(?:environ|os\.getenv|password|secret|token|api[_-]?key|credential)\b/giu,
  }),
  Object.freeze({
    ruleId: "persistence_mechanism_indicator",
    ruleVersion: "1",
    category: "PERSISTENCE",
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:crontab_persistence",
    ]),
    pattern: /\b(?:crontab|systemctl\s+enable|launchctl\s+load|schtasks)\b/giu,
  }),
  Object.freeze({
    ruleId: "ssh_key_write_indicator",
    ruleVersion: "1",
    category: "PERSISTENCE",
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:ssh_key_write",
    ]),
    pattern: /(?:authorized_keys|id_rsa|\.ssh[^\r\n]{0,128}(?:write|open\s*\([^)]*["']w["']))/giu,
  }),
  Object.freeze({
    ruleId: "suspicious_executable_download",
    ruleVersion: "1",
    category: "SUPPLY_CHAIN",
    externalTaxonomyMappings: Object.freeze([
      "Tencent/AI-Infra-Guard@e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c:pre_scan.py:non_official_download",
    ]),
    pattern: /\b(?:https?:\/\/)?(?:raw\.githubusercontent\.com|github\.com|glot\.io|pastebin\.com)\/[^\s"'<>]{1,256}\.(?:exe|sh|py|bin|zip|tar)\b/giu,
  }),
])

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
    if (nodes > P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxGraphNodes) {
      fail(label, "exceeds the JSON node budget")
    }
    if (current.depth > P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxGraphDepth) {
      fail(label, "exceeds the JSON depth budget")
    }

    const item = current.value
    if (item === null || typeof item === "boolean") continue
    if (typeof item === "string") {
      assertUnicodeScalars(item, current.label)
      stringBytes += Buffer.byteLength(item, "utf8")
      if (stringBytes > P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxGraphStringBytes) {
        fail(label, "exceeds the JSON string-byte budget")
      }
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
      if (length > P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxGraphNodes) {
        fail(current.label, "exceeds the array length budget")
      }
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

function safeInteger(value: unknown, label: string, minimum: number, maximum: number): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < minimum || value > maximum) {
    fail(label, `must be a safe integer in ${minimum}..${maximum}`)
  }
  return value
}

function sha256(value: unknown, label: string): string {
  if (typeof value !== "string" || !SHA256.test(value)) fail(label, "must be a lowercase SHA-256 digest")
  return value
}

function boundedPathText(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) fail(label, "must be a non-empty path string")
  assertUnicodeScalars(value, label)
  if ([...value].length > P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxPathCodePoints) {
    fail(label, "exceeds the path code-point budget")
  }
  return value
}

function canonicalBase64(value: unknown, label: string): string {
  if (typeof value !== "string") fail(label, "must be a base64 string")
  const maxLength = Math.ceil(P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxSourceBytes / 3) * 4
  if (value.length > maxLength || !CANONICAL_BASE64.test(value)) fail(label, "must be canonical bounded base64")
  return value
}

function gitBlobIdentity(raw: Buffer): string {
  return createHash("sha1")
    .update(Buffer.from(`blob ${raw.byteLength}\0`, "utf8"))
    .update(raw)
    .digest("hex")
}

function positionAt(text: string, targetCodeUnitOffset: number): { readonly line: number; readonly column: number } {
  if (!Number.isSafeInteger(targetCodeUnitOffset) || targetCodeUnitOffset < 0 || targetCodeUnitOffset > text.length) {
    fail("signal range", "contains an invalid code-unit boundary")
  }
  let line = 1
  let column = 1
  let offset = 0
  while (offset < targetCodeUnitOffset) {
    const code = text.charCodeAt(offset)
    if (code === 0x0d && offset + 1 < text.length && text.charCodeAt(offset + 1) === 0x0a) {
      if (targetCodeUnitOffset === offset + 1) fail("signal range", "must not split a CRLF sequence")
      offset += 2
      line += 1
      column = 1
      continue
    }
    const codePoint = text.codePointAt(offset)
    if (codePoint === undefined) fail("signal range", "contains an invalid Unicode boundary")
    const width = codePoint > 0xffff ? 2 : 1
    if (offset + width > targetCodeUnitOffset) fail("signal range", "must align to a Unicode code-point boundary")
    offset += width
    if (codePoint === 0x0a) {
      line += 1
      column = 1
    } else {
      column += 1
    }
  }
  return Object.freeze({ line, column })
}

function matchRange(
  text: string,
  start: number,
  endExclusive: number,
): Readonly<{ startLine: number; endLine: number; startColumn: number; endColumn: number; matchedText: string }> {
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(endExclusive) || start < 0 || endExclusive <= start || endExclusive > text.length) {
    fail("signal range", "must identify one non-empty bounded text slice")
  }
  const matchedText = text.slice(start, endExclusive)
  const codePoints = [...matchedText]
  if (codePoints.length === 0) fail("signal range", "must not be zero-length")
  const finalCodePoint = codePoints[codePoints.length - 1]!
  const finalStart = endExclusive - finalCodePoint.length
  const first = positionAt(text, start)
  const last = positionAt(text, finalStart)
  return Object.freeze({
    startLine: first.line,
    endLine: last.line,
    startColumn: first.column,
    endColumn: last.column,
    matchedText,
  })
}

function ruleProjection(rule: RuleDefinition): UnknownRecord {
  return {
    ruleId: rule.ruleId,
    ruleVersion: rule.ruleVersion,
    category: rule.category,
    externalTaxonomyMappings: [...rule.externalTaxonomyMappings].sort(compareStrings),
    patternSource: rule.pattern.source,
    patternFlags: rule.pattern.flags,
  }
}

function validateRuleRegistry(): void {
  const ids = new Set<string>()
  for (const [index, rule] of RULES.entries()) {
    if (!/^[a-z][a-z0-9_]{0,127}$/.test(rule.ruleId)) fail(`rules[${index}].ruleId`, "must be a bounded inert identifier")
    if (!/^[1-9][0-9]{0,15}$/.test(rule.ruleVersion)) fail(`rules[${index}].ruleVersion`, "must be a positive decimal version")
    if (ids.has(rule.ruleId)) fail("rules", "must not contain duplicate rule identifiers")
    ids.add(rule.ruleId)
    if (!rule.pattern.global || !rule.pattern.unicode) fail(`rules[${index}].pattern`, "must be global and Unicode-aware")
    const mappings = [...rule.externalTaxonomyMappings]
    if (mappings.length > P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxMappingsPerRule) {
      fail(`rules[${index}].externalTaxonomyMappings`, "exceeds the mapping-count budget")
    }
    if (new Set(mappings).size !== mappings.length) fail(`rules[${index}].externalTaxonomyMappings`, "must be unique")
    const sorted = [...mappings].sort(compareStrings)
    for (let mappingIndex = 0; mappingIndex < mappings.length; mappingIndex += 1) {
      const mapping = mappings[mappingIndex]!
      assertUnicodeScalars(mapping, `rules[${index}].externalTaxonomyMappings[${mappingIndex}]`)
      if (mapping.length === 0 || [...mapping].length > P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxMappingCodePoints) {
        fail(`rules[${index}].externalTaxonomyMappings[${mappingIndex}]`, "must be bounded non-empty text")
      }
      if (mapping !== sorted[mappingIndex]) fail(`rules[${index}].externalTaxonomyMappings`, "must be canonically sorted")
    }
  }
}

validateRuleRegistry()

export const P7_R24_DETERMINISTIC_SECURITY_PRESCAN_RULE_SET_IDENTITY = hashCanonical(
  RULES.map((rule) => ruleProjection(rule)).sort((left, right) => compareStrings(String(left.ruleId), String(right.ruleId))),
)

function normalizeInput(input: P7DeterministicSecurityPrescanBuildInput): Readonly<{
  reviewUniverseBuildInput: P7ReviewCoverageUniverseEvidenceBindingBuildInput
  reviewUniverseEvidence: P7ReviewCoverageUniverseEvidenceBinding
  sources: readonly P7DeterministicSecurityPrescanSourceInput[]
}> {
  const snapshot = snapshotJsonData(input, "input")
  const record = ownDataRecord(snapshot, INPUT_KEYS, INPUT_KEYS, "input")
  const reviewUniverseBuildInput = record.reviewUniverseBuildInput as P7ReviewCoverageUniverseEvidenceBindingBuildInput
  const reviewUniverseEvidence = record.reviewUniverseEvidence as P7ReviewCoverageUniverseEvidenceBinding
  const sourceValues = denseArray(
    record.sources,
    "input.sources",
    P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxSources,
  )
  const sources = sourceValues.map((value, index): P7DeterministicSecurityPrescanSourceInput => {
    const source = ownDataRecord(value, SOURCE_KEYS, SOURCE_KEYS, `input.sources[${index}]`)
    return Object.freeze({
      path: boundedPathText(source.path, `input.sources[${index}].path`),
      rawByteIdentity: sha256(source.rawByteIdentity, `input.sources[${index}].rawByteIdentity`),
      rawByteLength: safeInteger(
        source.rawByteLength,
        `input.sources[${index}].rawByteLength`,
        0,
        P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxSourceBytes,
      ),
      rawBytesBase64: canonicalBase64(source.rawBytesBase64, `input.sources[${index}].rawBytesBase64`),
    })
  })

  const claimedAggregateBytes = sources.reduce((total, source) => total + source.rawByteLength, 0)
  if (claimedAggregateBytes > P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxAggregateBytes) {
    fail("input.sources", "exceeds the aggregate raw-byte budget")
  }

  return Object.freeze({ reviewUniverseBuildInput, reviewUniverseEvidence, sources: Object.freeze(sources) })
}

function normalizedSources(
  input: ReturnType<typeof normalizeInput>,
  rebuiltUniverse: P7ReviewCoverageUniverseEvidenceBinding,
): readonly NormalizedSource[] {
  const expectedPaths = [...rebuiltUniverse.reviewableTextPaths]
  const sortedSources = [...input.sources].sort((left, right) => compareStrings(left.path, right.path))
  const sourcePaths = sortedSources.map((source) => source.path)

  if (new Set(sourcePaths).size !== sourcePaths.length) fail("input.sources", "must not contain duplicate source paths")
  if (sourcePaths.length !== expectedPaths.length || sourcePaths.some((path, index) => path !== expectedPaths[index])) {
    fail("input.sources", "must contain exactly one source for every R23 reviewable-text path and no other path")
  }

  const descriptorMap = new Map<string, P7ReviewCoveragePathDescriptor>()
  for (const descriptor of input.reviewUniverseBuildInput.changedPaths) descriptorMap.set(descriptor.path, descriptor)

  let aggregateBytes = 0
  const result: NormalizedSource[] = []
  for (const [index, source] of sortedSources.entries()) {
    const descriptor = descriptorMap.get(source.path)
    if (descriptor === undefined) fail(`input.sources[${index}].path`, "does not have an R23 descriptor")
    if (
      descriptor.objectKind !== "regular_file" ||
      descriptor.objectIdentity === null ||
      !SHA1.test(descriptor.objectIdentity) ||
      descriptor.contentDisposition !== "reviewable_text" ||
      (descriptor.encodingDisposition !== "utf8" && descriptor.encodingDisposition !== "utf8_bom") ||
      (descriptor.fileMode !== "100644" && descriptor.fileMode !== "100755")
    ) {
      fail(`input.sources[${index}].path`, "must map to one regular R23 reviewable-text descriptor")
    }

    const raw = Buffer.from(source.rawBytesBase64, "base64")
    if (raw.toString("base64") !== source.rawBytesBase64) fail(`input.sources[${index}].rawBytesBase64`, "must round-trip canonically")
    if (raw.byteLength !== source.rawByteLength) fail(`input.sources[${index}].rawByteLength`, "does not equal decoded byte length")
    if (raw.byteLength !== descriptor.byteSize) fail(`input.sources[${index}].rawByteLength`, "does not equal the R23 descriptor byteSize")
    aggregateBytes += raw.byteLength
    if (aggregateBytes > P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxAggregateBytes) {
      fail("input.sources", "exceeds the aggregate raw-byte budget")
    }

    const rawDigest = createHash("sha256").update(raw).digest("hex")
    if (rawDigest !== source.rawByteIdentity) fail(`input.sources[${index}].rawByteIdentity`, "does not match the supplied bytes")
    const objectIdentity = gitBlobIdentity(raw)
    if (objectIdentity !== descriptor.objectIdentity) fail(`input.sources[${index}]`, "bytes do not match the R23 Git blob objectIdentity")

    const hasBom = raw.length >= UTF8_BOM.length && raw.subarray(0, UTF8_BOM.length).equals(UTF8_BOM)
    let textBytes = raw
    if (descriptor.encodingDisposition === "utf8_bom") {
      if (!hasBom) fail(`input.sources[${index}]`, "must contain the UTF-8 BOM required by the R23 descriptor")
      textBytes = raw.subarray(UTF8_BOM.length)
    } else if (hasBom) {
      fail(`input.sources[${index}]`, "must not contain a UTF-8 BOM when the R23 descriptor is utf8")
    }

    let decodedText: string
    try {
      decodedText = new TextDecoder("utf-8", { fatal: true }).decode(textBytes)
    } catch {
      return fail(`input.sources[${index}]`, "contains malformed UTF-8")
    }
    assertUnicodeScalars(decodedText, `input.sources[${index}] decoded text`)
    const decodedTextIdentity = createHash("sha256").update(decodedText, "utf8").digest("hex")
    result.push(
      Object.freeze({
        path: source.path,
        sourceGitObjectIdentity: objectIdentity,
        rawByteIdentity: source.rawByteIdentity,
        rawByteLength: source.rawByteLength,
        encodingDisposition: descriptor.encodingDisposition,
        decodedText,
        decodedTextIdentity,
      }),
    )
  }
  return Object.freeze(result)
}

function buildSignals(sources: readonly NormalizedSource[]): readonly P7DeterministicSecurityPrescanSignal[] {
  const byIdentity = new Map<string, { readonly canonical: string; readonly signal: P7DeterministicSecurityPrescanSignal }>()

  for (const source of sources) {
    for (const rule of RULES) {
      const pattern = new RegExp(rule.pattern.source, rule.pattern.flags)
      let match: RegExpExecArray | null
      while ((match = pattern.exec(source.decodedText)) !== null) {
        if (match[0].length === 0) fail(`rule ${rule.ruleId}`, "produced a forbidden zero-length match")
        const range = matchRange(source.decodedText, match.index, match.index + match[0].length)
        const mappings = Object.freeze([...rule.externalTaxonomyMappings])
        const core = {
          ruleId: rule.ruleId,
          ruleVersion: rule.ruleVersion,
          externalTaxonomyMappings: mappings,
          path: source.path,
          sourceGitObjectIdentity: source.sourceGitObjectIdentity,
          sourceRawByteIdentity: source.rawByteIdentity,
          sourceDecodedTextIdentity: source.decodedTextIdentity,
          startLine: range.startLine,
          endLine: range.endLine,
          startColumn: range.startColumn,
          endColumn: range.endColumn,
          matchedTextDigest: createHash("sha256").update(range.matchedText, "utf8").digest("hex"),
        }
        const signalIdentity = hashCanonical(core)
        const signal = Object.freeze({ signalIdentity, ...core })
        const canonical = canonicalJson(signal)
        const previous = byIdentity.get(signalIdentity)
        if (previous !== undefined && previous.canonical !== canonical) fail("signals", "contains a conflicting signal identity")
        if (previous === undefined) byIdentity.set(signalIdentity, { canonical, signal })
        if (byIdentity.size > P7_R24_DETERMINISTIC_SECURITY_PRESCAN_LIMITS.maxSignals) {
          fail("signals", "exceeds the signal-count budget")
        }
      }
    }
  }

  return Object.freeze(
    [...byIdentity.values()]
      .map((entry) => entry.signal)
      .sort((left, right) =>
        compareStrings(left.path, right.path) ||
        left.startLine - right.startLine ||
        left.startColumn - right.startColumn ||
        left.endLine - right.endLine ||
        left.endColumn - right.endColumn ||
        compareStrings(left.ruleId, right.ruleId) ||
        compareStrings(left.ruleVersion, right.ruleVersion) ||
        compareStrings(left.signalIdentity, right.signalIdentity),
      ),
  )
}

export function buildP7DeterministicSecurityPrescanEvidenceBinding(
  rawInput: P7DeterministicSecurityPrescanBuildInput,
): P7DeterministicSecurityPrescanEvidenceBinding {
  const input = normalizeInput(rawInput)
  const rebuiltUniverse = buildP7ReviewCoverageUniverseEvidenceBinding(input.reviewUniverseBuildInput)
  const validatedUniverse = validateP7ReviewCoverageUniverseEvidenceBinding(
    input.reviewUniverseEvidence,
    input.reviewUniverseBuildInput,
  )
  if (rebuiltUniverse.evidenceIdentity !== validatedUniverse.evidenceIdentity) {
    fail("input.reviewUniverseEvidence", "does not equal the exact R23 evidence rebuilt from reviewUniverseBuildInput")
  }

  const sources = normalizedSources(input, rebuiltUniverse)
  const sourceProjection = sources.map((source) => ({
    path: source.path,
    sourceGitObjectIdentity: source.sourceGitObjectIdentity,
    rawByteIdentity: source.rawByteIdentity,
    rawByteLength: source.rawByteLength,
    decodedTextIdentity: source.decodedTextIdentity,
    encodingDisposition: source.encodingDisposition,
  }))
  const sourceSetIdentity = hashCanonical(sourceProjection)
  const signals = buildSignals(sources)

  const core: EvidenceCore = {
    version: P7_R24_DETERMINISTIC_SECURITY_PRESCAN_EVIDENCE_BINDING_VERSION,
    state: P7_R24_DETERMINISTIC_SECURITY_PRESCAN_BOUND_STATE,
    repositoryIdentity: rebuiltUniverse.repositoryIdentity,
    canonicalBase: rebuiltUniverse.canonicalBase,
    targetHead: rebuiltUniverse.targetHead,
    targetTree: rebuiltUniverse.targetTree,
    changedPathSetIdentity: rebuiltUniverse.changedPathSetIdentity,
    reviewUniverseIdentity: rebuiltUniverse.reviewUniverseIdentity,
    sourceSetIdentity,
    ruleSetIdentity: P7_R24_DETERMINISTIC_SECURITY_PRESCAN_RULE_SET_IDENTITY,
    sourceCount: sources.length,
    scannedPaths: Object.freeze(sources.map((source) => source.path)),
    signalCount: signals.length,
    signals,
  }
  const evidenceIdentity = hashCanonical(core)
  return deepFreeze({ ...core, evidenceIdentity })
}

export function validateP7DeterministicSecurityPrescanEvidenceBinding(
  value: unknown,
  input: P7DeterministicSecurityPrescanBuildInput,
): P7DeterministicSecurityPrescanEvidenceBinding {
  const actual = snapshotJsonData(value, "evidence")
  const expected = buildP7DeterministicSecurityPrescanEvidenceBinding(input)
  if (canonicalJson(actual) !== canonicalJson(expected)) fail("evidence", "does not match the canonical result for the supplied R24 input")
  return expected
}
