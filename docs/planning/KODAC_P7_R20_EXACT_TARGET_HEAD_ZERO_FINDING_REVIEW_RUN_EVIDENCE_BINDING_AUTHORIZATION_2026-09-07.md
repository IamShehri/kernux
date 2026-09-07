# Kodac P7-R20 — Exact-Target-Head Zero-Finding Review-Run Evidence-Binding Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY_UNTIL_MERGED_AND_POST_PROVEN**  
Date: 2026-09-07  
Decision owner: Kodac founder  
Waiver: **NO**

## Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = ed24cb855e0f62b1df7a2d3e6855a81a1372d7c4
P7_R19_RECONCILIATION = CLOSED_CANONICAL / PR #433 / proof 5573360503
POST_R19_SUCCESSOR_ANALYSIS = PR #433 / comment 5573414634 / ANALYSIS_ONLY
P7_R19_STATE = VERIFICATION_ENGINE_COMPLETION_EVENT_EVIDENCE_BOUND_ONLY
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This record authorizes no implementation until this exact documentation-only candidate independently qualifies, merges through normal guarded merge-commit semantics, and receives complete mandatory post-merge proof.

The descriptive label `P7-R20` is not authority by numbering.

## Exact future implementation allowlist

If and only if this authorization becomes `CLOSED_CANONICAL`, one bounded implementation candidate may modify exactly:

```text
packages/kodac-runtime/src/reviewer-intelligence/executor.ts
packages/kodac-runtime/src/remediation/p7-exact-target-head-review-run-evidence-binding.ts
schema/p7-exact-target-head-review-run-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r20-exact-target-head-review-run-evidence-binding.test.ts
```

No fifth path is authorized.

The only permitted change in `packages/kodac-runtime/src/reviewer-intelligence/executor.ts` is to expose the already-existing canonical `validateRun` semantics through a standalone exported `validateReviewRunRecord` function and have `ReviewerExecutionRuntime.validateReviewRunRecord` delegate to that same function. No KRI execution semantics, provider invocation semantics, stale-head detection, identity construction, package-root export, dependency, persistence, network, secret, side-effect, or policy behavior may change.

## Bounded implementation objective

The future candidate may add one pure bounded evidence contract that:

1. canonically revalidates the exact P7-R19 source/build-input pair;
2. canonically revalidates one KRI-R3 `ReviewRunRecord` through the exported existing KRI validator;
3. requires `reviewRun.status == "COMPLETED"`;
4. requires `reviewRun.failureCode == null`;
5. requires `reviewRun.canonicalBase == P7-R19.canonicalBase`;
6. requires `reviewRun.reviewedHead == P7-R19.targetHead`;
7. requires `reviewRun.evaluatedHead == P7-R19.targetHead`;
8. requires `reviewRun.acceptedClaimCount == 0`;
9. requires `reviewRun.findingIdentities == []`;
10. requires the P7-R19 `targetHead` used by this binding to be a lowercase 40-hex Git object because the canonical KRI-R3 contract is SHA-1-head-shaped;
11. content-addresses the exact normalized KRI review-run identity together with the exact P7-R19 evidence identity and bounded target/base identities;
12. exposes no provider/model output, context text, raw repository content, findings, credentials, network result, filesystem write, or execution authority.

Proposed bounded state:

```text
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY
```

## Required output semantics

The future schema/source may expose only deterministic bounded identities and status facts needed to prove the binding, including as applicable:

```text
version
evidenceIdentity
state
sourceVerificationEngineCompletionEventEvidenceIdentity
repositoryIdentity
canonicalBase
targetHead
verificationReportIdentity
verificationSessionId
reviewRunId
reviewRunIdentity
reviewProviderId
reviewProviderVersion
reviewPolicyIdentity
reviewContextBundleIdentity
reviewTaskId
reviewInstructionsIdentity
reviewStatus
reviewedHead
evaluatedHead
acceptedClaimCount
findingIdentities
```

The output must be closed against unknown fields, safe against Proxy/accessor/symbol/alias/cycle hostile inputs, bounded, deterministic, and schema-parity tested.

## Mandatory adversarial tests

At minimum the exact future test path must prove rejection of:

```text
NON_COMPLETED_REVIEW_RUN
STALE_REVIEW_RUN
FAILED_OR_TIMED_OUT_OR_INVALID_PROVIDER_REVIEW_RUN
CANONICAL_BASE_MISMATCH
REVIEWED_HEAD_MISMATCH
EVALUATED_HEAD_MISMATCH
NON_40_HEX_TARGET_HEAD_FOR_KRI_BINDING
NONZERO_ACCEPTED_CLAIM_COUNT
NONEMPTY_FINDING_IDENTITIES
REVIEW_RUN_IDENTITY_TAMPERING
R19_PREDECESSOR_IDENTITY_TAMPERING
R19_LINEAGE_MUTATION
UNKNOWN_FIELDS
PROXY_INPUTS
ACCESSOR_FIELDS
SYMBOL_FIELDS
ALIASES_OR_CYCLES
OUTPUT_IDENTITY_TAMPERING
SCHEMA_ADDITIONAL_PROPERTIES
FORBIDDEN_IMPORT_OR_SIDE_EFFECT_SURFACE
```

The tests must also prove deterministic identical-input output and that no raw provider response, context text, repository content, raw path, secrets, network response, filesystem mutation, or external tool invocation is included.

## Mandatory non-equivalences

```text
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != TEMPORAL_POST_VERIFICATION_REVIEW_PROOF
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != REVIEWER_OR_PROVIDER_AUTHENTICITY_PROOF
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != REVIEW_CONTEXT_COMPLETENESS_PROOF
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != PROVIDER_MODEL_INVOCATION_PROOF
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != FULL_VERIFICATION_ENGINE_HISTORICAL_EXECUTION_PROOF
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != K2_INVOCATION_OR_APPROVAL
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != K5_RECONCILIATION_PROOF
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != DONE_GATE_PROOF
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != VERIFIED
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != FIXED
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != REVERIFIED
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != AUTOFIX
EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BOUND_ONLY != PATCH_RETRY_AUTHORITY
P7_R20_CLOSED != SUCCESSOR_IMPLEMENTATION_AUTHORITY
P7_R20_CLOSED != P7_OVERALL_CLOSED
P7_R20_CLOSED != P8_P9_AUTHORITY
P7_R20_CLOSED != RELEASE_AUTHORITY
P7_R20_CLOSED != PROJECT_COMPLETION
```

`ReviewRunRecord` has no start/completion timestamp. Therefore this slice MUST NOT claim that the review happened after verification. A later temporal re-review proof requires separate evidence/authority.

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
REPOSITORY_WRITE_AUTHORITY = NONE
K2_INVOCATION = NOT_AUTHORIZED
K2_APPROVAL_CREATION = NOT_AUTHORIZED
K2_AUTHORITY_EXPANSION = NONE
VERIFICATION_ENGINE_INVOCATION = NOT_AUTHORIZED
VERIFICATION_EXECUTION = NOT_AUTHORIZED
REVIEWER_PROVIDER_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
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
P7_R19_SOURCE_BLOB = 9a92a9d2a06b8ec1bcb864b9ab09e0c0042931ba
KRI_EXECUTOR_BLOB = 1ff5d7273512af2f6ccb5c1d70ccb54369bac5e4
KRI_PROVIDER_CONTRACTS_BLOB = 97e95f3cd19aebf63c86dba254bc8e55f919c031
```

Any drift in the required predecessor/runtime semantics must be reanalyzed before implementation qualification.

## Authorization qualification gate

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY 1
EXACT_PATH = docs/planning/KODAC_P7_R20_EXACT_TARGET_HEAD_ZERO_FINDING_REVIEW_RUN_EVIDENCE_BINDING_AUTHORIZATION_2026-09-07.md
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

Only that proof may activate the exact four-path implementation allowlist. The implementation candidate must independently qualify on one unchanged exact head, merge guarded, and receive complete mandatory post-merge proof before any reconciliation or successor analysis may follow.