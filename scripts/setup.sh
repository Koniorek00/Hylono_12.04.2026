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
  1a)
    docker compose -f "$STACK_DIR/docker/infrastructure/docker-compose.yml" --env-file "$STACK_DIR/.env" up -d
    docker compose -f "$STACK_DIR/docker/phase-1a/docker-compose.yml" --env-file "$STACK_DIR/.env" up -d
    ;;
  *)
    echo "Unknown phase. Use: infrastructure, 1a"
    exit 1
    ;;
esac
