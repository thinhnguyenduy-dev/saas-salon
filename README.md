# SalonPro - Generic Booking & Management System

SalonPro is a modern, full-stack SaaS solution designed for salons, spas, and service-based businesses. It features a comprehensive marketplace for customers to find and book services, alongside a powerful partner dashboard for business owners to manage their operations, staff, and bookings.

## Tech Stack

### Backend (`/backend`)
- **Framework**: NestJS 11
- **Database**: PostgreSQL (TypeORM) with PostGIS extensions
- **Caching/Queues**: Redis + BullMQ
- **Auth**: JWT (Access/Refresh), RBAC
- **Documentation**: Swagger/OpenAPI

### Frontend (`/frontend`)
- **Framework**: Next.js 16 (App Router)
- **UI**: TailwindCSS v4, shadcn/ui
- **State**: React Query (TanStack Query), Zustand
- **Auth**: NextAuth.js v5 (Beta)
- **Calendar**: react-big-calendar
- **Forms**: React Hook Form + Zod

## Project Structure

```
/
├── backend/          # NestJS API server
├── frontend/         # Next.js web application
├── docker-compose.yml
├── README.md
└── ...
```

## Getting Started

### Prerequisites
- Node.js >= 20
- Docker (for local PostgreSQL/Redis)
- pnpm

### Installation

1. **Start Infrastructure**:
    Start the database and cache services using Docker.
    ```bash
    docker-compose up -d
    ```
    - PostgreSQL runs on port `5432` (or `5433` if configured).
    - Redis runs on port `6379`.
    - pgAdmin runs on port `8081`.

2. **Backend Setup**:
    ```bash
    cd backend
    
    # Install dependencies
    pnpm install
    
    # Configure environment
    cp .env.example .env
    # Update .env with your DB credentials if different from docker-compose defaults
    
    # Seed the database (Important for initial data)
    pnpm run seed
    
    # Start the development server
    pnpm run start:dev
    ```

3. **Frontend Setup**:
    ```bash
    cd ../frontend
    
    # Install dependencies
    pnpm install
    
    # Start the development server
    pnpm run dev
    ```

4. **Access the Application**:
    - **Marketplace/Home**: http://localhost:3000
    - **Search Page**: http://localhost:3000/search
    - **API Docs**: http://localhost:3001/api/docs
    - **Database UI (pgAdmin)**: http://localhost:8081

## Features

### Marketplace (Public)
- **Shop Discovery**: Search and filter salons by category and location.
- **Shop Profiles**: View services, staff, and details for each business.
- **Booking Wizard**: 4-step smart booking flow (Services -> Staff -> Time -> Checkout).
- **guest Checkout**: Book appointments without creating an account upfront.

### Partner Dashboard (Protected)
- **Overview**: KPIs and business statistics.
- **Calendar**: Drag-and-drop management of bookings.
- **CRM**: complete customer management.
- **Catalog**: Manage services and assign staff skills.

## License
[MIT](LICENSE)
