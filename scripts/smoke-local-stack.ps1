param(
  [switch]$Deep
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

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

function Invoke-JsonRequest {
  param(
    [Parameter(Mandatory = $true)][ValidateSet("GET", "POST")][string]$Method,
    [Parameter(Mandatory = $true)][string]$Url,
    [hashtable]$Headers,
    [object]$Body,
    [int]$TimeoutSec = 20
  )

  $requestParams = @{
    Method = $Method
    Uri = $Url
    TimeoutSec = $TimeoutSec
  }

  if ($Headers) {
    $requestParams["Headers"] = $Headers
  }

  if ($PSBoundParameters.ContainsKey("Body")) {
    $requestParams["Body"] = ($Body | ConvertTo-Json -Depth 8)
    if (-not $requestParams.ContainsKey("Headers")) {
      $requestParams["Headers"] = @{}
    }
    $requestParams["Headers"]["Content-Type"] = "application/json"
  }

  return Invoke-RestMethod @requestParams
}

function Test-Url {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$Url
  )

  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -MaximumRedirection 5 -TimeoutSec 15
    return [pscustomobject]@{
      Name = $Name
      Url = $Url
      StatusCode = [int]$response.StatusCode
      Healthy = ($response.StatusCode -ge 200 -and $response.StatusCode -le 399)
      Detail = "OK"
    }
  } catch {
    $statusCode = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
    return [pscustomobject]@{
      Name = $Name
      Url = $Url
      StatusCode = $statusCode
      Healthy = $false
      Detail = $_.Exception.Message
    }
  }
}

function Write-Section {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Wait-ForCondition {
  param(
    [Parameter(Mandatory = $true)][scriptblock]$Condition,
    [int]$TimeoutSec = 20,
    [int]$IntervalSec = 2
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSec)

  while ((Get-Date) -lt $deadline) {
    if (& $Condition) {
      return $true
    }

    Start-Sleep -Seconds $IntervalSec
  }

  return $false
}

function Invoke-DbScalar {
  param(
    [Parameter(Mandatory = $true)][string]$Database,
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $output = $Sql | docker exec -i hylono-postgres psql -U postgres -d $Database -At -f -
  if ($LASTEXITCODE -ne 0) {
    throw "Database scalar query failed for $Database."
  }

  return ($output | Select-Object -First 1)
}

function Get-MedusaCatalogManifest {
  param([Parameter(Mandatory = $true)][string]$Path)

  if (-not (Test-Path $Path)) {
    throw "Medusa catalog manifest not found: $Path"
  }

  return Get-Content -Path $Path -Raw | ConvertFrom-Json
}

function Invoke-SnipeitDbScalar {
  param([Parameter(Mandatory = $true)][string]$Sql)

  if (-not $envMap["SNIPEIT_DB_PASSWORD"]) {
    throw "SNIPEIT_DB_PASSWORD is required for Snipe-IT deep smoke checks."
  }

  $output = docker exec hylono-snipe-it-db mariadb --batch --skip-column-names -usnipeit "-p$($envMap["SNIPEIT_DB_PASSWORD"])" snipeit_db -e $Sql
  if ($LASTEXITCODE -ne 0) {
    throw "Snipe-IT scalar query failed."
  }

  return ($output | Select-Object -First 1)
}

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envMap = Parse-EnvFile -Path (Join-Path $root ".env")
if (Test-Path (Join-Path $root ".env.local")) {
  $envMap = Merge-EnvMaps -Base $envMap -Overrides (Parse-EnvFile -Path (Join-Path $root ".env.local"))
}

$serviceChecks = @(
  @{ Name = "Main Site"; Url = "http://localhost:3000" },
  @{ Name = "Control Panel"; Url = "http://localhost:3005/admin" },
  @{ Name = "Uptime Kuma"; Url = "http://localhost:3002" },
  @{ Name = "Uptime Kuma Status Page"; Url = "http://localhost:3002/status/hylono-local" },
  @{ Name = "n8n"; Url = "http://localhost:5678" },
  @{ Name = "Medusa"; Url = "http://localhost:8100/app/login" },
  @{ Name = "Lago"; Url = "http://localhost:8102" },
  @{ Name = "Snipe-IT"; Url = "http://localhost:8104/login" },
  @{ Name = "Cal.com"; Url = "http://localhost:8106" },
  @{ Name = "Twenty CRM"; Url = "http://localhost:8107" },
  @{ Name = "Documenso"; Url = "http://localhost:8108" },
  @{ Name = "Zitadel"; Url = "http://localhost:8109/ui/console?login_hint=root@zitadel.localhost" },
  @{ Name = "Novu"; Url = "http://localhost:8110" }
)

Write-Section "Surface health"
$surfaceResults = foreach ($service in $serviceChecks) {
  Test-Url -Name $service.Name -Url $service.Url
}

$surfaceResults | ForEach-Object {
  $status = if ($_.Healthy) { "OK" } else { "FAIL" }
  Write-Host ("[{0}] {1} -> {2} ({3})" -f $status, $_.Name, $_.StatusCode, $_.Url)
}

if ($surfaceResults.Where({ -not $_.Healthy }).Count -gt 0) {
  Write-Host ""
  Write-Host "Surface smoke check failed." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "Surface smoke check passed." -ForegroundColor Green

Write-Section "Documenso signing"
$documensoCertStatus = Invoke-JsonRequest -Method GET -Url "http://localhost:8108/api/certificate-status"
$documensoCertHealthy = $documensoCertStatus.PSObject.Properties.Match("isAvailable").Count -gt 0 -and [bool]$documensoCertStatus.isAvailable

if ($documensoCertHealthy) {
  Write-Host "[OK] Documenso signing certificate -> available" -ForegroundColor Green
} else {
  Write-Host "[FAIL] Documenso signing certificate -> unavailable" -ForegroundColor Red
  exit 1
}

if (-not $Deep) {
  exit 0
}

if (-not $envMap["TWENTY_API_KEY"] -or -not $envMap["NOVU_API_SECRET"]) {
  Write-Host ""
  Write-Host "Deep smoke requires TWENTY_API_KEY and NOVU_API_SECRET in .env." -ForegroundColor Red
  exit 1
}

$twentyBaseUrl = if ($envMap["TWENTY_API_BASE_URL"]) { $envMap["TWENTY_API_BASE_URL"] } else { "http://localhost:8107" }
$novuBaseUrl = if ($envMap["NOVU_API_BASE_URL"]) { $envMap["NOVU_API_BASE_URL"] } else { "http://localhost:18110" }
$novuWorkflowId = if ($envMap["NOVU_WORKFLOW_ID"]) { $envMap["NOVU_WORKFLOW_ID"] } else { "powiadomienia" }
$medusaManifest = Get-MedusaCatalogManifest -Path (Join-Path $root "scripts\data\medusa-local-catalog.seed.json")
$medusaCanonicalProduct = $medusaManifest.canonicalProduct

$mailValidationScript = Join-Path $root "scripts\validate-mail-provider-env.ps1"
if (Test-Path $mailValidationScript) {
  & powershell -NoProfile -ExecutionPolicy Bypass -File $mailValidationScript
  if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Mail provider validation failed during deep smoke." -ForegroundColor Red
    exit 1
  }
}

Write-Section "Deep intake smoke"
$stamp = [int][double]::Parse((Get-Date -UFormat %s))
$contactEmail = "contact-$stamp@hylono.com"
$bookingEmail = "booking-$stamp@hylono.com"
$newsletterEmail = "newsletter-$stamp@hylono.com"
$checkoutEmail = "checkout-$stamp@hylono.com"
$rentalEmail = "rental-$stamp@hylono.com"

$novuHeaders = @{ Authorization = "ApiKey $($envMap["NOVU_API_SECRET"])" }
$twentyHeaders = @{ Authorization = "Bearer $($envMap["TWENTY_API_KEY"])" }
$medusaPublishableKey = Invoke-DbScalar -Database "medusa_db" -Sql @"
select token
from api_key
where type = 'publishable'
order by created_at desc
limit 1;
"@
$medusaHeaders = @{ "x-publishable-api-key" = $medusaPublishableKey }
$medusaHealthResponse = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:8100/health" -TimeoutSec 15
$medusaHealthContent = ($medusaHealthResponse.Content | Out-String).Trim()
$medusaProductsResponse = Invoke-JsonRequest -Method GET -Url "http://localhost:8100/store/products?limit=1" -Headers $medusaHeaders
$medusaRegionsResponse = Invoke-JsonRequest -Method GET -Url "http://localhost:8100/store/regions" -Headers $medusaHeaders
$medusaStockLocationCount = [int](Invoke-DbScalar -Database "medusa_db" -Sql "select count(*) from stock_location;")
$medusaAdminUserCount = [int](Invoke-DbScalar -Database "medusa_db" -Sql "select count(*) from ""user"";")
$medusaCanonicalProductCount = [int](Invoke-DbScalar -Database "medusa_db" -Sql @"
select count(*)
from product
where handle = '$([string]$medusaCanonicalProduct.handle)'
  and title = '$([string]$medusaCanonicalProduct.title)'
  and status = '$([string]$medusaCanonicalProduct.status)';
"@)
$calOperatorScheduleCount = [int](Invoke-DbScalar -Database "calcom_db" -Sql @"
select count(*)
from "Schedule" s
join users u on u.id = s."userId"
where u.email = 'wiktormyszor@proton.me';
"@)
$calOperatorAvailabilityCount = [int](Invoke-DbScalar -Database "calcom_db" -Sql @"
select count(*)
from "Availability" a
join "Schedule" s on s.id = a."scheduleId"
join users u on u.id = s."userId"
where u.email = 'wiktormyszor@proton.me';
"@)
$calOperatorEvent30MinCount = [int](Invoke-DbScalar -Database "calcom_db" -Sql @"
select count(*)
from "EventType" e
join users u on u.id = e."userId"
where u.email = 'wiktormyszor@proton.me'
  and e.slug = '30min';
"@)
$calOperatorEvent15MinCount = [int](Invoke-DbScalar -Database "calcom_db" -Sql @"
select count(*)
from "EventType" e
join users u on u.id = e."userId"
where u.email = 'wiktormyszor@proton.me'
  and e.slug = '15min';
"@)
$calOperatorEventSecretCount = [int](Invoke-DbScalar -Database "calcom_db" -Sql @"
select count(*)
from "EventType" e
join users u on u.id = e."userId"
where u.email = 'wiktormyszor@proton.me'
  and e.slug = 'secret';
"@)
$calPublicBookingPage = Test-Url -Name "Cal.com public booking page" -Url "http://localhost:8106/hylono"
$lagoHealthResponse = Invoke-JsonRequest -Method GET -Url "http://localhost:18102/health"
$lagoOperatorUserCount = [int](Invoke-DbScalar -Database "lago_db" -Sql @"
select count(*)
from users
where email = 'wiktormyszor@proton.me';
"@)
$lagoApiKeyCount = [int](Invoke-DbScalar -Database "lago_db" -Sql "select count(*) from api_keys;")
$lagoDemoCustomerCount = [int](Invoke-DbScalar -Database "lago_db" -Sql @"
select count(*)
from customers
where external_id = 'hylono-local-demo'
  and deleted_at is null;
"@)
$lagoMetricCount = [int](Invoke-DbScalar -Database "lago_db" -Sql @"
select count(*)
from billable_metrics
where code = 'rental_monthly_revenue'
  and deleted_at is null;
"@)
$lagoPlanCount = [int](Invoke-DbScalar -Database "lago_db" -Sql @"
select count(*)
from plans
where code = 'hylono_local_rental'
  and deleted_at is null;
"@)
$snipeitLocationCount = [int](Invoke-SnipeitDbScalar -Sql "select count(*) from locations where name = 'Hylono Clinic - Warsaw';")
$snipeitManufacturerCount = [int](Invoke-SnipeitDbScalar -Sql "select count(*) from manufacturers where name = 'Hylono Medtech';")
$snipeitCategoryCount = [int](Invoke-SnipeitDbScalar -Sql "select count(*) from categories where name = 'HBOT Equipment';")
$snipeitModelCount = [int](Invoke-SnipeitDbScalar -Sql "select count(*) from models where name = 'HBOT Starter System';")
$snipeitAssetCount = [int](Invoke-SnipeitDbScalar -Sql "select count(*) from assets where asset_tag = 'HBOT-001';")

$workflowBefore = Invoke-JsonRequest -Method GET -Url "$novuBaseUrl/v2/workflows?limit=20" -Headers $novuHeaders
$workflowBeforeItem = $workflowBefore.data.workflows | Where-Object { $_.workflowId -eq $novuWorkflowId } | Select-Object -First 1
$workflowBeforeTriggered = $workflowBeforeItem.lastTriggeredAt
$workflowIsActive = $workflowBeforeItem.status -eq "ACTIVE"
$novuIntegrations = Invoke-JsonRequest -Method GET -Url "$novuBaseUrl/v1/integrations?limit=20" -Headers $novuHeaders
$novuInAppReady = @($novuIntegrations.data) | Where-Object {
  $_.channel -eq "in_app" -and $_.active -eq $true
} | Select-Object -First 1

$contactResponse = Invoke-JsonRequest -Method POST -Url "http://localhost:3000/api/contact" -Body @{
  name = "Local Contact Test"
  email = $contactEmail
  subject = "Local intake sync"
  message = "Testing local CRM and Novu delivery from contact route."
  inquiryType = "general"
  company = "Hylono Local"
}

$bookingResponse = Invoke-JsonRequest -Method POST -Url "http://localhost:3000/api/booking" -Body @{
  name = "Local Booking Test"
  email = $bookingEmail
  preferredDate = "2026-03-26"
  preferredTime = "11:00"
  timezone = "Europe/Warsaw"
  techInterest = "HBOT"
  bookingType = "consultation"
  notes = "Testing booking intake sync."
}

$newsletterResponse = Invoke-JsonRequest -Method POST -Url "http://localhost:3000/api/newsletter" -Body @{
  email = $newsletterEmail
  firstName = "Local"
  source = "phase-2-smoke"
}

$checkoutResponse = Invoke-JsonRequest -Method POST -Url "http://localhost:3000/api/checkout" -Body @{
  items = @(
    @{
      id = "tech-hbot"
      quantity = 1
    }
  )
  shipping = @{
    firstName = "Local"
    lastName = "Checkout"
    email = $checkoutEmail
    phone = "+48111222333"
    address = "Testowa 1"
    city = "Warsaw"
    postalCode = "00-001"
    country = "Poland"
  }
  paymentMethod = "bank_transfer"
}

$rentalResponse = Invoke-JsonRequest -Method POST -Url "http://localhost:3000/api/rental" -Body @{
  userId = $rentalEmail
  fullName = "Local Rental Test"
  email = $rentalEmail
  phone = "+48111222333"
  address = "Testowa 1"
  city = "Warsaw"
  postalCode = "00-001"
  country = "Poland"
  company = "Hylono Local"
  termMonths = 6
  items = @(
    @{
      techId = "tech-hbot"
      quantity = 1
      monthlyPrice = 109
    }
  )
}

Start-Sleep -Seconds 2

$rentalLookupResponse = $null
$rentalLookupItem = $null
$rentalLookupMatchesPayload = $false
Wait-ForCondition -TimeoutSec 15 -IntervalSec 2 -Condition {
  $script:rentalLookupResponse = Invoke-JsonRequest -Method GET -Url "http://localhost:3000/api/rental?userId=$([uri]::EscapeDataString($rentalEmail))"
  $script:rentalLookupItem = @($script:rentalLookupResponse.rentals) | Where-Object { $_.id -eq $rentalResponse.rental.id } | Select-Object -First 1

  if (-not $script:rentalLookupItem -or
      $script:rentalLookupItem.PSObject.Properties.Match("termMonths").Count -eq 0 -or
      $script:rentalLookupItem.PSObject.Properties.Match("items").Count -eq 0) {
    $script:rentalLookupMatchesPayload = $false
    return $false
  }

  $firstRentalItem = @($script:rentalLookupItem.items) | Select-Object -First 1
  $script:rentalLookupMatchesPayload =
    ($script:rentalLookupItem.termMonths -eq 6) -and
    [bool]$firstRentalItem -and
    ($firstRentalItem.techId -eq "tech-hbot") -and
    ($firstRentalItem.quantity -eq 1) -and
    ([double]$firstRentalItem.monthlyPrice -eq 109)

  return $script:rentalLookupMatchesPayload
} | Out-Null

$peopleResponse = $null
$people = @()
$peopleEmails = @()
Wait-ForCondition -TimeoutSec 20 -IntervalSec 2 -Condition {
  $script:peopleResponse = Invoke-JsonRequest -Method GET -Url "$twentyBaseUrl/rest/people?limit=200" -Headers $twentyHeaders
  $script:people = @($script:peopleResponse.data.people)
  $script:peopleEmails = $script:people | ForEach-Object { $_.emails.primaryEmail }
  return ($script:peopleEmails -contains $rentalEmail)
} | Out-Null

$companiesResponse = Invoke-JsonRequest -Method GET -Url "$twentyBaseUrl/rest/companies?limit=100" -Headers $twentyHeaders
$companyNames = @($companiesResponse.data.companies) | ForEach-Object { $_.name }
$opportunitiesResponse = Invoke-JsonRequest -Method GET -Url "$twentyBaseUrl/rest/opportunities?limit=100" -Headers $twentyHeaders
$opportunityNames = @($opportunitiesResponse.data.opportunities) | ForEach-Object { $_.name }
$tasksResponse = Invoke-JsonRequest -Method GET -Url "$twentyBaseUrl/rest/tasks?limit=100" -Headers $twentyHeaders
$taskTitles = @($tasksResponse.data.tasks) | ForEach-Object { $_.title }

$subscribersResponse = $null
$subscribers = @()
$subscriberEmails = @()
Wait-ForCondition -TimeoutSec 20 -IntervalSec 2 -Condition {
  $script:subscribersResponse = Invoke-JsonRequest -Method GET -Url "$novuBaseUrl/v2/subscribers?limit=100" -Headers $novuHeaders
  $script:subscribers = @($script:subscribersResponse.data)
  $script:subscriberEmails = $script:subscribers | ForEach-Object {
    if ($_.PSObject.Properties.Match("email").Count -gt 0) {
      $_.email
    }
  }

  return ($script:subscriberEmails -contains $rentalEmail)
} | Out-Null

$people = @($people)
$people = @($peopleResponse.data.people)
$peopleEmails = $people | ForEach-Object { $_.emails.primaryEmail }
$subscribers = @($subscribersResponse.data)
$subscriberEmails = $subscribers | ForEach-Object {
  if ($_.PSObject.Properties.Match("email").Count -gt 0) {
    $_.email
  }
}

$workflowAfter = Invoke-JsonRequest -Method GET -Url "$novuBaseUrl/v2/workflows?limit=20" -Headers $novuHeaders
$workflowAfterItem = $workflowAfter.data.workflows | Where-Object { $_.workflowId -eq $novuWorkflowId } | Select-Object -First 1
$workflowAfterTriggered = $workflowAfterItem.lastTriggeredAt
$recentTriggerCutoff = (Get-Date).ToUniversalTime().AddMinutes(-10)
$workflowTriggeredRecently = $false
if ($workflowAfterTriggered) {
  $workflowTriggeredRecently = ([datetime]$workflowAfterTriggered) -gt $recentTriggerCutoff
}

$desiredWorkflowIds = @(
  "tONvHqHhlhP4sUb1",
  "7o751mk74qU",
  "ZpdaLnv42PY",
  "HylonoLocalOrderCreated01",
  "HylonoLocalRentalRequested01"
)
$staleWorkflowNames = @(
  "lead_created",
  "document_signed",
  "booking_requested_test",
  "order_created_legacy"
)
$n8nDesiredActiveCount = [int](Invoke-DbScalar -Database "n8n_db" -Sql @"
select count(*)
from workflow_entity
where id in ('$(($desiredWorkflowIds -join "','"))')
  and active = true;
"@)
$n8nStaleActiveCount = [int](Invoke-DbScalar -Database "n8n_db" -Sql @"
select count(*)
from workflow_entity
where name in ('$(($staleWorkflowNames -join "','"))')
  and active = true;
"@)

$deepChecks = @(
  [pscustomobject]@{ Name = "Medusa publishable key"; Healthy = -not [string]::IsNullOrWhiteSpace($medusaPublishableKey); Detail = if ($medusaPublishableKey) { $medusaPublishableKey.Substring(0, [Math]::Min(12, $medusaPublishableKey.Length)) } else { "missing" } },
  [pscustomobject]@{ Name = "Medusa health endpoint"; Healthy = ($medusaHealthResponse.StatusCode -eq 200 -and $medusaHealthContent -eq "OK"); Detail = $medusaHealthContent },
  [pscustomobject]@{ Name = "Medusa store products"; Healthy = (@($medusaProductsResponse.products).Count -ge 1); Detail = @($medusaProductsResponse.products).Count },
  [pscustomobject]@{ Name = "Medusa store regions"; Healthy = (@($medusaRegionsResponse.regions).Count -ge 1); Detail = @($medusaRegionsResponse.regions).Count },
  [pscustomobject]@{ Name = "Medusa stock locations"; Healthy = ($medusaStockLocationCount -ge 1); Detail = $medusaStockLocationCount },
  [pscustomobject]@{ Name = "Medusa admin users"; Healthy = ($medusaAdminUserCount -ge 1); Detail = $medusaAdminUserCount },
  [pscustomobject]@{ Name = "Medusa canonical product baseline"; Healthy = ($medusaCanonicalProductCount -ge 1); Detail = "$([string]$medusaCanonicalProduct.title) / $([string]$medusaCanonicalProduct.handle)" },
  [pscustomobject]@{ Name = "Cal.com public booking page"; Healthy = [bool]$calPublicBookingPage.Healthy; Detail = $calPublicBookingPage.Url },
  [pscustomobject]@{ Name = "Cal.com operator schedule"; Healthy = ($calOperatorScheduleCount -ge 1); Detail = $calOperatorScheduleCount },
  [pscustomobject]@{ Name = "Cal.com operator availability"; Healthy = ($calOperatorAvailabilityCount -ge 1); Detail = $calOperatorAvailabilityCount },
  [pscustomobject]@{ Name = "Cal.com 30min event"; Healthy = ($calOperatorEvent30MinCount -ge 1); Detail = $calOperatorEvent30MinCount },
  [pscustomobject]@{ Name = "Cal.com 15min event"; Healthy = ($calOperatorEvent15MinCount -ge 1); Detail = $calOperatorEvent15MinCount },
  [pscustomobject]@{ Name = "Cal.com secret event"; Healthy = ($calOperatorEventSecretCount -ge 1); Detail = $calOperatorEventSecretCount },
  [pscustomobject]@{ Name = "Lago API health"; Healthy = ($lagoHealthResponse.message -eq "Success"); Detail = $lagoHealthResponse.version },
  [pscustomobject]@{ Name = "Lago operator user"; Healthy = ($lagoOperatorUserCount -ge 1); Detail = $lagoOperatorUserCount },
  [pscustomobject]@{ Name = "Lago API keys"; Healthy = ($lagoApiKeyCount -ge 1); Detail = $lagoApiKeyCount },
  [pscustomobject]@{ Name = "Lago demo customer"; Healthy = ($lagoDemoCustomerCount -ge 1); Detail = $lagoDemoCustomerCount },
  [pscustomobject]@{ Name = "Lago demo billable metric"; Healthy = ($lagoMetricCount -ge 1); Detail = $lagoMetricCount },
  [pscustomobject]@{ Name = "Lago demo plan"; Healthy = ($lagoPlanCount -ge 1); Detail = $lagoPlanCount },
  [pscustomobject]@{ Name = "Snipe-IT location baseline"; Healthy = ($snipeitLocationCount -ge 1); Detail = $snipeitLocationCount },
  [pscustomobject]@{ Name = "Snipe-IT manufacturer baseline"; Healthy = ($snipeitManufacturerCount -ge 1); Detail = $snipeitManufacturerCount },
  [pscustomobject]@{ Name = "Snipe-IT category baseline"; Healthy = ($snipeitCategoryCount -ge 1); Detail = $snipeitCategoryCount },
  [pscustomobject]@{ Name = "Snipe-IT model baseline"; Healthy = ($snipeitModelCount -ge 1); Detail = $snipeitModelCount },
  [pscustomobject]@{ Name = "Snipe-IT asset baseline"; Healthy = ($snipeitAssetCount -ge 1); Detail = $snipeitAssetCount },
  [pscustomobject]@{ Name = "Contact route"; Healthy = [bool]$contactResponse.success; Detail = $contactResponse.ticketId },
  [pscustomobject]@{ Name = "Booking route"; Healthy = [bool]$bookingResponse.success; Detail = $bookingResponse.bookingRef },
  [pscustomobject]@{ Name = "Newsletter route"; Healthy = [bool]$newsletterResponse.success; Detail = "subscribed" },
  [pscustomobject]@{ Name = "Checkout route"; Healthy = [bool]$checkoutResponse.success; Detail = $checkoutResponse.orderId },
  [pscustomobject]@{ Name = "Rental route"; Healthy = [bool]$rentalResponse.success; Detail = $rentalResponse.rental.id },
  [pscustomobject]@{
    Name = "Rental lookup route"
    Healthy = [bool]$rentalLookupResponse.success -and [bool]$rentalLookupItem -and $rentalLookupMatchesPayload
    Detail = if ($rentalLookupItem) { $rentalLookupItem.id } else { "missing rental lookup record" }
  },
  [pscustomobject]@{ Name = "Twenty operator company"; Healthy = ($companyNames -contains "Hylono Operations"); Detail = "Hylono Operations" },
  [pscustomobject]@{ Name = "Twenty operator opportunity queue"; Healthy = ($opportunityNames -contains "Website contact follow-up queue"); Detail = "Website contact follow-up queue" },
  [pscustomobject]@{ Name = "Twenty operator task"; Healthy = ($taskTitles -contains "Review website intake backlog"); Detail = "Review website intake backlog" },
  [pscustomobject]@{ Name = "Twenty contact sync"; Healthy = ($peopleEmails -contains $contactEmail); Detail = $contactEmail },
  [pscustomobject]@{ Name = "Twenty booking sync"; Healthy = ($peopleEmails -contains $bookingEmail); Detail = $bookingEmail },
  [pscustomobject]@{ Name = "Twenty newsletter sync"; Healthy = ($peopleEmails -contains $newsletterEmail); Detail = $newsletterEmail },
  [pscustomobject]@{ Name = "Twenty checkout sync"; Healthy = ($peopleEmails -contains $checkoutEmail); Detail = $checkoutEmail },
  [pscustomobject]@{ Name = "Twenty rental sync"; Healthy = ($peopleEmails -contains $rentalEmail); Detail = $rentalEmail },
  [pscustomobject]@{ Name = "Novu workflow active"; Healthy = [bool]$workflowIsActive; Detail = $novuWorkflowId },
  [pscustomobject]@{ Name = "Novu in-app integration"; Healthy = [bool]$novuInAppReady; Detail = "Novu Inbox" },
  [pscustomobject]@{ Name = "Novu ops subscriber"; Healthy = ($subscriberEmails -contains "ops@hylono.com"); Detail = "ops@hylono.com" },
  [pscustomobject]@{ Name = "Novu support subscriber"; Healthy = ($subscriberEmails -contains "support@hylono.com"); Detail = "support@hylono.com" },
  [pscustomobject]@{ Name = "Novu contact subscriber"; Healthy = ($subscriberEmails -contains "contact@hylono.com"); Detail = "contact@hylono.com" },
  [pscustomobject]@{ Name = "Novu contact subscriber"; Healthy = ($subscriberEmails -contains $contactEmail); Detail = $contactEmail },
  [pscustomobject]@{ Name = "Novu booking subscriber"; Healthy = ($subscriberEmails -contains $bookingEmail); Detail = $bookingEmail },
  [pscustomobject]@{ Name = "Novu newsletter subscriber"; Healthy = ($subscriberEmails -contains $newsletterEmail); Detail = $newsletterEmail },
  [pscustomobject]@{ Name = "Novu checkout subscriber"; Healthy = ($subscriberEmails -contains $checkoutEmail); Detail = $checkoutEmail },
  [pscustomobject]@{ Name = "Novu rental subscriber"; Healthy = ($subscriberEmails -contains $rentalEmail); Detail = $rentalEmail },
  [pscustomobject]@{ Name = "n8n desired workflows active"; Healthy = ($n8nDesiredActiveCount -eq 5); Detail = $n8nDesiredActiveCount },
  [pscustomobject]@{ Name = "n8n stale workflows inactive"; Healthy = ($n8nStaleActiveCount -eq 0); Detail = $n8nStaleActiveCount },
  [pscustomobject]@{
    Name = "Novu workflow triggered"
    Healthy = [bool]$workflowAfterTriggered -and (($workflowAfterTriggered -ne $workflowBeforeTriggered) -or -not $workflowBeforeTriggered -or $workflowTriggeredRecently)
    Detail = if ($workflowAfterTriggered) { $workflowAfterTriggered } else { "no trigger timestamp" }
  }
)

$deepChecks | ForEach-Object {
  $status = if ($_.Healthy) { "OK" } else { "FAIL" }
  Write-Host ("[{0}] {1} -> {2}" -f $status, $_.Name, $_.Detail)
}

if ($deepChecks.Where({ -not $_.Healthy }).Count -gt 0) {
  Write-Host ""
  Write-Host "Deep smoke check failed." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "Deep smoke check passed." -ForegroundColor Green
