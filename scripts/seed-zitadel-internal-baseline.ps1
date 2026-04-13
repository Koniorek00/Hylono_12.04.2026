Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$outputDir = Join-Path $root "output\zitadel-bootstrap"
$outputPath = Join-Path $outputDir "local-baseline-state.json"
$envFile = Join-Path $root ".env"
$envLocalFile = Join-Path $root ".env.local"
$baseUrl = "http://127.0.0.1:8109"
$hostHeader = "localhost"
$defaultProjectName = "Hylono Internal"

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
    [hashtable]$Base,
    [hashtable]$Overrides
  )

  foreach ($key in $Overrides.Keys) {
    $Base[$key] = $Overrides[$key]
  }

  return $Base
}

function Get-PropertyValue {
  param(
    [object]$Object,
    [string]$Name,
    $Default = $null
  )

  if ($null -eq $Object) {
    return $Default
  }

  $property = $Object.PSObject.Properties[$Name]
  if ($null -eq $property -or $null -eq $property.Value) {
    return $Default
  }

  return $property.Value
}

function Get-ZitadelLoginClientPat {
  $containerInspect = (& docker inspect hylono-zitadel | ConvertFrom-Json)[0]
  $volumeName = @($containerInspect.Mounts | Where-Object { $_.Destination -eq "/zitadel/bootstrap" } | Select-Object -ExpandProperty Name -First 1)
  if (-not $volumeName) {
    throw "Could not resolve the Zitadel bootstrap volume."
  }

  $token = (& docker run --rm -v "${volumeName}:/zitadel/bootstrap" alpine cat /zitadel/bootstrap/login-client.pat).Trim()
  if (-not $token) {
    throw "login-client.pat is missing from the Zitadel bootstrap volume."
  }

  return $token
}

function Invoke-ZitadelApi {
  param(
    [Parameter(Mandatory = $true)][string]$Token,
    [Parameter(Mandatory = $true)][string]$Path,
    [ValidateSet("GET", "POST")][string]$Method = "GET",
    [object]$Body = $null
  )

  $headers = @{
    Authorization = "Bearer $Token"
    Host = $hostHeader
  }

  if ($Method -eq "GET") {
    return Invoke-RestMethod -Headers $headers -Uri "$baseUrl$Path" -Method GET -TimeoutSec 20
  }

  $resolvedBody = if ($null -eq $Body) { @{} } else { $Body }
  return Invoke-RestMethod -Headers $headers -Uri "$baseUrl$Path" -Method POST -ContentType "application/json" -Body ($resolvedBody | ConvertTo-Json -Depth 10) -TimeoutSec 20
}

function Ensure-HylonoProject {
  param(
    [Parameter(Mandatory = $true)][string]$OwnerToken,
    [Parameter(Mandatory = $true)][string]$ProjectName
  )

  $projects = Invoke-ZitadelApi -Token $OwnerToken -Path "/management/v1/projects/_search" -Method POST -Body @{}
  $existing = @($projects.result) | Where-Object { $_.name -eq $ProjectName } | Select-Object -First 1
  if ($existing) {
    return $existing
  }

  $created = Invoke-ZitadelApi -Token $OwnerToken -Path "/management/v1/projects" -Method POST -Body @{
    name = $ProjectName
  }

  if (-not $created.id) {
    throw "Zitadel project creation did not return an id."
  }

  $projects = Invoke-ZitadelApi -Token $OwnerToken -Path "/management/v1/projects/_search" -Method POST -Body @{}
  return @($projects.result) | Where-Object { $_.id -eq $created.id } | Select-Object -First 1
}

$envMap = Parse-EnvFile -Path $envFile
if (Test-Path $envLocalFile) {
  $envMap = Merge-EnvMaps -Base $envMap -Overrides (Parse-EnvFile -Path $envLocalFile)
}

$loginClientPat = Get-ZitadelLoginClientPat
$org = Invoke-ZitadelApi -Token $loginClientPat -Path "/management/v1/orgs/me"
$projects = Invoke-ZitadelApi -Token $loginClientPat -Path "/management/v1/projects/_search" -Method POST -Body @{}
$projectList = @($projects.result)
$defaultProject = $projectList | Where-Object { $_.name -eq "ZITADEL" } | Select-Object -First 1

$defaultApps = @()
if ($defaultProject) {
  $appsResponse = Invoke-ZitadelApi -Token $loginClientPat -Path "/management/v1/projects/$($defaultProject.id)/apps/_search" -Method POST -Body @{}
  $defaultApps = @($appsResponse.result)
}

$ownerPat = $envMap["ZITADEL_OWNER_PAT"]
$hylonoProject = $null
$ownerAction = "blocked-owner-pat-missing"

if ($ownerPat) {
  try {
    $hylonoProject = Ensure-HylonoProject -OwnerToken $ownerPat -ProjectName $defaultProjectName
    $ownerAction = if ($hylonoProject) { "project-ready" } else { "project-unknown" }
  } catch {
    $ownerAction = "owner-pat-present-but-project-create-failed"
  }
}

$state = [ordered]@{
  appliedAt = (Get-Date).ToString("o")
  baseUrl = $baseUrl
  hostHeader = $hostHeader
  loginClientPat = [ordered]@{
    present = $true
    length = $loginClientPat.Length
  }
  organization = [ordered]@{
    id = $org.org.id
    name = $org.org.name
    primaryDomain = $org.org.primaryDomain
    state = $org.org.state
  }
  projects = @(
    foreach ($project in $projectList) {
      [ordered]@{
        id = $project.id
        name = $project.name
        state = $project.state
      }
    }
  )
  defaultProjectApps = @(
    foreach ($app in $defaultApps) {
      [ordered]@{
        id = $app.id
        name = $app.name
        state = $app.state
        clientId = if (Get-PropertyValue -Object $app -Name "oidcConfig") { (Get-PropertyValue -Object $app -Name "oidcConfig").clientId } elseif (Get-PropertyValue -Object $app -Name "apiConfig") { (Get-PropertyValue -Object $app -Name "apiConfig").clientId } else { $null }
        appType = if (Get-PropertyValue -Object $app -Name "oidcConfig") { "oidc" } elseif (Get-PropertyValue -Object $app -Name "apiConfig") { "api" } elseif (Get-PropertyValue -Object $app -Name "samlConfig") { "saml" } else { "unknown" }
      }
    }
  )
  hylonoProject = if ($hylonoProject) {
    [ordered]@{
      id = $hylonoProject.id
      name = $hylonoProject.name
      state = $hylonoProject.state
    }
  } else {
    $null
  }
  ownerAction = $ownerAction
}

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
$state | ConvertTo-Json -Depth 10 | Set-Content -Path $outputPath -Encoding UTF8

Write-Host "Zitadel local baseline verified." -ForegroundColor Green
Write-Host ("Organization: {0} ({1})" -f $org.org.name, $org.org.id) -ForegroundColor Green
Write-Host ("Projects: {0}" -f $projectList.Count) -ForegroundColor Green
Write-Host ("Default project apps: {0}" -f $defaultApps.Count) -ForegroundColor Green
Write-Host ("Owner action: {0}" -f $ownerAction) -ForegroundColor Yellow
Write-Host ("State file: {0}" -f $outputPath) -ForegroundColor Green
