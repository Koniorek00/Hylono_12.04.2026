# /support Implementation Prompt

You are implementing the Hylono route package for `/support`.

Page goal: Alias route to help.

Shared dependencies to verify first:
- app/support/page.tsx
- config/seo-redirects.ts
- app/help/page.tsx

Exact tasks in execution order:
1. Keep the redirect chain-free.
2. Delete dead duplicate page implementations where they still exist.
3. Keep internal links pointing to the canonical destination only.

Non-goals:
- Do not invent proof, evidence, partners, or press facts.
- Do not weaken the server-first public route shell when the route is public.

Acceptance criteria:
- The route becomes clearer, more trustworthy, and better aligned with the Hylono system.
- The route follows the indexability and IA decision in this package.
