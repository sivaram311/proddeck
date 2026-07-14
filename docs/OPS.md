# Ops — ProdDeck

**Versions:** DEV / F / G LIVE **0.8.0** Wave A · pack `H:\releases\proddeck-0.8.0` · tag `v0.8.0`  
**Compatibility:** [SUPPORTED-VERSIONS.md](./SUPPORTED-VERSIONS.md)  
**SoT:** [WORLD.md](./WORLD.md) · [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md) · [HANDOFF.md](./HANDOFF.md) · [CLOUD-OS-0.8-PLAN.md](./CLOUD-OS-0.8-PLAN.md) · [DEPLOY.md](./DEPLOY.md)

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
| Pack | `packs/proddeck/app.json` ? `keepers-quay` + `os.enabled` |
| Quay modules | catalog · helpdesk · scene · crewsDesk |
| OS modules | see pack `os.modules` (0.7 adds queue / request-stop / skill registry / FB jail) |

### CSS JWT bake (mandatory for F/G builds)

`NEXT_PUBLIC_*` is inlined at **`npm run build`**. If `NEXT_PUBLIC_CSS_ISSUER` is missing, the client falls back to `http://localhost:9000` and rejects live tokens (`iss=https://css.delena.buzz`) after login.

| Variable | DEV | PREPROD/PROD |
|----------|-----|----------------|
| `CSS_AUTH_URL` | `:9000` | `http://127.0.0.1:5900` |
| `NEXT_PUBLIC_CSS_ISSUER` | match DEV CSS | **`https://css.delena.buzz`** (also in `.env.production`) |
| `PLATFORM_APPS_URL` | optional | `:4080` / `:5080` platform apps |
| `OS_EVENTS_FORWARD` | DEV default-on | **`1`** on F/G (requires Portal ? **0.1.8**) |

Commit `.env.production` holds the public issuer for release builds. After cutover: hard-refresh clients if an old chunk is cached.

Prod CSS admin password is **not** `admin123` — see `G:\apps\css\.env` (`CSS_ADMIN_PASSWORD`). Never commit it.

## Dependent peers (minimum)

| Feature in ProdDeck | Requires |
|---------------------|----------|
| Login / catalog JWT | CSS issuer + `clientId=proddeck` |
| OS event forward | Portal **? 0.1.8** `POST /api/os-events` |
| Dispatch ? Session Desk | **AV upgrade fleet** (default): `agentverse-upgrade-staging.delena.buzz` / `agentverse-upgrade.delena.buzz` · contract `/desk?src=&crew=&session=&intent=&brief=&skills=&return=&env=` · classic `agentverse.delena.buzz` is **not** the Dispatch default |
| H-Drive Archive / FileBridge browse | `https://hdrive.delena.buzz` + `H:\releases` on host |

Full matrix: [SUPPORTED-VERSIONS.md](./SUPPORTED-VERSIONS.md).

## Health

```bash
npm run smoke
npm run smoke -- http://127.0.0.1:4320
npm run smoke -- https://home-staging.delena.buzz
npm run smoke -- https://home.delena.buzz
node scripts/smoke-pulse.mjs
node scripts/smoke-ports.mjs
node scripts/smoke-activity-log.mjs
```

Expect pack version match (DEV **0.7.0** / F/G **0.6.2** until promote) · `keepers-quay` + `os.enabled`. Catalog + helpdesk **401** without Bearer; **200 + apps** with a valid `proddeck` JWT.

## Promote

| Gate | Evidence |
|------|----------|
| Q1/Q2 live | `H:\releases\proddeck-0.6.2\evidence\` |
| Next | `H:\releases\proddeck-0.7.0\evidence\` (await EM GO) |

Always hire **promote-field-ops**. On promote day also verify Portal ? 0.1.8 and AV ? 0.3.16 (prefer 0.3.17).
