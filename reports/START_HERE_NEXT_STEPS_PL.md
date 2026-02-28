# START HERE — Co dokładnie zrobić teraz (PL)

To jest najkrótsza i najpraktyczniejsza wersja planu.

## Krok 1 (TY) — decyzja techniczna
Wybierz: **Option A (Vite + osobny backend)**.

> Bez tej decyzji nie ruszamy TASK-018/019/020.

## Krok 2 (TY) — przygotuj sekrety/env
Dostarcz (na start):
- `DATABASE_URL`
- `ZITADEL_ISSUER`
- `ZITADEL_CLIENT_ID`
- `ZITADEL_CLIENT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `MEDUSA_API_URL`
- `MEDUSA_API_KEY`
- `LAGO_API_URL`
- `LAGO_API_KEY`

## Krok 3 (AI) — backend start
Ja robię:
1. Tworzę `server/` i endpointy:
   - `GET /health`
   - `POST /checkout/session`
   - `POST /rental-checkout/session`
   - `POST /contact`
   - `POST /newsletter`
   - `POST /book-demo`
2. Przepinam frontend z martwego `app/api/*` na `VITE_API_BASE_URL`.

## Krok 4 (AI) — Prisma i dane
Ja robię:
1. `prisma validate`
2. `prisma generate`
3. pierwsza migracja core
4. podpięcie odczytu/zapisu do API

## Krok 5 (AI + TY) — logowanie produkcyjne
- TY: dane Zitadel (OIDC).
- AI: podmiana `mockAuth.ts` na real auth + role + guardy `/partner/*`.

## Krok 6 (AI + TY) — checkout/billing
- TY: klucze i decyzje billingowe.
- AI: Stripe + Medusa + Lago + webhooki + sync statusów.

## Krok 7 (AI) — test końcowy
Sprawdzam end-to-end:
- logowanie,
- checkout/rental,
- webhook success/failure,
- poprawny zapis statusów w bazie.

---

## Co napisać do mnie, żeby ruszyć od razu
Napisz dokładnie:

**„Potwierdzam Option A. Start Faza 1. Sekrety gotowe.”**

Wtedy zaczynam wdrożenie techniczne od razu.
