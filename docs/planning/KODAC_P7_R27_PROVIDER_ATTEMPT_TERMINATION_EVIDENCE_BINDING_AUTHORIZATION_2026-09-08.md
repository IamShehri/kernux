# Kodac P7-R27 — Provider Attempt / Termination Evidence-binding Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY UNTIL MERGED AND POST-PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 9f96c456c89ce77ae78951a45e6662a49a67a1d3
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = e9a4e0284564c51440afa940863a19f615e2fd0a
TENCENT_DONOR_SYNTHESIS_AND_COMPLETE_REVIEW_MASTER_PLAN_V3 = CLOSED_CANONICAL / PLANNING_ONLY / PR #448 / proof 5575897235
A1_P7_R23_REVIEW_COVERAGE_UNIVERSE = CLOSED_CANONICAL / PR #450 / proof 5576403450 / REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY
A2_P7_R24_DETERMINISTIC_SECURITY_PRE_SCAN = CLOSED_CANONICAL / PR #454 / proof 5576882384 / DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY
A3_P7_R25_RISK_COVERAGE = CLOSED_CANONICAL / PR #458 / proof 5584759947 / RISK_COVERAGE_EVIDENCE_BOUND_ONLY
A4_P7_R26_SKILL_COVERAGE = CLOSED_CANONICAL / PR #462 / proof 5586149075 / SKILL_COVERAGE_EVIDENCE_BOUND_ONLY
P7_R26_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #464 / proof 5586759046
POST_R26_SUCCESSOR_AUTHORITY_ANALYSIS = PR #464 / comment 5586846775 / ANALYSIS_ONLY
SUPPLEMENTAL_POST_R26_ANALYSIS = PR #464 / comment 5586893370 / ANALYSIS_ONLY
P7_R20_R22_REVIEW_LINEAGE = CLOSED_CANONICAL AT EXACT RECORDED BOUNDED STATES
P5_R1_EVIDENCE_PROVENANCE_BINDING = CLOSED_CANONICAL / AVAILABLE BUT NOT REQUIRED BY THIS BOUNDED SLICE
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

`P7-R27` is the label for this bounded governance unit. Numbering, Track A ordering and the canonical V3 planning document do not themselves create implementation authority.

This record creates implementation authority only if this exact authorization candidate independently qualifies, merges normally through protected `main` with an exact expected-head guard, and receives complete mandatory post-merge activation proof.

Live GitHub truth, root `AGENTS.md`, exact canonical authorization/evidence records and ruleset `20707483` override this document.

## 2. Why A5 is the bounded next candidate

The canonical V3 master plan defines Track A as a dependency-ordered complete-review evidence sequence and explicitly states that the sequence is planning, not implementation authority.

The first four Track A candidates now have independently canonical bounded implementations and current-view reconciliation through A4:

```text
A1 = REVIEW COVERAGE UNIVERSE
A2 = DETERMINISTIC SECURITY PRE-SCAN EVIDENCE
A3 = RISK COVERAGE EVIDENCE
A4 = SKILL COVERAGE EVIDENCE
```

The next dependency-ordered planning candidate is:

```text
A5 = PROVIDER ATTEMPT / TERMINATION EVIDENCE
PURPOSE = distinguish an actually completed review attempt from termination by token/tool/time/provider/policy/budget limits and bind the provider/model/policy/tool attempt surface
```

Fresh successor analysis `5586846775`, supplemented by `5586893370`, found no canonical A5 authorization or implementation on `main`. Those analyses create no code authority. They establish only that one separately canonicalized bounded A5 authorization candidate is eligible to be created.

This document is that authorization candidate.

## 3. Existing Kodac prerequisites and exact residual gap

A5 must compose existing Kodac evidence rather than invent provider execution truth.

Canonical P7 provides these bounded review-lineage surfaces:

```text
P7-R20 = EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY
P7-R21 = TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY
P7-R22 = EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY
P7-R26 = SKILL_COVERAGE_EVIDENCE_BOUND_ONLY
```

The exact current contracts provide different required facts:

```text
P7-R20 binds reviewRunIdentity, providerId, providerVersion, reviewPolicyIdentity, reviewContextBundleIdentity, task/instructions identity and COMPLETED review status at the exact target head.
P7-R21 binds the exact R20 reviewRunIdentity to reviewStartedAt and reviewCompletedAt after the verification-completed event.
P7-R22 binds the exact current review-context lineage but does not contain targetTree.
P7-R26 binds the A1-A4 chain and carries repositoryIdentity, canonicalBase, targetHead, targetTree, changedPathSetIdentity, reviewUniverseIdentity and bounded risk/skill coverage debt.
```

Canonical P5-R1 provides a generic provider-neutral provenance sidecar over caller-supplied producer/configuration/policy/scope/input/environment identities. It remains useful general infrastructure, but it is not required by this minimal A5 slice and does not prove provider invocation, provider authenticity, review completion or termination reason.

The concrete A5 residual gap is that canonical KRI/P7 review-run evidence does **not** bind an attempt-specific model identity, tool-policy identity, provider-native termination reason, input/output token-or-budget evidence, output-truncation evidence, tool-call count or retry-lineage evidence.

Also:

```text
ReviewRunRecord.status = COMPLETED != PROVIDER TERMINATION COMPLETENESS PROOF
P7-R22 != TARGET TREE SOURCE
P7-R20/R21 VALIDATION = ASYNC CANONICAL PREDECESSOR VALIDATION
```

A5 must preserve these facts. It must not manufacture missing provider metadata or falsely describe exact predecessor validation as synchronous.

## 4. Exact future implementation allowlist

Only after this authorization becomes `CLOSED_CANONICAL` may one later P7-R27 implementation candidate modify exactly:

```text
packages/kodac-runtime/src/remediation/p7-provider-attempt-termination-evidence-binding.ts
schema/p7-provider-attempt-termination-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r27-provider-attempt-termination-evidence-binding.test.ts
```

No fourth path is authorized.

The P7-R23 through P7-R26 pattern demonstrates that this bounded contract can remain one standalone remediation source + JSON Schema + focused test file without requiring package-root/index export mutation.

This authorization does not permit changes to any other production, schema, test, workflow, dependency, package, lockfile, provenance, documentation, ruleset, release or deployment path.

If correct implementation requires any fourth path, KRI runtime mutation, provider adapter mutation, workflow mutation or dependency addition, stop and require a separately canonicalized authorization amendment.

## 5. Exact bounded implementation purpose

The future implementation may create one deterministic, content-addressed, caller-materialized, side-effect-bounded evidence contract with state:

```text
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
```

It may do only the following:

1. validate and bind one exact P7-R26 skill-coverage evidence/build-input pair and preserve its A1-A4 repository/base/head/tree/changed-path/review-universe lineage and bounded coverage-debt identities;
2. validate and bind one exact P7-R21 temporal evidence/build-input pair, thereby retaining the canonical R20 review-run predecessor lineage already carried by R21;
3. revalidate the exact nested P7-R20 review-run evidence/build-input pair needed to bind provider id/version and review-run identity without changing KRI execution semantics;
4. require P7-R26 and P7-R21/R20 to agree on repository identity, canonical base and target head;
5. bind the exact R20 `reviewRunIdentity`, provider id/version, review policy identity and review instructions identity;
6. bind exact R21 `reviewStartedAt` and `reviewCompletedAt` timestamps; caller attempt timestamps must match these canonical predecessor values rather than creating a second time lineage;
7. bind one caller-supplied attempt identity plus caller-supplied model/configuration/prompt-policy/tool-policy evidence identities;
8. record termination reason from the fixed vocabulary `COMPLETED | TOKEN_LIMIT | TOOL_LIMIT | TIMEOUT | CANCELLED | PROVIDER_ERROR | POLICY_STOP | BUDGET_EXHAUSTED | UNKNOWN`;
9. bind caller-supplied input-token-or-budget evidence identity, output-truncation state/evidence identity, bounded tool-call count and retry-lineage evidence identities;
10. preserve `UNKNOWN`, truncation, token/tool/time/budget limits, cancellation, provider error and policy stop as explicit completion debt rather than silently normalizing them to complete review;
11. emit deterministic completion-state and completion-debt identities without claiming independent provider observation;
12. remain free of new provider/model/tool/network/secret/filesystem/Git/K2/K5/persistence/telemetry side effects.

The implementation may reject inconsistent combinations fail-closed. It may not synthesize missing evidence.

## 6. Async predecessor-validation boundary

The future A5 builder/validator may be `async` **only** because the existing canonical P7-R20/P7-R21 predecessor validators are asynchronous and must be reused for exact predecessor revalidation.

```text
ASYNC API != PROVIDER INVOCATION AUTHORITY
ASYNC API != NETWORK AUTHORITY
ASYNC API != RETRY AUTHORITY
ASYNC API != NEW I/O AUTHORITY
```

The implementation may invoke only the already-canonical predecessor validation functions over caller-supplied predecessor records/build inputs. It may not introduce any new provider, network, filesystem, Git, secret, persistence, telemetry or clock read.

No authorization in this record permits changing the behavior of R20, R21, R22, R26, KRI or any predecessor runtime.

## 7. Attempt input and consistency semantics

The bounded caller-supplied attempt descriptor may contain only inert data sufficient to represent:

```text
attemptIdentity
providerId
providerVersion
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
retryLineageEvidenceIdentities
```

Required consistency rules:

- `providerId` and `providerVersion` must exactly match the validated R20 predecessor;
- `startedAt` and `completedAt` must exactly match the validated R21 predecessor;
- the validated R20 review-run identity carried by R21 must be the exact R20 review-run identity bound by A5;
- P7-R26 and R20/R21 must bind the same repository identity, canonical base and target head;
- `targetTree` comes only from the validated P7-R26 evidence and must not be invented from R22/R20/R21;
- `modelIdentity`, `configurationIdentity`, `promptPolicyIdentity`, `toolPolicyIdentity` and attempt-specific evidence identities remain caller-supplied bounded evidence references unless separately verified by another canonical contract;
- `reviewPolicyIdentity` and `reviewInstructionsIdentity` from R20 remain explicit predecessor facts and must not be silently replaced by caller prompt/tool-policy references;
- retry lineage is evidence only and grants no retry, replay or resume authority.

## 8. Termination and completion semantics

The only allowed termination vocabulary is:

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

The only allowed truncation vocabulary is:

```text
NOT_TRUNCATED_REFERENCE
TRUNCATED
UNKNOWN
```

A bounded completion-state vocabulary may be:

```text
ACCOUNTED_NO_KNOWN_TERMINATION_DEBT
HAS_TERMINATION_OR_COMPLETENESS_DEBT
```

Minimum rules:

- `COMPLETED` is eligible for `ACCOUNTED_NO_KNOWN_TERMINATION_DEBT` only when all required attempt evidence exists, timestamps match R21 exactly, and truncation state is `NOT_TRUNCATED_REFERENCE` with explicit truncation evidence identity;
- `TOKEN_LIMIT`, `TOOL_LIMIT`, `TIMEOUT`, `CANCELLED`, `PROVIDER_ERROR`, `POLICY_STOP`, `BUDGET_EXHAUSTED` and `UNKNOWN` always produce `HAS_TERMINATION_OR_COMPLETENESS_DEBT`;
- `TRUNCATED` or `UNKNOWN` truncation always produces debt even if termination reason is `COMPLETED`;
- missing termination/truncation evidence must never default to a positive state;
- zero known termination debt is structural accounting only and is not complete-review proof;
- tool-call count is bounded caller-supplied evidence and does not prove that all tool calls were observed;
- timestamps are inherited from canonical R21 evidence but R21 itself does not establish an independently authenticated external clock;
- provider/model identity references are not provider/model authenticity proof.

## 9. Required output lineage

The future A5 record must bind at minimum:

```text
version
state = PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
evidenceIdentity
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
reviewUniverseIdentity
skillCoverageEvidenceIdentity
riskCoverageEvidenceIdentity
skillCoverageDebtIdentity
skillCoverageState
sourceTemporalReviewEvidenceIdentity
sourceExactTargetHeadReviewRunEvidenceIdentity
reviewRunIdentity
reviewProviderId
reviewProviderVersion
reviewPolicyIdentity
reviewInstructionsIdentity
attemptIdentity
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
retryLineageEvidenceIdentities
retryLineageIdentity
completionDebtIdentity
completionState
```

Exact field names may be narrowed only if source/schema/test remain mutually consistent and every required distinction and lineage relationship remains represented.

No output field may claim verified provider invocation, provider/model authenticity, provider-native termination authenticity, independent clock authenticity, complete review, K5 reconciliation, Done Gate, release or project-completion truth.

## 10. Determinism, safety and bounded-input requirements

The implementation must follow the hardening pattern already proven in P7-R23 through P7-R26:

- ordinary JSON-compatible caller data only;
- reject Proxy values before trap-triggering property access where practical under existing runtime patterns;
- reject accessors, symbols, unsupported prototypes, sparse arrays, aliases/cycles, non-finite values and unsafe integers;
- enforce deterministic depth, node, array-count and UTF-8/string-byte limits before unbounded work;
- reject unknown object fields;
- reject malformed SHA-256 and Git identities according to the predecessor and A5 field grammar;
- deterministic sort order for evidence/ref sets;
- duplicate retry-lineage identities rejected fail-closed;
- exact R26 validation and lineage consistency required;
- exact R21/R20 validation and cross-lineage consistency required;
- output deeply immutable according to established bounded evidence patterns;
- evidence identity derived from canonical deterministic serialization only;
- no new clock read, randomness, ambient environment, process-state dependence or external I/O.

## 11. Explicit forbidden implementation behavior

The exact three implementation paths may not:

```text
modify KRI provider/executor semantics
modify P7-R20/R21/R22/R26 predecessor semantics
invoke a reviewer / provider / model / agent / tool
make network requests
read secrets or credentials
spend provider budget
retry / replay / resume a provider attempt
inspect provider APIs or remote logs
claim provider or model authenticity
claim provider-native termination authenticity
claim independent external-clock authenticity
infer completion from ReviewRunRecord.status alone
infer completion from absence of an error
convert truncation or UNKNOWN into complete review
invoke K2 or create K2 approvals
invoke K5 or mutate Done Gate state
write filesystem/repository state beyond normal candidate-file creation under this authorization
persist database/cache/session/history state
emit telemetry/upload/learning data
add dependencies
modify workflows
modify rulesets
publish packages/releases
create deployment authority
```

## 12. Mandatory non-equivalences

The implementation, schema, tests, PR body, review and post-merge proof must preserve all of the following:

```text
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != PROVIDER_INVOCATION_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != MODEL_INVOCATION_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != PROVIDER_AUTHENTICITY_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != TERMINATION_REASON_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != EXTERNAL_CLOCK_AUTHENTICITY_PROOF
CALLER_ASSERTED_PROVIDER_METADATA != INDEPENDENTLY_OBSERVED_PROVIDER_FACT
CALLER_ASSERTED_MODEL_IDENTITY != VERIFIED_MODEL_IDENTITY
REVIEW_RUN_STATUS_COMPLETED != PROVIDER_TERMINATION_COMPLETENESS_PROOF
TERMINATION_REASON_COMPLETED != VERIFIED_COMPLETE_REVIEW
ACCOUNTED_NO_KNOWN_TERMINATION_DEBT != FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF
OUTPUT_NOT_TRUNCATED_REFERENCE != VERIFIED_OUTPUT_COMPLETENESS
TOOL_CALL_COUNT_REFERENCE != COMPLETE_TOOL_OBSERVATION_PROOF
RETRY_LINEAGE_REFERENCE != RETRY_AUTHORITY
P7_R20_ZERO_FINDING != COMPLETE_REVIEW
P7_R21_TEMPORAL_BINDING != COMPLETE_REVIEW
P7_R22_CONTEXT_BINDING != COMPLETE_REVIEW
P7_R26_SKILL_COVERAGE_EVIDENCE_BOUND_ONLY != PROVIDER_TERMINATION_REASON_PROOF
P7_R27_CLOSED != A6_IMPLEMENTATION_AUTHORITY
P7_R27_CLOSED != K5_RECONCILIATION_PROOF
P7_R27_CLOSED != DONE_GATE_PROOF
P7_R27_CLOSED != P7_OVERALL_CLOSED
P7_R27_CLOSED != RELEASE_AUTHORITY
P7_R27_CLOSED != PROJECT_COMPLETION
```

## 13. Future implementation test obligations

The exact test path must prove at minimum:

### Positive deterministic contract

- valid exact R26 plus matching exact R21/R20 predecessor evidence and one bounded attempt descriptor produce deterministic identical A5 evidence independent of caller ordering of set-like inputs;
- R26 repository/base/head/tree/changed-path/review-universe lineage is preserved exactly;
- R20 provider id/version, review-run identity, review policy identity and review instructions identity are preserved exactly;
- R21 review start/completion timestamps are preserved exactly;
- completion debt changes deterministically when termination/truncation state changes;
- output validates through JSON Schema and source validator;
- output is deeply immutable.

### Cross-lineage fail-closed tests

Reject at minimum:

- tampered R26 evidence or build-input lineage;
- tampered R21 or nested R20 evidence/build-input lineage;
- R26 vs R21/R20 repository mismatch;
- R26 vs R21/R20 canonical-base mismatch;
- R26 vs R21/R20 target-head mismatch;
- attempt provider id/version mismatch with R20;
- attempt start/completion timestamp mismatch with R21;
- review-run identity mismatch between R20 and R21 lineage;
- any attempt to derive `targetTree` from R20/R21/R22 instead of R26.

### Termination distinction tests

- `COMPLETED` never becomes verified complete review;
- `COMPLETED + TRUNCATED` remains debt;
- `COMPLETED + UNKNOWN truncation` remains debt;
- `TOKEN_LIMIT`, `TOOL_LIMIT`, `TIMEOUT`, `CANCELLED`, `PROVIDER_ERROR`, `POLICY_STOP`, `BUDGET_EXHAUSTED` and `UNKNOWN` never normalize to no-debt state;
- retry lineage never becomes retry authority;
- R20 `status=COMPLETED` never substitutes for A5 termination evidence;
- caller-supplied model/tool-policy/configuration identity never becomes verified provider fact.

### Hostile-input tests

Reject bounded hostile structures consistent with repository precedent, including:

```text
Proxy
accessor properties
symbol properties
unexpected prototypes
sparse arrays
cycles / aliases
non-JSON values
unsafe numeric values
oversized arrays / objects / strings
invalid Unicode scalar sequences where applicable
malformed SHA-256 / Git identities
unknown fields
```

### Side-effect absence tests

The source and tests must enforce no provider/model invocation, no network/secret access, no provider spend, no retry/replay/resume, no provider-log discovery, no new filesystem/Git access, no K2/K5 mutation, no persistence/telemetry, no dependency/workflow expansion and no package-root integration.

## 14. Donor/source rule

This authorization permits no donor source copy and no dependency admission.

The V3 Tencent donor material is failure-mode/design input only for this unit. The primary implementation inputs are Kodac-native canonical P7-R20/R21/R26 contracts plus bounded caller-supplied attempt metadata.

If implementation requires copied or derived donor source, stop before the copy and create a separately canonicalized source-intake authorization with exact donor repository/head/tree/path/blob/license/notice/provenance fields.

Founder source-use permission does not bypass that requirement.

## 15. Preserved global authority boundaries

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

## 16. Authorization qualification gate

Before this authorization candidate may merge, one unchanged exact head must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY 1 AUTHORIZATION DOCUMENT
NO_SECOND_PATH = PASS
REQUIRED_CI = TERMINAL SUCCESS OR CANONICALLY PROVEN DOCS-ONLY NON-APPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
WAIVER = NO
```

Any change to head/base/path/ruleset invalidates prior qualification. The candidate may merge only through normal protected-main merge-commit semantics using the exact final qualified `expected_head_sha`. No force-push, rebase, history rewrite or bypass is permitted.

## 17. Mandatory authorization post-merge activation proof

Implementation authority becomes active only after proof verifies:

```text
PR_CLOSED_MERGED
EXACT_CANONICAL_MERGE_COMMIT
ORDERED_PARENTS
MERGE_TREE == QUALIFIED_HEAD_TREE
AUTHORIZATION_BLOB_ON_MAIN == QUALIFIED_HEAD_BLOB
VALID_MERGE_SIGNATURE
MERGED_PATHS = EXACTLY 1 AUTHORIZATION DOCUMENT
APPLICABLE_POST_MERGE_GOVERNANCE = TERMINAL SUCCESS
POST_MERGE_K2_PUSH = SUCCESS OR CANONICALLY PROVEN DOCS-ONLY NON-APPLICABILITY
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
WAIVER = NO
```

Only that activation proof may establish:

```text
P7_R27_A5_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BINDING_AUTHORIZATION = CLOSED_CANONICAL
P7_R27_A5_EXACT_THREE_PATH_IMPLEMENTATION = AUTHORIZED_TO_BEGIN
```

It still must not establish:

```text
A5_IMPLEMENTATION = CLOSED
A6_IMPLEMENTATION_AUTHORITY
P7_OVERALL_CLOSED
K5_RECONCILIATION_PROOF
DONE_GATE_PROOF
RELEASE_AUTHORITY
PROJECT_COMPLETION
```

## 18. Stop / successor rule

After any future exact three-path A5 implementation independently qualifies, merges guarded and receives complete post-merge implementation closure proof, stop before any A6 or later implementation.

First perform fresh current-view drift analysis. If reconciliation is required, separately canonicalize that reconciliation authority, reconcile only its exact allowlist, and prove that reconciliation closed. Only then may a fresh successor-authority analysis determine whether V3 A6 is eligible for a separately authorized candidate.

```text
P7_R27_AUTHORIZATION_CLOSED != P7_R27_IMPLEMENTATION_CLOSED
P7_R27_IMPLEMENTATION_CLOSED != P7_R27_CURRENT_VIEW_RECONCILIATION_CLOSED
P7_R27_CLOSED != A6_AUTHORITY
P7_R27_CLOSED != P7_OVERALL_CLOSED
P7_R27_CLOSED != RELEASE_AUTHORITY
P7_R27_CLOSED != PROJECT_COMPLETION
WAIVER = NO
```
