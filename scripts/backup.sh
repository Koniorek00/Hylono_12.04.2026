#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"
BACKUP_ROOT="${BACKUP_ROOT:-/backups/hylono}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
STAMP="$(date +%Y-%m-%dT%H-%M-%S)"
BACKUP_DIR="${BACKUP_ROOT}/${STAMP}"

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
fi

mkdir -p \
  "${BACKUP_DIR}/postgres" \
  "${BACKUP_DIR}/redis" \
  "${BACKUP_DIR}/mongo" \
  "${BACKUP_DIR}/minio" \
  "${BACKUP_DIR}/uptime-kuma" \
  "${BACKUP_DIR}/config"

echo "PostgreSQL..."
docker exec hylono-postgres pg_dumpall -U postgres | gzip > "${BACKUP_DIR}/postgres/all.sql.gz"

echo "Redis..."
docker exec hylono-redis redis-cli -a "${REDIS_PASSWORD}" SAVE >/dev/null
docker cp hylono-redis:/data/dump.rdb "${BACKUP_DIR}/redis/dump.rdb"

echo "MongoDB..."
if docker exec hylono-mongo sh -lc 'command -v mongodump >/dev/null 2>&1'; then
  docker exec hylono-mongo mongodump \
    --username "hylono" \
    --password "${MONGO_ROOT_PASSWORD}" \
    --authenticationDatabase admin \
    --archive \
    --gzip > "${BACKUP_DIR}/mongo/all.archive.gz"
else
  echo "Skipping MongoDB archive because mongodump is not available in the container." \
    > "${BACKUP_DIR}/mongo/SKIPPED.txt"
fi

echo "MinIO data..."
docker cp hylono-minio:/data/. "${BACKUP_DIR}/minio"

echo "Uptime Kuma data..."
docker cp hylono-uptime-kuma:/app/data/. "${BACKUP_DIR}/uptime-kuma"

echo "Config snapshot..."
cp "${ROOT_DIR}/manifest.json" "${BACKUP_DIR}/config/manifest.json"
cp "${ROOT_DIR}/.env.example" "${BACKUP_DIR}/config/.env.example"
cp "${ROOT_DIR}/.env.staging.example" "${BACKUP_DIR}/config/.env.staging.example"
cp "${ROOT_DIR}/.env.mail.example" "${BACKUP_DIR}/config/.env.mail.example"
cp -R "${ROOT_DIR}/docker" "${BACKUP_DIR}/config/docker"
cp -R "${ROOT_DIR}/deploy" "${BACKUP_DIR}/config/deploy"

{
  echo "created_at=${STAMP}"
  echo "git_commit=$(git -C "${ROOT_DIR}" rev-parse HEAD 2>/dev/null || echo unknown)"
  echo "docker_services="
  docker ps --format '  {{.Names}} -> {{.Image}}'
} > "${BACKUP_DIR}/config/backup-manifest.txt"

echo "Retention..."
find "${BACKUP_ROOT}" -mindepth 1 -maxdepth 1 -type d -mtime +"${RETENTION_DAYS}" -exec rm -rf {} \;

echo "Done -> ${BACKUP_DIR}"
