# Kodac Engineering Roadmap

## Authority

This file is a current roadmap view only. It does not create implementation, execution, dependency, provider/model, persistence, learning, benchmark, donor, successor, merge, release, or project-completion authority.

Live GitHub, root `AGENTS.md`, and exact canonical authorization/evidence records override this page.

---

## Program state

| Area | Current canonical state | Boundary |
| --- | --- | --- |
| K0 / K1 | **CLOSED** | Canonical foundation closed |
| K2 | **CLOSED / TRUSTED SIDE-EFFECT EXECUTION BOUNDARY** | Authority unchanged by P8 current-view work |
| K3 bounded R1-R6 | **CLOSED** | Bounded scope only |
| KRI-R1 through KRI-R4 | **CLOSED_CANONICAL** | Bounded review-intelligence scope |
| K4 bounded R1-R5 | **CLOSED_CANONICAL** | Bounded scope only |
| K5 bounded R1-R5 | **CLOSED_CANONICAL** | Existing Done Gate implementation/authority unchanged |
| K6 bounded closeout | **CLOSED_CANONICAL** | Bounded scope only |
| P2 bounded R1-R6 | **CLOSED_CANONICAL / OVERALL OPEN** | No P2 overall closure inferred |
| General / public KodacBench | **NOT_CLOSED** | No public benchmark closure inferred |
| P3 bounded R1-R17 | **CLOSED_CANONICAL / OVERALL OPEN** | Bounded engineering scope only |
| P4 bounded R1-R2 | **CLOSED_CANONICAL / OVERALL OPEN** | Bounded engineering scope only |
| P5 bounded R1-R2 | **CLOSED_CANONICAL / OVERALL NOT_CLOSED** | P5-R3+ not authorized |
| P6 bounded R1 | **CLOSED_CANONICAL / OVERALL NOT_CLOSED** | P6-R2+ not authorized by numbering |
| P7 bounded R1-R30 engineering scope | **CLOSED_CANONICAL** | PR #483 / proof `5590967916`; P7 overall remains not closed |
| P7 post-closeout current-view reconciliation | **CLOSED_CANONICAL** | PR #485 / proof `5591213559` |
| P8-R1 authorization | **CLOSED_CANONICAL** | PR #486 / proof `5591337213` |
| P8-R1 machine-readable CLI result envelope | **CLOSED_CANONICAL / BOUNDED PURE-DATA FOUNDATION** | PR #487 / merge `0e772d9636d0e721741e442aac56349488a3227b` / proof `5591781497` |
| P8-R1 post-merge current-view reconciliation authorization | **CLOSED_CANONICAL** | PR #488 / merge `2dbbd6f0ca40f9e43a4f08f7529b4d31ef138ef1` / proof `5591850887` |
| P8-R1 post-merge current-view reconciliation | **CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL** | Exact five-path documentation candidate only |
| P8 Product & Distribution Hardening | **NOT_CLOSED** | Bounded R1 closure is not stage closure |
| P8-R2+ | **NOT_AUTHORIZED_BY_NUMBERING** | Fresh authority required |
| Public release / package publication / deployment | **NOT_AUTHORIZED** | Separate authority required |
| Project | **COMPLETION NOT_ESTABLISHED** | No release/project closure inference |

All unrelated canonical program state remains unchanged by this candidate. Omission from this condensed roadmap is not authorization, waiver, supersession, proof, or narrowing.

---

## Canonical P7-to-P8 frontier

```text
P7_BOUNDED_R1_R30_ENGINEERING_SCOPE = CLOSED_CANONICAL / PR #483 / proof 5590967916
P7_POST_CLOSEOUT_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #485 / proof 5591213559
POST_P7_SUCCESSOR_ANALYSIS = PR #485 / comment 5591269488 / ANALYSIS_ONLY

P8_R1_AUTHORIZATION = CLOSED_CANONICAL / PR #486 / proof 5591337213
P8_R1_IMPLEMENTATION = CLOSED_CANONICAL / PR #487 / merge 0e772d9636d0e721741e442aac56349488a3227b / proof 5591781497
POST_P8_R1_SUCCESSOR_ANALYSIS = PR #487 / comment 5591792193 / ANALYSIS_ONLY
P8_R1_CURRENT_VIEW_RECONCILIATION_AUTHORIZATION = CLOSED_CANONICAL / PR #488 / merge 2dbbd6f0ca40f9e43a4f08f7529b4d31ef138ef1 / proof 5591850887
P8_R1_CURRENT_VIEW_RECONCILIATION = CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
P8_R2_PLUS = NOT_AUTHORIZED_BY_NUMBERING
P7_OVERALL = NOT_CLOSED
P8_PRODUCT_DISTRIBUTION_HARDENING = NOT_CLOSED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

Historical P7 R1-R30 authorization/evidence/repair/anomaly records remain canonical and unchanged. This current view does not flatten or rewrite that lineage.

---

## Active unit — P8-R1 post-merge current-view reconciliation

Authority is canonical only through PR #488 / proof `5591850887`.

The current candidate may modify exactly:

```text
docs/roadmap/NEXT.md
docs/roadmap/ROADMAP.md
docs/roadmap/MILESTONES.md
docs/roadmap/VERSION_PLAN.md
docs/product/STATUS.md
```

No sixth path is authorized.

The candidate may bind already-proven P7/P8-R1 state and its authorization chain, but must remain candidate-safe about its own reconciliation result until guarded merge plus mandatory external post-merge proof.

Qualification requires:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_5_AUTHORIZED_PATHS
NO_SIXTH_PATH = PASS
ALL_FIVE_BLOBS = FROZEN
HISTORICAL_AUTHORIZATION_EVIDENCE_RUNTIME_RECORDS = UNCHANGED
REQUIRED_CI = TERMINAL_SUCCESS_OR_CANONICALLY_PROVEN_NONAPPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
REQUIRED_EXTERNAL_SEMANTIC_REVIEW_COUNT = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
WAIVER = NO
```

---

## Bounded P8-R1 meaning

The canonical R1 contract is one versioned pure/data-only machine-readable CLI result envelope family:

```text
PROTOCOL = kodac.cli-result
VERSION = 1
COMMANDS = apply-patch | ask | solve
```

It preserves command/status/proven consistency, bounded evidence/payload data, fail-closed validation, resource limits, detached deep immutability, and runtime/schema agreement. It does not wire CLI output, alter exit codes, publish/export packages, invoke providers/models, grant network/secret/filesystem authority, expand K2/K5/Done Gate authority, or establish release/project completion.

Mandatory non-equivalences:

```text
P8_R1_IMPLEMENTATION_CLOSED != P8_PRODUCT_DISTRIBUTION_HARDENING_CLOSED
P8_R1_IMPLEMENTATION_CLOSED != P8_R2_PLUS_AUTHORITY
P8_R1_CURRENT_VIEW_RECONCILIATION != SUCCESSOR_AUTHORITY
P8_R1_CLI_RESULT_ENVELOPE != CLI_WIRING
P8_R1_CLI_RESULT_ENVELOPE != INDEPENDENT_PROOF
PROVEN_READY != MERGE_AUTHORITY
PROVEN_READY != RELEASE_AUTHORITY
PROVEN_READY != PROJECT_COMPLETION
EVIDENCE_BINDING != AUTHORITY_TRANSFER
```

---

## Preserved authority boundaries

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
FILESYSTEM_WRITE_AUTHORITY = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
CLI_WIRING = NOT_AUTHORIZED
CLI_EXIT_CODE_CHANGE = NOT_AUTHORIZED
PACKAGE_ROOT_EXPORT = NOT_AUTHORIZED
PACKAGE_RENAME_VERSION_PUBLICATION = NOT_AUTHORIZED
GITHUB_CI_PRODUCT_INTEGRATION = NOT_AUTHORIZED
P8_R2_PLUS = NOT_AUTHORIZED_BY_NUMBERING
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

After external post-merge proof of this reconciliation, derive the next roadmap frontier only through fresh evidence-driven successor-authority analysis. Do not infer P8-R2+, P9, release, publication, deployment, or project completion from numbering, plan sequence, bounded R1 closure, this reconciliation, or `PROVEN_READY`.