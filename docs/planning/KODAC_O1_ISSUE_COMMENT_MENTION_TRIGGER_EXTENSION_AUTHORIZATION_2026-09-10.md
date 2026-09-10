# Kodac O1 Issue-Comment Mention Trigger Extension Authorization

Date: 2026-09-10

## Status

```text
DOCUMENT_CLASS = IMPLEMENTATION_AUTHORIZATION_CANDIDATE
AUTHORIZATION_TARGET = O1_ISSUE_COMMENT_MENTION_TRIGGER_EXTENSION
CANONICAL_BASE = e9f77f41125ab95384bd1ab0f2a4a7daf88bb04b
POST_O3_SUCCESSOR_ANALYSIS_AMENDMENT = PR_580_COMMENT_5625247199 / ANALYSIS_ONLY
BLOCKED_O4_A_AUTHORIZATION = PR_581 / CLOSED_UNMERGED / FINDING_5625232204
O3_IMPLEMENTATION = PR_580 / CLOSED_CANONICAL / PROOF_5625068569
WAIVER = NO
PROJECT_COMPLETION = NO
```

This record authorizes only the bounded O1 issue-comment evidence extension defined below if and only if this authorization candidate itself becomes canonical through the normal qualification, substantive review, guarded merge, post-merge workflow, and external-proof process.

The record exists because canonical O1 currently admits only `pull_request` events and therefore cannot authenticate the mention-trigger event required by O4.

## 1. Exact implementation allowlist

After this authorization becomes canonical, one implementation pull request may change exactly these three paths:

```text
packages/kodac-runtime/src/event-ingress/o1-authenticated-github-event-evidence.ts
packages/kodac-runtime/test/o1-authenticated-github-event-evidence.test.ts
schema/o1-authenticated-github-issue-comment-evidence.schema.json
```

No fourth implementation path is authorized.

The existing schema file below is explicitly frozen and must not change:

```text
schema/o1-authenticated-github-event-evidence.schema.json
```

No package metadata, dependency, lockfile, workflow, provenance ledger, current-view document, roadmap document, release configuration, O2/O3 source, reviewer-intelligence source, K2 source, provider source, persistence source, or deployment source may change.

## 2. Compatibility invariant

The implementation must preserve the existing pull-request O1 surface exactly for identical legacy inputs.

```text
LEGACY_CREATE_FUNCTION = createO1AuthenticatedGithubEventEvidence
LEGACY_VALIDATE_FUNCTION = validateO1AuthenticatedGithubEventEvidence
LEGACY_VERSION = kodac-o1-authenticated-github-event-evidence-v1
LEGACY_EVENT = pull_request
LEGACY_ACTIONS = opened,reopened,synchronize,ready_for_review
LEGACY_OUTPUT_SHAPE = UNCHANGED
LEGACY_OUTPUT_IDENTITY = UNCHANGED_FOR_IDENTICAL_INPUT
LEGACY_SCHEMA_BYTES = UNCHANGED
```

The implementation must not widen the old positive evidence object with issue-comment-only fields.

The new branch must use separate exported interfaces/functions within the same source file so existing call sites and identities do not silently change.

## 3. New protocol

The new protocol version must be:

```text
kodac-o1-authenticated-github-issue-comment-evidence-v1
```

Recommended public exports:

```text
O1_AUTHENTICATED_GITHUB_ISSUE_COMMENT_EVIDENCE_VERSION
O1IssueCommentPullRequestBindingInput
O1AuthenticatedGithubIssueCommentInput
O1AuthenticatedGithubIssueCommentEvidence
createO1AuthenticatedGithubIssueCommentEvidence
validateO1AuthenticatedGithubIssueCommentEvidence
```

Equivalent names are acceptable only if they remain explicit, unambiguous, separately versioned, and do not alter the legacy exports.

## 4. Implementation class

```text
IMPLEMENTATION_CLASS = PURE_DATA_ONLY_AUTHENTICATED_EVENT_EVIDENCE_EXTENSION
NEW_DEPENDENCY = NO
WEBHOOK_LISTENER = NO
GITHUB_APP_REGISTRATION = NO
GITHUB_API_NETWORK_READ = NO
NETWORK_ACCESS = NO
SECRET_STORAGE = NO
PERSISTENCE = NO
ATOMIC_CROSS_PROCESS_DEDUPE = NO
PROVIDER_OR_MODEL_INVOCATION = NO
GITHUB_COMMENT_OR_REVIEW_WRITE = NO
K2_EXECUTION = NO
FILESYSTEM_OR_PROCESS_EXECUTION = NO
REPOSITORY_OR_BRANCH_MUTATION = NO
CURRENT_VIEW_MUTATION = NO
RELEASE_OR_DEPLOYMENT = NO
O1_OVERALL_COMPLETION = NO
O4_IMPLEMENTATION_AUTHORITY = NO
PROJECT_COMPLETION = NO
```

The extension may reuse the existing source file's strict JSON parser, raw-byte HMAC-SHA256 verification, deterministic hashing, Proxy-safe data validation, canonical serialization, and replay-identity helpers.

It must not copy in a second weaker parser/authenticator when the existing hardened primitives can be reused.

## 5. New input contract

The issue-comment input must bind at minimum:

```text
rawBody
signatureHeader
deliveryId
eventName = issue_comment
keyIdentity
secret
expectedRepositoryId
expectedRepositoryFullName
expectedHeadSha
actorEligibility
previousDeliveryIdentities
pullRequestBinding
```

The top-level input remains an exact-key non-Proxy plain data record. Unknown keys fail closed.

`rawBody` and `secret` remain copied bounded non-Proxy `Uint8Array` values before use.

## 6. Raw-byte authentication

The issue-comment extension must preserve the existing authentication rule:

```text
HMAC_SHA256(secret, exact_raw_webhook_body_bytes)
```

The supplied signature header must retain exact lowercase form:

```text
sha256=<64 lowercase hex>
```

Verification must use constant-time digest comparison through the existing timing-safe primitive.

Any changed byte, malformed signature, wrong secret, invalid UTF-8, malformed JSON, duplicate JSON key, excessive JSON depth, excessive JSON member count, or oversized raw body must fail closed before evidence can be accepted.

No secret bytes may appear in serialized evidence or deterministic evidence preimages.

## 7. Admitted event/action

The new API must admit exactly:

```text
eventName = issue_comment
action = created
```

`edited`, `deleted`, or any unknown issue-comment action must fail closed.

The legacy pull-request API must retain its existing event/action allowlist unchanged.

## 8. Pull-request-backed issue proof

The signed issue-comment payload must contain a valid `issue` object.

The implementation must require:

```text
issue.number = positive safe integer
issue.id = positive safe integer
issue.pull_request = object
```

Presence of signed `issue.pull_request` proves that the comment belongs to a pull request rather than a plain issue. O4 mention-trigger logic must not be built on plain issue comments through this slice.

The implementation must not claim that the `issue.pull_request` object contains current head information.

## 9. Signed repository binding

The signed payload repository must bind:

```text
repository.id
repository.full_name
```

Both must exactly equal:

```text
expectedRepositoryId
expectedRepositoryFullName
```

Repository full name must continue using bounded canonical `owner/name` grammar.

The caller-materialized pull-request binding's base repository must also equal the signed repository identity.

## 10. Signed comment binding

The signed payload comment must bind at minimum:

```text
comment.id
comment.node_id
comment.body
comment.user.id
comment.user.login
comment.user.type
```

The implementation must derive and serialize:

```text
commentId
commentNodeId
commentBodySha256
commentBodyByteLength
commentIdentity
```

`commentIdentity` must be a domain-separated SHA-256 identity that binds the signed repository, pull-request number, comment id/node id, body digest/byte length, and signed comment user identity.

Raw comment body text must not be serialized in the final issue-comment evidence. O4 may later receive the caller-materialized body separately and verify digest/length equality before parsing mention grammar.

Comment body must be non-empty, NUL-free Unicode-scalar UTF-8 text and must have an explicit maximum no larger than 256 KiB.

## 11. Signed actor binding

The signed payload `sender` must bind:

```text
sender.id
sender.login
sender.type
```

The signed `comment.user` identity must equal the signed `sender` identity exactly for the admitted `created` event.

The signed actor must also equal the caller-materialized actor-eligibility input:

```text
actorEligibility.actorId
actorEligibility.actorLogin
```

Only `actorEligibility.decision = ELIGIBLE` may produce positive evidence.

Actor type must remain inside the existing closed O1 actor-type set.

## 12. Caller-materialized PR head binding

GitHub `issue_comment` signed payload does not contain the pull request's current head SHA. O1 must not invent signed-head semantics.

The new input therefore requires one exact `pullRequestBinding` data record containing at minimum:

```text
policyIdentity
pullRequestId
baseRepositoryId
headRepositoryId
headRepositoryFullName
observedHeadSha
evidenceRefs
```

Rules:

- `policyIdentity` is lowercase SHA-256;
- `pullRequestId`, `baseRepositoryId`, and `headRepositoryId` are canonical positive decimal identifiers;
- `baseRepositoryId` must equal the signed repository id;
- `headRepositoryFullName` uses bounded canonical owner/name grammar;
- `observedHeadSha` is lowercase 40-hex Git SHA-1;
- `observedHeadSha` must equal top-level `expectedHeadSha`;
- `evidenceRefs` is a bounded, duplicate-free, canonically sorted caller-materialized evidence set;
- positive issue-comment evidence requires non-empty PR-binding evidence refs.

The output must serialize exactly:

```text
headBindingSource = CALLER_MATERIALIZED_PR_SNAPSHOT
headBindingPolicyIdentity
headBindingEvidenceRefs
```

This explicit source label is mandatory. Consumers must be able to distinguish signed webhook facts from caller-materialized head binding.

`headMatch` may remain `MATCH` only if `headBindingSource` is present in the new issue-comment evidence and the implementation/test/schema make clear that this match is against caller-materialized PR snapshot evidence, not a head SHA signed inside the issue-comment payload.

## 13. Pull-request identity and fork classification

The output `pullRequestNumber` comes from the signed `issue.number`.

The output `pullRequestId` comes from the caller-materialized PR binding and must be bound into the final evidence identity.

The output `baseRepositoryId` and `headRepositoryId` come from the caller-materialized PR binding.

Fork classification remains deterministic:

```text
baseRepositoryId == headRepositoryId -> SAME_REPOSITORY
baseRepositoryId != headRepositoryId -> FORK_REPOSITORY
```

The implementation must not infer fork status from repository names alone.

## 14. Replay identity

The existing delivery identity semantic must remain stable:

```text
DOMAIN = KODAC-O1-DELIVERY-IDENTITY-V1
eventSource = GITHUB
eventName = issue_comment
deliveryId = caller delivery id
```

If the derived delivery identity exists in caller-materialized `previousDeliveryIdentities`, the extension must fail closed.

Changing authenticated payload bytes while reusing the same event name and delivery id must not bypass duplicate-delivery rejection.

This remains caller-materialized replay evidence only.

The implementation must not claim:

```text
PERSISTENCE_BACKED_REPLAY_PROTECTION
ATOMIC_CROSS_PROCESS_DELIVERY_CLAIM
CRASH_RECOVERY
RETENTION_POLICY
```

## 15. New positive serialized evidence

The new issue-comment evidence must use a closed exact-key output containing at minimum:

```text
version
eventSource
signatureAlgorithm
keyIdentity
deliveryId
deliveryIdentity
payloadSha256
eventName
action
repositoryId
repositoryFullName
pullRequestNumber
pullRequestId
issueId
baseRepositoryId
headRepositoryId
headRepositoryFullName
forkClassification
observedHeadSha
expectedHeadSha
headMatch
headBindingSource
headBindingPolicyIdentity
headBindingEvidenceRefs
commentId
commentNodeId
commentBodySha256
commentBodyByteLength
commentIdentity
actorId
actorLogin
actorType
actorEligibilityPolicyIdentity
actorEligibilityEvidenceRefs
actorEligibilityDecision
replayDecision
authenticationDecision
ingressDecision
eventEvidenceIdentity
```

A stricter surface is allowed if it preserves all required bindings and does not remove the signed-vs-caller-materialized distinction.

No raw secret or raw comment body may be serialized.

## 16. Deterministic evidence identity

The new event identity must use a dedicated domain-separated SHA-256 preimage, for example:

```text
KODAC-O1-AUTHENTICATED-GITHUB-ISSUE-COMMENT-EVIDENCE-V1
```

The preimage must bind every serialized semantic field except the final identity itself.

Changing any of the following must change the final evidence identity:

```text
raw authenticated payload digest
delivery identity
repository identity
pull-request number/id
head binding
head binding policy/evidence refs
fork classification
comment id/node id/body digest/body length
actor identity/eligibility evidence
```

The validator must independently rederive all derived fields and the final identity from the supplied source input.

## 17. Hostile-input hardening

The new path must preserve or strengthen O1 hardening against:

- Proxy and revoked Proxy top-level input;
- Proxy/revoked Proxy actor binding;
- Proxy/revoked Proxy PR binding;
- Proxy arrays;
- Proxy `Uint8Array` raw body/secret;
- accessors/getters/setters;
- symbol properties;
- non-enumerable structured properties;
- custom prototypes where plain records are required;
- sparse arrays;
- extra array properties;
- undefined values;
- duplicate evidence refs;
- unpaired Unicode surrogates;
- embedded NUL in text;
- invalid numeric identifiers;
- invalid SHA-1/SHA-256 syntax;
- oversized comment body/raw body/reference arrays;
- malformed or duplicate-key JSON.

Proxy detection must occur before operations that can trigger revoked-Proxy traps.

## 18. Dedicated JSON Schema

Add exactly this new schema path:

```text
schema/o1-authenticated-github-issue-comment-evidence.schema.json
```

It must use Draft 2020-12 and describe only the positive new issue-comment serialized evidence.

Requirements:

```text
type = object
additionalProperties = false
version = const kodac-o1-authenticated-github-issue-comment-evidence-v1
eventSource = const GITHUB
signatureAlgorithm = const HMAC_SHA256
eventName = const issue_comment
action = const created
headBindingSource = const CALLER_MATERIALIZED_PR_SNAPSHOT
headMatch = const MATCH
actorEligibilityDecision = const ELIGIBLE
replayDecision = const UNSEEN
authenticationDecision = const AUTHENTICATED
ingressDecision = const ACCEPT
```

The schema must bound strings, arrays, integer counts, SHA patterns, and enum values consistently with source constants.

The implementation test must prove exact source/schema surface parity for the new positive evidence.

The existing pull-request schema bytes must remain unchanged.

## 19. Required focused tests

The implementation candidate must preserve every existing O1 focused test and add at least these issue-comment cases:

1. valid signed same-repository PR issue comment is accepted;
2. valid signed fork PR issue comment is classified from caller-materialized repo ids;
3. new protocol version is exact;
4. `issue_comment/created` is the only admitted new event/action;
5. `edited` is rejected;
6. `deleted` is rejected;
7. plain issue comment without `issue.pull_request` is rejected;
8. repository id mismatch is rejected;
9. repository full-name mismatch is rejected;
10. comment id/node-id/body binding is deterministic;
11. comment body mutation with old signature is rejected;
12. comment body mutation with a valid new signature changes comment/final identities;
13. empty comment body is rejected;
14. oversized comment body is rejected;
15. comment user and sender mismatch is rejected;
16. actor eligibility mismatch is rejected;
17. INELIGIBLE actor is rejected;
18. UNKNOWN actor is rejected;
19. missing PR head binding is rejected;
20. base repository binding mismatch is rejected;
21. malformed head repository identity/name is rejected;
22. observed head mismatch against expected head is rejected;
23. empty head-binding evidence refs are rejected;
24. changed head binding changes final identity;
25. changed head-binding policy changes final identity;
26. duplicate prior delivery blocks issue-comment replay;
27. same delivery id with changed authenticated payload still blocks when prior delivery identity is supplied;
28. invalid UTF-8 and duplicate JSON keys are rejected;
29. Proxy and revoked Proxy structured inputs fail closed;
30. accessors/symbol/non-enumerable/custom-prototype inputs fail closed;
31. sparse/extra-property arrays fail closed;
32. unpaired Unicode/NUL values fail closed;
33. final issue-comment evidence is deeply frozen;
34. validator rejects forged derived comment/head/fork/final identity fields;
35. raw secret is absent from serialized evidence;
36. raw comment body is absent from serialized evidence;
37. dedicated schema parses as Draft 2020-12 and has exact positive-surface parity;
38. legacy pull-request evidence for a fixed fixture remains exactly equal to a frozen compatibility vector or independently verified pre-extension expected object;
39. existing pull-request schema bytes/hash remain unchanged by the implementation candidate;
40. source exposes no listener/filesystem/process/network/provider/K2 side-effect import surface;
41. implementation diff contains exactly the three authorized paths.

Additional focused tests are allowed within the existing test path.

## 20. Qualification requirements

The exact frozen implementation candidate must satisfy:

```text
NODE_24_FOCUSED_O1_TEST = PASS
TYPESCRIPT = PASS
FULL_RUNTIME_REGRESSION = PASS
PATCH_BENCHMARK = PASS
UV_SYNC_FROZEN_DEV = PASS
PYTHON_REPOSITORY_TESTS = PASS
RUFF = PASS
PROVENANCE = PASS
ISSUE_COMMENT_SCHEMA_DRAFT_2020_12 = PASS
ISSUE_COMMENT_SCHEMA_SURFACE_PARITY = PASS
LEGACY_PULL_REQUEST_SCHEMA_UNCHANGED = PASS
LEGACY_PULL_REQUEST_COMPATIBILITY = PASS
NO_NEW_DEPENDENCY = PASS
NO_PACKAGE_OR_LOCKFILE_DIFF = PASS
NO_FORBIDDEN_SIDE_EFFECT_IMPORT = PASS
EXACT_CHANGED_PATHS = 3
```

Historical failed attempts must remain visible and must not be relabeled as first-attempt success.

## 21. PR and merge gates

Before merge, require:

- exact-head original applicable PR CI success;
- complete substantive exact-head review;
- zero unresolved review threads;
- active canonical main ruleset with no bypass actor for the current user;
- exact-head qualification proof;
- fresh pre-merge guard after qualification;
- canonical `main` still equal to the qualified base;
- normal merge with exact expected head;
- no force-push;
- no rebase;
- no destructive history rewrite.

After merge, require proof of:

- canonical `main` equal to the merge commit;
- candidate tree identity preserved by the merge;
- ordered parents equal qualified base then candidate head;
- GitHub merge signature verified/valid;
- exact source/test/new-schema blob identities;
- original applicable post-merge governance and runtime workflows successful;
- zero unresolved review threads;
- active ruleset/no bypass posture unchanged;
- no tag/release side effect;
- final external post-merge proof.

## 22. Non-grants after successful implementation

Even after canonical closure of this extension:

```text
O1_AUTHENTICATED_PULL_REQUEST_EVENTS = BOUNDED_CANONICAL
O1_AUTHENTICATED_ISSUE_COMMENT_CREATED_EVIDENCE = BOUNDED_CANONICAL
ISSUE_COMMENT_HEAD_BINDING = CALLER_MATERIALIZED / NOT_WEBHOOK_SIGNED
PERSISTENCE_BACKED_REPLAY_PROTECTION = NOT_PROVEN
ATOMIC_CROSS_PROCESS_DEDUPE = NOT_PROVEN
LIVE_WEBHOOK_LISTENER = NOT_PROVEN
GITHUB_APP_REGISTRATION = NOT_PROVEN
GITHUB_NETWORK_PR_READ = NOT_PROVEN
LIVE_PROVIDER_INVOCATION = NOT_PROVEN
GITHUB_REVIEW_OR_COMMENT_PUBLICATION = NOT_PROVEN
O1_OVERALL_COMPLETION = NOT_ESTABLISHED
O4_OVERALL_COMPLETION = NOT_ESTABLISHED
PUBLIC_RELEASE = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
```

## 23. Successor rule

Only after complete external post-merge proof may a fresh successor analysis reconsider O4-A.

That analysis must verify that the new issue-comment evidence exposes enough signed comment/repository/actor data plus explicit caller-materialized head binding for O4 to verify an exact mention command body digest and bind the exact reviewed head without misrepresenting the head as signed webhook data.

No O4 implementation authority is created by this authorization record itself.
