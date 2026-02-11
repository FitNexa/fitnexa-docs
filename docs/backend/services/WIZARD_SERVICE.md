# Wizard Service

The Wizard Service manages multi-step flows and session-based onboarding (e.g., gym setup, member onboarding) in the FitNexa platform.

## 🚀 Responsibilities
- **Session Management**: Creating and persisting wizard sessions (multi-step flows).
- **Step State**: Storing progress and user inputs per step; supporting resume and validation.
- **Deployment / Availability**: Supporting deployment of completed wizard configurations and availability checks for resources (e.g., gym slots).

## 🛠️ Technical Details
- **Port**: 3006
- **Gateway path**: `/wizard`
- **Database**: Service-owned storage (e.g., PostgreSQL or in-memory per deployment).
- **Auth**: Uses shared `@fitnexa/shared/server` middleware (optionalAuth, authenticateToken).

## 📡 API Endpoints

### Session & Steps
- `POST /`: Create a new wizard session.
- `GET /:sessionId`: Get session and current step state.
- `PUT /:sessionId`: Update session (e.g., advance step, save form data).
- `GET /`: List sessions (e.g., for current user or gym).

### Operations
- `POST /:sessionId/deploy`: Deploy or finalize a completed wizard (e.g., publish gym config).
- `GET /check-availability`: Check availability for a given resource (e.g., gym name, slot).

### Uploads
- Support for file uploads within wizard steps (e.g., logos, documents) where applicable.

---
[Back to Services Catalog](../SERVICES_CATALOG.md)
