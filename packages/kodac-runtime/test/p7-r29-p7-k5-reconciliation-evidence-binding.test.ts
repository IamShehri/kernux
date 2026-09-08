import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import test from "node:test"

import {
  P7_R29_BRIDGE_EVIDENCE_ID,
  P7_R29_BRIDGE_REQUIREMENT_ID,
  P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BINDING_VERSION,
  P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_STATE,
  buildP7ToK5ReconciliationEvidenceBinding,
  validateP7ToK5ReconciliationEvidenceBinding,
  type P7ToK5ReconciliationEvidenceBindingBuildInput,
} from "../src/proof-review/p7-k5-reconciliation-evidence-binding.ts"
import {
  createK5R1ProofPackage,
  type K5R1ProofPackage,
  type K5R1ProofPackageInput,
} from "../src/proof-review/contracts.ts"
import { judgeK5R1ProofPackage } from "../src/proof-review/judge.ts"
import { linkK5R2Evidence } from "../src/proof-review/linkage.ts"
import { linkK5R3ReviewAdjudicationEvidence } from "../src/proof-review/review-adjudication.ts"
import { reconcileK5R4ProofState } from "../src/proof-review/reconciliation.ts"
import {
  buildP7FullExactHeadReviewCompletenessEvidenceBinding,
  type P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput,
} from "../src/remediation/p7-full-exact-head-review-completeness-evidence-binding.ts"

type MutableRecord = Record<string, any>
type SchemaRecord = Record<string, any>

type R28FixtureModule = Readonly<{
  canonicalInput(root: string): Promise<P7FullExactHeadReviewCompletenessEvidenceBindingBuildInput>
  fixture(): Promise<Readonly<{
    withTemp<T>(run: (root: string) => Promise<T>): Promise<T>
  }>>
}>

const schema = JSON.parse(
  readFileSync(new URL("../../../schema/p7-k5-reconciliation-evidence-binding.schema.json", import.meta.url), "utf8"),
) as SchemaRecord

let r28FixturePromise: Promise<R28FixtureModule> | null = null

async function r28Fixture(): Promise<R28FixtureModule> {
  r28FixturePromise ??= (async () => {
    const sourceUrl = new URL("./p7-r28-full-exact-head-review-completeness-evidence-binding.test.ts", import.meta.url)
    const source = readFileSync(sourceUrl, "utf8")
    const schemaMarker = "const schema = JSON.parse("
    const fixtureMarker = "let fixturePromise"
    const firstTestMarker = 'test("P7-R28 deterministically'
    const schemaIndex = source.indexOf(schemaMarker)
    const fixtureIndex = source.indexOf(fixtureMarker)
    const firstTestIndex = source.indexOf(firstTestMarker)
    assert.ok(schemaIndex > 0, "R28 fixture source must retain its schema marker")
    assert.ok(fixtureIndex > schemaIndex, "R28 fixture source must retain its fixture marker")
    assert.ok(firstTestIndex > fixtureIndex, "R28 fixture source must retain its first-test marker")

    const runtimeSrcBase = new URL("../src/", import.meta.url).href
    let prefix = source.slice(0, schemaIndex)
    prefix = prefix.replaceAll('from "../src/', `from "${runtimeSrcBase}`)

    let suffix = source.slice(fixtureIndex, firstTestIndex)
    const nestedR27Url = new URL("./p7-r27-provider-attempt-termination-evidence-binding.test.ts", import.meta.url).href
    suffix = suffix.replace(
      'const sourceUrl = new URL("./p7-r27-provider-attempt-termination-evidence-binding.test.ts", import.meta.url)',
      `const sourceUrl = new URL(${JSON.stringify(nestedR27Url)})`,
    )
    suffix = suffix.replace(
      'const srcBase = new URL("../src/", import.meta.url).href',
      `const srcBase = ${JSON.stringify(runtimeSrcBase)}`,
    )

    const fixtureSource = `${prefix}${suffix}\nexport { canonicalInput, fixture }\n`
    const root = await mkdtemp(join(tmpdir(), "kodac-p7-r29-r28-fixture-module-"))
    const path = join(root, "fixture.ts")
    await writeFile(path, fixtureSource, "utf8")
    try {
      return await import(pathToFileURL(path).href) as unknown as R28FixtureModule
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })()
  return r28FixturePromise
}

function schemaAccepts(nodeValue: unknown, value: unknown, root = schema): boolean {
  if (nodeValue === false) return false
  if (nodeValue === true) return true
  const node = nodeValue as SchemaRecord
  if (Object.hasOwn(node, "$ref")) {
    const ref = node.$ref as string
    if (!ref.startsWith("#/$defs/")) return false
    return schemaAccepts(root.$defs[ref.slice("#/$defs/".length)], value, root)
  }
  if (Object.hasOwn(node, "const") && JSON.stringify(value) !== JSON.stringify(node.const)) return false
  if (Array.isArray(node.enum) && !node.enum.some((candidate: unknown) => JSON.stringify(candidate) === JSON.stringify(value))) return false
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
    return node.items === undefined || value.every((item) => schemaAccepts(node.items, item, root))
  }
  if (node.type === "string") {
    if (typeof value !== "string") return false
    const length = [...value].length
    if (typeof node.minLength === "number" && length < node.minLength) return false
    if (typeof node.maxLength === "number" && length > node.maxLength) return false
    if (typeof node.pattern === "string" && !new RegExp(node.pattern).test(value)) return false
    return true
  }
  if (node.type === "integer") return Number.isInteger(value)
  return true
}

function assertDeepFrozen(value: unknown): void {
  if (value === null || typeof value !== "object") return
  assert.equal(Object.isFrozen(value), true)
  for (const child of Object.values(value as Record<string, unknown>)) assertDeepFrozen(child)
}

function bridgePackageInput(p7: Awaited<ReturnType<typeof buildP7FullExactHeadReviewCompletenessEvidenceBinding>>): K5R1ProofPackageInput {
  return {
    subject: {
      subjectId: p7.evidenceIdentity,
      subjectKind: "VERIFICATION",
    },
    revision: {
      repositoryId: p7.repositoryIdentity,
      canonicalBase: p7.canonicalBase,
      candidateHead: p7.targetHead,
    },
    requirements: [{
      requirementId: P7_R29_BRIDGE_REQUIREMENT_ID,
      kind: "CUSTOM",
      minimumEvidence: 1,
    }],
    evidence: [{
      evidenceId: P7_R29_BRIDGE_EVIDENCE_ID,
      kind: "CUSTOM",
      requirementIds: [P7_R29_BRIDGE_REQUIREMENT_ID],
      canonicalBase: p7.canonicalBase,
      candidateHead: p7.targetHead,
      ref: `p7-r28:${p7.evidenceIdentity}`,
      digest: p7.evidenceIdentity,
      status: "SATISFIED",
    }],
  }
}

function canonicalK5Inputs(proofPackage: K5R1ProofPackage) {
  const judgment = judgeK5R1ProofPackage(proofPackage)
  const r2 = linkK5R2Evidence(proofPackage, [])
  const r3 = linkK5R3ReviewAdjudicationEvidence(proofPackage, [])
  const reconciliation = reconcileK5R4ProofState(proofPackage, r2, r3)
  return { judgment, reconciliation }
}

async function withCanonicalBridge<T>(
  run: (context: {
    input: P7ToK5ReconciliationEvidenceBindingBuildInput
    p7: Awaited<ReturnType<typeof buildP7FullExactHeadReviewCompletenessEvidenceBinding>>
    proofPackage: K5R1ProofPackage
  }) => Promise<T>,
): Promise<T> {
  const module = await r28Fixture()
  const fixture = await module.fixture()
  return fixture.withTemp(async (root) => {
    const r28Input = await module.canonicalInput(root)
    const p7 = await buildP7FullExactHeadReviewCompletenessEvidenceBinding(r28Input)
    const proofPackage = createK5R1ProofPackage(bridgePackageInput(p7))
    const { judgment, reconciliation } = canonicalK5Inputs(proofPackage)
    const input: P7ToK5ReconciliationEvidenceBindingBuildInput = {
      sourceP7FullExactHeadReviewCompletenessEvidenceBinding: p7,
      sourceP7FullExactHeadReviewCompletenessEvidenceBindingBuildInput: r28Input,
      sourceK5R1ProofPackage: proofPackage,
      sourceK5R1ProofJudgment: judgment,
      sourceK5R4ProofStateReconciliation: reconciliation,
    }
    return run({ input, p7, proofPackage })
  })
}

test("P7-R29 deterministically binds fully revalidated R28 completeness into canonical K5-R1/K5-R4 evidence", async () => {
  await withCanonicalBridge(async ({ input, p7, proofPackage }) => {
    const first = await buildP7ToK5ReconciliationEvidenceBinding(input)
    const second = await buildP7ToK5ReconciliationEvidenceBinding(structuredClone(input))

    assert.deepEqual(second, first)
    assert.equal(first.version, P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BINDING_VERSION)
    assert.equal(first.state, P7_R29_P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_STATE)
    assert.equal(first.repositoryIdentity, p7.repositoryIdentity)
    assert.equal(first.canonicalBase, p7.canonicalBase)
    assert.equal(first.targetHead, p7.targetHead)
    assert.equal(first.targetTree, p7.targetTree)
    assert.equal(first.changedPathSetIdentity, p7.changedPathSetIdentity)
    assert.equal(first.reviewUniverseIdentity, p7.reviewUniverseIdentity)
    assert.equal(first.p7CompletenessEvidenceIdentity, p7.evidenceIdentity)
    assert.equal(first.k5PackageIdentity, proofPackage.packageIdentity)
    assert.equal(first.k5JudgmentIdentity, input.sourceK5R1ProofJudgment.judgmentIdentity)
    assert.equal(first.k5ReconciliationIdentity, input.sourceK5R4ProofStateReconciliation.reconciliationIdentity)
    assert.equal(first.bridgeRequirementId, P7_R29_BRIDGE_REQUIREMENT_ID)
    assert.equal(first.bridgeEvidenceId, P7_R29_BRIDGE_EVIDENCE_ID)
    assert.equal(first.k5PackageStatus, "SUFFICIENT_PACKAGE")
    assert.equal(first.k5R4Status, "NOT_APPLICABLE")
    assert.equal(schemaAccepts(schema, first), true)
    assert.deepEqual(await validateP7ToK5ReconciliationEvidenceBinding(first, input), first)
    assertDeepFrozen(first)

    for (const forbidden of [
      "doneGateProof",
      "provenReady",
      "approval",
      "mergeability",
      "mergeAuthority",
      "releaseAuthority",
      "projectCompletion",
      "allBytesSemanticallyReviewed",
      "defectFree",
    ]) assert.equal(Object.hasOwn(first, forbidden), false, forbidden)
  })
})

test("P7-R29 fails closed on foreign K5 revision/package identity and noncanonical judgment or reconciliation", async () => {
  await withCanonicalBridge(async ({ input, p7 }) => {
    const foreignHead = p7.targetHead === "d".repeat(40) ? "e".repeat(40) : "d".repeat(40)
    const canonicalPackageInput = bridgePackageInput(p7)
    const foreignPackage = createK5R1ProofPackage({
      ...canonicalPackageInput,
      revision: { ...canonicalPackageInput.revision, candidateHead: foreignHead },
      evidence: canonicalPackageInput.evidence.map((evidence) => ({
        ...evidence,
        candidateHead: foreignHead,
      })),
    })
    const foreignK5 = canonicalK5Inputs(foreignPackage)

    await assert.rejects(
      buildP7ToK5ReconciliationEvidenceBinding({
        ...input,
        sourceK5R1ProofPackage: foreignPackage,
        sourceK5R1ProofJudgment: foreignK5.judgment,
        sourceK5R4ProofStateReconciliation: foreignK5.reconciliation,
      }),
      /candidateHead|target head/,
    )

    const tamperedJudgment = structuredClone(input.sourceK5R1ProofJudgment) as MutableRecord
    tamperedJudgment.status = "INSUFFICIENT_PACKAGE"
    await assert.rejects(
      buildP7ToK5ReconciliationEvidenceBinding({
        ...input,
        sourceK5R1ProofJudgment: tamperedJudgment as unknown as typeof input.sourceK5R1ProofJudgment,
      }),
      TypeError,
    )

    const tamperedReconciliation = structuredClone(input.sourceK5R4ProofStateReconciliation) as MutableRecord
    tamperedReconciliation.status = "VALID"
    await assert.rejects(
      buildP7ToK5ReconciliationEvidenceBinding({
        ...input,
        sourceK5R4ProofStateReconciliation: tamperedReconciliation as unknown as typeof input.sourceK5R4ProofStateReconciliation,
      }),
      TypeError,
    )
  })
})

test("P7-R29 requires convergent R28 build lineage and rejects hostile top-level input shapes", async () => {
  await withCanonicalBridge(async ({ input }) => {
    const mismatchedR28Input = structuredClone(input.sourceP7FullExactHeadReviewCompletenessEvidenceBindingBuildInput) as MutableRecord
    mismatchedR28Input.sourceProviderAttemptTerminationEvidenceBinding.evidenceIdentity = "0".repeat(64)
    await assert.rejects(
      buildP7ToK5ReconciliationEvidenceBinding({
        ...input,
        sourceP7FullExactHeadReviewCompletenessEvidenceBindingBuildInput:
          mismatchedR28Input as unknown as typeof input.sourceP7FullExactHeadReviewCompletenessEvidenceBindingBuildInput,
      }),
      TypeError,
    )

    const proxyInput = new Proxy(input as unknown as MutableRecord, {})
    await assert.rejects(
      buildP7ToK5ReconciliationEvidenceBinding(proxyInput as unknown as P7ToK5ReconciliationEvidenceBindingBuildInput),
      /Proxy/,
    )

    const accessorInput = { ...input } as MutableRecord
    Object.defineProperty(accessorInput, "sourceK5R1ProofPackage", {
      enumerable: true,
      get: () => input.sourceK5R1ProofPackage,
    })
    await assert.rejects(
      buildP7ToK5ReconciliationEvidenceBinding(accessorInput as unknown as P7ToK5ReconciliationEvidenceBindingBuildInput),
      /enumerable data property/,
    )

    await assert.rejects(
      buildP7ToK5ReconciliationEvidenceBinding({ ...input, doneGateProof: true } as unknown as P7ToK5ReconciliationEvidenceBindingBuildInput),
      /must contain exactly/,
    )
  })
})

test("P7-R29 output validator and JSON schema reject tampering, unknown fields, and authority escalation", async () => {
  await withCanonicalBridge(async ({ input }) => {
    const output = await buildP7ToK5ReconciliationEvidenceBinding(input)

    const wrongIdentity = { ...output, evidenceIdentity: "0".repeat(64) }
    assert.equal(schemaAccepts(schema, wrongIdentity), true)
    await assert.rejects(
      validateP7ToK5ReconciliationEvidenceBinding(wrongIdentity, input),
      /canonical output preimage|exact canonical R29 recomputation/,
    )

    const wrongState = { ...output, state: "PROVEN_READY" }
    assert.equal(schemaAccepts(schema, wrongState), false)
    await assert.rejects(
      validateP7ToK5ReconciliationEvidenceBinding(wrongState, input),
      /state/,
    )

    const escalated = { ...output, doneGateProof: true }
    assert.equal(schemaAccepts(schema, escalated), false)
    await assert.rejects(
      validateP7ToK5ReconciliationEvidenceBinding(escalated, input),
      /must contain exactly/,
    )
  })
})
