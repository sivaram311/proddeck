#!/usr/bin/env node
/**
 * Smoke: GET /api/os/ports auth gate + optional authenticated payload check.
 * Usage: node scripts/smoke-ports.mjs [baseUrl]
 * Optional: PRODDECK_TOKEN env for 200 body validation.
 */
const base = (process.argv[2] || "http://127.0.0.1:3320").replace(/\/$/, "");
const token = (process.env.PRODDECK_TOKEN || "").trim();

async function expectStatus(path, status, init) {
  const res = await fetch(`${base}${path}`, { redirect: "manual", ...init });
  if (res.status !== status) {
    throw new Error(`${path} → ${res.status} (expected ${status})`);
  }
  return res;
}

async function main() {
  await expectStatus("/api/os/ports", 401);
  await expectStatus("/api/os/ports", 401, {
    headers: { Authorization: "Bearer not.a.jwt" },
  });
  console.log("OK: /api/os/ports auth gate");

  if (token) {
    const res = await expectStatus("/api/os/ports", 200, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    if (!Array.isArray(body.reserved)) throw new Error("reserved[] missing");
    if (!Array.isArray(body.unknownListeners)) throw new Error("unknownListeners[] missing");
    if (!body.at || !body.source) throw new Error("at/source missing");
    console.log(
      `OK: authenticated payload (${body.reserved.length} reserved, ${body.unknownListeners.length} unknown)`,
    );
  } else {
    console.log("SKIP: set PRODDECK_TOKEN for authenticated body check");
  }

  console.log("SMOKE_PORTS_PASS");
}

main().catch((err) => {
  console.error(`FAIL: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
