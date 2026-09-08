# Kodac P8-R3 — Bounded Message Compatibility Authorization Amendment Candidate

Status: **AUTHORIZATION_AMENDMENT_CANDIDATE / NOT_CANONICAL / IMPLEMENTATION REMAINS BLOCKED UNTIL MERGED_AND_POST_PROVEN**  
Date: 2026-09-09  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Canonical basis and purpose

```text
CANONICAL_MAIN_AT_CANDIDATE_START = c78e121de1c9053771f9a7976256fc61b32b08c4
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = edfc923f44607883d3db6712ff0fbeaa08f0302f
P8_R3_AUTHORIZATION = CLOSED_CANONICAL / PR #494 / proof 5592724962
P8_R3_IMPLEMENTATION_COMPATIBILITY_ANALYSIS = PR #494 / comment 5592826024 / ANALYSIS_ONLY
P8_R3_IMPLEMENTATION = BLOCKED_PENDING_CANONICAL_COMPATIBILITY_AMENDMENT
WAIVER = NO
```

This is a forward-only documentation amendment candidate for the canonical P8-R3 authorization in:

```text
docs/planning/KODAC_P8_R3_SOLVE_CLI_RESULT_ENVELOPE_WIRING_AUTHORIZATION_2026-09-09.md
```

It exists only to resolve one proven producer/contract compatibility mismatch discovered while implementing the already-authorized P8-R3 unit. It grants no runtime authority while unmerged or post-merge-unproven and changes no source, schema, test, workflow, dependency, provider/model, side-effect, persistence, release, ruleset, or project-completion truth by itself.

---

## 2. Proven compatibility mismatch

The canonical P8-R1 result-envelope contract is intentionally bounded and fail-closed. Its current contract includes:

```text
P8_CLI_RESULT_LIMITS.maxMessageCodePoints = 4096
solve.payload.warnings[*] <= 4096 Unicode code points
solve.payload.reasons[*] <= 4096 Unicode code points
oversized entries = REJECT
P8_R1_CONTRACT_SCHEMA = UNCHANGED
```

The canonical P8-R3 authorization requires completed solve envelopes to carry the existing verification-plan warnings and existing Done Gate reasons while leaving the P8-R1 contract/schema and Done Gate unchanged.

Fresh implementation-feasibility testing against exact canonical main proved a currently valid legacy solve outcome that cannot be represented byte-for-byte under both requirements:

```text
SCENARIO = solve in a non-git temporary workspace
LEGACY_HUMAN_SOLVE_RESULT = NOT_READY
LEGACY_HUMAN_SOLVE_EXIT = 3
DONE_GATE_REASON_COUNT = 4
DONE_GATE_REASON_CODEPOINT_LENGTHS = 167, 7545, 135, 160
OVERSIZED_SOURCE = git.diff diagnostic/usage detail
P8_R1_MESSAGE_LIMIT = 4096
NAIVE_RAW_REASON_ENVELOPE_BUILD = REJECTED
NAIVE_JSON_EXIT = 1
REQUIRED_EXISTING_JSON_EXIT = 3
```

The full Done Gate result remains durably recorded in the existing proof artifact before CLI result serialization. The full verification-plan warnings remain durably recorded in the existing verification-plan artifact before CLI result serialization.

This is an authorization-compatibility defect, not a reason to weaken P8-R1, alter Done Gate, suppress a failure, skip a test, or accept exit-code drift.

---

## 3. Amendment decision

Only after this amendment independently becomes `CLOSED_CANONICAL`, the P8-R3 implementation is additionally authorized to apply one deterministic **bounded evidence-preserving projection** to completed-solve `payload.warnings` and `payload.reasons` before calling the unchanged P8-R1 builder.

The projection is transport-only. It does not rewrite the authoritative plan/proof artifacts and does not change verification or Done Gate truth.

For each source message independently:

```text
IF source Unicode code-point length <= P8_CLI_RESULT_LIMITS.maxMessageCodePoints:
    projected = source byte-for-byte unchanged
ELSE:
    digest = lowercase hex SHA-256 of the complete original UTF-8 source message
    originalCodePoints = Unicode code-point length of the complete original source message
    suffix = "\n[P8_BOUNDED_PROJECTION originalCodePoints=<originalCodePoints> sha256=<digest>]"
    prefixBudget = P8_CLI_RESULT_LIMITS.maxMessageCodePoints - Unicode code-point length(suffix)
    projected = first prefixBudget Unicode code points of source + suffix
```

Required invariants:

```text
PROJECTED_MESSAGE_CODEPOINTS <= P8_CLI_RESULT_LIMITS.maxMessageCodePoints
IN_BOUND_SOURCE = BYTE_FOR_BYTE_UNCHANGED
OVERSIZED_SOURCE_PREFIX = MAXIMAL_UNDER_EXACT_SUFFIX_BUDGET
OVERSIZED_SOURCE_SUFFIX = EXPLICIT_LENGTH_AND_SHA256_BINDING
DIGEST_INPUT = COMPLETE_ORIGINAL_UTF8_MESSAGE
ORIGINAL_PLAN_WARNINGS = UNCHANGED_IN_VERIFICATION_PLAN_ARTIFACT
ORIGINAL_DONE_GATE_REASONS = UNCHANGED_IN_PROOF_ARTIFACT
P8_R1_BUILDER = UNCHANGED
P8_R1_SCHEMA = UNCHANGED
DONE_GATE = UNCHANGED
VERIFICATION_ENGINE = UNCHANGED
```

The implementation must use the existing `P8_CLI_RESULT_LIMITS.maxMessageCodePoints` value rather than duplicating a numeric limit. The existing `node:crypto` `createHash` import already present in `cli.ts` may be reused; no dependency is authorized.

If the suffix itself cannot fit the canonical P8-R1 message bound, implementation must fail closed rather than silently weaken the binding. Under the current fixed suffix grammar and SHA-256 digest size this condition is not expected, but it must not be handled by reducing the digest or dropping metadata.

This amendment does not authorize normalization or repair of invalid Unicode, prohibited control characters, malformed identities, unknown fields, oversized collections, or any other P8-R1 validation failure. Those continue to fail closed under the unchanged P8-R1 contract.

---

## 4. Exact implementation allowlist remains unchanged

The canonical P8-R3 five-path implementation allowlist remains exactly:

```text
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/src/live-solve.ts
packages/kodac-runtime/test/p8-r2-non-agent-loop-cli-envelope-wiring.test.ts
packages/kodac-runtime/test/live-solve-qualification.test.ts
packages/kodac-runtime/test/p8-r3-solve-cli-envelope-wiring.test.ts
```

No sixth implementation path is authorized.

The implementation must not modify:

```text
packages/kodac-runtime/src/product/p8-cli-result-envelope.ts
schema/p8-cli-result-envelope.schema.json
packages/kodac-runtime/test/p8-r1-cli-result-envelope.test.ts
packages/kodac-runtime/package.json
packages/kodac-runtime/bin/kodac.mjs
README.md
.github/**
package-lock.json
pnpm-lock.yaml
uv.lock
```

or any K2/K3/KRI/K5/K6/P2-P7 source, schema, workflow, authorization/evidence record, provider/model configuration, evidence store, persistence/telemetry/learning surface, release configuration, ruleset, or repository-protection path.

---

## 5. Corrected completed-solve transport semantics

The original P8-R3 completed-solve requirements remain controlling except for the exact bounded projection defined above.

For `NOT_READY`:

```text
status = NOT_READY
proven = false
payload.provider = existing provider
payload.model = existing model
payload.assistant = existing assistant
payload.budget = existing loop budget
payload.verificationRisk = existing plan risk
payload.verificationCommands = existing command ids
payload.warnings = bounded projection of existing plan warnings
payload.reasons = bounded projection of existing Done Gate reasons
evidence = existing events/receipts/plan/proof paths
exit code = 3
```

For `PROVEN_READY`:

```text
status = PROVEN_READY
proven = true
payload.warnings = bounded projection of existing plan warnings
payload.reasons = []
exit code = 0
```

The complete original warnings/reasons remain authoritative in their existing evidence artifacts. The machine-readable CLI envelope is a bounded transport projection and must never be relabeled as a complete replacement for those artifacts.

The STOPPED solve envelope is unaffected by this amendment.

---

## 6. Required focused proof added by this amendment

The P8-R3 implementation tests must additionally prove at least:

```text
in-bound warning remains byte-for-byte unchanged
in-bound reason remains byte-for-byte unchanged
oversized reason is projected deterministically to <= 4096 code points
projected oversized reason suffix carries exact original code-point length
projected oversized reason suffix carries SHA-256 of complete original UTF-8 message
same oversized source produces byte-identical projection on repeated calls
source prefix is preserved up to the exact suffix budget
full oversized Done Gate reason remains unchanged in proof.json
oversized Done Gate reason does not turn NOT_READY exit 3 into error exit 1
if an oversized plan warning is exercised, its full original remains unchanged in verification-plan.json
P8-R1 builder/schema tests remain unchanged and pass
no contract/schema/Done Gate/verification-engine mutation occurs
```

The existing P8-R3 tests must also prove the **exact canonical key set** without imposing a universal JavaScript insertion order that the unchanged P8-R1 builder does not define across all solve variants. Validation through `validateP8CliResultEnvelope()` plus absence of extra/legacy aliases is sufficient for key-set semantics; this amendment does not authorize changing the builder merely to harmonize property insertion order.

---

## 7. Preserved non-grants

```text
P8_R3_SCOPE = SOLVE_JSON_ENVELOPE_WIRING_AND_CONTROLLED_LIVE_SOLVE_CONSUMER_ADAPTATION_ONLY
P8_R3_FIVE_PATH_ALLOWLIST = UNCHANGED
APPLY_PATCH_JSON = UNCHANGED
ASK_JSON = UNCHANGED
SOLVE_HUMAN_OUTPUT = UNCHANGED
CLI_ARGUMENTS = UNCHANGED
CLI_EXIT_CODES = UNCHANGED
P8_R1_CONTRACT_SCHEMA = UNCHANGED
DONE_GATE_ALGORITHM = UNCHANGED
VERIFICATION_ENGINE = UNCHANGED
SESSION_EVIDENCE_LIFECYCLE = UNCHANGED
PROVIDER_MODEL_SELECTION_INVOCATION = UNCHANGED
CONTROLLED_LIVE_SOLVE_PROVIDER_QUALIFICATION = UNCHANGED
CONTROLLED_LIVE_SOLVE_WRITE_SCOPE = UNCHANGED
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_AUTHORITY = UNCHANGED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_RENAME_VERSION_PUBLICATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
P8_R4_PLUS = NOT_AUTHORIZED_BY_NUMBERING
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

A digest-bearing bounded projection is not proof of the omitted suffix content by itself. The existing referenced plan/proof artifact remains the authoritative complete source. This amendment creates no new evidence-validation, retrieval, trust, or Done Gate authority.

---

## 8. Qualification gate for this amendment candidate

This amendment candidate may change exactly one path and no second path:

```text
docs/planning/KODAC_P8_R3_BOUNDED_MESSAGE_COMPATIBILITY_AUTHORIZATION_AMENDMENT_2026-09-09.md
```

Before guarded merge, one unchanged exact head/current metadata must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1
AMENDMENT_BLOB = FROZEN
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NON_APPLICABLE
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
REQUIRED_EXTERNAL_SEMANTIC_REVIEW_COUNT = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
MERGE = GUARDED_NORMAL_MERGE_USING_EXACT_EXPECTED_HEAD_SHA
POST_MERGE_PROOF = MAIN + ORDERED_PARENTS + TREE + AMENDMENT_BLOB + VERIFIED_VALID_SIGNATURE + APPLICABLE_PUSH_CHECKS + MERGED_PR_STATE + RULESET + REVIEW_THREADS
WAIVER = NO
```

Any byte/head/base/blob/path/ruleset/material-evidence movement invalidates exact-head qualification evidence.

---

## 9. Candidate boundary

Until this exact amendment qualifies, merges normally, and passes mandatory external post-merge proof:

```text
P8_R3_BOUNDED_MESSAGE_COMPATIBILITY_AMENDMENT = NOT_CANONICAL
P8_R3_IMPLEMENTATION = BLOCKED
BOUNDED_WARNING_REASON_PROJECTION = NOT_AUTHORIZED
DIRECT_RUNTIME_WORKAROUND = NOT_AUTHORIZED
P8_R4_PLUS = NOT_AUTHORIZED_BY_NUMBERING
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

After this amendment becomes canonical, implementation authority resumes only for the original exact five-path P8-R3 unit as corrected by this record. No successor authority is created.