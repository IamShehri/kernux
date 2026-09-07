# Kodac P7-R22 — Exact-Target-Head Complete Review-Context Evidence-Binding Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY_UNTIL_MERGED_AND_POST_PROVEN**  
Date: 2026-09-07  
Decision owner: Kodac founder  
Waiver: **NO**

## Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 5727703544d8a54fb813d843f8ea0605ffbdea6a
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = 0b951fe1814de32f6d2b900b7e6326c2994738cf
P7_R21_RECONCILIATION = CLOSED_CANONICAL / PR #443 / proof 5575155555
POST_R21_SUCCESSOR_ANALYSIS = PR #443 / comment 5575190043 / ANALYSIS_ONLY
P7_R21_STATE = TEMPORAL_POST_VERIFICATION_EXACT_HEAD_REVIEW_EVIDENCE_BOUND_ONLY
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This record authorizes no implementation until this exact documentation-only candidate independently qualifies, merges through normal guarded merge-commit semantics, and receives complete mandatory post-merge proof.

The descriptive label `P7-R22` is not authority by numbering.

## Exact future implementation allowlist

If and only if this authorization becomes `CLOSED_CANONICAL`, one bounded implementation candidate may add exactly:

```text
packages/kodac-runtime/src/remediation/p7-exact-target-head-complete-review-context-evidence-binding.ts
schema/p7-exact-target-head-complete-review-context-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r22-exact-target-head-complete-review-context-evidence-binding.test.ts
```

No fourth path is authorized.

In particular, no edit to K3-R5 context contracts/build semantics, KRI executor/provider contracts, R20/R21 source files, package-root exports, workflows, dependencies, lockfiles, current views, rulesets, or historical authorization/evidence records is authorized.

## Bounded implementation objective

The future candidate may add one pure evidence-binding contract that:

1. canonically revalidates the exact P7-R21 source/build-input pair;
2. canonically revalidates the exact nested P7-R20 source/build-input pair carried by the R21 build input;
3. accepts exactly one K3-R5 `ContextEngineInput` as the proposed source of the review context;
4. rejects Proxy, accessor, symbol, alias, cycle, non-JSON, unbounded, or otherwise hostile source graphs before inherited builders observe them;
5. snapshots the validated source graph before any inherited reconstruction work;
6. deterministically rebuilds the `ContextBundle` using the existing canonical `buildContextBundle()` semantics without modifying those semantics;
7. requires the rebuilt `bundleIdentity` to equal the exact P7-R20 `reviewContextBundleIdentity` bound into the review-run evidence;
8. requires the rebuilt `taskId` to equal the exact P7-R20 `reviewTaskId`;
9. requires the exact K3-R5 input snapshot `gitHead` to equal the exact P7-R21 target head;
10. requires rebuilt `freshness == "current"`;
11. requires rebuilt `completeness.state == "complete"`;
12. requires rebuilt `completeness.reasons == []`;
13. requires rebuilt `completeness.omittedAtLeast == 0`;
14. content-addresses the exact R21 evidence identity, exact R20 review-context identity, exact K3-R5 request/repository/snapshot/content identities, exact target head, complete/no-omission facts, bounded budget facts, selected item identities and a digest of provenance references;
15. exposes no raw context text, repository file content, provider/model output, findings, credentials, secrets, network results, filesystem writes, or execution authority.

Proposed bounded state:

```text
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY
```

This state means only that the exact context-bundle identity already bound into the R20/R21 review lineage can be deterministically reproduced from one canonically validated K3-R5 source input whose repository snapshot is at the exact target head and whose resulting context bundle is current and complete with no recorded omissions.

## Required output semantics

The future source/schema may expose only bounded deterministic facts needed for the binding, including as applicable:

```text
version
evidenceIdentity
state
sourceTemporalPostVerificationReviewEvidenceIdentity
sourceExactTargetHeadReviewRunEvidenceIdentity
p7RepositoryIdentity
canonicalBase
targetHead
reviewRunIdentity
reviewTaskId
reviewContextBundleIdentity
contextRepositoryIdentity
contextSnapshotIdentity
contextContentIdentity
contextRequestIdentity
contextSelectionStrategy
contextSnapshotGitHead
contextFreshness
contextCompletenessState
contextCompletenessReasons
contextOmittedAtLeast
contextBudgetMaxItems
contextBudgetMaxUtf8Bytes
contextBudgetUsedItems
contextBudgetUsedUtf8Bytes
contextItemCount
contextItemIdentities
contextProvenanceIdentity
```

The output must be closed against unknown fields, deterministic for identical validated inputs, deeply immutable, and schema-parity tested. Item identities must be canonical lowercase SHA-256 values in the deterministic K3-R5 selection order. `contextProvenanceIdentity` must content-address the exact canonical ordered provenance-reference set without exposing those raw references in the P7 evidence output.

## Mandatory adversarial tests

At minimum the exact future test path must prove:

```text
PASS_EXACT_R21_BOUND_CANONICAL_COMPLETE_CONTEXT
PASS_DETERMINISTIC_IDENTICAL_INPUT_IDENTITY
REJECT_CONTEXT_BUNDLE_IDENTITY_MISMATCH
REJECT_REVIEW_TASK_ID_MISMATCH
REJECT_CONTEXT_SNAPSHOT_HEAD_MISMATCH
REJECT_TRUNCATED_ITEM_BUDGET_CONTEXT
REJECT_TRUNCATED_BYTE_BUDGET_CONTEXT
REJECT_SOURCE_INPUT_LIMIT_CONTEXT
REJECT_UNSUPPORTED_EVIDENCE_CONTEXT
REJECT_NONZERO_OMITTED_CONTEXT
REJECT_NONEMPTY_COMPLETENESS_REASONS_FOR_COMPLETE_CONTEXT
REJECT_R21_PREDECESSOR_IDENTITY_TAMPERING
REJECT_R20_TRANSITIVE_LINEAGE_TAMPERING
REJECT_CONTEXT_SOURCE_IDENTITY_TAMPERING
REJECT_CONTEXT_REQUEST_IDENTITY_TAMPERING
REJECT_CONTEXT_SELECTED_ITEM_IDENTITY_TAMPERING
REJECT_UNKNOWN_FIELDS
REJECT_PROXY_INPUTS
REJECT_ACCESSOR_FIELDS_WITHOUT_INVOCATION
REJECT_SYMBOL_FIELDS
REJECT_ALIASES_OR_CYCLES
REJECT_OUTPUT_IDENTITY_TAMPERING
REJECT_SCHEMA_ADDITIONAL_PROPERTIES
REJECT_FORBIDDEN_IMPORT_OR_SIDE_EFFECT_SURFACE
```

Tests must also prove that the future P7 output contains no raw context item `text`, repository file content, raw provider response, credentials, secrets, network result, filesystem mutation, external-tool result, or hidden execution authority.

The tests may construct deterministic K3-R2/K3-R4/K3-R5 fixture inputs entirely in memory and may use temporary files only where already-required inherited P7 predecessor validation needs its canonical receipt-ledger file-read fixture. They must not perform live provider/model/network invocation.

## Why this is not full review completeness

The durable review plan explicitly requires future review-completeness evidence to account for more than context-bundle completeness, including changed/reviewed/unreviewed path coverage, skill/risk coverage and provider termination reason.

Therefore:

```text
ZERO_FINDINGS != COMPLETE_REVIEW
COMPLETE_CONTEXT_BUNDLE != COMPLETE_REVIEW
```

This R22 candidate deliberately closes only the independently provable K3-R5-derived context-completeness gap.

## Mandatory non-equivalences

```text
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != CHANGED_REVIEWED_UNREVIEWED_PATH_COVERAGE_PROOF
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != SKILL_COVERAGE_PROOF
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != RISK_COVERAGE_PROOF
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != PROVIDER_TERMINATION_REASON_PROOF
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != PROVIDER_INVOCATION_PROVENANCE_PROOF
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != REVIEWER_OR_PROVIDER_AUTHENTICITY_PROOF
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != EXTERNAL_CLOCK_AUTHENTICITY_PROOF
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != K5_RECONCILIATION_PROOF
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != DONE_GATE_PROOF
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != VERIFIED
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != FIXED
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != REVERIFIED
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != AUTOFIX
EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BOUND_ONLY != PATCH_RETRY_AUTHORITY
P7_R22_CLOSED != SUCCESSOR_IMPLEMENTATION_AUTHORITY
P7_R22_CLOSED != P7_OVERALL_CLOSED
P7_R22_CLOSED != P8_P9_AUTHORITY
P7_R22_CLOSED != RELEASE_AUTHORITY
P7_R22_CLOSED != PROJECT_COMPLETION
```

## Preserved authority boundaries

```text
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_DONE_GATE_AUTHORITY = UNCHANGED
PROOFGRAPH = NOT_AUTHORIZED
AUTOMATIC_FRESHNESS_DEPENDENCY_INVALIDATION = NOT_AUTHORIZED
POST_R22_SUCCESSOR_IMPLEMENTATION = NOT_AUTHORIZED_BY_NUMBERING
PATCH_APPLICATION = NOT_AUTHORIZED
PATCH_RETRY = NOT_AUTHORIZED
AUTOFIX_REMEDIATION_EXECUTION = NOT_AUTHORIZED
FILESYSTEM_GIT_WRITE = NOT_AUTHORIZED
REPOSITORY_WRITE_AUTHORITY = NONE_OUTSIDE_THIS_DOCUMENTATION_CANDIDATE_AND_LATER_EXACT_THREE_PATH_ALLOWLIST
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
P7_TO_K5_RECONCILIATION = NOT_AUTHORIZED
DONE_GATE_INVOCATION_OR_MUTATION = NOT_AUTHORIZED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

All still-effective predecessor P7 non-grants remain in force. Omission from this bounded record is not authorization, proof, waiver, supersession, or narrowing.

## Canonical pinned inputs at candidate creation

```text
K3_R5_CONTEXT_CONTRACTS_BLOB = 2864086e0e861cdeb80211816110a3e801d33fc3
K3_R5_CONTEXT_ENGINE_BLOB = 13f16c99f76c133793e5bbc50474197ee1d6e045
KRI_PROVIDER_CONTRACTS_BLOB = 97e95f3cd19aebf63c86dba254bc8e55f919c031
KRI_EXECUTOR_BLOB = f7e969672182e3ee3209f9677522e6ffc3caa210
P7_R20_SOURCE_BLOB = 49b9c2cc6842bf1048b316ceb7532732695e9892
P7_R21_SOURCE_BLOB = f3d45269c8bfe3130de42139dee8cef572be6a69
K3_R5_AUTHORIZATION_BLOB = 46eb7c11b0a87f9c5526e4896b508f70574f7682
```

Any drift in these required source/runtime semantics invalidates implementation qualification until fresh analysis.

## Authorization qualification gate

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY 1
EXACT_PATH = docs/planning/KODAC_P7_R22_EXACT_TARGET_HEAD_COMPLETE_REVIEW_CONTEXT_EVIDENCE_BINDING_AUTHORIZATION_2026-09-07.md
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

Only that proof may activate the exact three-path implementation allowlist. The implementation candidate must independently qualify on one unchanged exact head, merge guarded, and receive complete mandatory post-merge proof before any current-view reconciliation or successor analysis may follow.