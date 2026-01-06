# SalonPro - Generic Booking & Management System

SalonPro is a modern, full-stack SaaS solution designed for salons, spas, and service-based businesses. It features a comprehensive booking system, customer CRM, staff management, and a high-performance landing page.

## Tech Stack

### Backend (`/backend`)
- **Framework**: NestJS 11
- **Database**: MongoDB (Mongoose)
- **Caching/Queues**: Redis + BullMQ
- **Auth**: JWT (Access/Refresh), RBAC

### Frontend (`/frontend`)
- **Framework**: Next.js 16 (App Router)
- **UI**: TailwindCSS v4, shadcn/ui
- **State**: React Query (TanStack Query)
- **Auth**: NextAuth.js
- **Calendar**: react-big-calendar

## Project Structure

```
/
├── backend/          # NestJS API server
├── frontend/         # Next.js web application
├── docker-compose.yml
├── .env
└── README.md
```

## Getting Started

### Prerequisites
- Node.js >= 18
- Docker (for local DB/Redis)
- pnpm

### Installation

1. **Start Infrastructure**:
    ```bash
    docker-compose up -d
    ```
    (Starts MongoDB on port 27017 and Redis on port 6379)

2. **Environment Setup**:
    Copy `.env.example` to `.env` and configure secrets.
    ```bash
    cp .env.example .env
    ```

3. **Install Dependencies & Run**:

    **Backend**:
    ```bash
    cd backend
    pnpm install
    pnpm run start:dev
    ```

    **Frontend**:
    ```bash
    cd frontend
    pnpm install
    pnpm run dev
    ```

4. **Access the Application**:
    - **Web**: http://localhost:3000
    - **API**: http://localhost:3001
    - **Swagger Docs**: http://localhost:3001/api/docs

## Features
- **Landing Page**: Public homepage
- **Dashboard**: `/dashboard` (KPIs, Stats)
- **Bookings**: `/dashboard/bookings` (Calendar view)
- **Customers**: `/dashboard/customers` (CRM)
- **Services**: `/dashboard/services` (Service menu)

## License
[MIT](LICENSE)
