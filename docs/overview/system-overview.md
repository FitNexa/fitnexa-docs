---
sidebar_position: 1
title: "System Overview"
description: "High-level architecture and component overview of the FitNexa platform"
---
# System Overview

FitNexa is a multi-tenant fitness platform designed for gyms and fitness centers. It provides a full-stack solution including a mobile application for members, gym-specific admin portals, and a scalable microservices backend.

## 📱 Mobile & Web Clients

- **Landing Page**: A marketing site built with **Vite, React 19, and TailwindCSS v4**, deployed on Vercel.
- **Onboarding Wizard**: A self-service setup flow for new gym clients built with Vite, React, and TailwindCSS.
- **Gym Admin Portal**: A "Chameleon" React application that adapts its UI, branding, and available features based on the logged-in gym's configuration.
- **Super Admin Portal**: The management hub for onboarding new gyms, managing subscriptions, and system-wide settings.
- **FitNexa Mobile**: A React Native (Expo) application supporting multiple gym brands. It uses dynamic theming to present a bespoke experience for each gym.

## ⚙️ Backend Architecture

The backend is built as a set of Node.js microservices coordinated by an API Gateway.

```mermaid
graph TD
    Client[Mobile/Web Client] -- "HTTP/WebSockets" --> Gateway[API Gateway]
    
    subgraph "Backend Ecosystem"
        Gateway --> Identity[Identity Service]
        Gateway --> Gym[Gym Service]
        Gateway --> Content[Content Service]
        Gateway --> Nutrition[Nutrition Service]
        Gateway --> Messaging[Messaging Service]
        Gateway --> Squad[Squad Service]
        Gateway --> Wizard[Wizard Service]
        Gateway --> Logging[Logging Service]
    end

    subgraph "Infrastructure"
        DB[(PostgreSQL)]
        Redis[(Redis Caching)]
        Rabbit[(RabbitMQ Bus)]
        Mongo[(MongoDB Logs)]
    end

    subgraph "Clients"
        Landing[Landing Page]
        Onboarding[Onboarding App]
        GymAdmin[Gym Admin]
        SuperAdmin[Super Admin]
        Mobile[Mobile App]
    end

    Landing & Onboarding & GymAdmin & SuperAdmin & Mobile -- "ApiClient" --> Gateway
    Identity & Gym & Content & Nutrition & Messaging & Squad & Wizard -- "Shared Logic" --> Shared[@fitnexa/shared]
    Logging --> Rabbit
    Logging --> Mongo
```

## 🔄 Core Flows

1. **Authentication**: Handled by the **Identity Service**. Users receive a JWT that is stored locally and sent with all subsequent requests. Supports domain-enforcement for gym-specific logins.
2. **Onboarding Flow**: Gym registration via **Onboarding Wizard** → admin account creation → activation email → gym-specific configuration setup.
3. **Dynamic Branding**: The "Chameleon Engine" stores gym-specific themes (colors, logos, assets) in **GymConfig**. Frontend apps fetch this at runtime and inject styles as CSS variables or React context.
4. **Wizard Flows**: The **Wizard Service** handles multi-step stateful flows (onboarding, feature setup), exposed via the gateway at `/wizard`.
5. **Observability**: Every service ships logs asynchronously via **RabbitMQ** to a dedicated **Logging Service**, which stores them in **MongoDB** for centralized analysis.

---

Related: [Architecture Review](architecture-review.md) · [Backend Architecture](../backend/architecture.md) · [Frontend Overview](../frontend/overview.md)
