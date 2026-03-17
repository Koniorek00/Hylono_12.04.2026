#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STACK_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$STACK_DIR/.env"
EXAMPLE="$STACK_DIR/.env.example"

if [ -f "$ENV_FILE" ]; then
  echo ".env already exists. Skipping."
  exit 0
fi

if [ ! -f "$EXAMPLE" ]; then
  echo "Error: $EXAMPLE not found."
  exit 1
fi

# Generate unique secret per line
while IFS= read -r line; do
  if echo "$line" | grep -q "CHANGE_ME_64"; then
    echo "$line" | sed "s/CHANGE_ME_64/$(openssl rand -hex 32)/"
  elif echo "$line" | grep -q "CHANGE_ME_32"; then
    echo "$line" | sed "s/CHANGE_ME_32/$(openssl rand -hex 16)/"
  else
    echo "$line"
  fi
done < "$EXAMPLE" > "$ENV_FILE"

echo "Secrets generated in $ENV_FILE"
