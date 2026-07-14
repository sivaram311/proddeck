# Supported / dependent versions

**SoT for fleet compatibility with ProdDeck Cloud OS.**  
Update this file whenever F/G pins or peer minimums change.

**Last checked:** 2026-07-15 · Session `proddeck-keepers-quay-2026-07-14`

## ProdDeck pin map

| Env | Version | Path / host | Port |
|-----|---------|-------------|------|
| DEV | **0.8.0** | `E:\wt\proddeck-integrate` · `cloud-os/integrate` | 3320 |
| PREPROD | **0.8.0** (live) | `F:\apps\proddeck` · home-staging.delena.buzz | 4320 |
| PROD | **0.8.0** (live) | `G:\apps\proddeck` · home.delena.buzz | 5320 |
| Pack | **0.8.0** | `H:\releases\proddeck-0.8.0` · tag `v0.8.0` | — |

## Peer apps (live F/G)

| App | PREPROD | PROD | Ports | Notes |
|-----|---------|------|-------|-------|
| **Agent Portal** | **0.1.8** | **0.1.8** | 4080 / 5080 | `POST /api/os-events` required for OS event forward |
| **agentverse-upgrade** | **0.3.1** | **0.3.1** | 4312 / 5312 | **Dispatch peer SoT** · `agentverse-upgrade-staging.delena.buzz` / `agentverse-upgrade.delena.buzz` · `F:\apps\agentverse-upgrade` / `G:\apps\agentverse-upgrade` |
| **AgentVerse classic** | **0.3.17** | **0.3.17** | 4310 / 5310 | **Rollback only** — densify + `/desk`; **not** the ProdDeck Dispatch default |
| **AgentVerse v2** | side fleet | side fleet | 4311 / 5311 | Industrial / independent; **non-Dispatch**; do not disturb on upgrade/classic/ProdDeck promote |
| **CSS (prod IdP)** | shared | shared | 5900 · css.delena.buzz | Issuer bake mandatory on Next builds · `v0.1.0` |

**Dispatch peer SoT:** ProdDeck Cloud OS Dispatch deep-links target **agentverse-upgrade** (ports **4312/5312**), not classic densify (**4310/5310**).

## Dependency matrix

### ProdDeck **0.8.0** (current F/G live — Cloud OS Wave A)

Everything in **0.7.0**, plus:

| Feature | Behavior |
|---------|----------|
| Activity-log Lead drain | `POST /api/os/activity-log` `{op:"drain"}` · apply confirm `DRAIN_TO_MYAGENT` |
| Ports stop dry-run | `POST /api/os/ports/stop-dry-run` · deny-list critical · **no kill** |

| Depends on | Minimum | Why |
|------------|---------|-----|
| CSS | prod issuer `https://css.delena.buzz` · `clientId=proddeck` · tag `v0.1.0` | Login + catalog JWT |
| Agent Portal | **≥ 0.1.8** | `OS_EVENTS_FORWARD=1` → `POST /api/os-events` |
| **agentverse-upgrade** | **0.3.1** (live F/G) | **Dispatch peer SoT** — `/desk` URI brief + Desk UX on upgrade hosts |
| AgentVerse classic | **0.3.17** | Rollback / densify only — **not** Dispatch default |
| `PLATFORM_APPS_URL` | F→`:4080` / G→`:5080` platform apps base | Event forward base strip |

Still deferred (hard outs): FileBridge H: delete IO · Drive Guard mutations · ports kill · Portal runners · Quay densify mega — see [CLOUD-OS-0.8-PLAN.md](./CLOUD-OS-0.8-PLAN.md).

### agentverse-upgrade **0.3.1** (Dispatch peer SoT — live)

| Depends on | Minimum | Why |
|------------|---------|-----|
| CSS | `https://css.delena.buzz` baked · `v0.1.0` | Session auth |
| Agent Portal | **≥ 0.1.8** | Session Desk / cancel / quests |
| ProdDeck Dispatch | **≥ 0.6.2** URI `brief` (live **0.8.0**) | Deep-link land on upgrade fleet |

Hosts: staging `agentverse-upgrade-staging.delena.buzz` **:4312** · prod `agentverse-upgrade.delena.buzz` **:5312**.  
Pack: `H:\releases\agentverse-upgrade-0.3.1` · tag `v0.3.1`.  
Do **not** robocopy upgrade over classic densify (**4310/5310**).

### AgentVerse classic **0.3.17** (rollback / densify)

| Depends on | Minimum | Why |
|------------|---------|-----|
| CSS | `https://css.delena.buzz` baked · `v0.1.0` | Session auth |
| Agent Portal | **≥ 0.1.8** | Session Desk / cancel / quests |
| ProdDeck | **≥ 0.6.2** (live **0.8.0**) | Historical densify peer — **not** Dispatch SoT |

Keep classic F/G for rollback only. Dispatch must not default here.

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
| `H:\releases\proddeck-0.8.0` | Live F/G |
| `H:\releases\proddeck-0.7.0` | Previous |
| `H:\releases\agentverse-upgrade-0.3.1` | Live Dispatch peer (upgrade fleet) |
| `H:\releases\agentverse-0.3.17` | Live classic (rollback) |
| `H:\releases\agent-portal-0.1.8` | Live Portal + os-events |
| `H:\releases\css-0.1.0` | Shared IdP |
