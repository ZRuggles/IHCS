import test from "node:test";
import assert from "node:assert/strict";
import { deploySites } from "./deploySites.js";

test("attempts both sites even when one hook fails", async () => {
  const seen: string[] = [];
  const request = (async (url: string | URL | Request, init?: RequestInit) => {
    seen.push(String(url));
    assert.equal(init?.method, "POST");
    assert.ok(init?.signal);
    if (String(url).endsWith("school")) throw new Error("private hook details");
    return new Response(null, { status: 200 });
  }) as typeof fetch;
  const results = await deploySites([{name:"IHS",url:"https://example.com/ihs"},{name:"IIHS",url:"https://example.com/school"}],request);
  assert.equal(seen.length,2);
  assert.deepEqual(results.map(r=>r.triggered),[true,false]);
  assert.equal(results[1]?.error,"Could not reach the deploy service.");
  assert.ok(!JSON.stringify(results).includes("https://"));
});

test("reports an HTTP rejection and handles no configured hooks", async () => {
  assert.deepEqual(await deploySites([]),[]);
  const request = (async () => new Response(null,{status:503})) as typeof fetch;
  assert.deepEqual(await deploySites([{name:"IIHS",url:"https://example.com/private"}],request),[{name:"IIHS",triggered:false,error:"Deploy hook returned 503."}]);
});
