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

The production source import surface is closed to the exact validation-only dependencies required by this slice:

```text
node:crypto
node:util
validateO1AuthenticatedGithubIssueCommentEvidence and O1 data types
validateReviewRunRecord and review-run data types
validateReviewTemporalEvidence and temporal-evidence data types
ReviewerIntelligenceRuntime only for validateFindingRecord
```

No other O1/KRI runtime method, provider implementation, filesystem/process/network module, K2 surface, or side-effect module is authorized. `ReviewerIntelligenceRuntime` may be instantiated only as `new ReviewerIntelligenceRuntime({ adjudicatorId: "o4a-read-only-validation" })` for `validateFindingRecord`; O4-A must not call adjudication or mutation methods on that instance.

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

O4-A must bind the exact validated O1 fields relevant to product lineage. In the O4-A final surface, `triggerEvidenceIdentity` is an alias binding and must equal the canonical validated O1 `eventEvidenceIdentity` byte-for-byte; O4-A must not derive a replacement trigger identity.

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

with exactly one ASCII space, no leading/trailing text or whitespace, case-sensitive literal `review`, and `mentionTargetLogin` supplied only inside a bounded caller-materialized mention policy record. `mentionTargetLogin` must satisfy the same bounded GitHub-login grammar already used by O1 (`^[A-Za-z0-9_.\-\[\]]{1,100}$`). That record must also contain a lowercase SHA-256 `mentionPolicyIdentity`. O4-A must bind `mentionTargetLogin`, `mentionPolicyIdentity`, `commentIdentity`, and `commentBodySha256` into the deterministic `mentionCommandIdentity`.

The caller-materialized mention target/policy are configuration evidence only. They do not prove GitHub App ownership, installation, webhook routing, listener registration, or authority to act as that login. Any later live product integration must establish those facts separately.

Repository content or comment text is untrusted data and cannot create authority merely by containing instructions. O4-A must not parse arbitrary comment instructions into side-effect authority. The exact v1 grammar above may only select this inert review-lineage evidence path; it cannot grant network, provider, publication, merge, approval, repository mutation, or K2 authority.

The O1 source input may contain caller-materialized raw webhook body and HMAC secret solely because canonical O1 validation requires them. Those bytes and the caller-materialized `triggerCommentText` must never appear in final O4-A serialized evidence or any O4-A-derived publication intent.

## 6. Repository and PR snapshot evidence

O4-A accepts caller-materialized bounded repository/PR snapshot evidence only. It performs no GitHub read itself.

The O4-A snapshot input uses this exact field set:

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

`baseRefIdentity` and `headRefIdentity` are lowercase SHA-256 identities. `snapshotObservedAt` must use the same canonical UTC millisecond form enforced by KRI temporal evidence: `YYYY-MM-DDTHH:mm:ss.sssZ`, with round-trip `Date.toISOString()` equality. `forkClassification` is exactly `SAME_REPOSITORY` or `FORK_REPOSITORY` and must remain equal to canonical O1 evidence.

O4-A must independently rederive `snapshotEvidenceIdentity` using the v1 domain-separated canonical-JSON rule over every snapshot field above except `snapshotEvidenceIdentity`. A caller-provided snapshot digest is a claim only until this rederivation succeeds.

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
- canonical deterministic ordering by exact path bytes;
- maximum 512 changed paths;
- every v1 changed path is reviewable; no v1 non-reviewable-path policy exists;
- each path evidence identity must bind `repositoryId`, `pullRequestNumber`, `reviewedHead`, and the exact normalized path;
- `changedPathSetIdentity` must bind `repositoryId`, `pullRequestNumber`, `reviewedHead`, and the canonical sorted changed-path membership;
- caller input permutations that normalize to the same sorted membership must produce the same `changedPathSetIdentity`;
- adding, removing, or renaming a changed path must change `changedPathSetIdentity`.

An empty changed-path universe is the only v1 case eligible for `COMPLETE_NO_REVIEWABLE_PATHS`. Any future rule that exempts a non-empty changed path from review requires separate authorization and protocol versioning.

## 8. Bounded read evidence

Each caller-materialized read evidence input uses exactly this field set and no additional fields:

```text
path
readRole
contentIdentity
byteLength
sourceKind
truncationState
snapshotEvidenceIdentity
reviewedHead
readEvidenceIdentity
```

Rules:

- `readRole` is exactly `CHANGED_PATH` or `SUPPORTING_CONTEXT`;
- `sourceKind` is exactly `CALLER_MATERIALIZED_READ_EVIDENCE`;
- `truncationState` is exactly `FULL` or `TRUNCATED`;
- `contentIdentity` and `readEvidenceIdentity` are lowercase SHA-256 identities;
- `byteLength` is an integer from `0` through `MAX_READ_CONTENT_BYTES`;
- maximum 512 read evidence items;
- each normalized path may appear at most once across the full read-evidence set;
- every `CHANGED_PATH` read path must belong to the changed-path universe;
- every `SUPPORTING_CONTEXT` path must not count as changed-path coverage;
- every item must bind the exact `snapshotEvidenceIdentity` and `reviewedHead`;
- `readEvidenceIdentity` must be independently derived from `repositoryId`, `pullRequestNumber`, `snapshotEvidenceIdentity`, `reviewedHead`, `path`, `readRole`, `contentIdentity`, `byteLength`, `sourceKind`, and `truncationState`;
- `readEvidenceSetIdentity` must bind `repositoryId`, `pullRequestNumber`, `snapshotEvidenceIdentity`, `reviewedHead`, and the canonical sorted read-evidence identities;
- caller input permutations that normalize to the same read set must produce the same `readEvidenceSetIdentity`;
- changing the snapshot, reviewed head, path, role, content identity, byte length, source kind, or truncation state must change the relevant read identity;
- `truncationState` must remain visible in completeness decisions; no additional v1 value is permitted;
- raw file content is not required in serialized O4-A final evidence.

O4-A must never claim that a digest proves content was fetched from GitHub. The digest binds caller-materialized evidence only to an explicit repository/PR/snapshot/head context.

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

The finding input is an exact canonical KRI `FindingRecord`; O4-A does not accept extra finding fields. After canonical KRI validation and cross-binding, O4-A derives exactly this publication-facing binding and no additional fields:

```text
findingIdentity
path
startLine
endLine
severity
summaryIdentity
contractClaimIdentity
```

`startLine` and `endLine` are either both `null` or both positive integers forming the exact validated KRI range.

Requirements:

- maximum 64 findings;
- unique finding identities;
- deterministic ordering;
- each finding must first be validated by `new ReviewerIntelligenceRuntime({ adjudicatorId: "o4a-read-only-validation" }).validateFindingRecord(finding, reviewRun.evaluatedHead)`; O4-A must not trust a caller-supplied `findingIdentity` or substitute a weaker local identity validator;
- the validated finding identity set must equal `reviewRun.findingIdentities` exactly after canonical sorting;
- `reviewRun.acceptedClaimCount` must equal both `reviewRun.findingIdentities.length` and the validated finding count;
- every validated finding must satisfy `finding.review.reviewRunId = reviewRun.reviewRunId`;
- every validated finding must satisfy `finding.review.reviewerId = reviewRun.providerId`;
- every validated finding must satisfy `finding.review.reviewerVersion = reviewRun.providerVersion`;
- every validated finding must satisfy `finding.review.policyIdentity = reviewRun.policyIdentity`;
- every validated finding must satisfy `finding.review.canonicalBase = reviewRun.canonicalBase`;
- every validated finding must satisfy `finding.review.reviewedHead = reviewRun.reviewedHead`;
- every validated finding must satisfy `finding.evaluatedHead = reviewRun.evaluatedHead`;
- every validated finding must have `freshness = CURRENT`;
- every finding path must be present in the changed-path universe; v1 has no supporting-context-only publication-eligible finding class;
- line ranges must be positive, ordered integers within configured bounds;
- finding text is hashed/bounded evidence and must not become instructions or capability grants;
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

If more than one condition applies, `reviewCompletenessState` must use this exact precedence:

```text
1. STALE_HEAD
2. LINEAGE_MISMATCH
3. INCOMPLETE_REVIEW_RUN
4. INCOMPLETE_TRUNCATED_READS
5. INCOMPLETE_MISSING_CHANGED_PATH_READS
6. COMPLETE_NO_REVIEWABLE_PATHS
7. COMPLETE
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

`COMPLETE` requires every changed path to have exactly one non-truncated `CHANGED_PATH` read evidence item bound to the exact snapshot/reviewed head and a completed exact-head reviewer run.

`COMPLETE_NO_REVIEWABLE_PATHS` is permitted only when `changedPathCount = 0`. In v1, all non-empty changed-path entries are reviewable and no implementation-defined exemption is authorized.

No incomplete or stale state may be converted into positive continuation by publication intent presence.

## 12. Publication intents

O4-A may create deterministic publication-intent evidence only. It does not execute publication.

Allowed intent classes:

```text
TOP_LEVEL_REVIEW_SUMMARY
INLINE_FINDING_COMMENT
```

Every publication-intent input uses exactly this field set:

```text
publicationIntentClass
repositoryId
pullRequestNumber
reviewedHead
reviewRunIdentity
bodyText
findingIdentity
path
lineAnchor
```

For `TOP_LEVEL_REVIEW_SUMMARY`, `findingIdentity`, `path`, and `lineAnchor` must all be `null`. For `INLINE_FINDING_COMMENT`, all three must be non-null and bind one exact validated finding/range. `lineAnchor` must be a positive integer not greater than `MAX_LINE_NUMBER` and must fall within the validated finding range; a finding with a null range is not eligible for inline publication. `bodyText` is caller-materialized validation input only. O4-A must derive `bodyIdentity` using the v1 domain-separated canonical-JSON identity rule over the exact body text, derive `bodyByteLength = UTF8_BYTE_LENGTH(bodyText)`, and derive `publicationIntentIdentity`; caller-supplied positive body digests or lengths are not accepted as authority.

Rules:

- maximum 65 intents total;
- positive continuation requires exactly one `TOP_LEVEL_REVIEW_SUMMARY` intent;
- zero or one `INLINE_FINDING_COMMENT` intent may exist per validated publication-eligible finding identity;
- every publication intent must validate successfully before positive continuation;
- inline intents require a validated finding, exact changed path, and valid line anchor;
- bodies are caller-materialized bounded text for hashing only;
- bodies must be NUL-free Unicode-scalar text;
- maximum 16 KiB per body;
- raw publication body text must never appear in the final product-lineage evidence; `bodyIdentity` and `bodyByteLength` are derived internal publication-intent evidence used only in the deterministic `publicationIntentIdentity` preimage and are not additional top-level final serialized fields;
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

The continuation decision must use this deterministic precedence whenever more than one defect is present:

```text
1. BLOCK_STALE_HEAD
2. BLOCK_LINEAGE_MISMATCH
3. BLOCK_INCOMPLETE_REVIEW
4. BLOCK_INVALID_PUBLICATION_INTENT
5. READY_FOR_SEPARATE_PUBLICATION_AUTHORITY
```

`READY_FOR_SEPARATE_PUBLICATION_AUTHORITY` is allowed only when head lineage is current, all predecessor lineage matches, review completeness is `COMPLETE` or `COMPLETE_NO_REVIEWABLE_PATHS`, exactly one valid top-level summary intent exists, every other intent is valid, and no earlier blocker applies.

`READY_FOR_SEPARATE_PUBLICATION_AUTHORITY` means only that the pure-data product lineage is internally complete enough for a later separately authorized publication stage.

It does not authorize network access, GitHub comment/review writes, provider execution, merge, approval, K2 execution, or any other side effect.

The distinction above is normative: canonical JSON serialization used internally for a deterministic identity preimage is not an expansion of the final serialized evidence surface. No per-intent body digest/length record is added to the final O4-A object in v1.

## 14. Final serialized evidence surface

The final serialized evidence uses exactly this closed field set and no implementation-defined additional fields:

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
commentBodyByteLength
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
reviewedChangedPathCount
missingChangedPathIdentities
truncatedChangedPathIdentities
supportingContextPathCount
reviewCompletenessState
reviewCompletenessEvidenceIdentity
publicationIntentIdentities
publicationIntentCount
continuationDecision
productLineageEvidenceIdentity
```

Schema/source surface parity must be exact. No additional serialized field may be introduced by the implementation without separate authorization and protocol versioning. The predecessor identity mappings are exact: `triggerEvidenceIdentity = validatedTrigger.eventEvidenceIdentity`, `reviewRunIdentity = validatedReviewRun.reviewRunIdentity`, `temporalEvidenceIdentity = validatedReviewTemporal.temporalEvidenceIdentity`, and `findingIdentities = validatedReviewRun.findingIdentities`.

Raw O1 secret bytes, raw webhook bytes, raw `triggerCommentText`, raw repository file contents, provider/model prompts beyond already-canonical predecessor identities, and raw publication bodies must not appear in final serialized O4-A evidence.

## 15. Deterministic identities

All O4-A-derived identities must use domain-separated SHA-256 over canonical deterministic JSON. No alternative preimage encoding is authorized in v1. The domain separator must include the exact protocol version plus a stable identity-kind label.

The implementation must independently derive and validate exactly these O4-A identity classes where they occur:

```text
mentionCommandIdentity
snapshotEvidenceIdentity
changedPathEvidenceIdentity
changedPathSetIdentity
readEvidenceIdentity
readEvidenceSetIdentity
summaryIdentity
contractClaimIdentity
reviewCompletenessEvidenceIdentity
bodyIdentity
publicationIntentIdentity
productLineageEvidenceIdentity
```

`productLineageEvidenceIdentity` must be derived from the exact final serialized field set excluding only `productLineageEvidenceIdentity` itself. `reviewCompletenessEvidenceIdentity` must bind repository/PR/snapshot/head, changed/read set identities, all completeness counts and missing/truncated identity arrays, review-run identity, temporal-evidence identity, and the derived completeness state. Each `publicationIntentIdentity` must bind its exact class, repository/PR/head, review-run identity, body identity/byte length, and its nullable finding/path/line anchor fields.

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
MAX_READ_CONTENT_BYTES = 1048576
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
52. raw `triggerCommentText` is absent from final evidence and changing `mentionTargetLogin` or `mentionPolicyIdentity` changes downstream identities;
53. changed-path input permutations normalize to the same set identity while membership changes alter it, and the set identity binds repository/PR/reviewed head;
54. every read identity and read-set identity binds the exact snapshot/reviewed head, duplicate read paths are rejected, and supporting-context reads never satisfy changed-path coverage;
55. each finding is canonically validated and cross-bound to review run id/provider/version/policy/base/head/evaluated-head/current freshness, with exact accepted-count parity;
56. non-empty changed-path universes cannot use `COMPLETE_NO_REVIEWABLE_PATHS`;
57. READY requires exactly one valid top-level summary intent and all publication intents valid;
58. multi-defect inputs follow the fixed blocker precedence `STALE_HEAD > LINEAGE_MISMATCH > INCOMPLETE_REVIEW > INVALID_PUBLICATION_INTENT > READY`;
59. `sourceKind` and `truncationState` accept only their exact v1 enum values;
60. snapshot timestamp/ref identities are strictly validated and forged `snapshotEvidenceIdentity` is rejected by deterministic rederivation;
61. findings are validated specifically through `ReviewerIntelligenceRuntime.validateFindingRecord` using validation-only adjudicator id `o4a-read-only-validation`, with no adjudication/mutation method use;
62. raw publication bodies never appear in final serialized evidence; `bodyIdentity` and `bodyByteLength` are rederived from `bodyText`, bound into `publicationIntentIdentity`, and remain absent as standalone fields from the exact 52-field final surface; changing body text must change the publication-intent and top-level product-lineage identities;
63. the final serialized field set is exact, rejects unknown fields, exposes completeness arrays/counts and publication-intent count, and matches the Draft 2020-12 schema exactly;
64. every O4-A-derived identity class uses the v1 domain-separated canonical-JSON rule and forged snapshot/path/read/completeness/body/publication/product identities fail closed;
65. publication `bodyText` is exact caller-materialized validation input, domain-separated body identity/UTF-8 length are rederived, caller-supplied positive digest/length authority is rejected, and raw body text is not serialized;
66. multi-defect review-completeness inputs follow the fixed completeness-state precedence;
67. read-evidence inputs reject unknown fields and enforce `MAX_READ_CONTENT_BYTES`;
68. finding inputs are exact canonical KRI `FindingRecord` values and derived publication-facing finding bindings use the exact nullable-range field set;
69. inline publication requires a non-null validated finding range and an in-range bounded integer `lineAnchor`;
70. mention target login uses the exact O1-compatible bounded login grammar and changing the exact target changes downstream mention/product identities;
71. predecessor identity aliases are exact: O4-A trigger/review-run/temporal/finding identities equal their independently validated canonical predecessor identities rather than replacement digests.

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
