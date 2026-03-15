#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Install backend deps
pip install -q fastapi uvicorn anthropic python-dotenv httpx pydantic 2>/dev/null &

# Install frontend deps
cd frontend && npm install --silent 2>/dev/null && cd ..

wait

# Start backend on port 8000
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &

# Start frontend on port 5000
cd frontend && npx vite --host 0.0.0.0 --port 5000
