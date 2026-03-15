#!/bin/bash
set -e

# Install backend dependencies
echo "Installing backend dependencies..."
cd /home/runner/gone-by-friday 2>/dev/null || cd "$(dirname "$0")"
pip install -q -r backend/requirements.txt 2>/dev/null &

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install --silent 2>/dev/null
cd ..

# Wait for pip to finish
wait

# Start backend
echo "Starting backend on :8000..."
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &

# Start frontend (Vite dev server)
echo "Starting frontend on :5173..."
cd frontend
npx vite --host 0.0.0.0 --port 5173 &

# Wait for either to exit
wait
