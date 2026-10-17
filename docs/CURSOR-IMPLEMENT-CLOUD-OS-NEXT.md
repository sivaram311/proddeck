# Cursor implementation brief — ProdDeck Cloud OS next

**Purpose:** Drop this file into Cursor (Composer / Agent) as the single SoT for implementing remaining ProdDeck Cloud OS work after **0.8.4**.

**Product:** ProdDeck · `https://home.delena.buzz`  
**Live pin:** **0.8.4** · pack `H:\releases\proddeck-0.8.4` · tag `v0.8.4`  
**IdP:** css-next **v0.2.1** hybrid (`https://css-next.delena.buzz` · BFF `:5910`)  
**clientId:** `proddeck`  
**Primary worktree:** `E:\wt\proddeck-integrate`  
**Repo:** `https://github.com/sivaram311/proddeck`  
**Strategy SoT:** [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md) · [CLOUD-OS-0.8-PLAN.md](./CLOUD-OS-0.8-PLAN.md)

**Target SemVer train:**  
`0.8.5` (close-the-loop) → `0.9.0` (hard outs, flag-gated) → `1.0.0` (Cloud OS v1)

---

## 0. How Cursor should work this file

1. **Read first (do not skip):** this doc + `AGENTS.md` (if present) + `docs/OPS.md` + `docs/SUPPORTED-VERSIONS.md` + module notes under `docs/os/`.
2. **One work item at a time** (IDs: A1, B1, B2…). Do not mix hard outs in one PR.
3. **Default branch model:** feature branch from `main` / integrate tip → merge only after typecheck + smoke + Device Lab if UI changed.
4. **Never** kill non-ProdDeck ports. Cutover only `3320` / `4320` / `5320`.
5. **Never** touch AgentVerse `4310/4311/5310/5311` or Portal `4080/5080` process lifecycle for ProdDeck work.
6. **Hard outs (B\*) require explicit human EM GO** before coding destructive IO. If GO is missing, implement **UI + API dry-run / feature-flag OFF** only.
7. Prefer **parallel worktrees** only when file ownership does not overlap (see §10).
8. After meaningful ships: update `docs/SUPPORTED-VERSIONS.md`, `docs/HANDOFF.md`, `package.json` version, and append ACTIVITY-LOG via proper serializer (not free-edit scramble).

### Suggested Cursor system prompt (paste once)

```text
You are implementing ProdDeck Cloud OS work from docs/CURSOR-IMPLEMENT-CLOUD-OS-NEXT.md.
Rules:
- Next.js 15 App Router · React 19 · TypeScript strict · phone-first ≥44px targets
- Auth: css-next hybrid, clientId=proddeck, tokens in localStorage prodDeck* keys
- CONSCIOUS safety: no silent deletes, no G:/H: writes without typed confirm + CSS freshness,
  no process kill without EM allowlist + double confirm, never deny-list critical ports
- Do not embed AgentVerse office; Dispatch only deep-links with query contract
- Isolate ports: only 3320/4320/5320 for ProdDeck
- Ship one backlog ID per PR; add smoke + Playwright Device Lab when UI changes
- Prefer extending existing modules under src/os/modules/* and src/app/api/os/*
Implement only the backlog ID I specify. Stop when acceptance criteria pass.
```

### Per-task Cursor user prompt template

```text
Implement backlog item {ID} from docs/CURSOR-IMPLEMENT-CLOUD-OS-NEXT.md §{section}.
Worktree: E:\wt\proddeck-integrate
Read existing module docs under docs/os/ and current source before editing.
Do not implement other backlog IDs.
When done: list files changed, how to smoke, and any EM GO still required for F/G.
```

---

## 1. Product thesis (do not violate)

| Rule | Meaning |
|------|---------|
| **Home = control plane** | Pulse, Ports, Beacon, Promote, Archive, Identity, Dispatch, Yard |
| **AgentVerse = work plane** | Crews live, chat, code — ProdDeck launches + watches, does not clone 3D office |
| **Phone-first** | Realme P2 Pro ~360×800 · Places IA · ≥44px rows · short scrolls |
| **Peers not clones** | Deep-link + events; never embed AV chat in home |
| **Rails over vibes** | CONSCIOUS / ports registry / promote Q1Q2 / ACTIVITY-LOG |

---

## 2. Current live baseline (already done — do not re-build)

| Area | Status | Key paths |
|------|--------|-----------|
| Places shell + Quay | LIVE | `src/os/shell/*`, `src/scene/keepers-quay/*` |
| Pulse | LIVE | `src/os/modules/pulse/*`, `src/app/api/os/pulse` |
| Ports read + request-reserve/stop event + stop **dry-run** | LIVE | `src/os/modules/ports/*`, `src/app/api/os/ports/**` |
| Activity log viewer + queue + Lead drain | LIVE | `src/os/modules/activity-log/*` |
| Archive / H: browse | LIVE | `src/os/modules/archive/*` |
| FileBridge list jail (delete 403) | LIVE | `src/os/modules/filebridge/*` |
| Drive Guard confirm UX (no disk IO) | LIVE | `src/os/modules/drive-guard/*` |
| Identity / Vault + CSS freshness probe | LIVE | `src/os/modules/identity/*` |
| Promote GO/HOLD checklist | LIVE | `src/os/modules/promote/*` |
| Dispatch deep-link builder | LIVE | `src/os/modules/dispatch/*` |
| Yard board + skill registry + fabric events mirror | LIVE | `src/os/modules/yard/*` |
| Beacon / Appliances / Runbooks | LIVE | respective modules |
| Device Lab Playwright | LIVE | `e2e/`, `playwright.config.ts` |
| css-next hybrid auth | LIVE 0.8.4 | `src/lib/cssEnv.ts`, `src/lib/auth.ts`, `/auth/callback` |

**Deny-list for port stop (never kill):**  
`80,443,5432,5900,9000,4900,4080,5080,4310,4311,5310,5311,3320,4320,5320`  
(see `NEVER_STOP_PORTS` in `src/os/modules/ports/stopDryRun.ts`)

---

## 3. Backlog overview (what Cursor will implement)

| Phase | SemVer | Items | Blast |
|-------|--------|-------|-------|
| **A — Close the loop** | 0.8.5 | A1, A2 | Low |
| **B — Hard outs** | 0.9.0 | B1–B5 | High — EM GO each |
| **C — Fleet Device Labs** | any ship | C1–C3 | Peer apps |
| **D — Cloud OS 1.0** | 1.0.0 | D1–D8 | Medium–High |
| **E — Peer / cross-app** | peer trains | E1–E4 | Outside pure ProdDeck |

---

## 4. Phase A — Close the loop (0.8.5)

### A1 — Drain leftover F/G activity staging queues

**Goal:** Operators (Lead) can preview and drain staging queues on PREPROD/PROD the same safe path as DEV.

**Existing code:**  
- `src/os/modules/activity-log/drain.ts` — `DRAIN_CONFIRM_PHRASE = "DRAIN_TO_MYAGENT"`  
- `src/os/modules/activity-log/queue.ts`  
- `src/app/api/os/activity-log/route.ts`  
- UI: `src/os/modules/activity-log/index.tsx`

**Implement:**

1. Ensure dry-run returns full row preview (count + sample) on F/G paths.
2. Apply mode requires exact phrase `DRAIN_TO_MYAGENT` (case-sensitive).
3. Serialize appends to `E:\MyAgent\workflow\activity\ACTIVITY-LOG.md` with file lock (already sketched in `drain.ts`).
4. On F/G: document which queue path is used (`.data` under app cwd vs shared staging). If PREPROD/PROD use different cwd, make queue path **env-configurable**:
   - `ACTIVITY_QUEUE_PATH` (optional)
   - default: `{cwd}/.data/activity-queue.jsonl`
5. UI: Preview → type phrase → Apply; disable Apply without phrase; never bulk-apply without preview first.
6. After apply: clear only drained rows; leave undrained; log `result` in queue/notes.

**Acceptance:**

- [ ] `POST /api/os/activity-log` `{op:"drain",mode:"dry-run"}` never mutates files  
- [ ] apply without phrase → **400**  
- [ ] apply with phrase → rows appear in ACTIVITY-LOG.md; queue shortened  
- [ ] concurrent drain blocked by lock (second request waits or 409)  
- [ ] Phone UI works at 360px width  

**Out of scope:** Free-edit of ACTIVITY-LOG; auto-drain cron.

---

### A2 — E2E docs + evidence hygiene on main

**Goal:** Device Lab evidence and docs stay current after every UI ship.

**Files:**  
- `docs/E2E.md`  
- `playwright.config.ts`  
- `e2e/**`  
- evidence under `H:\releases\proddeck-{ver}\evidence\e2e\`

**Implement:**

1. Document run commands (already in package.json):  
   `npm run test:e2e` · `test:e2e:realme` · `test:e2e:desktop` · `test:e2e:tablet`
2. After UI changes: run three projects; paste SUMMARY into evidence folder for the release pack.
3. Keep `docs/E2E.md` in sync with project names and viewports:
   - Realme: **360×780**
   - Desktop: **1280×800**
   - Tablet: **800×1280**

**Acceptance:**

- [ ] `docs/E2E.md` matches Playwright config  
- [ ] CI/local green 24/24 (or document intentional skips)  

---

## 5. Phase B — Hard outs (0.9.0) — EM GO required per item

> **Cursor rule:** If the user has not said “EM GO for B{n}”, implement behind `FEATURE_*` flags default **false**, or stop after design PR.

### Feature flags (add once for all B items)

Prefer env flags (server) + optional public flags only when UI must show gated CTAs:

| Flag | Default | Purpose |
|------|---------|---------|
| `OS_FILEBRIDGE_DELETE=0` | off | B1 |
| `OS_DRIVE_GUARD_MUTATE=0` | off | B2 |
| `OS_PORTS_STOP_KILL=0` | off | B3 |
| `OS_YARD_LIVE_RUNNERS=0` | off | B4 |

Never enable on G: without promote evidence.

---

### B1 — FileBridge H: delete IO

**Today:** DELETE/POST/PUT/PATCH → **403** `{ code: "conscious_no_delete" }`  
**Docs:** `docs/os/filebridge.md`  
**Code:** `src/os/modules/filebridge/list.ts` (jail), `src/app/api/os/filebridge/route.ts`, UI `filebridge/index.tsx`

**Goal:** Allow **delete of a single file under `H:\releases` only**, never directories bulk, never outside jail.

**Safety design (mandatory):**

1. Path must pass `normalizeReleasesRel` + `assertInsideReleases` (existing).
2. Target must be **file** not directory (reject dirs with 400).
3. Require:
   - Fresh CSS session (`probeCssSessionFresh`)
   - Typed confirm phrase: `DELETE_RELEASE_FILE`
   - Body includes full `rel` path + `basename` echo match
4. Feature flag `OS_FILEBRIDGE_DELETE=1` required; else 403 same as today.
5. Append audit row via activity-log queue (`action=filebridge.delete`, target=rel).
6. Prefer recycle/soft-delete only if already standard on machine; else hard delete with audit — **document which**.

**API sketch:**

```http
POST /api/os/filebridge/delete
Content-Type: application/json
Authorization: Bearer <proddeck JWT>

{
  "rel": "proddeck-0.8.4/evidence/q1/notes.txt",
  "confirmName": "notes.txt",
  "confirmPhrase": "DELETE_RELEASE_FILE"
}
```

**UI:**

- Hidden unless flag on + CSS fresh.
- Select file → type basename → type phrase → Delete.
- Blast-radius copy: `Env: RELEASES (H:) · Affects: one file · Undo: none`

**Acceptance:**

- [ ] Outside `H:\releases` → 403 path_denied  
- [ ] Directory target → 400  
- [ ] Flag off → 403 conscious_no_delete  
- [ ] Wrong phrase / stale CSS → 401/403  
- [ ] Success → file gone + activity queue row  
- [ ] Device Lab: delete panel usable on Realme width  

**EM GO checklist (human):** exact allowlist of path prefixes if any; confirm no delete of `*/app/**` live packs without extra gate.

---

### B2 — Drive Guard real G:/H: mutations

**Today:** `requireEnvConfirm` is **gate UX only** — no disk IO (`docs/os/drive-guard.md`).

**Goal:** First real mutations are **narrow, allowlisted operations** only — not free filesystem browser.

**Allowed operations for 0.9 (propose):**

| Op | Description | Confirm |
|----|-------------|---------|
| `write_pin_file` | Write/update a single pin JSON under app-owned path | PROD/RELEASES + CSS fresh |
| `touch_promote_marker` | Write decision artifact under release evidence path | PROD + CSS fresh |

**Forbidden forever in this module:** partition, format, mass delete, `rm -rf`, nginx reload, postgres ops.

**Implement:**

1. Extend `src/os/modules/drive-guard/confirm.ts` with `assertMutationAllowed(op, env, paths[])`.
2. New API `POST /api/os/drive-guard/mutate` gated by `OS_DRIVE_GUARD_MUTATE=1`.
3. Allowlist map of absolute roots (e.g. only `H:\releases\proddeck-*/evidence/**` and explicit DEV sandbox).
4. UI only appears in Promote / Archive “dangerous” panels with blast-radius copy.

**Acceptance:**

- [ ] Unknown op → 400  
- [ ] Path outside allowlist → 403  
- [ ] Flag off → 403  
- [ ] PROD without typed `PROD` → 403  
- [ ] Stale CSS → re-auth required  

---

### B3 — Ports actual stop/kill

**Today:** `POST /api/os/ports/stop-dry-run` only; `wouldKill: false` always.

**Goal:** Kill **only** allowlisted, non-deny-list, registry-known listeners with double confirm.

**Build on:** `src/os/modules/ports/stopDryRun.ts` → new `stopKill.ts`.

**Rules:**

1. Must pass same dry-run `allowed: true` logic first.
2. Deny-list `NEVER_STOP_PORTS` **absolute** — never kill.
3. Require feature flag `OS_PORTS_STOP_KILL=1`.
4. Require body:
   - `ports: number[]` (max 3 per request)
   - `confirmPhrase: "STOP_PORT_PROCESS"`
   - `confirmPorts: number[]` (must equal `ports` sorted)
   - CSS fresh session
5. Implementation on Windows: resolve PID via netstat (existing), then `taskkill /PID {pid} /T` only if PID still owns that port (re-check).
6. Never kill PID 0 / system critical; refuse if PID maps to multiple deny ports.
7. Emit os-event + activity queue row per port.

**API sketch:**

```http
POST /api/os/ports/stop
{
  "ports": [3456],
  "confirmPorts": [3456],
  "confirmPhrase": "STOP_PORT_PROCESS",
  "mode": "kill"
}
```

**UI:**

- Show dry-run first (existing).
- Only then enable “Stop process” when flag on.
- Red blast copy; type phrase; list ports again.

**Acceptance:**

- [ ] Dry-run path unchanged  
- [ ] Kill deny-list port → 403  
- [ ] Flag off → 403  
- [ ] Success → port no longer LISTENING; audit row  
- [ ] Smoke script for dry-run still green  

**EM GO:** explicit allowlist of appIds eligible for kill (e.g. only sandbox/dev apps).

---

### B4 — Live Portal runners (Yard)

**Today:** Yard shows templates, skill registry, fabric events mirror; hire is event/deep-link oriented — not true process spawn.

**Goal:** “Hire pack” creates real Agent Portal sessions / workers when Portal API allows.

**Depends on peers:**

- Agent Portal ≥ **0.1.8** `POST /api/os-events` (and any session spawn API — discover in Portal repo)
- CSS client `proddeck` authorized

**Implement (ProdDeck side):**

1. `src/os/modules/yard/runners.ts` — client for Portal spawn + poll status.
2. Map skill packs (`skill-packs.ts`) → hire payload: `skillIds[]`, `brief`, `env`, `returnUrl`.
3. Lane board status from live poll: `queued|running|blocked|done|failed`.
4. Flag `OS_YARD_LIVE_RUNNERS=1`; default off → keep soft events only.
5. On spawn failure: leave lane `blocked` + “Send to AgentVerse” deep-link (existing Dispatch).

**Events (existing contract):**

| Event | Direction |
|-------|-----------|
| `crew.fabric.spawned` | Yard → Portal / ACTIVITY-LOG |
| `crew.fabric.lane.done` | Portal → Yard |

**Acceptance:**

- [ ] Flag off → no Portal spawn calls  
- [ ] Flag on + Portal up → lanes leave `queued`  
- [ ] Portal down → graceful blocked + message  
- [ ] Never spawns with env=prod without Drive Guard confirm  

**EM GO:** side-fleet / DEV first; no G: auto-hire of ops lanes.

---

### B5 — Quay densify mega

**Goal:** Optional visual density upgrade for Keepers’ Quay scene — **brand only**.

**Paths:** `src/scene/keepers-quay/*`

**Rules:**

- Do **not** block Places utility on 3D load.
- Keep mobile FPS acceptable; lazy-load heavy assets.
- Ship as separate branch/pack; do not couple to hard outs.
- Prefer progressive enhancement; stub scene fallback remains.

**Acceptance:**

- [ ] Realme Device Lab still green  
- [ ] Places usable if WebGL fails  
- [ ] No new auth/ports surface  

---

## 6. Phase C — Device Labs (CONSCIOUS #14)

### C3 — ProdDeck Device Lab (in-repo)

On every UI-touching PR:

```powershell
cd E:\wt\proddeck-integrate
npm run typecheck
npm run smoke
npm run test:e2e:realme
npm run test:e2e:desktop
npm run test:e2e:tablet
```

Hire pattern (machine law): follow `E:\MyAgent\workflow\testing\E2E-HIRE.md` when available.

### C1 / C2 — Peer Device Labs

**Out of ProdDeck repo** — track only:

| ID | App | Ports | Note |
|----|-----|-------|------|
| C1 | Agent Portal | 4080/5080 | Realme + desktop + tablet |
| C2 | AgentVerse classic | 4310/5310 | Do not disturb v2 4311/5311 |

Cursor: open peer repo worktrees; do not robocopy upgrade over classic densify.

---

## 7. Phase D — Cloud OS 1.0 capabilities

Ship only after Phase B safety rails exist (even if some flags still off in prod).

### D1 — Stable Home ↔ AgentVerse deep-link contract

**SoT:** `docs/os/av-deeplink-contract.md`, `src/os/modules/dispatch/build-url.ts`

```text
https://{av-host}/desk?
  src=proddeck
  &crew=<id>
  &session=<portalSessionId?>
  &intent=session-desk|hire|watch|crew-fabric
  &brief=<base64url>
  &skills=<comma-ids>
  &return=https://home.delena.buzz/?osPlace=watch
  &env=dev|preprod|prod
```

**Default Dispatch peer:** agentverse-**upgrade** hosts (4312/5312), not classic densify — see SUPPORTED-VERSIONS.

**Tasks:**

- [ ] Contract tests for URI builder (unit)  
- [ ] Round-trip brief length limits (≤2KB decoded)  
- [ ] Classic host only as explicit rollback chooser  

### D2 — Watch as real ops

- Aggregate fabric lanes + Portal session health + Pulse alerts.
- Cards deep-link AV; no embedded chat.

### D3 — Stack Pilot bridge return

- Appliances tile → `control.delena.buzz` with return URL to home Place.
- Document env chips.

### D4 — Ports reserve/stop via **job** (not raw listen)

- Request reserve already events; ensure Portal job path + ACTIVITY-LOG.
- Kill path only via B3 flags.

### D5 — Drive Guard hard gates on G/H

- All write UIs call shared confirm + CSS freshness.
- Mutation API only allowlisted (B2).

### D6 — Crew Fabric live lanes + skill registry UI

- Skill registry reads MyAgent skills + personas (already partial).
- Live runners from B4.
- EM-only merge/GO for promote packs.

### D7 — One-tap promote-q2 from phone

- Yard pack `promote-q2` → lanes + Promote GO checklist pre-filled evidence paths.
- Ops lane blocked until GO.

### D8 — Cloud OS v1 definition of done

A phone-only operator can:

1. See machine health (Pulse)  
2. See port mismatches (Ports)  
3. Record promote GO/HOLD with CSS identity  
4. Hire parallel skill crew (Yard)  
5. Browse H: releases (Archive / FileBridge)  
6. Dispatch leftover work to AgentVerse  

…without RDP; destructive power still gated.

---

## 8. Phase E — Peer / cross-app (track, may be other Cursor windows)

| ID | Work | Owner repo |
|----|------|------------|
| E1 | Portal `POST /api/os-events` live on 4080/5080 if not complete | agent-portal |
| E2 | AV Desk honors all `/desk` query params | agentverse / upgrade |
| E3 | Portal F/G cutover for OS events scaffolding | agent-portal |
| E4 | Preserve classic CSS for non-migrated apps | css / css-next |

ProdDeck only **consumes** these; do not break peers to “make home green.”

---

## 9. Architecture map (where to code)

```text
src/
  app/api/os/           # Route handlers (pulse, ports, filebridge, activity-log, beacon, events)
  os/
    places.ts           # Place IDs
    registry.tsx        # Module registry
    shell/              # PlacesNav, PlacePanel, DriveGuardChip
    modules/
      pulse/
      ports/            # B3
      activity-log/     # A1
      filebridge/       # B1
      drive-guard/      # B2
      yard/             # B4, D6, D7
      promote/          # D7
      dispatch/         # D1
      identity/         # CSS freshness for all hard outs
      archive/
      beacon/
      appliances/       # D3
      runbooks/
  lib/
    auth.ts · config.ts · cssEnv.ts · jwt.ts
  scene/keepers-quay/   # B5 only
e2e/                    # C3
docs/os/*               # Update per module when behavior changes
```

### API conventions

- JSON only; `{ ok: true, ... }` / `{ ok: false, error, message, code? }`
- Auth: Bearer proddeck JWT for mutating routes
- Mutating routes: CSRF-unfriendly cookies not used; still require fresh CSS probe where documented
- No silent defaults to localhost issuer on F/G builds — bake `NEXT_PUBLIC_CSS_ISSUER`

### Mobile UI conventions

- Min touch **44px**
- Env chip always visible on dangerous Places
- Prefer lists + sheets over modals that trap focus poorly on mobile
- Avoid pointer-lock / hover-only actions

---

## 10. Parallel worktree ownership (optional swarm)

| Worktree | Owns paths | Backlog |
|----------|------------|---------|
| `E:\wt\proddeck-integrate` | Lead merge · package.json · docs index | all integrates |
| `E:\wt\proddeck-filebridge` | `src/os/modules/filebridge/**`, `src/app/api/os/filebridge/**` | B1 |
| `E:\wt\proddeck-drive-guard` | `src/os/modules/drive-guard/**` | B2 |
| `E:\wt\proddeck-ports` | `src/os/modules/ports/**`, `src/app/api/os/ports/**` | B3 |
| `E:\wt\proddeck-yard` | `src/os/modules/yard/**` | B4, D6 |
| `E:\wt\proddeck-activity-log` | `src/os/modules/activity-log/**` | A1 |
| `E:\wt\proddeck-dispatch` | `src/os/modules/dispatch/**` | D1 |

**Rule:** one owner path set per worktree; Lead integrates on `proddeck-integrate` only after typecheck green.

Do not run parallel F/G promotes; pack once from integrate tip.

---

## 11. Safety rails checklist (every PR)

| # | Rule | Enforce in code |
|---|------|-----------------|
| 1 | No deletes without confirm | Phrase + CSS fresh + flag |
| 2 | No disk/partition UI | Absent forever |
| 3 | Ports reserved before bind | Request job, not raw listen |
| 4 | Promote needs evidence + EM GO | Checklist blocks silent promote scripts |
| 5 | No collateral restarts | No one-tap nginx/Postgres restart |
| 6 | Drive letters louder on G/H | Drive Guard |
| 7 | Auth apps CSS only | clientId registry |
| 8 | ACTIVITY-LOG serialize | Lock/queue drain |
| 9 | Docs with meaningful changes | Update `docs/os/*` same PR |
| 10 | Parallel ACTIVITY-LOG | Serialize appends |
| 11 | Isolate kill ports | Only ProdDeck 3320/4320/5320 for process recycle of self |
| 12 | Issuer bake | `NEXT_PUBLIC_CSS_ISSUER=https://css-next.delena.buzz` on release builds |

**Blast-radius copy template:**

```text
Env: {DEV|PREPROD|PROD|RELEASES}
Affects: {what}
Does not: {what}
Undo: {none|path}
Confirm: type {PHRASE}
```

---

## 12. Test & promote matrix

### Local DEV (every item)

```powershell
cd E:\wt\proddeck-integrate
npm run typecheck
npm run smoke -- http://127.0.0.1:3320
# module smokes when present:
node scripts/smoke-ports.mjs
node scripts/smoke-pulse.mjs
node scripts/smoke-activity-log.mjs
```

### UI items

```powershell
npm run test:e2e:realme
npm run test:e2e:desktop
npm run test:e2e:tablet
```

### F/G promote (human EM)

1. Bump `package.json` version  
2. Bake `.env.production` issuer css-next  
3. `npm run build`  
4. Pack to `H:\releases\proddeck-{ver}` with DEPENDENCIES.md + evidence q1/q2  
5. Smoke staging then prod hosts  
6. Update SUPPORTED-VERSIONS + HANDOFF  
7. Tag `v{ver}`  

Playbook: `docs/DEPLOY.md`, `docs/OPS.md`.

---

## 13. Recommended execution order for Cursor

| Order | ID | Branch suggestion | Depends on |
|------|----|-------------------|------------|
| 1 | A2 | `docs/e2e-hygiene` | — |
| 2 | A1 | `feat/activity-drain-fg` | — |
| 3 | B3 dry-run polish | `feat/ports-stop-api-shape` | — (no kill) |
| 4 | B1 flag-off UI shell | `feat/filebridge-delete-gated` | EM GO to enable |
| 5 | B2 allowlist mutate | `feat/drive-guard-mutate` | EM GO to enable |
| 6 | B3 kill | `feat/ports-stop-kill` | EM GO + B3 dry-run |
| 7 | B4 runners | `feat/yard-live-runners` | Portal API + EM GO |
| 8 | D1 contract tests | `feat/av-deeplink-contract` | — |
| 9 | D6–D7 fabric | `feat/yard-promote-q2` | B4 preferred |
| 10 | D2 Watch ops | `feat/watch-ops` | D1 |
| 11 | B5 densify | `feat/quay-densify` | isolated |
| 12 | 1.0 pack | release train | DoD §7 D8 |

---

## 14. Definition of done per PR

- [ ] Only one backlog ID (or documented small cluster)  
- [ ] Typecheck clean  
- [ ] Smoke clean on DEV  
- [ ] Module doc updated under `docs/os/` if behavior changed  
- [ ] Feature flags default safe (off for hard outs)  
- [ ] Device Lab if UI touched  
- [ ] No peer port kills  
- [ ] No secrets committed  
- [ ] Notes for EM: what still needs GO for F/G  

---

## 15. Explicit non-goals

- Rebuilding AgentVerse office inside ProdDeck  
- Unattended root / yolo promote on G:  
- Touching AV v2 side fleet during classic/ProdDeck work  
- Robocopy upgrade line over densify `4310/5310`  
- Embedding cloud IDE  
- Changing classic CSS IdP for other apps as part of ProdDeck PR  

---

## 16. Quick reference — confirm phrases

| Action | Phrase |
|--------|--------|
| Activity drain apply | `DRAIN_TO_MYAGENT` |
| FileBridge delete (B1) | `DELETE_RELEASE_FILE` |
| Port process stop (B3) | `STOP_PORT_PROCESS` |
| Drive Guard PROD unlock | type `PROD` |
| Drive Guard RELEASES unlock | type `RELEASES` |

---

## 17. Related docs index

| Doc | Use when |
|-----|----------|
| [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md) | Strategy, epics, Crew Fabric thesis |
| [QUAY-3D-STORY-FUTURE.md](./QUAY-3D-STORY-FUTURE.md) | **3D story bible** · Three/R3F densify · signature beats |
| [WORLD.md](./WORLD.md) | Short Keepers’ Quay mythos |
| [CLOUD-OS-0.8-PLAN.md](./CLOUD-OS-0.8-PLAN.md) | Wave A done / Wave B list |
| [OPS.md](./OPS.md) | Ports, smoke, CSS bake |
| [DEPLOY.md](./DEPLOY.md) | F/G cutover |
| [HANDOFF.md](./HANDOFF.md) | Live hosts |
| [SUPPORTED-VERSIONS.md](./SUPPORTED-VERSIONS.md) | Peer pins |
| [E2E.md](./E2E.md) | Device Lab |
| [PARALLEL-EXECUTION-PLAN.md](./PARALLEL-EXECUTION-PLAN.md) | Swarm / worktrees |
| [os/ports.md](./os/ports.md) | Ports module |
| [os/filebridge.md](./os/filebridge.md) | FileBridge jail |
| [os/drive-guard.md](./os/drive-guard.md) | Confirm gates |
| [os/yard.md](./os/yard.md) | Crew Fabric |
| [os/dispatch.md](./os/dispatch.md) | AV launch |
| [os/av-deeplink-contract.md](./os/av-deeplink-contract.md) | Query contract |
| MyAgent `workflow/CONSCIOUS.md` | Standing orders |
| MyAgent `workflow/testing/E2E-HIRE.md` | Mandatory E2E hires |
| MyAgent `workflow/promote/` | Promote skills |

---

## 18. Log

| Date | Note |
|------|------|
| 2026-07-17 | Cursor implementation brief created from live 0.8.4 + roadmap §9–§10 for AI-driven next trains |

---

**Start command for Cursor:**  
*“Implement backlog item A1 from `docs/CURSOR-IMPLEMENT-CLOUD-OS-NEXT.md`. Follow safety rails. Stop at acceptance criteria.”*
