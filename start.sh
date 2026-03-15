#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Kill any existing processes on our ports
fuser -k 5000/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true
sleep 1

# Install backend deps
pip3 install -q fastapi uvicorn anthropic python-dotenv httpx pydantic 2>/dev/null &

# Install frontend deps
cd frontend && npm install --silent 2>/dev/null && cd ..

wait

# Start backend on port 8000
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &

# Start frontend on port 5000
cd frontend && npx vite --host 0.0.0.0 --port 5000
