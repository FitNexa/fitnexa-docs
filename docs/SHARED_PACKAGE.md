# @fitnexa/shared Package

The **@fitnexa/shared** package is the shared kernel for the FitNexa platform. It provides types, configuration, API clients, server bootstrap, and middleware used by **fitnexa-mobile**, **fitnexa-backend** services, and admin apps. It has **no dependency** on mobile or backend; both depend on it.

## 📦 Subpath Exports

Consumers should use **subpath imports** so that only the needed code is pulled in (and to avoid pulling Node-only code into the mobile bundle).

| Export | Use case | Contents |
|--------|----------|----------|
| `@fitnexa/shared/types` | All apps | DTOs, interfaces (User, Gym, CheckIn, etc.). |
| `@fitnexa/shared/config` | Mobile, Admin | **Environment only**: `getEnvironment()`, `getApiUrls()`, in-memory config. Safe for browser/React Native. |
| `@fitnexa/shared/api` | Mobile, Admin | Platform-agnostic `ApiClient` and helpers. |
| `@fitnexa/shared/lib/utils` | All | Shared utilities (e.g. `clsx`, `tailwind-merge`). |
| `@fitnexa/shared/logger` | All | Environment-aware logger (console in browser, Winston in Node). |
| `@fitnexa/shared/errors` | Backend, Mobile | `AppError` and error types. |
| **`@fitnexa/shared/server`** | **Backend only** | **Node-only**: `ConfigManager`, `createBaseService`, bootstrap, Express middleware (auth, correlation, error handler). Do **not** use in mobile or browser. |
| `@fitnexa/shared/middleware` | Backend | Express middleware (error handling, correlation, performance). |
| `@fitnexa/shared/services` | Optional | Shared service interfaces and implementations (e.g. authService). |
| `@fitnexa/shared/swagger` | Backend | Swagger/OpenAPI utilities. |

## 🖥️ Backend usage

All backend services (Gateway, Identity, Gym, Content, Nutrition, Squad, Wizard, Messaging, Logging) use:

- **`@fitnexa/shared/server`** for `ConfigManager`, `createBaseService`, and server bootstrap.
- **`@fitnexa/shared/types`** for DTOs and request/response types.
- **`@fitnexa/shared/middleware`** and **`@fitnexa/shared/errors`** for consistent API behavior.

Each service’s `tsconfig.json` uses a **path mapping** so that `@fitnexa/shared/server` resolves to the built shared package, e.g.:

```json
"paths": {
  "@fitnexa/shared/server": ["../../../fitnexa-shared/dist/server/index.js"]
}
```

**Important:** Build the shared package (`npm run build` in `fitnexa-shared`) before building or running any backend service.

## 📱 Mobile usage

The mobile app uses **only**:

- `@fitnexa/shared/types`
- `@fitnexa/shared/config` (environment only; does **not** import `config-manager`)
- `@fitnexa/shared/api` (for base client; the app uses its own `api.ts` with auth and refresh)
- `@fitnexa/shared/lib/utils`
- `@fitnexa/shared/errors` (if needed)

It must **not** import `@fitnexa/shared/server` or the default barrel `@fitnexa/shared` in a way that pulls in Node/Express.

## 🔀 Dependency direction

- **fitnexa-shared** → no dependency on mobile or backend.
- **fitnexa-mobile** → depends on shared (types, config, api, lib/utils).
- **fitnexa-backend** → depends on shared (server, types, middleware, errors).

See [Architecture Review](ARCHITECTURE_REVIEW.md) for more detail.

---
[Backend Architecture](backend/ARCHITECTURE.md) · [Architecture Review](ARCHITECTURE_REVIEW.md) · [System Overview](SYSTEM_OVERVIEW.md)
