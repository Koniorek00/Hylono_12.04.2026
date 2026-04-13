param(
  [ValidateSet("infrastructure", "active", "1a", "phase2")]
  [string]$Phase = "infrastructure"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$stackDir = (Resolve-Path (Join-Path $scriptDir "..")).Path
$envFile = Join-Path $stackDir ".env"
$infraCompose = Join-Path $stackDir "docker/infrastructure/docker-compose.yml"
$phase1Compose = Join-Path $stackDir "docker/phase-1a/docker-compose.yml"
$phase2Compose = Join-Path $stackDir "docker/phase-2/docker-compose.yml"

if (-not (Test-Path $envFile)) {
  & (Join-Path $scriptDir "generate-secrets.ps1")
}

switch ($Phase) {
  "infrastructure" {
    & docker compose -f $infraCompose --env-file $envFile up -d
  }
  "active" {
    & docker compose -f $infraCompose --env-file $envFile up -d
    & docker compose -f $phase1Compose --env-file $envFile up -d twenty novu-api novu-worker novu-ws novu-dashboard n8n n8n-worker
  }
  "1a" {
    & docker compose -f $infraCompose --env-file $envFile up -d
    & docker compose -f $phase1Compose --env-file $envFile up -d
  }
  "phase2" {
    & docker compose -f $infraCompose --env-file $envFile up -d
    & docker compose -f $phase2Compose --env-file $envFile up -d
  }
}
