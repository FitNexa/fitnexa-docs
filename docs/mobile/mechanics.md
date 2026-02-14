---
sidebar_position: 1
title: "Mobile Mechanics"
description: "Core mechanics of the FitNexa React Native application"
---
# Mobile App Mechanics Guide

The FitNexa Mobile App is a multi-tenant React Native application built with Expo and NativeWind. Its core feature is the ability to shift its entire identity based on the gym it represents.

## 🌈 Multi-Branding Engine

We support multiple gym brands (e.g., "Iron Temple", "Green Theory") from a single codebase.

### How it works:
1. **Gym-Config**: Branding details are fetched from the **Gym Service**.
2. **ThemeContext**: A global provider manages the current brand's colors, typography, and logo.
3. **Asset Switching**: Dynamic asset resolution allows the app to load brand-specific splash screens and icons.

## 🎨 Dynamic Theming

All UI components use the `ThemeContext` instead of hardcoded colors.

```typescript
const { theme } = useTheme();
// ...
<View style={{ backgroundColor: theme.colors.primary }} />
```

### Components
- **ThemedText**: Automatically applies brand font families and colors.
- **ThemedButton**: Uses brand gradients and corner radii.
- **ScreenWrapper**: Provides standard padding and background based on theme.

## 🌍 Internationalization (i18n)

The app uses `i18next` for translation management.
- **Keys**: All UI strings are stored as keys in `src/i18n/locales/`.
- **Dynamic Translation**: Brand names and gym-specific terms are injected into translation strings to maintain white-labeling.

---

## 🔗 Related Links
- [Error Handling](error-handling.md)
- [Branding & Theming](branding.md)
- [System Overview](../overview/system-overview.md)
