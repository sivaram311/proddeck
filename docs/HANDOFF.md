# Handoff — ProdDeck

**PROD LIVE:** 0.4.0 · `https://home.delena.buzz` · `G:\apps\proddeck` · `:5320`  
**PREPROD LIVE:** 0.4.0 · `https://home-staging.delena.buzz` · `F:\apps\proddeck` · `:4320`  
**DEV:** `E:\wt\proddeck-integrate` preferred · or `E:\MyWorkspace\sandbox\proddeck` · `:3320`  
**Branch:** `cloud-os/integrate` (Wave 1a merged) · pack **`0.5.0-scaffold`**  
**Tag base:** `cloud-os/scaffold-v1`  
**Repo:** https://github.com/sivaram311/proddeck  
**clientId:** `proddeck`  
**Release:** `H:\releases\proddeck-0.4.0` — F/G still 0.4.0; Cloud OS is DEV-only

## Wave status

| Wave | Status |
|------|--------|
| 0 scaffold | done · tag `cloud-os/scaffold-v1` |
| 1a Pulse / Ports / Identity / Yard | merged on `cloud-os/integrate` |
| 1b activity-log / archive / dispatch / promote | in flight · `E:\wt\proddeck-*` |

## Isolation

Never stop AgentVerse (`4310/4311/5310/5311`) or portal (`5080`). Kill-by-port only `4320` / `5320` when cutting ProdDeck.

Session: `proddeck-keepers-quay-2026-07-14`.
