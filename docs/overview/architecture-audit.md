---
sidebar_position: 4
title: "Architecture Audit"
description: "Production readiness audit, gap analysis, and implementation roadmap"
---
# FitNexa Platform – Architecture Audit & Implementation Plan

**Date:** 2026-02-16  
**Status:** Production Readiness Audit  
**Scope:** Full platform audit, gap analysis, and implementation roadmap

---

## 1. Executive Summary

FitNexa is a multi-tenant SaaS platform for gym owners. This audit identifies missing features, incomplete services, and provides an implementation roadmap to achieve production readiness.

### Critical Gaps Identified

| Area | Status | Priority |
|------|--------|----------|
| **Forgot/Reset Password** | ❌ Missing | P0 |
| **Email Verification** | ❌ Missing | P0 |
| **Shared Zod Validation** | ⚠️ Partial (identity has schemas, shared has custom functions) | P0 |
| **Iron Template (Virtual Gym)** | ⚠️ Partial (basic seed exists, preview/admin flows incomplete) | P0 |
| **Service Interfaces** | ⚠️ Partial (wizard has IEmailService, IPaymentService; others ad-hoc) | P1 |
| **Provider Documentation** | ⚠️ Partial (third-party-services-and-keys.md exists) | P1 |
| **Billing/Stripe Integration** | ⚠️ Skeleton (MockPaymentService, StripePaymentService) | P1 |
| **RBAC / Multi-tenant Isolation** | ⚠️ Partial (gymId checks exist, not comprehensive) | P1 |
| **CSRF Protection** | ❌ Missing | P1 |
| **Comprehensive Tests** | ⚠️ Partial (identity, wizard have tests; coverage varies) | P1 |

---

## 2. System Architecture Overview

### 2.1 Applications

| App | Purpose | Stack |
|-----|---------|-------|
| **fitnexa-landing** | Marketing, pricing, CTA | React |
| **fitnexa-admin/onboarding** | Gym owner registration, template selection | React |
| **fitnexa-admin/gym-admin** | Gym dashboard (multi-tenant) | React |
| **fitnexa-admin/super-admin** | Platform administration | React |
| **fitnexa-mobile** | White-labeled gym app (Expo/React Native) | Expo 54 |

### 2.2 Microservices

| Service | Purpose | DB |
|---------|---------|-----|
| **gateway** | API gateway, routing | - |
| **identity-service** | Auth, users, RBAC | PostgreSQL |
| **gym-service** | Gyms, locations, config | PostgreSQL |
| **content-service** | Workouts, exercises | PostgreSQL |
| **nutrition-service** | Meals, goals | PostgreSQL |
| **squad-service** | Sessions, presence, chat | PostgreSQL |
| **messaging-service** | Notifications | PostgreSQL |
| **wizard-service** | Onboarding, builds, Stripe | PostgreSQL |
| **logging-service** | Central logs | - |

### 2.3 Infrastructure

- **Docker:** postgres, rabbitmq, redis, mongodb
- **Email:** Mailjet (MockEmailService fallback)
- **Payments:** Stripe (MockPaymentService fallback)
- **Builds:** GitHub Actions (MockBuildService fallback)

---

## 3. Gap Analysis by Domain

### 3.1 Authentication & Security

#### Implemented ✅
- Login (username + password)
- Register (member registration)
- Refresh token
- JWT access/refresh tokens
- Rate limiting (login, register)
- bcrypt password hashing
- Role-based routes (SUPER_ADMIN, GYM_ADMIN, MEMBER)
- Internal service auth (X-Internal-Secret)

#### Implemented (2026-02-16) ✅
- **Forgot password** – POST /auth/forgot-password, token-based, rate limited
- **Reset password** – POST /auth/reset-password, token expiry 60 min
- **Email verification** – `emailVerified`, `emailVerifiedAt` fields added to User (flow TBD)

#### Missing ❌
- **Email verification flow** – verification endpoint and email send not yet implemented
- **CSRF protection** – not implemented
- **JWT key rotation** – no rotation mechanism
- **Brute-force protection** – rate limiting exists but no account lockout

### 3.2 Shared Validation

#### Implemented ✅
- `fitnexa-shared/validation` – custom functions (validateEmail, validatePhone, etc.)
- `identity-service/validation/schemas` – Zod (loginSchema, registerSchema, etc.)
- `fitnexa-shared/config/config-manager` – Zod for env config

#### Missing ❌
- **Centralized Zod DTO schemas** in fitnexa-shared for:
  - UserSchema, GymSchema, MembershipSchema, ClassSchema, PaymentSchema
  - LoginSchema, RegisterSchema, **ForgotPasswordSchema**, **ResetPasswordSchema**
- Strong password rules (uppercase, lowercase, number, special char)
- UUID validation, slug validation
- Single source of truth; identity-service schemas duplicated

### 3.3 Iron Template (Virtual Gym)

#### Implemented ✅
- Gym seed (irontemple) in gym-service
- Identity seed (tester user) in identity-service
- Nutrition seed in nutrition-service
- `GYM_ID=irontemple` used in scripts

#### Missing ❌
- **Preview mode** during onboarding (isolated demo)
- **Admin operability** – modify demo data without breaking tenant isolation
- **Full demo data** – trainers, classes, membership plans, bookings, analytics
- **Template provisioning** – copy template to new gym on signup
- **Demo isolation** – ensure irontemple changes don't affect real tenants

### 3.4 Provider Integrations

#### Documented (partial) ✅
- Mailjet (email)
- Stripe (payments)
- GitHub (builds)
- Google Gemini (nutrition AI)
- Vercel, Expo/EAS

#### Missing ❌
- Webhook signature verification (Stripe) – need to verify implementation
- Retry strategy documentation
- Failure scenario handling
- Local development setup (Stripe CLI mentioned; others unclear)
- SendGrid/Resend/SES as alternatives
- Firebase (push), S3 (storage), SMS – not documented

### 3.5 Service Architecture

#### Implemented ✅
- Repository pattern (identity, wizard, gym, etc.)
- Controller → Service → Repository layering
- Wizard: IEmailService, IPaymentService, IBuildService

#### Missing ❌
- Consistent interface-driven design across all services
- AuthService, UserService, GymService, MembershipService interfaces
- BillingService, NotificationService, MediaService, TemplateService interfaces
- UseCase layer (CQRS-style) not formalized
- Integration tests for cross-service flows

### 3.6 Testing

#### Implemented ✅
- Identity: auth tests, UserController, UserService
- Wizard: WizardService, WizardController, Integration tests
- Shared: logger, errorHandler tests
- Jest config at root and per service

#### Missing ❌
- **E2E tests** – Landing → Onboarding → Payment → Admin
- **E2E Forgot password**
- **E2E Gym creation**
- **E2E Member booking**
- 90% coverage target not met
- Edge cases: expired tokens, cross-tenant access

---

## 4. Implementation Roadmap

### Phase 1: Audit ✅
- Document architecture
- Identify gaps
- Prioritize work

### Phase 2: Shared Validation Library
- Create `fitnexa-shared/src/validation/schemas.ts` with Zod
- Export: UserSchema, GymSchema, MembershipSchema, LoginSchema, RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema
- Strong password, email, phone, UUID, slug validators
- Migrate identity-service to use shared schemas

### Phase 3: Auth Flows (Forgot/Reset/Email Verification)
- Add `PasswordResetToken` model to identity Prisma
- Add `emailVerified`, `emailVerifiedAt` to User
- Implement POST /auth/forgot-password
- Implement POST /auth/reset-password
- Implement POST /auth/verify-email
- Integrate with email provider (Mailjet/Mock)
- Frontend: forgot-password, reset-password, verify-email pages

### Phase 4: Service Interfaces & Clean Architecture
- Define IAuthService, IUserService, IGymService, etc.
- Implement interfaces in each service
- Add UseCase layer where beneficial
- Integration tests for critical flows

### Phase 5: Iron Template
- Complete demo data (trainers, classes, plans, bookings)
- Preview mode in onboarding
- Admin demo mode with isolation
- Template provisioning on gym creation

### Phase 6: Provider Documentation
- Stripe: webhooks, lifecycle, refunds, failures
- Email: templates, retry, failure handling
- Push, Storage, SMS placeholders

### Phase 7: Security Hardening
- CSRF tokens
- Rate limiting audit
- Input sanitization audit
- Secure headers (Helmet) verification
- Multi-tenant isolation verification

### Phase 8: Tests & Documentation
- E2E tests (Playwright or Cypress)
- Unit/integration coverage to 90%
- Architecture docs, deployment guide, CI/CD

---

## 5. Technical Decisions

### 5.1 Shared Validation
- **Decision:** Use Zod in fitnexa-shared, export schemas + inferred types.
- **Rationale:** Zod is already a dependency; frontend and backend can share; strong typing; single source of truth.

### 5.2 Password Reset
- **Decision:** Token-based, stored in DB, 1-hour expiry.
- **Rationale:** Stateless JWT for reset is possible but revocation is harder; DB token allows explicit invalidation.

### 5.3 Iron Template
- **Decision:** `irontemple` as fixed demo gym ID; copy-on-write for new gyms.
- **Rationale:** Clear separation between demo and real tenants; simple provisioning model.

---

## 6. Security Checklist

- [x] Forgot/reset password implemented securely (2026-02-16)
- [x] Email verification flow (POST /verify-email, sendVerificationEmail, resend-verification)
- [x] Rate limiting on auth endpoints (login, register, forgot-password)
- [x] Brute-force / account lockout (5 failed logins → 15 min lockout via LoginAttempt)
- [ ] CSRF protection (N/A – JWT in header, no cookie-based sessions)
- [x] Input sanitization – Zod validation, sanitizeForLogging for secrets
- [x] Secure headers (Helmet) – via createBaseService
- [x] HTTPS enforcement – `httpsEnforcement` middleware in @fitnexa/shared (opt-in)
- [ ] Secure cookie flags (N/A – JWT in header)
- [x] Webhook signature verification (Stripe)
- [x] Multi-tenant context – `tenantContextMiddleware`, `requireGymContext` in @fitnexa/shared
- [x] Audit logging – login, password reset, email verification logged with action tag
- [x] Refresh token validates user status (ACTIVE)
- [x] bcrypt 12 rounds consistently
- [x] /ready endpoint for load balancers
- [x] Graceful shutdown with Prisma disconnect
- [x] Registration error sanitization – generic "Registration failed" (no account enumeration)

---

## 7. References

- [Identity Service](../backend/services/identity-service.md)
- [Wizard Service](../backend/services/wizard-service.md)
- [Third-Party Services](../infrastructure/third-party-services-and-keys.md)
- [Gym Onboarding Flow](../features/gym-onboarding-flow.md)
