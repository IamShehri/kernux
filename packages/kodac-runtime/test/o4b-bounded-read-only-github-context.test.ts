import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import assert from "node:assert/strict"
import test from "node:test"

import {
  O4A_READ_SOURCE_KIND,
  createO4aReadEvidenceInput,
  createO4aRepositorySnapshotInput,
} from "../src/github-review/o4-read-only-review-product-lineage-evidence.ts"
import {
  O4B_BOUNDED_READ_ONLY_GITHUB_CONTEXT_VERSION,
  O4B_LIMITS,
  O4B_READ_CONTEXT_EVIDENCE_KEYS,
  acquireO4bBoundedReadOnlyGithubContext,
  validateO4bReadContextEvidence,
  type O4bBoundedReadOnlyGithubContextInput,
  type O4bBoundedReadOnlyGithubContextResult,
} from "../src/github-review/o4b-bounded-read-only-github-context.ts"

type Obj = Record<string, any>
type FetchCall = { url: string, init: RequestInit }
type FixtureOptions = {
  fork?: boolean
  changed?: Obj[]
  filesPages?: Obj[][]
  supportingPaths?: string[]
  prSnapshots?: Obj[]
  content?: Record<string, Obj>
  intercept?: (url: URL, init: RequestInit, callIndex: number) => Response | undefined | Promise<Response | undefined>
  now?: string[]
  input?: Partial<O4bBoundedReadOnlyGithubContextInput>
}

const BASE = "a".repeat(40)
const HEAD = "b".repeat(40)
const NEXT = "c".repeat(40)
const REPO_ID = "1001"
const PR_ID = "2002"
const HEAD_REPO_ID = "1001"
const FORK_REPO_ID = "9001"
const REPO = "TheHalfMoon/Kodac"
const FORK_REPO = "Contributor/Kodac"
const PR = 42
const CREDENTIAL = "o4b-sentinel-credential-DO-NOT-LEAK"
const POLICY = "d".repeat(64)
const PRIMARY = "src/widget.ts"
const PRIMARY_BYTES = new TextEncoder().encode("export const widget = 1\n")

function blobSha(bytes: Uint8Array): string {
  return createHash("sha1").update(`blob ${bytes.byteLength}\0`, "utf8").update(bytes).digest("hex")
}
function sha256(bytes: Uint8Array | string): string { return createHash("sha256").update(bytes).digest("hex") }
function fileBody(path: string, bytes: Uint8Array, overrides: Obj = {}): Obj {
  return { type: "file", encoding: "base64", path, sha: blobSha(bytes), size: bytes.byteLength, content: Buffer.from(bytes).toString("base64"), ...overrides }
}
function prSnapshot(options: { fork?: boolean, base?: string, head?: string, baseRef?: string, headRef?: string, repoId?: number, repoName?: string, prId?: number, number?: number, headRepoId?: number, headRepoName?: string } = {}): Obj {
  const fork = options.fork ?? false
  const repoId = options.repoId ?? Number(REPO_ID)
  const repoName = options.repoName ?? REPO
  return {
    id: options.prId ?? Number(PR_ID),
    number: options.number ?? PR,
    base: { ref: options.baseRef ?? "main", sha: options.base ?? BASE, repo: { id: repoId, full_name: repoName } },
    head: { ref: options.headRef ?? "feature/o4b", sha: options.head ?? HEAD, repo: { id: options.headRepoId ?? (fork ? Number(FORK_REPO_ID) : repoId), full_name: options.headRepoName ?? (fork ? FORK_REPO : repoName) } },
  }
}
function changedFile(path = PRIMARY, status = "modified", bytes = PRIMARY_BYTES, overrides: Obj = {}): Obj {
  return { filename: path, status, sha: blobSha(bytes), ...overrides }
}
function responseJson(body: unknown, status = 200, headers: Record<string,string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", ...headers } })
}
function parseContentPath(url: URL): string {
  const marker = "/contents/"
  const at = url.pathname.indexOf(marker)
  assert.notEqual(at, -1)
  return url.pathname.slice(at + marker.length).split("/").map(decodeURIComponent).join("/")
}

function makeFixture(options: FixtureOptions = {}): {
  input: O4bBoundedReadOnlyGithubContextInput
  fetchImpl: typeof fetch
  calls: FetchCall[]
  run: () => Promise<O4bBoundedReadOnlyGithubContextResult>
} {
  const fork = options.fork ?? false
  const snapshots = options.prSnapshots ?? [prSnapshot({ fork }), prSnapshot({ fork })]
  const changed = options.changed ?? [changedFile()]
  const pages = options.filesPages ?? [changed]
  const content: Record<string, Obj> = { [PRIMARY]: fileBody(PRIMARY, PRIMARY_BYTES), ...(options.content ?? {}) }
  for (const page of pages) for (const row of page) {
    const path = String(row.filename)
    if (!(path in content)) {
      const bytes = new TextEncoder().encode(`content:${path}\n`)
      content[path] = fileBody(path, bytes)
      if (!row.sha) row.sha = blobSha(bytes)
      else if (row.sha !== content[path].sha && row.status !== "removed") content[path] = fileBody(path, bytes, { sha: row.sha })
    }
  }
  for (const path of options.supportingPaths ?? []) if (!(path in content)) {
    const bytes = new TextEncoder().encode(`support:${path}\n`)
    content[path] = fileBody(path, bytes)
  }
  const input: O4bBoundedReadOnlyGithubContextInput = {
    expectedRepositoryId: REPO_ID,
    expectedRepositoryFullName: REPO,
    pullRequestNumber: PR,
    expectedPullRequestId: PR_ID,
    expectedBaseRepositoryId: REPO_ID,
    expectedHeadRepositoryId: fork ? FORK_REPO_ID : HEAD_REPO_ID,
    expectedHeadRepositoryFullName: fork ? FORK_REPO : REPO,
    expectedHeadSha: HEAD,
    credentialPolicyIdentity: POLICY,
    supportingPaths: options.supportingPaths ?? [],
    credential: CREDENTIAL,
    ...(options.input ?? {}),
  }
  const calls: FetchCall[] = []
  let prReads = 0
  const fetchImpl = (async (rawUrl: URL | RequestInfo, init?: RequestInit) => {
    const url = new URL(rawUrl instanceof URL ? rawUrl.href : typeof rawUrl === "string" ? rawUrl : rawUrl.url)
    const requestInit = init ?? {}
    calls.push({ url: url.href, init: requestInit })
    const intercepted = await options.intercept?.(url, requestInit, calls.length - 1)
    if (intercepted) return intercepted
    if (/\/pulls\/\d+$/.test(url.pathname)) {
      const value = snapshots[Math.min(prReads, snapshots.length - 1)]!
      prReads += 1
      return responseJson(value)
    }
    if (/\/pulls\/\d+\/files$/.test(url.pathname)) {
      const page = Number(url.searchParams.get("page"))
      return responseJson(pages[page - 1] ?? [])
    }
    if (url.pathname.includes("/contents/")) {
      const path = parseContentPath(url)
      const body = content[path]
      if (!body) return responseJson({ message: "Not Found" }, 404)
      return responseJson(body)
    }
    return responseJson({ message: "unexpected" }, 404)
  }) as typeof fetch
  let clock = 0
  const times = options.now ?? ["2026-09-11T01:00:00.000Z", "2026-09-11T01:00:01.000Z"]
  const run = () => acquireO4bBoundedReadOnlyGithubContext(input, { fetchImpl, now: () => times[Math.min(clock++, times.length - 1)]! })
  return { input, fetchImpl, calls, run }
}

function clone<T>(value: T): T { return structuredClone(value) }
function assertDeepFrozen(value: unknown, seen = new Set<object>()): void {
  if (typeof value !== "object" || value === null || seen.has(value)) return
  seen.add(value)
  assert.equal(Object.isFrozen(value), true)
  for (const child of Object.values(value as Obj)) assertDeepFrozen(child, seen)
}
function authHeader(init: RequestInit): string {
  const headers = init.headers as Record<string,string>
  return headers.Authorization
}
function contentCalls(calls: FetchCall[]): FetchCall[] { return calls.filter((call) => call.url.includes("/contents/")) }
function baseResultInput(result: O4bBoundedReadOnlyGithubContextResult): Obj {
  return clone(result.readContextEvidence) as Obj
}

const AUTHORIZED_PATHS = [
  "packages/kodac-runtime/src/github-review/o4b-bounded-read-only-github-context.ts",
  "packages/kodac-runtime/test/o4b-bounded-read-only-github-context.test.ts",
  "schema/o4b-bounded-read-only-github-context.schema.json",
] as const

const cases: Array<[number, string, () => void | Promise<void>]> = [
  [1, "same-repository happy path is ready for O4-A", async () => {
    const f=makeFixture(); const r=await f.run(); assert.equal(r.readContextEvidence.continuationDecision,"READY_FOR_O4A_REVIEW"); assert.deepEqual(r.changedPaths,[PRIMARY]); assert.equal(r.contentItems[0]?.contentText,"export const widget = 1\n")
  }],
  [2, "fork PR uses exact validated head repository for current content", async () => {
    const f=makeFixture({fork:true}); const r=await f.run(); assert.equal(r.snapshot.forkClassification,"FORK_REPOSITORY"); const call=contentCalls(f.calls)[0]!; assert.match(call.url,/repos\/Contributor\/Kodac\/contents\/src\/widget\.ts/); assert.equal(new URL(call.url).searchParams.get("ref"),HEAD)
  }],
  [3, "repository id mismatch fails before content reads", async () => {
    const f=makeFixture({prSnapshots:[prSnapshot({repoId:9999})]}); await assert.rejects(f.run,/repository identity mismatch/); assert.equal(contentCalls(f.calls).length,0); assert.equal(f.calls.length,1)
  }],
  [4, "repository full-name mismatch fails", async () => {
    const f=makeFixture({prSnapshots:[prSnapshot({repoName:"Other/Repo"})]}); await assert.rejects(f.run,/repository identity mismatch/)
  }],
  [5, "PR id and number mismatch fail", async () => {
    await assert.rejects(makeFixture({prSnapshots:[prSnapshot({prId:9999})]}).run(),/pull request identity mismatch/)
    await assert.rejects(makeFixture({prSnapshots:[prSnapshot({number:43})]}).run(),/pull request identity mismatch/)
  }],
  [6, "expected head mismatch fails on initial snapshot", async () => {
    const f=makeFixture({prSnapshots:[prSnapshot({head:NEXT})]}); await assert.rejects(f.run,/expected head mismatch/); assert.equal(contentCalls(f.calls).length,0)
  }],
  [7, "head movement during acquisition fails closed", async () => {
    const f=makeFixture({prSnapshots:[prSnapshot(),prSnapshot({head:NEXT})]}); await assert.rejects(f.run,/expected head mismatch|moved/)
  }],
  [8, "base movement during acquisition fails closed", async () => {
    const f=makeFixture({prSnapshots:[prSnapshot(),prSnapshot({base:NEXT})]}); await assert.rejects(f.run,/moved during context acquisition/)
  }],
  [9, "head or base repository identity movement fails closed", async () => {
    const f=makeFixture({prSnapshots:[prSnapshot(),prSnapshot({headRepoId:9999,headRepoName:"Other/Fork"})]}); await assert.rejects(f.run,/head repository identity mismatch|moved/)
  }],
  [10, "changed-file pagination is implementation-owned and deterministic", async () => {
    const rows=Array.from({length:101},(_,i)=>({filename:`src/f${String(i).padStart(3,"0")}.ts`,status:"modified"}))
    const f=makeFixture({filesPages:[rows.slice(0,100),rows.slice(100)]}); const r=await f.run();
    const fileCalls=f.calls.filter(c=>c.url.includes(`/pulls/${PR}/files`)); assert.equal(fileCalls.length,2); assert.equal(new URL(fileCalls[0]!.url).search,"?per_page=100&page=1"); assert.equal(new URL(fileCalls[1]!.url).search,"?per_page=100&page=2"); assert.equal(r.changedPaths.length,101)
  }],
  [11, "more than 512 changed paths fails closed before content reads", async () => {
    const rows=Array.from({length:513},(_,i)=>({filename:`src/f${i}.ts`,status:"modified",sha:"e".repeat(40)})); const pages=Array.from({length:6},(_,i)=>rows.slice(i*100,(i+1)*100)); const f=makeFixture({filesPages:pages}); await assert.rejects(f.run,/changed path count exceeds 512/); assert.equal(contentCalls(f.calls).length,0)
  }],
  [12, "duplicate changed paths fail closed", async () => {
    const row=changedFile(); const f=makeFixture({changed:[row,clone(row)]}); await assert.rejects(f.run,/duplicate normalized paths/)
  }],
  [13, "renamed path requires a distinct previous path", async () => {
    const f=makeFixture({changed:[changedFile(PRIMARY,"renamed",PRIMARY_BYTES,{previous_filename:PRIMARY})]}); await assert.rejects(f.run,/must differ/)
    const g=makeFixture({changed:[changedFile(PRIMARY,"renamed",PRIMARY_BYTES,{previous_filename:"src/old.ts"})]}); const r=await g.run(); assert.equal(r.readContextEvidence.changedFileMetadataRecords[0]?.previousPath,"src/old.ts")
  }],
  [14, "current changed file reads exact head repository and exact head SHA", async () => {
    const f=makeFixture(); await f.run(); const u=new URL(contentCalls(f.calls)[0]!.url); assert.match(u.pathname,/\/repos\/TheHalfMoon\/Kodac\/contents\/src\/widget\.ts$/); assert.equal(u.searchParams.get("ref"),HEAD)
  }],
  [15, "removed file reads exact base repository/base SHA and records BASE_REMOVED", async () => {
    const f=makeFixture({changed:[changedFile(PRIMARY,"removed") ]}); const r=await f.run(); const u=new URL(contentCalls(f.calls)[0]!.url); assert.equal(u.searchParams.get("ref"),BASE); assert.equal(r.contentItems[0]?.contentRevisionKind,"BASE_REMOVED")
  }],
  [16, "supporting context reads exact head revision only", async () => {
    const path="docs/context.md"; const f=makeFixture({supportingPaths:[path]}); const r=await f.run(); const call=contentCalls(f.calls).find(c=>c.url.includes("docs/context.md"))!; assert.equal(new URL(call.url).searchParams.get("ref"),HEAD); assert.equal(r.contentItems.find(x=>x.path===path)?.readRole,"SUPPORTING_CONTEXT")
  }],
  [17, "supporting path collision with changed path is canonicalized away", async () => {
    const f=makeFixture({supportingPaths:[PRIMARY]}); const r=await f.run(); assert.equal(contentCalls(f.calls).length,1); assert.equal(r.readContextEvidence.supportingPathCount,0)
  }],
  [18, "full UTF-8 content verifies provider Git blob SHA and decoded size", async () => {
    const r=await makeFixture().run(); const item=r.contentItems[0]!; assert.equal(item.truncationState,"FULL"); assert.equal(item.materializedByteLength,PRIMARY_BYTES.byteLength); assert.equal(item.contentIdentity,sha256(PRIMARY_BYTES)); assert.equal(item.providerBlobSha,blobSha(PRIMARY_BYTES))
  }],
  [19, "provider Git blob SHA mismatch fails closed", async () => {
    const f=makeFixture({content:{[PRIMARY]:fileBody(PRIMARY,PRIMARY_BYTES,{sha:"f".repeat(40)})}}); await assert.rejects(f.run,/provider blob identity disagrees|Git blob SHA mismatch/)
  }],
  [20, "declared-size mismatch fails closed", async () => {
    const f=makeFixture({content:{[PRIMARY]:fileBody(PRIMARY,PRIMARY_BYTES,{size:PRIMARY_BYTES.byteLength+1})}}); await assert.rejects(f.run,/declared-size mismatch/)
  }],
  [21, "binary or non-UTF8 content cannot become FULL", async () => {
    const bytes=new Uint8Array([0xff,0xfe,0xfd]); const row=changedFile(PRIMARY,"modified",bytes); const f=makeFixture({changed:[row],content:{[PRIMARY]:fileBody(PRIMARY,bytes)}}); const r=await f.run(); assert.equal(r.contentItems[0]?.truncationState,"TRUNCATED"); assert.equal(r.contentItems[0]?.truncationReason,"BINARY_OR_NON_UTF8"); assert.equal(r.contentItems[0]?.contentText,null)
  }],
  [22, "oversized content cannot become FULL", async () => {
    const bytes=new Uint8Array(O4B_LIMITS.maxFullFileBytes+1).fill(97); const row=changedFile(PRIMARY,"modified",bytes); const f=makeFixture({changed:[row],content:{[PRIMARY]:fileBody(PRIMARY,bytes)}}); const r=await f.run(); assert.equal(r.contentItems[0]?.truncationState,"TRUNCATED"); assert.equal(r.contentItems[0]?.truncationReason,"OVERSIZED")
  }],
  [23, "missing or unsupported content type cannot become FULL", async () => {
    const f=makeFixture({content:{[PRIMARY]:{type:"symlink",path:PRIMARY,sha:null,size:0,encoding:null,content:null}}}); const r=await f.run(); assert.equal(r.contentItems[0]?.truncationState,"TRUNCATED"); assert.equal(r.contentItems[0]?.truncationReason,"UNSUPPORTED_TYPE")
  }],
  [24, "any truncated changed path blocks READY", async () => {
    const bytes=new Uint8Array([0xff]); const f=makeFixture({changed:[changedFile(PRIMARY,"modified",bytes)],content:{[PRIMARY]:fileBody(PRIMARY,bytes)}}); const r=await f.run(); assert.equal(r.readContextEvidence.continuationDecision,"BLOCK_INCOMPLETE_CHANGED_PATH_CONTEXT")
  }],
  [25, "aggregate materialized byte budget fails closed before overflow", async () => {
    const bytes=new Uint8Array(O4B_LIMITS.maxFullFileBytes).fill(97); const rows=Array.from({length:9},(_,i)=>changedFile(`src/big-${i}.txt`,"modified",bytes)); const content=Object.fromEntries(rows.map(row=>[row.filename,fileBody(row.filename,bytes)])); const f=makeFixture({changed:rows,content}); await assert.rejects(f.run,/aggregate materialized content byte budget exceeded/)
  }],
  [26, "per-response bounded reader aborts before unbounded JSON parsing", async () => {
    const tooBig=new Uint8Array(O4B_LIMITS.maxPrResponseBytes+1).fill(123); let cancelled=false
    const stream=new ReadableStream<Uint8Array>({start(controller){controller.enqueue(tooBig); controller.close()},cancel(){cancelled=true}})
    const f=makeFixture({intercept:(url)=>/\/pulls\/42$/.test(url.pathname)?new Response(stream,{status:200,headers:{"content-type":"application/json"}}):undefined})
    await assert.rejects(f.run,/response body/); assert.equal(cancelled || f.calls.length===1,true)
  }],
  [27, "non-2xx fails without leaking response body or credential", async () => {
    const secretBody=`server says ${CREDENTIAL}`; const f=makeFixture({intercept:(url)=>/\/pulls\/42$/.test(url.pathname)?responseJson({message:secretBody},403):undefined}); let error=""; try{await f.run()}catch(e){error=String(e)}; assert.match(error,/status 403/); assert.equal(error.includes(secretBody),false); assert.equal(error.includes(CREDENTIAL),false)
  }],
  [28, "redirect is never followed", async () => {
    const f=makeFixture({intercept:(url,init)=>{assert.equal(init.redirect,"error"); return /\/pulls\/42$/.test(url.pathname)?new Response(null,{status:302,headers:{location:"https://evil.example/"}}):undefined}}); await assert.rejects(f.run,/status 302/); assert.equal(f.calls.length,1)
  }],
  [29, "caller abort fails closed with no automatic retry", async () => {
    const f=makeFixture(); const controller=new AbortController(); controller.abort(); await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(f.input,{fetchImpl:f.fetchImpl,signal:controller.signal}),/aborted/); assert.equal(f.calls.length,0)
  }],
  [30, "every request is GET to api.github.com", async () => {
    const f=makeFixture({supportingPaths:["docs/context.md"]}); await f.run(); for(const call of f.calls){const u=new URL(call.url); assert.equal(u.protocol,"https:"); assert.equal(u.hostname,"api.github.com"); assert.equal(call.init.method,"GET"); assert.equal(call.init.redirect,"error")}
  }],
  [31, "repository path and query injection cannot escape URL derivation", async () => {
    const path="docs/a?x=1#frag%25.ts"; const f=makeFixture({supportingPaths:[path]}); await f.run(); const call=contentCalls(f.calls).find(c=>decodeURIComponent(new URL(c.url).pathname).includes("a?x=1#frag%25.ts"))!; const u=new URL(call.url); assert.equal(u.hostname,"api.github.com"); assert.equal(u.searchParams.get("ref"),HEAD); assert.equal([...u.searchParams.keys()].join(","),"ref"); assert.match(u.pathname,/%3F|%23|%25/)
  }],
  [32, "credential appears only in Authorization header and never result evidence error or URL", async () => {
    const f=makeFixture(); const r=await f.run(); assert.equal(JSON.stringify(r).includes(CREDENTIAL),false); for(const call of f.calls){assert.equal(authHeader(call.init),`Bearer ${CREDENTIAL}`); assert.equal(call.url.includes(CREDENTIAL),false); const headers=call.init.headers as Record<string,string>; for(const [k,v] of Object.entries(headers)) if(k!=="Authorization") assert.equal(v.includes(CREDENTIAL),false)}
  }],
  [33, "production source performs no ambient credential discovery", () => {
    const source=readFileSync(new URL("../src/github-review/o4b-bounded-read-only-github-context.ts",import.meta.url),"utf8"); for(const forbidden of ["process.env","node:fs","node:child_process","exec(","spawn(","gh ","GITHUB_TOKEN","OPENAI_API_KEY"]){assert.equal(source.includes(forbidden),false,forbidden)}
  }],
  [34, "O4-A snapshot helper parity is exact", async () => {
    const r=await makeFixture().run(); const {snapshotEvidenceIdentity:_id,...core}=r.snapshot; assert.deepEqual(createO4aRepositorySnapshotInput(core),r.snapshot)
  }],
  [35, "O4-A read helper parity is exact for every item", async () => {
    const r=await makeFixture({supportingPaths:["docs/context.md"]}).run(); for(const row of r.contentItems){const expected=createO4aReadEvidenceInput(r.snapshot.repositoryId,r.snapshot.pullRequestNumber,{path:row.path,readRole:row.readRole,contentIdentity:row.contentIdentity,byteLength:row.materializedByteLength,sourceKind:O4A_READ_SOURCE_KIND,truncationState:row.truncationState,snapshotEvidenceIdentity:r.snapshot.snapshotEvidenceIdentity,reviewedHead:r.snapshot.reviewedHead}); assert.equal(expected.readEvidenceIdentity,row.readEvidenceIdentity)}
  }],
  [36, "fixed transport and clock input yields deterministic identities", async () => {
    const a=await makeFixture().run(); const b=await makeFixture().run(); assert.equal(a.readContextEvidence.readContextEvidenceIdentity,b.readContextEvidence.readContextEvidenceIdentity); assert.equal(a.readContextEvidence.changedPathSetIdentity,b.readContextEvidence.changedPathSetIdentity); assert.equal(a.readContextEvidence.readEvidenceSetIdentity,b.readContextEvidence.readEvidenceSetIdentity)
  }],
  [37, "authority-relevant provider response change changes evidence identity", async () => {
    const a=await makeFixture().run(); const b=await makeFixture({prSnapshots:[prSnapshot({baseRef:"trunk"}),prSnapshot({baseRef:"trunk"})]}).run(); assert.notEqual(a.readContextEvidence.initialSnapshotResponseIdentity,b.readContextEvidence.initialSnapshotResponseIdentity); assert.notEqual(a.readContextEvidence.readContextEvidenceIdentity,b.readContextEvidence.readContextEvidenceIdentity)
  }],
  [38, "Proxy revoked Proxy accessor symbol non-enumerable custom-prototype and sparse inputs fail closed", async () => {
    const base=makeFixture().input
    await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(new Proxy(clone(base),{})),/non-proxy/)
    const revoked=Proxy.revocable(clone(base),{}); revoked.revoke(); await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(revoked.proxy),/non-proxy/)
    let traps=0; const accessor=clone(base) as Obj; Object.defineProperty(accessor,"credential",{enumerable:true,get(){traps+=1;return CREDENTIAL}}); await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(accessor as any),/data property/); assert.equal(traps,0)
    const symbol=clone(base) as any; symbol[Symbol("x")]=true; await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(symbol),/symbol/)
    const hidden=clone(base) as Obj; Object.defineProperty(hidden,"credentialPolicyIdentity",{value:POLICY,enumerable:false}); await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(hidden as any),/unexpected or missing|enumerable/)
    const custom=Object.assign(Object.create({x:true}),clone(base)); await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(custom),/plain-object/)
    const sparse=clone(base) as Obj; const arr:any[]=[]; arr.length=1; sparse.supportingPaths=arr; await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(sparse as any),/sparse or extra/)
  }],
  [39, "all returned records and arrays are deeply frozen", async () => { assertDeepFrozen(await makeFixture({supportingPaths:["docs/context.md"]}).run()) }],
  [40, "schema has exact evidence surface parity and runtime rejects unknown or forged fields", async () => {
    const r=await makeFixture().run(); const schema=JSON.parse(readFileSync(new URL("../../../schema/o4b-bounded-read-only-github-context.schema.json",import.meta.url),"utf8")); assert.equal(schema.$schema,"https://json-schema.org/draft/2020-12/schema"); assert.equal(schema.additionalProperties,false); assert.deepEqual([...schema.required].sort(),[...O4B_READ_CONTEXT_EVIDENCE_KEYS].sort()); assert.deepEqual(Object.keys(schema.properties).sort(),Object.keys(r.readContextEvidence).sort()); assert.throws(()=>validateO4bReadContextEvidence({...r.readContextEvidence,extra:true}),/unexpected or missing/); assert.throws(()=>validateO4bReadContextEvidence({...r.readContextEvidence,readContextEvidenceIdentity:"f".repeat(64)}),/identity mismatch/)
  }],
  [41, "source static scan proves no write shell env-secret filesystem provider or model capability", () => {
    const source=readFileSync(new URL("../src/github-review/o4b-bounded-read-only-github-context.ts",import.meta.url),"utf8"); const forbidden=["method: \"POST\"","method: \"PUT\"","method: \"PATCH\"","method: \"DELETE\"","node:child_process","node:fs","process.env","ReviewerExecutionRuntime","ModelProvider","K2","applyPatch","/comments","/reviews"]; for(const value of forbidden) assert.equal(source.includes(value),false,value)
  }],
  [42, "exact implementation contract is three paths with no dependency lockfile workflow or root-export path", () => {
    assert.deepEqual(AUTHORIZED_PATHS,["packages/kodac-runtime/src/github-review/o4b-bounded-read-only-github-context.ts","packages/kodac-runtime/test/o4b-bounded-read-only-github-context.test.ts","schema/o4b-bounded-read-only-github-context.schema.json"]); for(const path of AUTHORIZED_PATHS){assert.equal(path.startsWith(".github/workflows/"),false); assert.equal(/(^|\/)(package(-lock)?\.json|pnpm-lock\.yaml|yarn\.lock)$/.test(path),false); assert.equal(path.endsWith("/index.ts"),false)}
  }],
  [43, "malformed provider JSON fails closed before authority projection", async () => {
    const f=makeFixture({intercept:(url)=>/\/pulls\/42$/.test(url.pathname)?new Response("{not-json",{status:200,headers:{"content-type":"application/json"}}):undefined}); await assert.rejects(f.run,/malformed JSON/); assert.equal(contentCalls(f.calls).length,0)
  }],
  [44, "validator rejects forged FULL size and nested provider blob bindings", async () => {
    const r=await makeFixture().run(); const a=baseResultInput(r); a.contentRecords[0].providerDeclaredSize+=1; a.contentRecords[0].contentRecordIdentity="f".repeat(64); assert.throws(()=>validateO4bReadContextEvidence(a),/size\/blob evidence mismatch|identity mismatch/)
    const b=baseResultInput(r); b.changedFileMetadataRecords[0].providerBlobSha="e".repeat(40); b.changedFileMetadataRecords[0].metadataIdentity="f".repeat(64); assert.throws(()=>validateO4bReadContextEvidence(b),/identity mismatch|provider blob mismatch/)
  }],
  [45, "caller-injected adapter options reject hostile proxy and accessor structure before use", async () => {
    const f=makeFixture();
    await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(f.input,new Proxy({fetchImpl:async()=>new Response()},{})),/options|non-proxy/);
    const revoked=Proxy.revocable({timeoutMs:1000},{}); revoked.revoke(); await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(f.input,revoked.proxy),/options|non-proxy/);
    let gets=0; const accessor:any={}; Object.defineProperty(accessor,"timeoutMs",{enumerable:true,get(){gets+=1; return 1000}}); await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(f.input,accessor),/data property/); assert.equal(gets,0);
    const signal=Proxy.revocable(new AbortController().signal,{}); signal.revoke(); await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(f.input,{signal:signal.proxy}),/non-proxy AbortSignal/);
    const proxiedFetch=new Proxy(async()=>new Response(),{}); await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(f.input,{fetchImpl:proxiedFetch}),/non-proxy function/);
    const proxiedNow=new Proxy(()=>NOW,{}); await assert.rejects(()=>acquireO4bBoundedReadOnlyGithubContext(f.input,{now:proxiedNow}),/non-proxy function/);
  }],
]

for (const [number,name,fn] of cases) test(`O4-B focused ${number}: ${name}`,fn)
assert.equal(cases.length,45)
