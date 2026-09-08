# Kodac P7-R26 — Skill Coverage Evidence-binding Authorization Candidate

Status: **AUTHORIZATION_CANDIDATE / NOT_CANONICAL / NO_IMPLEMENTATION_AUTHORITY UNTIL MERGED AND POST-PROVEN**  
Date: 2026-09-08  
Decision owner: Kodac founder  
Waiver: **NO**

## 1. Canonical basis

```text
CANONICAL_MAIN_AT_CANDIDATE_START = 641101796ace785d8cc03418d0246f626e128ede
CANONICAL_MAIN_TREE_AT_CANDIDATE_START = 04028bf0b44a8ec539b14789edc3e152d56c84b7
TENCENT_DONOR_SYNTHESIS_AND_COMPLETE_REVIEW_MASTER_PLAN_V3 = CLOSED_CANONICAL / PLANNING_ONLY / PR #448 / proof 5575897235
A1_P7_R23_REVIEW_COVERAGE_UNIVERSE = CLOSED_CANONICAL / PR #450 / proof 5576403450 / REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY
A2_P7_R24_DETERMINISTIC_SECURITY_PRE_SCAN = CLOSED_CANONICAL / PR #454 / proof 5576882384 / DETERMINISTIC_SECURITY_PRE_SCAN_SIGNAL_BOUND_ONLY
A3_P7_R25_RISK_COVERAGE = CLOSED_CANONICAL / PR #458 / proof 5584759947 / RISK_COVERAGE_EVIDENCE_BOUND_ONLY
P7_R25_POST_MERGE_CURRENT_VIEW_RECONCILIATION = CLOSED_CANONICAL / PR #460 / proof 5585211201
POST_R25_SUCCESSOR_AUTHORITY_ANALYSIS = PR #460 / comment 5585307713 / ANALYSIS_ONLY
K4 = CLOSED FOR CANONICAL K4-R1 THROUGH K4-R5 BOUNDED DATA-ONLY SCOPE
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

`P7-R26` is a label for this bounded governance unit. Numbering, Track A ordering, and the canonical V3 planning document do not themselves create implementation authority.

This record creates implementation authority only if this exact authorization candidate independently qualifies, merges normally through protected `main` with an exact expected-head guard, and receives complete mandatory post-merge activation proof.

Live GitHub truth, root `AGENTS.md`, exact canonical authorization/evidence records and ruleset `20707483` override this document.

## 2. Why A4 is now the bounded next candidate

The canonical V3 master plan defines Track A as a dependency-ordered complete-review evidence sequence and explicitly states that the sequence is planning, not implementation authority.

Its first three candidates now have independently canonical bounded implementations and current-view reconciliation through A3:

```text
A1 = REVIEW COVERAGE UNIVERSE
A2 = DETERMINISTIC SECURITY PRE-SCAN EVIDENCE
A3 = RISK COVERAGE EVIDENCE
```

The next dependency-ordered planning candidate is:

```text
A4 = SKILL COVERAGE EVIDENCE
PURPOSE = identify relevant review skills; bind exact whole-skill identity; account for loaded / executed / unavailable disposition
```

Fresh successor analysis `5585307713` found no existing P7-R26/A4 authorization or implementation and therefore authorized no code by implication. It established only that a separately canonicalized bounded A4 authorization candidate is eligible to be created.

This document is that candidate.

## 3. Kodac-native skill evidence prerequisites

A4 must compose existing Kodac evidence rather than importing a donor runtime or inventing a new trust root.

Canonical K4 provides the bounded prerequisites:

```text
K4-R4 = CALLER-MATERIALIZED AGENT SKILL PACKAGE EVIDENCE / CANONICAL
K4-R5 = CALLER-MATERIALIZED AGENT SKILL GOVERNANCE-CLAIM EVIDENCE / CANONICAL
```

The existing K4-R4 contract can bind exact package metadata, content digests, package-manifest identity, source provenance and `UNBOUND | CURRENT | STALE` lineage.

The existing K4-R5 contract can bind package-version, requested-capability, requirement, compatibility and evaluation claim identities, while deliberately fixing:

```text
claimStatus = CALLER_ASSERTED
trustStatus = UNASSESSED
authorityState = NONE
```

These K4 records are evidence inputs only. They are not admission, trust, approval, routing, activation or execution authority.

Canonical K4 closeout explicitly preserves:

```text
package evidence != installation or activation
governance claim != verified fact
evaluation artifact identity != reproduced result
requested capability != approved capability
requirement claim != effect grant
UNASSESSED != trusted
K4 evidence != side-effect authority
```

A4 must preserve those distinctions exactly.

## 4. Exact future implementation allowlist

Only after this authorization becomes `CLOSED_CANONICAL` may one later P7-R26 implementation candidate modify exactly:

```text
packages/kodac-runtime/src/remediation/p7-skill-coverage-evidence-binding.ts
schema/p7-skill-coverage-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r26-skill-coverage-evidence-binding.test.ts
```

No fourth path is authorized.

The existing P7-R23, P7-R24 and P7-R25 bounded implementation pattern demonstrates that this contract can remain a standalone remediation source + JSON Schema + focused test file without requiring an index/export mutation.

This authorization does not permit changes to:

```text
packages/kodac-runtime/src/compatibility/**
packages/kodac-runtime/src/review/**
packages/kodac-runtime/src/execution/**
other packages/**
other schema/**
other tests/**
.github/**
provenance/**
docs/** after this authorization candidate itself
AGENTS.md
package manifests or lockfiles
rulesets or repository protection
release/package/deployment configuration
```

If a correct implementation requires any fourth path, stop and create a separately scoped canonical authorization amendment rather than expanding this unit.

## 5. Exact bounded implementation purpose

The future implementation may create one pure, synchronous, deterministic, data-only evidence-binding contract with bounded state:

```text
SKILL_COVERAGE_EVIDENCE_BOUND_ONLY
```

It may do only the following:

1. validate and bind one exact P7-R25 `RISK_COVERAGE_EVIDENCE_BOUND_ONLY` record and preserve its repository/base/head/tree/changed-path/review-universe/risk-taxonomy lineage;
2. accept a bounded caller-supplied set of skill coverage inputs;
3. validate exact K4-R4 Agent Skill package evidence for each supplied skill;
4. validate matching K4-R5 Agent Skill governance-claim evidence and prove exact package-evidence linkage;
5. bind exact whole-skill/package-manifest identity already represented by K4-R4 evidence;
6. bind caller-supplied admission and relevance evidence identities without converting them into Kodac trust qualification or verified relevance;
7. bind explicit deterministic risk/review relevance mappings rather than inferring relevance from raw skill prose;
8. record a fixed per-skill disposition vocabulary sufficient to distinguish `LOADED`, `EXECUTED` and `UNAVAILABLE` evidence states;
9. require explicit supporting evidence identities for admission, relevance and disposition claims;
10. preserve not-admitted, unknown, unavailable or otherwise unresolved skill coverage as explicit coverage debt rather than silently excluding it;
11. emit deterministic content-addressed skill records, accounted sets and a coverage-debt identity;
12. remain entirely caller-materialized and side-effect free.

The implementation must never read raw skill files or package directories itself. It may validate only bounded caller-provided JSON-compatible evidence objects and identities.

## 6. Admission, relevance and disposition semantics

Because no canonical general skill-trust qualification contract currently exists, A4 must not invent one.

A bounded input may carry fixed-vocabulary evidence-accounting states such as:

```text
ADMISSION = ADMITTED | NOT_ADMITTED | UNKNOWN
RELEVANCE = RELEVANT | NOT_RELEVANT | UNKNOWN
DISPOSITION = LOADED | EXECUTED | UNAVAILABLE
```

These are evidence-accounting labels only. Their exact implementation vocabulary may be narrowed during implementation if and only if it preserves the mandatory distinctions below and does not broaden authority.

Minimum consistency rules:

- `ADMITTED` must have one or more bounded admission evidence identities;
- `NOT_ADMITTED` and `UNKNOWN` remain explicit debt or non-coverage and cannot be silently dropped;
- `RELEVANT` must bind one or more exact canonical P7-R25 risk identifiers and one or more relevance evidence identities;
- `NOT_RELEVANT` must have explicit relevance evidence and cannot be inferred from absence;
- `UNKNOWN` relevance remains explicit debt;
- `LOADED` must carry one or more load evidence identities;
- `EXECUTED` must carry one or more execution evidence identities and cannot be inferred from `LOADED`;
- `UNAVAILABLE` must carry one or more unavailability evidence identities or a fixed bounded reason identity;
- package `bindingState=CURRENT` may be required as a structural precondition for positive admitted/loaded/executed accounting, but `CURRENT` never becomes trust or execution proof;
- K4-R5 `trustStatus=UNASSESSED` and `authorityState=NONE` must remain unchanged and must not be reinterpreted.

The implementation may reject inconsistent combinations fail-closed. It may not synthesize missing evidence.

## 7. Required output lineage

The future A4 record must bind at minimum:

```text
version
state = SKILL_COVERAGE_EVIDENCE_BOUND_ONLY
evidenceIdentity
repositoryIdentity
canonicalBase
targetHead
targetTree
changedPathSetIdentity
reviewUniverseIdentity
riskCoverageEvidenceIdentity
riskTaxonomyIdentity
skillCoverageSourceSetIdentity
skillAdmissionEvidenceIdentity
skillRelevanceEvidenceIdentity
skillDispositionEvidenceIdentity
relevantSkillSet
notRelevantSkillSet
unknownRelevanceSkillSet
admittedSkillSet
notAdmittedSkillSet
unknownAdmissionSkillSet
loadedSkillSet
executedSkillSet
unavailableSkillSet
skillRecords
coverageDebtIdentity
skillCoverageState
```

Exact field names may be narrowed only if schema/source/test remain mutually consistent and all semantic requirements remain represented. No output field may claim trust, verified execution, complete review, Done Gate or release truth.

Each skill record must retain sufficient exact identity to correlate to its validated K4-R4/K4-R5 inputs without embedding raw skill instructions, raw evaluation artifacts, credentials, secrets, provider output, filesystem content, or executable payloads.

## 8. Determinism, safety and bounded-input requirements

The implementation must follow the hardening pattern already proven in P7-R23/R24/R25 and K4-R4/R5:

- only ordinary JSON-compatible data;
- reject Proxy values before trap-triggering property access where practical under the existing runtime pattern;
- reject accessors, symbols, unsupported prototypes, sparse arrays, aliases/cycles and non-finite/unsafe numeric values;
- enforce deterministic depth, node, array-count and UTF-8/string-byte limits before unbounded work;
- reject unknown object fields;
- deterministic sort order for sets and records;
- duplicate identities/relevance mappings/disposition records rejected fail-closed;
- bounded SHA-256 identity grammar;
- exact package/governance linkage validated rather than caller-trusted;
- exact R25 evidence validation and lineage consistency required;
- output deeply immutable according to the established bounded evidence pattern;
- evidence identity derived from canonical deterministic serialization only;
- no clock, randomness, ambient environment, process state or external I/O.

## 9. Explicit forbidden implementation behavior

The exact three implementation paths may not:

```text
read skill package files or directories
parse or execute SKILL.md instructions
interpret raw allowed-tools as authority
install / activate / route / invoke a skill
execute scripts / hooks / commands / assets / binaries
qualify or upgrade skill trust
approve capabilities or requirements
invoke K2 or create K2 approvals
invoke K5 or mutate Done Gate state
invoke any provider / model / reviewer / agent / tool
make network requests
read secrets or credentials
write filesystem/repository state beyond normal candidate-file creation under this authorization
persist database/cache/session state
emit telemetry/upload/learning data
add dependencies
modify workflows
modify rulesets
publish packages/releases
create deployment authority
```

## 10. Mandatory non-equivalences

The implementation, tests, schema, PR body, review and post-merge proof must preserve all of the following:

```text
SKILL_COVERAGE_EVIDENCE_BOUND_ONLY != SKILL_COVERAGE_PROOF
PACKAGE_EVIDENCE != SKILL_ADMISSION_PROOF
PACKAGE_BINDING_CURRENT != TRUSTED
GOVERNANCE_CLAIM != VERIFIED_GOVERNANCE_FACT
CALLER_ASSERTED != TRUSTED
UNASSESSED != TRUSTED
AUTHORITY_STATE_NONE != EXECUTION_AUTHORITY
SKILL_ADMISSION_REFERENCE != TRUST_QUALIFICATION
SKILL_RELEVANCE_REFERENCE != VERIFIED_RELEVANCE
SKILL_LOADED_REFERENCE != VERIFIED_SKILL_LOAD
SKILL_EXECUTED_REFERENCE != VERIFIED_SKILL_EXECUTION
SKILL_LOADED != SKILL_EXECUTED
SKILL_EXECUTED != REVIEW_COMPLETE
SKILL_UNAVAILABLE != NOT_APPLICABLE
SKILL_COVERAGE_EVIDENCE_BOUND_ONLY != RISK_COVERAGE_PROOF
SKILL_COVERAGE_EVIDENCE_BOUND_ONLY != PROVIDER_TERMINATION_REASON_PROOF
SKILL_COVERAGE_EVIDENCE_BOUND_ONLY != PROVIDER_INVOCATION_PROVENANCE_PROOF
SKILL_COVERAGE_EVIDENCE_BOUND_ONLY != FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF
SKILL_COVERAGE_EVIDENCE_BOUND_ONLY != K5_RECONCILIATION_PROOF
SKILL_COVERAGE_EVIDENCE_BOUND_ONLY != DONE_GATE_PROOF
P7_R26_CLOSED != P7_OVERALL_CLOSED
P7_R26_CLOSED != RELEASE_AUTHORITY
P7_R26_CLOSED != PROJECT_COMPLETION
```

## 11. Test obligations for the future implementation

The exact test path must prove at minimum:

### Positive deterministic contract

- valid R25 evidence + one or more valid K4-R4/K4-R5 pairs produce deterministic identical A4 evidence independent of caller input ordering;
- exact package/governance linkage is preserved;
- whole-skill package-manifest identity is present only through bounded evidence identities/digests;
- admitted/relevant/disposition sets are deterministically sorted and partitioned according to the contract;
- coverage debt changes deterministically when admission/relevance/disposition debt changes;
- output validates through the JSON Schema and source validator;
- output is deeply immutable.

### Distinction tests

- `LOADED` never implies `EXECUTED`;
- `EXECUTED` never implies review completion;
- `UNAVAILABLE` never becomes `NOT_APPLICABLE`;
- `bindingState=CURRENT` never becomes trusted;
- K4-R5 `CALLER_ASSERTED / UNASSESSED / NONE` remains unchanged;
- zero unavailable skills does not establish complete review;
- admitted/relevant records do not establish trust qualification.

### Fail-closed linkage tests

Reject at minimum:

- tampered R25 evidence or lineage identity;
- mismatched K4-R4 package and K4-R5 governance evidence;
- stale/unbound package used where the positive disposition contract requires current binding;
- duplicate skill/package/governance identities;
- unknown canonical risk identifier in a relevance mapping;
- positive admission without admission evidence;
- positive relevance without relevance evidence;
- loaded/executed/unavailable disposition without required evidence;
- executed inferred only from loaded evidence;
- silent omission of unknown/not-admitted/unavailable debt;
- unknown fields and malformed fixed-vocabulary states.

### Hostile-input tests

Reject bounded hostile structures consistent with repository precedent, including:

```text
Proxy
accessor properties
symbol properties
unexpected prototypes
sparse arrays
cycles / aliases
non-JSON values
unsafe numeric values
oversized arrays / objects / strings
invalid Unicode scalar sequences where applicable
malformed SHA-256 identities
unknown fields
```

### Side-effect absence tests

The source must contain and the tests must enforce no provider/model invocation, no network/secret access, no filesystem/package discovery, no skill execution, no K2/K5 mutation, no persistence/telemetry, and no dependency/workflow expansion.

## 12. Donor/source rule

This authorization permits no donor source copy and no dependency admission.

The V3 donor plan is design input only:

```text
SkillHone whole-skill model = PATTERN INPUT ONLY FOR THIS UNIT
AI-Infra-Guard skill security taxonomy = TAXONOMY/PATTERN INPUT ONLY FOR THIS UNIT
OpenReview progressive skill disclosure pattern = PATTERN INPUT ONLY FOR THIS UNIT
```

If later implementation requires copying or deriving donor source rather than Kodac-native reimplementation, stop before the copy and create a separately canonicalized source-intake authorization with exact donor repository/head/tree/path/blob/license/notice/provenance fields. Founder source-use permission does not bypass that requirement.

## 13. Preserved global authority boundaries

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
VERIFICATION_ENGINE_INVOCATION = NOT_AUTHORIZED
VERIFICATION_EXECUTION = NOT_AUTHORIZED
LIVE_REVIEWER_PROVIDER_INVOCATION = NOT_AUTHORIZED
PROVIDER_MODEL_INVOCATION = NOT_AUTHORIZED
SECRET_ACCESS = NOT_AUTHORIZED
NETWORK_ACCESS = NOT_AUTHORIZED
PERSISTENCE_DATABASE_TELEMETRY_UPLOAD_LEARNING = NOT_AUTHORIZED
RISK_COVERAGE_PROOF = NOT_ESTABLISHED
SKILL_COVERAGE_PROOF = NOT_ESTABLISHED
PROVIDER_TERMINATION_REASON_PROOF = NOT_ESTABLISHED
FULL_EXACT_HEAD_RE_REVIEW_COMPLETENESS_PROOF = NOT_ESTABLISHED
P7_TO_K5_RECONCILIATION_PROOF = NOT_ESTABLISHED
DONE_GATE_INVOCATION_OR_MUTATION = NOT_AUTHORIZED
A5_OR_LATER_IMPLEMENTATION = NOT_AUTHORIZED_BY_PLAN_COMPOSITION
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
RULESET_CHANGE_BYPASS = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

## 14. Qualification requirements for this authorization candidate

This one-path documentation-only authorization candidate may qualify only if one unchanged exact head proves:

```text
BASE == CURRENT_CANONICAL_MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
NO_SECOND_PATH = PASS
P7_R25_RECONCILIATION_PROOF = EXACTLY_REVERIFIED / 5585211201
POST_R25_SUCCESSOR_ANALYSIS = EXACTLY_REVERIFIED / 5585307713 / ANALYSIS_ONLY
V3_MASTER_PLAN_PROOF = EXACTLY_REVERIFIED / 5575897235 / PLANNING_ONLY
K4_R4_R5_BOUNDED_PREREQUISITES = REVERIFIED
FUTURE_IMPLEMENTATION_ALLOWLIST = EXACTLY_3_PATHS
DONOR_SOURCE_COPY = NO
DEPENDENCY_CHANGE = NO
PROVIDER_NETWORK_SECRET_AUTHORITY = NO
K2_K5_MUTATION_AUTHORITY = NO
REQUIRED_CI = TERMINAL_SUCCESS OR CANONICALLY_PROVEN PATH-FILTER NON-APPLICABILITY
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = CLEAN
KNOWN_ACTIONABLE_DEFECTS = 0
UNRESOLVED_ACTIONABLE_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
EXPECTED_HEAD_GUARDED_MERGE = REQUIRED
WAIVER = NO
```

Any new candidate commit invalidates prior exact-head review and CI evidence.

## 15. Mandatory post-merge activation proof for this authorization

This authorization becomes canonical only after proof establishes at minimum:

```text
PR = CLOSED / MERGED
CANONICAL_MAIN = exact merge commit
ORDERED_PARENT_1 = exact pre-merge canonical main
ORDERED_PARENT_2 = exact qualified authorization head
MERGE_TREE = exact qualified-head tree
AUTHORIZATION_BLOB_ON_MAIN = exact qualified authorization blob
MERGE_SIGNATURE = VALID
MERGED_PATHS = EXACTLY_1_AUTHORIZATION_PATH
APPLICABLE_PUSH_GOVERNANCE = TERMINAL_SUCCESS
APPLICABLE_K2_PUSH = TERMINAL_SUCCESS OR CANONICALLY PROVEN PATH-FILTER NON-APPLICABLE
UNRESOLVED_REVIEW_THREADS = 0
RULESET_20707483 = ACTIVE / NO_BYPASS
WAIVER = NO
```

Only that complete post-merge proof may establish:

```text
P7_R26_SKILL_COVERAGE_EVIDENCE_BINDING_AUTHORIZATION = CLOSED_CANONICAL
P7_R26_IMPLEMENTATION_AUTHORITY = ACTIVE_ONLY_FOR_EXACT_THREE_AUTHORIZED_PATHS
```

## 16. Candidate boundary

Until this authorization itself qualifies, merges and receives complete post-merge activation proof:

```text
P7_R26_SKILL_COVERAGE_EVIDENCE_BINDING_AUTHORIZATION = CANDIDATE_ONLY
P7_R26_IMPLEMENTATION = NOT_AUTHORIZED
A5_OR_LATER_IMPLEMENTATION = NOT_AUTHORIZED_BY_PLAN_COMPOSITION
CURRENT_VIEW_MUTATION = NOT_AUTHORIZED
P7_OVERALL = NOT_CLOSED
P8_P9_IMPLEMENTATION = NOT_AUTHORIZED
PUBLIC_RELEASE_PACKAGE_PUBLICATION_DEPLOYMENT = NOT_AUTHORIZED
PROJECT_COMPLETION = NOT_ESTABLISHED
WAIVER = NO
```

After a future P7-R26 implementation itself closes canonically, current-view mutation remains unauthorized until a fresh drift analysis and separately canonicalized reconciliation authorization establish an exact allowlist. Only after that reconciliation closes canonically may a fresh A5 successor-authority analysis begin.