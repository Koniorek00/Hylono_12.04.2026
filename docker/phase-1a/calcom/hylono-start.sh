#!/bin/sh
set -e

node /calcom/scripts/hylono-replace-placeholder.cjs "$BUILT_NEXT_PUBLIC_WEBAPP_URL" "$NEXT_PUBLIC_WEBAPP_URL"

scripts/wait-for-it.sh "${DATABASE_HOST}:5432" -- echo "database is up"
npx prisma migrate deploy --schema /calcom/packages/prisma/schema.prisma
npx ts-node --transpile-only /calcom/scripts/seed-app-store.ts

exec yarn start
