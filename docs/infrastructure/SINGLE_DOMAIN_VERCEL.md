# Single Domain: Landing → Onboarding → Gym Admin (subdomain) → Mobile App

This doc describes how to use **one main domain** for the full flow: landing page, onboarding, **per-gym admin on a subdomain**, and mobile app creation from the gym admin.

**Option B is implemented:** The backend is served only at **`https://api.uat.gymia.fit`**. The root `uat.gymia.fit` is for Vercel (Landing). Scripts, mobile build, and backend Caddy already use `api.uat.gymia.fit`; you only need to complete **DNS** and **Vercel** steps below.

---

## Step-by-step: everything you have to do

Do these in order. You need: access to DNS for `uat.gymia.fit`, Vercel dashboard, and the repos for Landing, Gym Admin, and Super Admin.

### Phase 1: API (backend) – Option B done

The backend has been moved to **`api.uat.gymia.fit`**:

- **Caddy** (fitnexa-backend): serves only `api.uat.gymia.fit`; root landing HTML is no longer on the backend.
- **Scripts and mobile:** `build-mobile-uat`, `easy-setup`, `easy-test` use `https://api.uat.gymia.fit`.
- **Backend docs:** All UAT API URLs in docs point to `https://api.uat.gymia.fit`.

You still need to: **(1)** Add DNS for `api.uat.gymia.fit` → your server IP, and **(2)** Deploy the backend (so Caddy uses the updated Caddyfile). Then point `uat.gymia.fit` and `www.uat.gymia.fit` to Vercel for the Landing.

---

### Phase 2: DNS (where you manage uat.gymia.fit)

Do this in your DNS provider (e.g. Cloudflare, Namecheap, Route53, etc.).

1. **Root domain (only if using Option B above)**  
   - Add the **A** and/or **CNAME** records that Vercel will show when you add `uat.gymia.fit` to the Landing project (Vercel Dashboard → Landing project → Settings → Domains → Add).  
   - Often: A record `uat.gymia.fit` → `76.76.21.21` (or the IP Vercel gives).

2. **www (optional)**  
   - Add CNAME: **Name** `www`, **Target** `cname.vercel-dns.com` (or the value Vercel shows for `www.uat.gymia.fit`).

3. **Super Admin**  
   - Add CNAME: **Name** `admin`, **Target** `cname.vercel-dns.com` (or Vercel’s target).

4. **Gym Admin (wildcard)**  
   - Add CNAME: **Name** `*` (wildcard; some providers use `*.uat.gymia.fit`), **Target** `cname.vercel-dns.com`.

5. **Optional – onboarding subdomain**  
   - If you want `onboard.uat.gymia.fit`: CNAME **Name** `onboard`, **Target** `cname.vercel-dns.com`.

6. **API (required for Option B) – so `api.uat.gymia.fit` reaches your backend**  
   - **If your DNS zone is `uat.gymia.fit`** (you manage records *under* uat.gymia.fit):  
     - Add **A** record: **Name** `api`, **Target** your backend server IP (e.g. `89.167.47.120`).  
     - Or **CNAME** **Name** `api`, **Target** the hostname that resolves to that server.  
   - **If your DNS zone is `gymia.fit`** (you manage the parent domain and `uat` is already a record):  
     - Add **A** record: **Name** `api.uat`, **Target** your backend server IP.  
     - Or **CNAME** **Name** `api.uat`, **Target** the hostname that resolves to that server.  
   - In both cases the result is: **api.uat.gymia.fit** → your backend (Caddy + gateway).

Save DNS and wait a few minutes for propagation (can take up to 48h in rare cases).

---

### Phase 3: Vercel – add domains to each project

1. **Landing project**  
   - Vercel → your **Landing** project → **Settings** → **Domains**.  
   - Add: `uat.gymia.fit`.  
   - If you use www: add `www.uat.gymia.fit`.  
   - Set the primary domain (e.g. `uat.gymia.fit`).  
   - Vercel will show “Invalid configuration” until DNS is correct; after DNS propagates it will turn valid.

2. **Super Admin project**  
   - **Settings** → **Domains** → Add: `admin.uat.gymia.fit`.

3. **Gym Admin project**  
   - **Settings** → **Domains** → Add: `*.uat.gymia.fit` (wildcard).  
   - Leave `uat.gymia.fit` and `www.uat.gymia.fit` only on the Landing project.

4. **Onboarding (if separate project)**  
   - If you have a separate Onboarding project: add `onboard.uat.gymia.fit`.  
   - If onboarding is a route inside the Landing app (e.g. `/onboarding`), you don’t need a separate domain.

---

### Phase 4: App configuration

1. **Landing (and onboarding if same app)**  
   - Ensure the app is deployed and uses **`https://api.uat.gymia.fit`** for any API calls.  
   - If onboarding is the same app, add a route like `/onboarding` and link to it from the landing page.

2. **Super Admin**  
   - Set env (e.g. `VITE_API_URL`) to **`https://api.uat.gymia.fit`**.  
   - Redeploy so the build uses that env.

3. **Gym Admin (subdomain → gym slug)**  
   - In the Gym Admin app, add logic to derive the gym from the hostname (see code block in section 3.2 below).  
   - Use a constant or env for the base domain, e.g. `VITE_APP_DOMAIN=uat.gymia.fit`.  
   - On load: if `gymSlug` is null (e.g. user opened the default `xxx.vercel.app` URL), redirect to `https://uat.gymia.fit` or show “Select your gym”.  
   - Use `gymSlug` for all API calls that need the current gym and for “Create mobile app” (e.g. `build:mobile:uat <gymSlug>`).  
   - Deploy the updated Gym Admin so it’s live on `*.uat.gymia.fit`.

4. **Backend / mobile app (if you moved API)**  
   - If you switched to `api.uat.gymia.fit`: update backend config and mobile app `API_URL` (or equivalent) to `https://api.uat.gymia.fit` and redeploy/rebuild.

---

### Phase 5: Verify

1. Open `https://uat.gymia.fit` → should show Landing (or API/landing page if you kept API on root).  
2. Open `https://admin.uat.gymia.fit` → Super Admin.  
3. Open `https://irontemple.uat.gymia.fit` (or a real gym slug) → Gym Admin for that gym.  
4. From a gym subdomain, test “Create mobile app” (or equivalent) and confirm it uses the correct gym and API URL.

---

## 1. Product flow (what we’re supporting)

| Step | Where it lives | URL pattern |
|------|----------------|-------------|
| 1. Landing | Main marketing / entry | `https://uat.gymia.fit` |
| 2. Onboarding | Sign up, create gym, etc. | `https://uat.gymia.fit/onboarding` (or `onboard.uat.gymia.fit`) |
| 3. Gym admin | One admin per gym, **each on its own subdomain** | `https://{gym-slug}.uat.gymia.fit` (e.g. `irontemple.uat.gymia.fit`, `greentheory.uat.gymia.fit`) |
| 4. Super Admin | Platform-level (optional) | `https://admin.uat.gymia.fit` |
| 5. Mobile app | Created/configured from gym admin; APK built per gym | Triggered from gym admin; app uses same API (e.g. `uat.gymia.fit`) |

So: **one domain**, with **wildcard subdomains** for gym-specific admins. From a gym’s subdomain, the owner can create/configure the branded mobile app (which you already build per gym via `build:mobile:uat <gym-id>`).

---

## 2. Recommended domain layout (one domain)

Use **one main domain** (e.g. `uat.gymia.fit`) and assign:

| URL | App | Vercel project / note |
|-----|-----|------------------------|
| `uat.gymia.fit`, `www.uat.gymia.fit` | Landing | Landing project |
| `uat.gymia.fit/onboarding` | Onboarding | Same as Landing, or separate Onboarding project with path rewrite |
| `*.uat.gymia.fit` (wildcard) | **Gym Admin** (one app, many tenants by subdomain) | **Single** Gym Admin project with wildcard domain |
| `admin.uat.gymia.fit` | Super Admin | Super Admin project |

Important: **Gym Admin is one Vercel project** that serves **all** gym subdomains. The app reads the hostname (e.g. `irontemple.uat.gymia.fit`), derives the gym slug, and loads that gym’s data (and optionally triggers mobile app creation for that gym).

---

## 3. DNS and Vercel setup

### 3.1 Main domain and fixed subdomains

In your DNS provider (where you manage `uat.gymia.fit`):

- **Root / www:** Add the records Vercel shows when you add `uat.gymia.fit` and `www.uat.gymia.fit` to the **Landing** project (often A for root, CNAME for www).
- **Super Admin:** Add a CNAME for `admin` → `cname.vercel-dns.com` (or the target Vercel gives). In Vercel, add `admin.uat.gymia.fit` to the **Super Admin** project.

### 3.2 Wildcard subdomain for Gym Admin

To support `{gym-slug}.uat.gymia.fit` for every gym:

1. **DNS:** Add a **wildcard CNAME**:
   - **Name/host:** `*` (or `*.uat.gymia.fit` depending on provider; some use `*` only).
   - **Target:** `cname.vercel-dns.com` (or the CNAME target shown by Vercel for the wildcard).

2. **Vercel (Gym Admin project):**
   - Settings → Domains → Add: `*.uat.gymia.fit`.
   - Vercel will issue a cert for all subdomains and route `*.uat.gymia.fit` to this one project.

3. **Gym Admin app (runtime):**
   - Read `window.location.hostname` (e.g. `irontemple.uat.gymia.fit`).
   - Strip the suffix to get the gym slug (e.g. `irontemple`).
   - Use that slug to:
     - Call your API to load that gym’s config/branding, and
     - Show the correct tenant; from here the gym owner can trigger “create mobile app” (which uses your existing per-gym APK build flow).

No separate Vercel project per gym: one Gym Admin app, one wildcard domain.

**Implementation note (Gym Admin app):** Resolve the gym slug from the hostname so the same build serves every gym:

```ts
// Example: irontemple.uat.gymia.fit → gymSlug = 'irontemple'
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const baseDomain = 'uat.gymia.fit'; // or from env, e.g. VITE_APP_DOMAIN
const gymSlug = hostname.endsWith(`.${baseDomain}`)
  ? hostname.slice(0, -(`.${baseDomain}`.length))
  : null;
// If gymSlug is null, show "select gym" or redirect to main domain. Otherwise load that gym's admin.
```

Use `gymSlug` for API calls and for triggering the mobile app build for that gym.

---

## 4. Optional: onboarding on a subdomain

If you prefer onboarding on its own subdomain:

- **DNS:** CNAME `onboard.uat.gymia.fit` → `cname.vercel-dns.com`.
- **Vercel:** Add `onboard.uat.gymia.fit` to the **Onboarding** project (or the same project that serves onboarding).

Then the flow is: Landing at `uat.gymia.fit` → redirect or link to `onboard.uat.gymia.fit` → after creation, redirect to `{gym-slug}.uat.gymia.fit`.

---

## 5. Path-based alternative (no wildcard)

If you don’t want subdomains for gyms, you can use paths:

- `uat.gymia.fit` → Landing  
- `uat.gymia.fit/onboarding` → Onboarding  
- `uat.gymia.fit/gym/irontemple` → Gym admin for gym `irontemple`  
- `uat.gymia.fit/admin` → Super Admin (with rewrites as in the example `vercel-single-domain.example.json`)

Then the Gym Admin app is built with a base path (e.g. `/gym`) and the router uses a dynamic segment (e.g. `/gym/:gymSlug`). Same backend and “create mobile app” flow; only the URL shape changes.

---

## 6. Mobile app creation from gym admin

From the gym admin (whether `irontemple.uat.gymia.fit` or `uat.gymia.fit/gym/irontemple`):

- The UI can offer “Create / build mobile app” for that gym.
- Backend or CI can run the same logic as your existing script: e.g. `npm run build:mobile:uat <gym-id>` (with the gym slug/id for that tenant). The mobile app already points at your API (e.g. `https://uat.gymia.fit`); no extra domain needed for the app itself.
- Optionally store the gym’s branding/config in your API so the build uses the right assets and bundle id.

So: **one domain** for web (landing, onboarding, gym admin, super admin); **mobile app** is built per gym and uses your existing API domain.

---

## 7. Summary

| Need | Approach |
|------|----------|
| One brand domain | Use one root domain (e.g. `uat.gymia.fit`) for all web apps. |
| Landing + onboarding | `uat.gymia.fit` + `uat.gymia.fit/onboarding` (or `onboard.uat.gymia.fit`). |
| **Gym-based admin with a certain subdomain** | **Wildcard** `*.uat.gymia.fit` → one Gym Admin Vercel project; app resolves subdomain to gym slug and shows that tenant. |
| Super Admin | `admin.uat.gymia.fit` → Super Admin project. |
| Create mobile app from gym admin | Same backend/API; gym admin triggers per-gym build (e.g. `build:mobile:uat <gym-id>`); APK uses your API domain. |

For the flow “landing → onboarding → gym admin on a subdomain → create mobile app,” the critical piece is: **one Gym Admin app** + **wildcard domain** `*.uat.gymia.fit` + **resolve hostname to gym slug** in the app.
