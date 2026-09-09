# Kodac P8 — Repository-Local CLI Help Documentation Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_README_MUTATION_AUTHORITY UNTIL MERGED_AND_POST_PROVEN**  
Date: 2026-09-09  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = a4da1902fa7f4cabf692d6efdaab7579d78b6fbb
CANONICAL_TREE_AT_CANDIDATE_START = b9a7a2ca393a0d98dbb6dc65e04bfa48e9ad5a09
P8_R4_IMPLEMENTATION = CLOSED_CANONICAL / PR #500 / proof 5593608278
P8_R4_POST_MERGE_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL / PR #501 / proof 5593658679
P8_R4_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #502 / proof 5593778310
POST_P8_R4_RECONCILIATION_SUCCESSOR_ANALYSIS = PR #502 / comment 5593799498 / ANALYSIS_ONLY
P8_PRODUCT_DISTRIBUTION_HARDENING = NOT_CLOSED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This is a one-path documentation-only authorization candidate. It creates no README mutation, source, runtime, test, schema, package, workflow, dependency, provider/model, network, filesystem-authority, persistence, release, integration, successor, or project-completion authority while unmerged or post-merge-unproven.

This record intentionally uses a descriptive P8 label rather than inferring `P8-R5` authority from sequence or numbering.

---

## 2. Why this is the minimum non-duplicative successor

The P8 master plan identifies `OPERATIONAL_DOCS_EXAMPLES` as a Product & Distribution Hardening concern, but current canonical records explicitly preserve:

```text
OPERATIONAL_DOCS_EXAMPLES_MUTATION = NOT_AUTHORIZED
```

Fresh repository analysis on canonical main established:

```text
README_QUICK_START = TEST_AND_PATCH_BENCH_COMMANDS_ONLY
README_REPOSITORY_LOCAL_CLI_INVOCATION_EXAMPLE = NOT_FOUND
README_LOCAL_HELP_EXAMPLE = NOT_FOUND
RUNTIME_PACKAGE = @kodac/runtime-internal
RUNTIME_PACKAGE_PRIVATE = true
RUNTIME_PACKAGE_VERSION = 0.0.0-k2
RUNTIME_NODE_ENGINE = >=24
RUNTIME_CLI_SCRIPT = npm run cli -> node --experimental-strip-types src/cli.ts
RUNTIME_BIN = kodac -> ./bin/kodac.mjs
P8_R4_EXACT_HELP = CLOSED_CANONICAL
GLOBAL_PACKAGE_INSTALLATION = NOT_AUTHORIZED
PACKAGE_PUBLICATION = NOT_AUTHORIZED
```

P8-R4 already proved exact local `kodac --help` behavior. The smallest useful follow-up is therefore documentation of the repository-local invocation path for that already-proven help behavior. This requires no runtime behavior change and no new dependency, provider, package, installation, CI, integration, release, or execution authority.

---

## 3. Exact future implementation allowlist

Only after this authorization independently qualifies, guarded-merges, and passes mandatory external post-merge proof may one later documentation implementation candidate modify exactly:

```text
README.md
```

No second path is authorized.

The future implementation must not modify:

```text
packages/kodac-runtime/**
package.json
package-lock.json
pnpm-lock.yaml
uv.lock
schema/**
.github/**
docs/**
provenance/**
agents/**
matrix/**
tools/**
```

No source, test, package metadata, bin, schema, workflow, dependency, lockfile, provider/model, ruleset, release, or historical evidence/authorization record mutation is authorized.

---

## 4. Exact future README meaning

The future README-only implementation may add or adjust only the runtime quick-start documentation necessary to describe the already-existing repository-local help path.

It may document exactly:

```text
RUNTIME_LOCATION = packages/kodac-runtime
NODE_REQUIREMENT = 24+
REPOSITORY_LOCAL_HELP_COMMAND = npm run cli -- --help
HELP_BEHAVIOR = EXISTING_P8_R4_CANONICAL_BEHAVIOR
PACKAGE_PRIVATE = true
PACKAGE_UNPUBLISHED = true
```

A purpose-equivalent example may be shown only as:

```bash
cd packages/kodac-runtime
npm run cli -- --help
```

The prose must clearly state that this is a repository-local development invocation and does not imply package publication, global installation, production release, or a generally installable `kodac` command.

The future README implementation may preserve existing test/benchmark quick-start commands unchanged.

---

## 5. Explicit documentation non-grants

The future README implementation must not document, imply, or advertise any of the following as newly available through this slice:

```text
GLOBAL_kodac_INSTALLABILITY = NOT_AUTHORIZED
--version = NOT_AUTHORIZED
version_ALIAS = NOT_AUTHORIZED
-h = NOT_AUTHORIZED
help_ALIAS = NOT_AUTHORIZED
PACKAGE_NAME_VERSION_CHANGE = NOT_AUTHORIZED
PACKAGE_PUBLICATION = NOT_AUTHORIZED
PUBLIC_RELEASE = NOT_AUTHORIZED
DEPLOYMENT = NOT_AUTHORIZED
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED
PROVIDER_MODEL_AUTHORITY_EXPANSION = NOT_AUTHORIZED
NETWORK_SECRET_FILESYSTEM_AUTHORITY_EXPANSION = NOT_AUTHORIZED
COMMAND_EXECUTION_EXAMPLES = NOT_AUTHORIZED_BY_THIS_SLICE
APPLY_PATCH_EXECUTION_EXAMPLE = NOT_AUTHORIZED_BY_THIS_SLICE
ASK_PROVIDER_EXECUTION_EXAMPLE = NOT_AUTHORIZED_BY_THIS_SLICE
SOLVE_EXECUTION_EXAMPLE = NOT_AUTHORIZED_BY_THIS_SLICE
WRITE_APPROVAL_EXAMPLE = NOT_AUTHORIZED
VERIFICATION_APPROVAL_EXAMPLE = NOT_AUTHORIZED
LIVE_PROVIDER_CREDENTIAL_EXAMPLE = NOT_AUTHORIZED
K2_K5_DONE_GATE_AUTHORITY_CHANGE = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

The future documentation must not transform an internal private package into a public product claim by prose.

---

## 6. Required truth preservation

The future implementation must preserve these existing facts without relabeling:

```text
P8_R4_EXACT_INVOCATION_SEMANTICS = kodac --help / exit 0 / deterministic static stdout / empty stderr
P8_R4_EARLY_RETURN = BEFORE_RUNTIME_SESSION_EVIDENCE_PROVIDER_K2_WORKSPACE_MUTATION
P8_R4_-h = NOT_ADMITTED
P8_R4_help_ALIAS = NOT_ADMITTED
P8_R4_--version = NOT_ADMITTED
P8_R4_version_ALIAS = NOT_ADMITTED
NO_ARG_USAGE_ERROR_EXIT_1 = PRESERVED
UNKNOWN_COMMAND_USAGE_ERROR_EXIT_1 = PRESERVED
LOCAL_NODE_22_FIRST_FULL_SUITE_ATTEMPT = REAL_FAILURE_PRESERVED
CANONICAL_NODE_24_P8_R4_EVIDENCE = SUCCESS
RUNTIME_PACKAGE_PRIVATE_UNPUBLISHED = YES
```

The README may summarize only the help path. It must not erase or rewrite historical evidence to make the project appear more complete, public, released, installable, or qualified than canonical records prove.

---

## 7. Qualification gate for this authorization candidate

This authorization candidate may change exactly one path and no second path:

```text
docs/planning/KODAC_P8_LOCAL_CLI_HELP_DOCUMENTATION_AUTHORIZATION_2026-09-09.md
```

Before guarded merge, one unchanged exact head/current metadata must prove:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1
AUTHORIZATION_BLOB = FROZEN
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
REQUIRED_EXTERNAL_SEMANTIC_REVIEW_COUNT = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
MERGE = GUARDED_NORMAL_MERGE_USING_EXACT_EXPECTED_HEAD_SHA
POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

Any head/base/blob/path/material-metadata/check/review-thread/ruleset movement invalidates qualification evidence.

---

## 8. Qualification gate for the future README implementation

After this authorization becomes canonical and externally post-merge proven, the later README-only implementation must independently prove on one unchanged exact head:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_README.md
NO_SECOND_PATH = PASS
README_BLOB = FROZEN
DOCUMENTED_COMMAND = EXACTLY_REPOSITORY_LOCAL_HELP_PATH
PACKAGE_PRIVATE_UNPUBLISHED_TRUTH = PRESERVED
NO_GLOBAL_INSTALL_RELEASE_PUBLICATION_CLAIM = PASS
NO_UNAUTHORIZED_COMMAND_PROVIDER_WRITE_VERIFICATION_EXAMPLES = PASS
HISTORICAL_AUTHORIZATION_EVIDENCE_RUNTIME_RECORDS = UNCHANGED
P8_R4_FIRST_LOCAL_FAILURE_PRESERVED = YES
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
REQUIRED_EXTERNAL_SEMANTIC_REVIEW_COUNT = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

---

## 9. Candidate boundary

Until this exact one-path record qualifies, merges, and passes mandatory external post-merge proof:

```text
README_LOCAL_CLI_HELP_DOCUMENTATION_MUTATION = NOT_AUTHORIZED
OPERATIONAL_DOCS_EXAMPLES_MUTATION = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

After canonical activation, authority extends only to one later `README.md` documentation candidate with the exact bounded meaning above. That candidate must independently qualify, guarded-merge, and pass mandatory external post-merge proof before its own state may be considered canonically closed.

After that README implementation is externally closed canonical, the next action is fresh evidence-driven successor-authority analysis only.