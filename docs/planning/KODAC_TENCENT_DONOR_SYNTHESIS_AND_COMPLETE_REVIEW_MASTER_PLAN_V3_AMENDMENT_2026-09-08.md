# Kodac Tencent Donor Synthesis and Complete Review Master Plan V3 Amendment

## Record identity

```text
DOCUMENT_CLASS = FOUNDER-DIRECTED DOCUMENTATION / MASTER PLANNING AMENDMENT CANDIDATE
STATUS = PLANNING_AMENDMENT_CANDIDATE / NOT_CANONICAL
DATE = 2026-09-08
DECISION_OWNER = KODAC FOUNDER
CANONICAL_BASE_AT_CREATION = 5e5ae05a231b5059e9b4f6c0d5934a9df6b8495d
CANONICAL_BASE_TREE_AT_CREATION = db684ad042d192a17f3dd217d3a320ebb709f481
P7_R22_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #447 / proof 5575697294
SOURCE_STUDY_ANALYSIS = PR #447 / comment 5575751076 / ANALYSIS_ONLY
FOUNDER_ASSERTED_SOURCE_REUSE_PERMISSION = PROVIDED
FOUNDER_ASSERTED_SOURCE_REUSE_PERMISSION_VERIFICATION = NOT_INDEPENDENTLY_VERIFIED BY THIS RECORD
SOURCE_REUSE_RIGHTS_BARRIER = NOT_TREATED_AS A BLOCKER FOR FUTURE SEPARATELY AUTHORIZED INTAKE
GENERAL_SOURCE_IMPORT_AUTHORITY = NONE
DEPENDENCY_ADMISSION = NONE
PROVIDER_ADMISSION = NONE
NETWORK_AUTHORITY = NONE
SECRET_AUTHORITY = NONE
IMPLEMENTATION_AUTHORITY = NONE
P7_SUCCESSOR_AUTHORITY = NONE
P8_P9_AUTHORITY = NONE
RELEASE_AUTHORITY = NONE
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

This amendment is additive. It supplements and sharpens, without rewriting historical truth in:

```text
docs/planning/KODAC_OPENREVIEW_SELECTIVE_SOURCE_ADOPTION_AND_DURABLE_REVIEW_ORCHESTRATION_MASTER_PLAN_V2_AMENDMENT_2026-09-07.md
docs/planning/KODAC_DURABLE_REVIEW_ORCHESTRATION_AND_SKILL_TRUST_MASTER_PLAN_AMENDMENT_2026-09-06.md
docs/planning/KODAC_INTELLIGENCE_IMPROVEMENT_MASTER_PLAN_2026-08-26.md
docs/planning/KODAC_TRUST_AND_VERIFICATION_MASTER_PLAN_V2_AMENDMENT_2026-09-02.md
docs/research/KODAC_FINAL_GAP_AND_IMPROVEMENT_REVIEW_2026-08-26.md
provenance/upstreams.yaml
```

Historical authorizations, implementation evidence, post-merge proofs, ADRs, reviews, current-view reconciliations and protected-main truth remain authoritative according to their exact scope.

This document is planning direction only. It does not authorize a numbered successor merely because the plan describes one.

---

## 1. Executive decision

Three Tencent repositories provide unusually complementary donor value for Kodac:

```text
Tencent/AI-Infra-Guard
-> SECURITY / RISK / SKILL SCAN EVIDENCE

Tencent/LoopForge
-> DURABLE / RESUMABLE DELIVERY ORCHESTRATION

Tencent/SkillHone
-> SKILL EVALUATION / EVOLUTION / PERSISTENT DECISION HISTORY
```

The correct strategy is **selective source and pattern adoption into Kodac-owned trust contracts**, not a wholesale merge of the three runtimes.

```text
TENCENT_DONOR_PORTFOLIO_FIT = HIGH
WHOLESALE_REPOSITORY_COPY = REJECTED AS ARCHITECTURAL STRATEGY
SELECTIVE_COPY = FUTURE CANDIDATE INPUT
SELECTIVE_DERIVATION = FUTURE CANDIDATE INPUT
KODAC_NATIVE_REIMPLEMENTATION = PREFERRED WHEN TRUST SEMANTICS DIFFER OR LANGUAGE/BOUNDARY FIT IS BETTER
DONOR_RUNTIME_AS_TRUST_ROOT = REJECTED
DONOR_LLM_VERDICT_AS_TRUTH = REJECTED
DONOR_WORKFLOW_STATE_AS_AUTHORITY = REJECTED
DONOR_SKILL_OPTIMIZER_AS_PROMOTION_AUTHORITY = REJECTED
```

The source-reuse permission supplied by the founder is valuable: it removes a practical rights barrier to copying or deriving useful source. It does **not** remove the need for exact source identity, license/notice compliance, donor mapping, security transformation, behavioral qualification, scoped import authorization and canonical adoption.

The target architecture is:

```text
AI-INFRA-GUARD-CLASS SECURITY COVERAGE
+ LOOPFORGE-CLASS RESUMABLE DELIVERY
+ SKILLHONE-CLASS SKILL EVOLUTION
+ KODAC EVIDENCE IDENTITY
+ KODAC FAIL-CLOSED AUTHORITY
+ KODAC EXACT-HEAD / RULESET / REVIEW FRESHNESS
+ KODAC K2 SIDE-EFFECT BOUNDARY
+ KODAC K5 / DONE-GATE DISCIPLINE
```

Kodac remains the trust kernel. Donors accelerate implementation and product quality; they do not replace Kodac governance.

---

## 2. Reverified donor snapshots

All donor conclusions in this plan bind to the following exact public snapshots.

### 2.1 Tencent/LoopForge

```text
REPOSITORY = Tencent/LoopForge
DEFAULT_BRANCH = main
HEAD = 09c765286f549624dd95434e1e6ef2249657cbeb
TREE = 915215c2c19fb209c858c6290fa5f5e5fad06da1
ROOT_LICENSE = MIT
ROOT_LICENSE_BLOB = 3d01ea41d01fdd803fe769d71cdcafe086bc243a
README_BLOB = 36d22ead3b548c3cf2812fe478e17398d2614e7a
```

Pinned high-value surfaces:

```text
skills/devflow/scripts/workflow_state.py = 8a5733dcd975c27d8036bdac824e2106fc7ed567
skills/devflow/references/workflow-contract.md = 9b06563b4aa7fb57b9ad30f8bbafd496d8c75017
skills/devflow/tests/test_regressions.py = dee927a8082fc2c6de0692d53c3d87bfa92d096c
```

Observed strengths:

- explicit workflow stages and statuses;
- role-separated requirement/design/implementation/review/testing;
- artifact validation rather than accepting a diff alone;
- persistent workflow state and resumability;
- atomic state-file writes and backup behavior;
- task sizing and route selection;
- executor/team identity records;
- bounded helper roles;
- manual approval gates;
- retry/overflow behavior;
- regression tests for artifact contract quality.

Observed trust gap relative to Kodac:

- resume state is local workflow state, not authority evidence;
- state validation does not by itself reprove current Git subject head, current Kodac authorization, current ruleset or provider/toolchain identity;
- role separation is useful process structure but is not cryptographic or independent-review proof;
- stage artifacts are inspectable but are not automatically equivalent to Kodac content-addressed canonical evidence;
- workflow retry is not sufficient authority for side-effect retry.

### 2.2 Tencent/SkillHone

```text
REPOSITORY = Tencent/SkillHone
DEFAULT_BRANCH = main
HEAD = 7d565839fb4dc74f9c77f09ace660e1c0484e048
TREE = 708326f981ba4b65ca5f3f357066b256f8bcda9c
ROOT_LICENSE = MIT
ROOT_LICENSE_BLOB = 3c70e98339da04c92792e0afe906f684b1f14cd7
README_BLOB = 8c027d500bb2f29d7e39bfb6473e69c648787fa7
```

Pinned high-value surfaces:

```text
skills/skillhone/scripts/optim.py = 0e645622cae0998e64c80e63438bed33931163f4
skills/skillhone/scripts/eval.py = 018d37444b8684658fb4d337c0c351da977da11c
skills/skillhone/scripts/core/redaction.py = f83c86b11d18597fe7115184e592350fae9447e9
skills/skillhone/SKILL.md = 74df47d94d160fd61a90414bb2f8ffccb3b6f27b
```

Observed strengths:

- whole-skill optimization rather than prompt-string-only mutation;
- separate skill and evaluation repositories;
- held-out/probe-oriented evaluation flows;
- skill/seed/direct evaluation modes;
- persistent optimization history and per-run trajectory records;
- Git/PR-shaped decision history;
- regression-gated iterative improvement;
- reusable skill bundle structure (`SKILL.md`, `scripts/`, `references/`, assets);
- log-redaction helper;
- explicit iteration and patience controls.

Observed trust gaps relative to Kodac:

- optimization code may run an agent with `permission_mode="bypassPermissions"`;
- credentials/tokens are made available to the optimization environment and a Forgejo token is materialized into workspace configuration;
- redaction is valuable defense-in-depth but cannot make broad secret exposure equivalent to least privilege;
- optimization/evaluation roles are separated, but a skill candidate must never authorize its own promotion;
- eval split isolation must become a Kodac evidence contract, not only a filesystem/process convention;
- model-driven whole-folder rewrites need exact patch/manifest identity and K2-gated writes in Kodac;
- persistent trajectory/history needs tamper-evident identity, data classification and retention rules before becoming canonical evidence.

### 2.3 Tencent/AI-Infra-Guard

```text
REPOSITORY = Tencent/AI-Infra-Guard
DEFAULT_BRANCH = main
HEAD = e4e622af3ad2b8228ce82dd62b01415dd8ce2b9c
TREE = 19aca1c5f39358e59c80b0e4f282d69b048134d3
ROOT_LICENSE = Apache-2.0
ROOT_LICENSE_BLOB = 00c94292fbc75f2fa7fcbc3f482270b69ccee602
```

Pinned high-value surfaces:

```text
skill-scan/skill_scan/utils/pre_scan.py = 262807b8ec15ba8c67d839070e2b2f3d5271086f
skill-scan/skill_scan/utils/text_decoder.py = d01135924522f74087c9412e49a21a34574a4781
skill-scan/skill_scan/utils/sarif_formatter.py = f745989572b78acfcd5423015156d4a4aa9cd2d3
skill-scan/pytests/test_hidden_content.py = ccd8eae42e4a1480491053a3afb95dd31b3620f5
```

Observed strengths:

- explicit T01-T09 skill-risk taxonomy;
- deterministic pre-scan before model judgment;
- prompt-injection, credential access, remote execution, persistence and exfiltration indicators;
- bounded text decoding;
- non-UTF-8 and reversible-mojibake awareness;
- `.pyc`/bytecode visibility instead of silent exclusion;
- scanning of dependency/cache/build directories that may contain referenced payloads;
- reference cross-checks for hidden executable payloads;
- tests that prove hidden content does not become invisible;
- SARIF 2.1.0 projection with stable rule metadata and fingerprints.

Observed trust gaps relative to Kodac:

- regex pre-scan findings are signals, not verified findings;
- model scan output is a claim, not authority or completion truth;
- a fixed risk taxonomy needs versioned mapping into Kodac policy rather than becoming immutable by donor convention;
- unreadable/oversized/binary inputs need explicit coverage disposition instead of silently disappearing from completeness accounting;
- SARIF is an interoperability projection, not the canonical evidence source;
- direct adoption of the full A.I.G platform would import unrelated services, models, network surfaces and dependencies that Kodac does not need for the current frontier.

---

## 3. Donor disposition matrix

| Donor surface | Useful property | Kodac disposition | Required transformation |
| --- | --- | --- | --- |
| LoopForge `workflow_state.py` | durable state machine, route/stage identity, atomic state writes | ADAPT / DERIVE SELECTIVELY | replace local-state truth with content-addressed event/state evidence; bind subject head, authorization, ruleset, workflow definition, provider/toolchain and K2 authority before resume |
| LoopForge `workflow-contract.md` | explicit stages, approval gates, role split | PATTERN_ONLY | encode as Kodac contracts; user approval remains evidence, never broad authority |
| LoopForge regression tests | artifact-quality and workflow regression patterns | ADAPT TEST PATTERNS | add hostile state drift, authority drift, duplicate/retry and resume-freshness cases |
| SkillHone `optim.py` | iterative whole-skill optimization, history, run state | PATTERN_ONLY / SELECTIVE REIMPLEMENT | reject bypass permissions and ambient credentials; produce immutable proposals, not writes; promotion through normal Kodac authority |
| SkillHone `eval.py` | skill/seed/direct comparison and split-driven evaluation | ADAPT CONCEPT | bind exact dataset/split/skill identities; enforce held-out confidentiality and contamination evidence |
| SkillHone redaction | durable-log secret redaction | ADAPT DEFENSE-IN-DEPTH | typed secret classes + deny raw secret exposure; redaction cannot justify broad credential injection |
| SkillHone skill-folder model | whole-skill change surface | ADOPT CONCEPT | bind manifest/tree identity for `SKILL.md`, scripts, references and assets; candidate cannot self-authorize |
| AI-Infra-Guard `pre_scan.py` | deterministic security hints | DERIVE / REIMPLEMENT | typed structured findings; source/path/range identity; no string report as trust root; no scanner signal promoted directly to verified finding |
| AI-Infra-Guard `text_decoder.py` | bounded decoding / smuggling defense | DERIVE / REIMPLEMENT | deterministic supported-encoding policy; digest raw bytes and decoded representation; unknown decode is explicit coverage debt |
| AI-Infra-Guard hidden-content tests | bytecode/cache/build visibility | ADAPT TEST PATTERNS | define Kodac review universe including opaque/generated/hidden/dependency-referenced artifacts |
| AI-Infra-Guard T01-T09 | practical skill-risk taxonomy | ADAPT / VERSIONED MAP | map into Kodac-owned risk taxonomy with exact taxonomy version and applicability evidence |
| AI-Infra-Guard SARIF formatter | ecosystem interoperability | ADAPTER CANDIDATE | canonical Kodac finding IDs remain source of truth; SARIF is deterministic projection only |
| Full LoopForge runtime | turnkey delivery workflow | DO NOT IMPORT WHOLESALE | Kodac already has stronger authority/evidence semantics |
| Full SkillHone runtime | autonomous skill optimization | DO NOT IMPORT WHOLESALE | bypass/credential/promotion semantics conflict with Kodac trust boundary |
| Full AI-Infra-Guard platform | broad AI red-team platform | DO NOT IMPORT WHOLESALE FOR CURRENT FRONTIER | too much unrelated server/model/network/dependency surface |

---

## 4. Source-copy and provenance rule

Founder permission allows direct copying when a later bounded intake explicitly chooses it. Future copied or derived source must still have a machine-readable donor record containing at least:

```text
donorRepository
donorHead
donorTree
donorPath
donorBlob
donorLicense
donorNoticeRequirement
reuseBasis
adaptationClass = COPIED | DERIVED | REIMPLEMENTED | PATTERN_ONLY
kodacDestination
kodacDestinationBlob
semanticChanges
securityBoundaryChanges
dependencyChanges
providerNetworkSecretChanges
behavioralTestEvidence
exactHeadReviewEvidence
canonicalAdoptionEvidence
```

Rules:

1. repository-level permission does not become repository-level technical trust;
2. exact donor path/blob is required before copying or derivation;
3. MIT copyright/license notices remain where required;
4. Apache-2.0 attribution, NOTICE and modified-file obligations must be satisfied for AI-Infra-Guard-derived source;
5. copied source does not bypass Kodac type, schema, hostile-input or full-regression tests;
6. copied source entering a privileged lane must be transformed to Kodac fail-closed authority semantics first;
7. a later donor update is a new source identity and requires requalification before adoption;
8. no source permission grants dependency, network, provider, secret, persistence, telemetry, release or side-effect authority by implication.

---

## 5. What the existing plan still misses or underspecifies

The OpenReview V2 plan already identified G1-G27, including the crucial G11 distinction:

```text
ZERO_FINDINGS != COMPLETE_REVIEW
```

The three Tencent donors expose additional or sharper gaps. These are labeled `T-GAP-*` to avoid rewriting historical G-numbering.

### T-GAP-01 — The review coverage universe is not a first-class object

Before claiming `reviewedPaths`, Kodac needs a canonical universe of what *could* require review.

The universe must distinguish at least:

```text
changed text files
changed binary files
renames / copies / deletions
file-mode changes
symlinks
submodules
Git LFS pointers
generated artifacts
ignored files that are nevertheless referenced
bytecode / compiled payloads
dependency/cache/build payloads referenced by changed code
unreadable files
oversized files
unsupported encodings
case-only / Unicode-normalization collisions
```

A file skipped by the model is not automatically outside the review universe.

### T-GAP-02 — `unreviewed` needs reason and risk, not only a path list

Every unreviewed item should carry a deterministic disposition such as:

```text
NOT_APPLICABLE
OPAQUE_BINARY
UNREADABLE
SIZE_LIMIT
UNSUPPORTED_ENCODING
BUDGET_EXHAUSTED
PROVIDER_TRUNCATION
POLICY_EXCLUDED
REQUIRES_SPECIALIZED_SKILL
REQUIRES_SANDBOX
UNKNOWN
```

`UNKNOWN` is not compatible with full-review completeness.

### T-GAP-03 — Risk taxonomy needs versioned ownership

AI-Infra-Guard T01-T09 is useful but external. Kodac should bind:

```text
riskTaxonomyIdentity
riskTaxonomyVersion
externalMappingIdentity
applicableRiskSet
coveredRiskSet
uncoveredRiskSet
coverageMethod
```

A taxonomy update must not silently change the meaning of an old review proof.

### T-GAP-04 — Scanner signal, reviewer claim and verified finding must be separate types

Required invariant:

```text
STATIC_PATTERN_SIGNAL != REVIEWER_FINDING
REVIEWER_FINDING != VERIFIED_FINDING
SCANNER_PASS != COMPLETE_REVIEW
```

Deterministic scanners can raise evidence-backed signals. They do not adjudicate policy or prove absence of all risk.

### T-GAP-05 — Hidden, compiled and generated content must remain visible in completeness accounting

AI-Infra-Guard demonstrates a real bypass class: bytecode or referenced content in cache/build/dependency directories can be executable while invisible to a naive source-only reviewer.

Kodac should fail closed on invisible executable surface, not classify it as empty or clean.

### T-GAP-06 — Encoding is part of evidence identity

Raw bytes, detected/accepted encoding, normalized text and any recovered alternate representation should be separately bound. A recovered mojibake view must not overwrite the identity of the original bytes.

### T-GAP-07 — SARIF interoperability must not become canonical truth

Kodac should support SARIF later, but canonical finding identity should be Kodac-owned and projection-safe.

```text
KODAC_EVIDENCE -> SARIF = ALLOWED ADAPTER DIRECTION
SARIF -> CANONICAL_TRUTH = NOT BY IMPLICATION
```

### T-GAP-08 — Skill applicability and skill admission are different

A review may need a security skill, language skill, framework skill or domain skill. Coverage must distinguish:

```text
applicableSkillSet
admittedSkillSet
loadedSkillSet
executedSkillSet
unavailableSkillSet
```

A relevant but unavailable/unadmitted skill creates explicit coverage debt.

### T-GAP-09 — Whole-skill identity must cover the full folder

SkillHone correctly treats a skill as more than `SKILL.md`. Kodac should bind the full admitted skill tree, including scripts/references/assets that can change behavior.

```text
SKILL_MD_IDENTITY_ONLY != SKILL_IDENTITY
```

### T-GAP-10 — Skill evolution needs an evaluation-leakage firewall

Held-out probes, labels and evaluation policies must not leak into the candidate skill instructions or helpers.

Required future evidence:

```text
evalDatasetIdentity
splitIdentity
splitRole = TRAIN | PROBE | HOLDOUT
candidateSkillIdentity
executorIdentity
accessPolicyIdentity
contaminationCheckIdentity
```

A score improvement after leakage is not valid learning evidence.

### T-GAP-11 — A skill candidate cannot authorize its own promotion

Autonomous optimization may propose a whole-folder patch. Promotion requires independent policy and evidence.

```text
SKILL_IMPROVED != SKILL_ADMITTED
SKILL_EVAL_PASS != SKILL_PROMOTION_AUTHORITY
SKILL_PR_MERGED != SIDE_EFFECT_AUTHORITY
```

### T-GAP-12 — Persistent decision history needs tamper-evident identity

SkillHone's history/trajectory pattern is valuable. Kodac should content-address each decision tuple and link it to predecessor state rather than trusting append-only local text by convention.

Target decision tuple:

```text
diagnosisEvidenceIdentity
candidateRevisionIdentity
evaluationPolicyIdentity
evaluationEvidenceIdentity
outcome
decisionActorOrPolicyIdentity
predecessorDecisionIdentity
```

### T-GAP-13 — Role separation is not enough to prove independent review

LoopForge separates implementation/review/testing roles. Kodac should additionally bind reviewer identity/configuration/context and prohibit stale or self-derived evidence from masquerading as independence.

### T-GAP-14 — Resume must revalidate authority, not only state shape

Before resuming any durable workflow, revalidate:

```text
subjectHead
canonicalBase
authorizationIdentity
rulesetIdentity
workflowDefinitionIdentity
reviewPolicyIdentity
skillManifestIdentity
providerModelIdentity
toolchainIdentity
executionEnvironmentIdentity
relevantEvidenceFreshness
```

If any authority-relevant identity moved, resume becomes requalification or stop.

### T-GAP-15 — Durable stage artifacts need content identity and dependency lineage

A stage should not merely say `completed`. It should bind the exact input evidence and output evidence. Downstream stages consume identities, not mutable file names.

### T-GAP-16 — Retry budget and retry semantics must be stage-specific

LoopForge's retry/overflow approach is useful, but Kodac needs to distinguish:

```text
READ_RETRY
DETERMINISTIC_RECOMPUTE
NEW_INTELLIGENCE_ATTEMPT
PROVIDER_RETRY
SIDE_EFFECT_RETRY
```

Only the first categories may be broadly replay-safe. Side-effect retry remains separately authorized.

### T-GAP-17 — Credential redaction is not a substitute for credential minimization

SkillHone demonstrates useful redaction, but also demonstrates why Kodac needs capability-brokered credentials rather than broad environment injection.

```text
REDACTED_LOG != SECRET_NOT_EXPOSED
BYPASS_PERMISSION_MODE != KODAC AUTHORITY
```

### T-GAP-18 — Benchmark/evaluation drift needs lineage

If probe/holdout content, evaluator logic, scoring rubric or model changes, the new score is a new evidence context. Historical scores must not be compared as if the benchmark were unchanged.

### T-GAP-19 — Revert and rollback need first-class decision lineage

Skill evolution and workflow repair may regress. A revert should preserve why the candidate was reverted and which evaluation failed; history must not erase failed attempts.

### T-GAP-20 — Donor drift requires requalification

The pinned Tencent snapshots are stable planning inputs. Future upstream heads are not automatically equivalent. A donor update must be reviewed as a new source identity before code or semantics are promoted.

---

## 6. Refined complete-review evidence model

The immediate architectural priority after R22 is not durable orchestration or autonomous skill evolution. It is finishing the evidence required to distinguish a complete exact-head review from a zero-finding review.

Target composition:

```text
R20 EXACT-TARGET-HEAD REVIEW RUN
+ R21 POST-VERIFICATION TEMPORAL BINDING
+ R22 COMPLETE CURRENT CONTEXT BINDING
+ REVIEW COVERAGE UNIVERSE
+ CHANGED / REVIEWED / UNREVIEWED PATH DISPOSITION
+ RISK APPLICABILITY + COVERAGE
+ SKILL APPLICABILITY + COVERAGE
+ PROVIDER ATTEMPT / TERMINATION PROVENANCE
+ NO UNKNOWN COVERAGE DEBT
= CANDIDATE FULL EXACT-HEAD RE-REVIEW COMPLETENESS EVIDENCE
```

Even that composition is not `VERIFIED`, `FIXED`, K5 reconciliation or Done Gate by implication.

### 6.1 Review coverage universe target

A future immutable record should bind at least:

```text
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
reviewUniverseIdentity
reviewableTextPaths
opaqueBinaryPaths
generatedOrDerivedPaths
referencedHiddenPayloadPaths
unreadablePaths
unsupportedEncodingPaths
oversizedPaths
symlinkPaths
submodulePaths
lfsPointerPaths
policyExcludedPaths
```

### 6.2 Path coverage target

```text
reviewedPathSet
unreviewedPathSet
unreviewedReasonByPath
reviewMethodByPath
reviewEvidenceByPath
coverageBudgetIdentity
coverageCompletenessState
```

Required invariant:

```text
REVIEWED ∪ UNREVIEWED = REVIEW_UNIVERSE
REVIEWED ∩ UNREVIEWED = EMPTY
UNKNOWN_REASON_COUNT = 0 FOR COMPLETE STATUS
```

### 6.3 Risk coverage target

Adapt useful AI-Infra-Guard taxonomy concepts into a Kodac-owned versioned taxonomy.

```text
riskTaxonomyIdentity
riskApplicabilityEvidence
applicableRiskSet
coveredRiskSet
uncoveredRiskSet
staticSignalEvidenceIdentities
reviewerFindingEvidenceIdentities
riskCoverageState
```

The initial external mapping may include T01-T09, but the canonical Kodac taxonomy must remain separately versioned and extensible.

### 6.4 Skill coverage target

```text
skillPolicyIdentity
applicableSkillSet
admittedSkillSet
loadedSkillSet
executedSkillSet
unavailableOrRejectedSkillSet
skillCoverageState
exactLoadedSkillTreeIdentities
```

### 6.5 Provider termination target

A review is not complete merely because the provider returned some output.

Bind:

```text
providerIdentity
modelIdentity
attemptIdentity
promptPolicyIdentity
toolPolicyIdentity
startedAt
completedAt
terminationReason = COMPLETED | TOKEN_LIMIT | TOOL_LIMIT | TIMEOUT | CANCELLED | PROVIDER_ERROR | POLICY_STOP | BUDGET_EXHAUSTED | UNKNOWN
inputTokenOrBudgetEvidence
outputTruncationEvidence
toolCallCount
retryLineage
```

`UNKNOWN`, `TOKEN_LIMIT`, `TIMEOUT`, `BUDGET_EXHAUSTED` or material truncation cannot silently become complete review.

---

## 7. Prioritized dependency-ordered roadmap

This is a **planning sequence**, not implementation authorization.

### Track A — Finish P7 complete-review evidence first

#### Candidate A1 — Review Coverage Universe

Purpose:

- establish exact changed/reviewable/opaque/unreadable universe;
- make hidden/binary/encoding gaps visible;
- no scanner/model invocation required.

Primary donor input:

```text
AI-Infra-Guard hidden-content visibility + bounded decode patterns
```

Preferred reuse class:

```text
REIMPLEMENTED / DERIVED SMALL ALGORITHMS + TEST PATTERNS
```

#### Candidate A2 — Deterministic Security Pre-scan Evidence

Purpose:

- deterministic signals before model review;
- structured evidence, not prose hint;
- raw-byte/path/range/source identity;
- T01-T09 mapping is versioned external taxonomy input.

Primary donor input:

```text
AI-Infra-Guard pre_scan.py
AI-Infra-Guard text_decoder.py
AI-Infra-Guard hidden-content tests
```

No LLM is required for the deterministic layer.

#### Candidate A3 — Risk Coverage Evidence

Purpose:

- decide which risk classes apply;
- prove which applicable risks had deterministic and/or reviewer coverage;
- represent uncovered risk explicitly.

Primary donor input:

```text
AI-Infra-Guard T01-T09 taxonomy + SARIF rule metadata pattern
```

#### Candidate A4 — Skill Coverage Evidence

Purpose:

- identify relevant admitted review skills;
- bind exact whole-skill tree identity;
- prove loaded/executed/unavailable disposition.

Primary donor input:

```text
SkillHone whole-skill model
AI-Infra-Guard skill security taxonomy
OpenReview progressive skill disclosure pattern already studied by Kodac
```

#### Candidate A5 — Provider Attempt / Termination Evidence

Purpose:

- prove whether the review actually completed versus stopping by budget/time/provider/tool limits;
- bind provider/model/policy/tool surface.

Primary donor input:

```text
Kodac KRI/R20-R22 contracts
Tencent donors as failure-mode references only
```

#### Candidate A6 — Composite Full Exact-Head Review Completeness

Purpose:

- compose R20-R22 + A1-A5;
- require zero unknown coverage debt;
- emit a bounded completeness proof only.

Then, and only with separate authority:

```text
P7 -> K5 RECONCILIATION CANDIDATE
-> DONE GATE CANDIDATE
```

### Track B — Durable orchestration after evidence semantics are stable

#### Candidate B1 — Content-addressed Workflow Run / Stage Records

Primary donor:

```text
LoopForge workflow_state.py + workflow contract
```

Kodac transformation:

- immutable event lineage instead of mutable state as truth;
- current state is deterministic projection of events;
- each stage binds input/output evidence identities;
- no side effect from stage status alone.

#### Candidate B2 — Authority-aware Resume Gate

Before resume, compare every authority-relevant identity. Output:

```text
RESUME_ALLOWED
REQUALIFICATION_REQUIRED
CANCELLED
STALE
BLOCKED
```

#### Candidate B3 — Role-separated Delivery Evidence

Preserve LoopForge's requirement/design/implementation/review/test ergonomics, while binding exact actor/context/evidence identity and avoiding the claim that role labels alone prove independence.

#### Candidate B4 — Workflow Artifacts and Handoff UX

Adopt the good developer experience of inspectable requirement/design/change/review/test summaries, but make summaries projections over canonical evidence rather than independent truth sources.

### Track C — Safe skill evolution only after skill trust and Done Gate prerequisites exist

#### Candidate C1 — Skill Evaluation Split Contract

Primary donor:

```text
SkillHone eval/skill split and eval.py modes
```

Add dataset/split identity, access policy and contamination proof.

#### Candidate C2 — Whole-Skill Candidate Revision

A candidate revision may update:

```text
SKILL.md
scripts/
references/
assets/
```

but only through one immutable exact patch/tree proposal.

#### Candidate C3 — Persistent Decision History

Adapt SkillHone's decision-history concept into content-addressed Kodac evidence.

#### Candidate C4 — Regression / Holdout Promotion Gate

No candidate skill becomes admitted solely because an optimizer or evaluator says it improved.

#### Candidate C5 — Optional Skill Evolution Orchestrator

Only after C1-C4 and separate side-effect authority. It may propose PRs, but cannot bypass K2, review, protected-main or promotion policy.

---

## 8. Donor patterns explicitly rejected as Kodac defaults

The following may work in the donor projects but must not become Kodac defaults:

```text
GENERAL AGENT BASH = REJECT
AUTHENTICATED GENERAL GH SHELL = REJECT
BYPASS PERMISSIONS MODE = REJECT
AMBIENT WRITE TOKEN IN MODEL WORKSPACE = REJECT
RAW SECRET MATERIALIZATION FOR CONVENIENCE = REJECT
DIRECT AGENT COMMIT/PUSH = REJECT
SELF-APPROVING SKILL OPTIMIZATION = REJECT
SCANNER VERDICT AS CANONICAL TRUTH = REJECT
SILENT SKIP OF UNREADABLE/OPAQUE REVIEW SURFACE = REJECT
BLIND WORKFLOW RESUME = REJECT
WORKFLOW RETRY AS SIDE-EFFECT RETRY AUTHORITY = REJECT
LOCAL HISTORY FILE AS CANONICAL EVIDENCE = REJECT
WHOLE DONOR RUNTIME IMPORT FOR CURRENT P7 = REJECT
```

---

## 9. Adversarial test program introduced by this plan

Future implementations derived from this plan should include hostile coverage for at least:

### Review-universe attacks

- changed binary executable;
- `.pyc` with valid and invalid magic;
- source loading `.pyc` dynamically;
- payload under `.venv`, `node_modules`, `dist`, `build` or cache path referenced by changed code;
- symlink escape;
- submodule pointer movement;
- Git LFS pointer movement;
- case-only rename;
- Unicode-normalization collision;
- file-mode executable-bit change;
- oversized file;
- undecodable bytes;
- non-UTF-8 text;
- reversible mojibake / encoding smuggling;
- deleted path whose removal changes security behavior.

### Risk/skill coverage attacks

- applicable security risk omitted from `applicableRiskSet`;
- duplicate/colliding risk identifiers;
- taxonomy version drift after review;
- candidate skill shadows an admitted skill by case/Unicode/alias;
- helper script changes while `SKILL.md` is unchanged;
- relevant admitted skill unavailable at runtime;
- candidate skill asks for a new tool/capability and attempts to treat that request as granted.

### Provider completeness attacks

- provider timeout after partial output;
- token limit after only part of the diff;
- tool-call limit;
- budget exhaustion;
- output truncation;
- provider error after emitting preliminary findings;
- retry under different provider/model;
- same review-run identifier reused with different configuration.

### Durable workflow attacks

- subject head moves during pause;
- ruleset changes during pause;
- authorization changes during pause;
- skill manifest changes during pause;
- provider/model changes during pause;
- stage output modified after completion;
- replayed stage completion event;
- duplicated side-effect retry;
- corrupted/truncated state projection;
- stale Team/executor identity reuse.

### Skill-evolution attacks

- holdout/probe text copied into candidate skill;
- evaluator labels leaked into helper scripts;
- optimizer receives write credential it does not need;
- improvement measured against changed evaluator without version binding;
- candidate improves probe score but regresses holdout;
- reverted candidate disappears from history;
- optimizer proposes script that fetches mutable remote code;
- optimizer proposes persistence/privilege capability outside skill policy.

---

## 10. Evidence and schema families to add eventually

Future schema names are illustrative planning targets only:

```text
ReviewCoverageUniverseRecord
PathReviewCoverageRecord
DeterministicSecuritySignalRecord
RiskTaxonomyRecord
RiskCoverageEvidenceRecord
SkillApplicabilityRecord
SkillCoverageEvidenceRecord
ProviderAttemptTerminationRecord
CompleteExactHeadReviewEvidenceRecord
DurableWorkflowRunRecord
DurableWorkflowStageRecord
WorkflowResumeDecisionRecord
SkillCandidateRevisionRecord
SkillEvaluationRunRecord
SkillEvolutionDecisionRecord
DonorSourceMapRecord
```

Common requirements:

- closed objects / reject unknown fields where practical;
- canonical deterministic serialization;
- content-addressed identity;
- exact repository/base/head/tree binding where repository-specific;
- bounded counts/sizes/depth;
- explicit unknown/unavailable states;
- hostile Proxy/accessor/symbol/alias/cycle rejection for JavaScript/TypeScript trust-boundary inputs;
- immutable outputs;
- no raw secret values;
- no raw private context text unless separately required and authorized;
- no authority implied by evidence existence.

---

## 11. Product-level improvement from the three donors

The engineering work should eventually surface as a developer experience stronger than any donor individually.

Target Kodac UX:

```text
REQUEST
-> KODAC EXPLAINS SCOPE + ACCEPTANCE
-> REVIEW UNIVERSE IS SHOWN
-> RISK / SKILL COVERAGE IS SHOWN
-> REVIEW RUN IS RESUMABLE BUT REVALIDATED
-> FINDINGS / ZERO-FINDING STATE ARE SEPARATE FROM COMPLETENESS
-> TEST / VERIFICATION EVIDENCE IS INSPECTABLE
-> EVERY PROPOSAL HAS EXACT IDENTITY
-> EVERY SIDE EFFECT IS SEPARATELY AUTHORIZED
-> INTERRUPTED WORK RESUMES FROM VERIFIED STATE
-> SKILLS IMPROVE THROUGH HELD-OUT EVAL WITHOUT SELF-PROMOTION
-> DONE MEANS DONE-GATE PROOF, NOT AGENT CONFIDENCE
```

This combines:

- LoopForge-class usability;
- SkillHone-class improvement loops;
- AI-Infra-Guard-class security visibility;
- Kodac-class trust semantics.

---

## 12. Performance and scope controls

Deep trust must not make routine review unusably expensive.

Future implementations should support progressive layers:

```text
L0 = deterministic repository/path universe
L1 = deterministic pre-scan / structural risk signals
L2 = context + skill applicability
L3 = provider review
L4 = specialist risk/skill review only where applicable
L5 = verification / K5 / Done Gate where required
```

Cache only content-addressed, policy-compatible results. Any cache key must include all authority-relevant identities.

A small safe change should not automatically invoke every scanner, skill, model or sandbox. Applicability evidence must drive deeper work.

---

## 13. Import/adoption workflow for the Tencent donors

Before the first code copy from any of these sources, execute a separately authorized source-admission unit that:

1. adds exact donor repository/head/tree/license metadata to Kodac provenance;
2. pins each proposed donor path/blob;
3. records `COPIED`, `DERIVED`, `REIMPLEMENTED` or `PATTERN_ONLY` disposition;
4. records license/NOTICE obligations;
5. identifies transitive dependencies and rejects unnecessary dependency import;
6. performs semantic/security differential review;
7. defines a narrow destination allowlist;
8. creates donor-specific behavioral/adversarial tests;
9. qualifies the exact candidate head under normal protected-main rules;
10. merges guarded with expected-head protection;
11. proves post-merge canonical identity;
12. reconciles current views only when the implementation actually changes current project truth.

The plan deliberately does **not** add Tencent repositories to `provenance/upstreams.yaml` itself. That mutation should occur in a dedicated, scoped source-admission record so discovery metadata cannot be mistaken for code-import authority.

---

## 14. Recommended first donor-backed successor direction after this plan

The first source-backed engineering direction should be the smallest unit that closes an actual R22 gap without importing a new runtime:

```text
REVIEW COVERAGE UNIVERSE
+ DETERMINISTIC HIDDEN / OPAQUE / ENCODING VISIBILITY
```

Why first:

1. it is prerequisite to claiming reviewed/unreviewed path coverage;
2. it can be deterministic and provider-free;
3. it directly benefits from AI-Infra-Guard's strongest tested ideas;
4. it exposes previously invisible review debt before adding more intelligence;
5. it avoids network, model, secret, persistence and side-effect expansion;
6. it creates the substrate for later risk and skill coverage.

Preferred implementation strategy:

```text
KODAC-NATIVE TYPESCRIPT CONTRACT
+ SELECTIVELY DERIVED AI-INFRA-GUARD DETECTION/TEST SEMANTICS
+ EXACT DONOR MAP
+ NO NEW PYTHON RUNTIME DEPENDENCY
+ NO A.I.G SERVER DEPENDENCY
+ NO MODEL INVOCATION
```

This recommendation is **not** implementation authority. A later exact authorization must define paths, predecessor blobs, donor blobs, semantics, tests and non-grants.

---

## 15. Later donor-backed directions

After complete-review evidence is stable:

### LoopForge adoption target

Use LoopForge as the primary donor for:

- workflow state-machine ergonomics;
- artifacts and handoff;
- stage routing;
- interruption/resume experience;
- review/test role separation;
- task-size routing.

Do not import its state as authority truth. Rebuild it over Kodac evidence identities and revalidation.

### SkillHone adoption target

Use SkillHone as the primary donor for:

- whole-skill revision scope;
- skill/seed/direct evaluation comparisons;
- persistent decision history;
- regression/held-out promotion gates;
- iterative improvement with patience/budget;
- skill repo/eval repo separation.

Do not import bypass permissions, ambient secrets or self-promotion semantics.

### AI-Infra-Guard adoption target

Use AI-Infra-Guard as the primary donor for:

- deterministic skill pre-scan semantics;
- hidden/compiled content visibility;
- bounded decoding and encoding-smuggling defense;
- T01-T09 external risk mapping;
- SARIF projection;
- adversarial scanner fixtures.

Do not import its LLM verdict as canonical truth or the full red-team platform into the P7 trust core.

---

## 16. Completion criteria for this planning direction

This planning direction is considered fully realized only when future canonical evidence establishes, in dependency order:

```text
1. donor provenance/admission records for selected source paths
2. review coverage universe evidence
3. changed/reviewed/unreviewed path coverage evidence
4. deterministic security signal evidence
5. risk applicability + coverage evidence
6. skill applicability + coverage evidence
7. provider attempt/termination provenance
8. bounded full exact-head review completeness proof
9. separately authorized P7 -> K5 reconciliation
10. separately authorized Done Gate proof
11. durable authority-aware orchestration where product scope requires it
12. safe held-out skill evolution where product scope requires it
```

No item may be inferred from a donor's feature list, benchmark result, model claim or successful demo.

---

## 17. Mandatory non-equivalences

```text
FOUNDER_SOURCE_PERMISSION != CANONICAL_SOURCE_ADMISSION
OPEN_SOURCE_LICENSE != KODAC TRUST
SOURCE_COPY_ALLOWED != SOURCE_COPY_AUTHORIZED_FOR_THIS UNIT
DONOR_TEST_PASS != KODAC QUALIFICATION
AI_INFRA_GUARD_SCAN_PASS != COMPLETE_REVIEW
AI_INFRA_GUARD_SIGNAL != VERIFIED_FINDING
LOOPFORGE_STAGE_COMPLETED != KODAC EVIDENCE FRESH
LOOPFORGE_RESUMABLE != AUTHORITY_VALID
SKILLHONE_EVAL_PASS != SKILL_ADMITTED
SKILLHONE_OPTIMIZATION != PROMOTION AUTHORITY
REDACTED_LOG != SECRET NOT EXPOSED
ROLE_SEPARATION != INDEPENDENT REVIEW PROOF
WHOLE_SKILL_PATCH != AUTHORIZED PATCH
SARIF_RESULT != CANONICAL EVIDENCE
ZERO_FINDINGS != COMPLETE_REVIEW
COMPLETE_CONTEXT != COMPLETE_REVIEW
COMPLETE_REVIEW != VERIFIED
COMPLETE_REVIEW != FIXED
COMPLETE_REVIEW != K5_RECONCILIATION
COMPLETE_REVIEW != DONE_GATE
THIS_PLAN != P7 SUCCESSOR AUTHORITY
THIS_PLAN != P8_P9 AUTHORITY
THIS_PLAN != RELEASE AUTHORITY
THIS_PLAN != PROJECT COMPLETION
WAIVER = NO
```

---

## 18. Canonical adoption gate for this amendment

This document may become a canonical planning amendment only after:

1. exact-head CI required by the live protected-main ruleset succeeds;
2. exact-head substantive semantic/security/governance review has no unresolved material finding;
3. changed paths remain exactly this one planning document;
4. canonical `main` remains the expected base or the candidate is forward-reconciled without destructive history rewrite;
5. review threads are resolved;
6. the live ruleset is reverified;
7. merge uses normal protected-main pull-request flow and expected-head guarding;
8. post-merge proof establishes canonical `main`, ordered parents, tree/blob identity, valid signature and applicable post-merge checks.

Canonical adoption of this planning document still grants **no implementation or source-import authority**.

After canonicalization, perform fresh successor-authority analysis from resulting live `main`. Do not infer a numbered implementation unit from this plan alone.
