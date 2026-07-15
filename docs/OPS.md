# Ops — ProdDeck

**Versions:** DEV / F / G **0.8.4** · IdP **css-next** `v0.2.1` hybrid · tag `v0.8.4`

| Env | Host | Port | CSS_AUTH_URL | Issuer | Mode |
|-----|------|------|--------------|--------|------|
| DEV | home-dev.delena.buzz | 3320 | https://css-next.delena.buzz | https://css-next.delena.buzz | hybrid |
| PREPROD | home-staging.delena.buzz | 4320 | http://127.0.0.1:5910 | https://css-next.delena.buzz | hybrid |
| PROD | home.delena.buzz | 5320 | http://127.0.0.1:5910 | https://css-next.delena.buzz | hybrid |

Bake: `.env.production` must set `NEXT_PUBLIC_CSS_ISSUER` + `NEXT_PUBLIC_CSS_AUTH_MODE=hybrid` before `npm run build`.

Classic CSS `:5900` is untouched (other apps).

## AgentVerse peers (Appliances)

| URL | Port | Role |
|-----|------|------|
| https://agentverse-staging.delena.buzz | 4310 | PREPROD 7-story densify |
| https://agentverse-v2-staging.delena.buzz | 4311 | PREPROD industrial v2 |
| https://agentverse-v2.delena.buzz | 5311 | PROD industrial v2 |
| https://agentverse.delena.buzz | 5312 | upgrade short host / Dispatch |