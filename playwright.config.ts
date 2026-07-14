import { defineConfig, devices as pwDevices } from "@playwright/test";
import { devices } from "./e2e/fixtures/devices";

/** Prefer public staging for lane isolation; override with PRODDECK_URL. */
const baseURL =
  process.env.PRODDECK_URL || "https://home-staging.delena.buzz";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "realme-p2-pro",
      testMatch: /e2e\/realme\/.*\.spec\.ts/,
      use: {
        ...pwDevices["Desktop Chrome"],
        ...devices["realme-p2-pro"],
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Realme P2 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      },
    },
    {
      name: "tablet-pad2-approx",
      testMatch: /e2e\/tablet\/.*\.spec\.ts/,
      use: {
        ...pwDevices["Desktop Chrome"],
        ...devices["tablet-pad2-approx"],
      },
    },
    {
      name: "desktop-1280",
      testMatch: /e2e\/desktop\/.*\.spec\.ts/,
      use: {
        ...pwDevices["Desktop Chrome"],
        ...devices["desktop-1280"],
      },
    },
  ],
});
