# Kodac O2 Durable Workflow Evidence Kernel Authorization — 2026-09-10

## Record identity

```text
STATUS = AUTHORIZATION_CANDIDATE / NOT_CANONICAL
CLASS = DOCUMENTATION / O2 IMPLEMENTATION AUTHORIZATION ONLY
DECISION_OWNER = KODAC FOUNDER
CANONICAL_BASE = 6e2d38ffc4b6c2643289d1399c1aaf94cf9f375e
PREDECESSOR = PR #576 / POST_O1_PROJECT_COMPLETION_AUDIT_AND_CURRENT_VIEW_RECONCILIATION / CLOSED_CANONICAL
PREDECESSOR_PROOF = PR #576 / comment 5622940834
SUCCESSOR_ANALYSIS = PR #576 / comment 5622993024 / ANALYSIS_ONLY
WAIVER = NO
```

This one-path record authorizes no O2 source mutation while it is a candidate. It becomes effective only after exact-head qualification, normal expected-head guarded merge into protected `main`, and complete external post-merge proof.

## Exact authorization-candidate scope

This authorization candidate may modify exactly one path:

```text
docs/planning/KODAC_O2_DURABLE_WORKFLOW_EVIDENCE_KERNEL_AUTHORIZATION_2026-09-10.md
```

No second path may change in this authorization candidate.

## Canonical problem statement

The externally proven project-wide completion audit now classifies:

```text
DURABLE_WORKFLOW_RETRY_RESUME_LEASE_CANCELLATION_MIGRATION = PARTIAL_CANONICAL
O2_DURABLE_WORKFLOW_EVIDENCE_KERNEL = PARTIAL_CANONICAL
```

Existing evidence-session leases, H4 gVisor durable claim/lease/terminal recovery, approval cancellation, ACP `session/resume` catalog evidence, H5 agent-step identities, and P9 freshness/requalification records are canonical but domain-scoped. They do not compose automatically into a generic durable workflow evidence kernel.

The controlling OpenReview-derived planning direction requires O2 to establish workflow definition/run/step identities, explicit state-machine evidence, retries, idempotency, subject leases, cancellation, resume freshness, definition drift and migration semantics, without privileged side effects.

## Conditional future implementation authority

Only after this authorization itself is externally post-merge proven `CLOSED_CANONICAL` may one later implementation candidate modify exactly:

```text
packages/kodac-runtime/src/workflow/o2-durable-workflow-evidence-kernel.ts
packages/kodac-runtime/test/o2-durable-workflow-evidence-kernel.test.ts
schema/o2-durable-workflow-evidence-kernel.schema.json
```

No fourth path is authorized. In particular, no package root export, CLI, O1/P9 source, evidence store, workflow file, dependency, lockfile, package metadata, current view, release configuration, ruleset, or provenance ledger may change in the implementation candidate.

## Bounded O2 implementation class

```text
IMPLEMENTATION_CLASS = PURE_DATA_ONLY_GENERIC_WORKFLOW_EVIDENCE_KERNEL
PRIVILEGED_SIDE_EFFECTS = NONE
PERSISTENCE_OWNERSHIP = NONE
NETWORK_OWNERSHIP = NONE
SCHEDULER_OR_WORKER_OWNERSHIP = NONE
```

The implementation may consume caller-materialized bounded evidence and state, validate it fail closed, and derive immutable deterministic workflow evidence. It may not discover, fetch, persist, schedule, execute, mutate, retry or publish anything externally.

## Protocol and identity model

The future source must define one versioned protocol:

```text
VERSION = kodac-o2-durable-workflow-evidence-kernel-v1
```

All identities below must be lowercase 64-hex SHA-256 except commit identities, which must be lowercase 40-hex Git SHA-1 where explicitly named `canonicalBase` or `subjectRevisionIdentity`.

The kernel must derive rather than trust at least:

```text
workflowDefinitionIdentity
workflowRunIdentity
workflowStepIdentity
idempotencyIdentity
attemptIdentity
leaseIdentity
migrationIdentity when applicable
transitionIdentity
```

Identity preimages must use explicit domain-separation strings and deterministic canonical serialization.

## Workflow definition binding

A definition input must bind at least:

```text
workflowName
schemaVersion
runtimeIdentity
stepDefinitions[]
```

Each step definition must have an exact bounded `stepKey` and `stepType`. Step keys must be unique and canonical ordering must be deterministic. The kernel must derive `workflowDefinitionIdentity` from the complete normalized definition.

The first slice may support at most 64 step definitions. Callers may not raise the bound.

## Subject and run binding

A workflow run must bind at least:

```text
workflowDefinitionIdentity
triggerEvidenceIdentity
subjectRepositoryIdentity
canonicalBase
subjectRevisionIdentity
policyIdentity
```

The `workflowRunIdentity` must be deterministic for the same exact definition, trigger and subject bindings. Replaying the same semantic run-creation input must not create a new run identity merely because the function was called again.

The kernel does not authenticate `triggerEvidenceIdentity` itself. It treats it as an opaque caller-materialized upstream evidence identity and must not promote it into GitHub or provider authenticity.

## Step and attempt binding

For one defined logical step:

```text
workflowStepIdentity = deterministic(run + stepKey)
idempotencyIdentity = deterministic(logical step identity)
attemptNumber = positive bounded integer
attemptIdentity = deterministic(step identity + attemptNumber)
```

A retry must preserve the same `workflowStepIdentity` and `idempotencyIdentity` while producing a distinct attempt identity and preserving exact prior-attempt lineage.

The first slice must bound attempts per logical step to 32.

## Retry classification

The future kernel must distinguish these caller-declared retry classes and enforce their semantics:

```text
SAFE_REPLAY
IDEMPOTENT_REREAD
NEW_INTELLIGENCE_ATTEMPT
SIDE_EFFECT_RETRY
```

`SIDE_EFFECT_RETRY` must never produce positive side-effect authority. In this pure O2 slice it must fail closed or produce an explicit blocked evidence state. Workflow retry alone cannot authorize a write, comment, push, approval, release, provider call, sandbox action, or K2 mutation.

A successful later attempt must not erase failed or cancelled prior attempt lineage.

## Explicit state machine

The first slice must use a closed run-state vocabulary at least as strict as:

```text
PENDING
ACTIVE
CANCELLATION_REQUESTED
CANCELLED
SUCCEEDED
FAILED
STALE
MIGRATION_REQUIRED
```

Transitions must be allowlisted. Unknown or impossible transitions fail closed. Terminal `SUCCEEDED`, `FAILED`, and `CANCELLED` states must not silently return to `ACTIVE`.

A transition record must bind its exact previous state, next state, transition kind and prior transition identity when one exists.

## Subject lease evidence

A lease input must bind at least:

```text
workflowRunIdentity
subjectRepositoryIdentity
subjectRevisionIdentity
ownerIdentity
leaseEpoch
leaseObservedAt
leaseExpiresAt
```

The kernel may validate canonical RFC3339 timestamps and ordering but must not claim external-clock authenticity. It must derive a lease identity from the exact normalized lease fields.

A positive continuation requiring ownership must fail closed when:

```text
LEASE_IDENTITY_MISMATCH
LEASE_SUBJECT_MISMATCH
LEASE_EPOCH_MISMATCH
LEASE_EXPIRED_BY_CALLER_SUPPLIED_OBSERVATION
OWNER_IDENTITY_MISMATCH
```

Competing workflow ownership is evidence-only here; O2 does not acquire or persist locks.

## Cancellation semantics

The future kernel must preserve this distinction:

```text
CANCELLATION_REQUESTED + SIDE_EFFECT_NOT_COMMITTED -> CANCELLATION MAY COMPLETE
CANCELLATION_REQUESTED + SIDE_EFFECT_ALREADY_COMMITTED -> MUST NOT CLAIM UNDO
CANCELLATION_REQUESTED + SIDE_EFFECT_RESULT_UNKNOWN -> BLOCK / UNKNOWN
```

The first slice may represent side-effect disposition as caller-materialized evidence, but it must not execute or undo any side effect and must not convert `UNKNOWN` into success.

## Resume freshness

A resume input must bind a closed set of authority-relevant identities observed when the workflow was suspended and again when resume is requested. At minimum the first slice must support bounded identity bindings for:

```text
canonicalBase
subjectRevisionIdentity
authorizationIdentity
rulesetIdentity
workflowDefinitionIdentity
skillManifestIdentity when applicable
reviewPolicyIdentity
providerConfigurationIdentity when applicable
executionEnvironmentIdentity when applicable
dependencyToolchainIdentity
relevantEvidenceFreshnessIdentity
```

Optional identities must use explicit `null`, not omission or magic strings.

If any non-null authority-relevant identity differs between suspended and resume observations, blind continuation is forbidden. The result must become `STALE` or `MIGRATION_REQUIRED` according to the definition-drift rule below.

## Workflow definition drift and migration

If the suspended `workflowDefinitionIdentity` differs from the current definition identity:

```text
NO_ADMITTED_MIGRATION -> MIGRATION_REQUIRED / BLOCK
EXACT_ADMITTED_MIGRATION -> MIGRATED / CONTINUE_ELIGIBLE
```

An admitted migration input must bind at least:

```text
fromWorkflowDefinitionIdentity
toWorkflowDefinitionIdentity
subjectRepositoryIdentity
subjectRevisionIdentity
migrationPolicyIdentity
migrationEvidenceIdentity
```

The kernel must derive a `migrationIdentity` from these exact fields and require exact old/new definition linkage. It must not execute schema/data migration or persistence writes.

A migration may address workflow-definition drift only. It must not waive changed repository head, canonical base, authorization, ruleset, policy, provider, environment, dependency/toolchain, or evidence-freshness identities.

## Crash/recovery evidence boundary

The kernel must be deterministic when reconstructing a next transition from a fully validated previous serialized transition record. This proves replayable evidence semantics only.

```text
REPLAYABLE_VALIDATED_TRANSITION != DURABLE_STORAGE
REPLAYABLE_VALIDATED_TRANSITION != CRASH_RECOVERY_DAEMON
```

No filesystem/database durability, transaction log, queue, worker lease acquisition, crash detector, or recovery scheduler is authorized.

## Serialized output requirements

The positive serialized output must bind at least:

```text
version
workflowDefinitionIdentity
workflowRunIdentity
workflowStepIdentity
stepKey
stepType
attemptNumber
attemptIdentity
idempotencyIdentity
retryClass
priorAttemptIdentity
subjectRepositoryIdentity
canonicalBase
subjectRevisionIdentity
policyIdentity
triggerEvidenceIdentity
leaseIdentity
leaseEpoch
previousState
nextState
transitionKind
priorTransitionIdentity
cancellationDisposition
resumeDecision
definitionDriftDecision
migrationIdentity
continuationDecision
inputEvidenceIdentities
outputEvidenceIdentities
errorIdentity
transitionIdentity
```

Fields not applicable to a transition must use explicit `null` where the contract permits null. Output arrays must be bounded, duplicate-free and canonically sorted where semantic order is not meaningful.

The JSON Schema must describe the exact positive serialized surface and must not claim runtime validation, persistence, authority or side effects merely because schema validation succeeds.

## Validator requirements

The future source must provide a strict public validator for serialized O2 transition evidence that receives the necessary source input/prior evidence and independently rederives every derived field and final identity.

It must never trust caller-claimed:

```text
workflowDefinitionIdentity
workflowRunIdentity
workflowStepIdentity
idempotencyIdentity
attemptIdentity
leaseIdentity
resumeDecision
definitionDriftDecision
migrationIdentity
continuationDecision
transitionIdentity
```

Forgery of any derived field must fail closed.

## Hostile input and resource bounds

Structured JavaScript input must reject, before executing caller hooks where applicable:

```text
Proxy / revoked Proxy
accessor properties
symbol-keyed properties
non-enumerable semantic fields
custom prototypes
sparse arrays
array extra properties
duplicate set-like values
undefined semantic values
unpaired Unicode surrogates
oversized strings / arrays / records
unknown enum values
unknown object keys
```

At minimum:

```text
MAX_STEP_DEFINITIONS = 64
MAX_ATTEMPTS_PER_STEP = 32
MAX_INPUT_EVIDENCE_IDENTITIES = 128
MAX_OUTPUT_EVIDENCE_IDENTITIES = 128
MAX_AUTHORITY_BINDINGS = 16
MAX_TEXT_BYTES_PER_BOUNDED_FIELD = 1024
```

The implementation may choose lower bounds but callers may not raise them.

## Required focused tests

The exact future test path must cover at least:

1. deterministic definition/run/step/attempt/idempotency identities;
2. same semantic run input produces the same run identity;
3. ordered valid state transitions;
4. impossible and terminal-state transitions fail closed;
5. retry preserves step/idempotency identity and binds prior attempt lineage;
6. `SIDE_EFFECT_RETRY` cannot produce positive continuation authority;
7. valid unexpired matching lease continuation;
8. owner/subject/epoch/expiry mismatch fails closed;
9. cancellation before side effect can cancel;
10. committed side effect cannot be relabeled undone;
11. unknown side-effect result blocks;
12. resume with unchanged authority bindings is eligible;
13. stale resume after non-definition authority drift blocks;
14. definition drift without migration becomes `MIGRATION_REQUIRED`;
15. exact admitted migration binds old/new definition and enables only definition-drift continuation;
16. migration cannot waive independent authority drift;
17. reconstructed transition from validated prior evidence is deterministic;
18. derived-field/identity forgery rejection;
19. canonical ordering and duplicate rejection;
20. Proxy/accessor/symbol/custom-prototype/sparse-array hostile cases;
21. bound enforcement;
22. JSON Schema parity for positive serialized outputs;
23. no filesystem/network/process/provider/K2/persistence import surface;
24. no source/test/schema changes outside the exact three-path allowlist.

## Qualification requirements for the future implementation

Before implementation merge, the exact frozen head must satisfy:

```text
BASE = THEN-CURRENT CANONICAL MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY 3
NODE_24_FOCUSED_TESTS = PASS
TYPESCRIPT = PASS
FULL_RUNTIME_REGRESSION = PASS
PYTHON_REPOSITORY_TESTS = PASS
RUFF = PASS
PROVENANCE = PASS
SCHEMA_PARITY = PASS
HOSTILE_INPUT_TESTS = PASS
NO_NEW_DEPENDENCY = PASS
NO_SIDE_EFFECT_IMPORT = PASS
REQUIRED_PR_CI = TERMINAL_SUCCESS
SUBSTANTIVE_EXACT_HEAD_REVIEW = CLEAN
UNRESOLVED_ACTIONABLE_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
MERGE = NORMAL / EXPECTED_HEAD_GUARD
POST_MERGE_APPLICABLE_ORIGINAL_RUNS = SUCCESS
EXTERNAL_POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

Historical failed attempts, if any, must remain visible and cannot be relabeled PASS.

## Explicit non-grants

This authorization does not permit or establish:

```text
FILESYSTEM_DATABASE_PERSISTENCE
DURABLE_QUEUE_OR_CACHE
WORKER_DAEMON_OR_SCHEDULER
LOCK_OR_LEASE_ACQUISITION_SIDE_EFFECT
CRASH_DETECTOR_OR_RECOVERY_SERVICE
WEBHOOK_LISTENER_OR_PUBLIC_ENDPOINT
GITHUB_APP_REGISTRATION_OR_GITHUB_API_ACCESS
SECRET_STORE_OR_ENVIRONMENT_ACCESS
PROVIDER_MODEL_REVIEWER_EXECUTION
SANDBOX_EXECUTION
K2_OR_REPOSITORY_MUTATION
SIDE_EFFECT_RETRY_AUTHORITY
COMMENT_REVIEW_PUSH_APPROVAL_RELEASE_SIDE_EFFECT
O3_PLUS_IMPLEMENTATION
CURRENT_VIEW_MUTATION
PHASE_OVERALL_CLOSURE
PROJECT_COMPLETION_CLAIM
RELEASE_VERSION_SELECTION
TAG_GITHUB_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT
PRODUCTION_READINESS_BRAND_LEGAL_CLAIM
RULESET_CHANGE_OR_BYPASS
REBASE
FORCE_PUSH
HISTORY_REWRITE
WAIVER
```

## Authorization closure gate

This record cannot certify itself. Before merge it requires one exact unchanged head, exactly one changed path, current canonical base, local governance gates, required PR-triggered CI, substantive exact-head review, zero unresolved actionable review threads, active no-bypass ruleset state, and normal expected-head guarded merge.

External post-merge proof must then bind the merge SHA, ordered parents, candidate tree, authorization blob, verified GitHub signature, applicable original push checks, merged PR state, review-thread state, ruleset state, and release/tag state.

Only that external proof may establish:

```text
O2_DURABLE_WORKFLOW_EVIDENCE_KERNEL_AUTHORIZATION = CLOSED_CANONICAL
```

Only then may the exact three-path implementation candidate become eligible. The implementation must independently qualify and cannot certify O2 overall, any later O3+ stage, phase-overall closure, release, production readiness, or project completion.
