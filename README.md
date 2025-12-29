# SalonPro - Generic Booking & Management System

SalonPro is a modern, full-stack SaaS solution designed for salons, spas, and service-based businesses. It features a comprehensive booking system, customer CRM, staff management, and a high-performance landing page.

## Tech Stack

### Monorepo
-   **Manager**: `pnpm` + `Turborepo`
-   **Structure**: `apps/` (api, web) & `packages/` (shared config)

### Backend (`apps/api`)
-   **Framework**: NestJS 10
-   **Database**: MongoDB (Mongoose)
-   **Caching/Queues**: Redis + BullMQ
-   **Auth**: JWT (Access/Refresh), RBAC, NextAuth Integration

### Frontend (`apps/web`)
-   **Framework**: Next.js 16 (App Router)
-   **UI**: TailwindCSS, shadcn/ui
-   **State**: React Query (TanStack Query)
-   **Calendar**: react-big-calendar

## Getting Started

### Prerequisites
-   Node.js >= 18
-   Docker (for local DB/Redis)
-   pnpm

### Installation

1.  **Start Infrastructure**:
    ```bash
    pnpm docker:up
    ```
    (Starts MongoDB on port 27017 and Redis on port 6379)

2.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

3.  **Environment Setup**:
    Copy `.env.example` to `.env` in the root and configure secrets.
    ```bash
    cp .env.example .env
    ```

4.  **Run Development Server**:
    ```bash
    pnpm dev
    ```
    -   **Web**: http://localhost:3000
    -   **API**: http://localhost:3001
    -   **Swagger Docs**: http://localhost:3001/api/docs

## Features available
-   **Landing Page**: public homepage.
-   **Dashboard**: `/dashboard` (KPIs, Stats).
-   **Bookings**: `/dashboard/bookings` (Calendar).
-   **Customers**: `/dashboard/customers` (CRM).
-   **Services**: `/dashboard/services` (Service Menu).

## License
[MIT](LICENSE)
