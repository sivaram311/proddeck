# Appliances

Config-driven fleet tiles. **Open** uses the public/local URL. Status probes are best-effort (CORS may show `?`).

Configured in [`src/os/modules/appliances/catalog.ts`](../../src/os/modules/appliances/catalog.ts) and mirrored in [`data/apps.registry.json`](../../data/apps.registry.json).

## AgentVerse peer URLs (0.8.4+)

| Tile | URL | Role |
|------|-----|------|
| AgentVerse | `https://agentverse.delena.buzz/` | Public short host → upgrade / Dispatch SoT (`:5312`) |
| **AgentVerse staging** | `https://agentverse-staging.delena.buzz/` | PREPROD **7-story densify** (`v0.3.15-unstable`, `:4310`) |
| AgentVerse v2 | `https://agentverse-v2.delena.buzz/` | stable-v2 industrial PROD (`:5311`) |
| **AgentVerse v2 staging** | `https://agentverse-v2-staging.delena.buzz/` | PREPROD industrial open-floor (`:4311`) |

Dispatch deep-links still default to **agentverse-upgrade** hosts — see [dispatch.md](./dispatch.md).
