# Handoff — ProdDeck

**PROD / PREPROD / DEV:** **0.8.4** · IdP **css-next** `v0.2.1` (hybrid; Postgres `app_css` shared)
**Hosts:** https://home.delena.buzz · https://home-staging.delena.buzz · https://home-dev.delena.buzz  
**Repo tip:** `main` · tag `v0.8.4`  
**Release pack:** `H:\releases\proddeck-0.8.4`

## Auth

| Item | Value |
|------|--------|
| clientId | `proddeck` |
| Issuer | `https://css-next.delena.buzz` |
| BFF | `CSS_AUTH_URL=http://127.0.0.1:5910` (DEV may use public issuer URL) |
| Mode | `hybrid` |

Classic `css.delena.buzz` / `:5900` remains for other apps — not ProdDeck IdP in 0.8.4.

## Isolation

Do not kill non-ProdDeck ports. Cutover only `3320` / `4320` / `5320`.