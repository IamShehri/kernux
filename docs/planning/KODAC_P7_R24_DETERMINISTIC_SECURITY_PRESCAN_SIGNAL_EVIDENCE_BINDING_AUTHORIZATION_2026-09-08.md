# Kodac P7-R24 — Deterministic Security Pre-scan Signal Evidence Binding Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY UNTIL MERGED AND POST-PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = f38d6dafb60764b8572f073d9d75f1231ab5bc7c
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = 0a00049361dd0bc0ba356dbceb218e8340774560
P7_R23_IMPLEMENTATION = CLOSED_CANONICAL / PR #450 / proof 5576403450
P7_R23_STATE = REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY
P7_R23_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #452 / proof 5576546888
POST_R23_SUCCESSOR_ANALYSIS = PR #452 / comment 5576567428 / ANALYSIS_ONLY
TENCENT_DONOR_SYNTHESIS_AND_COMPLETE_REVIEW_MASTER_PLAN_V3 = CLOSED_CANONICAL / PLANNING_ONLY / PR #448 / proof 5575897235
P6_R1_DETERMINISTIC_SECURITY_FINDING = EXISTING_CANONICAL FOUNDATION / DISTINCT SEMANTICS
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This is one bounded authorization candidate. `P7-R24` is a label, not authority by numbering. Future implementation authority exists only after this exact candidate independently qualifies, merges guarded into protected `main`, and receives complete mandatory post-merge proof.

Live GitHub truth, root `AGENTS.md`, canonical evidence and exact authorization records override this document.

## 2. Non-duplication boundary

Canonical P6-R1 normalizes already-existing deterministic analyzer output into a provider-neutral security-finding identity. It explicitly does not execute a scanner/analyzer, decode raw inputs, ingest raw match payloads, or establish truth.

P7-R24/A2 has a distinct purpose: derive deterministic **pre-scan signals** from caller-supplied bounded bytes for every path already admitted as reviewable text by one exact R23 review-universe record, while proving those supplied bytes correspond to the exact R23 descriptor/Git object.

Required separation:

```text
DETERMINISTIC_PRE_SCAN_SIGNAL != P6_DETERMINISTIC_SECURITY_FINDING
DETERMINISTIC_PRE_SCAN_SIGNAL != REVIEWER_FINDING
DETERMINISTIC_PRE_SCAN_SIGNAL != VERIFIED_FINDING
PRE_SCAN_ZERO_SIGNALS != CLEAN_SCAN
PRE_SCAN_ZERO_SIGNALS != COMPLETE_REVIEW
```

No implementation under this authorization may automatically promote a signal into P6-R1, reviewer, verifier, risk-coverage, K5 or Done Gate truth.

## 3. Exact future implementation allowlist

Only after this authorization becomes `CLOSED_CANONICAL` may one implementation candidate modify exactly:

```text
packages/kodac-runtime/src/remediation/p7-deterministic-security-prescan-evidence-binding.ts
schema/p7-deterministic-security-prescan-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r24-deterministic-security-prescan-evidence-binding.test.ts
```

No fourth path is authorized.

Not authorized: package-root exports, `index.ts`, CLI/API/product integration, workflow changes, dependencies/lockfiles, donor-source vendoring, provenance registries, P6 mutation, R23 mutation, K2/K5 mutation, current-view mutation, release configuration, rulesets or repository protection.

If correctness requires a fourth path or new dependency, stop and create a separate canonical authorization amendment instead of broadening this unit.

## 4. Exact R23 lineage reconstruction

The future implementation must accept both:

```text
reviewUniverseBuildInput: P7ReviewCoverageUniverseEvidenceBindingBuildInput
reviewUniverseEvidence: P7ReviewCoverageUniverseEvidenceBinding
```

It must use the existing canonical R23 functions rather than duplicate their semantics:

```text
buildP7ReviewCoverageUniverseEvidenceBinding(reviewUniverseBuildInput)
validateP7ReviewCoverageUniverseEvidenceBinding(reviewUniverseEvidence)
```

The rebuilt R23 result must have the exact same `evidenceIdentity` as the supplied validated R23 evidence. Any subject, descriptor, ordering, disposition, identity or output tampering must therefore fail closed.

This reconstruction exposes the exact R23 descriptor projection needed by A2 without widening the R23 serialized output contract.

The A2 subject remains bound to:

```text
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
reviewUniverseIdentity
reviewableTextPaths
```

## 5. Exact complete source-set rule

The source set is complete and closed relative to R23 reviewable text:

```text
SCANNED_PATH_SET = R23_REVIEWABLE_TEXT_PATH_SET
SOURCE_RECORD_COUNT = R23_REVIEWABLE_TEXT_PATH_COUNT
ONE_SOURCE_RECORD_PER_REVIEWABLE_TEXT_PATH = REQUIRED
MISSING_REVIEWABLE_TEXT_SOURCE = REJECT
EXTRA_SOURCE_PATH = REJECT
DUPLICATE_SOURCE_PATH = REJECT
```

This equality also applies when `reviewableTextPaths` is empty.

For every scanned path, the reconstructed R23 descriptor must be the exact descriptor whose `path` matches the source path and whose canonical R23 semantics establish:

```text
objectKind = regular_file
objectIdentity = non-null lowercase Git SHA-1
contentDisposition = reviewable_text
encodingDisposition = utf8 | utf8_bom
fileMode = 100644 | 100755
```

Opaque, generated, referenced-hidden, unreadable, unsupported-encoding, oversized, symlink, submodule, LFS, policy-excluded and deleted paths remain explicit R23 dispositions and cannot be supplied as successfully scanned A2 text.

## 6. Exact bounded source-input and Git-object proof

Each A2 source record contains only:

```text
path
rawByteIdentity = lowercase SHA-256
rawByteLength
rawBytesBase64
```

No caller-controlled encoding label is required. Encoding is derived deterministically from the reconstructed R23 descriptor plus the actual raw bytes.

The implementation must:

1. validate canonical base64 with exact round-trip equality rather than relying on permissive decoder behavior;
2. enforce explicit source-count, per-source byte and aggregate-byte limits before expensive processing;
3. decode base64 in memory;
4. recompute SHA-256 over the exact raw bytes and require equality with `rawByteIdentity`;
5. require `rawByteLength` to equal both the decoded byte length and the reconstructed R23 descriptor `byteSize`;
6. recompute the canonical Git blob object identity in memory as `SHA1("blob " + byteLength + "\\0" + rawBytes)` and require equality with the reconstructed R23 descriptor `objectIdentity`;
7. if descriptor `encodingDisposition == utf8_bom`, require exact UTF-8 BOM bytes `EF BB BF` and strip exactly that BOM before decoded-text matching;
8. if descriptor `encodingDisposition == utf8`, reject a leading UTF-8 BOM;
9. decode the remaining bytes as UTF-8 with fatal malformed-input behavior;
10. derive SHA-256 `decodedTextIdentity` over the exact decoded Unicode text representation used for matching;
11. never expose raw source bytes or raw matched text in serialized output.

This provides a pure in-memory proof that the scanned bytes correspond to the exact R23-bound Git blob without filesystem or Git execution.

No charset-guessing dependency is authorized. `chardet`, donor Python code and ambient platform locale are not trust inputs.

## 7. Required deterministic rule model

The implementation must define a closed, versioned Kodac-owned rule registry. Each rule binds:

```text
ruleId
ruleVersion
category
externalTaxonomyMappings
```

The initial registry may independently reimplement a small high-value subset of the pinned AI-Infra-Guard static patterns, purpose-equivalent to:

```text
remote_pipe_to_shell
cloud_metadata_access
credential_path_access
prompt_injection_indicator
reverse_shell_indicator
decode_then_execute
sensitive_data_exfiltration_indicator
persistence_mechanism_indicator
ssh_key_write_indicator
suspicious_executable_download
```

Exact Kodac regexes/algorithms are Kodac-owned implementation and must be reviewed as such. Donor names/descriptions and T01-T09 labels are reference inputs only.

`externalTaxonomyMappings` must be a deterministic sorted bounded list of inert versioned identifiers. Mapping presence does not establish Kodac risk applicability or coverage.

## 8. Required signal evidence semantics

Each output signal binds at least:

```text
signalIdentity
ruleId
ruleVersion
externalTaxonomyMappings
path
sourceGitObjectIdentity
sourceRawByteIdentity
sourceDecodedTextIdentity
startLine
endLine
startColumn
endColumn
matchedTextDigest
```

Range semantics are closed:

```text
INDEX_BASE = 1
COLUMN_UNIT = UNICODE_CODE_POINT
RANGE_END = INCLUSIVE
LINE_BREAK_LF = ONE_LINE_BREAK
LINE_BREAK_CRLF = ONE_LINE_BREAK
BARE_CR = ORDINARY_CODE_POINT_UNLESS_MATCHED_BY_RULE
ZERO_LENGTH_MATCH = FORBIDDEN
```

All line/column values are positive safe integers. Same-line ranges require `startColumn <= endColumn`. The range must identify exactly the matched non-empty Unicode text slice. CRLF/LF behavior must be identical across Ubuntu, macOS and Windows and must not depend on host locale, path APIs or filesystem state.

`matchedTextDigest` is SHA-256 over the exact matched decoded-text slice. Raw matched text, secret-like content, prose snippets, stdout, stderr and provider output are forbidden from serialized evidence.

Signals use deterministic canonical ordering by path, start/end range, rule identity and signal identity. Exact duplicate semantic signals are deterministically deduplicated before identity calculation; conflicting duplicate identities fail closed.

## 9. Required aggregate evidence semantics

The result carries a constant state purpose-equivalent to:

```text
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY
```

and binds at least:

```text
version
evidenceIdentity
state
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
reviewUniverseIdentity
sourceSetIdentity
ruleSetIdentity
sourceCount
scannedPaths
signalCount
signals
```

Required equalities:

```text
scannedPaths = R23 reviewableTextPaths in canonical order
sourceCount = length(scannedPaths)
```

`sourceSetIdentity` content-addresses the complete canonical source projection including path, Git object identity, raw-byte identity, byte length, decoded-text identity and encoding disposition.

`ruleSetIdentity` content-addresses exact closed rule semantics including rule versions and external mappings.

`evidenceIdentity` binds the complete canonical output core and exact R23 subject context.

A zero-signal result remains only `DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY`; there is no serialized `clean`, `safe`, `passed`, `complete`, `verified` or equivalent truth field.

## 10. Donor source discipline

Pinned study/derivation input:

```text
REPOSITORY = Tencent/AI-Infra-Guard
HEAD = e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c
TREE = 19aca1c5f39358e59c80b0e4f282d69b048134d3
LICENSE = Apache-2.0
pre_scan.py = 262807b8ec15ba8c67d839070e2b2f3d5271086f
text_decoder.py = d01135924522f74087c9412e49a21a34574a4781
hidden-content tests = ccd8eae42e4a1480491053a3afb95dd31b3620f5
```

Preferred reuse:

```text
REIMPLEMENTED / DERIVED SMALL ALGORITHMS + TEST PATTERNS
```

No wholesale donor runtime copy, Python runtime, `chardet`, donor service/model/network call, SARIF trust root, donor dependency graph or donor credential surface is authorized.

If implementation would copy donor source text instead of independently reimplementing behavior, stop and create a separately scoped source-admission amendment with exact copied path/line attribution and Apache-2.0 compliance before use.

## 11. Hostile-input and determinism requirements

The implementation must be pure, synchronous, deterministic and data-only and fail closed on at least:

```text
Proxy or revoked Proxy
accessor/getter properties
symbol properties
custom object/array prototypes
sparse or extra-property arrays
aliases and cycles
non-JSON graph values where JSON data is required
invalid Unicode scalar strings
non-canonical paths
unknown or missing fields
invalid SHA-1/SHA-256
R23 build-input/evidence mismatch
invalid or non-canonical base64
raw-byte digest mismatch
raw-byte length mismatch
R23 descriptor byteSize mismatch
Git blob SHA-1 mismatch
malformed UTF-8
missing or unexpected UTF-8 BOM
missing reviewable-text source
duplicate source path
extra source path
over-limit source count / source bytes / aggregate bytes / signal count
unknown rule or taxonomy mapping
zero-length regex match
invalid signal range
output/evidence identity tampering
```

Returned evidence must be detached and deeply immutable.

## 12. Required implementation tests

The exact implementation test path must prove at least:

1. deterministic equivalent-input success;
2. exact R23 build-input reconstruction and evidence-identity equality;
3. R23 build-input/evidence tamper rejection;
4. exact `scannedPaths == reviewableTextPaths` equality;
5. missing/duplicate/extra source rejection;
6. empty reviewable-text set deterministic success with empty sources;
7. canonical base64 round-trip and raw SHA-256 equality;
8. source byte length equals raw bytes and R23 descriptor `byteSize`;
9. computed in-memory Git blob SHA-1 equals R23 descriptor `objectIdentity`;
10. UTF-8 and UTF-8-BOM behavior derived from R23 descriptor;
11. malformed UTF-8 and BOM mismatch rejection;
12. CRLF/LF stable 1-based inclusive Unicode-code-point ranges;
13. Unicode range stability and zero-length-match rejection;
14. each initial rule positive case;
15. near-miss/benign negative cases sufficient to catch obvious overbroad matching;
16. multiple matches, exact duplicate deduplication and deterministic ordering;
17. deterministic `matchedTextDigest`, `sourceSetIdentity`, `ruleSetIdentity`, `signalIdentity` and `evidenceIdentity`;
18. secret-like matches expose digest/range/identity only, never captured bytes/text;
19. zero-signal output remains bounded observation only;
20. no automatic conversion to P6-R1 deterministic finding;
21. schema/validator reject unknown/extra output fields;
22. Proxy/accessor/symbol/prototype/sparse/alias/cycle hostile cases;
23. caller mutation cannot alter returned evidence;
24. no filesystem, Git process, provider/model, network, secret retrieval, SARIF, K2, K5, persistence, patch/autofix, package publication or deployment side effects;
25. production source contains no forbidden imports/APIs that introduce those surfaces.

## 13. Closed JSON Schema requirement

`schema/p7-deterministic-security-prescan-evidence-binding.schema.json` is a closed JSON Schema matching the serialized output.

At minimum:

```text
additionalProperties = false at every serialized object boundary
state = constant bounded state
version = constant implementation version
Git/SHA identities = exact patterns
counts/ranges = bounded integers
signals = bounded closed array of closed signal objects
no raw bytes field in output
no raw matched text field
no clean/safe/pass/verified/complete truth field
```

## 14. Mandatory non-equivalences and non-grants

```text
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != P6_DETERMINISTIC_SECURITY_FINDING
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != REVIEWER_FINDING
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != VERIFIED_FINDING
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != CLEAN_SCAN
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != PATH_REVIEW_COVERAGE_PROOF
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != RISK_COVERAGE_PROOF
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != SKILL_COVERAGE_PROOF
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != PROVIDER_TERMINATION_REASON_PROOF
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != PROVIDER_INVOCATION_PROVENANCE_PROOF
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != VERIFIED
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != FIXED
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != REVERIFIED
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != K5_RECONCILIATION_PROOF
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY != DONE_GATE_PROOF
P7_R24_CLOSED != P7_OVERALL_CLOSED
P7_R24_CLOSED != P8_P9_AUTHORITY
P7_R24_CLOSED != RELEASE_AUTHORITY
P7_R24_CLOSED != PROJECT_COMPLETION
```

Preserved non-grants:

```text
P6_R1_MUTATION = NOT_AUTHORIZED
R23_MUTATION = NOT_AUTHORIZED
SCANNER_PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED
FILESYSTEM_GIT_PROCESS_EXECUTION = NOT_AUTHORIZED
NETWORK_SECRET_ACCESS = NOT_AUTHORIZED
SARIF_INGESTION = NOT_AUTHORIZED
NEW_DEPENDENCY = NONE
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
PATCH_AUTOFIX_EXECUTION = NOT_AUTHORIZED
K2_K5_INVOCATION_OR_MUTATION = NOT_AUTHORIZED
CLI_API_PACKAGE_ROOT_PRODUCT_INTEGRATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## 15. Qualification requirements for this authorization candidate

One unchanged exact head must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
P7_R23_RECONCILIATION_PROOF = EXACTLY_REVERIFIED / 5576546888
POST_R23_SUCCESSOR_ANALYSIS = EXACTLY_REVERIFIED / 5576567428 / ANALYSIS_ONLY
V3_A2_SEMANTICS = EXACTLY_REVERIFIED
P6_R1_NON_DUPLICATION_BOUNDARY = EXACTLY_REVERIFIED
R23_RECONSTRUCTION_FUNCTIONS = EXACTLY_REVERIFIED
R23_REVIEWABLE_TEXT_DESCRIPTOR_RULES = EXACTLY_REVERIFIED
DONOR_SNAPSHOT_IDENTITIES = EXACTLY_REVERIFIED
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_PATH_FILTER_NON_APPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
WAIVER = NO
```

Any new candidate commit invalidates prior exact-head review and CI evidence.

## 16. Mandatory post-merge proof

The authorization becomes canonical only after proof of:

```text
PR = CLOSED / MERGED
CANONICAL_MAIN = exact merge commit
ORDERED_PARENT_1 = exact pre-merge canonical main
ORDERED_PARENT_2 = exact qualified candidate head
MERGE_TREE = exact qualified-head tree
AUTHORIZATION_BLOB_ON_MAIN = qualified authorization blob
MERGE_SIGNATURE = VALID
MERGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
POST_MERGE_GOVERNANCE = SUCCESS
POST_MERGE_K2_RUNTIME = EXACT_CANONICAL_APPLICABILITY_RESULT
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
WAIVER = NO
```

Only then may the exact three-path implementation allowlist become active.

## 17. Candidate conclusion

```text
P7_R24_DETERMINISTIC_SECURITY_PRESCAN_SIGNAL_EVIDENCE_BINDING_AUTHORIZATION = AUTHORIZATION_CANDIDATE / NOT_CANONICAL
FUTURE_ALLOWED_IMPLEMENTATION_PATH_COUNT_IF_CLOSED_CANONICAL = 3
CURRENT_IMPLEMENTATION_AUTHORITY = NO
A2_IMPLEMENTATION_AUTHORITY = NO
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```
