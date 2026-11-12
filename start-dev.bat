@echo off
echo ==========================================================
echo    Starting Frontline & Blue-Collar LMS System
echo ==========================================================

echo [1/2] Starting Node.js Backend on http://localhost:5000...
start "Blue-Collar LMS Backend" cmd /k "cd backend && npm run dev"

echo [2/2] Starting Next.js Frontend on http://localhost:3000...
start "Blue-Collar LMS Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Launching browser to Frontline LMS Portal...
timeout /t 4 /nobreak >nul
start http://localhost:3000

echo System running! Close the command windows when finished.
pause

