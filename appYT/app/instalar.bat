@echo off
:: Verificar privilegios de administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Solicitando privilegios de administrador...
    powershell -Command "Start-Process '%~f0' -Verb runAs"
    exit /b
)

setlocal

REM Ruta del directorio actual
set "DIR=%~dp0"
set "SOURCE=%DIR%serverYT.exe"
set "ICON=%DIR%icono.ico"

REM Carpeta de inicio para ejecutar al iniciar Windows
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

REM Carpeta del menú de inicio
set "START_MENU_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs"

REM Crear acceso directo con icono personalizado
echo Creando acceso directo en el menú de inicio...
powershell -Command ^
    "$s=(New-Object -COM WScript.Shell).CreateShortcut('%START_MENU_FOLDER%\serverYT.lnk'); ^
    $s.TargetPath='%SOURCE%'; ^
    $s.IconLocation='%ICON%'; ^
    $s.Save()"

REM Copiar el ejecutable a la carpeta de inicio
echo Copiando serverYT.exe a la carpeta de inicio...
copy /Y "%SOURCE%" "%STARTUP_FOLDER%\serverYT.exe"

echo Instalación completada con icono personalizado.
start "" "%STARTUP_FOLDER%\serverYT.exe"
pause
