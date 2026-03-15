#!/bin/bash

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Kill any existing processes on our ports
fuser -k 5000/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
sleep 1

# Install backend deps
echo "Installing backend dependencies..."
pip install -q fastapi uvicorn anthropic python-dotenv httpx pydantic || \
pip3 install -q fastapi uvicorn anthropic python-dotenv httpx pydantic || \
echo "Warning: pip install failed, continuing anyway..."

# Install frontend deps
echo "Installing frontend dependencies..."
cd frontend && npm install --silent 2>/dev/null; cd "$DIR"

# Find working python
PYTHON=""
for p in python3 python; do
  if command -v "$p" &>/dev/null; then
    PYTHON="$p"
    break
  fi
done

if [ -z "$PYTHON" ]; then
  echo "ERROR: No python found!"
  exit 1
fi

echo "Using $PYTHON"

# Start backend on port 8000
echo "Starting backend on port 8000..."
$PYTHON -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment and check if backend started
sleep 2
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "ERROR: Backend failed to start! Trying with more verbose output..."
  $PYTHON -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
  BACKEND_PID=$!
  sleep 2
fi

echo "Backend PID: $BACKEND_PID"

# Start frontend on port 5000
echo "Starting frontend on port 5000..."
cd frontend && npx vite --host 0.0.0.0 --port 5000
