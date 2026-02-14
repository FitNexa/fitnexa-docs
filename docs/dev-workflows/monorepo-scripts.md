---
sidebar_position: 2
title: "Monorepo Scripts"
description: "Available scripts in the root package.json for development and builds"
---

# Monorepo Scripts

FitNexa uses a unified script system in the root `package.json` to manage the multi-repo monorepo.

## Management Scripts

| Script | Description |
|--------|-------------|
| `npm run setup` | Install all dependencies across all apps |
| `npm run build:shared` | Build the `@fitnexa/shared` package (required first) |
| `npm run easy-start` | Interactive setup/start wizard |
| `npm run easy-kill` | Kill all running FitNexa processes |

## Testing Scripts

| Script | Description |
|--------|-------------|
| `npm run test:all` | Run all unit tests |
| `npm run test:integration` | Run platform-wide integration tests |

## Deployment Scripts

| Script | Location | Description |
|--------|----------|-------------|
| `scripts/deploy-uat.sh` | Root | Deploy backend services to VPS via Docker Compose |

### deploy-uat.sh

The deployment script is executed on the VPS by the GitHub Actions `deploy-backend.yml` workflow. It:

1. Locates `docker-compose.uat.deploy.yml` in the `fitnexa-backend/` directory
2. Loads environment variables from `fitnexa-backend/.env.uat`
3. Runs `docker compose up -d --build --remove-orphans`
4. Reports container status

The script expects the following directory structure on the VPS:

```
/deploy-path/
  fitnexa-backend/
    docker-compose.uat.deploy.yml
    .env.uat
    services/
  fitnexa-shared/
  fitnexa-admin/
  scripts/
    deploy-uat.sh
```

## ESM Module Resolution

The `@fitnexa/shared` package uses ES Modules. All relative imports in TypeScript source files must include the `.js` extension to ensure Node.js can resolve them at runtime after compilation:

```typescript
// Correct
import { ConfigManager } from '../config/config-manager.js';

// Incorrect (will cause ERR_MODULE_NOT_FOUND at runtime)
import { ConfigManager } from '../config/config-manager';
```

This applies to all files in `fitnexa-shared/src/` including server exports, middleware, utilities, and type re-exports.

---

Related: [Quick Start](../overview/quick-start.md) | [Environment Variables](environment-setup.md) | [UAT Setup](../infrastructure/uat-setup.md)
