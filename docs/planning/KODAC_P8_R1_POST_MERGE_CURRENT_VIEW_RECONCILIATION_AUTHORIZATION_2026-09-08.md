# Kodac P8-R1 — Post-Merge Current-View Reconciliation Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_RECONCILIATION_AUTHORITY UNTIL MERGED_AND_POST_PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Deny-by-default state

This record authorizes only one future documentation-only reconciliation of the five established current roadmap/product views after this exact one-path authorization itself qualifies on one unchanged exact head, merges normally into protected `main` using the exact expected-head precondition, and passes mandatory external post-merge proof.

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 0e772d9636d0e721741e442aac56349488a3227b
CANONICAL_TREE_AT_CANDIDATE_START = e1e5468e4d1c8663c93b8570d51a663ff4e276d7
P7_POST_CLOSEOUT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #485 / proof 5591213559
POST_P7_SUCCESSOR_ANALYSIS = PR #485 / comment 5591269488 / ANALYSIS_ONLY
P8_R1_AUTHORIZATION = CLOSED_CANONICAL / PR #486 / proof 5591337213
P8_R1_IMPLEMENTATION = CLOSED_CANONICAL / PR #487 / merge 0e772d9636d0e721741e442aac56349488a3227b / proof 5591781497
POST_P8_R1_SUCCESSOR_ANALYSIS = PR #487 / comment 5591792193 / ANALYSIS_ONLY
P8_R1_POST_MERGE_CURRENT_VIEW_RECONCILIATION = AUTHORIZATION_CANDIDATE_ONLY
P8_R2_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P7_OVERALL = NOT_CLOSED
P8_PRODUCT_DISTRIBUTION_HARDENING = NOT_CLOSED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This record does not reopen or modify canonical P7 or P8-R1 implementation, authorization, evidence, qualification, failure history, review, or post-merge proof. It does not close P7 or P8 overall; authorize P8-R2+, P9, provider/model/reviewer/verifier invocation, secret or network access, dependencies/donor intake, persistence/telemetry/learning, CLI wiring, package-root exposure, package publication, release/deployment, ruleset mutation/bypass, or project completion.

---

## 2. Procedural basis and proven drift

Root `AGENTS.md` requires the dependency order:

```text
POST-MERGE PROOF
-> ROADMAP RECONCILIATION
-> NEXT AUTHORIZED UNIT
```

P8-R1 now has external post-merge proof at PR #487 comment `5591781497`. Fresh successor analysis at PR #487 comment `5591792193` establishes analysis-only that the five established current roadmap/product views materially lag canonical truth and that the minimum next unit is one separate one-path reconciliation authorization candidate.

The five current views still describe the P7 post-closeout reconciliation as a current candidate and P8 implementation as not authorized, despite canonical evidence establishing P7 reconciliation closure and bounded P8-R1 authorization/implementation closure.

Canonical P3/P4/P5/P6/P7 procedure is direct precedent: a one-path reconciliation authorization must become canonical before a separate five-path current-view reconciliation candidate may exist.

```text
ANALYSIS != AUTHORITY
ROADMAP_DRIFT != DIRECT_MUTATION_AUTHORITY
P8_R1_CLOSURE != P8_R2_AUTHORITY
```

---

## 3. Exact future reconciliation allowlist

Only after this authorization record becomes canonical and passes external post-merge proof may one later reconciliation candidate modify exactly:

```text
docs/roadmap/NEXT.md
docs/roadmap/ROADMAP.md
docs/roadmap/MILESTONES.md
docs/roadmap/VERSION_PLAN.md
docs/product/STATUS.md
```

No sixth path is authorized.

The later reconciliation may only:

1. replace stale P7 post-closeout reconciliation candidate state with the externally proven canonical PR #485 / proof `5591213559` state;
2. bind P8-R1 authorization as `CLOSED_CANONICAL / PR #486 / proof 5591337213`;
3. bind P8-R1 implementation as `CLOSED_CANONICAL / PR #487 / merge 0e772d9636d0e721741e442aac56349488a3227b / proof 5591781497`;
4. record the post-P8-R1 successor analysis as `PR #487 / comment 5591792193 / ANALYSIS_ONLY`;
5. record the P8-R1 current-view reconciliation itself in candidate-safe form until its own external post-merge proof exists;
6. preserve `P7_OVERALL = NOT_CLOSED` and preserve P8 Product & Distribution Hardening as not closed;
7. preserve `P8_R2_PLUS = NOT_AUTHORIZED_BY_NUMBERING`;
8. preserve all still-effective non-grants and historical evidence without rewriting predecessor history;
9. state that only fresh evidence-driven successor-authority analysis may follow after the reconciliation itself qualifies, merges, and passes external post-merge proof.

The later reconciliation may not modify any historical authorization/evidence record, runtime source/test/schema, workflow, dependency/lockfile, KRI/K2/K5/Done Gate source or authority, benchmark corpus/manifest/result, provider/model/reviewer/verifier configuration, persistence/telemetry/learning surface, product implementation, package metadata, release configuration, ruleset, or repository-protection path.

---

## 4. Required reconciled truth

The future five-path candidate may record these already externally proven facts unconditionally:

```text
P7_POST_CLOSEOUT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #485 / proof 5591213559
P8_R1_AUTHORIZATION = CLOSED_CANONICAL / PR #486 / proof 5591337213
P8_R1_IMPLEMENTATION = CLOSED_CANONICAL / PR #487 / merge 0e772d9636d0e721741e442aac56349488a3227b / proof 5591781497
POST_P8_R1_SUCCESSOR_ANALYSIS = PR #487 / comment 5591792193 / ANALYSIS_ONLY
```

For its own not-yet-observed reconciliation result, it must remain candidate-safe until external post-merge proof:

```text
P8_R1_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
```

It must preserve simultaneously:

```text
P2_OVERALL = OPEN
P3_OVERALL = OPEN
P4_OVERALL = OPEN
P5_OVERALL = NOT_CLOSED
P6_OVERALL = NOT_CLOSED
P7_OVERALL = NOT_CLOSED
P8_PRODUCT_DISTRIBUTION_HARDENING = NOT_CLOSED
GENERAL_PUBLIC_KODACBENCH = NOT_CLOSED
P5_R3_PLUS = NOT_AUTHORIZED
P6_R2_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P7_R31_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P8_R2_PLUS = NOT_AUTHORIZED_BY_NUMBERING
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_EXISTING_R1_R5_CONTRACTS = UNCHANGED
DONE_GATE_IMPLEMENTATION = UNCHANGED
DONE_GATE_ALGORITHM = UNCHANGED
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
FILESYSTEM_WRITE_AUTHORITY = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
CLI_WIRING = NOT_AUTHORIZED
CLI_EXIT_CODE_CHANGE = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_RENAME_VERSION_PUBLICATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

---

## 5. Qualification gate for this authorization candidate

Do not merge this one-path authorization unless one unchanged exact head/current metadata proves:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1
CHANGED_PATH = docs/planning/KODAC_P8_R1_POST_MERGE_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION_2026-09-08.md
AUTHORIZATION_BLOB = FROZEN
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NON_APPLICABLE
INTERNAL_SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_INSPECTION = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
REQUIRED_EXTERNAL_SEMANTIC_REVIEW_COUNT = 0
EXTERNAL_REVIEW = OPTIONAL_ADVISORY_EVIDENCE
RULESET_20707483 = ACTIVE / NO_BYPASS
MERGE = GUARDED_NORMAL_MERGE_USING_EXACT_EXPECTED_HEAD_SHA
POST_MERGE_PROOF = MAIN + ORDERED_PARENTS + TREE + AUTHORIZATION_BLOB + VERIFIED_VALID_SIGNATURE + APPLICABLE_PUSH_CHECKS + MERGED_PR_STATE + RULESET + REVIEW_THREADS
WAIVER = NO
```

Any byte/head/base/blob/path/ruleset/material-evidence movement invalidates exact-head qualification evidence.

---

## 6. Non-equivalences

```text
P8_R1_IMPLEMENTATION_CLOSED != P8_PRODUCT_DISTRIBUTION_HARDENING_CLOSED
P8_R1_IMPLEMENTATION_CLOSED != P8_R2_PLUS_AUTHORITY
P8_R1_CURRENT_VIEW_RECONCILIATION != P8_R2_PLUS_AUTHORITY
P8_R1_CURRENT_VIEW_RECONCILIATION != P9_AUTHORITY
P8_R1_CURRENT_VIEW_RECONCILIATION != RELEASE_AUTHORITY
P8_R1_CURRENT_VIEW_RECONCILIATION != PACKAGE_PUBLICATION_AUTHORITY
P8_R1_CURRENT_VIEW_RECONCILIATION != DEPLOYMENT_AUTHORITY
P8_R1_CURRENT_VIEW_RECONCILIATION != PROJECT_COMPLETION
P8_R1_CLI_RESULT_ENVELOPE != CLI_WIRING
P8_R1_CLI_RESULT_ENVELOPE != DONE_GATE_AUTHORITY
P8_R1_CLI_RESULT_ENVELOPE != INDEPENDENT_PROOF
PLANNING_DIRECTION != IMPLEMENTATION_AUTHORITY
POST_MERGE_PROOF != SUCCESSOR_AUTHORITY
PROVEN_READY != SUCCESSOR_AUTHORITY
EVIDENCE_BINDING != AUTHORITY_TRANSFER
```

---

## 7. Candidate boundary

Until this one-path record itself qualifies, merges, and passes mandatory external post-merge proof:

```text
P8_R1_POST_MERGE_CURRENT_VIEW_RECONCILIATION = NOT_AUTHORIZED
DIRECT_FIVE_PATH_RECONCILIATION = NOT_AUTHORIZED
P8_R2_PLUS = NOT_AUTHORIZED_BY_NUMBERING
CLI_WIRING = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT_PUBLICATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```
