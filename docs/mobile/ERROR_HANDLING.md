# Mobile Error Handling & Correlation

To ensure high-quality support and fast debugging in a distributed system, the mobile app uses a sophisticated error correlation strategy.

## 🛡️ Global Error Boundary

The app is wrapped in a `GlobalErrorBoundary` component (`src/components/ui/GlobalErrorBoundary.tsx`).

### Features:
1. **Crash Capture**: It catches any unhandled JavaScript exceptions in the React tree.
2. **Correlation ID (Reference Code)**: When a crash occurs, it generates a unique "Reference Code".
3. **Centralized Reporting**: The crash details, including the stack trace and device info, are sent to the **Logging Service** asynchronously.
4. **User Feedback**: The user sees a friendly error screen with the Reference Code, making it easy to report issues to support.

## 🚢 Logging Utility

The `logger.ts` utility (`src/utils/logger.ts`) provides a standard way to ship logs from the client to the backend.

### Log Levels:
- **INFO**: Standard app lifecycle events.
- **WARN**: Unexpected states that aren't crashes.
- **ERROR**: Critical failures.

### Log Sink:
All mobile logs are sent via `POST` to `http://<gateway-url>:3009/logs`.

---

## 🔍 How to Debug
1. Get the **Reference Code** from the user.
2. Search the **MongoDB** `logs` collection for that code.
3. Trace the error across services using the same `correlationId`.
