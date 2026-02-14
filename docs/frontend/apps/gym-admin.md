---
sidebar_position: 2
title: "Gym Admin"
description: "The Chameleon Portal for gym management"
---

# Gym Admin

The Gym Admin is our "Chameleon" application. It is a single codebase that dynamically adapts to the branding of whichever gym is being managed.

## The Chameleon Pattern

1. **Detection**: The app detects the gym context via subdomain or path segment (e.g., `gym-a.fitnexa.com` or `/gym-a/dashboard`).
2. **Fetch**: `GymConfigContext` fetches the branding JSON from the **Gym Service**.
3. **Inversion**: The branding JSON is injected into CSS variables:
   ```css
   :root {
     --primary-color: #3b82f6;
     --logo-url: url('...');
   }
   ```

## Auth and Roles

- Requires `GYM_ADMIN` role.
- Auth token is stored in `sessionStorage` to prevent cross-tab leaks between different gym contexts.

## Features

### Dashboard

Real-time overview with occupancy, revenue, check-in, and member count widgets. Includes the **WizardReview** component that displays the current mobile app build status.

### Member Manager

CRUD for gym members and plans.

### Module Control

Toggle features like Nutrition, Squads, and Challenges.

### Gym Setup Page (NEW)

Located at `/:gymId/setup`. Accessible via the "Gym Setup" (wrench icon) entry in the sidebar. Provides a tabbed configuration editor:

| Tab | Description |
|-----|-------------|
| **Branding** | Edit gym name, primary colour, secondary colour, and logo URL. Includes 10 colour presets and a custom hex input. Logo URL shows a live preview. |
| **Features** | Toggle 8 modules: nutrition, squads, challenges, workouts, check-in, marketing, store, AI scanner. |
| **Connections** | Set Instagram handle, Facebook URL, and support email address. |

All changes are persisted to the wizard session via `PUT /wizard/sessions/:id`.

**Key file**: `src/features/onboarding/components/GymSetup.tsx`

### Mobile App Build (WizardReview)

The WizardReview component on the dashboard allows gym admins to:

- **Request a UAT Build**: Triggers a GitHub Actions workflow that produces a branded Android APK.
- **Monitor Build Status**: Polls every 8 seconds while the build is QUEUED or BUILDING.
- **Download APK**: Shows a download link and QR code when the build succeeds.
- **Go Live**: Initiates a Stripe checkout for production deployment.

**Key file**: `src/features/onboarding/components/WizardReview.tsx`

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/:gymId/dashboard` | Dashboard | Main overview |
| `/:gymId/setup` | GymSetup | Branding, features, connections editor |
| `/:gymId/members` | MemberManager | Member CRUD |
| `/:gymId/modules` | ModuleControl | Feature toggles |

---

Related: [Frontend Overview](../overview.md) | [Gym Service](../../backend/services/gym-service.md) | [Gym Onboarding Flow](../../features/gym-onboarding-flow.md)