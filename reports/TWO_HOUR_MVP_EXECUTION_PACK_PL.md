# Hylono — 2h MVP Execution Pack (PL)

Cel: w **maks 2 godziny** odblokować najważniejsze rzeczy: martwe API (TASK-018) + start Prisma (TASK-019) + początek real auth (TASK-020).

To NIE jest pełny rollout 59 usług — to szybki, techniczny „starter”, żeby system zaczął żyć.

---

## 0) Co robimy w tych 2h (zakres)

Wchodzą do zakresu:
- żywy backend endpoint (`/health` + formularze + szkic checkout),
- podłączenie frontu przez `VITE_API_BASE_URL`,
- `prisma validate/generate` + test połączenia DB,
- plan/auth skeleton zamiast dalszego użycia mock-only.

Poza zakresem 2h:
- pełne produkcyjne workflowy Stripe/Lago/Medusa,
- kompletna migracja auth z wszystkimi rolami i edge-case,
- pełne integracje CRM/IoT/monitoring.

---

## 1) Ty — checklista 20 minut (bez tego nie ruszamy)

## 1.1 Decyzja
- [ ] Potwierdź: **Option A (Vite + osobny backend)**.

## 1.2 Minimum sekretów
Przygotuj (testowe):
- [ ] `DATABASE_URL`
- [ ] `ZITADEL_ISSUER`
- [ ] `ZITADEL_CLIENT_ID`
- [ ] `ZITADEL_CLIENT_SECRET`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`

## 1.3 Linki (kliknij)
- Neon Postgres: https://neon.tech/
- Prisma quickstart: https://www.prisma.io/docs/getting-started/quickstart
- ZITADEL docs: https://zitadel.com/docs
- Stripe keys: https://dashboard.stripe.com/test/apikeys
- Stripe webhooks: https://docs.stripe.com/webhooks
- Hono (lekki backend): https://hono.dev/

## 1.4 Co wpisać w Google (kopiuj-wklej)
- `how to create free postgres database neon`
- `zitadel create oidc application step by step`
- `stripe webhook secret local development`
- `prisma generate migrate dev with existing schema`
- `hono cors middleware example`

---

## 2) Ja (AI) — co robię w 80 minut

## 2.1 Backend bootstrap (TASK-018)
Tworzę minimalny backend (np. `server/`) z endpointami:
- `GET /health`
- `POST /contact`
- `POST /newsletter`
- `POST /book-demo`
- `POST /checkout/session` (stub/skeleton, ale żywy)

## 2.2 Front → API
- przepinam frontend na `VITE_API_BASE_URL`,
- kończę zależność od martwego `app/api/*` dla tych flow.

## 2.3 Prisma start (TASK-019)
- `prisma validate`
- `prisma generate`
- test połączenia do DB i minimalny odczyt/zapis.

## 2.4 Auth starter (TASK-020)
- zostawiamy pełny auth rollout na kolejny krok,
- ale przygotowuję bazę pod przełączenie z `mockAuth.ts` na real OIDC.

---

## 3) Komendy do odpalenia (kopiuj-wklej)

> Zakładam PowerShell / Windows.

## 3.1 Frontend (już masz)
```powershell
cd "F:\ag projects\Hylono - fresh"
npm install
npm run dev
```

## 3.2 Prisma quick check
```powershell
cd "F:\ag projects\Hylono - fresh"
npx prisma validate
npx prisma generate
```

## 3.3 Jeśli DATABASE_URL nie ustawione
```powershell
cd "F:\ag projects\Hylono - fresh"
copy .env.example .env.local
# potem wklej DATABASE_URL do .env.local
```

## 3.4 Szybki test endpointu health (po starcie backendu)
```powershell
curl http://localhost:8787/health
```

---

## 4) Gotowy template `.env.local` (minimum 2h)

Wklej do `F:\ag projects\Hylono - fresh\.env.local`:

```env
# Core
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
VITE_API_BASE_URL=http://localhost:8787

# Auth (starter)
ZITADEL_ISSUER=https://YOUR_TENANT.zitadel.cloud
ZITADEL_CLIENT_ID=...
ZITADEL_CLIENT_SECRET=...

# Billing (starter)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 5) Plan 120 minut — minuta po minucie

## 00–20 min (TY)
- decyzja Option A,
- zdobycie sekretów,
- wpisanie `.env.local`.

## 20–60 min (AI)
- tworzę backend i endpointy,
- odpalam health + CORS + body parsing,
- podpinam kontakt/newsletter/book-demo.

## 60–90 min (AI)
- przepinam frontend na `VITE_API_BASE_URL`,
- testuję flow formularzy,
- dodaję checkout stub endpoint.

## 90–110 min (AI)
- uruchamiam Prisma validate/generate,
- test DB read/write.

## 110–120 min (AI + TY)
- wspólny smoke test:
  - `/health` => 200,
  - formularze => odpowiedź backendu,
  - Prisma => działa,
  - brak wywołań martwego `app/api/*` dla kluczowych flow.

---

## 6) Definicja sukcesu po 2h

Po 2h ma być prawda:
1. `app/api/*` nie blokuje kluczowych formularzy,
2. jest żywy backend endpoint i routing,
3. frontend gada z backendem,
4. Prisma client jest wygenerowany,
5. jest baza pod szybkie dokończenie auth i billing w kolejnym kroku.

---

## 7) Co dalej zaraz po 2h (next sprint)

1. pełny auth OIDC (session/roles),
2. checkout production (Stripe webhooks + idempotency),
3. Medusa/Lago sync,
4. CRM/docs/notifications.

---

## 8) Jedna wiadomość, którą masz mi wysłać

Skopiuj i wyślij:

**„Potwierdzam Option A. Sekrety w `.env.local` gotowe. Startujemy 2h MVP teraz.”**

Wtedy od razu zaczynam implementację.
