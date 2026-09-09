# Kodac P8 — Static CLI Result Envelope Examples Documentation Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_FUTURE_DOCUMENTATION_MUTATION_AUTHORITY UNTIL_MERGED_AND_POST_PROVEN**  
Date: 2026-09-09  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Deny-by-default baseline

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 24ba233cc3cd38a6c740c486c8d8917553b9114d
CANONICAL_TREE_AT_CANDIDATE_START = 2ed91ad46b070d1dfebad70893799277605c604f
P8_POST_AGENT_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #510 / merge 24ba233cc3cd38a6c740c486c8d8917553b9114d / proof 5603217279
POST_CLOSURE_SUCCESSOR_ANALYSIS = PR #510 / comment 5603343047 / ANALYSIS_ONLY
P8_STATIC_CLI_RESULT_ENVELOPE_EXAMPLES_DOCUMENTATION = NOT_AUTHORIZED_UNTIL_THIS_RECORD_QUALIFIES_MERGES_AND_POST_PROVES
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This record is a one-path documentation-only authorization candidate. It creates no runtime, source, schema, test, package, workflow, dependency, provider/model, network, secret, filesystem-write, persistence, telemetry, learning, release, publication, deployment, or project-completion authority while unmerged or unproven.

The descriptive P8 label creates no authority by sequence or numbering.

---

## 2. Why this is the minimum non-duplicative successor

The already-proven P8 lineage establishes:

```text
P8_R1 = MACHINE_READABLE_CLI_RESULT_ENVELOPE_FOUNDATION / CLOSED_CANONICAL
P8_R2 = APPLY_PATCH_AND_ASK_JSON_ENVELOPE_WIRING / CLOSED_CANONICAL
P8_R3 = SOLVE_JSON_ENVELOPE_WIRING_AND_CONTROLLED_LIVE_SOLVE_CONSUMER_ADAPTATION / CLOSED_CANONICAL
P8_R4 = EXACT_LOCAL_CLI_HELP / CLOSED_CANONICAL
REPOSITORY_LOCAL_HELP_README_DOCUMENTATION = CLOSED_CANONICAL / PR #504
AGENT_CONSUMER_INTEGRATION_CONTRACT_DOCUMENTATION = CLOSED_CANONICAL / PR #508
POST_AGENT_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #510
```

The canonical P8 master plan still identifies `OPERATIONAL_DOCS_AND_EXAMPLES` among Product & Distribution Hardening concerns. Current canonical `docs/product/AGENT_INTEGRATION_CONTRACT.md` intentionally remains interpretation-only, schema-bound, fail-closed, and grants no executable command examples. Fresh inspection at the canonical start state found no `docs/product/CLI_RESULT_ENVELOPE_EXAMPLES.md`.

Therefore the smallest useful non-duplicative successor is not package publication, global installation, GitHub/CI product integration, provider fallback, release/version authority, or a new CLI feature. It is one bounded documentation surface containing static, inert examples of the already-canonical result-envelope contract.

```text
STATIC_RESULT_ENVELOPE_EXAMPLES != CLI_BEHAVIOR_CHANGE
STATIC_RESULT_ENVELOPE_EXAMPLES != EXECUTABLE_COMMAND_EXAMPLES
STATIC_RESULT_ENVELOPE_EXAMPLES != AGENT_EXECUTION_AUTHORITY
STATIC_RESULT_ENVELOPE_EXAMPLES != VERIFIED_EVIDENCE
STATIC_RESULT_ENVELOPE_EXAMPLES != PACKAGE_PUBLICATION
STATIC_RESULT_ENVELOPE_EXAMPLES != RELEASE
```

---

## 3. Exact future documentation allowlist

Only after this authorization independently qualifies, guarded-merges, and passes mandatory external post-merge proof may one later documentation candidate create exactly:

```text
docs/product/CLI_RESULT_ENVELOPE_EXAMPLES.md
```

No second path is authorized by this record.

The future documentation candidate must not modify:

```text
packages/**
schema/**
.github/**
README.md
AGENTS.md
package.json
package-lock.json
pnpm-lock.yaml
uv.lock
```

or any existing authorization record, evidence record, runtime record, provider/model configuration, release configuration, ruleset, repository-protection surface, roadmap/current-view surface, source, schema, test, workflow, dependency, lockfile, or package metadata.

No new dependency is authorized.

---

## 4. Exact future documentation meaning

The future single-path document may describe only already-proven canonical `kodac.cli-result` version 1 semantics.

Normative contract identity remains:

```text
PROTOCOL = kodac.cli-result
VERSION = 1
COMMANDS = apply-patch | ask | solve
NORMATIVE_SCHEMA = schema/p8-cli-result-envelope.schema.json
```

Allowed documentation content is limited to:

1. static JSON examples that are proven schema-compatible with the unchanged canonical schema and runtime validator;
2. static rejection examples that clearly explain why an envelope is invalid under the unchanged contract;
3. concise interpretation notes that preserve existing command/status/proven semantics;
4. explicit authority/non-equivalence notes already established canonically.

The future document must remain inert documentation. It may not contain shell commands, executable CLI invocation examples, provider/model invocation steps, installation instructions, package-manager commands, network actions, secret/credential instructions, filesystem mutation instructions, GitHub/CI integration instructions, release/publication/deployment instructions, or any step that implies execution authority.

Static example values must be synthetic and non-sensitive. They must not contain real secrets, tokens, credentials, private endpoints, real user filesystem paths, real provider account identifiers, or claims that referenced evidence has been independently verified.

---

## 5. Required semantics to preserve

The future document must preserve all already-canonical distinctions, including at minimum:

```text
APPLY_PATCH_STATUS = PATCH_APPLIED
APPLY_PATCH_PROVEN = false
PATCH_APPLIED != FIXED
PATCH_APPLIED != VERIFIED
PATCH_APPLIED != DONE_GATE_PASS
PATCH_APPLIED != MERGE_AUTHORITY

ASK_STATUS = COMPLETE
ASK_PROVEN = false
ASK_COMPLETE != PROVEN
ASK_COMPLETE != VERIFIED
ASK_COMPLETE != DONE_GATE_PASS
ASK_COMPLETE != MERGE_AUTHORITY

SOLVE_STATUSES = STOPPED | NOT_READY | PROVEN_READY
STOPPED_PROVEN = false
NOT_READY_PROVEN = false
PROVEN_READY_PROVEN = true
STOPPED != SUCCESS
NOT_READY != SUCCESS
PROVEN_READY != MERGE_AUTHORITY
PROVEN_READY != RELEASE_AUTHORITY
PROVEN_READY != PACKAGE_PUBLICATION_AUTHORITY
PROVEN_READY != DEPLOYMENT_AUTHORITY
PROVEN_READY != PROJECT_COMPLETION

EVIDENCE_REFERENCE != VERIFIED_EVIDENCE_CONTENT
EVIDENCE_REFERENCE != EXECUTION_AUTHORITY
RESULT_ENVELOPE != INDEPENDENT_PROOF
CLI_RESULT_STATUS != DONE_GATE_AUTHORITY
AGENT_CONSUMER_CONTRACT != AGENT_EXECUTION_AUTHORITY
```

The future document must not invent a new protocol version, command, status, field, alias, normalization policy, compatibility rule, evidence meaning, authority rule, or result state.

---

## 6. Required example validation

Before a future documentation candidate may qualify, every positive static JSON example must be checked against the unchanged canonical schema and the existing runtime validation semantics. Rejection examples must be rejected for the reason claimed.

Required proof for the future candidate includes at minimum:

```text
POSITIVE_EXAMPLES_SCHEMA_VALID = PASS
POSITIVE_EXAMPLES_RUNTIME_VALID = PASS
POSITIVE_EXAMPLES_SCHEMA_RUNTIME_AGREEMENT = PASS
NEGATIVE_EXAMPLES_REJECT_AS_DESCRIBED = PASS
PROTOCOL_VERSION_COMMAND_STATUS_SEMANTICS = UNCHANGED
NO_EXECUTABLE_COMMAND_EXAMPLES = PASS
NO_REAL_SECRET_CREDENTIAL_ENDPOINT_PATH_DATA = PASS
NO_AUTHORITY_TRANSFER_LANGUAGE = PASS
CHANGED_PATHS = EXACTLY_1_AUTHORIZED_FUTURE_PATH
```

Validation may use existing repository tooling only. This authorization does not admit a new dependency, provider, model, external service, or execution authority.

---

## 7. Preserved non-grants

This authorization candidate does not authorize, and the future static-example document must not imply:

```text
EXECUTABLE_COMMAND_EXAMPLES = NOT_AUTHORIZED
NEW_CLI_FLAGS_OR_ALIASES = NOT_AUTHORIZED
CLI_BEHAVIOR_CHANGE = NOT_AUTHORIZED
CLI_EXIT_CODE_CHANGE = NOT_AUTHORIZED
PROTOCOL_VERSION_CHANGE = NOT_AUTHORIZED
SCHEMA_CHANGE = NOT_AUTHORIZED
SOURCE_RUNTIME_TEST_CHANGE = NOT_AUTHORIZED_BY_THIS_RECORD
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_NAME_VERSION_CHANGE = NOT_AUTHORIZED
PACKAGE_PUBLICATION = NOT_AUTHORIZED
GLOBAL_INSTALLABILITY = NOT_AUTHORIZED
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED
DETERMINISTIC_PROVIDER_MODEL_FALLBACK_IMPLEMENTATION = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_AUTHORITY_EXPANSION = NOT_AUTHORIZED
PROVIDER_SPEND = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
FILESYSTEM_WRITE_AUTHORITY_EXPANSION = NOT_AUTHORIZED
K2_SIDE_EFFECT_AUTHORITY_CHANGE = NOT_AUTHORIZED
K5_DONE_GATE_AUTHORITY_CHANGE = NOT_AUTHORIZED
DONE_GATE_IMPLEMENTATION_OR_ALGORITHM_CHANGE = NOT_AUTHORIZED
VERIFICATION_EXECUTION_AUTHORITY_EXPANSION = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
PRIVACY_EGRESS_BEHAVIOR_CHANGE = NOT_AUTHORIZED
RELEASE_VERSION_AUTHORITY_CHANGE = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
RULESET_CHANGE_OR_BYPASS = NOT_AUTHORIZED
WAIVER = NO
```

The runtime package remains private and unpublished. Repository-local help documentation remains repository-local only.

---

## 8. Qualification gate for this authorization candidate

Do not merge this one-path authorization candidate unless one unchanged exact head/current metadata proves:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1
CHANGED_PATH = docs/planning/KODAC_P8_STATIC_CLI_RESULT_ENVELOPE_EXAMPLES_DOCUMENTATION_AUTHORIZATION_2026-09-09.md
AUTHORIZATION_BLOB = FROZEN
P8_POST_AGENT_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #510 / proof 5603217279
POST_CLOSURE_SUCCESSOR_ANALYSIS = PR #510 / comment 5603343047 / ANALYSIS_ONLY
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
MERGE = GUARDED_NORMAL_MERGE_USING_EXACT_EXPECTED_HEAD_SHA
POST_MERGE_PROOF = MAIN + ORDERED_PARENTS + TREE + AUTHORIZATION_BLOB + VERIFIED_VALID_SIGNATURE + APPLICABLE_PUSH_CHECKS + MERGED_PR_STATE + RULESET + REVIEW_THREADS
WAIVER = NO
```

Any head, base, blob, path, ruleset, or material-evidence movement invalidates exact-head qualification evidence and requires fresh proof.

---

## 9. Candidate boundary

Until this exact authorization candidate qualifies, merges guarded, and passes mandatory external post-merge proof:

```text
P8_STATIC_CLI_RESULT_ENVELOPE_EXAMPLES_DOCUMENTATION = NOT_AUTHORIZED
DIRECT_FUTURE_DOCUMENT_MUTATION = NOT_AUTHORIZED
SUCCESSOR_RUNTIME_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

If this record later becomes canonical and externally post-merge proven, it authorizes exactly one later documentation-only candidate creating `docs/product/CLI_RESULT_ENVELOPE_EXAMPLES.md` under the constraints above and nothing broader.
