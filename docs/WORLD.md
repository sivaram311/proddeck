# Keepers' Quay — World & Story

**Product:** ProdDeck  
**Version:** **0.4.0** characters/animations · 0.3.0 was walkable Quay shell  
**Session:** `proddeck-keepers-quay-2026-07-14`

## Purpose (why this world exists)

ProdDeck’s job is not “be a 3D office.” After CSS login, a **Keeper** must:

1. **Call** — open production apps without memorizing ports  
2. **Remember** — leave operational memory (helpdesk)  
3. **Watch** — see who holds the duty roster  

The 3D world exists to make those three verbs **legible and memorable**. If a mesh or animation does not serve Call / Remember / Watch, it does not ship.

## Mythos

**Keepers’ Quay** — a night pier over ink-black water. Lime is **signal light**, not decoration. You are not an office worker (that is AgentVerse). You are a Keeper who walks to the right house and lights the right signal.

| Place | Verb | Product |
|-------|------|---------|
| Gate Lantern | Arrive | Session threshold |
| Manifest Hall | Call | Catalog / launch |
| Memory Shed | Remember | Helpdesk |
| Watch Loft | Watch | Config crew tokens |

**Signature (shipped):** *Answering Wake* — launch → lime line across the water → far shore answers.  
**Signature (shipped 0.4.0):** *Watch Acknowledge* — enter loft → chart rim + silhouettes turn toward the Keeper.  
**Also 0.4.0:** Keeper humanoid (idle/walk/enter/call/nail/scan), Gate acknowledge, berth cast, ticket nail.

## Characters (0.4.0)

| Cast | Role |
|------|------|
| **The Keeper** | Player humanoid — idle / walk / enter / call / nail / scan |
| **Gate Lantern** | Arrival breathe + acknowledge flare |
| **Berth Faces** | App berths — attention / selected / cast |
| **Ticket Peg** | Shed memory — nail on ticket create |
| **Watch Silhouettes** | Pack `crews[]` — idle / acknowledge |

**Not ProdDeck:** AgentVerse sit→walk→greet loops, Session Desk, portal chat NPCs, Siruseri office densify.

## Build chapters

| Ver | Chapter |
|-----|---------|
| 0.2.0 | Pack + helpdesk + CSS stub |
| 0.3.0 | Walkable Quay Ch1–3 procedural |
| 0.4.0 | Characters + animations (this pass) |

## Config

`packs/proddeck/app.json` — `scene.pack=keepers-quay`. Catalog `/api/catalog` remains SoT for apps. WebGL fail → flat catalog.
