$ErrorActionPreference = 'Continue'

$wd = 'F:\ag projects\Hylono_MAIN'
$out = Join-Path $wd '.tmp_routecheck_prod_stdout.log'
$err = Join-Path $wd '.tmp_routecheck_prod_stderr.log'

if (Test-Path $out) { Remove-Item $out -Force }
if (Test-Path $err) { Remove-Item $err -Force }

# Stop any leftover Next.js servers first
Get-CimInstance Win32_Process |
  Where-Object { $_.Name -match 'node|cmd|pnpm' -and $_.CommandLine -match 'next (dev|start)' } |
  ForEach-Object {
    try { Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop } catch {}
  }

Start-Sleep -Milliseconds 500

$server = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'pnpm start --port 4020' -WorkingDirectory $wd -RedirectStandardOutput $out -RedirectStandardError $err -PassThru

$ready = $false
for ($i = 0; $i -lt 20; $i++) {
  Start-Sleep -Seconds 1
  try {
    $probe = Invoke-WebRequest -Uri 'http://localhost:4020' -UseBasicParsing -TimeoutSec 3
    if ($probe.StatusCode -eq 200) {
      $ready = $true
      break
    }
  } catch {}
}

Write-Output ("READY=$ready")

if ($ready) {
  $env:ROUTE_CHECK_BASE_URL = 'http://localhost:4020'
  cmd /c "cd /d F:\ag projects\Hylono_MAIN && node .tmp_route_check.mjs"
}

if (-not $server.HasExited) {
  Stop-Process -Id $server.Id -Force
}

Start-Sleep -Milliseconds 500

Write-Output '---SERVER STDOUT---'
if (Test-Path $out) {
  Get-Content $out -Tail 180
}

Write-Output '---SERVER STDERR---'
if (Test-Path $err) {
  Get-Content $err -Tail 180
}
