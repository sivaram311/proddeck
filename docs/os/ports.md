# Ports module (Cloud OS Wave 1)

**Lane:** `feat/os-ports` · **Place:** Control Tower · **Module id:** `ports`

Read-only view of the MyAgent port registry compared to live TCP listeners on the Windows host.

## API

### `GET /api/os/ports`

- **Auth:** Bearer JWT (`clientId=proddeck`, CSS JWKS verify) — same gate as `/api/catalog`.
- **Registry source:** `E:\MyAgent\workflow\ports\registry.json` (SoT).
  - Override path: `MYAGENT_PORTS_REGISTRY`
  - Markdown fallback: `REGISTRY.md` beside JSON when JSON is thin (< 5 rows) or merge when both exist.
  - BOM-safe JSON parse (PowerShell UTF-8 exports).
- **Listener scan:** best-effort on Windows via `Get-NetTCPConnection -State Listen`, falling back to `netstat -an`.
  - Off Windows: `listenerScan: "skipped"`.
- **401:** `{ "error": "unauthorized", "code": "...", "message": "..." }`

#### Response shape

```json
{
  "at": "ISO-8601",
  "source": "registry.json",
  "registryUpdated": "2026-07-14",
  "ranges": { "dev": { "drive": "E", "min": 3000, "max": 3999 } },
  "reserved": [
    {
      "port": 3320,
      "appId": "proddeck",
      "env": "dev",
      "role": "http",
      "status": "reserved",
      "notes": "...",
      "listening": false,
      "mismatch": "not-listening"
    }
  ],
  "unknownListeners": [8080],
  "listenerScan": "ok",
  "listenerNote": "optional"
}
```

#### Mismatch rules

| Condition | Badge |
|-----------|--------|
| Registry `active` or `reserved`, not listening | `not-listening` |
| Listening, not in registry | `unknown` (listed under `unknownListeners`) |
| Listening + `legacy` status | `legacy live` (informational) |
| Listening + normal status | `live` |

Reservation policy is unchanged: **register in MyAgent before bind** — this module does not write the registry.

## UI

- Realme-friendly rows: **44px** (`min-h-11`) list items.
- Search (port / appId / notes), env filter, mismatches-only toggle.
- Mismatch summary in meta line; unknown listeners section below reserved list.
- Refresh button re-fetches API with CSS Bearer token.

**Path:** `src/os/modules/ports/index.tsx`

## Smoke

```powershell
# Auth gate (no token) — requires worktree dev server
node scripts/smoke-ports.mjs http://127.0.0.1:3320

# With Bearer (after CSS login, copy prodDeck access token):
$env:PRODDECK_TOKEN = "<jwt>"
node scripts/smoke-ports.mjs http://127.0.0.1:3320
```

Expect `SMOKE_PORTS_PASS`.

## Ownership (Wave 1)

| Own | Do not touch |
|-----|----------------|
| `src/os/modules/ports/**` | `DeckHome.tsx`, shell, `places.ts`, `registry.tsx` |
| `src/app/api/os/ports/**` | Other OS modules, `scene/` |
| `docs/os/ports.md` | MyAgent ACTIVITY-LOG, F:/G: writes, new port reservations |

## Env vars

| Variable | Default |
|----------|---------|
| `MYAGENT_PORTS_REGISTRY` | `E:\MyAgent\workflow\ports\registry.json` |
| `MYAGENT_PORTS_REGISTRY_MD` | sibling `REGISTRY.md` |
