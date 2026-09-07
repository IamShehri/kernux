import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import {
  P7_R23_REVIEW_COVERAGE_UNIVERSE_BOUND_STATE,
  P7_R23_REVIEW_COVERAGE_UNIVERSE_EVIDENCE_BINDING_VERSION,
  P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS,
  buildP7ReviewCoverageUniverseEvidenceBinding,
  validateP7ReviewCoverageUniverseEvidenceBinding,
  type P7ReviewCoveragePathDescriptor,
  type P7ReviewCoverageUniverseEvidenceBinding,
  type P7ReviewCoverageUniverseEvidenceBindingBuildInput,
} from "../src/remediation/p7-review-coverage-universe-evidence-binding.ts"

type UnknownRecord = Record<string, unknown>

const SHA1_A = "a".repeat(40)
const SHA1_B = "b".repeat(40)
const SHA1_C = "c".repeat(40)
const SHA1_D = "d".repeat(40)
const SHA1_E = "e".repeat(40)
const SHA256_A = "1".repeat(64)
const SHA256_B = "2".repeat(64)

function descriptor(
  path: string,
  overrides: Partial<P7ReviewCoveragePathDescriptor> = {},
): P7ReviewCoveragePathDescriptor {
  return {
    path,
    previousPath: null,
    changeKind: "modified",
    objectKind: "regular_file",
    objectIdentity: SHA1_D,
    byteSize: 128,
    fileMode: "100644",
    contentDisposition: "reviewable_text",
    encodingDisposition: "utf8",
    isGeneratedOrDerived: false,
    isReferencedHiddenPayload: false,
    policyDisposition: "included",
    policyReason: null,
    ...overrides,
  }
}

function mixedInput(): P7ReviewCoverageUniverseEvidenceBindingBuildInput {
  return {
    repositoryIdentity: "github:TheHalfMoon/Kodac",
    canonicalBase: SHA1_A,
    targetHead: SHA1_B,
    targetTree: SHA1_C,
    changedPathSetIdentity: SHA256_A,
    changedPaths: [
      descriptor("src/A.ts", { byteSize: 111 }),
      descriptor("assets/tool.bin", {
        objectIdentity: "1".repeat(40),
        byteSize: 4096,
        contentDisposition: "opaque_binary_or_compiled",
        encodingDisposition: "binary",
      }),
      descriptor("cache/payload.pyc", {
        objectIdentity: "2".repeat(40),
        byteSize: 2048,
        contentDisposition: "opaque_binary_or_compiled",
        encodingDisposition: "binary",
        isReferencedHiddenPayload: true,
      }),
      descriptor("dist/generated.js", {
        objectIdentity: "3".repeat(40),
        contentDisposition: "generated_or_derived",
        encodingDisposition: "utf8",
        isGeneratedOrDerived: true,
      }),
      descriptor("src/legacy.txt", {
        objectIdentity: "4".repeat(40),
        contentDisposition: "unsupported_or_suspicious_encoding",
        encodingDisposition: "non_utf8_declared_or_detected",
      }),
      descriptor("big/archive.txt", {
        objectIdentity: "5".repeat(40),
        byteSize: 9_000_000,
        contentDisposition: "oversized",
        encodingDisposition: "unknown",
      }),
      descriptor("link/config", {
        objectKind: "symlink",
        objectIdentity: "6".repeat(40),
        byteSize: 12,
        fileMode: "120000",
        contentDisposition: "policy_excluded",
        encodingDisposition: "not_applicable",
        policyDisposition: "excluded_with_reason",
        policyReason: "Symlink target must be adjudicated by later path-review policy.",
      }),
      descriptor("vendor/lib", {
        objectKind: "submodule_gitlink",
        objectIdentity: "7".repeat(40),
        byteSize: 0,
        fileMode: "160000",
        contentDisposition: "policy_excluded",
        encodingDisposition: "not_applicable",
        policyDisposition: "excluded_with_reason",
        policyReason: "Gitlink requires separately bound submodule evidence.",
      }),
      descriptor("assets/model.bin", {
        objectIdentity: "8".repeat(40),
        byteSize: 132,
        contentDisposition: "git_lfs_pointer",
        encodingDisposition: "utf8",
      }),
      descriptor("docs/excluded.md", {
        objectIdentity: "9".repeat(40),
        contentDisposition: "policy_excluded",
        encodingDisposition: "utf8",
        policyDisposition: "excluded_with_reason",
        policyReason: "Explicit bounded policy exclusion; still visible as coverage debt.",
      }),
      descriptor("secret/unreadable.dat", {
        objectIdentity: "0".repeat(40),
        contentDisposition: "unreadable",
        encodingDisposition: "unknown",
      }),
      descriptor("node_modules/hidden.js", {
        objectIdentity: "f".repeat(40),
        contentDisposition: "referenced_hidden_payload",
        encodingDisposition: "utf8",
        isReferencedHiddenPayload: true,
      }),
      descriptor("old/deleted.ts", {
        changeKind: "deleted",
        objectKind: "missing_after_change",
        objectIdentity: null,
        byteSize: 0,
        fileMode: "000000",
        contentDisposition: "not_applicable_deleted",
        encodingDisposition: "not_applicable",
        policyDisposition: "not_applicable",
      }),
    ],
  }
}

function build(input = mixedInput()): P7ReviewCoverageUniverseEvidenceBinding {
  return buildP7ReviewCoverageUniverseEvidenceBinding(input)
}

function mutateFirst(
  mutator: (item: P7ReviewCoveragePathDescriptor) => P7ReviewCoveragePathDescriptor,
): P7ReviewCoverageUniverseEvidenceBindingBuildInput {
  const input = mixedInput()
  return { ...input, changedPaths: input.changedPaths.map((item, index) => (index === 0 ? mutator(item) : item)) }
}

test("P7-R23 binds a deterministic mixed review coverage universe without dropping opaque surfaces", () => {
  const output = build()

  assert.equal(output.version, P7_R23_REVIEW_COVERAGE_UNIVERSE_EVIDENCE_BINDING_VERSION)
  assert.equal(output.state, P7_R23_REVIEW_COVERAGE_UNIVERSE_BOUND_STATE)
  assert.equal(output.changedPathCount, 13)
  assert.match(output.evidenceIdentity, /^[0-9a-f]{64}$/)
  assert.match(output.reviewUniverseIdentity, /^[0-9a-f]{64}$/)

  assert.deepEqual(output.reviewUniversePaths, [
    "assets/model.bin",
    "assets/tool.bin",
    "big/archive.txt",
    "cache/payload.pyc",
    "dist/generated.js",
    "docs/excluded.md",
    "link/config",
    "node_modules/hidden.js",
    "old/deleted.ts",
    "secret/unreadable.dat",
    "src/A.ts",
    "src/legacy.txt",
    "vendor/lib",
  ])
  assert.deepEqual(output.reviewableTextPaths, ["src/A.ts"])
  assert.deepEqual(output.opaqueBinaryPaths, ["assets/tool.bin", "cache/payload.pyc"])
  assert.deepEqual(output.generatedOrDerivedPaths, ["dist/generated.js"])
  assert.deepEqual(output.referencedHiddenPayloadPaths, ["cache/payload.pyc", "node_modules/hidden.js"])
  assert.deepEqual(output.unreadablePaths, ["secret/unreadable.dat"])
  assert.deepEqual(output.unsupportedEncodingPaths, ["src/legacy.txt"])
  assert.deepEqual(output.oversizedPaths, ["big/archive.txt"])
  assert.deepEqual(output.symlinkPaths, ["link/config"])
  assert.deepEqual(output.submodulePaths, ["vendor/lib"])
  assert.deepEqual(output.lfsPointerPaths, ["assets/model.bin"])
  assert.deepEqual(output.policyExcludedPaths, ["docs/excluded.md", "link/config", "vendor/lib"])
  assert.deepEqual(output.deletedPaths, ["old/deleted.ts"])

  assert.equal(new Set(output.reviewUniversePaths).size, output.changedPathCount)
  assert.equal(output.reviewUniversePaths.includes("cache/payload.pyc"), true)
  assert.equal(output.reviewUniversePaths.includes("node_modules/hidden.js"), true)
  assert.equal(output.reviewUniversePaths.includes("assets/tool.bin"), true)
  assert.equal(output.reviewUniversePaths.includes("src/legacy.txt"), true)
})

test("P7-R23 canonicalizes input order and is content-addressed", () => {
  const input = mixedInput()
  const first = build(input)
  const reversed = build({ ...input, changedPaths: [...input.changedPaths].reverse() })

  assert.deepEqual(first, reversed)
  assert.equal(first.reviewUniverseIdentity, reversed.reviewUniverseIdentity)
  assert.equal(first.evidenceIdentity, reversed.evidenceIdentity)
  assert.deepEqual(validateP7ReviewCoverageUniverseEvidenceBinding(first, input), first)
})

test("P7-R23 preserves case-only distinct repository paths", () => {
  const input: P7ReviewCoverageUniverseEvidenceBindingBuildInput = {
    ...mixedInput(),
    changedPaths: [descriptor("src/File.ts"), descriptor("src/file.ts", { objectIdentity: SHA1_E })],
  }
  const output = build(input)
  assert.deepEqual(output.reviewUniversePaths, ["src/File.ts", "src/file.ts"])
  assert.equal(output.changedPathCount, 2)
})

test("P7-R23 binds explicit rename lineage without inferring it from filenames", () => {
  const input: P7ReviewCoverageUniverseEvidenceBindingBuildInput = {
    ...mixedInput(),
    changedPaths: [
      descriptor("src/new-name.ts", {
        changeKind: "renamed",
        previousPath: "src/old-name.ts",
      }),
    ],
  }
  const output = build(input)
  assert.deepEqual(output.reviewUniversePaths, ["src/new-name.ts"])

  assert.throws(
    () => build({ ...input, changedPaths: [descriptor("src/new-name.ts", { changeKind: "renamed" })] }),
    /previousPath/,
  )
  assert.throws(
    () => build({ ...input, changedPaths: [descriptor("src/new-name.ts", { previousPath: "src/old-name.ts" })] }),
    /previousPath/,
  )
})

test("P7-R23 identity changes when authority-relevant repository facts change", () => {
  const baseline = build()
  const variants: P7ReviewCoverageUniverseEvidenceBindingBuildInput[] = [
    { ...mixedInput(), canonicalBase: SHA1_E },
    { ...mixedInput(), targetHead: SHA1_E },
    { ...mixedInput(), targetTree: SHA1_E },
    { ...mixedInput(), changedPathSetIdentity: SHA256_B },
    { ...mixedInput(), repositoryIdentity: "github:TheHalfMoon/Kodac-alt" },
  ]

  for (const input of variants) {
    const candidate = build(input)
    assert.notEqual(candidate.reviewUniverseIdentity, baseline.reviewUniverseIdentity)
    assert.notEqual(candidate.evidenceIdentity, baseline.evidenceIdentity)
  }
})

test("P7-R23 identity changes when normalized path evidence changes", () => {
  const baseline = build()
  const variants = [
    mutateFirst((item) => ({ ...item, path: "src/B.ts" })),
    mutateFirst((item) => ({ ...item, changeKind: "added" })),
    mutateFirst((item) => ({ ...item, objectIdentity: SHA1_E })),
    mutateFirst((item) => ({ ...item, byteSize: item.byteSize + 1 })),
    mutateFirst((item) => ({ ...item, fileMode: "100755" })),
    mutateFirst((item) => ({ ...item, encodingDisposition: "utf8_bom" })),
    mutateFirst((item) => ({ ...item, isGeneratedOrDerived: true })),
    mutateFirst((item) => ({ ...item, isReferencedHiddenPayload: true })),
    mutateFirst((item) => ({
      ...item,
      policyDisposition: "excluded_with_reason",
      policyReason: "Explicit test policy debt.",
    })),
    mutateFirst((item) => ({
      ...item,
      contentDisposition: "generated_or_derived",
      isGeneratedOrDerived: true,
    })),
  ]

  for (const input of variants) {
    const candidate = build(input)
    assert.notEqual(candidate.reviewUniverseIdentity, baseline.reviewUniverseIdentity)
    assert.notEqual(candidate.evidenceIdentity, baseline.evidenceIdentity)
  }
})

test("P7-R23 rejects invalid Git identities, path-set identities and path budgets", () => {
  assert.throws(() => build({ ...mixedInput(), canonicalBase: "A".repeat(40) }), /canonicalBase/)
  assert.throws(() => build({ ...mixedInput(), targetHead: "x" }), /targetHead/)
  assert.throws(() => build({ ...mixedInput(), targetTree: "f".repeat(39) }), /targetTree/)
  assert.throws(() => build({ ...mixedInput(), changedPathSetIdentity: "1".repeat(63) }), /changedPathSetIdentity/)
  assert.throws(() => build({ ...mixedInput(), changedPaths: [] }), /changedPaths/)

  const tooMany = Array.from({ length: P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS.maxChangedPaths + 1 }, (_, index) =>
    descriptor(`src/${index}.ts`, { objectIdentity: index.toString(16).padStart(40, "0").slice(-40) }),
  )
  assert.throws(() => build({ ...mixedInput(), changedPaths: tooMany }), /changedPaths/)
})

test("P7-R23 rejects non-canonical and escaping repository paths", () => {
  const invalid = [
    "../escape",
    "./relative",
    "/absolute",
    "src\\windows.ts",
    "src//double.ts",
    "src/trailing/",
    "src/./dot.ts",
    "src/../up.ts",
    "src/\u0000nul.ts",
    "src/\u0007bell.ts",
    `src/${"e\u0301"}.ts`,
  ]

  for (const path of invalid) {
    assert.throws(() => build({ ...mixedInput(), changedPaths: [descriptor(path)] }), /path|POSIX|NFC/)
  }

  const longPath = `src/${"a".repeat(P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS.maxPathCodePoints)}.ts`
  assert.throws(() => build({ ...mixedInput(), changedPaths: [descriptor(longPath)] }), /path code-point budget/)
})

test("P7-R23 rejects duplicate exact paths without collapsing evidence", () => {
  assert.throws(
    () => build({ ...mixedInput(), changedPaths: [descriptor("src/a.ts"), descriptor("src/a.ts", { objectIdentity: SHA1_E })] }),
    /duplicate canonical paths/,
  )
})

test("P7-R23 rejects inconsistent deleted-path semantics", () => {
  const deleted = descriptor("old.ts", {
    changeKind: "deleted",
    objectKind: "missing_after_change",
    objectIdentity: null,
    byteSize: 0,
    fileMode: "000000",
    contentDisposition: "not_applicable_deleted",
    encodingDisposition: "not_applicable",
    policyDisposition: "not_applicable",
  })
  assert.doesNotThrow(() => build({ ...mixedInput(), changedPaths: [deleted] }))

  const invalid: P7ReviewCoveragePathDescriptor[] = [
    { ...deleted, objectKind: "regular_file" },
    { ...deleted, objectIdentity: SHA1_D },
    { ...deleted, byteSize: 1 },
    { ...deleted, fileMode: "100644" },
    { ...deleted, contentDisposition: "reviewable_text", encodingDisposition: "utf8" },
    { ...deleted, encodingDisposition: "utf8" },
    { ...deleted, isGeneratedOrDerived: true },
    { ...deleted, policyDisposition: "included" },
  ]
  for (const item of invalid) assert.throws(() => build({ ...mixedInput(), changedPaths: [item] }))
})

test("P7-R23 rejects inconsistent object-kind and Git-mode semantics", () => {
  assert.throws(
    () => build({ ...mixedInput(), changedPaths: [descriptor("link", { objectKind: "symlink", fileMode: "100644", encodingDisposition: "not_applicable" })] }),
    /fileMode/,
  )
  assert.throws(
    () => build({ ...mixedInput(), changedPaths: [descriptor("module", { objectKind: "submodule_gitlink", fileMode: "100644", encodingDisposition: "not_applicable" })] }),
    /fileMode/,
  )
  assert.throws(
    () => build({ ...mixedInput(), changedPaths: [descriptor("src/a.ts", { objectKind: "missing_after_change" })] }),
    /objectKind/,
  )
  assert.throws(
    () => build({ ...mixedInput(), changedPaths: [descriptor("src/a.ts", { objectIdentity: null })] }),
    /objectIdentity/,
  )
})

test("P7-R23 rejects inconsistent content and encoding dispositions", () => {
  const invalid: P7ReviewCoveragePathDescriptor[] = [
    descriptor("a", { contentDisposition: "reviewable_text", encodingDisposition: "binary" }),
    descriptor("b", { contentDisposition: "opaque_binary_or_compiled", encodingDisposition: "utf8" }),
    descriptor("c", { contentDisposition: "unsupported_or_suspicious_encoding", encodingDisposition: "utf8" }),
    descriptor("d", { contentDisposition: "generated_or_derived", isGeneratedOrDerived: false }),
    descriptor("e", { contentDisposition: "referenced_hidden_payload", isReferencedHiddenPayload: false }),
    descriptor("f", { contentDisposition: "git_lfs_pointer", objectKind: "symlink", fileMode: "120000", encodingDisposition: "not_applicable" }),
    descriptor("g", { contentDisposition: "policy_excluded", policyDisposition: "included" }),
  ]
  for (const item of invalid) assert.throws(() => build({ ...mixedInput(), changedPaths: [item] }))
})

test("P7-R23 requires explicit policy debt reasons and forbids stray reasons", () => {
  assert.throws(
    () => build({ ...mixedInput(), changedPaths: [descriptor("a", { policyDisposition: "excluded_with_reason" })] }),
    /policyReason/,
  )
  assert.throws(
    () => build({ ...mixedInput(), changedPaths: [descriptor("a", { policyReason: "stray" })] }),
    /policyReason/,
  )
})

test("P7-R23 rejects unknown descriptor fields and enum values", () => {
  const extra = { ...descriptor("src/a.ts"), unexpected: true } as unknown as P7ReviewCoveragePathDescriptor
  assert.throws(() => build({ ...mixedInput(), changedPaths: [extra] }), /unknown field/)

  const invalidEnum = { ...descriptor("src/a.ts"), contentDisposition: "safe" } as unknown as P7ReviewCoveragePathDescriptor
  assert.throws(() => build({ ...mixedInput(), changedPaths: [invalidEnum] }), /unsupported value/)
})

test("P7-R23 rejects hostile Proxy, accessor, symbol and custom-prototype input", () => {
  const proxied = new Proxy(mixedInput(), {})
  assert.throws(() => buildP7ReviewCoverageUniverseEvidenceBinding(proxied), /Proxy/)

  const accessor = mixedInput() as unknown as UnknownRecord
  Object.defineProperty(accessor, "repositoryIdentity", { enumerable: true, get: () => "github:TheHalfMoon/Kodac" })
  assert.throws(() => buildP7ReviewCoverageUniverseEvidenceBinding(accessor as unknown as P7ReviewCoverageUniverseEvidenceBindingBuildInput), /data property/)

  const symbolic = mixedInput() as unknown as UnknownRecord & { [key: symbol]: string }
  symbolic[Symbol("hidden")] = "value"
  assert.throws(() => buildP7ReviewCoverageUniverseEvidenceBinding(symbolic as unknown as P7ReviewCoverageUniverseEvidenceBindingBuildInput), /symbol/)

  const custom = Object.assign(Object.create({ inherited: true }), mixedInput())
  assert.throws(() => buildP7ReviewCoverageUniverseEvidenceBinding(custom), /plain object/)
})

test("P7-R23 rejects sparse and extra-property arrays", () => {
  const sparse = new Array<P7ReviewCoveragePathDescriptor>(2)
  sparse[0] = descriptor("src/a.ts")
  assert.throws(() => build({ ...mixedInput(), changedPaths: sparse }), /sparse/)

  const extra = [descriptor("src/a.ts")] as P7ReviewCoveragePathDescriptor[] & { extra?: boolean }
  extra.extra = true
  assert.throws(() => build({ ...mixedInput(), changedPaths: extra }), /extra array fields/)
})

test("P7-R23 rejects aliases, cycles, unsafe integers and non-JSON values", () => {
  const shared = descriptor("src/a.ts")
  assert.throws(() => build({ ...mixedInput(), changedPaths: [shared, shared] }), /aliases or cycles/)

  const cyclic = mixedInput() as unknown as UnknownRecord
  cyclic.self = cyclic
  assert.throws(() => buildP7ReviewCoverageUniverseEvidenceBinding(cyclic), /aliases or cycles|unknown field/)

  assert.throws(
    () => build({ ...mixedInput(), changedPaths: [descriptor("a", { byteSize: Number.MAX_SAFE_INTEGER + 1 })] }),
    /safe JSON integer|safe integer/,
  )
  assert.throws(
    () => build({ ...mixedInput(), changedPaths: [descriptor("a", { byteSize: -1 })] }),
    /safe integer/,
  )

  const bigintInput = mixedInput() as unknown as UnknownRecord
  bigintInput.changedPathSetIdentity = 1n
  assert.throws(() => buildP7ReviewCoverageUniverseEvidenceBinding(bigintInput), /JSON-compatible/)
})

test("P7-R23 output is detached, deeply frozen and validator rejects tampering", () => {
  const input = mixedInput()
  const output = build(input)

  ;(input.changedPaths as P7ReviewCoveragePathDescriptor[])[0] = descriptor("mutated.ts")
  assert.equal(output.reviewUniversePaths.includes("mutated.ts"), false)
  assert.equal(Object.isFrozen(output), true)
  assert.equal(Object.isFrozen(output.reviewUniversePaths), true)
  assert.throws(() => (output.reviewUniversePaths as string[]).push("x"), TypeError)

  assert.throws(
    () => validateP7ReviewCoverageUniverseEvidenceBinding({ ...output, evidenceIdentity: "0".repeat(64) }, mixedInput()),
    /deterministic canonical projection/,
  )
  assert.throws(
    () => validateP7ReviewCoverageUniverseEvidenceBinding({ ...output, reviewUniverseIdentity: "0".repeat(64) }, mixedInput()),
    /deterministic canonical projection/,
  )
  assert.throws(
    () => validateP7ReviewCoverageUniverseEvidenceBinding({ ...output, state: "VERIFIED" }, mixedInput()),
    /deterministic canonical projection/,
  )
  assert.throws(
    () => validateP7ReviewCoverageUniverseEvidenceBinding({ ...output, extraAuthority: "K2" }, mixedInput()),
    /unknown field/,
  )
})

test("P7-R23 validator rejects reordered, duplicate, missing or extra output paths", () => {
  const input = mixedInput()
  const output = build(input)
  const reordered = { ...output, reviewUniversePaths: [...output.reviewUniversePaths].reverse() }
  assert.throws(() => validateP7ReviewCoverageUniverseEvidenceBinding(reordered, input), /deterministic canonical projection/)

  const duplicate = { ...output, reviewUniversePaths: [...output.reviewUniversePaths, output.reviewUniversePaths[0]!] }
  assert.throws(() => validateP7ReviewCoverageUniverseEvidenceBinding(duplicate, input), /deterministic canonical projection/)

  const missing = { ...output, reviewUniversePaths: output.reviewUniversePaths.slice(1) }
  assert.throws(() => validateP7ReviewCoverageUniverseEvidenceBinding(missing, input), /deterministic canonical projection/)

  const extra = { ...output, reviewableTextPaths: [...output.reviewableTextPaths, "extra.ts"] }
  assert.throws(() => validateP7ReviewCoverageUniverseEvidenceBinding(extra, input), /deterministic canonical projection/)
})

test("P7-R23 published schema is closed and mirrors the bounded output", () => {
  const schema = JSON.parse(
    readFileSync(new URL("../../../schema/p7-review-coverage-universe-evidence-binding.schema.json", import.meta.url), "utf8"),
  ) as UnknownRecord
  const properties = schema.properties as UnknownRecord
  const required = schema.required as string[]

  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema")
  assert.equal(schema.additionalProperties, false)
  assert.equal((properties.version as UnknownRecord).const, P7_R23_REVIEW_COVERAGE_UNIVERSE_EVIDENCE_BINDING_VERSION)
  assert.equal((properties.state as UnknownRecord).const, P7_R23_REVIEW_COVERAGE_UNIVERSE_BOUND_STATE)
  assert.equal((properties.changedPathCount as UnknownRecord).maximum, P7_R23_REVIEW_COVERAGE_UNIVERSE_LIMITS.maxChangedPaths)

  const outputKeys = Object.keys(build()).sort()
  assert.deepEqual([...required].sort(), outputKeys)
  assert.deepEqual(Object.keys(properties).sort(), outputKeys)

  const defs = schema.$defs as UnknownRecord
  assert.equal((defs.sha256 as UnknownRecord).pattern, "^[0-9a-f]{64}$")
  assert.equal((defs.gitSha1 as UnknownRecord).pattern, "^[0-9a-f]{40}$")
  assert.equal((defs.pathArray as UnknownRecord).type, "array")
  assert.equal((defs.pathArray as UnknownRecord).uniqueItems, true)
})

test("P7-R23 implementation source has no filesystem, Git, provider, scanner or authority side-effect surface", () => {
  const source = readFileSync(
    new URL("../src/remediation/p7-review-coverage-universe-evidence-binding.ts", import.meta.url),
    "utf8",
  )

  const forbidden = [
    'from "node:fs"',
    'from "node:fs/promises"',
    'from "node:child_process"',
    'from "node:http"',
    'from "node:https"',
    "fetch(",
    "ExecutionGateway",
    "applyPatch",
    "repo.apply_patch",
    "pre_scan",
    "sarif",
    "provider",
    "model.invoke",
    "K2_INVOCATION",
    "K5_INVOCATION",
  ]
  for (const token of forbidden) assert.equal(source.includes(token), false, token)

  const importLines = source.split("\n").filter((line) => line.startsWith("import "))
  assert.deepEqual(importLines, [
    'import { createHash } from "node:crypto"',
    'import { types as nodeTypes } from "node:util"',
  ])
})

test("P7-R23 state remains explicitly non-equivalent to review completion", () => {
  const output = build()
  assert.equal(output.state, "REVIEW_COVERAGE_UNIVERSE_BOUND_ONLY")
  assert.equal(Object.hasOwn(output, "reviewedPathSet"), false)
  assert.equal(Object.hasOwn(output, "riskCoverageState"), false)
  assert.equal(Object.hasOwn(output, "skillCoverageState"), false)
  assert.equal(Object.hasOwn(output, "providerTerminationReason"), false)
  assert.equal(Object.hasOwn(output, "verified"), false)
  assert.equal(Object.hasOwn(output, "doneGate"), false)
})
