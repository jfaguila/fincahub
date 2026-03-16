#!/bin/sh

echo "=== FincaHub API Startup ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL set: $([ -n "$DATABASE_URL" ] && echo YES || echo NO)"

if [ -n "$DATABASE_URL" ]; then
  echo "Running prisma db push (timeout 30s)..."
  if timeout 30 npx prisma db push --skip-generate; then
    echo "Prisma db push OK"
  else
    echo "WARNING: prisma db push failed or timed out. Continuing anyway..."
  fi
else
  echo "WARNING: DATABASE_URL not set, skipping prisma db push"
fi

echo "Starting application..."
exec node dist/src/main
