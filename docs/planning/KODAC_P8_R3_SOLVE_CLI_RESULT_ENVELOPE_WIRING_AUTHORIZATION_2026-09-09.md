# Kodac P8-R3 — Solve CLI Result Envelope Wiring Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY UNTIL MERGED_AND_POST_PROVEN**  
Date: 2026-09-09  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Deny-by-default baseline

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 4172870eaaac40d15574eb37a3a8f2a80be18169
CANONICAL_TREE_AT_CANDIDATE_START = 5ebc4aa37d7c61c8fc3fb480c9e7667df7e31f59
P8_R2_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #493 / proof 5592657114
POST_P8_R2_RECONCILIATION_SUCCESSOR_ANALYSIS = PR #493 / comment 5592680727 / ANALYSIS_ONLY
P8_R3_IMPLEMENTATION = NOT_AUTHORIZED_UNTIL_THIS_RECORD_QUALIFIES_MERGES_AND_POST_PROVES
P8_R4_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P8_PRODUCT_DISTRIBUTION_HARDENING = NOT_CLOSED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This record is a one-path documentation-only authorization candidate. While unmerged or unproven it creates no runtime, execution, provider/model, network, secret, filesystem, persistence, package, publication, GitHub integration, release, deployment, successor, or project-completion authority.

---

## 2. Evidence-driven purpose

The canonical P8-R1 contract already defines one versioned solve result-envelope family:

```text
PROTOCOL = kodac.cli-result
VERSION = 1
COMMAND = solve
STATUSES = STOPPED | NOT_READY | PROVEN_READY
```

P8-R2 intentionally wired only `apply-patch --json` and `ask --json`, leaving `solve --json` on its legacy top-level shape because `packages/kodac-runtime/src/live-solve.ts` consumes that shape internally.

Fresh analysis after P8-R2 reconciliation closure established:

```text
SOLVE_JSON = INLINE / UNVERSIONED / LEGACY_TOP_LEVEL_SHAPE
P8_R1_SOLVE_BUILDER_CONTRACT = IMPLEMENTED / PURE / UNCHANGED
CONTROLLED_LIVE_SOLVE = INTERNAL_CONSUMER_OF_SOLVE_JSON
CONTROLLED_LIVE_SOLVE_CONSUMES = status | proven | assistant | evidence
SCHEMA_OR_CONTRACT_CHANGE_REQUIRED = NO
```

The minimum safe next unit is therefore to wire `solve --json` through the existing unchanged P8-R1 builder and adapt the one controlled-live-solve consumer in the same bounded change so its outer semantics remain stable.

The label `P8-R3` is descriptive only. Authority comes only from this exact record after qualification, guarded merge, and mandatory external post-merge proof.

---

## 3. Exact future implementation allowlist

Only after this authorization becomes canonical and externally post-merge proven may one later implementation candidate modify exactly:

```text
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/src/live-solve.ts
packages/kodac-runtime/test/p8-r2-non-agent-loop-cli-envelope-wiring.test.ts
packages/kodac-runtime/test/live-solve-qualification.test.ts
packages/kodac-runtime/test/p8-r3-solve-cli-envelope-wiring.test.ts
```

No sixth path is authorized.

The later implementation must not modify:

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

or any existing K2/K3/KRI/K5/K6/P2-P7 source, schema, workflow, authorization/evidence record, provider/model configuration, evidence store, persistence/telemetry/learning surface, release configuration, ruleset, or repository-protection path.

No dependency or lockfile mutation is authorized.

---

## 4. Required implementation semantics

The future implementation must use the existing unchanged `buildP8CliResultEnvelope()` contract from `packages/kodac-runtime/src/product/p8-cli-result-envelope.ts` as the only P8-R3 solve-envelope construction authority.

### solve stopped

For a bounded agent-loop stop under `kodac solve ... --json`, output must become exactly one P8-R1 solve envelope purpose-equivalent to:

```text
protocol = kodac.cli-result
version = 1
command = solve
sessionId = existing runtime session id
status = STOPPED
proven = false
evidence.events = existing event path
evidence.receipts = existing receipt path
payload.reason = existing bounded stop reason
payload.budget = existing bounded loop budget
```

### solve completed / not ready

For a completed solve whose Done Gate is `NOT_READY`:

```text
protocol = kodac.cli-result
version = 1
command = solve
status = NOT_READY
proven = false
evidence = existing events/receipts/plan/proof paths
payload.provider = existing provider
payload.model = existing model
payload.assistant = existing assistant
payload.budget = existing loop budget
payload.verificationRisk = existing plan risk
payload.verificationCommands = existing command ids
payload.warnings = existing warnings
payload.reasons = existing gate reasons
```

### solve completed / proven ready

For a completed solve whose Done Gate is `PROVEN_READY`, the same completed envelope shape applies with:

```text
status = PROVEN_READY
proven = true
payload.reasons = []
```

No Done Gate algorithm, evidence generation, verification execution, provider/model invocation, write behavior, session lifecycle, human-readable output, or exit-code behavior may change.

### controlled live solve adaptation

`packages/kodac-runtime/src/live-solve.ts` must consume the canonical nested solve envelope without weakening validation or changing its outer controlled-live-solve contract.

The internal parsed solve result must be validated through the existing `validateP8CliResultEnvelope()` contract and must be a `command=solve` envelope before use.

Controlled live solve must continue to preserve its current outer semantics:

```text
outer status = nested solve status, or ERROR if no valid solve envelope exists
outer proven = nested solve proven === true
outer provider/model/write scope/qualification/authorization/report paths/exitCode = unchanged
controlled report protocol/version/digest semantics = unchanged
controlled report solve field = canonical nested P8 solve envelope when available
human assistant output = nested solve payload.assistant when present
human proof output = nested solve evidence.proof when present
```

An invalid/non-solve structured payload must fail closed and must not be treated as a valid solve result.

---

## 5. Historical P8-R2 test boundary

The P8-R2 focused test currently includes an assertion that solve remained legacy. That assertion proved the R2 boundary at its exact historical head but is not a permanent requirement after a separately authorized later migration.

The future P8-R3 implementation may modify only that test file to remove/narrow the obsolete current-runtime solve-shape assertion. The P8-R2 apply-patch/ask tests and human-output assertions must remain intact.

Historical P8-R2 Git evidence remains canonical and is not rewritten.

---

## 6. Required focused proof

The future tests must prove at least:

```text
solve STOPPED --json emits exactly the canonical P8 envelope key set
solve STOPPED validates with validateP8CliResultEnvelope()
solve STOPPED proven = false
solve NOT_READY --json emits and validates the completed solve envelope
solve NOT_READY proven = false and carries non-empty reasons
solve PROVEN_READY --json emits and validates the completed solve envelope
solve PROVEN_READY proven = true and carries empty reasons
legacy solve top-level provider/model/assistant/budget aliases are absent
human-readable solve behavior is unchanged
solve exit codes remain 2 for STOPPED, 3 for NOT_READY, 0 for PROVEN_READY, 1 for errors
controlled live solve accepts the canonical nested solve envelope
controlled live solve preserves outer status/proven/report/write-scope semantics
controlled live solve human assistant/proof extraction uses nested payload/evidence
controlled live solve fails closed on invalid/non-solve structured payload
existing P8-R1 runtime/schema contract remains unchanged and passes
P8-R2 apply-patch/ask focused coverage remains intact and passes
no package/schema/contract-source/dependency/workflow mutation occurs
```

Focused tests and all repository-required CI must be terminal success on one unchanged exact head.

---

## 7. Explicitly frozen behavior and authority

```text
apply-patch --json = UNCHANGED P8 ENVELOPE
ask --json = UNCHANGED P8 ENVELOPE
apply-patch human output = UNCHANGED
ask human output = UNCHANGED
solve human output = UNCHANGED
CLI argument parsing = UNCHANGED / NO NEW OPTIONS
CLI exit codes = UNCHANGED
session/evidence lifecycle = UNCHANGED
retention semantics = UNCHANGED
provider/model selection/invocation = UNCHANGED
controlled live-solve provider qualification = UNCHANGED
controlled live-solve exact write scope = UNCHANGED
K2 execution semantics = UNCHANGED
K5/Done Gate semantics = UNCHANGED
P8_R1_CONTRACT_SCHEMA = UNCHANGED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_RENAME_VERSION_PUBLICATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
P8_R4_PLUS = NOT_AUTHORIZED_BY_NUMBERING
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

---

## 8. Qualification gate for this authorization candidate

Do not merge this one-path authorization unless one unchanged exact head/current metadata proves:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1
CHANGED_PATH = docs/planning/KODAC_P8_R3_SOLVE_CLI_RESULT_ENVELOPE_WIRING_AUTHORIZATION_2026-09-09.md
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
P8_R3_IMPLEMENTATION = NOT_AUTHORIZED
DIRECT_RUNTIME_MUTATION = NOT_AUTHORIZED
P8_R4_PLUS = NOT_AUTHORIZED_BY_NUMBERING
PACKAGE_ROOT_EXPORT_PUBLICATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```
