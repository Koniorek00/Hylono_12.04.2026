Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$n8nContainer = "hylono-n8n"
$postgresContainer = "hylono-postgres"
$workflowSourceDir = Join-Path $root "n8n-workflows\phase-2-local"
$backupRootDir = Join-Path $root "output\n8n-backups"
$containerImportDir = "/tmp/hylono-phase2-local"
$containerBackupDir = "/tmp/hylono-phase2-backup"
$desiredTagNames = @("local", "phase-2", "intake")
$staleWorkflowNames = @(
  "lead_created",
  "document_signed",
  "booking_requested_test",
  "order_created_legacy"
)

function Invoke-N8nCommand {
  param(
    [Parameter(Mandatory = $true)][string[]]$Arguments
  )

  $output = & docker exec $n8nContainer n8n @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "n8n command failed: n8n $($Arguments -join ' ')"
  }

  return $output
}

function Invoke-N8nShell {
  param(
    [Parameter(Mandatory = $true)][string]$Command
  )

  & docker exec $n8nContainer sh -lc $Command
  if ($LASTEXITCODE -ne 0) {
    throw "n8n shell command failed: $Command"
  }
}

function Invoke-N8nDbScalar {
  param(
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $output = $Sql | & docker exec -i $postgresContainer psql -U postgres -d n8n_db -At -f -
  if ($LASTEXITCODE -ne 0) {
    throw "n8n_db scalar query failed."
  }

  return ($output | Select-Object -First 1)
}

function Invoke-N8nDb {
  param(
    [Parameter(Mandatory = $true)][string]$Sql
  )

  $Sql | & docker exec -i $postgresContainer psql -U postgres -d n8n_db -At -f - | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "n8n_db query failed."
  }
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

function Restart-N8nContainer {
  & docker restart $n8nContainer | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to restart $n8nContainer."
  }

  $deadline = (Get-Date).AddMinutes(2)
  while ((Get-Date) -lt $deadline) {
    if (Test-HttpReady -Url "http://localhost:5678") {
      return
    }

    Start-Sleep -Seconds 2
  }

  throw "Timed out waiting for n8n after restart."
}

function Get-DesiredWorkflows {
  if (-not (Test-Path $workflowSourceDir)) {
    throw "Workflow source directory not found: $workflowSourceDir"
  }

  return Get-ChildItem -Path $workflowSourceDir -Filter *.json -File |
    Sort-Object Name |
    ForEach-Object {
      $raw = Get-Content -Path $_.FullName -Raw
      $json = $raw | ConvertFrom-Json
      [pscustomobject]@{
        Id = [string]$json.id
        Name = [string]$json.name
        FileName = $_.Name
        Path = $_.FullName
      }
    }
}

function Get-LiveWorkflowMap {
  $map = @{}
  $lines = Invoke-N8nCommand -Arguments @("list:workflow")
  foreach ($line in $lines) {
    if ($line -match "^([^|]+)\|(.+)$") {
      $map[$matches[2].Trim()] = $matches[1].Trim()
    }
  }

  return $map
}

function Get-PrimaryProjectId {
  $projectId = Invoke-N8nDbScalar -Sql "select id from project limit 1;"
  if (-not $projectId) {
    throw "Could not resolve an n8n project id."
  }

  return $projectId
}

function Ensure-CoreFolderId {
  param(
    [Parameter(Mandatory = $true)][string]$ProjectId
  )

  $existingId = Invoke-N8nDbScalar -Sql "select id from folder where name = 'Core' limit 1;"
  if ($existingId) {
    return $existingId
  }

  $newId = [guid]::NewGuid().ToString()
  $insertSql = @'
insert into folder (id, name, "projectId")
values ('{0}', 'Core', '{1}')
on conflict (id) do nothing;
'@ -f $newId, $ProjectId
  Invoke-N8nDb -Sql $insertSql

  return $newId
}

function Ensure-TagId {
  param(
    [Parameter(Mandatory = $true)][string]$TagName
  )

  $existingId = Invoke-N8nDbScalar -Sql "select id from tag_entity where name = '$TagName' limit 1;"
  if ($existingId) {
    return $existingId
  }

  $newId = [guid]::NewGuid().ToString()
  Invoke-N8nDb -Sql @"
insert into tag_entity (id, name)
values ('$newId', '$TagName')
on conflict (name) do nothing;
"@

  $resolvedId = Invoke-N8nDbScalar -Sql "select id from tag_entity where name = '$TagName' limit 1;"
  if (-not $resolvedId) {
    throw "Failed to resolve tag id for '$TagName'."
  }

  return $resolvedId
}

function Ensure-WorkflowTag {
  param(
    [Parameter(Mandatory = $true)][string]$WorkflowId,
    [Parameter(Mandatory = $true)][string]$TagId
  )

  $insertSql = @'
insert into workflows_tags ("workflowId", "tagId")
values ('{0}', '{1}')
on conflict do nothing;
'@ -f $WorkflowId, $TagId
  Invoke-N8nDb -Sql $insertSql
}

function Ensure-WorkflowFolder {
  param(
    [Parameter(Mandatory = $true)][string]$WorkflowId,
    [Parameter(Mandatory = $true)][string]$FolderId
  )

  $updateSql = @'
update workflow_entity
set "parentFolderId" = '{0}'
where id = '{1}';
'@ -f $FolderId, $WorkflowId
  Invoke-N8nDb -Sql $updateSql
}

function Export-BackupSnapshot {
  param(
    [Parameter(Mandatory = $true)][string]$BackupDir
  )

  New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
  Invoke-N8nShell -Command "rm -rf $containerBackupDir && mkdir -p $containerBackupDir"
  Invoke-N8nCommand -Arguments @("export:workflow", "--backup", "--output=$containerBackupDir")
  & docker cp "${n8nContainer}:$containerBackupDir/." $BackupDir | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to copy n8n workflow backup to host."
  }
}

$desiredWorkflows = Get-DesiredWorkflows
$desiredWorkflowIds = @($desiredWorkflows | ForEach-Object { $_.Id })
$projectId = Get-PrimaryProjectId
$coreFolderId = Ensure-CoreFolderId -ProjectId $projectId

Invoke-N8nShell -Command "rm -rf $containerImportDir && mkdir -p $containerImportDir"
foreach ($workflow in $desiredWorkflows) {
  $containerWorkflowPath = "$containerImportDir/$($workflow.FileName)"
  & docker cp $workflow.Path "${n8nContainer}:$containerWorkflowPath" | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to copy workflow file into container: $($workflow.FileName)"
  }

  Invoke-N8nCommand -Arguments @("import:workflow", "--input=$containerWorkflowPath", "--projectId=$projectId")
}

$liveWorkflowMap = Get-LiveWorkflowMap

foreach ($workflow in $desiredWorkflows) {
  if (-not $liveWorkflowMap.ContainsKey($workflow.Name)) {
    throw "Workflow '$($workflow.Name)' was not visible after import."
  }

  Invoke-N8nCommand -Arguments @("publish:workflow", "--id=$($workflow.Id)")
  Ensure-WorkflowFolder -WorkflowId $workflow.Id -FolderId $coreFolderId
}

foreach ($staleName in $staleWorkflowNames) {
  if ($liveWorkflowMap.ContainsKey($staleName)) {
    Invoke-N8nCommand -Arguments @("unpublish:workflow", "--id=$($liveWorkflowMap[$staleName])")
  }
}

$tagIds = @{}
foreach ($tagName in $desiredTagNames) {
  $tagIds[$tagName] = Ensure-TagId -TagName $tagName
}

foreach ($workflowId in $desiredWorkflowIds) {
  foreach ($tagId in $tagIds.Values) {
    Ensure-WorkflowTag -WorkflowId $workflowId -TagId $tagId
  }
}

Restart-N8nContainer

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$snapshotDir = Join-Path $backupRootDir "phase2-local-$timestamp"
$latestDir = Join-Path $backupRootDir "phase2-local-latest"
Export-BackupSnapshot -BackupDir $snapshotDir
if (Test-Path $latestDir) {
  Remove-Item -Path $latestDir -Recurse -Force
}
Copy-Item -Path $snapshotDir -Destination $latestDir -Recurse

$activeWorkflowCount = Invoke-N8nDbScalar -Sql "select count(*) from workflow_entity where active = true;"
$tagCountSql = @'
select count(*)
from workflows_tags
where "workflowId" in ('{0}');
'@ -f ($desiredWorkflowIds -join "','")
$tagCount = Invoke-N8nDbScalar -Sql $tagCountSql

Write-Host "n8n Phase 2 workflows reconciled." -ForegroundColor Green
Write-Host "Project: $projectId"
Write-Host "Folder: Core ($coreFolderId)"
Write-Host "Published workflows: $($desiredWorkflowIds.Count)"
Write-Host "Active workflows total: $activeWorkflowCount"
Write-Host "Workflow tag assignments: $tagCount"
Write-Host "Backup snapshot: $snapshotDir"
