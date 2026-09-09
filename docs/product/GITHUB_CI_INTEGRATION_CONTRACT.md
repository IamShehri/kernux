# Kodac GitHub/CI Consumer Integration Contract

## Authority and scope

This document describes how a GitHub/CI consumer may **validate and interpret** the already-canonical Kodac machine-readable CLI result envelope.

It does not create or claim an executable GitHub integration, GitHub Action, workflow, app, webhook, API client, check-run writer, commit-status writer, CI adapter, token/secret capability, package distribution channel, or deployment mechanism.

It does not create command-execution authority, side-effect authority, verification authority, merge authority, release authority, package-publication authority, deployment authority, or project-completion authority.

Canonical implementation, schema, repository governance, and exact authorization/proof records override this explanatory document.

Normative data contract:

```text
schema/p8-cli-result-envelope.schema.json
```

Canonical protocol identity:

```text
PROTOCOL = kodac.cli-result
VERSION = 1
COMMANDS = apply-patch | ask | solve
```

The runtime package remains private and unpublished. Existing README help documentation remains repository-local only.

---

## CI consumer boundary

A CI consumer must treat a Kodac CLI result as **data to validate and interpret**, not as transferred repository or CI authority.

Before consuming command-specific payload, status, `proven`, or evidence fields, the consumer must validate the complete result envelope against the canonical schema and require:

```text
PROTOCOL_MATCH = REQUIRED
VERSION_MATCH = REQUIRED
COMMAND_MATCH = REQUIRED
COMMAND_STATUS_SHAPE = REQUIRED
FULL_ENVELOPE_SCHEMA_VALIDATION = REQUIRED
```

Fail closed for interpretation when any of these conditions is true:

```text
UNKNOWN_PROTOCOL = REJECT
UNKNOWN_VERSION = REJECT
UNKNOWN_COMMAND = REJECT
UNKNOWN_STATUS_FOR_COMMAND = REJECT
INVALID_ENVELOPE_SHAPE = REJECT
MISSING_REQUIRED_FIELD = REJECT
UNEXPECTED_ADDITIONAL_FIELD = REJECT_WHERE_SCHEMA_FORBIDS_IT
```

A CI consumer must not partially trust a payload merely because individual fields look familiar.

---

## CI interpretation model

A valid envelope may be exposed as CI data for reporting or separately authorized policy evaluation. This contract does **not** define a GitHub check conclusion, commit status, merge gate, release gate, or deployment decision.

Required distinctions:

```text
VALID_ENVELOPE = INTERPRETABLE_DATA
VALID_ENVELOPE != CI_SUCCESS_AUTHORITY
CLI_RESULT_STATUS != CI_SUCCESS_AUTHORITY
CLI_RESULT_STATUS != MERGE_AUTHORITY
CLI_RESULT_STATUS != RELEASE_AUTHORITY
CLI_RESULT_STATUS != DEPLOYMENT_AUTHORITY
CI_CONSUMER_INTERPRETATION != GITHUB_WORKFLOW_AUTHORITY
CI_CONSUMER_INTERPRETATION != GITHUB_API_AUTHORITY
```

A future executable CI integration would require its own canonical authorization, implementation, qualification, and post-merge proof.

---

## Canonical command/result matrix

### `apply-patch`

```text
COMMAND = apply-patch
STATUS = PATCH_APPLIED
PROVEN = false
```

The envelope may describe affected paths, receipt identity, and evidence references according to the canonical schema.

A CI consumer must preserve:

```text
PATCH_APPLIED != FIXED
PATCH_APPLIED != VERIFIED
PATCH_APPLIED != DONE_GATE_PASS
PATCH_APPLIED != CI_SUCCESS_AUTHORITY
PATCH_APPLIED != MERGE_AUTHORITY
```

### `ask`

```text
COMMAND = ask
STATUS = COMPLETE
PROVEN = false
```

The envelope may carry provider/model identity, assistant content, and an evidence reference according to the canonical schema.

A CI consumer must preserve:

```text
ASK_COMPLETE != PROVEN
ASK_COMPLETE != VERIFIED
ASK_COMPLETE != DONE_GATE_PASS
ASK_COMPLETE != CI_SUCCESS_AUTHORITY
ASK_COMPLETE != MERGE_AUTHORITY
```

### `solve`

Canonical statuses are:

```text
STOPPED
NOT_READY
PROVEN_READY
```

`STOPPED` is not proven. `NOT_READY` is not proven. The canonical `PROVEN_READY` envelope has `proven=true`, but that boolean is part of the bounded result contract and does not transfer repository governance authority.

A CI consumer must preserve:

```text
STOPPED != SUCCESS
NOT_READY != SUCCESS
PROVEN_READY != CI_SUCCESS_AUTHORITY
PROVEN_READY != MERGE_AUTHORITY
PROVEN_READY != RELEASE_AUTHORITY
PROVEN_READY != PACKAGE_PUBLICATION_AUTHORITY
PROVEN_READY != DEPLOYMENT_AUTHORITY
PROVEN_READY != PROJECT_COMPLETION
```

The complete Done Gate and repository governance chain remain separate from the CLI result envelope.

---

## Evidence references

Envelope evidence fields contain data references governed by their command-specific schema shape. They are not instructions to execute, approve, fetch, trust, publish, merge, or mutate anything.

CI consumers must preserve:

```text
EVIDENCE_REFERENCE != VERIFIED_EVIDENCE_CONTENT
EVIDENCE_REFERENCE != EXECUTION_AUTHORITY
EVIDENCE_REFERENCE != DONE_GATE_AUTHORITY
EVIDENCE_REFERENCE != CI_SUCCESS_AUTHORITY
EVIDENCE_REFERENCE != MERGE_AUTHORITY
RESULT_ENVELOPE != INDEPENDENT_PROOF
```

A consumer that needs a stronger conclusion must use the separately authorized repository proof and governance process applicable to that conclusion. This document does not authorize that process or any side effect required by it.

---

## Compatibility and fail-closed behavior

Protocol and version matching are exact for this contract:

```text
SUPPORTED_PROTOCOL = kodac.cli-result
SUPPORTED_VERSION = 1
```

A CI consumer must reject rather than guess compatibility when encountering a future or unknown protocol version.

It must also reject command/status combinations not admitted by the canonical schema. Forward compatibility must be introduced by a later canonical contract or schema change; it must not be inferred locally.

Invalid or incompatible envelope data must not be relabeled as a successful Kodac result merely to keep a CI pipeline moving.

---

## GitHub-specific authority boundary

This repository contains GitHub Actions workflows used for repository governance, qualification, benchmarks, and runtime evidence. Their existence does not establish a Kodac product-facing GitHub integration.

This contract does not authorize or claim any of the following:

```text
GITHUB_ACTION_IMPLEMENTATION
GITHUB_WORKFLOW_MUTATION
GITHUB_APP_IMPLEMENTATION
GITHUB_API_INTEGRATION
GITHUB_CHECK_RUN_CREATION
GITHUB_COMMIT_STATUS_CREATION
GITHUB_WEBHOOK_IMPLEMENTATION
GITHUB_TOKEN_OR_SECRET_ACCESS
EXECUTABLE_CI_ADAPTER
CI_PROVIDER_INTEGRATION
```

A future GitHub/CI product integration must independently define its executable surface, exact permissions, credentials boundary, network behavior, repository/write scope, failure behavior, evidence capture, and governance relationship under a separate canonical authorization.

---

## Authority-preserving CI rules

A CI consumer may use a valid envelope to branch its own **non-authoritative interpretation logic**, but must not elevate the envelope into repository authority.

At minimum:

```text
MACHINE_READABLE_RESULT != INDEPENDENT_PROOF
CLI_RESULT_STATUS != DONE_GATE_AUTHORITY
CI_CONSUMER_CONTRACT != CI_EXECUTION_AUTHORITY
CI_CONSUMER_CONTRACT != GITHUB_WORKFLOW_AUTHORITY
CI_CONSUMER_CONTRACT != GITHUB_API_AUTHORITY
CI_CONSUMER_CONTRACT != FILESYSTEM_WRITE_AUTHORITY
CI_CONSUMER_CONTRACT != NETWORK_AUTHORITY
CI_CONSUMER_CONTRACT != SECRET_ACCESS_AUTHORITY
CI_CONSUMER_CONTRACT != PROVIDER_MODEL_AUTHORITY
CI_CONSUMER_CONTRACT != MERGE_AUTHORITY
CI_CONSUMER_CONTRACT != RELEASE_AUTHORITY
DOCUMENTATION != PACKAGE_PUBLICATION
DOCUMENTATION != PUBLIC_RELEASE
```

Repository mutations, provider/model calls, verification execution, network access, secret access, persistence, workflow mutation, GitHub API calls, and other side effects remain governed by their own canonical boundaries.

---

## Consumer safety requirements

A conforming CI consumer should preserve the original envelope without silently rewriting protocol, version, command, status, `proven`, evidence references, or payload semantics.

It must not:

- convert `PATCH_APPLIED` into a claim that a defect is fixed;
- convert `COMPLETE` for `ask` into a proof claim;
- convert `NOT_READY` into readiness;
- convert `PROVEN_READY` into CI success, merge, release, publication, deployment, or project-completion authority;
- invent missing evidence identities;
- infer a new protocol version, command, status, or field;
- treat an unknown field or incompatible shape as harmless when the schema rejects it;
- claim a GitHub Action, workflow, app, webhook, check-run integration, CI provider integration, or executable adapter exists merely because a CI system could parse this envelope.

---

## Existing product boundary

This contract documents a machine-readable CI-consumer interpretation surface only.

It does not establish:

```text
GLOBAL_INSTALLABILITY
PACKAGE_PUBLICATION
PUBLIC_RELEASE
EXECUTABLE_GITHUB_CI_PRODUCT_INTEGRATION
MCP_EDITOR_DAEMON_SDK_INTEGRATION
INSTALLATION_UPDATE_INTEGRITY
PROVIDER_MODEL_AVAILABILITY
NEW_RUNTIME_BEHAVIOR
NEW_CLI_BEHAVIOR
NEW_SCHEMA_BEHAVIOR
```

The runtime package remains private/unpublished, and repository-local CLI help does not imply a globally installed `kodac` command or a public distribution channel.

---

## Canonical lineage

This documentation is bounded by the already-proven P8 lineage:

```text
P8-R1 = MACHINE_READABLE_CLI_RESULT_ENVELOPE_FOUNDATION
P8-R2 = APPLY_PATCH_AND_ASK_JSON_WIRING
P8-R3 = SOLVE_JSON_WIRING_AND_CONTROLLED_LIVE_SOLVE_CONSUMER_ADAPTATION
P8-R4 = EXACT_LOCAL_CLI_HELP
README_LOCAL_HELP_DOCUMENTATION = CLOSED_CANONICAL
AGENT_CONSUMER_INTEGRATION_CONTRACT_DOCUMENTATION = CLOSED_CANONICAL
POST_AGENT_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL
GITHUB_CI_INTEGRATION_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL
```

The exact PR, merge, proof, schema, source, workflow, and historical evidence records remain authoritative in their canonical locations. Omission from this condensed consumer guide is not supersession, waiver, or authority transfer.

---

## Non-grants

This document grants none of the following:

```text
GITHUB_ACTION_IMPLEMENTATION = NO
GITHUB_WORKFLOW_MUTATION = NO
GITHUB_APP_IMPLEMENTATION = NO
GITHUB_API_INTEGRATION = NO
GITHUB_CHECK_RUN_CREATION = NO
GITHUB_STATUS_CREATION = NO
GITHUB_WEBHOOK_IMPLEMENTATION = NO
GITHUB_TOKEN_OR_SECRET_ACCESS = NO
CI_EXECUTABLE_ADAPTER = NO
CI_PROVIDER_INTEGRATION = NO
EXECUTABLE_COMMAND_EXAMPLES = NO
NEW_CLI_FLAGS_OR_ALIASES = NO
PROTOCOL_VERSION_CHANGE = NO
SCHEMA_CHANGE = NO
SOURCE_RUNTIME_TEST_CHANGE = NO
PACKAGE_NAME_OR_VERSION_CHANGE = NO
PACKAGE_PUBLICATION = NO
GLOBAL_INSTALLABILITY = NO
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NO
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NO
PROVIDER_MODEL_TOOL_INVOCATION = NO
PROVIDER_MODEL_AUTHORITY_EXPANSION = NO
NETWORK_ACCESS = NO
SECRET_ACCESS = NO
FILESYSTEM_WRITE_AUTHORITY_EXPANSION = NO
K2_SIDE_EFFECT_AUTHORITY_CHANGE = NO
K5_DONE_GATE_AUTHORITY_CHANGE = NO
DONE_GATE_IMPLEMENTATION_OR_ALGORITHM_CHANGE = NO
VERIFICATION_EXECUTION = NO
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NO
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NO
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
RULESET_CHANGE_OR_BYPASS = NO
WAIVER = NO
```

Any future expansion requires its own canonical authorization and evidence.
