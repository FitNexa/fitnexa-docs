---
sidebar_position: 12
title: "Iron Template (Virtual Demo Gym)"
description: "The Iron Template serves as a fully functional virtual gym for preview, demo, and development."
---

# Iron Template (Virtual Demo Gym)

The **Iron Template** is a fixed demo gym (`irontemple`) that provides a complete, realistic gym experience for onboarding preview, admin demo mode, and local development.

---

## Overview

| Purpose | Usage |
|---------|-------|
| **Onboarding Preview** | Gym owners see a working gym during signup |
| **Admin Demo** | Super admins can showcase the platform |
| **Development** | Local dev uses `GYM_ID=irontemple` for testing |
| **E2E Tests** | Automated tests target the demo gym |

---

## Demo Data

When seeded (`scripts/seed-iron-temple.js` or `npm run easy-start` with Iron Temple selected), the following data is created:

### Gym Service
- **Gym:** Iron Temple (`irontemple`)
- **Locations:** Main Forge, Cardio Zone, Weights Arena
- **Squads:** Powerlifting Squad, CrossFit Crew
- **Workouts (Classes):** Morning HIIT, Powerlifting Fundamentals, Recovery Yoga
- **Products:** Iron Temple Protein, Iron Temple Tank
- **Announcements:** New Classes, Holiday Hours
- **Challenge:** 30-Day Check-In Challenge
- **Program:** 12-Week Strength Builder
- **Feed Post:** Sample member post

### Identity Service
- **Tester User:** `tester@irontemple.com` / `tester` (password: `testpassword`)

### Nutrition Service
- **Food Log:** Protein Shake sample
- **Water Log:** 500ml sample

---

## Running the Seed

```bash
# From repo root – seeds all services
node scripts/seed-iron-temple.js

# Or per-service
cd fitnexa-backend/services/gym-service && node scripts/seed-iron-temple.js
cd fitnexa-backend/services/identity-service && npx ts-node seed-iron-temple.ts
cd fitnexa-backend/services/nutrition-service && node seed-iron-temple.js
```

---

## Demo Isolation

- **Gym ID:** `irontemple` is reserved for the demo
- **Multi-tenant:** Real gyms use different IDs (e.g. `greentheory`, `fitlife`)
- **Admin:** When previewing, changes to Iron Temple should not affect production tenants
- **Copy-on-write:** New gyms created from the template get a copy of the structure, not a shared reference

---

## Environment

| Variable | Description |
|----------|-------------|
| `GYM_ID` | Set to `irontemple` for local dev / Iron Template |
| `IRON_TEMPLATE_GYM_ID` | Constant in `@fitnexa/shared` (`irontemple`) |

---

## Related

- [Gym Onboarding Flow](./gym-onboarding-flow.md)
- [Architecture Audit](../overview/architecture-audit.md) – Iron Template section
