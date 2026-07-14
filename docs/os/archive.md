# Archive — Cloud OS module

**Lane:** Storage UI · Wave 1b · `feat/os-archive`  
**Owner path:** `src/os/modules/archive/`

## Purpose

Phone-first browse of **H:\releases** release folders. Lists `proddeck-*` builds first with H-Drive deep links and copyable Windows paths for promote evidence (`evidence\q1`, `evidence\q2`). Read-only — no deletes, no bulk file APIs.

## Data source

| Item | Value |
|------|--------|
| Root | `H:\releases` |
| H-Drive | `https://hdrive.delena.buzz` (maps `H:\` → web root) |
| Server read | `releases.ts` via server action `fetchArchiveReleases` |

If **H:** is missing or unreadable, the UI shows a clear error — no silent empty list.

## UI (MVP)

- **ProdDeck releases** — newest semver first; each card has:
  - Windows path (`H:\releases\proddeck-<ver>\`)
  - **Open H-Drive** link (`/releases/proddeck-<ver>/`)
  - **Copy path** (44px tap target)
  - Evidence rows when folders exist: `evidence\q1`, `evidence\q2` with H-Drive URL + copy
- **Other releases** — collapsible list (agent-portal, agentverse, etc.) with copy path only
- **Realme / mobile** — interactive controls use `min-h-11` (44px)

## Boundaries

| Allowed | Forbidden |
|---------|-----------|
| `src/os/modules/archive/**` | DeckHome, shell, places, registry |
| `docs/os/archive.md` | Other OS modules, scene |
| `fs` read + `readdir` on H:\releases | Deletes, write APIs, ACTIVITY-LOG writes |
| H-Drive outbound links | F:/G: deploys |

## Typecheck

```bash
node E:\MyWorkspace\sandbox\proddeck\node_modules\typescript\bin\tsc --noEmit -p .
```

Run from repo root (`E:\wt\proddeck-archive` or linked worktree).

## Next (post-MVP)

- Pin current PROD / last PREPROD per product
- SSO handoff polish for H-Drive from phone
- Tie-in with Promote GO checklist (shared evidence paths)
