# Kong — Overview

## Snapshot
- Environment context: **Phase 2 / UNKNOWN**
- Researched as: **Kong Gateway**
- Current version researched: **3.14.0.1** — **CONFIRMED** [https://docs.konghq.com/gateway/latest/, 2026-04-12, 3.14.0.1]
- License posture: **Apache-2.0 for open-source gateway / enterprise layers available** — **CONFIRMED** [https://github.com/Kong/kong/releases, 2026-04-12, 3.14.0.1]
- Recommended timing: **FOUNDATIONAL EARLY PLATFORM CANDIDATE**
- Maintenance burden: **High**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** API gateway for routing, auth, rate limiting, plugins, observability, and API policy enforcement. [https://github.com/Kong/kong/releases, 2026-04-12, 3.14.0.1]
- **What it solves:** Central API ingress, OIDC/JWT auth, rate limiting, service routing, plugin-based controls, and boundary hardening for many services. [https://docs.konghq.com/gateway/latest/, 2026-04-12, 3.14.0.1]
- **Best-fit users:** Platform and API teams operating multiple services and integrations. [https://github.com/Kong/kong/releases, 2026-04-12, 3.14.0.1]
- **Where it fits in a modern stack:** Excellent fit. Hylono already has multiple APIs and self-hosted services in scope; Kong is the cleanest traffic/control-plane anchor for a growing internal/external service estate. [https://github.com/Kong/kong, 2026-04-12, 3.14.0.1]

## Hylono fit snapshot
- **Business usefulness:** Strong central fit for Next.js APIs, internal tools, webhooks, ZITADEL/OIDC, rate limits, service discovery, and observability. [https://docs.konghq.com/gateway/latest/, 2026-04-12, 3.14.0.1]
- **Overlap watch:** Some overlap with ad hoc reverse proxies, but Kong becomes the intentional API boundary.
- **Must verify before implementation:** Decide whether Kong fronts only internal admin/service traffic or also public Hylono APIs.