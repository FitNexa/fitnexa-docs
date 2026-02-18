---
sidebar_position: 1
title: "Development Guide"
description: "Local development, testing, and deployment for the FitNexa platform"
---
# FitNexa Development Guide

## Overview

This guide covers local development, testing, and deployment for the FitNexa platform.

---

## Local Development

### Prerequisites

- Node.js 18+
- Docker Desktop (PostgreSQL, RabbitMQ, Redis, MongoDB)
- Git

### Setup

```bash
# 1. Install dependencies
npm install
npm run setup          # or npm run install:all

# 2. Start Docker services
docker-compose -f fitnexa-backend/docker-compose.yml up -d

# 3. Build shared library
npm run build:shared

# 4. Generate Prisma clients
npm run generate:all

# 5. Push database schemas
npm run db:push:all

# 6. Seed Iron Temple (optional)
node scripts/seed-iron-temple.js
```

### Running Services

```bash
# Interactive start (recommended)
npm run easy-start

# Or manually:
npm run dev:services   # Backend only
npm run start:mobile   # Mobile app (Expo)
npm run start:gym-admin
npm run start:super-admin
```

### Environment

- Copy `.env.example` to `.env` in `fitnexa-backend/`
- Key variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ALLOWED_ORIGINS`
- See [Third-Party Services and Keys](../infrastructure/third-party-services-and-keys.md) for Mailjet, Stripe, GitHub, OpenAI, Copilot, databases, and all API keys.

---

## Testing

```bash
npm run test:identity
npm run test:gym
npm run test:nutrition
# ... or npm test for all
```

- Unit tests: Jest in each service
- Integration tests: `*Integration*.test.ts`
- E2E: See [Architecture Audit](../overview/architecture-audit.md) for planned coverage

---

## Architecture

- [Architecture Audit](../overview/architecture-audit.md) – Gap analysis, roadmap
- [Implementation Summary](../overview/implementation-summary.md) – Delivered features

---

## Deployment

- Backend: Docker Compose or Kubernetes
- Frontend: Vercel (see GitHub workflows)
- Mobile: EAS Build for iOS/Android

See [UAT Setup](../infrastructure/uat-setup.md) and [Provider Integration](../infrastructure/provider-integration-guide.md).
