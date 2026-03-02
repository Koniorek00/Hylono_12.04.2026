# Codemap — Hylono Platform

## Main App (`/`)
src/
├── app/                    # App Router pages (SERVER by default)
│   ├── (marketing)/        # Public pages — SSG/ISR
│   ├── (shop)/             # Product/rental pages — ISR
│   ├── (dashboard)/        # Authenticated — SSR (force-dynamic)
│   ├── api/                # route.ts — webhooks + uploadthing ONLY
│   └── layout.tsx          # Root layout (SERVER) → Providers (CLIENT)
├── components/
│   ├── ui/                 # Design system primitives [server|client tagged]
│   └── [domain]/           # Feature components
├── lib/
│   ├── db/                 # Drizzle schema + client
│   │   └── schema.ts       # ⚠️ VERIFY before any query — never assume names
│   ├── env.ts              # ALL env vars — single access point
│   ├── email/templates/    # React Email templates
│   └── actions/            # Server Actions (next-safe-action)
├── proxy.ts                # ROOT — replaces middleware.ts (FORBIDDEN)
└── globals.css             # Tailwind v4 @theme config

## Control Panel (`/control-panel/`)
⚠️ ISOLATED WORKSPACE — NEVER cross-import with main app.
Communication via API only.

## Critical Entry Points
- Auth flow: `lib/auth.ts` → Auth.js v5 config → Drizzle adapter
- Payment flow: `lib/stripe.ts` → webhook in `app/api/stripe/route.ts`
- Email flow: `lib/email/` → Resend client → templates/
- Security: `proxy.ts` (Nosecone CSP) + `lib/arcjet.ts` (rate limit, bot, shield)