---
sidebar_position: 2
title: "Gym Admin"
description: "The Chameleon Portal for gym management"
---
# Gym Admin

The Gym Admin is our "Chameleon" application. It is a single codebase that dynamically adapts to the branding of whichever gym is being managed.

## 🦎 The Chameleon Pattern
1. **Detection**: The app detects the gym context via subdomain or path segment (e.g., `gym-a.fitnexa.com` or `/gym-a/dashboard`).
2. **Fetch**: `GymConfigContext` fetches the branding JSON from the **Gym Service**.
3. **Inversion**: The branding JSON is injected into CSS variables:
   ```css
   :root {
     --primary-color: #3b82f6;
     --logo-url: url('...');
   }
   ```

## 🔐 Auth & Roles
- Requires `GYM_ADMIN` role.
- Auth token is stored in `sessionStorage` to prevent cross-tab leaks between different gym contexts.

## 🛠️ Features
- **Dashboard**: Real-time occupancy and revenue stats.
- **Member Manager**: CRUD for gym members and plans.
- **Module Control**: Toggle features like Nutrition, Squads, and Challenges.

---
Related: [Frontend Overview](../overview.md) · [Gym Service](../../backend/services/gym-service.md)
