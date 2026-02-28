$ErrorActionPreference = 'Stop'

$root = 'C:\Users\wikto\.agents\skills'

$roleDescriptions = @{
  'accessibility-specialist' = 'Audit and improve WCAG 2.1 AA compliance, keyboard navigation, ARIA semantics, contrast, and accessible UX patterns for Next.js interfaces.'
  'architect-orchestrator' = 'Coordinate multi-domain implementation plans across frontend, backend, security, SEO, and testing while enforcing workspace guardrails and quality gates.'
  'backend-specialist' = 'Implement secure server-side features in Next.js 16 with Drizzle, Server Actions, validation, auth, and robust API boundaries.'
  'ceo-auditor' = 'Perform strategic audits of product readiness, technical risk, execution quality, and roadmap-priority alignment with business goals.'
  'code-reviewer' = 'Review code for correctness, maintainability, guardrail compliance, architecture fit, and regression risk with actionable feedback.'
  'code-skeptic' = 'Stress-test implementations through adversarial reasoning, identify hidden failure modes, and demand evidence-backed verification.'
  'content-product-writer' = 'Create and refine product and educational copy with medically safe language, conversion clarity, and brand consistency.'
  'data-architect' = 'Design data models, schema evolution strategy, and data-flow contracts for reliability, maintainability, and scale.'
  'design-system-architect' = 'Define and evolve reusable UI primitives, design tokens, variants, and composition rules for consistent, scalable interfaces.'
  'docs-specialist' = 'Manage the complete document lifecycle — create, analyze, organize, deduplicate, archive, and maintain agent-generated documentation.'
  'error-detective' = 'Investigate runtime/build/test failures, isolate root causes, document fixes, and prevent recurrence through diagnostics.'
  'frontend-specialist' = 'Build and refactor React/Next.js UI using server-first boundaries, performance-aware patterns, and accessible client-side interactivity.'
  'graphic-designer' = 'Produce visual direction guidance for digital assets, layout composition, typography hierarchy, and brand-consistent graphical outputs.'
  'i18n-specialist' = 'Implement localization architecture, translation workflows, locale routing, and multilingual content quality controls for EU-first markets.'
  'legal-privacy-reviewer' = 'Review legal/privacy content and implementation details for GDPR alignment, consent flows, disclosures, and policy consistency.'
  'performance-profiler' = 'Profile and optimize frontend performance in Next.js 16 App Router apps with focus on Core Web Vitals, bundle weight, and runtime bottlenecks.'
  'security-compliance' = 'Harden application security, enforce input validation and safe boundaries, and verify compliance controls for auth and data handling.'
  'seo' = 'Plan and optimize discoverability through technical SEO, metadata quality, structured data, and content architecture improvements.'
  'seo-performance' = 'Improve SEO and web performance jointly through metadata, rendering strategy, Core Web Vitals, and crawl/index quality controls.'
  'skill-architect' = 'Create, evaluate, rewrite, and adapt AI agent instruction files with stack-aware constraints and three-way triage.'
  'test-engineer' = 'Design and execute pragmatic test strategy for React/Next.js apps using Vitest, Playwright, and risk-based regression coverage.'
}

if (!(Test-Path $root)) {
  throw "Skills root not found: $root"
}

foreach ($role in $roleDescriptions.Keys) {
  $dir = Join-Path $root $role
  if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }

  $file = Join-Path $dir 'SKILL.md'
  $current = ''
  if (Test-Path $file) {
    $current = Get-Content -Path $file -Raw -Encoding UTF8
  }

  $rolesToForceRepair = @(
    'accessibility-specialist','architect-orchestrator','backend-specialist','ceo-auditor','code-reviewer',
    'code-skeptic','content-product-writer','data-architect','design-system-architect','error-detective',
    'frontend-specialist','graphic-designer','i18n-specialist','legal-privacy-reviewer','security-compliance',
    'seo','seo-performance'
  )

  $nonEmptyCount = (($current -split "`r?`n") | Where-Object { $_.Trim().Length -gt 0 }).Count
  $isBroken = [string]::IsNullOrWhiteSpace($current) -or ($nonEmptyCount -lt 6)
  $shouldForceRepair = $rolesToForceRepair -contains $role

  if (-not ($isBroken -or $shouldForceRepair)) {
    continue
  }

  $description = $roleDescriptions[$role]
  $content = @'
---
name: {0}
description: {1}
---

## CRITICAL CONSTRAINTS
- ALWAYS follow workspace .clinerules and global guardrails.
- ALWAYS verify references before use.
- NEVER use forbidden stack/tooling patterns.

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
| Codebase inspection | Filesystem | read_file/search_files before edits |
| Domain validation | Relevant MCP | run targeted verification for the role |

## DOMAIN PROCEDURES
1. Analyze task scope and constraints.
2. Inspect existing patterns and dependencies.
3. Implement or audit within role boundaries.
4. Verify outcomes with objective checks.
5. Deliver concise decisions and evidence.

## DEFINITION OF DONE
- Output is role-appropriate, verifiable, and guardrail-compliant.
- Referenced artifacts exist and were checked.
- No forbidden stack/tool usage introduced.

## REMEMBER
- ALWAYS verify assumptions against real files and docs.
- ALWAYS keep outputs actionable, concise, and evidence-based.
- NEVER bypass workspace guardrails.
'@ -f $role, $description

  Set-Content -Path $file -Value $content -Encoding UTF8
}

Write-Output "GLOBAL_SKILLS_REPAIRED"