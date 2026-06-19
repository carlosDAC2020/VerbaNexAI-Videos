@echo off
title VerbaNexAI Lab
cd /d "%~dp0"

echo.
echo  Iniciando VerbaNexAI Lab...
echo  Abriendo http://localhost:3000
echo.

start "" http://localhost:3000
node server.js

echo.
pause
