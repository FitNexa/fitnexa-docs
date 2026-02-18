---
sidebar_position: 6
title: "Business Functionality Overview"
description: "All implemented functionalities from a business point of view"
---

This document describes **all implemented functionalities** across the FitNexa platform from a **business point of view**. It is intended for product, commercial, and implementation stakeholders.

**Last updated:** February 2026  
**Scope:** All projects (Backend, Admin, Mobile, Landing, Shared) as documented in the repository and fitnexa-docs.

---

## 1. Business Context

**FitNexa** is a **multi-tenant SaaS platform for gym owners**. It enables:

- **Gym owners** to onboard, brand, and operate a white-label member app and admin dashboard.
- **Members** to use a gym-branded mobile app for workouts, nutrition, challenges, check-ins, and community.
- **Platform operators** to manage the fleet of gyms, subscriptions, and global settings.

The platform is built as a **microservices backend**, several **web applications**, and a **white-label mobile app** (Expo/React Native), with a shared library (`@fitnexa/shared`) and centralized documentation (fitnexa-docs).

---

## 2. Applications and Business Purpose

| Application | Business Purpose | Primary Users |
|-------------|------------------|---------------|
| **Landing Page** | Marketing, product showcase, lead capture, CTA to onboarding | Prospects (gym owners) |
| **Onboarding Wizard** | Self-service gym registration and initial setup | New gym owners |
| **Gym Admin** | Day-to-day gym management, branding, members, build requests | Gym admins |
| **Super Admin** | Platform-wide management, gym fleet, AI templates, analytics | Platform operators |
| **Mobile App** | White-label member app (workouts, nutrition, squads, check-in, etc.) | Gym members |

---

## 3. Implemented Business Functionalities by Domain

### 3.1 Acquisition & Marketing

| Functionality | Description | Where Implemented |
|---------------|-------------|--------------------|
| **Landing page** | Marketing site with hero, value proposition, and CTAs | fitnexa-landing |
| **Interactive brand preview** | Visitor enters gym name and primary colour; sees live mockup of mobile app and admin dashboard (mobile/desktop toggle) | Landing – BrandPreview component |
| **How it works** | Four-step journey: Build Your Brand → Complete Onboarding → Customise in Dashboard → Generate and Test APK | Landing – HowItWorks |
| **CTA to onboarding** | "Start Building Now" passes `gymName` and `primaryColor` as query params to onboarding wizard | Landing → Onboarding |
| **Internationalisation (i18n)** | EN, IT, ES for landing content | fitnexa-landing (i18next) |
| **Blog/CMS** | Local markdown for blog posts (when used) | fitnexa-landing |

**Business value:** Converts visitors into leads and hands them to the onboarding flow with pre-filled branding.

---

### 3.2 Gym Onboarding (New Customer Sign-Up)

| Functionality | Description | Where Implemented |
|---------------|-------------|--------------------|
| **Multi-step onboarding wizard** | Collects: (1) Gym identity (name, type, address), (2) Branding (primary colour from landing), (3) Features (nutrition, squads, challenges, workouts, check-in, marketing), (4) Admin account (name, email, phone) | fitnexa-admin/onboarding |
| **Backend orchestration** | Creates gym (Gym Service), creates inactive admin (Identity Service), generates activation token, creates wizard session, sends activation email; compensates (e.g. delete gym) if admin creation fails | Wizard Service – OnboardingOrchestrator |
| **Activation email** | Styled HTML email with link to activation page (Mailjet in production; mock in dev) | Wizard Service – MailjetEmailService |
| **Account activation** | User opens link → token validated → set password → account activated → redirect to gym admin login | Onboarding app – Activation page; Wizard – activate endpoints |
| **Welcome email** | Sent after activation, links to gym admin dashboard | Wizard Service – MailjetEmailService |

**Business value:** End-to-end self-service sign-up: from landing to activated gym admin, with no manual provisioning.

---

### 3.3 Identity & Access

| Functionality | Description | Where Implemented |
|---------------|-------------|--------------------|
| **Login** | Username/password; optional domain (gym) for enforcement | Identity Service – POST /auth/login |
| **Registration** | Member registration (e.g. for mobile app) | Identity Service – register flow |
| **Refresh token** | JWT refresh; validates user exists and status is ACTIVE (rejects suspended) | Identity Service |
| **Logout** | Invalidate session | Identity Service – POST /auth/logout |
| **Forgot password** | Request reset email; rate limited; no email enumeration | Identity Service – POST /auth/forgot-password |
| **Reset password** | Set new password with token (e.g. 60 min expiry) | Identity Service – POST /auth/reset-password |
| **Profile** | Get/update current user; upload profile picture | Identity Service – /users/me, PUT /profile, POST /profile/upload |
| **Roles (RBAC)** | MEMBER, GYM_ADMIN, SUPER_ADMIN; role-based routes | Identity Service + gateway/middleware |
| **Admin creation** | Create GYM_ADMIN user (used by onboarding orchestration) | Identity Service – POST /users/create-gym-admin (internal) |
| **User activation** | Activate account via token (used after onboarding) | Identity Service – POST /users/activate (internal) |
| **List all users** | SUPER_ADMIN only | Identity Service – GET /users/all |
| **Email verification fields** | User model has emailVerified, emailVerifiedAt (flow TBD) | Identity Service – User model |

**Business value:** Secure, role-based access for members, gym admins, and platform operators; self-service password reset and clear activation path for new gym admins.

---

### 3.4 Gym Configuration & Branding (Chameleon / White-Label)

| Functionality | Description | Where Implemented |
|---------------|-------------|--------------------|
| **Gym config API** | Get/update full branding and feature configuration by gym ID | Gym Service – GET/PUT /gym/config/:gymId |
| **Branding** | Primary colour, secondary colour, logo URL, theme, assets (e.g. logo, splash, icon) | Gym Service – GymConfig; Gym Admin – Branding tab |
| **Feature toggles** | Per-gym modules: nutrition, squads, challenges, workouts, check-in, marketing, store, AI scanner | Gym Service – features JSON; Gym Admin – Features tab |
| **Connections** | Instagram, Facebook, support email | Gym Admin – Connections tab (persisted via wizard session) |
| **Chameleon in Gym Admin** | App detects gym context (subdomain/path), fetches GymConfig, injects CSS variables for branding | fitnexa-admin/gym-admin – GymConfigContext |
| **Chameleon in Mobile** | Dynamic theming per gym (colours, logo, assets) | fitnexa-mobile – theme context, themed components |
| **Live preview in Super Admin** | Gym Builder updates Gym Admin iframe via postMessage for real-time style preview | fitnexa-admin/super-admin |

**Business value:** Each gym has a distinct brand and feature set without separate codebases; admins and members see a consistent, branded experience.

---

### 3.5 Gym Admin Dashboard & Operations

| Functionality | Description | Where Implemented |
|---------------|-------------|--------------------|
| **Dashboard** | Overview widgets: occupancy, members, check-ins, revenue; WizardReview (build status) | fitnexa-admin/gym-admin – Dashboard |
| **Gym Setup page** | Tabbed editor: Branding, Features, Connections; persisted via PUT /wizard/sessions/:id | fitnexa-admin/gym-admin – GymSetup |
| **Member manager** | CRUD for gym members and plans | fitnexa-admin/gym-admin – MemberManager |
| **Module control** | Toggle high-level features (e.g. Nutrition, Squads, Challenges) | fitnexa-admin/gym-admin – ModuleControl |
| **Routing** | /:gymId/dashboard, /:gymId/setup, /:gymId/members, /:gymId/modules | fitnexa-admin/gym-admin |

**Business value:** Single place for gym admins to manage branding, features, and members in line with their subscription and preferences.

---

### 3.6 Mobile App Build & Go-Live

| Functionality | Description | Where Implemented |
|---------------|-------------|--------------------|
| **Request UAT build** | Gym admin triggers APK build; creates BuildRequest; triggers GitHub Actions via repository_dispatch | Wizard Service – POST /wizard/builds/request |
| **Build pipeline** | Workflow in fitnexa-mobile: fetch gym branding from API, prebuild, Gradle assembleRelease, upload artifact, call callback URL | GitHub Actions – uat-build.yml |
| **Build status** | QUEUED, BUILDING, SUCCESS, FAILED; admin polls status (e.g. every 8 s) | Wizard Service – GET /wizard/builds/:id/status |
| **Download APK / QR** | When build succeeds, admin can download APK or show QR code | fitnexa-admin/gym-admin – WizardReview |
| **Build-complete webhook** | GitHub Actions calls back with status and artifact URL; Wizard updates BuildRequest | Wizard Service – POST /wizard/webhooks/build-complete |
| **Go live** | Initiate Stripe checkout for production deployment | Wizard Service – POST /wizard/builds/:id/go-live; Gym Admin – "Go Live" |

**Business value:** Gym owners can obtain a branded UAT APK to test, then move to production via Stripe, without platform team involvement.

---

### 3.7–3.20 Further Domains

The following domains are fully documented in the main doc with tables and business value:

- **3.7** Locations, Check-In & Occupancy  
- **3.8** Challenges & Engagement  
- **3.9** Referrals  
- **3.10** Products & Workouts (Content)  
- **3.11** Nutrition & AI Food Analysis  
- **3.12** Squads & Real-Time Presence  
- **3.13** Messaging & Notifications  
- **3.14** Content Feed & Announcements  
- **3.15** Super Admin & Platform Operations  
- **3.16** Wizard Sessions & State  
- **3.17** Logging & Observability  
- **3.18** AI Studio & Integrations  
- **3.19** Shared Platform Capabilities  
- **3.20** Demo & Development (Iron Template)  

See **[docs/BUSINESS-FUNCTIONALITY.md](../../../docs/BUSINESS-FUNCTIONALITY.md)** in the repo for the full section 3 (all tables and descriptions).

---

## 4. Payment & Monetisation (Implemented Scope)

| Functionality | Description | Where Implemented |
|---------------|-------------|--------------------|
| **Go live / Stripe** | Create Stripe checkout session for production deployment (POST /wizard/builds/:id/go-live) | Wizard Service; Stripe integration (skeleton/real as per env) |
| **Mock payment** | When Stripe not configured, mock payment service used | Wizard/Provider docs |
| **Webhook** | Stripe webhook signature verification documented/implemented | Provider integration guide; architecture audit |

**Business value:** Path from UAT to paid production via Stripe.

---

## 5. Security & Compliance (Implemented)

- **Authentication:** JWT (access/refresh); bcrypt (e.g. 12 rounds); refresh validates user status (ACTIVE).
- **Rate limiting:** Login, register, forgot-password (and optionally others at gateway).
- **Password reset:** Token-based, expiry, no email enumeration.
- **Multi-tenant:** gymId and domain enforcement; tenant context middleware; requireGymContext.
- **RBAC:** MEMBER, GYM_ADMIN, SUPER_ADMIN with role-based routes.
- **Internal services:** X-Internal-Secret (or similar) for service-to-service calls where used.
- **Audit:** Login, password reset, email verification logged with action tags; sanitisation for registration errors.
- **HTTPS:** Optional enforcement via shared middleware.
- **Helmet:** Secure headers via createBaseService.

---

## 6. Deployment & DevOps (Implemented)

- **UAT:** Backend on Hetzner VPS (Docker Compose); frontend (Gym Admin, Super Admin) on Vercel; GitHub Actions for CI/CD.
- **Mobile:** UAT APK via GitHub Actions (fitnexa-mobile); build triggered from Gym Admin; callback to Wizard.
- **Documentation:** Docusaurus (fitnexa-docs); run with `npm run docs:dev`.
- **Database:** PostgreSQL per service (identity, gym, content, nutrition, squad, messaging, wizard); MongoDB for logs; Redis for caching/messaging where used.
- **Orchestration:** Root repo scripts for easy-start, health-check, install, test, db push, generate.

---

## 7. Summary Table (By Application)

| Application | Main business functionalities |
|-------------|--------------------------------|
| **Landing** | Marketing, brand preview, How it works, CTA to onboarding, i18n |
| **Onboarding** | Multi-step wizard, backend orchestration, activation flow, pre-fill from landing |
| **Gym Admin** | Dashboard, Gym Setup (branding/features/connections), members, modules, UAT build request, build status, download APK, Go Live |
| **Super Admin** | Fleet manager, Gym Builder (live preview), Model engine, Command center |
| **Mobile** | White-label theming, workouts, nutrition (AI), squads, presence, challenges, check-in, feed (as per feature toggles) |
| **Backend** | Identity (auth, users, RBAC), Gym (config, locations, check-in, challenges, referrals, products/workouts), Content (workouts, products), Nutrition (AI, log, history), Squad (presence, squads), Messaging (chat), Wizard (onboarding, activation, sessions, builds, Stripe go-live), Logging (aggregation), AI Studio |

---

## 8. References

- [System Overview](./system-overview.md)
- [Gym Onboarding Flow](../features/gym-onboarding-flow.md)
- [Backend Services Catalog](../backend/services-catalog.md) and per-service docs
- [Frontend Apps](../frontend/apps/) (landing, onboarding, gym-admin, super-admin)
- [Architecture Audit](./architecture-audit.md)
- [Implementation Summary](./implementation-summary.md)
- [Third-Party Services](../infrastructure/third-party-services-and-keys.md)

---

*For the complete section 3 with all domain tables, see the full markdown file in the repo: `docs/BUSINESS-FUNCTIONALITY.md`.*
