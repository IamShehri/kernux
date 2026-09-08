# Kodac P8-R2 — Non-Agent-Loop CLI Result Envelope Wiring Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY UNTIL MERGED_AND_POST_PROVEN**  
Date: 2026-09-09  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Deny-by-default baseline

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 2d18b1d451009240d094a00f5e4d7f8d7498b9b3
CANONICAL_TREE_AT_CANDIDATE_START = f8ae5ecb9d8ad16578e2d650e42f83e1635c0402
P8_R1_AUTHORIZATION = CLOSED_CANONICAL / PR #486 / proof 5591337213
P8_R1_IMPLEMENTATION = CLOSED_CANONICAL / PR #487 / proof 5591781497
P8_R1_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #489 / proof 5592065871
POST_P8_R1_RECONCILIATION_SUCCESSOR_ANALYSIS = PR #489 / comment 5592108826 / ANALYSIS_ONLY
P8_R2_IMPLEMENTATION = NOT_AUTHORIZED_UNTIL_THIS_RECORD_QUALIFIES_MERGES_AND_POST_PROVES
P8_R3_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P8_PRODUCT_DISTRIBUTION_HARDENING = NOT_CLOSED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This record is a one-path documentation-only authorization candidate. While unmerged or unproven it creates no runtime, execution, provider/model, network, secret, filesystem, persistence, package, publication, GitHub integration, release, deployment, successor, or project-completion authority.

---

## 2. Evidence-driven purpose

The canonical P8-R1 contract established one pure versioned result-envelope family:

```text
PROTOCOL = kodac.cli-result
VERSION = 1
COMMANDS = apply-patch | ask | solve
```

Fresh live-code analysis after P8-R1 reconciliation closure established:

```text
EXISTING_CLI_JSON_MODE = YES
APPLY_PATCH_JSON = INLINE / UNVERSIONED / LEGACY_TOP_LEVEL_SHAPE
ASK_JSON = INLINE / UNVERSIONED / LEGACY_TOP_LEVEL_SHAPE / proven FIELD ABSENT
SOLVE_JSON = INLINE / UNVERSIONED / LEGACY_TOP_LEVEL_SHAPE
P8_R1_BUILDER = IMPLEMENTED / PURE / NOT_WIRED
SOLVE_JSON_RUNTIME_CONSUMER = packages/kodac-runtime/src/live-solve.ts
```

The solve JSON surface is not the minimum safe migration because controlled live solve captures it and reads legacy top-level fields such as `assistant` and `evidence`. Migrating solve therefore requires a separate compatibility-bounded unit.

The minimum independently useful unit is to wire only the non-agent-loop JSON paths whose semantics already map directly to P8-R1 and have no equivalent internal compatibility dependency:

```text
P8_R2_SCOPE = apply-patch --json + ask --json
SOLVE_JSON = UNCHANGED
LIVE_SOLVE = UNCHANGED
```

The label `P8-R2` is descriptive only. Authority comes only from this exact record after qualification, guarded merge, and mandatory external post-merge proof.

---

## 3. Exact future implementation allowlist

Only after this authorization becomes canonical and externally post-merge proven may one later implementation candidate modify exactly:

```text
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/test/ask-cli.test.ts
packages/kodac-runtime/test/p8-r2-non-agent-loop-cli-envelope-wiring.test.ts
```

No fourth path is authorized.

The later implementation must not modify:

```text
packages/kodac-runtime/src/product/p8-cli-result-envelope.ts
schema/p8-cli-result-envelope.schema.json
packages/kodac-runtime/test/p8-r1-cli-result-envelope.test.ts
packages/kodac-runtime/src/live-solve.ts
packages/kodac-runtime/test/live-solve-qualification.test.ts
packages/kodac-runtime/package.json
packages/kodac-runtime/bin/kodac.mjs
README.md
.github/**
package-lock.json
pnpm-lock.yaml
uv.lock
```

or any existing K2/K3/KRI/K5/K6/P2-P7 source, schema, workflow, authorization/evidence record, provider/model configuration, evidence store, persistence/telemetry/learning surface, release configuration, ruleset, or repository-protection path.

No dependency or lockfile mutation is authorized.

---

## 4. Required implementation semantics

The future implementation must use the existing unchanged `buildP8CliResultEnvelope()` contract from `packages/kodac-runtime/src/product/p8-cli-result-envelope.ts` as the only P8-R2 envelope construction authority.

### apply-patch

For `kodac apply-patch ... --json`, output must become exactly one serialized P8-R1 apply-patch envelope purpose-equivalent to:

```text
protocol = kodac.cli-result
version = 1
command = apply-patch
sessionId = existing runtime session id
status = PATCH_APPLIED
proven = false
evidence.events = existing event path
evidence.receipts = existing receipt path
payload.affected = existing affected-path result
payload.receiptId = existing receipt id
```

Required non-equivalences:

```text
PATCH_APPLIED != VERIFIED
PATCH_APPLIED != PROVEN_READY
PATCH_APPLIED != DONE
```

No apply-patch execution, policy, workspace, receipt, evidence, exit-code, or human-output behavior may change.

### ask

For `kodac ask ... --json`, output must become exactly one serialized P8-R1 ask envelope purpose-equivalent to:

```text
protocol = kodac.cli-result
version = 1
command = ask
sessionId = existing runtime session id
status = COMPLETE
proven = false
evidence.events = existing event path
payload.provider = existing provider identity
payload.model = existing model identity
payload.assistant = existing assistant result
```

Required non-equivalences:

```text
ASK_COMPLETE != VERIFICATION
ASK_COMPLETE != PROVEN_READY
ASSISTANT_RESPONSE != INDEPENDENT_PROOF
```

No provider/model selection, invocation, request snapshot, evidence, retention, exit-code, failure, or human-output behavior may change.

---

## 5. Explicitly frozen behavior

P8-R2 must preserve all of the following byte/semantic boundaries outside the two JSON result shapes:

```text
solve --json = UNCHANGED
solve human output = UNCHANGED
controlled live-solve = UNCHANGED
apply-patch human output = UNCHANGED
ask human output = UNCHANGED
CLI argument parsing = UNCHANGED / NO NEW OPTIONS
CLI exit codes = UNCHANGED
session/evidence lifecycle = UNCHANGED
retention semantics = UNCHANGED
K2 execution semantics = UNCHANGED
K5/Done Gate semantics = UNCHANGED
```

The implementation may import the existing P8-R1 builder into `cli.ts`; the P8-R1 source must remain pure and must not import CLI/runtime/product-wiring code.

No legacy compatibility aliases may be added to the serialized envelope. Unknown extra fields would violate the P8-R1 fail-closed contract.

---

## 6. Required focused proof

The future focused tests must prove at least:

```text
apply-patch --json emits exactly protocol/version/command/sessionId/status/proven/evidence/payload
apply-patch output validates with existing validateP8CliResultEnvelope()
apply-patch payload carries existing affected paths and receipt id without semantic drift
apply-patch proven is exactly false
ask --json emits exactly protocol/version/command/sessionId/status/proven/evidence/payload
ask output validates with existing validateP8CliResultEnvelope()
ask payload carries existing provider/model/assistant values
ask proven is exactly false
unknown legacy top-level result aliases are absent
human-readable apply-patch output remains unchanged
human-readable ask output remains unchanged
solve --json remains legacy/unmodified in this unit
existing P8-R1 runtime/schema contract tests remain unchanged and pass
no package/schema/contract-source/live-solve mutation occurs
```

Focused tests and all repository-required CI must be terminal success on one unchanged exact head.

---

## 7. Safety and authority boundaries

```text
P8_R2 = NON_AGENT_LOOP_CLI_RESULT_ENVELOPE_WIRING_ONLY
P8_R2 != SOLVE_JSON_MIGRATION
P8_R2 != LIVE_SOLVE_MIGRATION
P8_R2 != CLI_EXIT_CODE_CHANGE
P8_R2 != NEW_CLI_OPTION
P8_R2 != PACKAGE_ROOT_EXPORT
P8_R2 != PACKAGE_RENAME
P8_R2 != PACKAGE_VERSION_CHANGE
P8_R2 != PACKAGE_PUBLICATION
P8_R2 != INSTALLER_UPDATE_MECHANISM
P8_R2 != GITHUB_APP_OR_CI_PRODUCT_INTEGRATION
P8_R2 != PROVIDER_MODEL_AUTHORITY_EXPANSION
P8_R2 != SECRET_NETWORK_FILESYSTEM_AUTHORITY_EXPANSION
P8_R2 != K2_AUTHORITY_EXPANSION
P8_R2 != K5_OR_DONE_GATE_AUTHORITY_CHANGE
P8_R2 != PERSISTENCE_TELEMETRY_UPLOAD_LEARNING
P8_R2 != PUBLIC_RELEASE_OR_DEPLOYMENT
P8_R2 != P8_R3_PLUS_AUTHORITY
P8_R2 != PROJECT_COMPLETION
```

Existing `apply-patch` and `ask` execution paths retain only their already-canonical authority. Formatting an already-produced result into the P8-R1 envelope does not create execution, proof, provider, write, release, or completion authority.

---

## 8. Qualification gate for this authorization candidate

Do not merge this one-path authorization unless one unchanged exact head/current metadata proves:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1
CHANGED_PATH = docs/planning/KODAC_P8_R2_NON_AGENT_LOOP_CLI_RESULT_ENVELOPE_WIRING_AUTHORIZATION_2026-09-09.md
AUTHORIZATION_BLOB = FROZEN
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NON_APPLICABLE
INTERNAL_SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_INSPECTION = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
REQUIRED_EXTERNAL_SEMANTIC_REVIEW_COUNT = 0
EXTERNAL_REVIEW = OPTIONAL_ADVISORY_EVIDENCE
RULESET_20707483 = ACTIVE / NO_BYPASS
MERGE = GUARDED_NORMAL_MERGE_USING_EXACT_EXPECTED_HEAD_SHA
POST_MERGE_PROOF = MAIN + ORDERED_PARENTS + TREE + AUTHORIZATION_BLOB + VERIFIED_VALID_SIGNATURE + APPLICABLE_PUSH_CHECKS + MERGED_PR_STATE + RULESET + REVIEW_THREADS
WAIVER = NO
```

Any byte/head/base/blob/path/ruleset/material-evidence movement invalidates exact-head qualification evidence.

---

## 9. Candidate boundary

Until this exact one-path record qualifies, merges, and passes mandatory external post-merge proof:

```text
P8_R2_IMPLEMENTATION = NOT_AUTHORIZED
DIRECT_RUNTIME_MUTATION = NOT_AUTHORIZED
P8_R3_PLUS = NOT_AUTHORIZED_BY_NUMBERING
SOLVE_JSON_MIGRATION = NOT_AUTHORIZED
LIVE_SOLVE_MIGRATION = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT_PUBLICATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
PUBLIC_RELEASE_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

If this record later becomes canonical and post-merge proven, it authorizes exactly one later three-path P8-R2 implementation candidate and nothing broader.