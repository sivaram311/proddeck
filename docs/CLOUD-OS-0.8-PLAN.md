# Cloud OS 0.8 — deferred hard outs (plan only)

**Status:** PLAN — **no coding until EM GO**  
**Baseline live:** ProdDeck **0.7.0** · AV classic **0.3.17** · Portal **0.1.8** · CSS `v0.1.0`  
**Compatibility:** [SUPPORTED-VERSIONS.md](./SUPPORTED-VERSIONS.md)  
**Session:** `proddeck-keepers-quay-2026-07-14`

These items were **explicitly out** of the 0.7 safe subset. Each needs its own confirmation gate because it breaks CONSCIOUS standing limits or can disturb other fleets.

---

## Candidate backlog (recommended order)

| Pri | Cap | Why hard | EM must confirm |
|-----|-----|----------|-----------------|
| 1 | **FileBridge H: delete IO** | CONSCIOUS #1 — today hard-fail 403 | Exact path targets + operator confirmation UX; never silent delete |
| 2 | **Drive Guard real G:/H: mutations** | Writes outside sandbox | Per-op confirm; CSS freshness already required |
| 3 | **Ports actual stop/kill** | Can drop Portal/AV/CSS if misaimed | Only registered non-critical ports; dry-run + double confirm; never 5900/5432 |
| 4 | **Live Portal runners** | Cross-app process spawn | Portal API contract + CSS client; side-fleet only first |
| 5 | **Quay densify mega** | Large AV visual merge risk | Stay on densify line; separate branch/pack like 0.3.17 |
| 6 | **Phone → MyAgent ACTIVITY-LOG drain** | CONSCIOUS #10 scramble risk | Lead-only drain from `.data/activity-queue.jsonl`; never phone-direct append |

---

## Non-goals (remain out unless re-scoped)

- Robocopy `feature/upgradation-functionality` over densify F/G (`4310`/`5310`)
- Touching AV v2 `4311`/`5311` during classic/ProdDeck work
- EM waiver of CSS issuer bake or promote evidence folders

---

## Suggested execution shape (after GO)

```text
Wave A (safety rails only, still no irreversible IO)
  → confirm UX templates + allowlists + dry-run APIs
Wave B (one hard out at a time, separate packs)
  → promote each with evidence + field-ops
```

Default first GO candidate after UX review: **Pri 6 queue drain tooling** (lowest blast radius) or **Pri 3 stop allowlist dry-run** — EM picks; do not auto-start Wave B.

---

## Exit when this plan is approved

Update this file Status → GO + hire list; bump target version (likely **0.8.0**); freeze peer mins in SUPPORTED-VERSIONS before packing.
