# Ops — ProdDeck

**Versions:** DEV **0.8.2** css-next hybrid · F/G cutover target **0.8.2** (IdP css-next `v0.2.0`) · prior live **0.8.0** classic  
**Compatibility:** [SUPPORTED-VERSIONS.md](./SUPPORTED-VERSIONS.md)  
**SoT:** [WORLD.md](./WORLD.md) · [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md) · [HANDOFF.md](./HANDOFF.md) · [CLOUD-OS-0.8-PLAN.md](./CLOUD-OS-0.8-PLAN.md) · [DEPLOY.md](./DEPLOY.md)

## Ports / hosts

| Env | Port | Path | Host |
|-----|------|------|------|
| DEV | 3320 | `E:\wt\proddeck-integrate` | https://home-dev.delena.buzz |
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

`NEXT_PUBLIC_*` is inlined at **`npm run build`**. If `NEXT_PUBLIC_CSS_ISSUER` is missing, the client falls back to `http://localhost:9000` and rejects live tokens after login.

| Variable | DEV (pilot) | PREPROD/PROD (0.8.2+) |
|----------|-------------|------------------------|
| `CSS_AUTH_URL` | `https://css-next.delena.buzz` | `http://127.0.0.1:5910` |
| `NEXT_PUBLIC_CSS_ISSUER` | **`https://css-next.delena.buzz`** | same (in `.env.production`) |
| `NEXT_PUBLIC_CSS_AUTH_MODE` | `hybrid` | `hybrid` |
| `PLATFORM_APPS_URL` | optional | `:4080` / `:5080` platform apps |
| `OS_EVENTS_FORWARD` | DEV default-on | **`1`** on F/G (requires Portal **0.1.8**) |

Commit `.env.production` holds the public **css-next** issuer for release builds. Classic `css.delena.buzz` / `:5900` remains for other apps. After cutover: hard-refresh clients if an old chunk is cached.

Prod CSS admin password is **not** `admin123` — see `G:\apps\css-next\.env` (`CSS_ADMIN_PASSWORD`). Never commit it.

### css-next hybrid pilot (DEV only)

Branch `feature/css-next-oauth-pilot`. Put URLs in **`.env.local`** only — SoT helper `src/lib/cssEnv.ts`:

```env
CSS_AUTH_URL=https://css-next.delena.buzz
NEXT_PUBLIC_CSS_ISSUER=https://css-next.delena.buzz
NEXT_PUBLIC_CSS_AUTH_MODE=hybrid
NEXT_PUBLIC_APP_URL=https://home-dev.delena.buzz
NEXT_PUBLIC_DEV_HOSTS=localhost,127.0.0.1,home-dev.delena.buzz
```

Primary: deck form ? `CSS_AUTH_URL` login. Optional SSO uses browser origin. **0.8.2+:** F/G bake `NEXT_PUBLIC_CSS_AUTH_MODE=hybrid` against css-next.

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
