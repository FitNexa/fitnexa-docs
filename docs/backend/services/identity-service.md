---
sidebar_position: 2
title: "Identity Service"
description: "Central authority for authentication, user management, and RBAC"
---
# Identity Service

The Identity Service is the central authority for authentication and user management in the FitNexa platform.

## 🚀 Responsibilities
- **Authentication**: Login and registration flows using JWT.
- **User Management**: Profile updates, password resets, and bio/avatar management.
- **Role-Based Access Control (RBAC)**: Distinguishing between `MEMBER`, `GYM_ADMIN`, and `SUPER_ADMIN`.
- **Activation Flow**: Managing user account activation via tokens.

## 🛠️ Technical Details
- **Port**: `3007`
- **Database**: `fitnexa_identity` (PostgreSQL)
- **Primary Model**: `User`

## 📡 API Endpoints

### Auth Routes (`/auth`)
- `POST /login`: Authenticate and receive a JWT. Accepts optional `domain` for enforcement.
- `GET /me`: Get current authenticated user details.
- `POST /logout`: Invalidate session.

### User Routes (`/users`)
- `GET /users/me`: Get current authenticated user details.
- `PUT /profile`: Update personal profile information.
- `POST /profile/upload`: Upload a new profile picture.

### Admin Routes (Internal)
| Endpoint                  | Method | Description                                           |
| ------------------------- | ------ | ----------------------------------------------------- |
| `/users/create-gym-admin` | POST   | Create a new GYM_ADMIN user (called by orchestration) |
| `/users/activate`         | POST   | Activate a user account via activation token          |
| `/users/all`              | GET    | List all users (SUPER_ADMIN only)                     |

## 💾 Model: User
| Field       | Type      | Description                                |
| ----------- | --------- | ------------------------------------------ |
| id          | UUID      | Unique identifier                          |
| email       | String    | Unique login email                         |
| role        | Enum      | `MEMBER`, `GYM_ADMIN`, `SUPER_ADMIN`       |
| status      | Enum      | `ACTIVE`, `INACTIVE`, `PENDING_ACTIVATION` |
| gymId       | String?   | ID of the gym the user belongs to          |
| activatedAt | DateTime? | Timestamp of account activation            |
| avatar      | String?   | Path to stored profile image               |

---
Related: [Gym Service](gym-service.md) · [API Client Guide](../../frontend/api-client.md)
