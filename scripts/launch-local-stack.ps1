Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
  $PSNativeCommandUseErrorActionPreference = $false
}

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envFile = Join-Path $root ".env"
$envLocalFile = Join-Path $root ".env.local"
$documensoSigningCertificateScript = Join-Path $root "scripts\generate-documenso-signing-certificate.ps1"
$infraCompose = Join-Path $root "docker\infrastructure\docker-compose.yml"
$phase1Compose = Join-Path $root "docker\phase-1a\docker-compose.yml"
$seedOperatorLoginsScript = Join-Path $root "scripts\seed-phase1a-operator-logins.ps1"
$seedUptimeKumaOperatorConfigScript = Join-Path $root "scripts\seed-uptime-kuma-operator-config.ps1"
$seedTwentyOperatorWorkspaceScript = Join-Path $root "scripts\seed-twenty-operator-workspace.ps1"
$seedN8nPhase2WorkflowsScript = Join-Path $root "scripts\seed-n8n-phase2-workflows.ps1"
$seedNovuOperatorBootstrapScript = Join-Path $root "scripts\seed-novu-operator-bootstrap.ps1"
$seedMedusaLocalCatalogScript = Join-Path $root "scripts\seed-medusa-local-catalog.ps1"
$seedCalcomOperatorBaselineScript = Join-Path $root "scripts\seed-calcom-operator-baseline.ps1"
$seedLagoLocalBillingScript = Join-Path $root "scripts\seed-lago-local-billing.ps1"
$seedSnipeitOperatorBaselineScript = Join-Path $root "scripts\seed-snipeit-operator-baseline.ps1"
$validateMailProviderEnvScript = Join-Path $root "scripts\validate-mail-provider-env.ps1"
$controlPanelDir = Join-Path $root "control-panel"
$controlPanelBuildId = Join-Path $controlPanelDir ".next\BUILD_ID"
$controlPanelLogPrefix = Join-Path $root ".tmp-control-panel-3005"
$controlPanelBuildSources = @(
  (Join-Path $controlPanelDir "app"),
  (Join-Path $controlPanelDir "components"),
  (Join-Path $controlPanelDir "lib"),
  (Join-Path $controlPanelDir "package.json"),
  $envFile,
  $envLocalFile
)
$siteBuildId = Join-Path $root ".next\BUILD_ID"
$siteLogPrefix = Join-Path $root ".tmp-site-3000"
$siteUrl = "http://localhost:3000"
$controlPanelUrl = "http://localhost:3005/admin"
$dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
$pnpmCmd = "C:\Program Files\nodejs\pnpm.CMD"
$siteBuildSources = @(
  (Join-Path $root "app"),
  (Join-Path $root "components"),
  (Join-Path $root "src"),
  (Join-Path $root "lib"),
  (Join-Path $root "content"),
  (Join-Path $root "config"),
  (Join-Path $root "index.css"),
  (Join-Path $root "package.json"),
  (Join-Path $root "proxy.ts"),
  $envFile,
  $envLocalFile
)

$serviceChecks = @(
  @{ Name = "Uptime Kuma"; Url = "http://localhost:3002" },
  @{ Name = "MinIO Console"; Url = "http://localhost:9001" },
  @{ Name = "n8n"; Url = "http://localhost:5678" },
  @{ Name = "Medusa"; Url = "http://localhost:8100/app/login" },
  @{ Name = "Lago"; Url = "http://localhost:8102" },
  @{ Name = "Snipe-IT"; Url = "http://localhost:8104/login" },
  @{ Name = "Cal.com"; Url = "http://localhost:8106" },
  @{ Name = "Twenty CRM"; Url = "http://localhost:8107" },
  @{ Name = "Documenso"; Url = "http://localhost:8108" },
  @{ Name = "Zitadel"; Url = "http://localhost:8109/ui/console?login_hint=root@zitadel.localhost" },
  @{ Name = "Novu"; Url = "http://localhost:8110" },
  @{ Name = "Control Panel"; Url = $controlPanelUrl }
)

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Test-HttpReady {
  param(
    [Parameter(Mandatory = $true)][string]$Url,
    [int]$TimeoutSec = 5,
    [int]$MaxStatusCode = 399
  )

  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec $TimeoutSec -MaximumRedirection 5
    return ($response.StatusCode -ge 200 -and $response.StatusCode -le $MaxStatusCode)
  } catch {
    if ($_.Exception.Response) {
      $statusCode = [int]$_.Exception.Response.StatusCode
      return ($statusCode -ge 200 -and $statusCode -le $MaxStatusCode)
    }
    return $false
  }
}

function Wait-HttpReady {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$Url,
    [int]$TimeoutSec = 120,
    [int]$MaxStatusCode = 399
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  while ((Get-Date) -lt $deadline) {
    if (Test-HttpReady -Url $Url -MaxStatusCode $MaxStatusCode) {
      Write-Host "Ready: $Name -> $Url" -ForegroundColor Green
      return
    }
    Start-Sleep -Seconds 2
  }

  throw "Timed out waiting for $Name at $Url"
}

function Get-LatestWriteTimeUtc {
  param([string[]]$Paths)

  $timestamps = New-Object System.Collections.Generic.List[datetime]

  foreach ($path in $Paths) {
    if (-not (Test-Path $path)) {
      continue
    }

    $item = Get-Item $path
    if ($item.PSIsContainer) {
      Get-ChildItem $path -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
        $timestamps.Add($_.LastWriteTimeUtc)
      }
      continue
    }

    $timestamps.Add($item.LastWriteTimeUtc)
  }

  if ($timestamps.Count -eq 0) {
    return $null
  }

  return ($timestamps | Sort-Object -Descending | Select-Object -First 1)
}

function New-ProcessLogPaths {
  param([Parameter(Mandatory = $true)][string]$Prefix)

  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  return @{
    Stdout = "$Prefix.$stamp.out.log"
    Stderr = "$Prefix.$stamp.err.log"
  }
}

function Get-PortListenerProcessIds {
  param([int]$Port)

  return Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique
}

function Get-PortListenerNewestStartTimeUtc {
  param([int]$Port)

  $processIds = Get-PortListenerProcessIds -Port $Port
  if (-not $processIds) {
    return $null
  }

  $startTimes = foreach ($processId in $processIds) {
    try {
      (Get-Process -Id $processId -ErrorAction Stop).StartTime.ToUniversalTime()
    } catch {
      continue
    }
  }

  if (-not $startTimes) {
    return $null
  }

  return ($startTimes | Sort-Object -Descending | Select-Object -First 1)
}

function Ensure-DockerReady {
  Write-Step "Checking Docker Desktop"
  try {
    docker info *> $null
  } catch {
    $global:LASTEXITCODE = 1
  }

  if ($LASTEXITCODE -eq 0) {
    Write-Host "Docker is already ready." -ForegroundColor Green
    return
  }

  if (-not (Test-Path $dockerDesktop)) {
    throw "Docker Desktop executable not found at $dockerDesktop"
  }

  Write-Host "Starting Docker Desktop..."
  Start-Process $dockerDesktop

  $deadline = (Get-Date).AddMinutes(4)
  while ((Get-Date) -lt $deadline) {
    try {
      docker info *> $null
    } catch {
      $global:LASTEXITCODE = 1
    }

    if ($LASTEXITCODE -eq 0) {
      Write-Host "Docker is ready." -ForegroundColor Green
      return
    }
    Start-Sleep -Seconds 5
  }

  throw "Docker Desktop did not become ready in time."
}

function Ensure-EnvFile {
  if (Test-Path $envFile) {
    return
  }

  Write-Step "Generating .env"
  & (Join-Path $root "scripts\generate-secrets.ps1")
}

function Sync-LocalEnvOverrides {
  if (-not (Test-Path $envFile)) {
    return
  }

  if (-not (Test-Path $envLocalFile)) {
    Copy-Item $envFile $envLocalFile -Force
    Write-Host "Created .env.local from .env for local app runtime." -ForegroundColor Green
    return
  }

  $envLocalContent = Get-Content $envLocalFile -Raw
  if ($envLocalContent -match 'CHANGE_ME_(32|64)') {
    Copy-Item $envFile $envLocalFile -Force
    Write-Host "Replaced placeholder .env.local values with local secrets from .env." -ForegroundColor Green
  }
}

function Ensure-DocumensoSigningCertificate {
  if (-not (Test-Path $documensoSigningCertificateScript)) {
    return
  }

  Write-Step "Ensuring Documenso signing certificate"
  & powershell -ExecutionPolicy Bypass -File $documensoSigningCertificateScript
  if ($LASTEXITCODE -ne 0) {
    throw "Documenso signing certificate generation failed."
  }
}

function Ensure-DocumensoCertificateMount {
  Write-Step "Ensuring Documenso certificate mount"

  if (-not (Test-Path (Join-Path $root "output\documenso-signing\certificate.p12") -PathType Leaf)) {
    Write-Warning "Documenso signing certificate file is missing on the host. Skipping mount verification."
    return
  }

  & docker exec hylono-documenso sh -lc "test -f /opt/documenso/certificate.p12"
  if ($LASTEXITCODE -eq 0) {
    Write-Host "Documenso certificate is mounted correctly." -ForegroundColor Green
    return
  }

  Write-Warning "Documenso certificate mount is stale. Recreating the Documenso container..."
  & docker compose -f $phase1Compose --env-file $envFile up -d --force-recreate documenso
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to recreate Documenso with the signing certificate mount."
  }
}

function Invoke-ComposeUp {
  param(
    [Parameter(Mandatory = $true)][string]$ComposeFile,
    [Parameter(Mandatory = $true)][string]$Label,
    [int]$Attempts = 2,
    [int]$RetryDelaySec = 20
  )

  $args = @("compose", "-f", $ComposeFile, "--env-file", $envFile, "up", "-d")

  for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
    Write-Step "Starting $Label (attempt $attempt/$Attempts)"
    & docker @args
    if ($LASTEXITCODE -eq 0) {
      return
    }

    if ($attempt -lt $Attempts) {
      Write-Warning "$Label did not start cleanly on attempt $attempt. Retrying in $RetryDelaySec seconds..."
      Start-Sleep -Seconds $RetryDelaySec
    }
  }

  throw "docker compose failed for $Label after $Attempts attempts"
}

function Ensure-ControlPanel {
  Write-Step "Ensuring control panel on 3005"
  $didBuild = Ensure-ControlPanelBuild
  $listenerStartTimeUtc = Get-PortListenerNewestStartTimeUtc -Port 3005
  $buildIsNewerThanProcess = $false

  if (-not $didBuild -and $listenerStartTimeUtc -and (Test-Path $controlPanelBuildId)) {
    $buildIsNewerThanProcess = (Get-Item $controlPanelBuildId).LastWriteTimeUtc -gt $listenerStartTimeUtc
  }

  if ((Test-HttpReady -Url $controlPanelUrl -MaxStatusCode 399) -and -not $didBuild -and -not $buildIsNewerThanProcess) {
    Write-Host "Control panel already responds on 3005." -ForegroundColor Green
    return
  }

  $processIds = Get-PortListenerProcessIds -Port 3005
  if ($processIds) {
    foreach ($processId in $processIds) {
      try {
        Stop-Process -Id $processId -Force -ErrorAction Stop
        Write-Host "Stopped PID $processId on port 3005."
      } catch {
        Write-Warning "Could not stop PID $processId on port 3005: $($_.Exception.Message)"
      }
    }
  }

  $controlPanelLogs = New-ProcessLogPaths -Prefix $controlPanelLogPrefix
  Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run start" -WorkingDirectory $controlPanelDir -RedirectStandardOutput $controlPanelLogs.Stdout -RedirectStandardError $controlPanelLogs.Stderr -WindowStyle Hidden
  Wait-HttpReady -Name "Control Panel" -Url $controlPanelUrl -TimeoutSec 60
}

function Ensure-ControlPanelBuild {
  Write-Step "Ensuring control panel production build"
  $needsBuild = -not (Test-Path $controlPanelBuildId)

  if (-not $needsBuild) {
    $latestSourceWrite = Get-LatestWriteTimeUtc -Paths $controlPanelBuildSources
    $buildWrite = (Get-Item $controlPanelBuildId).LastWriteTimeUtc
    if ($latestSourceWrite -and $latestSourceWrite -gt $buildWrite) {
      $needsBuild = $true
    }
  }

  if (-not $needsBuild) {
    Write-Host "Control panel production build is current." -ForegroundColor Green
    return $false
  }

  Write-Host "Building control panel..."
  Push-Location $controlPanelDir
  try {
    & npm run build
    if ($LASTEXITCODE -ne 0) {
      throw "npm run build failed for control panel."
    }
  } finally {
    Pop-Location
  }

  return $true
}

function Ensure-SiteBuild {
  Write-Step "Ensuring website production build"
  $needsBuild = -not (Test-Path $siteBuildId)

  if (-not $needsBuild) {
    $latestSourceWrite = Get-LatestWriteTimeUtc -Paths $siteBuildSources
    $buildWrite = (Get-Item $siteBuildId).LastWriteTimeUtc
    if ($latestSourceWrite -and $latestSourceWrite -gt $buildWrite) {
      $needsBuild = $true
    }
  }

  if (-not $needsBuild) {
    Write-Host "Website production build is current." -ForegroundColor Green
    return $false
  }

  if (-not (Test-Path $pnpmCmd)) {
    throw "pnpm launcher not found at $pnpmCmd"
  }

  Push-Location $root
  try {
    & $pnpmCmd build
    if ($LASTEXITCODE -ne 0) {
      throw "pnpm build failed for website."
    }
  } finally {
    Pop-Location
  }

  return $true
}

function Ensure-Site3000 {
  Write-Step "Ensuring website on 3000"
  $didBuild = Ensure-SiteBuild
  $listenerStartTimeUtc = Get-PortListenerNewestStartTimeUtc -Port 3000
  $buildIsNewerThanProcess = $false

  if (-not $didBuild -and $listenerStartTimeUtc -and (Test-Path $siteBuildId)) {
    $buildIsNewerThanProcess = (Get-Item $siteBuildId).LastWriteTimeUtc -gt $listenerStartTimeUtc
  }

  if ((Test-HttpReady -Url $siteUrl -MaxStatusCode 399) -and -not $didBuild -and -not $buildIsNewerThanProcess) {
    Write-Host "Site already responds on 3000." -ForegroundColor Green
    Start-Process $siteUrl
    return
  }

  $processIds = Get-PortListenerProcessIds -Port 3000
  if ($processIds) {
    foreach ($processId in $processIds) {
      try {
        Stop-Process -Id $processId -Force -ErrorAction Stop
        Write-Host "Stopped PID $processId on port 3000."
      } catch {
        Write-Warning "Could not stop PID $processId on port 3000: $($_.Exception.Message)"
      }
    }
  }

  if (-not (Test-Path $pnpmCmd)) {
    throw "pnpm launcher not found at $pnpmCmd"
  }

  $siteLogs = New-ProcessLogPaths -Prefix $siteLogPrefix
  Start-Process -FilePath $pnpmCmd -ArgumentList "start" -WorkingDirectory $root -RedirectStandardOutput $siteLogs.Stdout -RedirectStandardError $siteLogs.Stderr -WindowStyle Hidden
  Wait-HttpReady -Name "Website" -Url $siteUrl -TimeoutSec 120 -MaxStatusCode 399
  Start-Process $siteUrl
}

function Wait-ServiceChecks {
  Write-Step "Waiting for local app URLs"
  $pending = @{}
  foreach ($service in $serviceChecks) {
    $pending[$service.Name] = $service.Url
  }

  $deadline = (Get-Date).AddMinutes(6)
  while ((Get-Date) -lt $deadline -and $pending.Count -gt 0) {
    foreach ($serviceName in @($pending.Keys)) {
      $url = $pending[$serviceName]
      if (Test-HttpReady -Url $url -MaxStatusCode 399) {
        Write-Host "Ready: $serviceName -> $url" -ForegroundColor Green
        $pending.Remove($serviceName)
      }
    }

    if ($pending.Count -eq 0) {
      return
    }

    Start-Sleep -Seconds 4
  }

  if ($pending.Count -gt 0) {
    $missing = $pending.GetEnumerator() | ForEach-Object { "$($_.Key): $($_.Value)" }
    throw "Timed out waiting for services:`n$($missing -join "`n")"
  }
}

function Ensure-Phase1OperatorLogins {
  if (-not (Test-Path $seedOperatorLoginsScript)) {
    return
  }

  Write-Step "Reasserting local operator logins"
  & powershell -ExecutionPolicy Bypass -File $seedOperatorLoginsScript
  if ($LASTEXITCODE -ne 0) {
    throw "Operator login seeding failed."
  }
}

function Invoke-OptionalSeedScript {
  param(
    [Parameter(Mandatory = $true)][string]$Label,
    [Parameter(Mandatory = $true)][string]$ScriptPath
  )

  if (-not (Test-Path $ScriptPath)) {
    return
  }

  Write-Step $Label
  & powershell -ExecutionPolicy Bypass -File $ScriptPath
  if ($LASTEXITCODE -ne 0) {
    throw "$Label failed."
  }
}

function Ensure-Phase2OperatorWorkspaces {
  Invoke-OptionalSeedScript -Label "Seeding Uptime Kuma operator configuration" -ScriptPath $seedUptimeKumaOperatorConfigScript
  Invoke-OptionalSeedScript -Label "Seeding Medusa local catalog baseline" -ScriptPath $seedMedusaLocalCatalogScript
  Invoke-OptionalSeedScript -Label "Seeding Cal.com operator baseline" -ScriptPath $seedCalcomOperatorBaselineScript
  Invoke-OptionalSeedScript -Label "Seeding Lago local billing baseline" -ScriptPath $seedLagoLocalBillingScript
  Invoke-OptionalSeedScript -Label "Seeding Snipe-IT operator baseline" -ScriptPath $seedSnipeitOperatorBaselineScript
  Invoke-OptionalSeedScript -Label "Seeding Twenty CRM operator workspace" -ScriptPath $seedTwentyOperatorWorkspaceScript
  Invoke-OptionalSeedScript -Label "Reconciling n8n Phase 2 workflows" -ScriptPath $seedN8nPhase2WorkflowsScript
  Invoke-OptionalSeedScript -Label "Seeding Novu operator bootstrap" -ScriptPath $seedNovuOperatorBootstrapScript
  Invoke-OptionalSeedScript -Label "Validating mail provider profile" -ScriptPath $validateMailProviderEnvScript
}

Set-Location $root
Ensure-DockerReady
Ensure-EnvFile
Sync-LocalEnvOverrides
Ensure-DocumensoSigningCertificate
Invoke-ComposeUp -ComposeFile $infraCompose -Label "infrastructure"
Invoke-ComposeUp -ComposeFile $phase1Compose -Label "Phase 1A"
Ensure-DocumensoCertificateMount
Ensure-ControlPanel
Wait-ServiceChecks
Ensure-Phase1OperatorLogins
Ensure-Phase2OperatorWorkspaces
Ensure-Site3000

Write-Host ""
Write-Host "Local stack is ready:" -ForegroundColor Green
Write-Host "  Site:           $siteUrl"
Write-Host "  Control Panel:  $controlPanelUrl"
