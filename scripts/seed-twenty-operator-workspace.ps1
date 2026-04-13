param(
  [string]$SeedPath,
  [switch]$ValidateOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
  $PSNativeCommandUseErrorActionPreference = $false
}

if (-not $PSBoundParameters.ContainsKey("SeedPath")) {
  $SeedPath = Join-Path $PSScriptRoot "data\twenty-operator-workspace.seed.json"
}

$script:TwentyListLimit = 2000
$script:TwentyPageSize = 50
$script:TwentyWorkspaceSchema = $null

function Parse-EnvFile {
  param([Parameter(Mandatory = $true)][string]$Path)

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

function Merge-EnvMaps {
  param(
    [Parameter(Mandatory = $true)][hashtable]$Base,
    [Parameter(Mandatory = $true)][hashtable]$Overrides
  )

  foreach ($key in $Overrides.Keys) {
    $Base[$key] = $Overrides[$key]
  }

  return $Base
}

function Set-EnvValue {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$Value
  )

  $lines = if (Test-Path $Path) { @(Get-Content -Path $Path) } else { @() }
  $pattern = "^\s*$([regex]::Escape($Name))="
  $updated = $false

  for ($index = 0; $index -lt $lines.Count; $index++) {
    if ($lines[$index] -match $pattern) {
      $lines[$index] = "$Name=$Value"
      $updated = $true
      break
    }
  }

  if (-not $updated) {
    if ($lines.Count -gt 0 -and -not [string]::IsNullOrWhiteSpace($lines[-1])) {
      $lines += ""
    }

    $lines += "$Name=$Value"
  }

  Set-Content -Path $Path -Value $lines
}

function Get-TwentySeedState {
  param([Parameter(Mandatory = $true)][string]$Path)

  $emptyState = [pscustomobject]@{
    Companies = @{}
    People = @{}
    Opportunities = @{}
    Tasks = @{}
  }

  if (-not (Test-Path $Path)) {
    return $emptyState
  }

  try {
    $state = Get-Content -Raw -Path $Path | ConvertFrom-Json
  } catch {
    Write-Warning "Ignoring invalid Twenty state file at $Path. $($_.Exception.Message)"
    return $emptyState
  }

  $companies = @{}
  $people = @{}
  $opportunities = @{}
  $tasks = @{}

  if ($state.PSObject.Properties["companies"]) {
    foreach ($property in @($state.companies.PSObject.Properties)) {
      $companies[$property.Name] = [string]$property.Value
    }
  }

  if ($state.PSObject.Properties["people"]) {
    foreach ($property in @($state.people.PSObject.Properties)) {
      $people[$property.Name] = [string]$property.Value
    }
  }

  if ($state.PSObject.Properties["opportunities"]) {
    foreach ($property in @($state.opportunities.PSObject.Properties)) {
      $opportunities[$property.Name] = [string]$property.Value
    }
  }

  if ($state.PSObject.Properties["tasks"]) {
    foreach ($property in @($state.tasks.PSObject.Properties)) {
      $tasks[$property.Name] = [string]$property.Value
    }
  }

  return [pscustomobject]@{
    Companies = $companies
    People = $people
    Opportunities = $opportunities
    Tasks = $tasks
  }
}

function Save-TwentySeedState {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][object]$SeedArtifact,
    [Parameter(Mandatory = $true)][hashtable]$CompanyIds,
    [Parameter(Mandatory = $true)][hashtable]$PersonIds,
    [Parameter(Mandatory = $true)][hashtable]$OpportunityIds,
    [Parameter(Mandatory = $true)][hashtable]$TaskIds
  )

  $directory = Split-Path -Parent $Path
  if (-not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  $payload = [ordered]@{
    seedVersion = [string]$SeedArtifact.seedVersion
    seedName = [string]$SeedArtifact.seedName
    updatedAt = (Get-Date).ToUniversalTime().ToString("o")
    companies = [ordered]@{}
    people = [ordered]@{}
    opportunities = [ordered]@{}
    tasks = [ordered]@{}
  }

  foreach ($key in ($CompanyIds.Keys | Sort-Object)) {
    if (-not [string]::IsNullOrWhiteSpace([string]$CompanyIds[$key])) {
      $payload.companies[$key] = $CompanyIds[$key]
    }
  }

  foreach ($key in ($PersonIds.Keys | Sort-Object)) {
    if (-not [string]::IsNullOrWhiteSpace([string]$PersonIds[$key])) {
      $payload.people[$key] = $PersonIds[$key]
    }
  }

  foreach ($key in ($OpportunityIds.Keys | Sort-Object)) {
    if (-not [string]::IsNullOrWhiteSpace([string]$OpportunityIds[$key])) {
      $payload.opportunities[$key] = $OpportunityIds[$key]
    }
  }

  foreach ($key in ($TaskIds.Keys | Sort-Object)) {
    if (-not [string]::IsNullOrWhiteSpace([string]$TaskIds[$key])) {
      $payload.tasks[$key] = $TaskIds[$key]
    }
  }

  $payload | ConvertTo-Json -Depth 10 | Set-Content -Path $Path
}

function Invoke-TwentyDbScalar {
  param([Parameter(Mandatory = $true)][string]$Sql)

  $output = $Sql | docker exec -i hylono-postgres psql -U postgres -d twenty_db -At -f -
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to query the Twenty database."
  }

  return (($output | Select-Object -First 1) | Out-String).Trim()
}

function Escape-SqlLiteral {
  param([AllowNull()][string]$Value)

  if ($null -eq $Value) {
    return ""
  }

  return $Value.Replace("'", "''")
}

function Get-TwentyBootstrapState {
  $workspaceCount = [int](Invoke-TwentyDbScalar -Sql @'
select count(*) from core.workspace;
'@)
  $apiKeyCount = [int](Invoke-TwentyDbScalar -Sql @'
select count(*)
from core."apiKey"
where "revokedAt" is null;
'@)
  $workspaceId = Invoke-TwentyDbScalar -Sql @'
select coalesce(
  (
    select "workspaceId"::text
    from core."apiKey"
    where "revokedAt" is null
    order by "createdAt" desc
    limit 1
  ),
  (
    select id::text
    from core.workspace
    where "activationStatus" = 'ACTIVE'
    order by
      case when "displayName" = 'Apple' then 0 else 1 end,
      "createdAt" asc
    limit 1
  ),
  ''
);
'@

  return [pscustomobject]@{
    WorkspaceCount = $workspaceCount
    ApiKeyCount = $apiKeyCount
    WorkspaceId = $workspaceId
  }
}

function Invoke-TwentyCli {
  param([Parameter(Mandatory = $true)][string]$Command)

  $stdoutFile = [System.IO.Path]::GetTempFileName()
  $stderrFile = [System.IO.Path]::GetTempFileName()
  $dockerArguments = @(
    "exec",
    "hylono-twenty",
    "sh",
    "-lc",
    "cd /app/packages/twenty-server && NODE_ENV=development yarn command:prod $Command"
  )
  $argumentString = (
    $dockerArguments | ForEach-Object {
      if ($_ -match '[\s"]') {
        '"' + ($_ -replace '"', '\"') + '"'
      } else {
        $_
      }
    }
  ) -join " "

  try {
    $process = Start-Process -FilePath "docker.exe" -ArgumentList $argumentString -NoNewWindow -Wait -PassThru -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile
    $stdout = if (Test-Path $stdoutFile) { @(Get-Content $stdoutFile) } else { @() }
    $stderr = if (Test-Path $stderrFile) { @(Get-Content $stderrFile) } else { @() }
    $combinedOutput = @($stdout + $stderr) | Where-Object { $_ -ne $null }

    if ($process.ExitCode -ne 0) {
      $renderedOutput = ($combinedOutput | Out-String).Trim()
      if ($renderedOutput) {
        throw "Twenty CLI command failed: $Command`n$renderedOutput"
      }

      throw "Twenty CLI command failed: $Command"
    }

    return $combinedOutput
  } finally {
    Remove-Item $stdoutFile, $stderrFile -Force -ErrorAction SilentlyContinue
  }
}

function Ensure-TwentyWorkspaceState {
  $state = Get-TwentyBootstrapState
  if ($state.WorkspaceCount -gt 0 -and -not [string]::IsNullOrWhiteSpace($state.WorkspaceId)) {
    return $state
  }

  Write-Host "Twenty workspace state is empty. Running built-in dev bootstrap..." -ForegroundColor Yellow
  $null = Invoke-TwentyCli -Command "workspace:seed:dev"

  $state = Get-TwentyBootstrapState
  if ($state.WorkspaceCount -le 0 -or [string]::IsNullOrWhiteSpace($state.WorkspaceId)) {
    throw "Twenty dev bootstrap completed, but no active workspace is available for local seeding."
  }

  return $state
}

function Get-TwentyWorkspaceSchema {
  if ($script:TwentyWorkspaceSchema) {
    return $script:TwentyWorkspaceSchema
  }

  $state = Ensure-TwentyWorkspaceState
  $workspaceId = Escape-SqlLiteral -Value $state.WorkspaceId
  $schema = Invoke-TwentyDbScalar -Sql @"
select schema
from core."dataSource"
where "workspaceId" = '$workspaceId'
order by schema asc
limit 1;
"@

  if ([string]::IsNullOrWhiteSpace($schema)) {
    throw "Could not resolve the active Twenty workspace schema for workspace $($state.WorkspaceId)."
  }

  $script:TwentyWorkspaceSchema = $schema
  return $schema
}

function Find-TwentyRecordIdInWorkspaceSchema {
  param(
    [Parameter(Mandatory = $true)][string]$TableName,
    [Parameter(Mandatory = $true)][string]$ColumnName,
    [Parameter(Mandatory = $true)][string]$Value
  )

  $schema = Get-TwentyWorkspaceSchema
  $escapedValue = Escape-SqlLiteral -Value $Value

  return Invoke-TwentyDbScalar -Sql @"
select id::text
from "$schema"."$TableName"
where "$ColumnName" = '$escapedValue'
order by "createdAt" asc
limit 1;
"@
}

function New-TwentyApiKey {
  param([Parameter(Mandatory = $true)][string]$WorkspaceId)

  $output = Invoke-TwentyCli -Command "workspace:generate-api-key --workspace-id $WorkspaceId"
  $tokenLine = $output | Where-Object { $_ -match 'TOKEN:(.+)$' } | Select-Object -Last 1
  if (-not $tokenLine) {
    throw "Twenty generated an API key, but the token was not present in the command output."
  }

  $token = ([string]$tokenLine) -replace '.*TOKEN:', ''
  $token = $token.Trim()
  if ([string]::IsNullOrWhiteSpace($token)) {
    throw "Twenty generated an API key, but the token was blank."
  }

  return $token
}

function Test-TwentyApiAccess {
  param([AllowNull()][AllowEmptyString()][string]$ApiKey)

  if ([string]::IsNullOrWhiteSpace($ApiKey)) {
    return $false
  }

  try {
    $null = Invoke-RestMethod -Method GET -Uri "$script:TwentyBaseUrl/rest/people?limit=1" -Headers @{
      Authorization = "Bearer $ApiKey"
    } -TimeoutSec 20
    return $true
  } catch {
    $message = $_.ToString()
    if ($message -match '"statusCode":429' -or $message -match "Limit reached") {
      return $true
    }

    return $false
  }
}

function Ensure-TwentyApiKey {
  param(
    [Parameter(Mandatory = $true)][hashtable]$EnvMap,
    [Parameter(Mandatory = $true)][string]$EnvLocalPath
  )

  $currentApiKey = $EnvMap["TWENTY_API_KEY"]
  if (Test-TwentyApiAccess -ApiKey $currentApiKey) {
    return $currentApiKey
  }

  if ($currentApiKey) {
    Write-Host "Existing Twenty API key is stale. Regenerating a local token..." -ForegroundColor Yellow
  } else {
    Write-Host "TWENTY_API_KEY is missing. Generating a local token..." -ForegroundColor Yellow
  }

  $state = Ensure-TwentyWorkspaceState
  if ($state.ApiKeyCount -le 0) {
    Write-Host "Twenty has no active API keys yet. Creating the first local API key..." -ForegroundColor Yellow
  }

  $freshApiKey = New-TwentyApiKey -WorkspaceId $state.WorkspaceId
  Set-EnvValue -Path $EnvLocalPath -Name "TWENTY_API_BASE_URL" -Value $script:TwentyBaseUrl
  Set-EnvValue -Path $EnvLocalPath -Name "TWENTY_API_KEY" -Value $freshApiKey
  $EnvMap["TWENTY_API_BASE_URL"] = $script:TwentyBaseUrl
  $EnvMap["TWENTY_API_KEY"] = $freshApiKey

  if (-not (Test-TwentyApiAccess -ApiKey $freshApiKey)) {
    throw "Generated a new Twenty API key, but the local REST API still rejected it."
  }

  Write-Host "Refreshed TWENTY_API_KEY in .env.local from the running Twenty workspace." -ForegroundColor Green
  return $freshApiKey
}

function Get-SeedArtifact {
  param([Parameter(Mandatory = $true)][string]$Path)

  if (-not (Test-Path $Path)) {
    throw "Twenty seed artifact not found: $Path"
  }

  $raw = Get-Content -Raw -Path $Path
  try {
    return $raw | ConvertFrom-Json
  } catch {
    throw "Failed to parse Twenty seed artifact at $Path. $($_.Exception.Message)"
  }
}

function Get-SeedArray {
  param(
    [Parameter(Mandatory = $true)][object]$SeedArtifact,
    [Parameter(Mandatory = $true)][string]$PropertyName
  )

  $property = $SeedArtifact.PSObject.Properties[$PropertyName]
  if ($null -eq $property -or $null -eq $property.Value) {
    return @()
  }

  return @($property.Value)
}

function Assert-NotBlank {
  param(
    [AllowNull()][AllowEmptyString()][string]$Value,
    [Parameter(Mandatory = $true)][string]$Description
  )

  if ([string]::IsNullOrWhiteSpace($Value)) {
    throw "$Description must not be empty."
  }
}

function Assert-UniqueProperty {
  param(
    [Parameter(Mandatory = $true)][object[]]$Items,
    [Parameter(Mandatory = $true)][string]$PropertyName,
    [Parameter(Mandatory = $true)][string]$Description
  )

  $seen = @{}
  foreach ($item in $Items) {
    $value = [string]$item.$PropertyName
    Assert-NotBlank -Value $value -Description "$Description $PropertyName"
    $normalized = $value.Trim().ToLowerInvariant()
    if ($seen.ContainsKey($normalized)) {
      throw "Duplicate $Description $PropertyName '$value' found in Twenty seed artifact."
    }

    $seen[$normalized] = $true
  }
}

function Assert-ReferenceExists {
  param(
    [AllowNull()][AllowEmptyString()][string]$Reference,
    [Parameter(Mandatory = $true)][hashtable]$KnownKeys,
    [Parameter(Mandatory = $true)][string]$Description
  )

  if ([string]::IsNullOrWhiteSpace($Reference)) {
    return
  }

  if (-not $KnownKeys.ContainsKey($Reference)) {
    throw "$Description reference '$Reference' was not found in Twenty seed artifact."
  }
}

function Assert-SeedArtifact {
  param([Parameter(Mandatory = $true)][object]$SeedArtifact)

  Assert-NotBlank -Value ([string]$SeedArtifact.seedVersion) -Description "seedVersion"
  Assert-NotBlank -Value ([string]$SeedArtifact.seedName) -Description "seedName"

  $supportedSources = Get-SeedArray -SeedArtifact $SeedArtifact -PropertyName "supportedSources"
  if ($supportedSources.Count -eq 0) {
    throw "Twenty seed artifact must define at least one supported source."
  }

  $sourceItems = foreach ($source in $supportedSources) {
    [pscustomobject]@{ value = [string]$source }
  }
  Assert-UniqueProperty -Items $sourceItems -PropertyName "value" -Description "supportedSources"

  $queueNames = Get-SeedArray -SeedArtifact $SeedArtifact -PropertyName "queueNames"
  if ($queueNames.Count -eq 0) {
    throw "Twenty seed artifact must define at least one queue name."
  }

  $queueItems = foreach ($queueName in $queueNames) {
    [pscustomobject]@{ value = [string]$queueName }
  }
  Assert-UniqueProperty -Items $queueItems -PropertyName "value" -Description "queueNames"

  $companies = Get-SeedArray -SeedArtifact $SeedArtifact -PropertyName "companies"
  if ($companies.Count -eq 0) {
    throw "Twenty seed artifact must define at least one company."
  }

  Assert-UniqueProperty -Items $companies -PropertyName "key" -Description "company"
  Assert-UniqueProperty -Items $companies -PropertyName "name" -Description "company"

  $companyKeys = @{}
  foreach ($company in $companies) {
    $companyKeys[[string]$company.key] = $true
  }

  $people = Get-SeedArray -SeedArtifact $SeedArtifact -PropertyName "people"
  Assert-UniqueProperty -Items $people -PropertyName "key" -Description "person"
  Assert-UniqueProperty -Items $people -PropertyName "email" -Description "person"

  $personKeys = @{}
  foreach ($person in $people) {
    Assert-NotBlank -Value ([string]$person.firstName) -Description "person firstName"
    Assert-NotBlank -Value ([string]$person.lastName) -Description "person lastName"
    $personKeys[[string]$person.key] = $true
    Assert-ReferenceExists -Reference ([string]$person.companyRef) -KnownKeys $companyKeys -Description "person companyRef"
  }

  $opportunities = Get-SeedArray -SeedArtifact $SeedArtifact -PropertyName "opportunities"
  if ($opportunities.Count -eq 0) {
    throw "Twenty seed artifact must define at least one opportunity."
  }

  Assert-UniqueProperty -Items $opportunities -PropertyName "key" -Description "opportunity"
  Assert-UniqueProperty -Items $opportunities -PropertyName "name" -Description "opportunity"

  $opportunityNames = @{}
  foreach ($opportunity in $opportunities) {
    Assert-NotBlank -Value ([string]$opportunity.currencyCode) -Description "opportunity currencyCode"
    Assert-NotBlank -Value ([string]$opportunity.stage) -Description "opportunity stage"
    if ([long]$opportunity.amountMicros -le 0) {
      throw "Opportunity '$($opportunity.name)' must define amountMicros greater than zero."
    }

    Assert-ReferenceExists -Reference ([string]$opportunity.companyRef) -KnownKeys $companyKeys -Description "opportunity companyRef"
    Assert-ReferenceExists -Reference ([string]$opportunity.pointOfContactRef) -KnownKeys $personKeys -Description "opportunity pointOfContactRef"
    $opportunityNames[[string]$opportunity.name] = $true
  }

  foreach ($queueName in $queueNames) {
    $queueNameString = [string]$queueName
    if (-not $opportunityNames.ContainsKey($queueNameString)) {
      throw "Queue name '$queueNameString' does not match any opportunity name in the Twenty seed artifact."
    }
  }

  $tasks = Get-SeedArray -SeedArtifact $SeedArtifact -PropertyName "tasks"
  if ($tasks.Count -eq 0) {
    throw "Twenty seed artifact must define at least one task."
  }

  Assert-UniqueProperty -Items $tasks -PropertyName "title" -Description "task"
  foreach ($task in $tasks) {
    Assert-NotBlank -Value ([string]$task.bodyText) -Description "task bodyText"
    Assert-NotBlank -Value ([string]$task.status) -Description "task status"
  }
}

function Invoke-TwentyJson {
  param(
    [Parameter(Mandatory = $true)][ValidateSet("GET", "POST", "PATCH")][string]$Method,
    [Parameter(Mandatory = $true)][string]$Path,
    [hashtable]$Headers,
    [object]$Body
  )

  $requestParams = @{
    Method = $Method
    Uri = "$script:TwentyBaseUrl/$Path"
    Headers = $Headers
    TimeoutSec = 30
    ErrorAction = "Stop"
  }

  if ($PSBoundParameters.ContainsKey("Body")) {
    $requestParams["Body"] = ($Body | ConvertTo-Json -Depth 10)
    $requestParams["ContentType"] = "application/json"
  }

  for ($attempt = 1; $attempt -le 4; $attempt++) {
    try {
      return Invoke-RestMethod @requestParams
    } catch {
      $message = $_.ToString()
      $isRateLimited = $message -match '"statusCode":429' -or $message -match "Limit reached"
      if (-not $isRateLimited -or $attempt -eq 4) {
        throw
      }

      Start-Sleep -Seconds ([Math]::Min(12, 2 * $attempt))
    }
  }
}

function Test-TwentyDuplicateError {
  param([Parameter(Mandatory = $true)][System.Management.Automation.ErrorRecord]$ErrorRecord)

  $message = $ErrorRecord.ToString()
  return $message -match "duplicate entry"
}

function Get-TwentyRecordById {
  param(
    [Parameter(Mandatory = $true)][string]$ResourcePath,
    [Parameter(Mandatory = $true)][string]$ResponseKey,
    [AllowNull()][AllowEmptyString()][string]$Id
  )

  if ([string]::IsNullOrWhiteSpace($Id)) {
    return $null
  }

  try {
    $response = Invoke-TwentyJson -Method GET -Path "rest/$ResourcePath/$Id" -Headers $script:TwentyHeaders
  } catch {
    return $null
  }

  return $response.data.$ResponseKey
}

function ConvertTo-BlocknoteDocument {
  param([Parameter(Mandatory = $true)][string]$Text)

  $paragraphs = @()
  foreach ($line in ($Text -split "\r?\n")) {
    $textLine = if ($line.Length -eq 0) { " " } else { $line }
    $paragraphs += @{
      type = "paragraph"
      content = @(
        @{
          type = "text"
          text = $textLine
        }
      )
    }
  }

  if ($paragraphs.Count -eq 0) {
    $paragraphs = @(
      @{
        type = "paragraph"
        content = @(
          @{
            type = "text"
            text = ""
          }
        )
      }
    )
  }

  return (
    @{
      type = "doc"
      content = $paragraphs
    } | ConvertTo-Json -Depth 8 -Compress
  )
}

function Get-FirstMatchingItem {
  param(
    [Parameter(Mandatory = $true)][object[]]$Items,
    [Parameter(Mandatory = $true)][scriptblock]$Predicate
  )

  foreach ($item in $Items) {
    if (& $Predicate $item) {
      return $item
    }
  }

  return $null
}

function Find-TwentyExistingRecord {
  param(
    [Parameter(Mandatory = $true)][string]$ResourcePath,
    [Parameter(Mandatory = $true)][string]$ResponseCollectionKey,
    [Parameter(Mandatory = $true)][scriptblock]$Predicate
  )

  $after = $null

  while ($true) {
    $query = "rest/${ResourcePath}?limit=$($script:TwentyPageSize)"
    if (-not [string]::IsNullOrWhiteSpace($after)) {
      $query = "$query&after=$([uri]::EscapeDataString($after))"
    }

    $response = Invoke-TwentyJson -Method GET -Path $query -Headers $script:TwentyHeaders
    $items = @($response.data.$ResponseCollectionKey)
    $existing = Get-FirstMatchingItem -Items $items -Predicate $Predicate
    if ($existing) {
      return $existing
    }

    if (-not $response.pageInfo.hasNextPage) {
      return $null
    }

    $after = $response.pageInfo.endCursor
    if ([string]::IsNullOrWhiteSpace($after)) {
      return $null
    }
  }
}

function Ensure-Company {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [string]$Domain,
    [string]$KnownId
  )

  $knownRecord = Get-TwentyRecordById -ResourcePath "companies" -ResponseKey "company" -Id $KnownId
  if ($knownRecord -and $knownRecord.name -eq $Name) {
    return $knownRecord.id
  }

  $dbExistingId = Find-TwentyRecordIdInWorkspaceSchema -TableName "company" -ColumnName "name" -Value $Name
  if (-not [string]::IsNullOrWhiteSpace($dbExistingId)) {
    return $dbExistingId
  }

  $existing = Find-TwentyExistingRecord -ResourcePath "companies" -ResponseCollectionKey "companies" -Predicate {
    param($company)
    $company.name -eq $Name
  }

  if ($existing) {
    return $existing.id
  }

  $body = @{
    name = $Name
  }

  if ($Domain) {
    $body["domainName"] = @{
      primaryLinkLabel = ""
      primaryLinkUrl = "https://$Domain"
      secondaryLinks = @()
    }
  }

  try {
    $response = Invoke-TwentyJson -Method POST -Path "rest/companies" -Headers $script:TwentyHeaders -Body $body
    return $response.data.createCompany.id
  } catch {
    if (-not (Test-TwentyDuplicateError -ErrorRecord $_)) {
      throw
    }

    $existing = Find-TwentyExistingRecord -ResourcePath "companies" -ResponseCollectionKey "companies" -Predicate {
      param($company)
      $company.name -eq $Name
    }

    if ($existing) {
      return $existing.id
    }

    Write-Warning "Company '$Name' already exists in Twenty, but its id could not be recovered from the list API. Continuing without rewriting it."
    return $KnownId
  }
}

function Ensure-Person {
  param(
    [Parameter(Mandatory = $true)][string]$Email,
    [Parameter(Mandatory = $true)][string]$FirstName,
    [Parameter(Mandatory = $true)][string]$LastName,
    [string]$Phone,
    [string]$City,
    [string]$CompanyId,
    [string]$KnownId
  )

  $knownRecord = Get-TwentyRecordById -ResourcePath "people" -ResponseKey "person" -Id $KnownId
  if ($knownRecord -and $knownRecord.emails.primaryEmail -eq $Email) {
    return $knownRecord.id
  }

  $dbExistingId = Find-TwentyRecordIdInWorkspaceSchema -TableName "person" -ColumnName "emailsPrimaryEmail" -Value $Email
  if (-not [string]::IsNullOrWhiteSpace($dbExistingId)) {
    return $dbExistingId
  }

  $existing = Find-TwentyExistingRecord -ResourcePath "people" -ResponseCollectionKey "people" -Predicate {
    param($person)
    $person.emails.primaryEmail -eq $Email
  }

  if ($existing) {
    return $existing.id
  }

  $body = @{
    name = @{
      firstName = $FirstName
      lastName = $LastName
    }
    emails = @{
      primaryEmail = $Email
      additionalEmails = @()
    }
  }

  if ($Phone) {
    $body["phones"] = @{
      primaryPhoneNumber = $Phone
      primaryPhoneCountryCode = "PL"
      primaryPhoneCallingCode = "+48"
      additionalPhones = @()
    }
  }

  if ($City) {
    $body["city"] = $City
  }

  if ($CompanyId) {
    $body["companyId"] = $CompanyId
  }

  try {
    $response = Invoke-TwentyJson -Method POST -Path "rest/people" -Headers $script:TwentyHeaders -Body $body
    return $response.data.createPerson.id
  } catch {
    if (-not (Test-TwentyDuplicateError -ErrorRecord $_)) {
      throw
    }

    $existing = Find-TwentyExistingRecord -ResourcePath "people" -ResponseCollectionKey "people" -Predicate {
      param($person)
      $person.emails.primaryEmail -eq $Email
    }

    if ($existing) {
      return $existing.id
    }

    throw
  }
}

function Ensure-Opportunity {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][long]$AmountMicros,
    [Parameter(Mandatory = $true)][string]$CurrencyCode,
    [string]$Stage = "NEW",
    [string]$CompanyId,
    [string]$PointOfContactId,
    [string]$KnownId
  )

  $knownRecord = Get-TwentyRecordById -ResourcePath "opportunities" -ResponseKey "opportunity" -Id $KnownId
  if ($knownRecord -and $knownRecord.name -eq $Name) {
    return $knownRecord.id
  }

  $dbExistingId = Find-TwentyRecordIdInWorkspaceSchema -TableName "opportunity" -ColumnName "name" -Value $Name
  if (-not [string]::IsNullOrWhiteSpace($dbExistingId)) {
    return $dbExistingId
  }

  $existing = Find-TwentyExistingRecord -ResourcePath "opportunities" -ResponseCollectionKey "opportunities" -Predicate {
    param($opportunity)
    $opportunity.name -eq $Name
  }

  if ($existing) {
    return $existing.id
  }

  $body = @{
    name = $Name
    amount = @{
      amountMicros = $AmountMicros
      currencyCode = $CurrencyCode
    }
    stage = $Stage
  }

  if ($CompanyId) {
    $body["companyId"] = $CompanyId
  }

  if ($PointOfContactId) {
    $body["pointOfContactId"] = $PointOfContactId
  }

  try {
    $response = Invoke-TwentyJson -Method POST -Path "rest/opportunities" -Headers $script:TwentyHeaders -Body $body
    return $response.data.createOpportunity.id
  } catch {
    if (-not (Test-TwentyDuplicateError -ErrorRecord $_)) {
      throw
    }

    $existing = Find-TwentyExistingRecord -ResourcePath "opportunities" -ResponseCollectionKey "opportunities" -Predicate {
      param($opportunity)
      $opportunity.name -eq $Name
    }

    if ($existing) {
      return $existing.id
    }

    throw
  }
}

function Ensure-Task {
  param(
    [Parameter(Mandatory = $true)][string]$Title,
    [Parameter(Mandatory = $true)][string]$BodyText,
    [string]$Status = "TODO",
    [string]$KnownId
  )

  $knownRecord = Get-TwentyRecordById -ResourcePath "tasks" -ResponseKey "task" -Id $KnownId
  if ($knownRecord -and $knownRecord.title -eq $Title) {
    return $knownRecord.id
  }

  $dbExistingId = Find-TwentyRecordIdInWorkspaceSchema -TableName "task" -ColumnName "title" -Value $Title
  if (-not [string]::IsNullOrWhiteSpace($dbExistingId)) {
    return $dbExistingId
  }

  $existing = Find-TwentyExistingRecord -ResourcePath "tasks" -ResponseCollectionKey "tasks" -Predicate {
    param($task)
    $task.title -eq $Title
  }

  if ($existing) {
    return $existing.id
  }

  $blocknote = ConvertTo-BlocknoteDocument -Text $BodyText
  try {
    $response = Invoke-TwentyJson -Method POST -Path "rest/tasks" -Headers $script:TwentyHeaders -Body @{
      title = $Title
      bodyV2 = @{
        blocknote = $blocknote
        markdown = $BodyText
      }
      status = $Status
    }

    return $response.data.createTask.id
  } catch {
    if (-not (Test-TwentyDuplicateError -ErrorRecord $_)) {
      throw
    }

    $existing = Find-TwentyExistingRecord -ResourcePath "tasks" -ResponseCollectionKey "tasks" -Predicate {
      param($task)
      $task.title -eq $Title
    }

    if ($existing) {
      return $existing.id
    }

    throw
  }
}

function Resolve-SeedReferenceId {
  param(
    [AllowNull()][AllowEmptyString()][string]$Reference,
    [Parameter(Mandatory = $true)][hashtable]$ResolvedIds,
    [Parameter(Mandatory = $true)][string]$Description
  )

  if ([string]::IsNullOrWhiteSpace($Reference)) {
    return $null
  }

  if (-not $ResolvedIds.ContainsKey($Reference)) {
    throw "$Description reference '$Reference' has not been resolved."
  }

  return $ResolvedIds[$Reference]
}

$resolvedSeedPath = (Resolve-Path -Path $SeedPath).Path
$seedArtifact = Get-SeedArtifact -Path $resolvedSeedPath
Assert-SeedArtifact -SeedArtifact $seedArtifact

$seedCompanies = Get-SeedArray -SeedArtifact $seedArtifact -PropertyName "companies"
$seedPeople = Get-SeedArray -SeedArtifact $seedArtifact -PropertyName "people"
$seedOpportunities = Get-SeedArray -SeedArtifact $seedArtifact -PropertyName "opportunities"
$seedTasks = Get-SeedArray -SeedArtifact $seedArtifact -PropertyName "tasks"
$supportedSources = Get-SeedArray -SeedArtifact $seedArtifact -PropertyName "supportedSources"
$queueNames = Get-SeedArray -SeedArtifact $seedArtifact -PropertyName "queueNames"

if ($ValidateOnly) {
  Write-Host "Twenty CRM operator workspace seed artifact validated." -ForegroundColor Green
  Write-Host "Artifact: $resolvedSeedPath"
  Write-Host ("Companies: {0}" -f $seedCompanies.Count)
  Write-Host ("People: {0}" -f $seedPeople.Count)
  Write-Host ("Opportunities: {0}" -f $seedOpportunities.Count)
  Write-Host ("Tasks: {0}" -f $seedTasks.Count)
  Write-Host ("Supported sources: {0}" -f ($supportedSources -join ", "))
  Write-Host ("Queue names: {0}" -f ($queueNames -join ", "))
  exit 0
}

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envFile = Join-Path $root ".env"
$envLocalFile = Join-Path $root ".env.local"
$stateFile = Join-Path $root "output\twenty-bootstrap\operator-workspace-state.json"
$envMap = Parse-EnvFile -Path $envFile
if (Test-Path $envLocalFile) {
  $envMap = Merge-EnvMaps -Base $envMap -Overrides (Parse-EnvFile -Path $envLocalFile)
}

$script:TwentyBaseUrl = if ($envMap["TWENTY_API_BASE_URL"]) {
  $envMap["TWENTY_API_BASE_URL"].TrimEnd("/")
} else {
  "http://127.0.0.1:8107"
}

$twentyApiKey = Ensure-TwentyApiKey -EnvMap $envMap -EnvLocalPath $envLocalFile

$script:TwentyHeaders = @{
  Authorization = "Bearer $twentyApiKey"
}

$existingState = Get-TwentySeedState -Path $stateFile

$resolvedCompanyIds = @{}
foreach ($company in $seedCompanies) {
  $resolvedCompanyIds[[string]$company.key] = Ensure-Company `
    -Name ([string]$company.name) `
    -Domain ([string]$company.domain) `
    -KnownId $existingState.Companies[[string]$company.key]
}

$resolvedPersonIds = @{}
foreach ($person in $seedPeople) {
  $companyId = Resolve-SeedReferenceId `
    -Reference ([string]$person.companyRef) `
    -ResolvedIds $resolvedCompanyIds `
    -Description "person companyRef"

  $resolvedPersonIds[[string]$person.key] = Ensure-Person `
    -Email ([string]$person.email) `
    -FirstName ([string]$person.firstName) `
    -LastName ([string]$person.lastName) `
    -Phone ([string]$person.phone) `
    -City ([string]$person.city) `
    -CompanyId $companyId `
    -KnownId $existingState.People[[string]$person.key]
}

 $resolvedOpportunityIds = @{}
foreach ($opportunity in $seedOpportunities) {
  $companyId = Resolve-SeedReferenceId `
    -Reference ([string]$opportunity.companyRef) `
    -ResolvedIds $resolvedCompanyIds `
    -Description "opportunity companyRef"
  $pointOfContactId = Resolve-SeedReferenceId `
    -Reference ([string]$opportunity.pointOfContactRef) `
    -ResolvedIds $resolvedPersonIds `
    -Description "opportunity pointOfContactRef"

  $resolvedOpportunityIds[[string]$opportunity.key] = Ensure-Opportunity `
    -Name ([string]$opportunity.name) `
    -AmountMicros ([long]$opportunity.amountMicros) `
    -CurrencyCode ([string]$opportunity.currencyCode) `
    -Stage ([string]$opportunity.stage) `
    -CompanyId $companyId `
    -PointOfContactId $pointOfContactId `
    -KnownId $existingState.Opportunities[[string]$opportunity.key]
}

 $resolvedTaskIds = @{}
foreach ($task in $seedTasks) {
  $resolvedTaskIds[[string]$task.title] = Ensure-Task `
    -Title ([string]$task.title) `
    -BodyText ([string]$task.bodyText) `
    -Status ([string]$task.status) `
    -KnownId $existingState.Tasks[[string]$task.title]
}

Save-TwentySeedState `
  -Path $stateFile `
  -SeedArtifact $seedArtifact `
  -CompanyIds $resolvedCompanyIds `
  -PersonIds $resolvedPersonIds `
  -OpportunityIds $resolvedOpportunityIds `
  -TaskIds $resolvedTaskIds

Write-Host "Twenty CRM operator workspace seeded." -ForegroundColor Green
Write-Host "Artifact: $resolvedSeedPath"
Write-Host ("Companies: {0}" -f $seedCompanies.Count)
Write-Host ("People: {0}" -f $seedPeople.Count)
Write-Host ("Opportunities: {0}" -f $seedOpportunities.Count)
Write-Host ("Tasks: {0}" -f $seedTasks.Count)
Write-Host ("Supported sources: {0}" -f ($supportedSources -join ", "))
Write-Host ("Queue names: {0}" -f ($queueNames -join ", "))
