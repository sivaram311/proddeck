# Hire — ProdDeck E2E Device Lab

**When:** 2026-07-15  
**Session:** `proddeck-keepers-quay-2026-07-14`  
**App:** ProdDeck **0.8.0** (Cloud OS Wave A)  
**Mandate:** CONSCIOUS #14 · `E:\MyAgent\workflow\testing\E2E-HIRE.md`  
**Base URL:** `https://home-staging.delena.buzz` (override `PRODDECK_URL`)  
**Worktree:** `E:\wt\proddeck-integrate` · branch `cloud-os/integrate`

## Parallel lanes (GO)

| Lane | Role | Owns | Viewport |
|------|------|------|----------|
| A | `e2e-realme` | `e2e/realme/**` | 360×780 |
| B | `e2e-desktop` | `e2e/desktop/**` | 1280×800 |
| C | `e2e-tablet` | `e2e/tablet/**` | 800×1280 |

**Lead owns:** `playwright.config.ts`, `e2e/fixtures/devices.ts`, hire note, ACTIVITY-LOG serialize, `docs/E2E.md` merge.

## Scope per lane

1. Home shell loads (CSS gate / Places reachable).
2. Pack `/api/pack` → version **0.8.0** + `os.enabled`.
3. Deep-links `?place=pulse|ports|yard|activity-log|filebridge` render without crash.
4. Wave A: dry-run POST `/api/os/ports/stop-dry-run` (critical deny) — from page or request fixture.
5. Screenshot on failure; min tap target awareness on Realme (44px+).
6. **Do not** apply activity drain to MyAgent (`DRAIN_TO_MYAGENT`).
7. **Do not** cut over F/G or touch other ports.

## Done when

Each lane: Playwright project green · notes in `H:\releases\proddeck-0.8.0\evidence\e2e\<lane>.md` · ACTIVITY-LOG row.
