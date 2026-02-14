---
sidebar_position: 3
title: "Environment Setup"
description: "Master list of environment variables across the FitNexa monorepo"
---
# Environment Setup

FitNexa uses `.env` files for configuration. Each app/service has a `.env.example` file as a reference.

## ⚙️ Backend Services
These variables are typically required for all microservices:

| Variable       | Required | Description                                 |
| -------------- | -------- | ------------------------------------------- |
| `DATABASE_URL` | ✅        | PostgreSQL connection string                |
| `JWT_SECRET`   | ✅        | Secret for signing JWTs                     |
| `RABBITMQ_URL` | ❌        | RabbitMQ connection (defaults to localhost) |
| `REDIS_URL`    | ❌        | Redis connection (defaults to localhost)    |

## 🖥️ Web Applications
Web apps use the `VITE_` prefix for client-side accessibility.

| Variable              | App     | Description                                 |
| --------------------- | ------- | ------------------------------------------- |
| `VITE_API_URL`        | All     | Gateway URL (e.g., `http://localhost:3000`) |
| `VITE_APP_ENV`        | All     | `development`, `staging`, or `production`   |
| `VITE_ONBOARDING_URL` | Landing | Link to the onboarding wizard app           |

## 📱 Mobile App
| Variable  | Description                               |
| --------- | ----------------------------------------- |
| `API_URL` | Target API Gateway                        |
| `GYM_ID`  | Default gym for development local testing |

:::warning
**Security**: Never commit actual `.env` files to source control. Ensure they are listed in `.gitignore`.
:::

---
Related: [Quick Start](../overview/quick-start.md) · [UAT Setup](../infrastructure/uat-setup.md)
