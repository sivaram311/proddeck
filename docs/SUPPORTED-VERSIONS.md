# Supported / dependent versions

**SoT for fleet compatibility with ProdDeck Cloud OS.**  
Update this file whenever F/G pins or peer minimums change.

**Last checked:** 2026-07-15 Â· Session `css-api-migrate-wave-2026-07-15` / css-migrate 0.8.2

## ProdDeck pin map

| Env | Version | Path / host | Port |
|-----|---------|-------------|------|
| DEV | **0.8.2** | `E:\wt\proddeck-integrate` Â· css-next hybrid | 3320 |
| PREPROD | **0.8.2** (cutover) | `F:\apps\proddeck` Â· home-staging Â· IdP css-next | 4320 |
| PROD | **0.8.2** (cutover) | `G:\apps\proddeck` Â· home Â· IdP css-next | 5320 |
| Pack | **0.8.2** | `H:\releases\proddeck-0.8.2` Â· tag `v0.8.2` | â€” |
| Rollback | **0.8.0** | `H:\releases\proddeck-0.8.0` Â· classic CSS | â€” |

## Peer apps (live F/G)

| App | PREPROD | PROD | Ports | Notes |
|-----|---------|------|-------|-------|
| **Agent Portal** | **0.1.8** | **0.1.8** | 4080 / 5080 | `POST /api/os-events` required for OS event forward |
| **agentverse-upgrade** | **0.3.1** | **0.3.1** | 4312 / 5312 | **Dispatch peer SoT** Â· upgrade-staging / upgrade hosts |
| **AgentVerse classic** | **0.3.17** | **0.3.17** | 4310 / 5310 | **Rollback only** â€” densify + `/desk`; **not** Dispatch default |
| **AgentVerse v2** | side fleet | side fleet | 4311 / 5311 | Industrial / independent; do not disturb |
| **CSS (prod IdP)** | shared | shared | 5900 Â· css.delena.buzz | Issuer bake Â· `v0.1.0` |

**Dispatch peer SoT:** ProdDeck Dispatch deep-links target **agentverse-upgrade** (**4312/5312**), not classic densify (**4310/5310**).

## Dependency matrix

### ProdDeck **0.8.0** (current F/G live) / **0.8.1** (pack ready)

Wave A features: activity-log Lead drain Â· ports stop dry-run Â· Device Lab E2E.

| Depends on | Minimum | Why |
|------------|---------|-----|
| CSS | `https://css.delena.buzz` Â· `clientId=proddeck` Â· tag `v0.1.0` | Login + catalog JWT |
| Agent Portal | **â‰¥ 0.1.8** | `OS_EVENTS_FORWARD=1` |
| **agentverse-upgrade** | **0.3.1** | **Dispatch peer SoT** |
| AgentVerse classic | **0.3.17** | Rollback only |

### agentverse-upgrade **0.3.1** (Dispatch peer SoT â€” live)

| Depends on | Minimum | Why |
|------------|---------|-----|
| CSS | `v0.1.0` baked | Session auth |
| Agent Portal | **â‰¥ 0.1.8** | Desk / cancel / quests |
| ProdDeck Dispatch | **â‰¥ 0.6.2** URI `brief` (live **0.8.0**) | Deep-link land |

Do **not** robocopy upgrade over classic densify (**4310/5310**).

### AgentVerse classic **0.3.17** (rollback / densify)

Keep F/G for rollback only. Dispatch must not default here.

### Agent Portal **0.1.8**

| Provides | Consumers |
|----------|-----------|
| `POST /api/os-events` | ProdDeck â‰¥ 0.6.2 |
| Sessions API | AgentVerse Desk â‰¥ 0.3.16 |

## Releases on H:

| Pack | Role |
|------|------|
| `H:\releases\proddeck-0.8.1` | Next promote (Phase B) |
| `H:\releases\proddeck-0.8.0` | Live F/G |
| `H:\releases\agentverse-upgrade-0.3.1` | Live Dispatch peer |
| `H:\releases\agentverse-0.3.17` | Live classic rollback |
| `H:\releases\agent-portal-0.1.8` | Live Portal |
| `H:\releases\css-0.1.0` | Classic IdP |
