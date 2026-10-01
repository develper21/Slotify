# 🏛 System Architecture

## Slotify – Smart Appointment Booking Platform

This document describes the overall system architecture, technology stack, folder structure, data flow and key design decisions for the Slotify application.

---

## 1. High-Level Architecture

Slotify follows a full-stack architecture using Next.js (App Router), PostgreSQL and Drizzle ORM.

```text
┌───────────┐  HTTPS   ┌──────────────────┐          ┌───────────────────┐          ┌─────────────┐
│   User    │ ◄──────► │  Next.js         │ ◄──────► │  Next.js Backend  │ ◄──────► │ PostgreSQL  │
│ (Browser) │          │  Frontend        │          │ (Server Actions / │          │ (Neon Prod /│
└───────────┘          │  (RSC + Client)  │          │  API Routes)      │          │  Local DB)  │
                       └──────────────────┘          └─────────┬─────────┘          └─────────────┘
                                                               │
                                        ┌──────────────────────┼──────────────────────┐
                                        ▼                      ▼                      ▼
                                  ┌──────────┐          ┌───────────┐          ┌───────────────┐
                                  │  Stripe  │          │  Resend   │          │ Upstash Redis │
                                  │ (payments│          │  (email / │          │ (rate limits &│
                                  │+ webhooks)│         │   OTP)    │          │  slot locks)  │
                                  └──────────┘          └───────────┘          └───────────────┘
```

### 1.1 Key Design Decisions

- **Server-first rendering** — React Server Components by default; `"use client"` only where interactivity is needed.
- **Server Actions for mutations** — all business logic (auth, bookings, CRUD) lives in `lib/actions/*`; components never query the DB directly.
- **Concurrency-safe booking** — a distributed Redis lock is acquired per `(appointmentId, startTime)` before inserting a booking, guaranteeing zero double-bookings under parallel requests.
- **Custom JWT auth** — `jose` sessions in an HttpOnly cookie, passwords hashed with `bcryptjs`, role guards enforced server-side in `lib/guards.ts`.
- **Webhook-driven payments** — Stripe webhook (not the client redirect) is the source of truth for confirming paid bookings.

## 2. Technology Stack

Technologies used in the project and their purpose.

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | Next.js 16 (App Router) | UI framework, routing, RSC |
| Language | TypeScript | Type-safe development |
| Styling | Tailwind CSS | Design tokens & responsive UI |
| Backend | Server Actions / API Routes | Business logic & endpoints |
| Database | PostgreSQL (Neon + local) | Data persistence |
| ORM | Drizzle ORM + drizzle-kit | Schema, push, queries |
| Authentication | Custom JWT (jose) + bcryptjs | Sessions & password hashing |
| Payments | Stripe | Checkout sessions & webhooks |
| Email | Resend | OTPs & transactional email |
| Locks / Limits | Upstash Redis | Distributed locks & rate limiting |
| Charts | Recharts | Organizer dashboard graphs |
| Validation | Zod | Input validation |
| Testing | Jest + Playwright | Unit & E2E tests |
| Deployment | Vercel | Hosting & environment config |

## 3. Folder Structure

The project follows an App Router–based folder structure to keep the code organized and scalable.

```text
slotify/
├── app/                        # Next.js App Router (routes)
│   ├── (auth)/                 # login, signup, verify-email, forgot/reset password
│   ├── home/                   # Marketplace — browse published slots
│   ├── book/                   # Public booking flow  /book/[appointmentId]
│   ├── schedule/               # Public schedule view
│   ├── dashboard/              # Organizer panel (appointments, bookings,
│   │                           #   questions, notifications, profile, settings)
│   │   └── admin/              # Admin console (users, approvals)
│   ├── reports/  misc/         # Reports & misc pages
│   ├── api/                    # API routes (Stripe webhook, cron)
│   ├── layout.tsx              # Root layout (fonts, toaster)
│   └── page.tsx                # Landing page
├── components/                 # UI + feature components
│   ├── ui/                     # Button, Card, Badge, Input…
│   └── dashboard/ booking/ appointments/ bookings/ admin/ auth/ organizer/
├── lib/
│   ├── actions/                # Server actions (auth, appointments, bookings,
│   │                           #   payments, admin, notifications, organizer)
│   ├── db/                     # schema.ts (Drizzle) + db client
│   ├── auth.ts  guards.ts      # Session & role guards
│   ├── stripe.ts  redis.ts  email.ts  otp.ts
│   ├── rate-limit.ts  audit-log.ts  session-timeout.tsx
│   └── utils.ts  mock-mode.ts
├── drizzle/                    # Drizzle metadata (schema-first push workflow)
├── scripts/                    # db-seed.mjs, db-reset.mjs, db-inspect.mjs (--env production)
├── docs/                       # PRD, ARCHITECTURE, RULES, DESIGN, TASKS, MEMORY
├── tests/                      # Playwright E2E
├── types/                      # Shared TypeScript types
├── .env.local                  # Local DB + secrets
├── .env.production             # Production DB (Neon) + secrets
├── drizzle.config.ts           # Drizzle config (--env support)
└── tailwind.config.js          # Design tokens (see DESIGN.md)
```

## 4. Data Flow — Booking Example

1. Client opens `/book/[appointmentId]` → server component loads the appointment, schedules and already-taken slots.
2. Client picks a free slot and answers intake questions → Server Action `createBooking` is called.
3. Action validates input (Zod), acquires a Redis lock on the slot, then inserts the booking:
   - **Paid service** → status `pending_payment` → redirect to Stripe Checkout → webhook confirms → `confirmed`
   - **Free service** → status `pending` → organizer approves → `confirmed`
4. Notifications are created for both organizer and client; audit log records the event.

## 5. Deployment Architecture

- **App**: Vercel (preview + production environments)
- **Database**: Neon Postgres (production) / local Postgres (development)
- **Services**: Upstash Redis, Stripe, Resend
- **Env separation**: `.env.local` (local) vs `.env.production` (production); all db scripts accept `--env production`
