#!/bin/bash
# Start backend and frontend concurrently
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 &
cd frontend && npx vite --host 0.0.0.0 &
wait
