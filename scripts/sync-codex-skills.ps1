param(
    [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot)
)

$legacySkills = Join-Path $RepoRoot ".agent\skills"
$codexSkills = Join-Path $RepoRoot ".agents\skills"

if (-not (Test-Path $legacySkills)) {
    throw "Legacy skill directory not found: $legacySkills"
}

New-Item -ItemType Directory -Force -Path $codexSkills | Out-Null

$null = robocopy $legacySkills $codexSkills /MIR /NFL /NDL /NJH /NJS /NC /NS
if ($LASTEXITCODE -gt 7) {
    throw "Skill sync failed with robocopy exit code $LASTEXITCODE"
}

Write-Host "Codex skill mirror updated:" $codexSkills
