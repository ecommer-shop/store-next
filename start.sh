#!/bin/sh
# =========================
# Start script for Next.js Standalone on Railway
# =========================

set -e

# Railway inyecta PORT automáticamente
export PORT=${PORT:-8080}

# Forzar escucha externa
export HOST=0.0.0.0

echo "=========================================="
echo "Starting Next.js server"
echo "NODE_ENV=$NODE_ENV"
echo "HOST=$HOST"
echo "PORT=$PORT"
echo "Working directory: $(pwd)"
echo "=========================================="

# Verificar server.js
if [ ! -f "server.js" ]; then
  echo "ERROR: server.js not found"
  ls -la
  exit 1
fi

# Verificar .next
if [ ! -d ".next" ]; then
  echo "ERROR: .next directory not found"
  ls -la
  exit 1
fi

echo "Executing: node server.js"
echo "Server should be listening on http://$HOST:$PORT"
echo "Node version: $(node --version)"
echo "=========================================="

# Manejo de señales 
trap 'echo "Received termination signal. Shutting down..."; exit 0' TERM INT

# Reemplazar shell por node (PID 1)
exec node server.js
