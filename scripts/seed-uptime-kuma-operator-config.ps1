Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$containerName = "hylono-uptime-kuma"
$statusPageSlug = "hylono-local"

function Invoke-KumaSql {
  param(
    [Parameter(Mandatory = $true)][string]$Sql,
    [int]$MaxAttempts = 8
  )

  $escapedSql = $Sql.Replace('"', '""')
  $attempt = 1
  $sleepSeconds = 1
  $lastOutput = $null

  while ($attempt -le $MaxAttempts) {
    $output = docker exec $containerName sqlite3 /app/data/kuma.db "PRAGMA busy_timeout = 5000; $escapedSql" 2>&1
    $lastOutput = $output

    if ($LASTEXITCODE -eq 0) {
      return $output
    }

    $combinedOutput = (($output | ForEach-Object { $_.ToString() }) -join "`n")
    if ($combinedOutput -notmatch 'database is locked') {
      throw "Failed to execute sqlite3 command against $containerName.`n$combinedOutput"
    }

    if ($attempt -eq $MaxAttempts) {
      throw "Failed to execute sqlite3 command against $containerName after $MaxAttempts attempts because kuma.db stayed locked.`n$combinedOutput"
    }

    Start-Sleep -Seconds $sleepSeconds
    $sleepSeconds = [Math]::Min($sleepSeconds + 1, 5)
    $attempt++
  }
}

function Invoke-KumaSqlScalar {
  param(
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $result = Invoke-KumaSql -Sql $Sql
  if ($null -eq $result) {
    return $null
  }

  return ($result | Select-Object -First 1)
}

function Test-HttpReady {
  param(
    [Parameter(Mandatory = $true)][string]$Url,
    [int]$TimeoutSec = 8
  )

  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec $TimeoutSec -MaximumRedirection 5
    return ($response.StatusCode -ge 200 -and $response.StatusCode -le 399)
  } catch {
    if ($_.Exception.Response) {
      $statusCode = [int]$_.Exception.Response.StatusCode
      return ($statusCode -ge 200 -and $statusCode -le 399)
    }

    return $false
  }
}

function Ensure-Tag {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$Color
  )

  $existingId = Invoke-KumaSqlScalar -Sql "select id from tag where name = '$Name' limit 1;"
  if ($existingId) {
    return [int]$existingId
  }

  Invoke-KumaSql -Sql "insert into tag (name, color) values ('$Name', '$Color');" | Out-Null
  return [int](Invoke-KumaSqlScalar -Sql "select id from tag where name = '$Name' limit 1;")
}

function Ensure-MonitorTag {
  param(
    [Parameter(Mandatory = $true)][int]$MonitorId,
    [Parameter(Mandatory = $true)][int]$TagId,
    [string]$Value
  )

  $valueClause = if ($PSBoundParameters.ContainsKey("Value")) {
    "'$Value'"
  } else {
    "NULL"
  }

  Invoke-KumaSql -Sql @"
insert into monitor_tag (monitor_id, tag_id, value)
select $MonitorId, $TagId, $valueClause
where not exists (
  select 1 from monitor_tag where monitor_id = $MonitorId and tag_id = $TagId
);
"@ | Out-Null
}

function Ensure-StatusPage {
  $existingId = Invoke-KumaSqlScalar -Sql "select id from status_page where slug = '$statusPageSlug' limit 1;"
  if ($existingId) {
    Invoke-KumaSql -Sql @"
update status_page
set title = 'Hylono Local Stack',
    description = 'Local operator status page for the Hylono browser-facing stack.',
    icon = '',
    theme = 'light',
    published = 1,
    search_engine_index = 0,
    show_tags = 1,
    footer_text = 'Local-only status page seeded from launch-local-stack.ps1.',
    show_powered_by = 0,
    show_only_last_heartbeat = 1,
    auto_refresh_interval = 120,
    modified_date = CURRENT_TIMESTAMP
where id = $existingId;
"@ | Out-Null

    return [int]$existingId
  }

  Invoke-KumaSql -Sql @"
insert into status_page (
  slug,
  title,
  description,
  icon,
  theme,
  published,
  search_engine_index,
  show_tags,
  footer_text,
  show_powered_by,
  show_only_last_heartbeat,
  auto_refresh_interval
)
values (
  '$statusPageSlug',
  'Hylono Local Stack',
  'Local operator status page for the Hylono browser-facing stack.',
  '',
  'light',
  1,
  0,
  1,
  'Local-only status page seeded from launch-local-stack.ps1.',
  0,
  1,
  120
);
"@ | Out-Null

  return [int](Invoke-KumaSqlScalar -Sql "select id from status_page where slug = '$statusPageSlug' limit 1;")
}

function Ensure-StatusGroup {
  param(
    [Parameter(Mandatory = $true)][int]$StatusPageId,
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][int]$Weight
  )

  $existingId = Invoke-KumaSqlScalar -Sql "select id from [group] where status_page_id = $StatusPageId and name = '$Name' limit 1;"
  if ($existingId) {
    Invoke-KumaSql -Sql "update [group] set public = 1, active = 1, weight = $Weight where id = $existingId;" | Out-Null
    return [int]$existingId
  }

  Invoke-KumaSql -Sql "insert into [group] (name, public, active, weight, status_page_id) values ('$Name', 1, 1, $Weight, $StatusPageId);" | Out-Null
  return [int](Invoke-KumaSqlScalar -Sql "select id from [group] where status_page_id = $StatusPageId and name = '$Name' limit 1;")
}

function Ensure-MonitorGroup {
  param(
    [Parameter(Mandatory = $true)][int]$MonitorId,
    [Parameter(Mandatory = $true)][int]$GroupId,
    [Parameter(Mandatory = $true)][int]$Weight
  )

  Invoke-KumaSql -Sql @"
insert into monitor_group (monitor_id, group_id, weight, send_url)
select $MonitorId, $GroupId, $Weight, 0
where not exists (
  select 1 from monitor_group where monitor_id = $MonitorId and group_id = $GroupId
);
"@ | Out-Null

  Invoke-KumaSql -Sql "update monitor_group set weight = $Weight where monitor_id = $MonitorId and group_id = $GroupId;" | Out-Null
}

$monitorRows = @(
  [pscustomobject]@{ Id = 1; Name = "Main Site"; Group = "Core surfaces"; GroupWeight = 100; Tag = "core"; TagColor = "#06b6d4"; TagValue = "public" }
  [pscustomobject]@{ Id = 2; Name = "Control Panel"; Group = "Core surfaces"; GroupWeight = 200; Tag = "ops"; TagColor = "#0f172a"; TagValue = "operator" }
  [pscustomobject]@{ Id = 3; Name = "Uptime Kuma"; Group = "Core surfaces"; GroupWeight = 300; Tag = "ops"; TagColor = "#0f172a"; TagValue = "monitoring" }
  [pscustomobject]@{ Id = 4; Name = "MinIO Console"; Group = "Commerce and operations"; GroupWeight = 100; Tag = "storage"; TagColor = "#d97706"; TagValue = "s3" }
  [pscustomobject]@{ Id = 5; Name = "n8n"; Group = "App layer"; GroupWeight = 100; Tag = "automation"; TagColor = "#0f766e"; TagValue = "workflow" }
  [pscustomobject]@{ Id = 6; Name = "Medusa Health"; Group = "Commerce and operations"; GroupWeight = 200; Tag = "commerce"; TagColor = "#0891b2"; TagValue = "catalog" }
  [pscustomobject]@{ Id = 7; Name = "Lago Front"; Group = "Commerce and operations"; GroupWeight = 300; Tag = "commerce"; TagColor = "#0891b2"; TagValue = "billing" }
  [pscustomobject]@{ Id = 8; Name = "Snipe-IT"; Group = "Commerce and operations"; GroupWeight = 400; Tag = "ops"; TagColor = "#0f172a"; TagValue = "assets" }
  [pscustomobject]@{ Id = 9; Name = "Cal.com"; Group = "App layer"; GroupWeight = 200; Tag = "booking"; TagColor = "#7c3aed"; TagValue = "calendar" }
  [pscustomobject]@{ Id = 10; Name = "Twenty CRM"; Group = "App layer"; GroupWeight = 300; Tag = "crm"; TagColor = "#2563eb"; TagValue = "pipeline" }
  [pscustomobject]@{ Id = 11; Name = "Documenso"; Group = "App layer"; GroupWeight = 400; Tag = "docs"; TagColor = "#475569"; TagValue = "signing" }
  [pscustomobject]@{ Id = 12; Name = "Zitadel Health"; Group = "App layer"; GroupWeight = 500; Tag = "iam"; TagColor = "#9333ea"; TagValue = "identity" }
  [pscustomobject]@{ Id = 13; Name = "Novu Dashboard"; Group = "App layer"; GroupWeight = 600; Tag = "notifications"; TagColor = "#db2777"; TagValue = "delivery" }
)

$statusPageId = Ensure-StatusPage
$groupDefinitions = @(
  [pscustomobject]@{ Name = "Core surfaces"; Weight = 100 }
  [pscustomobject]@{ Name = "App layer"; Weight = 200 }
  [pscustomobject]@{ Name = "Commerce and operations"; Weight = 300 }
)

$groupIds = @{}
foreach ($group in $groupDefinitions) {
  $groupIds[$group.Name] = Ensure-StatusGroup -StatusPageId $statusPageId -Name $group.Name -Weight $group.Weight
}

$tagIds = @{}
foreach ($monitor in $monitorRows) {
  if (-not $tagIds.ContainsKey($monitor.Tag)) {
    $tagIds[$monitor.Tag] = Ensure-Tag -Name $monitor.Tag -Color $monitor.TagColor
  }

  Ensure-MonitorTag -MonitorId $monitor.Id -TagId $tagIds[$monitor.Tag] -Value $monitor.TagValue
  Ensure-MonitorGroup -MonitorId $monitor.Id -GroupId $groupIds[$monitor.Group] -Weight $monitor.GroupWeight
}

$knownStatusPageUrls = @(
  "http://localhost:3002/status/${statusPageSlug}",
  "http://localhost:3002/status-page/${statusPageSlug}",
  "http://localhost:3002/status/${statusPageSlug}?theme=light"
)

$resolvedStatusPageUrl = $knownStatusPageUrls | Where-Object { Test-HttpReady -Url $_ } | Select-Object -First 1
if (-not $resolvedStatusPageUrl) {
  $resolvedStatusPageUrl = $knownStatusPageUrls[0]
}

Write-Host "Uptime Kuma operator configuration seeded." -ForegroundColor Green
Write-Host "Status page: $resolvedStatusPageUrl"
