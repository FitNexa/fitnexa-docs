---
sidebar_position: 3
title: "Gym Service"
description: "Multi-tenant source of truth for branding, locations, and gym-specific modules"
---
# Gym Service

The Gym Service manages the structural and branding configuration of the FitNexa platform. It is the core of the "Chameleon Engine" that enables white-labeling.

## 🚀 Responsibilities
- **Branding**: Serving gym-specific themes, colors, and assets to frontends.
- **Location & Check-ins**: Managing physical sites and real-time occupancy.
- **Gym Modules**: Powering Challenges, Referrals, Products, and Workout templates.
- **Dynamic Fig**: Source of truth for feature toggles and branding assets.

## 🛠️ Technical Details
- **Port**: `3002`
- **Database**: `fitnexa_gym` (PostgreSQL)
- **Primary Models**: `Gym`, `GymConfig`, `Location`, `CheckIn`, `Challenge`, `Referral`, `Product`, `Workout`.

## 📡 API Endpoints

### Gym & Config (`/gym`)
- `GET /config/:gymId`: Fetch full branding and feature configuration.
- `PUT /config/:gymId`: Update gym branding (Admin).

### Challenge Routes (`/challenges`)
| Endpoint        | Method | Description                             |
| --------------- | ------ | --------------------------------------- |
| `/`             | GET    | List active challenges for the gym      |
| `/:id`          | GET    | Get challenge details with participants |
| `/`             | POST   | Create a new challenge (Admin)          |
| `/:id/join`     | POST   | Join a specific challenge               |
| `/:id/progress` | POST   | Log daily challenge progress            |

### Referral Routes (`/referrals`)
- `GET /code`: Get or create user's unique referral code.
- `POST /redeem`: Redeem a referral code from another user.
- `GET /stats`: Get user's referral statistics.

### Product & Workout Routes
- `GET /products`: List gym-specific products (for sale/membership).
- `GET /workouts`: List workout program templates.
- **Admin**: `POST` and `PUT` methods available for CRUD operations.

## 💾 GymConfig JSON Structure
The `GymConfig` model stores all branding and feature configuration as JSON:

| Field            | Type    | Description                                                |
| ---------------- | ------- | ---------------------------------------------------------- |
| `primaryColor`   | String  | e.g., `#3b82f6` (Used for buttons, accents)                |
| `secondaryColor` | String  | e.g., `#ffffff` (Used for surfaces)                        |
| `logoUrl`        | String? | URL to the gym's SVG/PNG logo                              |
| `features`       | JSON    | `{ "nutrition": true, "squads": true, "referrals": true }` |
| `theme`          | JSON    | Nested colors (background, surface, text styles)           |
| `assets`         | JSON    | `{ "logo": "...", "splash": "...", "icon": "..." }`        |

---
Related: [Identity Service](identity-service.md) · [Dynamic Branding Guide](../../mobile/branding.md)
