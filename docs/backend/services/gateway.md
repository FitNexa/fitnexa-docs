---
sidebar_position: 1
title: "Gateway"
description: "Central entry point and request router for the platform"
---
# API Gateway

The API Gateway is the single point of entry for all client applications, providing a unified API surface and documentation hub.

## 🚀 Responsibilities
- **Request Routing**: Proxying client requests to downstream microservices.
- **Documentation Hub**: Consolidating Swagger/OpenAPI docs for all services.
- **Rate Limiting**: Protecting downstream services from abuse.

## 🛠️ Technical Details
- **Port**: `3000`
- **Path**: `http://localhost:3000`
- **Hub**: `http://localhost:3000/api-docs`

## 📡 Proxy Map
| Route          | Service   | Destination             |
| -------------- | --------- | ----------------------- |
| `/identity/*`  | Identity  | `http://localhost:3007` |
| `/gym/*`       | Gym       | `http://localhost:3002` |
| `/nutrition/*` | Nutrition | `http://localhost:3004` |
| `/content/*`   | Content   | `http://localhost:3003` |
| `/squad/*`     | Squad     | `http://localhost:3005` |
| `/wizard/*`    | Wizard    | `http://localhost:3008` |
| `/messaging/*` | Messaging | `http://localhost:3006` |

---
Related: [Services Catalog](../services-catalog.md) · [Backend Architecture](../architecture.md)
