# Portal / OS events (ProdDeck contract)

**Ship:** 0.6.0 · `POST /api/os/events`

## Envelope

```json
{
  "type": "dispatch.hire.requested | promote.decision | crew.fabric.spawned | crew.fabric.lane.done",
  "env": "dev|preprod|prod",
  "actor": "proddeck",
  "payload": {}
}
```

Server stamps `at`, appends `.data/os-events.jsonl` (gitignored). Soft forward when `OS_EVENTS_FORWARD=1`.

Agent Portal consumer endpoint is not required for 0.6 — ProdDeck is SoT queue until Portal lane exists.
