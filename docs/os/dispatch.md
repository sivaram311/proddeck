# Dispatch — Cloud OS module

**Lane:** `feat/os-dispatch` · **Place:** Forge (Quay)

Dispatch builds **Session Desk–style deep links** from ProdDeck so an operator can send mission context to AgentVerse (primary), Agent Portal, or back to ProdDeck — without Portal API calls in Wave 1.

## UI

**Component:** `src/os/modules/dispatch/index.tsx` (`DispatchView`)

| Field | Purpose |
|-------|---------|
| **Target app** | `agentverse` · `proddeck` · `portal` |
| **Mission title** | Human-readable brief; encoded into `brief` query param |
| **Return URL** | Defaults to current pack host (`window.location.origin`) or prod pack host |

Actions: **Copy link** and **Open** (both ≥44px tap targets). Link preview updates live.

Open ProdDeck → Cloud OS → Forge → **Dispatch**.

## Deep-link contract (Wave 1 assumptions)

ProdDeck is always the **producer** (`src=proddeck`). Targets use a shared param vocabulary aligned with [`CLOUD-OS-ROADMAP.md`](../CLOUD-OS-ROADMAP.md) §6. **Consumers do not fully land these links until Wave 2** (AgentVerse classic + Portal stubs).

### `brief` encoding

Mission title → UTF-8 → standard base64 → base64url (`+` → `-`, `/` → `_`, strip `=`).

### AgentVerse (primary)

```text
{AGENTVERSE_BASE}/desk?
  src=proddeck
  &intent=session-desk
  &brief=<base64url mission title>
  &return=<return URL>
  &env=dev|preprod|prod
```

**Assumption:** AgentVerse classic Session Desk will read these params on `/desk` and pre-fill hire/brief UI (Wave 2: `agentverse-project`).

### Agent Portal

```text
{PORTAL_BASE}/?
  src=proddeck
  &intent=hire
  &brief=<base64url mission title>
  &return=<return URL>
  &env=dev|preprod|prod
```

**Assumption:** Portal will accept hire intent at root with the same brief/return contract (Wave 2).

### ProdDeck (self)

```text
{PRODDECK_BASE}/?
  src=proddeck
  &intent=dispatch
  &place=forge
  &module=dispatch
  &brief=<base64url mission title>
  &return=<return URL>
  &env=dev|preprod|prod
```

**Assumption:** Future Places router may honor `place` + `module` + `brief` for in-app navigation; Wave 1 only builds the URL.

## Base URL resolution

| Target | Env override | Default (this machine) |
|--------|--------------|------------------------|
| AgentVerse | `NEXT_PUBLIC_AGENTVERSE_URL` | `https://agentverse.delena.buzz` |
| ProdDeck | `NEXT_PUBLIC_PRODDECK_URL` | `https://home.delena.buzz` |
| Agent Portal | `NEXT_PUBLIC_AGENT_PORTAL_URL` | `https://agent-portal.delena.buzz` |

Trailing slashes are stripped. No new listen ports are introduced.

### Default return URL

1. Browser: `window.location.origin` (DEV `:3320`, staging, or prod pack host).
2. SSR fallback from pack hosts: `http://127.0.0.1:3320` · `https://home-staging.delena.buzz` · `https://home.delena.buzz`.

### `env` query param

Derived from hostname: `localhost` / `127.0.0.1` → `dev`; `*staging*` → `preprod`; else `prod`.

## Implementation

| Path | Role |
|------|------|
| `src/os/modules/dispatch/config.ts` | Target labels, base URLs, return default |
| `src/os/modules/dispatch/build-url.ts` | Pure URL builder + `brief` encoder |
| `src/os/modules/dispatch/index.tsx` | Client UI |

## Out of scope (Wave 1)

- Portal API / `dispatch.hire.requested` events
- Persona/crew picker from `E:\machine-docs\personas\`
- AgentVerse v2 host (`agentverse-v2.delena.buzz`) — classic only in defaults

## Smoke test

With dev server on `:3320`:

1. Cloud OS → Forge → Dispatch.
2. Enter mission title → preview shows `/desk?...` for AgentVerse.
3. Copy link → paste in notepad; params include `src=proddeck`, `brief`, `return`, `env`.
4. Open → new tab navigates to AgentVerse `/desk?...` (landing behavior is Wave 2).

```bash
npm run typecheck
```
