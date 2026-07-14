# Plan — ProdDeck AgentVerse-style (2026-07-14)

**Product name:** ProdDeck only (no new brand)  
**Session:** `proddeck-agentverse-style-2026-07-14`  
**Status:** PLAN + CREW + Grok 4.5 review — **NO-GO for coding** until pre-work re-approval  
**Crew Lead:** Cursor (this session)  
**External review:** Grok 4.5 (`cursor-grok-4.5-high`) — 2026-07-14 — verdict **NO-GO** until §10

---

## 1. Goal

Rebuild / evolve ProdDeck into an **AgentVerse-style appliance**: crews + helpdesk + app-appropriate 3D infrastructure, **config-driven** (not hardcoded app logic). Ship **fast** to PREPROD then PROD under MyAgent workflow — **without disturbing any other running apps**.

### Non-goals (MVP)
- Clone AgentVerse industrial office (`feature/stable-v2`) visuals or 0.4.x density
- New product name or new public hostname family
- Touch AgentVerse classic/v2, Agent Portal, CSS listeners, or other F:/G: apps
- Full 1:1 parity with every current ProdDeck launcher screen before first promote

---

## 2. Constraints (standing orders)

| Rule | Apply |
|------|--------|
| CONSCIOUS #6 ports | Keep **existing** ProdDeck trio `3320` / `4320` / `5320` — do **not** steal `3310/3311/4310/4311/5310/5311` |
| CONSCIOUS #8 CSS | Keep `clientId=proddeck`; no new IdP |
| CONSCIOUS #9 promote | Q1 + Q2 need `H:\releases\proddeck-<ver>\evidence\` + EM **GO**; hire **promote-field-ops** |
| Isolation | Never stop/restart AgentVerse, Portal, CSS, nginx wholesale for unrelated hosts |
| Name | UI + registries + hosts remain **ProdDeck** / `home[-staging].delena.buzz` |
| Config-first | App packs / YAML|JSON config for crews, helpdesk, scene, catalog surfaces — no `if (appId===…)` sprawl |

### Live topology to leave alone (observed 2026-07-14)

| Port | App | Action |
|------|-----|--------|
| 4310 / 5310 | agentverse classic | **Do not touch** |
| 4311 / 5311 | agentverse-v2 | **Do not touch** |
| 5080 | agent-portal | **Do not touch** |
| 4320 | proddeck PREPROD (live) | Replace **only** at controlled Q1 cutover |
| 5320 | proddeck PROD (reserved) | First bind at Q2 only |

---

## 3. Technical approach (summary)

1. **Baseline patterns** from AgentVerse tag `v0.2.2-stable` (Session Desk / crew UX), **not** from `feature/stable-v2`.
2. **Implementation home:** `E:\MyWorkspace\sandbox\proddeck` (product stays ProdDeck). Optional: extract shared adapters under `src/appliance/` with config under `config/` or `packs/proddeck/`.
3. **Git:** new branch on ProdDeck repo if present; else track work in sandbox + evidence. Do **not** merge industrial v2 office into ProdDeck.
4. **Cutover model:** build & smoke on DEV `:3320` → Q1 promote into `F:\apps\proddeck` `:4320` (same host `home-staging`) → Q2 into `G:\apps\proddeck` `:5320` / `home.delena.buzz`. Atomic stop/start **only** the ProdDeck process for that port.

### Config vs code

| Config (prefer) | Code (shell) |
|-----------------|--------------|
| Catalog / launcher entries, feature flags | CSS proxy + JWKS catalog gate (keep) |
| Crew roles → persona paths | Helpdesk ticket engine (thin) |
| Helpdesk categories / routing | Scene loader adapter interface |
| Scene pack id + asset roots | Auth token storage / session |
| Camera/spawn defaults | Next routes, promote scripts |

---

## 4. MVP surface (fast path)

1. CSS login (existing)  
2. **3D hub stub** or light scene (ProdDeck-themed, not AgentVerse office clone)  
3. **Helpdesk** panel (create/list; route to 1–2 crew roles)  
4. **Crews** desk (hire gate docs + activity tagging)  
5. **Catalog / app launcher** (preserve core job of ProdDeck — launch gated platform apps)  
6. Config-driven toggles for modules  

**Defer:** heavy industrial fidelity, Postgres unless required for tickets, multi-pack shell, new ports/hostnames.

---

## 5. Delivery phases (speed + safety)

| Phase | Owner roles | Exit criteria |
|-------|-------------|---------------|
| **P0 Pre-work gate** | Lead, Vision, Architect, Validation | Updated vision/architecture/approval **GO** for AgentVerse-style scope |
| **P1 Registries** | Lead, Docs | Confirm ports/CSS remain; ACTIVITY-LOG; no new colliding binds |
| **P2 DEV build** | Architect + implementers (Scene, Helpdesk, Config) | `:3320` smoke: login, catalog JWKS, helpdesk, stub scene |
| **P3 Q1 PREPROD** | promote-em, qa, security, ops, **field-ops** | Evidence pack; stop **only** ProdDeck on 4320; deploy `F:\apps\proddeck`; smoke `https://home-staging.delena.buzz`; other ports unchanged |
| **P4 Q2 PROD** | same promote crew | EM GO; deploy `G:\apps\proddeck` `:5320`; smoke `home.delena.buzz`; AgentVerse untouched |

---

## 6. Isolation checklist (ops)

- [ ] Before any F:/G: write: `netstat`/Get-NetTCPConnection confirms target port is ProdDeck only  
- [ ] Kill-by-port uses ProdDeck PID only (never `$PID` automatic var — field lesson)  
- [ ] Nginx/CF changes only for `home` / `home-staging` server_names  
- [ ] No edits under `F:\apps\agentverse*`, `G:\apps\agentverse*`, portal, CSS deploy trees unless CSS client seed already done  
- [ ] After cutover: re-smoke AgentVerse staging + v2 staging URLs as **non-regression** (read-only)

---

## 7. Risks

| Risk | Mitigation |
|------|------------|
| Staging home blank during cutover | Short window; keep previous H: release to roll back |
| Scope creep to AgentVerse v2 look | Explicit non-goal; Architect rejects office-density PRs |
| Parallel ACTIVITY-LOG scramble | EM serializes log rows |
| Catalog JWKS regression | Security + QA smoke 401/200 matrix before GO |
| Fast promote skips evidence | Gate blocked without H: pack + field-ops checklist |

---

## 8. Decisions locked

1. Product name = **ProdDeck** only  
2. Reuse ports `3320/4320/5320` and hosts `home[-staging].delena.buzz`  
3. Patterns from `v0.2.2-stable`, not `feature/stable-v2`  
4. Config-first app packs  
5. Do not disturb other PREPROD/PROD apps  

## 9. Decisions — Grok-recommended locks (pending user confirm)

| Topic | Recommended lock |
|-------|------------------|
| 3D v1 | **Stub scene** only (flagged); not themed full room |
| Helpdesk persistence | **Memory/file** for MVP — no Postgres until reserved |
| Launcher | **2D catalog remains default route** for one release; 3D behind flag |
| Ports | **Approve in-place** `4320`/`5320` reuse (no side-lane) + hard rollback playbook |
| Crews desk UX | Defer product “crews desk” if it doesn’t serve launcher; ops crew docs stay in `agents/` |

## 10. Grok review — gate before coding (top 5)

1. Refresh pre-work `01`–`05` + **new** `approval.md` GO; mark classic 2026-07-13 GO **superseded**.  
2. Confirm §9 locks with user.  
3. Write MVP contract + **file ownership map** (Integrator merges lanes).  
4. Cutover/rollback checklist (field-ops) for **only** 4320/5320 + catalog JWKS matrix.  
5. Slim active coding crew: Lead + Architect + **App Integrator** + sequential Config/Helpdesk/Scene; promote crew at P3; hire **promote-field-ops** late P2 / before any F: write.

**Conditional GO:** after 1–5 → P2 on `:3320` only.

### Parallel lanes (after GO)

| Lane | Owner | Owns | Rule |
|------|-------|------|------|
| A Shell | App Integrator (hire) | routes, layout, flags, catalog | Sole merger |
| B Config | Config specialist | packs + Zod | No route edits |
| C Helpdesk | Helpdesk | `src/helpdesk` + API | After B types |
| D Scene | Scene | stub pack only | No middleware/CSS proxy edits |
| E Docs/API | Docs + API | contracts, OPS | After A/C stabilize |
| F QA/Sec | QA + Security | `:3320` smokes + read-only AgentVerse non-regression | After merge |

---

## References

- `E:\MyAgent\workflow\CONSCIOUS.md`  
- `E:\MyAgent\workflow\promote\field-lessons.md`  
- `E:\machine-docs\personas\README.md`  
- AgentVerse baseline: `agentverse-project` @ `v0.2.2-stable`  
- Live PREPROD: `F:\apps\proddeck` `:4320`  
