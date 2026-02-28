$ErrorActionPreference = 'Stop'

$skills = @(
  'accessibility-specialist','architect-orchestrator','backend-specialist','ceo-auditor','code-reviewer','code-skeptic',
  'content-product-writer','data-architect','design-system-architect','docs-specialist','error-detective',
  'frontend-specialist','graphic-designer','i18n-specialist','legal-privacy-reviewer','performance-profiler',
  'security-compliance','seo','test-engineer'
)

$globalSkillsRoot = 'C:\Users\wikto\.agents\skills'
$workspaceSkillsRoot = 'F:\ag projects\Hylono_MAIN\.agent\skills'
$workspaceModesRoot = 'F:\ag projects\Hylono_MAIN\.agent\modes'
$globalModesRoot = 'C:\Users\wikto\.agents\modes'

New-Item -ItemType Directory -Force -Path $workspaceSkillsRoot | Out-Null
New-Item -ItemType Directory -Force -Path $workspaceModesRoot | Out-Null
New-Item -ItemType Directory -Force -Path $globalModesRoot | Out-Null

function Normalize-SkillText([string]$text) {
  $t = $text
  $t = $t -replace 'Vite 6 \+ React 19', 'Next.js 16 + React 19.2'
  $t = $t -replace 'Vite 6', 'Next.js 16'
  $t = $t -replace 'React 19 \+ TypeScript 5 strict \+ Vite 6 \+ Tailwind v4', 'Next.js 16 + React 19.2 + TypeScript 5 strict + Tailwind v4'
  $t = $t -replace 'http://localhost:5173', 'http://localhost:3000'
  $t = $t -replace 'npm run build', 'pnpm build'

  # Removed MCPs -> allowed alternatives
  $t = $t -replace 'Sequential Thinking MCP', 'Structured reasoning'
  $t = $t -replace 'Sequential Thinking', 'Structured reasoning'
  $t = $t -replace 'sequentialthinking', 'internal step-by-step analysis'
  $t = $t -replace 'Memory MCP', 'project memory files'
  $t = $t -replace 'read_graph \+ add_observations', 'read/write `.agent/memory/*` files directly'
  $t = $t -replace 'search_nodes', 'search relevant memory markdown files'
  $t = $t -replace 'create_entities', 'document updates in memory markdown files'
  $t = $t -replace 'Playwright MCP', 'browser-tools-mcp'
  $t = $t -replace 'Playwright', 'browser-tools-mcp'
  $t = $t -replace 'Fetch MCP', 'filesystem/network tools from installed MCP set'
  $t = $t -replace 'PostgreSQL MCP', 'Supabase MCP SQL tools'
  $t = $t -replace 'PubMed MCP', 'BioMCP article search/fetch'

  # Keep wording aligned with current workspace
  $t = $t -replace '\bSPA\b', 'App Router'

  return $t
}

function Build-ModeFromSkill([string]$slug, [string]$skillText) {
  $desc = "Mode for $slug execution"
  if ($skillText -match '(?m)^description:\s*(.+)$') {
    $desc = $Matches[1].Trim()
  }

  $constraints = New-Object System.Collections.Generic.List[string]
  $inConstraints = $false
  foreach ($line in ($skillText -split "`r?`n")) {
    if ($line -match '^##\s+CRITICAL CONSTRAINTS') { $inConstraints = $true; continue }
    if ($inConstraints -and $line -match '^##\s+') { break }
    if ($inConstraints -and $line.Trim().StartsWith('- ')) {
      $constraints.Add($line.Trim())
      if ($constraints.Count -ge 8) { break }
    }
  }
  if ($constraints.Count -eq 0) {
    $constraints.Add('- ALWAYS follow `.clinerules` guardrails.')
    $constraints.Add('- ALWAYS keep outputs concise, verifiable, and actionable.')
    $constraints.Add('- NEVER use unavailable MCPs.')
  }

  $workflow = New-Object System.Collections.Generic.List[string]
  $inProcedures = $false
  foreach ($line in ($skillText -split "`r?`n")) {
    if ($line -match '^##\s+DOMAIN PROCEDURES') { $inProcedures = $true; continue }
    if ($inProcedures -and $line -match '^##\s+') { break }
    if ($inProcedures -and $line.Trim() -match '^\d+\.\s+') {
      $workflow.Add($line.Trim())
      if ($workflow.Count -ge 6) { break }
    }
  }
  if ($workflow.Count -eq 0) {
    $workflow.Add('1. Analyze scope and constraints.')
    $workflow.Add('2. Execute domain-specific implementation/review.')
    $workflow.Add('3. Verify outputs and provide evidence.')
  }

  @"
---
name: $slug
description: $desc
---

## ROLE
Execute $slug responsibilities with strict compliance to workspace guardrails and measurable outcomes.

## WHAT YOU ARE NOT
- Not a generic persona prompt.
- Not a linter/style-only rule pack.
- Not a replacement for workspace `.clinerules`.

## CONSTRAINTS
$($constraints -join "`n")

## WORKFLOW
$($workflow -join "`n")

## MCP TOOLS
| When | Tool | Action |
|---|---|---|
| Library/API uncertainty | Context7 | resolve-library-id -> query-docs |
| Codebase inspection | Filesystem | read/search/list files before edits |
| Domain-specific validation | Relevant MCP from `.clinerules` | apply required verification flow |

## OUTPUT FILES
- `.agent/skills/$slug/SKILL.md`
- `.agent/modes/$slug.md`

## DEFINITION OF DONE
- Constraints were followed and no guardrails were relaxed.
- Output includes concrete changes/findings and verification evidence.
- MCP usage references only currently available tools.
- Skill and mode content are synchronized in workspace/global locations.
"@
}

$report = New-Object System.Collections.Generic.List[string]

foreach ($slug in $skills) {
  $globalSkillPath = Join-Path $globalSkillsRoot "$slug\SKILL.md"
  if (!(Test-Path $globalSkillPath)) {
    $report.Add("$slug:SKIPPED(global skill missing)")
    continue
  }

  $globalRaw = Get-Content -Path $globalSkillPath -Raw
  $normalized = Normalize-SkillText $globalRaw

  # Update global skill and sync to workspace skill
  Set-Content -Path $globalSkillPath -Value $normalized -Encoding UTF8

  $workspaceSkillDir = Join-Path $workspaceSkillsRoot $slug
  New-Item -ItemType Directory -Force -Path $workspaceSkillDir | Out-Null
  $workspaceSkillPath = Join-Path $workspaceSkillDir 'SKILL.md'
  Set-Content -Path $workspaceSkillPath -Value $normalized -Encoding UTF8

  # Rebuild and sync mode files
  $modeText = Build-ModeFromSkill -slug $slug -skillText $normalized
  $workspaceModePath = Join-Path $workspaceModesRoot "$slug.md"
  $globalModePath = Join-Path $globalModesRoot "$slug.md"
  Set-Content -Path $workspaceModePath -Value $modeText -Encoding UTF8
  Set-Content -Path $globalModePath -Value $modeText -Encoding UTF8

  # Verify sync
  $skillMatch = ((Get-FileHash $workspaceSkillPath).Hash -eq (Get-FileHash $globalSkillPath).Hash)
  $modeMatch = ((Get-FileHash $workspaceModePath).Hash -eq (Get-FileHash $globalModePath).Hash)
  $report.Add("$slug:skill_match=$skillMatch,mode_match=$modeMatch")
}

Write-Output 'SYNC_REPORT_START'
$report | ForEach-Object { Write-Output $_ }
Write-Output 'SYNC_REPORT_END'
