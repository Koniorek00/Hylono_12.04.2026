Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Parse-EnvFile {
  param([string]$Path)

  $result = @{}
  if (-not (Test-Path $Path)) {
    return $result
  }

  foreach ($line in Get-Content -Path $Path) {
    $trimmed = $line.Trim()
    if (-not $trimmed -or $trimmed.StartsWith("#")) {
      continue
    }

    $separatorIndex = $trimmed.IndexOf("=")
    if ($separatorIndex -lt 0) {
      continue
    }

    $key = $trimmed.Substring(0, $separatorIndex).Trim()
    $value = $trimmed.Substring($separatorIndex + 1).Trim()
    if ($key) {
      $result[$key] = $value
    }
  }

  return $result
}

function Escape-SqlLiteral {
  param([Parameter(Mandatory = $true)][AllowEmptyString()][string]$Value)

  return $Value.Replace("'", "''")
}

function Invoke-MariaScalar {
  param(
    [Parameter(Mandatory = $true)][string]$Password,
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $output = $Sql | docker exec -i hylono-snipe-it-db mariadb -N -B -uroot "-p$Password" snipeit_db
  if ($LASTEXITCODE -ne 0) {
    throw "MariaDB query failed for Snipe-IT."
  }

  return ($output | Out-String).Trim()
}

function Invoke-MariaSql {
  param(
    [Parameter(Mandatory = $true)][string]$Password,
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $null = $Sql | docker exec -i hylono-snipe-it-db mariadb -uroot "-p$Password" snipeit_db
  if ($LASTEXITCODE -ne 0) {
    throw "MariaDB command failed for Snipe-IT."
  }
}

function Get-OrCreateId {
  param(
    [Parameter(Mandatory = $true)][string]$Password,
    [Parameter(Mandatory = $true)][string]$Table,
    [Parameter(Mandatory = $true)][string]$LookupSql,
    [Parameter(Mandatory = $true)][string]$InsertSql,
    [Parameter(Mandatory = $true)][string]$ReloadSql
  )

  $existingId = Invoke-MariaScalar -Password $Password -Sql $LookupSql
  if ($existingId) {
    return [int]$existingId
  }

  Invoke-MariaSql -Password $Password -Sql $InsertSql
  $newId = Invoke-MariaScalar -Password $Password -Sql $ReloadSql
  if (-not $newId) {
    throw "Failed to create or resolve $Table."
  }

  return [int]$newId
}

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envMap = Parse-EnvFile -Path (Join-Path $root ".env")
$rootPassword = $envMap["POSTGRES_ROOT_PASSWORD"]

if (-not $rootPassword) {
  throw "POSTGRES_ROOT_PASSWORD is missing from .env"
}

$operatorEmail = "wiktormyszor@proton.me"
$today = Get-Date -Format "yyyy-MM-dd"
$outputDir = Join-Path $root "output\snipeit-bootstrap"
$outputPath = Join-Path $outputDir "operator-baseline-state.json"

Write-Step "Checking Snipe-IT operator baseline"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$operatorUserId = Invoke-MariaScalar -Password $rootPassword -Sql @"
SELECT id
FROM users
WHERE email = '$(Escape-SqlLiteral $operatorEmail)'
ORDER BY id
LIMIT 1;
"@

if (-not $operatorUserId) {
  $operatorUserId = $null
  Write-Warning "Snipe-IT operator user $operatorEmail was not found. The asset baseline will still be seeded, but created_by will remain null."
}

$locationId = Get-OrCreateId -Password $rootPassword -Table "location" -LookupSql @"
SELECT id
FROM locations
WHERE name = 'Hylono Clinic - Warsaw'
  AND deleted_at IS NULL
ORDER BY id
LIMIT 1;
"@ -InsertSql @"
INSERT INTO locations (name, city, country, address, notes, created_by, created_at, updated_at)
VALUES (
  'Hylono Clinic - Warsaw',
  'Warsaw',
  'PL',
  'Local operator baseline location for the Hylono medtech stack.',
  'Seeded by seed-snipeit-operator-baseline.ps1',
  $(if ($operatorUserId) { $operatorUserId } else { 'NULL' }),
  NOW(),
  NOW()
);
"@ -ReloadSql @"
SELECT id
FROM locations
WHERE name = 'Hylono Clinic - Warsaw'
  AND deleted_at IS NULL
ORDER BY id
LIMIT 1;
"@

$manufacturerId = Get-OrCreateId -Password $rootPassword -Table "manufacturer" -LookupSql @"
SELECT id
FROM manufacturers
WHERE name = 'Hylono Medtech'
  AND deleted_at IS NULL
ORDER BY id
LIMIT 1;
"@ -InsertSql @"
INSERT INTO manufacturers (name, url, notes, created_by, created_at, updated_at)
VALUES (
  'Hylono Medtech',
  'https://hylono.com',
  'Local baseline manufacturer for the HBOT operator inventory.',
  $(if ($operatorUserId) { $operatorUserId } else { 'NULL' }),
  NOW(),
  NOW()
);
"@ -ReloadSql @"
SELECT id
FROM manufacturers
WHERE name = 'Hylono Medtech'
  AND deleted_at IS NULL
ORDER BY id
LIMIT 1;
"@

$categoryId = Get-OrCreateId -Password $rootPassword -Table "category" -LookupSql @"
SELECT id
FROM categories
WHERE name = 'HBOT Equipment'
  AND category_type = 'asset'
  AND deleted_at IS NULL
ORDER BY id
LIMIT 1;
"@ -InsertSql @"
INSERT INTO categories (
  name,
  category_type,
  use_default_eula,
  require_acceptance,
  alert_on_response,
  checkin_email,
  notes,
  created_by,
  created_at,
  updated_at
)
VALUES (
  'HBOT Equipment',
  'asset',
  0,
  0,
  0,
  0,
  'Local medtech operator asset category seeded by seed-snipeit-operator-baseline.ps1',
  $(if ($operatorUserId) { $operatorUserId } else { 'NULL' }),
  NOW(),
  NOW()
);
"@ -ReloadSql @"
SELECT id
FROM categories
WHERE name = 'HBOT Equipment'
  AND category_type = 'asset'
  AND deleted_at IS NULL
ORDER BY id
LIMIT 1;
"@

$modelId = Get-OrCreateId -Password $rootPassword -Table "model" -LookupSql @"
SELECT id
FROM models
WHERE name = 'HBOT Starter System'
  AND deleted_at IS NULL
ORDER BY id
LIMIT 1;
"@ -InsertSql @"
INSERT INTO models (
  name,
  model_number,
  min_amt,
  manufacturer_id,
  category_id,
  require_serial,
  requestable,
  notes,
  created_by,
  created_at,
  updated_at
)
VALUES (
  'HBOT Starter System',
  'HBOT-ST-001',
  1,
  $manufacturerId,
  $categoryId,
  1,
  1,
  'Local HBOT baseline model seeded for operator inventory management.',
  $(if ($operatorUserId) { $operatorUserId } else { 'NULL' }),
  NOW(),
  NOW()
);
"@ -ReloadSql @"
SELECT id
FROM models
WHERE name = 'HBOT Starter System'
  AND deleted_at IS NULL
ORDER BY id
LIMIT 1;
"@

$statusId = Invoke-MariaScalar -Password $rootPassword -Sql @"
SELECT id
FROM status_labels
WHERE name = 'Ready to Deploy'
  AND deleted_at IS NULL
ORDER BY id
LIMIT 1;
"@

if (-not $statusId) {
  throw "Snipe-IT status label 'Ready to Deploy' was not found."
}

$assetTag = "HBOT-001"
$serial = "HYL-HBOT-001"
$assetId = Invoke-MariaScalar -Password $rootPassword -Sql @"
SELECT id
FROM assets
WHERE asset_tag = '$(Escape-SqlLiteral $assetTag)'
   OR serial = '$(Escape-SqlLiteral $serial)'
ORDER BY id
LIMIT 1;
"@

if (-not $assetId) {
  Invoke-MariaSql -Password $rootPassword -Sql @"
INSERT INTO assets (
  name,
  asset_tag,
  model_id,
  serial,
  purchase_date,
  purchase_cost,
  notes,
  created_by,
  created_at,
  updated_at,
  physical,
  status_id,
  requestable,
  archived,
  rtd_location_id,
  location_id,
  company_id,
  depreciate,
  eol_explicit
)
VALUES (
  'HBOT Starter Unit',
  '$(Escape-SqlLiteral $assetTag)',
  $modelId,
  '$(Escape-SqlLiteral $serial)',
  '$today',
  NULL,
  'Seeded local operator asset baseline for the Hylono medtech stack.',
  $(if ($operatorUserId) { $operatorUserId } else { 'NULL' }),
  NOW(),
  NOW(),
  1,
  $statusId,
  1,
  0,
  $locationId,
  $locationId,
  NULL,
  0,
  0
);
"@
  $assetId = Invoke-MariaScalar -Password $rootPassword -Sql @"
SELECT id
FROM assets
WHERE asset_tag = '$(Escape-SqlLiteral $assetTag)'
   OR serial = '$(Escape-SqlLiteral $serial)'
ORDER BY id
LIMIT 1;
"@
  Write-Host "Created Snipe-IT baseline asset." -ForegroundColor Green
} else {
  Write-Host "Snipe-IT baseline asset already exists." -ForegroundColor Green
}

Invoke-MariaSql -Password $rootPassword -Sql @"
UPDATE locations
SET city = 'Warsaw',
    country = 'PL',
    address = 'Local operator baseline location for the Hylono medtech stack.',
    notes = 'Seeded by seed-snipeit-operator-baseline.ps1',
    updated_at = NOW()
WHERE id = $locationId;

UPDATE manufacturers
SET url = 'https://hylono.com',
    notes = 'Local baseline manufacturer for the HBOT operator inventory.',
    updated_at = NOW()
WHERE id = $manufacturerId;

UPDATE categories
SET category_type = 'asset',
    use_default_eula = 0,
    require_acceptance = 0,
    alert_on_response = 0,
    checkin_email = 0,
    notes = 'Local medtech operator asset category seeded by seed-snipeit-operator-baseline.ps1',
    updated_at = NOW()
WHERE id = $categoryId;

UPDATE models
SET model_number = 'HBOT-ST-001',
    min_amt = 1,
    manufacturer_id = $manufacturerId,
    category_id = $categoryId,
    require_serial = 1,
    requestable = 1,
    notes = 'Local HBOT baseline model seeded for operator inventory management.',
    updated_at = NOW()
WHERE id = $modelId;

UPDATE assets
SET name = 'HBOT Starter Unit',
    asset_tag = '$(Escape-SqlLiteral $assetTag)',
    model_id = $modelId,
    serial = '$(Escape-SqlLiteral $serial)',
    purchase_date = '$today',
    notes = 'Seeded local operator asset baseline for the Hylono medtech stack.',
    physical = 1,
    status_id = $statusId,
    requestable = 1,
    archived = 0,
    rtd_location_id = $locationId,
    location_id = $locationId,
    depreciate = 0,
    eol_explicit = 0,
    updated_at = NOW()
WHERE id = $assetId;
"@

$locationCount = [int](Invoke-MariaScalar -Password $rootPassword -Sql "SELECT COUNT(*) FROM locations WHERE deleted_at IS NULL;")
$manufacturerCount = [int](Invoke-MariaScalar -Password $rootPassword -Sql "SELECT COUNT(*) FROM manufacturers WHERE deleted_at IS NULL;")
$categoryCount = [int](Invoke-MariaScalar -Password $rootPassword -Sql "SELECT COUNT(*) FROM categories WHERE deleted_at IS NULL;")
$modelCount = [int](Invoke-MariaScalar -Password $rootPassword -Sql "SELECT COUNT(*) FROM models WHERE deleted_at IS NULL;")
$assetCount = [int](Invoke-MariaScalar -Password $rootPassword -Sql "SELECT COUNT(*) FROM assets WHERE deleted_at IS NULL;")

$state = [ordered]@{
  generatedAt = (Get-Date).ToString("o")
  operatorEmail = $operatorEmail
  location = @{
    id = $locationId
    name = "Hylono Clinic - Warsaw"
  }
  manufacturer = @{
    id = $manufacturerId
    name = "Hylono Medtech"
  }
  category = @{
    id = $categoryId
    name = "HBOT Equipment"
  }
  model = @{
    id = $modelId
    name = "HBOT Starter System"
  }
  asset = @{
    id = $assetId
    tag = $assetTag
    serial = $serial
    statusId = $statusId
  }
  counts = @{
    locations = $locationCount
    manufacturers = $manufacturerCount
    categories = $categoryCount
    models = $modelCount
    assets = $assetCount
  }
}

$state | ConvertTo-Json -Depth 8 | Set-Content -Path $outputPath -Encoding UTF8

Write-Host "Snipe-IT operator baseline seeded." -ForegroundColor Green
Write-Host ("Output state: {0}" -f $outputPath) -ForegroundColor Green
Write-Host ("Locations: {0}" -f $locationCount) -ForegroundColor Green
Write-Host ("Manufacturers: {0}" -f $manufacturerCount) -ForegroundColor Green
Write-Host ("Categories: {0}" -f $categoryCount) -ForegroundColor Green
Write-Host ("Models: {0}" -f $modelCount) -ForegroundColor Green
Write-Host ("Assets: {0}" -f $assetCount) -ForegroundColor Green
