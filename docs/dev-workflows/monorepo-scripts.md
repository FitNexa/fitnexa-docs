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

The deployment script is executed on the VPS by the GitHub Actions `deploy-backend.yml` workflow. It uses **timestamped, step-by-step logging** (see [UAT Setup – Deploy Script](../infrastructure/uat-setup.md#deploy-script) for the full sequence). In short it:

1. Checks that `docker-compose.uat.deploy.yml` and `fitnexa-backend/.env.uat` exist
2. Removes conflicting static UAT containers
3. Runs `docker compose up -d --build --remove-orphans`
4. Waits 30s, prints container status and **per-service logs** (last 30 lines each, including loki/alloy/grafana), and warns if any container is unhealthy
5. Verifies gateway health at `GATEWAY_URL/health`, prunes images, and prints a short summary

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

## ESM Module Resolution (@fitnexa/shared)

The `@fitnexa/shared` package uses ES Modules. Node ESM **does not** add file extensions, so all relative imports in TypeScript source must use the **`.js`** extension (for the emitted file). This applies to:

- Barrel files: `src/types/index.ts`, `src/validation/index.ts`, `src/errors/index.js`, etc.
- Server, config, middleware, services, interfaces, and any file that uses `from './...'` or `from '../...'`

```typescript
// Correct – Node resolves .../config-manager.js at runtime
import { ConfigManager } from '../config/config-manager.js';
export * from './base.js';
export * from './gym.js';

// Incorrect – causes ERR_MODULE_NOT_FOUND at runtime
import { ConfigManager } from '../config/config-manager';
export * from './base';
```

**Tests:** Jest runs against `.ts` source. Test files may import without `.js`. The shared package’s `jest.config.js` uses `moduleNameMapper` so that when production code imports `'../errors/index.js'`, Jest resolves it to the `.ts` file.

For a full list of ESM-related changes and deploy fixes, see [Recent Changes](recent-changes.md).

---

Related: [Quick Start](../overview/quick-start.md) | [Environment Variables](environment-setup.md) | [UAT Setup](../infrastructure/uat-setup.md) | [Recent Changes](recent-changes.md)
