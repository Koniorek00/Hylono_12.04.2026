# Infrastructure Operator Checklists

## PostgreSQL 16
### Must verify
- connection pooling path chosen
- backups scheduled
- restore test performed
- slow query visibility enabled
- disk and WAL growth monitored
- SSL/TLS posture verified
- public exposure blocked unless explicitly required

### Watch for
- connection exhaustion from application concurrency
- long-running transactions
- missing indexes on high-traffic paths
- silent backup failures

## Redis 7
### Must verify
- cache-only vs persistent use declared
- persistence mode selected intentionally
- eviction policy reviewed
- memory headroom defined
- monitoring in place for evictions and latency
- license and procurement posture reviewed

### Watch for
- using Redis as a durable database by accident
- unnoticed key growth
- silent data loss from poor persistence assumptions

## MongoDB 7
### Must verify
- replication and backup approach documented
- auth enabled and admin access controlled
- storage growth monitored
- indexes reviewed for expected workloads
- restore path documented

### Watch for
- schema drift without ownership
- overuse as a catch-all store
- poor query patterns hidden by small datasets early on

## MinIO or Alternative Object Store
### Must verify
- official product direction reviewed
- licensing and support posture reviewed
- bucket naming and retention rules defined
- backup and disaster recovery assumptions documented
- signed URL and access policy model documented

### Watch for
- assuming S3 compatibility means zero migration cost
- unclear lifecycle rules for large binary assets

## Uptime Kuma
### Must verify
- alert channels configured
- monitored targets aligned with true user journeys
- ownership assigned for failed checks

### Watch for
- vanity uptime without actionable incident paths
