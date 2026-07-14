# Handoff — ProdDeck

**DEV:** **0.7.0** + Wave A (`cloud-os/integrate`) · `:3320` · activity drain + ports stop dry-run  
**PREPROD LIVE:** **0.7.0** · `https://home-staging.delena.buzz` · `F:\apps\proddeck` · `:4320`  
**PROD LIVE:** **0.7.0** · `https://home.delena.buzz` · `G:\apps\proddeck` · `:5320`  
**Live pack:** `H:\releases\proddeck-0.7.0` · tag `v0.7.0`  
**Next:** [CLOUD-OS-0.8-PLAN.md](./CLOUD-OS-0.8-PLAN.md) — Wave A DEV only until pack + EM GO

**Repo:** https://github.com/sivaram311/proddeck · **clientId:** `proddeck`  
**Compatibility SoT:** [SUPPORTED-VERSIONS.md](./SUPPORTED-VERSIONS.md)

## Peers (must stay compatible — see matrix)

| Peer | Live F/G | Notes |
|------|----------|-------|
| Agent Portal | **0.1.8** (`:4080` / `:5080`) | os-events |
| AgentVerse classic | **0.3.17** (`:4310` / `:5310`) | densify + Desk |
| CSS | `https://css.delena.buzz` · `:5900` · `v0.1.0` | issuer bake mandatory |

## Isolation

Never stop AgentVerse v2 (`4311`/`5311`) or unrelated portal cutovers during ProdDeck/AV classic promote.

Session: `proddeck-keepers-quay-2026-07-14`.
