---
sidebar_position: 2
title: "Services Catalog"
description: "Inventory of all microservices and their technical details"
---
# Services Catalog

Index of all FitNexa backend microservices.

| Service       | Port | Database      | Primary Responsibility       |
| ------------- | ---- | ------------- | ---------------------------- |
| **Gateway**   | 3000 | -             | API Entry Point              |
| **Gym**       | 3002 | PostgreSQL    | Branding, Locations, Modules |
| **Identity**  | 3007 | PostgreSQL    | Auth, Users, RBAC            |
| **Content**   | 3003 | PostgreSQL    | Feed, Announcements, Media   |
| **Nutrition** | 3004 | PostgreSQL    | AI Meal Plans, Macros        |
| **Squad**     | 3005 | PostgreSQL    | Community, Group Workouts    |
| **Wizard**    | 3008 | PostgreSQL    | Onboarding State Machine     |
| **Messaging** | 3006 | MongoDB/Redis | Chat, Notifications          |
| **Logging**   | 3010 | MongoDB       | Centralized Logs             |

---
Detailed Guides: [Identity](services/identity-service.md) · [Gym](services/gym-service.md) · [Gateway](services/gateway.md)
