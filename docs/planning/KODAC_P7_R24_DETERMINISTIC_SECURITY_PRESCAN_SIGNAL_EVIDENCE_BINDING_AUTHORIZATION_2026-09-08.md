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

This document is one bounded authorization candidate only. The descriptive label `P7-R24` does not create authority by numbering. The future implementation described below becomes eligible only if this exact one-path authorization candidate independently qualifies, merges through protected `main` with exact-head guarding, and receives complete mandatory post-merge proof.

Live GitHub truth, root `AGENTS.md`, canonical evidence and exact authorization records override this document.

## 2. Why this unit is non-duplicative

Canonical P6-R1 normalizes already-existing deterministic analyzer output into a provider-neutral security-finding identity. It explicitly does not execute a scanner/analyzer, decode raw inputs, ingest raw match payloads, or establish truth.

P7-R24/A2 has a different bounded purpose: derive deterministic **pre-scan signals** from caller-supplied bounded bytes for paths already admitted as reviewable text by the exact R23 review-universe evidence, then content-address those signals and their source/range identities.

Required separation:

```text
DETERMINISTIC_PRE_SCAN_SIGNAL != P6_DETERMINISTIC_SECURITY_FINDING
DETERMINISTIC_PRE_SCAN_SIGNAL != REVIEWER_FINDING
DETERMINISTIC_PRE_SCAN_SIGNAL != VERIFIED_FINDING
PRE_SCAN_ZERO_SIGNALS != CLEAN_SCAN
PRE_SCAN_ZERO_SIGNALS != COMPLETE_REVIEW
```

No future implementation under this authorization may automatically promote a signal into P6-R1, reviewer, verifier, risk-coverage, K5 or Done Gate truth.

## 3. Exact future implementation allowlist

Only after this authorization becomes `CLOSED_CANONICAL` may one implementation candidate modify exactly:

```text
packages/kodac-runtime/src/remediation/p7-deterministic-security-prescan-evidence-binding.ts
schema/p7-deterministic-security-prescan-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r24-deterministic-security-prescan-evidence-binding.test.ts
```

No fourth path is authorized.

In particular, this authorization does not permit package-root exports, `index.ts`, CLI/API/product integration, workflow changes, dependency or lockfile changes, donor source vendoring, provenance registry changes, P6 source/schema/test changes, R23 source/schema/test changes, K2/K5 changes, current-view changes, release configuration, ruleset changes or repository-protection changes.

If a correct implementation requires any fourth path or new dependency, stop and create a new canonical authorization amendment instead of broadening this unit.

## 4. Canonical predecessor binding

The future implementation must consume and revalidate one exact canonical P7-R23 `P7ReviewCoverageUniverseEvidenceBinding` through the existing R23 validator rather than duplicating R23 subject or universe semantics.

The A2 subject is therefore bound to:

```text
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
reviewUniverseIdentity
reviewableTextPaths
```

A supplied source path that is absent from R23 `reviewableTextPaths` must fail closed. Opaque, generated, hidden-payload, unreadable, unsupported-encoding, oversized, symlink, submodule, LFS, policy-excluded and deleted paths remain R23 coverage dispositions; A2 must not silently recast them as successfully scanned text.

## 5. Exact bounded source-input model

The future implementation may accept only caller-supplied inert data. It must not read the filesystem or invoke Git.

Each supplied pre-scan source record must bind at least:

```text
path
rawByteIdentity = lowercase SHA-256
rawByteLength
rawBytesBase64
encoding = UTF8 | UTF8_BOM
```

The implementation must:

1. validate canonical base64 encoding and decode it in memory;
2. enforce explicit per-source and aggregate byte limits before expensive processing;
3. recompute SHA-256 over the decoded raw bytes and require equality with `rawByteIdentity`;
4. require `rawByteLength` to equal the exact decoded byte length;
5. decode only the explicitly supported deterministic UTF-8 / UTF-8-BOM policy;
6. reject malformed UTF-8, unsupported encodings, invalid BOM claims or content inconsistent with the R23 reviewable-text disposition;
7. derive and expose a SHA-256 `decodedTextIdentity` over the exact decoded Unicode text representation used for matching;
8. never expose raw source bytes or raw matched text in the output evidence.

No charset-guessing dependency is authorized. In particular, `chardet`, donor Python code and ambient platform locale are not trust inputs.

## 6. Required deterministic rule model

The future implementation must define a closed, versioned Kodac-owned deterministic rule registry. Each rule must have:

```text
ruleId
ruleVersion
category
externalTaxonomyMappings
```

The initial registry may reimplement a small high-value subset of the pinned AI-Infra-Guard static patterns, including purpose-equivalent signals for:

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

The exact Kodac regexes/algorithms must be reviewed as Kodac-owned implementation. Donor rule names, descriptions or T01-T09 labels are reference inputs only.

`externalTaxonomyMappings` must be a deterministic sorted bounded list of inert versioned mapping identifiers. An external mapping does not create Kodac risk applicability or coverage truth.

## 7. Required signal evidence semantics

Each output signal must bind at least:

```text
signalIdentity
ruleId
ruleVersion
externalTaxonomyMappings
path
sourceRawByteIdentity
sourceDecodedTextIdentity
startLine
endLine
startColumn
endColumn
matchedTextDigest
```

Range rules:

- line and column numbers are 1-based positive safe integers;
- `startLine <= endLine`;
- same-line signals require `startColumn <= endColumn`;
- ranges must deterministically identify the exact matched Unicode text slice under the implementation's documented line-ending semantics;
- LF and CRLF handling must be deterministic across Ubuntu, macOS and Windows;
- range calculation must not depend on host locale or filesystem APIs.

`matchedTextDigest` must be SHA-256 over the exact matched text slice. The raw matched text, secret-like content, prose snippet, stdout, stderr or provider output must not appear in the serialized result.

Signal ordering must be deterministic by canonical path, source/range, rule identity and signal identity. Duplicate semantic signals must either deterministically deduplicate or fail closed under one documented rule; behavior must be tested and schema-aligned.

## 8. Required aggregate evidence semantics

The bounded result must include a versioned state exactly purpose-equivalent to:

```text
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY
```

and bind at least:

```text
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

`sourceSetIdentity` must content-address the canonical supplied source projection including path/raw-byte/decoded-text identities and deterministic encoding metadata.

`ruleSetIdentity` must content-address the exact closed rule registry semantics used for this result, including rule versions and external mappings.

`evidenceIdentity` must bind the entire canonical output core and exact R23 subject context.

A zero-signal result is permitted as a bounded observation but must remain only:

```text
DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY
```

It must not emit a `clean`, `safe`, `passed`, `complete`, `verified` or equivalent truth field.

## 9. Donor source discipline

Pinned donor input is limited to study/derivation from:

```text
REPOSITORY = Tencent/AI-Infra-Guard
HEAD = e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c
TREE = 19aca1c5f39358e59c80b0e4f282d69b048134d3
LICENSE = Apache-2.0
pre_scan.py = 262807b8ec15ba8c67d839070e2b2f3d5271086f
text_decoder.py = d01135924522f74087c9412e49a21a34574a4781
hidden-content tests = ccd8eae42e4a1480491053a3afb95dd31b3620f5
```

Preferred reuse class:

```text
REIMPLEMENTED / DERIVED SMALL ALGORITHMS + TEST PATTERNS
```

No wholesale donor runtime copy is authorized. No Python runtime, `chardet`, donor service, donor model, donor network call, SARIF trust root, donor dependency graph or donor credential surface is authorized.

If implementation copies source text rather than independently reimplementing behavior, stop and create a separately scoped source-admission amendment with exact copied line/path attribution and Apache-2.0 notice handling before using that code.

## 10. Hostile-input and determinism requirements

The future implementation must remain pure, synchronous, deterministic and data-only. It must fail closed on at least:

```text
Proxy or revoked Proxy input
accessor/getter properties
symbol properties
custom object/array prototypes
sparse or extra-property arrays
aliases and cycles
non-JSON graph values where JSON data is required
invalid Unicode scalar strings
non-canonical paths
unknown or missing fields
invalid SHA-1/SHA-256 identities
invalid base64 or non-canonical base64
raw-byte digest or length mismatch
malformed UTF-8
invalid UTF-8 BOM semantics
duplicate source paths
source path outside R23 reviewableTextPaths
source/universe subject mismatch
over-limit source count / source bytes / aggregate bytes / signal count
unknown rule or taxonomy mapping
invalid or inconsistent signal ranges
output/evidence identity tampering
```

Returned evidence must be detached and deeply immutable.

## 11. Required implementation tests

The exact implementation test path must prove at least:

1. deterministic equivalent-input success;
2. exact R23 subject/review-universe identity binding;
3. R23 evidence tamper rejection;
4. source path must be in `reviewableTextPaths`;
5. raw bytes base64 round-trip, byte length and SHA-256 equality;
6. UTF-8 and UTF-8-BOM decoding;
7. malformed/unsupported encoding rejection;
8. CRLF/LF stable line/column ranges;
9. Unicode range stability;
10. each initial rule positive case;
11. near-miss/benign negative cases sufficient to prevent obvious overbroad matching;
12. multiple matches and deterministic ordering;
13. deterministic `matchedTextDigest`, `sourceSetIdentity`, `ruleSetIdentity` and `evidenceIdentity`;
14. secret-like match evidence contains only digest/range/identity, never captured bytes/text;
15. zero-signal output remains bounded observation only;
16. no automatic conversion to P6-R1 deterministic finding;
17. unknown/extra output fields rejected by schema/validator;
18. hostile Proxy/accessor/symbol/prototype/sparse/alias/cycle cases;
19. caller mutation cannot alter returned output;
20. no filesystem, Git, process, provider/model, network, secret retrieval, SARIF, K2, K5, persistence, patch/autofix, package publication or deployment side effects;
21. source contains no forbidden imports or APIs that would introduce those side-effect surfaces.

## 12. Closed JSON Schema requirement

`schema/p7-deterministic-security-prescan-evidence-binding.schema.json` must be a closed JSON Schema matching the bounded serialized output contract.

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

## 13. Mandatory non-equivalences and non-grants

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

Also preserved:

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

## 14. Qualification requirements for this authorization candidate

This documentation-only candidate may qualify only if one unchanged exact head proves:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
P7_R23_RECONCILIATION_PROOF = EXACTLY_REVERIFIED / 5576546888
POST_R23_SUCCESSOR_ANALYSIS = EXACTLY_REVERIFIED / 5576567428 / ANALYSIS_ONLY
V3_A2_SEMANTICS = EXACTLY_REVERIFIED
P6_R1_NON_DUPLICATION_BOUNDARY = EXACTLY_REVERIFIED
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

## 15. Mandatory post-merge proof for this authorization

The authorization does not become canonical merely because GitHub reports the PR merged. Post-merge proof must establish at minimum:

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

Only after that complete proof may the three-path implementation allowlist become active.

## 16. Candidate conclusion

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
