# Gym Service

The Gym Service manages the structural and branding configuration of the FitNexa platform. It is the source of truth for "white-labeling".

## 🚀 Responsibilities
- **Branding**: Serving gym-specific themes, colors, and assets to frontends.
- **Location Management**: Defining physical gym locations and their capacities.
- **Check-ins**: Tracking member attendance and real-time occupancy.
- **Inventory**: Managing gym-specific products and workout programs.
- **Social Features**: Handling announcements, challenges, and gym-specific posts.

## 🛠️ Technical Details
- **Port**: 3002
- **Database**: `fitnexa_gym` (PostgreSQL)
- **Key Models**: `Gym`, `GymConfig`, `Location`, `CheckIn`, `Challenge`.

## 🎨 White-Labeling (GymConfig)
The `GymConfig` model stores branding details as JSON:
- **Theme**: Colors, typography, and UI spacing.
- **Assets**: URLs for logos, splash screens, and icons.
- **Features**: Toggles for enabling/disabling modules (e.g., "nutrition": true).

## 📡 API Endpoints

### Gym Routes (`/gym`)
- `GET /config/:gymId`: Fetch full branding and feature configuration.
- `PUT /config`: Update gym branding (Super Admin).

### Location Routes (`/locations`)
- `GET /`: List all locations for the current gym.
- `POST /check-in`: Register a member check-in via QR code.

### Social & Challenges (`/challenges`, `/posts`)
- `GET /challenges`: List active monthly challenges.
- `POST /posts`: Create a social post within the gym feed.

---
[Back to Services Catalog](../SERVICES_CATALOG.md)
