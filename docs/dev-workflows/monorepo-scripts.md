---
sidebar_position: 2
title: "Monorepo Scripts"
description: "Available scripts in the root package.json for development and builds"
---
# Monorepo Scripts

FitNexa uses a unified script system in the root `package.json` to manage the multi-repo monorepo.

## 🛠️ Management Scripts
| Script                 | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `npm run setup`        | Install all dependencies across all apps             |
| `npm run build:shared` | Build the `@fitnexa/shared` package (Required first) |
| `npm run easy-start`   | Interactive setup/start wizard                       |
| `npm run easy-kill`    | Kill all running FitNexa processes                   |

## 🧪 Testing Scripts
- `npm run test:all`: Run all unit tests.
- `npm run test:integration`: Run platform-wide integration tests.

---
Related: [Quick Start](../overview/quick-start.md) · [Environment Variables](environment-setup.md)
