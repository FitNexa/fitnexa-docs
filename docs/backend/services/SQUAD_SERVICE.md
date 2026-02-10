# Squad Service

The Squad Service manages real-time social presence and group workout coordination.

## 🚀 Responsibilities
- **Online Presence**: Tracking which members are currently active in the app.
- **Squad Invites**: Real-time "Workout with me" invitations.
- **Live Sessions**: Coordinating real-time data sync during a shared workout.
- **Social Feed**: Aggregating posts and activities from the gym community.

## 🛠️ Technical Details
- **Port**: 3005
- **Storage**: In-memory (online users) / JSON (persistent chat history/sessions).
- **Real-time**: Socket.io for presence and discovery.
- **Key Mechanics**: Persistent online state via `onlineUsers` Map.

## 📡 Socket Events
- `user_online`: Announce presence to the gym community.
- `online_users_updated`: Broadcast the list of available workout partners.
- `send_squad_invite`: Invite another user to a live session.
- `join_squad`: Enter a private squad room for real-time sync.

## 💾 REST API Endpoints
- `GET /online-users`: Retrieve the list of available members.
- `GET /groups`: Fetch social group/club data.
- `GET /history/:userId`: Get the user's past squad workout history.

---
[Back to Services Catalog](../SERVICES_CATALOG.md)
