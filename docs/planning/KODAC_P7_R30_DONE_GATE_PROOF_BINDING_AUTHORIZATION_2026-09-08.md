# Kodac P7-R30 — Done Gate Proof-Binding Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY UNTIL_MERGED_AND_POST_PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = f292d375f443137e9ab19e4ec34dfc4604967148
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = 9080856f7e2fa86c055735db2bf0eb0293e4f8d4
P7_R29_P7_TO_K5_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL / PR #474 / proof 5589259309
P7_R29_P7_TO_K5_RECONCILIATION_IMPLEMENTATION = CLOSED_CANONICAL / PR #475 / proof 5589627739
P7_R29_STATE = P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY
P7_R29_POST_MERGE_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL / PR #476 / proof 5589687791
P7_R29_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #477 / proof 5589809061
POST_R29_SUCCESSOR_AUTHORITY_ANALYSIS = PR #477 / comment 5589847062 / ANALYSIS_ONLY
K5_BOUNDED_R1_R5 = CLOSED_CANONICAL
K5_DONE_GATE_AUTHORITY = UNCHANGED
DONE_GATE_PROOF = NOT_ESTABLISHED_BY_P7
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

Live GitHub truth, root `AGENTS.md`, canonical authorization/evidence records, and active ruleset `20707483` override this document.

This record is authorization-only. It creates no source/test/schema mutation authority unless this exact authorization candidate independently qualifies, merges normally through protected `main` with an exact expected-head guard, and receives complete mandatory post-merge activation proof.

`P7-R30` is a bounded governance label only. Numbering and planning sequence are not themselves authority.

## 2. Why this is the eligible next bounded unit

The canonical master plan defines the P7 trust lifecycle as:

```text
ADJUDICATED FINDING
-> IMMUTABLE PATCH PROPOSAL
-> EXACT WRITE SCOPE
-> K2 EXECUTION
-> VERIFIER RE-RUN
-> ORIGINAL TESTS / NEGATIVE CASES
-> EXACT-HEAD RE-REVIEW
-> K5 RECONCILIATION
-> DONE GATE
```

The canonical R29 authorization records the ordered trust spine:

```text
8. bounded full exact-head review completeness proof
9. separately authorized P7 -> K5 reconciliation
10. separately authorized Done Gate proof
```

R29 is now canonically closed only at:

```text
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY
```

and explicitly preserves:

```text
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY != DONE_GATE_PROOF
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY != PROVEN_READY
K5_R1_SUFFICIENT_PACKAGE != PROVEN_READY
K5_R4_NOT_APPLICABLE != PROVEN_READY
```

Fresh post-R29 successor analysis `5589847062` found that the existing Done Gate remains the sole current `PROVEN_READY` authority and that P7-R6 already exposes the exact `kodac.verification` version `1` report vocabulary consumed by the Done Gate.

Therefore the next eligible unit is a narrow proof-binding wrapper that revalidates exact P7 and K5 predecessor lineage, invokes the existing unchanged Done Gate over the exact validated P7 verification-report projection, and binds the resulting exact verdict. It must not create a second readiness algorithm and must not modify the existing Done Gate implementation.

## 3. Exact future implementation allowlist

Only after this authorization itself becomes `CLOSED_CANONICAL` may one later implementation candidate modify exactly:

```text
packages/kodac-runtime/src/verification/p7-done-gate-proof-binding.ts
packages/kodac-runtime/test/p7-r30-done-gate-proof-binding.test.ts
schema/p7-done-gate-proof-binding.schema.json
```

No fourth path is authorized.

The implementation must not modify:

```text
packages/kodac-runtime/src/verification/done-gate.ts
packages/kodac-runtime/src/verification/types.ts
packages/kodac-runtime/src/remediation/p7-post-apply-verification-report-binding.ts
packages/kodac-runtime/src/proof-review/p7-k5-reconciliation-evidence-binding.ts
packages/kodac-runtime/src/index.ts
packages/kodac-runtime/src/cli.ts
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

Observed at candidate start:

```text
P7_R29_RECONCILIATION_RUNTIME_BLOB = 69e0077301c35e64183b497eadea36fefd088420
P7_R6_VERIFICATION_REPORT_BINDING_RUNTIME_BLOB = 3ec02f33eec231e0f90a0a1da069c620db9b379c
DONE_GATE_RUNTIME_BLOB = 067e147569fa52cc2b04c5df26fbe20a01e958e9
VERIFICATION_TYPES_RUNTIME_BLOB = 5c7006e6904f97791378a4a4367d569a6971c6af
```

These are observations, not overwrite authority. The future implementation must rebind to the then-live canonical predecessor bytes and must requalify if any predecessor changes before candidate creation.

## 5. Authorized bounded contract

The future implementation may add one deterministic, content-addressed, deeply immutable, data-only proof-binding contract.

Because the canonical R29 and P7-R6 semantic validators may be asynchronous, the P7-R30 build/validation entry points may also be asynchronous solely for predecessor validation. Async execution grants no network, process, filesystem, provider, model, secret, persistence, K2, Git, GitHub, or repository-write authority.

### 5.1 Required inputs

The proof-binding may accept only caller-materialized objects equivalent to:

```text
sourceP7ToK5ReconciliationEvidenceBinding
sourceP7ToK5ReconciliationEvidenceBindingBuildInput
sourceP7PostApplyVerificationReportBinding
sourceP7PostApplyVerificationReportBindingBuildInput
```

It must invoke the canonical semantic validators for both predecessor surfaces before trusting any field.

Equivalent required validation:

```text
await validateP7ToK5ReconciliationEvidenceBinding(
  sourceP7ToK5ReconciliationEvidenceBinding,
  sourceP7ToK5ReconciliationEvidenceBindingBuildInput,
)

await validateP7PostApplyVerificationReportBinding(
  sourceP7PostApplyVerificationReportBinding,
  sourceP7PostApplyVerificationReportBindingBuildInput,
)
```

A structurally plausible output without its complete build lineage is not an accepted predecessor.

### 5.2 Exact lineage convergence

The validated R29 and R6 predecessors must converge exactly on:

```text
repositoryIdentity
canonicalBase
targetHead
```

The validated R29 state must remain exact:

```text
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY
```

The validated P7-R6 report binding must remain exact at its canonical state and must expose:

```text
verificationReport.protocol = kodac.verification
verificationReport.version = 1
verificationReportPassed = true
verificationReport.passed = true
```

The wrapper must not reinterpret any predecessor evidence as readiness before the existing Done Gate evaluates the exact validated report.

### 5.3 Existing Done Gate invocation only

The future implementation may instantiate and invoke only the existing canonical in-memory evaluator equivalently to:

```text
new DoneGate().evaluate(validatedR6.verificationReport)
```

It may not modify, monkey-patch, subclass, replace, weaken, duplicate, or reimplement the readiness algorithm.

The existing Done Gate requires these six required checks:

```text
agent.completed
workspace.integrity
git.diff
evidence.receipts
evidence.policy
verification.commands
```

For a `PROVEN_READY` verdict, each required check must exist, each must have status `pass`, each passing required check must contain at least one evidence reference, and every check whose id begins with `command.` must also have status `pass`.

The proof-binding must require the exact returned result to satisfy:

```text
status = PROVEN_READY
reasons = []
evidence.length > 0
```

Any `NOT_READY` result is an expected fail-closed outcome for the proof builder and must not be reclassified.

### 5.4 Authorized output

The future implementation may emit one bounded immutable proof object with state:

```text
P7_DONE_GATE_PROOF_BOUND_ONLY
```

It may record only the existing Done Gate's exact verdict and deterministic evidence binding. The output may bind at minimum:

```text
repositoryIdentity
canonicalBase
targetHead
P7-R6 verification report binding identity
P7-R6 verification report identity
P7-R29 reconciliation evidence identity
P7-R29 K5 package identity
P7-R29 K5 judgment identity
P7-R29 K5 reconciliation identity
doneGateStatus = PROVEN_READY
doneGateEvidence = exact canonicalized evidence references returned by DoneGate.evaluate()
```

The output identity must be SHA-256 content-addressed over the normalized output preimage.

The output state name does not create merge, release, publication, deployment, or project-completion authority.

### 5.5 Evidence normalization

The Done Gate evidence array must be normalized deterministically by the future wrapper before hashing and output. The wrapper may sort by:

```text
kind
ref
digest-or-empty-string
```

and must reject malformed, proxy, accessor, symbol, sparse, cyclic, aliased, non-JSON, or unbounded input structures where predecessor validators or this wrapper require ordinary JSON data.

It must preserve the Done Gate's deduplicated evidence semantics rather than inventing new evidence membership.

### 5.6 JSON interoperability schema

The authorized schema is a structural interoperability projection of the bounded output only. It must:

- use JSON Schema draft 2020-12;
- be closed to unknown fields;
- bind exact version/state/status constants;
- constrain Git object and SHA-256 identity formats;
- constrain the exact evidence-reference object vocabulary;
- agree with the TypeScript validator on the complete accepted output shape;
- create no readiness algorithm, runtime authority, verifier authority, or project-completion authority.

```text
JSON_SCHEMA_ACCEPTANCE != DONE_GATE_EXECUTION
JSON_SCHEMA_ACCEPTANCE != PROVEN_READY
```

Only the existing canonical `DoneGate.evaluate()` verdict may supply the `PROVEN_READY` value bound by this wrapper.

## 6. Fail-closed requirements

The implementation must reject at least:

1. invalid, tampered, foreign, or structurally spoofed R29 evidence;
2. invalid, tampered, foreign, or incomplete R29 build lineage;
3. invalid, tampered, foreign, or structurally spoofed P7-R6 verification-report binding;
4. invalid, tampered, foreign, or incomplete P7-R6 build lineage;
5. repository, canonical-base, or target-head mismatch between R29 and R6;
6. any R29 state other than exact `P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY`;
7. any R6 report protocol/version mismatch;
8. `verificationReportPassed != true` or `verificationReport.passed != true`;
9. any existing Done Gate result other than exact `PROVEN_READY`;
10. any non-empty Done Gate reasons array;
11. a `PROVEN_READY` result with zero evidence references;
12. any missing required Done Gate check;
13. any required check that is not `pass`;
14. any passing required check with zero evidence references;
15. any failing `command.*` check;
16. stale/foreign predecessor identities;
17. malformed Unicode, proxy, accessor, symbol, sparse, alias, cycle, prototype-pollution, or non-ordinary JSON shapes where applicable;
18. output identity tampering;
19. runtime/schema shape disagreement;
20. any attempt to encode merge approval, release, package publication, deployment, or project-completion state as output authority.

Equivalent normalized valid input must produce deterministic equal output and identity. Returned output and nested evidence must be deeply immutable.

## 7. Mandatory non-equivalences

```text
P7_DONE_GATE_PROOF_BOUND_ONLY != MERGE_AUTHORITY
P7_DONE_GATE_PROOF_BOUND_ONLY != APPROVAL
P7_DONE_GATE_PROOF_BOUND_ONLY != RELEASE_AUTHORITY
P7_DONE_GATE_PROOF_BOUND_ONLY != PACKAGE_PUBLICATION_AUTHORITY
P7_DONE_GATE_PROOF_BOUND_ONLY != DEPLOYMENT_AUTHORITY
P7_DONE_GATE_PROOF_BOUND_ONLY != PROJECT_COMPLETION
PROVEN_READY != MERGE_AUTHORITY
PROVEN_READY != RELEASE_AUTHORITY
PROVEN_READY != PROJECT_COMPLETION
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY != PROVEN_READY
K5_R1_SUFFICIENT_PACKAGE != PROVEN_READY
K5_R4_NOT_APPLICABLE != PROVEN_READY
TESTS_GREEN != PROVEN_READY
JSON_SCHEMA_ACCEPTANCE != PROVEN_READY
EVIDENCE_BINDING != AUTHORITY_TRANSFER
```

## 8. Preserved authority boundaries

```text
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_EXISTING_R1_R5_CONTRACTS = UNCHANGED
DONE_GATE_IMPLEMENTATION = UNCHANGED
DONE_GATE_ALGORITHM = UNCHANGED
RUNTIME_ROOT_INDEX = UNCHANGED
CLI = UNCHANGED
VERIFICATION_EXECUTION = NOT_AUTHORIZED
AUTOFIX_REMEDIATION_EXECUTION = NOT_AUTHORIZED
PATCH_RETRY = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
PROVIDER_RETRY_REPLAY_RESUME = NOT_AUTHORIZED
PROVIDER_SPEND = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## 9. Required focused qualification

The future implementation candidate must prove on one unchanged exact head:

```text
BASE == THEN_CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_3_AUTHORIZED_PATHS
NO_FOURTH_PATH = PASS
PREDECESSOR_BLOBS = EXACTLY_REVERIFIED
R29_CANONICAL_VALIDATOR = REQUIRED
R6_CANONICAL_VALIDATOR = REQUIRED
DONE_GATE_SOURCE_BLOB = UNCHANGED
DONE_GATE_TYPES_BLOB = UNCHANGED
DONE_GATE_INVOCATION = EXISTING EVALUATOR ONLY
POSITIVE_PROVEN_READY_FIXTURE = PASS
MISSING_REQUIRED_CHECK = REJECT
FAILED_REQUIRED_CHECK = REJECT
PASSING_REQUIRED_CHECK_WITHOUT_EVIDENCE = REJECT
FAILING_COMMAND_CHECK = REJECT
R6_REPORT_PASSED_FALSE = REJECT
R29_STATE_TAMPER = REJECT
R6_R29_REPOSITORY_BASE_HEAD_MISMATCH = REJECT
FOREIGN_R29_LINEAGE = REJECT
FOREIGN_R6_LINEAGE = REJECT
OUTPUT_IDENTITY_TAMPER = REJECT
DETERMINISM = PASS
DEEP_IMMUTABILITY = PASS
RUNTIME_SCHEMA_PARITY = PASS
PREDECESSOR_REGRESSIONS = PASS
REPOSITORY_REQUIRED_CI = TERMINAL_SUCCESS
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
WAIVER = NO
```

Any new candidate commit invalidates prior exact-head CI/review evidence.

## 10. Mandatory post-merge proof for this authorization

This authorization becomes canonical only after proof establishes at minimum:

```text
PR = CLOSED / MERGED
CANONICAL_MAIN = exact merge commit
ORDERED_PARENT_1 = exact pre-merge canonical main
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
P7_R30_DONE_GATE_PROOF_BINDING_AUTHORIZATION = CLOSED_CANONICAL
P7_R30_DONE_GATE_PROOF_BINDING_IMPLEMENTATION = AUTHORIZED_ONLY_FOR_EXACT_3_PATH_ALLOWLIST
```

## 11. No successor authority

This authorization does not close P7 and does not authorize P8/P9, release, publication, deployment, or project completion.

Only after the later R30 implementation independently qualifies, merges guarded, receives complete mandatory post-merge proof, and is reconciled into current-state views may a fresh successor-authority analysis determine whether a P7 closeout unit is eligible.

## 12. Candidate boundary

Until this authorization independently qualifies, merges, and receives complete post-merge proof:

```text
P7_R30_DONE_GATE_PROOF_BINDING_AUTHORIZATION = CANDIDATE_ONLY
P7_R30_DONE_GATE_PROOF_BINDING_IMPLEMENTATION = NOT_AUTHORIZED
DONE_GATE_SOURCE_MODIFICATION = NOT_AUTHORIZED
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```
