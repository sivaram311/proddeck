import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";

const text = readFileSync("G:/apps/css-next/.env", "utf8");
const pass = text.match(/^CSS_ADMIN_PASSWORD=(.+)$/m)[1].trim().replace(/^"|"$/g, "");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 360, height: 780 } });
const host = process.argv[2] || "https://home-staging.delena.buzz";

const loginResp = page.waitForResponse((r) => r.url().includes("/api/css/auth/login"), { timeout: 30000 });
await page.goto(host);
await page.locator('input[name="password"]').fill(pass);
await page.getByRole("button", { name: "Sign in" }).click();
const lr = await loginResp;
await page.waitForTimeout(4000);
const storage = await page.evaluate(() => ({
  accessLen: localStorage.getItem("prodDeckAccessToken")?.length ?? 0,
  refresh: !!localStorage.getItem("prodDeckRefreshToken"),
  keys: Object.keys(localStorage),
  alert: document.querySelector('[role="alert"]')?.textContent ?? null,
  h1: document.querySelector("h1")?.textContent ?? null,
  snippet: document.body.innerText.slice(0, 250),
}));
console.log(JSON.stringify({ host, loginStatus: lr.status(), loginOk: lr.ok(), storage }, null, 2));
await browser.close();
