---
sidebar_position: 3
title: "Super Admin"
description: "Global platform management and gym builder"
---
# Super Admin

The Super Admin is the internal control center for the FitNexa platform, used by platform operators to manage the entire fleet of gyms.

## 🔑 Permissions
- Requires the `SUPER_ADMIN` role.
- Access is globally managed via the **Identity Service**.

## 🏗️ The Gym Builder
A core feature of the Super Admin is the **Gym Builder**, which allows operators to configure a gym's branding and see a live preview.

- **PostMessage Coupling**: The Builder communicates with an iframe of the **Gym Admin** using `window.postMessage` to update styles in real-time without refreshing.

## 🛠️ Key Sections
- **Fleet Manager**: Overview of all registered gyms, their subscription status, and health.
- **Model Engine**: Interface for managing AI-generated workout and nutrition templates via Google Gemini.
- **Command Center**: Global revenue and user growth analytics.

---
Related: [Frontend Overview](../overview.md) · [Gym Admin](gym-admin.md)
