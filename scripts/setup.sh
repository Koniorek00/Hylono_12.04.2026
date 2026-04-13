#!/bin/bash
set -euo pipefail
STACK_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PHASE=${1:-"infrastructure"}

# 1. Ensure secrets exist
if [ ! -f "$STACK_DIR/.env" ]; then
  bash "$STACK_DIR/scripts/generate-secrets.sh"
fi

# 2. Deploy
case $PHASE in
  infrastructure)
    docker compose -f "$STACK_DIR/docker/infrastructure/docker-compose.yml" --env-file "$STACK_DIR/.env" up -d
    ;;
  active)
    docker compose -f "$STACK_DIR/docker/infrastructure/docker-compose.yml" --env-file "$STACK_DIR/.env" up -d
    docker compose -f "$STACK_DIR/docker/phase-1a/docker-compose.yml" --env-file "$STACK_DIR/.env" up -d twenty novu-api novu-worker novu-ws novu-dashboard n8n n8n-worker
    ;;
  1a)
    docker compose -f "$STACK_DIR/docker/infrastructure/docker-compose.yml" --env-file "$STACK_DIR/.env" up -d
    docker compose -f "$STACK_DIR/docker/phase-1a/docker-compose.yml" --env-file "$STACK_DIR/.env" up -d
    ;;
  phase2)
    docker compose -f "$STACK_DIR/docker/infrastructure/docker-compose.yml" --env-file "$STACK_DIR/.env" up -d
    docker compose -f "$STACK_DIR/docker/phase-2/docker-compose.yml" --env-file "$STACK_DIR/.env" up -d
    ;;
  *)
    echo "Unknown phase. Use: infrastructure, active, 1a, phase2"
    exit 1
    ;;
esac
