@echo off
rem Ouvre CrateSort dans sa propre fenetre (Chrome si installe, sinon Edge)
setlocal
set "F=%~dp0CrateSort.html"
set "U=file:///%F:\=/%"
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="%U%" & exit /b)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="%U%" & exit /b)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" --app="%U%" & exit /b)
start "" msedge --app="%U%"
