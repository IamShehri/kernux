# Kodac O3 Trust-Gated Progressive Skill Loading Authorization

## Record identity

```text
RECORD_KIND = AUTHORIZATION_CANDIDATE
UNIT = O3_TRUST_GATED_PROGRESSIVE_SKILL_LOADING
CANONICAL_BASE = c5f361ab61f1e8c8520984876dc4b54f351d2dfc
O2_IMPLEMENTATION_PROOF = 5624406028
POST_O2_SUCCESSOR_ANALYSIS = 5624442258 / ANALYSIS_ONLY
WAIVER = NO
```

This document is a one-path authorization candidate only. It does not authorize its own merge and it does not implement O3.

## Purpose

Authorize one bounded pure/data-only implementation that separates skill metadata selection, admission evidence, and exact content loading so candidate-controlled or external instructions cannot become trusted policy or capability authority by being selected.

The implementation is an evidence gate. It does not discover, read, install, execute, invoke, persist, fetch, or mutate anything.

## Canonical predecessor evidence

The authorization relies only on canonical repository evidence already present at the pinned base:

```text
K4_R4 = CALLER_MATERIALIZED_AGENT_SKILL_PACKAGE_EVIDENCE
K4_R5 = CALLER_MATERIALIZED_AGENT_SKILL_GOVERNANCE_CLAIM_EVIDENCE
P7_R26 = SKILL_COVERAGE_EVIDENCE_BINDING
O2 = DURABLE_WORKFLOW_EVIDENCE_KERNEL / CLOSED_CANONICAL_BY_PR_578
```

K4-R5 intentionally preserves:

```text
trustStatus = UNASSESSED
authorityState = NONE
```

Neither K4 metadata nor skill-requested capabilities are admission authority.

P7-R26 already requires positive admission accounting before `LOADED` or `EXECUTED` accounting, but it consumes caller-materialized admission/relevance/disposition evidence. It is not itself an independent progressive selection/admission/load gate.

## Exact authorization scope

If and only if this authorization later becomes canonical, the next implementation may change exactly these three paths and no others:

```text
packages/kodac-runtime/src/trust/o3-progressive-skill-trust-gate.ts
packages/kodac-runtime/test/o3-progressive-skill-trust-gate.test.ts
schema/o3-progressive-skill-trust-gate.schema.json
```

No package export, root index, package metadata, dependency, lockfile, workflow, provenance ledger, current-view document, release file, K4 source, P7 source, O2 source, or unrelated test may change under this authorization.

## Implementation class

```text
IMPLEMENTATION_CLASS = PURE_DATA_ONLY_SKILL_SELECTION_ADMISSION_LOAD_EVIDENCE_GATE
PROTOCOL_VERSION = kodac-o3-progressive-skill-trust-gate-v1
```

The source may import only Node built-ins needed for deterministic hashing/structural safety and the existing K4-R4/K4-R5 validation surfaces. It must not import execution, filesystem, network, process, provider, sandbox, K2, evidence-store persistence, or repository-mutation modules.

## Required trust invariants

```text
CANDIDATE_SKILL_TEXT != TRUSTED_POLICY
CANDIDATE_AGENT_INSTRUCTION != TOOL_AUTHORITY
SKILL_SELECTED != SKILL_ADMITTED
SKILL_ADMITTED != SIDE_EFFECT_AUTHORITY
SKILL_REQUESTED_CAPABILITY != GRANTED_CAPABILITY
METADATA_DISCLOSED != FULL_CONTENT_LOADED
FULL_CONTENT_ARGUMENT_NOT_ACCEPTED_BEFORE_LOAD_GATE = YES
```

A positive evidence record is evidence that exact caller-materialized admission facts were bound and validated. It is not proof that the external world supplied authentic authority beyond the canonical identities provided to the function.

## Source classes

The implementation must use this closed set:

```text
CANONICAL_KODAC_SKILL
ADMITTED_REPOSITORY_SKILL
CANDIDATE_REPOSITORY_SKILL
EXTERNAL_REFERENCE_SKILL
```

Every source class must bind one or more independent `sourceClassificationEvidenceIdentities`.

`CANDIDATE_REPOSITORY_SKILL` and `EXTERNAL_REFERENCE_SKILL` may be selected for relevance analysis, but this slice must reject any attempt to mark either class `ADMITTED`. A later separately authorized qualification/import step may create evidence for an `ADMITTED_REPOSITORY_SKILL`; this O3 slice may not perform that transformation itself.

## Stage 1 — metadata disclosure and selection

The selection API must accept only the exact K4 package/governance evidence and caller-materialized selection metadata/evidence. It must not accept a full skill file, instruction body, scripts, references, templates, or arbitrary package assets.

Required selection input fields:

```text
packageEvidence
governanceEvidence
sourceClass
sourceClassificationEvidenceIdentities
disclosedName
disclosedDescription
selectionDecision = SELECTED | NOT_SELECTED
selectionEvidenceIdentities
subjectRepositoryIdentity
canonicalBase
subjectRevisionIdentity
workflowRunIdentity = sha256 | null
```

Required selection rules:

1. Revalidate K4-R4 package evidence.
2. Revalidate K4-R5 governance evidence against the exact supplied package evidence.
3. Require package/governance identity parity.
4. Require `disclosedName` to equal the canonical package name.
5. Recompute the UTF-8 SHA-256 and byte length of `disclosedDescription` and require exact equality with K4-R4 `descriptionEvidence`.
6. Require a `CURRENT` K4 package binding for a positive `SELECTED` result.
7. Require at least one selection evidence identity for `SELECTED` or `NOT_SELECTED`.
8. Preserve K4 governance `UNASSESSED/NONE`; selection must not relabel it as trusted or authoritative.
9. Bind repository, canonical base, subject revision, and optional O2 workflow run identity.
10. Derive a deterministic metadata-disclosure identity and selection identity.

The selection output must not serialize the full description text. It may serialize name and the bound description digest/byte length.

## Skill identity continuity

For compatibility with canonical P7-R26, O3 `skillIdentity` must equal the existing P7-R26 canonical skill identity for the same exact K4 package/governance evidence pair.

The implementation must include a focused parity test proving this equality using canonical P7-R26 construction. It must not change P7-R26.

## Stage 2 — admission evidence gate

The admission API must consume a validated O3 selection record and caller-materialized admission evidence. It must not accept full skill content.

Required admission input fields:

```text
selectionEvidence
admissionDecision = ADMITTED | NOT_ADMITTED | UNKNOWN
admissionPolicyIdentity
admissionAuthorityIdentity
admissionEvidenceIdentities
```

Required admission rules:

1. Revalidate the complete selection record from its source inputs rather than trusting derived identities.
2. Positive `ADMITTED` requires `selectionDecision = SELECTED`.
3. Positive `ADMITTED` requires K4 package binding `CURRENT`.
4. Positive `ADMITTED` is permitted only for `CANONICAL_KODAC_SKILL` or `ADMITTED_REPOSITORY_SKILL`.
5. `CANDIDATE_REPOSITORY_SKILL` and `EXTERNAL_REFERENCE_SKILL` must fail closed if the caller asks for `ADMITTED`.
6. `ADMITTED` and `NOT_ADMITTED` require at least one admission evidence identity.
7. `UNKNOWN` is allowed only as an explicit blocking state and may use an empty admission evidence set.
8. `admissionPolicyIdentity` and `admissionAuthorityIdentity` are lower-case SHA-256 identities and are always bound into the admission identity.
9. The admission authority identity is evidence input, not a capability grant or proof of external authenticity by itself.
10. K4 requested capability claims remain caller-asserted requests and must not become granted capabilities.
11. Derive deterministic admission evidence identity from all authority-relevant inputs.

## Stage 3 — load-decision gate

A load-decision API must consume validated admission evidence and produce one of:

```text
ALLOW
BLOCK
```

Required decision rules:

```text
ADMITTED + SELECTED + CURRENT + allowed source class = ALLOW
NOT_ADMITTED = BLOCK
UNKNOWN = BLOCK
candidate/external source class = BLOCK
stale/unbound package = BLOCK
identity mismatch = BLOCK_BY_REJECTION
```

The load-decision API must not accept full skill content. This preserves the progressive-disclosure trust boundary before caller code is allowed to materialize full content for the final verification API.

## Stage 4 — exact loaded-skill evidence

A separate loaded-skill API may accept full skill-file UTF-8 content only after a validated `ALLOW` load-decision record is supplied.

Required loaded-skill input fields:

```text
selectionEvidence
admissionEvidence
loadDecisionEvidence
skillFileContent
loadEvidenceIdentities
```

Required loaded-skill rules:

1. Revalidate selection, admission, and load-decision lineage.
2. Reject any lineage whose final load decision is not `ALLOW`.
3. Compute SHA-256 and UTF-8 byte length of `skillFileContent`.
4. Require exact equality with K4-R4 `skillFileEvidence.sha256` and `skillFileEvidence.byteLength`.
5. Bind K4 package manifest identity and source provenance identity.
6. Bind the exact `skillIdentity` into loaded-skill evidence.
7. Require at least one caller-materialized `loadEvidenceIdentity`.
8. Do not serialize raw skill content into the resulting evidence object.
9. Do not parse or execute instructions, YAML, Markdown, scripts, references, templates, or tool requests.
10. Derive deterministic `loadedSkillEvidenceIdentity`.

The final positive record establishes only that caller-materialized bytes matched the already-bound K4 skill-file digest after an exact admitted lineage. It grants no requested capability.

## Identity formats and deterministic serialization

All derived O3 identities must be lower-case 64-hex SHA-256 values. `canonicalBase` and `subjectRevisionIdentity` remain lower-case 40-hex Git SHA-1 values to match current repository evidence conventions.

Use deterministic canonical JSON with sorted object keys and domain-separated SHA-256 preimages for new O3 identities, except `skillIdentity`, which must intentionally preserve exact P7-R26 identity parity.

At minimum derive and serialize:

```text
skillIdentity
metadataDisclosureIdentity
selectionIdentity
admissionIdentity
loadDecisionIdentity
loadedSkillEvidenceIdentity
```

Optional `workflowRunIdentity`, when present, is a lower-case SHA-256 identity and must be bound by every downstream stage.

## Structural safety and hostile input

Every public builder/validator must reject before semantic use:

```text
Proxy values
revoked Proxy values
custom object prototypes
accessor properties
non-enumerable semantic properties
symbol properties
undefined semantic values
sparse arrays
arrays with extra own properties
duplicate set-like entries
unknown object keys
unknown enum values
non-finite numbers
unpaired UTF-16 surrogates
NUL in bounded text
oversized strings
oversized arrays
```

Validators must independently rederive all derived fields and identities from supplied source inputs. A caller may not forge a derived identity and pass validation merely because its syntax is valid.

## Bounds

The first O3 slice must use explicit finite bounds no weaker than:

```text
MAX_SELECTION_EVIDENCE_IDENTITIES = 32
MAX_SOURCE_CLASSIFICATION_EVIDENCE_IDENTITIES = 32
MAX_ADMISSION_EVIDENCE_IDENTITIES = 32
MAX_LOAD_EVIDENCE_IDENTITIES = 32
MAX_DESCRIPTION_UTF8_BYTES = 4096
MAX_SKILL_FILE_UTF8_BYTES = 1048576
MAX_BOUNDED_TEXT_UTF8_BYTES = 4096
MAX_GRAPH_DEPTH = 32
MAX_GRAPH_NODES = 16384
```

The implementation may choose stricter bounds if compatible with canonical K4 evidence, but it must not silently weaken existing K4 limits.

## Required serialized evidence surface

The schema must describe the final loaded-skill evidence record and bind at least:

```text
version
skillIdentity
packageEvidenceIdentity
governanceEvidenceIdentity
packageManifestIdentity
sourceProvenanceIdentity
sourceClass
sourceClassificationEvidenceIdentities
name
descriptionIdentity
descriptionByteLength
metadataDisclosureIdentity
selectionDecision
selectionEvidenceIdentities
selectionIdentity
admissionDecision
admissionPolicyIdentity
admissionAuthorityIdentity
admissionEvidenceIdentities
admissionIdentity
loadDecision
loadDecisionIdentity
skillFileIdentity
skillFileByteLength
loadEvidenceIdentities
workflowRunIdentity
subjectRepositoryIdentity
canonicalBase
subjectRevisionIdentity
loadedSkillEvidenceIdentity
```

The schema must use JSON Schema Draft 2020-12 and `additionalProperties: false` throughout the serialized positive surface.

## Required focused tests

The future implementation must include at least these focused cases:

1. selected canonical skill metadata produces deterministic selection evidence;
2. disclosed description digest/length mismatch is rejected;
3. disclosed name mismatch is rejected;
4. stale package cannot be positively selected;
5. candidate skill may be selected but cannot be admitted;
6. external-reference skill may be selected but cannot be admitted;
7. admitted-repository skill may be admitted with exact independent evidence;
8. canonical Kodac skill may be admitted with exact independent evidence;
9. `ADMITTED` requires selected state;
10. `ADMITTED` requires non-empty admission evidence;
11. `NOT_ADMITTED` blocks load;
12. `UNKNOWN` blocks load;
13. stale/unbound package blocks positive load;
14. requested capability claims never appear as granted capabilities;
15. load-decision API has no full-content argument;
16. loaded-skill API rejects non-ALLOW lineage;
17. exact skill-file digest and length admit loaded evidence;
18. skill-file digest mismatch is rejected;
19. skill-file byte-length mismatch is rejected;
20. loaded evidence does not serialize raw skill content;
21. loaded evidence binds exact skill identity;
22. O3 skill identity equals P7-R26 skill identity for the same K4 pair;
23. changed selection evidence changes selection identity;
24. changed admission policy changes admission identity;
25. changed admission authority changes admission identity;
26. changed subject revision changes downstream identities;
27. changed optional workflow run identity changes downstream identities;
28. duplicate evidence identities are rejected;
29. unknown fields/enums are rejected;
30. Proxy/revoked Proxy/accessor/non-enumerable/symbol/custom-prototype inputs are rejected;
31. sparse arrays and arrays with extra own properties are rejected;
32. unpaired Unicode, NUL, oversized description, and oversized full content are rejected;
33. forged derived fields fail independent validation;
34. schema exact-surface parity passes;
35. source static audit proves no forbidden side-effect imports.

More tests are allowed. Fewer than these semantic cases is not sufficient qualification.

## Qualification requirements for the future implementation

The future implementation cannot qualify unless all of the following are true on one frozen exact head:

```text
EXACT_CHANGED_PATHS = 3
NODE_MAJOR = 24
FOCUSED_O3_TESTS = PASS
TYPESCRIPT = PASS
FULL_RUNTIME_REGRESSION = PASS
PYTHON_REPOSITORY_TESTS = PASS
RUFF = PASS
PROVENANCE_VALIDATION = PASS
SCHEMA_DRAFT_2020_12 = PASS
SCHEMA_SURFACE_PARITY = PASS
NO_NEW_DEPENDENCY = PASS
NO_LOCKFILE_CHANGE = PASS
NO_FORBIDDEN_SIDE_EFFECT_IMPORT = PASS
EXACT_HEAD_PR_CI = PASS
EXACT_HEAD_SUBSTANTIVE_REVIEW = CLEAN
REVIEW_THREADS = 0
ACTIVE_MAIN_RULESET = CONFIRMED
BYPASS = NO
WAIVER = NO
```

A qualifying PR must preserve original-attempt failures. A rerun may diagnose infrastructure but must not erase an adverse first attempt where repository governance requires original-attempt evidence.

## Merge and external proof gate

The implementation may be merged only by a normal merge with exact expected-head protection after fresh pre-merge verification. No force-push, rebase, history rewrite, bypass, or weakened required check is authorized.

After merge, closure still requires:

```text
main == merge SHA
merge tree == qualified candidate tree
parent 1 == pinned canonical base at qualification
parent 2 == qualified exact head
GitHub merge signature = valid
original applicable post-merge push workflows = terminal success
review threads = 0
main ruleset = active / no bypass
release/tag posture unchanged unless separately authorized
external post-merge proof comment = published
```

## Explicit non-grants

This authorization does not authorize:

```text
FILESYSTEM_DISCOVERY = NO
FILESYSTEM_READ = NO
PACKAGE_INSTALLATION = NO
PACKAGE_REGISTRY_ACCESS = NO
YAML_PARSING_FOR_EXECUTION = NO
MARKDOWN_INSTRUCTION_EXECUTION = NO
SCRIPT_EXECUTION = NO
REFERENCE_OR_TEMPLATE_LOADING = NO
PROCESS_EXECUTION = NO
NETWORK = NO
SECRET_ACCESS = NO
PROVIDER_MODEL_EXECUTION = NO
SANDBOX_EXECUTION = NO
K2_OR_REPOSITORY_MUTATION = NO
CAPABILITY_GRANT = NO
SIDE_EFFECT_AUTHORITY = NO
PERSISTENCE_OR_DATABASE = NO
QUEUE_OR_SCHEDULER = NO
CURRENT_VIEW_MUTATION = NO
O3_OVERALL_CLOSURE = NO
PHASE_OVERALL_CLOSURE = NO
PUBLIC_RELEASE = NO
PROJECT_COMPLETION = NO
```

## Authorization decision

If this one-path document later receives exact-head qualification, normal merge, successful applicable post-merge workflows, and external canonical proof, it authorizes only the exact three-path O3 pure/data implementation defined above.

```text
AUTHORIZATION_CANDIDATE != CANONICAL_AUTHORIZATION
CANONICAL_AUTHORIZATION != O3_IMPLEMENTATION
O3_IMPLEMENTATION != O3_OVERALL_CLOSURE
O3_BOUNDED_CLOSURE != PROJECT_COMPLETION
```
