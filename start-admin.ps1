Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Starting Portfolio Back Office CMS..." -ForegroundColor Green
Write-Host "Back Office:  http://localhost:3333/admin" -ForegroundColor Yellow
Write-Host "Portfolio:    http://localhost:3333/" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

Start-Process "http://localhost:3333/admin"
node admin/server.js
