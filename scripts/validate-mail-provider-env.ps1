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
    if (-not $trimmed -or $trimmed.StartsWith('#')) {
      continue
    }

    $separatorIndex = $trimmed.IndexOf('=')
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

function Test-RequiredKeys {
  param(
    [Parameter(Mandatory = $true)][hashtable]$EnvMap,
    [Parameter(Mandatory = $true)][string[]]$Keys,
    [Parameter(Mandatory = $true)][string]$Label
  )

  $missing = @()
  foreach ($key in $Keys) {
    if (-not $EnvMap.ContainsKey($key) -or [string]::IsNullOrWhiteSpace([string]$EnvMap[$key])) {
      $missing += $key
    }
  }

  if ($missing.Count -gt 0) {
    Write-Host "[FAIL] $Label missing: $($missing -join ', ')" -ForegroundColor Red
    return $false
  }

  Write-Host "[OK] $Label" -ForegroundColor Green
  return $true
}

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envMap = Parse-EnvFile -Path (Join-Path $root ".env")
if (Test-Path (Join-Path $root ".env.local")) {
  $envMap = Merge-EnvMaps -Base $envMap -Overrides (Parse-EnvFile -Path (Join-Path $root ".env.local"))
}

$profile = if ($envMap.ContainsKey("MAIL_PROVIDER_PROFILE")) { $envMap["MAIL_PROVIDER_PROFILE"] } else { "local-safe" }
$appMode = if ($envMap.ContainsKey("MAIL_APP_MODE")) { $envMap["MAIL_APP_MODE"] } else { "console" }
$novuEmailMode = if ($envMap.ContainsKey("NOVU_EMAIL_MODE")) { $envMap["NOVU_EMAIL_MODE"] } else { "in-app" }

Write-Step "Mail provider profile"
Write-Host ("Profile: {0}" -f $profile) -ForegroundColor Gray
Write-Host ("App mail mode: {0}" -f $appMode) -ForegroundColor Gray
Write-Host ("Novu email mode: {0}" -f $novuEmailMode) -ForegroundColor Gray

$allHealthy = $true

$allHealthy = (Test-RequiredKeys -EnvMap $envMap -Keys @(
  "NOVU_API_BASE_URL",
  "NOVU_API_SECRET",
  "NOVU_WORKFLOW_ID"
) -Label "Novu sync and trigger settings") -and $allHealthy

switch ($appMode.ToLowerInvariant()) {
  "console" {
    Write-Host "[OK] App mail mode is console-only. No outbound mail keys required yet." -ForegroundColor Green
  }
  "resend" {
    $allHealthy = (Test-RequiredKeys -EnvMap $envMap -Keys @(
      "RESEND_API_KEY",
      "RESEND_FROM_EMAIL"
    ) -Label "Resend app mailer settings") -and $allHealthy

    if ($envMap.ContainsKey("RESEND_AUDIENCE_ID") -and -not [string]::IsNullOrWhiteSpace($envMap["RESEND_AUDIENCE_ID"])) {
      Write-Host "[OK] Resend audience ID present" -ForegroundColor Green
    } else {
      Write-Host "[WARN] RESEND_AUDIENCE_ID is empty; newsletter audience sync will remain optional." -ForegroundColor Yellow
    }
  }
  "smtp" {
    $allHealthy = (Test-RequiredKeys -EnvMap $envMap -Keys @(
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_USER",
      "SMTP_PASSWORD",
      "SMTP_FROM_EMAIL"
    ) -Label "SMTP app mailer settings") -and $allHealthy
  }
  default {
    Write-Host "[FAIL] Unknown MAIL_APP_MODE value: $appMode" -ForegroundColor Red
    $allHealthy = $false
  }
}

switch ($novuEmailMode.ToLowerInvariant()) {
  "in-app" {
    Write-Host "[OK] Novu email mode is in-app only. No SMTP provider required for Novu yet." -ForegroundColor Green
  }
  "custom-smtp" {
    $allHealthy = (Test-RequiredKeys -EnvMap $envMap -Keys @(
      "NOVU_SMTP_HOST",
      "NOVU_SMTP_PORT",
      "NOVU_SMTP_USER",
      "NOVU_SMTP_PASSWORD",
      "NOVU_EMAIL_FROM_EMAIL"
    ) -Label "Novu Custom SMTP settings") -and $allHealthy
  }
  default {
    Write-Host "[FAIL] Unknown NOVU_EMAIL_MODE value: $novuEmailMode" -ForegroundColor Red
    $allHealthy = $false
  }
}

if ($profile -eq "shared-smtp") {
  $allHealthy = (Test-RequiredKeys -EnvMap $envMap -Keys @(
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM_EMAIL"
  ) -Label "Shared SMTP baseline") -and $allHealthy
}

if ($profile -eq "resend-novu" -and $appMode -ne "resend") {
  Write-Host "[WARN] MAIL_PROVIDER_PROFILE=resend-novu is usually paired with MAIL_APP_MODE=resend." -ForegroundColor Yellow
}

if ($profile -eq "shared-smtp" -and $novuEmailMode -ne "custom-smtp") {
  Write-Host "[WARN] MAIL_PROVIDER_PROFILE=shared-smtp is usually paired with NOVU_EMAIL_MODE=custom-smtp." -ForegroundColor Yellow
}

if (-not $allHealthy) {
  Write-Host ""
  Write-Host "Mail provider validation failed." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "Mail provider validation passed." -ForegroundColor Green
