# Kodac P8 — GitHub/CI Integration Contract Documentation Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_GITHUB_CI_CONTRACT_DOCUMENTATION_MUTATION_AUTHORITY UNTIL_MERGED_AND_POST_PROVEN**  
Date: 2026-09-09  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Canonical basis

```text
BASE_MAIN = 24ba233cc3cd38a6c740c486c8d8917553b9114d
BASE_TREE = 2ed91ad46b070d1dfebad70893799277605c604f
POST_AGENT_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #510 / proof 5603198241
POST_CLOSURE_SUCCESSOR_ANALYSIS = PR #510 / comment 5603281708 / ANALYSIS_ONLY
P8_MASTER_PLAN_CONCERN = GITHUB_CI_INTEGRATION
WAIVER = NO
```

This candidate creates no implementation authority while unproven. It exists only to authorize one later documentation-only GitHub/CI consumer contract if this authorization independently qualifies, guarded-merges, and passes mandatory external post-merge proof.

---

## 2. Why this is the minimum non-duplicative successor

Canonical P8 work already established:

```text
P8_R1 = MACHINE_READABLE_CLI_RESULT_ENVELOPE_FOUNDATION
P8_R2 = APPLY_PATCH_AND_ASK_JSON_WIRING
P8_R3 = SOLVE_JSON_WIRING_AND_CONTROLLED_LIVE_SOLVE_CONSUMER_ADAPTATION
P8_R4 = EXACT_LOCAL_CLI_HELP
README_LOCAL_HELP_DOCUMENTATION = CLOSED_CANONICAL / PR #504 / proof 5593972791
AGENT_CONSUMER_INTEGRATION_CONTRACT_DOCUMENTATION = CLOSED_CANONICAL / PR #508 / proof 5594257305
POST_AGENT_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #510 / proof 5603198241
```

The canonical P8 master plan still identifies `GitHub/CI integration` as a Product & Distribution Hardening concern. Current canonical records explicitly preserve `GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED`, and the agent-consumer contract explicitly states that it is not a GitHub/CI integration contract.

No canonical `docs/product/GITHUB_CI_INTEGRATION_CONTRACT.md` exists on the canonical base. Existing repository workflows are governance, qualification, benchmark, and runtime evidence surfaces; their existence does not create a product-facing CI consumer contract or GitHub integration authority.

This candidate deliberately avoids numbered `P8-R5` authority. It authorizes only one future documentation path after this authorization itself becomes canonical.

---

## 3. Conditional future implementation allowlist

Only after this authorization becomes `CLOSED_CANONICAL` may one later implementation candidate modify exactly:

```text
docs/product/GITHUB_CI_INTEGRATION_CONTRACT.md
```

No second path is authorized by this record.

The future implementation must be documentation-only and must not modify source, runtime, tests, schemas, package metadata, bin entrypoints, workflows, actions, dependencies, lockfiles, provider/model configuration, provenance records, authorization records, rulesets, historical evidence, README, or current roadmap/status views.

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
AGENT_CONSUMER_CONTRACT = DOCUMENTATION_ONLY / INTERPRETATION_ONLY
```

The later documentation may define conservative CI-consumer interpretation rules that are consequences of the existing schema and governance:

```text
CI_CONSUMER_PROTOCOL_MATCH = REQUIRED
CI_CONSUMER_VERSION_MATCH = REQUIRED
CI_CONSUMER_COMMAND_MATCH = REQUIRED
CI_CONSUMER_COMMAND_STATUS_SHAPE_VALIDATION = REQUIRED_AGAINST_CANONICAL_SCHEMA
CI_CONSUMER_FULL_ENVELOPE_SCHEMA_VALIDATION = REQUIRED
UNKNOWN_PROTOCOL = FAIL_CLOSED_FOR_CI_CONSUMER
UNKNOWN_VERSION = FAIL_CLOSED_FOR_CI_CONSUMER
UNKNOWN_COMMAND_OR_STATUS_SHAPE = FAIL_CLOSED_FOR_CI_CONSUMER
INVALID_ENVELOPE = FAIL_CLOSED_FOR_CI_CONSUMER
EVIDENCE_FIELDS = DATA_REFERENCES_ONLY
RESULT_STATUS = NOT_INDEPENDENT_CI_SUCCESS_AUTHORITY
PROVEN_READY = NOT_MERGE_AUTHORITY
PROVEN_READY = NOT_RELEASE_AUTHORITY
PROVEN_READY = NOT_PROJECT_COMPLETION
```

The later document may describe what a future CI caller would need to validate before interpreting the envelope, and may define authority-preserving terminology for exposing protocol, version, command, status, `proven`, and evidence references as CI data.

The later document must not claim that a GitHub Action, workflow, check-run integration, app, webhook, API client, installation, or executable CI adapter currently exists.

---

## 5. Explicit non-grants

This authorization does **not** admit any of the following:

```text
GITHUB_ACTION_IMPLEMENTATION = NOT_AUTHORIZED
GITHUB_WORKFLOW_MUTATION = NOT_AUTHORIZED
GITHUB_APP_IMPLEMENTATION = NOT_AUTHORIZED
GITHUB_API_INTEGRATION = NOT_AUTHORIZED
GITHUB_CHECK_RUN_CREATION = NOT_AUTHORIZED
GITHUB_STATUS_CREATION = NOT_AUTHORIZED
GITHUB_WEBHOOK_IMPLEMENTATION = NOT_AUTHORIZED
GITHUB_TOKEN_OR_SECRET_ACCESS = NOT_AUTHORIZED
CI_EXECUTABLE_ADAPTER = NOT_AUTHORIZED
CI_PROVIDER_INTEGRATION = NOT_AUTHORIZED
EXECUTABLE_COMMAND_EXAMPLES = NOT_AUTHORIZED
NEW_CLI_FLAGS_OR_ALIASES = NOT_AUTHORIZED
PROTOCOL_VERSION_CHANGE = NOT_AUTHORIZED
SCHEMA_CHANGE = NOT_AUTHORIZED
SOURCE_RUNTIME_TEST_CHANGE = NOT_AUTHORIZED
PACKAGE_NAME_OR_VERSION_CHANGE = NOT_AUTHORIZED
PACKAGE_PUBLICATION = NOT_AUTHORIZED
GLOBAL_INSTALLABILITY = NOT_AUTHORIZED
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED
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

The contract documentation must not present GitHub, GitHub Actions, another CI provider, an agent, editor, MCP server, SDK, daemon, provider, or model as currently integrated merely because it could consume a machine-readable envelope.

---

## 6. Required non-equivalences

The later document must preserve at least these distinctions:

```text
MACHINE_READABLE_RESULT != INDEPENDENT_PROOF
CLI_RESULT_STATUS != CI_SUCCESS_AUTHORITY
CI_CONSUMER_INTERPRETATION != GITHUB_WORKFLOW_AUTHORITY
CI_CONSUMER_INTERPRETATION != GITHUB_API_AUTHORITY
CI_CONSUMER_INTERPRETATION != MERGE_AUTHORITY
CI_CONSUMER_INTERPRETATION != RELEASE_AUTHORITY
CI_CONSUMER_CONTRACT != EXECUTABLE_GITHUB_INTEGRATION
PATCH_APPLIED != FIXED
ASK_COMPLETE != PROVEN
PROVEN_READY != MERGE_AUTHORITY
PROVEN_READY != RELEASE_AUTHORITY
PROVEN_READY != PROJECT_COMPLETION
EVIDENCE_POINTER != VERIFIED_EVIDENCE_CONTENT
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
P8_GITHUB_CI_INTEGRATION_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL
```

Until then:

```text
GITHUB_CI_INTEGRATION_CONTRACT_DOCUMENTATION_AUTHORITY = NO
```

Even after closure, the resulting authority is limited to the single future documentation path named above. It creates no workflow, GitHub API, check-run, app, webhook, executable adapter, numbered successor, runtime, release, publication, deployment, or project-completion authority.
