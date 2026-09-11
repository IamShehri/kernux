# Kodac O4-B Bounded Read-Only GitHub Context Capability Authorization — 2026-09-11

## Record identity

```text
STATUS = AUTHORIZATION_CANDIDATE / NOT_CANONICAL
CLASS = O4-B BOUNDED READ-ONLY GITHUB CONTEXT CAPABILITY AUTHORIZATION ONLY
DECISION_OWNER = KODAC FOUNDER
CANONICAL_BASE = 5d36488bed564a9bedb8fb40e0f1293dc4688239
PREDECESSOR = PR #588 / POST_O4A_PROJECT_COMPLETION_AUDIT_AND_CURRENT_VIEW_RECONCILIATION / CLOSED_CANONICAL
PREDECESSOR_PROOF = PR #588 / comment 5627933112
SUCCESSOR_ANALYSIS = PR #588 / comment 5627969175 / ANALYSIS_ONLY
WAIVER = NO
```

This record authorizes no runtime mutation by itself. It is a one-path authorization candidate until independently qualified, normally merged into protected `main` under an exact expected-head precondition, and externally post-merge proven.

## Exact authorization-candidate scope

This authorization candidate may modify exactly one path:

```text
docs/planning/KODAC_O4B_BOUNDED_READ_ONLY_GITHUB_CONTEXT_AUTHORIZATION_2026-09-11.md
```

No second path may change in this authorization candidate. Runtime source/tests/schemas, workflows, dependencies, lockfiles, package metadata, current views, prior authorization/evidence records, rulesets, tags, releases, publication state, and deployment state remain frozen.

## Why O4-B is the next dependency

Fresh post-reconciliation inspection established:

```text
O1_AUTHENTICATED_ISSUE_COMMENT_EVIDENCE = BOUNDED_CANONICAL
O4A_PRODUCT_LINEAGE_AND_PUBLICATION_INTENT_EVIDENCE = BOUNDED_CANONICAL
WORKSPACE_LOCAL_REPOSITORY_READ_CAPABILITIES = PRESENT
PRODUCT_GITHUB_API_PR_REPOSITORY_READ_CLIENT = NOT_ESTABLISHED
REVIEWER_EXECUTION_RUNTIME_WITH_INJECTED_REVIEWER_PROVIDER = PRESENT
PRODUCTION_REVIEWER_PROVIDER_IMPLEMENTATION = NOT_ESTABLISHED
GITHUB_REVIEW_OR_COMMENT_PUBLICATION_CLIENT = NOT_ESTABLISHED
```

The controlling O4 product sequence is:

```text
MENTION_TRIGGER
-> BOUNDED REPOSITORY / PR READS
-> PROVIDER-NEUTRAL REVIEWER
-> INLINE FINDINGS / COMMENTS
-> REVIEW COMPLETENESS EVIDENCE
```

O4-A already consumes caller-materialized repository/PR/read evidence and canonical reviewer evidence but performs no network acquisition. No product GitHub REST/Octokit client exists under `packages/kodac-runtime/src`. CI-only GitHub API reads are governance evidence, not product runtime. Therefore the minimum next O4 dependency is a bounded read-only GitHub context capability.

## Conditional future implementation authority

Only after this authorization itself becomes externally post-merge proven `CLOSED_CANONICAL` may one future implementation candidate modify exactly these three paths:

```text
packages/kodac-runtime/src/github-review/o4b-bounded-read-only-github-context.ts
packages/kodac-runtime/test/o4b-bounded-read-only-github-context.test.ts
schema/o4b-bounded-read-only-github-context.schema.json
```

No fourth path is authorized. In particular, no root export, CLI wiring, package metadata, dependency, lockfile, workflow, O4-A source/test/schema, provider adapter, publication adapter, GitHub App, webhook listener, persistence layer, current-view file, release file, or deployment file may change under this authorization.

## Authorized implementation class

```text
IMPLEMENTATION_CLASS = BOUNDED_READ_ONLY_GITHUB_REST_CONTEXT_CAPABILITY
PROTOCOL_VERSION = kodac-o4b-bounded-read-only-github-context-v1
NETWORK = YES / HTTPS GET ONLY / API.GITHUB.COM ONLY / EXACT ROUTE ALLOWLIST
CALLER_SUPPLIED_CREDENTIAL_USE = YES / REQUEST HEADER ONLY
ENVIRONMENT_CREDENTIAL_DISCOVERY = NO
FILESYSTEM_CREDENTIAL_DISCOVERY = NO
CREDENTIAL_PERSISTENCE = NO
RAW_CREDENTIAL_SERIALIZATION = NO
REDIRECT_FOLLOWING = NO
ARBITRARY_URL_FETCH = NO
HTTP_WRITE_METHOD = NO
GITHUB_COMMENT_OR_REVIEW_WRITE = NO
BRANCH_WRITE = NO
MERGE_OR_APPROVAL = NO
K2_MUTATION = NO
PROVIDER_MODEL_EXECUTION = NO
SANDBOX_EXECUTION = NO
PERSISTENCE_OR_QUEUE = NO
CURRENT_VIEW_MUTATION = NO
RELEASE_OR_DEPLOYMENT = NO
PROJECT_COMPLETION = NO
```

The module is authorized to use the caller-supplied credential only to authenticate its own exact GitHub REST `GET` requests. It must not read a token from environment variables, config files, shell commands, Git credential helpers, global process state, or any other ambient source. The raw credential must not become model-visible data, an evidence field, a digest input, a log value, an error value, or a returned field.

A caller may inject a fetch-compatible transport for deterministic tests. Production behavior may default to the Node 24 global `fetch`, but all URL construction, method selection, redirect policy, headers, response bounds, and response validation remain owned by O4-B and may not be delegated to caller-provided arbitrary URLs.

## Exact network allowlist

The future implementation may issue only HTTPS `GET` requests whose origin is exactly:

```text
https://api.github.com
```

The only admitted route classes are:

```text
GET /repos/{BASE_OWNER}/{BASE_REPO}/pulls/{PR_NUMBER}
GET /repos/{BASE_OWNER}/{BASE_REPO}/pulls/{PR_NUMBER}/files?per_page=100&page={PAGE}
GET /repos/{CONTENT_OWNER}/{CONTENT_REPO}/contents/{ENCODED_REPOSITORY_PATH}?ref={EXACT_COMMIT_SHA}
```

Route constraints:

1. `{BASE_OWNER}/{BASE_REPO}` must equal the normalized exact repository full name supplied by the caller and the repository full name returned by the PR snapshot.
2. `{PR_NUMBER}` must equal the caller-supplied positive integer and the PR response number.
3. `{CONTENT_OWNER}/{CONTENT_REPO}` may be only the exact base repository or the exact head repository returned by and cross-checked against the PR snapshot and caller-supplied expected identity binding.
4. `{EXACT_COMMIT_SHA}` must be only the exact initial PR `base.sha` or `head.sha` admitted for the corresponding read role. Branch names, tags, symbolic refs, arbitrary SHAs, and caller-selected unrelated commits are not admitted.
5. Repository paths must be normalized repository-relative POSIX paths and each path segment must be percent-encoded by the implementation. Absolute paths, backslashes, dot segments, empty segments, NUL, URL delimiters used as structure, and traversal are rejected before URL construction.
6. Query keys and values are implementation-owned. Caller-controlled arbitrary query strings are forbidden.
7. Redirect following is forbidden. A redirect result must fail closed rather than forward the credential.
8. No `POST`, `PUT`, `PATCH`, `DELETE`, GraphQL mutation, general GraphQL query, archive download, raw-content host, arbitrary external host, or shell/`gh` execution is admitted.

The standard request headers may include only bounded implementation-owned values plus the caller credential:

```text
Accept: application/vnd.github+json
Authorization: Bearer <caller-supplied credential>
X-GitHub-Api-Version: 2022-11-28
User-Agent: kodac-o4b-read-only-context/1
```

No model- or repository-controlled text may become a header name or header value.

## Caller identity binding

The future input must require exact caller-materialized expected binding fields at minimum:

```text
expectedRepositoryId
expectedRepositoryFullName
pullRequestNumber
expectedPullRequestId
expectedBaseRepositoryId
expectedHeadRepositoryId
expectedHeadRepositoryFullName
expectedHeadSha
credentialPolicyIdentity
supportingPaths[]
```

All decimal IDs must use canonical positive decimal text. Repository names and paths must satisfy bounded closed grammar. `expectedHeadSha` must be lowercase 40-hex. `credentialPolicyIdentity` must be lowercase SHA-256 and binds the caller's credential-use policy without deriving any value from the raw credential.

The implementation must not claim that the credential itself is read-only. The capability is read-only because the implementation is structurally incapable of issuing a write method or non-allowlisted route. Credential scope/issuance remains caller authority outside O4-B.

## Initial and terminal PR snapshot gate

The implementation must fetch the PR snapshot before any changed-file or content read and must validate at minimum:

```text
repository.id
repository.full_name
pull_request.id
pull_request.number
base.repo.id
base.repo.full_name
base.ref
base.sha
head.repo.id
head.repo.full_name
head.ref
head.sha
```

The response must match every caller-supplied expected repository/PR/head identity. Fork classification is derived only from base/head repository identity equality.

After all admitted read operations complete, the implementation must fetch the exact same PR route again. Positive continuation requires both snapshots to agree on all authority-relevant fields, including exact base SHA and exact head SHA. Any base/head/repository/PR movement produces a fail-closed stale result or exception and must not be relabeled current.

The terminal snapshot must not be replaced by caller assertion, cached data, a branch name, or the initial response alone.

## O4-A-compatible snapshot projection

The implementation must reuse the canonical O4-A helper rather than reimplementing its identity algorithm:

```text
createO4aRepositorySnapshotInput(...)
```

The O4-A snapshot core must be derived from validated GitHub fields:

```text
repositoryId = exact base repository id
repositoryFullName = exact base repository full name
pullRequestNumber = exact PR number
pullRequestId = exact PR id
canonicalBase = exact initial/final base.sha
reviewedHead = exact initial/final head.sha
baseRepositoryId = exact base repository id
headRepositoryId = exact head repository id
headRepositoryFullName = exact head repository full name
forkClassification = SAME_REPOSITORY | FORK_REPOSITORY
baseRefIdentity = deterministic identity over exact base repository/ref/SHA
headRefIdentity = deterministic identity over exact head repository/ref/SHA
snapshotObservedAt = caller-injectable canonical UTC millisecond timestamp captured after the initial snapshot validates
```

O4-B must return the resulting O4-A `snapshot` projection and bind `snapshot.snapshotEvidenceIdentity` into its own final evidence identity.

## Changed-file enumeration

Changed files must be enumerated only from the exact PR files route with implementation-owned pagination:

```text
per_page = 100
page = 1..6
MAX_CHANGED_PATHS = 512
```

The implementation must request increasing integer pages itself and stop only after a page with fewer than 100 records. It must reject more than 512 unique changed-file records, duplicate normalized paths, duplicate page content that violates accounting, malformed records, unsupported path grammar, missing status, or response-shape ambiguity.

The accepted status vocabulary is closed to GitHub PR-file statuses needed by this capability:

```text
added
modified
removed
renamed
copied
changed
unchanged
```

A `renamed` record must contain a distinct valid `previous_filename`. A non-renamed record must not use `previous_filename` as authority. The implementation may retain GitHub's file blob SHA only as provider metadata and must not treat a PR-files `patch` field as proof of complete file content.

The canonical `changedPaths` projection is the sorted unique current PR-file path set and must not be caller-authored.

## Exact content-read semantics

Every changed path must receive exactly one O4-A-compatible `CHANGED_PATH` read projection. Caller-requested supporting paths may receive `SUPPORTING_CONTEXT` projections only when they are not changed paths.

For an `added`, `modified`, `renamed`, `copied`, `changed`, or `unchanged` changed path, the authoritative content revision is the exact PR head SHA in the exact head repository.

For a `removed` changed path, the authoritative content revision is the exact PR base SHA in the exact base repository so the removed content can still be reviewed. The richer O4-B content metadata must explicitly bind `contentRevisionKind=BASE_REMOVED` so this cannot be confused with current-head content.

Supporting context is read only from the exact PR head SHA in the exact head repository.

The GitHub contents response must be accepted as `FULL` only if all of the following hold:

```text
type = file
encoding = base64
path = exact requested normalized path
sha = valid lowercase 40-hex Git blob id
size = decoded byte length
size <= 1048576 bytes
decoded Git blob SHA-1 = response sha
content bytes decode as strict UTF-8 Unicode scalar text
```

The implementation must independently verify the Git blob object identity as SHA-1 over `"blob <byteLength>\0" + rawBytes`. It must compute a SHA-256 content identity over the exact decoded raw bytes for the O4-A projection.

GitHub `patch`, `raw_url`, `blob_url`, `html_url`, `download_url`, or arbitrary link fields are not content authority and must never be followed.

## Incomplete and unsupported content

The following content states must never become O4-A `FULL` reads:

```text
binary / non-UTF-8 content
content larger than 1048576 bytes
missing or omitted base64 content
symlink
directory
submodule
unsupported encoding
size/decoded-length mismatch
Git blob SHA mismatch
```

Malformed identity or integrity mismatch is a hard fail-closed error. A semantically valid but intentionally non-reviewable binary/oversized/unsupported regular-file case may be represented as `TRUNCATED` only if the implementation has enough exact provider metadata to create deterministic bounded evidence without inventing unseen bytes.

A `TRUNCATED` O4-A projection must use `byteLength` equal to the exact number of content bytes actually materialized for review, which may be zero, and a deterministic SHA-256 content identity that explicitly binds the non-full state, exact repository/revision/path, provider blob identity if available, declared size, and materialized prefix identity if any. It must not pretend that identity is a hash of unread full content.

Any changed-path `TRUNCATED` projection causes O4-A review completeness to remain non-positive. O4-B itself must expose a continuation decision that blocks review-complete continuation whenever any changed path is not `FULL`.

## Bounded content budgets

The exact limits are:

```text
MAX_CHANGED_PATHS = 512
MAX_SUPPORTING_PATHS = 128
MAX_READ_ITEMS = 640
MAX_FULL_FILE_BYTES = 1048576
MAX_TOTAL_MATERIALIZED_CONTENT_BYTES = 8388608
MAX_PR_RESPONSE_BYTES = 262144
MAX_FILES_PAGE_RESPONSE_BYTES = 2097152
MAX_CONTENT_RESPONSE_BYTES = 1572864
MAX_HTTP_REQUESTS = 650
MAX_NETWORK_TIMEOUT_MS = 30000
MAX_REPOSITORY_PATH_UTF8_BYTES = 1024
MAX_GENERAL_TEXT_UTF8_BYTES = 4096
MAX_CREDENTIAL_UTF8_BYTES = 4096
```

The implementation must reject or return non-positive bounded evidence before exceeding any count/content/request budget. It may not read an unbounded response with `response.json()` before enforcing the corresponding byte limit. Response bodies must be consumed through a bounded byte reader that aborts once the limit would be exceeded.

## HTTP and response safety

The future network implementation must:

1. use `redirect: "error"` or an equivalent fail-closed redirect policy;
2. never follow provider-supplied URLs;
3. never interpolate repository-controlled data without normalization and segment encoding;
4. bound each response before JSON parsing;
5. reject non-2xx status without including raw response bodies or credential material in errors;
6. accept only `application/json` or GitHub JSON-compatible content types for JSON routes;
7. use an `AbortController` and bounded timeout;
8. preserve caller cancellation if a caller signal is provided;
9. never retry automatically after a network error or unknown result under O4-B v1;
10. never treat rate-limit, 401, 403, 404, 409, 422, 429, 5xx, redirect, timeout, abort, or malformed JSON as successful read evidence.

No response body, URL, header, or repository text may cause a second arbitrary request outside the exact route derivation rules above.

## Credential and error non-disclosure

The future implementation must reject an empty, control-character-containing, NUL-containing, or over-bound credential before network use.

The raw credential must not be:

```text
returned
serialized
hashed into evidence
placed in an Error message
placed in Error.cause
logged
stored globally
written to disk
placed in a model request
placed in a publication intent
copied into request/query/path fields
```

Focused tests must use a distinctive sentinel credential and prove that the sentinel is absent from serialized results, evidence, thrown error text, and all non-Authorization request components.

## Rich O4-B result and evidence

The implementation may return a runtime result containing transient full content text for later context construction, but canonical evidence must remain bounded and content-addressed rather than embedding repository file bodies.

A successful result must include at least:

```text
snapshot = exact O4-A O4aRepositorySnapshotInput
changedPaths = canonical sorted exact changed-path set
readEvidence = canonical O4-A O4aReadEvidenceInput[]
contentItems = transient bounded runtime content items
readContextEvidence = canonical O4-B bounded evidence
```

Each transient content item must bind at least:

```text
path
readRole
changedFileStatus | null
previousPath | null
contentRepositoryId
contentRepositoryFullName
contentRevisionSha
contentRevisionKind = HEAD | BASE_REMOVED
providerBlobSha | null
providerDeclaredSize
materializedByteLength
contentIdentity
truncationState
contentText = full UTF-8 text only when FULL; otherwise null
readEvidenceIdentity
```

Canonical serialized O4-B evidence must include at least:

```text
version
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
credentialPolicyIdentity
snapshotEvidenceIdentity
changedPathSetIdentity
changedPathCount
readEvidenceSetIdentity
readEvidenceCount
fullReadCount
truncatedReadCount
supportingPathCount
changedFileMetadataSetIdentity
contentRecordIdentities[]
initialSnapshotResponseIdentity
terminalSnapshotResponseIdentity
filesPageResponseIdentities[]
requestCount
snapshotObservedAt
terminalObservedAt
continuationDecision
readContextEvidenceIdentity
```

The closed O4-B continuation vocabulary is:

```text
READY_FOR_O4A_REVIEW
BLOCK_INCOMPLETE_CHANGED_PATH_CONTEXT
```

`READY_FOR_O4A_REVIEW` requires every changed path to have exactly one `FULL` read, zero missing changed paths, zero truncated changed paths, initial/terminal exact base+head identity equality, and all count/integrity checks to pass. Supporting-context truncation may be represented but cannot satisfy changed-path coverage.

The final O4-B evidence identity must be a domain-separated SHA-256 over every serialized authority-relevant field. All returned records/arrays must be deeply frozen.

## O4-A compatibility requirements

The future implementation must import and use, not fork, the O4-A helpers:

```text
createO4aRepositorySnapshotInput
createO4aReadEvidenceInput
```

For every returned O4-A projection:

```text
validate by exact O4-A semantics = PASS
snapshot.reviewedHead = O4-B exact terminal head
snapshot.canonicalBase = O4-B exact terminal base
read.snapshotEvidenceIdentity = snapshot.snapshotEvidenceIdentity
read.reviewedHead = snapshot.reviewedHead
changed-path readRole = CHANGED_PATH
supporting-only readRole = SUPPORTING_CONTEXT
sourceKind = CALLER_MATERIALIZED_READ_EVIDENCE
```

O4-B must not modify O4-A code or reinterpret `READY_FOR_SEPARATE_PUBLICATION_AUTHORITY` as publication authority.

## Input and hostile-data hardening

Caller inputs and caller-injected adapter options must fail closed for Proxy/revoked Proxy, custom prototypes, accessors, symbol keys, non-enumerable own properties, sparse arrays, extra array properties, duplicate normalized paths, undefined values, unpaired Unicode surrogates, NUL, oversized values, unknown keys, unsupported enums, and non-canonical IDs.

Provider JSON is untrusted external data. The implementation must validate exact required/optional keys it consumes, primitive types, canonical numeric bounds, path grammar, repository names, commit/blob identities, status vocabulary, and pagination accounting before producing evidence.

Unknown provider fields may be ignored only when the GitHub REST endpoint is explicitly expected to be extensible and none of those unknown fields become authority. Fields used for authority must be independently normalized and validated.

## Required focused test matrix

The exact future test file must include at least these cases:

1. same-repository PR happy path produces `READY_FOR_O4A_REVIEW`;
2. fork PR happy path uses only exact validated head repository content routes;
3. repository id mismatch fails before content reads;
4. repository full-name mismatch fails;
5. PR id/number mismatch fails;
6. expected head mismatch fails on initial snapshot;
7. head movement during acquisition fails closed;
8. base movement during acquisition fails closed;
9. head/base repository identity movement fails closed;
10. changed-files pagination is implementation-owned and deterministic;
11. more than 512 changed paths fails closed;
12. duplicate changed paths fail closed;
13. renamed path requires a distinct normalized previous path;
14. changed current file reads exact head repository + exact head SHA;
15. removed file reads exact base repository + exact base SHA and records `BASE_REMOVED`;
16. supporting context reads exact head revision only;
17. supporting path colliding with a changed path is rejected or canonicalized away without duplicate read authority;
18. full UTF-8 content verifies provider Git blob SHA and decoded size;
19. provider Git blob SHA mismatch fails closed;
20. declared-size mismatch fails closed;
21. binary/non-UTF-8 content cannot become `FULL`;
22. oversized content cannot become `FULL`;
23. missing/unsupported content type cannot become `FULL`;
24. any truncated changed path blocks `READY_FOR_O4A_REVIEW`;
25. aggregate content byte budget fails closed before overflow;
26. per-response bounded reader aborts before unbounded JSON parsing;
27. non-2xx status fails without leaking response body/credential;
28. redirect is never followed;
29. timeout/abort fails closed with no automatic retry;
30. exact request method is GET and host is `api.github.com` only;
31. arbitrary URL or query injection is impossible from repository/path text;
32. distinctive credential appears only in the Authorization header and nowhere in result/evidence/error/URL;
33. implementation does not read credentials from environment/filesystem/shell;
34. O4-A snapshot helper parity passes;
35. O4-A read helper parity passes for every item;
36. changed/read identities and final evidence identity are deterministic for fixed transport/clock input;
37. changed provider response changes the bound response/evidence identity;
38. Proxy/revoked Proxy/accessor/symbol/non-enumerable/custom-prototype/sparse-array hostile input fails closed;
39. all returned arrays/records are deeply frozen;
40. schema parity validates exact serialized evidence and rejects unknown/forged fields;
41. source static scan proves no GitHub write route/method, no `child_process`, no shell/`gh`, no environment secret lookup, no filesystem secret read, and no provider/model invocation;
42. exact implementation diff contains only the three future authorized paths and no dependency/lockfile change.

## Schema requirements

The future schema must describe only canonical serialized O4-B evidence, not raw credential material or transient repository content bodies. It must use closed object shapes, `additionalProperties: false`, exact protocol version, closed continuation/fork enums, bounded integer counts, lowercase SHA-256 patterns, lowercase 40-hex Git SHA patterns, canonical repository/ID fields, and complete required-field parity with production evidence serialization.

Schema acceptance alone does not establish runtime trust. Production validation must independently rederive every derived identity and reject forged fields.

## Qualification requirements for the future implementation

The future three-path candidate must independently prove:

```text
BASE = THEN-CURRENT CANONICAL MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY 3
NO_NEW_DEPENDENCY = PASS
NO_LOCKFILE_CHANGE = PASS
NO_ROOT_EXPORT_CHANGE = PASS
NODE_VERSION = 24.x OR NEWER SUPPORTED NODE
FOCUSED_O4B_TESTS = PASS / FIRST EXECUTED ATTEMPT
TYPESCRIPT = PASS
FULL_RUNTIME_REGRESSION = PASS
PYTHON_UV_SYNC_FROZEN_DEV = PASS
PYTHON_PROVENANCE = PASS
PYTHON_PYTEST = PASS
PYTHON_RUFF = PASS
DIFF_CHECK = PASS
SCHEMA_PARITY = PASS
HOSTILE_INPUT_TESTS = PASS
STATIC_NO_WRITE_NO_SHELL_NO_ENV_SECRET_NO_PROVIDER_SCAN = PASS
PR_TRIGGERED_REQUIRED_CI = ORIGINAL ATTEMPT TERMINAL SUCCESS
SUBSTANTIVE_EXACT_HEAD_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
MERGE = NORMAL / EXACT EXPECTED_HEAD GUARD
POST_MERGE_APPLICABLE_WORKFLOWS = ORIGINAL ATTEMPT SUCCESS
EXTERNAL_POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

A tooling/environment failure before a test actually executes must be recorded truthfully and must not be rewritten as a passing test. A real candidate failure may be fixed only by a new normal commit and fresh original-attempt CI on the successor head. No force-push, rebase, amend, destructive history rewrite, stale evidence reuse, rerun-to-green where original-attempt evidence matters, or ruleset bypass is permitted.

## Closure semantics

This authorization cannot certify itself. Only complete external post-merge proof may classify:

```text
O4B_BOUNDED_READ_ONLY_GITHUB_CONTEXT_CAPABILITY_AUTHORIZATION = CLOSED_CANONICAL
```

Even after that closure, only the exact three-path O4-B implementation becomes eligible. It would not authorize GitHub review/comment publication, provider/model execution, GitHub App/webhook deployment, persistence, O5 sandbox work, K2 mutation, phase-overall closure, release, deployment, production-readiness, or project completion.

After any future O4-B implementation receives its own external post-merge proof, fresh successor analysis must determine the next dependency. Numbering alone cannot authorize a provider adapter, publisher, O5, or any later unit.
