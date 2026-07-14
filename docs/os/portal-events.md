# Portal / OS events (ProdDeck contract)

**Ship:** 0.6.1 leftover · ProdDeck publish + Portal DEV consumer

## Envelope

```json
{
  "type": "dispatch.hire.requested | promote.decision | crew.fabric.spawned | crew.fabric.lane.done",
  "env": "dev|preprod|prod",
  "actor": "proddeck",
  "payload": {},
  "at": "ISO-8601"
}
```

ProdDeck stamps `at`, appends `.data/os-events.jsonl` (gitignored), then soft-forwards to Agent Portal when enabled.

**Local read:** `GET /api/os/events?limit=40&type=crew.fabric.spawned` → `{ ok, events, count }` (read-only jsonl tail).

## Portal consumer (DEV)

Agent Portal (E: only for this leftover): `POST /api/os-events`

- Validates `type` against the four known strings
- Audits as `os.event.<type>` (truncated JSON details)
- Returns `{ "ok": true }`
- `permitAll` on DEV (no JWT / API key)

Default local URL: `http://127.0.0.1:8080/api/os-events` (also via `https://delena.buzz/api/os-events` when NGINX fronts DEV).

## Env vars (ProdDeck)

| Variable | Meaning |
|----------|---------|
| `PLATFORM_APPS_URL` | Portal platform apps URL, e.g. `http://127.0.0.1:8080/api/platform/apps`. Forward base = this with `/api/platform/apps` stripped. |
| `OS_EVENTS_FORWARD` | `1` = always forward. `0` = never. Unset in `NODE_ENV=development` = **forward on** (DEV default). Unset outside development = off. |

PREPROD/PROD: leave unset or `0` unless Portal intake is intentionally enabled on that env (this leftover does **not** cut over F:/G: Portal).

## Smoke (DEV Portal)

```bash
curl -sS -X POST http://127.0.0.1:8080/api/os-events \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"crew.fabric.lane.done\",\"env\":\"dev\",\"actor\":\"proddeck\",\"payload\":{\"lane\":\"Pri3\"},\"at\":\"2026-07-15T00:00:00.000Z\"}"
```

Expect `{ "ok": true }`. Confirm audit row via Portal Activity / `GET /api/audit` (auth required for read).
