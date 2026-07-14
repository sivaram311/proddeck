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

```bash
npm run test:e2e
npm run test:e2e:realme
npm run test:e2e:desktop
npm run test:e2e:tablet
```

Override URL: `PRODDECK_URL=http://127.0.0.1:3320 npm run test:e2e`

## Evidence

`H:\releases\proddeck-0.8.0\evidence\e2e\` (per-lane markdown from hired testers).

Devices SoT: `E:\MyAgent\workflow\devices\` — do not web-search sizes.
