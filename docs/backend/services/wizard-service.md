---
sidebar_position: 7
title: "Wizard Service"
description: "Multi-step state machine for onboarding, activation, and build orchestration"
---

# Wizard Service

The Wizard Service manages long-running, multi-step state machines for gym onboarding. It orchestrates gym creation, admin account provisioning, email delivery, and mobile app build requests.

## Responsibilities

- **Session State**: Persisting progress across wizard steps as JSON blobs.
- **Validation**: Enforcing business rules before advancing steps.
- **Onboarding Orchestration**: Coordinating with Identity Service and Gym Service to create gyms and admin accounts.
- **Account Activation**: Managing activation tokens and password setup flow.
- **Email Delivery**: Sending activation and welcome emails via Mailjet API.
- **Build Management**: Triggering GitHub Actions to produce branded APK builds and tracking their status.

## Technical Details

- **Port**: `3008`
- **Database**: SQLite (via Prisma)
- **Gateway prefix**: `/wizard`

## Architecture

```
wizard-service/
  src/
    controllers/
      OnboardingController.ts    # Onboard, activate, sessions, builds
      WebhookController.ts       # GitHub Actions build callbacks
    services/
      OnboardingOrchestrator.ts  # Saga: create gym -> create admin -> send email
      WizardSessionService.ts    # CRUD for wizard sessions
      ActivationTokenService.ts  # Token generation and validation
      BuildRequestService.ts     # Build lifecycle management
      MailjetEmailService.ts     # Real email via Mailjet API
      MockEmailService.ts        # Console-logged email for dev
      GitHubBuildService.ts      # Trigger builds via GitHub API
      MockBuildService.ts        # Logged build trigger for dev
    repositories/
      WizardSessionRepository.ts
      ActivationTokenRepository.ts
      BuildRequestRepository.ts
    clients/
      GymServiceClient.ts        # Internal HTTP to gym-service
      IdentityServiceClient.ts   # Internal HTTP to identity-service
    interfaces/
      IEmailService.ts
      IBuildService.ts
    routes/
      onboarding.routes.ts
      webhook.routes.ts
```

## API Endpoints

### Onboarding

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` (onboard) | None | Submit full onboarding payload |
| GET | `/activate/:token` | None | Validate an activation token |
| POST | `/activate` | None | Set password and activate account |

### Sessions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/sessions` | JWT | List sessions (filterable by gymId) |
| GET | `/sessions/:id` | Optional | Get a single session |
| PUT | `/sessions/:id` | Optional | Update session data (branding, features, connections) |

### Builds

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/builds/request` | JWT | Request a new UAT build |
| GET | `/builds/:id/status` | JWT | Get build status |
| GET | `/builds/gym/:gymId` | JWT | List all builds for a gym |
| POST | `/builds/:id/go-live` | JWT | Create Stripe checkout session |

### Webhooks

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/webhooks/build-complete` | None (secret validated) | Callback from GitHub Actions |

## Service Implementations

### MailjetEmailService

Uses the `nodemailer` package. Configured via environment variables:

- `MJ_APIKEY_PUBLIC`, `MJ_APIKEY_PRIVATE` (Mailjet API keys)
- `MJ_FROM` (optional, sender address)
- When Mailjet keys are not set, `MockEmailService` is used instead (logs to console).

Sends two email types:

1. **Activation email** - branded HTML with activation button
2. **Welcome email** - links to the gym admin dashboard

### GitHubBuildService

Uses `@octokit/rest` to dispatch `uat-build-request` events to GitHub Actions.

- `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`, `GITHUB_CALLBACK_URL`
- When `GITHUB_TOKEN` is not set, `MockBuildService` is used instead.

### OnboardingOrchestrator

Implements a saga pattern:

1. Create gym (via gym-service)
2. Create admin user (via identity-service) - if this fails, compensate by deleting the gym
3. Generate activation token (64-char hex, 24h expiry)
4. Create wizard session
5. Send activation email

## Database Models

Defined in `prisma/schema.prisma`:

- **WizardSession** - stores step progress and JSON config data
- **ActivationToken** - one-time-use tokens with expiry
- **BuildRequest** - tracks build lifecycle (QUEUED, BUILDING, SUCCESS, FAILED)

---

Related: [Gym Onboarding Flow](../../features/gym-onboarding-flow.md) | [Onboarding App](../../frontend/apps/onboarding.md) | [Gym Admin](../../frontend/apps/gym-admin.md)
