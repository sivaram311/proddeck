# ProdDeck E2E (Device Lab)

**Mandate:** CONSCIOUS #14 · `E:\MyAgent\workflow\testing\E2E-HIRE.md`  
**Hire:** [agents/hires/2026-07-15-e2e-device-lab.md](../agents/hires/2026-07-15-e2e-device-lab.md)  
**App version:** 0.8.0 Wave A · base URL default `https://home-staging.delena.buzz`

## Projects

| Project | Viewport | Specs |
|---------|----------|-------|
| `realme-p2-pro` | 360×780 | `e2e/realme/` |
| `desktop-1280` | 1280×800 | `e2e/desktop/` |
| `tablet-pad2-approx` | 800×1280 | `e2e/tablet/` |

## Commands

**Machine rule (CONSCIOUS #15):** claim the Playwright slot before any run; release after — see `E:\MyAgent\workflow\testing\PLAYWRIGHT-SLOT.md`. Do not start a second Playwright while the slot is held.

```powershell
# claim
powershell -NoProfile -ExecutionPolicy Bypass -File E:\MyAgent\workflow\testing\scripts\claim-playwright-slot.ps1 -SessionId "proddeck-keepers-quay-2026-07-14" -AppId proddeck -Project all -AgentRole e2e-lead
# run
npm run test:e2e
npm run test:e2e:realme
npm run test:e2e:desktop
npm run test:e2e:tablet
# release / confirm
powershell -NoProfile -ExecutionPolicy Bypass -File E:\MyAgent\workflow\testing\scripts\release-playwright-slot.ps1 -SessionId "proddeck-keepers-quay-2026-07-14" -Result pass
```

Override URL: `PRODDECK_URL=http://127.0.0.1:3320 npm run test:e2e`

## Evidence

`H:\releases\proddeck-0.8.0\evidence\e2e\` (per-lane markdown from hired testers).

Devices SoT: `E:\MyAgent\workflow\devices\` — do not web-search sizes.
