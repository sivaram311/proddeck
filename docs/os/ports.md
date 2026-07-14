# Ports (Cloud OS)

**Branch:** `feat/os-ports`  
**Owns:** `src/os/modules/ports/**`, `src/app/api/os/ports/**`

## API

`GET /api/os/ports` → snapshot:

- `at` ISO timestamp
- `registryPath` → `E:\MyAgent\workflow\ports\registry.json`
- `rows[]` — reserved + unknown listeners in 3000–5999 with `mismatch`
- `unknownListening[]`

Mismatch kinds: `ok` | `reserved-not-listening` | `listening-unknown`.

## UI

Control Tower Ports panel: filter, mismatches toggle, 44px rows, Refresh.

## Smoke

With DEV server: `curl -s http://127.0.0.1:3320/api/os/ports | head`
