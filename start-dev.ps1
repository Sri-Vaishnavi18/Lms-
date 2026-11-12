# Start Script for Blue-Collar LMS (Backend + Frontend)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting Frontline & Blue-Collar LMS System" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start Node.js / Express Backend on Port 5000
Write-Host "`n[1/2] Launching Backend API on http://localhost:5000..." -ForegroundColor Yellow
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -PassThru

# 2. Start Next.js PWA & Portal on Port 3000
Write-Host "[2/2] Launching Frontend PWA on http://localhost:3000..." -ForegroundColor Yellow
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -PassThru

Write-Host "`nSystem is running!" -ForegroundColor Green
Write-Host "Worker PWA:          http://localhost:3000/worker/dashboard" -ForegroundColor White
Write-Host "Supervisor Tablet:   http://localhost:3000/supervisor/dashboard" -ForegroundColor White
Write-Host "Admin EHS Matrix:    http://localhost:3000/admin/compliance" -ForegroundColor White
Write-Host "Backend API Health:  http://localhost:5000/health" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

