# Kodac P7-R28 — Post-merge Current-view Reconciliation Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_CURRENT_VIEW_WRITE_AUTHORITY UNTIL MERGED AND POST-PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = c93b8c69292fb14a84ead8ff244ea2a0dc6833c2
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = 04ebdb5730610c3232db4a24671a74668d39887e
P7_R27_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #469 / proof 5588027874
POST_R27_SUCCESSOR_AUTHORITY_ANALYSIS = PR #469 / comment 5588092657 / ANALYSIS_ONLY
P7_R28_A6_COMPOSITE_FULL_EXACT_HEAD_REVIEW_COMPLETENESS_AUTHORIZATION = CLOSED_CANONICAL / PR #470 / proof 5588278399
P7_R28_A6_COMPOSITE_FULL_EXACT_HEAD_REVIEW_COMPLETENESS_IMPLEMENTATION = CLOSED_CANONICAL / PR #471 / proof 5588734402 / BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY
P7_R28_CURRENT_VIEW_DRIFT_ANALYSIS = PR #471 / comment 5588764025 / ANALYSIS_ONLY
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This record is documentation-governance authority only. It creates no current-view write authority unless this exact authorization candidate independently qualifies, merges normally through protected `main` with an exact expected-head guard, and receives complete mandatory post-merge activation proof.

Live GitHub truth, root `AGENTS.md`, exact canonical authorization/evidence records, and active ruleset `20707483` override this document.

## 2. Why reconciliation is required

Root `AGENTS.md` requires:

```text
BOUNDED IMPLEMENTATION
-> EXACT-HEAD PROOF
-> GUARDED MERGE
-> POST-MERGE PROOF
-> ROADMAP RECONCILIATION
-> NEXT AUTHORIZED UNIT
```

Fresh post-R28 drift analysis `5588764025` established that all five canonical current-state views remain stale. They still describe the R27 post-merge current-view reconciliation as a current candidate, still block post-R27 successor analysis, and omit the already-canonical R27 reconciliation and R28 authorization/implementation chain.

Those statements were historical candidate truth before later canonical proofs, but they are stale against live canonical `main` after:

```text
P7_R27_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / proof 5588027874
POST_R27_SUCCESSOR_AUTHORITY_ANALYSIS = ANALYSIS_ONLY / 5588092657
P7_R28_A6_AUTHORIZATION = CLOSED_CANONICAL / proof 5588278399
P7_R28_A6_IMPLEMENTATION = CLOSED_CANONICAL / proof 5588734402 / BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY
```

The future reconciliation may update current-state prose only. It must not rewrite historical authorization/evidence records, create P7-to-K5 authority, create Done Gate authority, broaden A6 semantics, or convert bounded completeness evidence into all-bytes semantic-review, defect-free, provider-authenticity, release, or project-completion truth.

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
docs/roadmap/NEXT.md = 04916a18686ae60b4184c939fc6a2af5aa38d366
docs/roadmap/ROADMAP.md = dc9ca58411242ead0f2cf4f56b0eb275d3004460
docs/roadmap/MILESTONES.md = c358c45ab654a65e52daa0edaf510d0c2d2ff94c
docs/roadmap/VERSION_PLAN.md = b5d2f724337045f8a53d3562236d72f8c450fd92
docs/product/STATUS.md = e13c72d69e1a8228c6fcb77fa976e3e3a4c7a9bf
```

These preimages are observations, not permission to overwrite intervening changes. A later reconciliation candidate must start from then-live canonical `main`; if any preimage changes, it must preserve unrelated live changes and requalify on its own exact head.

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
P7_R27_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #469 / proof 5588027874
POST_R27_SUCCESSOR_AUTHORITY_ANALYSIS = PR #469 / comment 5588092657 / ANALYSIS_ONLY
P7_R28_A6_COMPOSITE_FULL_EXACT_HEAD_REVIEW_COMPLETENESS_AUTHORIZATION = CLOSED_CANONICAL / PR #470 / proof 5588278399
P7_R28_A6_COMPOSITE_FULL_EXACT_HEAD_REVIEW_COMPLETENESS_IMPLEMENTATION = CLOSED_CANONICAL / PR #471 / proof 5588734402 / BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY
P7_R28_CURRENT_VIEW_DRIFT_ANALYSIS = PR #471 / comment 5588764025 / ANALYSIS_ONLY
P7_R28_POST_MERGE_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL / THIS_AUTHORIZATION_POST_MERGE_PROOF
P7_R28_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
POST_R28_SUCCESSOR_AUTHORITY_ANALYSIS = BLOCKED_UNTIL_RECONCILIATION_CLOSURE
P7_TO_K5_RECONCILIATION = NOT_AUTHORIZED_BY_NUMBERING_OR_PLAN_SEQUENCE
DONE_GATE = NOT_AUTHORIZED_BY_NUMBERING_OR_PLAN_SEQUENCE
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

The future reconciliation must preserve all still-effective predecessor state and non-grants. Omission from a condensed current-state view must not be represented as authorization, waiver, supersession, proof, or narrowing.

## 5. Required R28 bounded semantics to preserve

The five views may summarize R28 only at its exact proven state:

```text
P7_R28_STATE = BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY
```

Purpose-equivalent summary is allowed only if it preserves these facts:

- R28 validates exact canonical R27 evidence and exact R27 build lineage;
- R28 independently revalidates nested R22, R23, R24, R25, and R26 predecessor contracts;
- repository/base/head/tree/changed-path-set/review-universe lineage must converge exactly;
- R22 context must be current, complete, contain no completeness reasons, and have zero omission debt;
- changed reviewable-text paths count as reviewed only when the exact rebuilt R22 context contains the same canonical `subjectPath`;
- missing reviewable paths are unknown path-coverage debt and block proof issuance;
- known nonreviewable dispositions remain explicit accounting facts rather than semantic-review claims;
- R25 must have no uncovered or unknown risk coverage debt;
- R26 must have no skill coverage debt;
- R27 must be caller-asserted completed with no known truncation, a present completion timestamp, and `NOT_TRUNCATED` evidence;
- output is deterministic, content-addressed, deeply immutable, data-only, and side-effect-free.

Mandatory non-equivalences:

```text
BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY != ALL_BYTES_SEMANTICALLY_REVIEWED
BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY != DEFECT_FREE
ZERO_FINDINGS != COMPLETE_REVIEW
DETERMINISTIC_SECURITY_SIGNAL != VERIFIED_FINDING
RISK_COVERAGE_ACCOUNTED != RISK_ABSENT
SKILL_COVERAGE_ACCOUNTED != SKILL_TRUSTED
CALLER_ASSERTED_COMPLETED != PROVIDER_AUTHENTICATED_COMPLETION
P7_R28_CLOSED != P7_TO_K5_RECONCILIATION_PROOF
P7_R28_CLOSED != DONE_GATE_PROOF
P7_R28_CLOSED != P7_OVERALL_CLOSED
P7_R28_CLOSED != P8_P9_AUTHORITY
P7_R28_CLOSED != RELEASE_AUTHORITY
P7_R28_CLOSED != PROJECT_COMPLETION
```

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
VERIFICATION_EXECUTION = NOT_AUTHORIZED
LIVE_REVIEWER_PROVIDER_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
PROVIDER_RETRY_REPLAY_RESUME = NOT_AUTHORIZED
PROVIDER_SPEND = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
P7_TO_K5_RECONCILIATION_PROOF = NOT_ESTABLISHED
DONE_GATE_INVOCATION_OR_MUTATION = NOT_AUTHORIZED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## 7. No successor authority

This authorization is not P7-to-K5 reconciliation authority and is not Done Gate authority.

```text
P7_R28_RECONCILIATION_AUTHORIZATION != P7_TO_K5_RECONCILIATION_AUTHORIZATION
P7_R28_RECONCILIATION_CLOSED != P7_TO_K5_RECONCILIATION_AUTHORIZATION
P7_R28_RECONCILIATION_CLOSED != DONE_GATE_AUTHORIZATION
P7_R28_RECONCILIATION_CLOSED != POST_R28_SUCCESSOR_IMPLEMENTATION_AUTHORITY
PLAN_SEQUENCE != IMPLEMENTATION_AUTHORITY
NUMBERING != IMPLEMENTATION_AUTHORITY
```

Only after the future five-view reconciliation itself independently qualifies, merges guarded, and receives complete post-merge proof may a fresh successor-authority analysis begin from the resulting live `main`.

## 8. Qualification requirements for this authorization candidate

This one-path documentation-only candidate may qualify only if one unchanged exact head proves:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
R27_RECONCILIATION_PROOF = EXACTLY_REVERIFIED / 5588027874
POST_R27_SUCCESSOR_ANALYSIS = EXACTLY_REVERIFIED / 5588092657 / ANALYSIS_ONLY
R28_AUTHORIZATION_PROOF = EXACTLY_REVERIFIED / 5588278399
R28_IMPLEMENTATION_PROOF = EXACTLY_REVERIFIED / 5588734402
R28_IMPLEMENTATION_STATE = BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY
R28_CURRENT_VIEW_DRIFT_ANALYSIS = EXACTLY_REVERIFIED / 5588764025 / ANALYSIS_ONLY
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
P7_R28_POST_MERGE_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL
P7_R28_POST_MERGE_CURRENT_VIEW_RECONCILIATION = AUTHORIZED_ONLY_FOR_EXACT_5_PATH_ALLOWLIST
```

## 10. Candidate boundary

Until this authorization itself qualifies, merges, and receives complete post-merge proof:

```text
P7_R28_POST_MERGE_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CANDIDATE_ONLY
P7_R28_POST_MERGE_CURRENT_VIEW_RECONCILIATION = NOT_AUTHORIZED
CURRENT_VIEW_MUTATION = NOT_AUTHORIZED
POST_R28_SUCCESSOR_AUTHORITY_ANALYSIS = BLOCKED_UNTIL_RECONCILIATION_CLOSURE
P7_TO_K5_RECONCILIATION = NOT_AUTHORIZED
DONE_GATE = NOT_AUTHORIZED
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```