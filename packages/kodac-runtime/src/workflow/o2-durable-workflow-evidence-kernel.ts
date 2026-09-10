import { createHash } from "node:crypto"
import { types } from "node:util"

export const O2_DURABLE_WORKFLOW_EVIDENCE_KERNEL_VERSION = "kodac-o2-durable-workflow-evidence-kernel-v1" as const
export const O2_LIMITS = Object.freeze({
  maxStepDefinitions: 64,
  maxAttemptsPerStep: 32,
  maxInputEvidenceIdentities: 128,
  maxOutputEvidenceIdentities: 128,
  maxAuthorityBindings: 16,
  maxTextBytesPerBoundedField: 1024,
})

export const O2_RETRY_CLASSES = Object.freeze(["INITIAL", "SAFE_REPLAY", "IDEMPOTENT_REREAD", "NEW_INTELLIGENCE_ATTEMPT", "SIDE_EFFECT_RETRY"] as const)
export const O2_RUN_STATES = Object.freeze(["PENDING", "ACTIVE", "CANCELLATION_REQUESTED", "CANCELLED", "SUCCEEDED", "FAILED", "STALE", "MIGRATION_REQUIRED"] as const)
export const O2_TRANSITION_KINDS = Object.freeze(["START", "RETRY", "REQUEST_CANCELLATION", "COMPLETE_CANCELLATION", "SUCCEED", "FAIL", "RESUME"] as const)

export type O2RetryClass = (typeof O2_RETRY_CLASSES)[number]
export type O2RunState = (typeof O2_RUN_STATES)[number]
export type O2TransitionKind = (typeof O2_TRANSITION_KINDS)[number]
export type O2SideEffectDisposition = "NOT_COMMITTED" | "COMMITTED" | "UNKNOWN"
export type O2CancellationDisposition = "NOT_REQUESTED" | "CANCEL_ALLOWED" | "COMMITTED_NO_UNDO" | "UNKNOWN_BLOCKED"
export type O2ResumeDecision = "NOT_APPLICABLE" | "ELIGIBLE" | "STALE" | "MIGRATION_REQUIRED"
export type O2DefinitionDriftDecision = "UNCHANGED" | "MIGRATION_REQUIRED" | "MIGRATED"
export type O2ContinuationDecision = "ALLOW" | "BLOCK"

export interface O2WorkflowStepDefinition {
  readonly stepKey: string
  readonly stepType: string
}

export interface O2WorkflowDefinitionInput {
  readonly workflowName: string
  readonly schemaVersion: string
  readonly runtimeIdentity: string
  readonly stepDefinitions: readonly O2WorkflowStepDefinition[]
}

export interface O2WorkflowRunInput {
  readonly triggerEvidenceIdentity: string
  readonly subjectRepositoryIdentity: string
  readonly canonicalBase: string
  readonly subjectRevisionIdentity: string
  readonly policyIdentity: string
}

export interface O2WorkflowAttemptInput {
  readonly stepKey: string
  readonly attemptNumber: number
  readonly retryClass: O2RetryClass
  readonly priorAttemptIdentity: string | null
}

export interface O2WorkflowLeaseInput {
  readonly workflowRunIdentity: string
  readonly subjectRepositoryIdentity: string
  readonly subjectRevisionIdentity: string
  readonly ownerIdentity: string
  readonly expectedOwnerIdentity: string
  readonly leaseEpoch: number
  readonly expectedLeaseEpoch: number
  readonly leaseObservedAt: string
  readonly leaseExpiresAt: string
  readonly continuationObservedAt: string
  readonly claimedLeaseIdentity: string
}

export interface O2AuthorityBindings {
  readonly canonicalBase: string
  readonly subjectRevisionIdentity: string
  readonly authorizationIdentity: string
  readonly rulesetIdentity: string
  readonly workflowDefinitionIdentity: string
  readonly skillManifestIdentity: string | null
  readonly reviewPolicyIdentity: string
  readonly providerConfigurationIdentity: string | null
  readonly executionEnvironmentIdentity: string | null
  readonly dependencyToolchainIdentity: string
  readonly relevantEvidenceFreshnessIdentity: string
}

export interface O2WorkflowMigrationInput {
  readonly fromWorkflowDefinitionIdentity: string
  readonly toWorkflowDefinitionIdentity: string
  readonly subjectRepositoryIdentity: string
  readonly subjectRevisionIdentity: string
  readonly migrationPolicyIdentity: string
  readonly migrationEvidenceIdentity: string
}

export interface O2ResumeInput {
  readonly suspended: O2AuthorityBindings
  readonly current: O2AuthorityBindings
  readonly migration: O2WorkflowMigrationInput | null
}

export interface O2CancellationInput {
  readonly requested: boolean
  readonly sideEffectDisposition: O2SideEffectDisposition
}

export interface O2DurableWorkflowTransitionInput {
  readonly definition: O2WorkflowDefinitionInput
  readonly run: O2WorkflowRunInput
  readonly attempt: O2WorkflowAttemptInput
  readonly lease: O2WorkflowLeaseInput
  readonly previousState: O2RunState
  readonly requestedNextState: O2RunState
  readonly transitionKind: O2TransitionKind
  readonly priorTransitionIdentity: string | null
  readonly cancellation: O2CancellationInput
  readonly resume: O2ResumeInput | null
  readonly inputEvidenceIdentities: readonly string[]
  readonly outputEvidenceIdentities: readonly string[]
}

export interface O2DurableWorkflowTransitionEvidence {
  readonly version: typeof O2_DURABLE_WORKFLOW_EVIDENCE_KERNEL_VERSION
  readonly workflowDefinitionIdentity: string
  readonly workflowRunIdentity: string
  readonly workflowStepIdentity: string
  readonly stepKey: string
  readonly stepType: string
  readonly attemptNumber: number
  readonly attemptIdentity: string
  readonly idempotencyIdentity: string
  readonly retryClass: O2RetryClass
  readonly priorAttemptIdentity: string | null
  readonly subjectRepositoryIdentity: string
  readonly canonicalBase: string
  readonly subjectRevisionIdentity: string
  readonly policyIdentity: string
  readonly triggerEvidenceIdentity: string
  readonly leaseIdentity: string
  readonly leaseObservationIdentity: string
  readonly leaseEpoch: number
  readonly previousState: O2RunState
  readonly nextState: O2RunState
  readonly transitionKind: O2TransitionKind
  readonly priorTransitionIdentity: string | null
  readonly cancellationDisposition: O2CancellationDisposition
  readonly resumeDecision: O2ResumeDecision
  readonly resumeBindingIdentity: string | null
  readonly definitionDriftDecision: O2DefinitionDriftDecision
  readonly migrationIdentity: string | null
  readonly continuationDecision: O2ContinuationDecision
  readonly inputEvidenceIdentities: readonly string[]
  readonly outputEvidenceIdentities: readonly string[]
  readonly errorIdentity: string | null
  readonly transitionIdentity: string
}

type UnknownRecord = Record<string, unknown>
const SHA256_RE = /^[0-9a-f]{64}$/
const SHA1_RE = /^[0-9a-f]{40}$/
const RETRY_CLASSES = new Set<string>(O2_RETRY_CLASSES)
const RUN_STATES = new Set<string>(O2_RUN_STATES)
const TRANSITION_KINDS = new Set<string>(O2_TRANSITION_KINDS)
const SIDE_EFFECT_DISPOSITIONS = new Set<string>(["NOT_COMMITTED", "COMMITTED", "UNKNOWN"])
const CANCELLATION_DISPOSITIONS = new Set<string>(["NOT_REQUESTED", "CANCEL_ALLOWED", "COMMITTED_NO_UNDO", "UNKNOWN_BLOCKED"])
const RESUME_DECISIONS = new Set<string>(["NOT_APPLICABLE", "ELIGIBLE", "STALE", "MIGRATION_REQUIRED"])
const DEFINITION_DRIFT_DECISIONS = new Set<string>(["UNCHANGED", "MIGRATION_REQUIRED", "MIGRATED"])
const CONTINUATION_DECISIONS = new Set<string>(["ALLOW", "BLOCK"])
const AUTHORITY_KEYS = ["canonicalBase", "subjectRevisionIdentity", "authorizationIdentity", "rulesetIdentity", "workflowDefinitionIdentity", "skillManifestIdentity", "reviewPolicyIdentity", "providerConfigurationIdentity", "executionEnvironmentIdentity", "dependencyToolchainIdentity", "relevantEvidenceFreshnessIdentity"] as const

function fail(message: string): never {
  throw new TypeError(`O2 durable workflow evidence blocked: ${message}`)
}

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

function record(value: unknown, expectedKeys: readonly string[], label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value) || types.isProxy(value)) fail(`${label} must be a non-proxy plain object`)
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== Object.prototype && prototype !== null) fail(`${label} must use a plain-object prototype`)
  const descriptors = Object.getOwnPropertyDescriptors(value)
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string") fail(`${label} must not contain symbol properties`)
    const descriptor = descriptors[key]
    if (!descriptor || !("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) fail(`${label}.${key} must be an enumerable defined data property`)
  }
  const actual = Object.keys(descriptors).sort(compareStrings)
  const expected = [...expectedKeys].sort(compareStrings)
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) fail(`${label} has unexpected or missing properties`)
  return value as UnknownRecord
}

function boundedText(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0 || value.includes("\0") || Buffer.byteLength(value, "utf8") > O2_LIMITS.maxTextBytesPerBoundedField) fail(`${label} must be bounded non-empty text`)
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1)
      if (!(next >= 0xdc00 && next <= 0xdfff)) fail(`${label} must contain only Unicode scalar values`)
      index += 1
    } else if (code >= 0xdc00 && code <= 0xdfff) fail(`${label} must contain only Unicode scalar values`)
  }
  return value
}

function sha256(value: unknown, label: string): string {
  const text = boundedText(value, label)
  if (!SHA256_RE.test(text)) fail(`${label} must be a lowercase SHA-256 identity`)
  return text
}

function gitSha(value: unknown, label: string): string {
  const text = boundedText(value, label)
  if (!SHA1_RE.test(text)) fail(`${label} must be a lowercase 40-hex Git SHA-1`)
  return text
}

function positiveInteger(value: unknown, label: string, maximum = Number.MAX_SAFE_INTEGER): number {
  if (!Number.isSafeInteger(value) || (value as number) <= 0 || (value as number) > maximum) fail(`${label} must be a positive bounded safe integer`)
  return value as number
}

function enumValue<T extends string>(value: unknown, allowed: ReadonlySet<string>, label: string): T {
  if (typeof value !== "string" || !allowed.has(value)) fail(`${label} is unsupported`)
  return value as T
}

function plainArray(value: unknown, label: string, maximum: number): readonly unknown[] {
  if (typeof value !== "object" || value === null || !Array.isArray(value) || types.isProxy(value)) fail(`${label} must be a non-proxy array`)
  if (Object.getPrototypeOf(value) !== Array.prototype) fail(`${label} must use the built-in Array prototype`)
  if (value.length > maximum) fail(`${label} exceeds item bound`)
  const descriptors = Object.getOwnPropertyDescriptors(value)
  const allowed = new Set(["length", ...Array.from({ length: value.length }, (_, index) => String(index))])
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string" || !allowed.has(key)) fail(`${label} contains unsupported properties`)
    if (key === "length") continue
    const descriptor = descriptors[key]
    if (!descriptor || !("value" in descriptor) || !descriptor.enumerable || descriptor.value === undefined) fail(`${label}[${key}] must be an enumerable defined data property`)
  }
  for (let index = 0; index < value.length; index += 1) if (!Object.prototype.hasOwnProperty.call(value, index)) fail(`${label} must not contain holes`)
  return [...value]
}

function identityArray(value: unknown, label: string, maximum: number, requireCanonicalOrder = false): readonly string[] {
  const result = plainArray(value, label, maximum).map((item, index) => sha256(item, `${label}[${index}]`))
  if (new Set(result).size !== result.length) fail(`${label} must not contain duplicates`)
  const sorted = [...result].sort(compareStrings)
  if (requireCanonicalOrder && result.some((item, index) => item !== sorted[index])) fail(`${label} must use canonical order`)
  return Object.freeze(sorted)
}

function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`
  const item = value as UnknownRecord
  return `{${Object.keys(item).sort(compareStrings).map((key) => `${JSON.stringify(key)}:${canonical(item[key])}`).join(",")}}`
}

function digest(domain: string, value: unknown): string {
  return createHash("sha256").update(domain, "utf8").update("\0", "utf8").update(canonical(value), "utf8").digest("hex")
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value as UnknownRecord)) deepFreeze(child)
  }
  return value
}

function canonicalTimestamp(value: unknown, label: string): string {
  const text = boundedText(value, label)
  const milliseconds = Date.parse(text)
  if (!Number.isFinite(milliseconds) || new Date(milliseconds).toISOString() !== text) fail(`${label} must be canonical RFC3339 UTC text`)
  return text
}

function normalizeDefinition(value: unknown): O2WorkflowDefinitionInput {
  const input = record(value, ["workflowName", "schemaVersion", "runtimeIdentity", "stepDefinitions"], "definition")
  const steps = plainArray(input.stepDefinitions, "definition.stepDefinitions", O2_LIMITS.maxStepDefinitions)
  if (steps.length === 0) fail("definition.stepDefinitions must not be empty")
  const normalized = steps.map((step, index) => {
    const item = record(step, ["stepKey", "stepType"], `definition.stepDefinitions[${index}]`)
    return Object.freeze({ stepKey: boundedText(item.stepKey, `definition.stepDefinitions[${index}].stepKey`), stepType: boundedText(item.stepType, `definition.stepDefinitions[${index}].stepType`) })
  }).sort((a, b) => compareStrings(a.stepKey, b.stepKey))
  if (new Set(normalized.map((step) => step.stepKey)).size !== normalized.length) fail("definition.stepDefinitions must use unique stepKey values")
  return deepFreeze({ workflowName: boundedText(input.workflowName, "definition.workflowName"), schemaVersion: boundedText(input.schemaVersion, "definition.schemaVersion"), runtimeIdentity: sha256(input.runtimeIdentity, "definition.runtimeIdentity"), stepDefinitions: normalized })
}

export function deriveO2WorkflowDefinitionIdentity(value: O2WorkflowDefinitionInput): string {
  return digest("KODAC-O2-WORKFLOW-DEFINITION-V1", normalizeDefinition(value))
}

function normalizeRun(value: unknown): O2WorkflowRunInput {
  const input = record(value, ["triggerEvidenceIdentity", "subjectRepositoryIdentity", "canonicalBase", "subjectRevisionIdentity", "policyIdentity"], "run")
  return deepFreeze({
    triggerEvidenceIdentity: sha256(input.triggerEvidenceIdentity, "run.triggerEvidenceIdentity"),
    subjectRepositoryIdentity: sha256(input.subjectRepositoryIdentity, "run.subjectRepositoryIdentity"),
    canonicalBase: gitSha(input.canonicalBase, "run.canonicalBase"),
    subjectRevisionIdentity: gitSha(input.subjectRevisionIdentity, "run.subjectRevisionIdentity"),
    policyIdentity: sha256(input.policyIdentity, "run.policyIdentity"),
  })
}

export function deriveO2WorkflowRunIdentity(definitionValue: O2WorkflowDefinitionInput, runValue: O2WorkflowRunInput): string {
  const definitionIdentity = deriveO2WorkflowDefinitionIdentity(definitionValue)
  return digest("KODAC-O2-WORKFLOW-RUN-V1", { workflowDefinitionIdentity: definitionIdentity, ...normalizeRun(runValue) })
}

function normalizeAttempt(value: unknown): O2WorkflowAttemptInput {
  const input = record(value, ["stepKey", "attemptNumber", "retryClass", "priorAttemptIdentity"], "attempt")
  const attemptNumber = positiveInteger(input.attemptNumber, "attempt.attemptNumber", O2_LIMITS.maxAttemptsPerStep)
  const retryClass = enumValue<O2RetryClass>(input.retryClass, RETRY_CLASSES, "attempt.retryClass")
  const priorAttemptIdentity = input.priorAttemptIdentity === null ? null : sha256(input.priorAttemptIdentity, "attempt.priorAttemptIdentity")
  if (attemptNumber === 1 && (retryClass !== "INITIAL" || priorAttemptIdentity !== null)) fail("attempt 1 must use INITIAL with null priorAttemptIdentity")
  if (attemptNumber > 1 && (retryClass === "INITIAL" || priorAttemptIdentity === null)) fail("retry attempt must use a retry class and priorAttemptIdentity")
  return Object.freeze({ stepKey: boundedText(input.stepKey, "attempt.stepKey"), attemptNumber, retryClass, priorAttemptIdentity })
}

function normalizeAuthority(value: unknown, label: string): O2AuthorityBindings {
  const input = record(value, AUTHORITY_KEYS, label)
  return Object.freeze({
    canonicalBase: gitSha(input.canonicalBase, `${label}.canonicalBase`),
    subjectRevisionIdentity: gitSha(input.subjectRevisionIdentity, `${label}.subjectRevisionIdentity`),
    authorizationIdentity: sha256(input.authorizationIdentity, `${label}.authorizationIdentity`),
    rulesetIdentity: sha256(input.rulesetIdentity, `${label}.rulesetIdentity`),
    workflowDefinitionIdentity: sha256(input.workflowDefinitionIdentity, `${label}.workflowDefinitionIdentity`),
    skillManifestIdentity: input.skillManifestIdentity === null ? null : sha256(input.skillManifestIdentity, `${label}.skillManifestIdentity`),
    reviewPolicyIdentity: sha256(input.reviewPolicyIdentity, `${label}.reviewPolicyIdentity`),
    providerConfigurationIdentity: input.providerConfigurationIdentity === null ? null : sha256(input.providerConfigurationIdentity, `${label}.providerConfigurationIdentity`),
    executionEnvironmentIdentity: input.executionEnvironmentIdentity === null ? null : sha256(input.executionEnvironmentIdentity, `${label}.executionEnvironmentIdentity`),
    dependencyToolchainIdentity: sha256(input.dependencyToolchainIdentity, `${label}.dependencyToolchainIdentity`),
    relevantEvidenceFreshnessIdentity: sha256(input.relevantEvidenceFreshnessIdentity, `${label}.relevantEvidenceFreshnessIdentity`),
  })
}

function normalizeMigration(value: unknown): O2WorkflowMigrationInput {
  const input = record(value, ["fromWorkflowDefinitionIdentity", "toWorkflowDefinitionIdentity", "subjectRepositoryIdentity", "subjectRevisionIdentity", "migrationPolicyIdentity", "migrationEvidenceIdentity"], "resume.migration")
  return Object.freeze({
    fromWorkflowDefinitionIdentity: sha256(input.fromWorkflowDefinitionIdentity, "resume.migration.fromWorkflowDefinitionIdentity"),
    toWorkflowDefinitionIdentity: sha256(input.toWorkflowDefinitionIdentity, "resume.migration.toWorkflowDefinitionIdentity"),
    subjectRepositoryIdentity: sha256(input.subjectRepositoryIdentity, "resume.migration.subjectRepositoryIdentity"),
    subjectRevisionIdentity: gitSha(input.subjectRevisionIdentity, "resume.migration.subjectRevisionIdentity"),
    migrationPolicyIdentity: sha256(input.migrationPolicyIdentity, "resume.migration.migrationPolicyIdentity"),
    migrationEvidenceIdentity: sha256(input.migrationEvidenceIdentity, "resume.migration.migrationEvidenceIdentity"),
  })
}

function normalizeResume(value: unknown): O2ResumeInput | null {
  if (value === null) return null
  const input = record(value, ["suspended", "current", "migration"], "resume")
  return deepFreeze({ suspended: normalizeAuthority(input.suspended, "resume.suspended"), current: normalizeAuthority(input.current, "resume.current"), migration: input.migration === null ? null : normalizeMigration(input.migration) })
}

function normalizeCancellation(value: unknown): O2CancellationInput {
  const input = record(value, ["requested", "sideEffectDisposition"], "cancellation")
  if (typeof input.requested !== "boolean") fail("cancellation.requested must be boolean")
  const sideEffectDisposition = enumValue<O2SideEffectDisposition>(input.sideEffectDisposition, SIDE_EFFECT_DISPOSITIONS, "cancellation.sideEffectDisposition")
  if (!input.requested && sideEffectDisposition !== "NOT_COMMITTED") fail("non-cancellation transition must use neutral NOT_COMMITTED disposition")
  return Object.freeze({ requested: input.requested, sideEffectDisposition })
}

function deriveCancellation(input: O2CancellationInput): O2CancellationDisposition {
  if (!input.requested) return "NOT_REQUESTED"
  if (input.sideEffectDisposition === "NOT_COMMITTED") return "CANCEL_ALLOWED"
  if (input.sideEffectDisposition === "COMMITTED") return "COMMITTED_NO_UNDO"
  return "UNKNOWN_BLOCKED"
}

function migrationIdentity(migration: O2WorkflowMigrationInput): string {
  return digest("KODAC-O2-WORKFLOW-MIGRATION-V1", migration)
}

function deriveResume(resume: O2ResumeInput | null, definitionIdentity: string, run: O2WorkflowRunInput): { resumeDecision: O2ResumeDecision; resumeBindingIdentity: string | null; definitionDriftDecision: O2DefinitionDriftDecision; migrationIdentity: string | null } {
  if (resume === null) return { resumeDecision: "NOT_APPLICABLE", resumeBindingIdentity: null, definitionDriftDecision: "UNCHANGED", migrationIdentity: null }
  if (resume.current.canonicalBase !== run.canonicalBase || resume.current.subjectRevisionIdentity !== run.subjectRevisionIdentity || resume.current.workflowDefinitionIdentity !== definitionIdentity) fail("resume.current must bind the current run and definition")
  const resumeBindingIdentity = digest("KODAC-O2-WORKFLOW-RESUME-BINDING-V1", resume)
  const definitionChanged = resume.suspended.workflowDefinitionIdentity !== resume.current.workflowDefinitionIdentity
  let admittedMigrationIdentity: string | null = null
  if (resume.migration !== null) {
    if (!definitionChanged) fail("resume.migration must be null when workflow definition is unchanged")
    const migration = resume.migration
    if (migration.fromWorkflowDefinitionIdentity !== resume.suspended.workflowDefinitionIdentity || migration.toWorkflowDefinitionIdentity !== resume.current.workflowDefinitionIdentity || migration.subjectRepositoryIdentity !== run.subjectRepositoryIdentity || migration.subjectRevisionIdentity !== run.subjectRevisionIdentity) fail("resume.migration does not exactly bind old/new definition and subject")
    admittedMigrationIdentity = migrationIdentity(migration)
  }
  const changed = AUTHORITY_KEYS.filter((key) => resume.suspended[key] !== resume.current[key])
  const nonDefinitionChanges = changed.filter((key) => key !== "workflowDefinitionIdentity")
  const definitionDriftDecision: O2DefinitionDriftDecision = definitionChanged
    ? admittedMigrationIdentity === null ? "MIGRATION_REQUIRED" : "MIGRATED"
    : "UNCHANGED"
  if (nonDefinitionChanges.length > 0) return { resumeDecision: "STALE", resumeBindingIdentity, definitionDriftDecision, migrationIdentity: admittedMigrationIdentity }
  if (!definitionChanged) return { resumeDecision: "ELIGIBLE", resumeBindingIdentity, definitionDriftDecision: "UNCHANGED", migrationIdentity: null }
  if (admittedMigrationIdentity === null) return { resumeDecision: "MIGRATION_REQUIRED", resumeBindingIdentity, definitionDriftDecision: "MIGRATION_REQUIRED", migrationIdentity: null }
  return { resumeDecision: "ELIGIBLE", resumeBindingIdentity, definitionDriftDecision: "MIGRATED", migrationIdentity: admittedMigrationIdentity }
}
function deriveLease(value: unknown, workflowRunIdentity: string, run: O2WorkflowRunInput): { leaseIdentity: string; leaseObservationIdentity: string; leaseEpoch: number } {
  const input = record(value, ["workflowRunIdentity", "subjectRepositoryIdentity", "subjectRevisionIdentity", "ownerIdentity", "expectedOwnerIdentity", "leaseEpoch", "expectedLeaseEpoch", "leaseObservedAt", "leaseExpiresAt", "continuationObservedAt", "claimedLeaseIdentity"], "lease")
  const normalized = {
    workflowRunIdentity: sha256(input.workflowRunIdentity, "lease.workflowRunIdentity"),
    subjectRepositoryIdentity: sha256(input.subjectRepositoryIdentity, "lease.subjectRepositoryIdentity"),
    subjectRevisionIdentity: gitSha(input.subjectRevisionIdentity, "lease.subjectRevisionIdentity"),
    ownerIdentity: sha256(input.ownerIdentity, "lease.ownerIdentity"),
    expectedOwnerIdentity: sha256(input.expectedOwnerIdentity, "lease.expectedOwnerIdentity"),
    leaseEpoch: positiveInteger(input.leaseEpoch, "lease.leaseEpoch"),
    expectedLeaseEpoch: positiveInteger(input.expectedLeaseEpoch, "lease.expectedLeaseEpoch"),
    leaseObservedAt: canonicalTimestamp(input.leaseObservedAt, "lease.leaseObservedAt"),
    leaseExpiresAt: canonicalTimestamp(input.leaseExpiresAt, "lease.leaseExpiresAt"),
    continuationObservedAt: canonicalTimestamp(input.continuationObservedAt, "lease.continuationObservedAt"),
  }
  if (normalized.workflowRunIdentity !== workflowRunIdentity) fail("LEASE_IDENTITY_MISMATCH: workflow run identity")
  if (normalized.subjectRepositoryIdentity !== run.subjectRepositoryIdentity || normalized.subjectRevisionIdentity !== run.subjectRevisionIdentity) fail("LEASE_SUBJECT_MISMATCH")
  if (normalized.ownerIdentity !== normalized.expectedOwnerIdentity) fail("OWNER_IDENTITY_MISMATCH")
  if (normalized.leaseEpoch !== normalized.expectedLeaseEpoch) fail("LEASE_EPOCH_MISMATCH")
  const observedAt = Date.parse(normalized.leaseObservedAt)
  const expiresAt = Date.parse(normalized.leaseExpiresAt)
  const continuationAt = Date.parse(normalized.continuationObservedAt)
  if (observedAt >= expiresAt) fail("lease observation must be strictly before expiry")
  if (continuationAt < observedAt) fail("continuation observation must not precede lease observation")
  if (continuationAt >= expiresAt) fail("LEASE_EXPIRED_BY_CALLER_SUPPLIED_OBSERVATION")
  const leaseIdentity = digest("KODAC-O2-WORKFLOW-SUBJECT-LEASE-V1", { workflowRunIdentity: normalized.workflowRunIdentity, subjectRepositoryIdentity: normalized.subjectRepositoryIdentity, subjectRevisionIdentity: normalized.subjectRevisionIdentity, ownerIdentity: normalized.ownerIdentity, leaseEpoch: normalized.leaseEpoch, leaseObservedAt: normalized.leaseObservedAt, leaseExpiresAt: normalized.leaseExpiresAt })
  if (sha256(input.claimedLeaseIdentity, "lease.claimedLeaseIdentity") !== leaseIdentity) fail("LEASE_IDENTITY_MISMATCH: claimed lease identity")
  const leaseObservationIdentity = digest("KODAC-O2-WORKFLOW-LEASE-OBSERVATION-V1", { leaseIdentity, continuationObservedAt: normalized.continuationObservedAt })
  return { leaseIdentity, leaseObservationIdentity, leaseEpoch: normalized.leaseEpoch }
}

export function deriveO2LeaseIdentity(input: Omit<O2WorkflowLeaseInput, "claimedLeaseIdentity">): string {
  const data = record(input, ["workflowRunIdentity", "subjectRepositoryIdentity", "subjectRevisionIdentity", "ownerIdentity", "expectedOwnerIdentity", "leaseEpoch", "expectedLeaseEpoch", "leaseObservedAt", "leaseExpiresAt", "continuationObservedAt"], "lease")
  return digest("KODAC-O2-WORKFLOW-SUBJECT-LEASE-V1", {
    workflowRunIdentity: sha256(data.workflowRunIdentity, "lease.workflowRunIdentity"),
    subjectRepositoryIdentity: sha256(data.subjectRepositoryIdentity, "lease.subjectRepositoryIdentity"),
    subjectRevisionIdentity: gitSha(data.subjectRevisionIdentity, "lease.subjectRevisionIdentity"),
    ownerIdentity: sha256(data.ownerIdentity, "lease.ownerIdentity"),
    leaseEpoch: positiveInteger(data.leaseEpoch, "lease.leaseEpoch"),
    leaseObservedAt: canonicalTimestamp(data.leaseObservedAt, "lease.leaseObservedAt"),
    leaseExpiresAt: canonicalTimestamp(data.leaseExpiresAt, "lease.leaseExpiresAt"),
  })
}

function validateRequestedTransition(previousState: O2RunState, requestedNextState: O2RunState, transitionKind: O2TransitionKind): void {
  const allowed = new Set([
    "PENDING|ACTIVE|START",
    "ACTIVE|ACTIVE|RETRY",
    "ACTIVE|CANCELLATION_REQUESTED|REQUEST_CANCELLATION",
    "CANCELLATION_REQUESTED|CANCELLED|COMPLETE_CANCELLATION",
    "ACTIVE|SUCCEEDED|SUCCEED",
    "ACTIVE|FAILED|FAIL",
    "ACTIVE|ACTIVE|RESUME",
    "MIGRATION_REQUIRED|ACTIVE|RESUME",
  ])
  if (!allowed.has(`${previousState}|${requestedNextState}|${transitionKind}`)) fail("requested state transition is not allowlisted")
}

function buildEvidence(inputValue: unknown): O2DurableWorkflowTransitionEvidence {
  const input = record(inputValue, ["definition", "run", "attempt", "lease", "previousState", "requestedNextState", "transitionKind", "priorTransitionIdentity", "cancellation", "resume", "inputEvidenceIdentities", "outputEvidenceIdentities"], "input")
  const definition = normalizeDefinition(input.definition)
  const definitionIdentity = digest("KODAC-O2-WORKFLOW-DEFINITION-V1", definition)
  const run = normalizeRun(input.run)
  const workflowRunIdentity = digest("KODAC-O2-WORKFLOW-RUN-V1", { workflowDefinitionIdentity: definitionIdentity, ...run })
  const attempt = normalizeAttempt(input.attempt)
  const step = definition.stepDefinitions.find((candidate) => candidate.stepKey === attempt.stepKey)
  if (!step) fail("attempt.stepKey is not present in workflow definition")
  const workflowStepIdentity = digest("KODAC-O2-WORKFLOW-STEP-V1", { workflowRunIdentity, stepKey: step.stepKey })
  const idempotencyIdentity = digest("KODAC-O2-WORKFLOW-IDEMPOTENCY-V1", { workflowStepIdentity })
  const attemptIdentity = digest("KODAC-O2-WORKFLOW-ATTEMPT-V1", { workflowStepIdentity, attemptNumber: attempt.attemptNumber })
  if (attempt.attemptNumber > 1) {
    const expectedPriorAttemptIdentity = digest("KODAC-O2-WORKFLOW-ATTEMPT-V1", { workflowStepIdentity, attemptNumber: attempt.attemptNumber - 1 })
    if (attempt.priorAttemptIdentity !== expectedPriorAttemptIdentity) fail("retry priorAttemptIdentity does not bind the immediately preceding attempt")
  }
  const lease = deriveLease(input.lease, workflowRunIdentity, run)
  const previousState = enumValue<O2RunState>(input.previousState, RUN_STATES, "previousState")
  const requestedNextState = enumValue<O2RunState>(input.requestedNextState, RUN_STATES, "requestedNextState")
  const transitionKind = enumValue<O2TransitionKind>(input.transitionKind, TRANSITION_KINDS, "transitionKind")
  validateRequestedTransition(previousState, requestedNextState, transitionKind)
  if (transitionKind === "START" && attempt.attemptNumber !== 1) fail("START transition requires attemptNumber 1")
  if (transitionKind === "RETRY" && attempt.attemptNumber === 1) fail("RETRY transition requires attemptNumber greater than 1")
  const priorTransitionIdentity = input.priorTransitionIdentity === null ? null : sha256(input.priorTransitionIdentity, "priorTransitionIdentity")
  if (previousState === "PENDING" && priorTransitionIdentity !== null) fail("PENDING transition must not claim priorTransitionIdentity")
  if (previousState !== "PENDING" && priorTransitionIdentity === null) fail("non-PENDING transition requires priorTransitionIdentity")
  const cancellation = normalizeCancellation(input.cancellation)
  const cancellationDisposition = deriveCancellation(cancellation)
  if ((transitionKind === "REQUEST_CANCELLATION" || transitionKind === "COMPLETE_CANCELLATION") !== cancellation.requested) fail("cancellation request does not match transition kind")
  const resume = normalizeResume(input.resume)
  if ((transitionKind === "RESUME") !== (resume !== null)) fail("resume evidence is required only for RESUME transitions")
  const resumeState = deriveResume(resume, definitionIdentity, run)
  const inputEvidenceIdentities = identityArray(input.inputEvidenceIdentities, "inputEvidenceIdentities", O2_LIMITS.maxInputEvidenceIdentities)
  const outputEvidenceIdentities = identityArray(input.outputEvidenceIdentities, "outputEvidenceIdentities", O2_LIMITS.maxOutputEvidenceIdentities)

  const blockers: string[] = []
  if (attempt.retryClass === "SIDE_EFFECT_RETRY") blockers.push("SIDE_EFFECT_RETRY_BLOCKED")
  if (resumeState.resumeDecision === "STALE") blockers.push("STALE_AUTHORITY_BINDING")
  if (resumeState.resumeDecision === "MIGRATION_REQUIRED") blockers.push("WORKFLOW_MIGRATION_REQUIRED")
  if (cancellationDisposition === "COMMITTED_NO_UNDO") blockers.push("SIDE_EFFECT_ALREADY_COMMITTED")
  if (cancellationDisposition === "UNKNOWN_BLOCKED") blockers.push("SIDE_EFFECT_RESULT_UNKNOWN")

  let nextState = requestedNextState
  if (resumeState.resumeDecision === "STALE") nextState = "STALE"
  else if (resumeState.resumeDecision === "MIGRATION_REQUIRED") nextState = "MIGRATION_REQUIRED"
  else if (cancellationDisposition === "COMMITTED_NO_UNDO" || cancellationDisposition === "UNKNOWN_BLOCKED") nextState = "CANCELLATION_REQUESTED"
  else if (attempt.retryClass === "SIDE_EFFECT_RETRY") nextState = previousState

  const continuationDecision: O2ContinuationDecision = blockers.length === 0 ? "ALLOW" : "BLOCK"
  const errorIdentity = blockers.length === 0 ? null : digest("KODAC-O2-WORKFLOW-BLOCK-V1", blockers.sort(compareStrings))
  const base = {
    version: O2_DURABLE_WORKFLOW_EVIDENCE_KERNEL_VERSION,
    workflowDefinitionIdentity: definitionIdentity,
    workflowRunIdentity,
    workflowStepIdentity,
    stepKey: step.stepKey,
    stepType: step.stepType,
    attemptNumber: attempt.attemptNumber,
    attemptIdentity,
    idempotencyIdentity,
    retryClass: attempt.retryClass,
    priorAttemptIdentity: attempt.priorAttemptIdentity,
    subjectRepositoryIdentity: run.subjectRepositoryIdentity,
    canonicalBase: run.canonicalBase,
    subjectRevisionIdentity: run.subjectRevisionIdentity,
    policyIdentity: run.policyIdentity,
    triggerEvidenceIdentity: run.triggerEvidenceIdentity,
    leaseIdentity: lease.leaseIdentity,
    leaseObservationIdentity: lease.leaseObservationIdentity,
    leaseEpoch: lease.leaseEpoch,
    previousState,
    nextState,
    transitionKind,
    priorTransitionIdentity,
    cancellationDisposition,
    resumeDecision: resumeState.resumeDecision,
    resumeBindingIdentity: resumeState.resumeBindingIdentity,
    definitionDriftDecision: resumeState.definitionDriftDecision,
    migrationIdentity: resumeState.migrationIdentity,
    continuationDecision,
    inputEvidenceIdentities,
    outputEvidenceIdentities,
    errorIdentity,
  } as const
  const transitionIdentity = digest("KODAC-O2-WORKFLOW-TRANSITION-V1", base)
  return deepFreeze({ ...base, transitionIdentity })
}

export function createO2DurableWorkflowTransitionEvidence(input: O2DurableWorkflowTransitionInput): O2DurableWorkflowTransitionEvidence {
  return buildEvidence(input)
}

export function validateO2DurableWorkflowTransitionEvidence(value: unknown, sourceInput: O2DurableWorkflowTransitionInput): O2DurableWorkflowTransitionEvidence {
  const evidenceKeys = ["version", "workflowDefinitionIdentity", "workflowRunIdentity", "workflowStepIdentity", "stepKey", "stepType", "attemptNumber", "attemptIdentity", "idempotencyIdentity", "retryClass", "priorAttemptIdentity", "subjectRepositoryIdentity", "canonicalBase", "subjectRevisionIdentity", "policyIdentity", "triggerEvidenceIdentity", "leaseIdentity", "leaseObservationIdentity", "leaseEpoch", "previousState", "nextState", "transitionKind", "priorTransitionIdentity", "cancellationDisposition", "resumeDecision", "resumeBindingIdentity", "definitionDriftDecision", "migrationIdentity", "continuationDecision", "inputEvidenceIdentities", "outputEvidenceIdentities", "errorIdentity", "transitionIdentity"] as const
  const input = record(value, evidenceKeys, "evidence")
  if (boundedText(input.version, "evidence.version") !== O2_DURABLE_WORKFLOW_EVIDENCE_KERNEL_VERSION) fail("evidence.version is unsupported")
  const actual = deepFreeze({
    version: O2_DURABLE_WORKFLOW_EVIDENCE_KERNEL_VERSION,
    workflowDefinitionIdentity: sha256(input.workflowDefinitionIdentity, "evidence.workflowDefinitionIdentity"),
    workflowRunIdentity: sha256(input.workflowRunIdentity, "evidence.workflowRunIdentity"),
    workflowStepIdentity: sha256(input.workflowStepIdentity, "evidence.workflowStepIdentity"),
    stepKey: boundedText(input.stepKey, "evidence.stepKey"),
    stepType: boundedText(input.stepType, "evidence.stepType"),
    attemptNumber: positiveInteger(input.attemptNumber, "evidence.attemptNumber", O2_LIMITS.maxAttemptsPerStep),
    attemptIdentity: sha256(input.attemptIdentity, "evidence.attemptIdentity"),
    idempotencyIdentity: sha256(input.idempotencyIdentity, "evidence.idempotencyIdentity"),
    retryClass: enumValue<O2RetryClass>(input.retryClass, RETRY_CLASSES, "evidence.retryClass"),
    priorAttemptIdentity: input.priorAttemptIdentity === null ? null : sha256(input.priorAttemptIdentity, "evidence.priorAttemptIdentity"),
    subjectRepositoryIdentity: sha256(input.subjectRepositoryIdentity, "evidence.subjectRepositoryIdentity"),
    canonicalBase: gitSha(input.canonicalBase, "evidence.canonicalBase"),
    subjectRevisionIdentity: gitSha(input.subjectRevisionIdentity, "evidence.subjectRevisionIdentity"),
    policyIdentity: sha256(input.policyIdentity, "evidence.policyIdentity"),
    triggerEvidenceIdentity: sha256(input.triggerEvidenceIdentity, "evidence.triggerEvidenceIdentity"),
    leaseIdentity: sha256(input.leaseIdentity, "evidence.leaseIdentity"),
    leaseObservationIdentity: sha256(input.leaseObservationIdentity, "evidence.leaseObservationIdentity"),
    leaseEpoch: positiveInteger(input.leaseEpoch, "evidence.leaseEpoch"),
    previousState: enumValue<O2RunState>(input.previousState, RUN_STATES, "evidence.previousState"),
    nextState: enumValue<O2RunState>(input.nextState, RUN_STATES, "evidence.nextState"),
    transitionKind: enumValue<O2TransitionKind>(input.transitionKind, TRANSITION_KINDS, "evidence.transitionKind"),
    priorTransitionIdentity: input.priorTransitionIdentity === null ? null : sha256(input.priorTransitionIdentity, "evidence.priorTransitionIdentity"),
    cancellationDisposition: enumValue<O2CancellationDisposition>(input.cancellationDisposition, CANCELLATION_DISPOSITIONS, "evidence.cancellationDisposition"),
    resumeDecision: enumValue<O2ResumeDecision>(input.resumeDecision, RESUME_DECISIONS, "evidence.resumeDecision"),
    resumeBindingIdentity: input.resumeBindingIdentity === null ? null : sha256(input.resumeBindingIdentity, "evidence.resumeBindingIdentity"),
    definitionDriftDecision: enumValue<O2DefinitionDriftDecision>(input.definitionDriftDecision, DEFINITION_DRIFT_DECISIONS, "evidence.definitionDriftDecision"),
    migrationIdentity: input.migrationIdentity === null ? null : sha256(input.migrationIdentity, "evidence.migrationIdentity"),
    continuationDecision: enumValue<O2ContinuationDecision>(input.continuationDecision, CONTINUATION_DECISIONS, "evidence.continuationDecision"),
    inputEvidenceIdentities: identityArray(input.inputEvidenceIdentities, "evidence.inputEvidenceIdentities", O2_LIMITS.maxInputEvidenceIdentities, true),
    outputEvidenceIdentities: identityArray(input.outputEvidenceIdentities, "evidence.outputEvidenceIdentities", O2_LIMITS.maxOutputEvidenceIdentities, true),
    errorIdentity: input.errorIdentity === null ? null : sha256(input.errorIdentity, "evidence.errorIdentity"),
    transitionIdentity: sha256(input.transitionIdentity, "evidence.transitionIdentity"),
  })
  const expected = buildEvidence(sourceInput)
  if (canonical(actual) !== canonical(expected)) fail("serialized evidence does not match independently rederived evidence")
  return expected
}


function requireSuccessorLinkage(
  previous: O2DurableWorkflowTransitionEvidence,
  next: O2DurableWorkflowTransitionEvidence,
): void {
  if (next.priorTransitionIdentity !== previous.transitionIdentity) fail("successor priorTransitionIdentity does not bind validated previous transition")
  if (next.previousState !== previous.nextState) fail("successor previousState does not match validated previous nextState")
}

export function createO2DurableWorkflowSuccessorTransitionEvidence(
  previousValue: unknown,
  previousSourceInput: O2DurableWorkflowTransitionInput,
  nextSourceInput: O2DurableWorkflowTransitionInput,
): O2DurableWorkflowTransitionEvidence {
  const previous = validateO2DurableWorkflowTransitionEvidence(previousValue, previousSourceInput)
  const next = buildEvidence(nextSourceInput)
  requireSuccessorLinkage(previous, next)
  return next
}

export function validateO2DurableWorkflowSuccessorTransitionEvidence(
  value: unknown,
  sourceInput: O2DurableWorkflowTransitionInput,
  previousValue: unknown,
  previousSourceInput: O2DurableWorkflowTransitionInput,
): O2DurableWorkflowTransitionEvidence {
  const previous = validateO2DurableWorkflowTransitionEvidence(previousValue, previousSourceInput)
  const current = validateO2DurableWorkflowTransitionEvidence(value, sourceInput)
  requireSuccessorLinkage(previous, current)
  return current
}
