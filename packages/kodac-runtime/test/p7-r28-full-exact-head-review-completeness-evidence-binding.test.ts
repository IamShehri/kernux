import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import test from "node:test"

import {
  buildP7ReviewCoverageUniverseEvidenceBinding,
  type P7ReviewCoveragePathDescriptor,
} from "../src/remediation/p7-review-coverage-universe-evidence-binding.ts"
import { buildP7DeterministicSecurityPrescanEvidenceBinding } from "../src/remediation/p7-deterministic-security-prescan-evidence-binding.ts"
import { buildP7RiskCoverageEvidenceBinding } from "../src/remediation/p7-risk-coverage-evidence-binding.ts"
import {
  buildP7SkillCoverageEvidenceBinding,
  type P7SkillCoverageEvidenceBindingBuildInput,
} from "../src/remediation/p7-skill-coverage-evidence-binding.ts"
import {
  buildP7ProviderAttemptTerminationEvidenceBinding,
  type P7ProviderAttemptDescriptor,
  type P7ProviderAttemptTerminationEvidenceBindingBuildInput,
} from "../src/remediation/p7-provider-attempt-termination-evidence-binding.ts"
import {
  P7_R28_BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_STATE,
  P7_R28_FULL_EXACT_HEAD_REVIEW_COMPLETENESS_EVIDENCE_BINDING_VERSION,
  buildP7FullExactHeadReviewCompletenessEvidenceBinding,
  validateP7FullExactHeadReviewCompletenessEvidenceBinding,
  type P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput,
} from "../src/remediation/p7-full-exact-head-review-completeness-evidence-binding.ts"

type MutableRecord = Record<string, any>
type SchemaRecord = Record<string, any>

type FixtureModule = Readonly<{
  r27Input(root: string): Promise<P7ProviderAttemptTerminationEvidenceBindingBuildInput>
  withTemp<T>(run: (root: string) => Promise<T>): Promise<T>
  attempt(overrides?: Partial<P7ProviderAttemptDescriptor>): P7ProviderAttemptDescriptor
  r26Input(repositoryIdentity?: string, canonicalBase?: string, targetHead?: string, targetTree?: string): P7SkillCoverageEvidenceBindingBuildInput
  CONTEXT_PATH: string
  REPOSITORY: string
  BASE: string
  HEAD: string
  TREE: string
  PATH_SET: string
  sha256(value: unknown): string
}>

const schema = JSON.parse(
  readFileSync(new URL("../../../schema/p7-full-exact-head-review-completeness-evidence-binding.schema.json", import.meta.url), "utf8"),
) as SchemaRecord
const production = readFileSync(
  new URL("../src/remediation/p7-full-exact-head-review-completeness-evidence-binding.ts", import.meta.url),
  "utf8",
)

let fixturePromise: Promise<FixtureModule> | null = null

async function fixture(): Promise<FixtureModule> {
  fixturePromise ??= (async () => {
    const sourceUrl = new URL("./p7-r27-provider-attempt-termination-evidence-binding.test.ts", import.meta.url)
    const source = readFileSync(sourceUrl, "utf8")
    const marker = "const schema = JSON.parse("
    const markerIndex = source.indexOf(marker)
    assert.ok(markerIndex > 0, "R27 fixture source must retain the expected pre-test marker")

    let fixtureSource = source.slice(0, markerIndex)
    const oldPathDeclaration = 'const path = "src/review-target.ts"'
    assert.equal(fixtureSource.includes(oldPathDeclaration), true, "R27 fixture must retain its canonical R26 path declaration")
    fixtureSource = fixtureSource.replace(oldPathDeclaration, "const path = CONTEXT_PATH")

    const srcBase = new URL("../src/", import.meta.url).href
    assert.equal(fixtureSource.includes('from "../src/'), true, "R27 fixture imports must use the expected relative source prefix")
    fixtureSource = fixtureSource.replaceAll('from "../src/', `from "${srcBase}`)
    assert.equal(fixtureSource.includes('from "../src/'), false, "all R27 fixture source imports must be rebased")
    fixtureSource += `\nexport { r27Input, withTemp, attempt, r26Input, CONTEXT_PATH, REPOSITORY, BASE, HEAD, TREE, PATH_SET, sha256 }\n`

    const root = await mkdtemp(join(tmpdir(), "kodac-p7-r28-fixture-module-"))
    const path = join(root, "fixture.ts")
    await writeFile(path, fixtureSource, "utf8")
    try {
      return await import(pathToFileURL(path).href) as unknown as FixtureModule
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })()
  return fixturePromise
}

function assertDeepFrozen(value: unknown): void {
  if (value === null || typeof value !== "object") return
  assert.equal(Object.isFrozen(value), true)
  for (const child of Object.values(value as Record<string, unknown>)) assertDeepFrozen(child)
}

function resolveRef(root: SchemaRecord, ref: string): SchemaRecord {
  assert.ok(ref.startsWith("#/$defs/"))
  return root.$defs[ref.slice("#/$defs/".length)] as SchemaRecord
}

function schemaAccepts(nodeValue: unknown, value: unknown, root = schema): boolean {
  if (nodeValue === false) return false
  if (nodeValue === true) return true
  const node = nodeValue as SchemaRecord
  if (node.$ref !== undefined) return schemaAccepts(resolveRef(root, node.$ref), value, root)
  if (Array.isArray(node.anyOf)) return node.anyOf.some((candidate: unknown) => schemaAccepts(candidate, value, root))
  if (Object.hasOwn(node, "const") && JSON.stringify(value) !== JSON.stringify(node.const)) return false
  if (Array.isArray(node.enum) && !node.enum.some((candidate: unknown) => JSON.stringify(candidate) === JSON.stringify(value))) return false
  if (node.type === "null") return value === null
  if (node.type === "object") {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return false
    const record = value as MutableRecord
    const properties = (node.properties ?? {}) as SchemaRecord
    if (Array.isArray(node.required) && node.required.some((key: string) => !Object.hasOwn(record, key))) return false
    if (node.additionalProperties === false && Object.keys(record).some((key) => !Object.hasOwn(properties, key))) return false
    return Object.entries(properties).every(([key, child]) => !Object.hasOwn(record, key) || schemaAccepts(child, record[key], root))
  }
  if (node.type === "array") {
    if (!Array.isArray(value)) return false
    if (typeof node.minItems === "number" && value.length < node.minItems) return false
    if (typeof node.maxItems === "number" && value.length > node.maxItems) return false
    if (node.uniqueItems === true && new Set(value.map((item) => JSON.stringify(item))).size !== value.length) return false
    return node.items === undefined || value.every((item) => schemaAccepts(node.items, item, root))
  }
  if (node.type === "string") {
    if (typeof value !== "string") return false
    const length = [...value].length
    if (typeof node.minLength === "number" && length < node.minLength) return false
    if (typeof node.maxLength === "number" && length > node.maxLength) return false
    if (typeof node.pattern === "string" && !(new RegExp(node.pattern).test(value))) return false
    return true
  }
  if (node.type === "integer") {
    if (!Number.isInteger(value)) return false
    if (typeof node.minimum === "number" && (value as number) < node.minimum) return false
    if (typeof node.maximum === "number" && (value as number) > node.maximum) return false
    return true
  }
  return true
}

function rebuildSkillCoverageLineage(input: P7SkillCoverageEvidenceBindingBuildInput): P7SkillCoverageEvidenceBindingBuildInput {
  const clone = structuredClone(input) as MutableRecord
  const prescanInput = clone.riskCoverageBuildInput.securityPrescanBuildInput
  prescanInput.reviewUniverseEvidence = buildP7ReviewCoverageUniverseEvidenceBinding(prescanInput.reviewUniverseBuildInput)
  clone.riskCoverageBuildInput.securityPrescanEvidence = buildP7DeterministicSecurityPrescanEvidenceBinding(prescanInput)
  clone.riskCoverageEvidence = buildP7RiskCoverageEvidenceBinding(clone.riskCoverageBuildInput)
  return clone as P7SkillCoverageEvidenceBindingBuildInput
}

async function replaceR26(
  input: P7ProviderAttemptTerminationEvidenceBindingBuildInput,
  skillCoverageInput: P7SkillCoverageEvidenceBindingBuildInput,
  attemptOverride?: Partial<P7ProviderAttemptDescriptor>,
): Promise<P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput> {
  const clone = structuredClone(input) as MutableRecord
  clone.sourceSkillCoverageEvidenceBindingInput = skillCoverageInput
  clone.sourceSkillCoverageEvidenceBinding = buildP7SkillCoverageEvidenceBinding(skillCoverageInput)
  if (attemptOverride !== undefined) clone.attempt = { ...clone.attempt, ...attemptOverride }
  const r27Input = clone as P7ProviderAttemptTerminationEvidenceBindingBuildInput
  return {
    sourceProviderAttemptTerminationEvidenceBinding: await buildP7ProviderAttemptTerminationEvidenceBinding(r27Input),
    sourceProviderAttemptTerminationEvidenceBindingInput: r27Input,
  }
}

async function canonicalInput(root: string): Promise<P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput> {
  const f = await fixture()
  const r27Input = await f.r27Input(root)
  return {
    sourceProviderAttemptTerminationEvidenceBinding: await buildP7ProviderAttemptTerminationEvidenceBinding(r27Input),
    sourceProviderAttemptTerminationEvidenceBindingInput: r27Input,
  }
}

test("P7-R28 deterministically composes exact R20-R27 lineage into one bounded no-debt completeness proof", async () => {
  const f = await fixture()
  await f.withTemp(async (root) => {
    const input = await canonicalInput(root)
    const first = await buildP7FullExactHeadReviewCompletenessEvidenceBinding(input)

    const reorderedR27 = structuredClone(input.sourceProviderAttemptTerminationEvidenceBindingInput) as MutableRecord
    reorderedR27.provenanceEvidence.reverse()
    reorderedR27.attempt.retryLineageEvidenceIdentities.reverse()
    const reorderedR27Input = reorderedR27 as P7ProviderAttemptTerminationEvidenceBindingBuildInput
    const reorderedInput: P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput = {
      sourceProviderAttemptTerminationEvidenceBinding: await buildP7ProviderAttemptTerminationEvidenceBinding(reorderedR27Input),
      sourceProviderAttemptTerminationEvidenceBindingInput: reorderedR27Input,
    }
    const second = await buildP7FullExactHeadReviewCompletenessEvidenceBinding(reorderedInput)

    assert.deepEqual(second, first)
    assert.equal(first.version, P7_R28_FULL_EXACT_HEAD_REVIEW_COMPLETENESS_EVIDENCE_BINDING_VERSION)
    assert.equal(first.state, P7_R28_BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_STATE)
    assert.equal(first.repositoryIdentity, f.REPOSITORY)
    assert.equal(first.canonicalBase, f.BASE)
    assert.equal(first.targetHead, f.HEAD)
    assert.equal(first.targetTree, f.TREE)
    assert.equal(first.changedPathSetIdentity, f.PATH_SET)
    assert.deepEqual(first.reviewedPaths, [f.CONTEXT_PATH])
    assert.deepEqual(first.unreviewedPaths, [])
    assert.equal(first.reviewedPathCount, 1)
    assert.equal(first.unreviewedPathCount, 0)
    assert.equal(first.knownNonreviewablePathCount, 0)
    assert.equal(first.unknownCoveragePathCount, 0)
    assert.equal(first.riskCoverageState, "ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN")
    assert.equal(first.skillCoverageState, "ACCOUNTED_NO_COVERAGE_DEBT")
    assert.equal(first.providerCompletionState, "CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION")
    assert.equal(schemaAccepts(schema, first), true)
    assert.deepEqual(await validateP7FullExactHeadReviewCompletenessEvidenceBinding(first, input), first)
    assertDeepFrozen(first)

    for (const forbidden of [
      "allBytesSemanticallyReviewed",
      "defectFree",
      "verifiedProviderIdentity",
      "verifiedModelIdentity",
      "providerAuthenticatedCompletion",
      "p7ToK5ReconciliationProof",
      "doneGateProof",
      "releaseAuthority",
      "projectCompletion",
    ]) assert.equal(Object.hasOwn(first, forbidden), false, forbidden)
  })
})

test("P7-R28 preserves explicit known nonreviewable accounting without converting it into semantic review", async () => {
  const f = await fixture()
  await f.withTemp(async (root) => {
    const baseR27 = await f.r27Input(root)
    const r26 = structuredClone(baseR27.sourceSkillCoverageEvidenceBindingInput) as MutableRecord
    const reviewUniverseInput = r26.riskCoverageBuildInput.securityPrescanBuildInput.reviewUniverseBuildInput
    const deletedPath = "generated/deleted.bin"
    const descriptor: P7ReviewCoveragePathDescriptor = {
      path: deletedPath,
      previousPath: null,
      changeKind: "deleted",
      objectKind: "missing_after_change",
      objectIdentity: null,
      byteSize: 0,
      fileMode: "000000",
      contentDisposition: "not_applicable_deleted",
      encodingDisposition: "not_applicable",
      isGeneratedOrDerived: false,
      isReferencedHiddenPayload: false,
      policyDisposition: "not_applicable",
      policyReason: null,
    }
    reviewUniverseInput.changedPaths.push(descriptor)
    const rebuiltR26 = rebuildSkillCoverageLineage(r26 as P7SkillCoverageEvidenceBindingBuildInput)
    const input = await replaceR26(baseR27, rebuiltR26)
    const output = await buildP7FullExactHeadReviewCompletenessEvidenceBinding(input)

    assert.deepEqual(output.reviewedPaths, [f.CONTEXT_PATH])
    assert.deepEqual(output.unreviewedPaths, [deletedPath])
    assert.equal(output.knownNonreviewablePathCount, 1)
    assert.deepEqual(output.pathReviewRecords.find((record) => record.path === deletedPath), {
      path: deletedPath,
      disposition: "KNOWN_NONREVIEWABLE",
      unreviewedReason: "NOT_APPLICABLE",
      reviewMethod: "R23_KNOWN_DISPOSITION",
      reviewEvidenceIdentities: [output.reviewCoverageUniverseEvidenceIdentity],
    })
    assert.equal(Object.hasOwn(output, "allBytesSemanticallyReviewed"), false)
  })
})

test("P7-R28 fails closed on unknown reviewable path debt, risk debt, provider completion debt, and tampered R27 evidence", async () => {
  const f = await fixture()
  await f.withTemp(async (root) => {
    const baseR27 = await f.r27Input(root)

    const missingPathR26 = structuredClone(baseR27.sourceSkillCoverageEvidenceBindingInput) as MutableRecord
    const prescanInput = missingPathR26.riskCoverageBuildInput.securityPrescanBuildInput
    prescanInput.reviewUniverseBuildInput.changedPaths[0].path = "src/missing-from-r22-context.ts"
    prescanInput.sources[0].path = "src/missing-from-r22-context.ts"
    const missingInput = await replaceR26(
      baseR27,
      rebuildSkillCoverageLineage(missingPathR26 as P7SkillCoverageEvidenceBindingBuildInput),
    )
    await assert.rejects(
      buildP7FullExactHeadReviewCompletenessEvidenceBinding(missingInput),
      /unknownCoveragePaths.*missing exact R22 context/,
    )

    const riskDebtR26 = structuredClone(baseR27.sourceSkillCoverageEvidenceBindingInput) as MutableRecord
    const firstRisk = riskDebtR26.riskCoverageBuildInput.riskApplicability[0]
    firstRisk.applicability = "UNKNOWN"
    firstRisk.evidenceIdentities = []
    const riskDebtInput = await replaceR26(
      baseR27,
      rebuildSkillCoverageLineage(riskDebtR26 as P7SkillCoverageEvidenceBindingBuildInput),
    )
    await assert.rejects(
      buildP7FullExactHeadReviewCompletenessEvidenceBinding(riskDebtInput),
      /riskCoverageState.*ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN/,
    )

    const providerDebtInput = await replaceR26(
      baseR27,
      baseR27.sourceSkillCoverageEvidenceBindingInput,
      {
        terminationReason: "TOKEN_LIMIT",
        outputTruncationState: "TRUNCATED",
        outputTruncationEvidenceIdentity: f.sha256("p7-r28-truncated"),
      },
    )
    await assert.rejects(
      buildP7FullExactHeadReviewCompletenessEvidenceBinding(providerDebtInput),
      /terminationReason.*COMPLETED/,
    )

    const canonical = await canonicalInput(root)
    const tampered = structuredClone(canonical.sourceProviderAttemptTerminationEvidenceBinding) as MutableRecord
    tampered.evidenceIdentity = "0".repeat(64)
    await assert.rejects(
      buildP7FullExactHeadReviewCompletenessEvidenceBinding({
        ...canonical,
        sourceProviderAttemptTerminationEvidenceBinding: tampered,
      } as P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput),
      /P7-R27|canonical|evidence/i,
    )
  })
})

test("P7-R28 rejects hostile top-level input before inherited validation", async () => {
  const f = await fixture()
  await f.withTemp(async (root) => {
    const input = await canonicalInput(root)

    await assert.rejects(
      buildP7FullExactHeadReviewCompletenessEvidenceBinding(new Proxy(structuredClone(input), {}) as P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput),
      /Proxy/,
    )

    let getterCalls = 0
    const accessor = structuredClone(input) as MutableRecord
    Object.defineProperty(accessor, "sourceProviderAttemptTerminationEvidenceBinding", {
      enumerable: true,
      get() {
        getterCalls += 1
        return input.sourceProviderAttemptTerminationEvidenceBinding
      },
    })
    await assert.rejects(
      buildP7FullExactHeadReviewCompletenessEvidenceBinding(accessor as P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput),
      /data property/,
    )
    assert.equal(getterCalls, 0)

    const symbol = structuredClone(input) as MutableRecord
    Object.defineProperty(symbol, Symbol("hidden"), { enumerable: true, value: true })
    await assert.rejects(
      buildP7FullExactHeadReviewCompletenessEvidenceBinding(symbol as P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput),
      /symbol/,
    )

    const unknown = { ...structuredClone(input), unexpected: true } as MutableRecord
    await assert.rejects(
      buildP7FullExactHeadReviewCompletenessEvidenceBinding(unknown as P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput),
      /unknown|symbol field/,
    )

    const cycle = structuredClone(input) as MutableRecord
    cycle.self = cycle
    await assert.rejects(
      buildP7FullExactHeadReviewCompletenessEvidenceBinding(cycle as P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput),
      /aliases or cycles|unknown/,
    )
  })
})

test("P7-R28 schema is strict and production adds no execution, network, secret, persistence, K2, K5, or Done Gate surface", () => {
  assert.equal(schema.additionalProperties, false)
  assert.equal(schema.properties.version.const, P7_R28_FULL_EXACT_HEAD_REVIEW_COMPLETENESS_EVIDENCE_BINDING_VERSION)
  assert.equal(schema.properties.state.const, P7_R28_BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_STATE)
  assert.equal(schema.properties.unknownCoveragePathCount.const, 0)
  assert.equal(schema.properties.riskCoverageState.const, "ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN")
  assert.equal(schema.properties.skillCoverageState.const, "ACCOUNTED_NO_COVERAGE_DEBT")
  assert.equal(schema.properties.providerCompletionState.const, "CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION")
  assert.equal(schema.$defs.sha256.pattern, "^[0-9a-f]{64}$")
  assert.equal(schema.$defs.gitSha.pattern, "^[0-9a-f]{40}$")

  for (const validator of [
    "validateP7ProviderAttemptTerminationEvidenceBinding",
    "validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding",
    "validateP7ReviewCoverageUniverseEvidenceBinding",
    "validateP7DeterministicSecurityPrescanEvidenceBinding",
    "validateP7RiskCoverageEvidenceBinding",
    "validateP7SkillCoverageEvidenceBinding",
    "buildContextBundle",
  ]) assert.equal(production.includes(validator), true, validator)

  assert.equal(/node:(?:fs|child_process|http|https|http2|net|tls|dgram|worker_threads|os|path|vm)/.test(production), false)
  assert.equal(/\b(?:fetch|setTimeout|setInterval|randomUUID|getRandomValues|eval)\s*\(/.test(production), false)
  assert.equal(/\bprocess\s*\.|\bDate\s*\(|\bDate\.now|\bMath\.random/.test(production), false)
  assert.equal(/\bExecutionGateway\b|\bTrustKernel\b|\bDoneGate\b|\.register\s*\(|\.dispose\s*\(/.test(production), false)
  assert.equal(/\bimport\s*\(/.test(production), false)
  assert.equal(/\b(?:writeFile|appendFile|mkdir|rm|unlink|rename|copyFile)\s*\(/.test(production), false)
  assert.equal(/\b(?:retry|replay|resume)\s*\(/i.test(production), false)
  assert.equal(/\b(?:provider|model|tool)\.(?:invoke|call|run|execute)\s*\(/i.test(production), false)
})
