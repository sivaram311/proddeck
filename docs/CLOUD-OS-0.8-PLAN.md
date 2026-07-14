# Cloud OS 0.8.0 — Wave A LIVE

**Status:** Wave A **LIVE on F/G** (user promote GO 2026-07-15)  
**ProdDeck:** **0.8.0** · tag `v0.8.0` · `H:\releases\proddeck-0.8.0`  
**Peers:** AV classic **0.3.17** · Portal **0.1.8** · CSS `v0.1.0`  
**Compatibility:** [SUPPORTED-VERSIONS.md](./SUPPORTED-VERSIONS.md)  
**Session:** `proddeck-keepers-quay-2026-07-14`

---

## Wave A shipped (no kill / confirm-gated write)

| Cap | Behavior |
|-----|----------|
| **Pri 6 drain tooling** | `POST /api/os/activity-log` `{op:"drain",mode:"dry-run"|"apply"}` · apply requires confirm `DRAIN_TO_MYAGENT` · UI preview + phrase |
| **Pri 3 stop dry-run** | `POST /api/os/ports/stop-dry-run` · deny-list critical ports · **never** Stop-Process · UI “Dry-run stop” |

---

## Remaining backlog (still blocked)

| Pri | Cap | Why hard | EM must confirm |
|-----|-----|----------|-----------------|
| 1 | **FileBridge H: delete IO** | CONSCIOUS #1 — today hard-fail 403 | Exact path targets + operator confirmation UX; never silent delete |
| 2 | **Drive Guard real G:/H: mutations** | Writes outside sandbox | Per-op confirm; CSS freshness already required |
| 3b | **Ports actual stop/kill** | Can drop Portal/AV/CSS if misaimed | Builds on dry-run allowlist; double confirm; never deny-list |
| 4 | **Live Portal runners** | Cross-app process spawn | Portal API contract + CSS client; side-fleet only first |
| 5 | **Quay densify mega** | Large AV visual merge risk | Stay on densify line; separate branch/pack like 0.3.17 |

---

## Non-goals (remain out unless re-scoped)

- Robocopy `feature/upgradation-functionality` over densify F/G (`4310`/`5310`)
- Touching AV v2 `4311`/`5311` during classic/ProdDeck work
- EM waiver of CSS issuer bake or promote evidence folders
