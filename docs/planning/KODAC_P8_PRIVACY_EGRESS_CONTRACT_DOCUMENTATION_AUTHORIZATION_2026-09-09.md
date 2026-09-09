# Kodac P8 — Privacy / Egress Contract Documentation Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_PRIVACY_EGRESS_DOCUMENTATION_AUTHORITY UNTIL_MERGED_AND_POST_PROVEN**  
Date: 2026-09-09  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Deny-by-default baseline

```text
CANONICAL_MAIN_AT_CANDIDATE_START = a3eac8e45e39536ae0de9b630526eb41c2812cc0
POST_GITHUB_CI_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #517 / merge a3eac8e45e39536ae0de9b630526eb41c2812cc0 / proof 5605366047
POST_CLOSURE_SUCCESSOR_ANALYSIS = PR #517 / comment 5605404869 / ANALYSIS_ONLY
STALE_PREDECESSOR_PRIVACY_CANDIDATE = PR #511 / CLOSED_UNMERGED / SUPERSEDED_STALE_CANDIDATE
PRIVACY_EGRESS_PRODUCT_CONTRACT = NOT_AUTHORIZED_UNTIL_THIS_RECORD_QUALIFIES_MERGES_AND_POST_PROVES
SUCCESSOR_RUNTIME_IMPLEMENTATION_AUTHORITY = NO
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This record is a one-path authorization candidate for one later documentation-only privacy/egress product contract. While this record is unmerged or lacks mandatory external post-merge proof, it creates no authority to create that product document and no source, runtime, schema, test, package, workflow, dependency, provider/model, network, secret, persistence, telemetry, learning, release, publication, deployment, or project-completion authority.

---

## 2. Why this is the minimum next bounded concern

Fresh live analysis after PR #517 closure establishes:

- P8 Product & Distribution Hardening remains not closed.
- The canonical P8 master plan identifies privacy/egress controls as an unresolved product-hardening concern but grants no implementation authority itself.
- No canonical `docs/product/PRIVACY_EGRESS_CONTRACT.md` exists.
- Existing bounded K6/P2 records contain no-egress/no-upload statements only for their exact bounded units; they do not establish a global invariant that every Kodac command is offline.
- Existing agent and GitHub/CI consumer contracts preserve network, secret, provider/model, and persistence non-authority but are consumer-interpretation contracts, not a dedicated product privacy/egress contract.
- Existing provider/model-capable command semantics remain governed only by their command-specific canonical authority.
- Installation/update integrity cannot be documented as an existing public-distribution behavior because the runtime package remains private and unpublished.
- Deterministic/static fallback implementation cannot be inferred from documentation without separately proven runtime behavior.

The smallest evidence-supported successor is therefore a documentation-only contract that makes already-proven privacy/egress boundaries explicit without changing behavior.

---

## 3. Exact conditional future allowlist

Only after this authorization candidate independently qualifies, guarded-merges using its exact expected head, and passes mandatory external post-merge proof may one later documentation candidate create exactly:

```text
docs/product/PRIVACY_EGRESS_CONTRACT.md
```

No second path is authorized for that later documentation unit.

The later candidate must not modify:

```text
AGENTS.md
README.md
docs/roadmap/**
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

## 4. Truth the future contract may document

The later contract may bind only already-proven authority boundaries and provenance-qualified facts. At minimum it must preserve these distinctions:

```text
DOCUMENTATION != RUNTIME_ENFORCEMENT
BOUNDED_NO_EGRESS_EVIDENCE != GLOBAL_ALL_COMMANDS_OFFLINE_CLAIM
NO_NEW_NETWORK_AUTHORITY = YES
NO_NEW_SECRET_ACCESS_AUTHORITY = YES
NO_NEW_PROVIDER_MODEL_AUTHORITY = YES
NO_NEW_PERSISTENCE_TELEMETRY_UPLOAD_ANALYTICS_AUTHORITY = YES
PROVIDER_CAPABLE_COMMAND_BEHAVIOR = GOVERNED_BY_EXISTING_COMMAND_SPECIFIC_CANONICAL_AUTHORITY_ONLY
UNKNOWN_OR_UNPROVEN_PRIVACY_EGRESS_BEHAVIOR = DO_NOT_CLAIM
```

The contract may explain that a command or bounded subsystem is local/no-egress only when canonical evidence for that exact surface proves it. It must not generalize a local property from one command, subsystem, test, authorization, or historical qualification result to unrelated surfaces.

The contract may distinguish semantic categories such as:

```text
PROVEN_LOCAL_OR_NO_EGRESS_FOR_EXACT_SURFACE
PROVIDER_OR_NETWORK_CAPABLE_ONLY_WHERE_SEPARATELY_AUTHORIZED
UNKNOWN_OR_UNPROVEN
```

These are documentation categories only. They do not create new runtime states, schema fields, CLI output, policy-engine behavior, enforcement mechanisms, or authority.

---

## 5. Required treatment of provider-capable behavior

The future contract must remain conservative about provider/model-capable commands and integrations.

Required invariants:

```text
DOCUMENTED_PROVIDER_CAPABILITY != PROVIDER_INVOCATION_AUTHORITY
DOCUMENTED_NETWORK_CAPABILITY != NETWORK_ACCESS_AUTHORITY
DOCUMENTED_SECRET_REQUIREMENT != SECRET_ACCESS_AUTHORITY
EXISTING_COMMAND_SPECIFIC_AUTHORITY = NOT_BROADENED
NO_PROVIDER_RETRY_REPLAY_RESUME_AUTHORITY = CREATED
NO_PROVIDER_SPEND_AUTHORITY = CREATED
NO_BACKGROUND_NETWORK_ACTIVITY = CLAIMED_WITHOUT_PROOF
NO_GLOBAL_OFFLINE_MODE = CLAIMED_WITHOUT_PROOF
```

If current evidence cannot prove a behavior for a surface, the contract must say that the behavior is unknown/unproven rather than inferring a stronger privacy guarantee.

---

## 6. Required treatment of persistence, telemetry, and data handling

The future contract may restate only canonical facts about exact bounded surfaces. It must not invent product-wide retention, deletion, telemetry, analytics, upload, database, cache, log-redaction, credential-storage, or filesystem guarantees.

Required distinctions:

```text
NO_PERSISTENCE_FOR_ONE_BOUNDED_SURFACE != GLOBAL_NO_PERSISTENCE
NO_TELEMETRY_UPLOAD_FOR_ONE_BOUNDED_SURFACE != GLOBAL_NO_TELEMETRY
NO_FILE_OUTPUT_FOR_ONE_BOUNDED_SURFACE != GLOBAL_NO_FILESYSTEM_WRITES
NO_SECRET_ACCESS_AUTHORITY != PROOF_THAT_SECRETS_CAN_NEVER_BE_PRESENT_IN_ENVIRONMENT
DOCUMENTED_PRIVACY_BOUNDARY != DATA_GOVERNANCE_IMPLEMENTATION
```

Any retention/deletion/redaction/credential-handling enforcement requires separate canonical implementation authority.

---

## 7. Existing P8 truth that must remain unchanged

The future contract must preserve all still-effective canonical P8 truth, including:

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

The future privacy/egress contract must not supersede, reinterpret, or weaken any historical authorization or evidence record.

---

## 8. Preserved non-grants

This authorization candidate does not authorize, and the later documentation must not imply:

```text
SOURCE_RUNTIME_SCHEMA_TEST_MUTATION = NOT_AUTHORIZED
NEW_CLI_COMMAND_FLAG_ALIAS_BEHAVIOR = NOT_AUTHORIZED
CLI_EXIT_CODE_CHANGE = NOT_AUTHORIZED
PROTOCOL_VERSION_CHANGE = NOT_AUTHORIZED
RUNTIME_PRIVACY_ENFORCEMENT = NOT_AUTHORIZED
REDACTION_IMPLEMENTATION = NOT_AUTHORIZED
CREDENTIAL_HANDLING_IMPLEMENTATION = NOT_AUTHORIZED
FIREWALL_NETWORK_SANDBOX_ENFORCEMENT = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_AUTHORITY_EXPANSION = NOT_AUTHORIZED
PROVIDER_RETRY_REPLAY_RESUME = NOT_AUTHORIZED
PROVIDER_SPEND = NOT_AUTHORIZED
PERSISTENCE_DATABASE_CACHE = NOT_AUTHORIZED
TELEMETRY_UPLOAD_ANALYTICS = NOT_AUTHORIZED
RETENTION_DELETION_IMPLEMENTATION = NOT_AUTHORIZED
FILESYSTEM_WRITE_AUTHORITY_EXPANSION = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_RENAME_VERSION_CHANGE = NOT_AUTHORIZED
PACKAGE_PUBLICATION = NOT_AUTHORIZED
GLOBAL_INSTALLABILITY = NOT_AUTHORIZED
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED
EXECUTABLE_GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
GITHUB_ACTION_IMPLEMENTATION = NOT_AUTHORIZED
GITHUB_WORKFLOW_MUTATION = NOT_AUTHORIZED
GITHUB_APP_API_WEBHOOK_CHECK_STATUS_IMPLEMENTATION = NOT_AUTHORIZED
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED
DETERMINISTIC_PROVIDER_MODEL_FALLBACK_IMPLEMENTATION = NOT_AUTHORIZED
OPERATIONAL_DOCS_EXAMPLES_MUTATION = NOT_AUTHORIZED
VERIFICATION_EXECUTION = NOT_AUTHORIZED
AUTOFIX_REMEDIATION_EXECUTION = NOT_AUTHORIZED
LEARNING_CROSS_REPOSITORY_AGGREGATION = NOT_AUTHORIZED
RELEASE_VERSION_AUTHORITY_CHANGE = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
RULESET_CHANGE_OR_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

---

## 9. Stale predecessor boundary

PR #511 is closed and unmerged. It was created from pre-#513 canonical main and later diverged from current canonical main.

```text
PR_511 = CLOSED_UNMERGED / SUPERSEDED_STALE_CANDIDATE
PR_511_BASE = 24ba233cc3cd38a6c740c486c8d8917553b9114d
PR_511_HEAD = f8a38cd8d96076f68a96e249e6ea7637ec5e2b21
PR_511_CONTENT = HISTORICAL_INPUT_ONLY
PR_511_AUTHORITY = NONE
```

This fresh candidate does not inherit qualification, review, CI, mergeability, or authority from PR #511. All qualification evidence must be produced anew on this candidate's exact head and current metadata.

Open historical PR #163 is unrelated to P8 privacy/egress and creates no authority for this unit.

---

## 10. Qualification gate for this authorization candidate

Do not merge this one-path authorization candidate unless one unchanged exact head/current metadata proves:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1
CHANGED_PATH = docs/planning/KODAC_P8_PRIVACY_EGRESS_CONTRACT_DOCUMENTATION_AUTHORIZATION_2026-09-09.md
AUTHORIZATION_BLOB = FROZEN
POST_GITHUB_CI_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #517 / proof 5605366047
POST_CLOSURE_SUCCESSOR_ANALYSIS = PR #517 / comment 5605404869 / ANALYSIS_ONLY
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

## 11. Candidate boundary

Until this exact authorization candidate qualifies, merges guarded, and passes mandatory external post-merge proof:

```text
PRIVACY_EGRESS_PRODUCT_CONTRACT_DOCUMENTATION = NOT_AUTHORIZED
DIRECT_CREATION_OF_docs/product/PRIVACY_EGRESS_CONTRACT.md = NOT_AUTHORIZED
PRIVACY_EGRESS_RUNTIME_BEHAVIOR_CHANGE = NOT_AUTHORIZED
SUCCESSOR_PRODUCT_RUNTIME_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

If this record later becomes canonical and externally post-merge proven, it authorizes exactly one later documentation-only candidate creating `docs/product/PRIVACY_EGRESS_CONTRACT.md` under the constraints above and nothing broader.
