# Kodac Release / Version Separation Contract

## Classification

```text
CLASS = PRODUCT_CONTRACT / DOCUMENTATION_ONLY / EVIDENCE_SCOPED
STATUS = CONTRACT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
CANONICAL_BASE_MAIN = bad24dabb910a2fcc859d86589eaf62e3c192cb5
AUTHORIZATION = PR #547 / CLOSED_CANONICAL / proof 5610072225
AUTHORIZATION_BLOB = dc37399526d7f37a4c260fb8c07ebf74d6edc304
PREDECESSOR_RECONCILIATION = PR #546 / CLOSED_CANONICAL / proof 5609860097
WAIVER = NO
```

This contract documents how Kodac must interpret version-like identifiers and release-like repository objects. It does not select a Kodac release version, mutate package metadata, add a CLI version surface, create a tag or GitHub Release, build or sign an artifact, publish a package, deploy software, or make a production-readiness, brand, legal, or public-launch claim.

Only complete external post-merge proof may classify this contract `CLOSED_CANONICAL`.

## Purpose

Kodac contains several independent version namespaces. Similar syntax does not make those namespaces equivalent, and no existing version string is evidence of a Kodac public release.

The governing rule is fail closed:

```text
UNKNOWN_VERSION_SEMANTICS = DO_NOT_TREAT_AS_RELEASE_VERSION
UNKNOWN_RELEASE_AUTHORITY = DO_NOT_RELEASE_OR_PUBLISH
```
## Current version-bearing evidence

At this contract base, the following version-bearing facts are distinct:

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
GITHUB_RELEASES = NONE_OBSERVED_AT_AUTHORIZATION_QUALIFICATION
GIT_TAGS = NONE_OBSERVED_AT_AUTHORIZATION_QUALIFICATION
```

Repository schemas, evidence records, workflow fixtures, dependencies, external tools, and compatibility contracts also carry version identifiers. Those identifiers remain local to their own contracts and are not Kodac release-version evidence.
## Required namespace separation

The following non-equivalences are mandatory:

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
GIT_TAG != RELEASE_AUTHORITY
GITHUB_RELEASE_OBJECT != PUBLICATION_AUTHORITY
SIGNED_GIT_COMMIT != SIGNED_RELEASE_ARTIFACT
CI_SUCCESS != RELEASE_AUTHORITY
TECHNICAL_CLOSURE != RELEASE_READINESS
DONE_GATE_PROOF != RELEASE_AUTHORITY
PROVEN_READY != RELEASE_AUTHORITY
CURRENT_VIEW_RECONCILIATION != RELEASE_AUTHORITY
```
## Engineering milestone semantics

Engineering milestones describe repository work, evidence, and governance progression. They are not user-facing release identifiers.

```text
K2 = ENGINEERING_PROGRAM_IDENTITY
K3 = ENGINEERING_PROGRAM_IDENTITY
K4 = ENGINEERING_PROGRAM_IDENTITY
K5 = ENGINEERING_PROGRAM_IDENTITY
K6 = ENGINEERING_PROGRAM_IDENTITY
P1_P9 = PROGRAM_OR_PHASE_IDENTITY
R1_RN = BOUNDED_UNIT_IDENTITY
```

A milestone may be technically closed while Kodac remains unreleased. A later release may contain work from multiple milestones. No milestone number, proof state, or closure label may be converted into semantic-version authority by convention or inference.

## Protocol, schema, and record version semantics

Protocol/schema/record versions identify compatibility contracts for structured data. They may change independently from software release versions.

```text
PROTOCOL_COMPATIBILITY_CHANGE != RELEASE_VERSION_SELECTION
SCHEMA_COMPATIBILITY_CHANGE != RELEASE_VERSION_SELECTION
RECORD_FORMAT_CHANGE != RELEASE_VERSION_SELECTION
RELEASE_VERSION_CHANGE != AUTOMATIC_PROTOCOL_CHANGE
```

A protocol value such as `VERSION = 1` is meaningful only within the protocol that defines it.
## Source package version semantics

The source-tree runtime metadata currently contains:

```text
name = @kodac/runtime-internal
version = 0.0.0-k2
private = true
```

That version is source metadata for a private package. It is not evidence that a package was published, that an artifact exists in a registry, that an installable public CLI exists, or that Kodac has a public release version.

```text
SOURCE_PACKAGE_VERSION_PRESENT = YES
PUBLIC_PACKAGE_VERSION_SELECTED = NOT_ESTABLISHED
PACKAGE_REGISTRY_PUBLICATION = NOT_ESTABLISHED
PACKAGE_ARTIFACT_RETRIEVABILITY = NOT_ESTABLISHED
PUBLIC_RELEASE_VERSION_SELECTED = NOT_ESTABLISHED
```

Any future package-name or package-version mutation requires separate explicit authorization. This contract does not provide it.

## Legacy and tooling project versions

`kernux-index` and the legacy `nexusmcp/omni-bridge` package retain their own historical/tooling version metadata. Those versions do not become Kodac release versions merely because they are present in the same repository.

```text
KERNEL_OR_LEGACY_VERSION_ALIASING_TO_KODAC_RELEASE = PROHIBITED_WITHOUT_SEPARATE_AUTHORITY
```
## Git tag and GitHub Release semantics

A Git tag is a Git reference. A GitHub Release is repository-hosted release metadata. Neither object alone creates package-publication, deployment, production-readiness, or public-release authority.

```text
TAG_EXISTENCE != AUTHORIZED_RELEASE
TAG_NAME_SEMVER_SHAPE != RELEASE_VERSION_AUTHORITY
GITHUB_RELEASE_EXISTENCE != PACKAGE_PUBLICATION
GITHUB_RELEASE_EXISTENCE != DEPLOYMENT_AUTHORITY
GITHUB_RELEASE_EXISTENCE != PRODUCTION_READINESS
```

This contract authorizes no tag or GitHub Release creation, update, deletion, retargeting, draft publication, prerelease publication, or asset attachment.

Any future release object must be separately authorized and bound to exact canonical evidence available at that time. Historical absence of tags/releases is bounded evidence, not a permanent invariant.

## CLI version-surface semantics

Current P8 evidence does not admit either:

```text
kodac --version
kodac version
```

A future CLI version surface is a product/API behavior change and requires separate authorization. This contract does not define output syntax, source of truth, exit behavior, or compatibility semantics for such a command or flag.
## Release version selection boundary

This contract intentionally does not select a release version.

```text
KODAC_RELEASE_VERSION = NOT_SELECTED
KODAC_RELEASE_CHANNEL = NOT_SELECTED
KODAC_RELEASE_CANDIDATE_IDENTITY = NOT_ESTABLISHED
KODAC_PUBLIC_RELEASE_READINESS = NOT_ESTABLISHED
```

If a future release version is ever selected, the selection must be a separate canonical decision with exact scope and evidence. It must not be inferred from milestone numbering, package metadata, protocol/schema versions, branch names, commit messages, dates, issue/PR numbers, or historical project versions.

No semantic-version policy is adopted by this contract. No `major.minor.patch`, prerelease, build-metadata, calendar-version, or other numbering scheme is authorized by implication.

## Publication and artifact boundary

Release-version interpretation is separate from artifact creation and distribution.

```text
RELEASE_VERSION_SELECTION != ARTIFACT_CREATION_AUTHORITY
ARTIFACT_CREATION != PACKAGE_PUBLICATION_AUTHORITY
PACKAGE_PUBLICATION != DEPLOYMENT_AUTHORITY
PACKAGE_PUBLICATION != PRODUCTION_READINESS
PUBLIC_RELEASE != PACKAGE_REGISTRY_PUBLICATION_BY_IMPLICATION
```

No registry credentials, provenance attestations for a new release artifact, release signatures, SBOM publication, update channels, or deployment endpoints are created or authorized here.
## Installation and update relationship

The existing installation/update integrity contract remains authoritative for what Kodac may claim about installation and update behavior.

```text
RELEASE_VERSION_KNOWN != INSTALLER_EXISTS
RELEASE_VERSION_KNOWN != UPDATER_EXISTS
RELEASE_VERSION_KNOWN != UPDATE_CHANNEL_EXISTS
RELEASE_VERSION_KNOWN != ROLLBACK_CHANNEL_EXISTS
PACKAGE_VERSION_KNOWN != SAFE_UPDATE_PATH_PROVEN
```

This contract does not supersede or weaken installation/update integrity requirements. It adds no installer, updater, registry, update service, rollback service, release channel, or package-signature guarantee.

## Signature and provenance relationship

Git commit verification is evidence about a Git object. It is not evidence that a separately distributed artifact exists or is signed.

```text
VERIFIED_GIT_COMMIT != SIGNED_PACKAGE_ARTIFACT
VERIFIED_GIT_TAG != SIGNED_PACKAGE_ARTIFACT
SIGNED_RELEASE_METADATA != SIGNED_BINARY_OR_PACKAGE
CI_PROVENANCE != RELEASE_ARTIFACT_PROVENANCE_BY_IMPLICATION
```

Future artifact provenance or signing requires an exact separately authorized artifact identity and evidence chain.
## Public claims and brand boundary

A release/version string cannot by itself justify external claims.

```text
VERSION_SELECTED != PUBLIC_LAUNCH_AUTHORITY
VERSION_SELECTED != PRODUCTION_READINESS
VERSION_SELECTED != SECURITY_CERTIFICATION
VERSION_SELECTED != COMPLIANCE_CERTIFICATION
VERSION_SELECTED != BRAND_OR_LEGAL_NAME_CLEARANCE
RELEASE_OBJECT_CREATED != PUBLIC_CLAIM_AUTHORITY
```

README already separates technical proof from release authority and states that technical closure does not automatically authorize a public launch, production-readiness claim, or legal name clearance. This contract preserves that boundary.

Any future public-release, package-publication, deployment, production-readiness, or brand/legal claim requires its own exact canonical authorization and evidence.

## Consumer interpretation rules

Any roadmap, status page, CLI, package manifest, workflow, documentation page, automation, agent, or reviewer consuming version-like data must apply the namespace that owns the value.

```text
UNSCOPED_VERSION_LABEL = AMBIGUOUS
AMBIGUOUS_VERSION_LABEL = NOT_RELEASE_AUTHORITY
MISSING_RELEASE_AUTHORITY = FAIL_CLOSED
CONFLICTING_VERSION_NAMESPACES = DO_NOT_COLLAPSE
```

A consumer must not promote an identifier into a release version merely because it is numeric, semver-shaped, human-visible, or associated with a technically closed unit.
## Preserved historical evidence and trust boundaries

This contract does not rewrite prior evidence or expand previously bounded authority. At minimum it preserves:

```text
PR_520_ADVERSE_EVIDENCE = PRESERVED
PR_522_PR_523_FIX_FORWARD_REMEDIATION = PRESERVED
PR_531_BOUNDED_ASK_STATIC_FALLBACK = PRESERVED_WITHOUT_GENERALIZATION
NODE_22_P8_R4_FIRST_ATTEMPT_FAILURE = PRESERVED_AS_UNSUPPORTED_HISTORICAL_EVIDENCE
PR_541_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL
PR_542_OPERATIONAL_DOCS_AUTHORIZATION = CLOSED_CANONICAL
PR_543_OPERATIONAL_DOCS_CONTRACT = CLOSED_CANONICAL
PR_544_CURRENT_VIEW_AUTHORIZATION = CLOSED_CANONICAL
PR_546_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL
PR_547_RELEASE_VERSION_CONTRACT_AUTHORIZATION = CLOSED_CANONICAL
PRIVACY_EGRESS_BOUNDARIES = UNCHANGED
INSTALLATION_UPDATE_INTEGRITY_BOUNDARIES = UNCHANGED
OPERATIONAL_DOCS_EXAMPLES_BOUNDARIES = UNCHANGED
K2_TRUSTED_SIDE_EFFECT_BOUNDARY = UNCHANGED
K5_PROOF_BOUNDARY = UNCHANGED
DONE_GATE_AUTHORITY = UNCHANGED
```

No historical proof, failure, remediation, or authorization is retroactively upgraded, weakened, or reinterpreted as release evidence by this contract.
## Explicit non-grants

```text
SOURCE_RUNTIME_MUTATION = NOT_AUTHORIZED
TEST_SCHEMA_MUTATION = NOT_AUTHORIZED
PACKAGE_BIN_MUTATION = NOT_AUTHORIZED
PACKAGE_METADATA_MUTATION = NOT_AUTHORIZED
PACKAGE_NAME_MUTATION = NOT_AUTHORIZED
PACKAGE_VERSION_SELECTION = NOT_AUTHORIZED
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
RELEASE_ARTIFACT_SIGNING = NOT_AUTHORIZED
PACKAGE_REGISTRY_ACCESS = NOT_AUTHORIZED
PACKAGE_PUBLICATION = NOT_AUTHORIZED
INSTALLER_UPDATER_OR_CHANNEL_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_OR_DEPLOYMENT = NOT_AUTHORIZED
PRODUCTION_READINESS_CLAIM = NOT_AUTHORIZED
BRAND_OR_LEGAL_CLAIM = NOT_AUTHORIZED
```
```text
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

## Closure and successor boundary

This candidate cannot certify its own closure. Only complete external post-merge proof may classify:

```text
P8_RELEASE_VERSION_SEPARATION_CONTRACT_DOCUMENTATION = CLOSED_CANONICAL
```

After external closure, the next action is current-view reconciliation under separate canonical authorization. No package/version mutation, CLI version surface, tag, GitHub Release, publication, deployment, public claim, P8-R5+, P9, or project completion follows from contract closure.