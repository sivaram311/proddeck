# Next parallel train — post-0.6.1 — **MERGED DEV**

**Session:** `proddeck-keepers-quay-2026-07-14`  
**Grok:** AMEND→GO · Tag `next-parallel-base` · Integrate tsc green  
**AV:** `feature/upgradation-functionality` @ `f5249ed` — **no** classic F/G deploy

## Landed

| Pri | Outcome |
|-----|---------|
| Lead | `GET /api/os/events` jsonl tail |
| 1 | AV dual brief decode + ProdDeck always-on strip |
| 2 | ProdDeck Dispatch URI-preferred brief |
| 3 | Yard soft fabric events mirror |
| 4 | Beacon last hire/promote tip |
| 5 | Portal F/G os-events cutover scaffold (docs only) |

## Pending promote (needs user GO)

- AgentVerse upgradation Q1/Q2 (`4310`/`5310`)
- Portal `POST /api/os-events` on `:4080`/`:5080`
- ProdDeck F/G pack for this train (optional hotfix) — currently DEV-only merge
