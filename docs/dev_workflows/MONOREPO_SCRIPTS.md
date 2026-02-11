# Monorepo Scripts Reference

This document describes the root-level scripts available in the FitNexa development environment (orchestration repo). Run these from the **repository root** (where the main `package.json` lives).

## 🚀 Development

| Script | Description |
|--------|--------------|
| `npm run easy-start` | **Interactive setup**: detects local IP, lets you choose gym (Iron Temple, Green Theory, FitLife), clears ports, starts PostgreSQL (Docker), backend microservices, admin dashboards (Gym Admin + Super Admin), mobile app (Expo), and optionally Prisma Studio. |
| `npm run dev:services` | Start **backend only**: Gateway, Identity, Gym, Content, Squad, Nutrition, Wizard, Messaging, Logging (all 9 services with colored prefixes). |
| `npm run dev:all` | Start **backend + mobile app** (Expo). |
| `npm run start:mobile` | Start the mobile app only (`fitnexa-mobile`). |
| `npm run start:gym-admin` | Start Gym Admin dashboard only. |
| `npm run start:super-admin` | Start Super Admin dashboard only. |
| `npm run start:landing` | Start the marketing landing page. |

## 🧪 Testing

| Script | Description |
|--------|--------------|
| `npm run easy-test` | **Interactive test utility**: 1) Choose target (Local or UAT), 2) Choose mode (Standard Run or Coverage Report), 3) Runs tests for every backend service that has a `test` script. Use this to run or get coverage against localhost or the UAT VPS. |
| `npm run test:all` | Run **all** backend service test suites in sequence: gym, identity, nutrition, squad, content, messaging, logging, wizard. No interaction required. |
| `npm run test:gym` | Run tests for Gym Service only. |
| `npm run test:identity` | Run tests for Identity Service only. |
| `npm run test:nutrition` | Run tests for Nutrition Service only. |
| `npm run test:squad` | Run tests for Squad Service only. |
| `npm run test:content` | Run tests for Content Service only. |
| `npm run test:messaging` | Run tests for Messaging Service only. |
| `npm run test:logs` | Run tests for Logging Service only. |
| `npm run test:wizard` | Run tests for Wizard Service only. |
| `npm run test:integration` | Run the **integration** test suite (Jest against `fitnexa-backend/tests/integration.config.js`). Requires `NODE_ENV=test`. |

## 📦 Build & Install

| Script | Description |
|--------|--------------|
| `npm run setup` / `npm run install:all` | Install dependencies in all services (via `scripts/install-all-services.js`). |
| `npm run install:shared` | Install dependencies in `fitnexa-shared`. |
| `npm run install:mobile` | Install dependencies in `fitnexa-mobile`. |
| `npm run install:gym-admin` | Install dependencies in Gym Admin. |
| `npm run install:super-admin` | Install dependencies in Super Admin. |
| `npm run install:landing` | Install dependencies in landing page. |
| `npm run build:shared` | Build the shared package (`fitnexa-shared`). **Run this after changing shared code** before building or running backend services. |

## 🗄️ Database

| Script | Description |
|--------|--------------|
| `npm run db:push:all` | Push Prisma schema to all service databases (identity, gym, nutrition, content, messaging). |
| `npm run generate:all` | Generate Prisma clients for identity, gym, nutrition, content, messaging. |
| `npm run generate:messaging` | Generate Prisma client for Messaging Service only. |
| `npm run seed:all` | Run seed script for all services (`scripts/seed-all.js`). |

## 🔧 Utilities

| Script | Description |
|--------|--------------|
| `npm run health-check` | Run health check script against configured services (`scripts/health-check.js`). |
| `npm run docs:dev` | Start the Docusaurus docs site in development mode. |
| `npm run docs:build` | Build the Docusaurus docs for production. |
| `npm run theme:mobile` | Generate Tailwind theme for mobile (Iron Temple, using local gateway). |
| `npm run theme:mobile:greentheory` | Generate Tailwind theme for Green Theory. |
| `npm run build:mobile:uat` | Build mobile app for UAT (`scripts/build-mobile-uat.js`). |
| `npm run deploy:all` | Run full deployment script (`scripts/deploy-all.js`). |
| `npm run test:e2e:full` | Run full E2E test suite (`scripts/test-e2e-full.js`). |

## 📍 Ports (reference)

- **3000**: API Gateway  
- **3001**: Admin dashboards (Vite)  
- **3002**: Gym Service  
- **3003**: Nutrition Service  
- **3004**: Content Service  
- **3005**: Squad Service  
- **3006**: Wizard Service  
- **3007**: Identity Service  
- **3008**: Messaging Service  
- **3009**: Logging Service  
- **5173**: Vite (admin)  
- **8081**: Metro (Expo)  
- **5555–5559**: Prisma Studio / wizard (script-dependent)

---
[Back to Contributing](CONTRIBUTING.md) · [System Overview](../SYSTEM_OVERVIEW.md)
