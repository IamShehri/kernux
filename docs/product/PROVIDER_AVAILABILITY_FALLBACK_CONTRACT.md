# Kodac Provider Availability / Fallback Contract

## Status and authority

```text
CLASS = PRODUCT_DOCUMENTATION / INTERPRETATION_ONLY
P8_PROVIDER_AVAILABILITY_FALLBACK_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL
AUTHORIZATION_PR = #526
AUTHORIZATION_MERGE = 65f0c20a8e41071e0d833b8915d82e39e4d8168c
AUTHORIZATION_POST_MERGE_PROOF = 5606510695
P8_PROVIDER_AVAILABILITY_FALLBACK_CONTRACT_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL
RECONCILIATION_AUTHORIZATION_PR = #534
RECONCILIATION_AUTHORIZATION_MERGE = 398263e01df4290032373fcdafa616058183d210
RECONCILIATION_AUTHORIZATION_POST_MERGE_PROOF = 5608443224
THIS_DOCUMENT_RECONCILIATION = CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
DOCUMENTATION != RUNTIME_ENFORCEMENT
WAIVER = NO
```

This document describes provider-selection, provider-availability, deterministic fixture, retry, failure, and fallback behavior that is already present in canonical Kodac code.

It does not create provider execution authority, add providers, change CLI behavior, change retries, create network or credential authority, implement automatic fallback, or authorize release/publication/deployment.

Unknown or unproven behavior is not converted into a product guarantee by this document.

## Core interpretation rules

```text
DEFAULT_FIXTURE_PROVIDER != AUTOMATIC_FALLBACK_FROM_ANY_PROVIDER_FAILURE
FIXTURE_DETERMINISM != GLOBAL_OFFLINE_PRODUCT_GUARANTEE
PROVIDER_ABSTRACTION_EXISTENCE != PROVIDER_INVOCATION_AUTHORITY
BUILT_IN_PROVIDER_IMPLEMENTATION != CREDENTIAL_OR_NETWORK_AUTHORITY
SAME_PROVIDER_BOUNDED_RETRY != CROSS_PROVIDER_FALLBACK
PROVIDER_RETRYABLE_METADATA != GENERAL_RETRY_REPLAY_RESUME_AUTHORITY
UNKNOWN_PROVIDER_FAILURE != FALLBACK_TO_FIXTURE
PROVIDER_GENERATION_FAILURE != FALLBACK_TO_FIXTURE
DOCUMENTATION != RUNTIME_ENFORCEMENT
BOUNDED_ASK_STATIC_CREDENTIAL_FALLBACK = IMPLEMENTED / CLOSED_CANONICAL
BOUNDED_ASK_STATIC_CREDENTIAL_FALLBACK != GENERAL_DETERMINISTIC_STATIC_FALLBACK
GENERAL_DETERMINISTIC_STATIC_FALLBACK = NOT_ESTABLISHED
```

## 1. Canonical provider entry points

Current CLI provider-bearing commands are:

```text
kodac ask <prompt> [--provider <name>] [--model <id>] ...
kodac solve <task> [--provider <name>] [--model <id>] ...
```

Canonical implementation sources:

```text
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/src/model/provider.ts
packages/kodac-runtime/src/model/turn.ts
packages/kodac-runtime/src/model/fixture.ts
packages/kodac-runtime/src/model/openai.ts
packages/kodac-runtime/src/model/openai-compatible.ts
```

The CLI help text currently renders `--provider fixture` for `ask` and `solve`. The parser accepts a provider string supplied by the caller; the help text is not a restriction that only `fixture` can ever be named.

## 2. Default provider and model

When `ask` or `solve` is parsed without an explicit provider/model override, current canonical defaults are:

```text
DEFAULT_PROVIDER = fixture
DEFAULT_MODEL = fixture/deterministic-v1
```

This is default selection behavior, not a recovery policy.

In particular:

```text
NO_PROVIDER_OPTION -> fixture
```

must not be rewritten as:

```text
ANY_PROVIDER_FAILURE -> fixture
```

The second behavior is not established by current canonical code.

## 3. Runtime provider registration

The CLI runtime accepts an optional injected provider through:

```text
CliRuntimeOptions.modelProvider?: ModelProvider
```

Current runtime assembly registers exactly:

```text
input.modelProvider ?? new FixtureModelProvider()
```

Therefore:

- when no injected provider is supplied, the runtime registry begins with the fixture provider;
- when an injected provider is supplied, that provider is registered instead of the default fixture provider at that registration point;
- the existence of an injected provider does not imply that fixture remains registered as a backup;
- provider registration is not fallback authority.

## 4. Provider resolution order

`AgentTurnRunner` resolves the requested provider using the current canonical sequence:

1. if the requested name is already registered, return that registered provider;
2. if the requested name is exactly `openai`, construct and register the existing `OpenAIResponsesProvider`;
3. if the requested name is exactly `openai-compatible`, construct and register the existing `OpenAICompatibleProvider.fromEnv()`;
4. otherwise call `ProviderRegistry.get(name)`, which fails if the name is unknown.

The current unknown-provider failure is:

```text
Unknown provider: <name>
```

There is no canonical step in this sequence that substitutes `fixture` after an unknown provider was explicitly requested.

## 5. Fixture provider meaning

`FixtureModelProvider` is an existing deterministic/local implementation used by the current runtime default and by tests.

Its existence proves only the behavior of that provider implementation and the paths that actually use it.

It does not prove:

```text
ALL_PROVIDER_CAPABLE_PATHS_ARE_OFFLINE = true
ALL_KODAC_COMMANDS_ARE_OFFLINE = true
ALL_MODEL_REQUESTS_USE_FIXTURE = true
NETWORK_IS_GLOBALLY_DISABLED = true
```

Those claims remain unsupported unless separately proven.

The controlling privacy/egress interpretation remains:

```text
DEFAULT_FIXTURE_PROVIDER != PROOF_THAT_ALL_PROVIDER_CAPABLE_PATHS_ARE_OFFLINE
BOUNDED_NO_EGRESS_EVIDENCE != GLOBAL_ALL_COMMANDS_OFFLINE_CLAIM
UNKNOWN_OR_UNPROVEN_PRIVACY_EGRESS_BEHAVIOR = DO_NOT_CLAIM
```

See `docs/product/PRIVACY_EGRESS_CONTRACT.md` for the broader evidence-scoped privacy/egress boundary.

## 6. `openai` provider availability

When the exact provider name `openai` is requested and not already registered, current canonical code may construct `OpenAIResponsesProvider`.

Current implementation facts include:

```text
PROVIDER_NAME = openai
DEFAULT_ENDPOINT = https://api.openai.com/v1/responses
DEFAULT_MAX_ATTEMPTS = 3
MAX_ALLOWED_ATTEMPTS = 5
DEFAULT_STREAM_FOR_AGENT_TURN_RESOLUTION = true
CREDENTIAL_SOURCE = explicit apiKey option OR OPENAI_API_KEY
MISSING_CREDENTIAL = credential_missing / non-retryable
```

The provider's current implementation can perform network requests when it is actually invoked with valid authority and configuration. This documentation does not itself authorize such invocation, credential access, or spend.

The existence of the implementation is a repository fact, not an execution grant.

## 7. `openai-compatible` provider availability

When the exact provider name `openai-compatible` is requested and not already registered, current canonical code may construct `OpenAICompatibleProvider.fromEnv()`.

Current environment-derived configuration can read:

```text
KODAC_OPENAI_COMPATIBLE_API_KEY
OPENAI_API_KEY
KODAC_OPENAI_COMPATIBLE_BASE_URL
OPENAI_BASE_URL
```

The current default base URL is:

```text
https://api.openai.com/v1
```

Current URL validation requires HTTPS except that loopback development endpoints may use HTTP.

For the default OpenAI origin, current construction requires an applicable API key and otherwise fails with a credential-missing error.

Current retry bounds include:

```text
DEFAULT_MAX_ATTEMPTS = 3
MAX_ALLOWED_ATTEMPTS = 5
```

Again, these are facts about an already-existing implementation. This document does not authorize environment-secret access, network calls, external provider spend, or a new provider execution path.

## 8. Same-provider retry is not fallback

The existing `openai` and `openai-compatible` implementations contain bounded request-attempt behavior for retryable failure classes.

That behavior must be interpreted as:

```text
SAME_PROVIDER / SAME_REQUEST_FAMILY / BOUNDED_ATTEMPTS
```

not as:

```text
FAILED_PROVIDER -> DIFFERENT_PROVIDER
FAILED_PROVIDER -> fixture
GENERAL_REPLAY_RESUME_AUTHORITY
```

`ModelProviderError.retryable` records whether a provider error is considered retryable by the applicable provider path. It is not, by itself, authority to retry outside the implementation's already-canonical bounded behavior.

No new retry policy is created by this document.

## 9. Provider-generation failure behavior

`AgentTurnRunner.run(...)` resolves the requested provider before generation.

After request evidence is prepared, the runner calls the selected provider's `generate(...)` method.

If generation throws, current canonical behavior records a `model.failed` event containing bounded provider/model/error metadata and then rethrows the error.

The runner does not prove this behavior:

```text
catch provider failure
-> select fixture
-> continue transparently
```

Therefore:

```text
AUTOMATIC_PROVIDER_FAILURE_TO_FIXTURE_FALLBACK = NOT_PROVEN / NOT_IMPLEMENTED_BY_AGENT_TURN_RUNNER
```

A provider implementation may internally make its own already-bounded same-provider attempts before its final failure reaches the runner. That is distinct from cross-provider fallback.

## 10. Availability is fail-closed, not silently substituted

Current provider availability should be interpreted by exact failure class rather than by a broad claim that Kodac "always works offline" or "always falls back."

Examples of fail-closed states include:

```text
UNKNOWN_PROVIDER_NAME -> ERROR
MISSING_REQUIRED_PROVIDER_CREDENTIAL_WITHOUT_ELIGIBLE_ASK_STATIC_FALLBACK -> ERROR
INVALID_PROVIDER_BASE_URL -> ERROR
FINAL_NON_ELIGIBLE_PROVIDER_GENERATION_FAILURE -> ERROR PROPAGATION
ABORTED_PROVIDER_REQUEST -> ERROR / ABORT PROPAGATION
```

The exact bounded exception is the caller-opt-in `ask --static-fallback` credential fallback documented below. It is not silent provider substitution and does not change the fail-closed handling of non-eligible failures.

No canonical evidence supports silent cross-provider substitution after any failure state.

## 11. Bounded opt-in `ask` credential fallback

PR #531 established one narrow deterministic non-model fallback path. It is canonical runtime behavior only within the following exact boundary:

```text
BOUNDED_ASK_STATIC_CREDENTIAL_FALLBACK = IMPLEMENTED / CLOSED_CANONICAL
IMPLEMENTATION_PR = #531
IMPLEMENTATION_MERGE = 81903b1903aa2ced085b8a926e15294112d4e7be
IMPLEMENTATION_POST_MERGE_PROOF = 5607981953
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

The exact human fallback text is:

```text
Kodac static fallback: requested model provider is unavailable because required credentials are not configured.
```

This text is emitted by the CLI fallback branch itself. The safe interpretation is:

```text
STATIC_FALLBACK_IS_MODEL_OUTPUT = NO
STATIC_FALLBACK_IS_FIXTURE_PROVIDER_OUTPUT = NO
SECOND_PROVIDER_SELECTION = NO
FIXTURE_PROVIDER_SUBSTITUTION = NO
MODEL_PROVIDER_RETRY_ADDED_BY_FALLBACK = NO
NETWORK_ATTEMPT_ADDED_BY_FALLBACK = NO
CREDENTIAL_VALUE_READ_BY_FALLBACK = NO
```

The fallback does not manufacture a successful model turn. It catches only the exact eligible `ModelProviderError` after the existing `ask` runtime path surfaces it.

### Evidence compatibility

Eligible fallback terminates the existing session through the existing event protocol:

```text
ELIGIBLE_FALLBACK_TERMINAL_EVENT_TYPE = session.completed / EXISTING_EVENT_TYPE
ELIGIBLE_FALLBACK_TERMINAL_STATUS = complete
ELIGIBLE_FALLBACK_TERMINAL_MODE = static_fallback
ELIGIBLE_FALLBACK_TERMINAL_PROVIDER_FIELD = ABSENT
ELIGIBLE_FALLBACK_TERMINAL_MODEL_FIELD = ABSENT
session.completed COUNT_FOR_ELIGIBLE_FALLBACK = EXACTLY_1
session.failed AFTER_ELIGIBLE_FALLBACK = NO
```

If canonical provider execution already emitted `model.failed` before surfacing the eligible credential error, that event remains historical evidence. When an eligible credential failure occurs before model dispatch and no `model.failed` was emitted, the fallback path does not fabricate one.

These event facts do not turn the fallback into provider/model success, proof, telemetry, upload, learning, or new persistence authority.

## 12. Static/deterministic fallback planning status

The P8 master plan names:

```text
deterministic/static fallback when models/providers are unavailable
```

as a product-hardening direction.

The master plan explicitly has no implementation authority. PR #531 partially addresses that product-hardening direction through the bounded opt-in `ask` credential fallback above, but current canonical repository evidence still does not establish a general runtime mechanism that transforms arbitrary provider unavailability into a deterministic static result or automatically selects fixture after provider failure.

Therefore:

```text
BOUNDED_ASK_STATIC_CREDENTIAL_FALLBACK = IMPLEMENTED / CLOSED_CANONICAL
BOUNDED_ASK_STATIC_CREDENTIAL_FALLBACK != GENERAL_DETERMINISTIC_STATIC_FALLBACK
GENERAL_DETERMINISTIC_STATIC_FALLBACK = NOT_ESTABLISHED
AUTOMATIC_CROSS_PROVIDER_FALLBACK = NOT_PROVEN
AUTOMATIC_PROVIDER_FAILURE_TO_FIXTURE_FALLBACK = NOT_PROVEN
AUTOMATIC_FIXTURE_SUBSTITUTION = NOT_PROVEN
MACHINE_READABLE_STATIC_FALLBACK = NOT_IMPLEMENTED_BY_PR_531
SOLVE_STATIC_FALLBACK = NOT_IMPLEMENTED_BY_PR_531
APPLY_PATCH_STATIC_FALLBACK = NOT_IMPLEMENTED_BY_PR_531
FALLBACK_AFTER_HTTP_NETWORK_STREAM_ABORT_FAILURE = NOT_IMPLEMENTED_BY_PR_531
```

Any broader implementation would require separate exact canonical authorization, bounded semantics, tests, exact-head review/CI, guarded merge, and post-merge proof.

## 13. Relationship to provider authority

This contract describes existing provider-capable code without granting execution authority.

The following distinctions remain mandatory:

```text
PROVIDER_CODE_EXISTS != PROVIDER_INVOCATION_AUTHORIZED
ENVIRONMENT_VARIABLE_NAME_EXISTS != SECRET_ACCESS_AUTHORIZED
NETWORK_ENDPOINT_EXISTS_IN_SOURCE != NETWORK_ACCESS_AUTHORIZED
RETRY_LOOP_EXISTS != NEW_RETRY_POLICY_AUTHORIZED
MODEL_ID_ACCEPTED_BY_CLI != MODEL_INVOCATION_AUTHORIZED
```

Any task that actually invokes a provider/model, accesses a real credential, incurs spend, or creates network side effects must be authorized by the governing canonical execution boundary for that task.

## 14. Evidence and persistence boundary

Provider-capable requests may interact with the existing session/evidence system according to canonical runtime behavior.

This document does not create new evidence fields, retention behavior, persistence authority, telemetry, upload, analytics, learning, or cross-repository behavior.

The privacy/egress contract remains controlling for what may be claimed about local evidence storage and remote egress.

## 15. Explicit unknown or unproven behavior

Unless separately established by canonical evidence, do not claim:

```text
ALL_PROVIDER_FAILURES_FALL_BACK_TO_FIXTURE
ALL_RETRYABLE_ERRORS_EVENTUALLY_SUCCEED
ALL_PROVIDER_PATHS_HAVE_IDENTICAL_RETRY_POLICIES
ALL_PROVIDER_PATHS_ARE_OFFLINE
ALL_PROVIDER_PATHS_REQUIRE_NO_CREDENTIALS
ALL_PROVIDER_FAILURES_ARE RECOVERABLE
A_STATIC_NON_MODEL_RESULT_IS_ALWAYS_AVAILABLE
PROVIDER_UNAVAILABILITY_CANNOT_BLOCK_ASK_OR_SOLVE
```

Unknown or implementation-specific behavior must remain bounded to the exact code/evidence that proves it.

## 16. Preserved non-grants

```text
SOURCE_RUNTIME_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
TEST_SCHEMA_PACKAGE_BIN_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
WORKFLOW_DEPENDENCY_LOCKFILE_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
CURRENT_VIEW_ROADMAP_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
CLI_BEHAVIOR_CHANGE = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PROVIDER_SELECTION_BEHAVIOR_CHANGE = NOT_AUTHORIZED_BY_THIS_DOCUMENT
AUTOMATIC_PROVIDER_FALLBACK_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
GENERAL_DETERMINISTIC_STATIC_FALLBACK_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
HTTP_NETWORK_STREAM_ABORT_FALLBACK = NOT_AUTHORIZED_BY_THIS_DOCUMENT
NEW_PROVIDER_MODEL_ADMISSION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
NEW_PROVIDER_RETRY_REPLAY_RESUME = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PROVIDER_SPEND = NOT_AUTHORIZED_BY_THIS_DOCUMENT
NETWORK_ACCESS = NOT_AUTHORIZED_BY_THIS_DOCUMENT
SECRET_CREDENTIAL_ACCESS = NOT_AUTHORIZED_BY_THIS_DOCUMENT
EVENT_PROTOCOL_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
EVIDENCE_SCHEMA_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PERSISTENCE_DATABASE_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
TELEMETRY_UPLOAD_ANALYTICS_LEARNING = NOT_AUTHORIZED_BY_THIS_DOCUMENT
CROSS_REPOSITORY_ACCESS = NOT_AUTHORIZED_BY_THIS_DOCUMENT
GITHUB_ACTION_WORKFLOW_API_INTEGRATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
OPERATIONAL_DOCS_EXAMPLES_IMPLEMENTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PACKAGE_VERSION_MUTATION = NOT_AUTHORIZED_BY_THIS_DOCUMENT
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED_BY_THIS_DOCUMENT
K2_K5_DONE_GATE_AUTHORITY_CHANGE = NOT_AUTHORIZED_BY_THIS_DOCUMENT
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## 17. Product-facing summary

The current safe interpretation is:

- Kodac defaults `ask` and `solve` to the deterministic fixture provider when no provider is specified.
- Kodac contains existing provider-capable implementations for exact `openai` and `openai-compatible` provider names.
- Unknown provider names fail closed.
- Final non-eligible provider-generation failure propagates rather than being silently converted to fixture success.
- Existing provider implementations may perform bounded same-provider attempts; that is not cross-provider fallback.
- `ask --static-fallback` has one canonical human-output-only credential fallback for the exact eligible `openai` and `openai-compatible` credential error mappings.
- That bounded fallback emits CLI-owned static text and an existing `session.completed` terminal; it is neither model output nor fixture-provider substitution.
- A general deterministic/static fallback, automatic cross-provider fallback, fixture substitution, machine-readable fallback, `solve` fallback, and `apply-patch` fallback remain unestablished.
- Provider-capable code does not itself grant network, credential, spend, or model-invocation authority.
- Privacy/egress claims remain evidence-scoped and fail closed.

This contract is documentation of current canonical behavior only.
