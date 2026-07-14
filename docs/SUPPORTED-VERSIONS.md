# Supported / dependent versions

**SoT for fleet compatibility with ProdDeck Cloud OS.**  
Update this file whenever F/G pins or peer minimums change.

**Last checked:** 2026-07-15 · Session `proddeck-keepers-quay-2026-07-14`

## ProdDeck pin map

| Env | Version | Path / host | Port |
|-----|---------|-------------|------|
| DEV | **0.7.0** | `E:\wt\proddeck-integrate` · `cloud-os/integrate` | 3320 |
| PREPROD | **0.6.2** (live) | `F:\apps\proddeck` · home-staging.delena.buzz | 4320 |
| PROD | **0.6.2** (live) | `G:\apps\proddeck` · home.delena.buzz | 5320 |
| Pack ready | **0.7.0** | `H:\releases\proddeck-0.7.0` · tag `v0.7.0` | — |

## Peer apps (live F/G)

| App | PREPROD | PROD | Ports | Notes |
|-----|---------|------|-------|-------|
| **Agent Portal** | **0.1.8** | **0.1.8** | 4080 / 5080 | `POST /api/os-events` required for OS event forward |
| **AgentVerse classic** | **0.3.16** | **0.3.16** | 4310 / 5310 | Densify + `/desk` deep-link (URI brief) |
| **AgentVerse classic (packaged)** | **0.3.17** awaiting EM | same pack | — | Desk search/filter/cancel · `H:\releases\agentverse-0.3.17` · tag `v0.3.17` |
| **AgentVerse v2** | side fleet | side fleet | 4311 / 5311 | Independent; do not disturb on classic/ProdDeck promote |
| **CSS (prod IdP)** | shared | shared | 5900 · css.delena.buzz | Issuer bake mandatory on Next builds |

## Dependency matrix

### ProdDeck **0.6.2** (current F/G live)

| Depends on | Minimum | Why |
|------------|---------|-----|
| CSS | prod issuer `https://css.delena.buzz` · `clientId=proddeck` | Login + catalog JWT |
| Agent Portal | **≥ 0.1.8** | `OS_EVENTS_FORWARD=1` → `POST /api/os-events` |
| AgentVerse classic | **≥ 0.3.16** | Dispatch `/desk` URI brief + ProdDeck strip |
| `PLATFORM_APPS_URL` | F→`:4080` / G→`:5080` platform apps base | Event forward base strip |

### ProdDeck **0.7.0** (DEV + pack; promote pending)

Everything in **0.6.2**, plus:

| Feature | Peer / note |
|---------|-------------|
| Activity-log queue | Local `.data/activity-queue.jsonl` only — Lead drains to MyAgent |
| Drive Guard CSS gate | Same CSS freshness as Promote GO |
| Ports request-stop | Event-only; Portal still four event types |
| Yard skill registry | Read-only local catalog |
| FileBridge list | Jail under `H:\releases`; delete blocked |

**Recommended peers when promoting 0.7.0:** Portal **≥ 0.1.8**, AV classic **≥ 0.3.17** (Desk UX), CSS issuer bake unchanged.

### AgentVerse **0.3.16** (live) / **0.3.17** (packaged)

| Depends on | Minimum | Why |
|------------|---------|-----|
| CSS | `https://css.delena.buzz` baked | Session auth |
| Agent Portal | running PREPROD/PROD API | Session Desk / cancel / quests |
| ProdDeck Dispatch | **≥ 0.6.2** URI brief (not base64url-primary) | Deep-link land |

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
| `H:\releases\proddeck-0.6.2` | Live F/G |
| `H:\releases\proddeck-0.7.0` | Next promote |
| `H:\releases\agentverse-0.3.16` | Live classic baseline |
| `H:\releases\agentverse-0.3.17` | Next AV Desk promote |
| `H:\releases\agent-portal-0.1.8` | Live Portal + os-events |
