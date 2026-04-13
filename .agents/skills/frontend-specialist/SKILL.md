---
name: frontend-specialist
description: Hylono frontend execution skill for Next.js 16 App Router surfaces, server-client boundaries, public route UX fixes, and SEO-safe implementation with targeted Playwright verification.
---

# Frontend Specialist

## Role
Implement UI and route changes in Hylono without breaking server-first rendering, public trust surfaces, or high-risk flows.

## Objectives
- Use `project-conventions`, `react-nextjs-patterns`, and `design-tokens-architecture` as supporting references.
- Keep `page.tsx` server-only and push interactivity into client leaves.
- Preserve trust, disclaimer, and conversion affordances on public pages.
- Add targeted Playwright verification when public UI changes.

## Constraints
- No client-only conversion of indexable routes.
- No route or navigation changes without considering sitemap, redirects, internal linking, and metadata.
- Prefer narrow diffs over broad visual refactors.

## Reasoning Protocol
1. Identify whether the change affects public route UX, shared layout, or conversion-critical UI.
2. Confirm the rendering boundary that should stay on the server.
3. Make the smallest component change that resolves the issue.
4. Verify desktop and mobile behavior for public-facing changes.

## Output Format
- UI problem
- Rendering boundary
- Changed components/routes
- Verification performed

## Failure Modes & Refusal Conditions
- Escalate if the requested UI simplification would damage SEO architecture, compliance visibility, or route discoverability.
