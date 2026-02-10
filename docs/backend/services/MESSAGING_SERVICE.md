# Messaging Service

The Messaging Service handles real-time communication between users, trainers, and groups.

## 🚀 Responsibilities
- **Direct Messaging**: One-on-one chat between members.
- **Group Chat**: Conversation rooms for squads and gym communities.
- **Real-time Delivery**: Instant message broadcasting via WebSockets.
- **Notification Events**: Publishing message events to RabbitMQ for push notifications.

## 🛠️ Technical Details
- **Port**: 3008
- **Database**: `fitnexa_messaging` (PostgreSQL)
- **Caching**: **Redis** for high-frequency conversation lookups.
- **Real-time**: Socket.io.
- **Key Models**: `Conversation`, `Participant`, `Message`.

## 📦 Architecture Mechanics
1. **Repository Pattern**: Abstracted database access for scalability.
2. **Redis Integration**: Conversation metadata is cached to avoid heavy JOIN queries during app initialization.
3. **Event Pipeline**: On message send, the service:
   - Saves to DB (Postgres).
   - Emits via Socket.io to active participants.
   - Publishes `message.created` to RabbitMQ.

## 📡 Socket Events
- `join_room`: Add user to a specific conversation channel.
- `send_message`: Incoming message from client.
- `receive_message`: Broadcast message to other participants.
- `typing_status`: Real-time indicator for user activity.

---
[Back to Services Catalog](../SERVICES_CATALOG.md)
