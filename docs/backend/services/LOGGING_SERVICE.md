# Logging Service

The Logging Service is the central observability hub for the FitNexa platform, aggregating logs from Backend, Mobile, and Web applications.

## 🚀 Responsibilities
- **Log Aggregation**: Collecting logs via RabbitMQ (backend) and HTTP (frontend).
- **Persistence**: Storing logs in a flexible MongoDB database.
- **Error Correlation**: Generating and associating `referenceCode` (correlationId) for end-to-end bug tracking.

## 🛠️ Technical Details
- **Port**: 3009
- **Database**: `fitnexa_logs` (MongoDB)
- **Message Bus**: RabbitMQ (`logs` exchange).
- **Tech Stack**: MongoClient, amqplib.

## 📡 Ingestion Points

### 1. RabbitMQ (Backend)
The service consumes from the `logging_service_queue` bound to the `logs` topic exchange.
- All microservices publish logs asynchronously to this exchange using the `@fitnexa/shared` RabbitMQ transport.

### 2. HTTP Sink (Frontend)
- `POST /logs`: Used by the Mobile and Web apps to report UI crashes and usage events.

## 🔍 Observability Flow
1. **Event**: A crash occurs in the Mobile App.
2. **Post**: App sends crash logs to Port 3009.
3. **Correlation**: Logging service generates or uses a `correlationId`.
4. **Store**: Log is stored in MongoDB.
5. **Support**: Developer searches MongoDB by `referenceCode` to see exactly what happened across all systems.

---
[Back to Services Catalog](../SERVICES_CATALOG.md)
