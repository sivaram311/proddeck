# Crew Manifest — ProdDeck (AgentVerse-style initiative)

**Project:** ProdDeck  
**Initiative:** AgentVerse-style appliance (config-driven crews + helpdesk + scene)  
**Status:** Q1 PREPROD **LIVE** 0.2.0 — Q2 not started  
**app-id / clientId:** `proddeck`  
**Ports:** `3320` / `4320` / `5320` (unchanged; do not use AgentVerse lanes)  
**Hosts:** `home-staging.delena.buzz` · `home.delena.buzz`  
**Crew Lead:** Cursor  
**Workspace:** `E:\MyWorkspace\sandbox\proddeck\`  
**Session:** `proddeck-agentverse-style-2026-07-14`  
**Plan SoT:** `agents/pre-work/PLAN-agentverse-style-2026-07-14.md`  
**Approval:** `agents/pre-work/approval.md` **GO** 2026-07-14

## Members (this initiative)

| Role | Status | Notes |
|------|--------|-------|
| Crew Lead | Active | GO issued; DEV done |
| App Integrator | Active | DeckHome modules |
| Config / Pack | Active | `packs/proddeck` + Zod |
| Scene | Active | Stub CSS hub |
| Helpdesk | Active | Memory API+UI |
| Docs / QA | Active | OPS + smoke |
| Promote crew + field-ops | Hire at Q1 | After DEV soak |

## Isolation

Never stop `4310/4311/5310/5311/5080` or CSS. Cutover only `4320`/`5320`.

## Session history

- 2026-07-14: Pre-work re-GO; 0.2.0 pack/helpdesk/stub scene; DEV smoke PASS; other apps left running.
- 2026-07-13: Classic 0.1.0 Q1 live (`home-staging`).
