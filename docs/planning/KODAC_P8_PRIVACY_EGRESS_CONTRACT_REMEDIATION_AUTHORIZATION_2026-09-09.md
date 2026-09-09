# Kodac P8 Privacy / Egress Contract Remediation Authorization — 2026-09-09

## Classification

```text
CLASS = AUTHORIZATION / DOCUMENTATION_ONLY / FIX_FORWARD_REMEDIATION
CANONICAL_BASE_MAIN = 519c685eafd7f5be021b0225cc53df190d0b41c3
PREDECESSOR_AUTHORIZATION = PR #518 / CLOSED_CANONICAL
PREDECESSOR_AUTHORIZATION_PROOF = 5605463093
DEFECTIVE_MERGE = PR #520 / merge 519c685eafd7f5be021b0225cc53df190d0b41c3
DEFECTIVE_MERGE_STATE = MERGED_WITH_STALE_QUALIFICATION / NOT_CLOSED_CANONICAL
STALE_QUALIFICATION_PROOF = 5605528938
MATERIAL_PRE_MERGE_REVIEW = 5157366894 / MANDATORY_CONTRACT_COVERAGE_OMISSION
INCIDENT_RECORD = 5605587262
FRESH_REMEDIATION_ANALYSIS = PR #520 / comment 5605825405 / ANALYSIS_ONLY
DONOR_PR = #521 / CLOSED_UNMERGED / DONOR_EVIDENCE_ONLY
WAIVER = NO
```

This record authorizes only one later documentation-only fix-forward remediation candidate after this authorization independently qualifies, merges through protected `main`, and receives mandatory external post-merge proof.

It does not retroactively validate PR #520, does not erase the stale-qualification incident, does not revive or reuse PR #518 implementation authority, and does not make PR #521 canonical.

## Exact authorization path

This authorization candidate may add exactly this file and no second path:

```text
docs/planning/KODAC_P8_PRIVACY_EGRESS_CONTRACT_REMEDIATION_AUTHORIZATION_2026-09-09.md
```

## Conditionally authorized remediation path

Only after this authorization becomes `CLOSED_CANONICAL` may one later candidate modify exactly:

```text
docs/product/PRIVACY_EGRESS_CONTRACT.md
```

No second remediation path is authorized.

## Remediation purpose

The later candidate may only repair the mandatory documentation-coverage omission identified by exact-head review `5157366894` while preserving the safe fail-closed claims already present on canonical `main`.

The later candidate must state, using current canonical repository evidence, the applicable current CLI evidence-storage, retention, and access-control boundaries, including at minimum:

```text
DEFAULT_EVIDENCE_ROOT = ~/.kodac/evidence/<workspace-key>
WORKSPACE_KEY = FIRST_16_HEX_OF_SHA256_RESOLVED_WORKSPACE_PATH
EVIDENCE_DIR_OVERRIDE = --evidence-dir <dir>
DEFAULT_EVIDENCE_RETENTION_DAYS = 30
MAX_EVIDENCE_RETENTION_DAYS = 3650
EVIDENCE_RETENTION_OVERRIDE = --evidence-retention-days <n>
MAY_CONTAIN_LOSSLESS_MODEL_REQUEST_SNAPSHOTS = true
POSIX_EVIDENCE_DIRECTORY_MODE = 0700
POSIX_EVIDENCE_FILE_MODE = 0600
WINDOWS_ACCESS_CONTROL_STATE = WINDOWS_INHERITED_ACL_UNVERIFIED
```

The later document must also preserve these distinctions:

```text
DOCUMENTATION != RUNTIME_ENFORCEMENT
BOUNDED_NO_EGRESS_EVIDENCE != GLOBAL_ALL_COMMANDS_OFFLINE_CLAIM
LOCAL_EVIDENCE_STORAGE_BEHAVIOR != TELEMETRY_OR_UPLOAD_AUTHORITY
DEFAULT_FIXTURE_PROVIDER != PROOF_THAT_ALL_PROVIDER_CAPABLE_PATHS_ARE_OFFLINE
PROVIDER_ABSTRACTION_EXISTENCE != PROVIDER_INVOCATION_AUTHORITY
UNKNOWN_OR_UNPROVEN_PRIVACY_EGRESS_BEHAVIOR = DO_NOT_CLAIM
```

The remediation may use the closed-unmerged PR #521 document as donor material only after independently checking each retained factual statement against current canonical `main`. PR #521 grants no authority and its stale branch identity must not be reused for qualification or merge.

## Required evidence anchors

The remediation must bind its concrete storage/retention/access-control claims to current canonical evidence, including as applicable:

```text
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/src/evidence/store.ts
packages/kodac-runtime/src/model/provider.ts
packages/kodac-runtime/src/model/fixture.ts
```

At this authorization base, known relevant blobs are:

```text
packages/kodac-runtime/src/cli.ts = 70f7fc2e14fc5a24bc82781ccfdd4d238346d955
packages/kodac-runtime/src/evidence/store.ts = 29a62c8e788fce058427cbf126f1052295c394f2
packages/kodac-runtime/src/model/provider.ts = a15f1d86ceab88ab6fa1be787719d222e354e0c4
packages/kodac-runtime/src/model/fixture.ts = 15b9b11e2452da8963bec4678e338efc58551659
```

If any relevant canonical blob changes before remediation qualification, the claims must be revalidated against the new live truth.

## Explicit non-grants

```text
SOURCE_RUNTIME_MUTATION = NOT_AUTHORIZED
SCHEMA_TEST_PACKAGE_BIN_MUTATION = NOT_AUTHORIZED
WORKFLOW_DEPENDENCY_LOCKFILE_MUTATION = NOT_AUTHORIZED
CLI_BEHAVIOR_CHANGE = NOT_AUTHORIZED
NETWORK_FIREWALL_ENFORCEMENT = NOT_AUTHORIZED
NETWORK_EGRESS_IMPLEMENTATION = NOT_AUTHORIZED
SECRET_CREDENTIAL_ACCESS = NOT_AUTHORIZED
SECRET_REDACTION_IMPLEMENTATION = NOT_AUTHORIZED
PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED
NEW_PROVIDER_MODEL_ADMISSION = NOT_AUTHORIZED
PERSISTENCE_IMPLEMENTATION = NOT_AUTHORIZED
TELEMETRY_UPLOAD_ANALYTICS_IMPLEMENTATION = NOT_AUTHORIZED
RETENTION_DELETION_RUNTIME_BEHAVIOR_CHANGE = NOT_AUTHORIZED
CROSS_REPOSITORY_ACCESS = NOT_AUTHORIZED
GITHUB_ACTION_WORKFLOW_API_APP_WEBHOOK_CHECK_STATUS_IMPLEMENTATION = NOT_AUTHORIZED
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED
PACKAGE_VERSION_MUTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
K2_K5_DONE_GATE_AUTHORITY_CHANGE = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
REVERT_PR_520 = NOT_AUTHORIZED_BY_THIS_RECORD
REBASE = NOT_AUTHORIZED
FORCE_PUSH = NOT_AUTHORIZED
HISTORY_REWRITE = NOT_AUTHORIZED
WAIVER = NO
```

## Qualification requirements for this authorization

Before guarded merge, one unchanged exact candidate head must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
AUTHORIZATION_BLOB = FROZEN
INCIDENT_RECORD_BOUND = PASS
MATERIAL_REVIEW_BOUND = PASS
FRESH_REMEDIATION_ANALYSIS_BOUND = PASS
DONOR_PR_NON_AUTHORITY_BOUND = PASS
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_NORMAL_MERGE = REQUIRED
POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

If the candidate head changes or `main` moves, qualification evidence must be reacquired.

## Closure semantics

This authorization cannot certify its own closure. Only external post-merge proof may classify:

```text
P8_PRIVACY_EGRESS_CONTRACT_REMEDIATION_AUTHORIZATION = CLOSED_CANONICAL
```

Only after that closure does the single remediation path become eligible. The later remediation must independently qualify and receive its own external post-merge proof before the privacy/egress documentation defect may be classified closed.
