#!/bin/sh
# Script de inicio para Next.js en Railway
# Asegura que PORT esté definido y que Next.js escuche correctamente

# Railway inyecta PORT automáticamente, pero usamos 8080 como fallback
export PORT=${PORT:-8080}

# Log para diagnóstico
echo "Starting Next.js server on port $PORT"
echo "NODE_ENV=$NODE_ENV"
echo "Working directory: $(pwd)"
echo "Files in current directory:"
ls -la

# Ejecutar el servidor Next.js standalone
# Next.js leerá PORT de la variable de entorno automáticamente
# Usamos exec para que el proceso principal sea node, no sh
exec node server.js

