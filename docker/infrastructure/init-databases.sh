#!/bin/bash
set -e

create_db() {
  local user=$1
  local db=$2
  local pass=$3
  echo "Creating database: $db"
  psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE USER $user WITH PASSWORD '$pass';
    CREATE DATABASE $db OWNER $user;
    GRANT ALL PRIVILEGES ON DATABASE $db TO $user;
EOSQL
}

grant_createdb() {
  local user=$1
  psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    ALTER ROLE $user CREATEDB;
EOSQL
}

enable_extension_as_role() {
  local db=$1
  local role=$2
  local extension=$3
  psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "$db" <<-EOSQL
    SET ROLE $role;
    CREATE EXTENSION IF NOT EXISTS $extension;
    RESET ROLE;
EOSQL
}

# Phase 1A
create_db "medusa" "medusa_db" "${MEDUSA_DB_PASSWORD}"
create_db "lago" "lago_db" "${LAGO_DB_PASSWORD}"
grant_createdb "lago"
enable_extension_as_role "lago_db" "lago" "pg_partman"
create_db "twenty" "twenty_db" "${TWENTY_DB_PASSWORD}"
create_db "n8n" "n8n_db" "${N8N_DB_PASSWORD}"
create_db "zitadel" "zitadel_db" "${ZITADEL_DB_PASSWORD}"
create_db "leihs" "leihs_db" "${LEIHS_DB_PASSWORD}"
create_db "calcom" "calcom_db" "${CALCOM_DB_PASSWORD}"
create_db "documenso" "documenso_db" "${DOCUMENSO_DB_PASSWORD}"

# Phase 1B
create_db "thingsboard" "thingsboard_db" "${THINGSBOARD_DB_PASSWORD}"
create_db "strapi" "strapi_db" "${STRAPI_DB_PASSWORD}"
create_db "dify" "dify_db" "${DIFY_DB_PASSWORD}"
create_db "grafana" "grafana_db" "${GRAFANA_DB_PASSWORD}"

# Phase 1C
create_db "chatwoot" "chatwoot_db" "${CHATWOOT_DB_PASSWORD}"
create_db "mautic" "mautic_db" "${MAUTIC_DB_PASSWORD}"
create_db "formbricks" "formbricks_db" "${FORMBRICKS_DB_PASSWORD}"
create_db "gorse" "gorse_db" "${GORSE_DB_PASSWORD}"
create_db "temporal" "temporal_db" "${TEMPORAL_DB_PASSWORD}"
psql -v ON_ERROR_STOP=1 --username "postgres" -c "CREATE DATABASE temporal_visibility OWNER temporal;"
create_db "wazuh" "wazuh_db" "${WAZUH_DB_PASSWORD}"
create_db "classroomio" "classroomio_db" "${CLASSROOMIO_DB_PASSWORD}"

echo "All databases created."
