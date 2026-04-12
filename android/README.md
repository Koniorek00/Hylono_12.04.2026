# Hylono Android

Native Android foundation for turning the current Hylono website into a real mobile app instead of a wrapped browser experience.

## What This App Covers

- Member workspace for product browsing, protocol review, research snapshots, support coverage, and native intake.
- Partner workspace for clinic-style operations: overview, client watchlist, academy tracks, and supply planning.
- Native request center wired to the current Next.js endpoints:
  - `POST /api/booking`
  - `POST /api/contact`
  - `POST /api/newsletter`
  - `POST /api/rental`
  - `GET /api/rental?email=...`

## What Is Seeded From The Website

- Product and rental data: `content/products.ts`
- Protocol data: `content/protocols.ts`
- Research cards: `content/research.ts`
- Partner locator records: `content/partners.ts`
- Partner workspace concepts: `components/partner/*`

The current website still treats most partner surfaces as static mock data, so the Android partner workspace uses the same approach until live mobile-safe APIs exist.

## Build Setup

The app defaults to the local website running on the Android emulator host bridge:

```bash
./gradlew assembleDebug -PHYLONO_API_BASE_URL=http://10.0.2.2:3000
```

For production or preview:

```bash
./gradlew assembleDebug -PHYLONO_API_BASE_URL=https://your-hylono-host
```

## Expected Next Backend Work

- Mobile-safe auth/session endpoints. The website currently uses NextAuth credential pages, which are not yet exposed as a native mobile auth contract.
- Native checkout and Stripe mobile payment support. The website has checkout intake, but not a mobile payment SDK path yet.
- Live partner APIs for clients, academy progress, fleet, and supply requisitions.
- Local persistence for favourites, intake drafts, and offline field sync.
