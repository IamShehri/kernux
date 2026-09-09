# Kodac P8 Provider Availability / Fallback Contract Reconciliation Authorization — 2026-09-09

## Classification

```text
CLASS = AUTHORIZATION / DOCUMENTATION_ONLY
STATUS = AUTHORIZATION_CANDIDATE / NOT_CANONICAL
CANONICAL_BASE_MAIN = bec252d7c4f41c1d8baf8e20b7d70ec8be38d076
PREDECESSOR = PR #533 / POST_BOUNDED_STATIC_FALLBACK_CURRENT_VIEW_RECONCILIATION / CLOSED_CANONICAL
PREDECESSOR_POST_MERGE_PROOF = 5608260944
SUCCESSOR_ANALYSIS = PR #533 / comment 5608278516 / ANALYSIS_ONLY
FOUNDER_CONTINUATION_AUTHORITY = EXPLICIT_KODAC_CONTINUATION_WITH_ORDINARY_AUTHORIZED_APPROVALS_2026-09-09
P8_NUMBERED_SUCCESSOR_AUTHORITY = NOT_USED
WAIVER = NO
```

This record is a one-path documentation-only authorization candidate. While unmerged or post-merge-unproven, it creates no product-contract mutation authority and no source, runtime, test, schema, package, workflow, dependency, provider/model, network, credential, persistence, installation/update, release, publication, deployment, numbered successor, P9, or project-completion authority.

Only complete external post-merge proof for this exact authorization candidate may make the later one-file product-contract reconciliation eligible.

## Exact authorization-candidate path

This authorization candidate may add exactly one path and no second path:

```text
docs/planning/KODAC_P8_PROVIDER_AVAILABILITY_FALLBACK_CONTRACT_RECONCILIATION_AUTHORIZATION_2026-09-09.md
```

No product contract, current-view file, source, test, schema, package, bin, workflow, dependency, lockfile, historical authorization/evidence record, ruleset, or repository-protection path may change in this authorization candidate.

## Why this is the minimum non-duplicative successor

PR #531 closed a bounded runtime behavior after the provider availability/fallback contract was originally documented through PR #527. PR #533 then reconciled current views and explicitly recorded:

```text
PROVIDER_AVAILABILITY_FALLBACK_CONTRACT = CANONICAL_PREDECESSOR_DOCUMENT / NOW_INCOMPLETE_FOR_BOUNDED_PR_531_RUNTIME_BEHAVIOR
PROVIDER_AVAILABILITY_FALLBACK_CONTRACT_RECONCILIATION = SEPARATE_FUTURE_EVIDENCE_DRIVEN_DECISION
```

Fresh successor analysis `5608278516` verified that the current contract still contains pre-#531 statements that are incomplete unless bounded by the newly proven opt-in credential fallback semantics. No later canonical reconciliation authorization or implementation record exists for this document.

The minimum successor is therefore a one-file documentation reconciliation. Runtime behavior is already implemented and proven; no source, test, schema, provider, network, or package change is needed for this unit.

## Conditionally authorized future path

Only after this authorization becomes `CLOSED_CANONICAL` may one later documentation candidate modify exactly:

```text
docs/product/PROVIDER_AVAILABILITY_FALLBACK_CONTRACT.md
```

No second path is authorized.

The later candidate must not modify any roadmap/current-view path. Any later current-view reconciliation, if needed after the contract update closes, requires its own separately proven authorization.

## Required predecessor lineage

The later contract reconciliation must preserve the exact established lineage relevant to provider/fallback behavior:

```text
P8_PROVIDER_AVAILABILITY_FALLBACK_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL / PR #526 / merge 65f0c20a8e41071e0d833b8915d82e39e4d8168c / proof 5606510695
P8_PROVIDER_AVAILABILITY_FALLBACK_CONTRACT_DOCUMENTATION = CLOSED_CANONICAL / PR #527 / merge de91dc968086e88bb7452dc20dc32ae4338c26b0 / proof 5606599167
POST_PROVIDER_AVAILABILITY_FALLBACK_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #529 / merge 8fc8469a6932770b9032d1220f0c696e165091a3 / proof 5607170820
P8_BOUNDED_STATIC_ASK_FALLBACK_AUTHORIZATION = CLOSED_CANONICAL / PR #530 / merge 4dd85edb3948fdea8dbdf8bb8e22ccdd4b3995b5 / proof 5607597288
P8_BOUNDED_STATIC_ASK_FALLBACK_IMPLEMENTATION = CLOSED_CANONICAL / PR #531 / merge 81903b1903aa2ced085b8a926e15294112d4e7be / proof 5607981953
P8_POST_BOUNDED_STATIC_FALLBACK_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL / PR #532 / merge c5842cd71e65dd0729941075e99033f23dd4a998 / proof 5608141441
POST_BOUNDED_STATIC_FALLBACK_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #533 / merge bec252d7c4f41c1d8baf8e20b7d70ec8be38d076 / proof 5608260944
```

The historical privacy/egress adverse-evidence lineage remains in force. This unit does not rewrite PR #520 or any other predecessor record.

## Required contract reconciliation

The later one-file contract update must reconcile only already-proven canonical behavior. It must preserve the original document's interpretation-only status and explicitly distinguish historical authorization from the later reconciliation authorization.

The updated contract must state that the existing default behavior remains:

```text
DEFAULT_PROVIDER = fixture
DEFAULT_MODEL = fixture/deterministic-v1
NO_PROVIDER_OPTION -> fixture
DEFAULT_FIXTURE_PROVIDER != AUTOMATIC_FALLBACK_FROM_ANY_PROVIDER_FAILURE
FIXTURE_DETERMINISM != GLOBAL_OFFLINE_PRODUCT_GUARANTEE
```

It must also document the bounded PR #531 behavior exactly:

```text
BOUNDED_ASK_STATIC_CREDENTIAL_FALLBACK = IMPLEMENTED / CLOSED_CANONICAL
COMMAND = ask only
ACTIVATION = explicit --static-fallback only
OUTPUT_MODE = human output only
ELIGIBLE_ERROR_TYPE = ModelProviderError
ELIGIBLE_MAPPING_1 = openai -> credential_missing
ELIGIBLE_MAPPING_2 = openai-compatible -> credentials_missing
SUCCESSFUL_PROVIDER_WITH_OPT_IN = ordinary ask behavior preserved
MISMATCHED_PROVIDER_ERROR_PAIR = fail closed
UNKNOWN_PROVIDER = fail closed
GENERIC_ERROR = fail closed
HTTP_NETWORK_STREAM_ABORT_AND_OTHER_FAILURES = fail closed
ask --static-fallback --json = usage error before session/evidence/provider/model activity
solve --static-fallback = usage error before session/evidence/provider/model activity
apply-patch --static-fallback = usage error before session/evidence/provider/model activity
P8_CLI_RESULT_PROTOCOL = unchanged
P8_CLI_RESULT_VERSION = 1 / unchanged
RUNTIME_SESSION_COMPLETE_SIGNATURE = unchanged
EVENT_PROTOCOL = unchanged
```

The exact static human fallback text may be documented as already-proven runtime behavior:

```text
Kodac static fallback: requested model provider is unavailable because required credentials are not configured.
```

The document must state explicitly:

```text
STATIC_FALLBACK_IS_MODEL_OUTPUT = NO
STATIC_FALLBACK_IS_FIXTURE_PROVIDER_OUTPUT = NO
SECOND_PROVIDER_SELECTION = NO
FIXTURE_PROVIDER_SUBSTITUTION = NO
MODEL_PROVIDER_RETRY_ADDED_BY_FALLBACK = NO
NETWORK_ATTEMPT_ADDED_BY_FALLBACK = NO
CREDENTIAL_VALUE_READ_BY_FALLBACK = NO
```

## Exact evidence compatibility boundary

The later contract update must describe the existing evidence behavior without inventing events:

```text
ELIGIBLE_FALLBACK_TERMINAL_EVENT_TYPE = session.completed / EXISTING_EVENT_TYPE
ELIGIBLE_FALLBACK_TERMINAL_STATUS = complete
ELIGIBLE_FALLBACK_TERMINAL_MODE = static_fallback
ELIGIBLE_FALLBACK_TERMINAL_PROVIDER_FIELD = ABSENT
ELIGIBLE_FALLBACK_TERMINAL_MODEL_FIELD = ABSENT
session.completed COUNT_FOR_ELIGIBLE_FALLBACK = EXACTLY_1
session.failed AFTER_ELIGIBLE_FALLBACK = NO
```

If the canonical provider path already emitted `model.failed` before surfacing the eligible credential error, that historical event remains preserved. If the eligible failure occurs before model dispatch and canonical execution emitted no `model.failed`, the fallback path does not fabricate one.

The documentation must not convert evidence behavior into provider/model success, proof, telemetry, upload, or persistence authority.

## Required general-fallback boundary

The updated contract must remove or qualify stale pre-#531 statements without generalizing the bounded implementation.

At minimum it must preserve:

```text
BOUNDED_ASK_STATIC_CREDENTIAL_FALLBACK != GENERAL_DETERMINISTIC_STATIC_FALLBACK
GENERAL_DETERMINISTIC_STATIC_FALLBACK = NOT_ESTABLISHED
AUTOMATIC_CROSS_PROVIDER_FALLBACK = NOT_PROVEN
AUTOMATIC_PROVIDER_FAILURE_TO_FIXTURE_FALLBACK = NOT_PROVEN
AUTOMATIC_FIXTURE_SUBSTITUTION = NOT_PROVEN
MACHINE_READABLE_STATIC_FALLBACK = NOT_IMPLEMENTED_BY_PR_531
SOLVE_STATIC_FALLBACK = NOT_IMPLEMENTED_BY_PR_531
APPLY_PATCH_STATIC_FALLBACK = NOT_IMPLEMENTED_BY_PR_531
FALLBACK_AFTER_HTTP_NETWORK_STREAM_ABORT_FAILURE = NOT_IMPLEMENTED_BY_PR_531
SAME_PROVIDER_BOUNDED_RETRY != CROSS_PROVIDER_FALLBACK
PROVIDER_RETRYABLE_METADATA != GENERAL_RETRY_REPLAY_RESUME_AUTHORITY
```

The old blanket statement:

```text
MISSING_REQUIRED_PROVIDER_CREDENTIAL -> ERROR
```

must be refined so that it remains true when bounded fallback is absent or ineligible, while explicitly accounting for the exact caller-opt-in credential fallback when all eligibility conditions are satisfied.

The old statement:

```text
PLANNED_STATIC_FALLBACK != IMPLEMENTED_STATIC_FALLBACK
```

must not remain unqualified. It must be replaced by the bounded/general distinction above.

## Provider and privacy authority boundaries

The updated contract must preserve:

```text
PROVIDER_CODE_EXISTS != PROVIDER_INVOCATION_AUTHORIZED
ENVIRONMENT_VARIABLE_NAME_EXISTS != SECRET_ACCESS_AUTHORIZED
NETWORK_ENDPOINT_EXISTS_IN_SOURCE != NETWORK_ACCESS_AUTHORIZED
MODEL_ID_ACCEPTED_BY_CLI != MODEL_INVOCATION_AUTHORIZED
DOCUMENTATION != RUNTIME_ENFORCEMENT
BOUNDED_NO_EGRESS_EVIDENCE != GLOBAL_ALL_COMMANDS_OFFLINE_CLAIM
DEFAULT_FIXTURE_PROVIDER != PROOF_THAT_ALL_PROVIDER_CAPABLE_PATHS_ARE_OFFLINE
UNKNOWN_OR_UNPROVEN_PRIVACY_EGRESS_BEHAVIOR = DO_NOT_CLAIM
```

The reconciliation itself must not invoke a live provider/model, read a real credential, perform external network access, or incur provider spend.

## Existing behavior that must remain documented accurately

The later contract update must preserve already-canonical provider facts unrelated to #531, including:

- default fixture provider/model selection when no override is supplied;
- runtime provider registration behavior;
- exact built-in provider resolution for `openai` and `openai-compatible`;
- unknown-provider fail-closed behavior;
- same-provider bounded retry distinctions;
- current credential source names and endpoint facts only to the extent already documented and still accurate;
- final non-eligible provider-generation failure propagation;
- evidence-scoped privacy/egress interpretation;
- no global offline guarantee.

The candidate must reconcile stale wording rather than delete material safety boundaries.

## Explicit non-grants

```text
SOURCE_RUNTIME_MUTATION = NOT_AUTHORIZED
TEST_SCHEMA_PACKAGE_BIN_MUTATION = NOT_AUTHORIZED
CURRENT_VIEW_ROADMAP_MUTATION = NOT_AUTHORIZED
WORKFLOW_DEPENDENCY_LOCKFILE_MUTATION = NOT_AUTHORIZED
CLI_BEHAVIOR_CHANGE = NOT_AUTHORIZED
GENERAL_PROVIDER_FALLBACK = NOT_AUTHORIZED
CROSS_PROVIDER_FALLBACK = NOT_AUTHORIZED
FALLBACK_TO_FIXTURE = NOT_AUTHORIZED
MACHINE_READABLE_FALLBACK = NOT_AUTHORIZED
SOLVE_FALLBACK = NOT_AUTHORIZED
APPLY_PATCH_FALLBACK = NOT_AUTHORIZED
HTTP_NETWORK_STREAM_ABORT_FALLBACK = NOT_AUTHORIZED
NEW_PROVIDER_MODEL_ADMISSION = NOT_AUTHORIZED
LIVE_PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED
NEW_NETWORK_ACCESS = NOT_AUTHORIZED
NEW_SECRET_CREDENTIAL_ACCESS = NOT_AUTHORIZED
NEW_PROVIDER_RETRY_REPLAY_RESUME = NOT_AUTHORIZED
PROVIDER_SPEND = NOT_AUTHORIZED
EVENT_PROTOCOL_MUTATION = NOT_AUTHORIZED
EVIDENCE_SCHEMA_MUTATION = NOT_AUTHORIZED
PERSISTENCE_DATABASE_MUTATION = NOT_AUTHORIZED
TELEMETRY_UPLOAD_ANALYTICS_LEARNING = NOT_AUTHORIZED
CROSS_REPOSITORY_ACCESS = NOT_AUTHORIZED
GITHUB_ACTION_WORKFLOW_API_APP_WEBHOOK_IMPLEMENTATION = NOT_AUTHORIZED
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED
OPERATIONAL_DOCS_EXAMPLES_IMPLEMENTATION = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_VERSION_MUTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
K2_K5_DONE_GATE_AUTHORITY_CHANGE = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
REBASE = NOT_AUTHORIZED
FORCE_PUSH = NOT_AUTHORIZED
HISTORY_REWRITE = NOT_AUTHORIZED
WAIVER = NO
```

## Qualification gate for this authorization candidate

Before guarded merge, one unchanged exact candidate head must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
AUTHORIZATION_BLOB = FROZEN
PREDECESSOR_POST_MERGE_PROOF_BOUND = PASS
SUCCESSOR_ANALYSIS_BOUND = PASS
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE
RULESET_BYPASS_ACTORS = []
CURRENT_USER_CAN_BYPASS = never
EXPECTED_HEAD_GUARDED_NORMAL_MERGE = REQUIRED
POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

Any head/base movement, later material finding, unresolved actionable thread, check regression, or ruleset change invalidates earlier qualification evidence.

## Qualification gate for the later one-file contract reconciliation

This authorization does not pre-qualify the later documentation candidate. That candidate must independently prove on one unchanged exact head:

```text
BASE == THEN_CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_CONTRACT_PATH
NO_SECOND_PATH = PASS
AUTHORIZATION_POST_MERGE_PROOF_BOUND = PASS
PREDECESSOR_LINEAGE_BOUND = PASS
PR_531_BOUNDED_RUNTIME_TRUTH_BOUND_WITHOUT_GENERALIZATION = PASS
GENERAL_FALLBACK_NON_GRANTS_PRESERVED = PASS
PRIVACY_EGRESS_AUTHORITY_BOUNDARIES_PRESERVED = PASS
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE
RULESET_BYPASS_ACTORS = []
CURRENT_USER_CAN_BYPASS = never
EXPECTED_HEAD_GUARDED_NORMAL_MERGE = REQUIRED
POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

## Closure semantics

This record cannot certify itself. Only complete external post-merge proof may classify:

```text
P8_PROVIDER_AVAILABILITY_FALLBACK_CONTRACT_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL
```

Even after closure, the only new eligibility is the exact one-file product-contract reconciliation above. No runtime implementation, broader fallback, installation/update work, operational docs/examples, package/version change, release/publication/deployment, P8-R5+, P9 authority, or project-completion claim follows by implication.
