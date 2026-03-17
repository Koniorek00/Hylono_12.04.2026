Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$stackDir = (Resolve-Path (Join-Path $scriptDir "..")).Path
$envFile = Join-Path $stackDir ".env"
$exampleFile = Join-Path $stackDir ".env.example"

function New-HexSecret {
  param(
    [Parameter(Mandatory = $true)]
    [int]$Bytes
  )

  $buffer = [byte[]]::new($Bytes)
  [System.Security.Cryptography.RandomNumberGenerator]::Fill($buffer)
  return -join ($buffer | ForEach-Object { $_.ToString("x2") })
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

  if ($updated.Contains("CHANGE_ME_64")) {
    $updated = $updated.Replace("CHANGE_ME_64", (New-HexSecret -Bytes 32))
  }

  if ($updated.Contains("CHANGE_ME_32")) {
    $updated = $updated.Replace("CHANGE_ME_32", (New-HexSecret -Bytes 16))
  }

  $updated
}

Set-Content -Path $envFile -Value $content -Encoding utf8
Write-Host "Secrets generated in $envFile"
