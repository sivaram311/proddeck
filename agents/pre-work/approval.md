# Pre-Work Approval Gate

**Project:** ProdDeck  
**Rule:** Crew Lead must not allow coding until this file records an explicit GO.

## Prior approval

| Date | Status | Scope |
|------|--------|-------|
| 2026-07-13 | **SUPERSEDED** | Classic 2D launcher 0.1.0 |

## Locked requirements (2026-07-14)

| Item | Decision |
|------|----------|
| Name | ProdDeck only / `proddeck` |
| Hosts | `home-staging.delena.buzz` / `home.delena.buzz` |
| Ports | **3320 / 4320 / 5320** in-place (no side-lane) |
| Auth | CSS `clientId=proddeck` |
| MVP | Catalog default + config pack + memory helpdesk + stub scene (flag) |
| DB | No Postgres this release |
| Isolation | Do not disturb other PREPROD/PROD apps |
| Patterns | `v0.2.2-stable` ideas; not `feature/stable-v2` office |
| Promote | Evidence + EM GO + **promote-field-ops**; Q1/Q2 after DEV soak |

## Decision

**Status:** **GO**  
**Approver:** User (explicit “proceed” 2026-07-14)  
**Date:** 2026-07-14  
**Notes:** Coding authorized for ProdDeck 0.2.0 AgentVerse-style MVP on DEV `:3320` only first. Grok NO-GO conditions addressed: refreshed 01–05, MVP contract, ownership map, cutover playbook, §9 locks confirmed by proceed. PREPROD/PROD deploy still requires promote crew + evidence — not authorized by this GO alone.
