Set-Location (Join-Path $PSScriptRoot '..')
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host 'Node.js is required: https://nodejs.org' -ForegroundColor Red; exit 1 }
node admin/server.js
