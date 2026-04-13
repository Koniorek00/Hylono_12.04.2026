Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

$scripts = @(
  @{
    Label = "Seeding Uptime Kuma operator configuration"
    Path = Join-Path $root "scripts\seed-uptime-kuma-operator-config.ps1"
  },
  @{
    Label = "Seeding Twenty CRM operator workspace"
    Path = Join-Path $root "scripts\seed-twenty-operator-workspace.ps1"
  },
  @{
    Label = "Reconciling n8n Phase 2 workflows"
    Path = Join-Path $root "scripts\seed-n8n-phase2-workflows.ps1"
  },
  @{
    Label = "Seeding Novu operator bootstrap"
    Path = Join-Path $root "scripts\seed-novu-operator-bootstrap.ps1"
  },
  @{
    Label = "Validating mail provider profile"
    Path = Join-Path $root "scripts\validate-mail-provider-env.ps1"
  }
)

foreach ($script in $scripts) {
  if (-not (Test-Path $script.Path)) {
    continue
  }

  Write-Host ""
  Write-Host "==> $($script.Label)" -ForegroundColor Cyan
  & powershell -ExecutionPolicy Bypass -File $script.Path
  if ($LASTEXITCODE -ne 0) {
    throw "$($script.Label) failed."
  }
}
