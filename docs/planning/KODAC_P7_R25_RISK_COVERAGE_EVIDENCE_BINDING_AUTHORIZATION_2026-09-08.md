# Kodac P7-R25 — Risk Coverage Evidence Binding Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY UNTIL MERGED AND POST-PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 2658d65d149d6a9ddfdb5e805fa2ba58cabd63bb
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = 01ed5a9de42ee27711c986ca08e8adacbeed185e
P7_R23_REVIEW_COVERAGE_UNIVERSE = CLOSED_CANONICAL / PR #450 / proof 5576403450 / REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY
P7_R23_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #452 / proof 5576546888
P7_R24_DETERMINISTIC_SECURITY_PRE_SCAN = CLOSED_CANONICAL / PR #454 / proof 5576882384 / DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY
P7_R24_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #456 / proof 5577171552
POST_R24_SUCCESSOR_ANALYSIS = PR #456 / comment 5577187831 / ANALYSIS_ONLY
TENCENT_DONOR_SYNTHESIS_AND_COMPLETE_REVIEW_MASTER_PLAN_V3 = CLOSED_CANONICAL / PLANNING_ONLY / PR #448 / proof 5575897235
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

`P7-R25` is a bounded unit label, not authority by numbering. This document creates no implementation authority unless this exact authorization candidate independently qualifies, merges guarded through protected `main`, and receives complete mandatory post-merge proof.

Live GitHub truth, root `AGENTS.md`, canonical evidence and exact authorization records override this document.

## 2. Why this is the next bounded unit

The canonical V3 Track A sequence defines:

```text
A1 = REVIEW COVERAGE UNIVERSE
A2 = DETERMINISTIC SECURITY PRE-SCAN
A3 = RISK COVERAGE EVIDENCE
```

A1 is now closed canonically by P7-R23 and A2 is closed canonically by P7-R24. Fresh post-R24 analysis `5577187831` therefore identified one dependency-ready successor **authorization candidate**: A3 risk coverage evidence binding.

The V3 purpose is to:

- decide which risk classes apply;
- bind which applicable risks have deterministic and/or reviewer evidence;
- represent uncovered and unknown risk explicitly.

This authorization does not treat the V3 sequence as implementation authority. It creates a separately reviewable bounded contract candidate.

## 3. Exact future implementation allowlist

Only after this authorization itself becomes `CLOSED_CANONICAL` may one implementation candidate modify exactly:

```text
packages/kodac-runtime/src/remediation/p7-risk-coverage-evidence-binding.ts
schema/p7-risk-coverage-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r25-risk-coverage-evidence-binding.test.ts
```

No fourth path is authorized.

Not authorized:

```text
package-root exports or index.ts
CLI/API/product integration
workflow changes
dependency or lockfile changes
donor-source vendoring
provenance registry mutation
P6 mutation
R23 mutation
R24 mutation
K2 or K5 mutation
current-view mutation
provider/model configuration
network or secret access
persistence or telemetry
SARIF integration
release/package/deployment configuration
ruleset or repository-protection mutation
```

If correctness requires a fourth path or a new dependency, stop and create a separately scoped canonical authorization amendment instead of expanding this unit.

## 4. Exact R24 lineage reconstruction

The future implementation must consume both:

```text
securityPrescanBuildInput: P7DeterministicSecurityPrescanBuildInput
securityPrescanEvidence: P7DeterministicSecurityPrescanEvidenceBinding
```

It must reuse the existing canonical R24 builder and validator rather than duplicating R24 semantics:

```text
buildP7DeterministicSecurityPrescanEvidenceBinding(securityPrescanBuildInput)
validateP7DeterministicSecurityPrescanEvidenceBinding(securityPrescanEvidence, securityPrescanBuildInput)
```

The rebuilt R24 result and the supplied validated R24 evidence must have the exact same `evidenceIdentity`. Any R23 subject drift, source drift, rule-set drift, signal drift, ordering drift or identity tampering must fail closed before risk accounting begins.

Because the R24 build input contains the R23 review-universe build input and evidence, the future implementation may reconstruct the exact R23 changed-path descriptors through the already-canonical R23/R24 functions. It must not create an alternate universe or scanner lineage.

The A3 subject remains transitively bound to at least:

```text
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
reviewUniverseIdentity
sourceSetIdentity
ruleSetIdentity
R24 evidenceIdentity
```

## 5. Kodac-owned versioned risk taxonomy

The implementation must define a closed, versioned, Kodac-owned risk taxonomy inside the authorized production source. External taxonomies are mapping inputs only.

Every canonical risk definition binds at least:

```text
riskId
riskVersion
staticRuleIds
externalTaxonomyMappings
```

Requirements:

1. `riskId` is a stable Kodac identifier and must not be a donor-controlled trust key.
2. `riskVersion` changes when the canonical meaning or mapping changes.
3. `staticRuleIds` may reference only exact R24 rule IDs that exist in the reconstructed R24 rule set.
4. `externalTaxonomyMappings` is a sorted bounded list of inert versioned identifiers.
5. the complete taxonomy is content-addressed as `riskTaxonomyIdentity`.
6. taxonomy ordering is canonical and deterministic.
7. unknown risk IDs or unknown mapped R24 rules fail closed.
8. a future taxonomy change is a new identity and cannot retroactively change old evidence meaning.

The initial taxonomy may map useful AI-Infra-Guard T01-T09 concepts when exact already-pinned mapping evidence is available, but the implementation must not invent donor labels or treat external taxonomy identity as Kodac applicability truth.

No donor runtime, donor model, SARIF formatter or donor dependency is authorized.

## 6. Risk applicability evidence input

Risk applicability is explicit evidence input, not inferred from the absence or presence of scanner signals alone.

The caller supplies exactly one applicability record for every canonical Kodac risk:

```text
riskId
applicability = APPLICABLE | NOT_APPLICABLE | UNKNOWN
evidenceIdentities
```

Rules:

```text
EXACTLY_ONE_RECORD_PER_CANONICAL_RISK = REQUIRED
MISSING_RISK = REJECT
EXTRA_RISK = REJECT
DUPLICATE_RISK = REJECT
APPLICABLE_REQUIRES_EVIDENCE_IDENTITY = YES
NOT_APPLICABLE_REQUIRES_EVIDENCE_IDENTITY = YES
UNKNOWN_IS_EXPLICIT = YES
UNKNOWN_MAY_NOT_BE_SILENTLY_COERCED = YES
```

`evidenceIdentities` is a deterministic sorted deduplicated bounded list of lowercase SHA-256 identities. The A3 contract binds those references but does not claim that an opaque referenced artifact was independently semantically verified by this function.

The complete applicability projection is content-addressed as `riskApplicabilityEvidenceIdentity`.

`UNKNOWN` remains incompatible with any structurally complete risk-accounting state.

## 7. Coverage method semantics

A3 separates **method coverage evidence** from findings and from verified truth.

Allowed bounded method classes are initially:

```text
DETERMINISTIC_PRESCAN
REVIEWER_FINDING_REFERENCE
```

### 7.1 Deterministic pre-scan method

For a canonical risk whose `staticRuleIds` are non-empty, the implementation may bind deterministic-method coverage only from the exact reconstructed R24 rule set and exact R24 subject.

The method means only that the named deterministic rules were part of the exact R24 pre-scan contract over the R23 `reviewableTextPaths` universe. It does not mean:

```text
NO_SIGNAL = SAFE
NO_SIGNAL = CLEAN
STATIC_METHOD_COVERAGE = FULL_PATH_COVERAGE
STATIC_METHOD_COVERAGE = VERIFIED_RISK_ABSENCE
```

Any R23 non-reviewable/opaque/unreadable/unsupported disposition remains visible coverage debt and must not disappear from A3 accounting.

### 7.2 Reviewer-finding reference method

The caller may supply bounded reviewer-finding references:

```text
riskId
reviewerFindingEvidenceIdentity
```

Each identity is a lowercase SHA-256 reference. The implementation binds the exact reference to the exact risk but does not invoke a reviewer/provider/model and does not upgrade the referenced claim into verified truth.

A reviewer finding proves neither negative coverage nor complete review. Absence of a reviewer-finding reference is not equivalent to reviewer coverage absence unless the structural accounting explicitly says no reviewer-finding evidence is bound for that risk.

Duplicate risk/identity pairs are deterministically deduplicated; conflicting or malformed records fail closed.

## 8. Required risk-accounting output

The bounded result carries the constant state:

```text
RISK_COVERAGE_EVIDENCE_BOUND_ONLY
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
securityPrescanEvidenceIdentity
riskTaxonomyIdentity
riskApplicabilityEvidenceIdentity
applicableRiskSet
notApplicableRiskSet
unknownApplicabilityRiskSet
coveredRiskSet
uncoveredRiskSet
riskRecords
riskCoverageState
```

Every risk record binds at least:

```text
riskId
riskVersion
applicability
applicabilityEvidenceIdentities
staticRuleIds
staticSignalEvidenceIdentities
reviewerFindingEvidenceIdentities
coverageMethods
coverageDisposition
```

Required set rules:

```text
applicableRiskSet ∪ notApplicableRiskSet ∪ unknownApplicabilityRiskSet = CANONICAL_RISK_SET
PAIRWISE_DISJOINT_APPLICABILITY_SETS = REQUIRED
coveredRiskSet ⊆ applicableRiskSet
uncoveredRiskSet ⊆ applicableRiskSet
coveredRiskSet ∪ uncoveredRiskSet = applicableRiskSet
coveredRiskSet ∩ uncoveredRiskSet = EMPTY
```

A risk may enter `coveredRiskSet` only when at least one exact bounded coverage method is present for that risk. A risk with `APPLICABLE` and no bounded method evidence must be explicit in `uncoveredRiskSet`.

A risk with `UNKNOWN` applicability never enters `coveredRiskSet` or `uncoveredRiskSet`; it remains explicit in `unknownApplicabilityRiskSet`.

`riskCoverageState` must use structural accounting terms only, purpose-equivalent to:

```text
ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN
HAS_UNCOVERED_RISK
HAS_UNKNOWN_APPLICABILITY
HAS_UNCOVERED_AND_UNKNOWN
```

Even `ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN` is not a clean/safe/verified/full-review claim. It means only that all canonical risks have explicit applicability and every applicable risk has at least one bounded method evidence reference under this exact contract.

## 9. Signal, finding and coverage separation

Required invariants:

```text
R24_STATIC_SIGNAL != P6_DETERMINISTIC_SECURITY_FINDING
R24_STATIC_SIGNAL != REVIEWER_FINDING
R24_STATIC_SIGNAL != VERIFIED_FINDING
REVIEWER_FINDING_REFERENCE != VERIFIED_FINDING
METHOD_COVERAGE != VERIFIED_RISK_ABSENCE
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != RISK_COVERAGE_PROOF
```

The A3 implementation must never synthesize P6 findings, reviewer findings, verifier findings, fixes, severity adjudication, K5 status or Done Gate truth.

It must never treat `signalCount == 0` as safe, clean, reviewed or verified.

## 10. Coverage debt from the R23 universe

The future implementation must preserve visibility of R23 path dispositions that deterministic pre-scan did not scan as reviewable text.

It must bind a deterministic coverage-debt summary sufficient to show at least:

```text
reviewUniversePathCount
reviewableTextPathCount
nonReviewablePathCount
nonReviewableDispositionCounts
coverageDebtIdentity
```

The exact disposition vocabulary must be derived from canonical R23 descriptors rather than independently redefined.

`nonReviewablePathCount > 0` does not automatically make every risk uncovered, but it prevents A3 from representing deterministic pre-scan as universal path coverage.

The serialized output must not expose raw source bytes or raw matched text.

## 11. Identity and ordering rules

All projections must use deterministic canonical ordering and content addressing.

At minimum:

```text
riskTaxonomyIdentity = SHA-256(canonical taxonomy projection)
riskApplicabilityEvidenceIdentity = SHA-256(canonical applicability projection)
coverageDebtIdentity = SHA-256(canonical R23 coverage-debt projection)
evidenceIdentity = SHA-256(complete canonical A3 output core)
```

All sets serialize as canonically sorted arrays. Duplicate semantic records are normalized only where explicitly permitted; conflicting duplicates fail closed.

Caller-controlled order must not change output identity.

Returned evidence must be detached and deeply immutable.

## 12. Hostile-input and fail-closed requirements

The implementation must be pure, synchronous, deterministic and data-only and fail closed on at least:

```text
Proxy or revoked Proxy
accessor/getter properties
symbol properties
custom object/array prototypes
sparse arrays or arrays with extra properties
aliases and cycles
non-JSON graph values where JSON data is required
invalid Unicode scalar strings
unknown or missing fields
invalid SHA-1/SHA-256 identities
R24 build-input/evidence mismatch
R24 evidence tampering
R23 lineage mismatch through R24 reconstruction
unknown canonical risk
unknown mapped R24 rule
missing applicability record
extra applicability record
duplicate applicability risk
APPLICABLE with empty applicability evidence
NOT_APPLICABLE with empty applicability evidence
malformed reviewer-finding identity
over-limit taxonomy/applicability/reviewer reference counts
covered/uncovered set inconsistency
unknown applicability promoted to coverage
output/evidence identity tampering
```

No filesystem, Git process, provider/model, network, secret retrieval, persistence, telemetry, SARIF, K2, K5, patch/autofix, package publication or deployment side effect is authorized.

## 13. Required implementation tests

The exact implementation test path must prove at least:

1. deterministic equivalent-input success;
2. exact R24 rebuild/validation and evidence-identity equality;
3. R24/R23 lineage tamper rejection;
4. canonical taxonomy identity stability;
5. taxonomy order independence;
6. unknown risk and unknown mapped rule rejection;
7. exactly one applicability record per canonical risk;
8. APPLICABLE / NOT_APPLICABLE evidence-reference requirement;
9. UNKNOWN remains explicit and cannot be coerced;
10. applicable/not-applicable/unknown sets are exhaustive and pairwise disjoint;
11. covered/uncovered sets partition only applicable risks;
12. applicable risk with no bounded method evidence is uncovered;
13. deterministic-method coverage is derived only from exact R24 rule mapping;
14. zero R24 signals never becomes clean/safe/verified;
15. reviewer-finding identities are bound as references only;
16. reviewer reference absence never becomes complete-review truth;
17. multiple static signals map deterministically without raw matched-text disclosure;
18. R23 non-reviewable dispositions remain explicit coverage debt;
19. coverage-debt identity stability under caller-order changes;
20. risk-accounting state transitions for uncovered and unknown combinations;
21. `ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN` remains bounded accounting only;
22. deterministic taxonomy/applicability/debt/evidence identities;
23. closed schema rejects unknown/extra output fields;
24. Proxy/accessor/symbol/prototype/sparse/alias/cycle hostile cases;
25. caller mutation cannot alter returned evidence;
26. production source contains no forbidden imports/APIs introducing side effects;
27. full existing runtime regression/typecheck passes on required platforms.

## 14. Closed JSON Schema requirement

`schema/p7-risk-coverage-evidence-binding.schema.json` must be a closed JSON Schema matching the serialized output.

At minimum:

```text
additionalProperties = false at every object boundary
state = constant RISK_COVERAGE_EVIDENCE_BOUND_ONLY
version = constant implementation version
SHA identities = exact lowercase patterns
counts = bounded integers
risk IDs / versions / method enums = bounded closed values
all serialized arrays = bounded
every risk record = closed object
no raw source bytes
no raw matched text
no clean/safe/pass/verified/fixed/review-complete truth field
```

## 15. Donor discipline

The V3 donor input for A3 is the already-pinned AI-Infra-Guard taxonomy/rule-metadata pattern. This authorization permits **pattern study and Kodac-native reimplementation only**.

```text
DONOR_RUNTIME_IMPORT = NOT_AUTHORIZED
DONOR_SOURCE_COPY = NOT_AUTHORIZED
DONOR_DEPENDENCY_IMPORT = NOT_AUTHORIZED
DONOR_MODEL_PROVIDER_CALL = NOT_AUTHORIZED
SARIF_AS_TRUST_ROOT = REJECTED
EXTERNAL_TAXONOMY_AS_KODAC_AUTHORITY = REJECTED
```

If copied donor source text becomes necessary, stop and create a separate exact source-admission authorization with license/NOTICE obligations and copied-path attribution.

## 16. Mandatory non-equivalences and non-grants

```text
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != RISK_COVERAGE_PROOF
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != CLEAN_SCAN
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != SAFE
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != COMPLETE_REVIEW
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != REVIEWED_PATH_SET_PROOF
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != SKILL_COVERAGE_PROOF
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != PROVIDER_TERMINATION_REASON_PROOF
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != PROVIDER_INVOCATION_PROVENANCE_PROOF
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != VERIFIED
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != FIXED
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != K5_RECONCILIATION_PROOF
RISK_COVERAGE_EVIDENCE_BOUND_ONLY != DONE_GATE_PROOF
P7_R25_CLOSED != P7_OVERALL_CLOSED
P7_R25_CLOSED != P8_P9_AUTHORITY
P7_R25_CLOSED != RELEASE_AUTHORITY
P7_R25_CLOSED != PROJECT_COMPLETION
```

Preserved non-grants:

```text
R23_MUTATION = NOT_AUTHORIZED
R24_MUTATION = NOT_AUTHORIZED
P6_MUTATION = NOT_AUTHORIZED
PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
NEW_DEPENDENCY_ADMISSION = NOT_AUTHORIZED
DONOR_RUNTIME_IMPORT = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
K2_INVOCATION_OR_APPROVAL_CREATION = NOT_AUTHORIZED
K5_MUTATION = NOT_AUTHORIZED
DONE_GATE_INVOCATION_OR_MUTATION = NOT_AUTHORIZED
CURRENT_VIEW_MUTATION = NOT_AUTHORIZED_BY_IMPLEMENTATION
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## 17. Qualification requirements for this authorization candidate

This one-path documentation-only authorization candidate may qualify only if one unchanged exact head proves:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_DOCUMENT
NO_SECOND_PATH = PASS
R24_RECONCILIATION_PROOF = EXACTLY_REVERIFIED / 5577171552
POST_R24_SUCCESSOR_ANALYSIS = EXACTLY_REVERIFIED / 5577187831 / ANALYSIS_ONLY
V3_A3_PURPOSE = EXACTLY_REVERIFIED
FUTURE_IMPLEMENTATION_ALLOWLIST = EXACTLY_3_PATHS
NO_DEPENDENCY_WORKFLOW_PROVIDER_MODEL_NETWORK_SECRET_PERSISTENCE_RELEASE_SCOPE = PASS
REQUIRED_CI = TERMINAL_SUCCESS OR CANONICALLY PROVEN NON_APPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
WAIVER = NO
```

Guarded merge must use the exact final qualified head. Implementation authority activates only after complete mandatory post-merge proof of this authorization merge.

## 18. Post-merge activation rule

Before implementation begins, prove on canonical `main`:

```text
MERGE_PRESENT_ON_MAIN
PARENT_ORDER_CORRECT
MERGE_TREE == QUALIFIED_HEAD_TREE
AUTHORIZATION_BLOB == QUALIFIED_AUTHORIZATION_BLOB
MERGE_SIGNATURE = VALID
POST_MERGE_GOVERNANCE = SUCCESS
K2_PUSH = SUCCESS_IF_APPLICABLE / EXPLICIT_PATH_FILTER_NON_APPLICABILITY_IF_NOT
RULESET = ACTIVE / NO_BYPASS
WAIVER = NO
```

Only then may the exact three-path P7-R25 implementation candidate begin.

This authorization does not authorize any later A4/skill-coverage unit. After P7-R25 implementation itself closes canonically and its current-view reconciliation closes canonically, perform a fresh successor-authority analysis from live `main`.