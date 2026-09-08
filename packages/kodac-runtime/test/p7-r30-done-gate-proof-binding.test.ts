import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import test from "node:test"

import {
  P7_R30_DONE_GATE_PROOF_BINDING_VERSION,
  P7_R30_DONE_GATE_PROOF_BOUND_STATE,
  buildP7DoneGateProofBinding,
  validateP7DoneGateProofBinding,
  type P7DoneGateProofBindingBuildInput,
} from "../src/verification/p7-done-gate-proof-binding.ts"
import {
  buildP7ToK5ReconciliationEvidenceBinding,
  type P7ToK5ReconciliationEvidenceBindingBuildInput,
} from "../src/proof-review/p7-k5-reconciliation-evidence-binding.ts"
import {
  buildP7PostApplyVerificationReportBinding,
  type P7PostApplyVerificationReportBindingBuildInput,
} from "../src/remediation/p7-post-apply-verification-report-binding.ts"

type MutableRecord = Record<string, any>
type SchemaRecord = Record<string, any>
type R29Context = {
  input: P7ToK5ReconciliationEvidenceBindingBuildInput
  p7: {
    repositoryIdentity: string
    canonicalBase: string
    targetHead: string
  }
}
type R29FixtureModule = Readonly<{
  withCanonicalBridge<T>(run: (context: R29Context) => Promise<T>): Promise<T>
}>
type R6FixtureModule = Readonly<{
  fixtureInput(): P7PostApplyVerificationReportBindingBuildInput
}>

const schema = JSON.parse(
  readFileSync(new URL("../../../schema/p7-done-gate-proof-binding.schema.json", import.meta.url), "utf8"),
) as SchemaRecord
const sourceText = readFileSync(
  new URL("../src/verification/p7-done-gate-proof-binding.ts", import.meta.url),
  "utf8",
)

let r29FixturePromise: Promise<R29FixtureModule> | null = null
const r6FixturePromises = new Map<string, Promise<R6FixtureModule>>()

async function r29Fixture(): Promise<R29FixtureModule> {
  r29FixturePromise ??= (async () => {
    const sourceUrl = new URL("./p7-r29-p7-k5-reconciliation-evidence-binding.test.ts", import.meta.url)
    const source = readFileSync(sourceUrl, "utf8")
    const schemaMarker = "const schema = JSON.parse("
    const fixtureMarker = "let r28FixturePromise"
    const firstTestMarker = 'test("P7-R29 deterministically'
    const schemaIndex = source.indexOf(schemaMarker)
    const fixtureIndex = source.indexOf(fixtureMarker)
    const firstTestIndex = source.indexOf(firstTestMarker)
    assert.ok(schemaIndex > 0, "R29 fixture source must retain its schema marker")
    assert.ok(fixtureIndex > schemaIndex, "R29 fixture source must retain its fixture marker")
    assert.ok(firstTestIndex > fixtureIndex, "R29 fixture source must retain its first-test marker")

    const runtimeSrcBase = new URL("../src/", import.meta.url).href
    const r28Url = new URL("./p7-r28-full-exact-head-review-completeness-evidence-binding.test.ts", import.meta.url).href
    const r27Url = new URL("./p7-r27-provider-attempt-termination-evidence-binding.test.ts", import.meta.url).href
    let prefix = source.slice(0, schemaIndex)
    prefix = prefix.replaceAll('from "../src/', `from "${runtimeSrcBase}`)
    let suffix = source.slice(fixtureIndex, firstTestIndex)
    suffix = suffix.replace(
      'const sourceUrl = new URL("./p7-r28-full-exact-head-review-completeness-evidence-binding.test.ts", import.meta.url)',
      `const sourceUrl = new URL(${JSON.stringify(r28Url)})`,
    )
    suffix = suffix.replace(
      'const runtimeSrcBase = new URL("../src/", import.meta.url).href',
      `const runtimeSrcBase = ${JSON.stringify(runtimeSrcBase)}`,
    )
    suffix = suffix.replace(
      'const nestedR27Url = new URL("./p7-r27-provider-attempt-termination-evidence-binding.test.ts", import.meta.url).href',
      `const nestedR27Url = ${JSON.stringify(r27Url)}`,
    )

    const fixtureSource = `${prefix}${suffix}\nexport { withCanonicalBridge }\n`
    const root = await mkdtemp(join(tmpdir(), "kodac-p7-r30-r29-fixture-module-"))
    const path = join(root, "fixture.ts")
    await writeFile(path, fixtureSource, "utf8")
    try {
      return await import(pathToFileURL(path).href) as unknown as R29FixtureModule
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })()
  return r29FixturePromise
}

async function r6Fixture(canonicalBase: string, targetHead: string): Promise<R6FixtureModule> {
  const key = `${canonicalBase}:${targetHead}`
  let promise = r6FixturePromises.get(key)
  if (promise === undefined) {
    promise = (async () => {
      const sourceUrl = new URL("./p7-r6-post-apply-verification-report-binding.test.ts", import.meta.url)
      const source = readFileSync(sourceUrl, "utf8")
      const schemaIndex = source.indexOf("const schema = JSON.parse(")
      assert.ok(schemaIndex > 0, "R6 fixture source must retain its schema marker")
      const runtimeSrcBase = new URL("../src/", import.meta.url).href
      let fixtureSource = source.slice(0, schemaIndex)
      fixtureSource = fixtureSource.replaceAll('from "../src/', `from "${runtimeSrcBase}`)
      fixtureSource = fixtureSource.replace('const BASE = "a".repeat(40)', `const BASE = ${JSON.stringify(canonicalBase)}`)
      fixtureSource = fixtureSource.replace('const HEAD = "b".repeat(40)', `const HEAD = ${JSON.stringify(targetHead)}`)
      fixtureSource += "\nexport { fixtureInput }\n"

      const root = await mkdtemp(join(tmpdir(), "kodac-p7-r30-r6-fixture-module-"))
      const path = join(root, "fixture.ts")
      await writeFile(path, fixtureSource, "utf8")
      try {
        return await import(pathToFileURL(path).href) as unknown as R6FixtureModule
      } finally {
        await rm(root, { recursive: true, force: true })
      }
    })()
    r6FixturePromises.set(key, promise)
  }
  return promise
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
    if (typeof node.pattern === "string" && !new RegExp(node.pattern, "u").test(value)) return false
    return true
  }
  return true
}

function assertDeepFrozen(value: unknown): void {
  if (value === null || typeof value !== "object") return
  assert.equal(Object.isFrozen(value), true)
  for (const child of Object.values(value as Record<string, unknown>)) assertDeepFrozen(child)
}

async function withCanonicalR30<T>(
  run: (context: {
    input: P7DoneGateProofBindingBuildInput
    r29Input: P7ToK5ReconciliationEvidenceBindingBuildInput
    r6Input: P7PostApplyVerificationReportBindingBuildInput
  }) => Promise<T>,
): Promise<T> {
  const module = await r29Fixture()
  return module.withCanonicalBridge(async ({ input: r29Input, p7 }) => {
    const r29 = await buildP7ToK5ReconciliationEvidenceBinding(r29Input)
    const r6Module = await r6Fixture(p7.canonicalBase, p7.targetHead)
    const r6Input = r6Module.fixtureInput()
    const r6 = buildP7PostApplyVerificationReportBinding(r6Input)
    assert.equal(r6.repositoryIdentity, p7.repositoryIdentity)
    assert.equal(r6.canonicalBase, p7.canonicalBase)
    assert.equal(r6.targetHead, p7.targetHead)
    return run({
      input: {
        sourceP7ToK5ReconciliationEvidenceBinding: r29,
        sourceP7ToK5ReconciliationEvidenceBindingBuildInput: r29Input,
        sourceP7PostApplyVerificationReportBinding: r6,
        sourceP7PostApplyVerificationReportBindingBuildInput: r6Input,
      },
      r29Input,
      r6Input,
    })
  })
}

function mutateReport(
  input: P7PostApplyVerificationReportBindingBuildInput,
  mutate: (report: MutableRecord) => void,
): P7PostApplyVerificationReportBindingBuildInput {
  const report = structuredClone(input.verificationReport) as MutableRecord
  mutate(report)
  return { ...input, verificationReport: report }
}

test("P7-R30 deterministically binds the exact canonical R29/R6 lineage to the existing Done Gate PROVEN_READY verdict", async () => {
  await withCanonicalR30(async ({ input }) => {
    const first = await buildP7DoneGateProofBinding(input)
    const second = await buildP7DoneGateProofBinding(structuredClone(input))

    assert.deepEqual(second, first)
    assert.equal(first.version, P7_R30_DONE_GATE_PROOF_BINDING_VERSION)
    assert.equal(first.state, P7_R30_DONE_GATE_PROOF_BOUND_STATE)
    assert.equal(first.repositoryIdentity, input.sourceP7ToK5ReconciliationEvidenceBinding.repositoryIdentity)
    assert.equal(first.canonicalBase, input.sourceP7ToK5ReconciliationEvidenceBinding.canonicalBase)
    assert.equal(first.targetHead, input.sourceP7ToK5ReconciliationEvidenceBinding.targetHead)
    assert.equal(first.p7VerificationReportBindingIdentity, input.sourceP7PostApplyVerificationReportBinding.bindingIdentity)
    assert.equal(first.p7VerificationReportIdentity, input.sourceP7PostApplyVerificationReportBinding.verificationReportIdentity)
    assert.equal(first.p7ToK5ReconciliationEvidenceIdentity, input.sourceP7ToK5ReconciliationEvidenceBinding.evidenceIdentity)
    assert.equal(first.k5PackageIdentity, input.sourceP7ToK5ReconciliationEvidenceBinding.k5PackageIdentity)
    assert.equal(first.k5JudgmentIdentity, input.sourceP7ToK5ReconciliationEvidenceBinding.k5JudgmentIdentity)
    assert.equal(first.k5ReconciliationIdentity, input.sourceP7ToK5ReconciliationEvidenceBinding.k5ReconciliationIdentity)
    assert.equal(first.doneGateStatus, "PROVEN_READY")
    assert.ok(first.doneGateEvidence.length > 0)
    assert.equal(schemaAccepts(schema, first), true)
    assert.deepEqual(await validateP7DoneGateProofBinding(first, input), first)
    assertDeepFrozen(first)

    for (const forbidden of [
      "approval",
      "mergeAuthority",
      "releaseAuthority",
      "packagePublicationAuthority",
      "deploymentAuthority",
      "projectCompletion",
      "verificationExecution",
      "k2Execution",
    ]) assert.equal(Object.hasOwn(first, forbidden), false, forbidden)
  })
})

test("P7-R30 requires exact R29/R6 repository-base-head convergence and complete semantic predecessor lineage", async () => {
  await withCanonicalR30(async ({ input, r29Input, r6Input }) => {
    const foreignHead = input.targetHead === "d".repeat(40) ? "e".repeat(40) : "d".repeat(40)
    const foreignModule = await r6Fixture(input.canonicalBase, foreignHead)
    const foreignR6Input = foreignModule.fixtureInput()
    const foreignR6 = buildP7PostApplyVerificationReportBinding(foreignR6Input)
    await assert.rejects(
      buildP7DoneGateProofBinding({
        ...input,
        sourceP7PostApplyVerificationReportBinding: foreignR6,
        sourceP7PostApplyVerificationReportBindingBuildInput: foreignR6Input,
      }),
      /targetHead|converge/,
    )

    const tamperedR29Input = structuredClone(r29Input) as MutableRecord
    tamperedR29Input.sourceP7FullExactHeadReviewCompletenessEvidenceBindingBuildInput.sourceProviderAttemptTerminationEvidenceBinding.evidenceIdentity = "0".repeat(64)
    await assert.rejects(
      buildP7DoneGateProofBinding({
        ...input,
        sourceP7ToK5ReconciliationEvidenceBindingBuildInput:
          tamperedR29Input as unknown as P7ToK5ReconciliationEvidenceBindingBuildInput,
      }),
      TypeError,
    )

    const tamperedR6Input = structuredClone(r6Input) as MutableRecord
    tamperedR6Input.sourceVerificationPlanBinding.bindingIdentity = "0".repeat(64)
    await assert.rejects(
      buildP7DoneGateProofBinding({
        ...input,
        sourceP7PostApplyVerificationReportBindingBuildInput:
          tamperedR6Input as unknown as P7PostApplyVerificationReportBindingBuildInput,
      }),
      TypeError,
    )
  })
})

test("P7-R30 fails closed on missing, failed, unevidenced, and failing-command verification states", async () => {
  await withCanonicalR30(async ({ input, r6Input }) => {
    const missingRequiredInput = mutateReport(r6Input, (report) => {
      report.checks = report.checks.filter((check: MutableRecord) => check.id !== "workspace.integrity")
    })
    await assert.rejects(
      buildP7DoneGateProofBinding({
        ...input,
        sourceP7PostApplyVerificationReportBindingBuildInput: missingRequiredInput,
      }),
      /missing required base check|canonical rebuild/,
    )

    const failedRequiredInput = mutateReport(r6Input, (report) => {
      const check = report.checks.find((candidate: MutableRecord) => candidate.id === "workspace.integrity")
      check.status = "fail"
      report.passed = false
    })
    const failedRequired = buildP7PostApplyVerificationReportBinding(failedRequiredInput)
    await assert.rejects(
      buildP7DoneGateProofBinding({
        ...input,
        sourceP7PostApplyVerificationReportBinding: failedRequired,
        sourceP7PostApplyVerificationReportBindingBuildInput: failedRequiredInput,
      }),
      /verificationReportPassed|must be true/,
    )

    const noEvidenceInput = mutateReport(r6Input, (report) => {
      const check = report.checks.find((candidate: MutableRecord) => candidate.id === "workspace.integrity")
      check.evidence = []
    })
    const noEvidence = buildP7PostApplyVerificationReportBinding(noEvidenceInput)
    await assert.rejects(
      buildP7DoneGateProofBinding({
        ...input,
        sourceP7PostApplyVerificationReportBinding: noEvidence,
        sourceP7PostApplyVerificationReportBindingBuildInput: noEvidenceInput,
      }),
      /doneGate.status|PROVEN_READY/,
    )

    const failingCommandInput = mutateReport(r6Input, (report) => {
      const check = report.checks.find((candidate: MutableRecord) => candidate.id.startsWith("command."))
      check.status = "fail"
      report.passed = false
    })
    const failingCommand = buildP7PostApplyVerificationReportBinding(failingCommandInput)
    await assert.rejects(
      buildP7DoneGateProofBinding({
        ...input,
        sourceP7PostApplyVerificationReportBinding: failingCommand,
        sourceP7PostApplyVerificationReportBindingBuildInput: failingCommandInput,
      }),
      /verificationReportPassed|must be true/,
    )
  })
})

test("P7-R30 rejects hostile top-level inputs and output tampering while canonicalizing benign evidence order", async () => {
  await withCanonicalR30(async ({ input }) => {
    const output = await buildP7DoneGateProofBinding(input)

    const proxyInput = new Proxy(input as unknown as MutableRecord, {})
    await assert.rejects(
      buildP7DoneGateProofBinding(proxyInput as unknown as P7DoneGateProofBindingBuildInput),
      /Proxy/,
    )

    const accessorInput = { ...input } as MutableRecord
    Object.defineProperty(accessorInput, "sourceP7PostApplyVerificationReportBinding", {
      enumerable: true,
      get: () => input.sourceP7PostApplyVerificationReportBinding,
    })
    await assert.rejects(
      buildP7DoneGateProofBinding(accessorInput as unknown as P7DoneGateProofBindingBuildInput),
      /enumerable data property/,
    )

    await assert.rejects(
      buildP7DoneGateProofBinding({ ...input, projectCompletion: true } as unknown as P7DoneGateProofBindingBuildInput),
      /must contain exactly/,
    )

    const wrongIdentity = { ...output, proofIdentity: "0".repeat(64) }
    assert.equal(schemaAccepts(schema, wrongIdentity), true)
    await assert.rejects(validateP7DoneGateProofBinding(wrongIdentity, input), /canonical output preimage/)

    const escalated = { ...output, projectCompletion: true }
    assert.equal(schemaAccepts(schema, escalated), false)
    await assert.rejects(validateP7DoneGateProofBinding(escalated, input), /must contain exactly/)

    const wrongStatus = { ...output, doneGateStatus: "NOT_READY" }
    assert.equal(schemaAccepts(schema, wrongStatus), false)
    await assert.rejects(validateP7DoneGateProofBinding(wrongStatus, input), /PROVEN_READY/)

    const reversed = { ...output, doneGateEvidence: [...output.doneGateEvidence].reverse() }
    assert.equal(schemaAccepts(schema, reversed), true)
    assert.deepEqual(await validateP7DoneGateProofBinding(reversed, input), output)
  })
})

test("P7-R30 source uses the existing Done Gate evaluator and does not duplicate or broaden readiness authority", () => {
  assert.match(sourceText, /new DoneGate\(\)\.evaluate\(reportForDoneGate\(r6\)\)/)
  for (const duplicatedRequirement of [
    "agent.completed",
    "workspace.integrity",
    "git.diff",
    "evidence.receipts",
    "evidence.policy",
    "verification.commands",
  ]) assert.doesNotMatch(sourceText, new RegExp(duplicatedRequirement.replace(".", "\\.")))
  assert.doesNotMatch(sourceText, /child_process|execFile|spawn|fetch\(|http:|https:|writeFile|ExecutionGateway/)
  assert.doesNotMatch(sourceText, /mergeAuthority|releaseAuthority|projectCompletion/)
})
