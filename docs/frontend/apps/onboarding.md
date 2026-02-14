---
sidebar_position: 4
title: "Onboarding App"
description: "Self-service gym registration wizard"
---
# Onboarding App

The Onboarding App is a specialized application built around the **Wizard Service** to enable self-service registration for new gyms.

## 🌊 Planned Flow
1. **Gym Info**: Basic details (name, location, contact).
2. **Branding**: Initial set of colors and logo upload.
3. **Features**: Selection of modules (Nutrition, Squads, etc.).
4. **Account Creation**: Creating the primary `GYM_ADMIN` user.
5. **Review & Pay**: Summary and subscription activation.

## 🛠️ Implementation
- **WizardLayout**: Uses the standardized wizard UI from `@fitnexa/shared`.
- **State Management**: Uses `WizardProvider` to persist progress between steps.

:::info
Status: **🚧 Skeleton**. The app is currently a Vite template under development.
:::

---
Related: [System Overview](../../overview/system-overview.md) · [Wizard Service](../../backend/services/wizard-service.md)
