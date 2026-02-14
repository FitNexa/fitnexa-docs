---
sidebar_position: 3
title: "Quick Start"
description: "First-run setup guide for local development"
---
# Quick Start

Get the FitNexa platform running on your local machine in under 10 minutes.

## 📋 Prerequisites
- **Node.js**: v20 or higher
- **Docker**: For running PostgreSQL, Redis, and RabbitMQ
- **npm**: v9 or higher

## 🚀 Setup Steps

### 1. Clone the Repository
```bash
git clone https://github.com/FitNexa/fitnexa-platform.git
cd fitnexa-platform
```

### 2. Run Automatic Setup
The root setup script installs all dependencies for the monorepo and individual services.
```bash
npm run setup
```

### 3. Build Shared Library
Crucial step: all services depend on the built output of `@fitnexa/shared`.
```bash
npm run build:shared
```

### 4. Interactive Start
Use our interactive script to start all services or choose specific ones.
```bash
npm run easy-start
```

## 🌐 Local Infrastructure
Once running, the core services are available at:

| Service          | Port | URL                     |
| ---------------- | ---- | ----------------------- |
| API Gateway      | 3000 | `http://localhost:3000` |
| Identity Service | 3007 | `http://localhost:3007` |
| Gym Service      | 3002 | `http://localhost:3002` |
| Landing Page     | 5174 | `http://localhost:5174` |
| Gym Admin        | 3001 | `http://localhost:3001` |
| Super Admin      | 5173 | `http://localhost:5173` |

---
Related: [Developer Guide](../dev-workflows/_category_.json) · [Environment Variables](../dev-workflows/environment-setup.md)
