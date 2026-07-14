# Identity (Vault)

**Place:** Vault · **Module id:** `identity` · **Branch:** `feat/os-identity`

## Purpose

Phone-first CSS session awareness for ProdDeck Cloud OS. Shows the active `proddeck` JWT session (subject, expiry), clears local tokens on sign-out, and exposes stub hooks for shell re-auth wiring.

## UI

| Surface | Path |
|---------|------|
| Vault session strip | `src/os/modules/identity/VaultSessionStrip.tsx` |
| CSS session probe (shared) | `src/os/modules/identity/cssSessionFresh.ts` — `probeCssSessionFresh` / `useCssSessionFresh` |
| Module entry | `src/os/modules/identity/index.tsx` |

Promote’s GO gate imports the shared probe so re-auth is Identity↔Promote wired (CSS probe, not localStorage-only).

### Session strip fields

- **clientId** — always `proddeck` (`AUTH_CONFIG` in `src/lib/config.ts`)
- **Session** — `active` / `signed out` after `ensureFreshToken` + `verifySession`
- **Subject** — stored username or JWT `sub`
- **Expires** — access token `exp` when session is active

### Actions

| Control | Behavior |
|---------|----------|
| **Sign out** | `clearTokens()` (proddeck localStorage keys); optional `onSignOut` callback |
| **Re-auth** | Optional `onReAuth` callback; default navigates to Vault (`/?osPlace=vault`) via `openCssReAuth` |

## Auth integration

Reuses existing client libs — no new IdP or `clientId`:

- `AUTH_CONFIG` — `src/lib/config.ts`
- `ensureFreshToken`, `verifySession`, `clearTokens`, `getStoredUser` — `src/lib/auth.ts`

No dedicated `/api/os/identity` route in Wave 1; session probe runs client-side via CSS proxy (`/api/css`).

## Realme / mobile

- Touch targets ≥ 44px (`min-h-11`, `touch-manipulation`)
- Scrollable place panel only — no pointer-lock
- Tap-first layout; subject row truncates on narrow widths

## Wave 1 MVP checklist

- [x] Replace `ModuleStub` with Vault session strip
- [x] Show `clientId` proddeck and session state
- [x] Sign-out clears local tokens
- [x] Re-auth hook stub + optional callbacks
- [ ] Shell wires `onSignOut` / `onReAuth` to Quay login (future)

## Forbidden (this lane)

- `DeckHome.tsx`, shell, places, registry, other `os/modules/*`
- New IdP or non-`proddeck` `clientId`
- F:/G: deploy or ACTIVITY-LOG writes
