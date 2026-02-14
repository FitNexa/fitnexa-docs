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

## 📱 Mobile usage

The mobile app imports from `@fitnexa/shared/api`, `@fitnexa/shared/types`, and `@fitnexa/shared/lib/utils`. It must **never** import from `@fitnexa/shared/server`.

---
Related: [System Overview](../overview/system-overview.md) · [Backend Architecture](../backend/architecture.md) · [API Client Guide](../frontend/api-client.md)
