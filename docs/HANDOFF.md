# Handoff — ProdDeck

**PROD / PREPROD / DEV:** **1.0.0** · IdP **css-next** `v0.2.1` (hybrid)  
**Hosts:** https://home.delena.buzz · https://home-staging.delena.buzz · https://home-dev.delena.buzz  
**Repo tip:** `main` · tag `v1.0.0` · branch `release/1.0.0`  
**Release pack:** `H:\releases\proddeck-1.0.0`

## Auth

| Item | Value |
|------|--------|
| clientId | `proddeck` |
| Issuer | `https://css-next.delena.buzz` |
| BFF | `CSS_AUTH_URL=http://127.0.0.1:5910` |
| Mode | `hybrid` |

## Isolation

Do not kill non-ProdDeck ports. Cutover only `3320` / `4320` / `5320`.  
Hard outs (`OS_*`) default **OFF** on live F/G.

## AgentVerse peer URLs

| Host | Fleet | Notes |
|------|-------|--------|
| https://agentverse-staging.delena.buzz | Classic densify PREPROD | `:4310` |
| https://agentverse-v2-staging.delena.buzz | stable-v2 PREPROD | `:4311` |
| https://agentverse-v2.delena.buzz | stable-v2 PROD | `:5311` |
| https://agentverse.delena.buzz | upgrade (short host) | Dispatch SoT · `:5312` |
| https://control.delena.buzz | Stack Pilot | Return → Control Tower |
