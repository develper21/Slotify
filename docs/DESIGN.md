# 🎨 Design System

## Slotify – Clean. Professional. Reliable.

This document defines the visual design system, UI components and user experience guidelines for Slotify. The goal is to create a modern, professional and trustworthy interface with a consistent MongoDB Atlas–inspired dark theme.

---

## 1. Design Principles

| | | |
|:---:|:---:|:---::|
| 👥 **User-Centered**<br><small>Simple and intuitive for<br>both organizers and clients.</small> | 🍃 **Minimal & Clean**<br><small>Reduce clutter and<br>focus on booking content.</small> | 🧊 **Consistent**<br><small>Follow a unified token-based<br>design system everywhere.</small> |

## 2. Color Palette

Primary colors used across the application (defined in `tailwind.config.js` under `mongodb`).

| Swatch | Token | Hex | Usage |
| --- | --- | --- | --- |
| 🟩 | **Primary (Spring)** | `#00ED64` | Main brand color — buttons, links, active states, glows |
| 🟦 | **Secondary (Mint)** | `#00D4B2` | Secondary actions, highlights, accent charts |
| 🟢 | **Success (Forest)** | `#00684A` | Success messages, confirmed tasks |
| 🟨 | **Warning** | `#FFC010` | Pending / caution states |
| 🟥 | **Error** | `#EF4444` | Error messages, validation alerts, cancelled |
| ⬛ | **Background (Black)** | `#001E2B` | Page background — deep midnight teal |
| ◾ | **Card** | `#0C2331` | Card surfaces, raised panels |
| 🔷 | **Elevated** | `#16384C` | Hover surfaces, dropdowns |
| ⬜ | **Border** | `#1E3C4E` | Input borders, dividers (8% white alpha) |
| ⬜ | **Text (Light)** | `#E8EDEB` | Primary body text |
| 🔘 | **Text Muted** | `#94A3B8` | Secondary text, captions |

**Semantic states** — Active: `spring` tint (`rgba(0,237,100,0.1)` bg) · Pending: warning tint · Cancelled: error tint.

## 3. Typography

Fonts are loaded in `app/layout.tsx` via `next/font/google`.

| Style | Font | Notes |
| --- | --- | --- |
| **Primary (sans)** | Inter | Body text — clean, modern, highly readable |
| **Display** | Space Grotesk | Headings `h1–h4` — geometric, tech-forward, weight 700, `-0.02em` tracking |
| **Mono** | JetBrains Mono | Numbers, metrics, IDs, code |
| **Alternate** | Plus Jakarta Sans | Optional emphasis text |

| Element | Size / Weight |
| --- | --- |
| Hero H1 | `text-5xl → 7xl`, black (900) |
| Section H2 | `text-3xl → 5xl`, bold |
| Card title | `text-lg/xl`, bold |
| Body | `text-sm/base`, regular, `#E8EDEB` |
| Caption / meta | `text-xs`, medium, muted |

## 4. UI Components

Standard components to be used throughout the app (`/components/ui`).

### Buttons

| Variant | Look |
| --- | --- |
| `primary` | Spring green fill, black text, bold, glow shadow; hover → white fill |
| `subtle` | Dark slate fill `#132E3D`, light text |
| `outline` | Transparent with spring-green border |
| Destructive | Red tint for irreversible actions |

Sizes: `sm` · `md` · `lg` — rounded `8px`, bold labels.

### Cards

Atlas style: bg `#0C2331`, border `rgba(255,255,255,0.08)`, radius `12px`. Hover: lift `-2px`, spring-green border glow (`atlas-card-hover`).

### Inputs

`atlas-input`: bg `#001E2B`, border `#1E3C4E`, radius `8px`; focus → spring border + `3px` glow ring.

### Badges

Tinted pill badges with dot option: `success` (active/confirmed) · `warning` (pending) · `error` (cancelled) · `primary` (price/free labels).

### Other Components

Tables (admin/users) with header `#0C2331` + row hover; modals and toasts (Sonner, dark theme, top-right); avatar circles with initials.

## 5. Layout & Spacing

- Container: `max-w-6xl`, `px-4 lg:px-8`
- Section rhythm: `py-20/24`; card padding `p-4/p-6`; grid gaps `gap-4/6`
- Radius scale: `8px` (inputs/buttons) · `12px` (cards) · `16px` (modals)
- Motion: 0.2–0.3s `ease-out`; only fade/slide/scale micro-animations (`animate-fade-in`, `animate-slide-up`)

## 6. UX Guidelines

- Dark theme only (`class="dark"` on `<html>`) — tuned for long professional sessions
- Every action gives instant feedback via Sonner toast (success/error)
- Destructive actions always require a confirm step
- Booking status is always visible as a color-coded badge
- Forms validate inline with Zod before submission
- Mobile-first: dashboards collapse to stacked layouts under `md`
