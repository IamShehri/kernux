# Kodac Privacy / Egress Contract

Status: **PRODUCT INTERPRETATION CONTRACT / DOCUMENTATION ONLY**  
Protocol context: `kodac.cli-result` version `1`  
Runtime package status: **private / unpublished**  
Authorization: PR #518 / `P8_PRIVACY_EGRESS_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL` / proof `5605463093`

---

## 1. Purpose

This document defines how Kodac privacy, locality, network-egress, secrets, persistence, telemetry, upload, analytics, and provider-capability claims must be interpreted by humans and downstream consumers.

It documents already-proven boundaries only. It does not implement privacy controls, network enforcement, credential handling, redaction, retention, telemetry, provider access, or any other runtime behavior.

```text
DOCUMENTATION != RUNTIME_ENFORCEMENT
EVIDENCE_FOR_ONE_SURFACE != GLOBAL_PRODUCT_GUARANTEE
ABSENCE_OF_PROOF != PROOF_OF_ABSENCE
UNKNOWN_OR_UNPROVEN = DO_NOT_CLAIM
```

---

## 2. Deny-by-default interpretation rule

A privacy or egress statement is valid only for the exact surface and evidence scope that canonically proves it.

Consumers must not widen a claim across commands, subsystems, providers, repositories, workflows, environments, or releases by analogy.

Use these interpretation classes:

```text
PROVEN_FOR_EXACT_SURFACE
PROVIDER_OR_NETWORK_CAPABLE_ONLY_WHERE_SEPARATELY_AUTHORIZED
UNKNOWN_OR_UNPROVEN
```

If an exact canonical record does not establish the behavior being asked about, the correct product interpretation is `UNKNOWN_OR_UNPROVEN`.

---

## 3. Locality and network egress

Kodac has bounded historical evidence for exact units that record no-egress or local-only behavior. Those records remain valid only within their original scope.

They do not establish a product-wide invariant that every Kodac command, provider path, integration, or future execution is offline.

```text
BOUNDED_NO_EGRESS_EVIDENCE != GLOBAL_ALL_COMMANDS_OFFLINE_CLAIM
LOCAL_ONLY_FOR_ONE_SURFACE != LOCAL_ONLY_FOR_ALL_SURFACES
NO_OBSERVED_NETWORK_ACTIVITY != PROVEN_NETWORK_DENIAL
NETWORK_DOCUMENTATION != FIREWALL_ENFORCEMENT
```

A consumer may describe a surface as no-egress only when the exact canonical evidence for that surface proves it.

Otherwise the consumer must not infer:

- that network access is impossible;
- that a provider-capable path cannot use a network;
- that a future integration inherits a no-egress property;
- that the operating environment enforces network isolation.

This contract creates no network authority and no network-denial mechanism.

---

## 4. Provider-capable and deterministic fixture behavior

Kodac contains provider abstractions and bounded deterministic/fixture-backed evidence. The existence or use of a deterministic fixture does not prove that every provider-capable path is offline.

```text
DEFAULT_FIXTURE_PROVIDER != PROOF_THAT_ALL_PROVIDER_CAPABLE_PATHS_ARE_OFFLINE
PROVIDER_ABSTRACTION_EXISTENCE != PROVIDER_INVOCATION_AUTHORITY
DOCUMENTED_PROVIDER_CAPABILITY != PROVIDER_EXECUTION_AUTHORITY
PROVIDER_CAPABLE != PROVIDER_INVOKED
```

Provider/model invocation remains governed only by the exact command-specific and unit-specific canonical authority that applies to that execution.

This document does not authorize:

```text
PROVIDER_MODEL_INVOCATION
NEW_PROVIDER_MODEL_ADMISSION
PROVIDER_RETRY_REPLAY_RESUME
PROVIDER_SPEND
NETWORK_ACCESS
SECRET_ACCESS
```

Where provider behavior is not canonically proven for an exact surface, it remains `UNKNOWN_OR_UNPROVEN`.

---

## 5. Secrets and credentials

A record stating that a bounded unit has no secret-access authority is an authority statement for that unit. It is not proof that secrets can never exist in the surrounding process, environment, host, CI runner, or user configuration.

```text
NO_SECRET_ACCESS_AUTHORITY != PROOF_THAT_SECRETS_CANNOT_EXIST_IN_ENVIRONMENT
NO_CREDENTIAL_USE_FOR_ONE_UNIT != GLOBAL_NO_CREDENTIALS
DOCUMENTATION_OF_SECRET_BOUNDARY != REDACTION_IMPLEMENTATION
```

Consumers must not claim that Kodac globally sanitizes, redacts, deletes, encrypts, or prevents exposure of credentials unless an exact canonical implementation and evidence record proves that behavior.

This contract creates no secret-access or credential-handling authority.

---

## 6. Evidence storage, persistence, and retention

Where an exact canonical record proves in-memory, local, no-file-output, or other bounded storage behavior, that statement may be repeated only for that exact surface.

It must not be generalized into a product-wide persistence or retention guarantee.

```text
LOCAL_EVIDENCE_STORAGE_BEHAVIOR != TELEMETRY_OR_UPLOAD_AUTHORITY
NO_PERSISTENCE_FOR_ONE_BOUNDED_SURFACE != GLOBAL_NO_PERSISTENCE
NO_FILE_OUTPUT_FOR_ONE_BOUNDED_SURFACE != GLOBAL_NO_FILESYSTEM_WRITES
NO_DATABASE_USE_FOR_ONE_BOUNDED_SURFACE != GLOBAL_NO_DATABASE_USE
```

Unless separately proven for the exact surface, this document does not claim a global retention period, deletion policy, cache policy, database policy, filesystem policy, or lifecycle guarantee.

Retention/deletion implementation remains separately unauthorized by this contract.

---

## 7. Telemetry, upload, and analytics

A bounded historical record that proves no telemetry upload for its exact unit remains scoped to that unit.

It does not prove that every Kodac command, integration, provider, future distribution, or environment is globally telemetry-free.

```text
NO_TELEMETRY_UPLOAD_FOR_ONE_BOUNDED_SURFACE != GLOBAL_NO_TELEMETRY
NO_UPLOAD_FOR_ONE_SURFACE != GLOBAL_NO_UPLOAD
NO_ANALYTICS_FOR_ONE_SURFACE != GLOBAL_NO_ANALYTICS
DOCUMENTATION_OF_NO_UPLOAD != NETWORK_ENFORCEMENT
```

This contract does not authorize telemetry, upload, analytics, learning, aggregation, or cross-repository data collection. It also does not claim their global technical impossibility where no exact proof exists.

---

## 8. Cross-repository behavior

No consumer may infer cross-repository access or aggregation authority from a result envelope, agent contract, GitHub/CI consumer contract, provider abstraction, or this document.

```text
RESULT_CONSUMPTION != CROSS_REPOSITORY_ACCESS_AUTHORITY
AGENT_INTEGRATION_CONTRACT != CROSS_REPOSITORY_ACCESS_AUTHORITY
GITHUB_CI_CONSUMER_CONTRACT != CROSS_REPOSITORY_ACCESS_AUTHORITY
PRIVACY_DOCUMENTATION != CROSS_REPOSITORY_ACCESS_AUTHORITY
```

Any future cross-repository read, write, aggregation, learning, indexing, or synchronization behavior requires its own exact canonical authority and proof.

---

## 9. Agent and GitHub/CI consumers

`docs/product/AGENT_INTEGRATION_CONTRACT.md` and `docs/product/GITHUB_CI_INTEGRATION_CONTRACT.md` are interpretation contracts for existing result semantics.

They do not become execution authorities through this privacy/egress contract.

```text
AGENT_CONSUMER_CONTRACT = DOCUMENTATION_ONLY / INTERPRETATION_ONLY
GITHUB_CI_CONSUMER_CONTRACT = DOCUMENTATION_ONLY / INTERPRETATION_ONLY
AGENT_CONSUMER_CONTRACT != AGENT_EXECUTION_AUTHORITY
GITHUB_CI_CONSUMER_CONTRACT != EXECUTABLE_GITHUB_CI_PRODUCT_INTEGRATION
```

An agent or CI consumer must treat unknown privacy/egress behavior as unknown rather than assuming a stronger guarantee from the presence of a machine-readable result.

---

## 10. Machine-readable result boundaries

The existing `kodac.cli-result` version `1` envelope is not a privacy attestation, network policy, credential policy, retention policy, or execution authorization.

```text
MACHINE_READABLE_RESULT != PRIVACY_PROOF
MACHINE_READABLE_RESULT != NETWORK_POLICY
MACHINE_READABLE_RESULT != SECRET_POLICY
MACHINE_READABLE_RESULT != RETENTION_POLICY
MACHINE_READABLE_RESULT != INDEPENDENT_PROOF
CLI_RESULT_STATUS != DONE_GATE_AUTHORITY
```

Consumers must not manufacture privacy or egress guarantees from fields that do not canonically encode those guarantees.

---

## 11. Fail-closed claim rules

When presenting Kodac behavior, use the following rules:

1. Bind every strong privacy/egress claim to the exact proven surface.
2. Preserve the original evidence scope.
3. Never turn fixture-backed execution into a global offline claim.
4. Never turn missing network observations into network-denial proof.
5. Never turn lack of secret authority into proof that secrets cannot exist nearby.
6. Never turn one no-persistence result into a global retention policy.
7. Never turn documentation into enforcement.
8. If evidence is missing, stale, incompatible, or scoped elsewhere, report `UNKNOWN_OR_UNPROVEN`.

---

## 12. Existing P8 boundaries preserved

This contract does not alter any established P8 protocol or CLI behavior.

```text
PROTOCOL = kodac.cli-result
VERSION = 1
COMMANDS = apply-patch | ask | solve
P8_R1_THROUGH_P8_R4_SEMANTICS = UNCHANGED
P8_R4_UNSUPPORTED_NODE_22_FIRST_LOCAL_FAILURE = PRESERVED_AS_REAL_HISTORICAL_FAILURE
CANONICAL_NODE_24_QUALIFICATION_EVIDENCE = PRESERVED
RUNTIME_PACKAGE_PRIVATE_UNPUBLISHED = YES
README_HELP_DOCUMENTATION = REPOSITORY_LOCAL_ONLY
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_DONE_GATE_AUTHORITY = UNCHANGED
DONE_GATE_IMPLEMENTATION_AND_ALGORITHM = UNCHANGED
```

Nothing in this contract changes package publication, installation, release, or deployment status.

---

## 13. Explicit non-grants

```text
SOURCE_RUNTIME_MUTATION = NOT_AUTHORIZED
SCHEMA_TEST_PACKAGE_BIN_MUTATION = NOT_AUTHORIZED
WORKFLOW_DEPENDENCY_LOCKFILE_MUTATION = NOT_AUTHORIZED
CLI_BEHAVIOR_CHANGE = NOT_AUTHORIZED
RUNTIME_PRIVACY_ENFORCEMENT = NOT_AUTHORIZED
NETWORK_FIREWALL_SANDBOX_ENFORCEMENT = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
SECRET_CREDENTIAL_ACCESS = NOT_AUTHORIZED
SECRET_REDACTION_IMPLEMENTATION = NOT_AUTHORIZED
PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED
NEW_PROVIDER_MODEL_ADMISSION = NOT_AUTHORIZED
PERSISTENCE_IMPLEMENTATION = NOT_AUTHORIZED
TELEMETRY_UPLOAD_ANALYTICS_IMPLEMENTATION = NOT_AUTHORIZED
RETENTION_DELETION_IMPLEMENTATION = NOT_AUTHORIZED
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
WAIVER = NO
```

---

## 14. Contract summary

The safe product claim is intentionally narrow:

> Kodac privacy and egress properties are evidence-scoped. A local, no-egress, no-upload, no-secret-access, or no-persistence result may be claimed only for the exact surface canonically proving it. Unknown behavior remains unknown. Documentation does not create enforcement or execution authority.

This contract is an interpretation boundary, not a new runtime guarantee.
