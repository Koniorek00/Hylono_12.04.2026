# Appsmith — How It Works

## Phase B — Core architecture
- **Runtime model:** Containerized web platform with database connections, JS widgets, APIs, and auth/user management. [https://docs.appsmith.com/, 2026-04-12, current]
- **Main components:** Builder UI, runtime, DB/API connectors, user/workspace model, and deployment services. [https://github.com/appsmithorg/appsmith/releases, 2026-04-12, v1.98]
- **Typical deployment model:** Docker Compose or Kubernetes are supported. Production requires SSO, environment promotion, and data-connector discipline. [https://docs.appsmith.com/, 2026-04-12, current]
- **Runtime dependencies:** Persistent storage, Appsmith runtime, auth/SSO, database/API credentials, and reverse proxy.
- **Primary data stores:** Internal metadata store plus connected data sources/APIs.
- **Auth model:** Built-in auth with SSO/OIDC/SAML options depending on setup.
- **API / integration surface:** Connectors to SQL/REST/GraphQL and JS-based internal apps.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Internal tooling can become a privileged data surface. Restrict connectors, credentials, and publishing/admin rights carefully.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Moderate but very useful if governed.