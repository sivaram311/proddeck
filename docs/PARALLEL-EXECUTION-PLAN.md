# Parallel singleshot plan — Cloud OS roadmap

**Product:** ProdDeck · `docs/CLOUD-OS-ROADMAP.md`  
**Goal:** Hire **N specialized subagents** (tech-team skills) on **disjoint git branches/worktrees**, ship roadmap capabilities as fast as possible without merge chaos.  
**Session:** `proddeck-keepers-quay-2026-07-14`  
**Base:** `main` @ live 0.4.0 · DEV only until EM GO for promote

---

## 1. Honest framing: “singleshot” ≠ zero sequencing

You **can** run many subagents at once. You **cannot** safely have all of them edit `DeckHome.tsx` / Places shell on day zero.

**Pattern that actually works:**

```text
Wave 0 (Lead + Architect, 1 branch, short)
  → freeze contracts + Places shell + module registry
  → tag cloud-os/scaffold-v1
Wave 1 (N agents, N branches, parallel)  ← the big bang
  → each epic = one branch + ownership map
Wave 2 (fewer agents, parallel where possible)
  → cross-app Portal events / AgentVerse deep-links / FileBridge
Wave 3 (Lead + QA + Docs + Review, serial merge)
  → integrate → smoke → docs → optional Q1
```

“Singleshot” for the crew means: **one mission briefing → Wave 0 then fire all Wave-1 lanes together** — not twelve agents stomping one file.

---

## 2. Git topology

### Branches

| Branch | Owner lane | Purpose |
|--------|------------|---------|
| `main` | — | 0.4.0 protected; never parallel-write |
| `cloud-os/scaffold` | Lead Integrator | Wave 0 only |
| `feat/os-places-shell` | Integrator (if not in scaffold) | Places chrome if split |
| `feat/os-pulse` | Pulse engineer | Epic A |
| `feat/os-ports` | Ports engineer | Epic B |
| `feat/os-promote` | Promote UI engineer | Epic C |
| `feat/os-activity-log` | Ops-memory engineer | Epic D |
| `feat/os-archive` | Storage engineer | Epic E |
| `feat/os-beacon` | Infra UI engineer | Epic F |
| `feat/os-identity` | Auth UI engineer | Epic G |
| `feat/os-dispatch` | Work-plane engineer | Epic H |
| `feat/os-runbooks` | Helpdesk engineer | Epic I |
| `feat/os-appliances` | Catalog engineer | Epic J |
| `feat/os-drive-guard` | Rails engineer | Epic K (or fold into scaffold) |
| `feat/os-filebridge` | FileBridge engineer | Epic L |
| `feat/os-yard` | Crew Fabric engineer | Epic M |
| `feat/os-portal-events` | API contract engineer | Wave 2 events |
| `cloud-os/integrate` | Lead | Merge queue |

Optional: one branch per epic above **or** combine tiny ones (Beacon+Ports, Identity+DriveGuard) if N is limited.

### Worktrees (recommended for N agents)

```text
E:\MyWorkspace\sandbox\proddeck                     → Lead / integrate
E:\wt\proddeck-pulse         (branch feat/os-pulse)
E:\wt\proddeck-ports         (branch feat/os-ports)
E:\wt\proddeck-promote       ...
… one worktree per lane …
```

Each subagent: **cwd = its worktree only**. No shared dirty tree.

```powershell
# Example
cd E:\MyWorkspace\sandbox\proddeck
git fetch origin
git worktree add E:\wt\proddeck-pulse -b feat/os-pulse cloud-os/scaffold
```

---

## 3. Wave 0 — Scaffold (must finish before Wave 1 swarm)

**Hire:** Crew Lead + Technical Architect + App Integrator (2–3 max).  
**Branch:** `cloud-os/scaffold` → merge to tag `cloud-os/scaffold-v1`.

### Deliverables (contracts freeze)

1. **Places router** — `src/os/places.ts` enum + nav chrome component; Quay remains default visual shell.  
2. **Module registry** — `packs/proddeck/os-modules.json` (or extend `app.json`) with flags: `pulse`, `ports`, `promote`, …  
3. **Slot API** — each Place renders `<PlaceSlot id="pulse" />`; features register via `src/os/modules/<id>/index.tsx` exporting `{ PlaceView, apiRoutes? }`.  
4. **Shared types** — `src/os/types.ts` (`EnvChip`, `OsModuleId`, `HealthSnapshot`, …).  
5. **Drive Guard chip UI stub** — display-only; writes later.  
6. **Ownership map file** — `agents/pre-work/CLOUD-OS-OWNERSHIP.md` (this plan’s §4).  
7. **Smoke base** — existing smoke still green; add `GET /api/pack` still 0.4.x or bump to `0.5.0-scaffold`.

**Exit:** `typecheck` + `build` + `smoke` green on scaffold tag. **Then** open Wave 1.

---

## 4. File ownership (non-negotiable)

| Path / area | Who may write in Wave 1 |
|-------------|-------------------------|
| `src/os/shell/**`, `src/os/places.ts`, Places nav | **Lead only** after Wave 0 (or Integrator lane closed) |
| `src/os/modules/pulse/**`, `/api/os/pulse` | Pulse lane |
| `src/os/modules/ports/**`, `/api/os/ports` | Ports lane |
| `src/os/modules/promote/**`, `/api/os/promote` | Promote lane |
| `src/os/modules/activity-log/**`, `/api/os/activity-log` | Log lane |
| `src/os/modules/archive/**` | Archive lane |
| `src/os/modules/beacon/**`, `/api/os/beacon` | Beacon lane |
| `src/os/modules/identity/**` | Identity lane |
| `src/os/modules/dispatch/**` | Dispatch lane |
| `src/os/modules/runbooks/**` (+ helpdesk extensions) | Runbooks lane |
| `src/os/modules/appliances/**` | Appliances lane |
| `src/os/modules/drive-guard/**` | Drive Guard lane |
| `src/os/modules/filebridge/**` | FileBridge lane |
| `src/os/modules/yard/**` | Yard / Crew Fabric lane |
| `packs/proddeck/app.json` module flags | Each lane edits **only its flag**; Lead merges conflicts |
| `src/components/DeckHome.tsx` | **Forbidden in Wave 1** — shell absorbs Quay; or Lead-only shim |
| `src/scene/**` | **Out of scope** unless bugfix (no densify) |
| `scripts/smoke.mjs` | QA lane owns additions; feature lanes add `smoke-<id>.mjs` |
| `docs/**` | Docs lane consolidates at Wave 3; lanes may add `docs/os/<id>.md` only |
| `ACTIVITY-LOG.md` | **Lead only** (serial) |
| Agent Portal / AgentVerse repos | Wave 2 dedicated lanes only |

If two lanes need the same shared util → request Lead to add stub in scaffold, then continue.

---

## 5. Wave 1 — Swarm (hire N in parallel)

Each hire gets: branch, worktree, skill brief, MVP acceptance, **forbidden paths**, Realme rules.

### Recommended hire table (tech team skills)

| # | Branch | Skill / persona | Epic | MVP done when |
|---|--------|-----------------|------|---------------|
| 1 | `feat/os-pulse` | Systems / SRE UI | A Pulse | `/api/os/pulse` returns drive free + process basics; Place view 44px cards |
| 2 | `feat/os-ports` | Platform eng | B Ports | Read MyAgent registry JSON + listening mismatch UI |
| 3 | `feat/os-identity` | Auth / CSS UI | G Vault | Session strip; sign-out; re-auth hook stub |
| 4 | `feat/os-activity-log` | Ops tooling | D Log | Read-only tail/filter ACTIVITY-LOG via API (safe path) |
| 5 | `feat/os-archive` | Storage UI | E Archive | Links/SSO open H-Drive evidence folders |
| 6 | `feat/os-dispatch` | Agent platforms | H Dispatch | Deep-link builder to AgentVerse Session Desk + return URL |
| 7 | `feat/os-promote` | Promote EM UI | C Promote | Checklist UI + GO/HOLD **record** (no deploy scripts) |
| 8 | `feat/os-yard` | Crew Fabric | M Yard | Mission templates + lane board UI + skill pack list (static) |
| 9 | `feat/os-runbooks` | Support eng | I Runbooks | Category → runbook → Dispatch/Yard links |
| 10 | `feat/os-appliances` | Catalog | J Appliances | Fleet tiles status+open (config-driven) |
| 11 | `feat/os-beacon` | Infra UI | F Beacon | Host→upstream health table |
| 12 | `feat/os-drive-guard` | Rails | K Drive Guard | Env chip wired into shell events |
| 13 | `feat/os-filebridge` | Files | L FileBridge | Scoped browse UI or deep-link to FileBridge |

**N can be 8–13.** If capacity limited, **drop/queue** Beacon + FileBridge + Appliances to Wave 1b; keep Pulse, Ports, Identity, Log, Archive, Dispatch, Promote, Yard as **Wave 1a**.

### Skill brief template (paste per agent)

```text
You are <skill> on branch <branch> worktree <path>.
Base: cloud-os/scaffold-v1.
OWN only: <paths>.
FORBIDDEN: DeckHome.tsx, scene/, other os/modules/*, ACTIVITY-LOG.
MVP: <one paragraph>.
Realme: 360×800, tap ≥44px, no pointer-lock.
CSS clientId remains proddeck. No new ports without Lead.
Do not promote to F:/G:. DEV :3320 only if you start servers — prefer typecheck/build.
When done: commit on your branch, write docs/os/<id>.md, stop.
```

### Parallel spawn command (Lead)

1. Confirm scaffold tag exists.  
2. Create N worktrees.  
3. Launch N Cursor CLI / Task agents with briefs (same clock).  
4. Lead monitors PRs / branch heads — **does not** code features.  
5. ACTIVITY-LOG: Lead appends one row “Wave 1 swarm started” and one “lane X done” as agents finish.

---

## 6. Wave 2 — Cross-repo / contracts (parallel subset)

Depends on Wave 1 modules existing behind flags.

| Lane | Repo | Job |
|------|------|-----|
| Portal events | `agent-portal` | Stub `dispatch.*`, `promote.decision`, `crew.fabric.*` |
| AgentVerse deep-link land | `agentverse-project` | Accept `src=proddeck&crew&brief&return` (classic branch — not v2 densify) |
| Security review | skill `promote-security` | CSS/CORS/JWKS for new `/api/os/*` |
| API contracts doc | API specialist | Freeze OpenAPI-ish notes in `docs/os/contracts.md` |

These can run **in parallel with each other**; Portal/AV may start once Dispatch/Promote interfaces are typed (even if UI WIP).

---

## 7. Wave 3 — Integrate → verify → docs

**Serial merge order (Lead):**

1. `drive-guard` → shell  
2. `identity` → shell  
3. `pulse`, `ports`, `beacon` (Control Tower)  
4. `activity-log`, `archive`  
5. `dispatch`, `runbooks`, `appliances`  
6. `promote`, `yard`  
7. `filebridge`  
8. Rebase conflicts: **Lead only**

**Then hire (can be parallel after merge):**

| Skill | Job |
|-------|-----|
| QA | Expand smoke for `/api/os/*` + Realme checklist |
| Docs-Keeper | WORLD / OPS / HANDOFF / CLOUD-OS-ROADMAP status → 0.5.0 |
| Review | Ownership + CONSCIOUS compliance |
| EM | SemVer `0.5.0`; optional Q1 GO later |

---

## 8. Merge & SemVer policy

- Feature branches merge to `cloud-os/integrate`, not straight to `main`, until green.  
- `main` gets one commit train: `Ship cloud-os 0.5.0 Places + Wave1 modules`.  
- Module flags default **on for DEV**; pack allows kill-switch per module if merge late.  
- **No F:/G: promote** until Lead + smoke + evidence pack.

---

## 9. How “faster” actually happens

| Lever | Effect |
|-------|--------|
| Disjoint modules | True parallel coding |
| Worktrees | No stash fights |
| Skill briefs | Less thrash / wrong files |
| Scaffold contracts | Avoid rewrite wars |
| Lead as merge bot | Continuous integration |
| QA after integrate | Don’t serialize QA behind every lane |
| ACTIVITY-LOG serial | Avoid scrambled table (field lesson) |

**Anti-patterns that kill speed:** all agents on `main`; everyone edits DeckHome; parallel ACTIVITY-LOG writers; promoting mid-swarm; expanding Quay 3D during OS ship.

---

## 10. Suggested singleshot mission card (copy for Yard later)

```text
Mission: cloud-os-0.5-singleshot
Env: DEV (E:)
Base: cloud-os/scaffold-v1
Pack: feature-ship + parallel os lanes
Lanes: pulse, ports, identity, activity-log, archive, dispatch, promote, yard
  (+ optional: beacon, appliances, runbooks, drive-guard, filebridge)
Serializer: Crew Lead
Forbidden: F:/G: writes, AgentVerse office densify, delete without confirm
Exit: integrate green smoke → docs → stop (promote separate GO)
```

---

## 11. Capacity recipes

| Agents available | Run |
|------------------|-----|
| **4** | Wave 0; Wave 1a only (pulse, ports, identity, yard); Wave 1b later |
| **8** | Wave 0; full Wave 1a + dispatch + promote + log + archive |
| **12+** | Full Wave 1 table + start Wave 2 Portal/AV in parallel |
| **N unlimited** | Still **Wave 0 first**; add lanes only with empty ownership cells |

---

## 12. Immediate Lead checklist to start

- [x] Freeze this ownership map in `agents/pre-work/CLOUD-OS-OWNERSHIP.md`  
- [x] Cut `cloud-os/scaffold` and ship scaffold-v1  
- [ ] Create worktrees for chosen Wave 1a set  
- [ ] Hire N agents with pasted skill briefs  
- [ ] Open `cloud-os/integrate`  
- [ ] One ACTIVITY-LOG row for swarm start (Lead)  
- [ ] After lanes done → merge → smoke → docs → SemVer 0.5.0  

---

## 13. Related

- [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md) — product epics  
- [WORLD.md](./WORLD.md) — Quay mythos (do not expand in this mission)  
- `E:\MyAgent\workflow\promote\` — skill pack pattern to mirror in Yard  
- `E:\machine-docs\personas\` — persona skills for Crew Lead / Architect / QA  

---

| Date | Note |
|------|------|
| 2026-07-14 | Wave 0 scaffold done: Places shell + stubs + DeckHome wire; pack `0.5.0-scaffold`; tag `cloud-os/scaffold-v1` |
| 2026-07-14 | Parallel singleshot plan written for roadmap Wave 0→3 + N worktrees |
