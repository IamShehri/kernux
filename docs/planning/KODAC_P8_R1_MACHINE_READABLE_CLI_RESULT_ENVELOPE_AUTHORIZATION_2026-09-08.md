# Kodac P8-R1 — Machine-Readable CLI Result Envelope Foundation Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY UNTIL MERGED_AND_POST_PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Deny-by-default baseline

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 14a3a7b243cadc661094e3500329b0126f334b85
CANONICAL_TREE_AT_CANDIDATE_START = bc0a104f5fdd0ec9bde62452e286c9e995a428c8
P7_BOUNDED_R1_R30_ENGINEERING_SCOPE = CLOSED_CANONICAL / PR #483 / proof 5590967916
P7_POST_CLOSEOUT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #485 / proof 5591213559
POST_P7_SUCCESSOR_ANALYSIS = PR #485 / comment 5591269488 / ANALYSIS_ONLY
P8_R1_IMPLEMENTATION = NOT_AUTHORIZED_UNTIL_THIS_RECORD_QUALIFIES_MERGES_AND_POST_PROVES
P8_R2_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P7_OVERALL = NOT_CLOSED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This record is a one-path documentation-only authorization candidate. It creates no runtime, product wiring, package, publication, provider/model, network, persistence, release, or completion authority while unmerged or unproven.

---

## 2. Why this is the minimum non-duplicative P8 unit

Canonical planning places Product & Distribution Hardening after bounded P7 and identifies, among other future concerns:

```text
LOCAL_FIRST_CLI_EXPERIENCE
GITHUB_CI_INTEGRATION
MACHINE_READABLE_EVIDENCE_OUTPUT
CLEAR_AGENT_INTEGRATION_CONTRACTS
DETERMINISTIC_STATIC_FALLBACK
INSTALLATION_UPDATE_INTEGRITY
PRIVACY_EGRESS_CONTROLS
OPERATIONAL_DOCS_EXAMPLES
RELEASE_VERSION_SEPARATION
```

The planning record does not itself authorize implementation.

Fresh live-code analysis after canonical P7 bounded closeout and post-closeout reconciliation established:

```text
EXISTING_CLI = packages/kodac-runtime/src/cli.ts
EXISTING_BIN = packages/kodac-runtime/bin/kodac.mjs
EXISTING_JSON_MODE = YES / --json
EXISTING_MACHINE_READABLE_OUTPUTS = COMMAND_SPECIFIC / INLINE_OBJECTS
EXISTING_VERSIONED_CLI_RESULT_PROTOCOL = NOT_FOUND
EXISTING_CLI_RESULT_SCHEMA = NOT_FOUND
EXISTING_AGENT_FACING_RESULT_ENVELOPE = NOT_FOUND
RUNTIME_PACKAGE_NAME = @kodac/runtime-internal
RUNTIME_PACKAGE_PRIVATE = true
RUNTIME_PACKAGE_VERSION = 0.0.0-k2
PUBLICATION_STATE = UNPUBLISHED / PUBLICATION_NOT_AUTHORIZED
```

Therefore the first independently useful P8 mechanism is not a second CLI, package publication, package-root exposure, GitHub integration, or release configuration. It is one pure/data-only versioned contract for machine-readable CLI results that can later be wired to existing `--json` paths only under separate authority.

```text
P8_R1_CONTRACT != CLI_WIRING
P8_R1_CONTRACT != PACKAGE_PUBLICATION
P8_R1_CONTRACT != RELEASE
P8_R1_CONTRACT != PROVIDER_MODEL_AUTHORITY
P8_R1_CONTRACT != DONE_GATE_AUTHORITY
```

The label `P8-R1` is descriptive only. Authority comes from this exact bounded record after qualification, guarded merge, and mandatory external post-merge proof; it does not arise from numbering or master-plan sequence.

---

## 3. Exact future implementation allowlist

Only after this authorization becomes canonical and externally post-merge proven may one later implementation candidate modify exactly:

```text
packages/kodac-runtime/src/product/p8-cli-result-envelope.ts
schema/p8-cli-result-envelope.schema.json
packages/kodac-runtime/test/p8-r1-cli-result-envelope.test.ts
```

No fourth path is authorized.

The later implementation must not modify:

```text
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/bin/kodac.mjs
packages/kodac-runtime/package.json
README.md
.github/**
package-lock.json
pnpm-lock.yaml
uv.lock
```

or any existing K2/K3/KRI/K5/K6/P2-P7 runtime source, schema, test, evidence, authorization record, provider/model configuration, evidence store, persistence/telemetry/learning surface, release configuration, package/publication metadata, current roadmap/product view, ruleset, or repository-protection path.

No new dependency or lockfile mutation is authorized.

---

## 4. Required P8-R1 contract semantics

The future implementation must define one versioned machine-readable result envelope family purpose-equivalent to:

```text
PROTOCOL = kodac.cli-result
VERSION = 1
```

It must provide a discriminated command identity for exactly the currently established user-facing CLI command families:

```text
apply-patch
ask
solve
```

The contract must separate shared transport/result metadata from command-specific payload rather than flattening unrelated command semantics into one ambiguous object.

A purpose-equivalent common envelope shape is:

```text
P8CliResultEnvelopeV1 {
  protocol = "kodac.cli-result"
  version = 1
  command
  sessionId
  status
  proven
  evidence
  payload
}
```

This is semantic guidance, not a requirement to use these exact TypeScript property names if an equivalent stricter design is proven by schema/runtime/test agreement.

Required invariants:

1. `protocol` and `version` are immutable literal identities.
2. `command` is a closed discriminator for exactly `apply-patch | ask | solve` in R1.
3. `sessionId` is a non-empty bounded string and carries identity only; R1 must not invent a second session authority algorithm.
4. `status` is command-compatible and closed/bounded; arbitrary free-form status strings are not allowed.
5. `proven` is a required boolean whose allowed value must be consistent with the command/status payload semantics.
6. `evidence` contains only bounded inert references/paths or identities already supplied by the caller; R1 performs no filesystem/network lookup and does not validate external evidence truth.
7. `payload` is discriminated by `command` and contains only command-compatible bounded data.
8. Unknown top-level and nested fields fail closed.
9. Caller-owned mutable objects/arrays are not retained by reference.
10. Returned validated records are detached and deeply immutable.
11. Object/prototype/accessor/proxy ambiguity fails closed where applicable under the repository's existing pure-contract validation conventions.
12. All strings and collections have explicit deterministic resource bounds.
13. JSON Schema and runtime validation semantics agree exactly for accepted/rejected JSON-representable cases.

---

## 5. Command-specific semantic boundary

P8-R1 must model existing result meaning without changing existing execution semantics.

### `apply-patch`

The contract may represent the existing machine-readable meaning that a patch was applied and remains unproven until independent verification occurs.

Required invariant:

```text
APPLY_PATCH_RESULT.proven = false
PATCH_APPLIED != VERIFIED
PATCH_APPLIED != PROVEN_READY
PATCH_APPLIED != DONE
```

The payload may bind existing affected-path/receipt evidence identities but must not read or execute them.

### `ask`

The contract may represent a non-side-effecting assistant result with provider/model identity and evidence reference supplied by the caller.

Required invariant:

```text
ASK_RESULT.proven = false
ASSISTANT_RESPONSE != VERIFICATION
ASSISTANT_RESPONSE != PROVEN_READY
```

P8-R1 does not invoke any provider/model and does not authorize provider/model selection, retry, spend, credentials, or network access.

### `solve`

The contract may represent an existing solve result whose `proven=true` is permitted only when the supplied status explicitly represents the already-established Done Gate `PROVEN_READY` result. All non-ready/error/partial states require `proven=false`.

Required invariant:

```text
SOLVE_RESULT.proven = true
  ONLY_IF
SOLVE_RESULT.status = PROVEN_READY
```

The envelope does not evaluate Done Gate, recompute proof, inspect proof artifacts, or create readiness. It may only bind a caller-supplied result that is internally consistent with the contract.

```text
CLI_RESULT_PROVEN_FLAG != INDEPENDENT_PROOF
CLI_RESULT_STATUS != DONE_GATE_AUTHORITY
P8_R1_VALIDATION != DONE_GATE_EVALUATION
```

---

## 6. Required safety and non-equivalence boundaries

```text
P8_R1 = PURE_DATA_CONTRACT_ONLY
P8_R1 != CLI_BEHAVIOR_CHANGE
P8_R1 != CLI_EXIT_CODE_CHANGE
P8_R1 != CLI_JSON_WIRING
P8_R1 != PACKAGE_ROOT_EXPORT
P8_R1 != PACKAGE_RENAME
P8_R1 != PACKAGE_VERSION_CHANGE
P8_R1 != PACKAGE_PUBLICATION
P8_R1 != INSTALLER_OR_UPDATE_MECHANISM
P8_R1 != GITHUB_APP_OR_CI_INTEGRATION
P8_R1 != RELEASE_VERSION_AUTHORITY
P8_R1 != PUBLIC_RELEASE_AUTHORITY
P8_R1 != DEPLOYMENT_AUTHORITY
P8_R1 != PROVIDER_MODEL_INVOCATION
P8_R1 != PROVIDER_SPEND
P8_R1 != SECRET_ACCESS
P8_R1 != NETWORK_ACCESS
P8_R1 != FILESYSTEM_WRITE_AUTHORITY
P8_R1 != K2_AUTHORITY_EXPANSION
P8_R1 != K5_OR_DONE_GATE_AUTHORITY_CHANGE
P8_R1 != PERSISTENCE_TELEMETRY_UPLOAD_LEARNING
P8_R1 != P8_R2_PLUS_AUTHORITY
P8_R1 != PROJECT_COMPLETION
```

The future implementation may not import or invoke filesystem, process/shell, Git, network, provider/model, execution-gateway, persistence, telemetry, upload, package-manager, release, or deployment capabilities.

---

## 7. Required adversarial qualification

The future implementation tests must cover at least:

```text
protocol/version literal enforcement
closed command discriminator
closed command-compatible status values
unknown-field rejection at every object level
empty/oversized/control-ambiguous strings
oversized collections
apply-patch proven=true rejection
ask proven=true rejection
solve PROVEN_READY with proven=false rejection or explicit canonical normalization policy
solve non-PROVEN_READY with proven=true rejection
command/payload discriminator mismatch
malformed evidence references
duplicate evidence reference keys or semantically ambiguous aliases where applicable
mutation-after-call does not affect output
returned nested data is deeply frozen
unsupported object/prototype/accessor/proxy data fails closed where applicable
schema/runtime accepted-set agreement for JSON-representable cases
schema/runtime rejected-set agreement for adversarial JSON fixtures
deterministic serialization-safe output shape
```

Focused tests and full repository-required CI must be terminal success on one unchanged exact head.

---

## 8. Qualification gate for this authorization candidate

Do not merge this one-path authorization unless one unchanged exact head/current metadata proves:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1
CHANGED_PATH = docs/planning/KODAC_P8_R1_MACHINE_READABLE_CLI_RESULT_ENVELOPE_AUTHORIZATION_2026-09-08.md
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

Until this exact one-path record qualifies, merges guarded, and passes mandatory external post-merge proof:

```text
P8_R1_IMPLEMENTATION = NOT_AUTHORIZED
DIRECT_IMPLEMENTATION = NOT_AUTHORIZED
P8_R2_PLUS = NOT_AUTHORIZED_BY_NUMBERING
CLI_WIRING = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_PUBLICATION = NOT_AUTHORIZED
PUBLIC_RELEASE = NOT_AUTHORIZED
DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

If this record later becomes canonical and post-merge proven, it authorizes exactly one later three-path pure/data-only P8-R1 implementation candidate and nothing broader.