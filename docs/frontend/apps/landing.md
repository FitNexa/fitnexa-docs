---
sidebar_position: 1
title: "Landing Page"
description: "Marketing site architecture and tech stack"
---

# Landing Page

The FitNexa Landing Page is a high-performance marketing site designed to showcase the platform and convert visitors into gym clients.

## Tech Stack

- **Framework**: Vite + React 19
- **Styling**: TailwindCSS v4
- **Animations**: Framer Motion
- **Internationalisation**: i18next (EN, IT, ES)
- **CMS**: Local markdown files for blog posts

## Key Components

### Hero

Dynamic entrance animations with a primary CTA linking to the onboarding wizard.

### BrandPreview

The interactive "Chameleon Engine" demo. Visitors can:

- Enter a custom gym name
- Select a primary colour (6 presets or a custom hex picker)
- Toggle between mobile app and desktop admin previews
- See the live-rendered mockup update in real time

The "Start Building Your App" button passes the selected `gymName` and `primaryColor` as query parameters to the onboarding wizard URL.

### How It Works

A four-step visual guide showing the end-to-end journey:

1. **Build Your Brand** - Pick name, colours, and logo with a live preview
2. **Complete Onboarding** - Choose features and submit admin details
3. **Customise in Dashboard** - Fine-tune branding, toggle modules, connect socials
4. **Generate and Test APK** - Hit the build button and download a branded Android APK

Includes a "Start Building Now" CTA at the bottom.

### BenefitsGrid

Feature highlights and value propositions for gym owners.

## Page Structure

```
Home.tsx
  Hero
  BrandPreview
  HowItWorks
  BenefitsGrid
  Footer
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Used for fetching recent blog posts or stats |
| `VITE_ONBOARDING_URL` | Link to the self-service registration wizard |

---

Related: [Frontend Overview](../overview.md) | [Onboarding App](onboarding.md) | [Gym Onboarding Flow](../../features/gym-onboarding-flow.md)
