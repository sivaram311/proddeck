# Dispatch — Cloud OS module

**Lane:** leftover 0.3.1 / Lane D · **Place:** Forge (Quay)

Dispatch builds **AgentVerse Desk deep links** from ProdDeck so an operator can hire a crew with a brief and land on the **upgrade** fleet (not classic `agentverse.delena.buzz`).

## UI

**Component:** `src/os/modules/dispatch/index.tsx` (`DispatchView`)

| Field | Purpose |
|-------|---------|
| **Crew** | `rajesh` · `karthik` · `lavanya` · `aravind` · `meenakshi` · `muthu` · `kabilan` |
| **Brief** | Textarea → `brief` query (URI-encoded via `URLSearchParams`) |
| **Intent** | `session-desk` \| `hire` |
| **Fleet** | Staging → `https://agentverse-upgrade-staging.delena.buzz` · Prod → `https://agentverse-upgrade.delena.buzz` |
| **Skills** | Optional comma list → `skills` |
| **Return URL** | Defaults to current ProdDeck origin (`home-staging` / `home` / local) |

Actions: **Open Desk** (primary, navigates) and **Copy link** (both ≥44px tap targets).

Open ProdDeck → Cloud OS → Forge → **Dispatch**.

## Deep-link contract

Aligned with AgentVerse `docs/DEEP-LINK-CONTRACT.md` on upgrade hosts:

```text
{UPGRADE_BASE}/desk?
  src=proddeck
  &crew=<persona id>
  &session=<optional uuid>
  &intent=session-desk|hire
  &brief=<plain UTF-8>
  &skills=<optional comma list>
  &return=<ProdDeck origin>
  &env=dev|preprod|prod
```

### `brief` encoding

Plain UTF-8 → `URLSearchParams.set("brief", text)` (single percent-encode).  
Do **not** pre-`encodeURIComponent` then `set`. Do **not** emit base64url as primary.  
Inbound decode prefers URI text; optional base64url fallback. See [`av-deeplink-contract.md`](./av-deeplink-contract.md).

### Fleet → host + `env`

| Toggle | Host | `env` (typical) |
|--------|------|-----------------|
| Staging | `https://agentverse-upgrade-staging.delena.buzz` | `preprod` (`dev` on localhost) |
| Prod | `https://agentverse-upgrade.delena.buzz` | `prod` |

Override all AgentVerse bases with `NEXT_PUBLIC_AGENTVERSE_URL` when set.

## Implementation

| Path | Role |
|------|------|
| `src/os/modules/dispatch/config.ts` | Crew list, upgrade hosts, return default |
| `src/os/modules/dispatch/build-url.ts` | Pure `/desk` URL builder |
| `src/os/modules/dispatch/index.tsx` | Mobile-friendly client UI |

## Smoke test

1. Cloud OS → Forge → Dispatch.
2. Pick crew + brief → preview shows upgrade host `/desk?...`.
3. Copy / Open → params include `src=proddeck`, `crew`, `intent`, `brief`, `return`, `env`.

```bash
npm run typecheck
```
