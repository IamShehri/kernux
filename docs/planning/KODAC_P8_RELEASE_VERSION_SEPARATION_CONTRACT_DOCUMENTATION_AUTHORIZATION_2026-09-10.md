# Kodac P8 Release / Version Separation Contract Documentation Authorization — 2026-09-10

## Classification

```text
CLASS = AUTHORIZATION / DOCUMENTATION_ONLY
STATUS = AUTHORIZATION_CANDIDATE / NOT_CANONICAL
CANONICAL_BASE_MAIN = 9fbd2707f8d90f11fa0fbbd086c428f5c7a1afdb
PREDECESSOR = PR #546 / POST_OPERATIONAL_DOCS_EXAMPLES_CONTRACT_CURRENT_VIEW_RECONCILIATION / CLOSED_CANONICAL
PREDECESSOR_MERGE = 9fbd2707f8d90f11fa0fbbd086c428f5c7a1afdb
PREDECESSOR_POST_MERGE_PROOF = 5609860097
SUCCESSOR_ANALYSIS = PR #546 / comment 5609877274 / ANALYSIS_ONLY
FOUNDER_CONTINUATION_AUTHORITY = EXPLICIT_KODAC_CONTINUATION_WITH_ORDINARY_AUTHORIZED_APPROVALS_2026-09-10
P8_NUMBERED_SUCCESSOR_AUTHORITY = NOT_USED
WAIVER = NO
```

This is a one-path documentation-governance authorization candidate only. While unmerged or post-merge-unproven, it creates no product-contract write authority and no source, runtime, test, schema, package, bin, workflow, dependency, lockfile, version, tag, release, publication, deployment, provider/model, network, credential, persistence, telemetry, brand-claim, P8-R5+, P9, or project-completion authority.

Only complete external post-merge proof for this exact authorization candidate may make the separate one-path release/version-separation product-contract candidate eligible.

## Exact authorization-candidate path

This candidate may add exactly one path and no second path:

```text
docs/planning/KODAC_P8_RELEASE_VERSION_SEPARATION_CONTRACT_DOCUMENTATION_AUTHORIZATION_2026-09-10.md
```

No current-view file, product contract, README, source, runtime, test, schema, package metadata, bin, workflow, dependency, lockfile, release configuration, tag, artifact, historical evidence/authorization record, ruleset, or repository-protection path may change in this authorization candidate.

## Why this is the minimum dependency-ordered successor

Root `AGENTS.md` requires live evidence, exact authorization, bounded implementation, exact-head proof, guarded merge, post-merge proof, and current-view reconciliation before successor work.

PR #546 is externally post-merge proven through `5609860097`. Fresh successor analysis `5609877274` re-read live canonical truth and identified the final listed P8 Product & Distribution Hardening concern after operational docs/examples:

```text
RELEASE_VERSION_SEPARATION_FROM_ENGINEERING_MILESTONE_STATUS
```

The P8 master plan explicitly creates no implementation authority and separately requires its own authorization for public release, package publication, and brand claims.

No canonical release/version-separation product contract or active P8 successor PR was found. Therefore the minimum successor is a documentation-only authorization for a later evidence-scoped contract, not a package/version, CLI, tag, GitHub Release, publication, deployment, or brand mutation.

## Conditionally authorized future contract path

Only after this authorization becomes externally proven `CLOSED_CANONICAL` may one later product-contract candidate add exactly one path:

```text
docs/product/RELEASE_VERSION_SEPARATION_CONTRACT.md
```

No second path is authorized by this record.

The future contract is interpretation and evidence documentation only. It must not mutate or authorize mutation of package metadata, runtime/source behavior, CLI commands/options, tags, GitHub Releases, artifacts, signing, registry state, release workflows, changelog automation, installation/update behavior, public claims, or current views.

## Current version-bearing evidence that must remain distinguished

The later contract must bind the following current facts without treating any of them as public release authority:

```text
KODAC_CLI_RESULT_PROTOCOL_VERSION = 1 / PROTOCOL_ONLY
RUNTIME_PACKAGE_NAME = @kodac/runtime-internal
RUNTIME_PACKAGE_VERSION = 0.0.0-k2
RUNTIME_PACKAGE_PRIVATE = true
RUNTIME_PACKAGE_PUBLICATION = NOT_ESTABLISHED
PUBLIC_PACKAGE_INSTALLABILITY = NOT_ESTABLISHED
GLOBAL_INSTALLABILITY = NOT_ESTABLISHED
KODAC_CLI_--version = NOT_ADMITTED
KODAC_CLI_version_COMMAND = NOT_ADMITTED
PYTHON_TOOLING_PROJECT = kernux-index
PYTHON_TOOLING_VERSION = 0.1.0
LEGACY_OMNI_BRIDGE_PACKAGE = kernux
LEGACY_OMNI_BRIDGE_VERSION = 0.1.0
GITHUB_RELEASES = NONE_OBSERVED_AT_SUCCESSOR_ANALYSIS
GIT_TAGS = NONE_OBSERVED_AT_SUCCESSOR_ANALYSIS
```

The repository also contains schema/protocol/record version identifiers, dependency versions, workflow fixture-package versions, external tool versions, and test-only `--version` probes. Those namespaces must remain separate from Kodac release-version authority.

## Required future contract interpretation

The later evidence-scoped contract must preserve at least these non-equivalences:

```text
ENGINEERING_MILESTONE_IDENTITY != RELEASE_VERSION
P8_UNIT_NUMBER != RELEASE_VERSION
PROTOCOL_VERSION != PACKAGE_VERSION
PROTOCOL_VERSION != RELEASE_VERSION
SCHEMA_VERSION != RELEASE_VERSION
RECORD_VERSION != RELEASE_VERSION
DEPENDENCY_VERSION != RELEASE_VERSION
WORKFLOW_FIXTURE_VERSION != RELEASE_VERSION
EXTERNAL_TOOL_VERSION != RELEASE_VERSION
LEGACY_PROJECT_VERSION != KODAC_RELEASE_VERSION
SOURCE_PACKAGE_VERSION != PUBLISHED_RELEASE
PRIVATE_PACKAGE_VERSION != PUBLIC_PACKAGE_VERSION_AUTHORITY
PACKAGE_BIN_DECLARATION != PUBLISHED_EXECUTABLE
PRIVATE_PACKAGE_METADATA != PACKAGE_REGISTRY_AVAILABILITY
VERSION_STRING != RELEASE_VERSION_AUTHORITY
GIT_COMMIT != RELEASE
GIT_TAG != RELEASE_AUTHORITY_UNLESS_SEPARATELY_AUTHORIZED
GITHUB_RELEASE_OBJECT != PUBLICATION_AUTHORITY_UNLESS_SEPARATELY_AUTHORIZED
SIGNED_GIT_COMMIT != SIGNED_RELEASE_ARTIFACT
CI_SUCCESS != RELEASE_AUTHORITY
TECHNICAL_CLOSURE != RELEASE_READINESS
DONE_GATE_PROOF != RELEASE_AUTHORITY
PROVEN_READY != RELEASE_AUTHORITY
CURRENT_VIEW_RECONCILIATION != RELEASE_AUTHORITY
```

The contract must fail closed on unknown or unsupported release/version claims. Omission, naming similarity, semver-like syntax, historical tooling metadata, protocol numbering, schema numbering, or successful CI must not be converted into release authority.

## Required README and current-view boundary preservation

Current README truth already states:

```text
TECHNICAL_PROOF != RELEASE_AUTHORITY
TECHNICAL_CLOSURE != PUBLIC_LAUNCH_AUTHORITY
PRIVATE_RUNTIME_PACKAGE != PUBLISHED_OR_GLOBALLY_INSTALLABLE_PACKAGE
```

Current views additionally preserve the runtime package as private/unpublished, `--version` as not admitted, package-version mutation as unauthorized, public release/publication/deployment as unauthorized, P8-R5+ as unauthorized by numbering, P9 as unauthorized by implication, and project completion as not established.

The later contract may document these facts but may not mutate README or current views in the same candidate.

## Public release and publication remain separate future authority

Even after a future release/version-separation contract itself becomes externally proven closed canonical, none of the following follows automatically:

```text
PUBLIC_RELEASE_AUTHORITY
PACKAGE_PUBLICATION_AUTHORITY
PACKAGE_REGISTRY_ACCESS
PACKAGE_VERSION_SELECTION
PACKAGE_VERSION_MUTATION
GIT_TAG_CREATION
GITHUB_RELEASE_CREATION
RELEASE_ARTIFACT_CREATION
RELEASE_ARTIFACT_SIGNING
RELEASE_CHANNEL_CREATION
UPDATE_CHANNEL_CREATION
CHANGELOG_AUTOMATION
RELEASE_WORKFLOW_CREATION
CLI_--version_ADMISSION
CLI_version_COMMAND_ADMISSION
PRODUCTION_READINESS_CLAIM
BRAND_OR_LEGAL_NAME_CLEARANCE_CLAIM
DEPLOYMENT_AUTHORITY
```

Each such concern requires fresh evidence-driven analysis and separate canonical authorization if it is ever selected.

## Historical and safety boundaries that must remain preserved

The later contract must not rewrite or weaken existing governance or evidence, including:

```text
PR_520_ADVERSE_EVIDENCE = PRESERVE
PR_522_PR_523_FIX_FORWARD_REMEDIATION = PRESERVE
PR_531_BOUNDED_ASK_STATIC_FALLBACK = PRESERVE_WITHOUT_GENERALIZATION
NODE_22_P8_R4_FIRST_ATTEMPT_FAILURE = PRESERVE_AS_UNSUPPORTED_HISTORICAL_EVIDENCE
PR_541_RECONCILIATION_CLOSURE = PRESERVE
PR_542_OPERATIONAL_DOCS_AUTHORIZATION_CLOSURE = PRESERVE
PR_543_OPERATIONAL_DOCS_CONTRACT_CLOSURE = PRESERVE
PR_544_CURRENT_VIEW_AUTHORIZATION_CLOSURE = PRESERVE
PR_546_CURRENT_VIEW_RECONCILIATION_CLOSURE = PRESERVE
PRIVACY_EGRESS_BOUNDARIES = PRESERVE
INSTALLATION_UPDATE_INTEGRITY_BOUNDARIES = PRESERVE
OPERATIONAL_DOCS_EXAMPLES_BOUNDARIES = PRESERVE
K2_TRUSTED_SIDE_EFFECT_BOUNDARY = UNCHANGED
K5_PROOF_BOUNDARY = UNCHANGED
DONE_GATE_AUTHORITY = UNCHANGED
```

No release/version documentation may create provider/model, network, credential, persistence, telemetry, approval, verification, write, execution, or external side-effect authority.

## Explicit non-grants

```text
SOURCE_RUNTIME_MUTATION = NOT_AUTHORIZED
TEST_SCHEMA_MUTATION = NOT_AUTHORIZED
PACKAGE_BIN_MUTATION = NOT_AUTHORIZED
PACKAGE_METADATA_MUTATION = NOT_AUTHORIZED
PACKAGE_NAME_MUTATION = NOT_AUTHORIZED
PACKAGE_VERSION_MUTATION = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
WORKFLOW_DEPENDENCY_LOCKFILE_MUTATION = NOT_AUTHORIZED
RELEASE_WORKFLOW_MUTATION = NOT_AUTHORIZED
CLI_BEHAVIOR_CHANGE = NOT_AUTHORIZED
CLI_--version_ADMISSION = NOT_AUTHORIZED
CLI_version_COMMAND_ADMISSION = NOT_AUTHORIZED
README_MUTATION = NOT_AUTHORIZED
CURRENT_VIEW_MUTATION = NOT_AUTHORIZED
TAG_CREATION_OR_MUTATION = NOT_AUTHORIZED
GITHUB_RELEASE_CREATION_OR_MUTATION = NOT_AUTHORIZED
RELEASE_ARTIFACT_CREATION = NOT_AUTHORIZED
RELEASE_SIGNING = NOT_AUTHORIZED
PACKAGE_REGISTRY_ACCESS = NOT_AUTHORIZED
PACKAGE_PUBLICATION = NOT_AUTHORIZED
INSTALLER_IMPLEMENTATION = NOT_AUTHORIZED
UPDATER_IMPLEMENTATION = NOT_AUTHORIZED
UPDATE_CHANNEL_IMPLEMENTATION = NOT_AUTHORIZED
ROLLBACK_CHANNEL_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
BRAND_OR_LEGAL_CLAIM = NOT_AUTHORIZED
PRODUCTION_READINESS_CLAIM = NOT_AUTHORIZED
NEW_PROVIDER_MODEL_ADMISSION = NOT_AUTHORIZED
PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
SECRET_CREDENTIAL_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_MUTATION = NOT_AUTHORIZED
TELEMETRY_UPLOAD_ANALYTICS_LEARNING = NOT_AUTHORIZED
K2_K5_DONE_GATE_AUTHORITY_CHANGE = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
REBASE = NOT_AUTHORIZED
FORCE_PUSH = NOT_AUTHORIZED
HISTORY_REWRITE = NOT_AUTHORIZED
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
SUBSTANTIVE_SEMANTIC_SECURITY_PRIVACY_SUPPLY_CHAIN_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_NORMAL_MERGE = REQUIRED
POST_MERGE_EXTERNAL_PROOF = REQUIRED
WAIVER = NO
```

Any head/base movement, material finding, unresolved actionable thread, check regression, changed-path expansion, or ruleset change invalidates earlier qualification evidence.

## Qualification gate for the later contract candidate

This authorization does not pre-qualify the later product contract. That later one-path candidate must independently prove:

```text
BASE == THEN_CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_FUTURE_CONTRACT_PATH
NO_SECOND_PATH = PASS
AUTHORIZATION_POST_MERGE_PROOF_BOUND = PASS
CURRENT_VERSION_NAMESPACES_BOUND_WITHOUT_CONFLATION = PASS
PRIVATE_UNPUBLISHED_RUNTIME_STATE_PRESERVED = PASS
NO_RELEASE_OR_TAG_OBJECT_CREATED = PASS
NO_PACKAGE_METADATA_MUTATION = PASS
NO_CLI_VERSION_SURFACE_MUTATION = PASS
NO_PUBLICATION_OR_RELEASE_AUTHORITY_CREATED = PASS
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_PRIVACY_SUPPLY_CHAIN_GOVERNANCE_REVIEW = CLEAN
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
P8_RELEASE_VERSION_SEPARATION_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL
```

Even after authorization closure, only the exact one-path evidence-scoped contract becomes eligible. No package/version, CLI, tag, GitHub Release, artifact, signing, registry, publication, deployment, brand, P8-R5+, P9, or project-completion authority follows by implication.

The later contract likewise cannot certify its own closure. It must receive external post-merge proof before any current-view reconciliation or further successor-authority analysis may treat it as `CLOSED_CANONICAL`.
