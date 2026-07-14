# MVP Contract — ProdDeck 0.2.0 (AgentVerse-style)

**Must ship**

| Item | Done when |
|------|-----------|
| Pack config `packs/proddeck/app.json` + Zod load | Boot fails closed on invalid pack |
| Catalog default route preserved | Existing smoke 200/401 still pass |
| Helpdesk GET/POST memory API + UI | Auth required; categories from pack |
| Stub scene behind module UI | No AgentVerse v2 assets |
| SemVer **0.2.0** | package.json + OPS |
| Isolation | No other app ports touched |

**Defer**

- Postgres, crews desk product UI, multi-pack, industrial 3D, new DNS/ports, Q1/Q2 until DEV soak + evidence

## File ownership (parallel lanes)

| Lane | Owner | Paths | Must not edit |
|------|-------|-------|----------------|
| A Shell | Integrator / Lead | `src/app/page.tsx`, `DeckHome.tsx`, layout | — |
| B Config | Config | `packs/**`, `src/lib/pack.ts`, `/api/pack` | middleware, jwt |
| C Helpdesk | Helpdesk | `src/helpdesk/**`, `/api/helpdesk`, `HelpdeskPanel` | catalog route |
| D Scene | Scene | `src/scene/**`, `StubScene.tsx` | CSS proxy, jwt |
| E Docs | Docs | `docs/OPS.md`, agents/pre-work, README | src logic |
| F QA | QA | `scripts/smoke.mjs` | feature UI |

Integrator merges; Lead serializes ACTIVITY-LOG.
