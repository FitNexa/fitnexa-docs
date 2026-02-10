# Contributing Guide

Welcome to the FitNexa development team! Follow these guidelines to maintain code quality and consistency.

## 🛠️ Local Setup

1. **Infrastructure**: `docker-compose up -d` (Starts PG, Redis, Rabbit, Mongo).
2. **Shared Library**: Always run `npm run build` in `fitnexa-shared` after making changes.
3. **Services**: Use `npm run easy-start` in the root to launch the orchestrated environment.

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
- **Root**: `npm test` runs all backend test suites.
- **Individual**: `npm run test` within a service directory.

---

## 🔗 Related Links
- **[AI & Developer Guidelines](../ai_governance/AI_GUIDELINES)** (Mandatory for ALL changes)
- **[Decision Log](../ai_governance/DECISION_LOG)** (Rationale for architectural choices)
- **[UAT Setup Guide](../UAT_SETUP_GUIDE)**
- **[System Overview](../SYSTEM_OVERVIEW)**
