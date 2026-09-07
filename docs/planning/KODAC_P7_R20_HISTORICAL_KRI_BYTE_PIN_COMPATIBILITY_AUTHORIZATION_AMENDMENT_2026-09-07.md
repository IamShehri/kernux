# Kodac P7-R20 Historical KRI Byte-Pin Compatibility Authorization Amendment

## Record identity

```text
STATUS = AUTHORIZATION_AMENDMENT_CANDIDATE / NOT_CANONICAL
DATE = 2026-09-07
FOUNDER_CONTINUATION_AUTHORITY = EXPLICIT_KODAC_CONTINUATION_WITH_ORDINARY_AUTHORIZED_APPROVALS_2026-09-07
CANONICAL_BASE = f8bb2241b0cadfc78b78f365efe2cc80c9cb7846
CANONICAL_BASE_TREE = 2389f16c7ffeab530064ab37331d636400b94b27
P7_R20_AUTHORIZATION_PR = #434
P7_R20_AUTHORIZATION_MERGE = 33397d89f498df6c3087ef7d2103e494b780c7d9
P7_R20_AUTHORIZATION_PROOF = 5573483948
BLOCKED_IMPLEMENTATION_PR = #436
BLOCKED_IMPLEMENTATION_HEAD = c0df667fc321c9ecfd48f8c668c543408e133247
AUTHORIZED_R20_EXECUTOR_PREDECESSOR_BLOB = 1ff5d7273512af2f6ccb5c1d70ccb54369bac5e4
AUTHORIZED_R20_EXECUTOR_CANDIDATE_BLOB = f7e969672182e3ee3209f9677522e6ffc3caa210
WAIVER = NO
```

This is a documentation-only forward authorization amendment candidate. It does not itself modify runtime code, schemas, tests, workflows, dependencies, providers, models, services, persistence, network access, secrets, rulesets, release state, P8/P9 authority, or project-completion truth.

Until this exact one-path candidate independently qualifies, merges normally into protected `main` under an exact expected-head guard, and receives mandatory post-merge proof, the predecessor P7-R20 authorization remains controlling without this amendment. PR #436 must remain unmerged and must not modify the two additional historical guard-test paths named below.

## 1. Exact live blocker

The canonical P7-R20 authorization requires one bounded change to:

```text
packages/kodac-runtime/src/reviewer-intelligence/executor.ts
```

The permitted executor change is only to expose the already-existing canonical `validateRun` semantics through a standalone exported `validateReviewRunRecord` function and to have `ReviewerExecutionRuntime.validateReviewRunRecord` delegate to that same function.

`packages/kodac-runtime/src/index.ts` already re-exports `reviewer-intelligence/executor.ts` through an existing `export *` declaration. Therefore the exact R20-required standalone export is package-visible as an unavoidable consequence of the pre-existing package-root export wiring. This amendment makes that consequence explicit: exactly `validateReviewRunRecord` may become package-visible through the existing `export *`; no `index.ts` edit, new export wiring, alias, additional public symbol, CLI/API integration, or broader public-interface change is authorized.

PR #436 implements that bounded executor delta. Its current executor blob is:

```text
packages/kodac-runtime/src/reviewer-intelligence/executor.ts
= f7e969672182e3ee3209f9677522e6ffc3caa210
```

Fresh exact-head CI on PR #436 head `c0df667fc321c9ecfd48f8c668c543408e133247` proves the R20-specific tests pass, while the full runtime matrix fails on Linux, macOS, and Windows only because two older regression guards still require the pre-R20 executor blob:

```text
packages/kodac-runtime/test/kri-r4-reviewer-qualification.test.ts
packages/kodac-runtime/test/p4-r1-reviewer-claim-envelope.test.ts
```

Both currently pin:

```text
packages/kodac-runtime/src/reviewer-intelligence/executor.ts
= 1ff5d7273512af2f6ccb5c1d70ccb54369bac5e4
```

Observed exact-head CI evidence:

```text
GOVERNANCE_RUN = 34148719444 / SUCCESS
K2_RUNTIME_RUN = 34148719337 / FAILURE
UBUNTU_JOB = 101826254224 / TEST FAILURE
MACOS_JOB = 101826254217 / TEST FAILURE
WINDOWS_JOB = 101826254238 / TEST FAILURE
K2_RUNTIME_GATE_JOB = 101826578800 / FAILURE
FULL_RUNTIME_TESTS = 1840
FULL_RUNTIME_PASS = 1834
FULL_RUNTIME_FAIL = 2
FULL_RUNTIME_SKIPPED = 4
R20_SPECIFIC_TESTS = PASS
ONLY_FAILURE_CLASS = HISTORICAL_EXECUTOR_BYTE_PIN_MISMATCH
```

This is an authorization-compatibility defect. It is not a platform waiver candidate and it may not be bypassed, ignored, marked non-applicable, or repaired outside canonical authority.

## 2. Historical evidence preserved

The following historical KRI-R2/R3 predecessor blobs remain evidence and are not rewritten by this amendment:

```text
packages/kodac-runtime/src/reviewer-intelligence/contracts.ts
= 5ebe91c3d98f626651230989564d367d0600863c
packages/kodac-runtime/src/reviewer-intelligence/runtime.ts
= 4c5d01293d37b14ad4b017ec1e7dd17055393113
packages/kodac-runtime/src/reviewer-intelligence/provider-contracts.ts
= 97e95f3cd19aebf63c86dba254bc8e55f919c031
packages/kodac-runtime/src/reviewer-intelligence/executor.ts
PRE_R20_HISTORICAL_PREDECESSOR = 1ff5d7273512af2f6ccb5c1d70ccb54369bac5e4
```

The earlier P4-R1 authorization record remains immutable historical evidence. This forward amendment does not edit or rewrite that record. It only admits the later canonically authorized P7-R20 executor evolution as a successor state.

## 3. Amendment-unit changed-file set

This authorization-amendment PR may change exactly one path and no second path:

```text
docs/planning/KODAC_P7_R20_HISTORICAL_KRI_BYTE_PIN_COMPATIBILITY_AUTHORIZATION_AMENDMENT_2026-09-07.md
```

It may not implement the compatibility repair, modify PR #436, edit roadmap/current-view files, mutate historical authorization records, change workflows, or alter rulesets.

## 4. Exact later P7-R20 compatibility-repair allowlist

Only after this exact amendment becomes `CLOSED_CANONICAL` and post-merge proven, the active P7-R20 implementation candidate may expand its changed-file allowlist from the existing four paths to exactly these six paths:

```text
packages/kodac-runtime/src/reviewer-intelligence/executor.ts
packages/kodac-runtime/src/remediation/p7-exact-target-head-review-run-evidence-binding.ts
schema/p7-exact-target-head-review-run-evidence-binding.schema.json
packages/kodac-runtime/test/p7-r20-exact-target-head-review-run-evidence-binding.test.ts
packages/kodac-runtime/test/kri-r4-reviewer-qualification.test.ts
packages/kodac-runtime/test/p4-r1-reviewer-claim-envelope.test.ts
```

No seventh path is authorized.

The two newly admitted paths are test-only compatibility repairs. They do not authorize any KRI-R4, P4-R1, provider, reviewer, runtime, schema, workflow, dependency, service, persistence, network, secret, release, P8/P9, or Done Gate semantic expansion. The only package-visible surface consequence remains the exact R20-required `validateReviewRunRecord` export inherited through the already-existing `index.ts` `export *`; no package-root wiring change or additional public interface is authorized.

## 5. Exact permitted compatibility substitutions

For each of the two newly admitted test files, the only permitted semantic changes are:

1. preserve the existing expected blobs for `contracts.ts`, `runtime.ts`, and `provider-contracts.ts` exactly;
2. preserve the pre-R20 executor blob `1ff5d7273512af2f6ccb5c1d70ccb54369bac5e4` as the named historical predecessor in repository governance/evidence;
3. change the active executor pin in the test to exactly `f7e969672182e3ee3209f9677522e6ffc3caa210`;
4. adjust only the affected test title/description as needed so it no longer falsely claims that the executor bytes themselves remain unchanged after the separately authorized P7-R20 evolution;
5. retain fail-closed exact-byte checking for the admitted current executor candidate;
6. make no other test semantic, fixture, threshold, assertion, import, helper, skip, timeout, retry, platform, or coverage change.

Any different executor blob, any relaxation to wildcard/multi-version acceptance, any deleted pin, any skipped assertion, or any other change in either test file invalidates this amendment for that candidate and requires separately canonical forward authority.

## 6. Existing P7-R20 implementation semantics remain unchanged

This amendment does not broaden the P7-R20 product/runtime objective. The active implementation must still:

```text
REVALIDATE_EXACT_P7_R19_PREDECESSOR = YES
REVALIDATE_ONE_KRI_R3_REVIEW_RUN = YES
REVIEW_STATUS = COMPLETED_ONLY
CANONICAL_BASE_MATCH = REQUIRED
REVIEWED_HEAD_MATCH = EXACT_P7_R19_TARGET_HEAD
EVALUATED_HEAD_MATCH = EXACT_P7_R19_TARGET_HEAD
ACCEPTED_CLAIM_COUNT = 0
FINDING_IDENTITIES = EMPTY
PURE_EVIDENCE_BINDING = YES
PROVIDER_INVOCATION = NO
NETWORK = NO
FILESYSTEM_MUTATION = NO
PERSISTENCE = NO
SECRETS = NO
K2_INVOCATION = NO
VERIFICATION_EXECUTION = NO
PATCH_APPLICATION = NO
PATCH_RETRY_AUTHORITY = NO
AUTOFIX = NO
NEW_DEPENDENCY = NO
R20_VALIDATE_REVIEW_RUN_RECORD_PACKAGE_VISIBLE = YES / EXISTING_EXPORT_STAR_ONLY
PACKAGE_ROOT_INDEX_MUTATION = NO
ADDITIONAL_PUBLIC_EXPORT = NO
CLI_API_PRODUCT_INTEGRATION = NOT_AUTHORIZED
P8_P9_AUTHORITY = NO
RELEASE_AUTHORITY = NO
PROJECT_COMPLETION = NOT_ESTABLISHED
```

## 7. Qualification and adoption gate

This amendment candidate is not canonical merely because it exists.

Before adoption it must satisfy all applicable canonical gates on one frozen exact head:

```text
EXACT_CHANGED_PATHS = ONE AUTHORIZATION-AMENDMENT DOCUMENT ONLY
REQUIRED_CI = GREEN
SUBSTANTIVE_SEMANTIC_SECURITY_GOVERNANCE_REVIEW = REQUIRED
REVIEW_THREADS = RESOLVED
LIVE_RULESET = VERIFIED
EXPECTED_HEAD_GUARD = REQUIRED
NORMAL_PROTECTED_MAIN_MERGE = REQUIRED
POST_MERGE_PROOF = REQUIRED
WAIVER = NO
```

Skipped, stale, billing-only, rate-limited, status-only, failed-to-start, or non-substantive reviewer output does not prove the required substantive review.

## 8. Post-adoption repair sequence

After and only after this amendment is canonical and post-merge proven:

1. forward-reconcile PR #436 with the new canonical `main` without rebase, force-push, or destructive history rewrite;
2. modify exactly the two newly admitted historical guard-test paths using the substitutions in Section 5;
3. reverify that the complete PR diff contains exactly the six authorized paths and no seventh path;
4. rerun focused R20 tests and full regression on Linux, macOS, and Windows as applicable;
5. require exact-head CI/check qualification;
6. require fresh independent substantive semantic/security/governance review on the unchanged exact head;
7. reconcile all review threads and reverify the live ruleset;
8. merge only through the canonical guarded expected-head path if every gate is genuinely satisfied;
9. perform mandatory post-merge proof before declaring P7-R20 implementation closure;
10. reconcile current views and perform fresh successor-authority analysis without inferring P8/P9 or project-completion authority.

## 9. Explicit non-equivalences

```text
AUTHORIZATION_AMENDMENT_CANDIDATE != CANONICAL_AUTHORITY
CANONICAL_AMENDMENT != P7_R20_IMPLEMENTATION_CLOSED
HISTORICAL_PIN_COMPATIBILITY != HISTORICAL_RECORD_REWRITE
R20_EXECUTOR_SUCCESSOR_BLOB != REVIEWER_SEMANTIC_EXPANSION
R20_VALIDATE_REVIEW_RUN_RECORD_PACKAGE_VISIBILITY != GENERAL_PACKAGE_API_EXPANSION
R20_TEST_COMPATIBILITY_REPAIR != TEST_RELAXATION
R20_TEST_COMPATIBILITY_REPAIR != CI_WAIVER
R20_TEST_COMPATIBILITY_REPAIR != P8_P9_AUTHORITY
R20_TEST_COMPATIBILITY_REPAIR != RELEASE_AUTHORITY
R20_TEST_COMPATIBILITY_REPAIR != PROJECT_COMPLETION
```
