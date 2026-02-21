# Multi-Tenancy Architecture

FitNexa is a **multi-tenant SaaS platform**. Each gym is an isolated tenant. A user (member or admin) belonging to Gym A must never be able to read or write Gym B's data, even if they have a valid authentication token.

---

## Tenant Model

The core tenant identifier is the **`gymId`** — a unique string slug (e.g. `"irontemple"`, `"greentheory"`). Every significant entity in the system is scoped to a gym.

```
Gym (tenant)
 ├── Users (MEMBER, GYM_ADMIN, STAFF)
 ├── Workouts
 ├── Products
 ├── Challenges
 ├── Announcements & Feed Posts
 ├── Branding / Tailwind Config
 └── Build Records (APK builds)
```

---

## How Identity Is Established

### 1. Login

When a user logs in (`POST /identity/login`), the body must include the `X-Gym-Id` header. The `AuthService` validates that the user's stored `gymId` matches the header before issuing tokens.

```http
POST /identity/login
X-Gym-Id: irontemple
Content-Type: application/json

{ "email": "...", "password": "..." }
```

### 2. JWT Payload

Both the **access token** and **refresh token** embed the user's identity:

```json
{
  "userId": "clxxx...",
  "email": "user@gym.com",
  "role": "GYM_ADMIN",
  "gymId": "irontemple"
}
```

This `gymId` is the ground truth for all subsequent requests. **It cannot be changed without re-authenticating.**

### 3. Middleware Chain

Every protected API route passes through this middleware stack:

```
Request
  → authenticateToken        (validates JWT, attaches req.user)
  → authorizeRoles([...])    (checks req.user.role)
  → Controller               (uses req.user.gymId / req.user.userId)
```

The middleware is defined in `identity-service/src/middleware/auth.ts` and is applied at the gateway or service level depending on the route.

---

## Gym Isolation Enforcement

### The `assertGymAccess` Helper

Each service that manages gym-scoped resources has a local `middleware/gymOwnership.ts` file with two helpers:

```typescript
// Returns { userId, gymId } or sends 403 and returns null
assertGymAccess(req, res, requestedGymId)

// Returns userId or sends 403 if requester ≠ targetUserId (unless SUPER_ADMIN)
assertSelfOrAdmin(req, res, targetUserId)
```

**Rule:** A `GYM_ADMIN` can only mutate resources where `resource.gymId === req.user.gymId`. A `SUPER_ADMIN` bypasses this check.

### Controller Pattern

```typescript
async updateConfig(req: Request, res: Response) {
    // 🔒 Verify the requester belongs to this gym
    if (!assertGymAccess(req, res, req.params.id)) return;

    const updated = await this.gymService.updateConfig(req.params.id, req.body);
    res.json(updated);
}
```

### Identity in Write Operations

**Controllers never trust client-supplied `userId` or `gymId` in the request body.** Identity always comes from the JWT:

```typescript
// ❌ WRONG — client can forge this
const { userId, gymId } = req.body;

// ✅ CORRECT — JWT-guaranteed identity
const { userId, gymId } = req.user;
```

---

## Role Hierarchy

| Role          | Can access               | Notes                                                           |
| ------------- | ------------------------ | --------------------------------------------------------------- |
| `MEMBER`      | Own gym data only        | Read workouts, join challenges, log food/workouts for self only |
| `STAFF`       | Own gym data, some write | Managed per route via `authorizeRoles`                          |
| `GYM_ADMIN`   | Own gym data, full write | Cannot access other gyms' data                                  |
| `SUPER_ADMIN` | All gyms, all operations | Platform admin only                                             |

---

## Service-by-Service Isolation Map

### `identity-service`
| Endpoint            | Isolation                                                           |
| ------------------- | ------------------------------------------------------------------- |
| `GET /users`        | `GYM_ADMIN` scoped to `req.user.gymId`; `SUPER_ADMIN` can query any |
| `GET /users/:id`    | Members can only fetch their own profile                            |
| `POST /users/admin` | `SUPER_ADMIN` only — gymId comes from request body                  |
| `GET /profile`      | Always returns `req.user.userId`'s profile                          |

### `gym-service`
| Endpoint                     | Isolation                                             |
| ---------------------------- | ----------------------------------------------------- |
| `PUT /gyms/:id/config`       | `assertGymAccess` — GYM_ADMIN can only update own gym |
| `GET /gyms/:id/tailwind`     | `assertGymAccess`                                     |
| `POST /gyms/:id/feed`        | `assertGymAccess` + userId from JWT                   |
| `POST /challenges`           | GYM_ADMIN's gymId injected from JWT, not body         |
| `PUT/DELETE /challenges/:id` | Verifies `challenge.gymId === req.user.gymId`         |
| `POST /challenges/:id/join`  | userId from JWT — cannot join as another user         |

### `nutrition-service`
| Endpoint               | Isolation                                          |
| ---------------------- | -------------------------------------------------- |
| `POST /log`            | userId from JWT; client-supplied userId stripped   |
| `POST /water`          | userId from JWT                                    |
| `GET /summary/:userId` | Members locked to own userId; admins can query any |
| `PUT/DELETE /logs/:id` | Service verifies log ownership via userId + role   |

### `gym-tracker-service`
| Endpoint                  | Isolation                                    |
| ------------------------- | -------------------------------------------- |
| `POST /log`               | userId from JWT                              |
| `POST /water`             | userId from JWT                              |
| `POST /workouts/complete` | userId + gymId from JWT override body values |
| Read endpoints            | Members scoped to own userId                 |

### `messaging-service`
| Endpoint                     | Isolation                                         |
| ---------------------------- | ------------------------------------------------- |
| `POST /messages`             | `senderId` from JWT — cannot send as another user |
| `GET /conversations/:userId` | Members can only see their own conversations      |

### `squad-service`
| Endpoint               | Isolation                             |
| ---------------------- | ------------------------------------- |
| `POST /sessions`       | userId + gymId from JWT override body |
| `GET /history/:userId` | Members can only see own history      |

### `wizard-service`
| Endpoint             | Isolation                                                       |
| -------------------- | --------------------------------------------------------------- |
| `POST /builds`       | gymId from JWT — GYM_ADMIN cannot trigger build for another gym |
| `GET /builds/:gymId` | GYM_ADMIN scoped to own gymId                                   |

---

## Mobile App Data Flow

The mobile app sets the gym context at login via the `X-Gym-Id` header (from `app.config.js` → `GYM_ID` env var). After login, the app stores the **access token** and **refresh token** in the device's encrypted keychain (`expo-secure-store`).

Subsequent API calls attach the access token as a `Bearer` header. The server reads `gymId` from the JWT — the mobile app **does not send userId or gymId in request bodies** for write operations.

```
Mobile App → Bearer <token> → Gateway → Service
                                           ↓
                                  req.user = { userId, gymId, role }
                                           ↓
                                  All DB queries scoped to gymId
```

### Token Rotation

On each `/refresh` call:
1. Old refresh token is **revoked** in Redis (one-time use)
2. A new access token **and** a new refresh token are issued
3. Both are stored in SecureStore on device (native) or as HttpOnly cookies (web)

This means a stolen refresh token is automatically invalidated the moment the legitimate client rotates it.

---

## Adding a New Gym-Scoped Resource

When adding a new service or endpoint that creates/reads gym data, follow this checklist:

- [ ] Ensure the DB model has a `gymId` column (foreign key to `Gym`)
- [ ] In the controller, read `gymId` from `req.user.gymId`, not from the request body
- [ ] For `GYM_ADMIN` mutations, call `assertGymAccess(req, res, targetGymId)` before touching data
- [ ] For write operations involving a user (likes, comments, logs), use `req.user.userId`
- [ ] For read operations that accept a userId param, restrict non-admins to their own `req.user.userId`
- [ ] Apply `authorizeRoles(['GYM_ADMIN', 'SUPER_ADMIN'])` on admin-only routes
