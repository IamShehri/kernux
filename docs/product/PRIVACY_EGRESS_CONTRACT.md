# Kodac Privacy / Egress Product Contract

## Status and authority

```text
CLASS = PRODUCT_DOCUMENTATION / INTERPRETATION_CONTRACT
AUTHORIZATION = PR #518 / CLOSED_CANONICAL
AUTHORIZATION_MERGE = b92dc12a9cc695d412a0e1530acfe97b6f1130c3
AUTHORIZATION_POST_MERGE_PROOF = 5605476348
RUNTIME_ENFORCEMENT_CHANGE = NONE
NETWORK_AUTHORITY_CHANGE = NONE
SECRET_AUTHORITY_CHANGE = NONE
PROVIDER_MODEL_AUTHORITY_CHANGE = NONE
PERSISTENCE_TELEMETRY_AUTHORITY_CHANGE = NONE
WAIVER = NO
```

This document explains already-proven privacy and egress boundaries. It does not implement or strengthen runtime enforcement, grant network access, admit a provider/model, authorize secret access, create telemetry, or replace command-specific and subsystem-specific canonical authority.

When this document and exact canonical evidence differ, the exact canonical evidence wins.

## Core interpretation rule

```text
DOCUMENTATION != RUNTIME_ENFORCEMENT
BOUNDED_NO_EGRESS_EVIDENCE != GLOBAL_ALL_COMMANDS_OFFLINE_CLAIM
LOCAL_EVIDENCE_STORAGE_BEHAVIOR != TELEMETRY_OR_UPLOAD_AUTHORITY
DEFAULT_FIXTURE_PROVIDER != PROOF_THAT_ALL_PROVIDER_CAPABLE_PATHS_ARE_OFFLINE
PROVIDER_ABSTRACTION_EXISTENCE != PROVIDER_INVOCATION_AUTHORITY
UNKNOWN_OR_UNPROVEN_PRIVACY_EGRESS_BEHAVIOR = DO_NOT_CLAIM
```

Kodac must not make a product-wide “offline”, “no network”, “no telemetry”, “no secrets”, or equivalent guarantee by generalizing a bounded subsystem proof.

## Current CLI evidence storage behavior

The current CLI supports `apply-patch`, `ask`, and `solve`. These commands carry evidence-storage options under the existing runtime contract.

Unless `--evidence-dir <dir>` is supplied, the CLI derives the evidence root as:

```text
~/.kodac/evidence/<workspace-key>
```

where `<workspace-key>` is the first 16 hexadecimal characters of SHA-256 over the resolved workspace path.

A caller may override that root with:

```text
--evidence-dir <dir>
```

Evidence sessions are created below the selected root using a UUID session directory. Current session artifacts may include event, receipt, verification-plan, proof, authorization, qualification, controlled-live-solve, and session metadata files depending on the exercised path.

The evidence-session metadata explicitly records:

```text
mayContainLosslessModelRequestSnapshots = true
```

Therefore users and integrators must not interpret local evidence storage as automatic prompt, secret, credential, or sensitive-content redaction.

### Retention

Current runtime values are:

```text
DEFAULT_EVIDENCE_RETENTION_DAYS = 30
MAX_EVIDENCE_RETENTION_DAYS = 3650
```

The CLI accepts:

```text
--evidence-retention-days <n>
```

for positive integer values within the runtime maximum.

Expired-session maintenance is bounded and fail-safe. An expired active session is retained. Unsafe or invalid sessions may also be retained rather than destructively removed. Retention therefore describes the runtime cleanup contract; it is not a promise that every artifact is deleted immediately at its nominal expiry time.

### Filesystem access-control behavior

On POSIX platforms, the current evidence store creates/hardens evidence directories to owner-only mode `0700` and evidence files to owner-only mode `0600`, while also rejecting symbolic-link or multi-link artifact cases at the guarded file boundary.

On Windows, evidence metadata records:

```text
WINDOWS_INHERITED_ACL_UNVERIFIED
```

Accordingly, this contract does not claim a Windows owner-only ACL guarantee.

These filesystem controls are local storage protections. They are not network isolation, secret redaction, encryption-at-rest, sandboxing, or telemetry enforcement claims.

## Provider-capable versus fixture behavior

The model runtime defines a `ModelProvider` interface and a `ProviderRegistry`. The existence of those abstractions means Kodac has provider-capable internal boundaries; it does not itself authorize any external provider invocation.

For the current CLI, `ask` and `solve` default to:

```text
provider = fixture
model = fixture/deterministic-v1
```

The built-in `FixtureModelProvider` is a deterministic in-process fixture surface. Without a scripted response, it returns a local fixture response derived from the last user message and emits no tool calls.

This establishes the behavior of that fixture implementation only. It must not be generalized into either of these claims:

```text
ALL_KODAC_COMMANDS_ARE_OFFLINE
ALL_MODEL_PROVIDER_PATHS_ARE_OFFLINE
```

A caller-supplied or separately admitted provider is governed by its own exact canonical authority and implementation evidence. This document grants none.

## Bounded no-egress evidence that is safe to cite

### K6-R4 bounded outcome memory

The canonical K6-R4 privacy-governed outcome-memory contract proves its own bounded surface as caller-managed in-process values with:

```text
DURABLE_PERSISTENCE = NO
FILESYSTEM_IO = NO
DATABASE_IO = NO
NETWORK_EGRESS = NO
TELEMETRY_UPLOAD = NO
PROVIDER_MODEL_REVIEWER_INVOCATION = NO
TRAINING_LEARNING_MUTATION = NO
CROSS_REPOSITORY_OR_USER_LEARNING = NO
```

That proof applies to the K6-R4 bounded outcome-memory surface. It does not prove the same properties for the CLI evidence store, provider-capable commands, verification subprocesses, future integrations, or Kodac as a whole.

### P2-R2 bounded local runner/report

The canonical P2-R2 local runner/report evidence states that its pure in-memory runner performs no provider/model/reviewer/evaluator/tool invocation, network access, secret access, subprocess/sandbox execution, file/database output, telemetry, upload, or analytics egress.

That proof applies to the P2-R2 runner/report logic only. It is not a product-wide network or privacy guarantee.

## Network and egress claims

The safe product-level statement is:

> Kodac contains bounded components with canonically proven no-egress behavior, and the default CLI model provider is an in-process deterministic fixture; however, current canonical evidence does not establish a universal all-command network-isolation guarantee.

Therefore:

```text
GLOBAL_ALL_COMMANDS_NETWORK_EGRESS = NOT_PROVEN
GLOBAL_OFFLINE_GUARANTEE = NOT_PROVEN
GLOBAL_FIREWALL_ENFORCEMENT = NOT_IMPLEMENTED_BY_THIS_CONTRACT
```

Absence of observed network traffic is not sufficient evidence to upgrade these states.

## Secrets and credentials

This documentation grants no secret or credential authority.

```text
SECRET_CREDENTIAL_ACCESS_AUTHORITY = NO_NEW_AUTHORITY
AUTOMATIC_SECRET_REDACTION_GUARANTEE = NOT_PROVEN_GLOBALLY
CREDENTIAL_BROKERING_GUARANTEE = NOT_PROVEN_GLOBALLY
```

Because evidence sessions may contain lossless model-request snapshots, callers must not assume that sensitive input is removed from evidence artifacts unless a narrower canonical contract explicitly proves that behavior.

A future integration that requires tokens, credentials, secret stores, environment-secret access, or credential brokering requires separate exact authority and evidence.

## Persistence, telemetry, upload, and analytics

Current CLI evidence files are deliberate local filesystem persistence under the existing evidence-store contract. That persistence must remain distinct from telemetry, upload, analytics, or hidden egress.

This contract does not authorize or assert the existence of:

```text
REMOTE_TELEMETRY = NO_NEW_AUTHORITY
REMOTE_UPLOAD = NO_NEW_AUTHORITY
PRODUCT_ANALYTICS_EGRESS = NO_NEW_AUTHORITY
CROSS_REPOSITORY_LEARNING = NO_NEW_AUTHORITY
CROSS_USER_LEARNING = NO_NEW_AUTHORITY
```

Likewise, a bounded subsystem whose canonical contract says `TELEMETRY_UPLOAD=NO` does not prove that unrelated runtime surfaces share that property.

## Cross-repository and cross-user boundaries

No cross-repository or cross-user data movement, retrieval, learning, aggregation, or persistence authority is created by this product document.

Where a bounded predecessor contract proves repository/user isolation, that proof remains scoped to that predecessor. Broader cross-repository behavior remains unproven unless separately authorized and evidenced.

## Consumer requirements

A CLI, agent, CI, editor, SDK, daemon, or other consumer that relies on privacy/egress properties must:

1. bind its claim to the exact command/subsystem and canonical evidence that proves it;
2. distinguish local filesystem writes from remote telemetry or upload;
3. distinguish the default fixture provider from any separately supplied provider;
4. treat provider capability as capability, not invocation authority;
5. treat unknown or unproven egress behavior as unproven rather than safe-by-assumption;
6. avoid claiming secret redaction from local-only behavior;
7. preserve command-specific K2, K5, and Done Gate authority boundaries;
8. fail closed rather than broadening a bounded proof into a global guarantee.

## Evidence anchors

This contract is based on current canonical evidence including:

```text
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/src/evidence/store.ts
packages/kodac-runtime/src/model/provider.ts
packages/kodac-runtime/src/model/fixture.ts
docs/planning/KODAC_K6_R4_TRUSTED_QUALIFICATION_REPLACEMENT_AUTHORIZATION_2026-08-27.md
docs/planning/KODAC_K6_CANONICAL_CLOSEOUT_EVIDENCE_2026-08-28.md
docs/planning/KODAC_P2_R2_LOCAL_RUNNER_REPORT_EVIDENCE_2026-08-28.md
```

At the authorization-closure base used for this documentation unit, the relevant runtime blobs include:

```text
packages/kodac-runtime/src/cli.ts = 70f7fc2e14fc5a24bc82781ccfdd4d238346d955
packages/kodac-runtime/src/evidence/store.ts = 29a62c8e788fce058427cbf126f1052295c394f2
packages/kodac-runtime/src/model/provider.ts = a15f1d86ceab88ab6fa1be787719d222e354e0c4
packages/kodac-runtime/src/model/fixture.ts = 15b9b11e2452da8963bec4678e338efc58551659
```

These anchors are evidence references, not a new authority source. Future changes require fresh interpretation against live canonical truth.

## Explicit non-grants

```text
SOURCE_RUNTIME_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
SCHEMA_TEST_PACKAGE_BIN_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
WORKFLOW_DEPENDENCY_LOCKFILE_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
CLI_BEHAVIOR_CHANGE = NOT_AUTHORIZED_BY_THIS_DOCUMENT
NETWORK_FIREWALL_ENFORCEMENT = NOT_AUTHORIZED_BY_THIS_DOCUMENT
SECRET_CREDENTIAL_ACCESS = NOT_AUTHORIZED_BY_THIS_DOCUMENT
SECRET_REDACTION_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
NEW_PROVIDER_MODEL_ADMISSION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PERSISTENCE_TELEMETRY_UPLOAD_ANALYTICS_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
RETENTION_DELETION_BEHAVIOR_CHANGE = NOT_AUTHORIZED_BY_THIS_DOCUMENT
CROSS_REPOSITORY_ACCESS = NOT_AUTHORIZED_BY_THIS_DOCUMENT
GITHUB_ACTION_OR_API_INTEGRATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PACKAGE_VERSION_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED_BY_THIS_DOCUMENT
K2_K5_DONE_GATE_AUTHORITY_CHANGE = NOT_AUTHORIZED_BY_THIS_DOCUMENT
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## Contract boundary

This is a documentation contract over existing evidence. It must never be cited as if it were network enforcement, a firewall, a secret manager, telemetry code, a provider adapter, a storage migration, a release gate, or project-completion proof.
