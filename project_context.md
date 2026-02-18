# Hylono Project Context

## What This Project Actually Is (3-Sentence Summary)

**Hylono** is a React/TypeScript e-commerce and wellness platform for biohacking technology devices (HBOT chambers, PEMF devices, Red Light Therapy panels, and Hydrogen inhalation systems) offering both purchase and rental options. The application features a comprehensive partner hub system for clinics with device fleet management, training modules, referral tracking, and protocol prescription capabilities, built with Vite, Tailwind CSS, Prisma ORM, and Stripe payments. The codebase is structured as a single-page application with lazy-loaded routes, context-based state management (Zustand), and an extensive component library for product visualization, checkout flows, and authenticated dashboard experiences.

---

## Tech Stack (Verified from package.json)

### Frontend
- **React 19.2.3** with TypeScript 5.8.2
- **Vite 6.2.0** (build tool, NOT Next.js despite eslint-config-next)
- **Tailwind CSS 4.1.18** with custom fonts (Outfit, Syncopate)
- **Framer Motion 12.26.2** for animations
- **Recharts 3.6.0** for data visualization
- **React Leaflet** for maps (Partner Locator)
- **Zustand 5.0.10** for state management

### Backend/Infrastructure
- **Prisma 7.2.0** with PostgreSQL
- **Stripe 20.1.2** for payments
- **PostHog** for analytics
- **Playwright** for E2E testing

### Key Domain Entities (from prisma/schema.prisma)
- `Clinic` - Partner clinics with branding and device fleets
- `User` - Staff with roles (ADMIN, MANAGER, STAFF)
- `DeviceFleet` - Tracked devices with service logs
- `TrainingModule` / `TrainingProgress` - Certification system
- `Referral` - Patient referral tracking with commission

### Product Modalities
1. **HBOT** - Mild Hyperbaric Oxygen Therapy chambers
2. **PEMF** - Pulsed Electromagnetic Field + Vagus Nerve Stimulation
3. **RLT** - Red Light Therapy / Photobiomodulation
4. **HYDROGEN** - Molecular Hydrogen inhalation devices

---

## Architecture Observations

### Entry Points
- `index.tsx` → `App.tsx` → `AppProviders` → `AppRouter`
- Error boundary wraps entire application

### Routing Strategy
- Client-side routing via `window.history.pushState`
- Lazy-loaded page components with React.lazy()
- No server-side rendering (pure SPA)

### State Management
- React Context for auth (`AuthContext`)
- Zustand stores (based on dependency)
- Local state in components

### Key Directories
- `/components` - UI components (100+ files)
- `/context` - React contexts
- `/hooks` - Custom hooks
- `/lib` - Utility libraries (analytics, stripe, schemas)
- `/utils` - Helper functions
- `/content` - Markdown content for protocols
- `/prisma` - Database schema

---

## Critical Files to Understand

| File | Purpose |
|------|---------|
| `constants.ts` | Product definitions, pricing, protocols, synergies |
| `types.ts` | TypeScript interfaces and enums |
| `components/AppRouter.tsx` | Route definitions and navigation |
| `components/Layout.tsx` | Navbar, Footer, page structure |
| `prisma/schema.prisma` | Database models |

---

## Identified Patterns

1. **Lazy Loading** - All page components are lazy-loaded
2. **Feature Flags** - `utils/featureFlags.ts` for toggling features
3. **Trace Metadata** - Claims are traceable with `TRACE` constants
4. **Synergy System** - Products have cross-selling synergy relationships
5. **Protocol Engine** - Multi-step wellness protocols with timing

---

## Potential Concerns / Areas for Review

1. **No SSR/SSG** - SEO implications for e-commerce
2. **Large Constants File** - `constants.ts` is 19,750 chars, may need splitting
3. **Mixed Routing** - Custom routing instead of React Router
4. **Backup Directories** - Multiple backup folders suggest instability
5. **Missing Tests** - No test files visible in root structure
