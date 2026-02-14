---
sidebar_position: 4
title: "Testing"
description: "Frontend testing strategy with Vitest and React Testing Library"
---
# Frontend Testing

All FitNexa web applications use **Vitest** and **React Testing Library** for unit and integration testing.

## ⚙️ Configuration
Testing is configured in `vite.config.ts` using the `test` property. 
- **Environment**: `jsdom`
- **Setup File**: `src/test/setup.ts` (handles i18n and global mocks)

## 🚀 Running Tests
```bash
# Run all tests
npm run test

# Run and watch
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🧪 Mocking Patterns

### ApiClient
Mock the centralized `ApiClient` to avoid real network calls:
```typescript
import { ApiClient } from '@fitnexa/shared';
import { vi } from 'vitest';

vi.mock('@fitnexa/shared', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ApiClient: {
      get: vi.fn(),
      post: vi.fn(),
    }
  };
});
```

### i18n
The test setup file automatically mocks `react-i18next` to return keys as-is.

---
Related: [Frontend Overview](overview.md) · [Backend Testing](../backend/testing.md)
