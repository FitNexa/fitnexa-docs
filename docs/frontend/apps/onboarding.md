---
sidebar_position: 4
title: "Onboarding App"
description: "Self-service gym registration wizard"
---

# Onboarding App

The Onboarding App is a specialised application built around the **Wizard Service** to enable self-service registration for new gyms.

## Flow

1. **Gym Info**: Basic details (name, location, contact). Pre-populated from landing page query params.
2. **Branding**: Initial primary colour selection with live preview.
3. **Features**: Selection of modules (Nutrition, Squads, Challenges, Workouts, Check-in, Marketing).
4. **Account Creation**: Creating the primary `GYM_ADMIN` user (name, email, phone).
5. **Review and Submit**: Summary of all selections. On submit, calls `POST /wizard/onboard`.
6. **Success**: Confirmation page instructing the user to check their email.

## Account Activation

After the wizard completes, the admin receives an activation email with a link to:

```
/activate?token=<64-char-hex>
```

The activation page:

1. Validates the token via `GET /wizard/activate/:token`
2. Displays a password-setting form
3. Submits via `POST /wizard/activate`
4. On success, redirects to the gym admin login page

## Implementation

- **WizardLayout**: Uses the standardised wizard UI from `@fitnexa/shared`.
- **State Management**: Uses `OnboardingContext` (React Context + `sessionStorage`) to persist progress between steps.
- **Pre-population**: Reads `gymName` and `primaryColor` from URL query params (passed by the landing page CTA).
- **API Communication**: Uses `ApiClient` from `@fitnexa/shared` to call wizard-service endpoints through the gateway.

## Key Files

| File | Description |
|------|-------------|
| `src/features/onboarding/components/OnboardingWizard.tsx` | Main multi-step wizard component |
| `src/features/onboarding/context/OnboardingContext.tsx` | State management for wizard data |
| `src/features/onboarding/components/WizardReview.tsx` | Build status and go-live section |
| `src/features/onboarding/components/ActivationPage.tsx` | Token validation and password set |
| `src/app/routes.tsx` | Route definitions including `/activate` |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API gateway base URL |
| `VITE_GYM_ADMIN_URL` | Redirect target after activation |

---

Related: [System Overview](../../overview/system-overview.md) | [Wizard Service](../../backend/services/wizard-service.md) | [Gym Onboarding Flow](../../features/gym-onboarding-flow.md)
