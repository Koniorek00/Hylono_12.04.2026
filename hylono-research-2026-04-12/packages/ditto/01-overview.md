# Ditto — Overview

## Snapshot
- Environment context: **Phase 2 / UNKNOWN**
- Researched as: **Dittofeed [INFERRED]**
- Current version researched: **Current self-host docs available; exact stable version UNVERIFIED** — **INFERRED identity / version UNVERIFIED** [https://github.com/dittofeed/dittofeed, 2026-04-12, UNVERIFIED current]
- License posture: **Review current repo license before bundling** — **UNVERIFIED** [https://docs.dittofeed.com/, 2026-04-12, current]
- Recommended timing: **LIKELY REDUNDANT / VERIFY IDENTITY FIRST**
- Maintenance burden: **High**
- Risk level: **High**

## Phase A — App identity
- **What it is:** Omnichannel customer engagement and campaign platform positioned as an open-source Customer.io alternative. [https://docs.dittofeed.com/, 2026-04-12, current]
- **What it solves:** Journey/campaign messaging, customer event ingestion, and engagement automation across channels. [https://github.com/dittofeed/dittofeed, 2026-04-12, UNVERIFIED current]
- **Best-fit users:** Growth/product teams running lifecycle messaging and customer journeys. [https://docs.dittofeed.com/, 2026-04-12, current]
- **Where it fits in a modern stack:** Lower fit than Novu + Listmonk/Mautic for the current Hylono stack. Useful only if Hylono wants a dedicated product-engagement platform beyond transactional notifications and basic marketing automation. [https://github.com/dittofeed/helm-charts, 2026-04-12, current]

## Hylono fit snapshot
- **Business usefulness:** Could ingest product events from Next.js or n8n, but current stack already has better-aligned notification/marketing pieces. [https://github.com/dittofeed/dittofeed, 2026-04-12, UNVERIFIED current]
- **Overlap watch:** Heavy overlap with Novu, Listmonk, Mautic, and some n8n-driven lifecycle flows.
- **Must verify before implementation:** Primary unresolved item: confirm that 'Ditto' in your inventory really refers to Dittofeed.