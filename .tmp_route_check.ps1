$ErrorActionPreference = 'Continue'

$wd = 'F:\ag projects\Hylono_MAIN'
$devOut = Join-Path $wd '.tmp_routecheck3_stdout.log'
$devErr = Join-Path $wd '.tmp_routecheck3_stderr.log'

if (Test-Path $devOut) { Remove-Item $devOut -Force }
if (Test-Path $devErr) { Remove-Item $devErr -Force }

# Kill stale next dev processes
Get-CimInstance Win32_Process |
  Where-Object { $_.Name -match 'node|cmd|pnpm' -and $_.CommandLine -match 'next dev' } |
  ForEach-Object {
    try { Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop } catch {}
  }

Start-Sleep -Milliseconds 600

$lockFile = Join-Path $wd '.next\dev\lock'
if (Test-Path $lockFile) {
  Remove-Item $lockFile -Force
}

$devProc = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'pnpm dev --port 4018' -WorkingDirectory $wd -RedirectStandardOutput $devOut -RedirectStandardError $devErr -PassThru

$ready = $false
for ($i = 0; $i -lt 25; $i++) {
  Start-Sleep -Seconds 1
  try {
    $probe = Invoke-WebRequest -Uri 'http://localhost:4018' -UseBasicParsing -TimeoutSec 3
    if ($probe.StatusCode -eq 200) {
      $ready = $true
      break
    }
  } catch {}
}

Write-Output ("READY=$ready")

if ($ready) {
  cmd /c "cd /d F:\ag projects\Hylono_MAIN && node .tmp_route_check.mjs"
}

if (-not $devProc.HasExited) {
  Stop-Process -Id $devProc.Id -Force
}

Start-Sleep -Milliseconds 500

Write-Output '---DEV STDOUT---'
if (Test-Path $devOut) {
  Get-Content $devOut -Tail 180
}

Write-Output '---DEV STDERR---'
if (Test-Path $devErr) {
  Get-Content $devErr -Tail 180
}
