# AgentVerse deep-link contract (ProdDeck Dispatch)

**Sprint:** next-parallel train (Grok AMEND→GO) · **AV repo edits:** deferred (protect live 4310/4311/5310/5311)

## Producer (ProdDeck)

`buildDispatchUrl` → AgentVerse Desk:

| Param | Value |
|-------|--------|
| path | `/desk` |
| `src` | `proddeck` |
| `intent` | `session-desk` |
| `brief` | **plain UTF-8 mission title** via `URLSearchParams.set('brief', text)` — single percent-encode only; do **not** `encodeURIComponent` then `set` (double-encode); do **not** emit base64url as primary |
| `return` | operator return URL (optional) |
| `env` | `dev` \| `preprod` \| `prod` |

Portal hire links use `/` + `intent=hire` (same `src`/`brief`/`return`/`env`).

## `brief` encoding (frozen)

1. **Emit (ProdDeck):** plain UTF-8 text → `url.searchParams.set("brief", title)`.
2. **Consume (AV / inbound stubs):** URI-decode first (`URLSearchParams.get` / equivalent).
3. **Transition:** AV (and ProdDeck “params received”) **accept both** URI text and leftover **base64url** payloads until old links age out. URI text is preferred when ambiguous.

## Consumer status

| App | Status |
|-----|--------|
| **ProdDeck Dispatch** | Builder emits URI brief; inbound stub prefers URI text, optional base64url fallback |
| **AgentVerse Desk** | **Not implemented this sprint** — file/track issue to honor params on `/desk` (URI + legacy base64url) |

## Expected AV landing (file for later)

1. Parse `src`, `intent`, `brief`, `return`, `env`
2. Decode `brief` → mission title (URI text preferred; try base64url for old links)
3. Show clear UI if `src=proddeck` even when brief empty: “ProdDeck dispatch params received”
4. Optional: return CTA using `return`

Until AV lands this, operators copy/open the Dispatch URL and paste context manually.
