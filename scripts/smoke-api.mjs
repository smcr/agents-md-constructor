const base = process.env.API_BASE || "http://localhost:3000";

async function request(method, path, body) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }
  return { status: res.status, json };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const health = await request("GET", "/api/health");
assert(health.status === 200 && health.json.status === "ok", "health failed");

const suffix = Date.now();
const sectionA = await request("POST", "/api/sections", {
  title: `Smoke A ${suffix}`,
  description: "Section A description",
  approved: true,
});
assert(sectionA.status === 201 && sectionA.json.id, "create section A failed");

const sectionB = await request("POST", "/api/sections", {
  title: `Smoke B ${suffix}`,
  description: "Section B description",
  approved: true,
});
assert(sectionB.status === 201, "create section B failed");

const listed = await request("GET", "/api/sections");
assert(Array.isArray(listed.json) && listed.json.some((row) => row.id === sectionA.json.id), "list sections failed");

const updated = await request("PATCH", `/api/sections/${sectionA.json.id}`, { counter: 3 });
assert(updated.status === 200 && updated.json.counter === 3, "update section failed");

const tag = await request("POST", "/api/tags", { title: `smoke-${suffix}`, approved: true });
assert(tag.status === 201, "create tag failed");

const attach1 = await request("PUT", `/api/sections/${sectionA.json.id}/tags/${tag.json.id}`);
const attach2 = await request("PUT", `/api/sections/${sectionA.json.id}/tags/${tag.json.id}`);
assert(attach1.status === 200 && attach2.status === 200, "attach section tag failed");
assert(attach2.json.tag_ids.filter((id) => id === tag.json.id).length === 1, "attach section tag not idempotent");

const ruleA = await request("POST", "/api/rules", {
  section_id: sectionA.json.id,
  rule: "Do A",
  approved: true,
});
assert(ruleA.status === 201, "create rule A without checks failed");
assert(ruleA.json.checks === null || ruleA.json.checks === "", "checks should be optional");

const missingSection = await request("POST", "/api/rules", {
  section_id: 99999999,
  rule: "x",
  checks: "y",
});
assert(missingSection.status === 400, "missing section must be rejected");

const blocked = await request("DELETE", `/api/sections/${sectionA.json.id}`);
assert(blocked.status === 409, "delete section with rules must be blocked");

const ruleB = await request("POST", "/api/rules", {
  section_id: sectionB.json.id,
  rule: "Do B",
  checks: "Check B",
  approved: true,
});
assert(ruleB.status === 201, "create rule B failed");

const attachRule1 = await request("PUT", `/api/rules/${ruleA.json.id}/tags/${tag.json.id}`);
const attachRule2 = await request("PUT", `/api/rules/${ruleA.json.id}/tags/${tag.json.id}`);
assert(attachRule1.status === 200 && attachRule2.json.tag_ids.length === 1, "attach rule tag not idempotent");

const bySection = await request("GET", `/api/rules?section_id=${sectionA.json.id}`);
assert(bySection.json.length === 1 && bySection.json[0].id === ruleA.json.id, "search by section failed");

const byTag = await request("GET", `/api/rules?tag_id=${tag.json.id}`);
assert(byTag.json.some((row) => row.id === ruleA.json.id), "search by tag failed");

const byBoth = await request("GET", `/api/rules?section_id=${sectionB.json.id}&tag_id=${tag.json.id}`);
assert(Array.isArray(byBoth.json) && byBoth.json.length === 0, "search by tag and section AND failed");

const missingAttach = await request("PUT", `/api/rules/${ruleA.json.id}/tags/99999999`);
assert(missingAttach.status === 404, "missing tag attach must 404");

const detach = await request("DELETE", `/api/rules/${ruleA.json.id}/tags/${tag.json.id}`);
assert(detach.status === 200 && detach.json.tag_ids.length === 0, "detach rule tag failed");

await request("DELETE", `/api/rules/${ruleA.json.id}`);
await request("DELETE", `/api/rules/${ruleB.json.id}`);
const deletedSection = await request("DELETE", `/api/sections/${sectionA.json.id}`);
assert(deletedSection.status === 204, "delete empty section failed");
await request("DELETE", `/api/sections/${sectionB.json.id}`);
await request("DELETE", `/api/tags/${tag.json.id}`);

console.log("api smoke ok");
