# ClassroomIO — How It Works

## Phase B — Core architecture
- **Runtime model:** Node monorepo with API/dashboard/docs and local infra dependencies such as Docker and Supabase CLI. [https://github.com/classroomio/classroomio/releases, 2026-04-12, UNVERIFIED]
- **Main components:** API, dashboard, docs, and supporting local infrastructure/dev tooling. [https://github.com/classroomio/classroomio, 2026-04-12, UNVERIFIED]
- **Typical deployment model:** Self-hosting appears possible, but maturity and release/version clarity are weak compared with other tools in this stack. [https://github.com/classroomio/classroomio/releases, 2026-04-12, UNVERIFIED]
- **Runtime dependencies:** Node 22+, Docker, Supabase-related tooling, and further architecture validation.
- **Primary data stores:** Likely relational/backend services via Supabase stack; verify before implementation.
- **Auth model:** Likely app-level auth through the platform; verify current state.
- **API / integration surface:** Repo components suggest API/dashboard split, but production surfaces need validation.
- **Operational complexity:** **Medium to High**
- **Security / compliance considerations:** Course/community user data and classroom interactions require standard controls.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** High maturity and ambiguity risk.