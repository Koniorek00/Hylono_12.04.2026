@echo off
cd /d "%~dp0"
echo Starting Hylono Development Server...
echo Opening http://localhost:3000 in your browser...
echo.
start http://localhost:3000
pnpm dev
pause