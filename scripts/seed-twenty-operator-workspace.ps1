param(
  [string]$SeedPath,
  [switch]$ValidateOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not $PSBoundParameters.ContainsKey("SeedPath")) {
  $SeedPath = Join-Path $PSScriptRoot "data\twenty-operator-workspace.seed.json"
}

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
  }

  if ($PSBoundParameters.ContainsKey("Body")) {
    $requestParams["Body"] = ($Body | ConvertTo-Json -Depth 10)
    $requestParams["ContentType"] = "application/json"
  }

  return Invoke-RestMethod @requestParams
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

function Ensure-Company {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [string]$Domain
  )

  $companies = @((Invoke-TwentyJson -Method GET -Path "rest/companies?limit=200" -Headers $script:TwentyHeaders).data.companies)
  $existing = Get-FirstMatchingItem -Items $companies -Predicate {
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

  $response = Invoke-TwentyJson -Method POST -Path "rest/companies" -Headers $script:TwentyHeaders -Body $body
  return $response.data.createCompany.id
}

function Ensure-Person {
  param(
    [Parameter(Mandatory = $true)][string]$Email,
    [Parameter(Mandatory = $true)][string]$FirstName,
    [Parameter(Mandatory = $true)][string]$LastName,
    [string]$Phone,
    [string]$City,
    [string]$CompanyId
  )

  $people = @((Invoke-TwentyJson -Method GET -Path "rest/people?limit=200" -Headers $script:TwentyHeaders).data.people)
  $existing = Get-FirstMatchingItem -Items $people -Predicate {
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

  $response = Invoke-TwentyJson -Method POST -Path "rest/people" -Headers $script:TwentyHeaders -Body $body
  return $response.data.createPerson.id
}

function Ensure-Opportunity {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][long]$AmountMicros,
    [Parameter(Mandatory = $true)][string]$CurrencyCode,
    [string]$Stage = "NEW",
    [string]$CompanyId,
    [string]$PointOfContactId
  )

  $opportunities = @((Invoke-TwentyJson -Method GET -Path "rest/opportunities?limit=200" -Headers $script:TwentyHeaders).data.opportunities)
  $existing = Get-FirstMatchingItem -Items $opportunities -Predicate {
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

  $response = Invoke-TwentyJson -Method POST -Path "rest/opportunities" -Headers $script:TwentyHeaders -Body $body
  return $response.data.createOpportunity.id
}

function Ensure-Task {
  param(
    [Parameter(Mandatory = $true)][string]$Title,
    [Parameter(Mandatory = $true)][string]$BodyText,
    [string]$Status = "TODO"
  )

  $tasks = @((Invoke-TwentyJson -Method GET -Path "rest/tasks?limit=200" -Headers $script:TwentyHeaders).data.tasks)
  $existing = Get-FirstMatchingItem -Items $tasks -Predicate {
    param($task)
    $task.title -eq $Title
  }

  if ($existing) {
    return $existing.id
  }

  $blocknote = ConvertTo-BlocknoteDocument -Text $BodyText
  $response = Invoke-TwentyJson -Method POST -Path "rest/tasks" -Headers $script:TwentyHeaders -Body @{
    title = $Title
    bodyV2 = @{
      blocknote = $blocknote
      markdown = $BodyText
    }
    status = $Status
  }

  return $response.data.createTask.id
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
$envMap = Parse-EnvFile -Path (Join-Path $root ".env")
if ((Test-Path (Join-Path $root ".env.local"))) {
  $envMap = Merge-EnvMaps -Base $envMap -Overrides (Parse-EnvFile -Path (Join-Path $root ".env.local"))
}

$script:TwentyBaseUrl = if ($envMap["TWENTY_API_BASE_URL"]) {
  $envMap["TWENTY_API_BASE_URL"].TrimEnd("/")
} else {
  "http://localhost:8107"
}

$twentyApiKey = $envMap["TWENTY_API_KEY"]
if (-not $twentyApiKey) {
  throw "TWENTY_API_KEY is missing from .env or .env.local."
}

$script:TwentyHeaders = @{
  Authorization = "Bearer $twentyApiKey"
}

$resolvedCompanyIds = @{}
foreach ($company in $seedCompanies) {
  $resolvedCompanyIds[[string]$company.key] = Ensure-Company `
    -Name ([string]$company.name) `
    -Domain ([string]$company.domain)
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
    -CompanyId $companyId
}

foreach ($opportunity in $seedOpportunities) {
  $companyId = Resolve-SeedReferenceId `
    -Reference ([string]$opportunity.companyRef) `
    -ResolvedIds $resolvedCompanyIds `
    -Description "opportunity companyRef"
  $pointOfContactId = Resolve-SeedReferenceId `
    -Reference ([string]$opportunity.pointOfContactRef) `
    -ResolvedIds $resolvedPersonIds `
    -Description "opportunity pointOfContactRef"

  $null = Ensure-Opportunity `
    -Name ([string]$opportunity.name) `
    -AmountMicros ([long]$opportunity.amountMicros) `
    -CurrencyCode ([string]$opportunity.currencyCode) `
    -Stage ([string]$opportunity.stage) `
    -CompanyId $companyId `
    -PointOfContactId $pointOfContactId
}

foreach ($task in $seedTasks) {
  $null = Ensure-Task `
    -Title ([string]$task.title) `
    -BodyText ([string]$task.bodyText) `
    -Status ([string]$task.status)
}

Write-Host "Twenty CRM operator workspace seeded." -ForegroundColor Green
Write-Host "Artifact: $resolvedSeedPath"
Write-Host ("Companies: {0}" -f $seedCompanies.Count)
Write-Host ("People: {0}" -f $seedPeople.Count)
Write-Host ("Opportunities: {0}" -f $seedOpportunities.Count)
Write-Host ("Tasks: {0}" -f $seedTasks.Count)
Write-Host ("Supported sources: {0}" -f ($supportedSources -join ", "))
Write-Host ("Queue names: {0}" -f ($queueNames -join ", "))
