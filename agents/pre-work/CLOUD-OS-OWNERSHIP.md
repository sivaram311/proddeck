# Cloud OS Wave ownership map

**Plan:** [docs/WAVE-2-PLAN.md](../../docs/WAVE-2-PLAN.md) · [docs/PARALLEL-EXECUTION-PLAN.md](../../docs/PARALLEL-EXECUTION-PLAN.md)

## Wave 0 / 1 — DONE (live 0.5.0)

Scaffold + Pulse / Ports / Identity / Yard / Activity Log / Archive / Dispatch / Promote.

## Wave 2A (parallel stubs) — write ONLY your module

| Branch | Owns |
|--------|------|
| `feat/os-beacon` | `src/os/modules/beacon/**`, `src/app/api/os/beacon/**`, `docs/os/beacon.md` |
| `feat/os-appliances` | `src/os/modules/appliances/**`, `docs/os/appliances.md` |
| `feat/os-runbooks` | `src/os/modules/runbooks/**`, `docs/os/runbooks.md` |
| `feat/os-filebridge` | `src/os/modules/filebridge/**`, `docs/os/filebridge.md` |
| `feat/os-drive-guard` | `src/os/modules/drive-guard/**`, `docs/os/drive-guard.md` (may export confirm helper) |

## Wave 2B (deepen) — same module ownership as Wave 1

Pulse / Ports / Identity / Activity Log / Archive / Dispatch / Promote / Yard — “Next” slices only inside owned paths.

## Wave 2C — Lead

`src/os/events/**`, `src/app/api/os/events/**`, `docs/os/portal-events.md`

## Forbidden for parallel lanes

- `src/components/DeckHome.tsx` (Lead only)
- `src/os/shell/**`, `src/os/places.ts`, `src/os/registry.tsx` (Lead only; Drive Guard chip wiring = Lead)
- `src/scene/**`
- `E:\MyAgent\workflow\activity\ACTIVITY-LOG.md` (Lead serial — queue file under `.data/` is OK for phone staging)
- F:/G: deploys until EM GO

## Cloud OS 0.7.0 (safe subset) — parallel

| Branch | Owns |
|--------|------|
| `feat/os-alog-queue` | `activity-log/**`, `api/os/activity-log/**` (queue to `.data/activity-queue.jsonl` only) |
| `feat/os-drive-reauth` | `drive-guard/**` only (import identity probe — do not edit identity) |
| `feat/os-ports-stop` | `ports/**` |
| `feat/os-yard-skills` | `yard/**` |
| `feat/os-filebridge-list` | `filebridge/**`, `api/os/filebridge/**` list harden |
| AV `feature/desk-0.3.17` | `E:\wt\agentverse-0.3.17` solely — Desk slices; no F/G |
