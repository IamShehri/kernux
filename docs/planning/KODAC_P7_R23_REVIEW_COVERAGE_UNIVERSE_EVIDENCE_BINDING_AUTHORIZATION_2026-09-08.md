# Kodac P7-R23 — Review Coverage Universe Evidence Binding Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY UNTIL_MERGED_AND_POST_PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Record identity and canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 45b079c133f9965b870f002ece5042a2c00cf8c4
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = b98610c68da8e26052769f79fa9c238f7a1667e0
P7_R22_RECONCILIATION = CLOSED_CANONICAL / PR #447 / proof 5575697294
TENCENT_DONOR_SYNTHESIS_V3 = CLOSED_CANONICAL / PR #448 / proof 5575897235
POST_V3_SUCCESSOR_ANALYSIS = PR #448 / comment 5576071930 / ANALYSIS_ONLY
V3_PLAN_BLOB = c759a0dc91d1d65cf78847b9b7caa0d90ed08809
P7_R22_SOURCE_BLOB = 64dfe746cd30a6fd253c29d91dd2e31191f35627
P7_OVERALL = NOT_CLOSED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This authorization candidate is documentation-only. While unmerged or lacking complete post-merge proof, it creates no runtime, source-import, dependency, provider/model, scanner, network, secret, filesystem/Git, persistence, K2, K5, Done Gate, release or project-completion authority.

The founder has supplied source-reuse permission for the studied donors. This record treats that permission as removing a rights barrier only. It does not convert donor source into canonical Kodac source and does not authorize copying any donor file into the repository in this unit.

---

## 2. Why P7-R23 is the minimum non-duplicative successor

Canonical P7 currently proves, in bounded composition:

```text
P7-R20 = exact-target-head zero-finding review-run evidence binding
P7-R21 = temporal post-verification exact-head review evidence binding
P7-R22 = exact-target-head complete current review-context evidence binding
```

R22 explicitly does not prove:

```text
CHANGED_REVIEWED_UNREVIEWED_PATH_COVERAGE_PROOF
RISK_COVERAGE_PROOF
SKILL_COVERAGE_PROOF
PROVIDER_TERMINATION_REASON_PROOF
FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF
```

The canonical V3 master plan defines dependency-ordered Track A and puts **Review Coverage Universe** first. The next missing fact is therefore not another provider call, not risk scoring, and not skill selection. It is one deterministic statement of what exact changed-path surface exists and how every path is classified for later review-coverage accounting.

P7-R23 is authorized by this record only if this authorization itself independently qualifies, merges guarded, and receives complete post-merge proof.

---

## 3. Donor-informed design basis

Primary donor reference is the exact AI-Infra-Guard snapshot already pinned by the V3 plan:

```text
REPOSITORY = Tencent/AI-Infra-Guard
HEAD = e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c
TREE = 19aca1c5f39358e59c80b0e4f282d69b048134d3
LICENSE = Apache-2.0

skill-scan/skill_scan/utils/pre_scan.py
  = 262807b8ec15ba8c67d839070e2b2f3d5271086f
skill-scan/skill_scan/utils/text_decoder.py
  = d01135924522f74087c9412e49a21a34574a4781
skill-scan/pytests/test_hidden_content.py
  = ccd8eae42e4a1480491053a3afb95dd31b3620f5
skill-scan/skill_scan/utils/sarif_formatter.py
  = f745989572b78acfcd5423015156d4a4aa9cd2d3
NOTICE
  = 10016100a50031f0ddcaa930d20fc1439e01c8d0
```

Allowed reuse class for P7-R23:

```text
REIMPLEMENTED / DERIVED SMALL ALGORITHMS + TEST PATTERNS
```

P7-R23 may learn from donor patterns such as:

- making bytecode and hidden/cache/build payloads visible rather than silently skipped;
- distinguishing bounded-decode failure from safe text;
- preserving explicit disposition for opaque content;
- adversarial tests for binary/bytecode/hidden-path visibility.

P7-R23 may **not** copy the donor Python runtime, scanner agent, model logic, SARIF formatter, dependency set, network behavior, or file-reading implementation into Kodac.

Because no donor code is copied or vendored by the authorized three-path implementation, this unit does not create a new provenance import record or third-party notice mutation. Any later direct code copy remains separately authorized and must obey the V3 source-copy provenance contract and license/NOTICE requirements.

---

## 4. Conditional implementation allowlist

Only after this authorization candidate qualifies on one unchanged exact head, merges using an exact expected-head guard, and receives complete post-merge proof may one later P7-R23 implementation candidate modify exactly these three paths:

```text
packages/kodac-runtime/src/remediation/p7-review-coverage-universe-evidence-binding.ts
schema/p7-review-coverage-universe-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r23-review-coverage-universe-evidence-binding.test.ts
```

No fourth path is authorized.

In particular, P7-R23 may not modify:

```text
packages/kodac-runtime/src/index.ts
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/package.json
package.json
pnpm-lock.yaml
uv.lock
provenance/upstreams.yaml
provenance/imports/**
.github/workflows/**
AGENTS.md
docs/roadmap/**
docs/product/STATUS.md
any P7-R1 through P7-R22 historical source/schema/test file
any K2/K3/K5/KRI source
```

---

## 5. Required implementation character

P7-R23 must be:

```text
PURE = YES
DATA_ONLY = YES
DETERMINISTIC = YES
CONTENT_ADDRESSED = YES
DEEP_IMMUTABLE_OUTPUT = YES
FILESYSTEM_READ = NO
FILESYSTEM_WRITE = NO
GIT_EXECUTION = NO
NETWORK = NO
PROVIDER_MODEL = NO
SCANNER_AGENT = NO
SARIF_INGESTION = NO
K2_INVOCATION = NO
K5_INVOCATION = NO
NEW_DEPENDENCY = NO
PACKAGE_ROOT_EXPORT = NO
CLI_PRODUCT_INTEGRATION = NO
```

The implementation must classify only supplied immutable evidence. It must never discover repository state by reading the working tree or invoking Git.

---

## 6. Required bounded source input

The implementation must accept one closed, strictly validated build input containing at least:

```text
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
changedPaths[]
```

Each changed-path descriptor must be sufficient to classify one exact path without external reads. The implementation may choose exact field names, but the semantic source descriptor must bind at least:

```text
path
changeKind
objectKind
objectIdentity
byteSize
fileMode
contentDisposition
encodingDisposition
isGeneratedOrDerived
isReferencedHiddenPayload
policyDisposition
```

Where a field does not semantically apply, the contract must use an explicit closed value such as `not_applicable`; it may not silently omit authority-relevant meaning.

### 6.1 Canonical Git identities

```text
canonicalBase = lowercase 40-hex Git object
 targetHead   = lowercase 40-hex Git object
 targetTree   = lowercase 40-hex Git object
```

`objectIdentity` must be an exact lowercase 40-hex Git object for ordinary blob/gitlink descriptors unless one explicitly closed non-object disposition is defined by the contract. The implementation may not invent Git identity for unreadable caller evidence.

### 6.2 Canonical path rules

Every path must be one bounded repository-relative POSIX path and must fail closed on at least:

```text
empty path
absolute path
NUL
backslash
`.` segment
`..` segment
empty path segment
trailing slash
repeated slash
Unicode control characters
non-normalized path representation accepted as an alias
```

The changed-path set must be unique by exact canonical path and deterministically sorted by the implementation before identity construction.

Case-only distinct paths are not silently collapsed. The evidence must preserve their exact byte/string identities so later policy can determine platform collision risk.

---

## 7. Required closed descriptor taxonomies

P7-R23 must use closed enums, not free-text classifications.

### 7.1 Change kind

At minimum:

```text
added
modified
deleted
renamed
mode_changed
```

If rename identity requires both old and new paths, the implementation must represent that relationship explicitly or reject an under-specified rename descriptor. It may not infer a rename from filenames.

### 7.2 Object kind

At minimum:

```text
regular_file
symlink
submodule_gitlink
missing_after_change
```

The contract must not follow symlinks and must not dereference submodules.

### 7.3 Content disposition

At minimum:

```text
reviewable_text
opaque_binary_or_compiled
generated_or_derived
referenced_hidden_payload
unreadable
unsupported_or_suspicious_encoding
oversized
git_lfs_pointer
policy_excluded
not_applicable_deleted
```

A descriptor may have only one primary content disposition in P7-R23. Future scanners may attach additional signals, but A1 must remain a partition, not a many-to-many finding system.

### 7.4 Encoding disposition

At minimum:

```text
utf8
utf8_bom
non_utf8_declared_or_detected
suspicious_or_recovered
binary
unknown
not_applicable
```

P7-R23 does not decode bytes. The value is supplied evidence and is content-addressed as a classification fact. A2 may later produce deterministic encoding-signal evidence.

### 7.5 Policy disposition

At minimum:

```text
included
excluded_with_reason
not_applicable
```

A policy exclusion must bind a non-empty bounded reason or policy identity. `excluded_with_reason` is coverage debt, not disappearance from the universe.

---

## 8. Required review-universe output

The returned immutable evidence must bind at least:

```text
version
evidenceIdentity
state = REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
reviewUniverseIdentity
changedPathCount
reviewUniversePaths
reviewableTextPaths
opaqueBinaryPaths
generatedOrDerivedPaths
referencedHiddenPayloadPaths
unreadablePaths
unsupportedEncodingPaths
oversizedPaths
symlinkPaths
submodulePaths
lfsPointerPaths
policyExcludedPaths
deletedPaths
```

The output may add small bounded count/digest fields needed for deterministic validation, but it may not add reviewer findings, scanner findings, risk scores, skill decisions, provider status, execution status, K2/K5 authority, or completion claims.

---

## 9. Required partition and identity invariants

P7-R23 must fail closed unless all of the following hold:

```text
REVIEW_UNIVERSE_PATHS = EXACT CHANGED PATH SET
EVERY CHANGED PATH HAS EXACTLY ONE PRIMARY CONTENT DISPOSITION
NO CHANGED PATH IS SILENTLY DROPPED
NO EXTRA PATH IS INTRODUCED
NO DUPLICATE PATH EXISTS
ALL EXPOSED PATH ARRAYS ARE CANONICALLY SORTED AND UNIQUE
```

Additional category arrays such as symlink/submodule/LFS are deterministic projections over the same descriptors. They may overlap the primary disposition projection only where the contract explicitly defines that overlap.

`changedPathSetIdentity` must be supplied and strictly validated as one lowercase SHA-256 identity. P7-R23 must independently recompute `reviewUniverseIdentity` from the complete normalized descriptor projection rather than trusting a caller-supplied universe digest.

`evidenceIdentity` must be a SHA-256 content identity over the complete canonical output core, including the exact base/head/tree, supplied changed-path-set identity and normalized descriptor-derived universe identity.

Changing any path, kind, object identity, size, mode, disposition, encoding fact, generation flag, hidden-payload flag or policy fact must change `reviewUniverseIdentity` and `evidenceIdentity`.

---

## 10. Hostile-input and mutation-safety requirements

The implementation must fail closed on hostile JavaScript object graphs, including at least:

```text
Proxy objects
accessor properties
symbol fields
custom prototypes
sparse arrays
extra array properties
aliases
cycles
non-JSON values
unsafe integers
negative sizes
unbounded path/reason text
unknown object fields
unknown enum values
```

The complete accepted input graph must be descriptor-checked before use. Returned evidence must be detached from caller mutation and deeply frozen.

If validation contains asynchronous work for inherited lineage in a future revision, the input must be snapshotted before the first await. P7-R23 v1 should remain synchronous if no canonical predecessor validator requires otherwise.

---

## 11. Required adversarial test program

The later three-path implementation must test at least:

### 11.1 Happy-path partition

One mixed universe containing examples of:

```text
reviewable UTF-8 source
opaque binary
.pyc/compiled artifact represented as opaque
hidden/cache/build payload represented explicitly
generated output
unsupported/suspicious encoding
oversized path
symlink
submodule/gitlink
Git LFS pointer
policy-excluded path
deleted path
```

The test must prove deterministic sorted projections and exact union equality with the changed-path set.

### 11.2 Identity sensitivity

Changing one field at a time must alter identities where material, including:

```text
path
change kind
object kind
object identity
byte size
file mode
primary content disposition
encoding disposition
generated/derived flag
hidden-payload flag
policy disposition/reason
base/head/tree
changedPathSetIdentity
```

### 11.3 Path attacks

Reject at least:

```text
../escape
./relative
/absolute
backslash path
NUL path
double slash
trailing slash
empty segment
non-canonical alias
```

Preserve case-only distinct paths as distinct evidence rather than collapsing them.

### 11.4 Opaque/hidden visibility

Tests derived from AI-Infra-Guard patterns must prove that:

```text
.pyc is not silently omitted
.venv/node_modules/dist/build/cache-like referenced payload is not silently omitted
opaque/binary content remains in the review universe
unsupported encoding remains in the review universe
```

No test may require executing or importing the donor Python implementation.

### 11.5 Hostile graphs

Reject Proxy/accessor/symbol/custom-prototype/sparse/extra-array/alias/cycle inputs.

### 11.6 Output/schema closure

Test output mutation resistance, unknown output fields, enum tampering, non-SHA identities, unsorted/duplicate arrays and schema `additionalProperties: false` closure.

### 11.7 Side-effect surface

Static source assertions must prove the implementation does not import or expose filesystem, child-process, network, provider/model, K2/K5, patch/autofix, database, telemetry, workflow or package-root integration surfaces.

---

## 12. Schema requirements

`schema/p7-review-coverage-universe-evidence-binding.schema.json` must be a closed JSON Schema matching the bounded output contract.

At minimum:

```text
additionalProperties = false
all required fields explicit
state is const REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY
Git objects match ^[0-9a-f]{40}$
SHA-256 identities match ^[0-9a-f]{64}$
all path arrays contain unique bounded strings
all counts are bounded non-negative integers
```

The schema is a serialization contract. Passing schema validation does not replace the TypeScript semantic validator.

---

## 13. Required state boundary

P7-R23 may establish only:

```text
STATE = REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY
```

Required non-equivalences:

```text
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != PATH_REVIEW_COVERAGE_PROOF
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != REVIEWED_PATH_SET_PROOF
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != DETERMINISTIC_SECURITY_PRE_SCAN_PROOF
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != RISK_COVERAGE_PROOF
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != SKILL_COVERAGE_PROOF
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != PROVIDER_TERMINATION_REASON_PROOF
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != PROVIDER_INVOCATION_PROVENANCE_PROOF
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != VERIFIED
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != FIXED
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != REVERIFIED
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != K5_RECONCILIATION_PROOF
REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY != DONE_GATE_PROOF
P7_R23_CLOSED != P7_R24_PLUS_AUTHORITY
P7_R23_CLOSED != P7_OVERALL_CLOSED
P7_R23_CLOSED != P8_P9_AUTHORITY
P7_R23_CLOSED != RELEASE_AUTHORITY
P7_R23_CLOSED != PROJECT_COMPLETION
```

---

## 14. Explicit non-grants

This authorization candidate and its conditional later implementation grant none of the following:

```text
DONOR_SOURCE_COPY = NOT_AUTHORIZED_BY_THIS UNIT
PROVENANCE_IMPORT_MUTATION = NOT_AUTHORIZED
NEW_DEPENDENCY = NOT_AUTHORIZED
PYTHON_RUNTIME_ADMISSION = NOT_AUTHORIZED
AI_INFRA_GUARD_RUNTIME_ADMISSION = NOT_AUTHORIZED
SARIF_INGESTION = NOT_AUTHORIZED
DETERMINISTIC_SECURITY_PRE_SCAN = NOT_AUTHORIZED
SCANNER_ANALYZER_EXECUTION = NOT_AUTHORIZED
PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED
LIVE_REVIEWER_INVOCATION = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
FILESYSTEM_GIT_READ_OR_WRITE = NOT_AUTHORIZED_BY_P7_R23
K2_INVOCATION = NOT_AUTHORIZED
K2_APPROVAL_CREATION = NOT_AUTHORIZED
PATCH_RETRY = NOT_AUTHORIZED
AUTOFIX = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
CLI_API_PRODUCT_INTEGRATION = NOT_AUTHORIZED
P7_R24_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

---

## 15. Qualification gate for this authorization candidate

This authorization becomes canonical only if all of the following are proved on one unchanged exact head:

1. live `main` still equals the expected canonical base or the candidate is forward-reconciled without rebase/force-push;
2. changed-file set is exactly this one authorization document;
3. governance required contexts succeed;
4. docs-only runtime classification behaves according to canonical workflow policy;
5. substantive exact-head semantic/security/governance review has no unresolved material finding;
6. review threads are fully resolved;
7. ruleset `20707483` remains active with no bypass authority;
8. merge uses the exact expected-head precondition and a protected-main allowed method;
9. post-merge proof establishes canonical `main`, ordered parents when applicable, tree/blob identity, valid merge signature, required post-merge checks and unchanged ruleset/thread truth.

No CI success or merge alone is equivalent to authorization closure.

---

## 16. After this authorization becomes canonical

Only then may a P7-R23 implementation branch be created from the resulting canonical `main` and modify exactly the three paths in Section 4.

The implementation candidate must independently qualify with:

```text
focused P7-R23 tests
full package/runtime tests triggered by repository CI
TypeScript typecheck
all required cross-platform runtime matrix jobs where classified runtime-sensitive
provenance / legacy governance checks
exact-head substantive review
zero unresolved threads
guarded expected-head merge
mandatory post-merge runtime proof
```

If any required repair would need a fourth implementation path, new dependency, donor source vendoring, workflow edit, package export or authority expansion, stop and create a new canonical authorization amendment instead of silently broadening this unit.

After P7-R23 implementation is independently closed and current-state drift is reconciled where required, perform a fresh successor-authority analysis. Do not infer P7-R24, A2, risk coverage, skill coverage, provider termination, K5 reconciliation, Done Gate or project completion from numbering or plan composition alone.
