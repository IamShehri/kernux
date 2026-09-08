# Kodac P7-R29 — P7-to-K5 Reconciliation Evidence-Binding Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY UNTIL MERGED_AND_POST_PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 494ddc0e827f998ea4e7b9508122c3646b46772b
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = 1f65e9f316fe4938d79ce79382e7bd7d667cec6c
P7_R28_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #473 / proof 5588939785
POST_R28_SUCCESSOR_AUTHORITY_ANALYSIS = PR #473 / comment 5589035328 / ANALYSIS_ONLY
P7_R28_IMPLEMENTATION_PROOF = 5588734402
P7_R28_STATE = BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY
K5_BOUNDED_R1_R5 = CLOSED_CANONICAL
K5_DONE_GATE_AUTHORITY = UNCHANGED
P7_TO_K5_RECONCILIATION_PROOF = NOT_ESTABLISHED
DONE_GATE_PROOF = NOT_ESTABLISHED
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

Live GitHub truth, root `AGENTS.md`, exact canonical authorization/evidence records and active ruleset `20707483` override this candidate.

This record is authorization-only. It creates no source/test/index mutation authority unless this exact authorization candidate independently qualifies, merges normally through protected `main` with an exact expected-head guard, and receives complete mandatory post-merge activation proof.

`P7-R29` is the bounded governance label for this candidate. Numbering and planning sequence are not themselves authority.

## 2. Why this is the eligible next bounded unit

The canonical V3 planning sequence places the following after the bounded A6/R28 completeness proof, each with separate authority:

```text
P7 -> K5 RECONCILIATION CANDIDATE
-> DONE GATE CANDIDATE
```

The ordered trust spine likewise requires:

```text
8. bounded full exact-head review completeness proof
9. separately authorized P7 -> K5 reconciliation
10. separately authorized Done Gate proof
```

R28 is now canonically closed at its exact bounded meaning, and fresh analysis `5589035328` found no canonical P7-to-K5 authorization or implementation on current `main`.

K5 is already closed for its bounded R1-R5 proof-review scope. Its closeout preserves that K5 package judgment and K5-R4 reconciliation are not Done Gate authority and that `K5_R4_VALID != PROVEN_READY`.

Therefore the next eligible unit is a narrow compatibility/evidence bridge from exact P7-R28 completeness evidence into existing K5 proof-review identity semantics, without changing K5's existing contracts and without invoking or mutating Done Gate.

## 3. Exact future implementation allowlist

Only after this authorization itself becomes `CLOSED_CANONICAL` may one later implementation candidate modify exactly:

```text
packages/kodac-runtime/src/proof-review/p7-k5-reconciliation-evidence-binding.ts
packages/kodac-runtime/test/p7-r29-p7-k5-reconciliation-evidence-binding.test.ts
packages/kodac-runtime/src/index.ts
```

No fourth path is authorized.

The implementation must not modify:

```text
packages/kodac-runtime/src/remediation/p7-full-exact-head-review-completeness-evidence-binding.ts
packages/kodac-runtime/src/proof-review/contracts.ts
packages/kodac-runtime/src/proof-review/linkage-contracts.ts
packages/kodac-runtime/src/proof-review/review-adjudication-contracts.ts
packages/kodac-runtime/src/proof-review/reconciliation-contracts.ts
packages/kodac-runtime/src/proof-review/reconciliation.ts
packages/kodac-runtime/src/verification/done-gate.ts
schema/**
.github/**
provenance/**
package manifests
lockfiles
dependencies
rulesets
release/package/deployment configuration
historical authorization/evidence records
current roadmap/product views
```

If correct implementation requires any fourth path or any predecessor-contract modification, stop and create a separately scoped canonical authorization amendment instead of expanding this unit.

## 4. Exact predecessor identities to preserve

The future implementation must bind to the then-live canonical predecessor bytes and must requalify if any of them change.

Observed at candidate start:

```text
P7_R28_COMPLETENESS_RUNTIME_BLOB = cada5c8f40616df8a30db20a369e42f8ea669343
K5_R1_CONTRACTS_BLOB = ef0ae26c2a44157fb20ad33145788ba1255239f5
K5_R4_CONTRACTS_BLOB = acf758a6f17180448c1c46b0397bfe6742b4f04b
K5_R4_RUNTIME_BLOB = ec82ed7f1b941f7c523739ccd2e2663176edc30b
DONE_GATE_BLOB = 067e147569fa52cc2b04c5df26fbe20a01e958e9
RUNTIME_INDEX_BLOB = 491dd4fdb1a924fff15cf2ccd38ae868b745bd82
```

These are observations, not permission to overwrite predecessor paths.

## 5. Authorized bounded contract

The future implementation may add one deterministic, content-addressed, deeply immutable, data-only, side-effect-free contract that validates and binds exact caller-materialized evidence from both sides.

### 5.1 Required inputs

The bridge may accept only caller-materialized objects equivalent to:

```text
sourceP7FullExactHeadReviewCompletenessEvidenceBinding
sourceK5R1ProofPackage
sourceK5R1ProofJudgment
sourceK5R4ProofStateReconciliation
```

It must validate each object with the existing canonical validators before trusting any field.

### 5.2 Exact P7 lineage requirements

The validated P7-R28 evidence must remain exactly at:

```text
state = BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY
unknownCoveragePathCount = 0
riskCoverageState = ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN
skillCoverageState = ACCOUNTED_NO_COVERAGE_DEBT
providerCompletionState = CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION
```

The bridge must preserve and bind at minimum:

```text
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
reviewUniverseIdentity
evidenceIdentity
```

It must not reinterpret any R28 field as all-bytes semantic review, defect absence, provider-authenticated completion or Done Gate truth.

### 5.3 Exact K5 package bridge profile

The future implementation may define one closed bridge profile over existing K5-R1 semantics without modifying K5-R1 itself.

The accepted package must have:

```text
subject.subjectKind = VERIFICATION
subject.subjectId = exact P7-R28 evidenceIdentity
revision.repositoryId = exact P7-R28 repositoryIdentity
revision.canonicalBase = exact P7-R28 canonicalBase
revision.candidateHead = exact P7-R28 targetHead
```

For this bounded unit, the package must contain exactly one bridge requirement and exactly one bridge evidence record:

```text
requirementId = p7.full-exact-head-review-completeness
requirement.kind = CUSTOM
requirement.minimumEvidence = 1

evidenceId = p7-r28.full-exact-head-review-completeness
evidence.kind = CUSTOM
evidence.requirementIds = [p7.full-exact-head-review-completeness]
evidence.canonicalBase = exact P7-R28 canonicalBase
evidence.candidateHead = exact P7-R28 targetHead
evidence.ref = p7-r28:<exact P7-R28 evidenceIdentity>
evidence.digest = exact P7-R28 evidenceIdentity
evidence.status = SATISFIED
```

The validated K5-R1 judgment must bind the exact package identity and must prove only:

```text
package status = SUFFICIENT_PACKAGE
bridge requirement status = SATISFIED
```

No stronger meaning may be inferred.

### 5.4 K5-R4 preservation rule

`CUSTOM` evidence is intentionally outside the existing K5-R4 linked-evidence domain. This unit must preserve that contract rather than broadening K5-R4.

For the exact one-evidence bridge package, the validated K5-R4 reconciliation must therefore prove:

```text
packageIdentity = exact bridge package identity
revision = exact bridge package revision
status = NOT_APPLICABLE
results = []
outOfScopeEvidenceIds = [p7-r28.full-exact-head-review-completeness]
```

This explicit `NOT_APPLICABLE` is required evidence that the bridge did not silently reinterpret P7 completeness as K5-R4 linked evidence.

```text
K5_R4_NOT_APPLICABLE != FAILURE
K5_R4_NOT_APPLICABLE != SUCCESS
K5_R4_NOT_APPLICABLE != PROVEN_READY
```

### 5.5 Authorized output

The implementation may emit one bounded immutable evidence object with a state equivalent to:

```text
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY
```

It may bind at minimum:

```text
P7-R28 evidence identity
repository/base/head/tree/change-set/review-universe identity
K5-R1 package identity
K5-R1 judgment identity
K5-R4 reconciliation identity
bridge requirement/evidence identity
K5 package status = SUFFICIENT_PACKAGE
K5-R4 status = NOT_APPLICABLE
```

Its own identity must be deterministic and content-addressed over the normalized output preimage.

## 6. Fail-closed requirements

The implementation must reject at least:

1. any invalid or tampered P7-R28 evidence object;
2. any invalid K5-R1 package, judgment or K5-R4 reconciliation;
3. repository/base/head mismatch between P7 and K5 revision identity;
4. P7 subject identity mismatch;
5. missing, duplicate or additional requirements/evidence in the bounded bridge package;
6. wrong requirement/evidence kind, status, ref or digest;
7. a K5-R1 judgment other than `SUFFICIENT_PACKAGE` with the exact bridge requirement `SATISFIED`;
8. a K5-R4 status other than exact `NOT_APPLICABLE` for this bounded custom-only package;
9. any non-empty K5-R4 result set or wrong out-of-scope membership;
10. stale/foreign package, judgment or reconciliation identity;
11. malformed Unicode, prototype/proxy/accessor/symbol/sparse/alias/cycle inputs where predecessor validators or this bridge require ordinary JSON data;
12. any attempt to represent Done Gate, `PROVEN_READY`, merge, release or project-completion state as an output field or inferred state.

The output must be deeply immutable and deterministic for equivalent normalized input.

## 7. Mandatory non-equivalences

```text
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY != DONE_GATE_PROOF
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY != PROVEN_READY
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY != APPROVAL
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY != MERGEABILITY
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY != MERGE_AUTHORITY
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY != RELEASE_AUTHORITY
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY != PROJECT_COMPLETION
P7_R28_BOUNDED_COMPLETENESS != ALL_BYTES_SEMANTICALLY_REVIEWED
P7_R28_BOUNDED_COMPLETENESS != DEFECT_FREE
K5_R1_SUFFICIENT_PACKAGE != PROVEN_READY
K5_R4_NOT_APPLICABLE != PROVEN_READY
EVIDENCE_BINDING != AUTHORITY_TRANSFER
```

## 8. Preserved authority boundaries

```text
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_EXISTING_R1_R5_CONTRACTS = UNCHANGED
DONE_GATE_IMPLEMENTATION = UNCHANGED
DONE_GATE_INVOCATION_OR_MUTATION = NOT_AUTHORIZED
PROOFGRAPH = NOT_AUTHORIZED
AUTOMATIC_FRESHNESS_DEPENDENCY_INVALIDATION = NOT_AUTHORIZED
PATCH_RETRY = NOT_AUTHORIZED
AUTOFIX_REMEDIATION_EXECUTION = NOT_AUTHORIZED
SKILL_TRUST_QUALIFICATION = NOT_AUTHORIZED
SKILL_INSTALLATION_ACTIVATION_ROUTING_EXECUTION = NOT_AUTHORIZED
CAPABILITY_APPROVAL = NOT_AUTHORIZED
VERIFICATION_EXECUTION = NOT_AUTHORIZED
LIVE_REVIEWER_PROVIDER_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
PROVIDER_RETRY_REPLAY_RESUME = NOT_AUTHORIZED
PROVIDER_SPEND = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## 9. Required implementation qualification

A future implementation candidate may qualify only on one unchanged exact head proving:

```text
BASE == THEN_CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_3_AUTHORIZED_PATHS
NO_FOURTH_PATH = PASS
P7_R28_PREDECESSOR = EXACTLY_REVALIDATED
K5_R1_PREDECESSOR = EXACTLY_REVALIDATED
K5_R4_PREDECESSOR = EXACTLY_REVALIDATED
DONE_GATE_BLOB = UNCHANGED
STRICT_TYPESCRIPT = PASS
FOCUSED_P7_R29_TESTS = PASS
P7_R22_R28_REGRESSIONS = PASS
K5_R1_R4_REGRESSIONS = PASS
FULL_RUNTIME_TESTS = PASS
PYTHON_TESTS = PASS
RUFF = PASS
PROVENANCE = PASS
RUNTIME_MATRIX = PASS_WHERE_APPLICABLE
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
WAIVER = NO
```

Any new candidate commit invalidates earlier exact-head CI/review evidence.

## 10. Qualification requirements for this authorization candidate

This authorization candidate itself may qualify only if one unchanged exact head proves:

```text
BASE == 494ddc0e827f998ea4e7b9508122c3646b46772b
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
R28_RECONCILIATION_PROOF = EXACTLY_REVERIFIED / 5588939785
POST_R28_SUCCESSOR_ANALYSIS = EXACTLY_REVERIFIED / 5589035328 / ANALYSIS_ONLY
FUTURE_IMPLEMENTATION_ALLOWLIST = EXACTLY_3_PATHS
REQUIRED_CI = TERMINAL_SUCCESS OR CANONICALLY_PROVEN PATH_FILTER_NON_APPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
WAIVER = NO
```

## 11. Mandatory post-merge activation proof for this authorization

The authorization becomes canonical only after proof establishes at minimum:

```text
PR = CLOSED / MERGED
CANONICAL_MAIN = exact merge commit
ORDERED_PARENT_1 = 494ddc0e827f998ea4e7b9508122c3646b46772b
ORDERED_PARENT_2 = exact qualified authorization head
MERGE_TREE = exact qualified-head tree
AUTHORIZATION_BLOB_ON_MAIN = exact qualified authorization blob
MERGE_SIGNATURE = VERIFIED / VALID
MERGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
APPLICABLE_PUSH_GOVERNANCE = TERMINAL_SUCCESS
APPLICABLE_K2_PUSH = TERMINAL_SUCCESS OR CANONICALLY_PROVEN PATH_FILTER_NON_APPLICABLE
UNRESOLVED_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
WAIVER = NO
```

Only that complete post-merge proof may establish:

```text
P7_R29_P7_TO_K5_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL
P7_R29_IMPLEMENTATION = AUTHORIZED_ONLY_FOR_EXACT_3_PATH_ALLOWLIST
```

## 12. Candidate boundary

Until this authorization independently qualifies, merges and receives complete post-merge proof:

```text
P7_R29_P7_TO_K5_RECONCILIATION_AUTHORIZATION = CANDIDATE_ONLY
P7_R29_IMPLEMENTATION = NOT_AUTHORIZED
P7_TO_K5_RECONCILIATION_PROOF = NOT_ESTABLISHED
DONE_GATE_PROOF = NOT_ESTABLISHED
DONE_GATE_INVOCATION_OR_MUTATION = NOT_AUTHORIZED
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```