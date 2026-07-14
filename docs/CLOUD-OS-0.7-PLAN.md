# Cloud OS 0.7.0 train — **AMEND→GO** (safe subset)

**Session:** `proddeck-keepers-quay-2026-07-14`  
**Base:** `cloud-os/integrate` @ **0.6.2** live · tag `cloud-os-0.7-base`  
**Ship label:** **0.7.0 = safe subset** of roadmap §8.7 (not full live runners / Watch fabric / MyAgent auto-writer)

## Policy

- ACTIVITY-LOG **queue** (`.data/activity-queue.jsonl`) is staging only — never a waiver of CONSCIOUS #10.  
  Phone/API **must not** write `E:\MyAgent\workflow\activity\ACTIVITY-LOG.md`. Lead/EM drains approved rows serially.
- Portal: **no** runner/code train (0.1.8 events already live).
- Promote F/G only after EM GO + field-ops.

## Lanes

| Pri | Lane | Branch / wt | Owns | Done when |
|-----|------|-------------|------|-----------|
| 1 | Activity-log queue | `feat/os-alog-queue` · `E:\wt\proddeck-alog-queue` | `activity-log/**` + `POST/GET /api/os/activity-log` queue | Queue file + UI; SOP in `docs/os/activity-log.md` |
| 2 | Drive Guard CSS | `feat/os-drive-reauth` · `E:\wt\proddeck-drive-reauth` | `drive-guard/**` only (import `identity/cssSessionFresh`) | G/H/RELEASES unlock needs CSS freshness; **no IO** |
| 3 | Ports request-stop | `feat/os-ports-stop` · `E:\wt\proddeck-ports-stop` | `ports/**` | Mirror reserve: `dispatch.hire.requested` + `kind: ports.request_stop`; **no kill** |
| 4 | Yard skill registry | `feat/os-yard-skills` · `E:\wt\proddeck-yard-skills` | `yard/**` | Read-only skill/persona catalog panel |
| 5 | FileBridge list | `feat/os-filebridge-list` · `E:\wt\proddeck-fb-list` | `filebridge/**` + list API | Harden list; delete blocked/hard-fail; **no H: delete IO** |
| 6 | AV Desk 0.3.17 | `E:\wt\agentverse-0.3.17` from `v0.3.16` | Desk upgradation slices only | Sole writer; **no densify/Quay**; no F/G |

## Out

FileBridge delete IO · Drive Guard mutations · ports kill · live Portal runners · Quay densify · silent F/G · writing MyAgent ACTIVITY-LOG from phone

## Merge order (Lead)

drive-guard → ports → activity-log → filebridge → yard · then typecheck/smoke `:3320` · pack **0.7.0**  
AV tags separately.
