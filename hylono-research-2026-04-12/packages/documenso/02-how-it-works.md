# Documenso — How It Works

## Phase B — Core architecture
- **Runtime model:** Web app with database, storage, mail, document processing, and signing/audit workflow layers. [https://docs.documenso.com/, 2026-04-12, current]
- **Main components:** Frontend/API, database, file storage, mailer, signing workflow engine, and enterprise add-ons depending on use case. [https://github.com/documenso/documenso/releases, 2026-04-12, v2.8.0]
- **Typical deployment model:** Official Docker and Docker Compose options are available; production requires external database, file storage, and mail configuration. [https://docs.documenso.com/, 2026-04-12, current]
- **Runtime dependencies:** PostgreSQL or supported DB, object/file storage, mailer, TLS, and strong secret management.
- **Primary data stores:** Relational database plus document/file storage.
- **Auth model:** Local auth and enterprise/SSO options depending on edition; verify if ZITADEL SSO is required.
- **API / integration surface:** Document/template APIs, signing workflows, webhooks, and embed options depending on edition/features.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Signed documents, audit trails, and potentially sensitive acknowledgements make this a high-trust system. Protect storage, links, identities, and retention policies carefully.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Moderate to high because signature workflows carry legal/process consequences.