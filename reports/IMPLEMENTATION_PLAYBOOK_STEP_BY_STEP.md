# Hylono — Implementation Playbook (Step-by-Step)

Data: 2026-02-19  
Cel: praktyczny plan „co dokładnie robimy”, żeby cały stack z `manifest.json` działał end-to-end.

---

## 1) Co blokuje wszystko (najpierw to)

### Krytyczne blokery
1. **TASK-018** — `app/api/*` jest martwe w Vite SPA (brak żywego backendu).
2. **TASK-019** — Prisma client nie jest generowany/uruchomiony.
3. **TASK-020** — auth nadal działa na `mockAuth.ts`.

Bez odblokowania tych 3 punktów większość integracji z repozytoriów nie ruszy produkcyjnie.

---

## 2) Kto za co odpowiada (jasny podział)

## Ty (Owner/Decydent)
- wybór architektury backendu (A/B/C),
- dostarczenie kluczy/API/secrets i kont usług,
- decyzje biznesowe (billing, role, SLA, procesy wyjątków),
- akceptacja prawna (privacy/terms/shipping, claimy).

## Ja (AI)
- implementacja backendu i endpointów,
- konfiguracja Prisma/migracji i modeli danych,
- wdrożenie real auth (Zitadel),
- integracje Medusa/Lago/Stripe/Twenty/Documenso/Novu,
- workflowy n8n/Temporal,
- monitoring/health/alerting,
- testy techniczne i checklista go-live.

---

## 3) Decyzja architektury (TASK-018)

Rekomendacja praktyczna: **Option A**
- frontend zostaje Vite,
- backend stawiamy osobno (Node + Hono/Express),
- frontend komunikuje się przez `VITE_API_BASE_URL`.

Dlaczego A teraz:
- najszybsza droga do odblokowania checkout/auth/webhooków,
- najmniejszy koszt migracji UI,
- łatwe iteracje i separacja odpowiedzialności.

---

## 4) Wejście techniczne — co musi być przygotowane

## 4.1 Dostępy i sekrety (minimum)

| Obszar | Przykładowe zmienne/env | Kto dostarcza |
|---|---|---|
| Postgres | `DATABASE_URL` | Ty |
| Auth (Zitadel) | `ZITADEL_ISSUER`, `ZITADEL_CLIENT_ID`, `ZITADEL_CLIENT_SECRET`, `ZITADEL_REDIRECT_URI` | Ty |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Ty |
| Medusa | `MEDUSA_API_URL`, `MEDUSA_API_KEY` | Ty |
| Lago | `LAGO_API_URL`, `LAGO_API_KEY` | Ty |
| Twenty | `TWENTY_API_URL`, `TWENTY_API_KEY` | Ty |
| Documenso | `DOCUMENSO_API_URL`, `DOCUMENSO_API_KEY` | Ty |
| Novu | `NOVU_API_URL`, `NOVU_API_KEY` | Ty |
| n8n | `N8N_BASE_URL`, `N8N_API_KEY` | Ty |
| Fleet/Booking | `SNIPEIT_API_URL`, `SNIPEIT_API_TOKEN`, `CALCOM_API_KEY` | Ty |

> Uwaga: nazwy env można dostosować do konwencji repo. Najważniejsze, żeby były spójne i tylko w `.env*`.

## 4.2 Decyzje biznesowe wymagane przed kodem
- model subskrypcji rental (plany, trial, grace period),
- reguły retry płatności i odcięć usług,
- role użytkowników (`admin`, `partner`, `customer`) i ich uprawnienia,
- definicja statusów operacyjnych (asset, serwis, zwrot, onboarding).

---

## 5) Plan wykonania — fazy techniczne

## Faza 1: Backend bootstrap (odblokowanie API)
**Cel:** żywe API zamiast martwego `app/api/*`.

### Kroki
1. Tworzymy backend (np. `server/`) z modułami: `auth`, `checkout`, `forms`, `webhooks`, `health`.
2. Dodajemy endpointy:
   - `GET /health`
   - `POST /auth/*`
   - `POST /checkout/session`
   - `POST /rental-checkout/session`
   - `POST /contact`, `POST /newsletter`, `POST /book-demo`
   - `POST /webhooks/stripe` (+ kolejne webhooks)
3. Frontend przełączamy na `VITE_API_BASE_URL`.
4. `app/api/*` zostawiamy jako referencję logiki (nie usuwamy na start).

### Weryfikacja
- każdy formularz odpowiada HTTP 2xx/4xx z żywego backendu,
- `GET /health` działa lokalnie i na środowisku testowym.

---

## Faza 2: Prisma + modele (TASK-019)
**Cel:** trwałe dane i spójny model domeny.

### Kroki
1. Konfiguracja `DATABASE_URL`.
2. `prisma validate` → `prisma generate`.
3. Pierwsza migracja core (users/sessions/partners/customers/orders/subscriptions/assets/bookings/events).
4. Repozytoria danych + serwisy aplikacyjne.

### Przykładowe komendy
```bash
npx prisma validate
npx prisma generate
npx prisma migrate dev --name init_core
```

### Weryfikacja
- backend zapisuje i odczytuje dane bez mocków,
- migracje działają powtarzalnie na clean DB.

---

## Faza 3: Auth produkcyjny (TASK-020)
**Cel:** zastąpienie `mockAuth.ts` realnym IAM.

### Kroki
1. Konfigurujemy OIDC z Zitadel.
2. Backend: callback auth, weryfikacja tokenów, sesja aplikacyjna.
3. Frontend: `AuthContext` przełączony z mocka na backend API.
4. Guardy: `/partner/*` + endpointy role-based.

### Weryfikacja
- login/logout działa,
- użytkownik bez roli nie ma dostępu do route i endpointów partnera,
- `mockAuth.ts` nie jest używany w flow produkcyjnym.

---

## Faza 4: Revenue spine (Medusa + Lago + Stripe)
**Cel:** działający checkout/rental i billing.

### Kroki
1. Adapter Medusa (produkty/zamówienia).
2. Endpoint tworzenia Stripe checkout po stronie backendu.
3. Webhook Stripe (podpis, idempotencja, retry).
4. Integracja Lago (subskrypcje, metering, invoice events).
5. Spójne statusy płatności i subskrypcji w bazie.

### Weryfikacja
- testowa płatność przechodzi pełny flow,
- eventy Stripe i Lago aktualizują stan subskrypcji,
- brak podwójnych zapisów (idempotency).

---

## Faza 5: CRM + umowy + notyfikacje (Twenty + Documenso + Novu)
**Cel:** pełny onboarding klienta/partnera.

### Kroki
1. Sync lead/customer do Twenty.
2. Generowanie umowy i podpis przez Documenso.
3. Trigger notyfikacji przez Novu (powitanie, billing, statusy).
4. Webhooki zwrotne aktualizują stan onboardingu.

### Weryfikacja
- nowy partner przechodzi flow: lead → umowa → podpis → notyfikacja,
- statusy w app i CRM są zgodne.

---

## Faza 6: Workflow orchestration (n8n + Temporal)
**Cel:** automatyzacje odporne na błędy.

### Kroki
1. n8n: szybkie integracje webhook/API.
2. Temporal: długie procesy i kompensacje (zwroty, wyjątki billingowe).
3. Standard workflow:
   - idempotency key,
   - retry policy,
   - dead-letter handling,
   - trace ID.

### Weryfikacja
- awaria pojedynczego kroku nie psuje całego procesu,
- workflow można wznowić bez duplikacji skutków.

---

## Faza 7: Fleet i booking (Snipe-IT + Leihs + Cal.com)
**Cel:** operacyjny cykl życia urządzeń i terminów.

### Kroki
1. Snipe-IT jako rejestr assetów.
2. Leihs jako lifecycle wypożyczeń/zwrotów.
3. Cal.com jako harmonogram (demo/serwis).
4. Dashboard partnera przełączony ze statycznych danych na API.

### Weryfikacja
- statusy assetów aktualizują się po zdarzeniach,
- bookingi zapisują się i synchronizują z CRM/workflow.

---

## Faza 8: IoT i telemetryka (ThingsBoard + Mosquitto + Influx + Grafana)
**Cel:** live telemetry + alerty.

### Kroki
1. MQTT topics + auth urządzeń.
2. Telemetria: ThingsBoard → InfluxDB.
3. Dashboardy Grafana + alerty do n8n/Novu.

### Weryfikacja
- dane z urządzeń pojawiają się na dashboardach,
- alerty działają dla progów krytycznych.

---

## Faza 9: Monitoring i security ops (Uptime/Prometheus/Wazuh)
**Cel:** wykrywalność awarii i incydentów.

### Kroki
1. Uptime Kuma dla endpointów i usług.
2. Prometheus dla metryk API/DB/workers.
3. Wazuh dla zdarzeń bezpieczeństwa.

### Weryfikacja
- testowy incydent wywołuje alert,
- mamy widoczność SLO/SLA usług.

---

## Faza 10: Compliance + Go-live gate
**Cel:** bezpieczne wejście na produkcję.

### Checklist
- [ ] legal pages finalne (TASK-012),
- [ ] consent/GDPR działa poprawnie,
- [ ] brak sekretów w repo,
- [ ] webhook signatures walidowane,
- [ ] role i uprawnienia przetestowane,
- [ ] E2E przechodzi kluczowe flow.

---

## 6) Plan 14-dniowy (realny start)

## Dni 1–2
- decyzja architektury + backend skeleton + `/health` + env setup.

## Dni 3–4
- Prisma generate/migracje + model core + podstawowe repozytoria.

## Dni 5–6
- auth Zitadel + sesje + guardy route/API.

## Dni 7–8
- Stripe checkout + webhooks + Lago sync.

## Dni 9–10
- Medusa/Twenty/Documenso/Novu podstawowe flow onboardingowe.

## Dni 11–12
- n8n + pierwsze workflowy (order→billing, booking→CRM).

## Dni 13–14
- monitoring + hardening + testy E2E + go-live checklist.

---

## 7) Definicja sukcesu („działa i śmiga”)

Projekt uznajemy za gotowy operacyjnie, gdy:
1. checkout i rental działają produkcyjnie,
2. auth jest realny (bez mocka),
3. CRM/umowy/notyfikacje działają end-to-end,
4. workflowy mają retry/idempotencję/monitoring,
5. dashboard partnera działa na realnych danych,
6. jest aktywny monitoring i przechodzi checklista go-live.

---

## 8) Co robimy natychmiast po Twojej zgodzie

Po Twojej decyzji architektury i dostarczeniu sekretów, ja od razu zaczynam:
1. backend bootstrap,
2. Prisma + migracje,
3. auth Zitadel,
4. Stripe/Lago/Medusa flow,
5. pierwsze workflowy n8n.

To jest najszybsza ścieżka do realnie działającego systemu.
