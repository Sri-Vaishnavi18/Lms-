#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "   Starting Frontline & Blue-Collar LMS System"
echo "=========================================================="

# Cleanup background processes on exit
cleanup() {
  echo -e "\nStopping servers..."
  kill $(jobs -p) 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

echo -e "\n[1/2] Launching Backend API on http://localhost:5000..."
(cd backend && npm run dev) &

echo -e "\n[2/2] Launching Frontend PWA on http://localhost:3000..."
(cd frontend && npm run dev) &

echo -e "\nSystem is running!"
echo "Worker PWA:          http://localhost:3000/worker/dashboard"
echo "Supervisor Tablet:   http://localhost:3000/supervisor/dashboard"
echo "Admin EHS Matrix:    http://localhost:3000/admin/compliance"
echo "Backend API Health:  http://localhost:5000/health"
echo "=========================================================="

wait

