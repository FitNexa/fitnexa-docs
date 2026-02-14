---
sidebar_position: 8
title: "Logging Service"
description: "Centralized observability hub and log aggregator"
---
# Logging Service

The Logging Service is the central observability hub, aggregating logs from backend microservices, mobile, and web apps.

## 🚀 Responsibilities
- **Aggregation**: Collecting logs via RabbitMQ (backend) and HTTP (frontend).
- **Correlation**: Associates a `referenceCode` for end-to-end event tracking.
- **Persistence**: Storage in MongoDB for flexible schema handling.

## 🛠️ Technical Details
- **Port**: `3009`
- **Database**: `fitnexa_logs` (MongoDB)
- **Bus**: RabbitMQ `logs` exchange

## 📡 Ingestion Points
### RabbitMQ
Consumes from `logging_service_queue`. All backend services use the `@fitnexa/shared` Node logger to ship events here.

### HTTP Sink
- `POST /logs`: Used by Frontend/Mobile for UI crashes and telemetry.

---
Related: [Infrastructure Guide](../../infrastructure/logging-observability.md) · [Error Handling](../error-handling.md)
