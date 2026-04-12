# Hylono Native Android App

This subproject turns the current Hylono website into a native Android product instead of a browser shell. The app is built around the workflows the business actually runs today:

- goal-first onboarding and stack selection
- device discovery across HBOT and hydrogen lines
- protocol guidance and weekly cadence
- rental tracking and upgrade readiness
- support, booking, and account follow-up

## Product direction

The website remains the source for public discovery and SEO. The Android app is the logged-in, operational layer for users after interest becomes intent:

1. pick a goal and recommended stack
2. review device fit and pricing
3. follow a protocol plan
4. manage rentals and support
5. stay inside the Hylono ecosystem instead of returning to the public site

## Source mapping

The seeded app content is derived from these web source-of-truth files:

- `content/site-entity.ts`
- `content/products.ts`
- `content/protocols.ts`
- `content/goals.ts`
- `content/rental.ts`
- `content/hydrogen-premium-2026.ts`

## Mobile to backend contract map

The Android app is structured so the current website backend can be reused instead of rebuilt:

| Mobile flow | Existing website contract |
| --- | --- |
| Support / advisor request | `POST /api/contact` |
| Demo / consultation booking | `POST /api/booking` |
| Rental application submit | `POST /api/rental` |
| Rental list refresh | `GET /api/rental?userId=<id>` |
| Checkout handoff | `POST /api/checkout` |
| Newsletter / lifecycle opt-in | `POST /api/newsletter` |

The code currently ships with seeded repository data and a stub operations gateway so product and UI can move ahead before HTTP wiring is added.

## Local run

1. Install Android Studio or the Android command line SDK.
2. Create `native-android/local.properties` with your SDK path, for example:

```properties
sdk.dir=C:\\Users\\you\\AppData\\Local\\Android\\Sdk
```

3. From `native-android/`, run:

```bash
./gradlew.bat :app:assembleDebug
```

## Current scope

Included now:

- Kotlin + Jetpack Compose Android app
- custom Hylono theme
- Today, Devices, Protocols, Rentals, and Support screens
- seeded domain models for real Hylono devices, plans, and workflows

Next implementation step:

- replace `SeedOperationsGateway` with a real HTTP client pointed at the existing Next.js `app/api/*` routes

## Verification status in this workspace

Gradle wrapper was bootstrapped successfully in-repo. Full Android assembly was not executed here because this environment does not have an Android SDK configured.
