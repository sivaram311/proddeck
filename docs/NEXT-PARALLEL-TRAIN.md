# Next parallel train — post-0.6.1 (Cloud OS ↔ AV interlocking)

**Session:** `proddeck-keepers-quay-2026-07-14`  
**Trigger:** User proceed with parallel workers after 0.6.1 live  
**Goal:** Close integration gaps + start 0.7 interlocking — **no F/G kill of AV classic** without later promote GO

## Encoding conflict (fix first)

| Side | `brief` today |
|------|----------------|
| ProdDeck `buildDispatchUrl` | **base64url** UTF-8 |
| AgentVerse `DEEP-LINK-CONTRACT` / `session-share` | **URL-encoded** plain text |

**Decision (Lead):** AV accepts **both** (try URI decode, then base64url). ProdDeck additionally emit URI-encoded plain (preferred by frozen AV contract) — dual-compatible during transition.

## In scope (parallel)

| Pri | Lane | Tree / branch | Owns | Done when |
|-----|------|---------------|------|-----------|
| 1 | AV deep-link land polish | `agentverse-project` `feature/upgradation-functionality` | desk parse + IncidentStrip + docs | `src=proddeck` lands Desk; dual brief decode; return CTA; **no :4310/:5310 deploy** |
| 2 | ProdDeck Dispatch contract align | `E:\wt\proddeck-dispatch-align` from integrate | `dispatch/**` + `docs/os/av-deeplink*` | Matches AV contract (URI brief); keeps return/env; stub unchanged |
| 3 | Yard events tail (soft runners) | `E:\wt\proddeck-yard-events` | `yard/**` only | Read `.data/os-events.jsonl` tail via API; show last `crew.fabric.*` on lane/pack (read-only) |
| 4 | Watch / Beacon hire mirror tip | `E:\wt\proddeck-watch-mirror` | beacon or watch-related OS module only | Surface last promote/hire event timestamp (read-only) |
| 5 | Portal os-events promote pack (docs+evidence scaffold) | Portal E: docs only | `docs/OPS.md` + evidence scaffold under H: | Checklist for later F/G Portal cutover — **no 4080/5080 restart this train** |

## Explicit out

FileBridge H: delete · Drive Guard G/H mutations · ports kill · live Portal worker spawn · AV F/G promote · Quay densify

## Management

```text
L0  Lead: write plan · Grok gate · tag next-parallel-base on ProdDeck
L1  Hire pri1–4 in parallel; pri5 docs Lead or serial
L2  Merge ProdDeck lanes → typecheck/smoke DEV
L3  AV stays on feature branch until user Q1
```
