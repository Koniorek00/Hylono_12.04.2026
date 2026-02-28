# Hylono Agent Modes — Active Registry

Updated: 2026-02-28
Source of truth: `.clinerules` §AGENT ROLES + `.agent/modes/*.md`

## How to use

- Activate with: `As [role-slug], [task]`
- If task is ambiguous or multi-domain, default to: `architect-orchestrator`
- All roles must follow current stack guardrails (Next.js 16 App Router, Drizzle, Biome, Arcjet, PostHog EU, Resend)

## Active roles

| Domain | Role slug |
|---|---|
| Instructions, skills, rules | `skill-architect` |
| Architecture, multi-domain | `architect-orchestrator` |
| React, UI, styling, hooks | `frontend-specialist` |
| API, DB, auth, server | `backend-specialist` |
| Security, GDPR, OWASP | `security-compliance` |
| WCAG, ARIA, keyboard | `accessibility-specialist` |
| Design tokens, component system | `design-system-architect` |
| Product copy, therapy content | `content-product-writer` |
| SEO, Core Web Vitals, metadata | `seo-performance` |
| Testing strategy and execution | `test-engineer` |
| CI/CD, deployment, operations | `devops-deploy` |
| Documentation lifecycle | `docs-specialist` |
| PR/code review | `code-reviewer` |
| Quality gate / skeptical validation | `code-skeptic` |
| i18n, localization workflows | `i18n-specialist` |
| Legal/privacy copy support | `legal-privacy-reviewer` |
| Conversion and UX optimization | `conversion-ux-strategist` |
| CMS schema and content modeling | `cms-content-modeler` |
| Email and notifications | `email-notification-engineer` |
| Visual asset direction | `visual-asset-director` |
| Audit and strategic routing | `ceo-auditor` |

## Notes

- Legacy “constellation / consciousness” references and external `file:///` links were removed (stale + non-portable).
- Keep all mode updates local to `.agent/modes/` and aligned with `.clinerules`.
