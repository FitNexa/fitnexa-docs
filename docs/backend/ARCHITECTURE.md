---
sidebar_position: 1
title: "Backend Architecture"
description: "Technical deep-dive into the microservices ecosystem"
---
# Backend Architecture

The FitNexa backend is a microservices-based system built with Node.js, TypeScript, and Prisma.

## 🏗️ Structural Layers
Every microservice follows a standardized directory structure:
- `src/controllers/`: Request handling and response formatting.
- `src/services/`: Core business logic and external integrations.
- `src/repositories/`: Data access layer using Prisma.
- `src/models/`: Zod schemas and TypeScript types.

## 📡 Communication
- **Synchronous**: REST APIs via the Gateway.
- **Asynchronous**: RabbitMQ for logging, webhooks, and background processing.

## 🔐 Security
- **JWT**: Identity-based authentication.
- **Domain Enforcement**: Gym-level isolation for admin accounts.

---
Related: [System Overview](../overview/system-overview.md) · [Service Catalog](services-catalog.md) · [Error Handling](error-handling.md)
