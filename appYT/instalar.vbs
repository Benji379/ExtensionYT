Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("Shell.Application")
Set WshShell = CreateObject("WScript.Shell")

batPath = fso.GetAbsolutePathName("app\instalar.bat")
shell.ShellExecute "cmd.exe", "/c """ & batPath & """", "", "runas", 0
