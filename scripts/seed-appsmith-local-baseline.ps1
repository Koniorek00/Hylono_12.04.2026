Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$outputDir = Join-Path $root "output\appsmith-bootstrap"
$outputPath = Join-Path $outputDir "local-baseline-state.json"

$response = Invoke-WebRequest -Uri "http://127.0.0.1:8221" -TimeoutSec 30 -UseBasicParsing

$state = [ordered]@{
  appliedAt = (Get-Date).ToString("o")
  baseUrl = "http://127.0.0.1:8221"
  statusCode = [int]$response.StatusCode
  notes = @(
    "Appsmith runtime is reachable locally.",
    "Administrator account still needs to complete the first-run onboarding UI."
  )
}

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
$state | ConvertTo-Json -Depth 4 | Set-Content -Path $outputPath -Encoding UTF8

Write-Host "Appsmith local baseline verified." -ForegroundColor Green
Write-Host ("Status: {0}" -f $response.StatusCode) -ForegroundColor Green
Write-Host ("State file: {0}" -f $outputPath) -ForegroundColor Green
