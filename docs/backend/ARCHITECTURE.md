# Backend Architecture Deep Dive

The FitNexa backend is a distributed system designed for scalability, isolation, and observability.

## 🛠️ Tech Stack
- **Runtime**: Node.js (TypeScript)
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Messaging**: RabbitMQ (amqplib)
- **Caching**: Redis (ioredis)
- **Logging**: Winston + MongoDB
- **Shared Library**: `@fitnexa/shared` (Custom internal package)

## 📦 Service Design Patterns

### 1. Database per Service
Each microservice owns its own database schema (e.g., `fitnexa_identity`, `fitnexa_gym`). This ensures that a schema change in one service never breaks another.

### 2. API Gateway (Gatekeeper)
The Gateway (Port 3000) acts as the single entry point. It handles:
- **Routing**: Mapping client requests to downstream services.
- **Health Monitoring**: Aggregating readiness/liveness of all services.
- **Cross-Component Auth**: (Future) Centralized token validation.

### 3. Shared Core Library (`@fitnexa/shared`)
To avoid code duplication, common logic is moved to a local shared package. It supports **sub-path exports** for granular imports:
- **`@fitnexa/shared/types`**: Shared interfaces for users, gyms, and events.
- **`@fitnexa/shared/api`**: Platform-agnostic API clients.
- **`@fitnexa/shared/logger`**: Environment-aware logging (Console in browser, Winston in Node).
- **`@fitnexa/shared/middleware`**: Error handling, correlation IDs, performance monitoring.

## 📡 Communication Patterns

### Synchronous (REST)
Used for immediate requests where a response is required (e.g., Login, Fetching Workouts).

### Asynchronous (Events)
Used for non-blocking operations to improve resilience and performance:
- **Logging**: Services publish logs to the `logs` exchange in RabbitMQ.
- **Cross-Service Sync**: (e.g., When a user is deleted in Identity, notify other services).

### Real-time (WebSockets)
Handled via `socket.io` in specific services like **Messaging** and **Squad Service** for instant notifications and chat.

---

## 🔗 Related Links
- **[Services Catalog](SERVICES_CATALOG.md)** - Port mappings and specific logic.
- **[Infrastructure Layout](../infrastructure/LOGGING_&_OBSERVABILITY.md)** - Details on RabbitMQ and Mongo.
