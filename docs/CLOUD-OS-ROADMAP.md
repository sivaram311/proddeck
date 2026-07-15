# Home as Cloud OS — Strategy & Feature Roadmap

**Product:** ProdDeck · `https://home.delena.buzz`  
**Peer work plane:** AgentVerse · `https://agentverse.delena.buzz` (+ v2 side)  
**Operator client:** Realme P2 Pro (~360×800), AI-agent-first machine ops  
**Session:** `proddeck-keepers-quay-2026-07-14`  
**External strategy:** Grok 4.5 deep-dive 2026-07-14  
**Status:** Live through **0.8.0 Wave A** · remaining hard outs + peer Device Labs on roadmap  
**Live pin:** [SUPPORTED-VERSIONS.md](./SUPPORTED-VERSIONS.md) · next slice: [CLOUD-OS-0.8-PLAN.md](./CLOUD-OS-0.8-PLAN.md)

This document captures the full idea set for evolving **home** into a **phone-first cloud operating system for this VPS**, while AgentVerse remains the inhabitable crew workplace. It also invents how **parallel skill-hired subagents / crews** become a first-class OS capability (matching how we already work in MyAgent workflow).

---

## 1. Product thesis

**`home.delena.buzz` is the phone-first control plane that makes this VPS operable without a desktop — health, ports, promote, releases, identity, and dispatch — while AgentVerse remains the inhabitable work plane where hired crews actually sit, chat, and ship.**

Home coordinates the machine. AgentVerse is where agents live and labor. **Peers, not clones.**

### Why this exists

| Fact | Implication |
|------|-------------|
| Almost all machine work is done **through AI agents** (Cursor, Antigravity, Agent Portal crews) | Home must orchestrate agents and workflow — not pretend to be a traditional admin panel only for humans |
| Primary remote surface is **Realme P2 Pro** | Tap-first, ≥44px targets, no pointer-lock, short scrolls, Places not deep 3D chores |
| AgentVerse already owns offices, personas, Session Desk, portal chat | Do not rebuild a second office inside ProdDeck |
| ProdDeck Keepers’ Quay 0.4.0 already has Call / Remember / Watch | Expand those verbs into a full OS IA; keep Quay as mythos chrome |
| MyAgent CONSCIOUS + ports + promote + ACTIVITY-LOG is the law | OS features must **enforce** rails, not bypass them |

---

## 2. Fleet to integrate (do not orphan)

| App | Host / role |
|-----|-------------|
| **CSS IdP** | `https://css.delena.buzz` (:5900 prod) — SSO for auth apps |
| **Agent Portal** | `https://agent-portal.delena.buzz` — sessions platform API/UI |
| **AgentVerse** (short) | `https://agentverse.delena.buzz` — upgrade / Dispatch SoT |
| **AgentVerse staging** | `https://agentverse-staging.delena.buzz` — PREPROD 7-story densify |
| **AgentVerse v2** | `https://agentverse-v2.delena.buzz` — industrial PROD |
| **AgentVerse v2 staging** | `https://agentverse-v2-staging.delena.buzz` — industrial PREPROD |
| **ProdDeck / home** | `https://home.delena.buzz` — Keepers’ Quay home / future cloud OS |
| **Stack Pilot / control** | `https://control.delena.buzz` — stack/control surfaces |
| **H-Drive** | `https://hdrive.delena.buzz` — H:\ releases expose |
| **Postgres** | `:5432` schema-per-env |
| **MyAgent workflow** | CONSCIOUS, ports, promote Q1/Q2, ACTIVITY-LOG, personas |
| **Sandbox / Source extras** | FileBridge, agent-api, erpnext (E:), grok_dev, mt5, … |

**Drives:** E: DEV · F: PREPROD · G: PROD · H: RELEASES.

---

## 3. OS capability map

| Shell | Capability | Existing surface | ProdDeck module |
|-------|------------|------------------|-----------------|
| **Control plane** | Machine health (CPU/RAM/disk E–H, uptime) | Stack Pilot | **Pulse** |
| | Process / port registry | MyAgent `workflow/ports/` | **Ports** |
| | nginx / DNS / TLS status | Deployment / control | **Beacon** |
| | Multi-env awareness | CONSCIOUS drive map | **Drive Guard** |
| | Stack Pilot bridge | `control.delena.buzz` | **Bridge** tiles |
| **Work plane** | Hire / send agents into AgentVerse | Portal + AgentVerse | **Dispatch** |
| | Watch crews / sessions | Watch + Portal | **Watch** (live, not lore-only) |
| | Incident → ops automation | Remember (helpdesk) | **Remember → Runbook** |
| | Sandbox / product appliances | catalog / F/G apps | **Appliances** |
| **Crew fabric** | Parallel skill-hired subagents | promote skills, personas, crews | **Crew Fabric** (see §8) |
| **Storage** | H: release / evidence browse | H-Drive | **Archive** |
| | FileBridge | sandbox FileBridge | **Bridge Files** |
| | Postgres schema awareness | `workflow/db/` | **Schemas** (read-first) |
| **Security** | CSS session awareness | CSS | **Identity / Vault** |
| | clientId registry | `workflow/css/` | **Clients** |
| **Promote** | Q1/Q2 evidence + EM GO | `workflow/promote/` + H: | **Promote** |
| | Field lessons | `promote-field-ops` | Auto-hire tip in Promote |
| **Ops memory** | ACTIVITY-LOG | `workflow/activity/` | **Log** |
| | Standing orders UX | CONSCIOUS.md | **Rails** soft UI |

**Non-negotiable peer split:** ProdDeck never becomes a 3D office clone. AgentVerse never becomes the promote/port/nginx console.

---

## 4. Mobile Places IA (Quay stays mythos)

Keepers’ Quay remains emotional home. **Utility lives in Places** (phone-first).

| Place | Job | Phone pattern |
|-------|-----|----------------|
| **Quay (Home)** | Orient + top actions | Big taps: Pulse, Dispatch, Promote, Watch, Crew Fabric |
| **Control Tower** | Pulse + Ports + Beacon + Stack Pilot | Dense lists; 44px rows |
| **Forge** | Dispatch + appliances + env chip | “Send work to AgentVerse” CTA |
| **Yard (Crew Fabric)** | Hire skill crews in parallel; watch subagent status | Tap to hire pack; live lane cards |
| **Archive** | H-Drive + evidence + FileBridge | Folder list; download; attach |
| **Watch** | Crews/sessions + health alerts | Cards → deep-link AgentVerse |
| **Remember** | Helpdesk + runbooks | Ticket → runbook → Dispatch / Yard |
| **Vault** | CSS session, clients, sign-out | Boring and trustworthy |

On Realme: 4–5 Places visible; rest under **More**. 3D pier = brand/atmosphere, not a gate for every feature.

---

## 5. Epics & MVP slices (feature development)

### Epic A — Pulse (machine health)
- **MVP:** Uptime, load, RAM, free space **per drive E/F/G/H**, Postgres `:5432`, CSS `:5900`.
- **Next:** Thresholds → Remember ticket; deep-link Stack Pilot.
- **Capability:** “Is the machine OK?” in ~5s on phone.

### Epic B — Ports
- **MVP:** Reserved ports from MyAgent registry + listening mismatch badges.
- **Next:** “Request reserve” → Agent Portal job + ACTIVITY-LOG (no silent bind).
- **Safety:** No process-kill in MVP.

### Epic C — Promote GO (phone)
- **MVP:** List `H:\releases\...\evidence\`; Q1/Q2 checklist; **GO / HOLD / NEED_EVIDENCE** with CSS identity.
- **Next:** Suggest hire `promote-field-ops`; link evidence via H-Drive.
- **Safety:** GO records decision + dispatches crew — does not silently run promote scripts in MVP.

### Epic D — Activity Log viewer
- **MVP:** Reverse chrono; filter `cursor` \| `antigravity` \| `other`.
- **Next:** “Continue this” → Dispatch with log snippet as briefing.

### Epic E — Archive (H: releases)
- **MVP:** Browse releases/evidence via H-Drive SSO.
- **Next:** Pin current PROD / last PREPROD per product.

### Epic F — Beacon (nginx/DNS)
- **MVP:** Known hosts → upstream + last health probe.
- **Next:** Cert days-left; registry vs nginx disagreement flags.

### Epic G — Identity (CSS)
- **MVP:** Subject, clientId `proddeck`, expiry, Sign out.
- **Next:** Re-auth before Promote GO / destructive confirms.

### Epic H — Dispatch (into AgentVerse)
- **MVP:** Pick persona/crew from `E:\machine-docs\personas\` → open Session Desk with context.
- **Next:** From Remember / Pulse / Yard, one-tap hire with brief.
- **Keep:** Separate clientIds + mythos; classic vs v2 chooser.

### Epic I — Remember → Runbook
- **MVP:** Categories → runbooks (port conflict, promote stuck, disk low, nginx 502).
- **Next:** Execute = Portal job + optional AgentVerse hire — not silent shell on G:.

### Epic J — Appliances pack
- **MVP:** Status + open tiles for FileBridge, Stack Pilot, H-Drive, Portal, AgentVerse, erpnext, trading sandboxes.
- **Next:** Env-scoped badges; G: awareness via Drive Guard.

### Epic K — Drive Guard
- **MVP:** Global env chip DEV / PREPROD / PROD / RELEASES.
- **Next:** G/H writes require typed confirm + fresh CSS re-auth.
- **Never:** partition / “clean disk” UI.

### Epic L — FileBridge phone lane
- **MVP:** Scoped browse/upload; delete only with typed CONSCIOUS confirm.
- **Next:** “Attach to promote evidence” helper.

### Epic M — Crew Fabric (parallel skill-hired subagents)
See **§8** — first-class OS surface for how this machine already ships work.

**Deprioritize:** denser pier particles, lore walls, embedding AgentVerse chat inside home, full cloud IDE.

---

## 6. Home ↔ AgentVerse contract

Integration = **launch + context**, not embedding the office.

### Deep-link (sketch)

```text
https://agentverse.delena.buzz/desk?
  src=proddeck
  &crew=<personaOrCrewId>
  &session=<agentPortalSessionId?>
  &intent=session-desk|hire|watch|crew-fabric
  &brief=<base64url short brief>
  &skills=<comma-skill-ids>
  &return=https://home.delena.buzz/watch
  &env=dev|preprod|prod
```

v2: same params on `https://agentverse-v2.delena.buzz/...`

### Event bus (Agent Portal)

| Event | Producer | Consumer | Purpose |
|-------|----------|----------|---------|
| `dispatch.hire.requested` | ProdDeck Dispatch / Yard | Agent Portal | Create session + ACTIVITY-LOG |
| `dispatch.hire.accepted` | Agent Portal | Watch + AgentVerse | Desk ready |
| `session.desk.open` | ProdDeck | AgentVerse | Focus Session Desk |
| `crew.fabric.spawned` | Yard | Portal + ACTIVITY-LOG | Parallel lanes with skill ids |
| `crew.fabric.lane.done` | Subagent / Portal | Yard Watch | Lane complete / blocked |
| `promote.decision` | Promote | ACTIVITY-LOG + optional AV | GO/HOLD + evidence refs |
| `incident.runbook.started` | Remember | Portal + AgentVerse | Ticket → crew brief |
| `health.alert` | Pulse | Remember | Optional auto-ticket |

### Minimal payload
`crewId`, `personaPath`, `sessionId`, `brief` (≤2KB), `env`, `evidencePaths[]`, `skillIds[]`, `returnUrl`, caller `clientId=proddeck`.

---

## 7. Safety rails (CONSCIOUS on phone)

| Rule | OS enforcement |
|------|----------------|
| No deletes without confirm | Typed phrase + CSS re-auth; default = read/list/open |
| No disk/partition changes | Capability **absent** from UI |
| Ports reserved before bind | Ports write = request job, not raw listen |
| Promote only with evidence + EM GO | Checklist blocks; GO writes decision; crew executes |
| No collateral restarts | No one-tap nginx/Postgres restart in early ships |
| Drive letters | Drive Guard; G/H louder than E |
| Auth apps CSS only | Register clientIds in MyAgent CSS registry |
| ACTIVITY-LOG | Append via Portal API; no free-edit of machine log from phone |
| Docs after meaningful changes | Checklist item on Dispatch / Promote / Fabric complete |
| Parallel crew ACTIVITY-LOG | **Serialize** appends (EM or fabric logger) — field lesson |

**Blast-radius copy (dangerous actions):**  
`Env: PROD (G:) · Affects: … · Does not: … · Undo: none · Confirm: type PROD`

---

## 8. Crew Fabric — parallel skill-hired subagents (deep idea)

### 8.1 Why this belongs in the cloud OS

On this machine, **speed comes from specialization + parallelism**, not from one mega-agent doing everything:

- Promotes already hire **parallel skills**: `promote-em`, `promote-qa`, `promote-security`, `promote-review`, `promote-ops`, always **`promote-field-ops`**.
- Product work uses **personas / crews** (`E:\machine-docs\personas\`) with pre-work gates before coding.
- Cursor / Antigravity / Portal all bind to the same CONSCIOUS + ACTIVITY-LOG.
- Operator is often on **Realme** — they cannot babysit six terminals; they need a **Yard** that shows lanes.

**Crew Fabric** is the OS feature that makes “always try to run subagents with skills” **visible, hireable, safe, and fast** from home.

### 8.2 Thesis (one line)

**Yard (Crew Fabric) is the phone control surface for spawning skill-bound parallel agent lanes against a mission, streaming lane status, and folding results into evidence / ACTIVITY-LOG / AgentVerse desks — the same pattern we already use in MyAgent promote and product crews.**

### 8.3 How we work today (SoT)

| Pattern | Where it lives | What Fabric must preserve |
|---------|----------------|---------------------------|
| Skill packs | `E:\MyAgent\.cursor\skills\promote-*\SKILL.md` | Hire by skill id, not by vibes |
| Promote crew parallel | `workflow/promote/README.md` | EM orchestrates; specialists write evidence folders; GO before ops |
| Field lessons | `workflow/promote/field-lessons.md` | Auto-attach `promote-field-ops` on promote missions |
| Personas / pre-work | `E:\machine-docs\personas\` | Pre-work gate before “code” missions |
| ACTIVITY-LOG | `workflow/activity/ACTIVITY-LOG.md` | One serializer / batched EM write — no scrambled tables |
| File ownership lanes | ProdDeck MVP contract (etc.) | Lanes own disjoint paths/tools |
| Provider-agnostic rules | CONSCIOUS + AGENTS.md | Cursor CLI, Antigravity, Portal all equal citizens |

### 8.4 Product surface — **Yard**

| UI element | Behavior |
|------------|----------|
| **Mission card** | Title, env chip, goal, linked app (`proddeck`, `agentverse`, …) |
| **Skill pack picker** | Packs: `promote-q1`, `promote-q2`, `feature-ship`, `incident`, `docs-only`, `security-pass` |
| **Lane board** | One card per hired skill/subagent: status `queued\|running\|blocked\|done\|failed` |
| **Hire all / Hire selected** | Spawns parallel lanes (Portal workers / Cursor Task / Antigravity — abstraction) |
| **Evidence shelf** | Paths under `H:\releases\...` or `agents/` — auto from mission type |
| **Send leftovers to AgentVerse** | Open Session Desk with unresolved blockers as brief |
| **Merge / summarize** | EM skill only — prevents specialists from declaring GO |

### 8.5 Skill packs (presets that match workflow)

#### Pack: `promote-q1` / `promote-q2`
Hire in parallel (when possible):

| Skill | Lane job |
|-------|----------|
| `promote-em` | Orchestrate; only role that may set CHECKLIST `decision` |
| `promote-qa` | Smoke matrix + destination smoke notes |
| `promote-security` | CSS / JWT / secrets scan notes |
| `promote-review` | Ports/DB/drive/diff compliance |
| `promote-field-ops` | Bind race, CF cache, PS `$PID` traps, serial ACTIVITY-LOG |
| `promote-ops` | **Blocked until EM GO** — then deploy only |

Phone MVP: show lane board + “Record GO/HOLD” (identity-bound). Ops lane unlocks after GO.

#### Pack: `feature-ship` (product code)
| Skill / persona | Lane job |
|-----------------|----------|
| Crew Lead | Owns merge order + ACTIVITY-LOG serial |
| Architect | Contracts / non-regression gates |
| Implementer lanes | Disjoint file ownership (config / UI / scene / API) |
| Docs-Keeper | README/OPS/WORLD in same turn (rule #12) |
| QA | Smoke scripts |
| Validation Gatekeeper | Pre-work GO check |

#### Pack: `incident`
| Lane | Job |
|------|-----|
| Pulse reader | Health snapshot |
| Ports/Beacon | Listener vs registry / nginx |
| Security | Token/CSS check |
| Ops propose | Change proposal only — execute after confirm |
| Dispatch | Optional AgentVerse hire with incident brief |

#### Pack: `docs-only`
Docs-Keeper + Review only — fastest safe parallel ship when code is frozen.

### 8.6 Parallelism rules (speed without chaos)

1. **Hire specialized skills by default** — never one generalist for promote or multi-file feature ships.  
2. **Parallelize independent lanes**; serialize shared writers (ACTIVITY-LOG, CHECKLIST decision, nginx reload).  
3. **File / domain ownership map** before spawn (same as ProdDeck MVP ownership lanes).  
4. **EM / Lead is the only GO** for promote and prod-affecting missions.  
5. **Field-ops mandatory** on every promote pack.  
6. **Fail closed on env** — Yard inherits Drive Guard; PROD missions need re-auth.  
7. **Results become artifacts** — evidence folders + ACTIVITY-LOG rows, not chat-only.  
8. **Blocked lanes** escalate to AgentVerse Session Desk with context, not silent retry storms.

### 8.7 Implementation sketch (ships)

| Ship | Yard MVP |
|------|----------|
| **0.5.x** | Mission templates + lane board UI (manual status) + deep-link “open promote pack in Portal / Cursor brief” |
| **0.6** | Agent Portal events `crew.fabric.*`; spawn Portal workers or recorded hire list; promote pack wired to evidence paths |
| **0.7** | Live lane status from runners; ACTIVITY-LOG serializer service; Watch mirrors fabric |
| **1.0** | Skill registry UI (read from MyAgent skills + personas); one-tap `promote-q2` from phone with GO gate |

### 8.8 What this is not

- Not a second AgentVerse office for coding.  
- Not unattended root on G: from phone.  
- Not parallel writes to the same evidence file without locking/serialization.  
- Not replacing CONSCIOUS with “yolo all skills.”

### 8.9 Signature beat (OS moment)

**Fabric Ignition** — Operator taps a skill pack on Yard; lane cards light (lime) as each skill acknowledges; EM lane stays steel until merge. Far shore / Quay signal optional — keep subtle. The memorable line: *“I hired the promote crew from my phone and watched QA/Security/Field-Ops light up at once.”*

---

## 9. Phased roadmap

### 0.5 — Operable phone control plane — **SHIPPED**
Places IA · Drive Guard chip · Identity strip · Pulse · Ports read-only · Activity Log · Archive · Dispatch · Yard board.

### 0.6 — Decisions & runbooks — **SHIPPED** (through 0.6.x → leftovers)
Promote GO/HOLD · Runbooks · Beacon · Appliances · FileBridge · Portal os-events · Yard hire events.

### 0.7 — Safe-subset Cloud OS — **SHIPPED**
Activity queue · Drive Guard CSS freshness · Ports request-stop (event) · Yard skill registry · FileBridge jail + delete hard-fail · AV Desk 0.3.17 peer.

### 0.8 Wave A — Confirm / dry-run rails — **SHIPPED (LIVE)**
Lead activity-queue drain (`DRAIN_TO_MYAGENT`) · Ports stop **dry-run** (deny-list; no kill) · Playwright Device Lab (Realme / desktop / tablet) · CONSCIOUS **#14** E2E hire mandate.

### 0.8 Wave B / 0.9 — Hard outs (EM GO each) — **ROADMAPPED**
See §10. Destructive or cross-fleet power only after explicit confirm gates.

### 1.0 — Cloud OS v1 — **ROADMAPPED**
Stable Home ↔ AgentVerse contract · Drive Guard hard gates on G/H · Ports reserve/stop via job with allowlist · Stack Pilot bridge return · Watch as real ops · Crew Fabric live lanes + skill registry.

**Cloud OS v1 means:** A phone-only operator can **observe the VPS, decide promote, dispatch/hire skill crews in parallel, and browse releases** without RDP — destructive power gated; AgentVerse remains the work habitat.

---

## 10. Build-next backlog (parked on roadmap — pick with EM GO)

Kept from post-0.8.0 “now what” (2026-07-15). Detail: [CLOUD-OS-0.8-PLAN.md](./CLOUD-OS-0.8-PLAN.md).

### A. Close the loop (low blast)

| ID | Item | Notes |
|----|------|-------|
| A1 | Drain leftover F/G activity staging queues | Lead-only · confirm `DRAIN_TO_MYAGENT` · never blind bulk without preview |
| A2 | Mirror E2E SUMMARY onto `main` / keep [E2E.md](./E2E.md) current | Evidence already under `H:\releases\proddeck-0.8.0\evidence\e2e\` |

### B. Hard outs (each needs EM GO)

| ID | Item | Why hard |
|----|------|----------|
| B1 | FileBridge H: delete IO | CONSCIOUS #1 — today 403 |
| B2 | Drive Guard real G:/H: mutations | Writes outside sandbox |
| B3 | Ports actual stop/kill | Builds on dry-run allowlist; never CSS/DB/Portal/AV/ProdDeck deny-list |
| B4 | Live Portal runners | Cross-app spawn |
| B5 | Quay densify mega | Stay on densify line; side fleet if diverged |

### C. Fleet E2E under CONSCIOUS #14

| ID | Item | Notes |
|----|------|-------|
| C1 | Agent Portal Device Lab | Realme 360×780 · desktop 1280×800 · tablet 800×1280 |
| C2 | AgentVerse classic Device Lab | Same three viewports; do not disturb v2 `4311/5311` |
| C3 | Keep ProdDeck Device Lab green on every UI ship | Hire `e2e-*` lanes per `E:\MyAgent\workflow\testing\E2E-HIRE.md` |

### D. Park / ops hygiene

| ID | Item |
|----|------|
| D1 | No further Cloud OS coding until EM picks A/B/C |
| D2 | Preserve peer pins: Portal ≥0.1.8 · AV ≥0.3.17 · CSS `v0.1.0` |

---

## 11. Related docs

| Doc | Role |
|-----|------|
| [WORLD.md](./WORLD.md) | Keepers’ Quay mythos + cast |
| [OPS.md](./OPS.md) | Ports / smoke / promote ops |
| [HANDOFF.md](./HANDOFF.md) | Live hosts |
| [SUPPORTED-VERSIONS.md](./SUPPORTED-VERSIONS.md) | Fleet pin matrix |
| [CLOUD-OS-0.8-PLAN.md](./CLOUD-OS-0.8-PLAN.md) | Wave A live + hard-out backlog |
| [E2E.md](./E2E.md) | Device Lab Playwright |
| [PARALLEL-EXECUTION-PLAN.md](./PARALLEL-EXECUTION-PLAN.md) | **N subagents · git branches/worktrees · singleshot swarm** |
| `E:\MyAgent\workflow\CONSCIOUS.md` | Standing orders (#14 E2E hire) |
| `E:\MyAgent\workflow\testing\E2E-HIRE.md` | Mandatory E2E testing hires |
| `E:\MyAgent\workflow\promote\` | Promote skills + field lessons |
| `E:\machine-docs\personas\` | Personas / crew standards |

---

## 12. Log

| Date | Note |
|------|------|
| 2026-07-15 | **0.8.0 LIVE** Wave A + Device Lab 24/24; “now what” items parked in §10 |
| 2026-07-15 | **0.7.0 LIVE** safe subset; AV classic 0.3.17 peer |
| 2026-07-14 | **0.5.0 LIVE** PREPROD+PROD — Places shell + Wave 1 modules; JWT issuer bake required on build |
| 2026-07-14 | Grok strategy captured; Crew Fabric / Yard deep idea added from MyAgent promote + personas workflow |
