# GEMINI.md — Project Entry Context (Hylono)

## Always load (authoritative operating + coding standards)
@./session-start.md
@./DEFINITIVE_WEB_STANDARD.md

## Repo facts (keep short, factual)
- Workspace: Hylono
- Domain: Bio-optimization e-commerce + managed services (no medical claims in copy)
- Source of truth for patterns: existing codebase

## How to run (fill with real commands from package.json)
- Install: <pnpm i / npm i / yarn>
- Dev: <pnpm dev / npm run dev>
- Typecheck: <pnpm typecheck / npm run typecheck>
- Lint: <pnpm lint / npm run lint>
- Tests: <pnpm test / npm run test>
- Build: <pnpm build / npm run build>

## Definition of Done (minimum)
- Follow PLAN → EXECUTE → VERIFY (see session-start.md)
- Provide evidence: commands run + results; for UI changes add screenshots/walkthrough artifact

## Non-negotiables (repo-level)
- Do not invent endpoints, schemas, or integrations — search first, then ask.
- No new dependencies without justification + checking existing deps.
- Side effects (installs, deletions, DB writes/migrations, auth/payments changes) require explicit approval.
- Security: no secrets in client code; no unsafe HTML with user input.

## Where the “big vision” lives (NOT auto-loaded)
- Architecture / constellation docs: .agent/blueprint.md
- Agent roster / clusters: .agent/agents.md
- Guardrails: .agent/guardrails.md
