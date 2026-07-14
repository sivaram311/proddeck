# ProdDeck

CSS-gated **home** for this machine — Keepers' Quay plus phone-first **Cloud OS** Places. AgentVerse stays the crew work plane.

| Env | URL / path | Port | Version |
|-----|------------|------|---------|
| DEV | `E:\wt\proddeck-integrate` · `cloud-os/integrate` | `3320` | **0.7.0** |
| PREPROD | `https://home-staging.delena.buzz` | `4320` | **LIVE 0.6.2** |
| PROD | `https://home.delena.buzz` | `5320` | **LIVE 0.6.2** |

- **clientId:** `proddeck`
- **Repo:** https://github.com/sivaram311/proddeck
- **Releases:** live `H:\releases\proddeck-0.6.2` · next `H:\releases\proddeck-0.7.0`
- **Supported peers / deps:** [docs/SUPPORTED-VERSIONS.md](docs/SUPPORTED-VERSIONS.md)

## Docs

| Doc | Topic |
|-----|--------|
| [docs/SUPPORTED-VERSIONS.md](docs/SUPPORTED-VERSIONS.md) | **Fleet pin + dependency matrix** |
| [docs/HANDOFF.md](docs/HANDOFF.md) | Live hosts + peers |
| [docs/OPS.md](docs/OPS.md) | Ports / smoke / promote / CSS bake |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Build + F/G cutover |
| [docs/CLOUD-OS-ROADMAP.md](docs/CLOUD-OS-ROADMAP.md) | Cloud OS features + Crew Fabric |
| [docs/CLOUD-OS-0.7-PLAN.md](docs/CLOUD-OS-0.7-PLAN.md) | 0.7.0 safe-subset train |
| [docs/LEFTOVER-SPRINT.md](docs/LEFTOVER-SPRINT.md) | 0.6.1 leftovers (shipped) |
| [docs/os/](docs/os/) | Per-module notes |

## Run

```bash
npm install
# PRODUCTION builds MUST bake issuer (see .env.production):
# NEXT_PUBLIC_CSS_ISSUER=https://css.delena.buzz
npm run build
npm run dev   # or next start -p 3320
npm run smoke
```

## Stack

Next.js 15 · React 19 · R3F/drei/three · Zod pack · CSS `/api/css` · `src/os/**`

## Crew

`agents/crew-manifest.md` — isolate from other app ports when promoting.
