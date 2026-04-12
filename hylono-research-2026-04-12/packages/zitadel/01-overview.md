# ZITADEL — Overview

## Snapshot
- Environment context: **Phase 1A / STOPPED**
- Researched as: **ZITADEL identity and access management platform**
- Current version researched: **v4.12.3** — **CONFIRMED** [https://github.com/zitadel/zitadel/releases, 2026-04-12, v4.12.3]
- License posture: **Apache-2.0 / verify current distribution terms if enterprise features are considered** — **PARTLY VERIFIED** [https://zitadel.com/docs/self-hosting/deploy/overview, 2026-04-12, current]
- Recommended timing: **FOUNDATIONAL EARLY CANDIDATE**
- Maintenance burden: **High**
- Risk level: **High**

## Phase A — App identity
- **What it is:** Identity and access management platform with SSO, MFA, passkeys, OIDC, SAML, SCIM, and organization/project models. [https://zitadel.com/docs/self-hosting/deploy/overview, 2026-04-12, current]
- **What it solves:** Centralized authentication, SSO, machine identity, tenant/org identity management, and standards-based auth brokering across applications. [https://github.com/zitadel/zitadel/releases, 2026-04-12, v4.12.3]
- **Best-fit users:** Engineering and platform teams that want a self-hostable identity provider rather than stitching auth separately into every internal tool. [https://zitadel.com/docs/self-hosting/deploy/overview, 2026-04-12, current]
- **Where it fits in a modern stack:** Excellent fit. Hylono already runs Auth.js on the site, and ZITADEL is the strongest self-hosted candidate in this stack for cross-app SSO, machine identities, and externalized identity governance. [https://github.com/zitadel/zitadel, 2026-04-12, v4.12.3]

## Hylono fit snapshot
- **Business usefulness:** High-value integration with Next.js/Auth.js as an external IdP, internal tool SSO (Twenty, Appsmith, Metabase, BookStack, etc.), Kong/OIDC, and machine-to-machine auth patterns. [https://github.com/zitadel/zitadel/releases, 2026-04-12, v4.12.3]
- **Overlap watch:** Could overlap with app-local auth systems and portions of Auth.js. Recommended as the primary self-hosted IdP rather than many disconnected auth stacks.
- **Must verify before implementation:** Decide whether Hylono wants ZITADEL to become the central IdP now, or whether Auth.js remains primary for the site while ZITADEL covers internal tools first.