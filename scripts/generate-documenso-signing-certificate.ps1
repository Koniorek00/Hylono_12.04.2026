param(
  [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

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

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envMap = Parse-EnvFile -Path (Join-Path $root ".env")
$passphrase = $envMap["DOCUMENSO_SIGNING_PASSPHRASE"]

if (-not $passphrase) {
  throw "DOCUMENSO_SIGNING_PASSPHRASE is missing from .env"
}

$targetDir = Join-Path $root "output\documenso-signing"
$privateKeyPath = Join-Path $targetDir "private.key"
$certificatePath = Join-Path $targetDir "certificate.crt"
$p12Path = Join-Path $targetDir "certificate.p12"
$opensslConfigPath = Join-Path $targetDir "openssl.cnf"

if ((Test-Path $p12Path -PathType Leaf) -and -not $Force) {
  Write-Host "Documenso signing certificate already exists at $p12Path" -ForegroundColor Green
  exit 0
}

New-Item -ItemType Directory -Path $targetDir -Force | Out-Null

if (Test-Path $p12Path -PathType Container) {
  Remove-Item $p12Path -Recurse -Force
}

$subject = "/C=PL/ST=Slaskie/L=Czestochowa/O=Hylono/OU=Operations/CN=Hylono Document Signing/emailAddress=ops@hylono.com"

@"
[req]
distinguished_name = req_distinguished_name
prompt = no

[req_distinguished_name]
CN = Hylono Document Signing
"@ | Set-Content -Path $opensslConfigPath -Encoding ascii

& openssl genrsa -out $privateKeyPath 2048
if ($LASTEXITCODE -ne 0) {
  throw "Failed to generate Documenso private key."
}

& openssl req -new -x509 -key $privateKeyPath -out $certificatePath -days 3650 -subj $subject -config $opensslConfigPath
if ($LASTEXITCODE -ne 0) {
  throw "Failed to generate Documenso self-signed certificate."
}

& openssl pkcs12 -export -out $p12Path -inkey $privateKeyPath -in $certificatePath -passout "pass:$passphrase"
if ($LASTEXITCODE -ne 0) {
  throw "Failed to generate Documenso PKCS#12 certificate."
}

Remove-Item $privateKeyPath, $certificatePath, $opensslConfigPath -Force -ErrorAction SilentlyContinue

Write-Host "Generated Documenso signing certificate at $p12Path" -ForegroundColor Green
