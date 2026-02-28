# ADR-MCP-001: MCP Server Optimization
Status: Accepted | Date: 2026-02-28

## Context
Default MCP configurations were wasting tokens scanning irrelevant files,
contained conflicting Prisma guidance, and lacked a strict canonical
12-server standard for Hylono operations.

## Decision
1. Created `.mcpignore` to exclude build artifacts, dependencies, caches, and logs.
2. Replaced filesystem MCP with `@shtse8/filesystem-mcp` and restricted it to `F:/ag projects/Hylono_MAIN`.
3. Removed forbidden MCPs: supabase-mcp, design-to-code, next-devtools,
   sequential-thinking, playwright, memory, fetch, postgresql.
4. Added `browser-tools-mcp` and optimized all remaining MCP configs for Hylono.
5. Scoped Context7 to Hylono stack libraries and excluded irrelevant ecosystems.
6. Focused BioMCP on Hylono therapy modalities and higher-evidence sources.
7. Configured Stripe for EUR/PL rental/subscription models.
8. Added OWASP + GDPR Semgrep rulesets.
9. Enforced `${VAR}` placeholders for all secrets in MCP env sections.
10. Confirmed canonical MCP set (12): filesystem, context7, prisma, biomcp,
    github, @21st-dev/magic, semgrep-mcp, figma-mcp, stripe, posthog,
    vercel, browser-tools-mcp.

## Consequences
+ Reduced token waste by excluding noisy filesystem paths.
+ Faster, more relevant documentation retrieval via scoped Context7.
+ Improved BioMCP relevance for Hylono-specific modalities.
+ Security scanning defaults aligned with OWASP and GDPR.
+ Removed forbidden MCP layer tools and hardcoded secret leakage.
- Drizzle operations remain CLI-first until a stable MCP server exists.
- Team must provide required MCP env vars before using external integrations.

## Amendment: Prisma MCP Clarification (2026-02-28)

### Context
Earlier wording implied Prisma MCP removal, which conflicts with the
current workspace policy: Prisma MCP is allowed as an AI safety layer while
Prisma ORM is forbidden in application code.

### Decision
Prisma MCP is explicitly retained in the canonical MCP set.

### Rules
1. Prisma MCP = ALLOWED as agent tool only
2. Prisma ORM = FORBIDDEN in application code
3. Drizzle remains the only runtime ORM and migration path
4. Prisma MCP must use env placeholders and never hardcoded credentials

### Rationale
- AI safety guardrails block destructive operations on production
- Zero runtime Prisma dependency in the app
- Alignment across MCP settings, skills, and .clinerules

## Amendment: Hybrid Database Workflow Implemented

**Date:** 2025-07-14
**Decision:** Implement full Hybrid Database Workflow (Drizzle Code + Prisma MCP Agent).

**Context:**
Prisma MCP was retained as AI agent safety layer (T3 audit). This amendment
codifies the complete workflow governing HOW the agent uses both tools together.

**Rationale — 2026 Hybrid Pattern:**
Production teams in 2026 use Drizzle for app code and Prisma MCP for
AI-assisted database management. Benefits:
1. Guardrails block destructive operations on production
2. Introspection validates schema drift without Prisma ORM in app
3. Safe SQL prototyping before codifying in Drizzle
4. Read-only mode for production via PRISMA_MCP_READONLY env var
5. Multi-environment DATABASE_URL separation (dev/preview/production)

**Artifacts Created:**
- .clinerules § DATABASE WORKFLOW (architecture + decision table + workflow)
- .clinerules § ENV VARS (multi-environment DB URLs)
- .clinerules § COMMANDS (allowed + forbidden DB commands)
- skill-architect "Database Hybrid Pattern" section
- This ADR amendment

**Impact:**
- Zero new app dependencies
- Zero new MCP servers (Prisma MCP already present from T3)
- Agent workflow fully documented and enforceable