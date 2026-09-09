# Kodac Operational Docs / Examples Contract

## Classification

```text
CLASS = PRODUCT CONTRACT / DOCUMENTATION_ONLY / EVIDENCE_SCOPED
DOCUMENTATION_STATUS = CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
CANONICAL_BASE_MAIN = 43463b3b98f2d8277b15e35aded620fb946ac528
AUTHORIZATION = PR #542 / proof 5609589933
CLI_PATH = packages/kodac-runtime/src/cli.ts
CLI_BLOB = e215e3b20616f1089978eb8eb8af67a2c1dc7620
PACKAGE_METADATA_PATH = packages/kodac-runtime/package.json
PACKAGE_METADATA_BLOB = af4c20a3dae387c15cc5fb2eb28d415c8f115b95
README_PATH = README.md
README_BLOB = 1e046359e0639459810504b3a3e3af4f3c110bfd
PRIVACY_EGRESS_CONTRACT_BLOB = d5530221edeb23a5d0806d3f7d960392c5dab2b7
INSTALLATION_UPDATE_INTEGRITY_CONTRACT_BLOB = 717dfd39fa3abbb2692c06b3596c105de0c10e33
PROVIDER_AVAILABILITY_FALLBACK_CONTRACT_BLOB = 6cc916c7d0e6663919ac2eeeb9793a3d3b0db0ce
WAIVER = NO
```

This contract defines how Kodac operational documentation and examples may describe already-canonical behavior without turning documentation into execution, installation, provider, network, approval, release, or completion authority.

It adds no runnable example, README command, source/runtime behavior, package/distribution mechanism, provider/model admission, credential flow, workflow, installer/updater, release artifact, package version, or public release surface.

Unknown or unproven operational behavior remains fail closed. Documentation must not promote a plausible command or workflow into a supported product claim unless exact canonical implementation/evidence establishes the relevant behavior and authority boundary.

## Core interpretation rule

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

A documentation example is descriptive evidence for the exact surface it names. It is not a grant to execute side effects, invoke a provider, access credentials, publish a package, change approval state, bypass K2, or claim production readiness.

## Current repository-local CLI surface

Current canonical package facts are:

```text
RUNTIME_PACKAGE_NAME = @kodac/runtime-internal
RUNTIME_PACKAGE_VERSION = 0.0.0-k2
RUNTIME_PACKAGE_PRIVATE_UNPUBLISHED = YES
NODE_ENGINE = >=24
PACKAGE_BIN_KODAC = ./bin/kodac.mjs
REPOSITORY_LOCAL_CLI_EXECUTION = ESTABLISHED
PUBLIC_PACKAGE_INSTALLABILITY = NOT_ESTABLISHED
GLOBAL_INSTALLABILITY = NOT_ESTABLISHED
```

The canonical CLI exposes these command families:

```text
apply-patch
ask
solve
```

Current syntax includes:

```text
kodac apply-patch <patch-file> [options]
kodac ask <prompt> [options]
kodac solve <task> [options]
```

These are syntax descriptions. The package remains private and unpublished, so the bare `kodac` spelling must not be presented as proof that an end user can install or invoke a globally published executable.

The already-canonical README documents a repository-local development invocation for help inspection. This contract records that interpretation without changing README:

```text
cd packages/kodac-runtime
npm run cli -- --help
```

```text
REPOSITORY_CHECKOUT_REQUIRED = YES_FOR_THIS_DOCUMENTED_INVOCATION
REPOSITORY_LOCAL_SCRIPT_EXISTS = YES
PUBLISHED_PACKAGE_REQUIRED = NO_FOR_REPOSITORY_LOCAL_INVOCATION
PUBLIC_INSTALLATION_PATH_PROVEN = NO
GLOBAL_BINARY_INSTALLATION_PATH_PROVEN = NO
```

## Example-safety classes

Operational documentation should classify an example before presenting it as supported guidance.

### Repository-local inspection

```text
CLASS = REPOSITORY_LOCAL_READ_ONLY_OR_INSPECTION_EXAMPLE
DOCUMENTABLE_WHEN = DIRECTLY_PROVEN_BY_CANONICAL_REPOSITORY_BEHAVIOR
EXECUTION_AUTHORITY_CREATED = NO
PUBLIC_INSTALLABILITY_CREATED = NO
```

A repository-local help-inspection example is the clearest current low-risk class. It still depends on a repository checkout and the supported Node runtime; it is not a public installation example.

### Read-oriented model request

```text
CLASS = MODEL_OR_PROVIDER_EXAMPLE
COMMAND_FAMILY = ask
DEFAULT_PROVIDER = fixture
DEFAULT_MODEL = fixture/deterministic-v1
PROVIDER_CAPABILITY_CONTEXT_REQUIRED = YES
CREDENTIAL_AND_EGRESS_CONTEXT_REQUIRED_FOR_NON_FIXTURE_PROVIDER = YES
EXECUTION_AUTHORITY_CREATED = NO
```

The current CLI describes `ask` as a read-oriented model request path. A documentation example may explain syntax and the default fixture behavior, but it must not imply that every provider path is offline, credential-free, admitted, or safe for arbitrary sensitive input.

### Bounded static credential fallback

The PR #531 fallback remains a narrow operational fact:

```text
COMMAND = ask only
ACTIVATION = explicit --static-fallback only
OUTPUT_MODE = human output only
ELIGIBLE_PROVIDER_ERROR_OPENAI = credential_missing
ELIGIBLE_PROVIDER_ERROR_OPENAI_COMPATIBLE = credentials_missing
SUCCESSFUL_PROVIDER_WITH_OPT_IN = ordinary ask behavior preserved
MISMATCHED_PROVIDER_ERROR_PAIR = fail closed
UNKNOWN_PROVIDER = fail closed
GENERIC_HTTP_NETWORK_STREAM_ABORT_AND_OTHER_FAILURES = fail closed
ask --static-fallback --json = usage error before session/provider activity
GENERAL_DETERMINISTIC_STATIC_FALLBACK = NOT_ESTABLISHED
```

Documentation must not generalize this into cross-provider fallback, automatic fixture substitution, machine-readable fallback, `solve` fallback, or global offline behavior.

### Side-effecting patch example

```text
CLASS = SIDE_EFFECTING_EXAMPLE
COMMAND_FAMILY = apply-patch
SURFACE = EXISTING_GUARDED_PATCH_PATH
MUST_STATE_WORKSPACE_POLICY_AND_EVIDENCE_CONTEXT = YES
AUTOMATIC_WRITE_AUTHORITY = NO
```

An `apply-patch` example would describe an existing guarded side-effect path. Merely documenting syntax does not authorize a patch, widen allowed paths, bypass policy, or guarantee that an arbitrary patch will be accepted.

### Bounded solve example

```text
CLASS = SIDE_EFFECTING_EXAMPLE
COMMAND_FAMILY = solve
BOUNDED_AGENT_LOOP = YES
WRITE_APPROVAL_FLAG_EXISTS = --approve-writes
VERIFICATION_APPROVAL_FLAG_EXISTS = --approve-verification
VERIFICATION_COMMAND_SURFACE_EXISTS = --verify-command <json>
APPROVAL_FLAG_DOCUMENTATION != AUTOMATIC_APPROVAL_AUTHORITY
```

Any future example involving `solve` must preserve the existing bounded agent loop, policy, workspace, execution gateway, verification, evidence, and Done Gate semantics. Documentation may explain approval flags; it must not pre-grant them, automate them, or imply that `PROVEN_READY` follows merely from invoking the command.

### Installation or update example

```text
CLASS = INSTALL_OR_UPDATE_EXAMPLE
CURRENT_SUPPORT_CLASSIFICATION = NOT_ESTABLISHED
INSTALLER_IMPLEMENTATION = NOT_ESTABLISHED
UPDATER_IMPLEMENTATION = NOT_ESTABLISHED
PACKAGE_REGISTRY_PUBLICATION = NOT_ESTABLISHED
SIGNED_INSTALL_ARTIFACT = NOT_ESTABLISHED
SIGNED_UPDATE_ARTIFACT = NOT_ESTABLISHED
UPDATE_CHANNEL = NOT_ESTABLISHED
ROLLBACK_CHANNEL = NOT_ESTABLISHED
```

Until separately proven, operational documentation must not publish an install, update, registry, global-binary, signed-artifact, rollback, or auto-update example as supported product guidance.

### Public-release example

```text
CLASS = PUBLIC_RELEASE_EXAMPLE
CURRENT_SUPPORT_CLASSIFICATION = NOT_AUTHORIZED
```

Public launch, package publication, deployment, release signing, production-readiness, and legal/name-clearance claims require separate canonical authority and evidence.

### Unknown or unproven example

```text
CLASS = UNKNOWN_OR_UNPROVEN_EXAMPLE
ACTION = DO_NOT_PRESENT_AS_SUPPORTED
```

If the exact behavior, authority, failure semantics, or environment requirement is not established, documentation must say so rather than filling the gap with an inferred workflow.

## Evidence and privacy context

Current evidence behavior includes:

```text
DEFAULT_EVIDENCE_ROOT = ~/.kodac/evidence/<workspace-key>
WORKSPACE_KEY = FIRST_16_HEX_OF_SHA256_RESOLVED_WORKSPACE_PATH
DEFAULT_EVIDENCE_RETENTION_DAYS = 30
MAX_EVIDENCE_RETENTION_DAYS = 3650
MAY_CONTAIN_LOSSLESS_MODEL_REQUEST_SNAPSHOTS = true
```

The CLI may accept:

```text
--evidence-dir <dir>
--evidence-retention-days <n>
```

Operational documentation must preserve these privacy interpretations:

```text
LOCAL_FILESYSTEM_PERSISTENCE != REMOTE_TELEMETRY
LOCAL_FILESYSTEM_PERSISTENCE != REMOTE_UPLOAD
LOCAL_FILESYSTEM_PERSISTENCE != NETWORK_AUTHORITY
RETENTION_EXPIRY != GUARANTEED_IMMEDIATE_DELETION
RETENTION_POLICY != SECURE_ERASURE_GUARANTEE
POSIX_OWNER_ONLY_MODE != ENCRYPTION_AT_REST
POSIX_OWNER_ONLY_MODE != SECRET_REDACTION
DEFAULT_FIXTURE_PROVIDER != PROOF_THAT_ALL_PROVIDER_CAPABLE_PATHS_ARE_OFFLINE
GLOBAL_OFFLINE_GUARANTEE = NOT_PROVEN
```

Because evidence may contain lossless model request snapshots, documentation must not tell users that arbitrary sensitive prompts are automatically redacted or safe merely because evidence is local.

## Provider and network context

The current runtime is provider-capable. The default fixture provider is in-process and deterministic, but provider abstraction and default fixture behavior do not establish a product-wide network prohibition.

```text
PROVIDER_CAPABLE != PROVIDER_INVOKED
DOCUMENTED_PROVIDER_CAPABILITY != PROVIDER_EXECUTION_AUTHORITY
DEFAULT_FIXTURE_PROVIDER != EXTERNAL_PROVIDER_PROHIBITION_PROOF
ABSENCE_OF_OBSERVED_NETWORK_ACTIVITY != NETWORK_DENIAL_PROOF
```

Any future provider-specific operational example must bind the exact admitted provider implementation, credentials behavior, egress behavior, model identifier, and canonical execution authority. This contract does not admit a provider or authorize network/credential access.

## Installation and distribution context

The installation/update integrity contract remains authoritative for distribution interpretation:

```text
REPOSITORY_LOCAL_EXECUTION != PUBLIC_INSTALLABILITY
PACKAGE_BIN_DECLARATION != PUBLISHED_EXECUTABLE
PRIVATE_PACKAGE_METADATA != PACKAGE_REGISTRY_AVAILABILITY
VERSION_STRING != RELEASE_VERSION_AUTHORITY
GIT_COMMIT_SIGNATURE != PACKAGE_ARTIFACT_SIGNATURE
SOURCE_TREE_IDENTITY != DISTRIBUTED_ARTIFACT_IDENTITY
CI_SUCCESS != INSTALLATION_UPDATE_INTEGRITY
```

Operational examples must not invent a distribution path around these boundaries.

## Done Gate and completion language

Operational docs may describe the Done Gate and `PROVEN_READY`, but must preserve:

```text
COMMAND_INVOCATION != PROVEN_READY
MODEL_OUTPUT != COMPLETION_TRUTH
VERIFICATION_COMMAND_EXECUTION != DONE_GATE_SUCCESS
CI_SUCCESS != PROJECT_COMPLETION
BOUNDED_UNIT_CLOSURE != PUBLIC_RELEASE_AUTHORITY
```

A documented workflow must not claim completion unless the exact runtime/evidence path independently establishes the required Done Gate result.

## Historical and current lineage

```text
P8_BOUNDED_STATIC_ASK_FALLBACK_IMPLEMENTATION = CLOSED_CANONICAL / PR #531 / proof 5607981953
POST_PROVIDER_FALLBACK_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #537 / proof 5608863482
P8_INSTALLATION_UPDATE_INTEGRITY_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL / PR #538 / proof 5608989633
P8_INSTALLATION_UPDATE_INTEGRITY_CONTRACT_DOCUMENTATION = CLOSED_CANONICAL / PR #539 / proof 5609169160
P8_POST_INSTALLATION_UPDATE_INTEGRITY_CONTRACT_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL / PR #540 / proof 5609387267
POST_INSTALLATION_UPDATE_INTEGRITY_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #541 / proof 5609501964
P8_OPERATIONAL_DOCS_EXAMPLES_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL / PR #542 / proof 5609589933
OPERATIONAL_DOCS_EXAMPLES_CONTRACT_DOCUMENTATION = CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
```

PR #520 remains adverse merged-but-not-closed evidence. PR #522/#523 remain separately authorized and proven fix-forward remediation. This contract does not retroactively validate or rewrite that incident lineage.

## Explicit non-grants

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
RELEASE_VERSION_SEPARATION_MUTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## Closure semantics

This document cannot certify its own closure. Only exact-head qualification, guarded normal merge, and complete external post-merge proof may later classify:

```text
P8_OPERATIONAL_DOCS_EXAMPLES_CONTRACT_DOCUMENTATION = CLOSED_CANONICAL
```

Even after documentation closure, no README/example artifact, source/runtime mutation, approval automation, provider/model invocation, installation/update implementation, package publication/version mutation, release/version separation, public release/deployment, P8-R5+, P9, or project-completion authority follows by implication.
