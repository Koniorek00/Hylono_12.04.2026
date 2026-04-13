# Stack and Route Discovery

- Framework: Next.js App Router with React 19 and Next 16 cache components.
- Metadata: `lib/seo-metadata.ts`.
- Schema: `lib/seo-schema.ts` plus structured-data components.
- Global chrome: Header, Footer, SiteChrome, MainShell, RouteBreadcrumbs.
- Key discovery notes:
- The site contains two product architectures: the generic product hub family and the stronger dedicated hydrogen premium family.
- The local runtime surfaced a missing `TechHero.tsx` import when requesting crawl-surface routes such as `/robots.txt` and `/sitemap.xml`.
- Governance documentation references components that no longer exist at those paths, which indicates documentation drift.
