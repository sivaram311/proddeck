#!/usr/bin/env node
/**
 * Smoke: GET / → 200; catalog/helpdesk auth; pack keepers-quay 0.3.0
 * Usage: node scripts/smoke.mjs [baseUrl]
 */
const base = (process.argv[2] || "http://127.0.0.1:3320").replace(/\/$/, "");

async function expectStatus(path, status, init) {
  const res = await fetch(`${base}${path}`, { redirect: "manual", ...init });
  if (res.status !== status) {
    throw new Error(`${path} → ${res.status} (expected ${status})`);
  }
  return res;
}

async function main() {
  await expectStatus("/", 200);
  console.log(`OK: ${base}/ → 200`);

  await expectStatus("/api/catalog", 401);
  await expectStatus("/api/catalog", 401, {
    headers: { Authorization: "Bearer not.a.jwt" },
  });
  console.log(`OK: catalog auth gate`);

  await expectStatus("/api/helpdesk", 401);
  await expectStatus("/api/helpdesk", 401, {
    headers: { Authorization: "Bearer not.a.jwt" },
  });
  console.log(`OK: helpdesk auth gate`);

  const packRes = await expectStatus("/api/pack", 200);
  const pack = await packRes.json();
  if (pack.appId !== "proddeck") throw new Error(`appId ${pack.appId}`);
  if (pack.version !== "0.4.0") throw new Error(`version ${pack.version} (expected 0.4.0)`);
  if (pack.scene?.pack !== "keepers-quay") throw new Error(`scene.pack ${pack.scene?.pack}`);
  if (!pack.modules?.scene || !pack.modules?.catalog || !pack.modules?.crewsDesk) {
    throw new Error("modules scene/catalog/crewsDesk expected true");
  }
  console.log(`OK: pack keepers-quay 0.4.0`);

  console.log("SMOKE_PASS");
}

main().catch((err) => {
  console.error(`FAIL: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
