# Kodac P8 — Current Product Legacy-Contamination Quarantine Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_PRODUCT_DOC_QUARANTINE_MUTATION_AUTHORITY UNTIL_MERGED_AND_POST_PROVEN**  
Date: 2026-09-09  
Decision owner: Kodac founder  
Waiver: **NO**

---

## 1. Canonical basis

```text
BASE_MAIN = 24ba233cc3cd38a6c740c486c8d8917553b9114d
BASE_TREE = 2ed91ad46b070d1dfebad70893799277605c604f
POST_AGENT_CONTRACT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #510 / proof 5603198241
POST_CLOSURE_SUCCESSOR_ANALYSIS = PR #510 / comment 5603275061 / ANALYSIS_ONLY
P8_MASTER_PLAN_CONCERN = OPERATIONAL_DOCUMENTATION_PRODUCT_SURFACE_TRUTH / RELEASE_VERSION_SEPARATION
WAIVER = NO
```

This candidate creates no product-document mutation authority while unproven. It exists only to authorize one later, documentation-only quarantine unit if this authorization independently qualifies, guarded-merges, and passes mandatory external post-merge proof.

---

## 2. Why this is the minimum preservation-safe successor

Current canonical Kodac truth is established by `README.md`, `docs/product/STATUS.md`, `docs/roadmap/NEXT.md`, the P8 canonical lineage, and the durable P8 master plan.

Fresh post-closure analysis found six current `docs/product/` siblings that retain materially different pre-Kodac/Kernux observability and telemetry product claims:

```text
docs/product/CUSTOMER_PERSONAS.md
docs/product/FEATURES.md
docs/product/ICP.md
docs/product/MVP_SCOPE.md
docs/product/PRICING.md
docs/product/PRODUCT.md
```

Observed legacy claims include production-AI trace ingestion, telemetry-volume pricing, cost/latency dashboards, API-key trace ingestion, and explicit `Kernux` product/ICP/persona statements. Those claims are not equivalent to current Kodac product truth and may misroute humans or coding agents that inspect the current `docs/product/` namespace.

This authorization deliberately does not rewrite, delete, relocate, reinterpret, or canonize the legacy bodies. The minimum preservation-safe action is to add an unmistakable warning at the top of each exact file while retaining the existing body for historical context.

This candidate deliberately avoids numbered `P8-R5` authority.

---

## 3. Conditional future implementation allowlist

Only after this authorization becomes `CLOSED_CANONICAL` may one later implementation candidate modify exactly these six paths:

```text
docs/product/CUSTOMER_PERSONAS.md
docs/product/FEATURES.md
docs/product/ICP.md
docs/product/MVP_SCOPE.md
docs/product/PRICING.md
docs/product/PRODUCT.md
```

No seventh path is authorized by this record.

The later implementation must be documentation-only and must not modify `README.md`, `docs/product/STATUS.md`, `docs/product/AGENT_INTEGRATION_CONTRACT.md`, roadmap/current-view files, source, runtime, tests, schemas, package metadata, workflows, dependencies, lockfiles, providers/models, provenance, historical authorization/evidence records, or rulesets.

---

## 4. Exact future mutation admitted

For each exact authorized file, the later implementation may add one standardized top-level warning block before the existing legacy body.

The warning must communicate all of the following without asserting new product behavior:

```text
LEGACY_CURRENT_SURFACE = YES
CURRENT_KODAC_PRODUCT_TRUTH = NOT_DEFINED_BY_THIS_LEGACY_BODY
LEGACY_PRE_KODAC_KERNUX_MATERIAL = RETAINED_FOR_HISTORICAL_CONTEXT_ONLY
DO_NOT_USE_FOR_CURRENT_KODAC_PRODUCT_FEATURE_ICP_MVP_PRICING_ROADMAP_RELEASE_OR_AUTHORITY_TRUTH = YES
CURRENT_TRUTH_POINTERS = README.md | docs/product/STATUS.md | docs/roadmap/NEXT.md | docs/planning/KODAC_INTELLIGENCE_IMPROVEMENT_MASTER_PLAN_2026-08-26.md
IMPLEMENTATION_AUTHORITY_FROM_THIS_DOCUMENT = NONE
```

The existing body after the warning must remain byte-for-byte unchanged for this bounded quarantine unit.

No replacement product thesis, feature map, persona, ICP, MVP scope, pricing model, commercial claim, release claim, or implementation plan may be invented in this unit.

---

## 5. Explicit non-grants

This authorization does **not** admit any of the following:

```text
LEGACY_BODY_REWRITE = NOT_AUTHORIZED
LEGACY_BODY_DELETION = NOT_AUTHORIZED
FILE_MOVE_OR_ARCHIVE_RELOCATION = NOT_AUTHORIZED
NEW_PRODUCT_FEATURE_CLAIMS = NOT_AUTHORIZED
NEW_PERSONA_ICP_MVP_PRICING_CLAIMS = NOT_AUTHORIZED
README_MUTATION = NOT_AUTHORIZED
STATUS_OR_AGENT_CONTRACT_MUTATION = NOT_AUTHORIZED
ROADMAP_CURRENT_VIEW_MUTATION = NOT_AUTHORIZED
SOURCE_RUNTIME_SCHEMA_TEST_WORKFLOW_MUTATION = NOT_AUTHORIZED
DEPENDENCY_OR_LOCKFILE_CHANGE = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_AUTHORITY_EXPANSION = NOT_AUTHORIZED
NETWORK_SECRET_FILESYSTEM_AUTHORITY_EXPANSION = NOT_AUTHORIZED
INSTALLATION_UPDATE_INTEGRITY_IMPLEMENTATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
MCP_EDITOR_DAEMON_SDK_INTEGRATION = NOT_AUTHORIZED
PACKAGE_NAME_VERSION_PUBLICATION_GLOBAL_INSTALLABILITY = NOT_AUTHORIZED
PUBLIC_RELEASE_DEPLOYMENT = NOT_AUTHORIZED
K2_K5_DONE_GATE_AUTHORITY_CHANGE = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
P8_R5_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P9 = NOT_AUTHORIZED_BY_IMPLICATION
PROJECT_COMPLETION = NOT_ESTABLISHED
RULESET_CHANGE_OR_BYPASS = NOT_AUTHORIZED
WAIVER = NO
```

Broader legacy `Kernux` references elsewhere in the repository are outside this authorization. Some are historical preservation records and must not be mass-rewritten by implication.

---

## 6. Required non-equivalences

The later quarantine must preserve at least these distinctions:

```text
LEGACY_DOCUMENT != CURRENT_KODAC_PRODUCT_TRUTH
HISTORICAL_RETENTION != CURRENT_PRODUCT_ENDORSEMENT
QUARANTINE_WARNING != BODY_REWRITE
QUARANTINE_WARNING != NEW_PRODUCT_SPECIFICATION
DOCUMENTATION_WARNING != IMPLEMENTATION_AUTHORITY
DOCUMENTATION_WARNING != PUBLIC_RELEASE
DOCUMENTATION_WARNING != PACKAGE_PUBLICATION
CURRENT_PRODUCT_SURFACE_CLEANUP != PROJECT_COMPLETION
CURRENT_PRODUCT_SURFACE_CLEANUP != P8_R5_PLUS_AUTHORITY
```

---

## 7. Qualification gates for this authorization candidate

Before this authorization may merge, one unchanged exact head must prove:

```text
BASE_MAIN == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
AUTHORIZATION_BLOB = FROZEN
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

A merged authorization is not canonical until external post-merge proof confirms canonical `main`, ordered parents, tree/blob identity, applicable post-merge checks, review-thread state, and ruleset state.

---

## 8. Closure rule

Only an external post-merge proof may later classify:

```text
P8_CURRENT_PRODUCT_LEGACY_CONTAMINATION_QUARANTINE_AUTHORIZATION = CLOSED_CANONICAL
```

Until then:

```text
CURRENT_PRODUCT_LEGACY_QUARANTINE_IMPLEMENTATION_AUTHORITY = NO
```

Even after closure, the resulting authority is limited to the six exact files and the standardized top-level warning-only mutation defined above. It creates no numbered successor, product-feature implementation, provider/model, integration, release, publication, deployment, commercial, or project-completion authority.