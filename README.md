# Care.xyz – Baby Sitting & Elderly Care Platform

Care.xyz is a Next.js 14 (App Router, TypeScript, Tailwind CSS) web app to book trusted caregivers for babies, elderly, and sick family members. It supports email/password and Google login, dynamic booking with location capture, automatic cost calculation, booking tracking, and optional email invoices.

## Features
- Responsive design for mobile, tablet, and desktop
- Authentication: credentials + Google (NextAuth)
- Booking flow (private): duration, location (division/district/city/area), address, dynamic total cost, status starts as Pending
- My Bookings: list, status badges, cancel action
- Services: Baby Care, Elderly Service, Sick People Service with detail pages and booking CTA
- Metadata on home and service detail pages
- Email invoice via `/api/notify` (requires SMTP env vars); skipped gracefully if not configured
- 404 page with return-home CTA

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill values:
   - `AUTH_SECRET` (or `NEXTAUTH_SECRET`)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (for Google login)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` (for email invoices; optional)
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000.

### Auth Notes
- Seed user: email `demo@care.xyz`, password `DemoPass1`.
- Registration validates NID, name, email, contact, and password (6+ chars, 1 uppercase, 1 lowercase).
- Protected routes (`/booking/:slug`, `/my-bookings`) use NextAuth middleware. Logged-in users remain on private routes after reload.

### Booking Data
- Bookings are stored locally via Zustand + localStorage for demo purposes (per browser). Status starts as `Pending`; canceling marks it `Cancelled`.
- When booking completes, the app attempts to send an invoice email via `/api/notify`; if SMTP is not set, it logs and continues.

### TODO / Next Steps
- Hook services and bookings to a real backend (Zapshift) and persistent database.
- Enable Stripe payments and admin dashboards for payment history.
- Add booking status transitions (Confirmed/Completed) from ops/admin side.

## Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – run built app
- `npm run lint` – run ESLint
- `npm run typecheck` – TypeScript check
- `npm run format` – Prettier check
- `npm run format:fix` – Prettier write

## Project Structure
- `app/` – App Router pages, layouts, API routes
- `components/` – UI components
- `data/` – Static service catalog
- `lib/` – Auth options, booking store, utilities
- `types/` – Type augmentations

## Notes on Requirements
- Dynamic booking calculates total based on duration × service charge (hour/day rates).
- Booking page steps: duration select, location inputs, cost preview, confirm saves booking with `Pending` status.
- My Booking page shows Service Name, Duration, Location, Total Cost, Status; provides Cancel and View Service links.
- 404 page provided at `app/not-found.tsx`.
