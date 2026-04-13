# AI Implementation Guide For This Page

## Objective for this page
Alias route to help.

## Non-goals for this page
- Do not invent unsupported trust signals.
- Do not make the route client-only if it is public.
- Do not weaken the existing canonical graph or policy linking.

## Dependencies to verify before editing
- app/support/page.tsx
- config/seo-redirects.ts
- app/help/page.tsx

## Exact execution sequence
1. Keep the redirect chain-free.
2. Delete dead duplicate page implementations where they still exist.
3. Keep internal links pointing to the canonical destination only.

## Content and messaging tasks
- Keep the redirect chain-free.
- Delete dead duplicate page implementations where they still exist.
- Keep internal links pointing to the canonical destination only.

## Section and hierarchy tasks
- Keep only sections that help the route perform its real job.
- Reorder the page so the first screen answers the route intent clearly.
- Demote or remove redundant sections.

## Visual / graphic / element tasks
- Use visuals to clarify fit, process, or trust; remove decorative noise that does not explain anything.

## CTA / conversion tasks
- Use one dominant CTA and clearly demoted secondary routes.

## SEO tasks
- Preserve the redirect and keep it chain-free.

## Accessibility tasks
- Check heading hierarchy, focus flow, tap targets, and motion reduction on the final route.

## Performance tasks
- Reduce client-heavy or motion-heavy behavior when it blocks comprehension or task completion.

## Analytics tasks
- Track the route main CTA and the key route-to-route transitions that matter for this page type.

## Trust / proof / legal tasks
- Remove unsupported claims, fake trust assets, or synthetic proof patterns.
- Keep policy and support routes visible when they matter to the decision.

## Shared-system verification tasks
- Confirm the route still fits the canonical Hylono graph and route architecture.
- Confirm feature flags, redirects, and global navigation still behave correctly.

## Runtime verification tasks
- Test desktop and mobile.
- Test JS-disabled behavior on public routes where relevant.
- Test success/failure states on forms or task routes.

## Final acceptance criteria
- The route matches its intended purpose clearly.
- The route does not publish unsupported or misleading claims.
- The route strengthens rather than weakens the wider site system.
