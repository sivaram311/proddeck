# Cloud OS Wave ownership map

**Base:** `cloud-os/scaffold` → tag after Wave 0  
**Plan:** `docs/PARALLEL-EXECUTION-PLAN.md`

## Wave 0 (Lead / Integrator) — DONE

| Path | Owner |
|------|--------|
| `src/os/**` shell, places, registry stubs | Lead |
| `packs/proddeck/app.json` `os` block · `0.5.0-scaffold` | Lead |
| `DeckHome` PlacesNav + DriveGuard + PlacePanel | Lead |
| `agents/pre-work/CLOUD-OS-OWNERSHIP.md` | Lead |
| Tag | `cloud-os/scaffold-v1` |

## Wave 1 (parallel) — write ONLY your module

| Branch | Owns |
|--------|------|
| `feat/os-pulse` | `src/os/modules/pulse/**`, `src/app/api/os/pulse/**` |
| `feat/os-ports` | `src/os/modules/ports/**`, `src/app/api/os/ports/**` |
| `feat/os-identity` | `src/os/modules/identity/**` |
| `feat/os-activity-log` | `src/os/modules/activity-log/**`, `src/app/api/os/activity-log/**` |
| `feat/os-archive` | `src/os/modules/archive/**` |
| `feat/os-dispatch` | `src/os/modules/dispatch/**` |
| `feat/os-promote` | `src/os/modules/promote/**`, `src/app/api/os/promote/**` |
| `feat/os-yard` | `src/os/modules/yard/**` |
| `feat/os-runbooks` | `src/os/modules/runbooks/**` |
| `feat/os-appliances` | `src/os/modules/appliances/**` |
| `feat/os-beacon` | `src/os/modules/beacon/**`, `src/app/api/os/beacon/**` |
| `feat/os-drive-guard` | `src/os/modules/drive-guard/**` (chip already stubbed in shell) |
| `feat/os-filebridge` | `src/os/modules/filebridge/**` |

## Forbidden for Wave 1

- `src/components/DeckHome.tsx` (Lead only)
- `src/os/shell/**`, `src/os/places.ts`, `src/os/registry.tsx` (Lead only after Wave 0)
- `src/scene/**`
- `E:\MyAgent\workflow\activity\ACTIVITY-LOG.md` (Lead serial)
- F:/G: deploys

## Docs per lane

Add `docs/os/<module-id>.md` only. Docs-Keeper consolidates Wave 3.
