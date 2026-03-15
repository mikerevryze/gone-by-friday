#!/bin/bash

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Kill any existing processes on our ports
fuser -k 5000/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
sleep 1

# Install frontend deps
echo "Installing frontend dependencies..."
cd frontend && npm install --silent 2>/dev/null; cd "$DIR"

# Start backend on port 8000 (Node.js — no Python needed)
echo "Starting backend on port 8000..."
node server.js &
BACKEND_PID=$!

sleep 1
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "ERROR: Backend failed to start!"
  exit 1
fi
echo "Backend started (PID: $BACKEND_PID)"

# Start frontend on port 5000
echo "Starting frontend on port 5000..."
cd frontend && npx vite --host 0.0.0.0 --port 5000
