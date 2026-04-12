# Strapi — How It Works

## Phase B — Core architecture
- **Runtime model:** Node.js CMS with database, admin UI, media library, and REST/GraphQL APIs. [https://docs.strapi.io/, 2026-04-12, v5]
- **Main components:** Admin UI, content types, APIs, media library, DB, and plugins. [https://github.com/strapi/strapi/releases, 2026-04-12, v5.42.0]
- **Typical deployment model:** Mature self-host path. Production requires DB, storage, media handling, auth, and editorial process design. [https://docs.strapi.io/, 2026-04-12, v5]
- **Runtime dependencies:** Database, file storage, reverse proxy, auth/admin security, and backups.
- **Primary data stores:** Relational DB plus media storage.
- **Auth model:** Admin auth and API tokens; external auth patterns possible.
- **API / integration surface:** REST and GraphQL APIs, webhooks, admin plugins, and content workflows.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** CMS admin is a privileged surface; media uploads and content API exposure need care.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Moderate duplication risk.