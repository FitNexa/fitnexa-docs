# Identity Service

The Identity Service is the central authority for authentication and user management in the FitNexa platform.

## 🚀 Responsibilities
- **Authentication**: Login and registration flows using JWT.
- **User Management**: Profile updates, password resets, and bio/avatar management.
- **Role-Based Access Control (RBAC)**: Distinguishing between MEMBERS, GYM_ADMINS, and SUPER_ADMINS.
- **QR Code Generation**: Generating unique check-in codes for members.

## 🛠️ Technical Details
- **Port**: 3007
- **Database**: `fitnexa_identity` (PostgreSQL)
- **Primary Model**: `User`
- **Authentication**: JWT (JSON Web Token) strategy.

## 📡 API Endpoints

### Auth Routes (`/auth`)
- `POST /register`: Create a new user account.
- `POST /login`: Authenticate and receive a JWT.
- `GET /me`: Get current authenticated user details.

### User Routes (`/users`)
- `GET /`: List users (Admin only).
- `GET /:id`: Get specific user profile.
- `PUT /profile`: Update personal profile information.
- `POST /avatar`: Upload a new profile picture.

## 💾 Model: User
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| email | String | Unique login email |
| role | String | MEMBER, GYM_ADMIN, or SUPER_ADMIN |
| gymId | String? | ID of the gym the user belongs to |
| qrCode| String? | Unique string for physical check-ins |
| avatar| String? | Path to stored profile image |

---
[Back to Services Catalog](../SERVICES_CATALOG.md)
