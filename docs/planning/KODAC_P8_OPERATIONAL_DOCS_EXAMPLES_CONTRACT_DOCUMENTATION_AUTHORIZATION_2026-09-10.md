# Kodac P8 Operational Docs / Examples Contract Documentation Authorization — 2026-09-10

## Classification

```text
CLASS = AUTHORIZATION / DOCUMENTATION_ONLY
STATUS = AUTHORIZATION_CANDIDATE / NOT_CANONICAL
CANONICAL_BASE_MAIN = 22ccacf95e93da6e504b92912910433854c5a4ef
PREDECESSOR = PR #541 / POST_INSTALLATION_UPDATE_INTEGRITY_CONTRACT_CURRENT_VIEW_RECONCILIATION / CLOSED_CANONICAL
PREDECESSOR_MERGE = 22ccacf95e93da6e504b92912910433854c5a4ef
PREDECESSOR_POST_MERGE_PROOF = 5609501964
SUCCESSOR_ANALYSIS = PR #541 / comment 5609530007 / ANALYSIS_ONLY
FOUNDER_CONTINUATION_AUTHORITY = EXPLICIT_KODAC_CONTINUATION_WITH_ORDINARY_AUTHORIZED_APPROVALS_2026-09-10
P8_NUMBERED_SUCCESSOR_AUTHORITY = NOT_USED
WAIVER = NO
```

This is a one-path documentation-only authorization candidate. While unmerged or post-merge-unproven, it creates no product-contract mutation authority and no README, example, source, runtime, test, schema, package, bin, workflow, dependency, lockfile, network, credential, persistence, telemetry, provider/model, installation, update, publication, release, deployment, P8-R5+, P9, or project-completion authority.

Only complete external post-merge proof for this exact authorization candidate may make the one-path operational-docs/examples evidence contract documentation unit eligible.

## Exact authorization-candidate path

This candidate may add exactly one path and no second path:

```text
docs/planning/KODAC_P8_OPERATIONAL_DOCS_EXAMPLES_CONTRACT_DOCUMENTATION_AUTHORIZATION_2026-09-10.md
```

No current-view file, product contract, README, example directory, source, runtime test, schema, package metadata, bin, workflow, dependency, lockfile, historical evidence record, ruleset, or repository-protection path may change in this authorization candidate.

## Conditionally authorized contract path

Only after this authorization becomes externally proven `CLOSED_CANONICAL` may one later documentation candidate add exactly:

```text
docs/product/OPERATIONAL_DOCS_EXAMPLES_CONTRACT.md
```

No second path is authorized for that later contract candidate.

The later contract is an evidence/interpretation document only. It may describe already-canonical command syntax, repository-local invocation boundaries, evidence/privacy considerations, approval semantics, bounded static fallback semantics, and fail-closed rules for future examples. It must not itself add or modify a runnable example, README command, source/runtime behavior, package/distribution mechanism, provider/model admission, network capability, credential flow, installer/updater, workflow, release artifact, package version, or public release surface.

## Required current operational facts

The later contract must bind current canonical evidence at the then-current `main`, including at minimum:

```text
RUNTIME_PACKAGE_NAME = @kodac/runtime-internal
RUNTIME_PACKAGE_VERSION = 0.0.0-k2
RUNTIME_PACKAGE_PRIVATE_UNPUBLISHED = YES
NODE_ENGINE = >=24
PACKAGE_BIN_KODAC = ./bin/kodac.mjs
REPOSITORY_LOCAL_CLI_EXECUTION = ESTABLISHED
PUBLIC_PACKAGE_INSTALLABILITY = NOT_ESTABLISHED
GLOBAL_INSTALLABILITY = NOT_ESTABLISHED
CLI_COMMANDS = apply-patch | ask | solve
```

Current CLI syntax includes repository-local surfaces for:

```text
kodac apply-patch <patch-file>
kodac ask <prompt>
kodac solve <task>
```

The later contract must not convert syntax availability into authority to run side-effecting commands. In particular, `apply-patch` is an explicit guarded patch path, and `solve` exposes explicit write and verification approval flags. Documentation of those flags is not authorization to grant those approvals automatically or to weaken K2, policy, workspace, verification, or Done Gate boundaries.

The bounded PR #531 static fallback remains limited to its proven surface:

```text
COMMAND = ask only
ACTIVATION = explicit --static-fallback only
OUTPUT_MODE = human output only
ELIGIBLE_PROVIDER_ERROR_OPENAI = credential_missing
ELIGIBLE_PROVIDER_ERROR_OPENAI_COMPATIBLE = credentials_missing
GENERAL_DETERMINISTIC_STATIC_FALLBACK = NOT_ESTABLISHED
```

## Required evidence and privacy interpretation

The later contract must preserve the existing evidence/privacy boundaries. At minimum:

```text
DEFAULT_EVIDENCE_ROOT = ~/.kodac/evidence/<workspace-key>
DEFAULT_EVIDENCE_RETENTION_DAYS = 30
MAX_EVIDENCE_RETENTION_DAYS = 3650
MAY_CONTAIN_LOSSLESS_MODEL_REQUEST_SNAPSHOTS = true
GLOBAL_OFFLINE_GUARANTEE = NOT_PROVEN
```

Operational examples must not imply that local evidence is automatically redacted, credential-free, encrypted, immediately deleted, or safe for arbitrary sensitive input. They also must not infer a global offline guarantee from the default fixture provider or bounded no-egress evidence.

## Required documentation interpretation

The later contract must explicitly preserve these non-equivalences:

```text
DOCUMENTED_COMMAND != EXECUTION_AUTHORITY
EXAMPLE_COMMAND != PUBLIC_INSTALLABILITY
EXAMPLE_COMMAND != PRODUCTION_READINESS
REPOSITORY_LOCAL_INVOCATION != PUBLISHED_CLI
CLI_HELP_SYNTAX != SAFE_INPUT_FOR_ARBITRARY_DATA
APPROVAL_FLAG_DOCUMENTATION != AUTOMATIC_APPROVAL_AUTHORITY
FIXTURE_EXAMPLE != GLOBAL_OFFLINE_GUARANTEE
LOCAL_EVIDENCE_PATH != TELEMETRY_OR_UPLOAD_AUTHORITY
LOCAL_EVIDENCE_STORAGE != SECRET_REDACTION_GUARANTEE
GIT_COMMIT_SIGNATURE != PACKAGE_ARTIFACT_SIGNATURE
CI_SUCCESS != INSTALLATION_UPDATE_INTEGRITY
DOCUMENTATION != RUNTIME_OR_DISTRIBUTION_ENFORCEMENT
```

If an example depends on behavior not directly established by canonical implementation/evidence, the contract must classify that behavior as `NOT_ESTABLISHED` or `NOT_AUTHORIZED` rather than presenting it as supported operational guidance.

## Required example-safety classification

The later contract must separate examples into bounded interpretation classes without creating runnable artifacts:

```text
REPOSITORY_LOCAL_READ_ONLY_OR_INSPECTION_EXAMPLE = MAY_BE_DOCUMENTED_WHEN_DIRECTLY_PROVEN
MODEL_OR_PROVIDER_EXAMPLE = REQUIRES_EXACT_PROVIDER_CAPABILITY_AND_AUTHORITY_CONTEXT
SIDE_EFFECTING_EXAMPLE = MUST_STATE_EXISTING_APPROVAL_POLICY_WORKSPACE_AND_EVIDENCE_BOUNDARIES
INSTALL_OR_UPDATE_EXAMPLE = NOT_ESTABLISHED_UNLESS_SEPARATELY_PROVEN
PUBLIC_RELEASE_EXAMPLE = NOT_AUTHORIZED
UNKNOWN_OR_UNPROVEN_EXAMPLE = DO_NOT_PRESENT_AS_SUPPORTED
```

This classification is documentation semantics only. It grants no command execution, network, provider/model, write, verification, installation, update, publication, or release authority.

## Required lineage

The later contract must preserve the established P8 lineage through the predecessor, including:

```text
P8_BOUNDED_STATIC_ASK_FALLBACK_IMPLEMENTATION = CLOSED_CANONICAL / PR #531 / proof 5607981953
POST_PROVIDER_FALLBACK_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #537 / proof 5608863482
P8_INSTALLATION_UPDATE_INTEGRITY_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL / PR #538 / proof 5608989633
P8_INSTALLATION_UPDATE_INTEGRITY_CONTRACT_DOCUMENTATION = CLOSED_CANONICAL / PR #539 / proof 5609169160
P8_POST_INSTALLATION_UPDATE_INTEGRITY_CONTRACT_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL / PR #540 / proof 5609387267
POST_INSTALLATION_UPDATE_INTEGRITY_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #541 / proof 5609501964
```

Historical PR #520 adverse evidence and PR #522/#523 fix-forward remediation remain canonical and must not be retroactively altered by this documentation sequence.

## Required safety boundaries

The later contract must preserve all still-effective product/distribution and execution non-grants, including:

```text
README_MUTATION = NOT_AUTHORIZED
RUNNABLE_EXAMPLE_SCRIPT_MUTATION = NOT_AUTHORIZED
SOURCE_RUNTIME_MUTATION = NOT_AUTHORIZED
TEST_SCHEMA_PACKAGE_BIN_MUTATION = NOT_AUTHORIZED
WORKFLOW_DEPENDENCY_LOCKFILE_MUTATION = NOT_AUTHORIZED
CLI_BEHAVIOR_CHANGE = NOT_AUTHORIZED
WRITE_APPROVAL_AUTOMATION = NOT_AUTHORIZED
VERIFICATION_APPROVAL_AUTOMATION = NOT_AUTHORIZED
PROVIDER_MODEL_ADMISSION_OR_INVOCATION_AUTHORITY = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
SECRET_CREDENTIAL_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_MUTATION = NOT_AUTHORIZED
TELEMETRY_UPLOAD_ANALYTICS_LEARNING = NOT_AUTHORIZED
INSTALLER_IMPLEMENTATION = NOT_AUTHORIZED
UPDATER_IMPLEMENTATION = NOT_AUTHORIZED
PACKAGE_DOWNLOAD_IMPLEMENTATION = NOT_AUTHORIZED
PACKAGE_REGISTRY_ACCESS = NOT_AUTHORIZED
PACKAGE_PUBLICATION = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_VERSION_MUTATION = NOT_AUTHORIZED
RELEASE_ARTIFACT_CREATION = NOT_AUTHORIZED
RELEASE_SIGNING = NOT_AUTHORIZED
UPDATE_CHANNEL_IMPLEMENTATION = NOT_AUTHORIZED
ROLLBACK_CHANNEL_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RELEASE_VERSION_SEPARATION_MUTATION = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## Qualification gate for this authorization candidate

Before guarded merge, one unchanged exact candidate head must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
AUTHORIZATION_BLOB = FROZEN
PREDECESSOR_POST_MERGE_PROOF_BOUND = PASS
SUCCESSOR_ANALYSIS_BOUND = PASS
FOUNDER_CONTINUATION_AUTHORITY_BOUND = PASS
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_PRIVACY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_NORMAL_MERGE = REQUIRED
POST_MERGE_EXTERNAL_PROOF = REQUIRED
WAIVER = NO
```

Any head/base movement, later material finding, unresolved actionable thread, check regression, changed-path expansion, or ruleset change invalidates earlier qualification evidence.

## Qualification gate for the later contract candidate

This authorization does not pre-qualify the contract. The later one-path contract candidate must independently prove:

```text
BASE == THEN_CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_CONTRACT_PATH
NO_SECOND_PATH = PASS
AUTHORIZATION_POST_MERGE_PROOF_BOUND = PASS
CURRENT_CLI_PACKAGE_PRIVACY_INSTALLATION_EVIDENCE_BOUND = PASS
UNSUPPORTED_OPERATIONAL_CLAIMS_FAIL_CLOSED = PASS
NO_README_RUNNABLE_EXAMPLE_SOURCE_RUNTIME_PACKAGE_RELEASE_MUTATION = PASS
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_PRIVACY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_NORMAL_MERGE = REQUIRED
POST_MERGE_EXTERNAL_PROOF = REQUIRED
WAIVER = NO
```

## Closure semantics

This record cannot certify itself. Only complete external post-merge proof may classify:

```text
P8_OPERATIONAL_DOCS_EXAMPLES_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL
```

Even after closure, the only new eligibility is the exact one-path documentation contract above. No README/example artifact, source/runtime, approval automation, provider/model, installation/update, package/publication, release/version, public release/deployment, P8-R5+, P9, or project-completion authority follows by implication.
