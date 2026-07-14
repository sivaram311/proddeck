# Activity Log module (Cloud OS 0.7.0 — staging queue)

Read-only view of the machine **append-only** activity log at `E:\MyAgent\workflow\activity\ACTIVITY-LOG.md`, plus a **local staging queue** for phone/API drafts.

## CONSCIOUS #10 staging policy

- **Primary SoT** remains `workflow/activity/ACTIVITY-LOG.md` (MyAgent). Every agent action must still land there.
- ProdDeck **never** writes the MyAgent file. `POST /api/os/activity-log` appends only to **`.data/activity-queue.jsonl`** (cwd-relative, gitignored under `.data/`).
- The queue is **staging only** — not a waiver of CONSCIOUS #10.
- **Lead/EM drains** approved queue rows into MyAgent ACTIVITY-LOG **serially**. Coding agents keep Lead-serial MyAgent logging as today.

## API

### `GET /api/os/activity-log`

| Query | Description |
|-------|-------------|
| `q` | Optional case-insensitive substring filter |
| `queue=1` | Return pending staging rows from `.data/activity-queue.jsonl` instead of MyAgent tail |

**Default (no `queue`)** — MyAgent tail:

- `entries[]` — parsed table rows (max ~80 tail, JSON capped at 64 KiB)
- `matched` — count after filter within tail window
- `truncated` — true when response size cap applied
- `redacted` per entry — obvious `password` / `token` / `secret` / `bearer` values masked

Errors: `404` if log file missing; `500` on read/parse failure.

**`?queue=1`** — staging queue:

- `queue: true`, `entries[]` pending rows, `matched`, `truncated`
- Missing queue file → empty `entries` (not an error)

### `POST /api/os/activity-log`

Stages one row into `.data/activity-queue.jsonl`.

Body (JSON):

| Field | Required | Notes |
|-------|----------|-------|
| `action` | yes | What happened |
| `session`, `provider`, `role`, `target`, `result`, `notes`, `timestamp` | no | Defaults applied server-side |

Response: `{ ok: true, queued: true, row }` — server stamps `at` (ISO).

## UI

Place **Remember** → module `activity-log`:

- SOP banner: **Lead drains queue into MyAgent ACTIVITY-LOG serially**
- Pending queue rows (amber) + MyAgent log tail
- Filter box (debounced, passes `q` to both fetches)
- Refresh (`min-h-11` tap targets)
- `min-h-11` rows: timestamp snippet, session, action, provider / queued chip

## Smoke

```bash
node scripts/smoke-activity-log.mjs http://127.0.0.1:3320
```

## Ownership

Lane branch: `feat/os-alog-queue`  
Own: `src/os/modules/activity-log/**`, `src/app/api/os/activity-log/**`, this doc.
