# MinIO — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** High strategic risk for new adoption because of the apparent community/archive/commercial shift.
- **Security posture note:** Object storage becomes a central data plane. Misconfigured buckets, replication, or lifecycle rules create serious exposure.
- **Maintenance hotspot:** Capacity monitoring, lifecycle rule validation, bucket policy review, and strategic vendor/license review.
- **Hidden complexity:** Assuming community MinIO remains a stable default, underestimating bucket-policy risk, and building new dependencies before clarifying the product/licensing direction.
- **EU / GDPR / health-data relevance:** Object storage may contain signed documents, uploads, backups, and audit artifacts. EU hosting, encryption, retention, and access logging matter.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.