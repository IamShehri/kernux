# Kodac Privacy / Egress Contract

## Status and authority

```text
CLASS = PRODUCT_DOCUMENTATION / INTERPRETATION_CONTRACT / FIX_FORWARD_REMEDIATED_CANDIDATE
ORIGINAL_DOCUMENTATION_AUTHORIZATION = PR #518 / CLOSED_CANONICAL
ORIGINAL_DOCUMENTATION_AUTHORIZATION_MERGE = b92dc12a9cc695d412a0e1530acfe97b6f1130c3
ORIGINAL_DOCUMENTATION_AUTHORIZATION_PROOF = 5605476348
DEFECTIVE_DOCUMENTATION_MERGE = PR #520 / 519c685eafd7f5be021b0225cc53df190d0b41c3
DEFECTIVE_DOCUMENTATION_STATE = MERGED_WITH_STALE_QUALIFICATION / NOT_CLOSED_CANONICAL
MATERIAL_PRE_MERGE_REVIEW = 5157366894 / MANDATORY_CONTRACT_COVERAGE_OMISSION
INCIDENT_RECORD = 5605587262
REMEDIATION_AUTHORIZATION = PR #522 / CLOSED_CANONICAL
REMEDIATION_AUTHORIZATION_MERGE = c7f127e4c152276463f2541bbed80bece1e6e187
REMEDIATION_AUTHORIZATION_PROOF = 5605901830
RUNTIME_PACKAGE = @kodac/runtime-internal / 0.0.0-k2 / PRIVATE
RUNTIME_ENFORCEMENT_CHANGE = NONE
NETWORK_AUTHORITY_CHANGE = NONE
SECRET_AUTHORITY_CHANGE = NONE
PROVIDER_MODEL_AUTHORITY_CHANGE = NONE
PERSISTENCE_TELEMETRY_AUTHORITY_CHANGE = NONE
WAIVER = NO
```

This document explains already-proven privacy, locality, storage, retention, access-control, provider-capability, and egress boundaries. It is a documentation contract over existing canonical evidence. It does not implement or strengthen runtime enforcement.

The PR #520 stale-qualification incident remains part of repository history. This fix-forward remediation does not retroactively make that qualification valid and does not erase the material review that identified the missing coverage.

When this document and exact canonical implementation or evidence records differ, the exact canonical repository evidence wins.

## Core interpretation rule

```text
DOCUMENTATION != RUNTIME_ENFORCEMENT
EVIDENCE_FOR_ONE_SURFACE != GLOBAL_PRODUCT_GUARANTEE
BOUNDED_NO_EGRESS_EVIDENCE != GLOBAL_ALL_COMMANDS_OFFLINE_CLAIM
LOCAL_EVIDENCE_STORAGE_BEHAVIOR != TELEMETRY_OR_UPLOAD_AUTHORITY
DEFAULT_FIXTURE_PROVIDER != PROOF_THAT_ALL_PROVIDER_CAPABLE_PATHS_ARE_OFFLINE
PROVIDER_ABSTRACTION_EXISTENCE != PROVIDER_INVOCATION_AUTHORITY
ABSENCE_OF_OBSERVED_NETWORK_ACTIVITY != NETWORK_DENIAL_PROOF
UNKNOWN_OR_UNPROVEN_PRIVACY_EGRESS_BEHAVIOR = DO_NOT_CLAIM
```

A privacy or egress statement is valid only for the exact command, subsystem, execution path, and evidence scope that canonically proves it. Consumers must not widen a bounded claim across commands, providers, repositories, workflows, environments, or future releases by analogy.

Use these interpretation classes:

```text
PROVEN_FOR_EXACT_SURFACE
CAPABLE_ONLY_WHERE_IMPLEMENTATION_ESTABLISHES_CAPABILITY
AUTHORIZED_ONLY_WHERE_SEPARATE_CANONICAL_AUTHORITY_EXISTS
UNKNOWN_OR_UNPROVEN
```

If an exact canonical record does not establish the requested behavior, the correct product interpretation is `UNKNOWN_OR_UNPROVEN`.

## Current CLI evidence storage

The current CLI supports:

```text
apply-patch
ask
solve
```

The current CLI computes its default evidence root from the resolved workspace path. The workspace key is the first 16 hexadecimal characters of the SHA-256 digest of that resolved path.

Unless the caller supplies an override, the evidence root is:

```text
~/.kodac/evidence/<workspace-key>
```

The caller may override the evidence root with:

```text
--evidence-dir <dir>
```

Evidence sessions are created under the selected root in UUID-named session directories. Depending on the exercised path, the guarded evidence store recognizes session artifacts including:

```text
active-session.json
authorization.json
controlled-live-solve-report.json
events.jsonl
proof.json
qualification-report.json
receipts.jsonl
session.json
verification-plan.json
```

These are local filesystem artifacts under the current evidence-store implementation. Local filesystem persistence is not telemetry, upload, analytics, or network egress by itself.

```text
LOCAL_FILESYSTEM_PERSISTENCE != REMOTE_TELEMETRY
LOCAL_FILESYSTEM_PERSISTENCE != REMOTE_UPLOAD
LOCAL_FILESYSTEM_PERSISTENCE != NETWORK_AUTHORITY
```

## Current evidence retention behavior

Current runtime constants are:

```text
DEFAULT_EVIDENCE_RETENTION_DAYS = 30
MAX_EVIDENCE_RETENTION_DAYS = 3650
```

The CLI accepts:

```text
--evidence-retention-days <n>
```

where the runtime requires an integer from `1` through `3650` inclusive.

A new evidence session records `createdAt`, `expiresAt`, and the selected `retentionDays`. The current metadata contract requires:

```text
mayContainLosslessModelRequestSnapshots = true
```

Therefore local evidence must not be described as automatically redacted, prompt-free, credential-free, or safe for arbitrary sensitive input merely because it is local.

Retention is not an unconditional immediate-deletion promise. Current maintenance behavior is fail-safe around uncertain state:

- an expired session with an active lease is retained;
- unsafe or invalid sessions may be retained rather than destructively removed;
- stale leases are removed only through the guarded maintenance path;
- an expired session is removed only when its bounded artifact set and filesystem state satisfy the guarded removal checks;
- maintenance scanning is bounded and may report that the root scan limit was reached.

Accordingly:

```text
RETENTION_EXPIRY != GUARANTEED_IMMEDIATE_DELETION
RETENTION_POLICY != SECURE_ERASURE_GUARANTEE
LOCAL_RETENTION_BEHAVIOR != GLOBAL_DATA_LIFECYCLE_GUARANTEE
```

This document does not authorize any retention/deletion runtime change.

## Current evidence filesystem access-control behavior

On POSIX platforms, the current evidence-store implementation creates or hardens evidence directories to owner-only mode:

```text
0700
```

and evidence files to owner-only mode:

```text
0600
```

The guarded file boundary also rejects symbolic-link artifacts and requires regular evidence files to have exactly one filesystem link when opened through the private file helpers.

On Windows, the current evidence-session metadata records:

```text
WINDOWS_INHERITED_ACL_UNVERIFIED
```

Therefore this contract does not claim a Windows owner-only ACL guarantee.

These local filesystem controls are not equivalent to encryption, secret redaction, process isolation, sandboxing, firewall enforcement, or network isolation.

```text
POSIX_OWNER_ONLY_MODE != ENCRYPTION_AT_REST
POSIX_OWNER_ONLY_MODE != SECRET_REDACTION
POSIX_OWNER_ONLY_MODE != NETWORK_ISOLATION
WINDOWS_INHERITED_ACL_UNVERIFIED != WINDOWS_OWNER_ONLY_ACL_PROVEN
```

## Provider-capable versus deterministic fixture behavior

The current runtime defines a `ModelProvider` interface and a `ProviderRegistry`. Those abstractions establish provider-capable internal boundaries; they do not themselves authorize external provider invocation.

For the current CLI, `ask` and `solve` default to:

```text
provider = fixture
model = fixture/deterministic-v1
```

The built-in `FixtureModelProvider` is an in-process deterministic fixture surface. If no scripted response is present, it returns a fixture response derived from the last user message and emits no tool calls.

That fact proves the behavior of the fixture implementation only. It does not establish either of these product-wide claims:

```text
ALL_KODAC_COMMANDS_ARE_OFFLINE
ALL_MODEL_PROVIDER_PATHS_ARE_OFFLINE
```

A caller-supplied or separately admitted provider is governed by its own exact implementation and canonical authority. This document grants no provider/model invocation or admission authority.

```text
PROVIDER_CAPABLE != PROVIDER_INVOKED
DOCUMENTED_PROVIDER_CAPABILITY != PROVIDER_EXECUTION_AUTHORITY
DEFAULT_FIXTURE_PROVIDER != EXTERNAL_PROVIDER_PROHIBITION_PROOF
```

## Network and egress claims

Kodac contains bounded surfaces with separately recorded no-egress behavior. Such evidence remains scoped to the exact surface it proves.

For example, the P2-R2 local runner/report evidence describes that bounded in-memory runner as performing no provider/model/reviewer/evaluator/tool invocation, network access, secret access, subprocess/sandbox execution, file/database output, telemetry, upload, or analytics egress. That evidence applies to the P2-R2 runner/report logic only.

It does not prove the same properties for:

- the CLI evidence store;
- provider-capable `ask` or `solve` execution with a separately supplied provider;
- verification subprocesses;
- integrations or future adapters;
- the operating environment;
- Kodac as a product-wide invariant.

The safe product-level statement is:

> Kodac has exact bounded components with canonically recorded no-egress behavior, and its current default CLI model provider is an in-process deterministic fixture. Current canonical evidence does not establish a universal all-command network-isolation guarantee.

Therefore:

```text
GLOBAL_ALL_COMMANDS_NETWORK_EGRESS = NOT_PROVEN
GLOBAL_OFFLINE_GUARANTEE = NOT_PROVEN
GLOBAL_FIREWALL_ENFORCEMENT = NOT_PROVEN_BY_THIS_DOCUMENT
```

Absence of observed traffic is insufficient to upgrade these states.

## Secrets and credentials

This documentation grants no secret or credential authority.

```text
SECRET_CREDENTIAL_ACCESS_AUTHORITY = NO_NEW_AUTHORITY
AUTOMATIC_SECRET_REDACTION_GUARANTEE = NOT_PROVEN_GLOBALLY
CREDENTIAL_BROKERING_GUARANTEE = NOT_PROVEN_GLOBALLY
ENCRYPTION_AT_REST_GUARANTEE = NOT_PROVEN_BY_THIS_DOCUMENT
```

Because current evidence-session metadata explicitly states that sessions may contain lossless model-request snapshots, callers must not assume that prompts, credentials, tokens, or other sensitive input are removed from evidence artifacts unless a narrower canonical contract proves that behavior.

A future integration that requires tokens, credential stores, environment-secret access, secret redaction, or credential brokering requires separate exact authority and evidence.

## Persistence, telemetry, upload, and analytics

Current CLI evidence files are deliberate local filesystem persistence under the existing evidence-store contract. That local persistence must remain distinct from remote telemetry, upload, analytics, or hidden egress.

This document does not authorize:

```text
REMOTE_TELEMETRY
REMOTE_UPLOAD
PRODUCT_ANALYTICS_EGRESS
CROSS_REPOSITORY_LEARNING
CROSS_USER_LEARNING
RETENTION_DELETION_RUNTIME_BEHAVIOR_CHANGE
```

It also does not claim that those behaviors are globally technically impossible where no exact proof exists.

A bounded subsystem whose canonical evidence states `TELEMETRY_UPLOAD = NO` or equivalent remains scoped to that subsystem. It must not be generalized to unrelated runtime surfaces.

## Cross-repository and cross-user boundaries

No cross-repository or cross-user data movement, retrieval, learning, aggregation, indexing, synchronization, or persistence authority is created by this document.

```text
RESULT_CONSUMPTION != CROSS_REPOSITORY_ACCESS_AUTHORITY
AGENT_INTEGRATION_CONTRACT != CROSS_REPOSITORY_ACCESS_AUTHORITY
GITHUB_CI_CONSUMER_CONTRACT != CROSS_REPOSITORY_ACCESS_AUTHORITY
PRIVACY_DOCUMENTATION != CROSS_REPOSITORY_ACCESS_AUTHORITY
```

Any future cross-repository or cross-user behavior requires its own exact canonical authority and evidence.

## Agent and GitHub/CI consumers

`docs/product/AGENT_INTEGRATION_CONTRACT.md` and `docs/product/GITHUB_CI_INTEGRATION_CONTRACT.md` remain documentation-only interpretation contracts for existing result semantics.

```text
AGENT_CONSUMER_CONTRACT = DOCUMENTATION_ONLY / INTERPRETATION_ONLY
GITHUB_CI_CONSUMER_CONTRACT = DOCUMENTATION_ONLY / INTERPRETATION_ONLY
AGENT_CONSUMER_CONTRACT != AGENT_EXECUTION_AUTHORITY
GITHUB_CI_CONSUMER_CONTRACT != EXECUTABLE_GITHUB_CI_PRODUCT_INTEGRATION
```

An agent or CI consumer must treat unknown privacy/egress behavior as unknown rather than deriving a stronger guarantee from the existence of a machine-readable result.

## Machine-readable result boundaries

The existing `kodac.cli-result` version `1` envelope is not a privacy attestation, firewall, credential policy, retention policy, or independent execution authorization.

```text
MACHINE_READABLE_RESULT != PRIVACY_PROOF
MACHINE_READABLE_RESULT != NETWORK_POLICY
MACHINE_READABLE_RESULT != SECRET_POLICY
MACHINE_READABLE_RESULT != RETENTION_POLICY
MACHINE_READABLE_RESULT != INDEPENDENT_PROOF
CLI_RESULT_STATUS != DONE_GATE_AUTHORITY
```

Consumers must not manufacture privacy or egress guarantees from fields that do not canonically encode those guarantees.

## Fail-closed consumer rules

A CLI, agent, CI, editor, SDK, daemon, or other consumer relying on privacy/egress properties must:

1. bind every strong claim to the exact command or subsystem and canonical evidence that proves it;
2. distinguish local filesystem persistence from remote telemetry or upload;
3. distinguish the built-in fixture provider from a separately supplied or future provider;
4. treat provider capability as capability, not invocation authority;
5. never turn missing network observations into network-denial proof;
6. never turn local storage modes into encryption, redaction, or network-isolation claims;
7. never turn lack of secret authority into proof that secrets cannot exist in the surrounding environment;
8. never turn one bounded no-persistence result into a global retention claim;
9. preserve command-specific K2, K5, and Done Gate authority boundaries;
10. report missing, stale, incompatible, or differently scoped evidence as `UNKNOWN_OR_UNPROVEN`.

## Evidence anchors

The concrete current CLI storage, retention, provider-capability, and fixture statements above are bound to these canonical runtime paths at the remediation-authorization base:

```text
packages/kodac-runtime/src/cli.ts = 70f7fc2e14fc5a24bc82781ccfdd4d238346d955
packages/kodac-runtime/src/evidence/store.ts = 29a62c8e788fce058427cbf126f1052295c394f2
packages/kodac-runtime/src/model/provider.ts = a15f1d86ceab88ab6fa1be787719d222e354e0c4
packages/kodac-runtime/src/model/fixture.ts = 15b9b11e2452da8963bec4678e338efc58551659
packages/kodac-runtime/package.json = af4c20a3dae387c15cc5fb2eb28d415c8f115b95
```

A bounded no-egress example used above is anchored to:

```text
docs/planning/KODAC_P2_R2_LOCAL_RUNNER_REPORT_EVIDENCE_2026-08-28.md
```

These paths and blobs are evidence references, not new authority sources. If relevant implementation bytes change, privacy/egress interpretation must be revalidated against live canonical truth.

## Existing P8 boundaries preserved

This remediation changes documentation only. It does not alter the established P8 result protocol or CLI implementation.

```text
PROTOCOL = kodac.cli-result
VERSION = 1
COMMANDS = apply-patch | ask | solve
P8_R1_THROUGH_P8_R4_SEMANTICS = UNCHANGED
RUNTIME_PACKAGE_PRIVATE_UNPUBLISHED = YES
README_HELP_DOCUMENTATION = REPOSITORY_LOCAL_ONLY
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_DONE_GATE_AUTHORITY = UNCHANGED
DONE_GATE_IMPLEMENTATION_AND_ALGORITHM = UNCHANGED
```

Nothing in this contract changes package publication, installation, versioning, release, or deployment status.

## Explicit non-grants

```text
SOURCE_RUNTIME_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
SCHEMA_TEST_PACKAGE_BIN_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
WORKFLOW_DEPENDENCY_LOCKFILE_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
CLI_BEHAVIOR_CHANGE = NOT_AUTHORIZED_BY_THIS_DOCUMENT
RUNTIME_PRIVACY_ENFORCEMENT = NOT_AUTHORIZED_BY_THIS_DOCUMENT
NETWORK_FIREWALL_SANDBOX_ENFORCEMENT = NOT_AUTHORIZED_BY_THIS_DOCUMENT
NETWORK_ACCESS = NOT_AUTHORIZED_BY_THIS_DOCUMENT
SECRET_CREDENTIAL_ACCESS = NOT_AUTHORIZED_BY_THIS_DOCUMENT
SECRET_REDACTION_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
NEW_PROVIDER_MODEL_ADMISSION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PERSISTENCE_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
TELEMETRY_UPLOAD_ANALYTICS_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
RETENTION_DELETION_RUNTIME_BEHAVIOR_CHANGE = NOT_AUTHORIZED_BY_THIS_DOCUMENT
CROSS_REPOSITORY_ACCESS = NOT_AUTHORIZED_BY_THIS_DOCUMENT
GITHUB_ACTION_WORKFLOW_API_APP_WEBHOOK_CHECK_STATUS_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PACKAGE_VERSION_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED_BY_THIS_DOCUMENT
K2_K5_DONE_GATE_AUTHORITY_CHANGE = NOT_AUTHORIZED_BY_THIS_DOCUMENT
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
REVERT_PR_520 = NOT_AUTHORIZED_BY_THIS_DOCUMENT
HISTORY_REWRITE = NOT_AUTHORIZED_BY_THIS_DOCUMENT
WAIVER = NO
```

## Contract summary

The safe product claim is intentionally narrow:

> Kodac privacy and egress properties are evidence-scoped. Current CLI evidence is stored locally by default under a workspace-keyed evidence root with configurable bounded retention and platform-specific local access-control behavior. The default CLI model provider is an in-process fixture. None of those facts proves a universal offline, no-telemetry, no-secret, or no-persistence guarantee. Unknown behavior remains unknown, and documentation does not create enforcement or execution authority.

This contract is an interpretation boundary over existing evidence, not a new runtime guarantee.
