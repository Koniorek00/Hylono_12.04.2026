# Docusaurus — How It Works

## Phase B — Core architecture
- **Runtime model:** Node-based build tool that emits static assets; hosting is simple once built. [https://docusaurus.io/docs, 2026-04-12, v3.10.0]
- **Main components:** Build system, markdown/MDX content, React theme/components, search integrations, and static hosting. [https://github.com/facebook/docusaurus/releases, 2026-04-12, v3.10.0]
- **Typical deployment model:** Low operational burden. The bigger question is whether it duplicates the existing Next.js site’s content capabilities. [https://docusaurus.io/docs, 2026-04-12, v3.10.0]
- **Runtime dependencies:** Node/npm, static hosting or CDN, optional search provider, docs-authoring workflow.
- **Primary data stores:** Git/content files; optional external search/analytics.
- **Auth model:** None by default; docs can be public or protected behind external hosting patterns.
- **API / integration surface:** Build-time plugins and static-site integrations.
- **Operational complexity:** **Low**
- **Security / compliance considerations:** Mostly content/hosting security. Much lower ops burden than dynamic apps.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Low infrastructure risk, moderate duplication risk.