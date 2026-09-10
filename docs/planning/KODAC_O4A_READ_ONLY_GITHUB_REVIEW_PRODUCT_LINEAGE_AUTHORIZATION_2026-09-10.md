# Kodac O4-A Read-Only GitHub Review Product Lineage Evidence Authorization

Date: 2026-09-10

## Status

```text
DOCUMENT_CLASS = IMPLEMENTATION_AUTHORIZATION_CANDIDATE
AUTHORIZATION_TARGET = O4_A_READ_ONLY_GITHUB_REVIEW_PRODUCT_LINEAGE_EVIDENCE_KERNEL
CANONICAL_BASE = e9f77f41125ab95384bd1ab0f2a4a7daf88bb04b
POST_O3_SUCCESSOR_ANALYSIS = PR_580_COMMENT_5625198490 / ANALYSIS_ONLY
O3_IMPLEMENTATION = PR_580 / CLOSED_CANONICAL / PROOF_5625068569
WAIVER = NO
PROJECT_COMPLETION = NO
```

This record authorizes only the bounded O4-A implementation described below if and only if this authorization candidate itself becomes canonical through the repository's normal qualification, review, guarded merge, and post-merge proof process.

This document does not authorize implementation merely by existing on a branch or pull request.

## 1. Purpose

The current repository has authenticated GitHub event evidence, bounded repository/context machinery, provider-neutral reviewer execution contracts, exact-head stale detection, and temporal review evidence. It does not yet have a single canonical product-lineage contract that binds an authenticated pull-request mention to bounded read evidence, exact provider-neutral review evidence, review completeness, and bounded GitHub publication intents.

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
SECRET_OR_TOKEN_ACCESS = NO
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

## 4. Protocol version

The implementation must expose exactly one O4-A loaded product-lineage protocol version:

```text
kodac-o4a-read-only-github-review-product-lineage-v1
```

## 5. Trigger lineage

The positive lineage must originate from caller-materialized O1 authenticated GitHub event evidence that is independently revalidated by O4-A.

The trigger must bind at minimum:

```text
repositoryIdentity
repositoryFullName
pullRequestNumber
canonicalBase
reviewedHead
actorLogin
actorIdentity or exact actor-eligibility evidence identity
deliveryIdentity
payloadIdentity
eventName
action
commentIdentity
commentBodyIdentity
mentionCommandIdentity
```

Positive O4-A continuation requires a pull-request issue-comment creation trigger. Unsupported event/action shapes must fail closed.

The mention command grammar must be deterministic, bounded, NUL-free Unicode-scalar text. Repository content or comment text is untrusted data and cannot create authority merely by containing instructions.

O4-A must not parse arbitrary comment instructions into side-effect authority. It may only bind an exact caller-supplied mention command classification and its deterministic identity.

## 6. Repository and PR snapshot evidence

O4-A accepts caller-materialized bounded read evidence only. It performs no GitHub read itself.

The snapshot must bind:

```text
repositoryIdentity
repositoryFullName
pullRequestNumber
canonicalBase
reviewedHead
baseRefIdentity
headRefIdentity
headRepositoryIdentity
forkClassification
snapshotObservedAt
snapshotEvidenceIdentity
```

Positive continuation requires exact equality between trigger repository/PR/head bindings and snapshot repository/PR/head bindings.

A fork classification must remain explicit. No fork status may be inferred from repository names alone.

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
reviewTemporalEvidenceIdentity
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
repositoryIdentity
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

The positive final evidence must bind at minimum:

```text
version
triggerEvidenceIdentity
repositoryIdentity
repositoryFullName
pullRequestNumber
canonicalBase
reviewedHead
actorLogin
actorEligibilityEvidenceIdentity
deliveryIdentity
payloadIdentity
mentionCommandIdentity
snapshotEvidenceIdentity
forkClassification
changedPathSetIdentity
changedPathCount
readEvidenceSetIdentity
readEvidenceCount
reviewRunIdentity
reviewTemporalEvidenceIdentity
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

A stricter closed field set is allowed if it preserves all required semantic bindings and remains schema-parity tested.

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
2. valid O1 trigger lineage is revalidated;
3. unsupported event name is rejected;
4. unsupported action is rejected;
5. repository mismatch is rejected;
6. PR-number mismatch is rejected;
7. reviewed-head mismatch is rejected;
8. actor/eligibility mismatch is rejected;
9. deterministic mention command identity;
10. changed paths are canonicalized deterministically;
11. duplicate changed paths are rejected;
12. invalid repository-relative paths are rejected;
13. supporting context does not count as changed-path coverage;
14. missing changed-path read produces incomplete state;
15. truncated changed-path read produces incomplete state;
16. exact full changed-path read coverage produces complete state;
17. completed exact-head reviewer run is accepted;
18. stale reviewer run is blocked;
19. provider failure/incomplete reviewer run is blocked;
20. temporal evidence mismatch is rejected;
21. finding identity set must equal reviewer run identities;
22. duplicate findings are rejected;
23. inline intent must bind an exact validated finding;
24. inline intent path mismatch is rejected;
25. invalid line anchors are rejected;
26. top-level summary intent is bounded;
27. duplicate publication intents are rejected;
28. publication bodies are not serialized in final evidence;
29. continuation cannot be caller-forged to READY;
30. forged derived identities fail validation;
31. changed head changes downstream identities;
32. changed review run changes downstream identities;
33. changed publication body changes publication intent identity;
34. Proxy and revoked Proxy inputs fail closed;
35. accessor/non-enumerable/symbol/custom-prototype inputs fail closed;
36. sparse/extra-property arrays fail closed;
37. unpaired Unicode/NUL/oversized text fails closed;
38. output is deeply frozen;
39. schema parses as Draft 2020-12 and has exact source surface parity;
40. source imports contain no side-effect/provider-specific/network surface;
41. exact implementation changed-path set remains three paths.

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
