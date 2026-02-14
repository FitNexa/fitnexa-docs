---
sidebar_position: 6
title: "Squad Service"
description: "Real-time presence and group workout coordination"
---
# Squad Service

The Squad Service manages social presence and group workout synchronization.

## 🚀 Responsibilities
- **Presence**: Real-time "Who's at the gym" status.
- **Squads**: Temporary groups for shared workout sessions.

## 🛠️ Technical Details
- **Port**: `3005`
- **Real-time**: Socket.io

## 📡 Socket Events
- `user_online`: Announce presence.
- `send_squad_invite`: Invite a teammate to a session.

---
Related: [Messaging Service](messaging-service.md) · [Check-ins](gym-service.md)
