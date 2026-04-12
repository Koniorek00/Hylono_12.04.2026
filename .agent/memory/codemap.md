# Codemap — Hylono Platform

## Main App (`/`)
app/
├── layout.tsx              # Root layout (server)
├── page.tsx                # Home route entry (server)
├── HomeClient.tsx          # Home interactive leaf (client)
├── product/[tech]/         # Product detail route + ProductClient leaf
├── store/                  # Store route + StoreClient leaf
└── wellness-planner/       # Planner route + WellnessPlannerClient leaf

src/
├── actions/
│   └── formActions.ts      # Server Actions (`'use server'`) for form flows
├── components/
│   ├── layout/             # Header/Footer/GlobalOverlays primitives
│   ├── providers/          # Providers wrapper used by app layout
│   ├── ui/                 # Canonical shared UI layer (preferred for new UI work)
├── lib/
│   ├── analytics.ts        # Analytics integration surface
│   ├── stripe.ts           # Payment integration helpers
│   └── schemas/            # Shared zod/schema definitions
├── stores/
│   └── multitoolStore.ts   # Client state for multitool UI
└── proxy.ts                # ROOT — replaces middleware.ts (FORBIDDEN)

## Control Panel (`/control-panel/`)
⚠️ ISOLATED WORKSPACE — NEVER cross-import with main app.
Communication via API only.

## Critical Entry Points
- App shell: `app/layout.tsx` (server) + `src/components/providers/Providers.tsx`
- Mutations: `src/actions/formActions.ts` (server actions)
- Security boundary: `src/proxy.ts`
- Env boundary (root-level): `lib/env.ts`

## Server / Client Boundaries (verified)
- Client files: `app/HomeClient.tsx`, `app/store/StoreClient.tsx`, `app/wellness-planner/WellnessPlannerClient.tsx`
- Server-first routes: all `app/**/page.tsx`
- Server actions: `src/actions/formActions.ts` (`'use server'`)
