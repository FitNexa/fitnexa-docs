---
sidebar_position: 7
title: "Wizard Service"
description: "Multi-step state machine for onboarding and setup flows"
---
# Wizard Service

The Wizard Service manages long-running, multi-step state machines for onboarding.

## 🚀 Responsibilities
- **Session State**: Persisting progress across steps.
- **Validation**: Enforcing business rules before advancing steps.

## 🛠️ Technical Details
- **Port**: `3008`
- **Database**: `fitnexa_wizard` (PostgreSQL)

## 📡 API Endpoints
- `POST /`: Initialize a new wizard session.
- `GET /:sessionId`: Get current state.
- `PUT /:sessionId`: Update step data and advance.

---
Related: [Onboarding App](../../frontend/apps/onboarding.md) · [Shared Wizard Logic](../../shared/overview.md)
