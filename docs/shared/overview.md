---
sidebar_position: 1
title: "@fitnexa/shared Overview"
description: "The shared kernel of the FitNexa platform, including types, API clients, and server utilities"
---
# @fitnexa/shared Package

The **@fitnexa/shared** package is the shared kernel for the FitNexa platform. It provides types, configuration, API clients, server bootstrap, and middleware used by **fitnexa-mobile**, **fitnexa-backend** services, and admin apps. It has **no dependency** on mobile or backend; both depend on it.

## 📦 Subpath Exports

Consumers should use **subpath imports** to avoid pulling Node-only code into browser/mobile bundles.

| Export                      | Use case            | Key contents                                                                             |
| --------------------------- | ------------------- | ---------------------------------------------------------------------------------------- |
| `@fitnexa/shared` (browser) | Admin apps, Landing | Types, ApiClient, environment config, browser logger, WizardLayout, WizardProvider, cn() |
| `@fitnexa/shared/server`    | **Backend only**    | ConfigManager, createBaseService, Express middleware, Node logger                        |
| `@fitnexa/shared/types`     | All apps            | User, Gym, GymConfig, CheckIn, WizardSession DTOs                                        |
| `@fitnexa/shared/api`       | Mobile, Admin       | Platform-agnostic `ApiClient` (get, post, put, delete, upload)                           |
| `@fitnexa/shared/errors`    | All                 | AppError class hierarchy (NotFoundError, ConflictError, ValidationError)                 |
| `@fitnexa/shared/lib/utils` | All                 | cn() utility (clsx + tailwind-merge)                                                     |

## 🕹️ Key Features

### ApiClient
A centralized, platform-agnostic HTTP client built on `fetch`. **MANDATORY** for all frontend network requests.
:::tip
See the [API Client Guide](../frontend/api-client.md) for full usage examples.
:::

### Wizard Infrastructure
- **`WizardLayout`**: A standardized layout for multi-step flows.
- **`WizardProvider` / `useWizard`**: Context for managing wizard state.
- **`WizardSession`**: DTOs for persistent multi-step sessions.

### Error Handling
Standardized error classes that map to HTTP status codes:
- `NotFoundError` (404)
- `ConflictError` (409)
- `ValidationError` (400)
- `UnauthorizedError` (401)

## 🖥️ Backend usage

All backend services use:
- **`@fitnexa/shared/server`** for `ConfigManager`, `createBaseService`, and bootstrap.
- **`@fitnexa/shared/middleware`** for consistent error handling and auth.

### TS Configuration
Services map the path in `tsconfig.json`:
```json
"paths": {
  "@fitnexa/shared/server": ["../../../fitnexa-shared/dist/server/index.js"]
}
```

### ESM and .js imports
The shared package is built as ESM. All **relative** imports in `fitnexa-shared/src/` must use the `.js` extension (e.g. `from './validation/index.js'`, `from '../types/gym.js'`) so Node resolves them correctly after compilation. See [Monorepo Scripts – ESM Module Resolution](../dev-workflows/monorepo-scripts.md#esm-module-resolution-fitnexa-shared) and [Recent Changes](../dev-workflows/recent-changes.md) for details and the rule for new code.

### Building and testing
- **Build:** `npm run build` (from `fitnexa-shared/`) runs `tsc` and copies i18n locales.
- **Tests:** `npm test` runs Jest. Test files import without `.js`; `jest.config.js` maps `.js` to the `.ts` source so both production code and tests resolve correctly.

## 📱 Mobile usage

The mobile app imports from `@fitnexa/shared/api`, `@fitnexa/shared/types`, and `@fitnexa/shared/lib/utils`. It must **never** import from `@fitnexa/shared/server`.

---
Related: [System Overview](../overview/system-overview.md) · [Backend Architecture](../backend/architecture.md) · [API Client Guide](../frontend/api-client.md)
