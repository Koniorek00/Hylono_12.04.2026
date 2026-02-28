# Data Governance — Hylono Stack v5.6

**Last updated:** 2026-02-18  
**Applies to:** All services handling personal or sensitive data

---

## 1. Scope

This document defines data governance policies for the Hylono Stack, including data classification, retention, access control, GDPR compliance, and cross-service data flow rules.

---

## 2. Data Classification

| Class | Examples | Handling |
|-------|---------|---------|
| **Class A — PII** | Names, emails, health data | Encrypted at rest + in transit, access logged |
| **Class B — Business** | Orders, invoices, asset records | Encrypted at rest, role-based access |
| **Class C — Operational** | Logs, metrics, audit trails | Aggregated, no direct PII |
| **Class D — Public** | Documentation, blog content | No restrictions |

---

## 3. Data Stores

### 3.1 PostgreSQL (21 databases)
Each service uses its own isolated database with a dedicated user. Cross-database queries are forbidden. See `docker/infrastructure/init-databases.sh` for the full list.

| Database | Service | Class |
|----------|---------|-------|
| `medusa_db` | Medusa Commerce | A, B |
| `lago_db` | Lago Billing | B |
| `twenty_db` | Twenty CRM | A, B |
| `n8n_db` | n8n Automation | C |
| `zitadel_db` | Zitadel IdP | A |
| `leihs_db` | Leihs Lending | A, B |
| `snipeit_db` | Snipe-IT Assets | B |
| `calcom_db` | Cal.com Scheduling | A |
| `documenso_db` | Documenso Docs | A, B |
| `thingsboard_db` | ThingsBoard IoT | B, C |
| `strapi_db` | Strapi CMS | D |
| `dify_db` | Dify AI | B |
| `grafana_db` | Grafana | C |
| `chatwoot_db` | Chatwoot | A |
| `mautic_db` | Mautic Marketing | A |
| `formbricks_db` | Formbricks Surveys | A |
| `gorse_db` | Gorse Recommendations | C |
| `temporal_db` | Temporal Workflows | C |
| `temporal_visibility` | Temporal Visibility | C |
| `wazuh_db` | Wazuh SIEM | C |
| `classroomio_db` | ClassroomIO LMS | A |

### 3.2 Redis
- Shared Redis instance, all keys namespaced by service (`{service}:*`)
- No PII stored in Redis (cache/queue only)
- TTL enforced on all keys

### 3.3 MinIO (Object Storage)
- Buckets isolated per service
- Server-side encryption (SSE-S3) enabled
- Access via presigned URLs with 1-hour expiry maximum

### 3.4 MongoDB
- Used exclusively by Novu (notification service)
- Contains notification preferences and delivery logs (Class C)

---

## 4. GDPR Compliance

### 4.1 Lawful Basis
All personal data processing requires one of:
- Explicit consent (stored in Formbricks)
- Contractual necessity (order fulfillment via Medusa)
- Legitimate interest (documented per-service)

### 4.2 Data Subject Rights

| Right | Mechanism | SLA |
|-------|-----------|-----|
| Access | Export via Twenty CRM + Medusa admin | 30 days |
| Rectification | Direct edit in Twenty CRM | 7 days |
| Erasure | Automated cascade delete workflow (n8n) | 30 days |
| Portability | JSON export from Medusa + Twenty | 30 days |
| Objection | Opt-out workflow via Mautic | Immediate |

### 4.3 Erasure Workflow
The right-to-erasure is handled by an n8n workflow (`gdpr-erasure.json`):
1. Request received via Chatwoot or API
2. n8n triggers cascade: Medusa → Twenty CRM → Mautic → Formbricks → Chatwoot
3. MinIO personal files purged
4. Confirmation email sent via Novu
5. Audit record written to Retraced (pseudonymized)

---

## 5. Data Retention

| Data Type | Retention Period | Action on Expiry |
|-----------|-----------------|-----------------|
| Customer PII | Duration of contract + 3 years | Automated deletion |
| Transaction records | 7 years (legal requirement) | Archive to cold storage |
| Logs (operational) | 90 days | Purge |
| Audit trails (Retraced) | 5 years | Archive |
| IoT sensor data | 2 years rolling | Aggregate + purge raw |
| Booking records | 5 years | Archive |

---

## 6. Data Flow Map

```
User → Kong (TLS) → Chatwoot/Formbricks (Class A capture)
                  → Medusa (commerce) → Lago (billing)
                  → Twenty CRM (relationship data)
                  → Cal.com (scheduling)
                  
Automation: n8n orchestrates cross-service workflows
Analytics: PostHog (anonymized) + Metabase (aggregated)
Storage: MinIO (files) + PostgreSQL (structured) + Redis (cache)
```

---

## 7. Cross-Border Data Transfer

- **Primary region**: EU (GDPR jurisdiction)
- **No third-country transfers** without Standard Contractual Clauses (SCCs)
- Backup destinations must be EU-based (tested quarterly)

---

## 8. Data Breach Response

1. **Detect** — Wazuh alert or human discovery
2. **Assess** — Identify affected data classes + subject count
3. **Notify** — DPA notification within 72 hours if high-risk (GDPR Art. 33)
4. **Contain** — Isolate affected service, rotate credentials
5. **Document** — Full incident report in `.agent/memory/active/errors.md`

---

*This document is reviewed annually or after any data incident or regulatory change.*
