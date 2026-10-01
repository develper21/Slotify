# 📋 Development Rules

## Slotify – Project Guidelines for AI & Human Collaborators

This document defines the development rules, coding standards and best practices for the Slotify application. These rules ensure consistency, maintainability, security and quality across the codebase. Both AI assistants and human contributors must follow these guidelines.

---

## 1️⃣ General Principles

These rules apply to the entire project.

- [x] Follow the project documentation (PRD, ARCHITECTURE, DESIGN) before making changes.
- [x] Keep the code clean, readable and well-structured.
- [x] Prioritize simplicity and maintainability.
- [x] Do not duplicate logic. Reuse existing components, utilities and server actions from `lib/`.
- [x] Make small, focused changes instead of large, risky edits.
- [x] Do not modify unrelated files.
- [x] Write self-explanatory code with meaningful variable and function names.
- [x] Validate every input with Zod — never trust client data.
- [x] Surface errors clearly with Sonner toasts; never fail silently.

## 2️⃣ Technology & Coding Standards

Rules related to the tech stack and coding style.

| Area | Rule |
| --- | --- |
| 🟨 **Language** | Use TypeScript. Avoid `any` unless absolutely necessary — prefer `unknown` plus narrowing. |
| ⚛️ **Framework** | Follow Next.js App Router best practices: Server Components by default, `"use client"` only for interactivity, `"use server"` for all mutations. |
| 🎨 **Styling** | Use Tailwind CSS and follow the design system in DESIGN.md (`mongodb-*` tokens). No inline styles or new CSS files for UI. |
| 🧹 **Linting** | Follow ESLint (`eslint-config-next`). Code must pass `npm run lint`. |
| 📐 **Formatting** | 4-space indentation, single quotes, semicolons. Keep components under ~300 lines. |
| 📦 **Dependencies** | Use stable, well-maintained packages only. Never add a dependency for something trivial to implement. |
| 📁 **File Naming** | Components: `PascalCase.tsx` (`Button.tsx`). Lib files: `kebab-case.ts` (`rate-limit.ts`). Routes: lowercase folders. |
| 🔐 **Secrets** | Never commit or hardcode secrets. Read env from `.env.local` / `.env.production`. Never log tokens, passwords or connection strings. |

## 3️⃣ Project Structure

Follow the defined folder structure in ARCHITECTURE.md.

- [x] Place reusable UI components in `/components/ui` (Button, Card, Badge…).
- [x] Feature-specific code belongs in its feature folder (`/components/booking`, `/components/admin`…).
- [x] All database and business mutations go through server actions in `/lib/actions` — never query the DB directly from components.
- [x] The database schema lives in `lib/db/schema.ts` — keep it the single source of truth.
- [x] Common utilities belong in `/lib` (`guards.ts`, `utils.ts`, `rate-limit.ts`…).
- [x] Types and interfaces belong in `/types`.
- [x] Do not create new folders without a clear, documented purpose.

## 4️⃣ Security & Data Rules

- [x] Check roles server-side with `lib/guards.ts` — never rely on hidden UI for authorization.
- [x] Apply `lib/rate-limit.ts` to auth, OTP and booking endpoints.
- [x] Wrap multi-step writes in transactions where consistency matters (bookings, payments).
- [x] Never store raw card data — Stripe Checkout handles payments end-to-end.
- [x] Audit sensitive admin actions via `lib/audit-log.ts`.

## 5️⃣ Git & Collaboration

- [x] Branch from `main`; keep commits small with clear, descriptive messages.
- [x] Run `npm run lint` and `npm test` before pushing.
- [x] Never commit `.env.local`, `.env.production` or build output (`.next/`).
- [x] Update TASKS.md and MEMORY.md whenever a task or phase status changes.
