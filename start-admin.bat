@echo off
title Portfolio Back Office - Zakariae Chelle
echo ============================================================
echo Starting Portfolio Back Office CMS...
echo Web Interface: http://localhost:3333/admin
echo Live Portfolio: http://localhost:3333/
echo ============================================================
start "" "http://localhost:3333/admin"
node admin/server.js
pause
