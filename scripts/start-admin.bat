@echo off
title Portfolio Back Office (local only)
cd /d "%~dp0.."
where node >nul 2>nul || (echo Node.js is required: https://nodejs.org & pause & exit /b 1)
echo Starting the back office. A browser tab opens automatically.
node admin\server.js
pause
