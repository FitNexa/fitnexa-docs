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

The `scripts/deploy-uat.sh` script runs on the VPS and produces **timestamped, step-by-step logs** for easier debugging. It:

1. **Step 1/5 – Check configuration**  
   Verifies `docker-compose.uat.deploy.yml` and `fitnexa-backend/.env.uat` (warns if `.env.uat` is missing).

2. **Step 2/5 – Remove conflicting containers**  
   Force-removes any leftover static UAT containers (e.g. `fitnexa-uat-gateway`, `fitnexa-loki`, postgres, caddy, mongo, rabbitmq, redis) to avoid "container name already in use" on re-deploy.

3. **Step 3/5 – Build and start**  
   Runs `docker compose -f ... up -d --build --remove-orphans` using `fitnexa-backend/docker-compose.uat.deploy.yml` and `fitnexa-backend/.env.uat`.

4. **Step 4/5 – Wait and show status**  
   Waits 30s, then prints `docker compose ps -a`, warns if any container is unhealthy, and prints the last 30 lines of logs per service (backend services plus **loki**, **alloy**, **grafana** when using the deploy compose).

5. **Step 5/5 – Gateway health**  
   Polls `GATEWAY_URL/health` (default `http://localhost:3000`) until healthy or timeout, then prunes unused images and prints a short summary (gateway URL, firewall reminder for 80/443).

Every log line is prefixed with `[YYYY-MM-DD HH:MM:SS]`. If a deploy fails, check the step where it stopped and the per-service logs for that run.

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
| `SSH_HOST` | VPS IP address or hostname (e.g. for `root@$SSH_HOST`) |
| `SSH_PRIVATE_KEY` | SSH private key for deployment (e.g. ed25519); written as `~/.ssh/id_ed25519` in the workflow |

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
| `MJ_APIKEY_PUBLIC`, `MJ_APIKEY_PRIVATE` | Mailjet API keys for sending activation emails |

## Frontend Deployment

Frontend applications are deployed to Vercel automatically on push to the `main` branch. Each app has its own Vercel project connected to the corresponding subdirectory.

---

Related: [Single Domain Vercel](single-domain-vercel.md) | [Environment Variables](../dev-workflows/environment-setup.md) | [Gym Onboarding Flow](../features/gym-onboarding-flow.md) | [Recent Changes](../dev-workflows/recent-changes.md) (deploy script and ESM fixes)
