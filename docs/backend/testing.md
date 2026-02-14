---
sidebar_position: 5
title: "Testing"
description: "How to run and write tests for backend microservices"
---
# Backend Testing

We use **Jest** for all backend unit and integration tests.

## 🚀 Running Tests

```bash
# Test a specific service
npm run test:gym-service

# Run all tests across the platform
npm run test:all

# Run integration tests specifically
npm run test:integration
```

## 🧪 Best Practices
1. **Mock Prisma**: Use `jest-mock-extended` to mock the Prisma client in unit tests.
2. **Setup/Teardown**: Use `beforeEach` and `afterEach` for database cleaning in integration tests.
3. **Coverage Engine**: We aim for **80% coverage** on business logic services.

## 📁 File Conventions
- Unit tests: `src/services/__tests__/*.test.ts`
- Integration tests: `tests/integration/*.test.ts`

---
Related: [Backend Architecture](architecture.md) · [Frontend Testing](../frontend/testing.md)
