# Contributing Guide

Welcome to the FitNexa development team! Follow these guidelines to maintain code quality and consistency.

## 🛠️ Local Setup

1. **Infrastructure**: `docker-compose up -d` (Starts PG, Redis, Rabbit, Mongo).
2. **Shared Library**: Always run `npm run build` in `fitnexa-shared` (or `npm run build:shared` from root) after making changes.
3. **Services**: Use `npm run easy-start` in the root to launch the orchestrated environment (backend, admins, mobile). See **[Monorepo Scripts](MONOREPO_SCRIPTS.md)** for all root scripts.

## 🤝 Code Standards

- **TypeScript**: Strictly required for all new logic.
- **Clean Architecture**: Follow the Controller -> Service -> Repository pattern for microservices.
- **Logging**: Use the shared `createLogger` and include `correlationId` when logging errors.
- **Errors**: Throw `AppError` from `@fitnexa/shared` for consistent API error responses.

## 🚀 Workflows

### Adding a New API Endpoint
1. Define the route in the specific service's `routes.ts`.
2. Implement the controller logic.
3. Implement the business logic in a service class.
4. (Recommended) Update the service's `.yaml` Swagger documentation.

### Database Migrations
1. Modify `schema.prisma`.
2. Run `npx prisma migrate dev --name <description>`.
3. Re-generate the client: `npx prisma generate`.

### Running Tests
- **Root**: `npm run test:all` runs all backend service test suites (gym, identity, nutrition, squad, content, messaging, logging, wizard) in sequence.
- **Interactive**: `npm run easy-test` lets you choose environment (Local vs UAT) and mode (Standard Run or Coverage Report), then runs each service’s tests.
- **Per-service**: `npm run test:gym`, `npm run test:identity`, etc., or `npm run test` inside a service directory (e.g. `fitnexa-backend/services/gym-service`).
- **Integration**: `npm run test:integration` runs the gateway integration test suite.
- See **[Monorepo Scripts](MONOREPO_SCRIPTS.md)** for the full list.

---

## 🔗 Related Links
- **[Monorepo Scripts](MONOREPO_SCRIPTS.md)** — Root scripts (easy-start, easy-test, test:all, dev:services, etc.)
- **[AI & Developer Guidelines](../ai_governance/AI_GUIDELINES)** (Mandatory for ALL changes)
- **[Decision Log](../ai_governance/DECISION_LOG)** (Rationale for architectural choices)
- **[UAT Setup Guide](../UAT_SETUP_GUIDE.md)**
- **[System Overview](../SYSTEM_OVERVIEW.md)** · **[Shared Package](../SHARED_PACKAGE.md)**
