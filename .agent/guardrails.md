# GUARDRAILS — AGENT INSTRUCTION LAYER

Updated: 2026-02-28
Canonical source: `.clinerules` (workspace) and user instructions.

## 1) Hierarchy

1. User explicit instruction
2. `.clinerules`
3. `.agent/modes/[role].md`
4. `.agent/skills/**/SKILL.md`
5. `.agent/memory/**`

If conflict exists, higher priority wins and must be logged with:
`[CONFLICT: applied X over Y — priority stack]`

## 2) Non-negotiables for all agents

- No hardcoded secrets, no PII in logs or code.
- No medical cure/treatment language for wellness products.
- No raw `process.env` outside `lib/env.ts`.
- No Prisma, no ESLint, no Prettier, no nodemailer, no `framer-motion`.
- Next.js 16 App Router boundaries must be respected.
- All async request APIs must be awaited (`params`, `searchParams`, `cookies`, `headers`).

## 3) Tooling

- Package manager: `pnpm` only.
- Lint/format: Biome only.
- Use verified MCP tools only from workspace-approved list.

## 4) Instruction quality requirements

- Keep role files actionable and stack-current.
- Remove stale references, especially external `file:///` links.
- Keep activation syntax visible: `As [role-slug], [task]`.
- Keep scope boundaries explicit (owns / advises / defers).

## 5) Verification expectations for instruction updates

- Ensure mode and skill files do not reference forbidden stack/tools.
- Ensure command examples use `pnpm` not `npm`/`npx`.
- Ensure references match Next.js 16 + Drizzle + Biome platform.
