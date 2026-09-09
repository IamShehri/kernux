# Kodac P8 — Agent Integration Contract Documentation Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_AGENT_INTEGRATION_DOCUMENTATION_MUTATION_AUTHORITY UNTIL_MERGED_AND_POST_PROVEN**  
Date: 2026-09-09  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Canonical basis

```text
BASE_MAIN = 534de2b4ba4b25d31fb2448361221efe871f2d74
BASE_TREE = d2358cdf3889e85f589a3132205111cd9595fc14
POST_README_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #506 / proof 5594139062
POST_CLOSURE_SUCCESSOR_ANALYSIS = PR #506 / comment 5594156143 / ANALYSIS_ONLY
P8_MASTER_PLAN_CONCERN = CLEAR_AGENT_INTEGRATION_CONTRACTS
WAIVER = NO
```

This candidate creates no implementation authority while unproven. It exists only to authorize one later documentation-only agent-consumer contract if this authorization independently qualifies, guarded-merges, and passes mandatory external post-merge proof.

---

## 2. Why this is the minimum non-duplicative successor

Canonical P8 work already established:

```text
P8_R1 = MACHINE_READABLE_CLI_RESULT_ENVELOPE_FOUNDATION
P8_R2 = APPLY_PATCH_AND_ASK_JSON_WIRING
P8_R3 = SOLVE_JSON_WIRING_AND_CONTROLLED_LIVE_SOLVE_CONSUMER_ADAPTATION
P8_R4 = EXACT_LOCAL_CLI_HELP
README_LOCAL_HELP_DOCUMENTATION = CLOSED_CANONICAL / PR #504 / proof 5593972791
POST_README_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #506 / proof 5594139062
```

The existing `agents/opencode/profile.yaml` is a catalog/profile record about an external agent. It is not a contract describing how an agent consumes Kodac CLI result envelopes.

The canonical P8 master plan still identifies `clear agent integration contracts` as a Product & Distribution Hardening concern. No `docs/product/AGENT_INTEGRATION_CONTRACT.md` exists on the canonical base.

This candidate deliberately avoids numbered `P8-R5` authority. It authorizes only one future documentation path after this authorization itself becomes canonical.

---

## 3. Conditional future implementation allowlist

Only after this authorization becomes `CLOSED_CANONICAL` may one later implementation candidate modify exactly:

```text
docs/product/AGENT_INTEGRATION_CONTRACT.md
```

No second path is authorized by this record.

The future implementation must be documentation-only and must not modify source, runtime, tests, schemas, package metadata, bin entrypoints, workflows, dependencies, lockfiles, provider/model configuration, provenance records, authorization records, rulesets, historical evidence, README, or current roadmap/status views.

---

## 4. Exact documentation scope admitted

The later documentation may bind only already-proven canonical behavior and existing artifacts:

```text
PROTOCOL = kodac.cli-result
VERSION = 1
COMMANDS = apply-patch | ask | solve
NORMATIVE_SCHEMA = schema/p8-cli-result-envelope.schema.json

APPLY_PATCH_STATUS = PATCH_APPLIED
APPLY_PATCH_PROVEN = false
ASK_STATUS = COMPLETE
ASK_PROVEN = false
SOLVE_STATUS = STOPPED | NOT_READY | PROVEN_READY
SOLVE_PROVEN_READY_PROVEN = true

RUNTIME_PACKAGE = @kodac/runtime-internal / PRIVATE / UNPUBLISHED
README_HELP_INVOCATION = REPOSITORY_LOCAL_ONLY
```

The later documentation may state consumer rules that are conservative consequences of the existing schema and governance:

```text
CONSUMER_PROTOCOL_MATCH = REQUIRED
CONSUMER_VERSION_MATCH = REQUIRED
CONSUMER_COMMAND_STATUS_SHAPE_VALIDATION = REQUIRED_AGAINST_CANONICAL_SCHEMA
UNKNOWN_PROTOCOL = FAIL_CLOSED_FOR_CONSUMER
UNKNOWN_VERSION = FAIL_CLOSED_FOR_CONSUMER
UNKNOWN_COMMAND_OR_STATUS_SHAPE = FAIL_CLOSED_FOR_CONSUMER
EVIDENCE_FIELDS = DATA_REFERENCES_ONLY
CLI_RESULT_STATUS = NOT_INDEPENDENT_COMPLETION_AUTHORITY
PROVEN_READY = NOT_MERGE_AUTHORITY
PROVEN_READY = NOT_RELEASE_AUTHORITY
PROVEN_READY = NOT_PROJECT_COMPLETION
```

The later document may reference the canonical schema path and existing P8 lineage. It may explain that callers should validate the full envelope before consuming command-specific payload/evidence fields.

---

## 5. Explicit non-grants

This authorization does **not** admit any of the following:

```text
EXECUTABLE_COMMAND_EXAMPLES = NOT_AUTHORIZED
NEW_CLI_FLAGS_OR_ALIASES = NOT_AUTHORIZED
--version = NOT_AUTHORIZED
-h = NOT_AUTHORIZED
help_ALIAS = NOT_AUTHORIZED
PROTOCOL_VERSION_CHANGE = NOT_AUTHORIZED
SCHEMA_CHANGE = NOT_AUTHORIZED
SOURCE_RUNTIME_TEST_CHANGE = NOT_AUTHORIZED
PACKAGE_NAME_OR_VERSION_CHANGE = NOT_AUTHORIZED
PACKAGE_PUBLICATION = NOT_AUTHORIZED
GLOBAL_INSTALLABILITY = NOT_AUTHORIZED
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_AUTHORITY_EXPANSION = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
FILESYSTEM_WRITE_AUTHORITY_EXPANSION = NOT_AUTHORIZED
K2_SIDE_EFFECT_AUTHORITY_CHANGE = NOT_AUTHORIZED
K5_DONE_GATE_AUTHORITY_CHANGE = NOT_AUTHORIZED
DONE_GATE_IMPLEMENTATION_OR_ALGORITHM_CHANGE = NOT_AUTHORIZED
VERIFICATION_EXECUTION = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
RULESET_CHANGE_OR_BYPASS = NOT_AUTHORIZED
WAIVER = NO
```

The contract documentation must not present external agents, providers, models, editors, CI systems, MCP servers, SDKs, or daemons as currently integrated merely because they could consume a machine-readable envelope.

---

## 6. Required non-equivalences

The later document must preserve at least these distinctions:

```text
MACHINE_READABLE_RESULT != INDEPENDENT_PROOF
CLI_RESULT_STATUS != DONE_GATE_AUTHORITY
PATCH_APPLIED != FIXED
ASK_COMPLETE != PROVEN
PROVEN_READY != MERGE_AUTHORITY
PROVEN_READY != RELEASE_AUTHORITY
PROVEN_READY != PROJECT_COMPLETION
EVIDENCE_POINTER != VERIFIED_EVIDENCE_CONTENT
AGENT_CONSUMER_CONTRACT != AGENT_EXECUTION_AUTHORITY
AGENT_CONSUMER_CONTRACT != GITHUB_CI_INTEGRATION
AGENT_CONSUMER_CONTRACT != MCP_EDITOR_DAEMON_SDK_INTEGRATION
DOCUMENTATION != PACKAGE_PUBLICATION
DOCUMENTATION != PUBLIC_RELEASE
```

---

## 7. Qualification gates for this authorization candidate

Before this authorization may merge, one unchanged exact head must prove:

```text
BASE_MAIN == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
AUTHORIZATION_BLOB = FROZEN
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
REQUIRED_EXTERNAL_SEMANTIC_REVIEW_COUNT = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

A merged authorization is not canonical until external post-merge proof confirms canonical `main`, ordered parents, tree/blob identity, applicable post-merge checks, review-thread state, and ruleset state.

---

## 8. Closure rule

Only an external post-merge proof may later classify:

```text
P8_AGENT_INTEGRATION_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL
```

Until then:

```text
AGENT_INTEGRATION_CONTRACT_IMPLEMENTATION_AUTHORITY = NO
```

Even after closure, the resulting authority is limited to the single future documentation path named above. It creates no numbered successor, runtime, integration, release, publication, deployment, or project-completion authority.