# Ops — ProdDeck

**Version:** 0.4.0 **PROD + PREPROD LIVE**  
**World SoT:** [WORLD.md](./WORLD.md) · [HANDOFF.md](./HANDOFF.md)

## Ports

| Env | Port | Host |
|-----|------|------|
| DEV | 3320 | local |
| PREPROD | 4320 | https://home-staging.delena.buzz |
| PROD | 5320 | https://home.delena.buzz |

## Health

```bash
npm run smoke
npm run smoke -- https://home.delena.buzz
```

Promote: evidence under `H:\releases\proddeck-<ver>\evidence\` + EM GO + field-ops.
