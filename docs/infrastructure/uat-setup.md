---
sidebar_position: 3
title: "UAT Setup"
description: "Guidelines for setting up a User Acceptance Testing environment"
---

# UAT Setup Guide

This guide outlines the process for deploying and configuring a UAT environment for FitNexa.

## Infrastructure

| Component | Hosting | Purpose |
|-----------|---------|---------|
| Landing Page | Vercel | Marketing site at gymia.fit |
| Onboarding App | Vercel | Self-service wizard at onboarding.uat.gymia.fit |
| Gym Admin | Vercel | Chameleon admin at admin.uat.gymia.fit |
| Super Admin | Vercel | Platform management |
| Backend Services | VPS (Docker Compose) | Microservices at api.uat.gymia.fit |
| PostgreSQL | Managed (Supabase / VPS) | Primary database |
| Redis | VPS | Caching layer |
| RabbitMQ | VPS | Async messaging |
| MongoDB | VPS | Log storage |

## Domain Mapping

UAT uses the following subdomains under `gymia.fit`:

- `gymia.fit` - Landing page
- `onboarding.uat.gymia.fit` - Onboarding wizard
- `admin.uat.gymia.fit` - Gym admin portal
- `api.uat.gymia.fit` - API gateway

## Backend Deployment

Backend services are deployed to the VPS via GitHub Actions using the `deploy-backend.yml` workflow.

### Deploy Script

The `scripts/deploy-uat.sh` script runs on the VPS and performs the following:

1. Verifies that `docker-compose.uat.deploy.yml` exists in `fitnexa-backend/`
2. Checks for `.env.uat` in `fitnexa-backend/` (warns if missing)
3. Runs `docker compose up -d --build --remove-orphans`
4. Displays container status after deployment

### CI/CD Workflow

The `deploy-backend.yml` GitHub Actions workflow:

1. Checks out the repository with `submodules: recursive`
2. Archives source code into a tarball (includes `fitnexa-backend`, `fitnexa-shared`, `fitnexa-admin`, and `scripts` directories)
3. Copies the archive to the VPS via SCP
4. Extracts the archive on the VPS
5. Runs `scripts/deploy-uat.sh`

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `VPS_HOST` | VPS IP address or hostname |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | SSH private key for deployment |
| `VPS_PATH` | Deployment directory on VPS |

## Mobile App Builds

UAT APK builds are triggered from the gym admin dashboard and run via GitHub Actions in the `fitnexa-mobile` repository.

### Build Flow

1. Gym admin clicks "Request UAT Build" in the dashboard
2. Wizard-service triggers `repository_dispatch` event via GitHub API
3. `uat-build.yml` workflow builds a branded APK
4. Workflow calls back to `POST /wizard/webhooks/build-complete`
5. Admin downloads the APK from the dashboard

### Required Environment Variables (wizard-service)

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | PAT with repo scope for triggering builds |
| `GITHUB_REPO_OWNER` | GitHub org (default: FitNexa) |
| `GITHUB_REPO_NAME` | Mobile repo (default: fitnexa-mobile) |
| `SMTP_PASS` | SMTP password for sending activation emails |

## Frontend Deployment

Frontend applications are deployed to Vercel automatically on push to the `main` branch. Each app has its own Vercel project connected to the corresponding subdirectory.

---

Related: [Single Domain Vercel](single-domain-vercel.md) | [Environment Variables](../dev-workflows/environment-setup.md) | [Gym Onboarding Flow](../features/gym-onboarding-flow.md)
