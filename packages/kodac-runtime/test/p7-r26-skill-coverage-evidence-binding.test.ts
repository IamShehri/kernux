import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  K4_R5_AGENT_SKILL_GOVERNANCE_CLAIM_EVIDENCE_VERSION,
  materializeAgentSkillGovernanceClaimEvidence,
  type AgentSkillGovernanceClaimEvidence,
} from "../src/compatibility/agent-skill-governance-claim-evidence.ts"
import {
  K4_R4_AGENT_SKILL_OBJECT_KIND,
  K4_R4_AGENT_SKILLS_STANDARD_PIN_IDENTITY,
  materializeAgentSkillPackageEvidence,
  type AgentSkillPackageEvidence,
  type AgentSkillPackageEvidenceInput,
} from "../src/compatibility/agent-skill-package-evidence.ts"
import {
  createExternalCapabilityBinding,
  type ExternalCapabilityBindingInput,
} from "../src/compatibility/contracts.ts"
import { CompatibilityBindingRegistry } from "../src/compatibility/registry.ts"
import { createExtensionDescriptor, type ExtensionDescriptor } from "../src/extensions/contracts.ts"
import { ExtensionDescriptorRegistry } from "../src/extensions/registry.ts"
import {
  buildP7ReviewCoverageUniverseEvidenceBinding,
  type P7ReviewCoveragePathDescriptor,
  type P7ReviewCoverageUniverseEvidenceBindingBuildInput,
} from "../src/remediation/p7-review-coverage-universe-evidence-binding.ts"
import {
  buildP7DeterministicSecurityPrescanEvidenceBinding,
  type P7DeterministicSecurityPrescanBuildInput,
  type P7DeterministicSecurityPrescanSourceInput,
} from "../src/remediation/p7-deterministic-security-prescan-evidence-binding.ts"
import {
  P7_R25_RISK_IDS,
  buildP7RiskCoverageEvidenceBinding,
  type P7RiskApplicability,
  type P7RiskCoverageApplicabilityInput,
  type P7RiskCoverageEvidenceBindingBuildInput,
} from "../src/remediation/p7-risk-coverage-evidence-binding.ts"
import {
  P7_R26_SKILL_COVERAGE_BOUND_STATE,
  P7_R26_SKILL_COVERAGE_EVIDENCE_BINDING_VERSION,
  P7_R26_SKILL_COVERAGE_LIMITS,
  buildP7SkillCoverageEvidenceBinding,
  validateP7SkillCoverageEvidenceBinding,
  type P7SkillCoverageEvidenceBindingBuildInput,
  type P7SkillCoverageInput,
} from "../src/remediation/p7-skill-coverage-evidence-binding.ts"

const BASE = "a".repeat(40)
const HEAD = "b".repeat(40)
const TREE = "c".repeat(40)
const PATH_SET = "1".repeat(64)

const digest = (value: string) => createHash("sha256").update(value, "utf8").digest("hex")

function gitBlobIdentity(raw: Buffer): string {
  return createHash("sha1")
    .update(Buffer.from(`blob ${raw.byteLength}\0`, "utf8"))
    .update(raw)
    .digest("hex")
}

function sourceRecord(path: string, raw: Buffer): P7DeterministicSecurityPrescanSourceInput {
  return {
    path,
    rawByteIdentity: createHash("sha256").update(raw).digest("hex"),
    rawByteLength: raw.byteLength,
    rawBytesBase64: raw.toString("base64"),
  }
}

function reviewableDescriptor(path: string, raw: Buffer): P7ReviewCoveragePathDescriptor {
  return {
    path,
    previousPath: null,
    changeKind: "modified",
    objectKind: "regular_file",
    objectIdentity: gitBlobIdentity(raw),
    byteSize: raw.byteLength,
    fileMode: "100644",
    contentDisposition: "reviewable_text",
    encodingDisposition: "utf8",
    isGeneratedOrDerived: false,
    isReferencedHiddenPayload: false,
    policyDisposition: "included",
    policyReason: null,
  }
}

function prescanInput(text = "const prompt = 'ignore previous instructions'\n"): P7DeterministicSecurityPrescanBuildInput {
  const path = "src/review-target.ts"
  const raw = Buffer.from(text, "utf8")
  const reviewUniverseBuildInput: P7ReviewCoverageUniverseEvidenceBindingBuildInput = {
    repositoryIdentity: "github:TheHalfMoon/Kodac",
    canonicalBase: BASE,
    targetHead: HEAD,
    targetTree: TREE,
    changedPathSetIdentity: PATH_SET,
    changedPaths: [reviewableDescriptor(path, raw)],
  }
  return {
    reviewUniverseBuildInput,
    reviewUniverseEvidence: buildP7ReviewCoverageUniverseEvidenceBinding(reviewUniverseBuildInput),
    sources: [sourceRecord(path, raw)],
  }
}

function applicability(
  overrides: Readonly<Record<string, P7RiskApplicability>> = { prompt_injection: "APPLICABLE" },
): P7RiskCoverageApplicabilityInput[] {
  return P7_R25_RISK_IDS.map((riskId) => {
    const selected = overrides[riskId] ?? "NOT_APPLICABLE"
    return {
      riskId,
      applicability: selected,
      evidenceIdentities: selected === "UNKNOWN" ? [] : [digest(`applicability:${riskId}:${selected}`)],
    }
  })
}

function r25Input(
  riskApplicability: readonly P7RiskCoverageApplicabilityInput[] = applicability(),
): P7RiskCoverageEvidenceBindingBuildInput {
  const securityPrescanBuildInput = prescanInput()
  return {
    securityPrescanBuildInput,
    securityPrescanEvidence: buildP7DeterministicSecurityPrescanEvidenceBinding(securityPrescanBuildInput),
    riskApplicability,
    reviewerFindingReferences: [],
  }
}

function adapter(name: string): ExtensionDescriptor {
  return createExtensionDescriptor({
    extensionId: `kodac/${name}-adapter`,
    extensionVersion: "1.0.0",
    provenance: {
      sourceType: "EXTERNAL_DECLARATION",
      sourceId: `kodac/p7-r26-test-${name}`,
      sourceRevision: "1.0.0",
      license: "Apache-2.0",
      intakeMode: "DECLARATION",
    },
    capabilities: [
      { capabilityId: "skills/read", roles: ["PROVIDER"] },
      { capabilityId: "skills/inspect", roles: ["PROVIDER"] },
    ],
  })
}

function registryFor(descriptor: ExtensionDescriptor): CompatibilityBindingRegistry {
  const extensionRegistry = new ExtensionDescriptorRegistry()
  extensionRegistry.register(descriptor)
  return new CompatibilityBindingRegistry(extensionRegistry)
}

function packageInput(descriptor: ExtensionDescriptor, name: string): AgentSkillPackageEvidenceInput {
  return {
    standardPinIdentity: K4_R4_AGENT_SKILLS_STANDARD_PIN_IDENTITY,
    extensionId: descriptor.extensionId,
    descriptorIdentity: descriptor.descriptorIdentity,
    directoryName: name,
    name,
    description: `Review ${name} evidence without executing the skill.`,
    license: "Apache-2.0",
    compatibility: "Caller-materialized evidence only.",
    metadataEntries: [{ key: "x-kodac-category", value: "review" }],
    allowedToolsEvidence: { sha256: digest(`tools:${name}`), byteLength: 10 },
    instructionBodyEvidence: { sha256: digest(`instructions:${name}`), byteLength: 20 },
    skillFileEvidence: { sha256: digest(`skill-file:${name}`), byteLength: 30 },
    packageManifestEvidence: { sha256: digest(`manifest:${name}`), fileCount: 3, totalByteLength: 4_096 },
    sourceProvenanceIdentity: digest(`provenance:${name}`),
  }
}

function bindingInput(
  descriptor: ExtensionDescriptor,
  name: string,
  externalMetadataSha256: string,
): ExternalCapabilityBindingInput {
  return {
    standardPinIdentity: K4_R4_AGENT_SKILLS_STANDARD_PIN_IDENTITY,
    objectKind: K4_R4_AGENT_SKILL_OBJECT_KIND,
    externalName: name,
    externalMetadataSha256,
    extensionId: descriptor.extensionId,
    descriptorIdentity: descriptor.descriptorIdentity,
    disposition: "COMPOSITE",
    normalizedCapabilityIds: ["skills/inspect", "skills/read"],
  }
}

function packageEvidence(
  name: string,
  state: AgentSkillPackageEvidence["bindingState"] = "CURRENT",
): AgentSkillPackageEvidence {
  const descriptor = adapter(name)
  const registry = registryFor(descriptor)
  const input = packageInput(descriptor, name)
  const unbound = materializeAgentSkillPackageEvidence(input, registry)
  if (state === "CURRENT") {
    registry.register(createExternalCapabilityBinding(bindingInput(descriptor, name, unbound.externalMetadataSha256)))
  } else if (state === "STALE") {
    registry.register(createExternalCapabilityBinding(bindingInput(descriptor, name, "f".repeat(64))))
  }
  return materializeAgentSkillPackageEvidence(input, registry)
}

function governanceEvidence(pkg: AgentSkillPackageEvidence, name: string): AgentSkillGovernanceClaimEvidence {
  return materializeAgentSkillGovernanceClaimEvidence({
    version: K4_R5_AGENT_SKILL_GOVERNANCE_CLAIM_EVIDENCE_VERSION,
    packageEvidence: pkg,
    packageVersionEvidence: { sha256: digest(`version:${name}`), byteLength: 5 },
    governanceRevisionIdentity: digest(`governance:${name}`),
    requestedCapabilityClaims: [{ capabilityId: "skills/read" }],
    requirementClaims: [],
    compatibilityClaimEvidence: null,
    evaluationClaims: [{
      evaluatorIdentity: digest(`evaluator:${name}`),
      artifactIdentity: digest(`artifact:${name}`),
      artifactByteLength: 42,
      assertedOutcome: "INCONCLUSIVE",
    }],
  })
}

function skill(
  name: string,
  overrides: Partial<P7SkillCoverageInput> = {},
  bindingState: AgentSkillPackageEvidence["bindingState"] = "CURRENT",
): P7SkillCoverageInput {
  const pkg = packageEvidence(name, bindingState)
  const governance = governanceEvidence(pkg, name)
  return {
    packageEvidence: pkg,
    governanceEvidence: governance,
    admission: "ADMITTED",
    admissionEvidenceIdentities: [digest(`admission:${name}`)],
    relevance: "RELEVANT",
    relevantRiskIds: ["prompt_injection"],
    relevanceEvidenceIdentities: [digest(`relevance:${name}`)],
    disposition: "LOADED",
    dispositionEvidenceIdentities: [digest(`loaded:${name}`)],
    ...overrides,
  }
}

function input(
  skills: readonly P7SkillCoverageInput[] = [skill("review-security")],
  riskCoverageBuildInput: P7RiskCoverageEvidenceBindingBuildInput = r25Input(),
): P7SkillCoverageEvidenceBindingBuildInput {
  return {
    riskCoverageBuildInput,
    riskCoverageEvidence: buildP7RiskCoverageEvidenceBinding(riskCoverageBuildInput),
    skills,
  }
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function assertDeepFrozen(value: unknown): void {
  if (value === null || typeof value !== "object") return
  assert.equal(Object.isFrozen(value), true)
  for (const child of Object.values(value as Record<string, unknown>)) assertDeepFrozen(child)
}

test("P7-R26 deterministically binds exact R25 and K4 skill evidence lineage", () => {
  const buildInput = input()
  const first = buildP7SkillCoverageEvidenceBinding(buildInput)
  const second = buildP7SkillCoverageEvidenceBinding(clone(buildInput))

  assert.deepEqual(first, second)
  assert.equal(first.version, P7_R26_SKILL_COVERAGE_EVIDENCE_BINDING_VERSION)
  assert.equal(first.state, P7_R26_SKILL_COVERAGE_BOUND_STATE)
  assert.match(first.evidenceIdentity, /^[0-9a-f]{64}$/)
  assert.match(first.skillCoverageSourceSetIdentity, /^[0-9a-f]{64}$/)
  assert.match(first.coverageDebtIdentity, /^[0-9a-f]{64}$/)
  assert.equal(first.skillCoverageState, "ACCOUNTED_NO_COVERAGE_DEBT")
  assert.deepEqual(validateP7SkillCoverageEvidenceBinding(first, buildInput), first)
  assertDeepFrozen(first)
})

test("P7-R26 canonicalizes skill, evidence-identity, and relevant-risk ordering", () => {
  const alpha = skill("review-alpha", {
    relevantRiskIds: ["remote_execution", "prompt_injection"],
    admissionEvidenceIdentities: [digest("admission:z"), digest("admission:a")],
    relevanceEvidenceIdentities: [digest("relevance:z"), digest("relevance:a")],
    dispositionEvidenceIdentities: [digest("loaded:z"), digest("loaded:a")],
  })
  const beta = skill("review-beta", {
    disposition: "EXECUTED",
    dispositionEvidenceIdentities: [digest("executed:beta")],
  })
  const first = buildP7SkillCoverageEvidenceBinding(input([alpha, beta]))
  const secondInput = input([
    { ...clone(beta), admissionEvidenceIdentities: [...beta.admissionEvidenceIdentities].reverse() },
    {
      ...clone(alpha),
      relevantRiskIds: [...alpha.relevantRiskIds].reverse(),
      admissionEvidenceIdentities: [...alpha.admissionEvidenceIdentities].reverse(),
      relevanceEvidenceIdentities: [...alpha.relevanceEvidenceIdentities].reverse(),
      dispositionEvidenceIdentities: [...alpha.dispositionEvidenceIdentities].reverse(),
    },
  ])
  const second = buildP7SkillCoverageEvidenceBinding(secondInput)

  assert.deepEqual(first, second)
  assert.deepEqual(first.skillRecords.map((item) => item.skillIdentity), [...first.skillRecords.map((item) => item.skillIdentity)].sort())
  assert.deepEqual(first.skillRecords.find((item) => item.name === "review-alpha")?.relevantRiskIds, ["prompt_injection", "remote_execution"])
})

test("P7-R26 keeps loaded, executed, and unavailable accounting distinct", () => {
  const loaded = skill("review-loaded")
  const executed = skill("review-executed", {
    disposition: "EXECUTED",
    dispositionEvidenceIdentities: [digest("executed")],
  })
  const unavailable = skill("review-unavailable", {
    disposition: "UNAVAILABLE",
    dispositionEvidenceIdentities: [digest("unavailable")],
  })
  const output = buildP7SkillCoverageEvidenceBinding(input([loaded, executed, unavailable]))
  const byName = new Map(output.skillRecords.map((item) => [item.name, item.skillIdentity]))

  assert.deepEqual(output.loadedSkillSet, [byName.get("review-loaded")])
  assert.deepEqual(output.executedSkillSet, [byName.get("review-executed")])
  assert.deepEqual(output.unavailableSkillSet, [byName.get("review-unavailable")])
  assert.equal(output.loadedSkillSet.includes(byName.get("review-executed") ?? ""), false)
  assert.equal(output.skillCoverageState, "HAS_COVERAGE_DEBT")
})

test("P7-R26 keeps admission and relevance unknown/not-admitted states as explicit debt", () => {
  const notAdmitted = skill("review-not-admitted", {
    admission: "NOT_ADMITTED",
    admissionEvidenceIdentities: [digest("not-admitted")],
    relevance: "NOT_RELEVANT",
    relevantRiskIds: [],
    relevanceEvidenceIdentities: [digest("not-relevant")],
    disposition: "UNAVAILABLE",
    dispositionEvidenceIdentities: [digest("not-admitted-unavailable")],
  })
  const unknown = skill("review-unknown", {
    admission: "UNKNOWN",
    admissionEvidenceIdentities: [],
    relevance: "UNKNOWN",
    relevantRiskIds: [],
    relevanceEvidenceIdentities: [],
    disposition: "UNAVAILABLE",
    dispositionEvidenceIdentities: [digest("unknown-unavailable")],
  })
  const output = buildP7SkillCoverageEvidenceBinding(input([notAdmitted, unknown]))

  assert.equal(output.notAdmittedSkillSet.length, 1)
  assert.equal(output.unknownAdmissionSkillSet.length, 1)
  assert.equal(output.unknownRelevanceSkillSet.length, 1)
  assert.equal(output.unavailableSkillSet.length, 2)
  assert.equal(output.skillCoverageState, "HAS_COVERAGE_DEBT")
})

test("P7-R26 preserves R25 risk debt rather than relabeling clean skill accounting as completeness", () => {
  const riskInput = r25Input(applicability({
    prompt_injection: "APPLICABLE",
    semantic_logic_abuse: "UNKNOWN",
  }))
  const output = buildP7SkillCoverageEvidenceBinding(input([skill("review-risk-debt")], riskInput))

  assert.equal(output.riskCoverageState, "HAS_UNKNOWN_APPLICABILITY")
  assert.equal(output.skillCoverageState, "HAS_COVERAGE_DEBT")
})

test("P7-R26 rejects tampered R25 evidence and mismatched package/governance lineage", () => {
  const buildInput = input()
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding({
      ...buildInput,
      riskCoverageEvidence: { ...buildInput.riskCoverageEvidence, evidenceIdentity: "f".repeat(64) },
    }),
    /riskCoverageEvidence|P7-R25|canonical/,
  )

  const left = skill("review-left")
  const right = skill("review-right")
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding(input([{ ...left, governanceEvidence: right.governanceEvidence }])),
    /governance|package|derived fields|bind/,
  )
})

test("P7-R26 rejects positive admission/load/execution without CURRENT and explicit evidence", () => {
  const stale = skill("review-stale", {}, "STALE")
  assert.throws(() => buildP7SkillCoverageEvidenceBinding(input([stale])), /CURRENT package binding/)

  const base = skill("review-evidence")
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding(input([{ ...base, admissionEvidenceIdentities: [] }])),
    /ADMITTED requires/,
  )
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding(input([{ ...base, relevanceEvidenceIdentities: [] }])),
    /RELEVANT requires/,
  )
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding(input([{ ...base, dispositionEvidenceIdentities: [] }])),
    /LOADED requires/,
  )
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding(input([{
      ...base,
      admission: "UNKNOWN",
      admissionEvidenceIdentities: [],
    }])),
    /LOADED requires ADMITTED/,
  )
})

test("P7-R26 rejects unknown/duplicate risk mappings and duplicate evidence or skill identities", () => {
  const base = skill("review-duplicates")
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding(input([{ ...base, relevantRiskIds: ["unknown-risk"] }])),
    /canonical P7-R25 risk/,
  )
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding(input([{ ...base, relevantRiskIds: ["prompt_injection", "prompt_injection"] }])),
    /duplicate risk/,
  )
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding(input([{
      ...base,
      admissionEvidenceIdentities: [digest("same"), digest("same")],
    }])),
    /duplicate evidence identities/,
  )
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding(input([base, clone(base)])),
    /duplicate package evidence identity|duplicate governance evidence identity|duplicate skill identity/,
  )
})

test("P7-R26 rejects inconsistent relevance/disposition combinations fail-closed", () => {
  const base = skill("review-consistency")
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding(input([{
      ...base,
      relevance: "NOT_RELEVANT",
      relevanceEvidenceIdentities: [digest("not-relevant")],
    }])),
    /empty risk set/,
  )
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding(input([{
      ...base,
      relevance: "RELEVANT",
      relevantRiskIds: [],
    }])),
    /at least one canonical risk/,
  )
  assert.throws(
    () => buildP7SkillCoverageEvidenceBinding(input([{
      ...base,
      relevance: "UNKNOWN",
      relevantRiskIds: [],
      relevanceEvidenceIdentities: [],
      disposition: "EXECUTED",
      dispositionEvidenceIdentities: [digest("executed-without-relevance")],
    }])),
    /EXECUTED requires explicit RELEVANT/,
  )
})

test("P7-R26 rejects Proxy, accessor, symbol, sparse, cycle, and oversized hostile input without invoking getters", () => {
  const buildInput = input()
  let trapped = false
  const proxiedSkills = new Proxy(buildInput.skills as unknown as P7SkillCoverageInput[], {
    get() { trapped = true; throw new Error("proxy get") },
    ownKeys() { trapped = true; throw new Error("proxy ownKeys") },
    getOwnPropertyDescriptor() { trapped = true; throw new Error("proxy descriptor") },
    getPrototypeOf() { trapped = true; throw new Error("proxy prototype") },
  })
  assert.throws(() => buildP7SkillCoverageEvidenceBinding({ ...buildInput, skills: proxiedSkills }), /Proxy/)
  assert.equal(trapped, false)

  const accessorSkill = clone(buildInput.skills[0]!) as P7SkillCoverageInput
  Object.defineProperty(accessorSkill, "admission", { enumerable: true, get() { trapped = true; return "ADMITTED" } })
  assert.throws(() => buildP7SkillCoverageEvidenceBinding({ ...buildInput, skills: [accessorSkill] }), /data property/)
  assert.equal(trapped, false)

  const symbolSkill = clone(buildInput.skills[0]!) as P7SkillCoverageInput & Record<symbol, unknown>
  symbolSkill[Symbol("hidden")] = true
  assert.throws(() => buildP7SkillCoverageEvidenceBinding({ ...buildInput, skills: [symbolSkill] }), /symbol|unknown/)

  const sparse = new Array<P7SkillCoverageInput>(2)
  sparse[0] = clone(buildInput.skills[0]!)
  assert.throws(() => buildP7SkillCoverageEvidenceBinding({ ...buildInput, skills: sparse }), /sparse/)

  const cyclic = clone(buildInput) as P7SkillCoverageEvidenceBindingBuildInput & { cycle?: unknown }
  ;(cyclic as unknown as { cycle: unknown }).cycle = cyclic
  assert.throws(() => buildP7SkillCoverageEvidenceBinding(cyclic), /unknown|aliases or cycles/)

  const tooMany = Array.from({ length: P7_R26_SKILL_COVERAGE_LIMITS.maxSkills + 1 }, (_, index) => ({
    ...clone(buildInput.skills[0]!),
    admissionEvidenceIdentities: [digest(`admission:${index}`)],
  }))
  assert.throws(() => buildP7SkillCoverageEvidenceBinding({ ...buildInput, skills: tooMany }), /at most 256/)
})

test("P7-R26 output contains bounded identities only and never raw skill instructions/evaluation artifacts", () => {
  const output = buildP7SkillCoverageEvidenceBinding(input([skill("review-redacted")]))
  const serialized = JSON.stringify(output)

  assert.equal(serialized.includes("Review review-redacted evidence without executing the skill."), false)
  assert.equal(serialized.includes("Caller-materialized evidence only."), false)
  assert.equal(serialized.includes("instructions:review-redacted"), false)
  assert.equal(serialized.includes("artifact:review-redacted"), false)
  assert.equal(output.skillRecords[0]?.governanceTrustStatus, "UNASSESSED")
  assert.equal(output.skillRecords[0]?.governanceAuthorityState, "NONE")
})

test("P7-R26 schema is strict and production remains pure, synchronous, and data-only", () => {
  const schema = JSON.parse(
    readFileSync(new URL("../../../schema/p7-skill-coverage-evidence-binding.schema.json", import.meta.url), "utf8"),
  ) as Record<string, any>
  const production = readFileSync(
    new URL("../src/remediation/p7-skill-coverage-evidence-binding.ts", import.meta.url),
    "utf8",
  )

  assert.equal(schema.additionalProperties, false)
  assert.equal(schema.properties.version.const, P7_R26_SKILL_COVERAGE_EVIDENCE_BINDING_VERSION)
  assert.equal(schema.properties.state.const, P7_R26_SKILL_COVERAGE_BOUND_STATE)
  assert.equal(schema.$defs.sha256.pattern, "^[0-9a-f]{64}$")
  assert.equal(schema.$defs.skillRecord.additionalProperties, false)
  assert.deepEqual(schema.$defs.skillRecord.properties.governanceTrustStatus, { const: "UNASSESSED" })
  assert.deepEqual(schema.$defs.skillRecord.properties.governanceAuthorityState, { const: "NONE" })

  assert.equal(/node:(?:fs|child_process|http|https|http2|net|tls|dgram|worker_threads|os|path|vm)/.test(production), false)
  assert.equal(/\b(?:readFile|writeFile|fetch|setTimeout|setInterval|randomUUID|getRandomValues|eval)\s*\(/.test(production), false)
  assert.equal(/\bprocess\s*\.|\bDate\s*\(|\bDate\.now|\bMath\.random/.test(production), false)
  assert.equal(/\bExecutionGateway\b|\bTrustKernel\b|\.register\s*\(|\.dispose\s*\(/.test(production), false)
  assert.equal(/\bimport\s*\(/.test(production), false)
})
