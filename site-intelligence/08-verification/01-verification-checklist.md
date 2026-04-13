# Verification Checklist

Repo commands:
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm check` for SEO-sensitive work
- `pnpm compliance:strict` for health-adjacent copy changes

Runtime checks:
- Fetch `/robots.txt` and `/sitemap.xml` successfully after the shared fixes.
- Verify noindex routes remain noindex.
- Verify redirects for `/support`, `/guarantee`, and legacy product aliases.
- Check JS-disabled versions of core public routes.
- Check keyboard and focus behavior on navigation, forms, accordions, and drawers.
