#!/usr/bin/env node
/**
 * Smoke: GET /api/os/pulse → 200 + HealthSnapshot shape
 * Usage: node scripts/smoke-pulse.mjs [baseUrl]
 */
const base = (process.argv[2] || "http://127.0.0.1:3320").replace(/\/$/, "");

async function main() {
  const res = await fetch(`${base}/api/os/pulse`, { cache: "no-store" });
  if (res.status !== 200) {
    throw new Error(`/api/os/pulse → ${res.status} (expected 200)`);
  }

  const body = await res.json();
  if (typeof body.at !== "string" || Number.isNaN(Date.parse(body.at))) {
    throw new Error(`at invalid: ${body.at}`);
  }
  if (!Array.isArray(body.drives) || body.drives.length !== 4) {
    throw new Error(`drives expected 4 entries, got ${body.drives?.length}`);
  }
  for (const letter of ["E", "F", "G", "H"]) {
    const d = body.drives.find((x) => x.letter === letter);
    if (!d || typeof d.ok !== "boolean") {
      throw new Error(`drive ${letter} missing or invalid`);
    }
  }
  if (typeof body.postgresOk !== "boolean") throw new Error("postgresOk missing");
  if (typeof body.cssOk !== "boolean") throw new Error("cssOk missing");

  console.log(`OK: ${base}/api/os/pulse → 200`);
  console.log(`  at=${body.at} uptimeSec=${body.uptimeSec ?? "—"}`);
  console.log(`  postgresOk=${body.postgresOk} cssOk=${body.cssOk}`);
  console.log("SMOKE_PULSE_PASS");
}

main().catch((err) => {
  console.error(`FAIL: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
