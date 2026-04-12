# Novu — How It Works

## Phase B — Core architecture
- **Runtime model:** API/service layer with worker processes, Redis, MongoDB, storage, provider connectors, and workflow/template management. [https://docs.novu.co/platform/self-hosting/overview, 2026-04-12, current]
- **Main components:** API, dashboard, workers, Redis, MongoDB, outbound channel providers, templates, and webhooks. [https://github.com/novuhq/novu/releases, 2026-04-12, v3.13.0]
- **Typical deployment model:** Self-host via official guides on VMs/containers; production deployments need Redis, MongoDB, storage, secrets, and provider configuration. [https://docs.novu.co/platform/self-hosting/overview, 2026-04-12, current]
- **Runtime dependencies:** MongoDB, Redis, storage, outbound providers, TLS/reverse proxy, and worker scaling.
- **Primary data stores:** MongoDB plus Redis; object/file storage depending on feature use.
- **Auth model:** API keys, dashboard auth, workspace/user controls, and provider credentials.
- **API / integration surface:** REST APIs, SDKs, webhooks, event triggers, templates, and provider integrations.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Notification payloads can contain PII and order/service context. Keep provider creds in a secrets system, scope API keys, and minimize sensitive data in templates.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Moderate. High leverage, but notification systems fail noisily if payload ownership, templates, or provider ops are weak.