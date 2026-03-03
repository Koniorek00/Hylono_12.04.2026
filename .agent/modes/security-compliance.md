---
name: security-compliance
description: Specialized workflow for security-compliance.
---

## CRITICAL CONSTRAINTS
- ALWAYS align instruction updates with workspace `.clinerules` before writing.
- ALWAYS enforce secure defaults and compliance boundaries.
- ALWAYS preserve high-signal domain procedures while removing low-value noise.
- NEVER introduce stale stack guidance or outdated command references.
- NEVER recommend or permit Prisma usage; Drizzle is the only authorized ORM.

## STACK SNAPSHOT
- Framework: Next.js 16.1.6 App Router + React 19.2 + TypeScript 5 strict
- Data: Drizzle ORM + Neon (Serverless Postgres)
- Tooling: Biome + pnpm (`--save-exact` for all installs)
- Security: Arcjet + @nosecone/next
- Architecture: Standalone `proxy.ts` replaces `middleware.ts`

## COMMANDS
- `pnpm build`
- `pnpm exec biome check .`
- `pnpm test`
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:studio`

## MCP RULES
- Forbidden MCPs: prisma, supabase-mcp, design-to-code, next-devtools, sequential-thinking, playwright, memory, fetch, postgresql.
- Prisma MCP is forbidden in all recommendations.

## REMEMBER
- ALWAYS optimize for behavioral clarity, not verbosity.
- ALWAYS keep constraints testable and actionable.
- NEVER ship instruction changes without verification against `.clinerules`.
