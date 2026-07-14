# ProdDeck

CSS-gated production launcher — **Keepers’ Quay**: call apps, leave memory, see the watch.

| Env | URL / path | Port |
|-----|------------|------|
| DEV | `E:\MyWorkspace\sandbox\proddeck` | `3320` |
| PREPROD | `https://home-staging.delena.buzz` | `4320` (promote 0.4.0 next) |
| PROD | `https://home.delena.buzz` | `5320` (not Q2 yet) |

- **Version:** **0.4.0** — Keeper humanoid + berth/ticket/watch animations  
- **clientId:** `proddeck`  
- **Repo:** https://github.com/sivaram311/proddeck  
- **World:** [docs/WORLD.md](docs/WORLD.md) · [docs/OPS.md](docs/OPS.md) · [docs/HANDOFF.md](docs/HANDOFF.md)

## Run

```bash
npm install
npm run dev
npm run smoke
```

Land on the Quay after CSS login. Walk (tap studs). Manifest → launch (Answering Wake). Loft → Watch Acknowledge.

## Stack

Next.js 15 · React 19 · R3F/drei/three · Zod pack · CSS auth · catalog · helpdesk
