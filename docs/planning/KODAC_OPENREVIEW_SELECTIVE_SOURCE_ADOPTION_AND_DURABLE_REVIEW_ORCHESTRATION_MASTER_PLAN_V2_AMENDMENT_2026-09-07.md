# Kodac OpenReview Selective Source Adoption and Durable Review Orchestration Master Plan V2 Amendment

## Record identity

```text
DOCUMENT_CLASS = FOUNDER-DIRECTED DOCUMENTATION / MASTER PLANNING AMENDMENT CANDIDATE
STATUS = PLANNING_AMENDMENT_CANDIDATE / NOT_CANONICAL
DATE = 2026-09-07
DECISION_OWNER = KODAC FOUNDER
CANONICAL_BASE_AT_CREATION = 33397d89f498df6c3087ef7d2103e494b780c7d9
CANONICAL_BASE_TREE_AT_CREATION = 14e00c62cd241041d4c7f8ba7a5165a54db2ccaa
ACTIVE_ENGINEERING_FRONTIER_AT_CREATION = P7-R20 AUTHORIZATION CLOSED_CANONICAL / IMPLEMENTATION AUTHORITY ACTIVE UNDER ITS OWN EXACT FOUR-PATH ALLOWLIST
EXTERNAL_REFERENCE = vercel-labs/openreview
EXTERNAL_REFERENCE_HEAD = 672deb21e70e471e0536d5ad7a67c14b8359e97e
EXTERNAL_REFERENCE_TREE = c21e89a74099fa878233950686e50be18c7c41ae
EXTERNAL_PRODUCT_REFERENCE = https://openreview.labs.vercel.dev
UPSTREAM_SELF_DESCRIBED_LICENSE = MIT
UPSTREAM_ROOT_LICENSE_FILE_AT_REVIEWED_SNAPSHOT = NOT_OBSERVED
UPSTREAM_LICENSE_ISSUE = vercel-labs/openreview#15 / MISSING LICENSE / OPEN AT REVIEW TIME
FOUNDER_ASSERTED_SOURCE_REUSE_PERMISSION = PROVIDED
FOUNDER_ASSERTED_SOURCE_REUSE_PERMISSION_VERIFICATION = NOT_INDEPENDENTLY_VERIFIED BY THIS RECORD
SOURCE_REUSE_PLANNING_DISPOSITION = SELECTIVE ADAPTATION PERMITTED AS FUTURE CANDIDATE INPUT
WHOLESALE_COPY_DISPOSITION = REJECTED
DEPENDENCY_ADMISSION = NONE
IMPLEMENTATION_AUTHORITY = NONE
WAIVER = NO
```

This amendment is additive. It supplements and sharpens:

```text
docs/planning/KODAC_DURABLE_REVIEW_ORCHESTRATION_AND_SKILL_TRUST_MASTER_PLAN_AMENDMENT_2026-09-06.md
docs/planning/KODAC_INTELLIGENCE_IMPROVEMENT_MASTER_PLAN_2026-08-26.md
docs/planning/KODAC_TRUST_AND_VERIFICATION_MASTER_PLAN_V2_AMENDMENT_2026-09-02.md
docs/research/KODAC_FINAL_GAP_AND_IMPROVEMENT_REVIEW_2026-08-26.md
```

It does not rewrite historical authorization, evidence, proof, ADR, review, or reconciliation records.

Where the earlier OpenReview planning amendment states that source copying was not admitted because provenance/license admission was incomplete, this V2 amendment records a new founder-supplied rights input. That rights input is sufficient for planning selective source reuse, but it is not implementation authority and it is not an independent legal verification of upstream license provenance.

---

## 1. Executive decision

OpenReview is a strong product-pattern and orchestration donor for Kodac, but its current trust model is materially weaker than Kodac's canonical trust architecture.

The correct direction is:

```text
OPENREVIEW-LIKE DEVELOPER EXPERIENCE
+ OPENREVIEW-LIKE DURABLE STEP DECOMPOSITION
+ OPENREVIEW-LIKE PROGRESSIVE SKILL DISCLOSURE
+ KODAC EVIDENCE IDENTITY
+ KODAC SKILL TRUST
+ KODAC FAIL-CLOSED AUTHORITY
+ KODAC K2 SIDE-EFFECT BOUNDARY
+ KODAC SANDBOX ADMISSION
+ KODAC RECEIPTS / REVALIDATION / K5 / DONE-GATE DISCIPLINE
```

Therefore:

```text
OPENREVIEW_FIT_FOR_KODAC = YES
OPENREVIEW_WHOLESALE_COPY = NO
OPENREVIEW_SELECTIVE_SOURCE_ADAPTATION = RECOMMENDED
OPENREVIEW_RUNTIME_TRUST_MODEL = NOT_ADOPTED
OPENREVIEW_PRODUCT_UX_PATTERNS = STRONG DONOR INPUT
OPENREVIEW_ORCHESTRATION_PATTERNS = STRONG DONOR INPUT
OPENREVIEW_SKILL_DISCLOSURE_PATTERN = STRONG DONOR INPUT WITH STRONGER KODAC TRUST GATE
```

The target product is not an OpenReview clone. The target is a provider-neutral, workflow-neutral, sandbox-neutral, evidence-addressable software trust system that offers OpenReview-class ergonomics without inheriting broad shell, credential, push, dependency-install, or fail-open authority.

---

## 2. Authority boundary

This planning record grants no implementation, execution, provider, dependency, persistence, secret, network, sandbox, GitHub App, webhook, mutation, release, or completion authority.

```text
THIS PLAN != P7-R20 IMPLEMENTATION AUTHORITY
THIS PLAN != P7 SUCCESSOR AUTHORITY
THIS PLAN != P8 IMPLEMENTATION AUTHORITY
THIS PLAN != P9 IMPLEMENTATION AUTHORITY
THIS PLAN != DONOR FILE ADMISSION
THIS PLAN != DEPENDENCY ADMISSION
THIS PLAN != GITHUB APP INSTALLATION AUTHORITY
THIS PLAN != WEBHOOK ACTIVATION AUTHORITY
THIS PLAN != VERCEL WORKFLOW ADMISSION
THIS PLAN != VERCEL SANDBOX ADMISSION
THIS PLAN != REDIS ADMISSION
THIS PLAN != CLAUDE / ANTHROPIC INVOCATION AUTHORITY
THIS PLAN != BASH AUTHORITY
THIS PLAN != GH CLI AUTHORITY
THIS PLAN != DIRECT PUSH AUTHORITY
THIS PLAN != AUTOFIX AUTHORITY
THIS PLAN != PROJECT COMPLETION
```

The currently active P7-R20 engineering authorization remains governed only by its own canonical exact four-path allowlist. This planning amendment must not be used to add a fifth R20 path or widen R20 semantics.

---

## 3. Reverified OpenReview snapshot

Reviewed upstream snapshot:

```text
REPOSITORY = vercel-labs/openreview
HEAD = 672deb21e70e471e0536d5ad7a67c14b8359e97e
TREE = c21e89a74099fa878233950686e50be18c7c41ae
PROJECT_STATUS = BETA
PRIMARY_LANGUAGE = TYPESCRIPT
```

Observed product flow:

```text
PR MENTION
-> GITHUB THREAD / MESSAGE COLLECTION
-> DURABLE WORKFLOW START
-> PUSH ACCESS CHECK
-> SANDBOX CREATE
-> DEPENDENCY INSTALL
-> GIT CONFIGURATION
-> AGENT RUN
-> TOOL USE / PR REVIEW
-> DIRTY-TREE CHECK
-> OPTIONAL COMMIT + PUSH
-> SANDBOX CLEANUP IN FINALLY
```

Observed feature set includes on-demand PR reviews, isolated sandbox execution, inline suggestions, direct code changes, reaction-driven follow-up, durable workflows, progressive `.agents/skills/` loading, one currently hard-coded model choice, and optional Redis-backed state.

The upstream product page states MIT. The reviewed repository snapshot did not expose a root `LICENSE` file, and issue `vercel-labs/openreview#15` records that absence. This plan therefore records the upstream self-description and the founder-supplied permission separately rather than collapsing them into one provenance claim.

---

## 4. Exact donor disposition matrix

Future source adoption must be file/function specific. A repository-level permission must never be translated into repository-level technical trust.

| OpenReview source | Useful concept | Kodac disposition | Required transformation |
| --- | --- | --- | --- |
| `workflow/index.ts` | explicit durable step decomposition and guaranteed cleanup | ADAPT | replace broad workflow authority with typed evidence-producing steps; every side effect remains K2-gated |
| `lib/bot.ts` | mention/reaction-native GitHub UX and thread state | ADAPT | authenticate/dedupe events; record interaction intent; no reaction becomes direct write/merge authority |
| `lib/skills.ts` | progressive disclosure of skill name/description before full instructions | ADAPT CONCEPT, REWRITE VALIDATION | bind exact skill identity, Unicode/collision rules, provenance, manifest, admission status and source revision |
| `workflow/steps/discover-skills.ts` | skill directory discovery | REWRITE | no silent catch-and-skip trust semantics; symlink/path/size/count/precedence rules; candidate skill remains untrusted |
| `lib/tools/load-skill.ts` | on-demand skill loading | ADAPT | load only an admitted exact skill identity; bind loaded identity into review evidence |
| `workflow/steps/create-sandbox.ts` | explicit sandbox creation step | ADAPT SHAPE | use Kodac sandbox admission, lease identity, backend evidence, resource/network/filesystem policy |
| `workflow/steps/extend-sandbox.ts` | explicit lease extension | ADAPT SHAPE | extension must be policy-bound, budgeted, identity-preserving and receipt-producing |
| `workflow/steps/stop-sandbox.ts` | cleanup in a durable step/finally path | ADAPT | cleanup must emit closeout evidence and handle partial/failed cleanup fail-closed |
| `workflow/steps/check-push-access.ts` | pre-mutation eligibility check | REWRITE COMPLETELY | unknown/403/404 protection state must fail closed; verify current ruleset/branch policy positively |
| `workflow/steps/commit-and-push.ts` | post-edit mutation flow | REJECT SEMANTICS | no `git add -A`, no `--no-verify`, no direct agent push; use exact patch/write allowlist + K2 + receipt + exact expected head |
| `lib/agent.ts` | composed tools + progressive skills + concise review instructions | ADAPT | provider-neutral model contract; no general bash/gh; typed tools; prompt/input provenance; tool authority separate from model choice |
| `lib/tools/bash.ts` | arbitrary repo command execution | REJECT AS DEFAULT | replace with typed bounded command/test capabilities through admitted execution boundary |
| `lib/tools/read-file.ts` | repository inspection | ADAPT | bounded read capability; path normalization; size limits; evidence identity; no secret/untrusted-cross-tenant leakage |
| `lib/tools/write-file.ts` | direct file write | REJECT AS DEFAULT | proposal first; exact patch identity; explicit authorization; K2 write capability; receipt and revalidation |
| reply/comment tool | PR-native response | ADAPT | typed comment/review publisher with content/target identity, idempotency and retry safety |
| optional Redis state | persistent workflow/thread state | ADAPT ONLY AFTER PERSISTENCE AUTHORITY | explicit data classes, tenant partitioning, encryption, retention, deletion, migration and backup policy |
| Vercel Workflow | durable orchestration substrate | ADAPTER CANDIDATE ONLY | Kodac core must remain workflow-engine neutral |
| Vercel Sandbox | isolated execution substrate | ADAPTER CANDIDATE ONLY | Kodac core must remain sandbox-provider neutral and preserve stronger admission/attestation semantics |

### Source-copy rule

Even where direct source copying is allowed by founder-supplied rights, future copied code must preserve a machine-readable donor map containing donor repository/head/path/blob, reuse basis, adaptation class (`COPIED`, `DERIVED`, `REIMPLEMENTED`, or `PATTERN_ONLY`), Kodac destination, semantic/security/dependency changes, and review evidence.

No copied/derived code should enter a privileged Kodac runtime lane without this mapping and the normal canonical authorization/qualification chain.

---

## 5. Critical gaps found in the existing plan

The September 6 amendment already covered the broad trust direction well. The following gaps require explicit contracts before implementation.

### G1 — Webhook authenticity is not enough; replay and deduplication need first-class semantics

Bind provider event/delivery identity, signature verification, installation, repository, PR, actor, subject head, timestamp and payload digest. Duplicate delivery must not duplicate side effects; out-of-order or replayed delivery after head movement must become stale; unknown signature state must fail closed.

### G2 — Concurrency and workflow ownership are underspecified

Multiple mentions, reactions, retries, and workers may target one PR. Add a workflow subject lease binding repository + PR + subject head + workflow identity + lease epoch. Competing mutation-capable workflows must not race silently.

### G3 — Cancellation and revocation are missing

Add explicit states for active, cancellation requested, cancelled before side effect, side effect already committed, and stale by authority change. Cancellation must not pretend an already-committed side effect was undone.

### G4 — Workflow definition versioning/migration needs a contract

Bind workflow definition identity, schema version, step definitions and runtime version. Resume after definition drift requires an admitted migration or fail-closed stop.

### G5 — Fork PR security boundary is missing

```text
FORK_PR + SECRET / WRITE CAPABILITY = DENY BY DEFAULT
```

Read-only analysis may be separately authorized, but no write token, repository secret, provider secret, privileged cache or trusted skill becomes available merely because a PR exists.

### G6 — Repository checkout provenance is underspecified

Bind repository/remote identity, base and target commits, checkout tree, cleanliness, submodule policy/commits, Git LFS policy, sparse-checkout policy, symlink policy, case-sensitivity assumptions and line-ending normalization.

### G7 — Skill discovery requires stronger parser and filesystem rules

Define Unicode normalization, case-fold collisions, max skill/file/total bytes, symlink/path traversal policy, source precedence, duplicate-name fail-closed behavior and content digests before model exposure. Silent malformed-skill skipping must not hide an admitted-skill defect.

### G8 — Skill shadowing and candidate prompt poisoning need precedence

```text
CANONICAL KODAC POLICY
> ORGANIZATION-ADMITTED SKILL
> REPOSITORY-ADMITTED SKILL
> CANDIDATE SKILL AS UNTRUSTED DATA
```

Candidate text must not shadow trusted instructions through case, Unicode, alias, path or display-name tricks.

### G9 — Tool surface must be typed and policy-addressable

Prefer explicit capabilities such as repository read, PR diff read, repository search, admitted test/linter execution, patch proposal, review publication, K2 request and admitted skill load. Do not expose general bash or authenticated `gh` by default.

### G10 — Prompt/tool injection needs a unified data-origin model

PR text, issue text, source files, README/AGENTS/skill files, tool/test/dependency output and generated code are potentially hostile data. Preserve source/trust classification for every model-visible item.

### G11 — Review completeness is distinct from zero findings

Future evidence should bind changed/reviewed/unreviewed paths, context budget, omission reasons, skill/risk coverage and provider termination reason.

```text
ZERO_FINDINGS != COMPLETE_REVIEW
```

### G12 — Patch proposal identity must precede write authority

Use finding/request → immutable patch proposal → exact path/hunk set → intent/policy → K2 authorization → apply receipt → post-apply diff/tree reconciliation.

### G13 — Comment and suggestion publication needs idempotency and target binding

Bind repository, PR, subject head, finding/proposal identity, path/range, body digest, publication intent, idempotency key and resulting provider comment identity. Retry must not spam duplicates or apply to moved lines.

### G14 — Branch/ruleset uncertainty must be a hard deny

```text
RULESET UNKNOWN = NOT MUTATION-ELIGIBLE
PROTECTION UNREADABLE = NOT MUTATION-ELIGIBLE
```

### G15 — Credential brokering needs TTL, audience, scope and revocation

Represent credential class, audience, repository/operation scope, issue/expiry time, revocation state and broker identity. Do not expose raw secret values to the model by default.

### G16 — Dependency installation requires execution-aware supply-chain admission

Account for install/postinstall scripts, native builds, binary downloads, package-manager plugins, workspace scripts, registry redirects, Git dependencies, remote tarballs and cache provenance. Default install should be disabled for untrusted PR review unless exact policy admits it.

### G17 — Sandbox lifecycle requires proof of destruction, not just `finally`

Distinguish stop requested, stop acknowledged, lease expired, resource destroyed and destruction unproven. Zombie resources and failed cleanup remain visible.

### G18 — Resource, spend and rate budgets need first-class limits

Bind maximum provider calls/tokens, wall clock, sandbox seconds, tool calls, network/output bytes, retries and estimated cost. Budget exhaustion terminates safely.

### G19 — Persistence needs privacy, tenant, retention and migration contracts

Before Redis/database adoption define tenant identity, data classification, encryption, retention, deletion, backup, region policy, schema migration and replay semantics. Workflow history is not training memory by implication.

### G20 — Multi-tenant isolation must be explicit

Partition state, cache, sandbox, credentials, skill registries and evidence by tenant/repository. Cache keys include all authority-relevant identities.

### G21 — Observability must not become a covert evidence or secret leak

Logs/traces/metrics use redacted structured identifiers. Raw private diffs, prompts, secrets, tokens and unbounded tool output are not exported by default.

### G22 — Provider/model drift needs resume invalidation

A resumed run under different provider/model/prompt/tool configuration is a new intelligence attempt unless policy explicitly admits the transition.

### G23 — Provider neutrality needs a stable reviewer adapter contract

Core reviewer contracts remain provider-neutral while recording exact provider/model identity per attempt.

### G24 — External-service outage semantics are missing

Distinguish retryable read/intelligence failures, non-retryable policy failures, side-effect result unknown and confirmed side-effect failure. Unknown side-effect result must never be blindly replayed.

### G25 — Repository write conflict handling needs compare-and-swap semantics

Revalidate exact target head immediately before mutation; after mutation prove resulting tree/diff. Stop on head movement rather than implicit rebase.

### G26 — Git/filesystem edge cases need adversarial coverage

Include submodules, symlinks, case-only renames, file-mode changes, large/binary files, Git LFS pointers, renames/copies, merge commits, conflict markers and `.gitattributes` transformations.

### G27 — Human intent needs actor eligibility, not only actor identity

Policy must evaluate whether the actor is allowed to authorize the requested action; event authenticity alone is insufficient.

### G28 — User-facing explanations need evidence-linked states

Distinguish `OBSERVED`, `INFERRED`, `PROPOSED`, `EXECUTED`, `VERIFIED`, `BLOCKED` and `STALE` in PR-facing output.

### G29 — Kill switch / safe degradation needs a plan

Support policy-level modes such as disabled, read-only review, proposal-only and K2-authorized mutation. Loss of trust signals degrades toward less authority.

### G30 — Donor drift must be monitored without automatic intake

OpenReview updates may become research input, but no automatic upstream sync may mutate privileged Kodac code.

---

## 6. Target architecture after gap closure

```text
GITHUB / CLI / API EVENT
-> AUTHENTICATED + DEDUPED EVENT EVIDENCE
-> ACTOR ELIGIBILITY + SUBJECT RESOLUTION
-> EXACT HEAD / RULESET / AUTHORIZATION BINDING
-> DURABLE WORKFLOW RUN + SUBJECT LEASE
-> BOUNDED READ-ONLY CONTEXT ACQUISITION
-> TRUST-GATED PROGRESSIVE SKILL LOADING
-> PROVIDER-NEUTRAL REVIEWER / CRITIC
-> STRUCTURED FINDINGS / REVIEW-COMPLETENESS EVIDENCE
-> IMMUTABLE PATCH PROPOSAL WHEN APPLICABLE
-> HUMAN/POLICY INTENT EVIDENCE WHEN REQUIRED
-> K2 TYPED SIDE-EFFECT AUTHORIZATION
-> ADMITTED SANDBOX / EXECUTION BACKEND
-> RECEIPT + RESULT RECONCILIATION
-> VERIFICATION
-> EXACT-TARGET-HEAD REVIEW BINDING / LATER TEMPORAL RE-REVIEW PROOF WHEN AUTHORIZED
-> K5 RECONCILIATION
-> DONE GATE
-> PR-NATIVE EXPLANATION / STATUS
-> CONTINUOUS FRESHNESS MONITORING
```

---

## 7. Proposed durable workflow state machine

```text
RECEIVED
EVENT_VERIFIED
EVENT_DEDUPED
SUBJECT_BOUND
AUTHORITY_SNAPSHOT_BOUND
WORKFLOW_LEASE_ACQUIRED
CONTEXT_READY
SKILLS_RESOLVED
REVIEW_RUNNING
REVIEW_COMPLETED
PROPOSAL_READY
INTENT_REQUIRED
INTENT_BOUND
EXECUTION_AUTHORIZED
EXECUTION_RUNNING
EXECUTION_RESULT_UNKNOWN
EXECUTION_RECEIPT_BOUND
VERIFYING
VERIFICATION_COMPLETE
REVIEW_RECONCILING
K5_RECONCILING
DONE_GATE_EVALUATING
COMPLETED
CANCELLED
STALE
FAILED
```

Not every workflow uses every state. Skips must be explicit and evidence-backed.

---

## 8. Trust-gated progressive skill loading design

```text
DISCOVER CANDIDATE METADATA
-> NORMALIZE NAME / DESCRIPTION
-> RESOLVE SOURCE PRECEDENCE
-> VERIFY MANIFEST + CONTENT DIGEST
-> CLASSIFY TRUST
-> APPLY POLICY
-> EXPOSE NAME + DESCRIPTION TO MODEL
-> MODEL REQUESTS SKILL IDENTITY
-> TRUST GATE REVALIDATES EXACT IDENTITY
-> LOAD FULL CONTENT
-> BIND SKILL IDENTITY INTO REVIEW RUN
```

The model requests an identity, not a mutable display name. No loaded skill grants tools.

---

## 9. Sandbox and mutation targets

Default sandbox posture:

```text
NO AMBIENT GITHUB WRITE TOKEN
NO AMBIENT PROVIDER SECRET
NO GENERAL NETWORK
NO PACKAGE INSTALL BY DEFAULT
NO HOST FILESYSTEM ACCESS
NO CROSS-TENANT CACHE
BOUNDED CPU / MEMORY / WALL CLOCK / OUTPUT
STRICT TTL
EXACT READ/WRITE MOUNTS
COMMAND ALLOWLIST OR TYPED EXECUTION CAPABILITY
FULL EXECUTION RECEIPT
CLEANUP EVIDENCE
```

Mutation chain:

```text
MODEL / TOOL PROPOSES PATCH
-> NORMALIZE + CONTENT-ADDRESS PATCH
-> STATIC PATH / HUNK POLICY
-> USER / POLICY INTENT
-> EXACT SUBJECT HEAD REVALIDATION
-> K2 APPLY REQUEST
-> K2 RECEIPT
-> POST-APPLY TREE / DIFF EVIDENCE
-> VERIFICATION
-> REVIEW / K5 / DONE GATE
```

Prohibitions:

```text
NO git add -A AS AUTHORITY
NO git commit --no-verify AS TRUST DEFAULT
NO AGENT-DIRECT PUSH
NO IMPLICIT REBASE
NO WRITE AFTER HEAD MOVED
NO BLIND SIDE-EFFECT RETRY AFTER UNKNOWN RESULT
```

---

## 10. Provider-neutral and persistence targets

Potential provider-neutral contracts:

```text
ReviewerRequest
ReviewerAttemptRecord
ReviewerClaim
ReviewerFinding
ReviewCoverageRecord
ProviderUsageRecord
```

Every attempt binds provider/model/configuration identity, tools/skills, subject identity, input evidence identities, timing, termination reason, usage/budget and output identities.

If persistence is introduced:

```text
WORKFLOW STATE != TRAINING MEMORY
REVIEW HISTORY != USER PROFILE
PR CONTENT != TELEMETRY BY DEFAULT
```

Storage authority must define backend, tenant partitioning, encryption, retention, deletion, backup, migrations and observability.

---

## 11. Donor provenance ledger target

Before source copy/derivation, create a donor record pinning:

```text
repository = vercel-labs/openreview
head = 672deb21e70e471e0536d5ad7a67c14b8359e97e
tree = c21e89a74099fa878233950686e50be18c7c41ae
source path
source blob
upstream self-described license = MIT
root license file observed = NO
founder rights attestation = PROVIDED
adaptation class
Kodac destination
security semantic delta
```

Future upstream changes require a new donor snapshot.

---

## 12. Proposed implementation sequence

Planning only; every stage requires later canonical authorization.

### O0 — Donor qualification and provenance ledger

Exact snapshot, rights/provenance separation, adoption matrix and semantic-security delta. No runtime copy.

### O1 — Authenticated GitHub event evidence

Signature verification, replay/dedupe, fork classification, actor eligibility inputs and exact head binding.

### O2 — Durable workflow evidence kernel

Workflow/run/step identities, state machine, retries, idempotency, subject leases, cancellation, resume freshness and definition drift. No privileged side effects.

### O3 — Trust-gated progressive skill loader

Normalized manifests, discovery limits, collision/symlink/Unicode rules, admission classes, progressive disclosure and review-run skill identity binding.

### O4 — Read-only GitHub review product path

Mention-triggered review, bounded repository/PR reads, provider-neutral reviewer, inline findings/comments, review-completeness evidence, no branch writes. This is the preferred first user-visible slice.

### O5 — Admitted sandbox adapter

Backend-neutral interface, checkout provenance, resource/network/filesystem policy, dependency-install policy, TTL/cleanup evidence and command receipts.

### O6 — Proposal-only remediation

Immutable patch proposal, exact path/hunk identity, PR-native proposal UX, reaction/comment intent binding, no direct writes.

### O7 — K2-backed mutation path

Exact mutation authorization, K2 apply capability, exact-head CAS, receipt and post-tree evidence.

### O8 — Verification / review / K5 / Done Gate integration

Canonical verifier evidence, exact-target-head review evidence, later temporal re-review proof when separately supported, K5 reconciliation and Done Gate semantics.

### O9 — Durable persistence and recovery

Explicit persistence authority, tenant isolation, encryption, retention/deletion, migrations and crash recovery.

### O10 — Continuous assurance

Head/ruleset/policy/skill/workflow/provider/sandbox drift invalidation and targeted requalification.

### O11 — Multi-provider / multi-backend portability

At least a second provider/workflow/backend path where practical, with parity tests proving Kodac semantics are not Vercel- or Claude-specific.

---

## 13. KodacBench additions

Add adversarial benchmark families before mutation rollout:

- event ingestion: forged signatures, duplicates, replay, ordering, fork PR, moved head, unauthorized actor;
- durable workflow: worker crash after each step, stale resume, definition drift, cancellation race, competing workflow, unknown side-effect result;
- skills: duplicate/case/Unicode collisions, symlink escape, oversized/malformed skill, candidate shadowing, forbidden tool request;
- sandbox: secret discovery, network escape, path traversal, submodule/LFS edge cases, TTL/cleanup failure, dependency postinstall, resource exhaustion;
- review: zero findings on vulnerable patch, missed-file coverage, context truncation, missing specialist skill, provider disagreement;
- mutation: moved head, unauthorized path, rename/mode/binary changes, unknown result, retry after success, stale reaction;
- privacy/multi-tenancy: cache collision, cross-repo state lookup, skill leakage, redaction, secret-like output.

---

## 14. Rollout strategy

```text
STAGE 0 = INTERNAL / FIXTURE ONLY
STAGE 1 = READ-ONLY REVIEW
STAGE 2 = COMMENT / INLINE SUGGESTION PUBLICATION
STAGE 3 = PROPOSAL-ONLY REMEDIATION
STAGE 4 = EXPLICITLY APPROVED K2 MUTATION ON NON-PROTECTED TEST REPOS
STAGE 5 = GUARDED MUTATION ON PROTECTED REPOS WITH FULL RE-PROOF
STAGE 6 = BROADER ORGANIZATION ADOPTION
```

Every stage needs measurable rollback conditions and a policy-level kill switch.

---

## 15. Success metrics

```text
review latency
review completion rate
finding precision
finding recall on benchmark fixtures
coverage completeness
false-positive burden
stale-run rejection correctness
duplicate-side-effect rate = 0
unauthorized-side-effect rate = 0
secret exposure incidents = 0
cross-tenant leakage incidents = 0
cleanup failure detection rate
workflow recovery rate
human acceptance rate
verification pass rate after accepted remediation
cost per completed review
provider portability parity
```

Security invariants outrank convenience metrics.

---

## 16. Build-vs-copy decision rule

Direct/derived copying is preferred only when rights exist, exact donor blob is pinned, behavior fits or can be safely adapted, dependencies are admitted, copied surface is simpler than reimplementation, security delta is explicit, and tests cover donor-specific edge cases.

Current expectation:

```text
DURABLE WORKFLOW SHAPE = ADAPT / PARTIAL DERIVATION POSSIBLE
PROGRESSIVE SKILL DISCLOSURE = ADAPT / SMALL UTILITY DERIVATION POSSIBLE AFTER HARDENING
PR-NATIVE UX = ADAPT
SANDBOX LIFECYCLE SHAPE = ADAPT
GENERAL BASH / GH AUTHORITY = REIMPLEMENT AS TYPED CAPABILITIES
DIRECT COMMIT/PUSH = DO NOT COPY
FAIL-OPEN PROTECTION CHECK = DO NOT COPY
BROAD TOKEN EXPOSURE = DO NOT COPY
DYNAMIC INSTALL AUTHORITY = DO NOT COPY AS DEFAULT
```

---

## 17. Required Kodac-owned interfaces

Define stable provider-neutral interfaces before provider-specific implementation:

```text
EventIngressAdapter
InteractionIntentAdapter
RepositoryReadAdapter
ReviewProviderAdapter
WorkflowRuntimeAdapter
SkillRegistryAdapter
SandboxExecutionAdapter
PersistenceAdapter
ReviewPublisherAdapter
PatchProposalAdapter
K2MutationBridge
EvidenceStoreAdapter
FreshnessInvalidationAdapter
```

Core evidence contracts must not import provider SDK object types.

---

## 18. Security invariants

```text
UNTRUSTED INPUT NEVER BECOMES AUTHORITY BY TEXT
UNKNOWN AUTHORITY STATE FAILS CLOSED
MODEL NEVER RECEIVES BROAD WRITE CREDENTIAL BY DEFAULT
FORK PR NEVER RECEIVES TRUSTED SECRET BY DEFAULT
DURABLE RETRY NEVER IMPLIES SIDE-EFFECT RETRY
REACTION NEVER IMPLIES MUTATION WITHOUT POLICY
SKILL LOAD NEVER IMPLIES TOOL AUTHORITY
SANDBOX NEVER IMPLIES TRUST
ZERO FINDINGS NEVER IMPLIES COMPLETE REVIEW
GREEN TESTS NEVER IMPLY VERIFIED
EXECUTED NEVER IMPLIES DONE
UPSTREAM PERMISSION NEVER IMPLIES KODAC RUNTIME ADMISSION
```

---

## 19. Program completion criteria

The OpenReview-derived program is not complete until canonical evidence proves authenticated/replay-safe event ingestion; durable workflow retry/resume/lease/cancellation/migration semantics; trust-gated skills; provider-neutral read-only review; admitted sandbox cleanup proof; immutable patch proposals; K2-backed exact mutation; verification/review/K5/Done Gate integration; persistence privacy/tenant rules if enabled; continuous freshness invalidation; adversarial benchmarks; no broad shell/GitHub credential escape hatch in the default privileged path; exact donor mapping for copied/derived code; and separate current-view/release proof.

---

## 20. Immediate sequencing relative to live P7

```text
FINISH CURRENTLY AUTHORIZED P7 WORK UNDER ITS OWN GOVERNANCE
-> COMPLETE REQUIRED P7 RECONCILIATIONS / SUCCESSOR ANALYSIS
-> DO NOT INFER P8 FROM THIS PLAN
-> AUTHORIZE EACH OPENREVIEW-DERIVED UNIT SEPARATELY
-> PREFER READ-ONLY PRODUCT VALUE BEFORE WRITE AUTHORITY
-> ADD MUTATION ONLY AFTER K2 / SANDBOX / PROOF GATES ARE READY
```

No OpenReview-derived implementation may leapfrog unresolved P7 trust requirements.

---

## 21. Canonicalization requirements

This file is a planning candidate until independently qualified, guarded-merged and post-merge proven.

```text
BASE = THEN-CURRENT CANONICAL MAIN
BEHIND_BY = 0
CHANGED_PATHS = EXACTLY THIS ONE PLANNING FILE
OPENREVIEW HEAD = 672deb21e70e471e0536d5ad7a67c14b8359e97e OR EXPLICITLY REQUALIFIED
UPSTREAM SELF-DESCRIBED LICENSE = MIT
ROOT LICENSE FILE = NOT OBSERVED AT REVIEWED SNAPSHOT
FOUNDER RIGHTS ATTESTATION = RECORDED AS FOUNDER-SUPPLIED, NOT INDEPENDENTLY VERIFIED
REQUIRED CI = TERMINAL SUCCESS OR TRUTHFUL DOCS-ONLY NON-APPLICABILITY
SUBSTANTIVE SEMANTIC / SECURITY / GOVERNANCE REVIEW = CLEAN
KNOWN ACTIONABLE DEFECTS = 0
UNRESOLVED ACTIONABLE THREADS = 0
RULESET 20707483 = ACTIVE / NO BYPASS
WAIVER = NO
```

Any head movement invalidates exact-head qualification evidence.

---

## 22. Non-grants

```text
THIS PLAN != OPENREVIEW RUNTIME IMPORT AUTHORITY
THIS PLAN != OPENREVIEW DEPENDENCY INSTALL AUTHORITY
THIS PLAN != VERCEL WORKFLOW AUTHORITY
THIS PLAN != VERCEL SANDBOX AUTHORITY
THIS PLAN != REDIS AUTHORITY
THIS PLAN != CLAUDE / ANTHROPIC AUTHORITY
THIS PLAN != GITHUB APP CREATION OR INSTALLATION AUTHORITY
THIS PLAN != WEBHOOK ACTIVATION AUTHORITY
THIS PLAN != NETWORK AUTHORITY
THIS PLAN != SECRET ACCESS AUTHORITY
THIS PLAN != BASH AUTHORITY
THIS PLAN != GH CLI AUTHORITY
THIS PLAN != DIRECT PUSH AUTHORITY
THIS PLAN != PATCH AUTHORITY
THIS PLAN != AUTOFIX AUTHORITY
THIS PLAN != P7 SUCCESSOR AUTHORITY
THIS PLAN != P8 AUTHORITY
THIS PLAN != P9 AUTHORITY
THIS PLAN != RELEASE AUTHORITY
THIS PLAN != PROJECT COMPLETION
```

---

## 23. Final planning thesis

```text
OPENREVIEW FOR PRODUCT ERGONOMICS
+ KODAC FOR TRUST, AUTHORITY, EVIDENCE, AND RE-PROOF
= TARGET DIRECTION
```

The winning implementation is not the largest amount of donor code copied. It is the smallest amount of well-qualified donor logic needed to accelerate a Kodac-owned architecture whose security semantics remain stronger than the donor's.
