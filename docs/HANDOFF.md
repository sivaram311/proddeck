# Handoff — ProdDeck

**DEV:** **0.8.2** · `feature/css-next-oauth-pilot` → `main` · `:3320` · https://home-dev.delena.buzz · IdP **css-next** hybrid  
**PREPROD / PROD target:** **0.8.2** css-next cutover (migrate Phase 6) · rollback pack `H:\releases\proddeck-0.8.0`  
**Repo:** https://github.com/sivaram311/proddeck  
**clientId:** `proddeck`  
**Release pack:** `H:\releases\proddeck-0.8.2` · tag `v0.8.2`

## Read first

| Doc | Why |
|-----|-----|
| [OPS.md](./OPS.md) | Ports, CSS bake, smoke |
| [SUPPORTED-VERSIONS.md](./SUPPORTED-VERSIONS.md) | Compatibility |
| MyAgent `workflow/css/MIGRATE-PENDING.md` | CSS migrate tracker |
| Skill `css-migrate` | Orchestrator for consumer cutovers |

## Isolation

Never stop AgentVerse (`4310/4311/5310/5311`) or portal (`5080`) for ProdDeck work. Kill-by-port **only** `4320` / `5320` as appropriate.

## Auth note (0.8.2)

F/G issuer is **css-next** (`v0.2.0`). Classic CSS stays live for Portal/AV until their migrate IDs run.
