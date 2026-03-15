#!/bin/bash

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Kill any existing processes on our ports
fuser -k 5000/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
sleep 1

# Find working python - check Nix paths too
PYTHON=""
for p in python3 python python3.11; do
  if command -v "$p" &>/dev/null; then
    PYTHON="$p"
    break
  fi
done

if [ -z "$PYTHON" ]; then
  echo "ERROR: No python found! Make sure replit.nix includes python311."
  echo "Try clicking 'Stop' then 'Run' to reload the Nix environment."
  exit 1
fi

echo "Using $PYTHON ($(command -v $PYTHON))"

# Install backend deps
echo "Installing backend dependencies..."
$PYTHON -m pip install -q fastapi uvicorn anthropic python-dotenv httpx pydantic || \
  echo "Warning: pip install had issues, checking if packages exist anyway..."

# Verify critical packages
if ! $PYTHON -c "import fastapi; import uvicorn" 2>/dev/null; then
  echo "ERROR: Required Python packages not installed. Trying with --user flag..."
  $PYTHON -m pip install --user fastapi uvicorn anthropic python-dotenv httpx pydantic
fi

# Install frontend deps
echo "Installing frontend dependencies..."
cd frontend && npm install --silent 2>/dev/null; cd "$DIR"

# Start backend on port 8000
echo "Starting backend on port 8000..."
$PYTHON -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment and check if backend started
sleep 2
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "ERROR: Backend failed to start! Check errors above."
  exit 1
fi

echo "Backend started (PID: $BACKEND_PID)"

# Start frontend on port 5000
echo "Starting frontend on port 5000..."
cd frontend && npx vite --host 0.0.0.0 --port 5000
