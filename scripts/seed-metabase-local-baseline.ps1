Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$outputDir = Join-Path $root "output\metabase-bootstrap"
$outputPath = Join-Path $outputDir "local-baseline-state.json"

function Invoke-PostgresScalar {
  param(
    [Parameter(Mandatory = $true)][string]$Database,
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $output = $Sql | docker exec -i hylono-postgres psql -U postgres -d $Database -t -A
  if ($LASTEXITCODE -ne 0) {
    throw "PostgreSQL query failed for $Database."
  }

  return ($output | Out-String).Trim()
}

$health = Invoke-WebRequest -Uri "http://127.0.0.1:8220/api/health" -TimeoutSec 20 -UseBasicParsing
$publicTableCount = [int](Invoke-PostgresScalar -Database "metabase_db" -Sql "select count(*) from information_schema.tables where table_schema = 'public';")
$userTableCount = [int](Invoke-PostgresScalar -Database "metabase_db" -Sql "select count(*) from information_schema.tables where table_name = 'core_user';")

$state = [ordered]@{
  appliedAt = (Get-Date).ToString("o")
  baseUrl = "http://127.0.0.1:8220"
  health = [ordered]@{
    statusCode = [int]$health.StatusCode
    body = $health.Content
  }
  metadataDb = [ordered]@{
    database = "metabase_db"
    publicTableCount = $publicTableCount
    coreUserTablePresent = ($userTableCount -ge 1)
  }
  notes = @(
    "Metabase runtime is healthy and metadata tables are present.",
    "Initial application owner still needs to complete the first-run onboarding UI."
  )
}

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
$state | ConvertTo-Json -Depth 6 | Set-Content -Path $outputPath -Encoding UTF8

Write-Host "Metabase local baseline verified." -ForegroundColor Green
Write-Host ("Health: {0}" -f $health.Content) -ForegroundColor Green
Write-Host ("Metadata tables: {0}" -f $publicTableCount) -ForegroundColor Green
Write-Host ("State file: {0}" -f $outputPath) -ForegroundColor Green
