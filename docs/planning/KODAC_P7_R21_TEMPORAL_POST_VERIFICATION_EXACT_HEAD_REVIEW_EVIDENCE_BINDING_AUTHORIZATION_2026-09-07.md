# Kodac P7-R21 — Temporal Post-Verification Exact-Head Review Evidence-Binding Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY_UNTIL_MERGED_AND_POST_PROVEN**  
Date: 2026-09-07  
Decision owner: Kodac founder  
Waiver: **NO**

## Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = ca977eee0131323ef42ea2feb80fecce690e2816
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = 3a225aeb445db4d97ee91b6d03ca1f54808ce0fe
P7_R20_RECONCILIATION = CLOSED_CANONICAL / PR #439 / proof 5574794339
POST_R20_SUCCESSOR_ANALYSIS = PR #439 / comment 5574838337 / ANALYSIS_ONLY
P7_R20_STATE = EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
RELEASE_AUTHORITY = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This record authorizes no implementation until this exact documentation-only candidate independently qualifies, merges through normal guarded merge-commit semantics, and receives complete mandatory post-merge proof.

The descriptive label `P7-R21` is not authority by numbering.

## Exact future implementation allowlist

If and only if this authorization becomes `CLOSED_CANONICAL`, one bounded implementation candidate may add or modify exactly:

```text
packages/kodac-runtime/src/reviewer-intelligence/temporal-evidence.ts
packages/kodac-runtime/src/remediation/p7-temporal-post-verification-review-evidence-binding.ts
schema/p7-temporal-post-verification-review-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r21-temporal-post-verification-review-evidence-binding.test.ts
```

No fifth path is authorized. In particular, no edit to `executor.ts`, `provider-contracts.ts`, package-root exports, workflow files, dependency manifests, lockfiles, rulesets, or canonical current views is authorized by this record.

## Bounded implementation objective

The future candidate may add one sibling temporal-evidence helper and one pure P7 evidence-binding contract.

The temporal-evidence helper may:

1. wrap one caller-supplied invocation of the already-existing `ReviewerExecutionRuntime.execute()` semantics without changing those semantics;
2. capture one canonical UTC `startedAt` immediately before the wrapped execution begins;
3. capture one canonical UTC `completedAt` immediately after a successful wrapped execution returns;
4. bind those timestamps to the exact returned `reviewRunIdentity`, `canonicalBase`, `reviewedHead`, `evaluatedHead`, and `status`;
5. content-address a closed, deterministic normalized temporal-evidence record;
6. expose a standalone validator for that temporal-evidence record;
7. leave the historical `ReviewRunRecord` bytes and KRI-R3 identity semantics unchanged.

A deterministic injectable clock may be used only as a bounded construction/test seam. The evidence contract must validate canonical UTC timestamps and timestamp ordering independently. Clock injection is not clock authenticity and must not be described as such.

The P7 evidence-binding contract may:

1. canonically revalidate the exact P7-R20 source/build-input pair;
2. canonically validate one sibling temporal-evidence record;
3. require the temporal record `reviewRunIdentity` to equal the exact R20-bound review-run identity;
4. require temporal-record `canonicalBase`, `reviewedHead`, `evaluatedHead`, and `status` to equal the exact R20-bound values;
5. require R20 state `EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY`;
6. require the temporal record status to be `COMPLETED`;
7. require canonical UTC `startedAt` and `completedAt` values;
8. require `completedAt >= startedAt`;
9. require `startedAt >` the exact P7-R19 `verification.completed` event `emittedAt` already transitively revalidated by R20;
10. content-address the exact R20 evidence identity plus the exact sibling temporal-evidence identity and the bounded temporal ordering facts;
11. expose no provider/model output, context text, raw repository content, findings, credentials, network result, filesystem write, or privileged execution authority.

Proposed bounded state:

```text
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY
```

This state means only that one exact R20-bound zero-finding completed review record has a separately validated, content-addressed host-clock execution window whose canonical start timestamp is strictly later than the exact canonical R19 verification-completion event timestamp, and whose completion timestamp does not precede its start timestamp.

It does not establish external clock authenticity, provider authenticity, provider provenance, reviewer independence, context completeness, or completeness of the review itself.

## Required temporal-evidence record semantics

The sibling temporal record may expose only bounded deterministic fields needed for the temporal binding, including:

```text
version
temporalEvidenceIdentity
reviewRunIdentity
canonicalBase
reviewedHead
evaluatedHead
status
startedAt
completedAt
```

The normalized identity must include every semantic field above except its own identity field. The record and validator must be closed against unknown fields and safe against hostile mutable/object inputs.

## Required P7 output semantics

The P7 source/schema may expose only deterministic bounded identities and status facts needed to prove the binding, including as applicable:

```text
version
evidenceIdentity
state
sourceExactTargetHeadReviewRunEvidenceIdentity
sourceVerificationEngineCompletionEventEvidenceIdentity
repositoryIdentity
canonicalBase
targetHead
reviewRunIdentity
reviewStatus
reviewedHead
evaluatedHead
verificationCompletedEventEmittedAt
reviewStartedAt
reviewCompletedAt
temporalEvidenceIdentity
```

The output must be closed against unknown fields, bounded, deterministic for identical validated inputs, and schema-parity tested.

## Mandatory adversarial tests

At minimum the exact future test path must prove:

```text
PASS_EXACT_R20_BOUND_REVIEW_WITH_STRICTLY_LATER_START
REJECT_REVIEW_START_EQUAL_TO_VERIFICATION_COMPLETION
REJECT_REVIEW_START_BEFORE_VERIFICATION_COMPLETION
REJECT_COMPLETION_BEFORE_START
REJECT_NONCANONICAL_STARTED_AT
REJECT_NONCANONICAL_COMPLETED_AT
REJECT_REVIEW_RUN_IDENTITY_MISMATCH
REJECT_CANONICAL_BASE_MISMATCH
REJECT_REVIEWED_HEAD_MISMATCH
REJECT_EVALUATED_HEAD_MISMATCH
REJECT_NON_COMPLETED_STATUS
REJECT_TEMPORAL_EVIDENCE_IDENTITY_TAMPERING
REJECT_R20_PREDECESSOR_IDENTITY_TAMPERING
REJECT_R19_TRANSITIVE_LINEAGE_MUTATION
REJECT_UNKNOWN_FIELDS
REJECT_PROXY_INPUTS
REJECT_ACCESSOR_FIELDS
REJECT_SYMBOL_FIELDS
REJECT_ALIASES_OR_CYCLES
REJECT_OUTPUT_IDENTITY_TAMPERING
REJECT_SCHEMA_ADDITIONAL_PROPERTIES
REJECT_FORBIDDEN_IMPORT_OR_SIDE_EFFECT_SURFACE
```

Tests must also prove that wrapping an execution does not mutate the returned `ReviewRunRecord`, does not change existing KRI-R3 validation semantics, and does not add provider/model output, context text, repository content, secrets, network response, filesystem mutation, or external-tool result to the evidence record.

Qualification tests may use deterministic in-memory/fake reviewer providers already permitted by the test boundary. This authorization grants no live provider/model/network invocation.

## Mandatory non-equivalences

```text
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != EXTERNAL_CLOCK_AUTHENTICITY_PROOF
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != REVIEWER_OR_PROVIDER_AUTHENTICITY_PROOF
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != PROVIDER_INVOCATION_PROVENANCE_PROOF
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != REVIEW_CONTEXT_COMPLETENESS_PROOF
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != INDEPENDENT_REVIEW_COMPLETENESS_PROOF
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != FULL_VERIFICATION_ENGINE_HISTORICAL_EXECUTION_PROOF
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != K2_INVOCATION_OR_APPROVAL
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != K5_RECONCILIATION_PROOF
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != DONE_GATE_PROOF
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != VERIFIED
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != FIXED
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != REVERIFIED
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != AUTOFIX
TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY != PATCH_RETRY_AUTHORITY
P7_R21_CLOSED != SUCCESSOR_IMPLEMENTATION_AUTHORITY
P7_R21_CLOSED != P7_OVERALL_CLOSED
P7_R21_CLOSED != P8_P9_AUTHORITY
P7_R21_CLOSED != RELEASE_AUTHORITY
P7_R21_CLOSED != PROJECT_COMPLETION
```

## Preserved authority boundaries

```text
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_DONE_GATE_AUTHORITY = UNCHANGED
PROOFGRAPH = NOT_AUTHORIZED
AUTOMATIC_FRESHNESS_DEPENDENCY_INVALIDATION = NOT_AUTHORIZED
PATCH_APPLICATION = NOT_AUTHORIZED
PATCH_RETRY = NOT_AUTHORIZED
AUTOFIX_REMEDIATION_EXECUTION = NOT_AUTHORIZED
FILESYSTEM_GIT_WRITE = NOT_AUTHORIZED
REPOSITORY_WRITE_AUTHORITY = NONE_OUTSIDE_THIS_DOCUMENTATION_CANDIDATE_AND_LATER_EXACT_ALLOWLIST
K2_INVOCATION = NOT_AUTHORIZED
K2_APPROVAL_CREATION = NOT_AUTHORIZED
K2_AUTHORITY_EXPANSION = NONE
VERIFICATION_ENGINE_INVOCATION = NOT_AUTHORIZED
VERIFICATION_EXECUTION = NOT_AUTHORIZED
LIVE_REVIEWER_PROVIDER_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED
PROVIDER_ADAPTER_ADDITION = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
DEPENDENCY_INSTALLATION_OR_MANIFEST_CHANGE = NOT_AUTHORIZED
WORKFLOW_CHANGE = NOT_AUTHORIZED
CLI_API_PACKAGE_ROOT_PRODUCT_INTEGRATION = NOT_AUTHORIZED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

All still-effective predecessor P7 non-grants remain in force. Omission from this bounded record is not authorization, proof, waiver, supersession, or narrowing.

## Canonical pinned inputs at candidate creation

```text
P7_R20_SOURCE_BLOB = 49b9c2cc6842bf1048b316ceb7532732695e9892
P7_R19_SOURCE_BLOB = 9a92a9d2a06b8ec1bcb864b9ab09e0c0042931ba
KRI_EXECUTOR_BLOB = f7e969672182e3ee3209f9677522e6ffc3caa210
KRI_PROVIDER_CONTRACTS_BLOB = 97e95f3cd19aebf63c86dba254bc8e55f919c031
```

Any drift in those required predecessor/runtime semantics invalidates implementation qualification until reanalysis.

## Authorization qualification gate

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY 1
EXACT_PATH = docs/planning/KODAC_P7_R21_TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BINDING_AUTHORIZATION_2026-09-07.md
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_DOCS_ONLY_NON_APPLICABILITY
INTERNAL_SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
REQUIRED_EXTERNAL_SEMANTIC_REVIEW_COUNT = 0
RULESET_20707483 = ACTIVE / SATISFIED / NO_BYPASS
WAIVER = NO
```

Any head/base/blob/path/ruleset movement invalidates prior qualification. Merge must use normal merge-commit semantics and the exact final qualified `expected_head_sha`.

## Mandatory authorization post-merge proof

Implementation authority becomes active only after proof verifies:

```text
PR_CLOSED_MERGED
MERGE_COMMIT
ORDERED_PARENTS
MERGE_TREE
QUALIFIED_HEAD_TREE_EQUALITY
AUTHORIZATION_BLOB_EQUALITY
MERGE_SIGNATURE_VALID
POST_MERGE_REQUIRED_CHECKS_OR_TRUTHFUL_CANONICAL_NON_APPLICABILITY
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
WAIVER = NO
```

Only that proof may activate the exact four-path implementation allowlist. The implementation candidate must independently qualify on one unchanged exact head, merge guarded, and receive complete mandatory post-merge proof before any current-view reconciliation or successor analysis may follow.