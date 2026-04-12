# DocuSeal — How It Works

## Phase B — Core architecture
- **Runtime model:** Web application with database, document/file storage, email, and signing workflows. [https://www.docuseal.com/docs, 2026-04-12, current]
- **Main components:** UI/API, DB, storage, signing engine, templates/forms, and audit records. [https://github.com/docusealco/docuseal/releases, 2026-04-12, 2.4.3]
- **Typical deployment model:** Supports Docker and other on-prem patterns; operational requirements are similar to Documenso. [https://www.docuseal.com/docs, 2026-04-12, current]
- **Runtime dependencies:** Database, file storage, mailer, TLS, and secret management.
- **Primary data stores:** Relational DB plus document storage.
- **Auth model:** Local auth and API/workspace-style controls.
- **API / integration surface:** Template/document/signing APIs and embed/integration surfaces.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Signed documents and audit records require strict storage and access controls.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Moderate with high overlap risk.