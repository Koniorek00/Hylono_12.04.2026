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

function Invoke-MariaRootSql {
  param(
    [string]$Database = "snipeit_db",
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $Sql | docker exec -i hylono-snipe-it-db mariadb --user=root $Database | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "MariaDB command failed for Snipe-IT."
  }
}

function Invoke-MariaRootScalar {
  param(
    [string]$Database = "snipeit_db",
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $output = $Sql | docker exec -i hylono-snipe-it-db mariadb -N -B --user=root $Database
  if ($LASTEXITCODE -ne 0) {
    throw "MariaDB query failed for Snipe-IT."
  }
  return ($output | Out-String).Trim()
}

function Ensure-SnipeItDbUser {
  param([Parameter(Mandatory = $true)][string]$Password)

  $escapedPassword = $Password.Replace("'", "''")
  Invoke-MariaRootSql -Database "mysql" -Sql @"
CREATE DATABASE IF NOT EXISTS snipeit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'snipeit'@'%' IDENTIFIED BY '$escapedPassword';
CREATE USER IF NOT EXISTS 'snipeit'@'localhost' IDENTIFIED BY '$escapedPassword';
GRANT ALL PRIVILEGES ON snipeit_db.* TO 'snipeit'@'%';
GRANT ALL PRIVILEGES ON snipeit_db.* TO 'snipeit'@'localhost';
FLUSH PRIVILEGES;
"@
}

function Ensure-SnipeItSchema {
  $migrationsTableExists = Invoke-MariaRootScalar -Database "mysql" -Sql @"
SELECT COUNT(*)
FROM information_schema.tables
WHERE table_schema = 'snipeit_db'
  AND table_name = 'migrations';
"@

  if ($migrationsTableExists -ne "0") {
    return
  }

  Write-Step "Initializing Snipe-IT database schema"
  & docker exec hylono-snipe-it php artisan migrate --force
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to initialize the Snipe-IT database schema."
  }
}

function Ensure-LagoBootstrap {
  param(
    [Parameter(Mandatory = $true)][string]$Email,
    [Parameter(Mandatory = $true)][string]$Password,
    [Parameter(Mandatory = $true)][string]$OrganizationName
  )

  $userExists = Invoke-PostgresScalar -Database "lago_db" -Sql @"
SELECT COUNT(*) FROM users WHERE email = '$Email';
"@
  $apiKeyExists = Invoke-PostgresScalar -Database "lago_db" -Sql @"
SELECT COUNT(*) FROM api_keys;
"@

  if ($userExists -ne "0" -and $apiKeyExists -ne "0") {
    return
  }

  Write-Host "Bootstrapping Lago organization, operator user, and API key." -ForegroundColor Yellow
  & docker exec `
    -e LAGO_CREATE_ORG=true `
    -e LAGO_ORG_USER_EMAIL=$Email `
    -e LAGO_ORG_USER_PASSWORD=$Password `
    -e LAGO_ORG_NAME=$OrganizationName `
    hylono-lago-api `
    bundle exec rake signup:seed_organization

  if ($LASTEXITCODE -ne 0) {
    throw "Failed to bootstrap the initial Lago organization and operator account."
  }
}

function Ensure-DocumensoBootstrap {
  param(
    [Parameter(Mandatory = $true)][string]$Email,
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$PasswordHash
  )

  Invoke-PostgresSql -Database "documenso_db" -Sql @"
WITH existing_user AS (
  SELECT id
  FROM "User"
  WHERE email = '$Email'
  LIMIT 1
),
inserted_user AS (
  INSERT INTO "User" (
    name,
    email,
    "emailVerified",
    password,
    source,
    roles,
    "updatedAt",
    "lastSignedIn",
    disabled
  )
  SELECT
    '$Name',
    '$Email',
    NOW(),
    '$PasswordHash',
    'local-bootstrap',
    ARRAY['ADMIN'::"Role"],
    NOW(),
    NOW(),
    false
  WHERE NOT EXISTS (SELECT 1 FROM existing_user)
  RETURNING id
),
resolved_user AS (
  SELECT id FROM inserted_user
  UNION ALL
  SELECT id FROM existing_user
),
existing_org AS (
  SELECT id
  FROM "Organisation"
  WHERE "ownerUserId" = (SELECT id FROM resolved_user LIMIT 1)
  LIMIT 1
),
inserted_claim AS (
  INSERT INTO "OrganisationClaim" (
    id,
    "updatedAt",
    "teamCount",
    "memberCount",
    flags,
    "envelopeItemCount"
  )
  SELECT
    md5(random()::text || clock_timestamp()::text),
    NOW(),
    1,
    1,
    '{}'::jsonb,
    0
  WHERE NOT EXISTS (SELECT 1 FROM existing_org)
  RETURNING id
),
inserted_org_settings AS (
  INSERT INTO "OrganisationGlobalSettings" (
    id,
    "emailDocumentSettings"
  )
  SELECT
    md5(random()::text || clock_timestamp()::text),
    '{}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM existing_org)
  RETURNING id
),
inserted_auth_portal AS (
  INSERT INTO "OrganisationAuthenticationPortal" (
    id,
    enabled,
    "clientId",
    "clientSecret",
    "wellKnownUrl",
    "defaultOrganisationRole",
    "autoProvisionUsers",
    "allowedDomains"
  )
  SELECT
    md5(random()::text || clock_timestamp()::text),
    false,
    '',
    '',
    '',
    'ADMIN'::"OrganisationMemberRole",
    true,
    ARRAY[]::text[]
  WHERE NOT EXISTS (SELECT 1 FROM existing_org)
  RETURNING id
),
inserted_org AS (
  INSERT INTO "Organisation" (
    id,
    "updatedAt",
    type,
    name,
    url,
    "ownerUserId",
    "organisationClaimId",
    "organisationGlobalSettingsId",
    "organisationAuthenticationPortalId"
  )
  SELECT
    md5(random()::text || clock_timestamp()::text),
    NOW(),
    'ORGANISATION'::"OrganisationType",
    'Hylono Local',
    'hylono-local',
    (SELECT id FROM resolved_user LIMIT 1),
    (SELECT id FROM inserted_claim LIMIT 1),
    (SELECT id FROM inserted_org_settings LIMIT 1),
    (SELECT id FROM inserted_auth_portal LIMIT 1)
  WHERE NOT EXISTS (SELECT 1 FROM existing_org)
  RETURNING id
),
resolved_org AS (
  SELECT id FROM inserted_org
  UNION ALL
  SELECT id FROM existing_org
),
inserted_org_member AS (
  INSERT INTO "OrganisationMember" (
    id,
    "updatedAt",
    "userId",
    "organisationId"
  )
  SELECT
    md5(random()::text || clock_timestamp()::text),
    NOW(),
    (SELECT id FROM resolved_user LIMIT 1),
    (SELECT id FROM resolved_org LIMIT 1)
  WHERE NOT EXISTS (
    SELECT 1
    FROM "OrganisationMember"
    WHERE "userId" = (SELECT id FROM resolved_user LIMIT 1)
      AND "organisationId" = (SELECT id FROM resolved_org LIMIT 1)
  )
  RETURNING id
),
existing_team AS (
  SELECT id
  FROM "Team"
  WHERE "organisationId" = (SELECT id FROM resolved_org LIMIT 1)
  LIMIT 1
),
inserted_team_settings AS (
  INSERT INTO "TeamGlobalSettings" (
    id,
    "emailDocumentSettings"
  )
  SELECT
    md5(random()::text || clock_timestamp()::text),
    '{}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM existing_team)
  RETURNING id
),
inserted_team AS (
  INSERT INTO "Team" (
    name,
    url,
    "organisationId",
    "teamGlobalSettingsId"
  )
  SELECT
    'Hylono Operations',
    'hylono-operations',
    (SELECT id FROM resolved_org LIMIT 1),
    (SELECT id FROM inserted_team_settings LIMIT 1)
  WHERE NOT EXISTS (SELECT 1 FROM existing_team)
  RETURNING id
),
resolved_team AS (
  SELECT id FROM inserted_team
  UNION ALL
  SELECT id FROM existing_team
)
INSERT INTO "TeamProfile" (
  id,
  enabled,
  "teamId",
  bio
)
SELECT
  md5(random()::text || clock_timestamp()::text),
  true,
  (SELECT id FROM resolved_team LIMIT 1),
  'Local Documenso operator workspace'
WHERE NOT EXISTS (
  SELECT 1
  FROM "TeamProfile"
  WHERE "teamId" = (SELECT id FROM resolved_team LIMIT 1)
);
"@
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
  LagoOrganization = "Hylono Local"
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

Ensure-LagoBootstrap -Email $operator.Email -Password $operator.LagoPassword -OrganizationName $operator.LagoOrganization

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
  throw "Lago operator user $($operator.Email) is still missing after bootstrap."
}

$documensoExists = Invoke-PostgresScalar -Database "documenso_db" -Sql @"
SELECT COUNT(*) FROM "User" WHERE email = '$($operator.Email)';
"@

if ($documensoExists -eq "0") {
  Ensure-DocumensoBootstrap `
    -Email $operator.Email `
    -Name "$($operator.FirstName) $($operator.LastName)" `
    -PasswordHash $operator.DocumensoPasswordHash

  $documensoExists = Invoke-PostgresScalar -Database "documenso_db" -Sql @"
SELECT COUNT(*) FROM "User" WHERE email = '$($operator.Email)';
"@
}

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

Ensure-SnipeItDbUser -Password $snipeDbPassword
Ensure-SnipeItSchema

$snipeExists = Invoke-MariaRootScalar -Sql @"
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

Invoke-MariaRootSql -Sql @"
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
