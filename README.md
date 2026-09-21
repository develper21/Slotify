# Slotify

Slotify is a complete booking system built with Next.js 14, TypeScript, Tailwind CSS, and a custom Postgres backend (Drizzle ORM).

## Features
- Custom JWT Authentication
- Postgres Database with Drizzle ORM
- Appointment Management
- Booking System
- Notifications & Audit Logs

## Setup

1. **Environment Variables**:
   Create a `.env` file with:
   ```env
   DATABASE_URL=your_postgres_url
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=...
   RESEND_API_KEY=...
   ```

2. **Database Migration**:
   ```bash
   npm run drizzle:generate
   npm run drizzle:migrate
   ```

3. **Development**:
   ```bash
   npm run dev
   ```

## Tech Stack
- **Framework**: Next.js 14
- **Database**: Postgres
- **ORM**: Drizzle
- **Auth**: Custom JWT
- **UI**: Tailwind CSS, Framer Motion
- **Emails**: Resend
- **Payments**: Stripe
