---
sidebar_position: 4
title: "Branding & Theming"
description: "Dynamic branding mechanics in the React Native app"
---
# Mobile Branding & Theming

The mobile app implements dynamic white-labeling similarly to the Gym Admin, adapting its theme based on the gym's configuration.

## 🎨 Theme Context
The app uses a `ThemeProvider` at the root that consumes branding data fetched from the **Gym Service**.

### Branding Config (`branding.js`)
Original hardcoded values are being migrated to dynamic properties:
- `primary`: Hex code for buttons and headers.
- `secondary`: Accents and sub-headers.
- `fonts`: Custom font families injected via Expo Fonts.

## 🏗️ Themed Components
Developers should use the provided themed primitives instead of raw React Native components:

- **`ThemedText`**: Automatically adapts color based on `text.primary` or `text.secondary`.
- **`ScreenWrapper`**: Sets background gradients and status bar colors based on the current theme.

---
Related: [Gym Service](../backend/services/gym-service) · [Gym Admin](../frontend/apps/gym-admin)
