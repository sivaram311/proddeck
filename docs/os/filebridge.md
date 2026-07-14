# FileBridge (ProdDeck lane)

Read-only browse of **`H:\releases`** via `GET /api/os/filebridge?path=<rel>`.

| Item | Policy |
|------|--------|
| Jail | Paths resolve under `H:\releases` only (no `H:\` root, no other drives, no `..`) |
| Open | **Open H-Drive** → `https://hdrive.delena.buzz/releases/...` |
| Deletes | **Blocked.** `DELETE`/`POST`/`PUT`/`PATCH` → **403** `{ error: "blocked", code: "conscious_no_delete" }`. UI never calls delete IO. |

## API

- `GET ?path=` — relative under releases (empty = root). Response `{ ok, root, rel, entries[] }` or `{ ok:false, error, message }`.
- Errors: `path_denied` (403), `drive_missing` / `not_found` (404), `not_directory` (400), `list_failed` (500).

## UI

Breadcrumb + List / Up, dir click-through, per-row H-Drive + copy path. Delete panel acknowledges CONSCIOUS #1 only.
