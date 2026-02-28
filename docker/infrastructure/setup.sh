#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Hylono Stack v5.6 — Environment Setup
# Generates unique cryptographic secrets for all services from .env.example
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
ENV_EXAMPLE="${ROOT_DIR}/.env.example"
ENV_FILE="${ROOT_DIR}/.env"

if [ ! -f "${ENV_EXAMPLE}" ]; then
  echo "ERROR: .env.example not found at ${ENV_EXAMPLE}" >&2
  exit 1
fi

if [ -f "${ENV_FILE}" ]; then
  echo "WARNING: .env already exists. Creating backup at .env.backup"
  cp "${ENV_FILE}" "${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
fi

echo "Generating unique secrets for all Hylono Stack services..."

# Track all generated secrets to ensure uniqueness
declare -A GENERATED_SECRETS

generate_unique_secret() {
  local length="${1:-32}"
  local secret
  local attempts=0
  
  while true; do
    secret=$(openssl rand -hex "${length}")
    attempts=$((attempts + 1))
    
    # Check uniqueness across all previously generated secrets
    local is_unique=true
    for existing in "${!GENERATED_SECRETS[@]}"; do
      if [ "${GENERATED_SECRETS[$existing]}" = "${secret}" ]; then
        is_unique=false
        break
      fi
    done
    
    if [ "${is_unique}" = "true" ]; then
      echo "${secret}"
      return 0
    fi
    
    if [ "${attempts}" -gt 100 ]; then
      echo "ERROR: Could not generate unique secret after 100 attempts" >&2
      exit 1
    fi
  done
}

# Process .env.example line by line
output_lines=()

while IFS= read -r line; do
  # Pass through comments and empty lines unchanged
  if [[ "${line}" =~ ^# ]] || [[ -z "${line}" ]]; then
    output_lines+=("${line}")
    continue
  fi
  
  # Parse KEY=VALUE pairs
  if [[ "${line}" =~ ^([A-Z_]+)=CHANGE_ME_([0-9]+)$ ]]; then
    key="${BASH_REMATCH[1]}"
    byte_length="${BASH_REMATCH[2]}"
    hex_length=$((byte_length / 2))
    
    secret=$(generate_unique_secret "${hex_length}")
    GENERATED_SECRETS["${key}"]="${secret}"
    output_lines+=("${key}=${secret}")
    echo "  ✓ Generated ${key} (${byte_length} bytes)"
  else
    # Non-secret line (e.g. MINIO_ROOT_USER=hylono-admin or MANIFEST_PATH=...)
    output_lines+=("${line}")
  fi
done < "${ENV_EXAMPLE}"

# Write the generated .env file
printf '%s\n' "${output_lines[@]}" > "${ENV_FILE}"

echo ""
echo "✅ Generated ${#GENERATED_SECRETS[@]} unique secrets"
echo "✅ Written to ${ENV_FILE}"
echo ""
echo "IMPORTANT: Keep .env secret — never commit to version control"
echo "           Review .env before starting services"
