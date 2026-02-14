---
sidebar_position: 3
title: "Stability Findings"
description: "Critical and high-priority stability issues — graceful shutdown, token refresh, connection pooling, migrations"
---

# Stability Findings

## 🔴 C-3: No Graceful Shutdown (7/9 Services)

**Where:** Every service except `messaging-service`

Only messaging-service handles `SIGTERM`. When Docker/PM2 sends SIGTERM, services die immediately — dropping in-flight requests, leaving Prisma connections open, and potentially corrupting transactions.

**Risk:** Data corruption on deploy, connection pool exhaustion, lost requests during rolling deployments.

**Fix:** Add to `createBaseService()` in `bootstrap.ts`:

```typescript
const shutdown = async () => {
    logger.info('Graceful shutdown initiated...');
    server.close(async () => {
        await prisma?.$disconnect();
        process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000); // Force kill after 10s
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

---

## 🔴 C-4: Refresh Token Doesn't Verify User Status

**Where:** `AuthService.refresh()`

The refresh flow verifies the JWT signature and issues a new access token but **never checks** if the user still exists, is still `ACTIVE`, or has been banned.

```typescript
async refresh(token: string) {
    const payload = AuthUtils.verifyRefreshToken(token);
    // ← No database lookup! No status check!
    const newAccessToken = AuthUtils.generateAccessToken(payload);
    return { accessToken: newAccessToken };
}
```

**Risk:** Banned/deleted/deactivated users keep getting valid tokens for up to 7 days.

**Fix:**

```typescript
async refresh(token: string) {
    const payload = AuthUtils.verifyRefreshToken(token);
    const user = await this.userRepository.findById(payload.userId);
    if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedError('Account suspended');
    }
    return {
        accessToken: AuthUtils.generateAccessToken({
            ...payload, role: user.role
        })
    };
}
```

---

## 🟠 H-3: Bcrypt Rounds Inconsistent

**Where:** `AuthService`

| Operation          | Rounds | Location           |
| ------------------ | ------ | ------------------ |
| `register()`       | **10** | AuthService.ts:103 |
| `createGymAdmin()` | **10** | AuthService.ts:175 |
| `activateUser()`   | **12** | AuthService.ts:208 |

OWASP recommends ≥ 12 rounds.

**Fix:** Define a constant `const BCRYPT_ROUNDS = 12;` and use everywhere.

---

## 🟠 H-4: ApiClient Has No Request Timeout

**Where:** `apiClient.ts`

The `fetch()` call has no `AbortController` timeout. If the gateway hangs, clients wait **forever**.

**Fix:**

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 15_000);
const response = await fetch(url, { ...finalInit, signal: controller.signal });
clearTimeout(timeoutId);
```

---

## 🟠 H-5: ApiClient Has No Automatic Token Refresh

**Where:** `apiClient.ts`

When a 401 is returned (token expired), the client just throws. Admin web apps likely don't handle this — users get logged out every 15 minutes.

**Fix:** Add interceptor logic:

```typescript
if (response.status === 401 && config.onUnauthorized) {
    const retried = await config.onUnauthorized();
    if (retried) return request(options); // Retry with new token
}
```

---

## 🟠 H-6: No Prisma Connection Pool Configuration

**Where:** All services — `new PrismaClient()` with defaults

Default pool is `num_cpus * 2 + 1`. Under load, PostgreSQL rejects excess connections.

**Risk:** `P2024: Connection pool timeout` under moderate load.

**Fix:** Configure via DATABASE_URL:

```
postgresql://user:pass@host:5432/db?connection_limit=5&pool_timeout=10
```

---

## 🟡 M-1: No `uncaughtException` / `unhandledRejection` Handlers

**Where:** Only `nutrition-service` has these. Other services have none.

**Risk:** Unhandled promise rejections crash Node silently. No logs, no alerts.

**Fix:** Add to `createBaseService()`:

```typescript
process.on('uncaughtException', (error) => {
    logger.error('UNCAUGHT EXCEPTION', { error: error.message, stack: error.stack });
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    logger.error('UNHANDLED REJECTION', { reason });
});
```

---

## 🟡 M-5: No Database Migration Strategy

**Where:** All services use `prisma db push`

`prisma db push` is for prototyping. It doesn't create migration files, can't be rolled back, and will **drop data** if you rename a column.

**Fix:**

1. Switch to `prisma migrate dev` for creating migrations
2. Use `prisma migrate deploy` in CI/CD
3. Never use `prisma db push` in production

---

## 🟡 M-6: No Retry Logic in ApiClient

**Where:** `apiClient.ts`

Transient network errors (timeout, DNS) fail immediately with no retry.

**Fix:** Add exponential backoff for 5xx and network errors:

```typescript
const MAX_RETRIES = 2;
for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try { return await doRequest(); }
    catch (e) {
        if (attempt === MAX_RETRIES || !isRetryable(e)) throw e;
        await delay(Math.pow(2, attempt) * 500);
    }
}
```

---

Related: [Security Findings](./security.md) · [Observability & Quality](./observability-quality.md) · [Fix Roadmap](./roadmap.md)
