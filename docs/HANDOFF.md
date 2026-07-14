# Handoff — ProdDeck

**PROD LIVE:** 0.4.0 · `https://home.delena.buzz` · `G:\apps\proddeck` · `:5320`  
**PREPROD LIVE:** 0.4.0 · `https://home-staging.delena.buzz` · `F:\apps\proddeck` · `:4320`  
**DEV:** `E:\MyWorkspace\sandbox\proddeck` · `:3320` · branch `cloud-os/scaffold` · pack **`0.5.0-scaffold`**  
**Repo:** https://github.com/sivaram311/proddeck  
**clientId:** `proddeck`  
**Release:** `H:\releases\proddeck-0.4.0` (Q1 + Q2 evidence) — F/G still 0.4.0; scaffold is DEV-only

## Read first

| Doc | Why |
|-----|-----|
| [WORLD.md](./WORLD.md) | Keepers' Quay — Call / Remember / Watch |
| [CLOUD-OS-ROADMAP.md](./CLOUD-OS-ROADMAP.md) | Phone cloud OS + **Crew Fabric** (parallel skill subagents) |
| [PARALLEL-EXECUTION-PLAN.md](./PARALLEL-EXECUTION-PLAN.md) | Wave 0→3 + worktrees |
| [OPS.md](./OPS.md) | Ports, smoke, promote |
| [DEPLOY.md](./DEPLOY.md) | Deploy notes (if present) |
| `agents/pre-work/CLOUD-OS-OWNERSHIP.md` | Wave 1 lane ownership |
| `agents/pre-work/CUTOVER-ROLLBACK.md` | ProdDeck-only cutover |
| `agents/pre-work/SCOPE-GO-keepers-quay-0.4.0.md` | Characters GO |

## Isolation

Never stop AgentVerse (`4310/4311/5310/5311`) or portal (`5080`) for ProdDeck work. Kill-by-port **only** `4320` / `5320` as appropriate.

## Now → next

| Now | Next |
|-----|------|
| Live F/G **0.4.0** Quay | Wave 1 module lanes off `cloud-os/scaffold-v1` |
| DEV **0.5.0-scaffold** Places shell + stub modules | Integrate → SemVer 0.5.0 → EM GO for promote |

Session: `proddeck-keepers-quay-2026-07-14`.
