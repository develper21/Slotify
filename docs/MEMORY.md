# 🧠 Project Memory

## Slotify – Context, Progress & Important Notes

This document keeps track of the current state of the project, important decisions and things to remember. It helps maintain continuity across development sessions and for new contributors.

---

| 📅 **Last Updated** | 👤 **Current Phase** | 🎯 **Focus** |
|:---:|:---:|:---:|
| **Oct 1, 2026**<br><small>06:30 PM</small> | **Phase 7**<br><small>Deployment & Docs</small> | **Production DB seeded** |

> Update this table every session — it is the first thing a new session reads.

## 🎯 Current Status

- ✅ Project setup completed (Next.js 16, TypeScript, Tailwind)
- ✅ Git repository initialized and pushed to GitHub
- ✅ Postgres schema created with Drizzle ORM (6 tables: profiles, appointments, schedules, bookings, booking_questions, notifications)
- ✅ Authentication (JWT signup, login, OTP, protected routes) completed
- ✅ Appointment management + booking flow + Stripe payments completed
- ✅ Admin console with organizer approvals completed
- 🔄 Working on Docs set & E2E tests (PRD/ARCHITECTURE/RULES/DESIGN/TASKS/MEMORY created)

## ✅ Completed Tasks

| # | Task | Completed On |
| --- | --- | --- |
| 1.1 | Initialize Next.js project | Dec 20, 2025 |
| 1.2 | Configure Tailwind CSS (Atlas theme) | Dec 20, 2025 |
| 1.3 | Set up Git repository | Dec 20, 2025 |
| 2.1 | Design Postgres schema + Drizzle | Dec 21, 2025 |
| 2.2–2.3 | Signup & login pages | Dec 21, 2025 |
| 2.4–2.5 | JWT sessions + route guards | Dec 29, 2025 |
| 3.1–3.5 | Appointment CRUD, scheduler, questions, dashboard | 2026 sessions |
| 4.1–4.5 | Marketplace, booking flow, slot locking, bookings list | 2026 sessions |
| 5.1–5.3 | Stripe checkout, webhook, free/paid flows | 2026 sessions |
| 6.1–6.4 | Admin console, approvals, notifications, audit log | 2026 sessions |
| 7.1–7.3 | Seed scripts + prod schema push + seed both DBs | Sep 23, 2026 |

## 🔄 In Progress

| # | Task | Notes |
| --- | --- | --- |
| 7.4 | Docs set (PRD, Architecture, Rules, Design, Tasks, Memory) | This file set — review & refine |
| 7.5 | Playwright E2E for booking flow | Scaffold exists in `tests/` |

## ⚠️ Important Notes & Gotchas

- **Two databases**: local = `localhost/slotify_db` (`.env.local`), production = **Neon** `ep-withered-wildflower…neon.tech/neondb` (`.env.production`). Never mix them up.
- **DB scripts use `--env production`** flag: `node scripts/db-seed.mjs --env production`. `drizzle-kit` rejects custom flags — for prod push, export `DATABASE_URL` from `.env.production` first, then run `npx drizzle-kit push`.
- **Seed data**: 9 profiles (1 admin, 4 organizers, 4 customers), 8 appointments, 16 bookings, 14 notifications — identical in both DBs. Demo password for all seeded accounts: `Password123!` (admin: `admin@slotify.test`).
- **Concurrency**: booking creation must go through the Redis lock path in `lib/actions/bookings.ts` — never insert bookings directly.
- **Mock mode**: `lib/mock-mode.ts` allows the app to run without Stripe/Resend keys in local dev.
- **Tests**: Jest for units; Playwright configured but E2E flows still to be written.

## 🔑 Key Credentials & IDs (seed)

| What | Value |
| --- | --- |
| Admin login | `admin@slotify.test` / `Password123!` |
| Main organizer | `organizer@slotify.test` / `Password123!` |
| Customer login | `aarav@example.com` / `Password123!` |
| Fixed IDs | admin `11111111-…`, organizer `22222222-…21`, appointment `aaaaaaaa-0000-…-0001` |

## 🗺 Next Session Starters

1. Finish Phase 7: write Playwright E2E for `/book/[id]` happy path
2. Production deploy checklist: Vercel env vars, Stripe live webhook, Neon pooling
3. Consider making seed script idempotent (upserts) to avoid duplicate-key failures
