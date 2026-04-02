Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
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

function Ensure-LagoBootstrap {
  param(
    [Parameter(Mandatory = $true)][string]$Email,
    [Parameter(Mandatory = $true)][string]$Password,
    [Parameter(Mandatory = $true)][string]$OrganizationName
  )

  $userExists = Invoke-PostgresScalar -Database "lago_db" -Sql @"
select count(*)
from users
where email = '$Email';
"@
  $apiKeyExists = Invoke-PostgresScalar -Database "lago_db" -Sql @"
select count(*)
from api_keys;
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
    throw "Failed to bootstrap the initial Lago organization and API key."
  }
}

function Invoke-LagoApi {
  param(
    [Parameter(Mandatory = $true)][string]$Token,
    [Parameter(Mandatory = $true)][ValidateSet("GET", "POST")][string]$Method,
    [Parameter(Mandatory = $true)][string]$Path,
    [object]$Body
  )

  $headers = @{
    Authorization = "Bearer $Token"
  }

  if ($Method -eq "POST") {
    $headers["Content-Type"] = "application/json"
  }

  $params = @{
    Method = $Method
    Uri = "http://localhost:18102$Path"
    Headers = $headers
    TimeoutSec = 30
  }

  if ($PSBoundParameters.ContainsKey("Body")) {
    $params["Body"] = ($Body | ConvertTo-Json -Depth 8)
  }

  return Invoke-RestMethod @params
}

$customerExternalId = "hylono-local-demo"
$metricCode = "rental_monthly_revenue"
$planCode = "hylono_local_rental"
$operatorEmail = "wiktormyszor@proton.me"
$operatorPassword = "HylonoLagoAdmin123!"
$organizationName = "Hylono Local"

Write-Step "Checking Lago local billing baseline"

Ensure-LagoBootstrap -Email $operatorEmail -Password $operatorPassword -OrganizationName $organizationName

$apiToken = Invoke-PostgresScalar -Database "lago_db" -Sql @"
select value
from api_keys
order by created_at desc
limit 1;
"@

if (-not $apiToken) {
  throw "No Lago API token was found in lago_db.api_keys."
}

$customerExists = [int](Invoke-PostgresScalar -Database "lago_db" -Sql @"
select count(*)
from customers
where external_id = '$customerExternalId'
  and deleted_at is null;
"@)

if ($customerExists -eq 0) {
  $null = Invoke-LagoApi -Token $apiToken -Method POST -Path "/api/v1/customers" -Body @{
    customer = @{
      external_id = $customerExternalId
      name = "Hylono Local Demo"
      email = "billing-demo@hylono.com"
      city = "Warsaw"
      country = "PL"
      currency = "EUR"
    }
  }
  Write-Host "Created Lago demo customer." -ForegroundColor Green
} else {
  Write-Host "Lago demo customer already exists." -ForegroundColor Green
}

$metricExists = [int](Invoke-PostgresScalar -Database "lago_db" -Sql @"
select count(*)
from billable_metrics
where code = '$metricCode'
  and deleted_at is null;
"@)

if ($metricExists -eq 0) {
  $null = Invoke-LagoApi -Token $apiToken -Method POST -Path "/api/v1/billable_metrics" -Body @{
    billable_metric = @{
      name = "Rental Monthly Revenue"
      code = $metricCode
      description = "Monthly rental revenue for local Hylono demo billing"
      aggregation_type = "sum_agg"
      recurring = $false
      field_name = "amount"
    }
  }
  Write-Host "Created Lago demo billable metric." -ForegroundColor Green
} else {
  Write-Host "Lago demo billable metric already exists." -ForegroundColor Green
}

$planExists = [int](Invoke-PostgresScalar -Database "lago_db" -Sql @"
select count(*)
from plans
where code = '$planCode'
  and deleted_at is null;
"@)

if ($planExists -eq 0) {
  $null = Invoke-LagoApi -Token $apiToken -Method POST -Path "/api/v1/plans" -Body @{
    plan = @{
      name = "Hylono Local Rental"
      code = $planCode
      interval = "monthly"
      amount_cents = 18900
      amount_currency = "EUR"
      pay_in_advance = $true
      invoice_display_name = "Hylono Local Rental"
      description = "Local demo rental plan for operator testing."
    }
  }
  Write-Host "Created Lago demo plan." -ForegroundColor Green
} else {
  Write-Host "Lago demo plan already exists." -ForegroundColor Green
}

$customerCount = [int](Invoke-PostgresScalar -Database "lago_db" -Sql @"
select count(*)
from customers
where deleted_at is null;
"@)
$metricCount = [int](Invoke-PostgresScalar -Database "lago_db" -Sql @"
select count(*)
from billable_metrics
where deleted_at is null;
"@)
$planCount = [int](Invoke-PostgresScalar -Database "lago_db" -Sql @"
select count(*)
from plans
where deleted_at is null;
"@)

Write-Host ("Customers: {0}" -f $customerCount) -ForegroundColor Green
Write-Host ("Billable metrics: {0}" -f $metricCount) -ForegroundColor Green
Write-Host ("Plans: {0}" -f $planCount) -ForegroundColor Green
