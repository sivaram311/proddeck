# Handoff — ProdDeck

**DEV / PREPROD / PROD LIVE:** **0.8.0** Wave A  
**Hosts:** `:3320` · `https://home-staging.delena.buzz` · `https://home.delena.buzz`  
**Pack:** `H:\releases\proddeck-0.8.0` · tag `v0.8.0` · branch `cloud-os/integrate`

**Repo:** https://github.com/sivaram311/proddeck · **clientId:** `proddeck`  
**Compatibility SoT:** [SUPPORTED-VERSIONS.md](./SUPPORTED-VERSIONS.md)  
**Wave A / deferred:** [CLOUD-OS-0.8-PLAN.md](./CLOUD-OS-0.8-PLAN.md)

## Wave A (this release)

- Lead activity-queue drain (confirm `DRAIN_TO_MYAGENT`)
- Ports stop **dry-run** (deny-list critical; no kill IO)

## Peers (must stay compatible — see matrix)

| Peer | Live F/G | Notes |
|------|----------|-------|
| Agent Portal | **0.1.8** (`:4080` / `:5080`) | os-events |
| AgentVerse classic | **0.3.17** (`:4310` / `:5310`) | densify + Desk |
| CSS | `https://css.delena.buzz` · `:5900` · `v0.1.0` | issuer bake mandatory |

## Isolation

Never stop AgentVerse v2 (`4311`/`5311`) or unrelated portal cutovers during ProdDeck/AV classic promote.

Session: `proddeck-keepers-quay-2026-07-14`.
