# Activity Log module (Wave 1b)

Read-only view of the machine **append-only** activity log at `E:\MyAgent\workflow\activity\ACTIVITY-LOG.md`. ProdDeck never writes to this file.

## API

`GET /api/os/activity-log`

| Query | Description |
|-------|-------------|
| `q` | Optional case-insensitive substring filter across timestamp, session, provider, role, action, target, result, and notes |

Response fields:

- `entries[]` — parsed table rows (max ~80 tail, JSON capped at 64 KiB)
- `matched` — count after filter within tail window
- `truncated` — true when response size cap applied
- `redacted` per entry — obvious `password` / `token` / `secret` / `bearer` values masked

Errors: `404` if log file missing; `500` on read/parse failure.

## UI

Place **Remember** → module `activity-log`:

- Filter box (debounced, passes `q` to API)
- Refresh (≥44px tap target)
- 44px rows: timestamp snippet, session, action, provider chip

## Smoke

```bash
node scripts/smoke-activity-log.mjs http://127.0.0.1:3320
```

## Ownership

Lane branch: `feat/os-activity-log`  
Own: `src/os/modules/activity-log/**`, `src/app/api/os/activity-log/**`, this doc.
