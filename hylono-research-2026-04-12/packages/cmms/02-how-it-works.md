# CMMS — How It Works

## Phase B — Core architecture
- **Runtime model:** Web application with maintenance workflows, database, user roles, and operational dashboards. [https://github.com/Grashjs/grash, 2026-04-12, v1.4.0]
- **Main components:** Work orders, assets, schedules, inspections, parts, reports, and admin/users. [https://github.com/Grashjs/grash/releases, 2026-04-12, v1.4.0]
- **Typical deployment model:** Self-host via official docs or repo guidance; production needs database, mail, backups, and operations ownership. [https://github.com/Grashjs/grash, 2026-04-12, v1.4.0]
- **Runtime dependencies:** Database, mail, storage, scheduler/background jobs, and operational process definition.
- **Primary data stores:** Relational database.
- **Auth model:** Local users/roles; verify current SSO options if required.
- **API / integration surface:** APIs and integrations should be validated against current Atlas CMMS docs before implementation assumptions.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Operational asset data is not the highest compliance burden, but service histories and assigned personnel data still require access control.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Moderate due to identity ambiguity and process-design dependency.