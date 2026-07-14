# Wave 2 plan — Cloud OS → 0.6.0

**Base:** `cloud-os/integrate` @ live 0.5.0 · tag `cloud-os/wave2-base`  
**Session:** `proddeck-keepers-quay-2026-07-14`  
**Ownership:** [CLOUD-OS-OWNERSHIP.md](../agents/pre-work/CLOUD-OS-OWNERSHIP.md)

## Cadence

1. **2A** — Fill stubs (beacon, appliances, runbooks, filebridge, drive-guard) in parallel worktrees  
2. **2B** — Deepen Wave-1 “Next” slices (parallel, owned paths only)  
3. **2C** — `POST /api/os/events` + portal-events contract (ProdDeck-first)  
4. **2D** — SemVer **0.6.0**, CSS issuer bake, smoke, Q1+Q2 promote, merge → `main`

No mid-wave F/G deploys. Bake `NEXT_PUBLIC_CSS_ISSUER=https://css.delena.buzz` on every release build.

## Out of scope (→ 1.0)

Live Yard runners · ACTIVITY-LOG writer service · Drive Guard G/H mutations · Ports process-kill · Quay densify

## Worktrees

```text
E:\wt\proddeck-beacon
E:\wt\proddeck-appliances
E:\wt\proddeck-runbooks
E:\wt\proddeck-filebridge
E:\wt\proddeck-drive-guard
```

Lead integrate: `E:\wt\proddeck-integrate` (preferred) or sandbox checkout of `cloud-os/integrate`.
