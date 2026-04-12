# Infisical — How It Works

## Phase B — Core architecture
- **Runtime model:** Web/API platform with encrypted secret storage, auth, access controls, and SDK/CLI/agent integrations. [https://infisical.com/docs/self-hosting/overview, 2026-04-12, current]
- **Main components:** Control plane/UI, database, encryption/key management, CLI/SDK, secret sync/injection, and policy/audit layers. [https://github.com/Infisical/infisical/releases, 2026-04-12, v0.159.9]
- **Typical deployment model:** Self-host docs are mature; production requires reliable DB, key management, backup, and role design. [https://infisical.com/docs/self-hosting/overview, 2026-04-12, current]
- **Runtime dependencies:** Database, encryption keys/KMS strategy, SSO/auth, backup plan, and agent/injection method choices.
- **Primary data stores:** Database for metadata and encrypted secrets.
- **Auth model:** Local users, SSO/OIDC/SAML depending on plan/setup, machine identities, and scoped access policies.
- **API / integration surface:** CLI/SDK/API, secret sync/injection, dynamic access patterns, and audit logs.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** High leverage and high consequence. Root keys, bootstrap process, admin access, and backup recovery must be handled carefully.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Moderate but worth it; benefits compound as the stack grows.