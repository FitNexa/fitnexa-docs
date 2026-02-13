# FitNexa UAT Environment Setup Guide

This guide documents the setup of the User Acceptance Testing (UAT) environment on Hetzner Cloud and Vercel, automated via GitHub Actions.

## 1. Architecture Overview

-   **Backend**: Hosted on Hetzner Cloud (VPS).
    -   IP: `89.167.47.120` (HTTPS Enabled)
    -   Services: Gateway, Identity, Gym, Nutrition, Content, Squad, Wizard, Messaging, Logging, Postgres (Dockerized).
-   **Frontend**: Hosted on Vercel.
    -   Gym Admin: `fitnexa-gym-admin-uat.vercel.app`
    -   Super Admin: `fitnexa-super-admin-uat.vercel.app`
-   **CI/CD**: GitHub Actions deploys automatically on push to `main`.

## 2. GitHub Secrets Configuration

Since you are on a **Free GitHub Organization Plan**, you cannot use "Organization Secrets" for private repos. You must add the following secrets to **EACH** repository (`fitnexa-backend`, `fitnexa-admin`, `fitnexa-shared`):

Go to: `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

| Secret Name | Value | Description |
| :--- | :--- | :--- |
| `SSH_HOST` | `89.167.47.120` | IP of the UAT VPS |
| `SSH_PRIVATE_KEY` | *(Paste your github-actions-key)* | Private SSH key for deployments |
| `VERCEL_TOKEN` | *(User Generated)* | Create at [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | `team_yO1PspykK1To83i2YnJSTw4X` | Vercel Team ID |
| `VERCEL_PROJECT_ID_GYM` | `prj_47X009Ji7AgAVG4jfIBjbsWxEgjQ` | Gym Admin Project ID |
| `VERCEL_PROJECT_ID_SUPER` | `prj_lYJ4y5YKrTn39bY3tqWECHgzXPpi` | Super Admin Project ID |
| `GH_PAT` | *(User Generated)* | Personal Access Token with `repo` scope |

## 3. Deployment Workflows

We have separated workflows for each repository. Ensure these files exist in your repos:

### A. FitNexa Backend (`fitnexa-backend`)
File: `.github/workflows/deploy-backend.yml`
-   Checkouts `fitnexa-backend` and `fitnexa-shared`.
-   Archives code and copies to VPS.
-   Runs deployment script via SSH.

### B. FitNexa Admin (`fitnexa-admin`)
Workflows in `.github/workflows/`:
-   **deploy-gym-admin.yml**: Deploys Gym Admin to Vercel.
-   **deploy-super-admin.yml**: Deploys Super Admin to Vercel.
-   Each checks out `fitnexa-admin` (and `fitnexa-shared` if needed), uses Vercel CLI and tokens to deploy the corresponding project.

### C. FitNexa Shared (`fitnexa-shared`)
File: `.github/workflows/shared-ci.yml` (or equivalent)
-   Runs tests/checks to ensure shared library integrity.

## 4. Testing & Verification

We've implemented a unified testing utility to make it easy to verify both Local and UAT environments.

### Easy Test Utility
Run the following command in the project root:
```bash
npm run easy-test
```
This interactive script allows you to:
1.  **Select Environment**: Local (localhost) or UAT (https://89.167.47.120).
2.  **Select Test Mode**: Standard Run (plain `npm test` per service) or Coverage Report (`npm test -- --coverage`).
3.  **Run**: Executes the test script for each backend service that has one (gateway, identity, gym, content, squad, nutrition, wizard, messaging, logging). Use this to verify unit tests locally or against UAT. For health checks and integration tests, use `npm run health-check` and `npm run test:integration` as needed.

### Manual Verification
**Backend Health Check** (Option B: API on subdomain):
-   URL: `https://api.uat.gymia.fit/health` (or root)
-   Or by IP: `https://89.167.47.120/health` if still using fallback `:80` block
-   Check Docker: `ssh root@89.167.47.120 "docker ps"`

**Frontend Access**:
-   Landing (after DNS): https://uat.gymia.fit (Vercel)
-   Gym Admin: https://fitnexa-gym-admin-uat.vercel.app (or e.g. https://irontemple.uat.gymia.fit once configured)
-   Super Admin: https://fitnexa-super-admin-uat.vercel.app (or https://admin.uat.gymia.fit once configured)

## 5. Troubleshooting

**"Impossibile raggiungere il sito" / ERR_CONNECTION_REFUSED (Connection refused on 89.167.47.120)**  
If the browser cannot reach the server at all:

1. **Firewall**: On the VPS, open ports 80 and 443 (Caddy listens here). Example:
   ```bash
   ssh root@89.167.47.120
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw reload
   ufw status
   ```
   If you use another firewall (e.g. iptables or the cloud provider’s firewall), allow inbound TCP 80 and 443.

2. **Deploy ran**: The stack (including Caddy) is deployed by GitHub Actions on push to `main` of the repo that runs the workflow. Ensure:
   - The latest code (with Caddy in `docker-compose.uat.deploy.yml`) is on `main` and the deploy workflow has run successfully.
   - In GitHub: **Actions** → **Deploy Backend** → last run green.

3. **Check on the server**:
   ```bash
   ssh root@89.167.47.120 "docker ps"
   ```
   You should see `fitnexa-uat-caddy` (and gateway, identity, etc.). If Caddy is missing, the deploy may have failed or used an older compose.
   ```bash
   ssh root@89.167.47.120 "curl -s -o /dev/null -w '%{http_code}' http://localhost:80"
   ```
   Should return `200` if Caddy is running. If this works but the browser still gets connection refused, the firewall is blocking external access.

4. **`.env.uat` on the server**: The deploy script requires `.env.uat`. On first setup, create it on the VPS (e.g. in the same directory from which the deploy script runs after unpacking the tarball, or in `fitnexa-backend/`) so that the GitHub Actions deploy can succeed.

**"Permission Denied (publickey)"**:
-   Check `SSH_PRIVATE_KEY` in GitHub Secrets.
-   Ensure public key is in `~/.ssh/authorized_keys` on VPS.

**"Vercel Deployment Failed"**:
-   Check `VERCEL_TOKEN` validity.
-   Ensure Project IDs match the Vercel project settings.

**"squad-service is unhealthy" / "dependency failed to start"** (Docker Compose):
-   The squad container’s healthcheck is failing, so dependent services never start.
-   **1) Check squad logs**: `docker logs fitnexa-backend-squad-service-1` (or your squad container name). If the app crashes (e.g. missing env, port in use), fix that first.
-   **2) Relax or fix the healthcheck** in `fitnexa-backend/docker-compose.yml` for the squad service:
  - Ensure the service exposes a **HTTP** `/health` (or the path your healthcheck uses). Squad uses Socket.io; the healthcheck must hit an HTTP endpoint, not a socket.
  - Give the service more time to start: e.g. `start_period: 30s`, `interval: 10s`, `retries: 5`.
  - Example healthcheck that waits longer and uses a simple curl:
    ```yaml
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3005/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    ```
  - If the squad service does not expose `/health`, add a minimal GET `/health` route in the squad app that returns 200, or temporarily **disable** the healthcheck so other services can start:
    ```yaml
    healthcheck:
      disable: true
    ```
-   **3) Use an override**: From the dev-environment repo, copy `scripts/docker-compose.override.example.yml` into `fitnexa-backend/` as `docker-compose.override.yml` to apply a more lenient squad healthcheck without editing the main compose file.
