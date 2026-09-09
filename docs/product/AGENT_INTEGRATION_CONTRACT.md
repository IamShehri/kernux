# Kodac Agent Consumer Integration Contract

## Authority and scope

This document describes how an external caller or agent may **interpret** the already-canonical Kodac machine-readable CLI result envelope. It does not create command-execution authority, side-effect authority, provider/model authority, verification authority, merge authority, release authority, package-publication authority, deployment authority, or project-completion authority.

Canonical implementation and schema truth override this explanatory document.

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

The runtime package remains private and unpublished. Existing README help documentation is repository-local only.

---

## Consumer boundary

A consumer must treat a Kodac CLI result as **data to validate and interpret**, not as transferred authority.

Before consuming command-specific payload or evidence fields, the consumer must validate the complete result envelope against the canonical schema and require all of the following:

```text
PROTOCOL_MATCH = REQUIRED
VERSION_MATCH = REQUIRED
COMMAND_MATCH = REQUIRED
COMMAND_STATUS_SHAPE = REQUIRED
FULL_ENVELOPE_SCHEMA_VALIDATION = REQUIRED
```

Fail closed when any of these conditions is true:

```text
UNKNOWN_PROTOCOL = REJECT
UNKNOWN_VERSION = REJECT
UNKNOWN_COMMAND = REJECT
UNKNOWN_STATUS_FOR_COMMAND = REJECT
INVALID_ENVELOPE_SHAPE = REJECT
MISSING_REQUIRED_FIELD = REJECT
UNEXPECTED_ADDITIONAL_FIELD = REJECT_WHERE_SCHEMA_FORBIDS_IT
```

A consumer must not partially trust a payload merely because individual fields look familiar.

---

## Canonical command/result matrix

### `apply-patch`

```text
COMMAND = apply-patch
STATUS = PATCH_APPLIED
PROVEN = false
```

The envelope may describe affected paths, receipt identity, and evidence references according to the canonical schema.

Required interpretation:

```text
PATCH_APPLIED != FIXED
PATCH_APPLIED != VERIFIED
PATCH_APPLIED != DONE_GATE_PASS
PATCH_APPLIED != MERGE_AUTHORITY
```

### `ask`

```text
COMMAND = ask
STATUS = COMPLETE
PROVEN = false
```

The envelope may carry provider/model identity, assistant content, and an evidence reference according to the canonical schema.

Required interpretation:

```text
ASK_COMPLETE != PROVEN
ASK_COMPLETE != VERIFIED
ASK_COMPLETE != DONE_GATE_PASS
ASK_COMPLETE != MERGE_AUTHORITY
```

### `solve`

Canonical statuses are:

```text
STOPPED
NOT_READY
PROVEN_READY
```

`STOPPED` is not proven. `NOT_READY` is not proven. The canonical `PROVEN_READY` envelope has `proven=true`, but that boolean remains part of the bounded result contract and does not transfer repository governance authority.

Required interpretation:

```text
STOPPED != SUCCESS
NOT_READY != SUCCESS
PROVEN_READY != MERGE_AUTHORITY
PROVEN_READY != RELEASE_AUTHORITY
PROVEN_READY != PACKAGE_PUBLICATION_AUTHORITY
PROVEN_READY != DEPLOYMENT_AUTHORITY
PROVEN_READY != PROJECT_COMPLETION
```

The complete Done Gate and repository governance chain remain separate from the CLI result envelope.

---

## Evidence references

Envelope evidence fields contain data references governed by their command-specific schema shape. They are not an instruction to execute, approve, fetch, trust, or mutate anything.

Consumers must preserve these distinctions:

```text
EVIDENCE_REFERENCE != VERIFIED_EVIDENCE_CONTENT
EVIDENCE_REFERENCE != EXECUTION_AUTHORITY
EVIDENCE_REFERENCE != DONE_GATE_AUTHORITY
EVIDENCE_REFERENCE != MERGE_AUTHORITY
RESULT_ENVELOPE != INDEPENDENT_PROOF
```

A consumer that needs stronger conclusions must use the separately authorized repository proof and governance process applicable to that conclusion. This document does not authorize that process or any side effect required by it.

---

## Compatibility behavior

Protocol and version matching are exact for this contract:

```text
SUPPORTED_PROTOCOL = kodac.cli-result
SUPPORTED_VERSION = 1
```

Consumers must fail closed rather than guess compatibility when encountering a future or unknown protocol version.

Consumers must also reject command/status combinations that are not admitted by the canonical schema. Forward compatibility must be introduced by a later canonical contract or schema change; it must not be inferred locally by a consumer.

---

## Authority-preserving consumer rules

An agent or other caller may use a valid envelope to branch its own **non-authoritative interpretation logic**, but must not elevate the envelope into repository authority.

At minimum:

```text
MACHINE_READABLE_RESULT != INDEPENDENT_PROOF
CLI_RESULT_STATUS != DONE_GATE_AUTHORITY
AGENT_CONSUMER_CONTRACT != AGENT_EXECUTION_AUTHORITY
AGENT_CONSUMER_CONTRACT != FILESYSTEM_WRITE_AUTHORITY
AGENT_CONSUMER_CONTRACT != NETWORK_AUTHORITY
AGENT_CONSUMER_CONTRACT != SECRET_ACCESS_AUTHORITY
AGENT_CONSUMER_CONTRACT != PROVIDER_MODEL_AUTHORITY
AGENT_CONSUMER_CONTRACT != GITHUB_CI_INTEGRATION
AGENT_CONSUMER_CONTRACT != MCP_EDITOR_DAEMON_SDK_INTEGRATION
AGENT_CONSUMER_CONTRACT != RELEASE_AUTHORITY
DOCUMENTATION != PACKAGE_PUBLICATION
DOCUMENTATION != PUBLIC_RELEASE
```

Repository mutations, provider/model calls, verification execution, network access, secret access, persistence, and other side effects remain governed by their own canonical boundaries.

---

## Consumer safety requirements

A conforming consumer should preserve the original envelope without silently rewriting status, `proven`, command identity, evidence references, or payload semantics.

It must not:

- convert `PATCH_APPLIED` into a claim that a defect is fixed;
- convert `COMPLETE` for `ask` into a proof claim;
- convert `NOT_READY` into readiness;
- convert `PROVEN_READY` into merge, release, publication, deployment, or project-completion authority;
- invent missing evidence identities;
- infer a new protocol version, command, status, or field;
- treat an unknown field or incompatible shape as harmless when the schema rejects it;
- claim an external agent, editor, CI system, MCP server, daemon, SDK, provider, or model is integrated with Kodac merely because it could parse this envelope.

---

## Existing product boundary

This contract documents a machine-readable consumer surface only.

It does not establish:

```text
GLOBAL_INSTALLABILITY
PACKAGE_PUBLICATION
PUBLIC_RELEASE
GITHUB_CI_PRODUCT_INTEGRATION
MCP_EDITOR_DAEMON_SDK_INTEGRATION
INSTALLATION_UPDATE_INTEGRITY
PROVIDER_MODEL_AVAILABILITY
NEW_RUNTIME_BEHAVIOR
NEW_CLI_BEHAVIOR
NEW_SCHEMA_BEHAVIOR
```

The runtime package remains private/unpublished, and the repository-local CLI help documentation does not imply a globally installed `kodac` command or a public distribution channel.

---

## Canonical lineage

This documentation is bounded by the already-proven P8 lineage:

```text
P8-R1 = MACHINE_READABLE_CLI_RESULT_ENVELOPE_FOUNDATION
P8-R2 = APPLY_PATCH_AND_ASK_JSON_WIRING
P8-R3 = SOLVE_JSON_WIRING_AND_CONTROLLED_LIVE_SOLVE_CONSUMER_ADAPTATION
P8-R4 = EXACT_LOCAL_CLI_HELP
README_LOCAL_HELP_DOCUMENTATION = CLOSED_CANONICAL
```

The exact PR, merge, proof, schema, source, and historical evidence records remain authoritative in their canonical locations. Omission from this condensed consumer guide is not supersession, waiver, or authority transfer.

---

## Non-grants

This document grants none of the following:

```text
EXECUTABLE_COMMAND_EXAMPLES = NO
NEW_CLI_FLAGS_OR_ALIASES = NO
PROTOCOL_VERSION_CHANGE = NO
SCHEMA_CHANGE = NO
SOURCE_RUNTIME_TEST_CHANGE = NO
PACKAGE_NAME_OR_VERSION_CHANGE = NO
PACKAGE_PUBLICATION = NO
GLOBAL_INSTALLABILITY = NO
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NO
GITHUB_CI_PRODUCT_INTEGRATION = NO
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