# Next parallel train — post-0.6.1 (AMEND→GO)

**Session:** `proddeck-keepers-quay-2026-07-14`  
**Grok:** AMEND→GO (2026-07-15) — AV WIP sole-writer; URI brief (no double-encode); Lead GET events before Yard/Watch; DEV-only ProdDeck; no AV/Portal F/G

## Encoding

- **ProdDeck emit:** plain text via `URLSearchParams.set` (no `encodeURIComponent` then set).
- **AV consume:** URI decode; also accept leftover **base64url**.
- Docs: `docs/os/av-deeplink-contract.md` + AV `DEEP-LINK-CONTRACT.md` one-liner.

## Lanes

| Pri | Lane | Notes |
|-----|------|--------|
| 1 | AV deep-link polish | Sole writer on `feature/upgradation-functionality` if dirty; **no** 4310/5310 |
| 2 | ProdDeck Dispatch URI align | `feat/os-dispatch-align` |
| 3 | Yard soft events tail | After Lead GET `/api/os/events`; `yard/**` UI only |
| 4 | Beacon last hire/promote tip | **Beacon** (not Watch); UI vs GET API |
| 5 | Portal os-events F/G scaffold | Docs/H: only — **no** 4080/5080 |

## Outs

FileBridge H delete · Drive Guard G/H mutations · ports kill · live Portal workers · AV/Portal F/G promote · Quay densify · silent ProdDeck F/G

## Cadence

L0 Lead GET + tag `next-parallel-base` · L1a pri2+pri5(+pri1) · L1b pri3+pri4 · L2 merge smoke `:3320` · L3 AV feature until user Q1
