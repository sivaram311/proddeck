# AgentVerse deep-link contract (ProdDeck Dispatch)

**SoT (AV):** upgrade-host `docs/DEEP-LINK-CONTRACT.md`  
**ProdDeck producer:** `src/os/modules/dispatch/build-url.ts`

## Default hosts (upgrade fleet)

| Fleet | Host |
|-------|------|
| Staging | `https://agentverse-upgrade-staging.delena.buzz` |
| Prod | `https://agentverse-upgrade.delena.buzz` |

Classic `agentverse.delena.buzz` / `agentverse-staging.delena.buzz` are **not** Dispatch defaults.

## Canonical URL

```text
/desk?src=&crew=&session=&intent=&brief=&skills=&return=&env=
```

| Param | ProdDeck emit |
|-------|----------------|
| `src` | `proddeck` |
| `crew` | persona id (`rajesh` … `kabilan`) |
| `session` | optional Portal UUID |
| `intent` | `session-desk` \| `hire` |
| `brief` | plain UTF-8 via `URLSearchParams.set` (single percent-encode) |
| `skills` | optional comma list |
| `return` | ProdDeck origin (`home` / `home-staging` / local) |
| `env` | `dev` \| `preprod` \| `prod` |

## `brief` encoding (frozen)

1. **Emit:** plain UTF-8 → `url.searchParams.set("brief", text)`.
2. **Consume:** URI-decode first.
3. **Transition:** accept leftover **base64url** on inbound until old links age out.
