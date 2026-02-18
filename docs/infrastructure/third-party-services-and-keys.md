---
sidebar_position: 4
title: "Third-Party Services & API Keys"
description: "All external services used by FitNexa and the keys/credentials required for each"
---
# Third-Party Services & API Keys

This document lists every external service used by the FitNexa platform and the environment variables / secrets required for each. Use it as the single reference for configuring local, UAT, and production environments.

---

## Overview

| Service | Purpose | Used By | Fallback / Optional |
|--------|---------|---------|----------------------|
| **PostgreSQL** | Primary data store | All backend services (Identity, Gym, Nutrition, Content, Squad, Messaging, Wizard) | — (required) |
| **Redis** | Caching / sessions | Gateway, services that use cache | Default localhost |
| **RabbitMQ** | Log shipping, async messaging | All backend services (log transport), Logging service (consumer) | Logging works without it (console/file only) |
| **MongoDB** | Centralized log & error storage | Logging service | — (required for logging-service) |
| **Mailjet** | Email (activation, welcome, password reset) | Wizard service, Identity service | MockEmailService / MockEmailProvider (console) |
| **GitHub** | APK build triggers, error tickets, Copilot | Wizard service, Logging service | MockBuildService; tickets disabled without token |
| **OpenAI** | AI analysis comment on error tickets | Logging service | Optional; no comment if unset |
| **GitHub Copilot** | Assign error issues to Copilot → PR | Logging service | Optional; set `GITHUB_COPILOT_ASSIGN_ISSUES=true` to enable |
| **Stripe** | Go Live / production licensing | Wizard service | MockPaymentService |
| **Google Gemini** | AI food scanning (Nutrition) | Nutrition service | — (feature fails without key) |
| **Vercel** | Frontend hosting | CI/CD (Landing, Admin, Onboarding) | — |
| **Expo / EAS** | Mobile app builds | CI/CD, deploy scripts | — |
| **SSH / VPS** | Backend deployment | GitHub Actions deploy workflows | — |

---

## 1. PostgreSQL

**Used by:** Identity, Gym, Nutrition, Content, Messaging, Squad, Wizard (each has its own schema).  
**Purpose:** Primary relational database.

### Environment variables (shared / per-service)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | **Yes** | Full connection string, e.g. `postgresql://user:pass@host:5432/db?schema=identity` |
| `DB_USER` | No* | Used to build `DATABASE_URL` if not set |
| `DB_PASSWORD` | No* | — |
| `DB_HOST` | No* | Default `localhost` |
| `DB_PORT` | No* | Default `5432` |
| `DB_NAME` | No* | Database name |

\* If `DATABASE_URL` is missing, `@fitnexa/shared` ConfigManager can build it from `DB_*` when all are set. Each service uses a schema derived from its name (e.g. `identity_service` → `identity`).

### Where to set

- Local: `fitnexa-backend/.env` or service `.env`; often one `DATABASE_URL` per service with different `?schema=`.
- UAT/Production: Docker Compose or systemd env; use a single DB with multiple schemas or separate DBs per service.

---

## 2. Redis

**Used by:** Gateway and any service that uses Redis for caching/sessions.  
**Purpose:** Caching layer.

### Environment variables (from `@fitnexa/shared` config)

| Variable | Required | Description |
|----------|----------|-------------|
| `REDIS_HOST` | No | Default `localhost` |
| `REDIS_PORT` | No | Default `6379` |

Use `REDIS_URL` where applicable (e.g. `redis://localhost:6379`); some code may read host/port.

---

## 3. RabbitMQ

**Used by:**  
- **Backend services:** Winston logger ships logs to the `logs` exchange when `RABBITMQ_URL` is set (see shared bootstrap).  
- **Logging service:** Consumes from `logging_service_queue` and writes to MongoDB.

**Purpose:** Asynchronous log aggregation so logging does not block API responses.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RABBITMQ_URL` | No | Default `amqp://localhost:5672`. Set in backend services and logging-service. |

If unset or unreachable, backend services still run; they simply do not attach the RabbitMQ log transport.

---

## 4. MongoDB

**Used by:** Logging service only.  
**Purpose:** Stores centralized logs (from RabbitMQ and HTTP) and error reports (for GitHub tickets and AI analysis).

### Environment variables (logging-service)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URL` | **Yes** | Connection string, e.g. `mongodb://localhost:27017` |
| `MONGO_DB_NAME` | No | Default `fitnexa_logs` |

Set in logging-service `.env` or deployment env.

---

## 5. Mailjet – Email

**Used by:** Wizard service (activation, welcome emails), Identity service (password reset).  
**Purpose:** Transactional email delivery.

| Variable | Required | Description |
|----------|----------|-------------|
| `MJ_APIKEY_PUBLIC` | **Yes** (for real email) | Mailjet API key (public) |
| `MJ_APIKEY_PRIVATE` | **Yes** (for real email) | Mailjet API secret (private) |
| `MJ_FROM` | No | Sender address, e.g. `FitNexa <noreply@gymia.fit>` |
| `PASSWORD_RESET_BASE_URL` | No (Identity) | Base URL for reset links, e.g. `https://app.example.com/reset-password` |

**How to get keys:** [mailjet.com](https://www.mailjet.com) → Account → API Keys. Verify sender/domain in Sender addresses & domains.

**Fallback:** If either Mailjet key is unset, Wizard uses `MockEmailService` and Identity uses `MockEmailProvider` (log to console).

---

## 6. GitHub – Multiple uses

### 6.1 Wizard service – APK build triggers

**Used by:** Wizard service  
**Purpose:** Triggering GitHub Actions to build branded UAT APKs when gym admins click "Request UAT Build".

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GITHUB_TOKEN` | **Yes** | Personal Access Token (PAT) | `ghp_...` |
| `GITHUB_REPO_OWNER` | No | GitHub org/owner | `FitNexa` |
| `GITHUB_REPO_NAME` | No | Repo with `uat-build.yml` | `fitnexa-mobile` |
| `GITHUB_CALLBACK_URL` | No | Webhook base URL for build-complete | Default uses `API_URL` |

### How to Get the Key

1. GitHub → **Settings → Developer settings → Personal access tokens**
2. Generate a token with scopes:
   - `repo` (full control of private repositories)
   - `workflow` (update GitHub Actions workflows)
3. Set `GITHUB_TOKEN` in the wizard-service environment

### Fallback

If `GITHUB_TOKEN` is not set, `MockBuildService` is used; builds will not actually run.

---

### 6.2 Logging service – Error tickets & Copilot

**Used by:** Logging service.  
**Purpose:** Create GitHub issues for reported errors; optionally assign to Copilot so it opens a PR.

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | **Yes** (for tickets) | PAT with `repo`; user token for Copilot |
| `GITHUB_ERROR_REPO_OWNER` / `GITHUB_ERROR_REPO_NAME` | No | Repo for issues (default FitNexa) |
| `GITHUB_ERROR_LABELS` | No | e.g. `bug,auto-reported` |
| `GITHUB_COPILOT_ASSIGN_ISSUES` | No | `true` to assign each issue to Copilot |
| `GITHUB_COPILOT_BASE_BRANCH` | No | Default `main` |
| `GITHUB_COPILOT_CUSTOM_INSTRUCTIONS` | No | Optional instructions for Copilot |

Backend services need `LOGGING_URL` set so errors are reported. See [Error Reporting and GitHub Tickets](error-reporting-and-github-tickets.md).

---

## 7. OpenAI – Error Ticket Analysis

**Used by:** Logging service.  
**Purpose:** Post an "AI Analysis" comment on each new error issue.

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | No | If set, analysis comment is added |
| `AI_ANALYSIS_ENABLED` | No | `false` to disable |
| `AI_ANALYSIS_MODEL` | No | Default `gpt-4o-mini` |

---

## 8. Stripe – Payments / Go Live

**Used by:** Wizard service  
**Purpose:** "Go Live" checkout flow for production deployment / licensing when gym admins upgrade from UAT to production.

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | **Yes** | Stripe secret key | `sk_test_...` or `sk_live_...` |
| `STRIPE_PRICE_ID` | **Yes** | Price ID for the subscription | `price_xxx` |
| `STRIPE_WEBHOOK_SECRET` | **Yes** (prod) | Webhook signing secret | `whsec_...` |
| `FRONTEND_URL` | No | Redirect URL after checkout | `https://admin.uat.gymia.fit` |

### How to Get the Keys

1. [Stripe Dashboard](https://dashboard.stripe.com) → **Developers → API keys**
   - Copy **Secret key** → `STRIPE_SECRET_KEY`
2. **Products** → Create/select product → Add Price → Copy Price ID → `STRIPE_PRICE_ID`
3. **Developers → Webhooks** → Add endpoint (e.g. `https://api.uat.gymia.fit/wizard/webhooks/stripe`)
   - Select event: `checkout.session.completed`
   - Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### Local Development

Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks:

```bash
stripe listen --forward-to localhost:3006/webhooks/stripe
```

### Fallback

If `STRIPE_SECRET_KEY` or `STRIPE_PRICE_ID` is not set, `MockPaymentService` is used; checkout will not process real payments.

---

## 9. Google Gemini – AI Food Scanning

**Used by:** Nutrition service  
**Purpose:** AI-powered food recognition / nutrition scanning.

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | **Yes** | Google AI Studio API key | `AIza...` |

### How to Get the Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key for Gemini
3. Set `GEMINI_API_KEY` in the nutrition-service environment

### Fallback

None; features requiring Gemini will fail without a valid key.

---

## 10. Vercel – Frontend Hosting

**Used by:** CI/CD (GitHub Actions)  
**Purpose:** Deploying frontend apps (Landing, Gym Admin, Super Admin, Onboarding).

### GitHub Secrets (per repo or org)

| Secret | Required | Description |
|--------|----------|-------------|
| `VERCEL_TOKEN` | **Yes** | Vercel deploy token |
| `VERCEL_ORG_ID` | Yes (some flows) | Vercel team/org ID |
| `VERCEL_PROJECT_ID` | Yes (per app) | Vercel project ID |

### How to Get the Keys

1. [Vercel Dashboard](https://vercel.com/account/tokens) → **Tokens** → Create token
2. Copy token → `VERCEL_TOKEN`
3. **Settings → General** → Team ID (org) and Project ID

---

## 11. Expo / EAS – Mobile App Builds

**Used by:** `scripts/deploy-all.js`, `uat-build.yml`, mobile builds  
**Purpose:** Building production Android APKs and preview builds.

### Environment / Login

EAS CLI uses your Expo account. Run:

```bash
npx eas-cli login
```

For CI/CD, use `EXPO_TOKEN` (token from [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)).

---

## 12. JWT & Logging URL

- **JWT:** All backend services require `JWT_SECRET` and `JWT_REFRESH_SECRET` (min 32 chars) from shared config.
- **LOGGING_URL:** Set in each backend service so the error handler can POST errors to the logging service (`attachErrorHandler` with `reportUrl`).

---

## 13. SSH / VPS – Backend Deployment

**Used by:** Backend deployment, VPS access  
**Purpose:** Deploying the backend to Hetzner or other VPS.

### GitHub Secrets (fitnexa-backend or main repo)

| Secret | Required | Description |
|--------|----------|-------------|
| `SSH_HOST` | **Yes** | VPS IP or hostname |
| `SSH_PRIVATE_KEY` | **Yes** | SSH private key for deployment |
| `VPS_PATH` | No | Deployment directory on VPS |
| `VPS_USER` | No | SSH username (e.g. `root`) |

---

## Summary: Minimum Keys for Full Functionality

| Environment | Services You Need | Keys Required |
|-------------|-------------------|---------------|
| **Local dev** | None | None (mocks used for email, builds, payments) |
| **UAT (testing)** | Mailjet, GitHub, optional Logging | `MJ_*`, `GITHUB_TOKEN`; logging-service: `MONGO_URL`, `GITHUB_TOKEN`; backends: `LOGGING_URL` |
| **Production** | Mailjet, GitHub, Stripe, Vercel, EAS, Logging | All of the above + Stripe keys, Vercel token, Expo token; optional `OPENAI_API_KEY`, `GITHUB_COPILOT_ASSIGN_ISSUES` |

---

## Where to Set Keys

- **Local:** `fitnexa-backend/.env` (and service-specific `.env` files)
- **UAT / VPS:** Environment variables in Docker Compose or systemd
- **CI/CD:** GitHub Secrets in each repository
- **Vercel apps:** Project Settings → Environment Variables

---

Related: [Error Reporting and GitHub Tickets](error-reporting-and-github-tickets.md) · [Development Guide](../dev-workflows/development-guide.md) · [UAT Setup](uat-setup.md) · [Wizard Service](../backend/services/wizard-service.md)
