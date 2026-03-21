@echo off
setlocal EnableExtensions

set "ROOT=F:\ag projects\Hylono_MAIN - SEO BOOST"
set "CONTROL_PANEL_DIR=%ROOT%\control-panel"
set "ADMIN_URL=http://localhost:3005/admin"
set "OUT_LOG=%ROOT%\.tmp-control-panel-3005.out.log"
set "ERR_LOG=%ROOT%\.tmp-control-panel-3005.err.log"
set "WINDOW_TITLE=Hylono Control Panel"

call :is_up
if "%ERRORLEVEL%"=="0" goto open_browser

if not exist "%CONTROL_PANEL_DIR%\node_modules" (
  echo Installing control-panel dependencies...
  pushd "%CONTROL_PANEL_DIR%"
  call npm install
  set "INSTALL_EXIT=%ERRORLEVEL%"
  popd
  if not "%INSTALL_EXIT%"=="0" goto install_fail
)

if not exist "%CONTROL_PANEL_DIR%\.next\BUILD_ID" (
  call :build
  if not "%ERRORLEVEL%"=="0" goto build_fail
)

call :start_server
call :wait_for_server 30
if "%ERRORLEVEL%"=="0" goto open_browser

echo Existing build did not start cleanly. Rebuilding once...
call :build
if not "%ERRORLEVEL%"=="0" goto build_fail

call :start_server
call :wait_for_server 45
if not "%ERRORLEVEL%"=="0" goto start_fail

:open_browser
start "" "%ADMIN_URL%"
exit /b 0

:is_up
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $resp = Invoke-WebRequest -UseBasicParsing '%ADMIN_URL%' -TimeoutSec 3; if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) { exit 0 } else { exit 1 } } catch { exit 1 }"
exit /b %ERRORLEVEL%

:build
echo Building control panel...
pushd "%CONTROL_PANEL_DIR%"
call npm run build
set "BUILD_EXIT=%ERRORLEVEL%"
popd
exit /b %BUILD_EXIT%

:start_server
if not exist "%OUT_LOG%" type nul > "%OUT_LOG%"
if not exist "%ERR_LOG%" type nul > "%ERR_LOG%"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$out = '%OUT_LOG%'; $err = '%ERR_LOG%'; $dir = '%CONTROL_PANEL_DIR%'; Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','npm run start' -WorkingDirectory $dir -RedirectStandardOutput $out -RedirectStandardError $err -WindowStyle Hidden"
exit /b 0

:wait_for_server
set /a ATTEMPTS=%~1
if "%ATTEMPTS%"=="" set /a ATTEMPTS=30

:wait_loop
call :is_up
if "%ERRORLEVEL%"=="0" exit /b 0
if %ATTEMPTS% LEQ 0 exit /b 1
set /a ATTEMPTS-=1
timeout /t 1 /nobreak >nul
goto wait_loop

:install_fail
echo Failed to install control-panel dependencies.
pause
exit /b 1

:build_fail
echo Failed to build the control panel.
pause
exit /b 1

:start_fail
echo Failed to start the control panel on http://localhost:3005/admin
echo Check these logs:
echo   %OUT_LOG%
echo   %ERR_LOG%
pause
exit /b 1
