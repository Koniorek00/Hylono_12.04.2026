#!/bin/bash
set -euo pipefail
BACKUP_DIR="/backups/hylono/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"

echo "PostgreSQL..."
docker exec hylono-postgres pg_dumpall -U postgres | gzip > "$BACKUP_DIR/postgres.sql.gz"

echo "Redis..."
docker exec hylono-redis redis-cli BGSAVE >/dev/null 2>&1
sleep 3
docker cp hylono-redis:/data/dump.rdb "$BACKUP_DIR/redis.rdb" 2>/dev/null || true

echo "Cleanup..."
find /backups/hylono/ -maxdepth 1 -type d -mtime +30 -exec rm -rf {} \; 2>/dev/null || true

echo "Done → $BACKUP_DIR ($(du -sh "$BACKUP_DIR" | cut -f1))"
