# Strapi — Overview

## Snapshot
- Environment context: **Phase 1B / UNKNOWN**
- Researched as: **Strapi headless CMS**
- Current version researched: **v5.42.0** — **CONFIRMED** [https://github.com/strapi/strapi/releases, 2026-04-12, v5.42.0]
- License posture: **Open-source core with commercial tiers; verify current licensing for enterprise features** — **PARTLY VERIFIED** [https://docs.strapi.io/, 2026-04-12, v5]
- Recommended timing: **ONLY IF CONTENT OPS OUTGROW CURRENT APPROACH**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Headless CMS for structured content modeling, APIs, and editorial workflows. [https://docs.strapi.io/, 2026-04-12, v5]
- **What it solves:** Editorial content management for websites, knowledge bases, and multi-channel content delivery. [https://github.com/strapi/strapi/releases, 2026-04-12, v5.42.0]
- **Best-fit users:** Content, marketing, and engineering teams needing a structured CMS. [https://docs.strapi.io/, 2026-04-12, v5]
- **Where it fits in a modern stack:** Conditional. Hylono already has a server-first Next.js content-driven site; Strapi is only worthwhile if current content workflows outgrow in-repo/contentlayer-style approaches or custom admin tooling. [https://github.com/strapi/strapi, 2026-04-12, v5.42.0]

## Hylono fit snapshot
- **Business usefulness:** Could front content for Next.js and possibly docs/help content, but is not automatically needed. [https://github.com/strapi/strapi/releases, 2026-04-12, v5.42.0]
- **Overlap watch:** Overlaps with current Next.js content setup and partly with Docusaurus/BookStack for docs content.
- **Must verify before implementation:** Compare current content workflows against real CMS needs before adopting.