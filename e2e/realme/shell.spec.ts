import { test, expect } from "@playwright/test";

test.describe("ProdDeck Realme P2 Pro (360Ã—780)", () => {
  test("home shell loads", async ({ page }) => {
    const res = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator("body")).not.toBeEmpty();
    // Auth gate or Quay shell — wait for any Keeper chrome / login CTA
    await expect(
      page.getByText(/Sign in|Keeper|Quay|ProdDeck|Lighting the Gate|Places/i).first(),
    ).toBeVisible({ timeout: 15000 });
    const text = await page.locator("body").innerText();
    expect(text.trim().length).toBeGreaterThan(8);
  });

  test("pack is 1.0.0 with os enabled", async ({ request }) => {
    const res = await request.get("/api/pack");
    expect(res.ok()).toBeTruthy();
    const pack = await res.json();
    expect(pack.appId).toBe("proddeck");
    expect(pack.version).toBe("1.0.0");
    expect(pack.os?.enabled).toBe(true);
  });

  for (const place of ["pulse", "ports", "activity-log", "filebridge"] as const) {
    test(`place=${place} deep-link renders`, async ({ page }) => {
      const res = await page.goto(`/?place=${place}`);
      expect(res?.ok()).toBeTruthy();
      await expect(page.locator("body")).not.toBeEmpty();
      const main = page.locator("main, [role='main'], body");
      await expect(main.first()).toBeVisible();
    });
  }

  test("stop-dry-run denies CSS, allows spare port without kill", async ({ request }) => {
    const res = await request.post("/api/os/ports/stop-dry-run", {
      data: { ports: [5900, 3330] },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.wouldKill).toBe(false);
    const byPort = Object.fromEntries(
      (body.rows as Array<{ port: number; allowed: boolean; wouldKill: boolean }>).map(
        (r) => [r.port, r],
      ),
    );
    expect(byPort[5900]?.allowed).toBe(false);
    expect(byPort[3330]?.wouldKill).toBe(false);
  });

  test("touch target >= 44px when interactive controls present", async ({ page }) => {
    await page.goto("/");
    const candidates = page.locator("button, a, [role='button'], input");
    const count = await candidates.count();
    test.skip(count === 0, "no interactive controls visible (likely CSS gate)");
    let found = false;
    for (let i = 0; i < Math.min(count, 20); i++) {
      const box = await candidates.nth(i).boundingBox();
      if (box && box.height >= 44) {
        found = true;
        break;
      }
    }
    expect(found).toBeTruthy();
  });
});
