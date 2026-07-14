# ProdDeck

CSS-gated **home** for this machine — Keepers' Quay (call apps · leave memory · see the watch) plus phone-first **Cloud OS** Places (Pulse · Ports · Yard · Vault · …). AgentVerse stays the crew work plane.

| Env | URL / path | Port |
|-----|------------|------|
| DEV | `E:\wt\proddeck-integrate` · branch `cloud-os/integrate` | `3320` |
| PREPROD | `https://home-staging.delena.buzz` | `4320` **LIVE 0.5.0** |
| PROD | `https://home.delena.buzz` | `5320` **LIVE 0.5.0** |

- **Version:** **0.5.0** (Cloud OS Wave 1)
- **clientId:** `proddeck`
- **Repo:** https://github.com/sivaram311/proddeck
- **Release:** `H:\releases\proddeck-0.5.0`

## Docs

| Doc | Topic |
|-----|--------|
| [docs/WORLD.md](docs/WORLD.md) | Quay mythos + cast |
| [docs/CLOUD-OS-ROADMAP.md](docs/CLOUD-OS-ROADMAP.md) | Cloud OS features + Crew Fabric |
| [docs/PARALLEL-EXECUTION-PLAN.md](docs/PARALLEL-EXECUTION-PLAN.md) | Parallel git lanes / N subagents |
| [docs/OPS.md](docs/OPS.md) | Ports / smoke / promote / CSS bake |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Build + F/G cutover |
| [docs/HANDOFF.md](docs/HANDOFF.md) | Live hosts + next |
| [docs/os/](docs/os/) | Per-module Cloud OS notes |

## Run

```bash
npm install
# PRODUCTION builds MUST bake issuer (see .env.production):
# NEXT_PUBLIC_CSS_ISSUER=https://css.delena.buzz
npm run build
npm run dev   # or next start -p 3320
npm run smoke
```

After CSS login you land on the Quay (WebGL fail → flat catalog). Places nav opens Cloud OS panels (Control Tower / Forge / Yard / …). Manifest launches (Answering Wake).

## Stack

Next.js 15 · React 19 · R3F/drei/three · Zod pack · CSS `/api/css` · catalog · helpdesk · crews · `src/os/**`

## Crew

`agents/crew-manifest.md` — isolate from other app ports when promoting.
