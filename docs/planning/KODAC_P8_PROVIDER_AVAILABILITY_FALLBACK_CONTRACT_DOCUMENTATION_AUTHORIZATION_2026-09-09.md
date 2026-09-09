# Kodac P8 Provider Availability / Fallback Contract Documentation Authorization — 2026-09-09

## Classification

```text
CLASS = AUTHORIZATION / DOCUMENTATION_ONLY
STATUS = AUTHORIZATION_CANDIDATE / NOT_CANONICAL
CANONICAL_BASE_MAIN = cd072f489a6b1d89330e85f5a85772cb8c0d8a8b
PREDECESSOR = PR #525 / POST_PRIVACY_EGRESS_CURRENT_VIEW_RECONCILIATION / CLOSED_CANONICAL
PREDECESSOR_POST_MERGE_PROOF = 5606374984
SUCCESSOR_ANALYSIS = PR #525 / comment 5606410312 / ANALYSIS_ONLY
FOUNDER_CONTINUATION_AUTHORITY = EXPLICIT_KODAC_CONTINUATION_WITH_ORDINARY_AUTHORIZED_APPROVALS_2026-09-09
WAIVER = NO
```

This record is a one-path documentation-only authorization candidate. It does not itself create provider/fallback product behavior, modify runtime code, invoke a provider or model, access credentials, create network authority, add retry/replay/resume semantics, mutate persistence, or grant release/publication/deployment/project-completion authority.

Only after this exact authorization candidate independently qualifies, merges normally through protected `main` with an exact expected-head guard, and receives mandatory external post-merge proof may the single future documentation path named below become eligible.

## Exact authorization-candidate path

This PR may add exactly one path and no second path:

```text
docs/planning/KODAC_P8_PROVIDER_AVAILABILITY_FALLBACK_CONTRACT_DOCUMENTATION_AUTHORIZATION_2026-09-09.md
```

No roadmap/current-view, source, test, schema, package, bin, workflow, dependency, lockfile, provider, model, evidence, release, or historical authorization file may change in this authorization candidate.

## Conditionally authorized future documentation path

Only after this authorization becomes `CLOSED_CANONICAL` may one later documentation candidate create exactly:

```text
docs/product/PROVIDER_AVAILABILITY_FALLBACK_CONTRACT.md
```

No second future path is authorized by this record.

## Purpose of the future contract

The future document may consolidate already-proven provider selection, availability, deterministic fixture, fail-closed, and fallback facts into a product-facing interpretation contract.

It must describe current repository behavior exactly and must not transform planning intent into runtime guarantees.

The future contract must preserve these non-equivalences:

```text
DEFAULT_FIXTURE_PROVIDER != AUTOMATIC_FALLBACK_FROM_ANY_PROVIDER_FAILURE
FIXTURE_DETERMINISM != GLOBAL_OFFLINE_PRODUCT_GUARANTEE
PROVIDER_ABSTRACTION_EXISTENCE != PROVIDER_INVOCATION_AUTHORITY
BUILT_IN_PROVIDER_IMPLEMENTATION != CREDENTIAL_OR_NETWORK_AUTHORITY
PROVIDER_RETRYABLE_METADATA != RETRY_REPLAY_RESUME_AUTHORITY
UNKNOWN_PROVIDER_FAILURE != FALLBACK_TO_FIXTURE
PROVIDER_GENERATION_FAILURE != FALLBACK_TO_FIXTURE
DOCUMENTATION != RUNTIME_ENFORCEMENT
PLANNED_STATIC_FALLBACK != IMPLEMENTED_STATIC_FALLBACK
```

Unknown or unproven provider/fallback behavior must be documented as unknown or unproven rather than inferred.

## Canonical facts the future document may bind

The future documentation candidate may bind only facts supported by current canonical repository evidence, including:

1. CLI `ask` and `solve` default `provider` to exactly `fixture` when the caller does not specify another provider.
2. The default model identity is exactly `fixture/deterministic-v1` unless the caller supplies another model value.
3. The runtime registers an explicitly supplied `CliRuntimeOptions.modelProvider` instead of the fixture provider; otherwise it registers `FixtureModelProvider`.
4. `AgentTurnRunner` resolves an already-registered provider first.
5. `AgentTurnRunner` may construct the existing `openai` and `openai-compatible` provider implementations when those exact provider names are requested.
6. Unknown provider names fail through `ProviderRegistry.get(...)` with `Unknown provider: <name>`.
7. A provider generation failure is recorded as `model.failed` and rethrown; the canonical code does not prove automatic replacement with the fixture provider after that failure.
8. `ModelProviderError.retryable` is metadata about a provider error; it does not itself authorize or prove retries.
9. Existing privacy/egress truth remains controlling: the deterministic fixture default does not prove all provider-capable paths are offline, and no global all-commands offline guarantee is established.
10. Existing provider-capable implementations must not be described as newly authorized merely because this documentation names them.

Any stronger statement requires separate canonical runtime evidence and authority.

## Required future contract sections

The future documentation candidate must include at least:

- scope and interpretation-only status;
- exact default provider/model behavior;
- registered-provider resolution behavior;
- exact known special provider names supported by current canonical code;
- unknown-provider fail-closed behavior;
- provider-generation failure behavior;
- explicit statement that no automatic provider-failure-to-fixture fallback is currently proven;
- distinction between fixture determinism and offline/network guarantees;
- distinction between retryable error metadata and retry authority;
- relationship to `docs/product/PRIVACY_EGRESS_CONTRACT.md`;
- explicit unknown/unproven behavior handling;
- preserved non-grants.

The future document must cite canonical file paths and repository evidence sufficiently for later exact-head review, but must not claim that documentation creates runtime enforcement.

## Explicit non-grants

```text
SOURCE_RUNTIME_MUTATION = NOT_AUTHORIZED
TEST_SCHEMA_PACKAGE_BIN_MUTATION = NOT_AUTHORIZED
WORKFLOW_DEPENDENCY_LOCKFILE_MUTATION = NOT_AUTHORIZED
CLI_BEHAVIOR_CHANGE = NOT_AUTHORIZED
PROVIDER_SELECTION_BEHAVIOR_CHANGE = NOT_AUTHORIZED
AUTOMATIC_PROVIDER_FALLBACK_IMPLEMENTATION = NOT_AUTHORIZED
DETERMINISTIC_STATIC_FALLBACK_IMPLEMENTATION = NOT_AUTHORIZED
NEW_PROVIDER_MODEL_ADMISSION = NOT_AUTHORIZED
PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED
PROVIDER_RETRY_REPLAY_RESUME = NOT_AUTHORIZED
PROVIDER_SPEND = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
SECRET_CREDENTIAL_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_MUTATION = NOT_AUTHORIZED
TELEMETRY_UPLOAD_ANALYTICS_LEARNING = NOT_AUTHORIZED
GITHUB_ACTION_WORKFLOW_API_INTEGRATION = NOT_AUTHORIZED
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED
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

No wording in this authorization or the future contract may transfer authority from a roadmap, provider implementation, runtime capability, reviewer output, observed behavior, founder ordinary approval, or planning sequence into provider execution or product behavior authority.

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

If `main`, the candidate head, changed-path set, review state, required checks, or ruleset changes, qualification must be reacquired from the new live state.

A billing-only, skipped, rate-limited, status-only, failed-to-start, or non-substantive review does not satisfy the substantive review requirement.

Any later material review finding invalidates an earlier qualification disposition even when the candidate SHA did not move.

## Closure semantics

This candidate cannot certify its own closure. Only complete external post-merge proof may classify:

```text
P8_PROVIDER_AVAILABILITY_FALLBACK_CONTRACT_DOCUMENTATION_AUTHORIZATION = CLOSED_CANONICAL
```

Even after canonical closure, the only new eligibility created is the single documentation path:

```text
docs/product/PROVIDER_AVAILABILITY_FALLBACK_CONTRACT.md
```

No runtime fallback implementation, provider/model invocation, network/credential authority, installation/update work, operational-doc expansion, release/version change, public publication/deployment, numbered P8 successor, P9 authority, or project-completion claim follows by implication.
