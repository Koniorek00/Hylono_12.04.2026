# Akaunting — How It Works

## Phase B — Core architecture
- **Runtime model:** PHP/Laravel-style accounting web app with modules, DB, mail, and finance workflows. [https://github.com/akaunting/akaunting, 2026-04-12, 3.1.21]
- **Main components:** Web UI/API, database, accounting modules, extensions, import/export, and document generation. [https://github.com/akaunting/akaunting/releases, 2026-04-12, 3.1.21 observed]
- **Typical deployment model:** Standard web-app self-host patterns; use only if Hylono truly wants an accounting system rather than invoicing adjunct. [https://github.com/akaunting/akaunting, 2026-04-12, 3.1.21]
- **Runtime dependencies:** Database, mailer, storage, cron/jobs, finance process ownership.
- **Primary data stores:** Relational database.
- **Auth model:** Local user roles; verify SSO options if needed.
- **API / integration surface:** Accounting/invoice/bank-related app surfaces; deeper API suitability should be tested against current version.
- **Operational complexity:** **Medium to High**
- **Security / compliance considerations:** Financial and accounting records create governance obligations beyond ordinary app data.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Moderate with high redundancy risk.