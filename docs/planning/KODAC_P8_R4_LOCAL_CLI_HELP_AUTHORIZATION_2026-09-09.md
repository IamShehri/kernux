# Kodac P8-R4 — Local CLI Help Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY UNTIL MERGED_AND_POST_PROVEN**  
Date: 2026-09-09  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 32124d9264704805cdbb4e25d893c5d6ec0523a5
P8_R3_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #498 / proof 5593301740
POST_P8_R3_RECONCILIATION_SUCCESSOR_ANALYSIS = PR #498 / comment 5593354435 / ANALYSIS_ONLY
P8_PRODUCT_DISTRIBUTION_HARDENING = NOT_CLOSED
P8_R4_IMPLEMENTATION = NOT_AUTHORIZED_UNTIL_THIS_RECORD_QUALIFIES_MERGES_AND_POST_PROVES
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This is a one-path documentation-only authorization candidate. It creates no runtime, source, test, package, workflow, provider/model, network, filesystem, persistence, release, or completion authority while unmerged or post-merge-unproven.

The label `P8-R4` is descriptive only. Authority comes only from this exact record after qualification, guarded normal merge, and mandatory external post-merge proof.

---

## 2. Why this is the minimum non-duplicative successor

Canonical P8 planning includes `local-first CLI experience` as a distinct hardening concern.

Fresh analysis against canonical main established:

```text
EXISTING_MAIN_CLI = packages/kodac-runtime/src/cli.ts
EXISTING_BIN = packages/kodac-runtime/bin/kodac.mjs
EXISTING_BIN_DELEGATES_NON_SPECIAL_ARGV_TO_MAIN_CLI = YES
EXISTING_MAIN_COMMANDS = apply-patch | ask | solve
EXISTING_MACHINE_RESULT_PROTOCOL = kodac.cli-result / version 1
EXISTING_MAIN_CLI_HELP_FLAG = NOT_FOUND
EXISTING_MAIN_CLI_VERSION_FLAG = NOT_FOUND
NO_ARG_OR_UNKNOWN_COMMAND = USAGE_ERROR / EXIT 1
RUNTIME_PACKAGE = @kodac/runtime-internal / private=true / version=0.0.0-k2
PUBLICATION = NOT_AUTHORIZED
```

Because the existing bin already delegates to the main CLI, no binary, package, installer, publication, README, workflow, provider, model, or release mutation is needed to add minimum discoverability.

This authorization therefore isolates one static local help surface only.

---

## 3. Exact future implementation allowlist

Only after this authorization becomes canonical and externally post-merge proven may one later implementation candidate modify exactly:

```text
packages/kodac-runtime/src/cli.ts
packages/kodac-runtime/test/p8-r4-local-cli-help.test.ts
```

No third path is authorized.

The later implementation must not modify:

```text
packages/kodac-runtime/bin/kodac.mjs
packages/kodac-runtime/package.json
packages/kodac-runtime/src/product/p8-cli-result-envelope.ts
schema/**
README.md
.github/**
package.json
package-lock.json
pnpm-lock.yaml
uv.lock
```

or any existing K2/K3/KRI/K4/K5/K6/P2-P7 source, test, schema, evidence, authorization, workflow, provider/model configuration, persistence/telemetry/learning surface, release configuration, roadmap/current-view file, ruleset, or repository-protection path.

No new dependency is authorized.

---

## 4. Required future behavior

The future implementation may add exactly one new main-CLI invocation form:

```text
kodac --help
```

Required behavior:

```text
EXIT_CODE = 0
STDERR = EMPTY
STDOUT = DETERMINISTIC_STATIC_HELP_TEXT
RUNTIME_SESSION_CREATED = NO
EVIDENCE_LEASE_CREATED = NO
EVIDENCE_DIRECTORY_CREATED = NO
PROVIDER_MODEL_INVOCATION = NO
NETWORK_ACCESS = NO
K2_SIDE_EFFECT = NO
WORKSPACE_MUTATION = NO
```

The static help text must describe only already-established main CLI behavior:

```text
apply-patch
ask
solve
```

It may document only options already accepted by canonical `packages/kodac-runtime/src/cli.ts` at the implementation base. It must not present future or separately gated surfaces as available behavior.

The implementation must return the help result before command parsing creates any runtime session or evidence lease.

The help surface must be deterministic and must not read package metadata, environment-derived release identity, filesystem content, network state, provider configuration, secrets, Git state, or external services to construct its output.

---

## 5. Compatibility requirements

The future implementation must preserve all existing behavior for every invocation other than exact `argv = ["--help"]`.

Required preservation:

```text
NO_ARGS = EXISTING USAGE ERROR / EXIT 1
UNKNOWN_COMMAND = EXISTING USAGE ERROR / EXIT 1
apply-patch EXIT SEMANTICS = UNCHANGED
ask EXIT SEMANTICS = UNCHANGED
solve EXIT SEMANTICS = UNCHANGED
HUMAN COMMAND OUTPUT = UNCHANGED
P8 JSON RESULT ENVELOPES = UNCHANGED
CONTROLLED_LIVE_SOLVE = UNCHANGED
```

The implementation must not add aliases such as:

```text
-h
help
--version
version
```

Those invocation forms remain outside this bounded unit.

---

## 6. Preserved authority boundaries

```text
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_DONE_GATE_AUTHORITY = UNCHANGED
DONE_GATE_IMPLEMENTATION = UNCHANGED
DONE_GATE_ALGORITHM = UNCHANGED
VERIFICATION_EXECUTION = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
FILESYSTEM_WRITE_AUTHORITY = NOT_AUTHORIZED_BY_THIS_UNIT
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_NAME_VERSION_CHANGE = NOT_AUTHORIZED
PACKAGE_PUBLICATION = NOT_AUTHORIZED
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED
OPERATIONAL_DOCS_EXAMPLES_MUTATION = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
PUBLIC_RELEASE_DEPLOYMENT = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
PROJECT_COMPLETION = NOT_ESTABLISHED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
WAIVER = NO
```

`kodac --help` returning `0` is the only newly authorized CLI exit outcome. This does not authorize changing the exit code of any existing command or invalid invocation.

---

## 7. Required future implementation tests

The future test path must prove at least:

1. exact `runCli(["--help"])` returns `0`;
2. stdout contains deterministic static help for exactly the established `apply-patch`, `ask`, and `solve` main command families;
3. stderr is empty;
4. no help alias outside `--help` is silently admitted;
5. no-argument and unknown-command behavior remains the existing usage error with exit `1`;
6. help output does not claim `--version`, package publication, GitHub/CI integration, MCP/editor/daemon/SDK integration, or release availability;
7. existing P8 result-envelope and command behavior remain covered by the full runtime suite.

The implementation must pass the repository's applicable typecheck, full runtime test suite, patch benchmark, governance checks, and K2 runtime gate on one unchanged exact head.

---

## 8. Qualification gate for this authorization candidate

This authorization candidate may change exactly one path and no second path:

```text
docs/planning/KODAC_P8_R4_LOCAL_CLI_HELP_AUTHORIZATION_2026-09-09.md
```

Before guarded merge, one unchanged exact head/current metadata must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1
AUTHORIZATION_BLOB = FROZEN
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NON_APPLICABLE
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
MERGE = GUARDED_NORMAL_MERGE_USING_EXACT_EXPECTED_HEAD_SHA
POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

Any head/base/blob/path/check/review/ruleset movement invalidates exact-head qualification evidence.

---

## 9. Candidate boundary

Until this exact one-path record qualifies, merges, and passes mandatory external post-merge proof:

```text
P8_R4_LOCAL_CLI_HELP_IMPLEMENTATION = NOT_AUTHORIZED
DIRECT_RUNTIME_MUTATION = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

After canonical activation, authority extends only to one exact two-path implementation candidate. That implementation must independently qualify, guarded-merge, and pass mandatory post-merge proof before this bounded behavior can become closed canonical.