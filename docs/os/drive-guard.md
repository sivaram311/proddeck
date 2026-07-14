# Drive Guard

`requireEnvConfirm(env, typed, action, cssFresh?)` — PROD / RELEASES require:

1. A **fresh CSS session** (`probeCssSessionFresh` / `useCssSessionFresh` from identity — same probe as Promote GO).
2. Typing `PROD` / `RELEASES`.

When the session is not fresh, the chip UI shows a **Re-auth** CTA (Vault `/?osPlace=vault`) and blocks **Test gate** / unlock. DEV / PREPROD stay soft-warn only.

**No disk IO** — gate UX only; never partitions, mass-delete, or mutate G:/H:/RELEASES from this module. Shell chip remains display; Promote/Yard consumers import `confirm.ts`.
