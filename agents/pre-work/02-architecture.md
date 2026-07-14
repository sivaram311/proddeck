# 02 - Technical Architecture

**Status:** GO 2026-07-14 (AgentVerse-style scope)  
**Project:** ProdDeck  
**Baseline patterns:** AgentVerse `v0.2.2-stable` auth/proxy ideas — **not** `feature/stable-v2` office

## Stack

| Layer | Choice |
|-------|--------|
| App | Next.js 15 + React 19 + TypeScript + Tailwind |
| Auth | CSS proxy `/api/css/[...path]`; JWKS catalog/helpdesk gate |
| Pack | `packs/proddeck/app.json` validated at load (Zod) |
| Helpdesk | In-memory process store + `/api/helpdesk` |
| Scene | CSS/Web stub hub component (no R3F industrial assets) |
| Ports | 3320 / 4320 / 5320 |

## Modules (feature flags in pack)

```text
catalog=on (default route)
helpdesk=on
scene=stub (UI behind toggle; not default first paint)
crewsDesk=off (ops docs stay in agents/)
```

## Components

```text
Browser
  ├─ Login → CSS
  ├─ DeckHome (catalog default)
  ├─ HelpdeskPanel → /api/helpdesk
  └─ StubScene (flag)
Next API
  ├─ /api/css/*
  ├─ /api/catalog (JWKS)
  ├─ /api/pack (public module flags / categories — no secrets)
  └─ /api/helpdesk (JWKS + memory)
```

## Out of scope

- Postgres helpdesk
- Multi-pack shell
- AgentVerse office mesh / DeskPods / IndustrialCeiling
- New ports or hostnames

## Isolation

Never bind/stop AgentVerse `4310/4311/5310/5311` or portal `5080` for this work.
