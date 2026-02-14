---
sidebar_position: 2
title: "API Client"
description: "How to use the centralized @fitnexa/shared ApiClient for network requests"
---
# API Client

The `ApiClient` from `@fitnexa/shared` is the **mandatory** way to perform network requests across all FitNexa frontends. It ensures consistent error handling, header management, and base URL configuration.

## ⚙️ Configuration

Initialize the client once in your app's entry point (e.g., `main.tsx` or `App.tsx`):

```typescript
import { configureApiClient } from '@fitnexa/shared';

configureApiClient({ 
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000' 
});
```

## 🚀 Usage examples

### Standard Requests
```typescript
import { ApiClient } from '@fitnexa/shared';

// GET
const gyms = await ApiClient.get<Gym[]>('/gym/gyms');

// POST
const result = await ApiClient.post('/auth/login', { email, password });

// PUT
await ApiClient.put(`/gym/config/${gymId}`, updatedConfig);

// DELETE
await ApiClient.delete(`/gym/products/${id}`);
```

### File Uploads
```typescript
const formData = new FormData();
formData.append('file', file);

await ApiClient.upload('/users/profile/upload', formData);
```

## 🔐 Authentication
After a successful login, set the authorization header globally:

```typescript
configureApiClient({
  defaultHeaders: { Authorization: `Bearer ${token}` }
});
```

:::warning
**NEVER** use `axios` or raw `fetch()` directly in application code. Using `ApiClient` is required for telemetry, error tracking, and standardized response parsing.
:::

---
Related: [Frontend Overview](overview.md) · [Error Handling](../backend/error-handling.md)
