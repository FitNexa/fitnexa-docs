# FitNexa Decision Log

This file tracks the rationale behind significant architectural and implementation decisions. It ensures that future AI agents and human developers understand "the why" behind the code.

---

## 2026-02-10: Standardized Microservice Bootstrap & Frontend Atomic Refactor

### Rationale
The project was suffering from high boilerplate duplication across microservices and "God Components" in the mobile app. This made the codebase harder to maintain and increased the cognitive load for developers (and token usage for AI).

### Decisions
1.  **Backend Bootstrap**: Created `createBaseService` in `@fitnexa/shared`.
    *   *Why*: To centralize infrastructure logic (security, logging, parsing) so individual services only contain business-relevant code.
2.  **Frontend Atomic Refactor**: Deconstructed `GroupChatScreen.tsx`.
    *   *Why*: High-complexity screens are fragile. Breaking them into `ChatLobby`, `MessageList`, and `ChatInput` makes them reusable and easier to test.
3.  **Modular Hooks**: Split `useGroupChat` into `useChatSocket`, `useChatHistory`, etc.
    *   *Why*: To keep the UI layer "dumb" and ensure business logic (Socket.io, REST history) can be tested and swapped independently.

---

## 2026-02-10: Implementation of AI Core Guidelines & Definition of Done

### Rationale
To prevent future "code rot" and ensure AI agents maintain the "Zero-Magic" standard.

### Decisions
1.  **Mandatory Tests/Docs**: AI must now generate unit tests, integration tests, and documentation for every feature.
2.  **Decision Log**: This file was established to preserve project memory and rationale, preventing AI from reverting to "magic" patterns in future sessions.
