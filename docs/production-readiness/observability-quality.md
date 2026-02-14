---
sidebar_position: 4
title: "Observability & Quality"
description: "Medium and low-priority findings — logging, health checks, validation, code quality, and enhancements"
---

# Observability & Code Quality Findings

## 🟠 H-2: No Input Validation on Most Endpoints

**Where:** Zod schemas exist only in **3/9 services** (gym, identity, wizard)

Services with **zero input validation**:
- `content-service`
- `nutrition-service`
- `squad-service`
- `messaging-service`
- `logging-service`
- `gateway`

**Risk:** Unexpected payloads crash services, invalid data stored in DB.

**Fix:** Create Zod schemas for every endpoint. Use a shared `validate()` middleware:

```typescript
// @fitnexa/shared/middleware
export const validate = (schema: ZodSchema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        throw new ValidationError('Invalid input', result.error.flatten());
    }
    req.body = result.data; // Type-safe, sanitized
    next();
};
```

---

## 🟡 M-2: No Health Check Consistency

**Where:** Services have different health patterns:

| Pattern                          | Services                                                        |
| -------------------------------- | --------------------------------------------------------------- |
| Generic `/health` (no DB check)  | identity, nutrition, content, squad, wizard, logging, messaging |
| `/health` + `/ready` (checks DB) | gym                                                             |
| Custom `/health` format          | gateway                                                         |

**Risk:** `/health` says "healthy" even when the database is down.

**Fix:** Add `/ready` to `createBaseService()`:

```typescript
app.get('/ready', async (req, res) => {
    try {
        await prisma?.$queryRaw`SELECT 1`;
        res.json({ status: 'READY' });
    } catch {
        res.status(503).json({ status: 'NOT_READY' });
    }
});
```

- `/health` = liveness (process running)
- `/ready` = readiness (DB connected, dependencies available)

---

## 🟡 M-3: Logging Inconsistency

**Where:** Across all services

Some services use `createLogger()` (Winston), others use `console.log`. Error objects are sometimes `{ error: e }` and sometimes `{ error: e.message }` — losing stack traces.

**Fix:**

1. Ban `console.log/error/warn` via ESLint rule
2. Always log errors with full context: `logger.error('msg', { error: err.message, stack: err.stack })`

---

## 🟡 M-4: No Request Logging at Gateway Level

**Where:** Gateway

The gateway proxies requests but doesn't log client IP, endpoint, status code, or duration. No audit trail.

**Fix:** Add logging middleware BEFORE proxy routes:

```typescript
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        logger.info('request', {
            method: req.method, path: req.path,
            status: res.statusCode, duration: Date.now() - start,
            ip: req.ip, correlationId: req.headers['x-correlation-id']
        });
    });
    next();
});
```

---

## 🟡 M-7: JWT Payload Contains Stale Data

**Where:** `AuthUtils`

JWT contains `role` and `gymId`. If an admin changes a user's role, old values persist for up to 15 minutes (access) or 7 days (refresh token).

**Fix:** Acceptable for 15-min access tokens if refresh checks DB (see C-4). Long-term: store only `userId` in JWT and fetch role/gym from Redis cache on each request.

---

## 🔵 Low Priority

### L-1: No Correlation ID Propagation Across Services

The gateway doesn't forward `X-Correlation-Id` to downstream services. Each service generates its own, making cross-service tracing impossible.

### L-2: PrismaClient Created at Module Level

`const prisma = new PrismaClient()` at top-level makes DI harder and prevents per-environment config.

### L-3: Seed Data Runs on Every Start

`identity-service` and `gym-service` seed on every startup. In production, this could overwrite real data.

**Fix:** Guard with `if (process.env.NODE_ENV === 'development') await seed();`

### L-4: `any` Types in Shared Library

- `bootstrap.ts:77` — `logger: any`
- `apiClient.ts:67` — `Promise<any>`
- `errors/index.ts:6` — `details?: any`

---

## ⚪ Enhancements

| ID  | Enhancement                | Description                                                                    |
| --- | -------------------------- | ------------------------------------------------------------------------------ |
| E-1 | **API Versioning**         | No versioning exists. Prefix routes with `/v1/`.                               |
| E-2 | **Structured DTOs**        | Controllers pass raw bodies to services — use explicit request/response types. |
| E-3 | **DB Health in `/health`** | Generic `/health` doesn't check database. See M-2.                             |
| E-4 | **OpenTelemetry**          | No distributed tracing. 9 services need tracing for cross-boundary debugging.  |

---

Related: [Security Findings](./security.md) · [Stability Findings](./stability.md) · [Fix Roadmap](./roadmap.md)
