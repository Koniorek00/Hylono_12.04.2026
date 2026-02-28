# Hylono Platform

**European medtech platform for non-invasive regenerative technology devices.**

Hylono is a React/TypeScript e-commerce and wellness platform for biohacking technology devices, offering both purchase and rental options with a comprehensive partner hub system for clinics.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19.2.3 + TypeScript 5.8.2 |
| Build Tool | Vite 6.2.0 |
| Styling | Tailwind CSS 4.1.18 |
| Animations | Framer Motion 12.26.2 |
| State Management | Zustand 5.0.10 |
| Database | PostgreSQL + Prisma 7.2.0 |
| Payments | Stripe 20.1.2 |
| Analytics | PostHog |
| E2E Testing | Playwright |

---

## Product Modalities

1. **HBOT** — Mild Hyperbaric Oxygen Therapy chambers
2. **PEMF** — Pulsed Electromagnetic Field + Vagus Nerve Stimulation
3. **RLT** — Red Light Therapy / Photobiomodulation
4. **HYDROGEN** — Molecular Hydrogen inhalation devices

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- PostgreSQL database

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate
```

### Development

```bash
# Start development server (port 5173)
pnpm dev

# Production build
pnpm build

# Run linter + format check
pnpm lint

# Run tests
pnpm test

# Full check (lint + build + test)
pnpm check
```

---

## Project Structure

```
├── components/       # UI components (100+ files)
├── context/          # React contexts (auth, etc.)
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries (analytics, stripe, schemas)
├── utils/            # Helper functions
├── content/          # Markdown content for protocols
├── prisma/           # Database schema and migrations
├── .agent/           # Cline agent configuration and memory
├── docs/             # Project documentation
├── reports/          # Audit and task reports
└── tasks/            # Task tracking
```

---

## Key Files

| File | Purpose |
|------|---------|
| `constants.ts` | Product definitions, pricing, protocols, synergies |
| `types.ts` | TypeScript interfaces and enums |
| `components/AppRouter.tsx` | Route definitions and navigation |
| `components/Layout.tsx` | Navbar, Footer, page structure |
| `prisma/schema.prisma` | Database models |

---

## Database Models

- `Clinic` — Partner clinics with branding and device fleets
- `User` — Staff with roles (ADMIN, MANAGER, STAFF)
- `DeviceFleet` — Tracked devices with service logs
- `TrainingModule` / `TrainingProgress` — Certification system
- `Referral` — Patient referral tracking with commission

---

## Architecture

- **SPA Architecture** — Pure client-side rendering with lazy-loaded routes
- **State Management** — React Context for auth, Zustand for complex state
- **Routing** — Custom client-side routing via `window.history.pushState`
- **Feature Flags** — Toggle features via `utils/featureFlags.ts`

---

## Market & Compliance

- **Target Market:** Health-conscious 35–65yo European professionals
- **Locales:** en, de, pl, nl (EU-first)
- **Compliance:** GDPR mandatory, MDR 2017/745 awareness
- **Business Model:** Rental-first (€150–600/mo) → Purchase → B2B clinic partnerships

---

## Brand Voice

Premium. Scientific. Accessible. "Where mind connects with matter."

Trustworthy not clinical. Aspirational not hypey. Evidence-backed confidence.

---

## License

Proprietary — Hylono GmbH

---

> "Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before use."