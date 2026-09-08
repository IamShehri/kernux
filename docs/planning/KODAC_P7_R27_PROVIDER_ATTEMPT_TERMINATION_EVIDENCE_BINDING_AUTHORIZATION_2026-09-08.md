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
P5_R1_EVIDENCE_PROVENANCE_BINDING = CLOSED_CANONICAL / BOUNDED_PROVIDER_NEUTRAL_PROVENANCE_ONLY
P7_R20_R22_REVIEW_CONTEXT_LINEAGE = CLOSED_CANONICAL AT EXACT RECORDED BOUNDED STATES
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

`P7-R27` is the label for this bounded governance unit. Numbering, Track A ordering and the canonical V3 planning document do not themselves create implementation authority.

This record creates implementation authority only if this exact authorization candidate independently qualifies, merges normally through protected `main` with an exact expected-head guard, and receives complete mandatory post-merge activation proof.

Live GitHub truth, root `AGENTS.md`, exact canonical authorization/evidence records and ruleset `20707483` override this document.

## 2. Why A5 is now the bounded next candidate

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
PURPOSE = prove whether review actually completed versus stopping by budget/time/provider/tool limits; bind provider/model/policy/tool surface
```

Fresh successor analysis `5586846775` found no existing A5 authorization or implementation on canonical `main`. It established only that one separately canonicalized bounded authorization candidate is eligible to be created.

This document is that candidate.

## 3. Existing Kodac prerequisites and their limits

A5 must compose existing Kodac evidence rather than invent provider execution truth.

Canonical P7 already provides bounded review-context lineage:

```text
P7-R20 = exact-target-head zero-finding review-run evidence binding
P7-R21 = temporal post-verification exact-head review evidence binding
P7-R22 = exact-target-head complete current review-context evidence binding
```

Canonical P5-R1 provides a pure provider-neutral provenance sidecar binding an already-existing evidence identity/ref/digest to exact revision, producer, configuration, policy, scope, input, environment and caller-supplied freshness-basis identities.

Those records do not prove:

```text
provider invocation occurred
provider/model identity is authentic
termination reason is authentic
external timestamps are authentic
review completed without truncation
retry was authorized
provider output is complete
complete-review truth is established
```

A5 must preserve those limits exactly.

## 4. Exact future implementation allowlist

Only after this authorization becomes `CLOSED_CANONICAL` may one later P7-R27 implementation candidate modify exactly:

```text
packages/kodac-runtime/src/remediation/p7-provider-attempt-termination-evidence-binding.ts
schema/p7-provider-attempt-termination-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r27-provider-attempt-termination-evidence-binding.test.ts
```

No fourth path is authorized.

The established P7-R23 through P7-R26 pattern demonstrates that this bounded contract can remain one standalone remediation source + JSON Schema + focused test file without requiring index/export mutation.

This authorization does not permit changes to any other production, schema, test, workflow, dependency, package, lockfile, provenance, documentation, ruleset, release or deployment path.

If a correct implementation requires any fourth path, stop and create a separately scoped canonical authorization amendment rather than expanding this unit.

## 5. Exact bounded implementation purpose

The future implementation may create one pure, synchronous, deterministic, data-only evidence-binding contract with bounded state:

```text
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
```

It may do only the following:

1. validate and bind one exact P7-R22 complete-review-context evidence record and preserve its repository/base/head/tree/review-context lineage;
2. optionally validate and bind one or more exact P5-R1 evidence-provenance records when supplied, without converting provenance metadata into provider authenticity or invocation proof;
3. bind caller-supplied provider, model, producer/configuration, prompt-policy and tool-policy identities as evidence references only;
4. bind one exact attempt identity;
5. bind caller-supplied `startedAt` and `completedAt` values using a deterministic bounded timestamp grammar without claiming external-clock authenticity;
6. record termination reason from the fixed vocabulary `COMPLETED | TOKEN_LIMIT | TOOL_LIMIT | TIMEOUT | CANCELLED | PROVIDER_ERROR | POLICY_STOP | BUDGET_EXHAUSTED | UNKNOWN`;
7. bind caller-supplied input-token or budget evidence identities;
8. bind caller-supplied output-truncation evidence identities and an explicit truncation state;
9. bind bounded tool-call count evidence and retry-lineage references;
10. preserve unknown, truncated, limit-exhausted, timeout, provider-error and budget-exhausted conditions as explicit completion debt rather than silently normalizing them to completed review;
11. emit one deterministic content-addressed provider-attempt/termination evidence record and completion-debt identity;
12. remain entirely caller-materialized and side-effect free.

The implementation may reject inconsistent combinations fail-closed. It may not synthesize missing evidence.

## 6. Termination and completion semantics

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

Minimum consistency rules:

- `COMPLETED` requires an explicit completion timestamp and explicit caller-supplied evidence that no known output truncation remains;
- `TOKEN_LIMIT`, `TOOL_LIMIT`, `TIMEOUT`, `PROVIDER_ERROR`, `BUDGET_EXHAUSTED` and `UNKNOWN` always remain completion debt;
- `CANCELLED` and `POLICY_STOP` remain explicit non-completion dispositions unless a later separately authorized contract proves otherwise;
- missing termination evidence must not default to `COMPLETED`;
- output truncation must remain explicit and cannot be erased by `terminationReason=COMPLETED`;
- retry lineage is evidence reference only and grants no retry/replay authority;
- timestamps may be checked for deterministic grammar and local ordering only; they are not externally authenticated clocks;
- provider/model identities are caller-supplied evidence references unless separately verified by a distinct canonical contract.

## 7. Required output lineage

The future A5 record must bind at minimum:

```text
version
state = PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
evidenceIdentity
repositoryIdentity
canonicalBase
targetHead
targetTree
reviewContextEvidenceIdentity
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

Exact field names may be narrowed only if schema/source/test remain mutually consistent and every semantic requirement remains represented.

No output field may claim verified provider invocation, provider authenticity, termination authenticity, external-clock authenticity, complete review, Done Gate, release or project-completion truth.

## 8. Determinism, safety and bounded-input requirements

The implementation must follow the hardening pattern already proven in P7-R23 through P7-R26:

- ordinary JSON-compatible data only;
- reject Proxy values before trap-triggering access where practical under existing runtime patterns;
- reject accessors, symbols, unsupported prototypes, sparse arrays, aliases/cycles, non-finite values and unsafe integers;
- enforce deterministic depth, node, array-count, string-count and UTF-8 byte limits before unbounded work;
- reject unknown object fields;
- reject malformed SHA-256 and Git commit identities;
- deterministic sort order for evidence/ref sets;
- duplicate identities and retry-lineage references rejected fail-closed;
- exact R22 evidence validation and lineage consistency required;
- exact P5-R1 validation/linkage required when provenance inputs are supplied;
- output deeply immutable according to established bounded evidence patterns;
- evidence identity derived from canonical deterministic serialization only;
- no clock read, randomness, ambient environment, process state or external I/O.

## 9. Explicit forbidden implementation behavior

The exact three implementation paths may not:

```text
invoke a reviewer / provider / model / agent / tool
make network requests
read secrets or credentials
spend provider budget
retry / replay / resume a provider attempt
inspect provider APIs or remote logs
claim provider or model authenticity
claim external-clock authenticity
infer completion from absence of an error
convert truncation or UNKNOWN into COMPLETED
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

## 10. Mandatory non-equivalences

The implementation, schema, tests, PR body, review and post-merge proof must preserve all of the following:

```text
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != PROVIDER_INVOCATION_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != PROVIDER_AUTHENTICITY_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != TERMINATION_REASON_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != EXTERNAL_CLOCK_AUTHENTICITY_PROOF
CALLER_ASSERTED_PROVIDER_IDENTITY != VERIFIED_PROVIDER_IDENTITY
CALLER_ASSERTED_MODEL_IDENTITY != VERIFIED_MODEL_IDENTITY
CALLER_ASSERTED_COMPLETED != VERIFIED_COMPLETE_REVIEW
TERMINATION_REASON_COMPLETED != FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF
UNKNOWN != COMPLETED
TOKEN_LIMIT != COMPLETED
TOOL_LIMIT != COMPLETED
TIMEOUT != COMPLETED
CANCELLED != COMPLETED
PROVIDER_ERROR != COMPLETED
POLICY_STOP != COMPLETED
BUDGET_EXHAUSTED != COMPLETED
OUTPUT_NOT_TRUNCATED_REFERENCE != VERIFIED_OUTPUT_COMPLETENESS
RETRY_LINEAGE_REFERENCE != RETRY_AUTHORITY
P5_PROVENANCE != PROVIDER_INVOCATION_PROOF
P5_PROVENANCE != PROVIDER_AUTHENTICITY_PROOF
P7_R27_CLOSED != P7_OVERALL_CLOSED
P7_R27_CLOSED != K5_RECONCILIATION_PROOF
P7_R27_CLOSED != DONE_GATE_PROOF
P7_R27_CLOSED != RELEASE_AUTHORITY
P7_R27_CLOSED != PROJECT_COMPLETION
```

## 11. Test obligations for the future implementation

The exact test path must prove at minimum:

### Positive deterministic contract

- valid exact R22 evidence plus bounded attempt/termination input produces deterministic identical A5 evidence independent of caller input ordering;
- optional P5-R1 provenance inputs are validated and deterministically bound when present;
- exact repository/base/head/tree lineage remains identical to the validated R22 input;
- termination vocabulary is closed and deterministic;
- completion debt changes deterministically when termination/truncation evidence changes;
- output validates through JSON Schema and source validator;
- output is deeply immutable.

### Distinction tests

- `COMPLETED` never becomes verified complete review;
- `COMPLETED` with material truncation is rejected or remains explicit completion debt according to one deterministic contract;
- `TOKEN_LIMIT`, `TOOL_LIMIT`, `TIMEOUT`, `PROVIDER_ERROR`, `BUDGET_EXHAUSTED` and `UNKNOWN` never normalize to completed;
- retry lineage never becomes retry authority;
- P5 provenance never becomes provider invocation/authenticity proof;
- caller-supplied timestamps never become external-clock proof.

### Fail-closed linkage tests

Reject at minimum:

- tampered R22 evidence or lineage identity;
- mismatched repository/base/head/tree lineage;
- malformed or tampered P5-R1 evidence when supplied;
- duplicate provenance or retry-lineage identities;
- unknown termination reason;
- completion without required completion timestamp;
- completion with missing explicit truncation evidence/state;
- negative tool-call count or unsafe integer;
- malformed provider/model/policy/configuration identities;
- impossible local timestamp ordering;
- unknown object fields.

### Hostile-input tests

Reject bounded hostile structures consistent with repository precedent, including Proxy, accessor properties, symbol properties, unexpected prototypes, sparse arrays, cycles/aliases, non-JSON values, unsafe numerics, oversized arrays/objects/strings, malformed Unicode scalar sequences, malformed SHA-256/Git identities and unknown fields.

### Side-effect absence tests

The source and tests must enforce no provider/model invocation, no network/secret access, no budget spend, no retry/replay, no filesystem/provider-log discovery, no K2/K5 mutation, no persistence/telemetry and no dependency/workflow expansion.

## 12. Donor/source rule

This authorization permits no donor source copy and no dependency admission.

The V3 donor material is failure-mode/design input only for this unit. If implementation requires copied or derived donor source, stop before the copy and create a separately canonicalized source-intake authorization with exact donor repository/head/tree/path/blob/license/notice/provenance fields.

Founder source-use permission does not bypass that requirement.

## 13. Preserved global authority boundaries

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

## 14. Qualification, merge and activation gate for this authorization

Before this authorization candidate may merge, one unchanged exact head must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY 1 AUTHORIZATION DOCUMENT
NO_SECOND_PATH = PASS
GOVERNANCE_CI = SUCCESS
PROVENANCE = SUCCESS
LEGACY_TESTS = SUCCESS
K2_RUNTIME_GATE = SUCCESS WITH DOCS-ONLY MATRIX SKIP WHEN CLASSIFIER SO DETERMINES
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
WAIVER = NO
```

This candidate may merge only with the exact qualified head and normal protected-main merge semantics. No force-push, rebase, history rewrite or bypass is permitted.

Post-merge activation proof must establish at minimum:

```text
PR = CLOSED / MERGED
CANONICAL_MAIN = EXACT MERGE COMMIT
ORDERED_PARENT_1 = PRE_MERGE_MAIN
ORDERED_PARENT_2 = QUALIFIED_HEAD
MERGE_TREE = QUALIFIED_HEAD_TREE
MERGE_SIGNATURE = VERIFIED / VALID
MERGED_PATHS = EXACTLY 1 AUTHORIZATION DOCUMENT
AUTHORIZATION_BLOB_ON_MAIN = QUALIFIED_HEAD_BLOB
APPLICABLE_POST_MERGE_GOVERNANCE = TERMINAL SUCCESS
POST_MERGE_K2_PUSH = SUCCESS OR CANONICALLY PROVEN PATH-FILTER NON_APPLICABILITY
UNRESOLVED_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
WAIVER = NO
```

Only after complete activation proof may:

```text
P7_R27_PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BINDING_AUTHORIZATION = CLOSED_CANONICAL
P7_R27_IMPLEMENTATION = AUTHORIZED_ONLY_FOR_EXACT_3_PATH_ALLOWLIST
```

Until then:

```text
P7_R27_IMPLEMENTATION = NOT_AUTHORIZED
A6_OR_LATER_IMPLEMENTATION = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
```
