Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$stackDir = (Resolve-Path (Join-Path $scriptDir "..")).Path
$envFile = Join-Path $stackDir ".env"
$exampleFile = Join-Path $stackDir ".env.example"
$generatedValues = @{}

function New-UniqueHexSecret {
  param(
    [Parameter(Mandatory = $true)]
    [int]$HexChars
  )

  if ($HexChars -lt 2) {
    throw "HexChars must be at least 2."
  }

  $bytes = [int][Math]::Ceiling($HexChars / 2)

  while ($true) {
    $buffer = [byte[]]::new($bytes)
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($buffer)
    $candidate = (-join ($buffer | ForEach-Object { $_.ToString("x2") })).Substring(0, $HexChars)

    if (-not $generatedValues.ContainsKey($candidate)) {
      $generatedValues[$candidate] = $true
      return $candidate
    }
  }
}

function New-RsaPrivateKeyBase64 {
  $rsa = [System.Security.Cryptography.RSA]::Create(2048)
  try {
    $pem = $rsa.ExportPkcs8PrivateKeyPem()
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($pem)
    $candidate = [Convert]::ToBase64String($bytes)

    if (-not $generatedValues.ContainsKey($candidate)) {
      $generatedValues[$candidate] = $true
      return $candidate
    }

    return New-RsaPrivateKeyBase64
  } finally {
    $rsa.Dispose()
  }
}

if (Test-Path $envFile) {
  Write-Host ".env already exists. Skipping."
  exit 0
}

if (-not (Test-Path $exampleFile)) {
  throw "Error: $exampleFile not found."
}

$content = foreach ($line in Get-Content -Path $exampleFile) {
  $updated = $line

  if ($updated -match "^([A-Z0-9_]+)=CHANGE_ME_(\d+)$") {
    $key = $Matches[1]
    $hexChars = [int]$Matches[2]
    "$key=$(New-UniqueHexSecret -HexChars $hexChars)"
    continue
  }

  if ($updated -match "^([A-Z0-9_]+)=CHANGE_ME_BASE64_RSA$") {
    $key = $Matches[1]
    "$key=$(New-RsaPrivateKeyBase64)"
    continue
  }

  $updated
}

Set-Content -Path $envFile -Value $content -Encoding utf8
Write-Host "Secrets generated in $envFile"
