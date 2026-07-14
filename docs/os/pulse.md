# Pulse — Cloud OS module

**Lane:** `feat/os-pulse` · **Place:** Control Tower (Quay)

Pulse surfaces machine health for the ProdDeck host: drive free space on **E/F/G/H** (DEV / PREPROD / PROD / RELEASES), plus best-effort reachability checks for Postgres and CSS.

## API

### `GET /api/os/pulse`

Returns a [`HealthSnapshot`](../../src/os/types.ts)-shaped JSON object. No auth gate in Wave 1 (DEV scaffold).

| Field | Type | Description |
|-------|------|-------------|
| `at` | ISO string | Snapshot timestamp |
| `uptimeSec` | number? | Host OS uptime (seconds) |
| `drives` | array? | One entry per letter E, F, G, H |
| `drives[].letter` | string | Drive letter without colon |
| `drives[].freeGb` | number? | Free space (GB, 1 decimal) |
| `drives[].totalGb` | number? | Total size (GB, 1 decimal) |
| `drives[].ok` | boolean | `true` when the drive is readable |
| `postgresOk` | boolean? | TCP connect to `127.0.0.1:5432` within ~1.5s |
| `cssOk` | boolean? | HTTP reachability to CSS (default `http://127.0.0.1:9000`, overridable via `CSS_AUTH_URL`) |

**Example**

```bash
curl -s http://127.0.0.1:3320/api/os/pulse | jq
```

```json
{
  "at": "2026-07-14T17:52:00.000Z",
  "uptimeSec": 86400,
  "drives": [
    { "letter": "E", "freeGb": 420.5, "totalGb": 931.5, "ok": true },
    { "letter": "F", "freeGb": 180.2, "totalGb": 500.0, "ok": true },
    { "letter": "G", "freeGb": 90.0, "totalGb": 250.0, "ok": true },
    { "letter": "H", "freeGb": 1200.0, "totalGb": 2000.0, "ok": true }
  ],
  "postgresOk": true,
  "cssOk": true
}
```

Errors return `{ "error": "pulse_failed", "message": "…" }` with HTTP 500.

## UI

**Component:** `src/os/modules/pulse/index.tsx` (`PulseView`)

- Mobile-friendly cards with **44px+** tap targets (Refresh button).
- Drive cards show role label, free/total GB, and a usage bar.
- Service rows for Postgres `:5432` and CSS `:9000`.
- Auto-refresh every 30s; no pointer-lock or 3D scene coupling.

Open ProdDeck → Cloud OS → Control Tower → **Pulse** slot.

## Smoke test

With the dev server running on `:3320`:

```bash
# API only (no server required if you import health in a one-off script)
node scripts/smoke-pulse.mjs
node scripts/smoke-pulse.mjs http://127.0.0.1:3320
```

Expect HTTP 200, `at` ISO string, four drives, and boolean `postgresOk` / `cssOk`.

## Implementation notes

| Path | Role |
|------|------|
| `src/os/modules/pulse/health.ts` | Server-side collectors (`statfs`, TCP/HTTP probes) |
| `src/app/api/os/pulse/route.ts` | Next.js route handler |
| `src/os/modules/pulse/index.tsx` | Client UI |

Drive letters honor MyAgent drive roles (E DEV, F PREPROD, G PROD, H RELEASES). Probes are best-effort and time-boxed (~1.5s) so the endpoint stays fast on laptops without Postgres/CSS running.
