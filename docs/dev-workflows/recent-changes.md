---
sidebar_position: 5
title: "Recent Changes"
description: "Changelog of notable fixes and improvements (ESM, deploy, shared library)"
---

# Recent Changes

This page documents notable fixes and improvements applied across the FitNexa monorepo. Use it when debugging deploy or runtime issues, or when adding new code to the shared library.

## @fitnexa/shared – ESM and Node resolution

### Problem

Backend services (gateway, identity, gym, nutrition, content, squad, wizard) failed at runtime with:

- `ERR_MODULE_NOT_FOUND: Cannot find module '.../dist/types/gym'`
- `ERR_MODULE_NOT_FOUND: Cannot find module '.../dist/validation/base'`

Node ESM does **not** add file extensions automatically. Imports like `from './gym'` or `from './base'` in emitted `.js` files were not resolved to `./gym.js` / `./base.js`.

### Changes

1. **Relative imports must use `.js` in source**  
   All TypeScript files in `fitnexa-shared/src/` that use relative imports or re-exports now use the `.js` extension so the emitted JavaScript resolves at runtime:
   - `src/types/index.ts` – `export * from './gym.js'`, `from './dtos.js'`
   - `src/validation/index.ts` – all `export * from './*.js'` (base, auth, profiles, gym, products, nutrition, workout, social, onboarding, common, messaging, tracker, logging, gateway)
   - `src/services/authService.ts`, `gymService.ts`, `contentService.ts`, `nutritionService.ts` – `from '../api/apiClient.js'`, `from '../types/index.js'`
   - `src/components/ui/ImageUpload.tsx` – `from '../../index.browser.js'`
   - Other barrels and modules (server, config, middleware, interfaces, etc.) already used or were updated to use `.js`.

2. **Jest for tests**  
   Test files (`**/__tests__/**`) import without `.js` so Jest resolves `.ts` sources. In `jest.config.js`, `moduleNameMapper` was added so that when production code imports `'../errors/index.js'`, Jest resolves it to the `.ts` file:
   - `'^(\\.\\.?/.*)\\.js$': '$1'`

3. **JSON imports**  
   Imports of `.json` files (e.g. in `i18n/apiErrors.ts`) are left as-is; Node resolves them by extension.

### Rule for new code

When adding or editing files in `fitnexa-shared/src/`:

- Use **`.js`** in every relative import/export that targets a TypeScript file (e.g. `from './foo.js'`, `from '../bar/index.js'`).
- Do **not** add `.js` to imports of `.json` or to test-only imports if you rely on Jest resolving `.ts`; the `moduleNameMapper` above handles `.js` → source in tests.

---

## VPS deploy script – better logs

### Changes in `scripts/deploy-uat.sh`

- **Timestamps** – Every log line prefixed with `[YYYY-MM-DD HH:MM:SS]`.
- **Numbered steps** – Clear sections: Step 1/5 (Check configuration) through Step 5/5 (Gateway health check).
- **Logged paths** – Working directory, backend root, compose file path.
- **Cleanup** – Explicit step to remove conflicting static containers before `up`.
- **Status and health** – After a 30s wait, full `docker compose ps -a` and a warning if any container is unhealthy.
- **Per-service logs** – Last 30 lines of logs for each service (backend services plus loki, alloy, grafana when using the deploy compose file).
- **Gateway health check** – Polls `GATEWAY_URL/health` (default `http://localhost:3000`) before finishing.
- **Final summary** – “Deploy finished” with gateway URL and a reminder about VPS firewall (80/443).

The script is intended to run on the VPS (e.g. via GitHub Actions after unpacking the tarball). Compose file used: `fitnexa-backend/docker-compose.uat.deploy.yml` with `fitnexa-backend/.env.uat`.

---

## Backend – messaging-service and logging-service

### messaging-service

- **Dependency** – Removed `fitnexa-dev-environment` from `package.json` so the Docker build does not require the monorepo root; the service does not use it at runtime.
- **Dockerfile** – After `npm run build`, added a check: `RUN test -f dist/index.js || (echo "ERROR: dist/index.js not produced by build" && exit 1)` so the image build fails if the service build does not produce `dist/index.js`.

### logging-service

- **Dockerfile** – Same `dist/index.js` check after `npm run build` so a missing build output fails the image build instead of failing at container start.

If you see “Cannot find module '/app/service/dist/index.js'” in either service, rebuild the images without cache (e.g. `docker compose build --no-cache messaging-service logging-service`) so the build step runs with the current shared package and dependencies.

---

## Loki (observability)

- **Image** – Pinned to `grafana/loki:3.5.0` in deploy and observability compose files; 3.6.0+ removed busybox and broke the wget-based healthcheck.
- **Healthcheck** – Retries and `start_period` increased where needed so Loki can pass health before dependent services start.

---

## Quick reference

| Area | What was fixed / improved |
|------|---------------------------|
| **fitnexa-shared** | All relative imports use `.js` for ESM; Jest `moduleNameMapper` for `.js` in tests |
| **Deploy script** | Timestamps, steps 1/5–5/5, status, per-service logs, gateway health, unhealthy warning |
| **messaging-service** | Removed `fitnexa-dev-environment` dep; Dockerfile checks for `dist/index.js` |
| **logging-service** | Dockerfile checks for `dist/index.js` after build |
| **Loki** | Image 3.5.0; healthcheck tuning |

Related: [Monorepo Scripts](monorepo-scripts.md) · [UAT Setup](../infrastructure/uat-setup.md) · [@fitnexa/shared Overview](../shared/overview.md)
