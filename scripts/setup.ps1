param(
  [ValidateSet("infrastructure", "1a")]
  [string]$Phase = "infrastructure"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$stackDir = (Resolve-Path (Join-Path $scriptDir "..")).Path
$envFile = Join-Path $stackDir ".env"
$infraCompose = Join-Path $stackDir "docker/infrastructure/docker-compose.yml"
$phase1Compose = Join-Path $stackDir "docker/phase-1a/docker-compose.yml"

if (-not (Test-Path $envFile)) {
  & (Join-Path $scriptDir "generate-secrets.ps1")
}

switch ($Phase) {
  "infrastructure" {
    & docker compose -f $infraCompose --env-file $envFile up -d
  }
  "1a" {
    & docker compose -f $infraCompose --env-file $envFile up -d
    & docker compose -f $phase1Compose --env-file $envFile up -d
  }
}
