---
sidebar_position: 4
title: "Third-Party Services & API Keys"
description: "All external services used by FitNexa and the keys/credentials required for each"
---

# Third-Party Services & API Keys

This document lists every external service used by the FitNexa platform and the environment variables / secrets you need to configure.

---

## Overview

| Service | Purpose | Required For | Fallback |
|---------|---------|--------------|----------|
| **SendGrid** (SMTP) | Activation & welcome emails | Wizard service | MockEmailService (logs to console) |
| **GitHub** | Trigger UAT APK builds | Wizard service | MockBuildService |
| **Stripe** | Go Live checkout / production licensing | Wizard service | MockPaymentService |
| **Google Gemini** | AI food scanning (Nutrition) | Nutrition service | — |
| **Vercel** | Frontend hosting (Admin, Landing, etc.) | CI/CD | — |
| **Expo / EAS** | Mobile app builds | Production APKs | — |

---

## 1. SendGrid (SMTP) – Email Delivery

**Used by:** Wizard service  
**Purpose:** Sending activation emails and welcome emails during gym onboarding.

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SMTP_HOST` | No | SMTP server host | `smtp.sendgrid.net` (default) |
| `SMTP_PORT` | No | SMTP port | `587` (default) |
| `SMTP_USER` | No | SMTP username (SendGrid: use `apikey`) | `apikey` |
| `SMTP_PASS` | **Yes** | SMTP password / API key | Your SendGrid API key |
| `SMTP_FROM` | No | Sender address | `FitNexa <noreply@gymia.fit>` |

### How to Get the Key

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Go to **Settings → API Keys**
3. Create an API key with **Mail Send** permission
4. Copy the key and set `SMTP_PASS`

### Fallback

If `SMTP_PASS` is not set, the Wizard service uses `MockEmailService`, which logs emails to the console instead of sending them.

---

## 2. GitHub – APK Build Triggers

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

## 3. Stripe – Payments / Go Live

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

## 4. Google Gemini – AI Food Scanning

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

## 5. Vercel – Frontend Hosting

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

## 6. Expo / EAS – Mobile App Builds

**Used by:** `scripts/deploy-all.js`, `uat-build.yml`, mobile builds  
**Purpose:** Building production Android APKs and preview builds.

### Environment / Login

EAS CLI uses your Expo account. Run:

```bash
npx eas-cli login
```

For CI/CD, use `EXPO_TOKEN` (token from [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)).

---

## 7. Infrastructure / Deployment

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
| **UAT (testing)** | SendGrid, GitHub | `SMTP_PASS`, `GITHUB_TOKEN` |
| **Production** | SendGrid, GitHub, Stripe, Vercel, EAS | All of the above + Stripe keys, Vercel token, Expo token |

---

## Where to Set Keys

- **Local:** `fitnexa-backend/.env` (and service-specific `.env` files)
- **UAT / VPS:** Environment variables in Docker Compose or systemd
- **CI/CD:** GitHub Secrets in each repository
- **Vercel apps:** Project Settings → Environment Variables

---

Related: [UAT Setup](uat-setup.md) · [Gym Onboarding Flow](../features/gym-onboarding-flow.md) · [Wizard Service](../backend/services/wizard-service.md)
