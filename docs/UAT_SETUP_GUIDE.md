# FitNexa UAT Environment Setup Guide

This guide documents the setup of the User Acceptance Testing (UAT) environment on Hetzner Cloud and Vercel, automated via GitHub Actions.

## 1. Architecture Overview

-   **Backend**: Hosted on Hetzner Cloud (VPS).
    -   IP: `89.167.47.120` (HTTPS Enabled)
    -   Services: Gateway, Identity, Gym, Nutrition, Content, Squad, Postgres (Dockerized).
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
File: `.github/workflows/deploy-admin.yml`
-   Checkouts `fitnexa-admin` and `fitnexa-shared`.
-   Installs Vercel CLI.
-   Deploys `gym-admin` and `super-admin` to Vercel using tokens.

### C. FitNexa Shared (`fitnexa-shared`)
File: `.github/workflows/shared-ci.yml`
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
2.  **Select Test Type**:
    *   **Smoke Check**: Pings all microservice health endpoints.
    *   **Integration Tests**: Runs the Jest suite against the selected target.
    *   **Unit Tests**: Runs internal service logic tests.

### Manual Verification
**Backend Health Check**:
-   URL: `https://89.167.47.120/health` (or root)
-   Check Docker: `ssh root@89.167.47.120 "docker ps"`

**Frontend Access**:
-   Gym Admin: https://fitnexa-gym-admin-uat.vercel.app
-   Super Admin: https://fitnexa-super-admin-uat.vercel.app

## 5. Troubleshooting

**"Permission Denied (publickey)"**:
-   Check `SSH_PRIVATE_KEY` in GitHub Secrets.
-   Ensure public key is in `~/.ssh/authorized_keys` on VPS.

**"Vercel Deployment Failed"**:
-   Check `VERCEL_TOKEN` validity.
-   Ensure Project IDs match the Vercel project settings.
