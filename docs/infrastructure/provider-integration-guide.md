---
sidebar_position: 5
title: "Provider Integration Guide"
description: "Detailed integration flows, webhook security, retry strategies, and failure handling"
---

# Provider Integration Guide

This document covers integration details, security, retry strategies, and failure handling for all external providers.

---

## 1. Stripe (Payments)

### Webhook Security

Stripe webhooks are verified using the signing secret. The Wizard service uses `stripe.webhooks.constructEvent()` which:

- Verifies the `Stripe-Signature` header
- Rejects tampered or replayed payloads
- Returns `null` on failure (handler logs and ignores)

**Endpoint:** `POST /wizard/webhooks/stripe`

**Required header:** `Stripe-Signature` (provided by Stripe)

**Environment:** `STRIPE_WEBHOOK_SECRET` must match the webhook's signing secret in Stripe Dashboard.

### Subscription Lifecycle

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Payment completed → trigger gym activation / licensing |
| `customer.subscription.updated` | (Future) Handle plan changes |
| `customer.subscription.deleted` | (Future) Handle cancellation |
| `invoice.payment_failed` | (Future) Notify admin, retry logic |

### Refunds

Refunds are handled via Stripe Dashboard or API. For automated refunds:

1. Use `stripe.refunds.create({ payment_intent: 'pi_xxx' })`
2. Update internal subscription/payment status
3. Send confirmation email

### Failure Handling

| Scenario | Handling |
|----------|----------|
| Webhook signature invalid | Log warning, return 200 (prevent retries), do not process |
| Event type not handled | Return 200, log for observability |
| DB update fails | Return 500 so Stripe retries (idempotency key recommended) |
| Duplicate event | Check `event.id` or metadata; skip if already processed |

### Local Development

```bash
# Install Stripe CLI, then:
stripe login
stripe listen --forward-to localhost:3006/webhooks/stripe

# Copy the webhook signing secret (whsec_xxx) to STRIPE_WEBHOOK_SECRET in .env
```

---

## 2. Email (Mailjet / Identity)

### Transactional Emails

| Type | Service | Template |
|------|---------|----------|
| Activation | Wizard | Activation link + gym name |
| Welcome | Wizard | Dashboard URL + gym name |
| Password Reset | Identity | Reset link + expiry |

### Retry Strategy

- Mailjet handles retries internally
- Identity/Wizard: no built-in retry; failed sends throw and are logged
- **Recommendation:** Add a queue (e.g. RabbitMQ) for failed emails and retry with backoff

### Failure Scenarios

| Scenario | Handling |
|----------|----------|
| API key invalid | Log error, throw; caller should not assume email sent |
| Rate limited | Mailjet returns 429; implement exponential backoff |
| Recipient bounce | Mailjet reports via webhooks; handle in event handler |
| Network timeout | Retry up to 2 times with 5s delay (to be implemented) |

### Alternative Providers

- **SendGrid:** Similar REST API; add `SendGridEmailService` implementing `IEmailService`
- **Resend:** REST API; add `ResendEmailService`
- **AWS SES:** Use `nodemailer` with SES transport

---

## 3. Push Notifications (Firebase) – Planned

### Setup

| Variable | Description |
|----------|-------------|
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_PRIVATE_KEY` | Service account private key (base64) |
| `FIREBASE_CLIENT_EMAIL` | Service account client email |

### Flow

1. Mobile app registers FCM token with backend
2. Backend stores token per user/gym
3. Notifications sent via Firebase Admin SDK
4. Handle token refresh and invalid tokens

### Local Development

Use Firebase Emulator or test on physical device with FCM.

---

## 4. Storage (S3 / Compatible) – Planned

### Use Cases

- Profile avatars
- Gym logos
- Workout videos / content

### Environment Variables

| Variable | Description |
|----------|-------------|
| `S3_BUCKET` | Bucket name |
| `S3_REGION` | AWS region |
| `AWS_ACCESS_KEY_ID` | Access key |
| `AWS_SECRET_ACCESS_KEY` | Secret key |
| `S3_ENDPOINT` | Optional; for MinIO/local stack |

### Security

- Presigned URLs for upload/download
- Bucket policy: private by default
- CORS configured for web uploads

---

## 5. SMS – Planned

### Use Cases

- 2FA codes
- Appointment reminders
- Marketing (opt-in)

### Suggested Providers

- Twilio
- AWS SNS
- MessageBird

### Environment Variables (Twilio example)

| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Account SID |
| `TWILIO_AUTH_TOKEN` | Auth token |
| `TWILIO_PHONE_NUMBER` | Sender number |

---

## General Practices

- **Never log full API keys** – mask in logs
- **Use environment-specific keys** – test vs live
- **Validate webhook payloads** – always verify signatures
- **Implement idempotency** – for payment and email handlers
- **Monitor failure rates** – set up alerts for provider errors

---

Related: [Third-Party Services & API Keys](third-party-services-and-keys.md) · [UAT Setup](uat-setup.md)
