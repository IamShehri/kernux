# Kodac P8 — Post-GitHub/CI Contract Current-View Reconciliation Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_CURRENT_VIEW_MUTATION_AUTHORITY UNTIL_MERGED_AND_POST_PROVEN**  
Date: 2026-09-09  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Deny-by-default baseline

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 895b13c24e36d721a5cf228fa7ff15f0e42fbaba
CANONICAL_TREE_AT_CANDIDATE_START = 723cef3241ac20aca417a472f1d7ba5779496fe5
P8_GITHUB_CI_INTEGRATION_CONTRACT_DOCUMENTATION = CLOSED_CANONICAL / PR #515 / merge 895b13c24e36d721a5cf228fa7ff15f0e42fbaba / proof 5603510999
POST_CLOSURE_CURRENT_VIEW_SUCCESSOR_ANALYSIS = PR #515 / comment 5603534106 / ANALYSIS_ONLY
CURRENT_VIEW_RECONCILIATION = NOT_AUTHORIZED_UNTIL_THIS_RECORD_QUALIFIES_MERGES_AND_POST_PROVES
SUCCESSOR_IMPLEMENTATION_AUTHORITY = NO
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This record is a one-path authorization candidate for one later five-path current-view reconciliation only. While unmerged or unproven, it creates no authority to mutate those five current-view files and no source, runtime, schema, test, package, workflow, dependency, provider/model, network, secret, persistence, telemetry, learning, release, publication, deployment, or project-completion authority.

---

## 2. Why reconciliation is the minimum next unit

Root `AGENTS.md` defines the repository execution sequence as:

```text
POST-MERGE PROOF
-> ROADMAP RECONCILIATION
-> NEXT AUTHORIZED UNIT
```

Fresh post-#515 analysis found that all five standard current-view surfaces still describe the post-agent-contract reconciliation as the active/current candidate and omit later closed-canonical truth through PR #515.

The stale surfaces are exactly:

```text
docs/roadmap/NEXT.md
docs/roadmap/ROADMAP.md
docs/roadmap/MILESTONES.md
docs/roadmap/VERSION_PLAN.md
docs/product/STATUS.md
```

The future reconciliation is therefore a status/navigation repair only. It is not a new product feature, runtime unit, P8-R5 unit, release unit, or authority expansion.

---

## 3. Exact future allowlist

Only after this authorization independently qualifies, guarded-merges, and passes mandatory external post-merge proof may one later reconciliation candidate modify exactly these five paths:

```text
docs/roadmap/NEXT.md
docs/roadmap/ROADMAP.md
docs/roadmap/MILESTONES.md
docs/roadmap/VERSION_PLAN.md
docs/product/STATUS.md
```

No sixth path is authorized.

The future reconciliation must not modify:

```text
AGENTS.md
docs/planning/**
docs/research/**
docs/product/AGENT_INTEGRATION_CONTRACT.md
docs/product/GITHUB_CI_INTEGRATION_CONTRACT.md
packages/**
schema/**
.github/**
package.json
package-lock.json
pnpm-lock.yaml
uv.lock
```

or any historical authorization, evidence, runtime, provider/model, workflow, dependency, lockfile, package metadata, source, schema, or test surface.

---

## 4. Truth the future reconciliation may bind

The future reconciliation may bind only already-proven canonical truth. At minimum it must correctly record:

```text
POST_AGENT_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #510
P8_GITHUB_CI_INTEGRATION_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL / PR #513
P8_GITHUB_CI_INTEGRATION_CONTRACT_DOCUMENTATION = CLOSED_CANONICAL / PR #515 / merge 895b13c24e36d721a5cf228fa7ff15f0e42fbaba / proof 5603510999
P8_PRODUCT_DISTRIBUTION_HARDENING = NOT_CLOSED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

The future reconciliation must remove or supersede stale navigation prose that still labels the post-agent-contract reconciliation as the current candidate, but must not rewrite or erase historical evidence.

---

## 5. Required semantics and historical truth to preserve

The future reconciliation must preserve all still-effective predecessor truth, including at minimum:

```text
PROTOCOL = kodac.cli-result
VERSION = 1
COMMANDS = apply-patch | ask | solve
P8_R1_THROUGH_P8_R4_SEMANTICS = UNCHANGED
P8_R4_UNSUPPORTED_NODE_22_FIRST_LOCAL_FAILURE = PRESERVED_AS_REAL_HISTORICAL_FAILURE
CANONICAL_NODE_24_QUALIFICATION_EVIDENCE = PRESERVED
RUNTIME_PACKAGE_PRIVATE_UNPUBLISHED = YES
README_HELP_DOCUMENTATION = REPOSITORY_LOCAL_ONLY
AGENT_CONSUMER_CONTRACT = DOCUMENTATION_ONLY / SCHEMA_BOUND / FAIL_CLOSED
GITHUB_CI_CONSUMER_CONTRACT = DOCUMENTATION_ONLY / SCHEMA_BOUND / FAIL_CLOSED
AGENT_CONSUMER_CONTRACT != AGENT_EXECUTION_AUTHORITY
GITHUB_CI_CONSUMER_CONTRACT != EXECUTABLE_GITHUB_CI_PRODUCT_INTEGRATION
MACHINE_READABLE_RESULT != INDEPENDENT_PROOF
CLI_RESULT_STATUS != DONE_GATE_AUTHORITY
PROVEN_READY != MERGE_AUTHORITY
PROVEN_READY != RELEASE_AUTHORITY
PROVEN_READY != PROJECT_COMPLETION
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_DONE_GATE_AUTHORITY = UNCHANGED
DONE_GATE_IMPLEMENTATION_AND_ALGORITHM = UNCHANGED
```

The future reconciliation may condense historical lineage for navigation clarity, but omission from a condensed current view must remain explicitly non-authoritative: omission is not supersession, waiver, narrowing, or authority transfer.

---

## 6. Required active-unit meaning after reconciliation

The future reconciliation may state only that the post-#515 current-view reconciliation itself is the active bounded unit while it is a candidate, and after external post-merge proof may mark that reconciliation closed canonical.

It must not name, number, authorize, or imply a later product/runtime implementation successor.

Required distinctions:

```text
CURRENT_VIEW_RECONCILIATION != SUCCESSOR_IMPLEMENTATION_AUTHORITY
CURRENT_VIEW_RECONCILIATION != P8_R5_PLUS_AUTHORITY
CURRENT_VIEW_RECONCILIATION != P9_AUTHORITY
CURRENT_VIEW_RECONCILIATION != RELEASE_AUTHORITY
CURRENT_VIEW_RECONCILIATION != PROJECT_COMPLETION
POST_MERGE_PROOF != SUCCESSOR_AUTHORITY
PLANNING_DIRECTION != IMPLEMENTATION_AUTHORITY
```

Any later successor requires fresh analysis from the then-current canonical state and a separate canonical authorization where applicable.

---

## 7. Preserved non-grants

This authorization candidate does not authorize, and the future reconciliation must not imply:

```text
SOURCE_RUNTIME_SCHEMA_TEST_MUTATION = NOT_AUTHORIZED
NEW_CLI_COMMAND_FLAG_ALIAS_BEHAVIOR = NOT_AUTHORIZED
CLI_EXIT_CODE_CHANGE = NOT_AUTHORIZED
PROTOCOL_VERSION_CHANGE = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_RENAME_VERSION_CHANGE = NOT_AUTHORIZED
PACKAGE_PUBLICATION = NOT_AUTHORIZED
GLOBAL_INSTALLABILITY = NOT_AUTHORIZED
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED
EXECUTABLE_GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
GITHUB_ACTION_IMPLEMENTATION = NOT_AUTHORIZED
GITHUB_WORKFLOW_MUTATION = NOT_AUTHORIZED
GITHUB_APP_IMPLEMENTATION = NOT_AUTHORIZED
GITHUB_API_INTEGRATION = NOT_AUTHORIZED
GITHUB_CHECK_RUN_STATUS_CREATION = NOT_AUTHORIZED
GITHUB_WEBHOOK_IMPLEMENTATION = NOT_AUTHORIZED
GITHUB_TOKEN_SECRET_ACCESS = NOT_AUTHORIZED
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED
OPERATIONAL_DOCS_EXAMPLES_MUTATION = NOT_AUTHORIZED
PRIVACY_EGRESS_BEHAVIOR_CHANGE = NOT_AUTHORIZED
DETERMINISTIC_PROVIDER_MODEL_FALLBACK_IMPLEMENTATION = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_AUTHORITY_EXPANSION = NOT_AUTHORIZED
PROVIDER_RETRY_REPLAY_RESUME = NOT_AUTHORIZED
PROVIDER_SPEND = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
FILESYSTEM_WRITE_AUTHORITY_EXPANSION = NOT_AUTHORIZED
VERIFICATION_EXECUTION = NOT_AUTHORIZED
AUTOFIX_REMEDIATION_EXECUTION = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
RELEASE_VERSION_AUTHORITY_CHANGE = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
RULESET_CHANGE_OR_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

---

## 8. Stale competing PR boundary

Open PR #511 was created from canonical main `24ba233cc3cd38a6c740c486c8d8917553b9114d`, before the later canonical #513/#515 lineage. It is not selected by this authorization and must not be treated as qualified, current, or merge-authorized merely because it remains open.

Open PR #163 is an older unrelated historical candidate and does not define the current P8 frontier.

This authorization neither closes nor revives either PR and creates no authority for their content.

---

## 9. Qualification gate for this authorization candidate

Do not merge this one-path authorization candidate unless one unchanged exact head/current metadata proves:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1
CHANGED_PATH = docs/planning/KODAC_P8_POST_GITHUB_CI_CONTRACT_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION_2026-09-09.md
AUTHORIZATION_BLOB = FROZEN
P8_GITHUB_CI_INTEGRATION_CONTRACT_DOCUMENTATION = CLOSED_CANONICAL / PR #515 / proof 5603510999
POST_CLOSURE_CURRENT_VIEW_SUCCESSOR_ANALYSIS = PR #515 / comment 5603534106 / ANALYSIS_ONLY
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
REQUIRED_EXTERNAL_SEMANTIC_REVIEW_COUNT = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
MERGE = GUARDED_NORMAL_MERGE_USING_EXACT_EXPECTED_HEAD_SHA
POST_MERGE_PROOF = MAIN + ORDERED_PARENTS + TREE + AUTHORIZATION_BLOB + VERIFIED_VALID_SIGNATURE + APPLICABLE_PUSH_CHECKS + MERGED_PR_STATE + RULESET + REVIEW_THREADS
WAIVER = NO
```

Any head, base, blob, path, ruleset, or material-evidence movement invalidates exact-head qualification evidence and requires fresh proof.

---

## 10. Candidate boundary

Until this exact authorization candidate qualifies, merges guarded, and passes mandatory external post-merge proof:

```text
POST_GITHUB_CI_CONTRACT_CURRENT_VIEW_RECONCILIATION = NOT_AUTHORIZED
DIRECT_FIVE_PATH_CURRENT_VIEW_MUTATION = NOT_AUTHORIZED
SUCCESSOR_PRODUCT_RUNTIME_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

If this record later becomes canonical and externally post-merge proven, it authorizes exactly one later five-path current-view reconciliation under the constraints above and nothing broader.
