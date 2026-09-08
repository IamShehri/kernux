# Kodac P7-R27 — Post-merge Current-view Reconciliation Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_CURRENT_VIEW_WRITE_AUTHORITY UNTIL MERGED AND POST-PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = a2115231473007940eb2334d920268e92b468c37
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = 888ac7686d588c8290b1e9b88b4f8e665eae9b50
P7_R26_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #464 / proof 5586759046
POST_R26_SUCCESSOR_AUTHORITY_ANALYSIS = PR #464 / comment 5586846775 / ANALYSIS_ONLY
P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BINDING_AUTHORIZATION = CLOSED_CANONICAL / PR #465 / proof 5586957364
P7_R27_FEASIBILITY_ANALYSIS = PR #465 / comment 5587003085 / ANALYSIS_ONLY
P7_R27_AUTHORIZATION_AMENDMENT = CLOSED_CANONICAL / PR #466 / proof 5587072276
P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BINDING_IMPLEMENTATION = CLOSED_CANONICAL / PR #467 / proof 5587661329 / PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
P7_R27_CURRENT_VIEW_DRIFT_ANALYSIS = PR #467 / comment 5587697738 / ANALYSIS_ONLY
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This record is documentation-governance authority only. It creates no current-view write authority unless this exact authorization candidate independently qualifies, merges normally through protected `main` with an exact expected-head guard, and receives complete mandatory post-merge activation proof.

Live GitHub truth, root `AGENTS.md`, exact canonical authorization/evidence records and active ruleset `20707483` override this document.

## 2. Why reconciliation is required

Fresh post-R27 drift analysis `5587697738` established that all five canonical current-state views still contain the exact R26 reconciliation-candidate blobs merged by PR #464. They still describe P7-R26 post-merge current-view reconciliation as `CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL`, still block post-R26 successor analysis, and omit the canonical R27 authorization, feasibility amendment chain and implementation closure.

Those statements were historical candidate truth before R26 reconciliation proof `5586759046` and the later R27 chain, but they are stale against live canonical `main` after:

```text
P7_R26_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / proof 5586759046
POST_R26_SUCCESSOR_AUTHORITY_ANALYSIS = ANALYSIS_ONLY / 5586846775
P7_R27_AUTHORIZATION = CLOSED_CANONICAL / proof 5586957364
P7_R27_FEASIBILITY_ANALYSIS = ANALYSIS_ONLY / 5587003085
P7_R27_AUTHORIZATION_AMENDMENT = CLOSED_CANONICAL / proof 5587072276
P7_R27_IMPLEMENTATION = CLOSED_CANONICAL / proof 5587661329 / PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
```

The future reconciliation may update current-state prose only. It must not rewrite historical authorization/evidence records, manufacture A6/later authority, broaden R27 semantics, or convert bounded provider-attempt/termination evidence into provider invocation, provider authenticity, termination authenticity, complete review, Done Gate, release or project-completion truth.

## 3. Exact future reconciliation allowlist

Only after this authorization itself becomes `CLOSED_CANONICAL` may one later reconciliation candidate modify exactly these five paths:

```text
docs/roadmap/NEXT.md
docs/roadmap/ROADMAP.md
docs/roadmap/MILESTONES.md
docs/roadmap/VERSION_PLAN.md
docs/product/STATUS.md
```

No sixth path is authorized.

The current canonical preimage blobs observed by drift analysis are:

```text
docs/roadmap/NEXT.md = 708bec9c22fb5e26cef6fa284a65a0c665a7612f
docs/roadmap/ROADMAP.md = 261658188202803e7821cd32ff26eee8f5a19878
docs/roadmap/MILESTONES.md = b62b50ae52946ba7dbc8fc81a90aee5dde9333c3
docs/roadmap/VERSION_PLAN.md = 308a1466f667a5af270c9ef9828f3178e78ff52b
docs/product/STATUS.md = e8c0cf6a04f9807a86fafcad92cf8e48c07aae6e
```

These preimages are observations, not permission to overwrite intervening changes. A later reconciliation candidate must start from the then-live canonical `main`; if any preimage changes, it must preserve unrelated live changes and requalify on its own exact head.

This authorization does not permit changes to:

```text
packages/**
schema/**
tests/**
.github/**
provenance/**
historical docs/planning authorization/evidence records
AGENTS.md
package manifests or lockfiles
rulesets or repository protection
release/package/deployment configuration
```

If correct reconciliation requires any sixth path, stop and create a separately scoped canonical authorization amendment instead of expanding this unit.

## 4. Exact facts the five views may record

The future reconciliation may record these already-proven facts and necessary explanatory context:

```text
P7_R26_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #464 / proof 5586759046
POST_R26_SUCCESSOR_AUTHORITY_ANALYSIS = PR #464 / comment 5586846775 / ANALYSIS_ONLY
P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BINDING_AUTHORIZATION = CLOSED_CANONICAL / PR #465 / proof 5586957364
P7_R27_FEASIBILITY_ANALYSIS = PR #465 / comment 5587003085 / ANALYSIS_ONLY
P7_R27_AUTHORIZATION_AMENDMENT = CLOSED_CANONICAL / PR #466 / proof 5587072276
P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BINDING_IMPLEMENTATION = CLOSED_CANONICAL / PR #467 / proof 5587661329 / PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
P7_R27_CURRENT_VIEW_DRIFT_ANALYSIS = PR #467 / comment 5587697738 / ANALYSIS_ONLY
P7_R27_POST_MERGE_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL / THIS_AUTHORIZATION_POST_MERGE_PROOF
P7_R27_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
POST_R27_SUCCESSOR_ANALYSIS = BLOCKED_UNTIL_RECONCILIATION_CLOSURE
A6_OR_LATER_IMPLEMENTATION = NOT_AUTHORIZED_BY_NUMBERING_OR_PLAN_COMPOSITION
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

The future reconciliation must preserve all still-effective predecessor state and non-grants. Omission from a condensed current-state view must not be represented as authorization, waiver, supersession, proof or narrowing.

## 5. Required R27 bounded semantics to preserve

The five views may summarize R27 only at its exact proven state:

```text
P7_R27_STATE = PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
```

Purpose-equivalent summary is allowed only if it preserves these facts:

- R27 awaits exact canonical P7-R22 review-context validation and validates exact canonical P7-R26 skill-coverage evidence;
- R22 remains the review-run/context lineage carrier;
- R26 remains the repository/base/head/tree/change-set/review-universe lineage carrier;
- R27 rejects repository/base/head mismatch between validated R22 and R26 records;
- optional P5-R1 provenance is validated and revision-bound when supplied;
- provider/model/configuration/prompt-policy/tool-policy identities remain caller-supplied evidence identities only;
- the termination vocabulary remains closed to `COMPLETED | TOKEN_LIMIT | TOOL_LIMIT | TIMEOUT | CANCELLED | PROVIDER_ERROR | POLICY_STOP | BUDGET_EXHAUSTED | UNKNOWN`;
- `COMPLETED` requires a completion timestamp and explicit `NOT_TRUNCATED` evidence but remains caller-asserted completion only;
- all non-`COMPLETED` termination reasons remain explicit completion debt;
- retry lineage is evidence only and grants no retry authority;
- the implementation is bounded, deterministic, deeply immutable and side-effect-free.

Mandatory non-equivalences:

```text
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != PROVIDER_INVOCATION_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != PROVIDER_AUTHENTICITY_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != TERMINATION_REASON_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != EXTERNAL_CLOCK_AUTHENTICITY_PROOF
CALLER_ASSERTED_PROVIDER_IDENTITY != VERIFIED_PROVIDER_IDENTITY
CALLER_ASSERTED_MODEL_IDENTITY != VERIFIED_MODEL_IDENTITY
CALLER_ASSERTED_COMPLETED != VERIFIED_COMPLETE_REVIEW
TERMINATION_REASON_COMPLETED != FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF
UNKNOWN != COMPLETED
TOKEN_LIMIT != COMPLETED
TOOL_LIMIT != COMPLETED
TIMEOUT != COMPLETED
CANCELLED != COMPLETED
PROVIDER_ERROR != COMPLETED
POLICY_STOP != COMPLETED
BUDGET_EXHAUSTED != COMPLETED
OUTPUT_NOT_TRUNCATED_REFERENCE != VERIFIED_OUTPUT_COMPLETENESS
RETRY_LINEAGE_REFERENCE != RETRY_AUTHORITY
P5_PROVENANCE != PROVIDER_INVOCATION_PROOF
P5_PROVENANCE != PROVIDER_AUTHENTICITY_PROOF
P7_R27_CLOSED != P7_OVERALL_CLOSED
P7_R27_CLOSED != K5_RECONCILIATION_PROOF
P7_R27_CLOSED != DONE_GATE_PROOF
P7_R27_CLOSED != RELEASE_AUTHORITY
P7_R27_CLOSED != PROJECT_COMPLETION
```

All predecessor R26 skill-coverage boundaries remain in force as well.

## 6. Preserved global authority boundaries

The future reconciliation must continue to show or preserve the effect of these boundaries:

```text
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_DONE_GATE_AUTHORITY = UNCHANGED
PROOFGRAPH = NOT_AUTHORIZED
AUTOMATIC_FRESHNESS_DEPENDENCY_INVALIDATION = NOT_AUTHORIZED
PATCH_RETRY = NOT_AUTHORIZED
AUTOFIX_REMEDIATION_EXECUTION = NOT_AUTHORIZED
SKILL_TRUST_QUALIFICATION = NOT_AUTHORIZED
SKILL_INSTALLATION_ACTIVATION_ROUTING_EXECUTION = NOT_AUTHORIZED
CAPABILITY_APPROVAL = NOT_AUTHORIZED
K2_INVOCATION = NOT_AUTHORIZED_BY_THIS_RECONCILIATION
K2_APPROVAL_CREATION = NOT_AUTHORIZED
VERIFICATION_ENGINE_INVOCATION = NOT_AUTHORIZED_BY_THIS_RECONCILIATION
VERIFICATION_EXECUTION = NOT_AUTHORIZED
LIVE_REVIEWER_PROVIDER_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
PROVIDER_RETRY_REPLAY_RESUME = NOT_AUTHORIZED
PROVIDER_SPEND = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
RISK_COVERAGE_PROOF = NOT_ESTABLISHED
SKILL_COVERAGE_PROOF = NOT_ESTABLISHED
PROVIDER_TERMINATION_REASON_PROOF = NOT_ESTABLISHED
FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF = NOT_ESTABLISHED
P7_TO_K5_RECONCILIATION_PROOF = NOT_ESTABLISHED
DONE_GATE_INVOCATION_OR_MUTATION = NOT_AUTHORIZED
A6_OR_LATER_IMPLEMENTATION = NOT_AUTHORIZED_BY_NUMBERING_OR_PLAN_COMPOSITION
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## 7. No successor authority

This authorization is not A6 or any other successor implementation authorization and must not be used as one.

```text
P7_R27_RECONCILIATION_AUTHORIZATION != A6_AUTHORIZATION
P7_R27_RECONCILIATION_CLOSED != A6_AUTHORIZATION
P7_R27_RECONCILIATION_CLOSED != POST_R27_SUCCESSOR_IMPLEMENTATION_AUTHORITY
PLAN_SEQUENCE != IMPLEMENTATION_AUTHORITY
NUMBERING != IMPLEMENTATION_AUTHORITY
```

Only after the future five-view reconciliation itself independently qualifies, merges guarded and receives complete post-merge proof may a fresh successor-authority analysis begin from the resulting live `main`.

## 8. Qualification requirements for this authorization candidate

This one-path documentation-only candidate may qualify only if one unchanged exact head proves:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
R26_RECONCILIATION_PROOF = EXACTLY_REVERIFIED / 5586759046
POST_R26_SUCCESSOR_ANALYSIS = EXACTLY_REVERIFIED / 5586846775 / ANALYSIS_ONLY
R27_AUTHORIZATION_PROOF = EXACTLY_REVERIFIED / 5586957364
R27_FEASIBILITY_ANALYSIS = EXACTLY_REVERIFIED / 5587003085 / ANALYSIS_ONLY
R27_AUTHORIZATION_AMENDMENT_PROOF = EXACTLY_REVERIFIED / 5587072276
R27_IMPLEMENTATION_PROOF = EXACTLY_REVERIFIED / 5587661329
R27_IMPLEMENTATION_STATE = PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
R27_CURRENT_VIEW_DRIFT_ANALYSIS = EXACTLY_REVERIFIED / 5587697738 / ANALYSIS_ONLY
FUTURE_RECONCILIATION_ALLOWLIST = EXACTLY_5_PATHS
REQUIRED_CI = TERMINAL_SUCCESS OR CANONICALLY_PROVEN PATH_FILTER_NON_APPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
WAIVER = NO
```

Any new candidate commit invalidates previous exact-head review and CI evidence.

## 9. Mandatory post-merge proof for this authorization

The authorization becomes canonical only after proof establishes at minimum:

```text
PR = CLOSED / MERGED
CANONICAL_MAIN = exact merge commit
ORDERED_PARENT_1 = exact pre-merge canonical main
ORDERED_PARENT_2 = exact qualified authorization head
MERGE_TREE = exact qualified-head tree
AUTHORIZATION_BLOB_ON_MAIN = exact qualified authorization blob
MERGE_SIGNATURE = VERIFIED / VALID
MERGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
APPLICABLE_PUSH_GOVERNANCE = TERMINAL_SUCCESS
APPLICABLE_K2_PUSH = TERMINAL_SUCCESS OR CANONICALLY_PROVEN PATH_FILTER_NON_APPLICABLE
UNRESOLVED_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
WAIVER = NO
```

Only that complete post-merge proof may establish:

```text
P7_R27_POST_MERGE_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL
```

## 10. Candidate boundary

Until this authorization itself qualifies, merges and receives complete post-merge proof:

```text
P7_R27_POST_MERGE_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CANDIDATE_ONLY
P7_R27_POST_MERGE_CURRENT_VIEW_RECONCILIATION = NOT_AUTHORIZED
CURRENT_VIEW_MUTATION = NOT_AUTHORIZED
POST_R27_SUCCESSOR_ANALYSIS = BLOCKED_UNTIL_RECONCILIATION_CLOSURE
A6_OR_LATER_IMPLEMENTATION = NOT_AUTHORIZED_BY_NUMBERING_OR_PLAN_COMPOSITION
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```