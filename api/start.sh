#!/bin/sh

echo "=== FincaHub API Startup ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL set: $([ -n "$DATABASE_URL" ] && echo YES || echo NO)"

echo "Running prisma db push..."
if npx prisma db push --skip-generate; then
  echo "Prisma db push OK"
else
  echo "ERROR: prisma db push failed. Aborting startup."
  exit 1
fi

echo "Running prisma seed (skips if already seeded)..."
if npx prisma db seed; then
  echo "Seed OK"
else
  echo "WARNING: seed failed (exit code $?). Continuing anyway..."
fi

echo "Starting application..."
exec node dist/src/main
