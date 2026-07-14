# Ops — ProdDeck

**Version:** 0.4.0 **PROD + PREPROD LIVE** · DEV scaffold **`0.5.0-scaffold`** (`cloud-os/scaffold`)  
**SoT:** [WORLD.md](./WORLD.md) · [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md) · [HANDOFF.md](./HANDOFF.md) · [PARALLEL-EXECUTION-PLAN.md](./PARALLEL-EXECUTION-PLAN.md)

## Ports / hosts

| Env | Port | Path | Host |
|-----|------|------|------|
| DEV | 3320 | `E:\MyWorkspace\sandbox\proddeck` | local |
| PREPROD | 4320 | `F:\apps\proddeck` | https://home-staging.delena.buzz |
| PROD | 5320 | `G:\apps\proddeck` | https://home.delena.buzz |

Do **not** use AgentVerse ports (`4310/4311/5310/5311`) or portal `:5080` for ProdDeck cutovers. Playbook: `agents/pre-work/CUTOVER-ROLLBACK.md`.

## Auth / pack

| Item | Value |
|------|--------|
| CSS `clientId` | `proddeck` |
| Pack | `packs/proddeck/app.json` → `keepers-quay` |
| Modules | catalog · helpdesk · scene · crewsDesk |

## Env vars

| Variable | Purpose |
|----------|---------|
| `CSS_AUTH_URL` | DEV `:9000` · F/G often `:5900` |
| `NEXT_PUBLIC_CSS_ISSUER` | JWT `iss` (prod `https://css.delena.buzz`) |
| `PLATFORM_APPS_URL` | Optional Agent Portal platform apps |

## Health

```bash
npm run smoke
npm run smoke -- http://127.0.0.1:4320
npm run smoke -- https://home-staging.delena.buzz
npm run smoke -- https://home.delena.buzz
```

Expect pack `0.4.0` on F/G / `keepers-quay`; DEV scaffold pack `0.5.0-scaffold` with `os.enabled`. Catalog + helpdesk **401** without Bearer.

## Promote

| Gate | Evidence |
|------|----------|
| Q1 | `H:\releases\proddeck-0.4.0\evidence\q1\` |
| Q2 | `H:\releases\proddeck-0.4.0\evidence\q2\` |

Always hire **promote-field-ops** with promote crew. Next product direction (Pulse, Promote phone GO, Crew Fabric): [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md).
