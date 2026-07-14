# Archive — Cloud OS module

**Lane:** Storage UI · leftover sprint 0.6.1 · `feat/os-archive-sso`  
**Owner path:** `src/os/modules/archive/`

## Purpose

Phone-first browse of **H:\releases** release folders. Lists `proddeck-*` builds first with H-Drive (SSO) deep links and copyable Windows paths for promote evidence (`evidence\q1`, `evidence\q2`). Pins live PREPROD / PROD VERSION from F:/G:. **Read-only** — no deletes, no bulk file APIs.

## Data source

| Item | Value |
|------|--------|
| Root | `H:\releases` |
| H-Drive | `https://hdrive.delena.buzz` (maps `H:\` → web root; CSS SSO) |
| Server read | `releases.ts` via `fetchArchiveReleases` |
| VERSION pins | `F:\apps\proddeck\VERSION`, `G:\apps\proddeck\VERSION` via `fetchEnvVersionPins` (`versions.ts`) |

If **H:** is missing or unreadable, the UI shows a clear error — no silent empty list.  
If **F:** / **G:** VERSION is missing, the pin strip shows **unpinned / unavailable** (no crash).

## UI

- **VERSION pin strip** — `PREPROD F: <ver>` · `PROD G: <ver>` with monospace path
- **ProdDeck releases** — newest semver first; each card has:
  - Windows path (`H:\releases\proddeck-<ver>\`)
  - **Open in H-Drive (SSO)** link (`/releases/proddeck-<ver>/`)
  - **Copy path** (`min-h-11` tap target)
  - Evidence rows when folders exist: `evidence\q1`, `evidence\q2` with H-Drive URL + copy
- **Other releases** — collapsible list (agent-portal, agentverse, etc.) with copy path only
- **Realme / mobile** — interactive controls use `min-h-11` (44px)

## Boundaries

| Allowed | Forbidden |
|---------|-----------|
| `src/os/modules/archive/**` | DeckHome, shell, places, registry |
| `docs/os/archive.md` | Other OS modules, scene |
| `fs` read + `readdir` on H:\releases; read F:/G: VERSION | Deletes, write APIs, ACTIVITY-LOG writes |
| H-Drive outbound links | F:/G: deploys |

## Typecheck

```bash
node E:\MyWorkspace\sandbox\proddeck\node_modules\typescript\bin\tsc --noEmit -p .
```

Run from repo root (`E:\wt\proddeck-archive-sso` or linked worktree).
