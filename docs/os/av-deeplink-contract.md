# AgentVerse deep-link contract (ProdDeck Dispatch)

**Sprint:** 0.6.1 leftovers · **AV repo edits:** deferred (protect live 4310/4311/5310/5311)

## Producer (ProdDeck)

`buildDispatchUrl` → AgentVerse Desk:

| Param | Value |
|-------|--------|
| path | `/desk` |
| `src` | `proddeck` |
| `intent` | `session-desk` |
| `brief` | base64url UTF-8 mission title |
| `return` | operator return URL (optional) |
| `env` | `dev` \| `preprod` \| `prod` |

Portal hire links use `/` + `intent=hire` (same `src`/`brief`/`return`/`env`).

## Consumer status

| App | Status |
|-----|--------|
| **ProdDeck Dispatch** | Builder + “params received” stub when returning with query params (0.6.1) |
| **AgentVerse Desk** | **Not implemented this sprint** — file/track issue to honor params on `/desk` |

## Expected AV landing (file for later)

1. Parse `src`, `intent`, `brief`, `return`, `env`
2. Decode `brief` → mission title in Desk header / new-session seed
3. Show clear UI if `src=proddeck` even when brief empty: “ProdDeck dispatch params received”
4. Optional: return CTA using `return`

Until AV lands this, operators copy/open the Dispatch URL and paste context manually.
