# Cloud OS 0.8.0 — Wave A LIVE · Wave B roadmapped

**Status:** Wave A **LIVE on F/G** · remaining items **on roadmap** (not coding until EM picks)  
**ProdDeck:** **0.8.0** · tag `v0.8.0` · `H:\releases\proddeck-0.8.0`  
**Peers:** AV classic **0.3.17** · Portal **0.1.8** · CSS `v0.1.0`  
**Compatibility:** [SUPPORTED-VERSIONS.md](./SUPPORTED-VERSIONS.md)  
**Strategy SoT:** [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md) §9–§10  
**Session:** `proddeck-keepers-quay-2026-07-14`

---

## Wave A shipped (no kill / confirm-gated write)

| Cap | Behavior |
|-----|----------|
| **Pri 6 drain tooling** | `POST /api/os/activity-log` `{op:"drain",mode:"dry-run"|"apply"}` · apply requires confirm `DRAIN_TO_MYAGENT` · UI preview + phrase |
| **Pri 3 stop dry-run** | `POST /api/os/ports/stop-dry-run` · deny-list critical ports · **never** Stop-Process · UI “Dry-run stop” |
| **E2E Device Lab** | Playwright Realme 360×780 · desktop 1280×800 · tablet 800×1280 · evidence `H:\releases\proddeck-0.8.0\evidence\e2e\` |

---

## Roadmapped next (parked — EM picks)

Mirrored in [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md) §10.

### A. Close the loop

| ID | Cap | Gate |
|----|-----|------|
| A1 | Drain leftover F/G staging queue rows | Preview then `DRAIN_TO_MYAGENT` |
| A2 | Keep E2E docs/evidence current on `main` | Docs only |

### B. Hard outs (still blocked without confirm)

| ID | Cap | Why hard | EM must confirm |
|----|-----|----------|-----------------|
| B1 | **FileBridge H: delete IO** | CONSCIOUS #1 — today hard-fail 403 | Exact path targets + operator confirmation UX; never silent delete |
| B2 | **Drive Guard real G:/H: mutations** | Writes outside sandbox | Per-op confirm; CSS freshness already required |
| B3 | **Ports actual stop/kill** | Can drop Portal/AV/CSS if misaimed | Builds on dry-run allowlist; double confirm; never deny-list |
| B4 | **Live Portal runners** | Cross-app process spawn | Portal API contract + CSS client; side-fleet only first |
| B5 | **Quay densify mega** | Large AV visual merge risk | Stay on densify line; separate branch/pack like 0.3.17 |

### C. Peer Device Labs (CONSCIOUS #14)

| ID | Cap |
|----|-----|
| C1 | Agent Portal — Realme + desktop + tablet E2E hires |
| C2 | AgentVerse classic — same three viewports (leave v2 alone) |
| C3 | ProdDeck Device Lab stays green on every UI ship |

---

## Non-goals (remain out unless re-scoped)

- Robocopy `feature/upgradation-functionality` over densify F/G (`4310`/`5310`)
- Touching AV v2 `4311`/`5311` during classic/ProdDeck work
- EM waiver of CSS issuer bake or promote evidence folders
