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

function Invoke-PostgresSql {
  param(
    [Parameter(Mandatory = $true)][string]$Database,
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $Sql | docker exec -i hylono-postgres psql -v ON_ERROR_STOP=1 -U postgres -d $Database | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "PostgreSQL command failed for $Database."
  }
}

function Invoke-PostgresScalar {
  param(
    [Parameter(Mandatory = $true)][string]$Database,
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $output = $Sql | docker exec -i hylono-postgres psql -v ON_ERROR_STOP=1 -U postgres -d $Database -t -A
  if ($LASTEXITCODE -ne 0) {
    throw "PostgreSQL query failed for $Database."
  }
  return ($output | Out-String).Trim()
}

function Invoke-MariaSql {
  param(
    [Parameter(Mandatory = $true)][string]$Password,
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $Sql | docker exec -i hylono-snipe-it-db mariadb -usnipeit "-p$Password" snipeit_db | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "MariaDB command failed for Snipe-IT."
  }
}

function Invoke-MariaScalar {
  param(
    [Parameter(Mandatory = $true)][string]$Password,
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $output = $Sql | docker exec -i hylono-snipe-it-db mariadb -N -B -usnipeit "-p$Password" snipeit_db
  if ($LASTEXITCODE -ne 0) {
    throw "MariaDB query failed for Snipe-IT."
  }
  return ($output | Out-String).Trim()
}

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envMap = Parse-EnvFile -Path (Join-Path $root ".env")
$snipeDbPassword = $envMap["SNIPEIT_DB_PASSWORD"]

if (-not $snipeDbPassword) {
  throw "SNIPEIT_DB_PASSWORD is missing from .env"
}

$operator = @{
  Email = "wiktormyszor@proton.me"
  FirstName = "Wiktor"
  LastName = "Myszor"
  SnipeUsername = "Koniorek"
  LagoPassword = "HylonoLagoAdmin123!"
  LagoPasswordHash = '$2a$12$Qa584RsNhCZTTDp1ypTdbeheRO.77DFgxRVOfFmSQ9XdTW8w2oYGq'
  DocumensoPassword = "HylonoDocAdmin123!"
  DocumensoPasswordHash = '$2a$12$7Vf8M7czoPcT35dauXGVReBNpWLx0BAa15dN9p2wb7uVNcoR6uks2'
  CalPassword = "HylonoCalAdmin123!"
  CalPasswordHash = '$2a$12$XhLESKS3cgY6MPG9gmQX..gaoMFzzb1RLsWI/HQylRBAWcgm07BDm'
  SnipePassword = "HylonoSnipe123!"
  SnipePasswordHash = '$2y$10$oSLMNEa2j7b03xnQvictn.qM9hv7kzaL8PnHgYKf9Y1jukWaqZ7.a'
}

Write-Step "Reasserting Phase 1A operator logins"

$lagoExists = Invoke-PostgresScalar -Database "lago_db" -Sql @"
SELECT COUNT(*) FROM users WHERE email = '$($operator.Email)';
"@

if ($lagoExists -eq "1") {
  Invoke-PostgresSql -Database "lago_db" -Sql @"
UPDATE users
SET password_digest = '$($operator.LagoPasswordHash)',
    updated_at = NOW()
WHERE email = '$($operator.Email)';
"@
  Write-Host "OK  Lago operator password reasserted." -ForegroundColor Green
} else {
  Write-Warning "Lago user $($operator.Email) was not found. Create the account once in the UI, then rerun this script."
}

$documensoExists = Invoke-PostgresScalar -Database "documenso_db" -Sql @"
SELECT COUNT(*) FROM "User" WHERE email = '$($operator.Email)';
"@

if ($documensoExists -eq "1") {
  Invoke-PostgresSql -Database "documenso_db" -Sql @"
UPDATE "User"
SET password = '$($operator.DocumensoPasswordHash)',
    "emailVerified" = COALESCE("emailVerified", NOW()),
    "updatedAt" = NOW()
WHERE email = '$($operator.Email)';
"@
  Write-Host "OK  Documenso operator password and verification reasserted." -ForegroundColor Green
} else {
  Write-Warning "Documenso user $($operator.Email) was not found. Create the account once in the UI, then rerun this script."
}

$calcomExists = Invoke-PostgresScalar -Database "calcom_db" -Sql @"
SELECT COUNT(*) FROM users WHERE email = '$($operator.Email)';
"@

if ($calcomExists -eq "1") {
  Invoke-PostgresSql -Database "calcom_db" -Sql @"
INSERT INTO "UserPassword" ("userId", hash)
SELECT id, '$($operator.CalPasswordHash)'
FROM users
WHERE email = '$($operator.Email)'
ON CONFLICT ("userId") DO UPDATE
SET hash = EXCLUDED.hash;
"@
  Write-Host "OK  Cal.com operator password reasserted." -ForegroundColor Green
} else {
  Write-Warning "Cal.com user $($operator.Email) was not found. Create the account once in the UI, then rerun this script."
}

$snipeExists = Invoke-MariaScalar -Password $snipeDbPassword -Sql @"
SELECT COUNT(*) FROM users WHERE email = '$($operator.Email)' OR username = '$($operator.SnipeUsername)';
"@

if ($snipeExists -eq "0") {
  & docker exec hylono-snipe-it php artisan snipeit:create-admin `
    --first_name="$($operator.FirstName)" `
    --last_name="$($operator.LastName)" `
    --email="$($operator.Email)" `
    --username="$($operator.SnipeUsername)" `
    --password="$($operator.SnipePassword)" `
    --no-interaction `
    --silent

  if ($LASTEXITCODE -ne 0) {
    throw "Failed to create the Snipe-IT admin user."
  }
}

Invoke-MariaSql -Password $snipeDbPassword -Sql @"
UPDATE users
SET email = '$($operator.Email)',
    username = '$($operator.SnipeUsername)',
    first_name = '$($operator.FirstName)',
    last_name = '$($operator.LastName)',
    activated = 1,
    password = '$($operator.SnipePasswordHash)'
WHERE email = '$($operator.Email)' OR username = '$($operator.SnipeUsername)';
"@

Write-Host "OK  Snipe-IT operator password reasserted." -ForegroundColor Green
Write-Host ""
Write-Host "Phase 1A operator login seeding complete." -ForegroundColor Green
