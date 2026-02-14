---
sidebar_position: 1
title: "Third-Party Integration"
description: "How to make FitNexa features embeddable and consumable by gyms that already have admin software"
---

# Third-Party Integration Strategy

Gyms that already use admin software (Mindbody, Glofox, ClubReady, etc.) won't switch entirely. FitNexa must let them **pick and choose** features as add-ons — without replacing their existing panel.

## Integration Strategies (Ranked)

```mermaid
flowchart LR
    subgraph "Gym's Existing System"
        AdminPanel[Their Admin Panel]
    end

    subgraph "FitNexa Platform"
        API[Public REST API]
        Widgets[Embeddable Widgets]
        Hooks[Webhooks]
    end

    AdminPanel -- "REST calls" --> API
    AdminPanel -- "iframe / Web Component" --> Widgets
    API -- "Event push" --> Hooks
    Hooks -- "POST to their URL" --> AdminPanel
```

---

## Strategy 1: Public REST API + API Keys

**What:** Expose a documented, versioned API with per-gym API keys so their existing admin panel can call FitNexa directly.

```bash
POST https://api.gymia.fit/v1/challenges
Authorization: Bearer gym_api_key_xxx
Content-Type: application/json

{ "title": "January Push-up Challenge", "goal": 1000, "type": "total_workouts" }
```

### What needs to be built

| Component             | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| API Key management    | Per-gym keys in `identity-service`, separate from user JWTs |
| Rate limiting per key | Prevent abuse per API key, not just per IP                  |
| Versioned endpoints   | `/v1/` prefix so integrations never break                   |
| Public OpenAPI docs   | Published at `https://docs.gymia.fit/api`                   |

:::tip Best for
Gyms with dev teams or IT staff who can integrate APIs directly.
:::

---

## Strategy 2: Embeddable Widgets

**What:** Package FitNexa features as standalone `<iframe>` widgets or Web Components that drop into ANY admin panel with 2 lines of code.

### Usage (Web Component)

```html
<script src="https://widgets.gymia.fit/sdk.js"></script>
<fitnexa-challenges gym-id="iron-temple" api-key="gk_xxx"></fitnexa-challenges>
```

### Usage (iframe)

```html
<iframe
  src="https://widgets.gymia.fit/challenges?gym=iron-temple&key=gk_xxx"
  style="width:100%;height:600px;border:none;">
</iframe>
```

### Available Widgets

| Widget                 | What it embeds                       |
| ---------------------- | ------------------------------------ |
| `<fitnexa-challenges>` | Monthly challenges dashboard         |
| `<fitnexa-checkins>`   | Real-time check-in feed + QR scanner |
| `<fitnexa-members>`    | Member list with search/filter       |
| `<fitnexa-nutrition>`  | Nutrition AI + meal plans            |
| `<fitnexa-messaging>`  | Member inbox                         |
| `<fitnexa-analytics>`  | Dashboard charts                     |

### Architecture

The Gym Admin is already a React app — each page can be extracted into a standalone micro-frontend that runs either inside the full admin OR as an embedded widget.

**Required components:**

- `fitnexa-widgets` package wrapping each feature in a Web Component or iframe
- PostMessage API for the host page to communicate (theme, auth, events)
- Theme inheritance — widget reads host CSS variables or accepts theme props
- Widget builder in Super Admin: "Generate embed code for [Feature]"

:::tip Best for
The largest market — gyms without dev teams can copy-paste an embed code into any platform.
:::

---

## Strategy 3: Webhooks + Event Subscriptions

**What:** FitNexa pushes real-time events to the gym's existing systems for two-way sync.

### Registration

```json
POST https://api.gymia.fit/v1/webhooks
{
  "url": "https://their-system.com/fitnexa-events",
  "events": ["member.checked_in", "challenge.completed", "member.registered"],
  "secret": "whsec_xxx"
}
```

### Event Payload

```json
{
  "event": "member.checked_in",
  "timestamp": "2026-02-14T15:00:00Z",
  "data": {
    "memberId": "u123",
    "locationId": "l1",
    "gymId": "iron-temple"
  },
  "signature": "sha256=abc..."
}
```

### Supported Events

| Event                  | Trigger                       |
| ---------------------- | ----------------------------- |
| `member.registered`    | New member signs up           |
| `member.checked_in`    | Member scans QR code          |
| `challenge.completed`  | Member finishes a challenge   |
| `challenge.created`    | Admin creates a new challenge |
| `workout.completed`    | Member logs a workout         |
| `subscription.changed` | Membership tier changes       |

:::tip Best for
Enterprise customers, CRM sync, billing system integration. Their system reacts to FitNexa events in real time.
:::

---

## Implementation Roadmap

```mermaid
gantt
    title Integration Feature Roadmap
    dateFormat YYYY-MM-DD
    axisFormat %b

    section Phase 1 — Foundation
    API Key auth (identity-service)        :p1a, 2026-03-01, 5d
    Rate limiting per API key              :p1b, after p1a, 3d
    Versioned routes (/v1/)                :p1c, after p1a, 3d
    OpenAPI public docs                    :p1d, after p1c, 3d

    section Phase 2 — Widgets
    Extract features as micro-frontends    :p2a, after p1d, 10d
    Web Component wrapper + SDK            :p2b, after p2a, 7d
    Theme inheritance via PostMessage      :p2c, after p2b, 5d
    Widget builder in Super Admin          :p2d, after p2c, 5d

    section Phase 3 — Webhooks
    Webhook registration endpoint          :p3a, after p2d, 5d
    Event dispatch from services           :p3b, after p3a, 7d
    Retry + dead letter queue              :p3c, after p3b, 5d

    section Phase 4 — SSO
    OAuth2 provider in identity-service    :p4a, after p3c, 10d
    SAML support (enterprise)              :p4b, after p4a, 7d
```

| Phase       | What                  | Unlocks                                               |
| ----------- | --------------------- | ----------------------------------------------------- |
| **Phase 1** | Public API + API Keys | Everything else — widgets and webhooks depend on this |
| **Phase 2** | Embeddable Widgets    | Biggest market reach — copy-paste integration         |
| **Phase 3** | Webhooks              | Enterprise two-way sync                               |
| **Phase 4** | OAuth2 / SSO          | Single sign-on from their systems into FitNexa        |

---

Related: [Backend Architecture](../backend/architecture) · [API Client](../frontend/api-client) · [Services Catalog](../backend/services-catalog)
