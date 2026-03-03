@echo off
setlocal
cd /d "%~dp0"

echo Starting Hylono Development Server...
echo.

set "PNPM_CMD="
where pnpm >nul 2>nul && set "PNPM_CMD=pnpm"
set "DEV_CMD="

if defined PNPM_CMD (
  set "DEV_CMD=%PNPM_CMD% dev"
  echo Using package manager command: %PNPM_CMD%
) else (
  set "DEV_CMD=npm run dev"
  echo [WARN] pnpm unavailable in current shell. Using npm run dev fallback.
  echo [INFO] To restore pnpm later, run terminal as Administrator once and execute:
  echo        corepack enable ^&^& corepack prepare pnpm@latest --activate
)

if not exist "node_modules\.bin\next.cmd" (
  echo.
  echo [ERROR] Dependencies are not installed ^(missing node_modules/.bin/next.cmd^).
  if defined PNPM_CMD (
    echo Run: %PNPM_CMD% install
  ) else (
    echo Run: npm install
  )
  echo Then run this file again.
  pause
  exit /b 1
)

echo Launching dev server in a new terminal...
start "Hylono Dev Server" cmd /k "%DEV_CMD%"

echo Waiting 8 seconds for startup, then opening browser...
timeout /t 8 /nobreak >nul
echo Opening http://localhost:3000 ...
start "" "http://localhost:3000"
exit /b 0