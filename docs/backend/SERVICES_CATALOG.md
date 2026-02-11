# Backend Services Catalog

Detailed technical specifications for the individual microservices.

## 🛠️ Service Catalog & Deep Dives

Each service has a dedicated technical guide:

| Service | Port | Database / Sink | Details |
|---------|------|-----------------|----------|
| **[Gatekeeper](services/GATEWAY.md)** | 3000 | N/A | API Routing & Proxying |
| **[Gym Service](services/GYM_SERVICE.md)** | 3002 | `fitnexa_gym` | Locations, Branding, Check-ins |
| **[Nutrition Service](services/NUTRITION_SERVICE.md)** | 3003 | `fitnexa_nutrition` | Food Logging, Gemini AI |
| **[Content Service](services/CONTENT_SERVICE.md)** | 3004 | `fitnexa_content` | Workouts, Products, Blog |
| **[Squad Service](services/SQUAD_SERVICE.md)** | 3005 | RAM / JSON | Live Workouts, Presence |
| **[Identity Service](services/IDENTITY_SERVICE.md)** | 3007 | `fitnexa_identity` | Auth, Users, Roles |
| **[Wizard Service](services/WIZARD_SERVICE.md)** | 3006 | Service-owned | Multi-step flows, onboarding sessions |
| **[Messaging Service](services/MESSAGING_SERVICE.md)**| 3008 | `fitnexa_messaging` | Direct Chat, Redis Sync |
| **[Logging Service](services/LOGGING_SERVICE.md)** | 3009 | `fitnexa_logs` | Central log sink |

---

## 🏗️ Core Infrastructure Details

- **Identity**: RS256 JWT Strategy, Bcrypt hashing.
- **Gym**: Dynamic JSON "Chameleon" configurations.
- **Messaging**: Redis caching for read-heavy chat history.
- **Logging**: Asynchronous RabbitMQ shipping to MongoDB.

---

## 🔗 Related Links
- **[Backend Architecture](ARCHITECTURE.md)**
- **[System Overview](../SYSTEM_OVERVIEW.md)**
