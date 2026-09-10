# Kodac P9-R3 Bounded Targeted Requalification Requirement Projection Authorization — 2026-09-10

## Classification

```text
CLASS = AUTHORIZATION / DOCUMENTATION_ONLY
STATUS = AUTHORIZATION_CANDIDATE / NOT_CANONICAL
CANONICAL_BASE_MAIN = 7d31184d8364dbae1046ffe545ae158bd5d53fcd
PREDECESSOR = PR #562 / P9_R2_POST_MERGE_CURRENT_VIEW_RECONCILIATION / CLOSED_CANONICAL
PREDECESSOR_MERGE = 7d31184d8364dbae1046ffe545ae158bd5d53fcd
PREDECESSOR_POST_MERGE_PROOF = 5611728563
SUCCESSOR_ANALYSIS = PR #562 / comment 5611747515 / ANALYSIS_ONLY
FOUNDER_CONTINUATION_AUTHORITY = EXPLICIT_KODAC_CONTINUATION_WITH_ORDINARY_AUTHORIZED_APPROVALS_2026-09-10
WAIVER = NO
```

This one-path record is only an authorization candidate. It creates no implementation authority until this exact authorization independently qualifies, merges normally into protected `main` with an exact expected-head precondition, and receives complete external post-merge proof.

## Exact authorization-candidate path

This candidate may add exactly one path:

```text
docs/planning/KODAC_P9_R3_BOUNDED_TARGETED_REQUALIFICATION_REQUIREMENT_PROJECTION_AUTHORIZATION_2026-09-10.md
```

No source, test, schema, package, bin, workflow, dependency, lockfile, current-view, product-contract, README, release, tag, artifact, ruleset, repository-protection, persistence, provider, sandbox, or execution path may change in this authorization candidate.

## Proven predecessor boundary

```text
P9_R1_AUTHORIZATION = CLOSED_CANONICAL / PR #555 / proof 5610646762
P9_R1_IMPLEMENTATION = CLOSED_CANONICAL / PR #556 / proof 5611220666
P9_R1_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #558 / proof 5611355037
P9_R2_AUTHORIZATION = CLOSED_CANONICAL / PR #559 / proof 5611440617
P9_R2_IMPLEMENTATION = CLOSED_CANONICAL / PR #560 / proof 5611611531
P9_R2_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL / PR #561 / proof 5611667060
P9_R2_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #562 / proof 5611728563
```

Frozen P9-R1 implementation Git blobs:

```text
SOURCE = 7114a87ecc465d08d524252834f414203dc96a43
TEST = e2b54db06c5e550f8468d2d1f65a696facd471d6
SCHEMA = 0c3e11a69b526e7505924a637b867f146d3158ac
```

Frozen P9-R2 implementation Git blobs:

```text
SOURCE = a0671a84d5d7c480f30577f992de1e469eff394f
TEST = fcd530aca45332548e2b71b08ac0ec680f7bd092
SCHEMA = 092b84387f2995f8522527a1fdb83e3f20391a4d
```

P9-R1 and P9-R2 remain unchanged by the future R3 candidate.

## Gap established by fresh analysis

Canonical planning requires the bounded flow:

```text
BOUND IDENTITY CHANGED
-> IMPACTED WORKFLOW / EVIDENCE FOUND
-> STATE MARKED STALE
-> CONTINUATION BLOCKED
-> TARGETED REQUALIFICATION
```

P9-R1 already derives per-subject freshness and blocking truth from caller-materialized dependency identities. P9-R2 already validates those decisions and deterministically projects impacted opaque subject identities for a bounded changed-dependency query.

Neither predecessor materializes a generic, content-addressed requirement record saying that each impacted subject is stale, continuation-blocked, and requires targeted requalification. Existing KRI stale semantics are finding-specific; K5 stale semantics are proof-reconciliation-specific; K3 impact is code-entity traversal. None is a reusable P9 requirement projection.

No requalification runtime, scheduler, persistence layer, generic workflow-state mutation surface, or external observer is established by this gap.

## Conditionally authorized implementation paths

Only after this authorization becomes externally proven `CLOSED_CANONICAL` may one later implementation candidate modify exactly:

```text
packages/kodac-runtime/src/continuous-assurance/p9-r3-targeted-requalification-requirement.ts
packages/kodac-runtime/test/p9-r3-targeted-requalification-requirement.test.ts
schema/p9-r3-targeted-requalification-requirement.schema.json
```

No fourth path is authorized. No package-root export is authorized. P9-R1 and P9-R2 source/test/schema paths remain byte-frozen.

## Bounded P9-R3 semantic contract

The future implementation may define one pure/data-only projection over an exact validated P9-R2 result and its original bounded P9-R2 source input.

### Input

```text
sourceInput = exact P9R2ImpactedSubjectResolutionInput
sourceResult = exact P9R2ImpactedSubjectResolutionResult
```

The R3 builder and validator must call the canonical P9-R2 result validator with the original bounded `sourceInput`. R3 must not trust caller-supplied P9-R2 revision, changed-key set, subject-decision identities, impacted-subject projection, unmatched keys, ordering, or result identity without that predecessor validation.

### Output

The serialized R3 result must contain exactly:

```text
version
revision
sourceResultIdentity
changedDependencyKeys
requirements
resultIdentity
```

Each requirement must contain exactly:

```text
subjectIdentity
decisionIdentity
matchedChangedDependencyKeys
state
continuation
requalification
requirementIdentity
```

Closed literals:

```text
state = STALE
continuation = BLOCK
requalification = REQUIRED
```

### Projection rule

For every and only P9-R2 `impactedSubjects[]` entry, R3 must create exactly one requirement with the same:

```text
subjectIdentity
decisionIdentity
matchedChangedDependencyKeys
```

R3 must not create a requirement for a subject absent from canonical P9-R2 `impactedSubjects`.

A canonical P9-R2 result with zero impacted subjects is valid and must produce an empty `requirements` array. It must not invent blanket requalification.

Requirement ordering must be exactly canonical P9-R2 impacted-subject order, which is strictly sorted by `subjectIdentity`. Matched changed dependency keys remain strictly sorted and duplicate-free.

### Identity binding

Each `requirementIdentity` must be a lowercase SHA-256 identity over a domain-separated canonical preimage that binds at least:

```text
version
sourceResultIdentity
revision
subjectIdentity
decisionIdentity
matchedChangedDependencyKeys
state = STALE
continuation = BLOCK
requalification = REQUIRED
```

The aggregate `resultIdentity` must be a lowercase SHA-256 identity over a domain-separated canonical preimage covering every serialized result field except `resultIdentity` itself, including the complete ordered requirements and every requirement identity.

Equivalent caller object-key insertion order must not change semantic identities. Arrays declared as canonical order remain semantic and validators must reject noncanonical ordering rather than silently repairing serialized output.

## Validation and fail-closed requirements

The future implementation must:

1. revalidate exact P9-R2 source/result semantics through the canonical R2 validator before deriving R3 truth;
2. reject unknown or missing fields at every R3-owned object boundary;
3. reject malformed SHA-1/SHA-256 identities and dependency-key grammar violations inherited through predecessor validation;
4. reject direct or nested Proxy/accessor/symbol/non-enumerable/custom-prototype/sparse-array/cyclic/non-JSON hostile structures before caller hooks can become authority;
5. reject forged `STALE`, `BLOCK`, or `REQUIRED` literals where they do not exactly match the canonical projection;
6. reject missing, extra, duplicate, reordered, or substituted requirements;
7. reject requirement-identity or result-identity tampering even when other structure is plausible;
8. return detached deeply immutable output with no caller aliases;
9. remain deterministic for the same validated P9-R2 source/result input;
10. remain pure/data-only with no ambient clock, randomness, environment, network, filesystem write, process, provider, scheduler, persistence, K2, or mutation dependency.

## Required test coverage

The focused test file must cover at least:

```text
ONE_IMPACTED_SUBJECT -> ONE_STALE_BLOCKED_REQUIRED_REQUIREMENT
MULTIPLE_IMPACTED_SUBJECTS -> EXACT_CANONICAL_REQUIREMENT_SET
ZERO_IMPACTED_SUBJECTS -> EMPTY_REQUIREMENTS / NO_BLANKET_REQUALIFICATION
DISJOINT_STALE_SUBJECT -> NO_REQUIREMENT_FOR_THIS_QUERY
MATCHED_KEY_PROJECTION = EXACT
R2_SOURCE_RESULT_REVALIDATION = REQUIRED
FORGED_R2_PROJECTION = REJECTED
CROSS_REVISION_INPUT = REJECTED_BY_R2_CHAIN
MISSING_EXTRA_DUPLICATE_REORDERED_REQUIREMENTS = REJECTED
FORGED_STATE_CONTINUATION_REQUALIFICATION = REJECTED
REQUIREMENT_IDENTITY_TAMPER = REJECTED
RESULT_IDENTITY_TAMPER = REJECTED
OBJECT_KEY_ORDER = IDENTITY_NEUTRAL
CALLER_MUTATION = OUTPUT_UNCHANGED
OUTPUT = DEEPLY_FROZEN
PROXY_ACCESSOR_SYMBOL_NONENUMERABLE_CUSTOM_PROTOTYPE_SPARSE_CYCLE = FAIL_CLOSED
SCHEMA_RUNTIME_STRUCTURAL_PARITY = PROVEN_FOR_REPRESENTABLE_CONSTRAINTS
PRODUCTION_SIDE_EFFECT_SURFACE = ABSENT
```

## JSON Schema boundary

The authorized schema is descriptive of the serialized R3 result only. It must use a closed object shape and exact literals for `STALE`, `BLOCK`, and `REQUIRED`.

Runtime-only cross-object claims such as exact reconstruction from P9-R2 source input, requirement membership equality with R2 impacted subjects, and cryptographic identity recomputation must remain runtime validation responsibilities. The schema must not claim to prove semantics it cannot express.

## Explicit non-grants

```text
EXTERNAL_STATE_OBSERVATION = NOT_AUTHORIZED
CONTINUOUS_WATCHER_OR_MONITORING = NOT_AUTHORIZED
WEBHOOK_OR_GITHUB_APP = NOT_AUTHORIZED
NETWORK = NOT_AUTHORIZED
SECRET_OR_CREDENTIAL_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_REDIS = NOT_AUTHORIZED
SCHEDULER_QUEUE_WORKER = NOT_AUTHORIZED
DURABLE_WORKFLOW_STATE_MUTATION = NOT_AUTHORIZED
FINDING_OR_K5_STATE_MUTATION = NOT_AUTHORIZED
REQUALIFICATION_EXECUTION = NOT_AUTHORIZED
PROVIDER_MODEL_REVIEWER_INVOCATION = NOT_AUTHORIZED
SANDBOX_EXECUTION = NOT_AUTHORIZED
K2_INVOCATION = NOT_AUTHORIZED
PATCH_RETRY_OR_AUTOFIX = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
P9_R4_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9_OVERALL_CLOSEOUT = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PRODUCTION_READINESS_CLAIM = NOT_AUTHORIZED
BRAND_OR_LEGAL_CLAIM = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

`REQUALIFICATION = REQUIRED` is evidence about what must happen before safe continuation. It is not permission to execute requalification and is not a scheduling instruction.

## Qualification and merge requirements

A future P9-R3 implementation candidate is eligible only after this authorization itself is externally proven closed. That future candidate must then independently satisfy all canonical repository governance, including:

```text
EXACT_CHANGED_PATHS = THE_THREE_CONDITIONALLY_AUTHORIZED_PATHS_ONLY
CANONICAL_BASE = THEN-LIVE_PROTECTED_MAIN
BEHIND_BY = 0
NODE = 24 / CANONICAL_RUNTIME_ENGINE
TYPECHECK = PASS
FOCUSED_P9_R3_TESTS = PASS
FULL_RUNTIME_SUITE = PASS_OR_TRUTHFUL_PLATFORM_SPECIFIC_SKIPS_ONLY
PYTHON_GOVERNANCE = PASS
RUFF = PASS
PROVENANCE = PASS
DIFF_CHECK = PASS
PR_TRIGGERED_REQUIRED_CI = TERMINAL_SUCCESS
SUBSTANTIVE_EXACT_HEAD_REVIEW = CLEAN
UNRESOLVED_ACTIONABLE_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
MERGE = NORMAL_MERGE_WITH_EXACT_EXPECTED_HEAD
POST_MERGE_IDENTITY = EXACT_TREE_AND_ORDERED_PARENTS
POST_MERGE_REQUIRED_CI = ORIGINAL_ATTEMPTS_ONLY / TERMINAL_SUCCESS
EXTERNAL_POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

Any candidate-head movement invalidates prior exact-head qualification evidence. Any canonical-main movement requires non-destructive forward reconciliation and full requalification; no force-push, rebase, destructive history rewrite, stale evidence reuse, ruleset bypass, or silent waiver is permitted.

## Closure boundary

This authorization cannot certify itself. Only complete external post-merge proof may classify:

```text
P9_R3_BOUNDED_TARGETED_REQUALIFICATION_REQUIREMENT_PROJECTION_AUTHORIZATION = CLOSED_CANONICAL
```

Even then, only the exact three-path R3 implementation becomes eligible. P9-R4+, observation, monitoring, persistence, workflow-state mutation, actual requalification execution, K2 mutation, public release/package publication/deployment, P9 overall closeout, and project completion remain separately unauthorized.
