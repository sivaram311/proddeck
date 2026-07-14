#!/usr/bin/env node
/**
 * Smoke: GET /api/os/ports → 200 snapshot
 * Usage: node scripts/smoke-ports.mjs [baseUrl]
 */
const base = (process.argv[2] || "http://127.0.0.1:3320").replace(/\/$/, "");

async function main() {
  const res = await fetch(`${base}/api/os/ports`, { cache: "no-store" });
  if (!res.ok) throw new Error(`/api/os/ports → ${res.status}`);
  const body = await res.json();
  if (!body.at) throw new Error("at missing");
  if (!Array.isArray(body.rows)) throw new Error("rows[] missing");
  console.log(
    `OK: /api/os/ports → 200 (${body.rows.length} rows, ${body.unknownListening?.length ?? 0} unknown)`,
  );
  console.log("SMOKE_PORTS_PASS");
}

main().catch((err) => {
  console.error(`FAIL: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
