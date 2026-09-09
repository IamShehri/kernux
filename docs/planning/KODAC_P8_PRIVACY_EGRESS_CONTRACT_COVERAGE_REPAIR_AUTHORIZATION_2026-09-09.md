# Kodac P8 Privacy / Egress Contract Coverage Repair Authorization — 2026-09-09

## Classification

```text
CLASS = FORWARD_REPAIR_AUTHORIZATION / DOCUMENTATION_ONLY
CANONICAL_BASE_MAIN = 519c685eafd7f5be021b0225cc53df190d0b41c3
DEFECTIVE_MERGE = PR #520 / 519c685eafd7f5be021b0225cc53df190d0b41c3
DEFECTIVE_DOCUMENT_BLOB = 82044645c918acaade1a9162c7c0f7c43711c194
MATERIAL_REVIEW = 5157366894
POST_MERGE_DEFECT_CLASSIFICATION = 5605568824
SUPERSEDED_PRE_MERGE_QUALIFICATION = 5605528938
WAIVER = NO
```

PR #520 is live repository truth, but it is not eligible for `CLOSED_CANONICAL` classification because a material mandatory-coverage defect was recorded on its exact head before merge. The earlier qualification therefore ceased to satisfy `KNOWN_ACTIONABLE_DEFECTS = 0` before the merge occurred.

This record authorizes a forward-only documentation repair. It does not authorize history rewrite, rebase, force-push, revert-by-erasure, source/runtime changes, or any broader P8 successor work.

## Exact authorization path

This authorization candidate may add exactly this file and no second path:

```text
docs/planning/KODAC_P8_PRIVACY_EGRESS_CONTRACT_COVERAGE_REPAIR_AUTHORIZATION_2026-09-09.md
```

## Conditionally authorized repair path

Only after this authorization independently qualifies, guarded-merges into protected `main`, and receives mandatory external post-merge proof may one later repair candidate modify exactly:

```text
docs/product/PRIVACY_EGRESS_CONTRACT.md
```

No second repair path is authorized.

## Exact defect to repair

The merged PR #520 document correctly preserves broad fail-closed privacy/egress interpretation boundaries, but it omits already-proven current CLI evidence-storage and retention facts required by the governing PR #518 authorization.

The repair must add the applicable canonical facts without weakening the existing document:

```text
DEFAULT_EVIDENCE_ROOT = ~/.kodac/evidence/<workspace-key>
WORKSPACE_KEY = first 16 hexadecimal characters of SHA-256 over the resolved workspace path
EVIDENCE_ROOT_OVERRIDE = --evidence-dir <dir>
DEFAULT_EVIDENCE_RETENTION_DAYS = 30
MAX_EVIDENCE_RETENTION_DAYS = 3650
EVIDENCE_RETENTION_OVERRIDE = --evidence-retention-days <n>
EVIDENCE_METADATA_MAY_CONTAIN_LOSSLESS_MODEL_REQUEST_SNAPSHOTS = true
POSIX_EVIDENCE_DIRECTORY_MODE = 0700
POSIX_EVIDENCE_FILE_MODE = 0600
WINDOWS_ACCESS_CONTROL_AT_CREATION = WINDOWS_INHERITED_ACL_UNVERIFIED
```

The repair must also preserve the proven cleanup caveat:

- expired active sessions are retained;
- unsafe or invalid sessions may be retained rather than destructively removed;
- configured retention is therefore not a promise of immediate deletion at nominal expiry.

The repair may cite the current canonical implementation anchors needed to support these statements:

```text
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/src/evidence/store.ts
```

At the defective-merge base, the relevant unchanged runtime blobs are:

```text
packages/kodac-runtime/src/cli.ts = 70f7fc2e14fc5a24bc82781ccfdd4d238346d955
packages/kodac-runtime/src/evidence/store.ts = 29a62c8e788fce058427cbf126f1052295c394f2
```

If those implementation anchors change before the repair candidate is created or qualified, their facts must be reverified from fresh canonical truth rather than copied blindly.

## Required interpretation boundaries

The repair must preserve all existing safe distinctions, including:

```text
DOCUMENTATION != RUNTIME_ENFORCEMENT
EVIDENCE_FOR_ONE_SURFACE != GLOBAL_PRODUCT_GUARANTEE
ABSENCE_OF_PROOF != PROOF_OF_ABSENCE
BOUNDED_NO_EGRESS_EVIDENCE != GLOBAL_ALL_COMMANDS_OFFLINE_CLAIM
LOCAL_EVIDENCE_STORAGE_BEHAVIOR != TELEMETRY_OR_UPLOAD_AUTHORITY
DEFAULT_FIXTURE_PROVIDER != PROOF_THAT_ALL_PROVIDER_CAPABLE_PATHS_ARE_OFFLINE
PROVIDER_ABSTRACTION_EXISTENCE != PROVIDER_INVOCATION_AUTHORITY
UNKNOWN_OR_UNPROVEN = DO_NOT_CLAIM
```

The repair must not convert local filesystem protection into claims of encryption-at-rest, network isolation, sandboxing, secret redaction, telemetry denial, or Windows owner-only ACL enforcement.

## Exact repair scope

The future repair may:

1. add the current CLI default evidence-root derivation and explicit override;
2. add the proven default/max retention values and CLI retention override;
3. add the fail-safe cleanup caveat described above;
4. add the `mayContainLosslessModelRequestSnapshots = true` privacy warning;
5. add the proven POSIX `0700` directory and `0600` file behavior;
6. add the explicit `WINDOWS_INHERITED_ACL_UNVERIFIED` boundary;
7. add the exact runtime evidence-anchor paths/blobs if still current;
8. make only minimal connective wording necessary to integrate these facts into the existing document.

The repair may not otherwise redesign or broaden the merged contract.

## Explicit non-grants

```text
HISTORY_REWRITE = NOT_AUTHORIZED
FORCE_PUSH = NOT_AUTHORIZED
REBASE = NOT_AUTHORIZED
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
RETENTION_DELETION_BEHAVIOR_CHANGE = NOT_AUTHORIZED
CROSS_REPOSITORY_ACCESS = NOT_AUTHORIZED
GITHUB_ACTION_OR_API_INTEGRATION = NOT_AUTHORIZED
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED
PACKAGE_VERSION_MUTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
K2_K5_DONE_GATE_AUTHORITY_CHANGE = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
SUCCESSOR_P8_PRODUCT_WORK = BLOCKED_UNTIL_REPAIR_CLOSED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## Qualification requirements

Before guarded merge, one unchanged exact authorization head must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
AUTHORIZATION_BLOB = FROZEN
MATERIAL_REVIEW_5157366894 = BOUND
DEFECT_CLASSIFICATION_5605568824 = BOUND
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_NORMAL_MERGE = REQUIRED
POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

Any candidate-head change invalidates exact-head qualification evidence.

## Closure semantics

This authorization cannot certify itself. Only external post-merge proof may classify:

```text
P8_PRIVACY_EGRESS_CONTRACT_COVERAGE_REPAIR_AUTHORIZATION = CLOSED_CANONICAL
```

Only after that classification does the single repair path become eligible. Closing the repair authorization alone does not close the product contract defect; the repair candidate must separately qualify, merge, and receive external post-merge proof.
