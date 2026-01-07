# BeautyBook Implementation Plan

## Phase 1: Foundation & Backend (Completed)
- [x] Monorepo Setup (NestJS + Next.js)
- [x] Database Migration (Mongo -> Postgres/TypeORM)
- [x] Basic Auth (JWT)
- [x] Core Entities (Shop, User, Service, Staff, Booking)
- [x] Seeding Script

## Phase 2: Core API & Basic UI (Completed)
- [x] Backend CRUD Endpoints
- [x] Landing Page UI
- [x] Docker Environment Fixes

## Phase 3: Marketplace & Public Booking ✅ (Completed Jan 6, 2026)
**Goal:** Enable customers to find salons and make bookings.
1.  **Search & Discovery UI** ✅
    *   Connect Homepage "Categories" to a Search Page.
    *   Implement "Shops Near Me" using the backend's geospatial API.
    *   Filters: Category, Price, Rating.
2.  **Shop Detail Page** (`/salon/[slug]`) ✅
    *   Display Shop Info (Images, Hours, Address).
    *   List Services & Prices.
    *   List Staff members.
3.  **Booking Flow** ✅
    *   Interactive 4-step wizard (Services → Staff → Time → Checkout).
    *   Real-time slot availability from backend API.
    *   Guest booking with auto-customer creation.
    *   Full end-to-end integration tested and verified.

**Status:** All features complete. See `PHASE3_COMPLETE.md` for detailed documentation.

---

## Phase 4: Partner Dashboard (Current Focus)
**Goal:** Enable shop owners to manage their business.
1.  **Calendar View** - ✅ Foundation Complete
    *   [x] Drag-and-drop calendar UI (React Big Calendar).
    *   [x] View Daily/Weekly/Monthly bookings.
    *   [x] Real-time data fetching from backend.
    *   [ ] "New Booking" Modal implementation.
    *   [ ] Drag-and-drop updates (backend integration).
2.  **Management Tables**
    *   Staff Management (Shift scheduling).
    *   Service Menu Editor.
    *   Customer CRM.
3.  **Shop Settings**
    *   Business Hours configuration.
    *   Profile update.

## Phase 5: Advanced Features (Active)
**Goal:** Add monetization, engagement, and insights.

### 5.1 Payments (Stripe Integration)
*   **Backend:**
    *   Install `stripe` package.
    *   Update `Booking` entity: `paymentStatus` (PENDING, PAID, FAILED), `paymentIntentId`.
    *   Create `PaymentsModule` and `PaymentsService`.
    *   Endpoint: `POST /payments/create-intent` (creates PaymentIntent for a booking).
    *   Webhook: `POST /payments/webhook` (listens for `payment_intent.succeeded`).
*   **Frontend:**
    *   Install `@stripe/stripe-js` and `@stripe/react-stripe-js`.
    *   Update Booking Wizard: Add "Payment" step before/after confirmation.
    *   Implement Payment Element form.

### 5.2 Notifications
*   **Backend:**
    *   Use `bullmq` for separate notification queue.
    *   Email Service (e.g., SendGrid or Nodemailer for dev).
    *   Triggers: Booking Created, Booking Cancelled, Reminder (Cron).
*   **Frontend:**
    *   (Optional) In-app notification center.

### 5.3 Reviews & Ratings
*   **Backend:**
    *   `Review` Entity (rating, comment, photos, relationships to Shop, Service, Customer).
    *   Endpoints: Create, Get by Shop/Service.
*   **Frontend:**
    *   Review Form on Booking History or after completion.
    *   Display stars/reviews on Shop Detail page.

### 5.4 Analytics (Partner Dashboard)
*   **Backend:**
    *   Endpoints for: Revenue, Booking Counts, Top Services.
*   **Frontend:**
    *   Charts (Recharts or Chart.js) for "Revenue over time".

