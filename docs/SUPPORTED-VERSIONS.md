# Supported / dependent versions

**SoT for fleet compatibility with ProdDeck Cloud OS.**  
Update this file whenever F/G pins or peer minimums change.

**Last checked:** 2026-07-17 · ProdDeck **1.0.0** LIVE on F/G · tag `v1.0.0`

## ProdDeck pin map

| Env | Version | Path / host | Port |
|-----|---------|-------------|------|
| DEV | **1.0.0** | `E:\wt\proddeck-main-081` · tag `v1.0.0` · css-next hybrid | 3320 |
| PREPROD | **1.0.0** | `F:\apps\proddeck` · home-staging | 4320 |
| PROD | **1.0.0** | `G:\apps\proddeck` · home | 5320 |
| Pack | **1.0.0** | `H:\releases\proddeck-1.0.0` · `v1.0.0` · `release/1.0.0` | — |
| Rollback | **0.8.4** | `H:\releases\proddeck-0.8.4` | — |

## Peer apps (live F/G)

| App | PREPROD | PROD | Ports | Notes |
|-----|---------|------|-------|-------|
| **Agent Portal** | **0.1.8** | **0.1.8** | 4080 / 5080 | `POST /api/os-events` |
| **agentverse-upgrade** | **0.3.1** | **0.3.1** | 4312 / 5312 | **Dispatch peer SoT** |
| **AgentVerse classic** | **0.3.15** | **0.3.17** | 4310 / 5310 | Not Dispatch default |
| **AgentVerse v2** | **0.4.3** | **0.4.3** | 4311 / 5311 | Industrial |
| **css-next** | shared | shared | 5910 | ProdDeck IdP hybrid `v0.2.1` |

## Hard-out flags (1.0.0 live)

Default **OFF** on F/G: `OS_FILEBRIDGE_DELETE` · `OS_DRIVE_GUARD_MUTATE` · `OS_PORTS_STOP_KILL` · `OS_YARD_LIVE_RUNNERS`.

## Dependency matrix (1.0.0 live)

| Depends on | Minimum | Why |
|------------|---------|-----|
| css-next | `v0.2.1` hybrid · `clientId=proddeck` | Login + catalog JWT |
| Agent Portal | **≥ 0.1.8** | OS events / fabric |
| **agentverse-upgrade** | **0.3.1** | Dispatch peer SoT |
