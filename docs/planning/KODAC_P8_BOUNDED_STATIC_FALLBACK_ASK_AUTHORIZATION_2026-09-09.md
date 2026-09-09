# Kodac P8 Bounded Static Ask Fallback Authorization — 2026-09-09

## Classification

```text
CLASS = AUTHORIZATION / BOUNDED_RUNTIME_IMPLEMENTATION
STATUS = AUTHORIZATION_CANDIDATE / NOT_CANONICAL
CANONICAL_BASE_MAIN = 8fc8469a6932770b9032d1220f0c696e165091a3
PREDECESSOR = PR #529 / POST_PROVIDER_AVAILABILITY_FALLBACK_CURRENT_VIEW_RECONCILIATION / CLOSED_CANONICAL
PREDECESSOR_POST_MERGE_PROOF = 5607170820
SUCCESSOR_ANALYSIS = PR #529 / comment 5607387992 / ANALYSIS_ONLY
FOUNDER_CONTINUATION_AUTHORITY = EXPLICIT_KODAC_CONTINUATION_WITH_ORDINARY_AUTHORIZED_APPROVALS_2026-09-09
P8_NUMBERED_SUCCESSOR_AUTHORITY = NOT_USED
WAIVER = NO
```

This record is a one-path authorization candidate. While this record is unmerged or post-merge-unproven, it creates no runtime, source, test, CLI, provider, network, credential, persistence, release, publication, deployment, or project-completion authority.

Only after this exact authorization candidate independently qualifies, merges normally through protected `main` with an exact expected-head guard, and receives mandatory external post-merge proof may the bounded two-path implementation candidate defined below become eligible.

The descriptive P8 label does not create numbered `P8-R5+` authority. Authority comes only from this exact record after canonical closure.

---

## Exact authorization-candidate path

This authorization PR may add exactly one path and no second path:

```text
docs/planning/KODAC_P8_BOUNDED_STATIC_FALLBACK_ASK_AUTHORIZATION_2026-09-09.md
```

No source, test, roadmap/current-view, product contract, schema, package, bin, workflow, dependency, lockfile, provider, model, evidence, release, historical authorization, or ruleset path may change in this authorization candidate.

---

## Why this is the minimum non-duplicative successor

Canonical P8 planning still names:

```text
deterministic/static fallback when models/providers are unavailable
```

as a product-hardening concern.

Canonical provider documentation and source currently prove:

```text
DEFAULT_PROVIDER_WITHOUT_OVERRIDE = fixture
DEFAULT_FIXTURE_SELECTION != FALLBACK
UNKNOWN_PROVIDER = FAIL_CLOSED
OPENAI_MISSING_CREDENTIAL_CODE = credential_missing
OPENAI_COMPATIBLE_MISSING_CREDENTIAL_CODE = credentials_missing
FINAL_PROVIDER_GENERATION_FAILURE = PROPAGATED
AUTOMATIC_PROVIDER_FAILURE_TO_FIXTURE_FALLBACK = NOT_IMPLEMENTED
GENERAL_DETERMINISTIC_STATIC_FALLBACK = NOT_ESTABLISHED
```

Fresh successor analysis therefore selected a deliberately narrow first implementation slice: an explicit caller opt-in static fallback for human-output `kodac ask` when an existing built-in remote provider is locally unavailable specifically because a required credential is absent.

This unit does not authorize general cross-provider fallback, automatic fixture substitution, fallback after network/HTTP/stream failure, machine-result-envelope expansion, or any `solve` behavior change.

---

## Exact future implementation allowlist

Only after this authorization becomes `CLOSED_CANONICAL` and externally post-merge proven may one later implementation candidate modify exactly:

```text
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/test/p8-bounded-static-fallback-ask.test.ts
```

No third path is authorized.

The implementation must not modify:

```text
packages/kodac-runtime/src/model/provider.ts
packages/kodac-runtime/src/model/turn.ts
packages/kodac-runtime/src/model/fixture.ts
packages/kodac-runtime/src/model/openai.ts
packages/kodac-runtime/src/model/openai-compatible.ts
packages/kodac-runtime/src/agent/loop.ts
packages/kodac-runtime/src/protocol/event.ts
packages/kodac-runtime/src/product/p8-cli-result-envelope.ts
packages/kodac-runtime/bin/kodac.mjs
packages/kodac-runtime/package.json
schema/**
README.md
.github/**
package.json
package-lock.json
pnpm-lock.yaml
uv.lock
```

or any K2/K3/KRI/K4/K5/K6/P2-P7 source, test, schema, authorization, evidence, workflow, provider configuration, persistence/telemetry/learning surface, release configuration, roadmap/current-view path, ruleset, or repository-protection path.

No new dependency is authorized.

---

## Required future CLI surface

The future implementation may add exactly one new `ask` option:

```text
kodac ask <prompt> ... --static-fallback
```

The exact option spelling is:

```text
--static-fallback
```

No alias is authorized.

The option is valid only for human-output `ask`.

```text
apply-patch --static-fallback = USAGE_ERROR / EXIT_1
solve --static-fallback = USAGE_ERROR / EXIT_1
ask --static-fallback --json = USAGE_ERROR / EXIT_1
--static-fallback WITHOUT ask = USAGE_ERROR / EXIT_1
```

The `--static-fallback` and `--json` options are intentionally incompatible in this bounded unit. Machine-readable fallback semantics require a later separate authorization because canonical `kodac.cli-result` version 1 currently fixes the `ask` payload contract and this unit does not authorize mutation of that contract.

All behavior when `--static-fallback` is absent must remain unchanged.

---

## Eligible fallback condition

Fallback may activate only when all of the following are true:

```text
COMMAND = ask
JSON = false
CALLER_OPT_IN = --static-fallback
REQUESTED_PROVIDER IN {openai, openai-compatible}
ERROR_TYPE = ModelProviderError
ERROR_CODE IN {credential_missing, credentials_missing}
```

The mapping must remain exact:

```text
openai -> credential_missing
openai-compatible -> credentials_missing
```

A mismatched provider/error-code pair must not activate fallback.

The implementation may classify only these already-established missing-required-credential conditions as eligible.

The following remain explicitly ineligible and fail closed:

```text
UNKNOWN_PROVIDER
INVALID_PROVIDER_BASE_URL
INVALID_PROVIDER_CONFIGURATION
INVALID_MODEL
HTTP_ERROR
NETWORK_ERROR
RATE_LIMIT_OR_REMOTE_RETRY_EXHAUSTION
STREAM_FAILURE
MALFORMED_PROVIDER_RESPONSE
ABORT
TOOL_FAILURE
GUARD_FAILURE
GENERIC_ERROR
ANY_OTHER_MODEL_PROVIDER_ERROR_CODE
```

No broad `retryable`, HTTP-status, message-text, substring, exception-name-only, or catch-all classifier is authorized.

---

## Required fallback result

The fallback is a deterministic local static human-output result. It is not another provider and is not a model response.

Required exact fallback text:

```text
Kodac static fallback: requested model provider is unavailable because required credentials are not configured.
```

Required semantics:

```text
EXIT_CODE = 0
STDERR = EMPTY
STDOUT_LINE_1 = EXACT_STATIC_FALLBACK_TEXT
STDOUT_RETAINS_EXISTING_EVIDENCE_PATH_PRESENTATION = YES
PROMPT_CONTENT_IN_STATIC_TEXT = NO
REQUESTED_PROVIDER_NAME_IN_STATIC_TEXT = NO
REQUESTED_MODEL_NAME_IN_STATIC_TEXT = NO
SECOND_PROVIDER_SELECTION = NO
FIXTURE_PROVIDER_SUBSTITUTION = NO
MODEL_PROVIDER_RETRY_ADDED = NO
NETWORK_ATTEMPT_ADDED_BY_FALLBACK = NO
CREDENTIAL_VALUE_READ_BY_FALLBACK = NO
WORKSPACE_MUTATION_ADDED_BY_FALLBACK = NO
K2_SIDE_EFFECT_AUTHORITY_CHANGE = NO
```

The fallback may occur only after the existing ask session exists because the canonical CLI already creates the session before model execution. It must use existing evidence/session primitives only; no event protocol type or evidence schema change is authorized.

If the underlying provider path emitted an existing `model.failed` event before surfacing the eligible missing-credential error, that historical event must remain preserved. The fallback must not delete, relabel, rewrite, or conceal it.

The successful fallback terminal may use the existing `session.completed` event with a bounded mode/value that clearly distinguishes static fallback from a provider-generated model turn. No new event type is authorized.

The implementation must not claim that a model answered, that fixture generated the result, that the request was proven, or that Kodac is globally offline.

---

## Machine-readable result boundary

Canonical `packages/kodac-runtime/src/product/p8-cli-result-envelope.ts` currently defines the `ask` payload as exactly:

```text
provider
model
assistant
```

and validates an exact bounded object contract.

This unit therefore preserves the entire machine-readable contract unchanged:

```text
P8_CLI_RESULT_PROTOCOL = kodac.cli-result / UNCHANGED
P8_CLI_RESULT_VERSION = 1 / UNCHANGED
P8_ASK_PAYLOAD_FIELDS = provider | model | assistant / UNCHANGED
P8_RESULT_ENVELOPE_VALIDATOR = UNCHANGED
ask --json WITHOUT --static-fallback = UNCHANGED
ask --json --static-fallback = USAGE_ERROR / EXIT_1 / NO_RESULT_ENVELOPE
```

No fallback discriminator, new status, new provider identity, new model identity, protocol-version change, payload extension, or top-level envelope mutation is authorized.

This boundary is intentional. A later machine-readable static-fallback surface, if desired, requires fresh evidence-driven successor analysis and its own exact authorization.

---

## Existing behavior that must remain unchanged

```text
ask WITHOUT --static-fallback = UNCHANGED
ask --json WITHOUT --static-fallback = UNCHANGED
solve = UNCHANGED
apply-patch = UNCHANGED
kodac --help EXIT/STDOUT/STDERR = UNCHANGED EXCEPT DOCUMENTING THE NEW ask OPTION AND ITS HUMAN-OUTPUT-ONLY BOUNDARY
NO_ARGS EXIT_1 = UNCHANGED
UNKNOWN_COMMAND EXIT_1 = UNCHANGED
UNKNOWN_PROVIDER FAILURE = UNCHANGED
INVALID_PROVIDER_CONFIGURATION FAILURE = UNCHANGED
REMOTE_PROVIDER_FAILURE PROPAGATION = UNCHANGED
SAME_PROVIDER_BOUNDED_RETRY = UNCHANGED
AGENT_LOOP_FAILURE_BUDGET = UNCHANGED
P8_R1_RESULT_ENVELOPE_PROTOCOL_VERSION = UNCHANGED
DONE_GATE = UNCHANGED
K2 = UNCHANGED
```

The static fallback must not make any provider/model/network/retry behavior more permissive except the exact local human-output terminal handling of the two admitted missing-credential error pairs after explicit caller opt-in.

---

## Required future implementation tests

The new test file must prove at least:

1. human-output `ask --static-fallback` with an injected `openai` provider that throws `ModelProviderError("credential_missing", ...)` returns exit `0` and exact deterministic static text.
2. `openai-compatible` plus exact `credentials_missing` is eligible.
3. `openai` plus `credentials_missing` is ineligible.
4. `openai-compatible` plus `credential_missing` is ineligible.
5. an unknown provider remains exit `1` and does not fall back.
6. a generic error remains exit `1` and does not fall back.
7. a non-credential `ModelProviderError` remains exit `1` and does not fall back regardless of `retryable` metadata.
8. HTTP/network/stream/abort-shaped provider failures remain fail-closed.
9. without `--static-fallback`, the exact eligible missing-credential failure retains existing exit `1` behavior.
10. `ask --static-fallback --json` is rejected with exit `1` before any fallback result envelope is emitted.
11. existing `ask --json` without `--static-fallback` remains byte-shape compatible with the canonical P8 ask envelope contract.
12. `solve --static-fallback` is rejected without changing solve execution.
13. `apply-patch --static-fallback` is rejected.
14. fallback static output does not contain prompt content, credential material, provider/model identifiers, or claims of model generation.
15. no fixture provider is invoked as fallback.
16. fallback evidence preserves any existing `model.failed` event and terminates via existing session machinery without adding a new event type.
17. `packages/kodac-runtime/src/product/p8-cli-result-envelope.ts` remains byte-identical to canonical base.
18. existing P8 help, result-envelope, ask, solve, runtime-spine, provider, agent-loop, governance, and K2 tests remain green on the exact implementation head.

Tests must use injected/local deterministic providers only. Qualification must not invoke a real provider/model, read a real credential, perform external network access, or incur provider spend.

---

## Explicit non-grants

```text
GENERAL_AUTOMATIC_PROVIDER_FALLBACK = NOT_AUTHORIZED
CROSS_PROVIDER_FALLBACK = NOT_AUTHORIZED
FALLBACK_TO_FIXTURE = NOT_AUTHORIZED
MACHINE_READABLE_FALLBACK_RESULT = NOT_AUTHORIZED
P8_RESULT_ENVELOPE_MUTATION = NOT_AUTHORIZED
SOLVE_FALLBACK = NOT_AUTHORIZED
APPLY_PATCH_FALLBACK = NOT_AUTHORIZED
UNKNOWN_PROVIDER_FALLBACK = NOT_AUTHORIZED
INVALID_CONFIGURATION_FALLBACK = NOT_AUTHORIZED
HTTP_NETWORK_STREAM_ABORT_FALLBACK = NOT_AUTHORIZED
NEW_PROVIDER_MODEL_ADMISSION = NOT_AUTHORIZED
LIVE_PROVIDER_MODEL_INVOCATION_FOR_QUALIFICATION = NOT_AUTHORIZED
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

Installation/update integrity, operational docs/examples, release/version separation, public release/publication/deployment, any broader fallback concern, and project completion remain separate future evidence-driven decisions.

---

## Qualification requirements for this authorization candidate

Before guarded merge, one unchanged exact candidate head must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
AUTHORIZATION_BLOB = FROZEN
PREDECESSOR_POST_MERGE_PROOF_BOUND = PASS
SUCCESSOR_ANALYSIS_BOUND = PASS
FOUNDER_CONTINUATION_AUTHORITY_BOUND = PASS
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_PRIVACY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE
RULESET_BYPASS_ACTORS = []
CURRENT_USER_CAN_BYPASS = never
EXPECTED_HEAD_GUARDED_NORMAL_MERGE = REQUIRED
POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

If `main`, candidate head, changed-path set, blob, review state, required checks, or ruleset moves, qualification must be reacquired from the new live state.

A billing-only, skipped, rate-limited, status-only, failed-to-start, or non-substantive review does not satisfy the substantive review requirement.

Any later material finding invalidates an earlier qualification disposition even if the candidate SHA does not move.

---

## Closure semantics

This authorization candidate cannot certify its own closure.

Only complete external post-merge proof may classify:

```text
P8_BOUNDED_STATIC_FALLBACK_ASK_AUTHORIZATION = CLOSED_CANONICAL
```

Even after canonical closure, the only new eligibility created is one exact two-path implementation candidate:

```text
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/test/p8-bounded-static-fallback-ask.test.ts
```

That future implementation must independently qualify, receive substantive exact-head review, normal-merge with the exact expected-head guard, and receive mandatory external post-merge proof before the bounded behavior can become closed canonical.

No broader fallback, machine-readable fallback, installation/update, release, publication, deployment, numbered P8 successor, P9, or project-completion authority follows by implication.
