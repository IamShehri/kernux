# Kodac O1 Authenticated GitHub Event Evidence Authorization — 2026-09-10

## Classification

```text
CLASS = AUTHORIZATION / DOCUMENTATION_ONLY
STATUS = AUTHORIZATION_CANDIDATE / NOT_CANONICAL
CANONICAL_BASE_MAIN = 22c96748cfe362ad1ee40050232a824c9af3f76a
PREDECESSOR_AUDIT = PR #572 / CLOSED_CANONICAL / proof 5622021535
SUCCESSOR_ANALYSIS = PR #572 / comment 5622051091 / ANALYSIS_ONLY
MINIMUM_BLOCKER = AUTHENTICATED_REPLAY_SAFE_EVENT_INGESTION
FOUNDER_CONTINUATION_AUTHORITY = EXPLICIT_KODAC_CONTINUATION_WITH_ORDINARY_AUTHORIZED_APPROVALS_2026-09-10
WAIVER = NO
```

This candidate authorizes only one bounded O1 implementation after this authorization itself independently qualifies, normally merges through protected `main` with an exact expected-head precondition, and receives complete external post-merge proof.

It does not itself implement event ingress and does not authorize a webhook listener, GitHub App, webhook registration, network endpoint, GitHub API access, secret-store access, durable replay persistence, workflow orchestration, review publication, repository mutation, release, or project completion.

## Why this is the minimum next unit

The externally proven project-wide completion gap audit classifies `AUTHENTICATED_REPLAY_SAFE_EVENT_INGESTION` as the sole `MISSING` program criterion and identifies O1 authenticated GitHub event evidence as the first dependency-ordered successor candidate.

Fresh repository-wide non-document inspection after audit closure found no purpose-equivalent implementation for GitHub HMAC webhook verification, delivery replay/dedupe, actor eligibility binding, fork classification, and exact subject/head binding as one authenticated event contract.

`packages/kodac-runtime/src/protocol/event.ts` is internal event emission only. It is not an authenticated external-ingress boundary and must not be widened implicitly by this unit.

The smallest safe first O1 slice is therefore a provider-neutral, pure/data-first GitHub pull-request event evidence contract that authenticates exact caller-supplied webhook bytes and derives bounded evidence without owning transport, persistence, or side effects.

## Exact future implementation allowlist

Only after this authorization becomes externally proven `CLOSED_CANONICAL` may one later implementation candidate change exactly:

```text
packages/kodac-runtime/src/event-ingress/o1-authenticated-github-event-evidence.ts
packages/kodac-runtime/test/o1-authenticated-github-event-evidence.test.ts
schema/o1-authenticated-github-event-evidence.schema.json
```

No fourth path is authorized.

In particular, the first implementation may not modify:

```text
packages/kodac-runtime/src/index.ts
packages/kodac-runtime/src/protocol/event.ts
packages/kodac-runtime/src/runtime/orchestrator.ts
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/package.json
pnpm-lock.yaml
package-lock.json
.github/workflows/**
docs/roadmap/**
docs/product/**
provenance/**
```

The implementation must remain independently importable by exact path. Package-root export or product wiring requires separate later authority.

## Authorized cryptographic boundary

The future source may use the existing Node standard library only, including `node:crypto` and `node:util`, to verify GitHub webhook signatures.

The bounded cryptographic contract is:

```text
SIGNATURE_SCHEME = HMAC-SHA256
SIGNATURE_HEADER_FORMAT = sha256=<64 lowercase hex>
SIGNED_MESSAGE = EXACT RAW HTTP REQUEST BODY BYTES
COMPARISON = CONSTANT_TIME_AFTER_LENGTH_AND_FORMAT_VALIDATION
```

The implementation may accept caller-supplied in-memory secret bytes as an argument solely for HMAC verification.

```text
CALLER_SUPPLIED_IN_MEMORY_SECRET_BYTES = AUTHORIZED_FOR_CRYPTOGRAPHIC_VERIFICATION_ONLY
ENVIRONMENT_SECRET_READ = NOT_AUTHORIZED
FILESYSTEM_SECRET_READ = NOT_AUTHORIZED
SECRET_MANAGER_ACCESS = NOT_AUTHORIZED
GITHUB_API_SECRET_ACCESS = NOT_AUTHORIZED
NETWORK_KEY_LOOKUP = NOT_AUTHORIZED
SECRET_SERIALIZATION = FORBIDDEN
SECRET_RETURN = FORBIDDEN
SECRET_PERSISTENCE = FORBIDDEN
```

A caller-supplied non-secret `keyIdentity` may be bound into evidence as an opaque audit identifier. That identifier is not proof of secret provenance and must not be treated as secret-store attestation.

## Exact first-slice event scope

The first implementation is bounded to GitHub `pull_request` webhook evidence only.

Supported event input must bind:

```text
EVENT_SOURCE = GITHUB
EVENT_NAME = pull_request
ACTION = CLOSED_ALLOWLIST
DELIVERY_ID = STRICT_BOUNDED_IDENTIFIER
RAW_BODY = EXACT_SIGNED_BYTES
SIGNATURE_HEADER = EXACT HMAC-SHA256 HEADER
KEY_IDENTITY = CALLER_SUPPLIED_NON_SECRET_IDENTITY
EXPECTED_REPOSITORY_IDENTITY = CALLER_INPUT
EXPECTED_HEAD_SHA = CALLER_INPUT
ACTOR_ELIGIBILITY_INPUT = CALLER_MATERIALIZED_POLICY_DECISION
PREVIOUS_DELIVERY_IDENTITIES = CALLER_MATERIALIZED_BOUNDED_SET
```

The supported action allowlist must be closed in source and schema. It must include only actions required for read-only review triggering in the first slice, such as:

```text
opened
reopened
synchronize
ready_for_review
```

Any unsupported action fails closed.

No issue, push, workflow, check-suite, review, comment, reaction, release, deployment, or repository webhook event is admitted by implication.

## Strict signed-payload parsing

Positive evidence must derive repository, pull-request, actor, fork, action, and observed-head facts from the exact raw bytes whose HMAC was verified.

Caller-selected structured metadata must not substitute for parsing the signed body.

The parser must be bounded and fail closed on at least:

```text
INVALID_UTF8
INVALID_JSON
DUPLICATE_JSON_OBJECT_KEYS
EXCESSIVE_BODY_BYTES
EXCESSIVE_JSON_DEPTH
EXCESSIVE_OBJECT_OR_ARRAY_MEMBERS
MISSING_REQUIRED_FIELDS
UNKNOWN_REQUIRED_OBJECT_SHAPE
UNSAFE_OR_AMBIGUOUS_NUMERIC_IDENTITY
INVALID_GIT_SHA
INVALID_REPOSITORY_IDENTITY
INVALID_PULL_REQUEST_IDENTITY
INVALID_ACTOR_IDENTITY
```

The implementation must not use JavaScript object merge behavior that could convert signed JSON keys such as `__proto__`, `constructor`, or `prototype` into authority. Hostile input must remain inert data and fail closed where ambiguity exists.

## Required authenticated event facts

A positive immutable evidence record must bind at least:

```text
VERSION
EVENT_SOURCE
SIGNATURE_ALGORITHM
KEY_IDENTITY
DELIVERY_ID
DELIVERY_IDENTITY
PAYLOAD_SHA256
EVENT_NAME
ACTION
REPOSITORY_ID
REPOSITORY_FULL_NAME
PULL_REQUEST_NUMBER
PULL_REQUEST_NODE_ID_OR_STABLE_ID
BASE_REPOSITORY_ID
HEAD_REPOSITORY_ID
FORK_CLASSIFICATION
OBSERVED_HEAD_SHA
EXPECTED_HEAD_SHA
HEAD_MATCH
ACTOR_ID
ACTOR_LOGIN
ACTOR_TYPE
ACTOR_ELIGIBILITY_POLICY_IDENTITY
ACTOR_ELIGIBILITY_DECISION
REPLAY_DECISION
AUTHENTICATION_DECISION
INGRESS_DECISION
EVENT_EVIDENCE_IDENTITY
```

Exact serialized field names may differ if semantic equivalence is demonstrated by source, schema, and tests, but no identity-bearing family above may be omitted.

## Repository and pull-request identity rules

The signed payload must independently establish one repository and one pull-request subject.

At minimum:

```text
repository.id = bounded positive safe integer or canonical decimal string
repository.full_name = bounded owner/name text
pull_request.number = bounded positive safe integer
pull_request.base.repo.id = repository.id
pull_request.head.repo.id = bounded positive identity
pull_request.head.sha = lowercase 40-hex
sender.id = bounded positive identity
sender.login = bounded GitHub login text
sender.type = bounded closed vocabulary needed by the first slice
```

The caller-provided expected repository identity and expected head SHA must match the signed payload for positive admission.

A moved head, repository mismatch, missing head repository, malformed fork metadata, or ambiguous pull-request identity fails closed.

## Fork classification

Fork status must be derived from signed payload repository identities, not from an untrusted caller boolean.

At minimum:

```text
HEAD_REPOSITORY_ID == BASE_REPOSITORY_ID -> SAME_REPOSITORY
HEAD_REPOSITORY_ID != BASE_REPOSITORY_ID -> FORK_REPOSITORY
```

The evidence must preserve the classification. Fork classification alone does not authorize or deny secret exposure outside this pure first slice; later transport/product policy must consume it explicitly.

## Actor eligibility boundary

The first slice does not invent a global actor authorization policy.

It may accept one strict caller-materialized eligibility input bound to the exact signed actor identity:

```text
POLICY_IDENTITY
ACTOR_ID
ACTOR_LOGIN
DECISION = ELIGIBLE | INELIGIBLE | UNKNOWN
EVIDENCE_REFS = BOUNDED_OPTIONAL_SET
```

Positive ingress evidence requires exact actor identity match and `DECISION = ELIGIBLE`.

`INELIGIBLE`, `UNKNOWN`, identity mismatch, malformed policy input, or missing policy identity fails closed.

This is evidence consumption, not actor-policy execution or GitHub permission discovery.

## Replay and duplicate boundary

The first slice remains pure and does not own durable state.

It may accept a bounded caller-materialized set of previously observed delivery identities. The implementation must derive the current delivery identity deterministically from the bounded delivery identifier and authenticated event context, then reject an exact duplicate.

```text
CURRENT_DELIVERY_IDENTITY IN PREVIOUS_DELIVERY_IDENTITIES -> REPLAY / BLOCK
OTHERWISE -> UNSEEN / CONTINUE
```

The output must bind the replay decision.

This is not persistence-backed replay protection. It proves only deterministic duplicate rejection against the exact caller-materialized prior set supplied to the function. Durable dedupe storage, atomic claim/lease semantics, cross-process concurrency, TTL/retention, and crash recovery remain separate O1/O2 authorities.

## Positive decision rule

A positive `ACCEPT` result is permitted only when all gates hold simultaneously:

```text
SIGNATURE_VALID
SIGNED_PAYLOAD_VALID
EVENT_NAME_SUPPORTED
ACTION_SUPPORTED
EXPECTED_REPOSITORY_MATCH
EXPECTED_HEAD_MATCH
ACTOR_IDENTITY_MATCH
ACTOR_ELIGIBLE
DELIVERY_UNSEEN
RESOURCE_BOUNDS_SATISFIED
```

Every unknown, malformed, unsupported, mismatched, duplicate, or unauthenticated state fails closed.

The implementation may choose either to throw a typed fail-closed error or to return an immutable negative evidence record, but source, schema, and tests must make the choice unambiguous. It must never return positive authenticated-event evidence for a failed gate.

## Determinism and identity

All positive serialized evidence must be deterministic for the same admitted semantic inputs except that no secret bytes may appear in the serialization or identity preimage.

`EVENT_EVIDENCE_IDENTITY` must be a domain-separated SHA-256 digest over every authority-relevant serialized field.

Changing any admitted identity-bearing field must change the evidence identity or fail validation.

The validator must independently rederive every derived field and the final identity from source input/evidence. It must not trust caller-supplied derived decisions.

Accepted output must be detached/frozen or otherwise immutable under the repository's established runtime conventions.

## Required hostile tests

The focused test path must cover at least:

```text
VALID_SAME_REPOSITORY_PR
VALID_FORK_PR
INVALID_SIGNATURE
MISSING_SIGNATURE
MALFORMED_SIGNATURE
WRONG_SECRET
RAW_BODY_BYTE_CHANGE
INVALID_UTF8
INVALID_JSON
DUPLICATE_JSON_KEY
OVERSIZED_BODY
EXCESSIVE_JSON_DEPTH
UNSUPPORTED_EVENT_NAME
UNSUPPORTED_ACTION
REPOSITORY_MISMATCH
MOVED_HEAD
MISSING_HEAD_REPOSITORY
MALFORMED_GIT_SHA
ACTOR_IDENTITY_MISMATCH
ACTOR_INELIGIBLE
ACTOR_UNKNOWN
DUPLICATE_DELIVERY
DELIVERY_ORDER_INVARIANCE
DERIVED_FIELD_FORGERY
EVIDENCE_IDENTITY_FORGERY
PROXY_INPUT
ACCESSOR_INPUT
SYMBOL_PROPERTY_INPUT
NON_ENUMERABLE_PROPERTY_INPUT
POST_VALIDATION_MUTATION
```

Where JavaScript-hostile object tests apply to structured caller inputs rather than raw bytes, they must fail closed before executing caller hooks.

The JSON Schema must reject structurally invalid serialized evidence and mirror the positive serialized evidence surface. Schema acceptance is not authentication and cannot replace the runtime validator.

## Resource bounds

Hard source constants must bound at least:

```text
RAW_BODY_BYTES
DELIVERY_ID_BYTES
REPOSITORY_FULL_NAME_BYTES
ACTOR_LOGIN_BYTES
POLICY_IDENTITY_BYTES
EVIDENCE_REFS_COUNT
PREVIOUS_DELIVERY_IDENTITIES_COUNT
JSON_DEPTH
JSON_MEMBER_COUNT
```

No caller may raise hard limits.

## Dependency and import boundary

The implementation may use existing repository contracts only where doing so does not widen them.

No new package dependency, provider SDK, GitHub SDK, webhook framework, server framework, database client, queue client, or secret-manager client is authorized.

The implementation must not import or invoke:

```text
node:child_process
node:fs
node:http
node:https
node:net
node:dgram
node:worker_threads
ExecutionGateway
K2 mutation surfaces
review publisher surfaces
provider/model execution surfaces
```

## Required implementation qualification

Before guarded merge, one unchanged exact implementation head must prove at minimum:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_3_AUTHORIZED_PATHS
ALL_3_INDEXED_BLOBS = FROZEN
AUTHORIZATION_POST_MERGE_PROOF_BOUND = PASS
FOCUSED_O1_TESTS = PASS
STRICT_TYPESCRIPT = PASS
FULL_RUNTIME_REGRESSION = PASS
PYTHON_REPOSITORY_TESTS = PASS
RUFF = PASS
PROVENANCE = PASS
SCHEMA_PARITY = PASS
HOSTILE_INPUT_TESTS = PASS
NO_NEW_DEPENDENCY = PASS
NO_SIDE_EFFECT_IMPORT = PASS
REQUIRED_CI = TERMINAL_SUCCESS
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_NORMAL_MERGE = REQUIRED
POST_MERGE_EXTERNAL_PROOF = REQUIRED
WAIVER = NO
```

Historical failed attempts, if any, must remain visible and cannot be relabeled PASS.

## Explicit non-grants

```text
WEBHOOK_HTTP_LISTENER = NOT_AUTHORIZED
PUBLIC_ENDPOINT = NOT_AUTHORIZED
GITHUB_APP_CREATION_INSTALLATION = NOT_AUTHORIZED
WEBHOOK_REGISTRATION_ACTIVATION = NOT_AUTHORIZED
GITHUB_API_READ_WRITE = NOT_AUTHORIZED
COMMENT_REVIEW_REACTION_PUBLICATION = NOT_AUTHORIZED
ENV_FILESYSTEM_SECRET_STORE_ACCESS = NOT_AUTHORIZED
DURABLE_REPLAY_DATABASE = NOT_AUTHORIZED
PERSISTENCE_QUEUE_CACHE_DATABASE = NOT_AUTHORIZED
WORKFLOW_RUNTIME = NOT_AUTHORIZED
RETRY_RESUME_LEASE_MIGRATION = NOT_AUTHORIZED
SKILL_LOADING_EXECUTION = NOT_AUTHORIZED
PROVIDER_MODEL_REVIEWER_EXECUTION = NOT_AUTHORIZED
SANDBOX_EXECUTION = NOT_AUTHORIZED
PATCH_AUTOFIX_K2_MUTATION = NOT_AUTHORIZED
CURRENT_VIEW_MUTATION = NOT_AUTHORIZED
PHASE_OVERALL_CLOSURE = NOT_AUTHORIZED
PROJECT_COMPLETION_CLAIM = NOT_AUTHORIZED
RELEASE_VERSION_TAG_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_OR_BYPASS = NOT_AUTHORIZED
REBASE = NOT_AUTHORIZED
FORCE_PUSH = NOT_AUTHORIZED
HISTORY_REWRITE = NOT_AUTHORIZED
WAIVER = NO
```

## Authorization closure gate

This authorization does not become effective merely because it exists in a branch or PR.

Before merge it requires one exact unchanged head with the one-path scope above, exact indexed blob identity, current canonical base, required docs/governance CI, substantive semantic/security/governance review, zero actionable findings/threads, active no-bypass ruleset state, and normal expected-head guarded merge.

After merge, external post-merge proof must bind the merge SHA, ordered parents, candidate tree, authorization blob, verified GitHub signature, applicable push checks, merged PR state, review-thread state, ruleset state, and release/tag state.

Only that external proof may establish:

```text
O1_AUTHENTICATED_GITHUB_EVENT_EVIDENCE_AUTHORIZATION = CLOSED_CANONICAL
```

Only then may the exact three-path implementation candidate become eligible. The implementation must independently qualify and cannot certify O1 overall, project completion, or any later O2+ authority.
