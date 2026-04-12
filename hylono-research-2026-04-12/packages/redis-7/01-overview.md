# Redis 7 — Overview

## Snapshot
- Environment context: **Infrastructure / RUNNING**
- Researched as: **Redis 7 major line**
- Current version researched: **7.4.8** — **CONFIRMED** [https://redis.io/legal/licenses/, 2026-04-12, 7.x/8.x]
- License posture: **RSALv2 / SSPLv1 for 7.4.x–7.8.x; BSDv3 for older 7.2.x and earlier; Redis 8 adds AGPLv3 option** — **CONFIRMED** [https://github.com/redis/redis/releases, 2026-04-12, 7.4.8 observed]
- Recommended timing: **KEEP FOR EXISTING USE; REQUIRE LICENSE REVIEW BEFORE EXPANSION**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** In-memory data structure server used for cache, queues, ephemeral state, rate limiting, and some workflow backplanes. [https://github.com/redis/redis/releases, 2026-04-12, 7.4.8 observed]
- **What it solves:** Low-latency caching, job queues, session support, pub/sub or streams, rate limits, and burst absorption between systems. [https://redis.io/legal/licenses/, 2026-04-12, 7.x/8.x]
- **Best-fit users:** Engineering and platform teams that need fast volatile storage or queue primitives for web apps and automation systems. [https://github.com/redis/redis/releases, 2026-04-12, 7.4.8 observed]
- **Where it fits in a modern stack:** Strong technical fit because many candidate apps use Redis for queues or cache, but the licensing transition requires deliberate human review before expanding use. [https://redis.io/docs/latest/, 2026-04-12, latest]

## Hylono fit snapshot
- **Business usefulness:** Needed by Novu, n8n queue mode, and many web apps for caches or background work. It fits the stack, but licensing must be surfaced early to legal and procurement stakeholders. [https://redis.io/legal/licenses/, 2026-04-12, 7.x/8.x]
- **Overlap watch:** Possible future substitution candidate with Valkey for some workloads.
- **Must verify before implementation:** Confirm whether Hylono is comfortable with Redis 7 licensing, whether Valkey is a preferable future path, and which workloads genuinely require Redis rather than database-backed queues.