# MinIO — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Do not assume legacy MinIO community guidance still matches the 2026 reality. Revalidate whether Hylono wants MinIO specifically, an AIStor commercial commitment, or another object-storage path. [https://github.com/minio/minio/releases, 2026-04-12, latest observed community release]
    - **Deployment methods to prefer:** Historically container- or Kubernetes-friendly; current official guidance is centered on AIStor and its operator/helm-based patterns.
    - **Required infrastructure:** Durable disks, network throughput, TLS, backup/replication design, S3-compatible client validation.
    - **Env / secret pattern:** Root credentials, domain/bucket config, storage layout, TLS certs, and policy settings.
    - **Persistence / backup requirement:** Object storage durability depends on storage design, replication, and tested backup/restore procedures.
    - **Upgrade / maintenance focus:** Capacity monitoring, lifecycle rule validation, bucket policy review, and strategic vendor/license review.
    - **Common failure points:** Assuming community MinIO remains a stable default, underestimating bucket-policy risk, and building new dependencies before clarifying the product/licensing direction.

    ## Minimum viable deployment path
    1. Provision the service on isolated infrastructure or a dedicated shared platform host.
2. Store secrets in Infisical or equivalent; put public or admin ingress behind Kong / private networking as appropriate.
3. Add backups / exporters / health checks before broader rollout.
4. Integrate one real dependent service first, then scale usage.

    ## Reverse proxy / gateway pattern
    - Put externally reachable services behind TLS and a deliberate boundary. For Hylono, that generally means **Kong or a simpler reverse proxy first**, with the public Next.js site remaining the customer-facing entrypoint unless the app package explicitly calls for a separate product surface.
    - Keep admin planes private or SSO-protected wherever possible.
    - Route webhooks and callback URLs through stable, documented hostnames; do not depend on local tunnels in production.

    ## Observability hooks
    - Add health checks / uptime checks in Uptime Kuma where appropriate.
    - Export metrics to Prometheus / Grafana when the app becomes operationally important.
    - Log through a centralized approach that avoids leaking secrets or unnecessary personal data.