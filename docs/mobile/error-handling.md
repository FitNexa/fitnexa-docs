---
sidebar_position: 2
title: "Error Handling"
description: "Client-side error patterns and correlation for the mobile app"
---
# Mobile Error Handling

The mobile app implements a multi-layer error handling strategy to provide a graceful user experience and detailed telemetry.

## 🛡️ Boundary layers
1. **Global Error Boundary**: Catches unhandled React component crashes.
2. **API Interceptors**: Catch 401 (Unauthorized), 403 (Forbidden), and 500 (Server Error) responses.
3. **Validation Errors**: Catch Zod validation failures before data reaches the API.

## 📡 Correlation & Logging
When an error occurs, the app:
1. Generates a `correlationId`.
2. Appends the current device state (OS, Version, Memory).
3. Ships the log to the **Logging Service**.

## 🚀 Usage in Hooks
Wrap API calls in standardized error handlers:
```typescript
try {
  await ApiClient.get('/gym/locations');
} catch (error) {
  handleApiError(error); // Shows toast & logs telemetry
}
```

---
Related: [Mobile Mechanics](mechanics) · [Backend Error Handling](../backend/error-handling)
