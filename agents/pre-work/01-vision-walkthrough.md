# 01 - Vision Walkthrough

**Project:** ProdDeck  
**Date:** 2026-07-14 (supersedes 2026-07-13 launcher-only vision)  
**app-id:** `proddeck`  
**Public host:** `https://home.delena.buzz`  
**Initiative:** AgentVerse-style appliance (config-driven)

## End-to-End Overview

ProdDeck remains the **CSS-gated production app launcher** for VirtualDev Co. This release adds an appliance layer: **config packs**, **memory helpdesk**, and an optional **stub 3D hub** — without renaming the product and without cloning AgentVerse’s industrial office.

## User Journeys

1. **Open home** — `home.delena.buzz` / DEV `:3320` → CSS login (`clientId=proddeck`).
2. **Default surface** — **2D catalog deck** (unchanged primary job): tap tile → open app URL.
3. **Helpdesk** (module flag) — create/list tickets; route category → crew role from pack config.
4. **Scene** (module flag, off by default in UI preference until toggled) — stub hub only; not Agency office densify.
5. **Edge cases:** missing Bearer → catalog/helpdesk 401; CSS down → login error; empty catalog → empty state.

## Success Metrics

- Catalog launch path does not regress (JWKS gate intact).
- Helpdesk works on DEV without Postgres.
- Module toggles come from pack config, not hardcoded `if (appId)`.
- Other PREPROD/PROD apps untouched on promote.
- Realme ~360×800 usable.

## Non-Functional

| Item | Decision |
|------|----------|
| Auth | CSS only; `clientId=proddeck` |
| Ports | 3320 / 4320 / 5320 (in-place) |
| DB | No Postgres this release (memory helpdesk) |
| 3D | Stub only; behind feature flag |
| Name | ProdDeck only |

## Risks

| Risk | Mitigation |
|------|------------|
| Staging blank on cutover | Rollback playbook; prior H: pack |
| Scope creep to AgentVerse v2 look | Architect rejects; stub only |
| Catalog regression | Hard smoke gate before Q1 |

**Mental walkthrough:** Phone → CSS login → ProdDeck catalog → optional Helpdesk tab → optional stub scene → logout.
