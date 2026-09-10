# Kodac P9-R2 Bounded Impacted Subject Resolution Authorization — 2026-09-10

## Classification

```text
CLASS = AUTHORIZATION / DOCUMENTATION_ONLY
STATUS = AUTHORIZATION_CANDIDATE / NOT_CANONICAL
CANONICAL_BASE_MAIN = 6bf049a626f87608b7592a55531408a6f258ed23
PREDECESSOR = PR #558 / P9_R1_POST_MERGE_CURRENT_VIEW_RECONCILIATION / CLOSED_CANONICAL
PREDECESSOR_MERGE = 6bf049a626f87608b7592a55531408a6f258ed23
PREDECESSOR_POST_MERGE_PROOF = 5611355037
CANONICAL_P9_PLANNING = PR #381 / proof 5555071864 / PLANNING_DIRECTION_ONLY
SUCCESSOR_ANALYSIS = PR #558 / comment 5611389615 / ANALYSIS_ONLY
FOUNDER_CONTINUATION_AUTHORITY = EXPLICIT_KODAC_CONTINUATION_WITH_ORDINARY_AUTHORIZED_APPROVALS_2026-09-10
WAIVER = NO
```

This one-path record is only an authorization candidate. It creates no implementation authority until this exact authorization independently qualifies, merges normally into protected `main` with an exact expected-head precondition, and receives complete external post-merge proof.

## Exact authorization-candidate path

This candidate may add exactly one path:

```text
docs/planning/KODAC_P9_R2_BOUNDED_IMPACTED_SUBJECT_RESOLUTION_AUTHORIZATION_2026-09-10.md
```

No source, test, schema, package, bin, workflow, dependency, lockfile, current-view, product-contract, README, release, tag, artifact, ruleset, or repository-protection path may change in this authorization candidate.

## Proven predecessor boundary

P9-R1 is already externally proven only as a pure, caller-materialized per-subject freshness evaluator:

```text
P9_R1_AUTHORIZATION = CLOSED_CANONICAL / PR #555 / proof 5610646762
P9_R1_IMPLEMENTATION = CLOSED_CANONICAL / PR #556 / proof 5611220666
P9_R1_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #558 / proof 5611355037
P9_R1_SOURCE_BLOB = 7114a87ecc465d08d524252834f414203dc96a43
P9_R1_TEST_BLOB = e2b54db06c5e550f8468d2d1f65a696facd471d6
P9_R1_SCHEMA_BLOB = 0c3e11a69b526e7505924a637b867f146d3158ac
P9_R1_KNOWN_MISMATCH = STALE / BLOCK
P9_R1_MISSING_OBSERVATION_WITHOUT_MISMATCH = UNKNOWN / BLOCK
P9_R1_ALL_MATCHING = CURRENT / ALLOW
```

P9-R1 intentionally does not discover which bounded subjects are impacted by a dependency change.

## Existing-surface non-duplication boundary

Fresh source inspection established:

```text
K3_R6_RELATION_GRAPH = REPOSITORY_SNAPSHOT_FILE_SYMBOL_GRAPH_ONLY
K3_R6_IMPACT = REVERSE_CODE_RELATION_TRAVERSAL_ONLY
P5_R2_EVIDENCE_RELATION = SUPPORTS | CONTRADICTS | SUPERSEDES ONLY
GENERAL_DURABLE_WORKFLOW_RUN_IDENTITY = NOT_ESTABLISHED_AS_REUSABLE_P9_CONTRACT
```

Therefore P9-R2 must not mutate or reinterpret K3-R6 or P5-R2. It must not invent a workflow/evidence type taxonomy. P9 subject identities remain opaque SHA-256 identities.

## Conditionally authorized implementation paths

Only after this authorization becomes externally proven `CLOSED_CANONICAL` may one later implementation candidate modify exactly:

```text
packages/kodac-runtime/src/continuous-assurance/p9-r2-impacted-subject-resolution.ts
packages/kodac-runtime/test/p9-r2-impacted-subject-resolution.test.ts
schema/p9-r2-impacted-subject-resolution.schema.json
```

No fourth path is authorized. The P9-R1 implementation and schema remain unchanged. No package-root export is authorized.

## Bounded P9-R2 semantic contract

The future implementation may define one pure/data-only resolver over caller-materialized P9-R1 decisions.

### Input

```text
revision = {
  repositoryId,
  canonicalBase,
  candidateHead
}
changedDependencyKeys[]
subjectDecisions[]
```

Required bounds:

```text
1 <= changedDependencyKeys.length <= 64
1 <= subjectDecisions.length <= 256
changedDependencyKey = canonical P9 dependency-key grammar
subjectDecision = exact valid P9-R1 freshness decision
all subjectDecisions bind exactly the query revision
subjectIdentity values are unique within one query
subject decisionIdentity values are unique within one query
```

The resolver must call the canonical P9-R1 decision validator for every supplied subject decision. It must not trust caller-provided P9-R1 `state`, `continuation`, `changedDependencyKeys`, `unknownDependencyKeys`, dependency order, or `decisionIdentity` without that validation.

Caller ordering is not semantic. The resolver must canonicalize changed dependency keys and subject decisions before deriving output identity.

### Impact rule

For each validated P9-R1 subject decision:

```text
matchedChangedDependencyKeys =
  intersection(query.changedDependencyKeys, decision.changedDependencyKeys)

if matchedChangedDependencyKeys.length > 0:
  subject is IMPACTED
else:
  subject is NOT_IMPACTED_BY_THIS_QUERY
```

A `CURRENT` or `UNKNOWN` P9-R1 decision therefore cannot become impacted merely because the query names a dependency key; impact requires a P9-R1-proven changed dependency for that subject.

A P9-R1 `STALE` decision may remain not impacted by one specific query when its changed keys are disjoint from the query's changed keys.

### Output

The serialized result must contain exactly:

```text
version
revision
changedDependencyKeys
subjectDecisionIdentities
impactedSubjects
unmatchedChangedDependencyKeys
resultIdentity
```

Each impacted subject record must contain exactly:

```text
subjectIdentity
decisionIdentity
matchedChangedDependencyKeys
```

Canonical output rules:

```text
changedDependencyKeys = strictly sorted / duplicate-free
subjectDecisionIdentities = strictly sorted / duplicate-free
impactedSubjects = strictly sorted by subjectIdentity
matchedChangedDependencyKeys = strictly sorted / duplicate-free
unmatchedChangedDependencyKeys = query changed keys that matched no impacted subject / strictly sorted
```

`resultIdentity` must be a deterministic lowercase SHA-256 identity over the complete canonical semantic result preimage excluding only `resultIdentity` itself. It must bind the exact revision, canonical changed-key set, complete supplied P9-R1 decision-identity set, impacted-subject projection, and unmatched-key set.

An empty impacted-subject array is a valid complete result when none of the supplied validated decisions proves a changed key named by the query. Empty impact must not be represented as success beyond the bounded input set; P9-R2 does not claim global completeness outside the caller-supplied decision set.

## Hostile-input and determinism requirements

The implementation must fail closed on malformed, oversized, duplicate, cross-revision, unknown-field, non-enumerable, accessor-bearing, symbol-bearing, sparse-array, subclass/prototype, active Proxy, and revoked Proxy inputs before intentionally invoking caller-owned getters or proxy traps.

Returned structures must be detached from caller-owned containers and deeply frozen. Mutation of caller input after construction must not change an already-built result.

Deterministic identity must not depend on object insertion order, caller array order, wall clock, random state, environment variables, filesystem state, process state, network state, provider/model state, or repository reads.

## Schema boundary

The authorized JSON Schema describes only the serialized P9-R2 result structural surface and bounded enums/patterns/cardinality. Runtime validation remains authoritative for cross-field semantic facts that JSON Schema cannot prove, including:

```text
P9_R1_DECISION_VALIDITY
SAME_REVISION_BINDING
DECISION_IDENTITY_UNIQUENESS
SUBJECT_IDENTITY_UNIQUENESS
EXACT_IMPACT_INTERSECTION
EXACT_UNMATCHED_KEY_DERIVATION
CANONICAL_ORDERING
RESULT_IDENTITY_RECOMPUTATION
```

The schema must not broaden runtime acceptance.

## Required non-equivalences

```text
P9_R2 != EXTERNAL_STATE_OBSERVATION
P9_R2 != AUTOMATIC_MONITORING_OR_WATCHER
P9_R2 != PERSISTENT_DEPENDENCY_INDEX
P9_R2 != K3_R6_RELATION_GRAPH_EXTENSION
P9_R2 != P5_R2_EVIDENCE_RELATION_EXTENSION
P9_R2 != WORKFLOW_OR_EVIDENCE_TYPE_CLASSIFICATION
P9_R2 != STALE_STATE_MUTATION
P9_R2 != WORKFLOW_STATE_MUTATION
P9_R2 != TARGETED_REQUALIFICATION_EXECUTION
P9_R2 != SCHEDULER_OR_WEBHOOK
P9_R2 != NETWORK_OR_FILESYSTEM_DISCOVERY
P9_R2 != PROVIDER_OR_MODEL_INVOCATION
P9_R2 != K2_MUTATION_OR_AUTOFIX
P9_R2 != GLOBAL_IMPACT_COMPLETENESS_CLAIM
```

## Explicit non-grants

```text
P9_R1_MUTATION = NOT_AUTHORIZED
K3_RELATION_GRAPH_MUTATION = NOT_AUTHORIZED
P5_RELATION_MUTATION = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_BIN_METADATA_VERSION_MUTATION = NOT_AUTHORIZED
WORKFLOW_DEPENDENCY_LOCKFILE_MUTATION = NOT_AUTHORIZED
CURRENT_VIEW_MUTATION = NOT_AUTHORIZED_IN_IMPLEMENTATION
EXTERNAL_STATE_OBSERVATION = NOT_AUTHORIZED
AUTOMATIC_MONITORING_WATCHERS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_CACHE_INDEX = NOT_AUTHORIZED
SCHEDULER_WEBHOOK_EVENT_INGESTION = NOT_AUTHORIZED
NETWORK_FILESYSTEM_PROVIDER_MODEL_CALLS = NOT_AUTHORIZED
STALE_OR_WORKFLOW_STATE_MUTATION = NOT_AUTHORIZED
TARGETED_REQUALIFICATION_EXECUTION = NOT_AUTHORIZED
K2_AUTOFIX_PATCH_WRITE = NOT_AUTHORIZED
P9_R3_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9_OVERALL = NOT_CLOSED
P2_OVERALL = OPEN
P3_OVERALL = OPEN
P4_OVERALL = OPEN
P5_OVERALL = NOT_CLOSED
P6_OVERALL = NOT_CLOSED
P7_OVERALL = NOT_CLOSED
P8_OVERALL = NOT_CLOSED
GENERAL_PUBLIC_KODACBENCH = NOT_CLOSED
KODAC_RELEASE_VERSION = NOT_SELECTED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PRODUCTION_READINESS_CLAIM = NOT_AUTHORIZED
BRAND_OR_LEGAL_CLAIM = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
REBASE_FORCE_PUSH_HISTORY_REWRITE = NOT_AUTHORIZED
WAIVER = NO
```

## Minimum implementation proof obligations

The exact three-path future candidate must prove at minimum:

1. one validated stale P9-R1 decision with one queried changed key produces one impacted subject;
2. one current decision produces no impact for a merely named query key;
3. one unknown decision produces no impact for a merely named query key;
4. a stale decision whose changed keys are disjoint from the query produces no impact;
5. multiple matching keys on one subject are preserved canonically;
6. multiple subjects are sorted canonically independent of caller order;
7. changed dependency keys are order-independent and duplicate input keys are rejected;
8. duplicate subject identities are rejected;
9. duplicate decision identities are rejected;
10. every supplied P9-R1 decision is independently validated and a forged/tampered decision is rejected;
11. any query/decision revision mismatch is rejected;
12. unmatched changed dependency keys are derived exactly;
13. empty impacted-subject output is explicit and deterministic;
14. changed-key, subject-count, text, identity, and revision bounds fail closed;
15. unknown/missing fields fail closed at every accepted object layer;
16. sparse, accessor-bearing, symbol-bearing, prototype/subclass, active-Proxy, and revoked-Proxy inputs fail closed without intentional caller trap/getter execution;
17. result identity changes for every semantic revision/key/decision-set/impact change and is invariant to caller ordering;
18. validator rejects forged impacted subjects, matched keys, unmatched keys, decision identity set, order, revision, or result identity;
19. builder and validator return detached deeply frozen structures;
20. JSON Schema and runtime agree on canonical valid/invalid serialized boundary fixtures;
21. production imports are limited to deterministic standard-library support plus the canonical P9-R1 validator/type surface;
22. no network, filesystem, process execution, clock, randomness, environment, provider/model, persistence, scheduling, webhook, K2, or mutation side effect occurs;
23. no P9-R1, K3-R6, P5-R2, package-root, workflow, dependency, lockfile, or current-view path changes.

## Qualification and closure gate

The later implementation must independently qualify on one unchanged exact head with exactly the three authorized paths and no fourth path. Required local/repository tests, strict TypeScript, focused P9-R2 tests, full runtime regression tests, Python/Ruff/provenance gates, semantic/security review, zero actionable findings, zero unresolved actionable review threads, and active no-bypass ruleset `20707483` are mandatory.

Before guarded merge of this authorization candidate itself:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
AUTHORIZATION_BLOB = FROZEN_INDEXED_GIT_BLOB
PREDECESSOR_POST_MERGE_PROOF_BOUND = PASS
CANONICAL_P9_PLANNING_PROOF_BOUND = PASS
SUCCESSOR_ANALYSIS_BOUND = PASS
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

This authorization cannot certify itself. Only complete external post-merge proof may classify `P9_R2_BOUNDED_IMPACTED_SUBJECT_RESOLUTION_AUTHORIZATION = CLOSED_CANONICAL`. Even then, only the exact three-path implementation becomes eligible. P9-R3+, external observation, stale-state mutation, targeted requalification, P9 overall closure, public release/package publication/deployment, and project completion remain separately unauthorized.
