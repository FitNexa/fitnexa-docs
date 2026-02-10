# API Gateway (Gatekeeper)

The API Gateway is the single point of entry for all client applications, providing a unified API surface and documentation hub.

## 🚀 Responsibilities
- **Request Routing**: Proxying client requests to the correct downstream microservice.
- **Documentation Aggregation**: Serving a unified Swagger/OpenAPI UI for all services.
- **Service Discovery**: (Static) Mapping service routes (e.g., `/auth/*`) to internal ports (e.g., `3007`).
- **Health Monitoring**: Providing a central liveness check for the whole cluster.

## 🛠️ Technical Details
- **Port**: 3000
- **Technology**: Express.js + `http-proxy-middleware`.
- **OpenAPI**: Consolidated YAML definitions.

## 📡 Proxy Map
| Route | Service | Destination |
|-------|---------|-------------|
| `/identity/*` | Identity | `http://localhost:3007` |
| `/gym/*` | Gym | `http://localhost:3002` |
| `/nutrition/*` | Nutrition | `http://localhost:3003` |
| `/content/*` | Content | `http://localhost:3004` |
| `/squad/*` | Squad | `http://localhost:3005` |
| `/messaging/*` | Messaging | `http://localhost:3008` |

## 📖 API Documentation Hub
The Gateway hosts the **Interactive API Documentation** at:
`http://localhost:3000/api-docs`

It aggregates individual service definitions to provide a seamless "one-stop-shop" for developers.

---
[Back to Services Catalog](../SERVICES_CATALOG.md)
