Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "F:\ag projects\Hylono_MAIN"
WshShell.Run "cmd /c pnpm dev", 0, False
WshShell.Run "http://localhost:3000", 1, False
