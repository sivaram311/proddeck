# 03 - API Contracts

**Status:** GO 2026-07-14  
**Project:** ProdDeck

## Auth (CSS) — unchanged

Login / refresh / me / logout via `/api/css/...`, `clientId=proddeck`.  
Storage keys: `prodDeckAccessToken`, `prodDeckRefreshToken`, `prodDeckUser`.

## Catalog — unchanged

`GET /api/catalog` — Bearer required; JWKS verify `aud`/`client_id=proddeck`.

## Pack (new)

### `GET /api/pack`

- Auth: none (non-secret module flags + helpdesk categories only).
- Response: validated pack subset `{ appId, modules, helpdesk, scene }`.

## Helpdesk (new)

### `GET /api/helpdesk`

- Auth: Bearer (same JWKS gate as catalog).
- 200: `{ tickets: Ticket[] }`

### `POST /api/helpdesk`

- Auth: Bearer.
- Body: `{ title: string, category: string, body?: string }`
- 201: `{ ticket }`
- category must be in pack helpdesk categories.

### Ticket shape

```json
{
  "id": "uuid",
  "title": "string",
  "category": "string",
  "body": "string",
  "crewRole": "string",
  "status": "open",
  "createdAt": "ISO-8601",
  "createdBy": "username|unknown"
}
```

Missing Bearer → 401 `{ "error": "unauthorized", ... }` (same shape as catalog).
