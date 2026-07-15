/**
 * One-off login validation for PREPROD + PROD public hosts.
 * Usage: PD_LOGIN_PASSWORD=... node scripts/validate-login-hosts.mjs
 */
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";

const HOSTS = [
  { name: "preprod", url: "https://home-staging.delena.buzz" },
  { name: "prod", url: "https://home.delena.buzz" },
];

function loadPassword() {
  if (process.env.PD_LOGIN_PASSWORD) return process.env.PD_LOGIN_PASSWORD;
  const envPath = "G:/apps/css-next/.env";
  const text = readFileSync(envPath, "utf8");
  const m = text.match(/^CSS_ADMIN_PASSWORD=(.+)$/m);
  if (!m) throw new Error("CSS_ADMIN_PASSWORD not found");
  return m[1].trim().replace(/^"|"$/g, "");
}

async function validateHost(page, host, password) {
  const out = { host: host.url, uiLogin: "FAIL", postLogin: "SKIP", iss: "" };
  await page.goto(host.url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.getByRole("heading", { name: "ProdDeck" }).waitFor({ timeout: 15000 });
  await page.locator('input[name="username"]').fill("admin");
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  // Post-login: Quay / deck shell (not login form)
  await page.waitForFunction(
    () => !document.querySelector('button[type="submit"]')?.textContent?.includes("Sign in") || document.body.innerText.includes("Manifest") || document.body.innerText.includes("Quay") || document.body.innerText.includes("Places"),
    { timeout: 25000 },
  ).catch(() => null);
  const bodyText = await page.locator("body").innerText();
  const stillLogin = bodyText.includes("Launch production apps after CSS sign-in") && bodyText.includes("Sign in");
  if (stillLogin) {
    const alert = await page.locator('[role="alert"]').textContent().catch(() => "");
    out.uiLogin = alert ? `FAIL:${alert.slice(0, 80)}` : "FAIL:still_on_login";
    return out;
  }
  out.uiLogin = "PASS";
  const token = await page.evaluate(() => localStorage.getItem("prodDeckAccessToken"));
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    out.iss = payload.iss || "";
    out.postLogin = payload.iss === "https://css-next.delena.buzz" ? "PASS" : `BAD_ISS:${payload.iss}`;
  } else {
    out.postLogin = "NO_TOKEN";
  }
  return out;
}

async function main() {
  const password = loadPassword();
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const host of HOSTS) {
    const context = await browser.newContext({
      viewport: { width: 360, height: 780 },
      userAgent:
        "Mozilla/5.0 (Linux; Android 14; Realme P2 Pro) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36",
    });
    const page = await context.newPage();
    try {
      results.push(await validateHost(page, host, password));
    } catch (e) {
      results.push({ host: host.url, uiLogin: `ERR:${e.message}`, postLogin: "SKIP", iss: "" });
    } finally {
      await context.close();
    }
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  const ok = results.every((r) => r.uiLogin === "PASS" && r.postLogin === "PASS");
  process.exit(ok ? 0 : 1);
}

main();
