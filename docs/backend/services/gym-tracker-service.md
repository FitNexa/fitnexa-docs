---
sidebar_position: 10
title: "Gym Tracker Service"
description: "Nutrition logging, hydration, daily pulse, and workout history — must persist to DB"
---
# Gym Tracker Service

The **gym-tracker-service** powers the mobile Tracker tab: food logs, water/hydration, nutrition summary, daily pulse (streak, recovery), and workout history. The mobile app calls the gateway at `/tracker`, which proxies to this service.

## ⚠️ Persistence requirement

**All data must be persisted to the database (PostgreSQL, schema `tracker`).** If the service only keeps data in memory or does not write to DB:

- After **logout and login**, the user sees **empty** nutrition data, **zero** streak, and **no** hydration.
- Data is lost on service restart or when the user switches devices.

Ensure every write (food log, water log, workout complete) is stored in the DB and that summary/daily-pulse read from the same DB.

## 💧 Water / hydration not showing after re-login

If users log water (POST `/water` with `{ amount }`) and see 200 OK but after **logout and login** the water total is **0**:

1. **POST /water** must **persist** the amount to the database (e.g. `water_log` table with `userId`, `date`, `amount`, or a daily aggregate). Returning 200 with `{}` is not enough — the value must be stored.
2. **GET /summary/:userId?date=** and/or **GET /daily-pulse/:userId?date=** must **read** that stored water for the same `userId` and `date` and include it in the response as **`water`** (number, e.g. total ml for the day). If both return `{}` or omit `water`, the app shows 0 after re-login.

**Checklist:** After implementing persistence for POST /water, verify that GET /summary (or GET /daily-pulse) for the same user and date returns `{ ..., water: <total_ml>, ... }` so the mobile can display it.

---

## 📡 API contract (mobile expectations)

### Writes (must persist to DB)

| Method | Endpoint | Body / purpose | Persist |
|--------|----------|----------------|---------|
| `POST` | `/log` | `{ foodName, calories, protein, carbs, fats }` — log a meal | ✅ Store in `food_log` (or equivalent) table keyed by `userId` and date. |
| `POST` | `/water` | `{ amount }` — log water intake | ✅ Store in DB keyed by `userId` and date (e.g. `water_log` or aggregated daily water). |
| `POST` | `/workouts/complete` | Workout session payload | ✅ Store in DB for workout history and recovery. |

### Reads (must return data from DB)

| Method | Endpoint | Purpose | Expected response |
|--------|----------|---------|-------------------|
| `GET` | `/summary/:userId?date=YYYY-MM-DD` | Nutrition summary for a day | `{ date, totals: { calories, protein, carbs, fats }, water, meals: [{ id, foodName, calories, protein, carbs, fats }] }`. **Must** be derived from persisted food logs and water for that user and date. |
| `GET` | `/daily-pulse/:userId?date=YYYY-MM-DD` | Streak, recovery, daily stats | `{ calories, water, streak, recoveryPercent, totals: { protein, carbs, fats } }`. **Must** be derived from persisted data (meals, water, workouts) for that user. |
| `GET` | `/history/:userId?date=...` | Food log history | Array of food log entries from DB. |
| `GET` | `/workouts/history/:userId?limit=&offset=` | Workout history | Array of completed workout sessions from DB. |
| `GET` | `/recovery/:userId?proteinGoal=` | Recovery/muscle readiness | From DB where applicable. |

---

## 🔑 Field names

- Use **`calories`** (not `calorics`) in request/response bodies and in the database schema so the mobile app and any logging stay correct.

---

## ✅ Checklist for backend implementers

- [ ] **Food log**: `POST /log` writes to a persistent table (e.g. `food_log`) with `userId`, `date` (or `createdAt`), `foodName`, `calories`, `protein`, `carbs`, `fats`.
- [ ] **Water**: `POST /water` writes to a persistent table or aggregates into a daily water value per `userId` and date.
- [ ] **Summary**: `GET /summary/:userId?date=` reads from the same DB and returns `totals`, `water`, and `meals` for that date (no in-memory-only data).
- [ ] **Daily pulse**: `GET /daily-pulse/:userId?date=` reads from DB (meals, water, workouts) and returns `streak`, `recoveryPercent`, `calories`, `water`, `totals`.
- [ ] **Workout history**: `POST /workouts/complete` and `GET /workouts/history/:userId` use the same persisted store so history survives logout/login and restarts.

---

Related: [Nutrition Service](nutrition-service.md) · [UAT API Endpoints](../../../docs/UAT.md#4-api-endpoints-the-mobile-app-uses)
