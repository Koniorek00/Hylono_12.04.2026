# Leihs — How It Works

## Phase B — Core architecture
- **Runtime model:** Rails-based application stack with database, background jobs, mailers, and operational workflows around reservations and lending. [https://github.com/leihs/leihs-instance, 2026-04-12, current]
- **Main components:** Web app, relational database, workers/jobs, mail, storage, and role-based operational UI. [https://github.com/leihs/leihs, 2026-04-12, 7.13.0]
- **Typical deployment model:** The leihs-instance repo is the most useful public deployment blueprint; production still requires standard app hardening, storage, backups, and role design. [https://github.com/leihs/leihs-instance, 2026-04-12, current]
- **Runtime dependencies:** Database, mailer, storage, background jobs, reverse proxy/TLS, and operational process configuration.
- **Primary data stores:** Relational database plus file/storage components.
- **Auth model:** Application roles and authentication; verify current SSO integration options if required.
- **API / integration surface:** Operational web UI and app interfaces; API surface should be verified against current version before integration assumptions.
- **Operational complexity:** **Medium to High**
- **Security / compliance considerations:** Reservation histories and user assignments may include personal data. Access control and auditability matter for rental operations.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Moderate. Best functional fit for rentals, but likely needs adaptation work and careful UX/process mapping.