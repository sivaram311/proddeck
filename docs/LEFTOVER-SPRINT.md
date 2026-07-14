# Sprint plan — ProdDeck 0.6 leftovers (fast close) — **AMENDED**

**Session:** `proddeck-keepers-quay-2026-07-14`  
**Base:** `cloud-os/integrate` @ live **0.6.0** (`E:\wt\proddeck-integrate`)  
**Goal:** Close **0.6 leftovers only** (not full 1.0). Ship as **0.6.1** hotfix train.  
**Cadence:** Plan → Grok AMEND → revised plan → Grok re-review → parallel lanes → Lead merge → DEV smoke (+ JWT) → evidence + promote-field-ops + EM GO → Q1/Q2.

**Grok review #1 (2026-07-15):** **AMEND** — drop FileBridge delete; AV = docs/stub only; cap parallel lanes; Portal = DEV-only; re-auth must probe CSS freshness; Grok GO ≠ EM waiver.

## In scope (0.6.1 must / should)

| Pri | Lane | Branch / worktree | Owns | MVP done when |
|-----|------|-------------------|------|---------------|
| 1 | Identity↔Promote re-auth | `feat/os-promote-reauth` · `E:\wt\proddeck-promote-reauth` | `identity/**` + `promote/**` | GO disabled until **CSS session freshness probe** passes; re-auth CTA via existing CSS + baked issuer |
| 2 | Yard hire tip + event | `feat/os-yard-hire` · `E:\wt\proddeck-yard-hire` | `yard/**` only | Field-ops tip; Hire emits `crew.fabric.spawned` + copies briefing; status still manual |
| 3 | Portal events (thin, DEV) | `feat/os-portal-events` · Portal on E: + ProdDeck forward | Portal accept+audit only on DEV; ProdDeck `OS_EVENTS_FORWARD` default-on DEV | Envelope accepted; audit row; **no 5080/4080 / F/G Portal cutover** |
| 4 | Ports reserve request | `feat/os-ports-reserve` · `E:\wt\proddeck-ports-reserve` | `ports/**` | “Request reserve” → event + copy JSON; **no bind / listen / kill** |
| 5 | Archive SSO + VERSION pin | `feat/os-archive-sso` · `E:\wt\proddeck-archive-sso` | `archive/**` | “Open in H-Drive (SSO)” deep-link; pin F/G VERSION; **read-only** (no deletes) |
| 6 | AV deep-link | ProdDeck docs + Dispatch stub only (same worktree as Lead or tiny branch) | ProdDeck Dispatch / docs only | Contract documented; “params received” stub UI; **AV issue filed — no AV repo edits** |

## Dropped / deferred (explicit)

| Item | Why |
|------|-----|
| **FileBridge H: delete** | CONSCIOUS #1 + archive SOP; typed confirm alone insufficient; risk to packs/evidence. Defer to 1.0 with realpath jail + CSS re-auth + audit |
| AV repo deep-link land | Protects 4310/4311/5310/5311; avoid thrash |
| Live Yard runners · Drive Guard G/H mutations · Ports kill · ACTIVITY-LOG writer · Quay densify · Full Portal worker orchestration | 1.0 |

## Lead-only (no parallel)

`DeckHome.tsx`, `src/os/shell/**`, `places.ts`, `registry.tsx`, ACTIVITY-LOG, F/G promote, SemVer bump, CSS issuer bake (`NEXT_PUBLIC_CSS_ISSUER=https://css.delena.buzz`), pack `0.6.1`

## Parallel management

```text
Wave L0  Lead: amend plan + ownership; tag leftover-sprint-base; shared stubs if needed
Wave L1  Hire in parallel (max 5): Pri1 re-auth · Pri2 yard · Pri3 portal(DEV) · Pri4 ports · Pri5 archive
         Pri6 AV docs/stub = Lead or tiny serial after L1
Wave L2  Lead merge → typecheck/build/smoke/JWT → pack 0.6.1
Wave L3  evidence under H:\releases\proddeck-0.6.1\evidence\ → hire promote-field-ops → EM GO → Q1+Q2
```

**Conflict rule:** one module path per lane. Shared util → Lead adds stub on base first.  
**ACTIVITY-LOG:** Lead only (field lesson #5).  
**Promote:** Grok GO is **not** EM waiver.

## Skill briefs (paste into each agent)

- Worktree only; Realme 44px touch; no F/G deploy; no ACTIVITY-LOG writes  
- CSS `clientId=proddeck`; bake issuer awareness in docs notes  
- Commit+push lane branch; leave merge to Lead  
- Per-lane `docs/os/*` note only if behavior changes

## Exit criteria

- All in-scope pri 1–5 DONE; pri 6 docs/stub DONE or filed  
- `typecheck` + `build` + pack smoke + catalog JWT with real CSS login  
- Docs HANDOFF/OPS + ACTIVITY-LOG (Lead)  
- Promote only after evidence + promote-field-ops + EM GO
