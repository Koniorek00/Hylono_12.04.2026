# Runbook: Service Restart Procedures

_Last updated: 2026-02-18 | Owner: DevOps_

---

## Overview

This runbook covers procedures for safely restarting Hylono stack services. Always follow the dependency order to avoid data corruption or failed startup sequences.

---

## Prerequisites

- SSH access to the host server
- Docker installed and running
- `.env` file present at `/opt/hylono/.env` (or project root)
- Backups verified before any restart of stateful services

---

## Dependency Order

Restart services in this order. Never restart a service before its dependencies are healthy.

```
1. postgres          (infrastructure — all services depend on this)
2. redis             (infrastructure — most services depend on this)
3. mongo             (infrastructure — required by Novu)
4. minio             (infrastructure — storage dependency)
5. uptime-kuma       (monitoring — no dependencies)
6. zitadel           (IAM — most app services need auth)
7. n8n               (automation — orchestrates other services)
8. [application services in any order]
```

---

## Restart Commands

### Restart a single service

```bash
docker compose -f /opt/hylono/docker/infrastructure/docker-compose.yml restart <service-name>
```

Example — restart PostgreSQL:
```bash
docker compose -f /opt/hylono/docker/infrastructure/docker-compose.yml restart postgres
```

### Restart all infrastructure

```bash
docker compose -f /opt/hylono/docker/infrastructure/docker-compose.yml restart
```

### Restart Phase 1A services

```bash
docker compose -f /opt/hylono/docker/phase-1a/docker-compose.yml restart
```

### Full stack restart (maintenance window required)

```bash
# 1. Stop all services (reverse dependency order)
docker compose -f /opt/hylono/docker/phase-1a/docker-compose.yml down
docker compose -f /opt/hylono/docker/infrastructure/docker-compose.yml down

# 2. Verify all containers stopped
docker ps --filter "name=hylono-"

# 3. Start infrastructure first
docker compose -f /opt/hylono/docker/infrastructure/docker-compose.yml up -d

# 4. Wait for postgres health
until docker exec hylono-postgres pg_isready -U postgres; do
  echo "Waiting for postgres..."; sleep 3;
done

# 5. Start Phase 1A
docker compose -f /opt/hylono/docker/phase-1a/docker-compose.yml up -d
```

---

## Health Checks

### Check all running hylono containers

```bash
docker ps --filter "name=hylono-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Check service logs (last 50 lines)

```bash
docker logs --tail 50 hylono-<service-name>
```

### Check PostgreSQL health

```bash
docker exec hylono-postgres pg_isready -U postgres
```

### Check Redis health

```bash
docker exec hylono-redis redis-cli -a "$REDIS_PASSWORD" ping
```

### Check MinIO health

```bash
curl -f http://localhost:9000/minio/health/live && echo "MinIO OK"
```

---

## Troubleshooting

### Service fails to start — database connection refused

1. Verify postgres is healthy: `docker exec hylono-postgres pg_isready -U postgres`
2. Check the database was created: `docker exec hylono-postgres psql -U postgres -l | grep <service>_db`
3. If missing, re-run init: `docker exec hylono-postgres psql -U postgres -f /docker-entrypoint-initdb.d/init-databases.sh`

### Service fails to start — Redis connection refused

1. Check Redis is running: `docker ps --filter "name=hylono-redis"`
2. Test connection: `docker exec hylono-redis redis-cli -a "$REDIS_PASSWORD" ping`
3. Restart Redis: `docker compose -f docker/infrastructure/docker-compose.yml restart redis`

### Out of disk space

```bash
# Check disk usage
df -h
docker system df

# Prune unused images/volumes (CAUTION: verify before running)
docker system prune --volumes
```

### Container keeps restarting

```bash
# Check logs for crash reason
docker logs --tail 100 hylono-<service-name>

# Inspect exit code
docker inspect hylono-<service-name> --format "{{.State.ExitCode}}"
```

---

## Rollback Procedure

If a service update causes issues:

```bash
# 1. Stop the problematic service
docker stop hylono-<service-name>

# 2. Pull previous image version (replace :latest with specific tag)
docker pull <image>:<previous-tag>

# 3. Update docker-compose.yml image tag
# 4. Restart
docker compose -f docker/<phase>/docker-compose.yml up -d <service-name>
```

---

## Contacts

| Issue | Contact |
|-------|---------|
| Database corruption | Data Architect on-call |
| Security incident | Security team + Wazuh alerts |
| Service degradation | DevOps on-call |
| Data breach | DPO (GDPR — 72h notification window) |
