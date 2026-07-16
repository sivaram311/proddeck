# Ops — ProdDeck

**Versions:** git tip **1.0.0** · F/G live **0.8.4** until promote · IdP **css-next** `v0.2.1` hybrid · tag `v1.0.0`

| Env | Host | Port | CSS_AUTH_URL | Issuer | Mode |
|-----|------|------|--------------|--------|------|
| DEV | home-dev.delena.buzz | 3320 | https://css-next.delena.buzz | https://css-next.delena.buzz | hybrid |
| PREPROD | home-staging.delena.buzz | 4320 | http://127.0.0.1:5910 | https://css-next.delena.buzz | hybrid |
| PROD | home.delena.buzz | 5320 | http://127.0.0.1:5910 | https://css-next.delena.buzz | hybrid |

Bake: `.env.production` must set `NEXT_PUBLIC_CSS_ISSUER` + `NEXT_PUBLIC_CSS_AUTH_MODE=hybrid` before `npm run build`.

## Hard-out flags (1.0.0)

| Flag | Default | Effect when ON |
|------|---------|----------------|
| `OS_FILEBRIDGE_DELETE` | 0 | Single-file delete under `H:\releases` + phrase |
| `OS_DRIVE_GUARD_MUTATE` | 0 | Allowlisted pin/marker writes |
| `OS_PORTS_STOP_KILL` | 0 | `taskkill` after dry-run allow (never deny-list) |
| `OS_YARD_LIVE_RUNNERS` | 0 | Portal spawn from Yard |
| `ACTIVITY_QUEUE_PATH` | `{cwd}/.data/activity-queue.jsonl` | Optional queue override |

## AgentVerse peers (Appliances)

| URL | Port | Role |
|-----|------|------|
| https://agentverse-staging.delena.buzz | 4310 | PREPROD 7-story densify |
| https://agentverse-v2-staging.delena.buzz | 4311 | PREPROD industrial v2 |
| https://agentverse-v2.delena.buzz | 5311 | PROD industrial v2 |
| https://agentverse.delena.buzz | 5312 | upgrade short host / Dispatch |
| https://control.delena.buzz | — | Stack Pilot + return to Control Tower |