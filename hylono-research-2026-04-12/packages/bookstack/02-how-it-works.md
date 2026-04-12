# BookStack — How It Works

## Phase B — Core architecture
- **Runtime model:** PHP/Laravel application with relational database, file uploads, and optional auth integrations. [https://www.bookstackapp.com/docs/, 2026-04-12, v25.12.9]
- **Main components:** Web app, DB, file storage, search, optional LDAP/OIDC/SAML, and editor/media handling. [https://github.com/BookStackApp/BookStack/releases, 2026-04-12, v25.12.9]
- **Typical deployment model:** Simple Docker or standard web-stack deployments are common and operationally light. [https://www.bookstackapp.com/docs/, 2026-04-12, v25.12.9]
- **Runtime dependencies:** Database, storage, reverse proxy/TLS, mail, and auth integration if needed.
- **Primary data stores:** Relational database plus file uploads.
- **Auth model:** Local auth plus SAML/OIDC/LDAP options depending on setup.
- **API / integration surface:** REST API, content import/export, and auth integrations.
- **Operational complexity:** **Low to Medium**
- **Security / compliance considerations:** Docs may contain sensitive internal procedures. Restrict access and review file upload/storage controls.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Low.