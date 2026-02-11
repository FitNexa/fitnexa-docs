# FitNexa Architecture Review

This document summarizes an architecture review of the FitNexa monorepo and highlights problems and recommendations.

---

## 1. Overview

- **fitnexa-shared**: Types, DTOs, config (environment + config-manager), API client, services, middleware, bootstrap.
- **fitnexa-mobile**: Expo/React Native app; uses shared **types**, **config (environment only)**, **api** (for configuration), **lib/utils**.
- **fitnexa-backend**: Gateway + microservices; use shared **ConfigManager**, **middleware**, **bootstrap**, **types**.

---

## 2. Issues Found

### 2.1 **AuthContext drops `gymId` on register (bug)**

- **Where:** `fitnexa-mobile/src/context/AuthContext.tsx`
- **What:** `register(email, password, name, gymId?)` receives `gymId` but calls `service.register(email, password, name)` and never passes `gymId`.
- **Impact:** Registration from the app never sends the selected gym to the backend, even though the UI and `authService` support it.
- **Fix:** Call `service.register(email, password, name, gymId)` in `AuthContext.register`.

### 2.2 **Duplicate / dead API client in mobile**

- **Where:** `fitnexa-mobile/src/services/apiClient.ts` vs `fitnexa-mobile/src/services/api.ts`
- **What:**  
  - **api.ts** defines a full `ApiClient` (auth headers, token refresh, 401 handling) and exports `identityApi`, `gymApi`, etc. All app code uses these.  
  - **apiClient.ts** configures and re-exports `@fitnexa/shared`’s `ApiClient` (no auth/refresh). Nothing in the app imports from `apiClient.ts`.
- **Impact:** Dead code, confusion (e.g. comments in `nutritionService.ts` referring to “apiClient” and “upload” on the wrong client), and two parallel HTTP abstractions.
- **Fix:** Remove `apiClient.ts` and any references, or clearly document that only `api.ts` is used and that shared `ApiClient` is for non-mobile use. Prefer a single client (e.g. keep `api.ts` and stop re-exporting shared `ApiClient` in mobile).

### 2.3 **@fitnexa/shared main entry is backend-heavy**

- **Where:** `fitnexa-shared/src/index.ts`
- **What:** The default package entry exports:
  - `config-manager` (Node: `dotenv`, `path`, `process.exit`)
  - `bootstrap` (Express, `ConfigManager`)
  - `middleware` (Express)
  - `test/test-utils`
  - `utils/auth` (likely JWT/Node)
- **Impact:** Any consumer that does `import … from '@fitnexa/shared'` (barrel) pulls in Node/Express. Mobile and admin currently use **subpaths only** (`@fitnexa/shared/types`, `@fitnexa/shared/config`, etc.), so they are safe today, but the default entry is fragile and easy to misuse.
- **Fix:**  
  - Prefer not exporting backend-only modules from the main entry.  
  - Add a dedicated server entry, e.g. `@fitnexa/shared/server` or `@fitnexa/shared/node`, that exports `ConfigManager`, `createBaseService`, middleware, and other Node-only code.  
  - Keep the default entry (and/or `index.browser.ts`) for types, environment config, and platform-agnostic API client only.

### 2.4 **Config-manager is Node-only but lives next to environment**

- **Where:** `fitnexa-shared/src/config/config-manager.ts` and `environment.ts` in the same folder.
- **What:** `config-manager` uses `dotenv`, `path`, `process.env`, `process.exit`, and Zod. It is only appropriate for Node services. `environment.ts` is platform-agnostic (in-memory config).
- **Impact:** Low if no client ever imports `config-manager` (and they shouldn’t). The package already exposes only `./config` → `environment.js` in `exports`, so mobile/admin using `@fitnexa/shared/config` are fine. Risk is from barrel imports (see 2.3).
- **Fix:** Move `config-manager` (and any other Node-only config) under a `server/` or `node/` subpath and export it only from the server entry. Keep `config/` for environment and other shared config.

### 2.5 **Shared auth service interface vs mobile implementation**

- **Where:** `fitnexa-shared/src/services/authService.ts` defines `AuthServiceInterface` and uses shared `ApiClient` with endpoints like `/api/identity/login`. Mobile has its own `authService.ts` using `identityApi` (from `api.ts`) and paths like `/login`.
- **What:** Two different auth abstractions: shared (generic, different base path) and mobile (concrete, gateway paths). Mobile does not implement the shared interface; it uses its own `authService` and `IAuthService` in `types/services.ts`.
- **Impact:** Slight duplication and risk of drift (e.g. shared has no `gymId` in register). Not critical if mobile is the only client and backend contract is stable.
- **Fix:** Either (a) make mobile’s auth service implement the shared interface and align endpoints, or (b) treat shared auth as “reference/backend-only” and keep mobile’s implementation as the source of truth for the app, and document that.

### 2.6 **Bootstrap and config load order (mobile)**

- **Where:** `fitnexa-mobile/src/config/environment.ts` does `import './bootstrap'` then `getApiUrls()` / `getEnvironment()`.
- **What:** `API_URLS` and `ENVIRONMENT` are computed at first import of `config` (or `environment`). Bootstrap (Expo Constants → `configureEnvironment`) must run before any code uses `getApiUrls()`.
- **Impact:** Correct as long as the first touch of config is via `config/index` or `config/environment`. That holds today because `api.ts` imports `../config`, and any use of `identityApi`/`gymApi` loads `api.ts` → config → bootstrap.
- **Recommendation:** Document that “config must be imported before any service that uses API_URLS” and consider a single app entry (e.g. `App.tsx` or `index.js`) that imports `./src/config` first so the order is explicit and robust.

---

## 3. What’s Working Well

- **Subpath exports:** Mobile and backend use `@fitnexa/shared/types`, `@fitnexa/shared/config`, `@fitnexa/shared/api`, etc., which avoids pulling the whole barrel and keeps client bundles safe from Node-only code.
- **Environment vs config-manager:** `@fitnexa/shared/config` points to `environment.js` only; gateway URL build and API paths match backend routes (`/auth`, `/gym`, etc.).
- **DTOs and types:** Shared types (User, CheckIn, Gym, etc.) are used consistently by mobile and backend.
- **AuthContext DIP:** Optional `authService` injection in `AuthProvider` is good for testing and swapping implementations.
- **Single mobile API surface:** All app code goes through `api.ts` (`identityApi`, `gymApi`, …) with a single place for tokens and refresh logic.

---

## 4. Recommendations Summary (implemented)

| Priority | Action | Status |
|----------|--------|--------|
| High     | Fix **AuthContext**: pass `gymId` to `service.register(email, password, name, gymId)`. | Done |
| Medium   | Remove or repurpose **apiClient.ts** in mobile; use a single API client (keep `api.ts`) and update README/comments. | Done: removed `apiClient.ts`, updated README and nutritionService comment. |
| Medium   | Split **@fitnexa/shared** default entry: move ConfigManager, bootstrap, middleware to e.g. `@fitnexa/shared/server` and keep default for types + environment + platform-agnostic API client. | Done: added `./server` entry; backend imports from `@fitnexa/shared/server`. |
| Low      | Document **config load order** in mobile (bootstrap before any API usage) and optionally import config at app entry. | Done: `App.tsx` imports config first; `src/config/README.md` documents load order. |
| Low      | Clarify **shared vs mobile auth**: either implement shared interface in mobile or document that shared auth is reference-only. | Done: comment in shared `authService.ts`. |

---

## 5. Dependency Direction (validated)

- **fitnexa-shared** has no dependency on mobile or backend; it is the shared kernel. ✓  
- **fitnexa-mobile** depends only on shared (types, config, api, lib/utils) and does not import backend-only exports when using subpaths. ✓  
- **fitnexa-backend** services depend on shared (ConfigManager, types, middleware, etc.). ✓  

No circular dependencies were identified between packages.

---

## 6. Backend TypeScript resolution for `@fitnexa/shared/server`

All backend services use a **path mapping** in `tsconfig.json` so that `@fitnexa/shared/server` resolves to the built shared package. Under `compilerOptions` they have:

- `"baseUrl": "."`
- `"paths": { "@fitnexa/shared/server": ["../../../fitnexa-shared/dist/server/index"] }`  
  (services that already had `paths` also include this entry)

Applied in: **identity-service**, **gateway**, **gym-service**, **wizard-service**, **content-service**, **nutrition-service**, **squad-service**, **logging-service**, **messaging-service**.  
Ensure `fitnexa-shared` is built (`npm run build` in `fitnexa-shared`) before building any service.
