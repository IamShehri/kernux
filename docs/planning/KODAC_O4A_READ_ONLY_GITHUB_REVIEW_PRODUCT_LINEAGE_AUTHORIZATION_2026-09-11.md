# Kodac O4-A Read-Only GitHub Review Product Lineage Evidence Authorization

Date: 2026-09-11

## Status

```text
DOCUMENT_CLASS = IMPLEMENTATION_AUTHORIZATION_CANDIDATE
AUTHORIZATION_TARGET = O4_A_READ_ONLY_GITHUB_REVIEW_PRODUCT_LINEAGE_EVIDENCE_KERNEL
CANONICAL_BASE = f555f2af7629b644a55913ac9a5159dc8bf82137
FRESH_POST_O1_SUCCESSOR_ANALYSIS = PR_583_COMMENT_5625987274 / ANALYSIS_ONLY
O1_REVALIDATION_BOUNDARY_AMENDMENT = PR_583_COMMENT_5626035920 / ANALYSIS_ONLY
O1_ISSUE_COMMENT_EXTENSION = PR_583 / CLOSED_CANONICAL / PROOF_5625935288
BLOCKED_PREDECESSOR_AUTHORIZATION = PR_581 / CLOSED_UNMERGED / FINDING_5625232204
O3_IMPLEMENTATION = PR_580 / CLOSED_CANONICAL / PROOF_5625068569
WAIVER = NO
PROJECT_COMPLETION = NO
```

This record authorizes only the bounded O4-A implementation described below if and only if this authorization candidate itself becomes canonical through the repository's normal qualification, review, guarded merge, and post-merge proof process.

This document does not authorize implementation merely by existing on a branch or pull request.

## 1. Purpose

The current repository now has a canonical O1 `issue_comment/created` authenticated-evidence contract, including explicit caller-materialized PR-head binding, plus bounded repository/context machinery, provider-neutral reviewer execution contracts, exact-head stale detection, and temporal review evidence. It still does not have a single canonical product-lineage contract that binds that authenticated pull-request mention evidence to bounded read evidence, exact provider-neutral review evidence, review completeness, and bounded GitHub publication intents.

O4-A closes that evidence/orchestration gap without performing network access or external mutation.

The implementation must preserve these distinctions:

```text
AUTHENTICATED_EVENT_EVIDENCE != LIVE_WEBHOOK_LISTENER
GITHUB_READ_EVIDENCE != GITHUB_NETWORK_READ_AUTHORITY
REVIEW_RUN_EVIDENCE != PROVIDER_INVOCATION_AUTHORITY
PUBLICATION_INTENT != PR_COMMENT_EXECUTION
INLINE_PUBLICATION_INTENT != GITHUB_REVIEW_WRITE
O4_A_CONTINUATION_ALLOW != K2_SIDE_EFFECT_AUTHORITY
```

## 2. Exact implementation allowlist

After this authorization is canonically closed, one implementation pull request may change exactly these three paths and no others:

```text
packages/kodac-runtime/src/github-review/o4-read-only-review-product-lineage-evidence.ts
packages/kodac-runtime/test/o4-read-only-review-product-lineage-evidence.test.ts
schema/o4-read-only-review-product-lineage-evidence.schema.json
```

No root export is required or authorized.

No package metadata, dependency, lockfile, workflow, provenance ledger, current-view document, roadmap document, release configuration, O1 source, O2 source, O3 source, K3 source, KRI source, K2 source, P7 source, or K5 source may change in the implementation PR.

## 3. Implementation class

```text
IMPLEMENTATION_CLASS = PURE_DATA_ONLY_PRODUCT_LINEAGE_EVIDENCE
NEW_DEPENDENCY = NO
FILESYSTEM_READ_OR_WRITE = NO
PROCESS_EXECUTION = NO
NETWORK_ACCESS = NO
GITHUB_API_CALL = NO
GITHUB_APP_OR_WEBHOOK_LISTENER = NO
SECRET_RETRIEVAL_OR_STORAGE = NO
CALLER_MATERIALIZED_O1_SECRET_VALIDATION_INPUT = YES_ONLY_FOR_CANONICAL_O1_REVALIDATION
RAW_SECRET_OR_WEBHOOK_BODY_SERIALIZATION = NO
PROVIDER_OR_MODEL_INVOCATION = NO
SANDBOX_EXECUTION = NO
K2_EXECUTION = NO
REPOSITORY_OR_BRANCH_MUTATION = NO
EXTERNAL_MUTATION = NO
PERSISTENCE = NO
CURRENT_VIEW_MUTATION = NO
RELEASE_OR_DEPLOYMENT = NO
PHASE_CLOSURE = NO
PROJECT_COMPLETION = NO
```

The source may import deterministic validation/data contracts from already-canonical O1 and reviewer-intelligence modules, plus Node built-ins required for hashing and Proxy inspection. It must not import side-effect or provider-specific network modules.

For O1 cryptographic revalidation only, the API may receive a caller-materialized `O1AuthenticatedGithubIssueCommentInput` and pass it directly to `validateO1AuthenticatedGithubIssueCommentEvidence`. The caller-materialized secret and raw webhook bytes are validation inputs only: O4-A may not retrieve them from environment/filesystem/network, persist them, log them, copy them into publication intents, or serialize them in final O4-A evidence.

## 4. Protocol version

The implementation must expose exactly one O4-A loaded product-lineage protocol version:

```text
kodac-o4a-read-only-github-review-product-lineage-v1
```

## 5. Trigger lineage

The positive lineage must originate from caller-materialized canonical O1 `issue_comment/created` evidence and the exact caller-materialized O1 source input required for independent revalidation.

O4-A must call the canonical O1 validation surface rather than trust a caller-provided positive label:

```text
validateO1AuthenticatedGithubIssueCommentEvidence(
  triggerEvidence,
  triggerSourceInput,
)
```

The validated trigger must have exactly:

```text
version = kodac-o1-authenticated-github-issue-comment-evidence-v1
eventName = issue_comment
action = created
authenticationDecision = AUTHENTICATED
replayDecision = UNSEEN
ingressDecision = ACCEPT
actorEligibilityDecision = ELIGIBLE
headMatch = MATCH
headBindingSource = CALLER_MATERIALIZED_PR_SNAPSHOT
```

O4-A must bind the exact validated O1 fields relevant to product lineage:

```text
eventEvidenceIdentity
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
headBindingPolicyIdentity
headBindingEvidenceRefs[]
commentId
commentNodeId
commentBodySha256
commentBodyByteLength
commentIdentity
actorId
actorLogin
actorType
actorEligibilityPolicyIdentity
actorEligibilityEvidenceRefs[]
deliveryIdentity
payloadSha256
```

`observedHeadSha` and `expectedHeadSha` are caller-materialized PR-snapshot bindings that were validated by O1; O4-A must preserve `headBindingSource=CALLER_MATERIALIZED_PR_SNAPSHOT` and must not relabel those head fields as webhook-signed data.

O4-A must receive the exact caller-materialized trigger comment text as validation input and independently bind it to the authenticated O1 evidence before deriving any mention classification:

```text
sha256(UTF8(triggerCommentText)) = trigger.commentBodySha256
UTF8_BYTE_LENGTH(triggerCommentText) = trigger.commentBodyByteLength
```

`triggerCommentText` must be NUL-free Unicode-scalar text and must satisfy the explicit O4-A trigger-comment byte bound. If either digest or byte-length parity fails, O4-A must reject the lineage rather than trusting a caller label.

The mention command must then be **derived by O4-A from that exact bound text**, not accepted as a positive caller classification. The only v1 positive grammar is:

```text
@<mentionTargetLogin> review
```

with exactly one ASCII space, no leading/trailing text or whitespace, case-sensitive literal `review`, and `mentionTargetLogin` supplied only inside a bounded caller-materialized mention policy record. That record must also contain a SHA-256 `mentionPolicyIdentity`. O4-A must bind `mentionTargetLogin`, `mentionPolicyIdentity`, `commentIdentity`, and `commentBodySha256` into the deterministic `mentionCommandIdentity`.

The caller-materialized mention target/policy are configuration evidence only. They do not prove GitHub App ownership, installation, webhook routing, listener registration, or authority to act as that login. Any later live product integration must establish those facts separately.

Repository content or comment text is untrusted data and cannot create authority merely by containing instructions. O4-A must not parse arbitrary comment instructions into side-effect authority. The exact v1 grammar above may only select this inert review-lineage evidence path; it cannot grant network, provider, publication, merge, approval, repository mutation, or K2 authority.

The O1 source input may contain caller-materialized raw webhook body and HMAC secret solely because canonical O1 validation requires them. Those bytes and the caller-materialized `triggerCommentText` must never appear in final O4-A serialized evidence or any O4-A-derived publication intent.

## 6. Repository and PR snapshot evidence

O4-A accepts caller-materialized bounded repository/PR snapshot evidence only. It performs no GitHub read itself.

The O4-A snapshot must bind at minimum:

```text
repositoryId
repositoryFullName
pullRequestNumber
pullRequestId
canonicalBase
reviewedHead
baseRepositoryId
headRepositoryId
headRepositoryFullName
forkClassification
baseRefIdentity
headRefIdentity
snapshotObservedAt
snapshotEvidenceIdentity
```

Positive continuation requires exact equality across validated predecessors:

```text
snapshot.repositoryId = trigger.repositoryId
snapshot.repositoryFullName = trigger.repositoryFullName
snapshot.pullRequestNumber = trigger.pullRequestNumber
snapshot.pullRequestId = trigger.pullRequestId
snapshot.baseRepositoryId = trigger.baseRepositoryId
snapshot.headRepositoryId = trigger.headRepositoryId
snapshot.headRepositoryFullName = trigger.headRepositoryFullName
snapshot.forkClassification = trigger.forkClassification
snapshot.reviewedHead = trigger.observedHeadSha = trigger.expectedHeadSha
snapshot.canonicalBase = reviewRun.canonicalBase = reviewTemporal.canonicalBase
snapshot.reviewedHead = reviewRun.reviewedHead = reviewRun.evaluatedHead
snapshot.reviewedHead = reviewTemporal.reviewedHead = reviewTemporal.evaluatedHead
```

A fork classification must remain explicit. No fork status may be inferred from repository names alone. `snapshotObservedAt` is evidence metadata only and does not create a live freshness oracle; any later network/current-head freshness check requires separate authority.

## 7. Changed-path universe

The product lineage must carry an explicit changed-path universe for the reviewed head.

Requirements:

- repository-relative POSIX paths only;
- no absolute paths, drive prefixes, backslashes, empty segments, `.` or `..` segments;
- bounded UTF-8 length;
- no duplicate paths;
- canonical deterministic ordering;
- maximum 512 changed paths;
- each path binds an exact SHA-256 path evidence identity or equivalent deterministic path-set identity;
- the changed-path set identity must change if any path is added, removed, renamed, or reordered before normalization.

An empty changed-path universe may be represented but cannot produce a false claim of complete code review unless the review classification explicitly states that there were no reviewable changed paths.

## 8. Bounded read evidence

Each caller-materialized read evidence item must bind at minimum:

```text
path
contentIdentity
byteLength
readEvidenceIdentity
sourceKind
truncationState
```

Rules:

- `contentIdentity` and `readEvidenceIdentity` are lowercase SHA-256 identities;
- `byteLength` is bounded and finite;
- maximum 512 read evidence items;
- duplicate path/read identity combinations are rejected;
- every read path must belong to the changed-path universe or be explicitly classified as bounded supporting context;
- supporting-context paths must be separately classified and cannot count as changed-path coverage;
- `truncationState` is a closed vocabulary and must remain visible in completeness decisions;
- raw file content is not required in serialized O4-A final evidence.

O4-A must never claim that a digest proves content was fetched from GitHub. The digest binds caller-materialized evidence only.

## 9. Reviewer evidence binding

The implementation must independently validate the already-canonical provider-neutral reviewer-run record and its temporal evidence.

Positive continuation requires:

```text
reviewRun.status = COMPLETED
reviewRun.reviewedHead = reviewedHead
reviewRun.evaluatedHead = reviewedHead
reviewTemporal.reviewRunIdentity = reviewRun.reviewRunIdentity
reviewTemporal.reviewedHead = reviewedHead
reviewTemporal.evaluatedHead = reviewedHead
reviewTemporal.status = COMPLETED
```

The product lineage must bind:

```text
reviewRunIdentity
temporalEvidenceIdentity
providerId
providerVersion
policyIdentity
contextBundleIdentity
instructionsIdentity
findingIdentities[]
```

Provider/model execution is not performed by O4-A. Existing reviewer evidence is caller-materialized predecessor evidence.

## 10. Finding evidence

O4-A must accept a bounded normalized finding set whose identities equal the reviewer run's exact finding identities.

Each publication-eligible finding must bind at minimum:

```text
findingIdentity
path
optional startLine
optional endLine
severity
summaryIdentity
contractClaimIdentity
```

Requirements:

- maximum 64 findings;
- unique finding identities;
- deterministic ordering;
- every finding path must be present in the changed-path universe or explicitly classified as supporting-context-only and therefore not eligible for inline publication;
- line ranges must be positive, ordered integers within configured bounds;
- finding text is hashed/bounded evidence and must not become instructions or capability grants.
- `summaryIdentity` and `contractClaimIdentity` are O4-A-derived SHA-256 bindings over the validated canonical KRI `summary` and `contractClaim` text; they must not be represented as fields supplied by KRI.

## 11. Review completeness evidence

O4-A must derive a closed review completeness classification rather than accept an unbounded caller label.

Required states:

```text
COMPLETE
COMPLETE_NO_REVIEWABLE_PATHS
INCOMPLETE_MISSING_CHANGED_PATH_READS
INCOMPLETE_TRUNCATED_READS
INCOMPLETE_REVIEW_RUN
STALE_HEAD
LINEAGE_MISMATCH
```

The final completeness evidence must bind:

```text
changedPathSetIdentity
changedPathCount
reviewedChangedPathCount
missingChangedPathIdentities[]
truncatedChangedPathIdentities[]
supportingContextPathCount
reviewCompletenessState
reviewCompletenessEvidenceIdentity
```

`COMPLETE` requires all reviewable changed paths to have non-truncated bounded read evidence and a completed exact-head reviewer run.

`COMPLETE_NO_REVIEWABLE_PATHS` is permitted only when the changed-path universe is empty or every changed path is explicitly classified by a closed non-reviewable-path rule that O4-A can rederive.

No incomplete or stale state may be converted into positive continuation by publication intent presence.

## 12. Publication intents

O4-A may create deterministic publication-intent evidence only. It does not execute publication.

Allowed intent classes:

```text
TOP_LEVEL_REVIEW_SUMMARY
INLINE_FINDING_COMMENT
```

Every intent must bind:

```text
publicationIntentClass
repositoryId
pullRequestNumber
reviewedHead
reviewRunIdentity
bodyIdentity
bodyByteLength
optional findingIdentity
optional path
optional line anchor
publicationIntentIdentity
```

Rules:

- maximum 65 intents total;
- at most one top-level summary intent;
- at most one inline intent per finding identity unless a stricter deterministic grouping rule is used;
- inline intents require a validated finding, exact changed path, and valid line anchor;
- bodies are caller-materialized bounded text for hashing only;
- bodies must be NUL-free Unicode-scalar text;
- maximum 16 KiB per body;
- raw publication body text must not appear in final serialized evidence unless the implementation proves that doing so is necessary for deterministic product evidence and remains within this authorization; the preferred final surface stores body digest/length only;
- no intent contains a credential, HTTP request, URL with token, shell command authority, merge instruction, approval instruction, or repository mutation authority.

## 13. Continuation classification

The implementation must derive one closed continuation decision:

```text
READY_FOR_SEPARATE_PUBLICATION_AUTHORITY
BLOCK_STALE_HEAD
BLOCK_LINEAGE_MISMATCH
BLOCK_INCOMPLETE_REVIEW
BLOCK_INVALID_PUBLICATION_INTENT
```

`READY_FOR_SEPARATE_PUBLICATION_AUTHORITY` means only that the pure-data product lineage is internally complete enough for a later separately authorized publication stage.

It does not authorize network access, GitHub comment/review writes, provider execution, merge, approval, K2 execution, or any other side effect.

## 14. Final serialized evidence surface

The final evidence must use one exact closed field set. At minimum it must bind:

```text
version
triggerEvidenceIdentity
repositoryId
repositoryFullName
pullRequestNumber
pullRequestId
canonicalBase
reviewedHead
baseRepositoryId
headRepositoryId
headRepositoryFullName
forkClassification
actorId
actorLogin
actorType
actorEligibilityPolicyIdentity
actorEligibilityEvidenceRefs
headBindingSource
headBindingPolicyIdentity
headBindingEvidenceRefs
deliveryIdentity
payloadSha256
commentIdentity
commentBodySha256
mentionTargetLogin
mentionPolicyIdentity
mentionCommandKind
mentionCommandIdentity
snapshotEvidenceIdentity
changedPathSetIdentity
changedPathCount
readEvidenceSetIdentity
readEvidenceCount
reviewRunIdentity
temporalEvidenceIdentity
providerId
providerVersion
policyIdentity
contextBundleIdentity
instructionsIdentity
findingIdentities
reviewCompletenessState
reviewCompletenessEvidenceIdentity
publicationIntentIdentities
continuationDecision
productLineageEvidenceIdentity
```

The exact implementation may add stricter bounded identity/count fields only if they are necessary for deterministic validation, are included in the closed Draft 2020-12 schema, and do not imply a new authority surface.

Raw O1 secret bytes, raw webhook bytes, raw `triggerCommentText`, raw repository file contents, provider/model prompts beyond already-canonical predecessor identities, and raw publication bodies must not appear in final serialized O4-A evidence.

## 15. Deterministic identities

All O4-A-derived identities must use domain-separated SHA-256 over canonical deterministic JSON or an equally explicit canonical byte preimage.

At minimum derive separate identities for:

```text
mentionCommandIdentity
changedPathSetIdentity
readEvidenceSetIdentity
reviewCompletenessEvidenceIdentity
publicationIntentIdentity
productLineageEvidenceIdentity
```

The validator must independently rederive every derived identity and reject forged derived fields.

`mentionCommandIdentity` must bind the independently verified trigger comment digest plus the exact `mentionTargetLogin`, `mentionPolicyIdentity`, and closed `mentionCommandKind=REVIEW`. Changing the target login or policy identity must change the derived command and top-level product-lineage identities.

`canonicalBase` and `reviewedHead` remain lowercase 40-hex Git SHA-1 identities because the existing repository contracts use SHA-1 Git object identifiers. O4-A must not silently reinterpret them as SHA-256.

## 16. Hostile-input hardening

The implementation must fail closed on hostile structural inputs including:

- Proxy and revoked Proxy objects;
- accessors/getters/setters;
- non-enumerable data properties;
- symbol properties;
- custom prototypes where plain data is required;
- sparse arrays;
- arrays with extra own properties;
- duplicate identity/path entries;
- undefined values;
- NaN and infinities;
- unsupported enum values;
- unknown object keys;
- unpaired Unicode surrogates;
- embedded NUL where text is required;
- oversized strings, arrays, graphs, and counts;
- aliased/cyclic object graphs if graph validation traverses caller objects.

Proxy detection must occur before operations that can trigger revoked-Proxy traps.

## 17. Bounds

The implementation must define explicit constants no weaker than:

```text
MAX_CHANGED_PATHS = 512
MAX_READ_EVIDENCE_ITEMS = 512
MAX_FINDINGS = 64
MAX_PUBLICATION_INTENTS = 65
MAX_PUBLICATION_BODY_UTF8_BYTES = 16384
MAX_TRIGGER_COMMENT_UTF8_BYTES = 16384
MAX_PATH_UTF8_BYTES = 1024
MAX_GENERAL_TEXT_UTF8_BYTES = 4096
MAX_GRAPH_DEPTH = 32
MAX_GRAPH_NODES = 32768
MAX_LINE_NUMBER = 10000000
```

Smaller bounds are allowed.

## 18. JSON Schema

The schema path in the exact allowlist must use JSON Schema Draft 2020-12.

Requirements:

- `type: object`;
- `additionalProperties: false`;
- exact protocol version const;
- exact closed positive serialized surface;
- lowercase SHA-256 patterns for SHA-256 identities;
- lowercase 40-hex pattern for Git object identities;
- bounded arrays with uniqueness where applicable;
- closed enum/const values;
- exact source/schema surface parity tested without a new dependency.

Schema acceptance is structural only and must not claim GitHub authenticity, provider execution, network publication, or side-effect authority.

## 19. Required focused tests

The implementation test file must contain at least these cases:

1. protocol version and limits are exact;
2. valid canonical O1 `issue_comment/created` trigger lineage is independently revalidated;
3. invalid O1 HMAC/signature is rejected through canonical O1 validation;
4. unsupported O1 event/action lineage is rejected;
5. `headBindingSource` must remain `CALLER_MATERIALIZED_PR_SNAPSHOT`;
6. raw O1 secret and raw webhook body are not serialized in final O4-A evidence;
7. repository id/name mismatch is rejected;
8. PR-number or PR-id mismatch is rejected;
9. base/head repository mismatch is rejected;
10. reviewed-head mismatch is rejected;
11. canonical-base mismatch is rejected;
12. actor/eligibility lineage mismatch is rejected;
13. deterministic mention command identity binds comment identity/body digest;
14. changed paths are canonicalized deterministically;
15. duplicate changed paths are rejected;
16. invalid repository-relative paths are rejected;
17. supporting context does not count as changed-path coverage;
18. missing changed-path read produces incomplete state;
19. truncated changed-path read produces incomplete state;
20. exact full changed-path read coverage produces complete state;
21. canonical `validateReviewRunRecord` accepts a completed exact-head reviewer run;
22. stale reviewer run is blocked;
23. provider failure/incomplete reviewer run is blocked;
24. canonical `validateReviewTemporalEvidence` accepts matching completed temporal evidence;
25. temporal review-run identity mismatch is rejected;
26. temporal canonical-base/head mismatch is rejected;
27. finding identity set must equal reviewer run identities;
28. duplicate findings are rejected;
29. stale finding/evaluated-head mismatch is rejected;
30. inline intent must bind an exact validated finding;
31. inline intent path mismatch is rejected;
32. invalid line anchors are rejected;
33. top-level summary intent is bounded;
34. duplicate publication intents are rejected;
35. publication bodies are not serialized in final evidence;
36. continuation cannot be caller-forged to READY;
37. forged derived identities fail validation;
38. changed head changes downstream identities;
39. changed review run changes downstream identities;
40. changed publication body changes publication intent identity;
41. Proxy and revoked Proxy inputs fail closed before trap-prone operations;
42. accessor/non-enumerable/symbol/custom-prototype inputs fail closed;
43. sparse/extra-property arrays fail closed;
44. unpaired Unicode/NUL/oversized text fails closed;
45. output is deeply frozen;
46. schema parses as Draft 2020-12 and has exact source surface parity;
47. source imports contain no side-effect/provider-specific/network surface;
48. no dependency/package/lockfile/workflow diff exists;
49. exact implementation changed-path set remains three paths;
50. caller-materialized `triggerCommentText` SHA-256 and UTF-8 byte length must exactly equal O1 `commentBodySha256` and `commentBodyByteLength`;
51. mention classification is derived from exact bound text and wrong target, wrong policy binding, absent mention, extra arguments, or unsupported grammar cannot produce positive continuation;
52. raw `triggerCommentText` is absent from final evidence and changing `mentionTargetLogin` or `mentionPolicyIdentity` changes downstream identities.

Additional tests are encouraged within the same test path.

## 20. Qualification requirements

Before the implementation candidate may merge, exact frozen bytes must satisfy:

```text
NODE_24_FOCUSED_TEST = PASS
TYPESCRIPT = PASS
FULL_RUNTIME_REGRESSION = PASS
PATCH_BENCHMARK = PASS
UV_SYNC_FROZEN_DEV = PASS
PYTHON_REPOSITORY_TESTS = PASS
RUFF = PASS
PROVENANCE = PASS
SCHEMA_DRAFT_2020_12 = PASS
SCHEMA_SURFACE_PARITY = PASS
NO_NEW_DEPENDENCY = PASS
NO_PACKAGE_OR_LOCKFILE_DIFF = PASS
NO_FORBIDDEN_IMPORT_OR_SIDE_EFFECT_SURFACE = PASS
EXACT_CHANGED_PATHS = 3
```

Historical failed local attempts must remain explicitly reported and must not be relabeled as first-attempt success.

Required pull-request evidence remains:

- exact-head required CI on the original applicable attempts;
- complete substantive exact-head review;
- zero unresolved review threads;
- active canonical main ruleset with no bypass actor for the current user;
- exact-head qualification proof;
- fresh pre-merge guard after qualification;
- normal merge using the exact expected head;
- no force-push, rebase, or destructive history rewrite;
- post-merge proof that canonical `main` has the expected ordered parents and candidate tree/blob identities;
- applicable original post-merge workflow success;
- final external post-merge proof.

## 21. Non-grants after O4-A closure

Even after a successful O4-A implementation, the following remain unproven and unauthorized unless separately closed:

```text
LIVE_GITHUB_WEBHOOK_OR_APP_LISTENER
PERSISTENCE_BACKED_EVENT_REPLAY_PROTECTION
GITHUB_NETWORK_PR_OR_REPOSITORY_READ_ADAPTER
LIVE_PROVIDER_OR_MODEL_INVOCATION
GITHUB_PR_COMMENT_OR_REVIEW_PUBLICATION
K2_BACKED_EXTERNAL_MUTATION_ADAPTER
SECRET_OR_INSTALLATION_TOKEN_HANDLING
PUBLIC_PRODUCT_DEPLOYMENT
O4_OVERALL_COMPLETION
O5_PLUS_AUTHORITY
PHASE_OVERALL_CLOSURE
PUBLIC_RELEASE
PRODUCTION_READINESS
PROJECT_COMPLETION
```

O4-A is deliberately an evidence/orchestration kernel. It may advance the O4 program criterion, but it must not be used to relabel the complete read-only GitHub review product path as proven.

## 22. Successor rule

After O4-A implementation receives complete external post-merge proof, perform a fresh successor analysis from live canonical `main`.

That analysis must decide, from repository truth rather than numbering, whether the next safe unit is:

- a bounded GitHub network read adapter;
- a K2-backed external publication adapter;
- provider invocation qualification/product integration;
- another prerequisite exposed by the evidence;
- or an O4 bounded closeout/reconciliation if all required product-path evidence has actually become canonical.

No successor gains authority from this section alone.
