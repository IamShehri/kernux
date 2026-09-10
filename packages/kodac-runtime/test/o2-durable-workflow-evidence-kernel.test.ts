import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  O2_DURABLE_WORKFLOW_EVIDENCE_KERNEL_VERSION,
  O2_LIMITS,
  createO2DurableWorkflowSuccessorTransitionEvidence,
  createO2DurableWorkflowTransitionEvidence,
  deriveO2LeaseIdentity,
  deriveO2WorkflowDefinitionIdentity,
  deriveO2WorkflowRunIdentity,
  validateO2DurableWorkflowSuccessorTransitionEvidence,
  validateO2DurableWorkflowTransitionEvidence,
  type O2AuthorityBindings,
  type O2DurableWorkflowTransitionInput,
  type O2WorkflowDefinitionInput,
  type O2WorkflowLeaseInput,
} from "../src/workflow/o2-durable-workflow-evidence-kernel.ts"

const H = (char: string) => char.repeat(64)
const G = (char: string) => char.repeat(40)
const DEF: O2WorkflowDefinitionInput = {
  workflowName: "review-workflow",
  schemaVersion: "v1",
  runtimeIdentity: H("1"),
  stepDefinitions: [
    { stepKey: "collect", stepType: "READ_EVIDENCE" },
    { stepKey: "review", stepType: "DERIVE_REVIEW" },
  ],
}
const RUN = {
  triggerEvidenceIdentity: H("2"),
  subjectRepositoryIdentity: H("3"),
  canonicalBase: G("a"),
  subjectRevisionIdentity: G("b"),
  policyIdentity: H("4"),
}

function authority(definitionIdentity = deriveO2WorkflowDefinitionIdentity(DEF), overrides: Partial<O2AuthorityBindings> = {}): O2AuthorityBindings {
  return {
    canonicalBase: RUN.canonicalBase,
    subjectRevisionIdentity: RUN.subjectRevisionIdentity,
    authorizationIdentity: H("5"),
    rulesetIdentity: H("6"),
    workflowDefinitionIdentity: definitionIdentity,
    skillManifestIdentity: null,
    reviewPolicyIdentity: H("7"),
    providerConfigurationIdentity: null,
    executionEnvironmentIdentity: null,
    dependencyToolchainIdentity: H("8"),
    relevantEvidenceFreshnessIdentity: H("9"),
    ...overrides,
  }
}

function lease(definition: O2WorkflowDefinitionInput = DEF, run = RUN, overrides: Partial<O2WorkflowLeaseInput> = {}): O2WorkflowLeaseInput {
  const workflowRunIdentity = deriveO2WorkflowRunIdentity(definition, run)
  const base = {
    workflowRunIdentity,
    subjectRepositoryIdentity: run.subjectRepositoryIdentity,
    subjectRevisionIdentity: run.subjectRevisionIdentity,
    ownerIdentity: H("c"),
    expectedOwnerIdentity: H("c"),
    leaseEpoch: 1,
    expectedLeaseEpoch: 1,
    leaseObservedAt: "2026-09-10T18:00:00.000Z",
    leaseExpiresAt: "2026-09-10T19:00:00.000Z",
    continuationObservedAt: "2026-09-10T18:30:00.000Z",
  }
  return { ...base, claimedLeaseIdentity: deriveO2LeaseIdentity(base), ...overrides }
}

function input(overrides: Partial<O2DurableWorkflowTransitionInput> = {}): O2DurableWorkflowTransitionInput {
  return {
    definition: DEF,
    run: RUN,
    attempt: { stepKey: "collect", attemptNumber: 1, retryClass: "INITIAL", priorAttemptIdentity: null },
    lease: lease(),
    previousState: "PENDING",
    requestedNextState: "ACTIVE",
    transitionKind: "START",
    priorTransitionIdentity: null,
    cancellation: { requested: false, sideEffectDisposition: "NOT_COMMITTED" },
    resume: null,
    inputEvidenceIdentities: [H("d"), H("e")],
    outputEvidenceIdentities: [H("f")],
    ...overrides,
  }
}

function activeInput(overrides: Partial<O2DurableWorkflowTransitionInput> = {}): O2DurableWorkflowTransitionInput {
  const priorAttemptIdentity = createO2DurableWorkflowTransitionEvidence(input()).attemptIdentity
  return input({
    previousState: "ACTIVE",
    requestedNextState: "ACTIVE",
    transitionKind: "RETRY",
    priorTransitionIdentity: H("a"),
    attempt: { stepKey: "collect", attemptNumber: 2, retryClass: "SAFE_REPLAY", priorAttemptIdentity },
    ...overrides,
  })
}

test("O2 deterministically derives definition, run, step, attempt and idempotency identities", () => {
  const first = createO2DurableWorkflowTransitionEvidence(input())
  const second = createO2DurableWorkflowTransitionEvidence(input({ definition: { ...DEF, stepDefinitions: [...DEF.stepDefinitions].reverse() } }))
  assert.equal(first.workflowDefinitionIdentity, second.workflowDefinitionIdentity)
  assert.equal(first.workflowRunIdentity, second.workflowRunIdentity)
  assert.equal(first.workflowStepIdentity, second.workflowStepIdentity)
  assert.equal(first.attemptIdentity, second.attemptIdentity)
  assert.equal(first.idempotencyIdentity, second.idempotencyIdentity)
  assert.match(first.transitionIdentity, /^[0-9a-f]{64}$/)
})

test("O2 produces the same run identity for the same semantic run input", () => {
  assert.equal(deriveO2WorkflowRunIdentity(DEF, RUN), deriveO2WorkflowRunIdentity({ ...DEF, stepDefinitions: [...DEF.stepDefinitions].reverse() }, { ...RUN }))
})

test("O2 accepts ordered valid state transitions", () => {
  const start = createO2DurableWorkflowTransitionEvidence(input())
  assert.equal(start.nextState, "ACTIVE")
  const success = createO2DurableWorkflowTransitionEvidence(activeInput({ requestedNextState: "SUCCEEDED", transitionKind: "SUCCEED" }))
  assert.equal(success.nextState, "SUCCEEDED")
})

test("O2 rejects impossible and terminal-state transitions", () => {
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ requestedNextState: "SUCCEEDED", transitionKind: "SUCCEED" })), /not allowlisted/)
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(activeInput({ previousState: "SUCCEEDED", requestedNextState: "ACTIVE", transitionKind: "RESUME", resume: { suspended: authority(), current: authority(), migration: null } })), /not allowlisted/)
})

test("O2 retry preserves logical step/idempotency identity and binds prior attempt lineage", () => {
  const first = createO2DurableWorkflowTransitionEvidence(input())
  const retry = createO2DurableWorkflowTransitionEvidence(activeInput())
  assert.equal(first.workflowStepIdentity, retry.workflowStepIdentity)
  assert.equal(first.idempotencyIdentity, retry.idempotencyIdentity)
  assert.notEqual(first.attemptIdentity, retry.attemptIdentity)
  assert.equal(retry.priorAttemptIdentity, first.attemptIdentity)
})

test("O2 retry binds the immediately preceding deterministic attempt identity", () => {
  const first = createO2DurableWorkflowTransitionEvidence(input())
  const second = createO2DurableWorkflowTransitionEvidence(activeInput())
  const thirdSource = activeInput({
    attempt: { stepKey: "collect", attemptNumber: 3, retryClass: "SAFE_REPLAY", priorAttemptIdentity: second.attemptIdentity },
  })
  const third = createO2DurableWorkflowTransitionEvidence(thirdSource)
  assert.notEqual(third.attemptIdentity, second.attemptIdentity)
  assert.equal(third.priorAttemptIdentity, second.attemptIdentity)
  assert.throws(
    () => createO2DurableWorkflowTransitionEvidence(activeInput({ attempt: { stepKey: "collect", attemptNumber: 3, retryClass: "SAFE_REPLAY", priorAttemptIdentity: first.attemptIdentity } })),
    /immediately preceding attempt/,
  )
})

test("O2 START and RETRY transition kinds enforce attempt-number semantics", () => {
  const first = createO2DurableWorkflowTransitionEvidence(input())
  assert.throws(
    () => createO2DurableWorkflowTransitionEvidence(input({ attempt: { stepKey: "collect", attemptNumber: 2, retryClass: "SAFE_REPLAY", priorAttemptIdentity: first.attemptIdentity } })),
    /START transition requires attemptNumber 1/,
  )
  assert.throws(
    () => createO2DurableWorkflowTransitionEvidence(activeInput({ attempt: { stepKey: "collect", attemptNumber: 1, retryClass: "INITIAL", priorAttemptIdentity: null } })),
    /RETRY transition requires attemptNumber greater than 1/,
  )
})

test("O2 SIDE_EFFECT_RETRY never grants continuation authority", () => {
  const priorAttemptIdentity = createO2DurableWorkflowTransitionEvidence(input()).attemptIdentity
  const evidence = createO2DurableWorkflowTransitionEvidence(activeInput({ attempt: { stepKey: "collect", attemptNumber: 2, retryClass: "SIDE_EFFECT_RETRY", priorAttemptIdentity } }))
  assert.equal(evidence.continuationDecision, "BLOCK")
  assert.equal(evidence.nextState, "ACTIVE")
  assert.match(evidence.errorIdentity ?? "", /^[0-9a-f]{64}$/)
})

test("O2 accepts a matching unexpired caller-materialized lease", () => {
  const evidence = createO2DurableWorkflowTransitionEvidence(input())
  assert.equal(evidence.leaseEpoch, 1)
  assert.match(evidence.leaseIdentity, /^[0-9a-f]{64}$/)
  assert.match(evidence.leaseObservationIdentity, /^[0-9a-f]{64}$/)
  assert.equal(evidence.continuationDecision, "ALLOW")
})

test("O2 lease observation identity binds the caller-supplied continuation observation", () => {
  const first = createO2DurableWorkflowTransitionEvidence(input())
  const second = createO2DurableWorkflowTransitionEvidence(input({ lease: lease(DEF, RUN, { continuationObservedAt: "2026-09-10T18:45:00.000Z" }) }))
  assert.equal(first.leaseIdentity, second.leaseIdentity)
  assert.notEqual(first.leaseObservationIdentity, second.leaseObservationIdentity)
  assert.notEqual(first.transitionIdentity, second.transitionIdentity)
})

test("O2 rejects lease owner mismatch", () => {
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ lease: lease(DEF, RUN, { expectedOwnerIdentity: H("d") }) })), /OWNER_IDENTITY_MISMATCH/)
})

test("O2 rejects lease subject mismatch", () => {
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ lease: lease(DEF, RUN, { subjectRepositoryIdentity: H("e") }) })), /LEASE_SUBJECT_MISMATCH/)
})

test("O2 rejects lease epoch mismatch", () => {
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ lease: lease(DEF, RUN, { expectedLeaseEpoch: 2 }) })), /LEASE_EPOCH_MISMATCH/)
})

test("O2 rejects expiry under the caller-supplied observation", () => {
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ lease: lease(DEF, RUN, { continuationObservedAt: "2026-09-10T20:00:00.000Z" }) })), /LEASE_EXPIRED/)
})

test("O2 enforces strict lease chronology including exact-expiry rejection", () => {
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ lease: lease(DEF, RUN, { continuationObservedAt: "2026-09-10T17:59:59.000Z" }) })), /must not precede/)
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ lease: lease(DEF, RUN, { continuationObservedAt: "2026-09-10T19:00:00.000Z" }) })), /LEASE_EXPIRED/)
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ lease: lease(DEF, RUN, { leaseObservedAt: "2026-09-10T19:00:00.000Z", continuationObservedAt: "2026-09-10T19:00:00.000Z" }) })), /strictly before expiry/)
})

test("O2 rejects claimed lease identity forgery", () => {
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ lease: lease(DEF, RUN, { claimedLeaseIdentity: H("0") }) })), /LEASE_IDENTITY_MISMATCH/)
})

test("O2 cancellation before side effect can complete", () => {
  const evidence = createO2DurableWorkflowTransitionEvidence(activeInput({ previousState: "CANCELLATION_REQUESTED", requestedNextState: "CANCELLED", transitionKind: "COMPLETE_CANCELLATION", cancellation: { requested: true, sideEffectDisposition: "NOT_COMMITTED" } }))
  assert.equal(evidence.nextState, "CANCELLED")
  assert.equal(evidence.cancellationDisposition, "CANCEL_ALLOWED")
  assert.equal(evidence.continuationDecision, "ALLOW")
})

test("O2 committed side effect cannot be relabeled undone", () => {
  const evidence = createO2DurableWorkflowTransitionEvidence(activeInput({ previousState: "CANCELLATION_REQUESTED", requestedNextState: "CANCELLED", transitionKind: "COMPLETE_CANCELLATION", cancellation: { requested: true, sideEffectDisposition: "COMMITTED" } }))
  assert.equal(evidence.nextState, "CANCELLATION_REQUESTED")
  assert.equal(evidence.cancellationDisposition, "COMMITTED_NO_UNDO")
  assert.equal(evidence.continuationDecision, "BLOCK")
})

test("O2 unknown side-effect result blocks cancellation completion", () => {
  const evidence = createO2DurableWorkflowTransitionEvidence(activeInput({ previousState: "CANCELLATION_REQUESTED", requestedNextState: "CANCELLED", transitionKind: "COMPLETE_CANCELLATION", cancellation: { requested: true, sideEffectDisposition: "UNKNOWN" } }))
  assert.equal(evidence.nextState, "CANCELLATION_REQUESTED")
  assert.equal(evidence.cancellationDisposition, "UNKNOWN_BLOCKED")
  assert.equal(evidence.continuationDecision, "BLOCK")
})

test("O2 resume with unchanged authority bindings is eligible", () => {
  const evidence = createO2DurableWorkflowTransitionEvidence(activeInput({ transitionKind: "RESUME", resume: { suspended: authority(), current: authority(), migration: null } }))
  assert.equal(evidence.resumeDecision, "ELIGIBLE")
  assert.match(evidence.resumeBindingIdentity ?? "", /^[0-9a-f]{64}$/)
  assert.equal(evidence.definitionDriftDecision, "UNCHANGED")
  assert.equal(evidence.continuationDecision, "ALLOW")
})



test("O2 resume identity binds the exact authority observations even when both sides still match", () => {
  const first = createO2DurableWorkflowTransitionEvidence(activeInput({ transitionKind: "RESUME", resume: { suspended: authority(), current: authority(), migration: null } }))
  const changed = authority(undefined, { rulesetIdentity: H("0") })
  const second = createO2DurableWorkflowTransitionEvidence(activeInput({ transitionKind: "RESUME", resume: { suspended: changed, current: changed, migration: null } }))
  assert.equal(first.resumeDecision, "ELIGIBLE")
  assert.equal(second.resumeDecision, "ELIGIBLE")
  assert.notEqual(first.resumeBindingIdentity, second.resumeBindingIdentity)
  assert.notEqual(first.transitionIdentity, second.transitionIdentity)
})

test("O2 stale resume after non-definition authority drift blocks", () => {
  const evidence = createO2DurableWorkflowTransitionEvidence(activeInput({ transitionKind: "RESUME", resume: { suspended: authority(undefined, { rulesetIdentity: H("0") }), current: authority(), migration: null } }))
  assert.equal(evidence.resumeDecision, "STALE")
  assert.equal(evidence.nextState, "STALE")
  assert.equal(evidence.continuationDecision, "BLOCK")
})

test("O2 definition drift without migration becomes MIGRATION_REQUIRED", () => {
  const evidence = createO2DurableWorkflowTransitionEvidence(activeInput({ transitionKind: "RESUME", resume: { suspended: authority(H("0")), current: authority(), migration: null } }))
  assert.equal(evidence.resumeDecision, "MIGRATION_REQUIRED")
  assert.equal(evidence.definitionDriftDecision, "MIGRATION_REQUIRED")
  assert.equal(evidence.nextState, "MIGRATION_REQUIRED")
})

test("O2 MIGRATION_REQUIRED state cannot return ACTIVE without exact migration evidence", () => {
  assert.throws(
    () => createO2DurableWorkflowTransitionEvidence(activeInput({
      previousState: "MIGRATION_REQUIRED",
      transitionKind: "RESUME",
      resume: { suspended: authority(), current: authority(), migration: null },
    })),
    /MIGRATION_REQUIRED state may resume only with exact admitted migration evidence/,
  )
})

test("O2 exact admitted migration binds old/new definition and enables only definition-drift continuation", () => {
  const oldDefinition = H("0")
  const currentDefinition = deriveO2WorkflowDefinitionIdentity(DEF)
  const migration = {
    fromWorkflowDefinitionIdentity: oldDefinition,
    toWorkflowDefinitionIdentity: currentDefinition,
    subjectRepositoryIdentity: RUN.subjectRepositoryIdentity,
    subjectRevisionIdentity: RUN.subjectRevisionIdentity,
    migrationPolicyIdentity: H("e"),
    migrationEvidenceIdentity: H("f"),
  }
  const evidence = createO2DurableWorkflowTransitionEvidence(activeInput({ previousState: "MIGRATION_REQUIRED", transitionKind: "RESUME", resume: { suspended: authority(oldDefinition), current: authority(), migration } }))
  assert.equal(evidence.resumeDecision, "ELIGIBLE")
  assert.equal(evidence.definitionDriftDecision, "MIGRATED")
  assert.match(evidence.migrationIdentity ?? "", /^[0-9a-f]{64}$/)
  assert.equal(evidence.continuationDecision, "ALLOW")
})

test("O2 migration cannot waive independent authority drift", () => {
  const oldDefinition = H("0")
  const currentDefinition = deriveO2WorkflowDefinitionIdentity(DEF)
  const migration = { fromWorkflowDefinitionIdentity: oldDefinition, toWorkflowDefinitionIdentity: currentDefinition, subjectRepositoryIdentity: RUN.subjectRepositoryIdentity, subjectRevisionIdentity: RUN.subjectRevisionIdentity, migrationPolicyIdentity: H("e"), migrationEvidenceIdentity: H("f") }
  const evidence = createO2DurableWorkflowTransitionEvidence(activeInput({ transitionKind: "RESUME", resume: { suspended: authority(oldDefinition, { rulesetIdentity: H("0") }), current: authority(), migration } }))
  assert.equal(evidence.resumeDecision, "STALE")
  assert.equal(evidence.definitionDriftDecision, "MIGRATED")
  assert.match(evidence.migrationIdentity ?? "", /^[0-9a-f]{64}$/)
  assert.equal(evidence.continuationDecision, "BLOCK")
})

test("O2 rejects an inexact migration even when independent authority drift already blocks resume", () => {
  const oldDefinition = H("0")
  const currentDefinition = deriveO2WorkflowDefinitionIdentity(DEF)
  const migration = { fromWorkflowDefinitionIdentity: oldDefinition, toWorkflowDefinitionIdentity: currentDefinition, subjectRepositoryIdentity: H("f"), subjectRevisionIdentity: RUN.subjectRevisionIdentity, migrationPolicyIdentity: H("e"), migrationEvidenceIdentity: H("f") }
  assert.throws(
    () => createO2DurableWorkflowTransitionEvidence(activeInput({ transitionKind: "RESUME", resume: { suspended: authority(oldDefinition, { rulesetIdentity: H("0") }), current: authority(), migration } })),
    /does not exactly bind old\/new definition and subject/,
  )
})

test("O2 successor reconstruction validates and binds the exact previous serialized transition", () => {
  const previousSource = input()
  const previous = createO2DurableWorkflowTransitionEvidence(previousSource)
  const nextSource = activeInput({ priorTransitionIdentity: previous.transitionIdentity })
  const first = createO2DurableWorkflowSuccessorTransitionEvidence(JSON.parse(JSON.stringify(previous)), previousSource, nextSource)
  const second = createO2DurableWorkflowSuccessorTransitionEvidence(JSON.parse(JSON.stringify(previous)), previousSource, nextSource)
  assert.deepEqual(first, second)
  assert.equal(first.previousState, previous.nextState)
  assert.equal(first.priorTransitionIdentity, previous.transitionIdentity)
  assert.deepEqual(validateO2DurableWorkflowSuccessorTransitionEvidence(first, nextSource, previous, previousSource), first)
  assert.throws(() => createO2DurableWorkflowSuccessorTransitionEvidence({ ...previous, transitionIdentity: H("0") }, previousSource, nextSource), /independently rederived/)
  assert.throws(() => createO2DurableWorkflowSuccessorTransitionEvidence(previous, previousSource, activeInput({ priorTransitionIdentity: H("0") })), /does not bind validated previous transition/)
  assert.throws(() => validateO2DurableWorkflowSuccessorTransitionEvidence({ ...first, priorTransitionIdentity: H("0") }, nextSource, previous, previousSource), /independently rederived/)
})

test("O2 non-resume successor cannot switch workflow run identity", () => {
  const previousSource = input()
  const previous = createO2DurableWorkflowTransitionEvidence(previousSource)
  const changedRun = { ...RUN, triggerEvidenceIdentity: H("0") }
  const nextSource = activeInput({
    run: changedRun,
    lease: lease(DEF, changedRun),
    attempt: { stepKey: "collect", attemptNumber: 1, retryClass: "INITIAL", priorAttemptIdentity: null },
    requestedNextState: "SUCCEEDED",
    transitionKind: "SUCCEED",
    priorTransitionIdentity: previous.transitionIdentity,
  })
  assert.throws(
    () => createO2DurableWorkflowSuccessorTransitionEvidence(previous, previousSource, nextSource),
    /non-resume successor must preserve workflowRunIdentity/,
  )
})

test("O2 validator rejects derived-field and transition-identity forgery", () => {
  const source = input()
  const evidence = createO2DurableWorkflowTransitionEvidence(source)
  assert.throws(() => validateO2DurableWorkflowTransitionEvidence({ ...evidence, workflowRunIdentity: H("0") }, source), /independently rederived/)
  assert.throws(() => validateO2DurableWorkflowTransitionEvidence({ ...evidence, transitionIdentity: H("0") }, source), /independently rederived/)
})



test("O2 serialized validator rejects hostile nested arrays before caller traps execute", () => {
  const source = input()
  const evidence = createO2DurableWorkflowTransitionEvidence(source)
  const hostile = new Proxy([H("d")], { get() { throw new Error("proxy trap executed") } })
  assert.throws(() => validateO2DurableWorkflowTransitionEvidence({ ...evidence, inputEvidenceIdentities: hostile }, source), /non-proxy array/)
})

test("O2 serialized validator rejects noncanonical evidence-array ordering", () => {
  const source = input()
  const evidence = createO2DurableWorkflowTransitionEvidence(source)
  assert.throws(() => validateO2DurableWorkflowTransitionEvidence({ ...evidence, inputEvidenceIdentities: [...evidence.inputEvidenceIdentities].reverse() }, source), /canonical order/)
})

test("O2 rejects non-neutral side-effect disposition outside cancellation transitions", () => {
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ cancellation: { requested: false, sideEffectDisposition: "COMMITTED" } })), /neutral NOT_COMMITTED/)
})

test("O2 canonicalizes set-like evidence arrays and rejects duplicates", () => {
  const left = createO2DurableWorkflowTransitionEvidence(input({ inputEvidenceIdentities: [H("e"), H("d")] }))
  const right = createO2DurableWorkflowTransitionEvidence(input({ inputEvidenceIdentities: [H("d"), H("e")] }))
  assert.equal(left.transitionIdentity, right.transitionIdentity)
  assert.deepEqual(left.inputEvidenceIdentities, [H("d"), H("e")])
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ inputEvidenceIdentities: [H("d"), H("d")] })), /duplicates/)
})

test("O2 rejects Proxy structured inputs before semantic access", () => {
  const source = input()
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(new Proxy(source, {}) as O2DurableWorkflowTransitionInput), /non-proxy plain object/)
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ definition: new Proxy(DEF, {}) })), /non-proxy plain object/)
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ inputEvidenceIdentities: new Proxy([], {}) })), /non-proxy array/)
})

test("O2 rejects accessors, symbol keys and non-enumerable semantic fields", () => {
  const source = { ...input() } as Record<string | symbol, unknown>
  Object.defineProperty(source, "previousState", { enumerable: true, get() { throw new Error("getter executed") } })
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(source as unknown as O2DurableWorkflowTransitionInput), /data property/)
  const symbol = { ...input() } as Record<string | symbol, unknown>
  symbol[Symbol("hostile")] = true
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(symbol as unknown as O2DurableWorkflowTransitionInput), /symbol properties/)
  const hidden = { ...input() } as Record<string, unknown>
  Object.defineProperty(hidden, "hidden", { value: true, enumerable: false })
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(hidden as unknown as O2DurableWorkflowTransitionInput), /data property/)
})

test("O2 rejects custom prototypes, sparse arrays and array extra properties", () => {
  const custom = Object.assign(Object.create({ hostile: true }), DEF)
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ definition: custom })), /plain-object prototype/)
  const sparse = new Array(2) as string[]
  sparse[1] = H("d")
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ inputEvidenceIdentities: sparse })), /holes|data property/)
  const extra = [H("d")] as string[] & { hostile?: boolean }
  extra.hostile = true
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ inputEvidenceIdentities: extra })), /unsupported properties/)
})

test("O2 rejects undefined, unpaired Unicode and unknown enum values", () => {
  const bad = { ...DEF, workflowName: "bad\ud800" }
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ definition: bad })), /Unicode scalar values/)
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ previousState: "UNKNOWN" as never })), /unsupported/)
  const source = { ...input(), resume: undefined } as unknown as O2DurableWorkflowTransitionInput
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(source), /defined data property/)
})

test("O2 enforces step, attempt, evidence and text bounds", () => {
  const tooManySteps = Array.from({ length: O2_LIMITS.maxStepDefinitions + 1 }, (_, i) => ({ stepKey: `s${i}`, stepType: "X" }))
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ definition: { ...DEF, stepDefinitions: tooManySteps } })), /item bound/)
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(activeInput({ attempt: { stepKey: "collect", attemptNumber: O2_LIMITS.maxAttemptsPerStep + 1, retryClass: "SAFE_REPLAY", priorAttemptIdentity: H("b") } })), /positive bounded/)
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ inputEvidenceIdentities: Array.from({ length: O2_LIMITS.maxInputEvidenceIdentities + 1 }, (_, i) => i.toString(16).padStart(64, "0")) })), /item bound/)
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ definition: { ...DEF, workflowName: "x".repeat(O2_LIMITS.maxTextBytesPerBoundedField + 1) } })), /bounded non-empty text/)
})

test("O2 rejects malformed attempt lineage", () => {
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ attempt: { stepKey: "collect", attemptNumber: 1, retryClass: "SAFE_REPLAY", priorAttemptIdentity: null } })), /attempt 1/)
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(activeInput({ attempt: { stepKey: "collect", attemptNumber: 2, retryClass: "INITIAL", priorAttemptIdentity: H("b") } })), /retry attempt/)
})

test("O2 rejects malformed lease timestamps and does not claim external-clock authenticity", () => {
  assert.throws(() => createO2DurableWorkflowTransitionEvidence(input({ lease: lease(DEF, RUN, { leaseObservedAt: "2026-09-10T18:00:00Z" }) })), /canonical RFC3339/)
})

test("O2 positive serialized evidence is frozen and detached from caller arrays", () => {
  const refs = [H("d")]
  const evidence = createO2DurableWorkflowTransitionEvidence(input({ inputEvidenceIdentities: refs }))
  refs[0] = H("e")
  assert.deepEqual(evidence.inputEvidenceIdentities, [H("d")])
  assert.ok(Object.isFrozen(evidence))
  assert.ok(Object.isFrozen(evidence.inputEvidenceIdentities))
})

test("O2 JSON Schema mirrors the exact positive serialized surface", () => {
  const schema = JSON.parse(readFileSync(new URL("../../../schema/o2-durable-workflow-evidence-kernel.schema.json", import.meta.url), "utf8")) as { additionalProperties: boolean; required: string[]; properties: Record<string, unknown> }
  const evidence = createO2DurableWorkflowTransitionEvidence(input())
  assert.equal(schema.additionalProperties, false)
  assert.deepEqual([...schema.required].sort(), Object.keys(evidence).sort())
  assert.deepEqual(Object.keys(schema.properties).sort(), Object.keys(evidence).sort())
  assert.deepEqual(schema.properties.version, { const: O2_DURABLE_WORKFLOW_EVIDENCE_KERNEL_VERSION })
})

test("O2 source exposes no persistence, network, process, provider, sandbox or K2 side-effect import surface", () => {
  const source = readFileSync(new URL("../src/workflow/o2-durable-workflow-evidence-kernel.ts", import.meta.url), "utf8")
  for (const forbidden of ["node:fs", "node:child_process", "node:http", "node:https", "node:net", "node:dgram", "node:worker_threads", "process.env", "ExecutionGateway", "from \"../model/", "from \"../execution/", "from \"../trust/", "from \"../tools/", "from \"../evidence/store"] as const) {
    assert.equal(source.includes(forbidden), false, `forbidden O2 source surface: ${forbidden}`)
  }
  assert.match(source, /from "node:crypto"/)
  assert.match(source, /from "node:util"/)
})
