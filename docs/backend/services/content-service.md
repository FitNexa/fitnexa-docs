---
sidebar_position: 4
title: "Content Service"
description: "Repository for exercise data, workouts, and products"
---
# Content Service

The Content Service manages the workout library and product catalog.

## 🚀 Responsibilities
- **Workout Library**: Storing workout routines and exercise metadata.
- **Product Catalog**: Managing fitness products for the gym-specific shops.

## 🛠️ Technical Details
- **Port**: `3003`
- **Database**: `fitnexa_content` (PostgreSQL)

## 📡 API Endpoints
### Workout Routes (`/workouts`)
- `GET /`: List all available workout routines.
- `GET /:id`: Detailed exercise breakdown for a routine.
- `GET /category/:category`: Filter by type (Cardio, HIIT, etc.).

### Product Routes (`/products`)
- `GET /`: List the gym's shop inventory.
- `GET /featured`: Get promoted products.

## 💾 Model: WorkoutRoutine
| Field      | Type   | Description                             |
| ---------- | ------ | --------------------------------------- |
| title      | String | Name of the routine                     |
| difficulty | Enum   | `BEGINNER`, `INTERMEDIATE`, `ADVANCED`  |
| exercises  | Json   | Structured sets, reps, and exercise IDs |

---
Related: [Gym Service](gym-service.md) · [Nutrition Service](nutrition-service.md)
