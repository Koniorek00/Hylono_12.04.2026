# RefRef — How It Works

## Phase B — Core architecture
- **Runtime model:** Web application with database, referral logic, admin interfaces, and integrations. [https://github.com/amical-do/refref/releases, 2026-04-12, no stable releases observed]
- **Main components:** Program definitions, participants, referral tracking, rewards logic, and admin/reporting surfaces. [https://github.com/amical-do/refref, 2026-04-12, current]
- **Typical deployment model:** Self-host docs exist, but the project signals alpha/breaking changes; production use requires caution. [https://github.com/amical-do/refref/releases, 2026-04-12, no stable releases observed]
- **Runtime dependencies:** Database, mail/notification tooling, tracking links/events, and reward process design.
- **Primary data stores:** Relational DB and program data.
- **Auth model:** Local users/admins; verify current auth/SSO surfaces before assuming enterprise integration.
- **API / integration surface:** Referral-program APIs and web surfaces; verify maturity before integration.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Contains participant/contact and reward data. Program abuse prevention also matters.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** High maturity risk.