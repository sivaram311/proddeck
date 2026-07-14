# Supported / dependent versions

**SoT for fleet compatibility with ProdDeck Cloud OS.**  
Update this file whenever F/G pins or peer minimums change.

**Last checked:** 2026-07-15 · Session `proddeck-keepers-quay-2026-07-14`

## ProdDeck pin map

| Env | Version | Path / host | Port |
|-----|---------|-------------|------|
| DEV | **0.7.0** | `E:\wt\proddeck-integrate` · `cloud-os/integrate` | 3320 |
| PREPROD | **0.7.0** (live) | `F:\apps\proddeck` · home-staging.delena.buzz | 4320 |
| PROD | **0.7.0** (live) | `G:\apps\proddeck` · home.delena.buzz | 5320 |
| Pack | **0.7.0** | `H:\releases\proddeck-0.7.0` · tag `v0.7.0` | — |

## Peer apps (live F/G)

| App | PREPROD | PROD | Ports | Notes |
|-----|---------|------|-------|-------|
| **Agent Portal** | **0.1.8** | **0.1.8** | 4080 / 5080 | `POST /api/os-events` required for OS event forward |
| **AgentVerse classic** | **0.3.17** | **0.3.17** | 4310 / 5310 | Densify + `/desk` + Desk upgradation UX |
| **AgentVerse v2** | side fleet | side fleet | 4311 / 5311 | Independent; do not disturb on classic/ProdDeck promote |
| **CSS (prod IdP)** | shared | shared | 5900 · css.delena.buzz | Issuer bake mandatory on Next builds · `v0.1.0` |

## Dependency matrix

### ProdDeck **0.7.0** (current F/G live)

| Depends on | Minimum | Why |
|------------|---------|-----|
| CSS | prod issuer `https://css.delena.buzz` · `clientId=proddeck` · tag `v0.1.0` | Login + catalog JWT |
| Agent Portal | **≥ 0.1.8** | `OS_EVENTS_FORWARD=1` → `POST /api/os-events` |
| AgentVerse classic | **≥ 0.3.16** (live **0.3.17**) | Dispatch `/desk` URI brief + Desk UX |
| `PLATFORM_APPS_URL` | F→`:4080` / G→`:5080` platform apps base | Event forward base strip |

0.7 safe-subset features (local activity queue, Drive Guard CSS gate, ports request-stop events, Yard skill registry, FileBridge list jail / delete blocked) — see [CLOUD-OS-0.7-PLAN.md](./CLOUD-OS-0.7-PLAN.md).

### AgentVerse **0.3.17** (live)

| Depends on | Minimum | Why |
|------------|---------|-----|
| CSS | `https://css.delena.buzz` baked · `v0.1.0` | Session auth |
| Agent Portal | **≥ 0.1.8** | Session Desk / cancel / quests |
| ProdDeck Dispatch | **≥ 0.6.2** URI `brief` (live **0.7.0**) | Deep-link land |

Do **not** deploy `feature/upgradation-functionality` over densify F/G (diverged history / side ports 4312/5312).

### Agent Portal **0.1.8**

| Provides | Consumers |
|----------|-----------|
| `POST /api/os-events` | ProdDeck ≥ 0.6.2 with `OS_EVENTS_FORWARD=1` |
| Sessions API | AgentVerse Desk ≥ 0.3.16 |

## Runtime stack (ProdDeck build)

| Package / runtime | Supported |
|-------------------|-----------|
| Node | 20+ (machine current) |
| Next.js | 15.x |
| React | 19.x |
| CSS JWT | jose · issuer + aud/`clientId` check |

## Releases on H:

| Pack | Role |
|------|------|
| `H:\releases\proddeck-0.7.0` | Live F/G |
| `H:\releases\proddeck-0.6.2` | Previous |
| `H:\releases\agentverse-0.3.17` | Live classic |
| `H:\releases\agentverse-0.3.16` | Previous classic |
| `H:\releases\agent-portal-0.1.8` | Live Portal + os-events |
| `H:\releases\css-0.1.0` | Shared IdP |
