---
sidebar_position: 1
title: "Landing Page"
description: "Marketing site architecture and tech stack"
---
# Landing Page

The FitNexa Landing Page is a high-performance marketing site designed to showcase the platform and "The Playbook" blog.

## 🛠️ Tech Stack
- **Framework**: Vite + React 19
- **Styling**: TailwindCSS v4
- **Animations**: Framer Motion
- **CMS**: Local markdown files for blog posts

## 🎨 Key Components
- **BrandPreview**: The "Chameleon Engine" demo that allows users to see how the Gym Admin adapts to different branding in real-time.
- **Hero**: Dynamic entrance animations for conversion.

## 🌐 Environment Variables
| Variable              | Description                                  |
| --------------------- | -------------------------------------------- |
| `VITE_API_URL`        | Used for fetching recent blog posts or stats |
| `VITE_ONBOARDING_URL` | Link to the self-service registration wizard |

---
Related: [Frontend Overview](../overview.md) · [Onboarding App](onboarding.md)
