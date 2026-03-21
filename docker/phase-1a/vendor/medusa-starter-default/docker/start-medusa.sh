#!/bin/sh
set -e

yarn medusa db:migrate

# Prefer the bundled production admin output when it exists.
if [ -f /app/.medusa/server/public/admin/index.html ]; then
  mkdir -p /app/public/admin
  cp -R /app/.medusa/server/public/admin/. /app/public/admin/
elif [ -f /app/.medusa/client/index.html ] && [ ! -f /app/public/admin/index.html ]; then
  mkdir -p /app/public/admin
  cp -R /app/.medusa/client/. /app/public/admin/
fi

exec yarn start
