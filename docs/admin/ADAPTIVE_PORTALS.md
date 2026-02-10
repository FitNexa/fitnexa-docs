# Adaptive Admin Portals

FitNexa provides a white-label admin experience through two primary portals.

## 🏆 Super Admin Portal
The system-wide control center used by FitNexa operators.
- **Onboarding**: Create new gym clients.
- **Branding**: Configure colors, logos, and features for each gym.
- **Analytics**: High-level platform health and revenue tracking.

## 🦎 Gym Admin (The Chameleon Portal)
The portal used by gym owners and staff. It is designed to feel bespoke to their personal brand.

### "Chameleon" Tech:
1. **Identity Fetch**: Upon login, the portal identifies the user's gym and fetches its configuration.
2. **Style Injection**: The UI dynamically injects CSS variables and brand assets into the layout.
3. **Feature Toggles**: If a gym hasn't paid for specific modules (e.g., Nutrition AI), those features are hidden from the dashboard.

### Core Features:
- **Member Management**: Track check-ins, memberships, and squads.
- **Content Management**: Create workout routines for their specific members.
- **Support Messaging**: Direct communication with FitNexa Super Admins for platform assistance.
- **Member Inbox**: Direct communication with gym members.

---

## 🔗 Related Links
- **[System Overview](../SYSTEM_OVERVIEW.md)**
- **[Backend Architecture](../backend/ARCHITECTURE.md)**
