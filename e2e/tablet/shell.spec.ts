import { test, expect } from "@playwright/test";

test.describe("ProdDeck tablet (800Ã—1280)", () => {
  test("home shell loads at tablet size", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.ok()).toBeTruthy();
    const vp = page.viewportSize();
    expect(vp?.width).toBe(800);
    expect(vp?.height).toBe(1280);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("pack is 1.0.0 with os enabled", async ({ request }) => {
    const pack = await (await request.get("/api/pack")).json();
    expect(pack.version).toBe("1.0.0");
    expect(pack.os?.enabled).toBe(true);
  });

  for (const place of ["archive", "drive-guard", "appliances", "runbooks"] as const) {
    test(`place=${place} deep-link renders`, async ({ page }) => {
      const res = await page.goto(`/?place=${place}`);
      expect(res?.ok()).toBeTruthy();
      await expect(page.locator("body")).not.toBeEmpty();
    });
  }

  test("filebridge list ok; delete blocked", async ({ request }) => {
    const list = await request.get("/api/os/filebridge");
    expect(list.ok()).toBeTruthy();
    const body = await list.json();
    expect(body.ok).toBe(true);
    expect(String(body.root).toLowerCase()).toContain("releases");

    const del = await request.delete("/api/os/filebridge");
    expect(del.status()).toBe(403);
  });

  test("filebridge jail rejects outside H:\\releases", async ({ request }) => {
    const res = await request.get("/api/os/filebridge", {
      params: { path: "E:\\MyAgent" },
    });
    expect(res.status()).toBe(403);
  });
});
