param(
  [string]$Path,
  [string]$TemplatePath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
if (-not $PSBoundParameters.ContainsKey("Path")) {
  $Path = Join-Path $root ".env.staging"
}

if (-not $PSBoundParameters.ContainsKey("TemplatePath")) {
  $TemplatePath = Join-Path $root ".env.staging.example"
}

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Parse-EnvFile {
  param([Parameter(Mandatory = $true)][string]$FilePath)

  $result = @{}
  if (-not (Test-Path $FilePath)) {
    return $result
  }

  foreach ($line in Get-Content -Path $FilePath) {
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

function Test-PlaceholderLikeValue {
  param(
    [Parameter(Mandatory = $true)][string]$Key,
    [AllowNull()][string]$Value
  )

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return $true
  }

  $normalized = $Value.Trim()
  if ($normalized -match '^(REPLACE_WITH|CHANGE_ME|TODO|FIXME|YOUR_|<.+>)') {
    return $true
  }

  if ($normalized -eq "staging-minio-admin") {
    return $true
  }

  if ($Key -match '(?i)(PASSWORD|SECRET|TOKEN|PASSPHRASE|MASTERKEY|API_KEY|ACCESS_TOKEN_SECRET|LOGIN_TOKEN_SECRET|ENCRYPTION_KEY|RSA_PRIVATE_KEY_BASE64|CRON_API_KEY)') {
    if ($normalized.Length -lt 24) {
      return $true
    }

    if ($normalized -match '(?i)(placeholder|sample|example|replace_with|change_me|local-safe|console|in-app)') {
      return $true
    }
  }

  return $false
}

function Test-UrlValue {
  param(
    [Parameter(Mandatory = $true)][string]$Key,
    [AllowNull()][string]$Value
  )

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return "missing"
  }

  $normalized = $Value.Trim()
  if ($normalized -notmatch '^https://') {
    return "must use https://"
  }

  if ($normalized -match '(?i)localhost|127\.0\.0\.1') {
    return "must not point at localhost"
  }

  return $null
}

function Test-PositiveIntegerValue {
  param(
    [AllowNull()][string]$Value
  )

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return "missing"
  }

  $parsed = 0
  if (-not [int]::TryParse($Value.Trim(), [ref]$parsed)) {
    return "must be a positive integer"
  }

  if ($parsed -le 0) {
    return "must be greater than zero"
  }

  return $null
}

if (-not (Test-Path $TemplatePath)) {
  throw "Staging template not found: $TemplatePath"
}

if (-not (Test-Path $Path)) {
  throw "Staging env file not found: $Path"
}

$templateMap = Parse-EnvFile -FilePath $TemplatePath
$envMap = Parse-EnvFile -FilePath $Path
$requiredKeys = @($templateMap.Keys) | Sort-Object -Unique

$urlKeyPattern = '(^|_)(URL|BASE_URL|PUBLIC_URL)$'
$numericKeyPattern = '(?i)TIMEOUT_MS$'

$issues = New-Object System.Collections.Generic.List[string]
$missingKeys = New-Object System.Collections.Generic.List[string]
$placeholderKeys = New-Object System.Collections.Generic.List[string]
$urlIssues = New-Object System.Collections.Generic.List[string]
$numericIssues = New-Object System.Collections.Generic.List[string]

Write-Step "Staging env validation"
Write-Host "Template: $TemplatePath" -ForegroundColor Gray
Write-Host "Candidate: $Path" -ForegroundColor Gray
Write-Host "Required keys: $($requiredKeys.Count)" -ForegroundColor Gray

foreach ($key in $requiredKeys) {
  $candidate = if ($envMap.ContainsKey($key)) { [string]$envMap[$key] } else { $null }
  if ([string]::IsNullOrWhiteSpace($candidate)) {
    $missingKeys.Add($key)
    continue
  }

  if ($key -match $urlKeyPattern) {
    $urlIssue = Test-UrlValue -Key $key -Value $candidate
    if ($null -ne $urlIssue) {
      $urlIssues.Add("${key}: $urlIssue")
    }
  }

  if ($key -match $numericKeyPattern) {
    $numericIssue = Test-PositiveIntegerValue -Value $candidate
    if ($null -ne $numericIssue) {
      $numericIssues.Add("${key}: $numericIssue")
    }
  }

  if (Test-PlaceholderLikeValue -Key $key -Value $candidate) {
    $placeholderKeys.Add($key)
  }
}

if ($missingKeys.Count -gt 0) {
  $issues.Add("Missing values: $($missingKeys -join ', ')")
}

if ($placeholderKeys.Count -gt 0) {
  $issues.Add("Placeholder-like values: $($placeholderKeys -join ', ')")
}

if ($urlIssues.Count -gt 0) {
  $issues.Add("URL issues: $($urlIssues -join '; ')")
}

if ($numericIssues.Count -gt 0) {
  $issues.Add("Numeric issues: $($numericIssues -join '; ')")
}

if ($issues.Count -gt 0) {
  Write-Host ""
  Write-Host "Staging env validation failed." -ForegroundColor Red
  foreach ($issue in $issues) {
    Write-Host "[FAIL] $issue" -ForegroundColor Red
  }
  exit 1
}

Write-Host ""
Write-Host "Staging env validation passed." -ForegroundColor Green
