param(
  [ValidateSet("active", "1a")]
  [string]$Profile = "active"
)

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
$seedActiveWaveOperatorBaselineScript = Join-Path $root "scripts\seed-active-wave-operator-baseline.ps1"
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
$script:sitePackageRunner = $null
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

$activePhase1Services = @(
  "twenty",
  "novu-api",
  "novu-worker",
  "novu-ws",
  "novu-dashboard",
  "n8n",
  "n8n-worker"
)

$serviceChecks = @(
  @{ Name = "Uptime Kuma"; Url = "http://localhost:3002" },
  @{ Name = "MinIO Console"; Url = "http://localhost:9001" },
  @{ Name = "Prometheus"; Url = "http://localhost:9090/-/ready" },
  @{ Name = "n8n"; Url = "http://localhost:5678" },
  @{ Name = "Kong Gateway"; Url = "http://localhost:8000/medusa/health" },
  @{ Name = "Twenty CRM"; Url = "http://localhost:8107" },
  @{ Name = "Novu"; Url = "http://localhost:8110" },
  @{ Name = "Control Panel"; Url = $controlPanelUrl }
)

$fullLabServiceChecks = @(
  @{ Name = "Medusa"; Url = "http://localhost:8100/app/login" },
  @{ Name = "Lago"; Url = "http://localhost:8102" },
  @{ Name = "Snipe-IT"; Url = "http://localhost:8104/login" },
  @{ Name = "Cal.com"; Url = "http://localhost:8106" },
  @{ Name = "Documenso"; Url = "http://localhost:8108" },
  @{ Name = "Zitadel"; Url = "http://localhost:8109/ui/console?login_hint=root@zitadel.localhost" }
)

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Get-EnvValue {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [string]$FilePath = $envFile
  )

  if (-not (Test-Path $FilePath)) {
    return $null
  }

  foreach ($line in Get-Content $FilePath) {
    if ($line -match "^\s*$([regex]::Escape($Name))=(.*)$") {
      return $Matches[1]
    }
  }

  return $null
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

function Test-NativeCommandSuccess {
  param(
    [Parameter(Mandatory = $true)][string]$FilePath,
    [string[]]$ArgumentList = @()
  )

  if (-not (Test-Path $FilePath)) {
    return $false
  }

  try {
    & $FilePath @ArgumentList *> $null
  } catch {
    return $false
  }

  return ($LASTEXITCODE -eq 0)
}

function Get-SitePackageRunner {
  if ($script:sitePackageRunner) {
    return $script:sitePackageRunner
  }

  $pnpmCommand = Get-Command pnpm.cmd -ErrorAction SilentlyContinue | Select-Object -First 1
  $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue | Select-Object -First 1
  $corepackCommand = Get-Command corepack -ErrorAction SilentlyContinue | Select-Object -First 1
  $candidates = @(
    @{
      Name = "pnpm"
      FilePath = if (Test-Path $pnpmCmd) { $pnpmCmd } else { $null }
      BaseArgs = @()
      VersionArgs = @("--version")
    },
    @{
      Name = "pnpm"
      FilePath = if ($pnpmCommand) { $pnpmCommand.Source } else { $null }
      BaseArgs = @()
      VersionArgs = @("--version")
    },
    @{
      Name = "corepack pnpm"
      FilePath = if ($corepackCommand) { $corepackCommand.Source } else { $null }
      BaseArgs = @("pnpm")
      VersionArgs = @("pnpm", "--version")
    },
    @{
      Name = "npm"
      FilePath = if ($npmCommand) { $npmCommand.Source } else { $null }
      BaseArgs = @("run")
      VersionArgs = @("--version")
    }
  )

  $attempted = New-Object System.Collections.Generic.List[string]
  $seenCandidates = New-Object System.Collections.Generic.HashSet[string]
  foreach ($candidate in $candidates) {
    if ([string]::IsNullOrWhiteSpace($candidate.FilePath)) {
      continue
    }

    $candidateKey = "$($candidate.Name)|$($candidate.FilePath)"
    if (-not $seenCandidates.Add($candidateKey)) {
      continue
    }

    $attempted.Add("$($candidate.Name) -> $($candidate.FilePath)")
    if (Test-NativeCommandSuccess -FilePath $candidate.FilePath -ArgumentList $candidate.VersionArgs) {
      $script:sitePackageRunner = @{
        Name = $candidate.Name
        FilePath = $candidate.FilePath
        BaseArgs = [string[]]$candidate.BaseArgs
      }
      Write-Host "Website package runner: $($candidate.Name) -> $($candidate.FilePath)" -ForegroundColor DarkGray
      return $script:sitePackageRunner
    }

    Write-Warning "Website package runner is present but unusable: $($candidate.Name) -> $($candidate.FilePath)"
  }

  throw "Could not resolve a working package runner for the website. Checked: $($attempted -join '; ')"
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
  if ($Profile -ne "1a") {
    return
  }

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
  if ($Profile -ne "1a") {
    return
  }

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
  $recreateExitCode = Invoke-DockerCommand -Arguments @("compose", "-f", $phase1Compose, "--env-file", $envFile, "up", "-d", "--force-recreate", "documenso")
  if ($recreateExitCode -ne 0) {
    throw "Failed to recreate Documenso with the signing certificate mount."
  }
}

function Invoke-DockerCommand {
  param([Parameter(Mandatory = $true)][string[]]$Arguments)

  $stdoutFile = [System.IO.Path]::GetTempFileName()
  $stderrFile = [System.IO.Path]::GetTempFileName()
  $argumentString = (
    $Arguments | ForEach-Object {
      if ($_ -match '[\s"]') {
        '"' + ($_ -replace '"', '\"') + '"'
      } else {
        $_
      }
    }
  ) -join " "

  try {
    $process = Start-Process -FilePath "docker.exe" -ArgumentList $argumentString -NoNewWindow -Wait -PassThru -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile

    foreach ($path in @($stdoutFile, $stderrFile)) {
      if (Test-Path $path) {
        Get-Content $path | ForEach-Object { Write-Host $_ }
      }
    }

    return $process.ExitCode
  } finally {
    Remove-Item $stdoutFile, $stderrFile -Force -ErrorAction SilentlyContinue
  }
}

function Get-ContainerLogs {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [int]$Tail = 200
  )

  $logs = & docker logs $Name --tail $Tail 2>&1
  if ($LASTEXITCODE -ne 0) {
    return ""
  }

  return ($logs | Out-String)
}

function Get-SelectedServiceChecks {
  if ($Profile -eq "1a") {
    return $serviceChecks + $fullLabServiceChecks
  }

  return $serviceChecks
}

function Get-ContainerVolumeName {
  param(
    [Parameter(Mandatory = $true)][string]$ContainerName,
    [Parameter(Mandatory = $true)][string]$Destination
  )

  $format = "{{range .Mounts}}{{if eq .Destination `"$Destination`"}}{{.Name}}{{end}}{{end}}"
  $volumeName = & docker inspect $ContainerName --format $format 2>$null
  if ($LASTEXITCODE -ne 0) {
    return $null
  }

  $volumeName = ($volumeName | Out-String).Trim()
  if ([string]::IsNullOrWhiteSpace($volumeName)) {
    return $null
  }

  return $volumeName
}

function Repair-UptimeKumaBootstrapState {
  $volumeName = Get-ContainerVolumeName -ContainerName "hylono-uptime-kuma" -Destination "/app/data"
  if ([string]::IsNullOrWhiteSpace($volumeName)) {
    return $false
  }

  $stateProbe = @'
if [ -f /app/data/kuma.db ]; then
  SIZE=$(wc -c < /app/data/kuma.db | tr -d ' ')
else
  SIZE=missing
fi

HAS_WAL=0
if [ -f /app/data/kuma.db-wal ] || [ -f /app/data/kuma.db-shm ]; then
  HAS_WAL=1
fi

HAS_SETTING_TABLE=missing
if [ -f /app/data/kuma.db ]; then
  if sqlite3 /app/data/kuma.db "select name from sqlite_master where type='table' and name='setting';" 2>/dev/null | grep -qx "setting"; then
    HAS_SETTING_TABLE=1
  else
    HAS_SETTING_TABLE=0
  fi
fi

echo "SIZE=$SIZE"
echo "HAS_WAL=$HAS_WAL"
echo "HAS_SETTING_TABLE=$HAS_SETTING_TABLE"
'@

  $stateLines = & docker run --rm -v "${volumeName}:/app/data" louislam/uptime-kuma:2 sh -lc $stateProbe 2>$null
  if ($LASTEXITCODE -ne 0) {
    return $false
  }

  $state = @{}
  foreach ($line in $stateLines) {
    if ($line -match '^([^=]+)=(.*)$') {
      $state[$Matches[1]] = $Matches[2]
    }
  }

  $dbSizeText = if ($state.ContainsKey("SIZE")) { $state["SIZE"] } else { "missing" }
  $hasWalFiles = $state.ContainsKey("HAS_WAL") -and $state["HAS_WAL"] -eq "1"
  $hasSettingTable = $state.ContainsKey("HAS_SETTING_TABLE") -and $state["HAS_SETTING_TABLE"] -eq "1"
  $dbSize = 0
  $hasDbFile = [int]::TryParse($dbSizeText, [ref]$dbSize)

  $needsCleanup =
    ((-not $hasDbFile) -and $hasWalFiles) -or
    ($hasDbFile -and $dbSize -eq 0) -or
    ($hasDbFile -and -not $hasSettingTable)

  if (-not $needsCleanup) {
    return $false
  }

  Write-Step "Repairing Uptime Kuma bootstrap state"
  & docker run --rm -v "${volumeName}:/app/data" busybox sh -lc "rm -f /app/data/kuma.db /app/data/kuma.db-shm /app/data/kuma.db-wal /app/data/db-config.json"
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to clean the broken Uptime Kuma database bootstrap files."
  }

  & docker restart hylono-uptime-kuma *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to restart Uptime Kuma after cleaning its broken bootstrap state."
  }

  Write-Host "Removed the broken Kuma SQLite bootstrap files and restarted the container." -ForegroundColor Green
  return $true
}

function Repair-LagoPgPartmanOwnership {
  $owner = & docker exec hylono-postgres psql -U postgres -d lago_db -t -A -c "select pg_get_userbyid(extowner) from pg_extension where extname = 'pg_partman';" 2>$null
  if ($LASTEXITCODE -ne 0) {
    return $false
  }

  $owner = ($owner | Out-String).Trim()
  if ([string]::IsNullOrWhiteSpace($owner) -or $owner -eq "lago") {
    return $false
  }

  Write-Step "Repairing Lago pg_partman ownership"
  & docker exec hylono-postgres psql -U postgres -d lago_db -v ON_ERROR_STOP=1 -c "DROP EXTENSION IF EXISTS pg_partman CASCADE; SET ROLE lago; CREATE EXTENSION IF NOT EXISTS pg_partman; RESET ROLE;"
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to recreate pg_partman as the lago role."
  }

  Write-Host "Recreated pg_partman under the lago role." -ForegroundColor Green
  return $true
}

function Repair-ZitadelSetupState {
  $logs = Get-ContainerLogs -Name "hylono-zitadel"
  if ($logs -notmatch "migration already started") {
    return $false
  }

  $masterKey = Get-EnvValue -Name "ZITADEL_MASTERKEY"
  if ([string]::IsNullOrWhiteSpace($masterKey)) {
    throw "ZITADEL_MASTERKEY is missing from .env, so the stuck setup state cannot be cleaned up."
  }

  Write-Step "Cleaning stuck Zitadel setup state"
  & docker exec hylono-zitadel /app/zitadel setup cleanup --masterkey $masterKey --tlsMode disabled
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to clean up the stuck Zitadel migration state."
  }

  & docker restart hylono-zitadel *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to restart Zitadel after cleaning its setup state."
  }

  Write-Host "Cleaned the stale Zitadel migration marker and restarted the container." -ForegroundColor Green
  return $true
}

function Repair-Phase1AKnownIssues {
  $repaired = $false

  $lagoLogs = Get-ContainerLogs -Name "hylono-lago-migrate"
  if ($lagoLogs -match "must be owner of extension pg_partman") {
    $repaired = (Repair-LagoPgPartmanOwnership) -or $repaired
  }

  $repaired = (Repair-ZitadelSetupState) -or $repaired

  return $repaired
}

function Repair-InfrastructureKnownIssues {
  $repaired = $false
  $repaired = (Repair-UptimeKumaBootstrapState) -or $repaired
  return $repaired
}

function Invoke-ComposeUp {
  param(
    [Parameter(Mandatory = $true)][string]$ComposeFile,
    [Parameter(Mandatory = $true)][string]$Label,
    [int]$Attempts = 2,
    [int]$RetryDelaySec = 20,
    [switch]$WaitForHealthy,
    [string[]]$ServiceNames = @()
  )

  $args = @("compose", "-f", $ComposeFile, "--env-file", $envFile, "up", "-d")
  if ($WaitForHealthy) {
    $args += "--wait"
  }
  if ($ServiceNames.Count -gt 0) {
    $args += $ServiceNames
  }

  for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
    Write-Step "Starting $Label (attempt $attempt/$Attempts)"
    $composeExitCode = Invoke-DockerCommand -Arguments $args
    if ($composeExitCode -eq 0) {
      return
    }

    if ($attempt -lt $Attempts) {
      if ($Label -eq "infrastructure") {
        [void](Repair-InfrastructureKnownIssues)
      } elseif ($Label -eq "Phase 1A") {
        [void](Repair-Phase1AKnownIssues)
      }
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

  $sitePackageRunner = Get-SitePackageRunner
  $buildArguments = [string[]]($sitePackageRunner.BaseArgs + @("build"))

  Push-Location $root
  try {
    & $sitePackageRunner.FilePath @buildArguments
    if ($LASTEXITCODE -ne 0) {
      throw "$($sitePackageRunner.Name) build failed for website."
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

  $sitePackageRunner = Get-SitePackageRunner
  $startArguments = [string[]]($sitePackageRunner.BaseArgs + @("start"))

  $siteLogs = New-ProcessLogPaths -Prefix $siteLogPrefix
  Start-Process -FilePath $sitePackageRunner.FilePath -ArgumentList $startArguments -WorkingDirectory $root -RedirectStandardOutput $siteLogs.Stdout -RedirectStandardError $siteLogs.Stderr -WindowStyle Hidden
  Wait-HttpReady -Name "Website" -Url $siteUrl -TimeoutSec 120 -MaxStatusCode 399
  Start-Process $siteUrl
}

function Wait-ServiceChecks {
  Write-Step "Waiting for local app URLs"
  $pending = @{}
  foreach ($service in (Get-SelectedServiceChecks)) {
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
  if ($Profile -ne "1a") {
    return
  }

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

function Ensure-ActiveWaveOperatorWorkspaces {
  Invoke-OptionalSeedScript -Label "Seeding active-wave operator baseline" -ScriptPath $seedActiveWaveOperatorBaselineScript
}

Set-Location $root
Ensure-DockerReady
Ensure-EnvFile
Sync-LocalEnvOverrides
Ensure-DocumensoSigningCertificate
Invoke-ComposeUp -ComposeFile $infraCompose -Label "infrastructure" -WaitForHealthy
if ($Profile -eq "1a") {
  Invoke-ComposeUp -ComposeFile $phase1Compose -Label "Phase 1A" -WaitForHealthy
} else {
  Invoke-ComposeUp -ComposeFile $phase1Compose -Label "active first wave" -WaitForHealthy -ServiceNames $activePhase1Services
}
Ensure-DocumensoCertificateMount
Ensure-ControlPanel
Wait-ServiceChecks
Ensure-Phase1OperatorLogins
if ($Profile -eq "1a") {
  Ensure-Phase2OperatorWorkspaces
} else {
  Ensure-ActiveWaveOperatorWorkspaces
}
Ensure-Site3000

Write-Host ""
Write-Host "Local $Profile stack is ready:" -ForegroundColor Green
Write-Host "  Site:           $siteUrl"
Write-Host "  Control Panel:  $controlPanelUrl"
