#!/usr/bin/env node
/**
 * Smoke: GET /api/os/activity-log tail + filter
 * Usage: node scripts/smoke-activity-log.mjs [baseUrl]
 */
const base = (process.argv[2] || "http://127.0.0.1:3320").replace(/\/$/, "");

async function main() {
  const res = await fetch(`${base}/api/os/activity-log`, { cache: "no-store" });
  if (!res.ok) throw new Error(`/api/os/activity-log → ${res.status}`);
  const body = await res.json();
  if (!Array.isArray(body.entries)) throw new Error("entries array missing");
  if (typeof body.matched !== "number") throw new Error("matched missing");
  console.log(`OK: activity-log ${body.matched} entries`);

  const filtered = await fetch(`${base}/api/os/activity-log?q=cursor`, { cache: "no-store" });
  if (!filtered.ok) throw new Error(`filter → ${filtered.status}`);
  const fbody = await filtered.json();
  if (!Array.isArray(fbody.entries)) throw new Error("filter entries missing");
  console.log(`OK: filter q=cursor → ${fbody.matched} matched`);

  console.log("SMOKE_ACTIVITY_LOG_PASS");
}

main().catch((err) => {
  console.error(`FAIL: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
