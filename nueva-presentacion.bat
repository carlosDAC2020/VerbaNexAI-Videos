@echo off
title VerbaNexAI Lab - Nueva presentacion
cd /d "%~dp0"

echo.
echo  VerbaNexAI Lab - Crear nueva presentacion
echo.

node scripts\crear-presentacion.js %*

echo.
pause
