# ProdDeck E2E (Device Lab)

**Mandate:** CONSCIOUS #14 · `E:\MyAgent\workflow\testing\E2E-HIRE.md`  
**Hire:** [agents/hires/2026-07-15-e2e-device-lab.md](../agents/hires/2026-07-15-e2e-device-lab.md)  
**App version:** **1.0.0** Cloud OS v1  
**Preferred base (tag gate):** DEV `http://127.0.0.1:3320` (`PRODDECK_URL`) — CONSCIOUS **#16**  
**Optional cutover check:** `https://home-staging.delena.buzz`

## Projects

| Project | Viewport | Specs |
|---------|----------|-------|
| `realme-p2-pro` | 360×780 | `e2e/realme/` |
| `desktop-1280` | 1280×800 | `e2e/desktop/` |
| `tablet-pad2-approx` | 800×1280 | `e2e/tablet/` |

## Commands

**Machine rule (CONSCIOUS #15):** claim the Playwright slot before any run; release after — see `E:\MyAgent\workflow\testing\PLAYWRIGHT-SLOT.md`.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File E:\MyAgent\workflow\testing\scripts\claim-playwright-slot.ps1 -SessionId "proddeck-cloud-os-1.0-2026-07-17" -AppId proddeck -Project all -AgentRole e2e-lead
$env:PRODDECK_URL = "http://127.0.0.1:3320"
npm run test:e2e
powershell -NoProfile -ExecutionPolicy Bypass -File E:\MyAgent\workflow\testing\scripts\release-playwright-slot.ps1 -SessionId "proddeck-cloud-os-1.0-2026-07-17" -Result pass
```

Also: `npm run test:unit` (Dispatch deep-link contract).

## Evidence

`H:\releases\proddeck-1.0.0\evidence\e2e\` (create on promote pack cut). Until then: session notes under `agents/hires/`.

Devices SoT: `E:\MyAgent\workflow\devices\` — do not web-search sizes.
