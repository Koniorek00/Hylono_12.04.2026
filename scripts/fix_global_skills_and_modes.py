from pathlib import Path
import shutil


GLOBAL_SKILLS = Path(r"C:\Users\wikto\.agents\skills")
GLOBAL_MODES = Path(r"C:\Users\wikto\.agents\modes")
WORKSPACE_MODES = Path(r"F:\ag projects\Hylono_MAIN\.agent\modes")

KEEP_AS_IS = set()

DESCRIPTIONS = {
    "accessibility-specialist": "Audit and improve WCAG 2.1 AA compliance, keyboard navigation, ARIA semantics, contrast, and accessible UX patterns.",
    "architect-orchestrator": "Coordinate multi-domain implementation plans across frontend, backend, security, SEO, and testing with strict guardrail compliance.",
    "backend-specialist": "Implement secure server-side features in Next.js with validation, data boundaries, and robust API/action architecture.",
    "ceo-auditor": "Run strategic audits on technical readiness, risk, execution quality, and roadmap alignment to business priorities.",
    "code-reviewer": "Review code changes for correctness, maintainability, architecture fit, and regression risk with actionable findings.",
    "code-skeptic": "Stress-test implementations through adversarial reasoning and require objective verification before acceptance.",
    "content-product-writer": "Create and refine product and educational content with medically safe language and conversion clarity.",
    "data-architect": "Design schemas, data contracts, and evolution strategy for reliability, clarity, and maintainability.",
    "design-system-architect": "Define reusable UI primitives, variants, and token-driven patterns for consistent scalable interfaces.",
    "error-detective": "Investigate failures, isolate root causes, and document robust fixes that prevent recurrence.",
    "frontend-specialist": "Build and refactor React/Next.js UI using server-first boundaries, accessibility, and performance-aware patterns.",
    "graphic-designer": "Provide visual direction for graphics, layout hierarchy, and brand-consistent creative outputs.",
    "i18n-specialist": "Implement localization architecture, translation workflows, and multilingual quality controls.",
    "legal-privacy-reviewer": "Review legal/privacy implementation details for GDPR alignment, consent correctness, and policy consistency.",
    "security-compliance": "Harden security boundaries, validate inputs, and enforce compliance controls for auth and data handling.",
    "seo": "Improve discoverability through technical SEO, metadata quality, and structured content architecture.",
    "seo-performance": "Improve search visibility and performance jointly through metadata, rendering strategy, and Core Web Vitals.",
}


def skill_content(role: str) -> str:
    description = DESCRIPTIONS.get(role, f"Specialized workflow for {role}.")
    if role == "skill-architect":
        return f"""---
name: {role}
description: {description}
---

## CRITICAL CONSTRAINTS
- ALWAYS align instruction updates with workspace `.clinerules` before writing.
- ALWAYS verify current MCP/tool availability before recommending tool usage.
- ALWAYS preserve high-signal domain procedures while removing low-value noise.
- NEVER introduce stale stack guidance or outdated command references.

## STACK SNAPSHOT
- Framework: Next.js 16 App Router + React 19.2 + TypeScript strict
- Data: Drizzle + Neon
- Tooling: Biome + pnpm
- Security: Arcjet

## COMMANDS
- `pnpm build`
- `pnpm check`
- `pnpm test`

## MCP TOOLS
| When | Tool | Action |
|---|---|---|
| Validate API/library details in rules | Context7 | resolve-library-id -> query-docs |
| Inspect instruction and mode files | Filesystem | read/search/list before edits |
| Update global skill artifacts | Filesystem | write verified content to canonical skill paths |

## DOMAIN PROCEDURES
1. Run self-audit against current workspace governance.
2. Detect instruction drift (framework/tooling/commands).
3. Rewrite instructions with concise, enforceable constraints.
4. Ensure mode compatibility and role routing consistency.
5. Deliver change summary with verification evidence.

## DEFINITION OF DONE
- Skills are stack-current and role-accurate.
- No stale framework or command references remain.
- Updated content is structurally valid and discoverable.

## REMEMBER
- ALWAYS optimize for behavioral clarity, not verbosity.
- ALWAYS keep constraints testable and actionable.
- NEVER ship instruction changes without verification.
"""

    if role == "performance-profiler":
        return f"""---
name: {role}
description: {description}
---

## CRITICAL CONSTRAINTS
- ALWAYS measure baseline and post-change metrics before claiming improvement.
- ALWAYS prioritize LCP/INP/CLS and conversion-critical route performance.
- NEVER trade accessibility or correctness for benchmark-only gains.

## STACK SNAPSHOT
- Framework: Next.js 16 App Router + React 19.2 + TypeScript strict
- Tooling: Biome + pnpm
- Metrics focus: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1

## COMMANDS
- `pnpm dev`
- `pnpm build`
- `pnpm check`

## MCP TOOLS
| When | Tool | Action |
|---|---|---|
| Inspect bottleneck code paths | Filesystem | read/search related route/component files |
| Verify optimization APIs/patterns | Context7 | resolve-library-id -> query-docs |
| Validate runtime UX impact | browser-tools-mcp | inspect behavior and evidence after changes |

## DOMAIN PROCEDURES
1. Capture baseline metrics for target route(s).
2. Identify dominant bottleneck class and highest-leverage fix.
3. Apply minimal changes that improve user-perceived performance.
4. Re-measure and document objective deltas.
5. List remaining optimization backlog by impact.

## DEFINITION OF DONE
- Metrics and evidence are documented.
- Critical bottlenecks are resolved or clearly blocked.
- UX/accessibility remains intact.

## REMEMBER
- ALWAYS verify with numbers, not intuition.
- ALWAYS optimize conversion-critical paths first.
- NEVER leave performance claims unverified.
"""

    if role == "test-engineer":
        return f"""---
name: {role}
description: {description}
---

## CRITICAL CONSTRAINTS
- ALWAYS test behavior and outcomes, not implementation internals.
- ALWAYS cover success, edge, and failure paths for changed logic.
- ALWAYS add regression tests for confirmed bug fixes.
- NEVER mark work complete with unresolved flaky test behavior.

## STACK SNAPSHOT
- Framework: Next.js 16 App Router + React 19.2 + TypeScript strict
- Test stack: Vitest + Playwright + browser-tools-mcp
- Priority areas: checkout, rental, consent, auth-sensitive flows

## COMMANDS
- `pnpm test`
- `pnpm check`

## MCP TOOLS
| When | Tool | Action |
|---|---|---|
| Inspect test targets and gaps | Filesystem | read/search test and source files |
| Validate framework/testing APIs | Context7 | resolve-library-id -> query-docs |
| Verify end-user behavior | browser-tools-mcp | validate flow behavior and errors visually |

## DOMAIN PROCEDURES
1. Build a risk map from changed behavior.
2. Select minimal high-confidence test mix.
3. Add deterministic tests and isolate unstable assumptions.
4. Verify regressions are blocked with explicit coverage.
5. Report residual risk and recommended follow-ups.

## DEFINITION OF DONE
- Changed behavior is covered by stable tests.
- Regression protection exists for fixed defects.
- Remaining risk is explicitly documented.

## REMEMBER
- ALWAYS protect user-critical journeys.
- ALWAYS stabilize flaky tests at root cause.
- NEVER rely on unverified test assumptions.
"""

    return f"""---
name: {role}
description: {description}
---

## CRITICAL CONSTRAINTS
- ALWAYS follow workspace .clinerules and global guardrails.
- ALWAYS verify references before using them.
- NEVER use forbidden tools, frameworks, or stack patterns.

## STACK SNAPSHOT
- Platform: Hylono Next.js 16 + React 19.2 + TypeScript strict
- Standards: Biome, Drizzle, Arcjet, PostHog EU, Resend

## COMMANDS
- `pnpm build`
- `pnpm check`
- `pnpm test`

## MCP TOOLS
| When | Tool | Action |
|---|---|---|
| Library/API uncertainty | Context7 | resolve-library-id -> query-docs |
| Codebase inspection | Filesystem | read/search files before edits |
| Domain-specific validation | Relevant MCP | run targeted verification for the role |

## DOMAIN PROCEDURES
1. Analyze scope, constraints, and acceptance criteria.
2. Inspect existing patterns and related files before changes.
3. Implement/audit strictly within role boundaries.
4. Verify outcomes with concrete evidence.
5. Deliver concise decisions, risks, and next steps.

## DEFINITION OF DONE
- Output is role-appropriate, verifiable, and guardrail-compliant.
- All referenced files/functions exist.
- No forbidden stack/tool usage was introduced.

## REMEMBER
- ALWAYS choose conservative, safe defaults when uncertain.
- ALWAYS prefer clarity and reproducibility over cleverness.
- NEVER bypass required verification.
"""


def mode_content(role: str) -> str:
    return f"""# {role.replace('-', ' ').title()}
**Slug**: `{role}`
**Activate**: "As {role}, [task]"

## ROLE
You are responsible for {role} execution in this workspace.

## CONSTRAINTS
- ALWAYS follow `.clinerules`.
- ALWAYS validate outcomes with concrete evidence.
- NEVER use forbidden tooling.

## WORKFLOW
1. Analyze scope and constraints.
2. Review existing patterns/files.
3. Execute role-specific implementation or audit.
4. Verify and report results.
"""


def main() -> None:
    GLOBAL_MODES.mkdir(parents=True, exist_ok=True)
    GLOBAL_SKILLS.mkdir(parents=True, exist_ok=True)

    # 1) rewrite each non-core global SKILL.md one-by-one
    for skill_dir in sorted([p for p in GLOBAL_SKILLS.iterdir() if p.is_dir()], key=lambda p: p.name):
        role = skill_dir.name
        skill_file = skill_dir / "SKILL.md"
        if role in KEEP_AS_IS:
            continue
        skill_file.write_text(skill_content(role), encoding="utf-8", newline="\n")

    # 2) ensure global mode exists per role
    for skill_dir in sorted([p for p in GLOBAL_SKILLS.iterdir() if p.is_dir()], key=lambda p: p.name):
        role = skill_dir.name
        target_mode = GLOBAL_MODES / f"{role}.md"
        workspace_mode = WORKSPACE_MODES / f"{role}.md"

        if target_mode.exists():
            continue

        if workspace_mode.exists():
            shutil.copyfile(workspace_mode, target_mode)
        else:
            target_mode.write_text(mode_content(role), encoding="utf-8", newline="\n")

    print("FIX_DONE")


if __name__ == "__main__":
    main()
