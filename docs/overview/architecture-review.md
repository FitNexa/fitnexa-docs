---
sidebar_position: 2
title: "Architecture Review"
description: "In-depth review of the FitNexa platform's architectural principles and tech debt"
---
# Architecture Review

This document provides a critical review of the current FitNexa architecture, identifying strengths and areas for improvement.

## 🏛️ Central Principles
1. **Multi-tenancy**: The system is designed to handle multiple gyms with a single instance of each microservice.
2. **Platform-first Shared Kernel**: The `@fitnexa/shared` package enforces consistency across backend, web, and mobile.
3. **Event-driven Observability**: All services ship telemetry via RabbitMQ.

## 🧩 Component Breakdown
- **Gateway**: Single point of entry for all 5 frontend clients. Handles request correlation and rate limiting.
- **Microservices**: Decoupled domains (Identity, Gym, Content, etc.) with private PostgreSQL databases.
- **Frontends**: Shared `ApiClient` and "Chameleon" branding engine.

## 🛠️ Tech Debt & Roadmap
- **Wizard Transitions**: Moving more onboarding logic to the `WizardService`.
- **Validation Consistency**: Enforcing `Zod` schemas across all shared types.
- **Mobile internationalization**: Completing the 40% missing translations for IT, ES, and FR.

---
Related: [System Overview](system-overview.md) · [Backend Architecture](../backend/architecture.md)
