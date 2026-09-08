# Kodac P7-R27 — Provider Attempt / Termination Evidence-binding Authorization Amendment Candidate

Status: **AUTHORIZATION_AMENDMENT_CANDIDATE / NOT_CANONICAL / IMPLEMENTATION REMAINS BLOCKED UNTIL MERGED AND POST-PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = af31cf5616aad64f50d759aa3943adead7078a3f
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = 6a537b8374a178b073308c0b3221e6bc80c84312
P7_R27_AUTHORIZATION = CLOSED_CANONICAL / PR #465 / proof 5586957364
P7_R27_IMPLEMENTATION_FEASIBILITY_ANALYSIS = PR #465 / comment 5587003085 / ANALYSIS_ONLY
P7_R27_IMPLEMENTATION = BLOCKED_PENDING_CANONICAL_AUTHORIZATION_AMENDMENT
WAIVER = NO
```

This amendment exists only to correct two implementation-contract mismatches proven against canonical Kodac source after authorization activation. It does not broaden the future implementation path allowlist, side-effect authority, provider/model/tool authority, retry authority, release authority, or project-completion authority.

Live GitHub truth, root `AGENTS.md`, the original P7-R27 authorization, this amendment when canonical, and ruleset `20707483` control this unit.

## 2. Proven mismatch A — exact R22 validation is asynchronous

Canonical R22 source:

```text
packages/kodac-runtime/src/remediation/p7-exact-target-head-complete-review-context-evidence-binding.ts
blob = 64dfe746cd30a6fd253c29d91dd2e31191f35627
```

The canonical validator is asynchronous:

```text
validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding(...) => Promise<P7ExactTargetHeadCompleteReviewContextEvidenceBinding>
```

Its canonical validation path transitively validates R21/R20 lineage and rebuilds K3-R5 context. Therefore the original requirement that A5 remain synchronous conflicts with the requirement to perform exact canonical R22 validation.

### Amendment A

The future A5 builder and validator are authorized to be **async only to the extent required by exact canonical R22 validation**.

The corrected execution-property contract is:

```text
PURE = YES
DETERMINISTIC = YES
DATA_ONLY = YES
CALLER_MATERIALIZED = YES
ASYNC = ALLOWED_ONLY_FOR_CANONICAL_R22_VALIDATION
NETWORK = NO
SECRET_ACCESS = NO
PROVIDER_MODEL_TOOL_INVOCATION = NO
CLOCK_READ = NO
RANDOMNESS = NO
PERSISTENCE = NO
TELEMETRY = NO
```

Async status does not create side-effect authority and does not authorize a new external read beyond whatever exact canonical R22 validator behavior already exists and is required to revalidate its bounded predecessor lineage.

A5 may not replace the canonical R22 validator with a weaker synchronous structural substitute.

## 3. Proven mismatch B — R20/R21/R22 do not bind targetTree

Canonical source interfaces inspected at the activated main:

```text
P7-R20 source blob = 49b9c2cc6842bf1048b316ceb7532732695e9892
P7-R21 source blob = f3d45269c8bfe3130de42139dee8cef572be6a69
P7-R22 source blob = 64dfe746cd30a6fd253c29d91dd2e31191f35627
```

They bind repository/base/head and review/context lineage but no `targetTree` field.

The original authorization requires A5 to bind `targetTree`; deriving it from R22 alone would therefore manufacture lineage.

Canonical P7-R26 skill-coverage evidence does bind:

```text
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
reviewUniverseIdentity
```

Canonical R26 source:

```text
packages/kodac-runtime/src/remediation/p7-skill-coverage-evidence-binding.ts
blob = 6b8646f6559d3d9c3236cc29020057f01266b976
```

### Amendment B

The future A5 input must require both:

```text
sourceExactTargetHeadCompleteReviewContextEvidenceBinding
sourceExactTargetHeadCompleteReviewContextEvidenceBindingInput
sourceSkillCoverageEvidenceBinding
sourceSkillCoverageEvidenceBindingInput
```

The implementation must:

1. validate the exact supplied R22 evidence with `validateP7ExactTargetHeadCompleteReviewContextEvidenceBinding` and its exact build input;
2. validate the exact supplied R26 evidence with `validateP7SkillCoverageEvidenceBinding` and its exact build input;
3. require exact equality of repository identity, canonical base, and target head between validated R22 and validated R26;
4. bind `targetTree`, `changedPathSetIdentity`, and `reviewUniverseIdentity` only from the validated R26 record;
5. bind review-run/context identity only from validated R22;
6. reject any R22/R26 cross-lineage mismatch fail-closed.

This does not claim that R22 itself contains or proves `targetTree`. The combined A5 lineage explicitly distinguishes:

```text
R22 = REVIEW_RUN_CONTEXT_LINEAGE_CARRIER
R26 = REPOSITORY_BASE_HEAD_TREE_AND_COVERAGE_LINEAGE_CARRIER
```

## 4. Corrected required build input

The future A5 build input may contain exactly:

```text
sourceExactTargetHeadCompleteReviewContextEvidenceBinding
sourceExactTargetHeadCompleteReviewContextEvidenceBindingInput
sourceSkillCoverageEvidenceBinding
sourceSkillCoverageEvidenceBindingInput
provenanceEvidence
attempt
```

Where:

- `provenanceEvidence` is a bounded array of zero or more exact P5-R1 evidence-provenance records paired with the caller-supplied material necessary for their canonical validation under the existing P5-R1 contract, if that canonical validator requires such material;
- `attempt` is one bounded caller-supplied provider-attempt descriptor carrying only the identities/evidence values authorized by the original P7-R27 authorization.

Exact implementation field names may be narrowed if source/schema/tests remain mutually consistent and no semantic requirement is lost.

No unbounded provider response, raw secret, credential, raw prompt, raw tool output, arbitrary filesystem payload, or executable payload may be accepted.

## 5. Corrected required output lineage

The original required output lineage remains, with explicit provenance of the previously ambiguous tree fields:

```text
version
state = PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
evidenceIdentity
repositoryIdentity                 # exact validated R22 == exact validated R26
canonicalBase                      # exact validated R22 == exact validated R26
targetHead                         # exact validated R22 == exact validated R26
targetTree                         # validated R26 only
changedPathSetIdentity             # validated R26 only
reviewUniverseIdentity             # validated R26 only
reviewContextEvidenceIdentity      # validated R22 only
reviewRunIdentity                  # validated R22 only
skillCoverageEvidenceIdentity      # validated R26 only
provenanceEvidenceSetIdentity
attemptIdentity
providerIdentity
modelIdentity
configurationIdentity
promptPolicyIdentity
toolPolicyIdentity
startedAt
completedAt
terminationReason
inputTokenOrBudgetEvidenceIdentity
outputTruncationState
outputTruncationEvidenceIdentity
toolCallCount
retryLineageIdentity
completionDebtIdentity
completionState
```

The implementation must not relabel an R26-derived tree as R22-derived evidence.

## 6. Corrected validation semantics

The future A5 contract must fail closed for at least:

```text
invalid or tampered R22 evidence
invalid or tampered R22 build input lineage
invalid or tampered R26 evidence
invalid or tampered R26 build input lineage
R22.repositoryIdentity != R26.repositoryIdentity
R22.canonicalBase != R26.canonicalBase
R22.targetHead != R26.targetHead
malformed or invalid supplied P5-R1 provenance evidence
unknown termination reason
COMPLETED without completedAt
COMPLETED without explicit non-truncation evidence state
material truncation hidden by COMPLETED
impossible local timestamp ordering
negative or unsafe toolCallCount
duplicate provenance identities
duplicate retry-lineage identities
unknown fields
hostile non-JSON graph structures
```

The future test file must prove that exact R22 validation is actually invoked. A fake self-consistent R22 object with a recomputed local hash but invalid canonical predecessor/build lineage must not be accepted.

The future test file must also prove that `targetTree` comes from validated R26 lineage and that a cross-lineage R22/R26 pair is rejected.

## 7. Preserved original A5 semantics

All non-conflicting requirements from the original P7-R27 authorization remain in force, including the exact bounded state:

```text
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
```

The only termination vocabulary remains:

```text
COMPLETED
TOKEN_LIMIT
TOOL_LIMIT
TIMEOUT
CANCELLED
PROVIDER_ERROR
POLICY_STOP
BUDGET_EXHAUSTED
UNKNOWN
```

Completion debt semantics remain unchanged. In particular:

```text
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != PROVIDER_INVOCATION_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != PROVIDER_AUTHENTICITY_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != TERMINATION_REASON_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != EXTERNAL_CLOCK_AUTHENTICITY_PROOF
CALLER_ASSERTED_PROVIDER_IDENTITY != VERIFIED_PROVIDER_IDENTITY
CALLER_ASSERTED_MODEL_IDENTITY != VERIFIED_MODEL_IDENTITY
CALLER_ASSERTED_COMPLETED != VERIFIED_COMPLETE_REVIEW
TERMINATION_REASON_COMPLETED != FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF
OUTPUT_NOT_TRUNCATED_REFERENCE != VERIFIED_OUTPUT_COMPLETENESS
RETRY_LINEAGE_REFERENCE != RETRY_AUTHORITY
P5_PROVENANCE != PROVIDER_INVOCATION_PROOF
P5_PROVENANCE != PROVIDER_AUTHENTICITY_PROOF
```

## 8. Exact implementation allowlist remains unchanged

After this amendment becomes `CLOSED_CANONICAL`, implementation authority remains limited to exactly:

```text
packages/kodac-runtime/src/remediation/p7-provider-attempt-termination-evidence-binding.ts
schema/p7-provider-attempt-termination-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r27-provider-attempt-termination-evidence-binding.test.ts
```

No fourth path is authorized.

This amendment does not authorize edits to R20/R21/R22/R26/P5 source, schema or tests; package-root exports; indexes; workflows; dependencies; lockfiles; provenance directories; current views; `AGENTS.md`; rulesets; release/package/deployment configuration; or historical authorization/evidence records.

## 9. Preserved forbidden behavior

The future implementation still may not:

```text
invoke a reviewer / provider / model / agent / tool
make network requests
read secrets or credentials
spend provider budget
retry / replay / resume a provider attempt
inspect provider APIs or remote logs
weaken or bypass canonical R22 validation
claim provider or model authenticity
claim termination authenticity
claim external-clock authenticity
infer complete review from COMPLETED
convert truncation or UNKNOWN into verified completion
invoke K2 or create K2 approvals
invoke K5 or mutate Done Gate state
persist database/cache/session/history state
emit telemetry/upload/learning data
add dependencies
modify workflows
modify rulesets
publish packages/releases
create deployment authority
```

## 10. Preserved global authority boundaries

```text
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_DONE_GATE_AUTHORITY = UNCHANGED
PROOFGRAPH = NOT_AUTHORIZED
AUTOMATIC_FRESHNESS_DEPENDENCY_INVALIDATION = NOT_AUTHORIZED
PATCH_RETRY = NOT_AUTHORIZED
AUTOFIX_REMEDIATION_EXECUTION = NOT_AUTHORIZED
LIVE_REVIEWER_PROVIDER_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
PROVIDER_RETRY_REPLAY_RESUME = NOT_AUTHORIZED
PROVIDER_SPEND = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF = NOT_ESTABLISHED
P7_TO_K5_RECONCILIATION_PROOF = NOT_ESTABLISHED
DONE_GATE_INVOCATION_OR_MUTATION = NOT_AUTHORIZED
A6_OR_LATER_IMPLEMENTATION = NOT_AUTHORIZED_BY_PLAN_COMPOSITION
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## 11. Amendment qualification, merge and activation gate

Before this amendment candidate may merge, one unchanged exact head must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY 1 AMENDMENT DOCUMENT
NO_SECOND_PATH = PASS
GOVERNANCE_CI = SUCCESS
PROVENANCE = SUCCESS
LEGACY_TESTS = SUCCESS
K2_RUNTIME_GATE = SUCCESS WITH DOCS_ONLY MATRIX SKIP WHEN CLASSIFIER SO DETERMINES
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
WAIVER = NO
```

Post-merge activation proof must establish PR closure/merge, exact canonical merge commit, ordered parents, merge-tree equality with qualified head, valid signature, exact one merged amendment path, amendment blob identity on main, applicable push governance success, K2 push success or canonically proven docs-only path-filter non-applicability, zero unresolved threads, active ruleset/no bypass, and waiver NO.

Only after complete amendment activation proof may:

```text
P7_R27_AUTHORIZATION_AMENDMENT = CLOSED_CANONICAL
P7_R27_IMPLEMENTATION_BLOCKER = CLEARED
P7_R27_IMPLEMENTATION_AUTHORITY = ACTIVE_ONLY_FOR_ORIGINAL_EXACT_3_PATH_ALLOWLIST_WITH_AMENDED_SEMANTICS
```

Until then:

```text
P7_R27_IMPLEMENTATION = BLOCKED
A6_OR_LATER_IMPLEMENTATION = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
```
