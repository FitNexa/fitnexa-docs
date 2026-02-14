---
sidebar_position: 8
title: "Messaging Service"
description: "Real-time chat and notification delivery"
---
# Messaging Service

The Messaging Service handles real-time communication between members and gyms.

## 🚀 Responsibilities
- **Real-time Chat**: Direct and group messaging via WebSockets.
- **Caching**: Using Redis to speed up conversation lookups.

## 🛠️ Technical Details
- **Port**: `3006` (Internal) / `3008` (Legacy reference)
- **Database**: `fitnexa_messaging` (PostgreSQL)
- **Real-time**: Socket.io

## 📡 Socket Events
- `join_room`: Connect to a conversation.
- `send_message`: Outgoing message from client.

---
Related: [Squad Service](squad-service.md) · [Identity Service](identity-service.md)
