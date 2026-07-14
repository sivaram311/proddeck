# Promote module — Cloud OS Wave 1b

**Owner lane:** `feat/os-promote` · `src/os/modules/promote/**`

Phone-first Q1/Q2 evidence checklist and GO/HOLD decision record for ProdDeck promote crews. Does **not** execute deploy scripts.

## Scope (MVP)

| Feature | Status |
|---------|--------|
| Q1 / Q2 gate tabs | ✅ |
| Checklist: smoke, security notes, review, field-ops tip, evidence path | ✅ |
| Evidence path pattern `H:\releases\proddeck-*` | ✅ validated in UI |
| GO / HOLD decision record | ✅ localStorage |
| “Does not run deploy” banner | ✅ |
| API → `.data/promote-decisions.json` | ⏳ Wave 2 (localStorage preferred for Wave 1) |

## Checklist items

1. **Smoke** — smoke matrix complete for target gate.
2. **Security notes** — CSS/JWT/secrets scan filed under evidence.
3. **Review** — ports/DB/drive/diff compliance pass.
4. **Field-ops tip** — operator acknowledges `promote-field-ops` hire (`field-lessons.md`).
5. **Evidence path** — must match `H:\releases\proddeck-<version>\...` (e.g. `H:\releases\proddeck-0.4.0\evidence\q1\`).

**GO** is enabled only when all items are checked, the evidence path validates, **and** a CSS session freshness probe passes (`ensureFreshToken` + `verifySession` via identity `useCssSessionFresh` — not localStorage-only). When the session is not fresh, a **Re-auth** CTA opens Vault (`/?osPlace=vault`). **HOLD** always records (with optional note) and does not require re-auth.

## Decision object

Stored in `localStorage` key `proddeck.promote.decisions` (append-only array):

```json
{
  "gate": "Q1",
  "decision": "GO",
  "at": "2026-07-14T18:00:00.000Z",
  "actor": "em-stub",
  "note": "Evidence pack complete"
}
```

Checklist state per gate: `proddeck.promote.checklist.Q1` / `.Q2`.

## Touch targets

All interactive controls use **44px** minimum height (`min-h-11`) for Realme-class phones.

## Safety

- No writes to `F:\` or `G:\`.
- No deploy script invocation from this module.
- EM GO here is a **local record** until Portal events (`promote.decision`) and ops scripts are wired in a later wave.

## Related docs

- [OPS.md](../OPS.md) — ports, smoke, evidence paths
- [CLOUD-OS-ROADMAP.md](../CLOUD-OS-ROADMAP.md) — Promote place + Crew Fabric
- `E:\MyAgent\workflow\promote\` — skill pack + field lessons SoT
