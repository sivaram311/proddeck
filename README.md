# ProdDeck

CSS-gated production launcher — **Keepers’ Quay**: call apps, leave memory, see the watch.

| Env | URL / path | Port |
|-----|------------|------|
| DEV | `E:\MyWorkspace\sandbox\proddeck` | `3320` |
| PREPROD | `https://home-staging.delena.buzz` | `4320` **LIVE 0.3.0** |
| PROD | `https://home.delena.buzz` | `5320` (not Q2 yet) |

- **clientId:** `proddeck`
- **World:** [docs/WORLD.md](docs/WORLD.md) · [docs/OPS.md](docs/OPS.md) · [docs/HANDOFF.md](docs/HANDOFF.md)
- **Pack:** `packs/proddeck/app.json` (`keepers-quay`)

## Run

```bash
npm install
npm run dev
npm run smoke
```

After CSS login you land on the Quay (WebGL fail → flat catalog). Tap pier studs to walk. Manifest launches apps (Answering Wake).

## Stack

Next.js 15 · React 19 · R3F/drei/three · Zod pack · CSS `/api/css` · catalog · helpdesk

## Crew

`agents/crew-manifest.md` — isolate from AgentVerse ports when promoting.
