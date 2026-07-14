# 04 - DB Design

**Status:** GO 2026-07-14  
**Project:** ProdDeck

## Decision

**No Postgres** for this release. Helpdesk uses **process memory** (`globalThis` store). Data resets on process restart — acceptable for MVP.

## Deferred

When helpdesk must survive restarts: reserve `app_proddeck` schemas `dev/preprod/prod` in `E:\MyAgent\workflow\db/` **before** wiring (CONSCIOUS #7).

## Local artifacts

- Static catalog: `data/apps.registry.json`
- Pack config: `packs/proddeck/app.json`
- No SQL migrations in this release.
