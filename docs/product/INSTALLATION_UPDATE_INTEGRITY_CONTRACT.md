# Kodac Installation / Update Integrity Contract

## Classification

```text
CLASS = PRODUCT CONTRACT / DOCUMENTATION_ONLY / EVIDENCE_SCOPED
DOCUMENTATION_STATUS = CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
CANONICAL_BASE_MAIN = c6b05daf2f75c11ad17f838dca60fffd524ad93c
AUTHORIZATION = PR #538 / proof 5608989633
PACKAGE_METADATA_PATH = packages/kodac-runtime/package.json
PACKAGE_METADATA_BLOB = af4c20a3dae387c15cc5fb2eb28d415c8f115b95
README_PATH = README.md
README_BLOB = 1e046359e0639459810504b3a3e3af4f3c110bfd
WAIVER = NO
```

This document records what Kodac can and cannot currently claim about installation and update integrity. It is interpretation and evidence documentation only. It does not implement or authorize an installer, updater, package registry publication, artifact signing, update service, rollback service, release channel, package-version change, or public release.

Unknown, absent, or unverified installation/update behavior is fail-closed: it must remain `NOT_ESTABLISHED` rather than being inferred from source-tree, CI, Git, or package metadata.

## Current package facts

```text
RUNTIME_PACKAGE_NAME = @kodac/runtime-internal
RUNTIME_PACKAGE_VERSION = 0.0.0-k2
RUNTIME_PACKAGE_PRIVATE_UNPUBLISHED = YES
NODE_ENGINE = >=24
PACKAGE_BIN_KODAC = ./bin/kodac.mjs
```

The repository README establishes a repository-local development invocation for inspecting CLI help and explicitly says that this does not imply publication, global installability, or public release.

```text
REPOSITORY_LOCAL_CLI_EXECUTION = ESTABLISHED
PUBLIC_PACKAGE_INSTALLABILITY = NOT_ESTABLISHED
GLOBAL_INSTALLABILITY = NOT_ESTABLISHED
PACKAGE_REGISTRY_PUBLICATION = NOT_ESTABLISHED
INSTALLER_IMPLEMENTATION = NOT_ESTABLISHED
UPDATER_IMPLEMENTATION = NOT_ESTABLISHED
SIGNED_INSTALL_ARTIFACT = NOT_ESTABLISHED
SIGNED_UPDATE_ARTIFACT = NOT_ESTABLISHED
UPDATE_CHANNEL = NOT_ESTABLISHED
ROLLBACK_CHANNEL = NOT_ESTABLISHED
```

## Evidence interpretation boundary

The following equivalences are forbidden:

```text
REPOSITORY_LOCAL_EXECUTION != PUBLIC_INSTALLABILITY
PACKAGE_BIN_DECLARATION != PUBLISHED_EXECUTABLE
PRIVATE_PACKAGE_METADATA != PACKAGE_REGISTRY_AVAILABILITY
VERSION_STRING != RELEASE_VERSION_AUTHORITY
GIT_COMMIT_SIGNATURE != PACKAGE_ARTIFACT_SIGNATURE
SOURCE_TREE_IDENTITY != DISTRIBUTED_ARTIFACT_IDENTITY
CI_SUCCESS != INSTALLATION_UPDATE_INTEGRITY
DOCUMENTATION != RUNTIME_OR_DISTRIBUTION_ENFORCEMENT
```

A GitHub-signed canonical merge proves the identity and signature state of that Git commit. It does not prove that an npm tarball, installer executable, archive, updater payload, or other distributed artifact exists or carries an equivalent signature.

Likewise, a source-tree blob or tree identity proves repository content identity at a revision. It does not by itself identify bytes later downloaded by an end user.

## Installation integrity claims

A future installation-integrity claim would require evidence appropriate to the actual distribution mechanism. Depending on the mechanism, that may include explicit evidence for artifact identity, provenance, expected publisher/source, integrity verification, platform support, installation scope, and failure behavior.

No such future mechanism is admitted by this document.

Current classification:

```text
CANONICAL_SOURCE_REVISION_IDENTITY = ESTABLISHED_WHERE_PROVEN_BY_GIT_EVIDENCE
CANONICAL_MERGE_SIGNATURE = ESTABLISHED_WHERE_PROVEN_BY_GITHUB_EVIDENCE
DISTRIBUTED_INSTALL_ARTIFACT_IDENTITY = NOT_ESTABLISHED
DISTRIBUTED_INSTALL_ARTIFACT_PROVENANCE = NOT_ESTABLISHED
DISTRIBUTED_INSTALL_ARTIFACT_SIGNATURE = NOT_ESTABLISHED
INSTALL_SOURCE_PINNING = NOT_ESTABLISHED
INSTALL_ARTIFACT_INTEGRITY_VERIFICATION = NOT_ESTABLISHED
INSTALL_PLATFORM_MATRIX = NOT_ESTABLISHED_AS_DISTRIBUTION_CONTRACT
INSTALL_ROLLBACK = NOT_ESTABLISHED
```

Source-level Node engine metadata may constrain repository-local runtime expectations. It is not a distribution compatibility certificate.

## Update integrity claims

An update claim is distinct from an installation claim. A future update mechanism would require its own admitted source of update metadata and artifacts, integrity policy, target-version identity, failure semantics, rollback semantics, and authorization boundary.

Current classification:

```text
UPDATE_DISCOVERY_MECHANISM = NOT_ESTABLISHED
UPDATE_METADATA_SOURCE = NOT_ESTABLISHED
UPDATE_ARTIFACT_IDENTITY = NOT_ESTABLISHED
UPDATE_ARTIFACT_PROVENANCE = NOT_ESTABLISHED
UPDATE_ARTIFACT_SIGNATURE = NOT_ESTABLISHED
UPDATE_INTEGRITY_VERIFICATION = NOT_ESTABLISHED
UPDATE_CHANNEL = NOT_ESTABLISHED
UPDATE_ROLLBACK_CHANNEL = NOT_ESTABLISHED
AUTO_UPDATE = NOT_ESTABLISHED
BACKGROUND_UPDATE = NOT_ESTABLISHED
DOWNGRADE_POLICY = NOT_ESTABLISHED
```

A package version string in source is not evidence that an update exists, has been published, is retrievable, or may be applied.

## Fail-closed decision rule

When asked whether Kodac currently supports a distribution property not proven above, the safe classification is:

```text
CLAIM_WITH_DIRECT_CANONICAL_EVIDENCE = REPORT_THE_BOUNDED_EVIDENCE
CLAIM_WITHOUT_DIRECT_CANONICAL_EVIDENCE = NOT_ESTABLISHED
CLAIM_REQUIRING_NEW_SIDE_EFFECT_OR_DISTRIBUTION_MECHANISM = NOT_AUTHORIZED_BY_THIS_CONTRACT
```

The contract must not convert absence of evidence into a positive claim such as “secure installer,” “verified updater,” “signed release,” “trusted update channel,” “reproducible package,” or “safe rollback.”

## Relationship to repository-local CLI usage

The repository-local invocation documented by README is development/repository usage:

```bash
cd packages/kodac-runtime
npm run cli -- --help
```

Its evidence meaning is intentionally narrow:

```text
REPOSITORY_CHECKOUT_REQUIRED = YES_FOR_THIS_DOCUMENTED_INVOCATION
REPOSITORY_LOCAL_SCRIPT_EXISTS = YES
PRIVATE_PACKAGE_PUBLICATION_REQUIRED = NO_FOR_REPOSITORY_LOCAL_INVOCATION
PUBLIC_INSTALLATION_PATH_PROVEN = NO
GLOBAL_BINARY_INSTALLATION_PATH_PROVEN = NO
```

This contract does not add new quick-start commands, installation commands, registry commands, curl/download commands, or update commands.

## Relationship to CI and provenance

Repository CI can prove the checked revision passed the checks that actually ran. Provenance records can prove admitted source identities within their recorded scopes. Neither evidence class automatically extends to a future distributed package or updater payload.

A future distribution claim must bind the exact distributed bytes and the mechanism that produced and delivered them; it cannot inherit integrity merely because the source commit was green or signed.

## Explicit non-grants

```text
SOURCE_RUNTIME_MUTATION = NOT_AUTHORIZED
TEST_SCHEMA_PACKAGE_BIN_MUTATION = NOT_AUTHORIZED
WORKFLOW_DEPENDENCY_LOCKFILE_MUTATION = NOT_AUTHORIZED
CLI_BEHAVIOR_CHANGE = NOT_AUTHORIZED
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
NETWORK_ACCESS = NOT_AUTHORIZED
SECRET_CREDENTIAL_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_MUTATION = NOT_AUTHORIZED
TELEMETRY_UPLOAD_ANALYTICS_LEARNING = NOT_AUTHORIZED
CROSS_REPOSITORY_ACCESS = NOT_AUTHORIZED
OPERATIONAL_DOCS_EXAMPLES_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## Predecessor lineage

This contract follows the externally proven authorization and does not expand the meaning of earlier P8 units:

```text
POST_PROVIDER_FALLBACK_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #537 / proof 5608863482
P8_INSTALLATION_UPDATE_INTEGRITY_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL / PR #538 / proof 5608989633
INSTALLATION_UPDATE_INTEGRITY_CONTRACT_DOCUMENTATION = CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
GENERAL_DETERMINISTIC_STATIC_FALLBACK = NOT_ESTABLISHED
P8_PRODUCT_AND_DISTRIBUTION_HARDENING = NOT_CLOSED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
```

PR #520 remains adverse merged-but-not-closed evidence. PR #522/#523 remain the separately authorized and proven fix-forward remediation. This contract neither validates nor rewrites that incident lineage.

## Closure semantics

This document cannot certify its own closure. Only exact-head qualification, guarded normal merge, and complete external post-merge proof may later classify:

```text
P8_INSTALLATION_UPDATE_INTEGRITY_CONTRACT_DOCUMENTATION = CLOSED_CANONICAL
```

Even after documentation closure:

```text
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED_BY_DOCUMENTATION_CLOSURE
PACKAGE_PUBLICATION = NOT_AUTHORIZED_BY_DOCUMENTATION_CLOSURE
PUBLIC_RELEASE = NOT_AUTHORIZED_BY_DOCUMENTATION_CLOSURE
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```
