# Kodac P7-R28 — Composite Full Exact-Head Review Completeness Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY UNTIL MERGED AND POST-PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 7f5d32da76583421b2f7de61e9f2b702bfc2a613
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = ad53e48e830ad5942c2fba6e243b7ab5e21b3d4b
TENCENT_DONOR_SYNTHESIS_AND_COMPLETE_REVIEW_MASTER_PLAN_V3 = CLOSED_CANONICAL / PLANNING_ONLY / PR #448 / proof 5575897235
A1_P7_R23_REVIEW_COVERAGE_UNIVERSE = CLOSED_CANONICAL / PR #450 / proof 5576403450 / REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY
A2_P7_R24_DETERMINISTIC_SECURITY_PRESCAN = CLOSED_CANONICAL / PR #454 / proof 5576882384 / DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY
A3_P7_R25_RISK_COVERAGE = CLOSED_CANONICAL / PR #458 / proof 5584759947 / RISK_COVERAGE_EVIDENCE_BOUND_ONLY
A4_P7_R26_SKILL_COVERAGE = CLOSED_CANONICAL / PR #462 / proof 5586149075 / SKILL_COVERAGE_EVIDENCE_BOUND_ONLY
A5_P7_R27_PROVIDER_ATTEMPT_TERMINATION = CLOSED_CANONICAL / PR #467 / proof 5587661329 / PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
P7_R27_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #469 / proof 5588027874
POST_R27_SUCCESSOR_AUTHORITY_ANALYSIS = PR #469 / comment 5588092657 / ANALYSIS_ONLY
P7_R20_R22_REVIEW_CONTEXT_LINEAGE = CLOSED_CANONICAL AT EXACT RECORDED BOUNDED STATES
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

`P7-R28` is the governance label for Track A6. Numbering and master-plan order do not themselves create implementation authority.

This record creates implementation authority only if this exact one-path authorization candidate independently qualifies, merges through protected `main` with an exact expected-head guard, and receives complete mandatory post-merge activation proof.

Live GitHub truth, root `AGENTS.md`, exact canonical evidence/authorization records, and ruleset `20707483` override this document.

## 2. Why A6 is the bounded next candidate

The canonical V3 plan defines Candidate A6 as:

```text
COMPOSITE FULL EXACT-HEAD REVIEW COMPLETENESS
- compose R20-R22 + A1-A5
- require zero unknown coverage debt
- emit a bounded completeness proof only
```

The plan separately requires later authority before either:

```text
P7 -> K5 RECONCILIATION CANDIDATE
DONE GATE CANDIDATE
```

Fresh successor analysis `5588092657` reverified that A1 through A5 are canonically closed at their exact bounded states, that R27 reconciliation is closed, and that no A6 authorization, implementation, open PR, or branch existed on canonical `main`. The analysis established only eligibility to create this authorization candidate.

## 3. Exact future implementation allowlist

Only after this authorization itself becomes `CLOSED_CANONICAL` may one later implementation candidate modify exactly:

```text
packages/kodac-runtime/src/remediation/p7-full-exact-head-review-completeness-evidence-binding.ts
schema/p7-full-exact-head-review-completeness-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r28-full-exact-head-review-completeness-evidence-binding.test.ts
```

No fourth path is authorized.

The established R23-R27 pattern proves that the bounded contract can remain one standalone remediation source, one strict JSON Schema, and one focused test file without index/package-root mutation.

Not authorized:

```text
package-root exports or index files
CLI/API/product integration
package manifests or lockfiles
.github/workflows/**
provenance/**
AGENTS.md
docs/roadmap/**
docs/product/STATUS.md
historical predecessor source/schema/test mutation
K2/K5/Done Gate mutation
dependencies, providers, models, network or secrets
release/package/deployment configuration
rulesets or repository protection
```

If correctness requires a fourth implementation path or a new dependency, stop and create a separately scoped canonical authorization amendment.

## 4. Required implementation character

The future implementation must be:

```text
PURE = YES
DATA_ONLY = YES
DETERMINISTIC = YES
CONTENT_ADDRESSED = YES
DEEP_IMMUTABLE_OUTPUT = YES
FAIL_CLOSED = YES
PROVIDER_INVOCATION = NO
MODEL_INVOCATION = NO
TOOL_INVOCATION = NO
NETWORK = NO
SECRET_ACCESS = NO
FILESYSTEM_WRITE = NO
PERSISTENCE = NO
TELEMETRY = NO
RANDOMNESS = NO
AMBIENT_CLOCK = NO
K2_MUTATION = NO
K5_MUTATION = NO
DONE_GATE_MUTATION = NO
```

The future bounded output state is:

```text
BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY
```

The historical repository term `FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF` is preserved as the bounded proof concept. The doubled `RE_REVIEW` spelling is retained where referencing the established canonical non-grant name; the implementation filename uses normal `review` spelling.

## 5. Minimal canonical input surface

The implementation should accept only the exact canonical P7-R27 evidence record plus the exact P7-R27 build input necessary to validate it:

```text
sourceProviderAttemptTerminationEvidenceBinding
sourceProviderAttemptTerminationEvidenceBindingInput
```

This is sufficient because the canonical R27 build lineage already contains:

```text
R27 input
-> exact R22 evidence + exact R22 build input
-> exact R26 evidence + exact R26 build input
   -> exact R25 evidence + build input
      -> exact R24 evidence + build input
         -> exact R23 evidence + build input
-> optional exact P5-R1 provenance
-> bounded attempt/termination input
```

And canonical R22 validation composes exact R21 and R20 lineage.

The A6 implementation must call existing canonical validators/builders rather than duplicate predecessor semantics. Self-consistent but noncanonical predecessor lookalikes must fail closed.

## 6. Required exact lineage convergence

After canonical predecessor validation, all available subject lineage must converge exactly on:

```text
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
reviewUniverseIdentity
reviewRunIdentity / review-context identity where applicable
```

Where an older predecessor does not serialize a later-added lineage field, A6 must derive that field only through the exact validated descendant/preimage that canonically carries it. It must never synthesize or guess a missing identity.

Any repository/base/head/tree/change-set/review-universe mismatch is a hard failure.

## 7. Changed / reviewed / unreviewed path coverage composition

A6 must close the path-accounting gap by composing exact R22 context material with exact R23 review-universe material; it must not invent a second changed-path universe.

The canonical R22 build input exposes `contextEngineInput`, from which the existing canonical context builder can reproduce the exact complete context bundle with `subjectPath` values. The canonical R23 build input exposes the exact changed-path descriptors.

A6 must deterministically derive:

```text
reviewUniversePathSet
reviewableTextPathSet
reviewedPathSet
unreviewedPathSet
unreviewedReasonByPath
reviewMethodByPath
reviewEvidenceByPath
pathCoverageDebtIdentity
pathCoverageCompletenessState
```

Rules:

1. `reviewUniversePathSet` is exactly the validated R23 universe; no extra/missing path is permitted.
2. A changed reviewable-text path counts as reviewed only when the exact validated R22 complete context bundle contains that same canonical `subjectPath` and the R22/R20 review-run lineage binds that exact context-bundle identity.
3. A changed path not proven reviewed remains explicitly unreviewed; absence must never mean reviewed.
4. Unreviewed reasons are a closed deterministic vocabulary derived from validated predecessor facts only:

```text
NOT_APPLICABLE
OPAQUE_BINARY
UNREADABLE
SIZE_LIMIT
UNSUPPORTED_ENCODING
POLICY_EXCLUDED
REQUIRES_SPECIALIZED_SKILL
REQUIRES_SANDBOX
UNKNOWN
```

5. R23 `not_applicable_deleted` maps to `NOT_APPLICABLE`.
6. R23 `opaque_binary_or_compiled` maps to `OPAQUE_BINARY` unless a validated review method proves otherwise.
7. R23 `unreadable` maps to `UNREADABLE`.
8. R23 `oversized` maps to `SIZE_LIMIT`.
9. R23 `unsupported_or_suspicious_encoding` maps to `UNSUPPORTED_ENCODING`.
10. R23 `policy_excluded` maps to `POLICY_EXCLUDED` and preserves the exact bounded policy reason/evidence identity.
11. Symlink/submodule/LFS/generated/hidden-payload cases must remain explicitly accounted using existing descriptor evidence and one deterministic reason; they may not silently disappear from the universe.
12. Any reviewable text path missing from the exact complete R22 context is `UNKNOWN` coverage debt and blocks A6 proof issuance.
13. Caller-supplied reviewed/unreviewed path claims are not accepted as authority; the sets are derived only from validated canonical predecessor material.
14. Input ordering cannot change the result.

Known explicit nonreviewable dispositions are accounting facts, not proof that every byte was semantically reviewed.

## 8. Zero-unknown / zero-unresolved-debt gate

A6 may emit the bounded proof state only when all of the following hold after exact canonical validation:

```text
R22_CONTEXT_FRESHNESS = current
R22_CONTEXT_COMPLETENESS_STATE = complete
R22_CONTEXT_COMPLETENESS_REASONS = []
R22_CONTEXT_OMITTED_AT_LEAST = 0
PATH_COVERAGE_UNKNOWN_SET = []
R25_RISK_COVERAGE_STATE = ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN
R25_UNKNOWN_APPLICABILITY_RISK_SET = []
R25_UNCOVERED_RISK_SET = []
R26_SKILL_COVERAGE_STATE = ACCOUNTED_NO_COVERAGE_DEBT
R26_UNKNOWN_ADMISSION_SKILL_SET = []
R26_UNKNOWN_RELEVANCE_SKILL_SET = []
R26_NOT_ADMITTED_SKILL_SET = []
R26_UNAVAILABLE_SKILL_SET = []
R27_TERMINATION_REASON = COMPLETED
R27_COMPLETION_STATE = CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION
R27_COMPLETED_AT = PRESENT
R27_OUTPUT_TRUNCATION_STATE = NOT_TRUNCATED
```

The implementation must bind the predecessor debt identities, including at minimum:

```text
R25 risk coverage debt identity
R26 skill coverage debt identity
R27 completion debt identity
A6 path coverage debt identity
```

and derive one deterministic composite completeness-debt identity.

If any required condition is not satisfied, A6 must fail closed rather than emit the bounded completeness proof. No `PARTIAL`, `BEST_EFFORT`, or implicit-success state is authorized by this record.

## 9. Required bounded output

The exact field names may be narrowed during implementation only if schema/source/test stay mutually consistent and every required semantic remains represented. The output must bind at minimum:

```text
version
evidenceIdentity
state = BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
reviewUniverseIdentity
reviewContextEvidenceIdentity
reviewRunIdentity
reviewCoverageUniverseEvidenceIdentity
securityPrescanEvidenceIdentity
riskCoverageEvidenceIdentity
skillCoverageEvidenceIdentity
providerAttemptTerminationEvidenceIdentity
reviewUniversePathSetIdentity
reviewedPathSetIdentity
unreviewedPathSetIdentity
pathCoverageDebtIdentity
riskCoverageDebtIdentity
skillCoverageDebtIdentity
providerCompletionDebtIdentity
compositeCompletenessDebtIdentity
reviewedPathCount
unreviewedPathCount
knownNonreviewablePathCount
unknownCoveragePathCount = 0
riskCoverageState = ACCOUNTED_NO_UNCOVERED_OR_UNKNOWN
skillCoverageState = ACCOUNTED_NO_COVERAGE_DEBT
providerCompletionState = CALLER_ASSERTED_COMPLETED_NO_KNOWN_TRUNCATION
```

The output may include the deterministic reviewed/unreviewed path arrays and bounded reason records when needed for auditability, but it may not omit their content-addressed identities.

## 10. Mandatory non-equivalences

The implementation, schema, tests, PR body, review, and post-merge proof must preserve:

```text
BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY != ALL_BYTES_SEMANTICALLY_REVIEWED
BOUNDED_FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF_ONLY != DEFECT_FREE
ZERO_FINDINGS != COMPLETE_REVIEW
DETERMINISTIC_SECURITY_SIGNAL != VERIFIED_FINDING
RISK_COVERAGE_ACCOUNTED != RISK_ABSENT
SKILL_COVERAGE_ACCOUNTED != SKILL_TRUSTED
SKILL_EXECUTED_REFERENCE != VERIFIED_SKILL_EXECUTION_TRUST
CALLER_ASSERTED_PROVIDER_IDENTITY != VERIFIED_PROVIDER_IDENTITY
CALLER_ASSERTED_MODEL_IDENTITY != VERIFIED_MODEL_IDENTITY
CALLER_ASSERTED_COMPLETED != PROVIDER_AUTHENTICATED_COMPLETION
OUTPUT_NOT_TRUNCATED_REFERENCE != VERIFIED_OUTPUT_COMPLETENESS
P5_PROVENANCE != PROVIDER_INVOCATION_PROOF
P5_PROVENANCE != PROVIDER_AUTHENTICITY_PROOF
A6_BOUNDED_COMPLETENESS != P7_TO_K5_RECONCILIATION_PROOF
A6_BOUNDED_COMPLETENESS != K5_DONE_GATE_PROOF
A6_BOUNDED_COMPLETENESS != DONE_GATE_INVOCATION_OR_MUTATION
A6_BOUNDED_COMPLETENESS != RELEASE_AUTHORITY
A6_BOUNDED_COMPLETENESS != PROJECT_COMPLETION
P7_R28_CLOSED != P7_OVERALL_CLOSED
P7_R28_CLOSED != P8_P9_AUTHORITY
PLAN_SEQUENCE != IMPLEMENTATION_AUTHORITY
NUMBERING != IMPLEMENTATION_AUTHORITY
```

Known nonreviewable paths and reasons remain explicit. The bounded proof means the canonical evidence graph has no unknown/uncovered debt under the exact contract; it does not mean every repository byte or external fact was independently authenticated.

## 11. Hostile-input and determinism requirements

Follow the hardened R23-R27 pattern:

- ordinary JSON-compatible data only;
- reject Proxy values before trap-triggering access where practical;
- reject accessors, symbols, unsupported prototypes, sparse arrays, aliases/cycles, non-finite values, unsafe integers and malformed Unicode;
- deterministic graph depth/node/array/string/UTF-8 byte limits before unbounded work;
- reject unknown object fields;
- reject malformed SHA/Git identities;
- deterministic canonical sort order for all sets/maps;
- reject duplicate identities and duplicate path/reason records;
- exact canonical predecessor validation, not structural lookalikes;
- deeply freeze output;
- derive all identities from canonical deterministic serialization only;
- no ambient clock, randomness, environment, process state, filesystem, network, provider, secret, persistence or telemetry access.

## 12. Required tests

The exact test path must prove at minimum:

### Positive composition

- one fully valid nested R27 lineage reconstructs exact R20-R22 and A1-A5 canonical predecessors;
- exact repository/base/head/tree/change-set/review-universe lineage converges;
- every changed reviewable text path proven present in the exact complete R22 context is accounted as reviewed;
- deterministic known nonreviewable reasons remain explicit;
- zero unknown path debt + no uncovered/unknown risk + no skill coverage debt + caller-asserted completed/no-known-truncation yields the bounded A6 proof state;
- input-order permutations yield byte-identical output/evidence identity;
- schema and source validator accept the canonical output;
- output is deeply immutable.

### Debt rejection

Reject at minimum:

- R22 context truncation, omission, stale context or context lineage mismatch;
- any changed reviewable path missing from the exact R22 context;
- unknown path coverage;
- R25 `HAS_UNCOVERED_RISK`, `HAS_UNKNOWN_APPLICABILITY`, or `HAS_UNCOVERED_AND_UNKNOWN`;
- non-empty R25 unknown or uncovered risk sets;
- R26 `HAS_COVERAGE_DEBT`;
- non-empty unknown/not-admitted/unavailable R26 skill debt sets;
- R27 non-`COMPLETED` termination;
- R27 completion debt, missing completion timestamp, or non-`NOT_TRUNCATED` state;
- cross-lineage repository/base/head/tree/change-set/review-universe mismatch;
- tampered predecessor evidence even when locally rehashed/self-consistent.

### Distinction tests

Prove that the output never creates:

- provider/model authenticity;
- provider invocation proof;
- external-clock authenticity;
- defect-free or safe-code truth;
- risk absence from risk accounting;
- skill trust from package/current/admission/execution references;
- retry authority;
- P7-to-K5 reconciliation proof;
- Done Gate proof or mutation;
- release/deployment/project-completion authority.

### Hostile-input tests

Reject bounded Proxy, accessor, symbol, sparse-array, unexpected-prototype, alias/cycle, non-JSON, unsafe-number, oversized-array/object/string, malformed-Unicode, malformed-identity and unknown-field cases consistent with current repository hardening precedent.

### Side-effect absence tests

Source/tests must establish no provider/model/tool invocation, no network/secret access, no retry/replay/resume, no filesystem writes, no persistence/telemetry, no K2/K5 mutation, no Done Gate invocation, no dependencies and no workflow expansion.

## 13. Donor/source rule

No donor source copy or dependency admission is authorized for A6.

The Tencent V3 material is design/failure-mode input only. If copied or derived donor source becomes necessary, stop before the copy and create a separate source-intake authorization with exact repository/head/tree/path/blob/license/notice/provenance fields.

Founder source-use permission does not bypass canonical source intake.

## 14. Preserved global authority boundaries

```text
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_DONE_GATE_AUTHORITY = UNCHANGED
PROOFGRAPH = NOT_AUTHORIZED
AUTOMATIC_FRESHNESS_DEPENDENCY_INVALIDATION = NOT_AUTHORIZED
PATCH_RETRY = NOT_AUTHORIZED
AUTOFIX_REMEDIATION_EXECUTION = NOT_AUTHORIZED
SKILL_TRUST_QUALIFICATION = NOT_AUTHORIZED
SKILL_INSTALLATION_ACTIVATION_ROUTING_EXECUTION = NOT_AUTHORIZED
CAPABILITY_APPROVAL = NOT_AUTHORIZED
LIVE_REVIEWER_PROVIDER_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
PROVIDER_RETRY_REPLAY_RESUME = NOT_AUTHORIZED
PROVIDER_SPEND = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
P7_TO_K5_RECONCILIATION_PROOF = NOT_ESTABLISHED
DONE_GATE_INVOCATION_OR_MUTATION = NOT_AUTHORIZED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## 15. Qualification gate for this authorization candidate

One unchanged exact head must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_DOCUMENT
NO_SECOND_PATH = PASS
V3_PLAN_PROOF = EXACTLY_REVERIFIED / 5575897235
R27_RECONCILIATION_PROOF = EXACTLY_REVERIFIED / 5588027874
POST_R27_SUCCESSOR_ANALYSIS = EXACTLY_REVERIFIED / 5588092657 / ANALYSIS_ONLY
A1_PROOF = EXACTLY_REVERIFIED / 5576403450
A2_PROOF = EXACTLY_REVERIFIED / 5576882384
A3_PROOF = EXACTLY_REVERIFIED / 5584759947
A4_PROOF = EXACTLY_REVERIFIED / 5586149075
A5_PROOF = EXACTLY_REVERIFIED / 5587661329
FUTURE_IMPLEMENTATION_ALLOWLIST = EXACTLY_3_PATHS
REQUIRED_CI = TERMINAL_SUCCESS OR CANONICALLY_PROVEN DOCS_ONLY NON_APPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
WAIVER = NO
```

Any head change invalidates exact-head review and CI evidence.

## 16. Mandatory post-merge activation proof

This authorization becomes canonical only after proof establishes at minimum:

```text
PR = CLOSED / MERGED
CANONICAL_MAIN = EXACT_MERGE_COMMIT
ORDERED_PARENT_1 = PRE_MERGE_MAIN
ORDERED_PARENT_2 = QUALIFIED_HEAD
MERGE_TREE = QUALIFIED_HEAD_TREE
MERGE_SIGNATURE = VERIFIED / VALID
MERGED_PATHS = EXACTLY_1_AUTHORIZATION_DOCUMENT
AUTHORIZATION_BLOB_ON_MAIN = QUALIFIED_HEAD_BLOB
APPLICABLE_POST_MERGE_GOVERNANCE = TERMINAL_SUCCESS
POST_MERGE_K2_PUSH = TERMINAL_SUCCESS OR CANONICALLY_PROVEN PATH_FILTER NON_APPLICABILITY
UNRESOLVED_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
WAIVER = NO
```

Only complete activation proof may establish:

```text
P7_R28_A6_COMPOSITE_FULL_EXACT_HEAD_REVIEW_COMPLETENESS_AUTHORIZATION = CLOSED_CANONICAL
P7_R28_A6_IMPLEMENTATION = AUTHORIZED_ONLY_FOR_EXACT_3_PATH_ALLOWLIST
```

Until then:

```text
P7_R28_A6_IMPLEMENTATION = NOT_AUTHORIZED
P7_TO_K5_RECONCILIATION = NOT_AUTHORIZED
DONE_GATE_INVOCATION_OR_MUTATION = NOT_AUTHORIZED
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```