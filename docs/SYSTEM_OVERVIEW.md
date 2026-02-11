# FitNexa System Overview

FitNexa is a multi-tenant fitness platform designed for gyms and fitness centers. It provides a full-stack solution including a mobile application for members, gym-specific admin portals, and a scalable microservices backend.

## 📱 Mobile & Web Clients

- **FitNexa Mobile**: A React Native (Expo) application supporting multiple gym brands (e.g., Iron Temple, Green Theory). It uses dynamic theming to present a bespoke experience for each gym.
- **Gym Admin Portal**: A "Chameleon" React application that adapts its UI, branding, and available features based on the logged-in gym's configuration.
- **Super Admin Portal**: The management hub for onboarding new gyms, managing subscriptions, and system-wide settings.
- **Landing Page**: A marketing site (Next.js) for the platform itself.

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

    Identity & Gym & Content & Nutrition & Messaging & Squad & Wizard -- "Shared Logic" --> Shared[@fitnexa/shared]
    Logging --> Rabbit
    Logging --> Mongo
```

## 🔄 Core Flows

1. **Authentication**: Handled by the **Identity Service**. Users receive a JWT that is stored locally and sent with all subsequent requests.
2. **Branding**: Upon login/start, the **Mobile App** or **Gym Admin** fetches the gym's configuration from the **Gym Service** to set current themes and logic.
3. **Wizard flows**: The **Wizard Service** powers multi-step onboarding and setup flows (e.g., gym configuration, member onboarding), exposed via the gateway at `/wizard`.
4. **Observability**: Every service ships logs asynchronously via **RabbitMQ** to a dedicated **Logging Service**, which stores them in **MongoDB** for centralized analysis.
5. **Caching**: The **Messaging Service** uses **Redis** to minimize database load for high-frequency operations like chat history lookups.

---

## 📂 Documentation Sections

For deeper technical details, please refer to:

- **[Backend Architecture](backend/ARCHITECTURE.md)** · **[Services Catalog](backend/SERVICES_CATALOG.md)**
- **[Shared Package](SHARED_PACKAGE.md)** — `@fitnexa/shared` exports and usage (server vs client)
- **[Mobile App Mechanics](mobile/MECHANICS.md)** · **[Mobile Error Handling](mobile/ERROR_HANDLING.md)**
- **[Infrastructure & Logging](infrastructure/LOGGING_&_OBSERVABILITY.md)**
- **[Contributing Guide](dev_workflows/CONTRIBUTING.md)** · **[Monorepo Scripts](dev_workflows/MONOREPO_SCRIPTS.md)**
- **[Architecture Review](ARCHITECTURE_REVIEW.md)** · **[UAT Setup Guide](UAT_SETUP_GUIDE.md)**
