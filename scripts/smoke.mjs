#!/usr/bin/env node
/**
 * Smoke: GET / â†’ 200; catalog/helpdesk auth; pack keepers-quay + os scaffold
 * Usage: node scripts/smoke.mjs [baseUrl]
 */
const base = (process.argv[2] || "http://127.0.0.1:3320").replace(/\/$/, "");
const EXPECT_VERSION = "0.8.4";

async function expectStatus(path, status, init) {
  const res = await fetch(`${base}${path}`, { redirect: "manual", ...init });
  if (res.status !== status) {
    throw new Error(`${path} â†’ ${res.status} (expected ${status})`);
  }
  return res;
}

async function main() {
  await expectStatus("/", 200);
  console.log(`OK: ${base}/ â†’ 200`);

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
  if (pack.version !== EXPECT_VERSION) {
    throw new Error(`version ${pack.version} (expected ${EXPECT_VERSION})`);
  }
  if (pack.scene?.pack !== "keepers-quay") throw new Error(`scene.pack ${pack.scene?.pack}`);
  if (!pack.modules?.scene || !pack.modules?.catalog || !pack.modules?.crewsDesk) {
    throw new Error("modules scene/catalog/crewsDesk expected true");
  }
  if (!pack.os?.enabled) throw new Error("os.enabled expected true");
  if (!pack.os?.modules?.pulse) throw new Error("os.modules.pulse expected true");
  console.log(`OK: pack keepers-quay ${EXPECT_VERSION} + os`);

  console.log("SMOKE_PASS");
}

main().catch((err) => {
  console.error(`FAIL: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
