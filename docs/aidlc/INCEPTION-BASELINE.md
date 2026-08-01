# AI-DLC Inception Baseline - proddeck

**Captured:** 2026-08-01 (as-is snapshot, not a target design)

## Purpose

ProdDeck is a CSS-gated **home / production app launcher** for this machine’s Keepers’ Quay experience: after login, a Keeper can **call** (open production apps), **remember** (leave helpdesk memory), and **watch** (see duty-roster crews). The same repo is evolving into a phone-first **cloud OS** Places shell for AI-operated VPS work; AgentVerse remains the separate crew work plane. Primary audience is operators/Keepers on this VPS stack (`clientId=proddeck`).

## Tech stack

Derived from `package.json` and related config (caret ranges as stated in the file):

| Layer | As stated in repo |
|-------|-------------------|
| Runtime / app | **Next.js** `^15.3.3` (App Router under `src/app`) |
| UI | **React** / **React DOM** `^19.1.0` |
| Language | **TypeScript** `^5.8.3` (`tsconfig.json`) |
| 3D | **three** `^0.185.1`, **@react-three/fiber** `^9.6.1`, **@react-three/drei** `^10.7.7` |
| Validation | **zod** `^3.25.76` (pack schema) |
| Auth JWT | **jose** `^5.10.0` (RS256 + remote JWKS) |
| CSS | **Tailwind CSS** `^4.1.8` via `@tailwindcss/postcss` `^4.1.8`, `postcss.config.mjs` |
| Lint | **eslint** `^9.27.0`, **eslint-config-next** `^15.3.3` |
| Fonts | Google fonts via `next/font`: Syne + DM Sans (`src/app/layout.tsx`) |
| Package identity | `name`: `proddeck`, `version`: **`0.5.0-scaffold`**, `private`: true |
| Scripts | `dev` / `start` bind `0.0.0.0:3320`; also `build`, `lint`, `typecheck`, `smoke` |

No `pom.xml` / Gradle / other backend framework found — this is a Node/Next.js app only.

## Current features (as-built)

**App surface**

- Single client route: `/` (`src/app/page.tsx`) — session bootstrap → CSS login or `DeckHome`.
- CSS login / refresh / logout via browser tokens (`prodDeckAccessToken` etc.) and proxy to IdP (`src/lib/auth.ts`, `LoginForm`).
- Post-auth home (`DeckHome`): Keepers’ Quay **WebGL scene** when pack `scene.pack=keepers-quay` and WebGL works; otherwise **flat catalog**. Scene includes pier walk, Manifest / Memory Shed / Watch Loft places, Answering Wake launch, Gate acknowledge, Watch Acknowledge loft ack, Keeper actions.
- Overlay panels: **catalog** (app tiles), **helpdesk** (ticket create/list), **crews** (pack `crews[]` watch roster).
- **Cloud OS Places shell** (pack `os.enabled`): nav for Quay, Control Tower, Forge, Yard, Archive, Watch, Remember, Vault; `DriveGuardChip` env selector (DEV/PREPROD/PROD/RELEASES labels only).
- Thirteen OS module views registered — each currently renders **`ModuleStub`** (placeholder copy only): pulse, ports, beacon, identity, activity-log, archive, dispatch, promote, yard, runbooks, appliances, drive-guard, filebridge.
- Fallback `StubScene` CSS-3D hub if a non–keepers-quay scene pack is configured.

**HTTP APIs (Next route handlers)**

| Method / path | Behavior |
|---------------|----------|
| `GET/POST /api/css/[...path]` | Proxies to `CSS_AUTH_URL` (default `http://127.0.0.1:9000`) |
| `GET /api/pack` | Public pack JSON from `packs/proddeck/app.json` (Zod-validated) |
| `GET /api/catalog` | Bearer JWT required; merges `data/apps.registry.json` with optional `PLATFORM_APPS_URL` |
| `GET/POST /api/helpdesk` | Bearer JWT required; list / create tickets (in-memory store) |

**Pack / catalog content (this tree)**

- Pack version **`0.5.0-scaffold`**, modules: catalog · helpdesk · scene · crewsDesk; scene pack `keepers-quay`; OS modules flagged on.
- Static registry apps include Agent Portal, CSS, H-Drive, Stack Pilot, AgentVerse (prod HTTPS URLs in `data/apps.registry.json`).
- Helpdesk categories from pack: ops, access, apps (with crew roles).
- Smoke script (`scripts/smoke.mjs`) checks `/` 200, catalog/helpdesk 401 without valid Bearer, pack version/os flags.
- Deploy wrapper `start.ps1` sets CSS/platform env and starts Next on env port from an `app\` layout (F/G deploy shape).

## Deploy topology (known facts below - cross-check against what you find in-repo, note any discrepancy explicitly rather than silently picking one)

**External known facts (prompt):** DEV `:3320` → `https://home-dev.delena.buzz`; PREPROD `:4320` → `https://home-staging.delena.buzz`; PROD `:5320` → `https://home.delena.buzz`; CSS-backed launcher.

**What this repo states (aligned unless noted):**

| Env | Port | Host / path in repo |
|-----|------|---------------------|
| DEV | `3320` | Local path `E:\MyWorkspace\sandbox\proddeck`; pack/README host `http://127.0.0.1:3320` — **no `home-dev.delena.buzz` string found** |
| PREPROD | `4320` | `https://home-staging.delena.buzz` · deploy path `F:\apps\proddeck` · docs say **LIVE 0.4.0** |
| PROD | `5320` | `https://home.delena.buzz` · deploy path `G:\apps\proddeck` · docs say **LIVE 0.4.0** |

**Discrepancy — DEV public URL:** Prompt maps DEV to `https://home-dev.delena.buzz`. In-repo sources (`README.md`, `docs/OPS.md`, `docs/DEPLOY.md`, `docs/HANDOFF.md`, `packs/proddeck/app.json` `hosts.dev`) describe DEV as local/`127.0.0.1:3320` only. Port `3320` matches.

**Discrepancy — version labels:** This working tree is branch/scaffold **`0.5.0-scaffold`** (`package.json`, pack, smoke expect). Docs simultaneously record PREPROD/PROD still on **0.4.0**; scaffold is documented as DEV-only, not promoted.

**CSS / auth (verified in source, matches “CSS-backed launcher”):**

- `clientId` / audience: **`proddeck`**
- Browser auth URL from `NEXT_PUBLIC_CSS_ISSUER` (dev default `http://localhost:9000`); server proxy + JWKS from `CSS_AUTH_URL` (dev `:9000`; PREPROD/PROD docs/start.ps1 use `:5900` and issuer `https://css.delena.buzz`)
- JWKS gate on `/api/catalog` and `/api/helpdesk` (`verifyProdDeckBearer` via `jose` + `/.well-known/jwks.json`)
- Optional catalog merge from Agent Portal `PLATFORM_APPS_URL`

## Known debt / gaps (as-is, factual)

- All Cloud OS module implementations under `src/os/modules/*` are **`ModuleStub` placeholders** (“Wave 1 owns …”); `DriveGuardChip` is display/soft warn only (“Hard gates land in Wave 1”).
- Helpdesk tickets stored **in-process memory** (`globalThis.__proddeckHelpdesk`) — not durable across restarts.
- **No** `*.test.*` / `*.spec.*` files found; only `scripts/smoke.mjs` as automated check.
- `docs/MOBILE-QA.md` checklist items are all unchecked (`[ ]`).
- Version/doc split: live F/G **0.4.0** vs DEV pack **0.5.0-scaffold**; README top table still headlines 0.4.0 while package/pack are scaffold.
- Roadmap / parallel-plan docs describe substantial unshipped Cloud OS epics (Pulse, Promote GO, Crew Fabric, etc.) — aspirational relative to stub UI; not listed as shipped features above.
- No `TODO`/`FIXME` markers found under `src/` via search; debt is expressed mainly as stubs and planning docs.

## Sources consulted

- `README.md`
- `package.json`
- `next.config.ts`
- `tsconfig.json`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `.env.example`
- `start.ps1`
- `scripts/smoke.mjs`
- `packs/proddeck/app.json`
- `data/apps.registry.json`
- `docs/DEPLOY.md`
- `docs/OPS.md`
- `docs/HANDOFF.md`
- `docs/WORLD.md`
- `docs/MOBILE-QA.md`
- `docs/CLOUD-OS-ROADMAP.md` (skim for aspirational vs shipped context)
- `docs/PARALLEL-EXECUTION-PLAN.md` (skim; version/isolation notes)
- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/api/catalog/route.ts`
- `src/app/api/helpdesk/route.ts`
- `src/app/api/pack/route.ts`
- `src/app/api/css/[...path]/route.ts`
- `src/lib/config.ts`
- `src/lib/auth.ts`
- `src/lib/jwt.ts`
- `src/lib/pack.ts`
- `src/helpdesk/store.ts`
- `src/components/DeckHome.tsx`
- `src/components/StubScene.tsx`
- `src/os/places.ts`
- `src/os/registry.tsx`
- `src/os/types.ts`
- `src/os/modules/_shared/ModuleStub.tsx`
- `src/os/modules/pulse/index.tsx` (representative stub)
- `src/os/shell/DriveGuardChip.tsx`
- Glob/search over `src/**/*` for routes, stubs, TODO/FIXME; search for `*.test.*` / `*.spec.*` (none)
