import { test, expect } from "@playwright/test";

test.describe("ProdDeck desktop (1280Ã—800)", () => {
  test("home shell loads at desktop width", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.ok()).toBeTruthy();
    const vp = page.viewportSize();
    expect(vp?.width).toBe(1280);
    expect(vp?.height).toBe(800);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("pack is 1.0.0 with os enabled", async ({ request }) => {
    const pack = await (await request.get("/api/pack")).json();
    expect(pack.version).toBe("1.0.0");
    expect(pack.os?.enabled).toBe(true);
  });

  for (const place of ["yard", "dispatch", "promote", "beacon"] as const) {
    test(`place=${place} deep-link renders`, async ({ page }) => {
      const res = await page.goto(`/?place=${place}`);
      expect(res?.ok()).toBeTruthy();
      await expect(page.locator("body")).not.toBeEmpty();
    });
  }

  test("stop-dry-run blocks postgres and CSS", async ({ request }) => {
    const res = await request.post("/api/os/ports/stop-dry-run", {
      data: { ports: [5432, 5900] },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.wouldKill).toBe(false);
    for (const row of body.rows as Array<{ allowed: boolean; wouldKill: boolean }>) {
      expect(row.allowed).toBe(false);
      expect(row.wouldKill).toBe(false);
    }
  });

  test("activity drain dry-run only", async ({ request }) => {
    const res = await request.post("/api/os/activity-log", {
      data: { op: "drain", mode: "dry-run" },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.mode).toBe("dry-run");
  });
});
