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

## Quality checks

Slotify is a single Next.js project: the UI is in `app/` and `components/`, while API routes, server actions, and shared server logic are in `app/api/`, `lib/actions/`, and `lib/`. Install the root dependencies once with `npm ci`.

```bash
npm run lint             # Lint the tested frontend and server code
npm run lint:all         # Lint the full project
npm test -- --ci --runInBand
npm run typecheck
npm run build
```

The unit suites are in `tests/frontend/` and `tests/server/`. GitHub Actions runs the focused lint, unit tests, type-check, and production build on pushes and pull requests.

## Tech Stack
- **Framework**: Next.js 14
- **Database**: Postgres
- **ORM**: Drizzle
- **Auth**: Custom JWT
- **UI**: Tailwind CSS, Framer Motion
- **Emails**: Resend
- **Payments**: Stripe
