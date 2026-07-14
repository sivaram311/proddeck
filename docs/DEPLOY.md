# Deploy — ProdDeck

## Live targets (0.5.0)

| Env | Host | Port | Path |
|-----|------|------|------|
| DEV | local | 3320 | `E:\wt\proddeck-integrate` |
| PREPROD | `https://home-staging.delena.buzz` | 4320 | `F:\apps\proddeck` |
| PROD | `https://home.delena.buzz` | 5320 | `G:\apps\proddeck` |

Layout on F:/G:: wrapper (`start.ps1`, `VERSION`) + `app\` (Next.js + `.next` + `packs\`).

## Build

```bash
npm ci
npm run build
npm start   # or next start -p <env port>
```

Set `CSS_AUTH_URL` and `NEXT_PUBLIC_CSS_ISSUER` for target CSS. PREPROD/PROD typically:

- `CSS_AUTH_URL=http://127.0.0.1:5900`
- `NEXT_PUBLIC_CSS_ISSUER=https://css.delena.buzz`

## Promote

1. Package under `H:\releases\proddeck-<ver>\` (exclude `node_modules`; keep `.next` + packs)
2. Evidence under `evidence\q1\` or `evidence\q2\` + EM **GO**
3. Hire promote crew including **promote-field-ops**
4. Cutover **only** ProdDeck port (`4320` or `5320`)
5. Q2 first-time: `deploy-prod-app.ps1 -AppId proddeck -Subdomain home -Port 5320 -ReleaseId proddeck-<ver> -SkipPortReserve -Execute` (DNS + nginx)
6. `npm ci` in `app\`, start, poll LISTENING 30–60s, smoke origin + public HTTPS

See [OPS.md](./OPS.md), `agents/pre-work/CUTOVER-ROLLBACK.md`, `E:\MyAgent\workflow\promote\`.

## CSS

- `clientId=proddeck` registered (prod DB seeded)
- JWKS gate on `/api/catalog` and `/api/helpdesk`

## Checklist

1. Port reserved / active in MyAgent ports registry  
2. Env files for target CSS  
3. `npm run build` green  
4. Smoke `/` 200 · catalog/helpdesk 401 without Bearer · pack version match  
5. Public host smoke after nginx/DNS  
6. Non-regression: AgentVerse / portal still up  
7. Docs + ACTIVITY-LOG updated (rule #12)
