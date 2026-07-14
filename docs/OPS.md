# Ops — ProdDeck

**Version:** **0.6.1** LIVE on PREPROD + PROD (leftover sprint)  
**SoT:** [WORLD.md](./WORLD.md) · [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md) · [HANDOFF.md](./HANDOFF.md) · [LEFTOVER-SPRINT.md](./LEFTOVER-SPRINT.md) · [DEPLOY.md](./DEPLOY.md)

## Ports / hosts

| Env | Port | Path | Host |
|-----|------|------|------|
| DEV | 3320 | `E:\wt\proddeck-integrate` | local |
| PREPROD | 4320 | `F:\apps\proddeck` | https://home-staging.delena.buzz |
| PROD | 5320 | `G:\apps\proddeck` | https://home.delena.buzz |

Do **not** use AgentVerse ports (`4310/4311/5310/5311`) or portal `:5080` for ProdDeck cutovers. Playbook: `agents/pre-work/CUTOVER-ROLLBACK.md`.

## Auth / pack

| Item | Value |
|------|--------|
| CSS `clientId` | `proddeck` |
| Pack | `packs/proddeck/app.json` → `keepers-quay` + `os.enabled` |
| Quay modules | catalog · helpdesk · scene · crewsDesk |
| OS modules | Wave 1–2 set + leftovers (reauth, yard hire, ports reserve, archive pins); see pack `os.modules` |

### CSS JWT bake (mandatory for F/G builds)

`NEXT_PUBLIC_*` is inlined at **`npm run build`**. If `NEXT_PUBLIC_CSS_ISSUER` is missing, the client falls back to `http://localhost:9000` and rejects live tokens (`iss=https://css.delena.buzz`) after login.

| Variable | DEV | PREPROD/PROD |
|----------|-----|----------------|
| `CSS_AUTH_URL` | `:9000` | `http://127.0.0.1:5900` |
| `NEXT_PUBLIC_CSS_ISSUER` | match DEV CSS | **`https://css.delena.buzz`** (also in `.env.production`) |
| `PLATFORM_APPS_URL` | optional | `:4080` / `:5080` platform apps |

Commit `.env.production` holds the public issuer for release builds. After cutover: hard-refresh clients if an old chunk is cached.

Prod CSS admin password is **not** `admin123` — see `G:\apps\css\.env` (`CSS_ADMIN_PASSWORD`). Never commit it.

## Health

```bash
npm run smoke
npm run smoke -- http://127.0.0.1:4320
npm run smoke -- https://home-staging.delena.buzz
npm run smoke -- https://home.delena.buzz
# optional module smokes (when server up):
node scripts/smoke-pulse.mjs
node scripts/smoke-ports.mjs
node scripts/smoke-activity-log.mjs
```

Expect pack `0.6.1` (DEV) / `keepers-quay` + `os.enabled`. Catalog + helpdesk **401** without Bearer; **200 + apps** with a valid `proddeck` JWT.

## Promote

| Gate | Evidence |
|------|----------|
| Q1 0.6.1 | `H:\releases\proddeck-0.6.1\evidence\q1\` |
| Q2 0.6.1 | `H:\releases\proddeck-0.6.1\evidence\q2\` |
| Prior live | `H:\releases\proddeck-0.6.0\` |

Always hire **promote-field-ops** with promote crew. Roadmap: [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md).
