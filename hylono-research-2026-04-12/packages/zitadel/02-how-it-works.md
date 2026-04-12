# ZITADEL — How It Works

## Phase B — Core architecture
- **Runtime model:** Go-based IAM platform with database, admin console, auth endpoints, and standards-based identity protocols. [https://zitadel.com/docs/self-hosting/deploy/overview, 2026-04-12, current]
- **Main components:** Identity service, console, database, TLS endpoints, email/SMS/provider integrations, and optional Helm/Kubernetes deployment artifacts. [https://github.com/zitadel/zitadel/releases, 2026-04-12, v4.12.3]
- **Typical deployment model:** Official Docker Compose exists for evaluation, but official docs recommend Kubernetes/Helm for production-scale self-hosting. [https://zitadel.com/docs/self-hosting/deploy/overview, 2026-04-12, current]
- **Runtime dependencies:** Database, TLS/reverse proxy, mail/SMS providers, secrets management, backup/restore, and identity-provider configuration.
- **Primary data stores:** Relational database plus config/secrets and optional external providers.
- **Auth model:** It is the auth layer: OIDC, OAuth2, SAML, SCIM, MFA, passkeys, service users, and organization/project-scoped controls.
- **API / integration surface:** OIDC/OAuth2 endpoints, management APIs, SCIM, SAML, and admin/automation interfaces.
- **Operational complexity:** **High**
- **Security / compliance considerations:** This is a tier-0 identity system. Key management, domain/TLS correctness, email/SMS trust chains, and upgrade discipline are critical.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** High consequence but high leverage. Worth doing carefully and early if cross-app SSO is a priority.