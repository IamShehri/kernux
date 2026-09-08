# Kodac Engineering Roadmap

## Authority

This file is a current roadmap view only. It does not create implementation, execution, dependency, provider/model, persistence, learning, benchmark, donor, successor, merge, release, or project-completion authority.

Live GitHub, root `AGENTS.md`, and exact canonical authorization/evidence records override this page.

---

## Program state

| Area | Current canonical state | Boundary |
| --- | --- | --- |
| K0 / K1 | **CLOSED** | Canonical foundation closed |
| K2 | **CLOSED / TRUSTED SIDE-EFFECT EXECUTION BOUNDARY** | Authority unchanged by P7 current-view work |
| K3 bounded R1-R6 | **CLOSED** | Bounded scope only |
| KRI-R1 through KRI-R4 | **CLOSED_CANONICAL** | Bounded review-intelligence scope |
| K4 bounded R1-R5 | **CLOSED_CANONICAL** | Bounded scope only |
| K5 bounded R1-R5 | **CLOSED_CANONICAL** | Existing Done Gate authority unchanged |
| K6 bounded closeout | **CLOSED_CANONICAL** | Bounded scope only |
| P2 bounded R1-R6 | **CLOSED_CANONICAL / OVERALL OPEN** | No P2 overall closure inferred |
| General / public KodacBench | **NOT_CLOSED** | No public benchmark closure inferred |
| P3 bounded R1-R17 | **CLOSED_CANONICAL / OVERALL OPEN** | Bounded engineering scope only |
| P4 bounded R1-R2 | **CLOSED_CANONICAL / OVERALL OPEN** | Bounded engineering scope only |
| P5 bounded R1-R2 | **CLOSED_CANONICAL / OVERALL NOT_CLOSED** | P5-R3+ not authorized |
| P6 bounded R1 | **CLOSED_CANONICAL / OVERALL NOT_CLOSED** | P6-R2+ not authorized by numbering |
| P7 | **OVERALL NOT_CLOSED** | R27 bounded implementation is closed; R27 current-view reconciliation is the active candidate |
| P8-P9 | **IMPLEMENTATION NOT_AUTHORIZED** | Planning direction only |
| Project | **COMPLETION NOT_ESTABLISHED** | No release/project closure inference |

All unrelated canonical program state remains unchanged by the P7-R27 reconciliation.

---

## Canonical P7 frontier

| Unit | State | Canonical evidence |
| --- | --- | --- |
| P7-R1 through P7-R26 bounded units | **CLOSED_CANONICAL AT EXACT RECORDED STATES** | Historical canonical records |
| P7-R26 post-merge current-view reconciliation | **CLOSED_CANONICAL** | PR #464 / proof `5586759046` |
| Post-R26 successor-authority analysis | **ANALYSIS_ONLY** | PR #464 / comment `5586846775` |
| P7-R27 provider attempt / termination evidence-binding authorization | **CLOSED_CANONICAL** | PR #465 / proof `5586957364` |
| P7-R27 feasibility analysis | **ANALYSIS_ONLY** | PR #465 / comment `5587003085` |
| P7-R27 authorization amendment | **CLOSED_CANONICAL** | PR #466 / proof `5587072276` |
| P7-R27 provider attempt / termination evidence-binding implementation | **CLOSED_CANONICAL / PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY** | PR #467 / proof `5587661329` |
| P7-R27 current-view drift analysis | **ANALYSIS_ONLY** | PR #467 / comment `5587697738` |
| P7-R27 post-merge current-view reconciliation authorization | **CLOSED_CANONICAL** | PR #468 / proof `5587840460` |
| P7-R27 post-merge current-view reconciliation | **CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL** | Exactly five authorized current-view paths |
| Post-R27 successor analysis | **BLOCKED UNTIL RECONCILIATION CLOSURE** | Fresh analysis only after complete post-merge proof |
| A6 or later implementation | **NOT_AUTHORIZED_BY_NUMBERING_OR_PLAN_COMPOSITION** | Planning dependency order is not implementation authority |
| P7 overall | **NOT_CLOSED** | Bounded R27 closure is not overall closure |
| P8-P9 | **IMPLEMENTATION NOT_AUTHORIZED** | No authority by sequence/composition |
| Project completion | **NOT_ESTABLISHED** | No release/project closure inference |

All still-effective predecessor P7 state and non-grants remain in force. Omission from this condensed table is not authorization, waiver, supersession, proof, or narrowing.

---

## Active unit — P7-R27 current-view reconciliation

Authorization is canonical only through PR #468 / proof `5587840460`.

The active candidate may modify exactly:

```text
docs/roadmap/NEXT.md
docs/roadmap/ROADMAP.md
docs/roadmap/MILESTONES.md
docs/roadmap/VERSION_PLAN.md
docs/product/STATUS.md
```

No sixth path is authorized. The candidate records already-proven R26/R27 truth only, preserves unrelated state and predecessor non-grants, and cannot certify its own closure.

Until guarded merge plus complete mandatory post-merge proof:

```text
P7_R27_RECONCILIATION = CURRENT_CANDIDATE / NOT_YET_CLOSED_CANONICAL
POST_R27_SUCCESSOR_ANALYSIS = BLOCKED_UNTIL_RECONCILIATION_CLOSURE
A6_OR_LATER_IMPLEMENTATION = NOT_AUTHORIZED_BY_NUMBERING_OR_PLAN_COMPOSITION
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

---

## P7-R27 bounded implementation identity and meaning

```text
QUALIFIED_HEAD = aa59fc3fcb266c9a17796577e9af01aefe0123e6
QUALIFIED_HEAD_TREE = 888ac7686d588c8290b1e9b88b4f8e665eae9b50
MERGE = a2115231473007940eb2334d920268e92b468c37
IMPLEMENTATION_PROOF = 5587661329
STATE = PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY
```

R27 is a deterministic evidence-binding contract. It validates exact canonical R22 review-context evidence and exact canonical R26 skill-coverage evidence, rejects cross-lineage repository/base/head mismatch, optionally validates P5-R1 provenance, and binds caller-supplied attempt/provider/model/configuration/policy identities plus bounded termination, budget, truncation, tool-call, retry-lineage, timestamp, and completion-debt evidence. It performs no provider/model/tool invocation, network access, secret access, retry/replay/resume, persistence, telemetry, K2/K5 mutation, or Done Gate mutation.

`COMPLETED` is caller-asserted only and requires a completion timestamp plus explicit `NOT_TRUNCATED`; every other termination reason remains `COMPLETION_DEBT`.

Mandatory non-equivalences:

```text
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != PROVIDER_INVOCATION_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != PROVIDER_AUTHENTICITY_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != TERMINATION_REASON_PROOF
PROVIDER_ATTEMPT_TERMINATION_EVIDENCE_BOUND_ONLY != EXTERNAL_CLOCK_AUTHENTICITY_PROOF
CALLER_ASSERTED_COMPLETED != VERIFIED_COMPLETE_REVIEW
OUTPUT_NOT_TRUNCATED_REFERENCE != VERIFIED_OUTPUT_COMPLETENESS
RETRY_LINEAGE_REFERENCE != RETRY_AUTHORITY
P5_PROVENANCE != PROVIDER_INVOCATION_PROOF
P7_R27_CLOSED != K5_RECONCILIATION_PROOF
P7_R27_CLOSED != DONE_GATE_PROOF
P7_R27_CLOSED != P7_OVERALL_CLOSED
P7_R27_CLOSED != RELEASE_AUTHORITY
P7_R27_CLOSED != PROJECT_COMPLETION
```

---

## Preserved authority boundaries

```text
K2_SIDE_EFFECT_AUTHORITY = UNCHANGED
K5_DONE_GATE_AUTHORITY = UNCHANGED
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
RISK_COVERAGE_PROOF = NOT_ESTABLISHED
SKILL_COVERAGE_PROOF = NOT_ESTABLISHED
PROVIDER_TERMINATION_REASON_PROOF = NOT_ESTABLISHED
FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF = NOT_ESTABLISHED
P7_TO_K5_RECONCILIATION_PROOF = NOT_ESTABLISHED
DONE_GATE_INVOCATION_OR_MUTATION = NOT_AUTHORIZED
A6_OR_LATER_IMPLEMENTATION = NOT_AUTHORIZED_BY_NUMBERING_OR_PLAN_COMPOSITION
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

After this reconciliation closes canonically, derive the next roadmap frontier only from a fresh successor-authority analysis against live `main`.