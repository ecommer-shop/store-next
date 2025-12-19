#!/bin/sh
set -e  # Salir si hay algún error

# Script de inicio para Next.js en Railway
# Asegura que PORT esté definido y que Next.js escuche correctamente

# Railway inyecta PORT automáticamente, pero usamos 8080 como fallback
export PORT=${PORT:-8080}

# Log para diagnóstico
echo "=========================================="
echo "Starting Next.js server on port $PORT"
echo "NODE_ENV=$NODE_ENV"
echo "Working directory: $(pwd)"
echo "PORT=$PORT"
echo "=========================================="

# Verificar que server.js existe
if [ ! -f "server.js" ]; then
    echo "ERROR: server.js not found!"
    ls -la
    exit 1
fi

# Verificar que .next existe
if [ ! -d ".next" ]; then
    echo "ERROR: .next directory not found!"
    ls -la
    exit 1
fi

# Ejecutar el servidor Next.js standalone
# Next.js standalone escucha en 0.0.0.0 por defecto cuando PORT está definido
# Usamos exec para que el proceso principal sea node, no sh
# Esto asegura que Railway vea node como el proceso principal
echo "Executing: node server.js"
echo "Server should be listening on 0.0.0.0:$PORT"
echo "=========================================="

# Ejecutar node y mantener el proceso vivo
# Si el proceso termina, el contenedor se detendrá
exec node server.js

