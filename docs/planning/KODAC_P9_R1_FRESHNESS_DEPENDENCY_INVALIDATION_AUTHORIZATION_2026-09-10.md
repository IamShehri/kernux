# Kodac P9-R1 Freshness Dependency Invalidation Authorization — 2026-09-10

## Classification

```text
CLASS = AUTHORIZATION / BOUNDED_IMPLEMENTATION
STATUS = AUTHORIZATION_CANDIDATE / NOT_CANONICAL
CANONICAL_BASE_MAIN = e9b1fae1afbd1c2b9831d4e69e395efdef18dba8
PREDECESSOR = PR #554 / POST_P8_BOUNDED_CLOSEOUT_CURRENT_VIEW_RECONCILIATION / CLOSED_CANONICAL
PREDECESSOR_POST_MERGE_PROOF = 5610494612
SUCCESSOR_ANALYSIS = PR #554 / comment 5610533320 / ANALYSIS_ONLY
P9_PLANNING_DIRECTION = PR #381 / proof 5555071864 / PLANNING_ONLY
FOUNDER_CONTINUATION_AUTHORITY = EXPLICIT_KODAC_CONTINUATION_WITH_ORDINARY_AUTHORIZED_APPROVALS_2026-09-10
WAIVER = NO
```

This one-path record is only an authorization candidate. It creates no implementation authority until this exact authorization independently qualifies, merges normally into protected `main` with an exact expected-head precondition, and receives complete external post-merge proof.

The authorization is derived from a concrete residual gap proved by fresh live-code inspection, not from P9 numbering alone.
## Exact authorization-candidate path

This candidate may add exactly one path:

```text
docs/planning/KODAC_P9_R1_FRESHNESS_DEPENDENCY_INVALIDATION_AUTHORIZATION_2026-09-10.md
```

No source, test, schema, package, bin, workflow, dependency, lockfile, current-view, product-contract, README, release, tag, artifact, ruleset, or repository-protection path may change in this authorization candidate.

## Evidence-driven residual gap

Canonical mechanisms already prove several bounded freshness behaviors:

```text
P5_R1 = CALLER_SUPPLIED CURRENT | STALE FRESHNESS + BASIS IDENTITY
P5_R2 = PURE SINGLE EVIDENCE RELATION EDGE
K5_R4 = EXPLICIT STALE / REVISION-MISMATCH RECONCILIATION
KRI = EXACT-HEAD REVIEW RUN / FINDING STALENESS
K3 = STALE REPOSITORY SNAPSHOT REJECTION
```

None of those mechanisms performs generic dependency-aware freshness invalidation over multiple authority/environment identities.
Current canonical records repeatedly preserve:

```text
AUTOMATIC_FRESHNESS_DEPENDENCY_INVALIDATION = NOT_AUTHORIZED
```

Canonical P9 planning identifies the missing target flow:

```text
BOUND_IDENTITY_CHANGED
-> IMPACTED_WORKFLOW_OR_EVIDENCE_FOUND
-> STATE_MARKED_STALE
-> CONTINUATION_BLOCKED
-> TARGETED_REQUALIFICATION
```

The minimum first foundation is therefore a pure deterministic evaluator over caller-supplied dependency identities. It does not observe external systems and does not execute requalification.

## Conditionally authorized implementation paths

Only after this authorization becomes externally proven `CLOSED_CANONICAL` may one later implementation candidate modify exactly:

```text
packages/kodac-runtime/src/continuous-assurance/p9-r1-freshness-dependency-invalidation.ts
packages/kodac-runtime/test/p9-r1-freshness-dependency-invalidation.test.ts
schema/p9-r1-freshness-dependency-invalidation.schema.json
```
No fourth path is authorized. Existing P5/K5/KRI/K3 files remain unchanged. No package-root export is authorized.

## Bounded P9-R1 semantic contract

The future implementation may define one pure/data-only protocol:

```text
VERSION = p9-r1-freshness-dependency-invalidation-v1
INPUT = ONE SUBJECT + ONE EXACT REPOSITORY REVISION + 1..64 CALLER-SUPPLIED DEPENDENCIES
OUTPUT_STATE = CURRENT | STALE | UNKNOWN
CONTINUATION = ALLOW | BLOCK
IDENTITY = SHA256 OF DETERMINISTIC NORMALIZED DECISION PREIMAGE
```

The subject must bind:

```text
subjectIdentity = lowercase SHA-256
revision.repositoryId = bounded non-empty NUL-free text
revision.canonicalBase = lowercase Git SHA-1 / 40 hex
revision.candidateHead = lowercase Git SHA-1 / 40 hex
```

P9-R1 does not validate that the subject exists or that the caller's revision is live. It validates only the bounded data contract.
Each dependency must contain exactly:

```text
dependencyClass
dependencyKey
expectedIdentity
observedIdentity
```

Allowed dependency classes are bounded to the canonical P9 trigger families:

```text
PR_HEAD
RULESET
AUTHORIZATION
SKILL
WORKFLOW_DEFINITION
PROVIDER_MODEL_CONFIG
SANDBOX_IMAGE
DEPENDENCY_LOCKFILE
SECURITY_INTELLIGENCE
```

`dependencyKey` must be an ASCII canonical key of 1..256 characters matching `[a-z0-9][a-z0-9._:/-]*`. Keys must be unique. `expectedIdentity` is a lowercase 64-hex SHA-256 identity. `observedIdentity` is either a lowercase 64-hex SHA-256 identity or `null` when the caller has no trusted observation.
The implementation must canonicalize the dependency list by exact `dependencyKey` scalar order before deriving output identity. Input order must not change semantic output.

## Deterministic state derivation

State and continuation must be derived, never caller-selected:

```text
IF ANY observedIdentity != null AND observedIdentity != expectedIdentity
  STATE = STALE
ELSE IF ANY observedIdentity == null
  STATE = UNKNOWN
ELSE
  STATE = CURRENT

CONTINUATION = ALLOW IFF STATE == CURRENT
CONTINUATION = BLOCK OTHERWISE
```

`STALE` therefore has precedence over `UNKNOWN`, because one proven changed bound identity is sufficient to invalidate the subject even if another dependency is unobserved.

The output must include canonical duplicate-free arrays:

```text
changedDependencyKeys = keys with non-null observedIdentity != expectedIdentity
unknownDependencyKeys = keys with observedIdentity == null
```
For `CURRENT`, both arrays are empty. For `UNKNOWN`, `changedDependencyKeys` is empty and `unknownDependencyKeys` is non-empty. For `STALE`, `changedDependencyKeys` is non-empty and `unknownDependencyKeys` may also be non-empty.

## Decision identity and validation

The output must contain a lowercase 64-hex `decisionIdentity` derived from a deterministic JSON preimage containing only normalized semantic fields in fixed key order:

```text
version
subjectIdentity
revision
dependencies
state
continuation
changedDependencyKeys
unknownDependencyKeys
```

Runtime validation must recompute all derived fields and `decisionIdentity`; caller-supplied forged state, continuation, changed/unknown sets, ordering, or identity must fail closed.

Builder and validator outputs must be detached and frozen. Caller mutation after construction must not alter the canonical output.

No raw dependency value, secret, credential, token, URL response, package content, model output, or external payload belongs in this contract. Dependencies are represented only by caller-materialized identities and bounded keys/classes.
## Required hostile-input boundary

The implementation must fail closed on malformed or hostile structured input, including:

```text
null / arrays / unsupported prototypes
Proxy objects or revoked Proxies where fail-closed pre-detection is available
symbol-keyed fields
non-enumerable or accessor properties
unknown or missing fields
invalid Git/SHA identities
empty / malformed / overlong dependency keys
unsupported dependency classes
duplicate dependency keys
zero dependencies or more than 64 dependencies
forged derived arrays, state, continuation or decision identity
```

Validation must not intentionally invoke caller-owned getters or mutation hooks. No cycle traversal is required because the authorized structure is bounded and shallow.

## Composition boundary

```text
P9_R1 != P5_R1_PROVENANCE_BINDING
P9_R1 != P5_R2_EVIDENCE_RELATION_EDGE
P9_R1 != K5_PROOF_RECONCILIATION
P9_R1 != KRI_HEAD_STALENESS
P9_R1 != PROOFGRAPH
P9_R1 != DEPENDENCY_INDEX_OR_GRAPH
```
```text
P9_R1 != IMPACTED_SUBJECT_DISCOVERY
P9_R1 != EXTERNAL_STATE_OBSERVATION
P9_R1 != AUTOMATIC_MONITORING
P9_R1 != TARGETED_REQUALIFICATION_EXECUTION
```

A later unit may consume this pure decision only after separate analysis and authorization. This unit itself performs no side effect and grants no authority based on `ALLOW` beyond reporting the bounded decision.

## Explicit non-grants

```text
NETWORK = NOT_AUTHORIZED
SCHEDULER_BACKGROUND_WATCHER = NOT_AUTHORIZED
GITHUB_APP_WEBHOOK = NOT_AUTHORIZED
SECURITY_FEED_INTEGRATION = NOT_AUTHORIZED
PERSISTENCE_DATABASE = NOT_AUTHORIZED
TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
PROVIDER_MODEL_REVIEWER_VERIFIER_INVOCATION = NOT_AUTHORIZED
SANDBOX_EXECUTION = NOT_AUTHORIZED
DEPENDENCY_INSTALLATION = NOT_AUTHORIZED
WORKFLOW_RESUME_CANCELLATION_ENGINE = NOT_AUTHORIZED
TARGETED_REQUALIFICATION_EXECUTION = NOT_AUTHORIZED
AUTOFIX_PATCH_WRITE_K2_EXECUTION = NOT_AUTHORIZED
K5_DONE_GATE_MUTATION = NOT_AUTHORIZED
PACKAGE_ROOT_CLI_API_PRODUCT_EXPORT = NOT_AUTHORIZED
NEW_DEPENDENCY_DONOR_SOURCE_ADMISSION = NOT_AUTHORIZED
```
```text
P9_R2_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9_OVERALL = NOT_CLOSED
P8_OVERALL = NOT_CLOSED
P2_OVERALL = OPEN
P3_OVERALL = OPEN
P4_OVERALL = OPEN
P5_OVERALL = NOT_CLOSED
P6_OVERALL = NOT_CLOSED
P7_OVERALL = NOT_CLOSED
GENERAL_PUBLIC_KODACBENCH = NOT_CLOSED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
REBASE_FORCE_PUSH_HISTORY_REWRITE = NOT_AUTHORIZED
WAIVER = NO
```

## Required future implementation tests

The exact three-path implementation must prove at minimum:

1. one matching dependency derives `CURRENT` and `ALLOW`;
2. multiple matching dependencies remain `CURRENT` independent of caller order;
3. one changed observed identity derives `STALE` and `BLOCK`;
4. multiple changed dependencies produce canonical sorted `changedDependencyKeys`;
5. one null observation with no mismatch derives `UNKNOWN` and `BLOCK`;
6. a known mismatch plus an unknown dependency derives `STALE`, preserving both changed and unknown key sets;
7. duplicate dependency keys are rejected;
8. empty and over-64 dependency sets are rejected;
9. unsupported dependency classes are rejected;
10. malformed/uppercase/wrong-length SHA identities are rejected;
11. malformed repository revision fields are rejected;
12. malformed, uppercase, empty, non-ASCII, or overlong dependency keys are rejected;
13. unknown/missing fields are rejected at every object layer;
14. arrays/null/non-plain objects/prototypes/symbol/accessor/non-enumerable fields fail closed;
15. Proxy and revoked-Proxy inputs fail closed without intentional caller trap execution where supported;
16. caller dependency order does not change normalized output or `decisionIdentity`;
17. any semantic subject/revision/dependency change changes `decisionIdentity`;
18. forged state/continuation/changed-set/unknown-set/identity is rejected by runtime validation;
19. built and validated outputs are detached/frozen;
20. runtime and JSON Schema accept/reject the same canonical boundary fixtures;
21. no external state lookup, network, filesystem, provider, K2, persistence, telemetry, or side effect occurs;
22. no existing P5/K5/KRI/K3 source or schema path changes.

## Candidate qualification gate

The later implementation must independently qualify on one unchanged exact head with exactly the three authorized paths and no fourth path. Required repository CI, focused tests, full runtime tests, typecheck/lint if applicable, semantic/security review, zero actionable findings, zero unresolved actionable threads, and active no-bypass ruleset `20707483` are mandatory.
## Authorization qualification and closure

Before this authorization candidate may merge, it must independently prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
AUTHORIZATION_BLOB = FROZEN
PREDECESSOR_POST_MERGE_PROOF_BOUND = PASS
SUCCESSOR_ANALYSIS_BOUND = PASS
CANONICAL_P9_PLANNING_DIRECTION_BOUND = PASS
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_NORMAL_MERGE = REQUIRED
POST_MERGE_EXTERNAL_PROOF = REQUIRED
WAIVER = NO
```

Any head/base/path/check/review/ruleset movement invalidates qualification.

This record cannot certify itself. Only complete external post-merge proof may classify `P9_R1_FRESHNESS_DEPENDENCY_INVALIDATION_AUTHORIZATION = CLOSED_CANONICAL`. Even then, only the exact three-path implementation becomes eligible; P9-R2+, external monitoring, targeted requalification, P9 overall closure, release/publication/deployment, and project completion remain separately unauthorized.
