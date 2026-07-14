# Ops — ProdDeck

**Version:** 0.3.0 PREPROD · building **0.4.0** characters/animations on DEV  
**World SoT:** [WORLD.md](./WORLD.md) · [HANDOFF.md](./HANDOFF.md)

## Ports

| Env | Port | Bind |
|-----|------|------|
| DEV | 3320 | `0.0.0.0` |
| PREPROD | 4320 | `F:\apps\proddeck` |
| PROD | 5320 | reserved |

Do not use AgentVerse ports. Cutover only ProdDeck — `agents/pre-work/CUTOVER-ROLLBACK.md`.

## World

- Pack: `scene.pack=keepers-quay`, `defaultView=scene`
- Purpose verbs: **Call** (Manifest) · **Remember** (Shed) · **Watch** (Loft)
- WebGL fail → flat catalog
- Movement: click-to-move

## Env

| Variable | Purpose |
|----------|---------|
| `CSS_AUTH_URL` | Upstream CSS (DEV `:9000`) |
| `NEXT_PUBLIC_CSS_ISSUER` | JWT `iss` |
| `PLATFORM_APPS_URL` | Optional platform apps |

## Health

```bash
npm run smoke
```

## PREPROD

| Item | Value |
|------|-------|
| Path | `F:\apps\proddeck` |
| Host | `https://home-staging.delena.buzz` |
| Last Q1 | `H:\releases\proddeck-0.3.0` |

Promote: evidence + EM GO + field-ops.
