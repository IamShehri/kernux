# Kodac P8-R3 — Post-Merge Current-View Reconciliation Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_RECONCILIATION_AUTHORITY UNTIL MERGED_AND_POST_PROVEN**  
Date: 2026-09-09  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 5b8caf8d1e75beff8cd47a4ee5fdf125e34aa6d3
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = e4f3649786709b0e868743ab82e8358d50f7a144
P8_R2_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #493 / proof 5592657114
POST_P8_R2_RECONCILIATION_SUCCESSOR_ANALYSIS = PR #493 / comment 5592680727 / ANALYSIS_ONLY
P8_R3_AUTHORIZATION = CLOSED_CANONICAL / PR #494 / proof 5592724962
P8_R3_IMPLEMENTATION_COMPATIBILITY_ANALYSIS = PR #494 / comment 5592826024 / ANALYSIS_ONLY
P8_R3_BOUNDED_MESSAGE_COMPATIBILITY_AMENDMENT = CLOSED_CANONICAL / PR #495 / proof 5592874704
P8_R3_IMPLEMENTATION = CLOSED_CANONICAL / PR #496 / merge 5b8caf8d1e75beff8cd47a4ee5fdf125e34aa6d3 / proof 5593082712
POST_P8_R3_SUCCESSOR_CURRENT_VIEW_ANALYSIS = PR #496 / comment 5593100818 / ANALYSIS_ONLY
P8_R3_POST_MERGE_CURRENT_VIEW_RECONCILIATION = NOT_AUTHORIZED_UNTIL_THIS_RECORD_QUALIFIES_MERGES_AND_POST_PROVES
P8_PRODUCT_DISTRIBUTION_HARDENING = NOT_CLOSED
P8_R4_PLUS = NOT_AUTHORIZED_BY_NUMBERING
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This is a one-path documentation-only authorization candidate. While unmerged or post-merge-unproven, it creates no authority to edit current views, runtime source, schemas, tests, package metadata, workflows, dependencies, providers/models, side-effect boundaries, release state, or project-completion state.

---

## 2. Proven reconciliation need

The five canonical current-view surfaces remain stale after canonical P8-R3 closure. They still describe the P8-R2 current-view reconciliation as an unclosed candidate and still state that solve JSON and controlled live-solve remain unchanged.

That prose no longer matches canonical Git/GitHub/runtime evidence.

Already-proven truth now includes:

```text
P8_R2_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #493 / proof 5592657114
P8_R3_AUTHORIZATION = CLOSED_CANONICAL / PR #494 / proof 5592724962
P8_R3_BOUNDED_MESSAGE_COMPATIBILITY_AMENDMENT = CLOSED_CANONICAL / PR #495 / proof 5592874704
P8_R3_IMPLEMENTATION = CLOSED_CANONICAL / PR #496 / merge 5b8caf8d1e75beff8cd47a4ee5fdf125e34aa6d3 / proof 5593082712
```

Canonical bounded P8 meaning after R3 is:

```text
PROTOCOL = kodac.cli-result
VERSION = 1
APPLY_PATCH_JSON = P8_R1_ENVELOPE_WIRED
ASK_JSON = P8_R1_ENVELOPE_WIRED / proven=false
SOLVE_JSON = P8_R1_ENVELOPE_WIRED FOR STOPPED | NOT_READY | PROVEN_READY
COMPLETED_SOLVE_OVERSIZED_WARNING_REASON_TRANSPORT = DETERMINISTIC_BOUNDED_SHA256_BOUND_PROJECTION
COMPLETE_PLAN_WARNINGS = PRESERVED_IN_EXISTING_PLAN_ARTIFACT
COMPLETE_DONE_GATE_REASONS = PRESERVED_IN_EXISTING_PROOF_ARTIFACT
CONTROLLED_LIVE_SOLVE = VALIDATES_AND_CONSUMES_CANONICAL_COMMAND_SOLVE_ENVELOPE
SOLVE_HUMAN_OUTPUT = UNCHANGED
CLI_EXIT_CODES = UNCHANGED
P8_R1_CONTRACT_SCHEMA = UNCHANGED
DONE_GATE = UNCHANGED
```

Reconciliation is required only to make navigation/current-state views reflect those already-proven facts. Reconciliation does not create new implementation truth.

---

## 3. Exact future reconciliation allowlist

Only after this authorization candidate independently qualifies, merges normally with an exact expected-head guard, and passes mandatory external post-merge proof may one later reconciliation candidate modify exactly:

```text
docs/roadmap/NEXT.md
docs/roadmap/ROADMAP.md
docs/roadmap/MILESTONES.md
docs/roadmap/VERSION_PLAN.md
docs/product/STATUS.md
```

No sixth path is authorized.

The later reconciliation must not modify:

```text
AGENTS.md
packages/**
schema/**
.github/**
README.md
package.json
package-lock.json
pnpm-lock.yaml
uv.lock
```

or any historical authorization/evidence record, runtime source, test, schema, workflow, ruleset, provider/model configuration, persistence/telemetry/learning surface, release configuration, or repository-protection path.

---

## 4. Required reconciliation semantics

The future five-path candidate may only reconcile current views to already-proven canonical facts. It must bind at least:

```text
P8_R2_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #493 / proof 5592657114
POST_P8_R2_RECONCILIATION_SUCCESSOR_ANALYSIS = PR #493 / comment 5592680727 / ANALYSIS_ONLY
P8_R3_AUTHORIZATION = CLOSED_CANONICAL / PR #494 / proof 5592724962
P8_R3_IMPLEMENTATION_COMPATIBILITY_ANALYSIS = PR #494 / comment 5592826024 / ANALYSIS_ONLY
P8_R3_BOUNDED_MESSAGE_COMPATIBILITY_AMENDMENT = CLOSED_CANONICAL / PR #495 / proof 5592874704
P8_R3_IMPLEMENTATION = CLOSED_CANONICAL / PR #496 / merge 5b8caf8d1e75beff8cd47a4ee5fdf125e34aa6d3 / proof 5593082712
POST_P8_R3_SUCCESSOR_CURRENT_VIEW_ANALYSIS = PR #496 / comment 5593100818 / ANALYSIS_ONLY
THIS_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL / exact future PR and proof assigned after this candidate qualifies, merges, and post-proves
P8_R3_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
```

The reconciliation candidate must remain candidate-safe. It cannot certify its own closure before external post-merge proof.

It must update the bounded P8 meaning consistently across all five views so they no longer claim that solve JSON or controlled live-solve remain on their pre-R3 behavior.

It must preserve the distinction:

```text
P8_R3_IMPLEMENTATION_CLOSED != P8_PRODUCT_DISTRIBUTION_HARDENING_CLOSED
P8_R3_IMPLEMENTATION_CLOSED != P8_R4_PLUS_AUTHORITY
CURRENT_VIEW_RECONCILIATION != SUCCESSOR_IMPLEMENTATION_AUTHORITY
CURRENT_VIEW_RECONCILIATION != RELEASE_AUTHORITY
PROVEN_READY != MERGE_AUTHORITY
PROVEN_READY != RELEASE_AUTHORITY
PROVEN_READY != PROJECT_COMPLETION
```

---

## 5. Preserved authority boundaries

The future reconciliation must preserve all still-effective non-grants, including:

```text
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_DONE_GATE_AUTHORITY = UNCHANGED
P8_R1_CONTRACT_SCHEMA = UNCHANGED
CLI_EXIT_CODE_CHANGE = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_RENAME_VERSION_PUBLICATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
NEW_DEPENDENCY = NOT_AUTHORIZED
PROVIDER_MODEL_AUTHORITY_EXPANSION = NOT_AUTHORIZED
NETWORK_SECRET_FILESYSTEM_AUTHORITY_EXPANSION = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
P8_R4_PLUS = NOT_AUTHORIZED_BY_NUMBERING
PROJECT_COMPLETION = NOT_ESTABLISHED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
WAIVER = NO
```

Historical P7 and earlier P8 authorization/evidence records remain authoritative in their dedicated sources. Omission from a condensed current view is not erasure, waiver, supersession, or authority transfer.

---

## 6. Qualification gate for this authorization candidate

This authorization candidate may change exactly one path and no second path:

```text
docs/planning/KODAC_P8_R3_POST_MERGE_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION_2026-09-09.md
```

Before guarded merge, one unchanged exact head/current metadata must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1
AUTHORIZATION_BLOB = FROZEN
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NON_APPLICABLE
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
REQUIRED_EXTERNAL_SEMANTIC_REVIEW_COUNT = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
MERGE = GUARDED_NORMAL_MERGE_USING_EXACT_EXPECTED_HEAD_SHA
POST_MERGE_PROOF = MAIN + ORDERED_PARENTS + TREE + AUTHORIZATION_BLOB + VERIFIED_VALID_SIGNATURE + APPLICABLE_PUSH_CHECKS + MERGED_PR_STATE + RULESET + REVIEW_THREADS
WAIVER = NO
```

Any head/base/blob/path/check/review/ruleset movement invalidates exact-head qualification evidence.

---

## 7. Candidate boundary

Until this exact one-path record qualifies, merges, and passes mandatory external post-merge proof:

```text
P8_R3_POST_MERGE_CURRENT_VIEW_RECONCILIATION = NOT_AUTHORIZED
DIRECT_CURRENT_VIEW_MUTATION = NOT_AUTHORIZED
P8_R4_PLUS = NOT_AUTHORIZED_BY_NUMBERING
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

After this authorization becomes canonical, authority extends only to one exact five-path current-view reconciliation candidate. After that reconciliation itself becomes externally post-merge proven, the next action is fresh evidence-driven successor-authority analysis. No successor implementation authority is created by this record.
