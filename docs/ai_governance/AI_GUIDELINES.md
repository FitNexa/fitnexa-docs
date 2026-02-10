# FitNexa AI & Developer Guidelines

This document establishes the "Zero-Magic" and "Human-First" principles for the FitNexa platform. All future development, whether by AI agents or human developers, must adhere to these standards.

## 🌟 Core Philosophy: Zero-Magic

The primary goal is **clarity**. Code should be self-documenting, explicit, and easy to understand without deep domain knowledge.

1.  **Explicit > Implicit**: Avoid "magical" auto-wiring or hidden behaviors.
2.  **Atomic Responsibility**: Components and files should have a single, well-defined purpose.
3.  **Human-Centric**: Write code that is easy for a human to read and debug 6 months from now.

---

## ✅ Definition of Done (Mandatory)

No feature is complete until it satisfies the following:

### 1. Robust Testing
*   **Unit Tests**: Every new function or complex logic block must have unit tests (Jest).
*   **Integration Tests**: Microservice flows and cross-component interactions must be verified.
*   **Edge Cases**: Tests must cover failure scenarios, not just the "happy path."

### 3. Transparent Rationale (Decision Log)
*   **Decision Log**: Every significant feature or refactor must be logged in `DECISION_LOG.md`.
*   **The "Why"**: Entries must explain the rationale behind implementation choices, not just what was done.
*   **Historical Context**: This log serves as the memory for future AI agents and human maintainers.

---

## 🏗️ Architectural Patterns

### Backend (Microservices)
*   **Standardization**: Always use `createBaseService` from `@fitnexa/shared` to bootstrap local Express apps.
*   **Consistency**: Standardize scripts (`dev`, `build`, `generate`, `db:push`) across all `package.json` files.
*   **Prisma**: Use the shared schema strategy for database access.

### Frontend (Mobile App)
*   **Atomic Design**: Keep components small. If a component exceeds 150 lines, it's a candidate for deconstruction.
*   **Hook Logic**: Decouple UI from business logic using focused, modular hooks.
*   **Theming**: Never hardcode colors. Use `ThemeContext` and `theme.colors`.

---

## 🤖 AI Interaction Guidelines

When an AI agent (like Antigravity or Cursor) works on this codebase, it must:
1.  **Read this file** at the start of every session.
2.  **Verify the build** and run tests after every significant change.
3.  **Refuse "Dirty Fixes"**: If a fix breaks an architectural pattern, the AI must propose a cleaner alternative or ask for clarification.
4.  **Auto-Document**: Automatically generate documentation for new features.
