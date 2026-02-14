---
sidebar_position: 2
title: "Security Findings"
description: "Critical and high-priority security issues — rate limiting, CORS, service auth, error leakage"
---

# Security Findings

## 🔴 C-1: No Rate Limiting Anywhere

**Where:** Gateway + all services

`express-rate-limit` is imported in 2 route files but **never installed** as a dependency. Zero rate limiting exists — including on `/auth/login`, `/auth/register`, and file uploads.

**Risk:** Brute force attacks on login, account enumeration, DDoS via upload, API abuse.

**Fix:**

1. Install `express-rate-limit` in `@fitnexa/shared`
2. Add `createRateLimiter()` factory in `bootstrap.ts`
3. Apply strict limits to auth routes (5 req/min login, 3 req/min register)
4. Apply general limits (100 req/min per IP)
5. Apply upload-specific limits (10 req/min)

---

## 🔴 C-2: CORS Wide Open (`origin: '*'`)

**Where:** `bootstrap.ts` — affects ALL 9 services

```typescript
// Current (INSECURE)
app.use(cors({ origin: '*', credentials: true }));
```

:::danger
Any website can attempt authenticated requests. `credentials: true` with `origin: '*'` is actually rejected by browsers, so CORS is currently **broken** for authenticated cross-origin requests.
:::

**Fix:**

```typescript
const ALLOWED = config.get('ALLOWED_ORIGINS')?.split(',') || ['http://localhost:3001'];
app.use(cors({ origin: ALLOWED, credentials: true }));
```

Set `ALLOWED_ORIGINS` env var per environment (dev, UAT, production).

---

## 🔴 C-5: No Service-to-Service Authentication

**Where:** Gateway → all downstream services

The gateway proxies requests with `changeOrigin: true` but no shared secret. Anyone who can reach the internal network can call services directly, bypassing auth/rate limiting.

**Fix:**

1. Generate a shared `INTERNAL_API_KEY` env var
2. Gateway injects it as `X-Internal-Key` header on every proxy request
3. Each service validates this header for non-gateway requests

---

## 🟠 H-1: `register()` Defaults `gymId` to `'g1'`

**Where:** `AuthService.register()`

```typescript
const gymId = data.gymId || 'g1';    // ← hardcoded fallback
const locationId = data.locationId || 'l1';
```

If registration doesn't include `gymId`, users silently join gym `g1`. In production with real gyms, this is a **data integrity disaster**.

**Fix:** Make `gymId` **required** in the registration schema. Remove the fallback.

---

## 🟠 H-7: Error Messages Leak Internal Details

**Where:** `errorHandler.ts` + service-level `throw new Error('...')`

The global 500 handler correctly returns a generic message. But many services throw raw errors with specific messages that reach the client:

```typescript
throw new Error('User already exists');  // ← reveals account existence
```

**Risk:** Account enumeration on registration.

**Fix:** Use `ConflictError` with generic messages, or standardize registration to always return "Registration failed" regardless of reason.

---

Related: [Stability Findings](./stability.md) · [Observability & Quality](./observability-quality.md) · [Fix Roadmap](./roadmap.md)
