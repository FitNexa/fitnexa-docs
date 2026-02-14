---
sidebar_position: 2
title: "Single Domain Vercel"
description: "How to configure a single custom domain for the entire platform suite"
---
# Single Domain Deployment

This document describes how to use **one main domain** for the full FitNexa flow: landing page, onboarding, **per-gym admin on a subdomain**, and mobile app builds.

## 🏗️ Architecture
We use **Option B**: The backend is served at `api.uat.gymia.fit`, while the root `uat.gymia.fit` is managed by Vercel for the frontends.

## 🚀 Step-by-Step Configuration

### Phase 1: API (Backend)
The backend uses **Caddy** to serve only `api.uat.gymia.fit`.
- **Scripts**: `build-mobile-uat`, `easy-setup`, and `easy-test` are configured for this URL.
- **Action**: Add an **A** record for `api.uat.gymia.fit` pointing to your backend IP.

### Phase 2: DNS (Vercel)
We recommend managing DNS in Vercel for simplicity.

1. **Root Domain**: `uat.gymia.fit` -> Landing Project.
2. **Super Admin**: `admin.uat.gymia.fit` -> Super Admin Project.
3. **Gym Admin (Wildcard)**: `*.uat.gymia.fit` -> Gym Admin Project.

### Phase 3: Gym Admin (Tenant Resolution)
The Gym Admin app resolves the tenant from the hostname:
```ts
const hostname = window.location.hostname;
const baseDomain = 'uat.gymia.fit';
const gymSlug = hostname.endsWith(`.${baseDomain}`)
  ? hostname.slice(0, -(`.${baseDomain}`.length))
  : null;
```

---
Related: [UAT Setup](uat-setup.md) · [System Overview](../overview/system-overview.md)
