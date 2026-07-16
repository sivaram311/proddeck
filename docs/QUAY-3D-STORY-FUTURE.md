# Keepers’ Quay — 3D story bible & Three.js future implement

**Product:** ProdDeck · Cloud OS control plane  
**Scene pack:** `keepers-quay`  
**Stack (shipped):** Next.js 15 · React 19 · **React Three Fiber** · **@react-three/drei** · **three**  
**Audience:** Cursor / agents implementing densify, new Places beats, and signature moments  
**Status:** **FUTURE IMPLEMENT** — mythos + technical map; do not block Places utility on 3D  
**Peers:** AgentVerse remains the office work plane — this world is **not** a second office  

**Related:** [WORLD.md](./WORLD.md) · [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md) · [CURSOR-IMPLEMENT-CLOUD-OS-NEXT.md](./CURSOR-IMPLEMENT-CLOUD-OS-NEXT.md) · B5 Quay densify

---

## 0. How to use this doc in Cursor

```text
Implement 3D story beat {BEAT_ID} from docs/QUAY-3D-STORY-FUTURE.md.
Stack: R3F + drei + three only under src/scene/keepers-quay/**
Rules:
- Places UI remains operable if WebGL fails (flat catalog / PlacePanel)
- Phone-first Realme ~360×800; target ≥30fps mid-tier; no pointer-lock gates
- Lime = signal light (semantic), not random neon
- Never embed AgentVerse chat/desk meshes here
- One beat per PR; add Device Lab Realme pass if UX changes
- Prefer procedural + low poly; lazy-load heavy GLB
```

---

## 1. The story in one breath

Night. An ink-black reach of water. A timber pier that remembers every release that ever left this machine.

You are not a tourist and not an office worker. You are a **Keeper** of the VPS — the human who answers the phone when the cloud must be steered without RDP. After CSS lights your token, the **Gate Lantern** knows your name. You walk Keepers’ Quay.

Far across the water, a **far shore** answers only when work is true: a launch, a promote GO, a fabric ignition. Lime is not decoration; lime is **signal** — the same lime that means “listening,” “fresh session,” “lane running,” “shore answered.”

Behind you, on glass over the pier (the **Places** HUD), live the real rails: Pulse, Ports, Promote, Yard. The 3D world does not replace those rails. It makes them **memorable** so a tired Keeper on a Realme can still feel which house holds which verb.

When a skill crew is hired, the **Yard** does not become a coding floor. Berths light. Lane-buoys bloom along the black water. The far shore answers in sequence — *Fabric Ignition*. Then AgentVerse, across the fleet, is where the crew actually sits and ships. You only lit the signal that sent them.

---

## 2. Mythos law (never break)

| Law | Meaning for 3D |
|-----|----------------|
| **Peers, not clones** | No Session Desk, no office props, no sit→walk→greet NPC loops from AgentVerse |
| **Three classic verbs** | Call · Remember · Watch remain sacred; Cloud OS adds **Steer** (Pulse/Ports/Promote/Yard) without erasing them |
| **Lime = signal** | Use for wake lines, lane status, freshness, GO — never as fill color for random UI meshes |
| **WebGL is optional chrome** | Fail closed to flat Places; never block promote or ports on mesh load |
| **Phone is SoT surface** | Atmosphere must survive 360px; no “desktop-only” camera puzzles |
| **CONSCIOUS on the pier** | Dangerous acts stay in Places UI with phrases; 3D only **echoes** decisions, never silent kill/delete |

---

## 3. Cast (story + future mesh roles)

| Cast | Story role | Shipped (0.4) | Future densify |
|------|------------|---------------|----------------|
| **The Keeper** | Player avatar | idle / walk / enter / call / nail / scan | subtle LODs; optional idle breath; no face-tracking |
| **Gate Lantern** | Session threshold | breathe + acknowledge | hybrid SSO flare; re-auth pulse when CSS stale |
| **Berth Faces** | App launch / appliances | attention / selected / cast | env chip glow DEV/PREPROD/PROD; badge for “peer down” |
| **Ticket Peg** | Memory Shed | nail on ticket | runbook ribbon; severity color (still restrained) |
| **Watch Silhouettes** | Duty roster / crews | idle / acknowledge | fabric lane mapping; blocked = dim, running = lime rim |
| **Harbor Beacons** | nginx / DNS / TLS | — | chain of shore lights = Beacon module health |
| **Tide Gauges** | Pulse (CPU/RAM/disk) | — | four pylons E/F/G/H waterlines |
| **Mooring Bollards** | Ports registry | — | rope taut = listening; frayed = mismatch |
| **Seal Chest** | Identity / Vault | — | lid glow = JWT fresh; frost = re-auth needed |
| **Signal Yard** | Crew Fabric | — | parallel lane-buoys on water; EM steel, specialists lime |
| **Archive Stacks** | H: releases | — | crate piles; pinned PROD crate marked |
| **Bridge Crane** | FileBridge | — | only swings when list succeeds; delete = rare red seal (gated) |
| **Dispatch Horn** | Deep-link to AgentVerse | — | blast animation then camera holds pier (no office teleport mesh) |
| **Promote Plinth** | GO / HOLD / NEED_EVIDENCE | — | three seals; GO sends gold→lime wake only after identity |

**Not cast:** Cursor windows, terminals as architecture, RDP desktops, second AgentVerse atrium.

---

## 4. Geography — pier districts mapped to Places

The pier is one continuous night map. Places HUD can jump camera; walking remains optional mythos.

```text
                         FAR SHORE (answer lights)
                              ~  ~  ~  ~
    [Beacon chain]     [Yard lane-buoys]     [Wake lines]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   GATE     MANIFEST      SHED       LOFT      YARD ARM
 lantern    berths       tickets   silhouettes  bollards+crane
   |          |            |          |            |
 ARRIVE     CALL        REMEMBER    WATCH       STEER / HIRE
   |          |            |          |            |
 HUD:      Appliances   Runbooks    Watch      Pulse Ports
 Vault     Catalog      Remember    crews      Promote Archive
```

| District | Place / module | Story job | Camera note |
|----------|----------------|----------|-------------|
| **Gate** | Login / Vault / Identity | Threshold; re-auth | Close, lantern-key |
| **Manifest Hall** | Catalog + Appliances | Call apps / open peers | Medium, berth row |
| **Memory Shed** | Helpdesk + Runbooks | Remember incidents | Interior-ish, warm low light |
| **Watch Loft** | Watch + crews | Who holds duty | Elevated, chart table |
| **Control Arm** | Pulse + Ports + Beacon | Is the machine OK? | Wide pier north rail |
| **Seal Court** | Promote + Drive Guard | Decisions that bind G/H | Plinth center; louder contrast on PROD |
| **Archive Quay** | Archive + FileBridge | Releases / evidence | Crate stacks toward H-metaphor |
| **Signal Yard** | Yard / Crew Fabric | Parallel hire | Open water view for buoys |
| **Dispatch Horn** | Dispatch | Send work to AV | Horn faces far shore, not inland office |

---

## 5. Story chapters (narrative arc for densify ships)

### Chapter I — Answering Wake *(shipped beat, polish later)*

The Keeper taps Call. A berth face turns. A **lime line** races the water. The far shore answers with a single pulse.

*Product:* app launch / catalog open.  
*Feel:* “I sent a signal; the fleet heard.”

### Chapter II — Watch Acknowledge *(shipped 0.4)*

Enter the loft. Chart rim brightens. Silhouettes turn toward the Keeper.

*Product:* duty roster awareness.  
*Feel:* “The watch sees me.”

### Chapter III — Gate Knows Your Token *(future · css-next hybrid)*

On hybrid SSO, the lantern does not ask the pier for a password. A **foreign light** (css-next) answers beyond the gate; the lantern only flares when the seal chest accepts the token.

*Product:* oauth/hybrid login success.  
*Three.js:* lantern emissive ramp; optional thin “issuer ribbon” color distinct from lime (steel-blue for css-next) then resolve to lime.

### Chapter IV — Tide of Four Drives *(future · Pulse)*

Four tide gauges at the control arm show E / F / G / H. When G: waterline climbs too high, the gauge burns amber; the Keeper’s phone panel already shouted — the pier only **rhymes**.

*Product:* Pulse health.  
*Never:* fake “drain disk” levers in 3D.

### Chapter V — Ropes That Should Not Sing *(future · Ports)*

Each reserved port is a bollard. Listening = rope taut. Unknown listener = rope that hums wrong (subtle, not scary spam). Dry-run stop = Keeper rests a hand on the rope; real kill (flagged, EM GO) is a **Places** phrase, and only then may a rope fall slack in 3D.

*Product:* Ports dry-run / future kill echo.  
*Law:* 3D never calls `taskkill`.

### Chapter VI — Seals of Promote *(future · Promote)*

Three seals on the plinth: GO · HOLD · NEED_EVIDENCE. Only a fresh seal chest (CSS) lets a hand press GO. On GO, a thicker wake — **Promote Wake** — crosses to the far shore, slower than Call, heavier.

*Product:* promote decision record.  
*Feel:* “I bound a release with my name.”

### Chapter VII — Fabric Ignition *(signature · Crew Fabric / Yard)*

The Keeper chooses a skill pack on the phone. On the water, **lane-buoys** ignite in parallel — QA, Security, Field-Ops lime; EM stays steel until merge. When a lane blocks, its buoy dims and a horn suggests Dispatch.

*Product:* Yard hire / live runners later.  
*Memorable line:* *“I hired the promote crew from my phone and watched the water light in parallel.”*

### Chapter VIII — Memory Ribbons *(future · Runbooks)*

A ticket nail grows a ribbon that leads to a runbook peg. Following it does not auto-shell G: — it opens Remember → Dispatch.

### Chapter IX — Archive Tidewrack *(future · Archive / FileBridge)*

Crates marked with release versions stack at the east finger. Opening H-Drive is “sending the bridge crane to the stacks.” Delete (if ever flagged on) is a red seal that refuses unless the phone phrase is spoken — the crane will not close its claw otherwise.

### Chapter X — Cloud OS v1 Night *(1.0 fantasy close)*

The Keeper never left the pier all week. Pulse quiet. Ports honest. Promote GO recorded. Yard lanes done. Archive crates pinned. Far shore answered five times. Still no RDP. Still no second office on the pier — only signals home, work across the water in AgentVerse.

---

## 6. Signature beats catalog (implementable IDs)

| Beat ID | Trigger (product event) | 3D response | Priority |
|---------|-------------------------|-------------|----------|
| `wake.call` | App launch / berth cast | Lime line → far shore pulse | P0 polish |
| `wake.promote` | Promote GO | Heavier slower wake + plinth seal | P1 |
| `ack.watch` | Enter loft / open Watch | Silhouettes face Keeper | shipped |
| `ack.gate` | Login success | Lantern flare | shipped / hybrid polish |
| `fresh.vault` | CSS probe fresh/stale | Seal chest glow / frost | P1 |
| `pulse.tide` | Pulse snapshot | Four gauges update | P1 |
| `ports.rope` | Ports snapshot | Bollard rope states | P1 |
| `beacon.chain` | Beacon probes | Shore light chain | P2 |
| `fabric.ignite` | Yard hire all | Parallel buoys | P0 story / P1 live |
| `fabric.lane` | Lane status change | Buoy color/dim | P1 |
| `dispatch.horn` | Dispatch open AV | Horn blast; no mesh teleport | P2 |
| `ticket.nail` | Helpdesk create | Peg nail | shipped |
| `runbook.ribbon` | Runbook open | Ribbon path | P2 |
| `archive.crane` | FileBridge list ok | Crane idle→ready | P2 |
| `guard.prod` | Drive Guard PROD unlock | Plinth contrast + low rumble (opt) | P2 |
| `webgl.fail` | Context lost | Dissolve to flat Places | P0 always |

---

## 7. Three.js / R3F technical future map

### 7.1 Current layout (extend, don’t rewrite)

```text
src/scene/keepers-quay/
  KeepersQuayScene.tsx   # dynamic import shell
  QuayCanvas.tsx         # Canvas, DPR, camera, error boundary
  KeepersQuayScene bits:
  Buildings.tsx          # pier districts geometry
  Characters.tsx         # Keeper + cast actions
  PierWater.tsx          # water / wake lines
  types.ts               # QuayPlace, props
```

Pack: `packs/proddeck/app.json` → `scene.pack = keepers-quay`.

### 7.2 Recommended module split (future files)

| File | Responsibility |
|------|----------------|
| `QuayCanvas.tsx` | `<Canvas>`, color mgmt, DPR cap, adaptive quality |
| `WorldRoot.tsx` | lights, fog, environment, districts group |
| `districts/Gate.tsx` | lantern |
| `districts/Manifest.tsx` | berths from catalog apps |
| `districts/Shed.tsx` | tickets / runbooks props |
| `districts/Loft.tsx` | silhouettes / chart |
| `districts/ControlArm.tsx` | pulse gauges + port bollards + beacon chain |
| `districts/SealCourt.tsx` | promote plinth + drive guard |
| `districts/ArchiveFinger.tsx` | crates + crane |
| `districts/SignalYard.tsx` | lane buoys |
| `fx/WakeLine.tsx` | reusable lime wake (Call vs Promote profiles) |
| `fx/FarShore.tsx` | answer lights |
| `fx/FabricBuoys.tsx` | parallel lane markers |
| `characters/Keeper.tsx` | humanoid + actions |
| `hooks/useQuayQuality.ts` | FPS / reduced-motion / Realme profile |
| `hooks/useBeatBus.ts` | subscribe product events → beats |
| `materials/signalLime.ts` | shared emissive lime token |

### 7.3 Beat bus (product → scene)

Do **not** pollute API routes with Three. Emit from Places UI / module hooks:

```ts
// conceptual — future src/scene/keepers-quay/beats.ts
export type QuayBeat =
  | { type: "wake.call"; slug: string }
  | { type: "wake.promote"; decision: "GO" | "HOLD" | "NEED_EVIDENCE" }
  | { type: "fabric.ignite"; lanes: { id: string; skill: string }[] }
  | { type: "fabric.lane"; id: string; status: "queued"|"running"|"blocked"|"done"|"failed" }
  | { type: "fresh.vault"; fresh: boolean }
  | { type: "pulse.tide"; drives: Record<"E"|"F"|"G"|"H", number> }
  | { type: "ports.rope"; rows: { port: number; mismatch: string }[] };

// window or React context bus — scene listens, UI publishes
```

**Rule:** scene is a pure subscriber. Mutating OS APIs stay in `src/os/**`.

### 7.4 Rendering budget (Realme-first)

| Budget | Target |
|--------|--------|
| DPR | `Math.min(devicePixelRatio, 1.5)` phone; 2 desktop |
| Draw calls | Prefer instancing for bollards / crates / buoys |
| Water | Lightweight shader or drei water with reduced segments on mobile |
| Shadows | Off or single contact shadow on phone |
| Postprocessing | None on Realme; optional bloom desktop only |
| FPS | ≥30 phone, ≥50 desktop; auto drop FX if frame time high |
| Assets | Procedural first; GLB ≤ few hundred KB each; draco if needed |
| `prefers-reduced-motion` | Short-circuit loops; still show static lime states |

### 7.5 Camera language

| Mode | Use |
|------|-----|
| **Orbit soft** | Default pier overview; clamp pitch; no flip |
| **Place rail** | Click Place → damped camera to district anchor |
| **Beat focus** | Brief push-in on plinth/buoy then return |
| **Never** | Pointer lock FPS; VR required; forced long cutscenes |

Anchors (future): `GATE`, `MANIFEST`, `SHED`, `LOFT`, `CONTROL`, `SEAL`, `ARCHIVE`, `YARD`.

Map OS Places → anchors in `src/os/places.ts` companion config.

### 7.6 Color & light grammar

| Token | Hex role | Use |
|-------|----------|-----|
| `--pd-ink` | deep night | clear color / fog far |
| Mist | cool gray | unlit wood, inactive |
| **Signal lime** | brand lime | wakes, running lanes, fresh OK |
| Steel | blue-gray | EM lane, css-next ribbon, neutral metal |
| Amber | caution | disk high, mismatch, NEED_EVIDENCE |
| Seal red | rare | delete gate, hard deny (sparingly) |
| Gold flash | GO commit | 200–400ms only |

Fog: exponential, keep berths readable at phone FOV ~40–50.

### 7.7 Quality tiers

```ts
type QuayQuality = "low" | "med" | "high";
// low: Realme default — no bloom, low water segs, hide secondary particles
// med: tablet
// high: desktop optional densify particles
```

Expose `?quayQuality=low` for support; persist in localStorage.

### 7.8 Failure & fallback

1. `QuayCanvas` error boundary → `onWebglFail`  
2. Flat `DeckHome` / Places still full power  
3. Optional static illustration of pier (CSS/SVG) later — not required for 1.0  

---

## 8. Densify roadmap (3D-only trains)

Aligned with Cloud OS B5 + story chapters — **separate** from hard-out IO flags.

| Train | SemVer suggestion | Beats / work | Blast |
|-------|-------------------|--------------|-------|
| **Q3D-0** | any patch | Beat bus + quality hook + docs (this file) | none |
| **Q3D-1** | 0.9.x visual | Control Arm: tide gauges + bollard ropes from live Pulse/Ports props | read-only echo |
| **Q3D-2** | 0.9.x visual | Seal Court + Promote Wake; Vault frost/glow | read-only echo |
| **Q3D-3** | 0.9–1.0 | Signal Yard Fabric Ignition buoys from Yard state | read-only echo |
| **Q3D-4** | 1.0 | Beacon chain + Archive crates labels + Dispatch horn | read-only |
| **Q3D-5** | post-1.0 | Optional particle densify, ambient audio beds (muted default), GLB hero props | performance gated |

**Non-goal trains:** full city builder, multiplayer avatars, in-world terminals that mutate G:.

---

## 9. Scene props contract (future)

Extend `QuaySceneProps` carefully — prefer optional fields so old packs don’t crash:

```ts
// future additive fields (illustrative)
export type QuayOsEcho = {
  pulse?: { e: number; f: number; g: number; h: number }; // free ratio 0..1
  ports?: { port: number; state: "ok" | "mismatch" | "unknown" }[];
  cssFresh?: boolean;
  promoteDecision?: "GO" | "HOLD" | "NEED_EVIDENCE" | null;
  fabricLanes?: { id: string; label: string; status: string }[];
  beaconUp?: number; // 0..1 fraction healthy
};
```

Parent `DeckHome` / Place shell feeds echoes from existing OS hooks — scene never fetches secrets.

---

## 10. Acceptance criteria for any 3D PR

- [ ] WebGL fail still leaves Places fully usable  
- [ ] Realme Device Lab project green (or documented skip with screenshot)  
- [ ] No new process kill / delete / G: write from `src/scene/**`  
- [ ] Lime used only for signal semantics  
- [ ] No AgentVerse office geometry  
- [ ] `prefers-reduced-motion` respected for loops  
- [ ] DPR / quality tier does not regress smoke  
- [ ] Beat is named in §6 table and logged in PR notes  
- [ ] WORLD.md or this file updated if mythos changes  

---

## 11. Story-facing microcopy (UI strings that match the pier)

| Product | Microcopy flavor |
|---------|------------------|
| Loading canvas | “Lighting the Gate Lantern…” *(shipped)* |
| CSS re-auth | “Seal chest frost — re-auth at the Gate” |
| Ports mismatch | “A rope is singing out of tune” |
| Promote GO | “Far shore will answer a heavier wake” |
| Yard hire | “Ignite the lane-buoys” |
| Dispatch | “Sound the horn — work lives across the water” |
| FileBridge deny delete | “The crane refuses without the red seal phrase” |
| Pulse disk high | “Tide high on drive {X}” |
| WebGL fail | “Lantern out — Places still hold the rails” |

Keep official Places labels clear; microcopy is secondary, not cryptic-only.

---

## 12. Narrative prose (long form — for voice / trailer / onboarding)

### 12.1 Opening

There is a machine that does not want a desktop. It wants a Keeper.

By day the fleet is APIs and nginx and promote packs. By night — when you open **home** — the same machine is a quay: black water, timber underfoot, a lantern that only answers a true CSS seal. You do not come here to write features. You come here to **steer**: health, ports, evidence, crews.

AgentVerse is where hired minds sit under office light. Keepers’ Quay is where you decide who gets hired, which seal is pressed, which berth casts a line into production dark.

### 12.2 The water

The water is a log that never scrolls. Every wake is an event you already earned in Places: a launch, a GO, a fabric ignition. If the water stayed mirror-still all night, either the machine was quiet — or you were locked out at the Gate.

### 12.3 The Yard

Parallel work is not a metaphor on this machine; it is how promote already ships. The Yard makes that visible: buoys for specialists, steel for EM. When Field-Ops and QA light together, you are not watching a gimmick. You are watching the same pattern that MyAgent skills already force on every careful release — only now the pier shows it to a phone screen at arm’s length.

### 12.4 Closing (Cloud OS v1)

When the last buoy cools and the archive crates sit pinned, you pocket the Realme. No RDP. No orphan ports. The Gate Lantern dims to idle breathe. Far shore holds one last dim lime — not an alarm, an acknowledgment:

*The Keepers still have the quay.*

---

## 13. Cursor implementation slices (copy-paste)

### Slice Q3D-0 — Beat bus skeleton

```text
Add src/scene/keepers-quay/beats.ts + useBeatBus + wire one console/debug overlay in DEV only.
No visual densify yet. Document events from §6. Device Lab not required if no UI chrome.
```

### Slice Q3D-1 — Pulse tides + port ropes

```text
Implement Chapter IV–V visuals. Feed pulse/ports from existing OS modules as optional props.
Read-only echo. Quality low default on mobile. Update this doc checklist.
```

### Slice Q3D-3 — Fabric Ignition

```text
Implement FabricBuoys driven by Yard lane state. Honor reduced-motion (static colors).
Signature moment only; do not spawn Portal runners from scene code.
```

### Slice Q3D-hybrid — Gate issuer ribbon

```text
On css-next hybrid login success, Gate Lantern steel-blue ribbon → lime flare (ack.gate v2).
```

---

## 14. Anti-patterns (reject in review)

| Anti-pattern | Why |
|--------------|-----|
| In-scene button that kills a port | CONSCIOUS; use Places + flags |
| Loading AV iframe inside Canvas | Peers not clones |
| Full PBR city for densify | Realme dies; mythos is pier not metropolis |
| Hover-only berth select | Phone has no hover |
| Blocking promote on GLB load | Rails > chrome |
| Random rainbow materials | Lime/steel/amber grammar only |
| Autoplay loud audio | Pier is ops, not game trailer (muted default) |

---

## 15. Cross-links

| Doc | Role |
|-----|------|
| [WORLD.md](./WORLD.md) | Canonical short mythos |
| [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md) §4 Places IA, §8 Fabric |
| [CURSOR-IMPLEMENT-CLOUD-OS-NEXT.md](./CURSOR-IMPLEMENT-CLOUD-OS-NEXT.md) | B5 + hard outs (IO separate from 3D) |
| [os/yard.md](./os/yard.md) | Fabric product module |
| [os/dispatch.md](./os/dispatch.md) | Deep-link peer |
| [E2E.md](./E2E.md) | Realme lab |

---

## 16. Log

| Date | Note |
|------|------|
| 2026-07-17 | Future 3D story bible + Three/R3F implement map written for Cursor trains |

---

**Start line for Cursor:**  
*“Implement beat `fabric.ignite` (slice Q3D-3) from `docs/QUAY-3D-STORY-FUTURE.md`. Read-only echo of Yard state. No OS mutations from scene.”*
