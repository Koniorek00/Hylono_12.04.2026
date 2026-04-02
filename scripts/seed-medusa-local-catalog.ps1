Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$manifestPath = Join-Path $root "scripts\data\medusa-local-catalog.seed.json"
$outputDir = Join-Path $root "output\medusa-bootstrap"
$outputPath = Join-Path $outputDir "operator-baseline-state.json"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Get-MedusaManifest {
  if (-not (Test-Path $manifestPath)) {
    throw "Medusa catalog manifest not found: $manifestPath"
  }

  return Get-Content -Path $manifestPath -Raw | ConvertFrom-Json
}

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

Write-Step "Checking Medusa local catalog baseline"

$manifest = Get-MedusaManifest
$canonicalProductTitle = [string]$manifest.canonicalProduct.title
$canonicalProductHandle = [string]$manifest.canonicalProduct.handle
$canonicalProductStatus = [string]$manifest.canonicalProduct.status

$products = [int](Invoke-PostgresScalar -Database "medusa_db" -Sql "select count(*) from product;")
$regions = [int](Invoke-PostgresScalar -Database "medusa_db" -Sql "select count(*) from region;")
$stockLocations = [int](Invoke-PostgresScalar -Database "medusa_db" -Sql "select count(*) from stock_location;")
$publishableKeys = [int](Invoke-PostgresScalar -Database "medusa_db" -Sql "select count(*) from api_key where type = 'publishable';")
$adminUsers = [int](Invoke-PostgresScalar -Database "medusa_db" -Sql "select count(*) from ""user"";")
$canonicalProductCount = [int](Invoke-PostgresScalar -Database "medusa_db" -Sql @"
select count(*)
from product
where handle = '$canonicalProductHandle'
  and title = '$canonicalProductTitle'
  and status = '$canonicalProductStatus';
"@)

$requiresSeed = ($products -eq 0) -or ($regions -eq 0) -or ($stockLocations -eq 0) -or ($publishableKeys -eq 0)

if ($requiresSeed) {
  Write-Host "Medusa catalog is incomplete. Running the bundled starter seed..." -ForegroundColor Yellow
  docker exec hylono-medusa sh -lc "cd /app && npm run seed"
  if ($LASTEXITCODE -ne 0) {
    throw "Medusa starter seed failed."
  }
} else {
  Write-Host "Medusa catalog already seeded. Skipping duplicate starter seed." -ForegroundColor Green
}

$publishableKey = Invoke-PostgresScalar -Database "medusa_db" -Sql @"
select token
from api_key
where type = 'publishable'
order by created_at desc
limit 1;
"@

$productCountAfter = [int](Invoke-PostgresScalar -Database "medusa_db" -Sql "select count(*) from product;")
$regionCountAfter = [int](Invoke-PostgresScalar -Database "medusa_db" -Sql "select count(*) from region;")
$stockLocationCountAfter = [int](Invoke-PostgresScalar -Database "medusa_db" -Sql "select count(*) from stock_location;")
$publishableKeysAfter = [int](Invoke-PostgresScalar -Database "medusa_db" -Sql "select count(*) from api_key where type = 'publishable';")
$adminUsersAfter = [int](Invoke-PostgresScalar -Database "medusa_db" -Sql "select count(*) from ""user"";")
$canonicalProductCountAfter = [int](Invoke-PostgresScalar -Database "medusa_db" -Sql @"
select count(*)
from product
where handle = '$canonicalProductHandle'
  and title = '$canonicalProductTitle'
  and status = '$canonicalProductStatus';
"@)

Write-Host ("Products: {0}" -f $productCountAfter) -ForegroundColor Green
Write-Host ("Regions: {0}" -f $regionCountAfter) -ForegroundColor Green
Write-Host ("Stock locations: {0}" -f $stockLocationCountAfter) -ForegroundColor Green

if ($canonicalProductCountAfter -lt 1) {
  throw "Canonical Medusa product '$canonicalProductTitle' ($canonicalProductHandle) is missing after seed reconciliation."
}

$state = [ordered]@{
  generatedAt = (Get-Date).ToString("o")
  manifestPath = $manifestPath
  canonicalProduct = @{
    title = $canonicalProductTitle
    handle = $canonicalProductHandle
    status = $canonicalProductStatus
    exists = ($canonicalProductCountAfter -ge 1)
  }
  counts = @{
    products = $productCountAfter
    regions = $regionCountAfter
    stockLocations = $stockLocationCountAfter
    publishableKeys = $publishableKeysAfter
    adminUsers = $adminUsersAfter
  }
}

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
$state | ConvertTo-Json -Depth 6 | Set-Content -Path $outputPath -Encoding UTF8

if ($adminUsersAfter -eq 0) {
  Write-Warning "No Medusa admin user exists yet. The catalog is seeded, but admin login still needs to be created separately."
}

if ($publishableKey) {
  Write-Host ("Publishable API key ready: {0}" -f $publishableKey) -ForegroundColor Green
} else {
  Write-Warning "No Medusa publishable API key was found after the seed check."
}

Write-Host ("Canonical product: {0} ({1})" -f $canonicalProductTitle, $canonicalProductHandle) -ForegroundColor Green
Write-Host ("Output state: {0}" -f $outputPath) -ForegroundColor Green
