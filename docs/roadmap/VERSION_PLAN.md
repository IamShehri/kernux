# Kodac Version Plan

## Purpose

This is a current planning/status view. It does not create implementation, execution, dependency, provider/model, persistence, benchmark, successor, merge, release, or project-completion authority.

Live GitHub, root `AGENTS.md`, and exact canonical authorization/evidence records override this page.

---

## Current version frontier

```text
K0 / K1 = CLOSED
K2 = CLOSED / TRUSTED SIDE-EFFECT EXECUTION BOUNDARY
K3 BOUNDED R1-R6 = CLOSED
KRI-R1 THROUGH KRI-R4 = CLOSED_CANONICAL
K4 BOUNDED R1-R5 = CLOSED_CANONICAL
K5 BOUNDED R1-R5 = CLOSED_CANONICAL
K6 BOUNDED CLOSEOUT = CLOSED_CANONICAL

P2 BOUNDED R1-R6 = CLOSED_CANONICAL
P2 OVERALL = OPEN
GENERAL / PUBLIC KODACBENCH = NOT_CLOSED
P3 BOUNDED R1-R17 = CLOSED_CANONICAL
P3 OVERALL = OPEN
P4 BOUNDED R1-R2 = CLOSED_CANONICAL
P4 OVERALL = OPEN
P5 BOUNDED R1-R2 = CLOSED_CANONICAL
P5-R3+ = NOT_AUTHORIZED
P5 OVERALL = NOT_CLOSED
P6 BOUNDED R1 = CLOSED_CANONICAL
P6-R2+ = NOT_AUTHORIZED_BY_NUMBERING
P6 OVERALL = NOT_CLOSED

P7-R1 THROUGH P7-R30 = BOUNDED UNITS CLOSED_CANONICAL AT THEIR EXACT RECORDED STATES
P7-R29 POST-MERGE CURRENT-VIEW RECONCILIATION = CLOSED_CANONICAL / PR #477 / proof 5589809061
POST-R29 SUCCESSOR AUTHORITY ANALYSIS = PR #477 / comment 5589847062 / ANALYSIS_ONLY
P7-R30 DONE GATE PROOF-BINDING AUTHORIZATION = CLOSED_CANONICAL / PR #478 / proof 5589920210
P7-R30 DONE GATE PROOF-BINDING IMPLEMENTATION = CLOSED_CANONICAL / PR #479 / proof 5590242046 / P7_DONE_GATE_PROOF_BOUND_ONLY
P7-R30 DONE GATE STATUS BOUND = PROVEN_READY
P7-R30 CURRENT-VIEW DRIFT ANALYSIS = PR #479 / comment 5590255416 / ANALYSIS_ONLY
P7-R30 POST-MERGE CURRENT-VIEW RECONCILIATION AUTHORIZATION = CLOSED_CANONICAL / PR #480 / proof 5590298973
P7-R30 POST-MERGE CURRENT-VIEW RECONCILIATION = CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
POST-R30 SUCCESSOR AUTHORITY ANALYSIS = BLOCKED_UNTIL_RECONCILIATION_CLOSURE
P7 OVERALL = NOT_CLOSED
P8-P9 IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC RELEASE / PACKAGE PUBLICATION / DEPLOYMENT = NOT_AUTHORIZED
PROJECT COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

All still-effective predecessor non-grants remain in force. Omission from this condensed plan is not authorization, proof, waiver, supersession, or narrowing.

---

## Active planned unit

The only active version-plan mutation is the documentation-only P7-R30 current-view reconciliation authorized by PR #480 / proof `5590298973`.

Exact allowlist:

```text
docs/roadmap/NEXT.md
docs/roadmap/ROADMAP.md
docs/roadmap/MILESTONES.md
docs/roadmap/VERSION_PLAN.md
docs/product/STATUS.md
```

No sixth path is authorized. The candidate may reconcile only already-proven R29/R30 truth, must preserve unrelated state and predecessor non-grants, cannot certify its own closure, and cannot create P7 closeout or other successor authority.

---

## P7-R30 bounded implementation contract

```text
P7_DONE_GATE_PROOF_BOUND_ONLY = ESTABLISHED_BY_P7_R30_CONTRACT
DONE_GATE_STATUS_BOUND = PROVEN_READY
```

The contract semantically revalidates the complete canonical P7-R29 P7-to-K5 reconciliation lineage and the complete canonical P7-R6 post-apply verification-report lineage, requires exact repository/base/head convergence, and invokes only the existing unchanged `DoneGate.evaluate()` algorithm. It requires exact `PROVEN_READY`, empty reasons, and non-empty evidence and creates no second readiness algorithm.

Canonical implementation identities:

```text
P7_R30_QUALIFIED_HEAD = af73e24adfa3b45668711003bb5465effbc4c30a
P7_R30_QUALIFIED_HEAD_TREE = d9344cb15ac90b3db674ca19ae0216b0eda7e6bd
P7_R30_MERGE = acec886b7c3296c0c58409ef987e6ea85c63e14e
P7_R30_IMPLEMENTATION_PROOF = 5590242046
```

The output is bounded, deterministic, content-addressed, deeply immutable, data-only, and side-effect-free. The JSON Schema is structural interoperability only.

Post-merge evidence preserves one disclosed first-attempt Ubuntu failure in an unchanged pre-existing Linux-only H4-R3G-B synthetic-host fixture outside the R30 path set. The fixture blob remained `e58cbcd6f68a56ab9850a495f9b19c71ee279a95`. The qualified-head and merge trees were identical; pre-merge Ubuntu plus post-merge macOS/Windows passed. Exactly one no-code/no-tree-drift same-SHA controlled rerun passed Ubuntu typecheck, full tests, benchmark hook, and final `k2-runtime-gate`. The first failure is not rewritten as first-attempt green and `WAIVER = NO`.

---

## R30 reconciliation authorization identity

```text
AUTHORIZATION_PR = 480
AUTHORIZATION_MERGE = 0b470cc17f6921a86b996330bad39875b328423b
AUTHORIZATION_CLOSURE_PROOF = 5590298973
AUTHORIZATION_SCOPE = EXACTLY_FIVE_CURRENT_VIEW_PATHS
SUCCESSOR_IMPLEMENTATION_AUTHORITY = NONE
```

---

## Current non-equivalences

```text
P7_DONE_GATE_PROOF_BOUND_ONLY != MERGE_AUTHORITY
P7_DONE_GATE_PROOF_BOUND_ONLY != APPROVAL
P7_DONE_GATE_PROOF_BOUND_ONLY != RELEASE_AUTHORITY
P7_DONE_GATE_PROOF_BOUND_ONLY != PACKAGE_PUBLICATION_AUTHORITY
P7_DONE_GATE_PROOF_BOUND_ONLY != DEPLOYMENT_AUTHORITY
P7_DONE_GATE_PROOF_BOUND_ONLY != PROJECT_COMPLETION
PROVEN_READY != MERGE_AUTHORITY
PROVEN_READY != RELEASE_AUTHORITY
PROVEN_READY != PROJECT_COMPLETION
P7_TO_K5_RECONCILIATION_EVIDENCE_BOUND_ONLY != PROVEN_READY
K5_R1_SUFFICIENT_PACKAGE != PROVEN_READY
K5_R4_NOT_APPLICABLE != PROVEN_READY
JSON_SCHEMA_ACCEPTANCE != PROVEN_READY
EVIDENCE_BINDING != AUTHORITY_TRANSFER
P7_R30_CLOSED != P7_OVERALL_CLOSED
P7_R30_CLOSED != P8_P9_AUTHORITY
P7_R30_CLOSED != RELEASE_AUTHORITY
P7_R30_CLOSED != PROJECT_COMPLETION
```

---

## Preserved global authority boundaries

```text
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_EXISTING_R1_R5_CONTRACTS = UNCHANGED
DONE_GATE_IMPLEMENTATION = UNCHANGED
DONE_GATE_ALGORITHM = UNCHANGED
PROOFGRAPH = NOT_AUTHORIZED
AUTOMATIC_FRESHNESS_DEPENDENCY_INVALIDATION = NOT_AUTHORIZED
PATCH_RETRY = NOT_AUTHORIZED
AUTOFIX_REMEDIATION_EXECUTION = NOT_AUTHORIZED
SKILL_TRUST_QUALIFICATION = NOT_AUTHORIZED
SKILL_INSTALLATION_ACTIVATION_ROUTING_EXECUTION = NOT_AUTHORIZED
CAPABILITY_APPROVAL = NOT_AUTHORIZED
VERIFICATION_EXECUTION = NOT_AUTHORIZED
LIVE_REVIEWER_PROVIDER_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_TOOL_INVOCATION = NOT_AUTHORIZED
PROVIDER_RETRY_REPLAY_RESUME = NOT_AUTHORIZED
PROVIDER_SPEND = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
DONE_GATE_PROOF = ESTABLISHED_ONLY_AT_BOUNDED_P7_R30_PROOF_BINDING_MEANING
DONE_GATE_INVOCATION_OR_MUTATION = NOT_AUTHORIZED_BEYOND_CANONICAL_R30_BINDING
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

After the active reconciliation closes canonically, perform a fresh successor-authority analysis from the resulting live `main`. A future P7 closeout or downstream unit requires its own explicit canonical authorization; numbering, plan sequence, and `PROVEN_READY` are not authority.
