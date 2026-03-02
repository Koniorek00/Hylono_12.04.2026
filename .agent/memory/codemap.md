# Codemap — Hylono Platform

## Main App (`/`)
src/
├── app/                    # App Router routes + route-level UI
│   ├── layout.tsx          # Root layout (server)
│   ├── page.tsx            # Home route entry (server)
│   ├── HomeClient.tsx      # Home interactive leaf (client)
│   ├── product/[tech]/     # Product detail route + ProductClient leaf
│   ├── store/              # Store route + StoreClient leaf
│   └── wellness-planner/   # Planner route + WellnessPlannerClient leaf
├── actions/
│   └── formActions.ts      # Server Actions (`'use server'`) for form flows
├── components/
│   ├── layout/             # Header/Footer/GlobalOverlays primitives
│   ├── providers/          # Providers wrapper used by app layout
│   ├── ui/                 # Shared UI modules (BreadcrumbBar, Multitool)
│   └── hero-4.6t/          # Landing sections and composition blocks
├── lib/
│   ├── analytics.ts        # Analytics integration surface
│   ├── stripe.ts           # Payment integration helpers
│   └── schemas/            # Shared zod/schema definitions
├── stores/
│   └── multitoolStore.ts   # Client state for multitool UI
├── proxy.ts                # ROOT — replaces middleware.ts (FORBIDDEN)
└── globals.css             # Tailwind v4 @theme config

## Control Panel (`/control-panel/`)
⚠️ ISOLATED WORKSPACE — NEVER cross-import with main app.
Communication via API only.

## Critical Entry Points
- App shell: `src/app/layout.tsx` (server) + `src/components/providers/Providers.tsx`
- Mutations: `src/actions/formActions.ts` (server actions)
- Security boundary: `src/proxy.ts`
- Env boundary (root-level): `lib/env.ts`

## Server / Client Boundaries (verified)
- Client files: `src/app/HomeClient.tsx`, `src/app/store/StoreClient.tsx`, `src/app/wellness-planner/WellnessPlannerClient.tsx`
- Server-first routes: all `src/app/**/page.tsx`
- Server actions: `src/actions/formActions.ts` (`'use server'`)