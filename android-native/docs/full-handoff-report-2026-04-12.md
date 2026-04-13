# Android Native Full Handoff Report

Date: 2026-04-12
Scope: `android-native/app`
Audience: next AI / engineer continuing the native Android application

## Evidence Base

This report is based on confirmed inspection of:

- `android-native/README.md`
- `android-native/docs/continuation-audit.md`
- `android-native/app/build.gradle.kts`
- `android-native/app/src/main/AndroidManifest.xml`
- `android-native/app/src/main/java/com/hylono/mobile/**`
- `android-native/app/src/test/java/com/hylono/mobile/**`
- `.github/workflows/android-native.yml`
- `app/api/booking/route.ts`
- `app/api/contact/route.ts`
- `app/api/newsletter/route.ts`
- `app/api/rental/route.ts`
- `app/api/checkout/route.ts`
- `lib/auth.ts`

This report intentionally separates:

- `CONFIRMED:` directly verified in code or repo docs
- `INFERRED:` strongly implied by multiple repo signals
- `VERIFY:` requires human or runtime confirmation before productizing
- `DECISION:` explicit handoff choice made from repo evidence

## 1. PAGE UNDERSTANDING

`CONFIRMED:` the in-scope target is the native Android app module at `android-native/app`, not the public Next.js site and not the duplicate trees `android/` or `native-android/`.

`CONFIRMED:` this app is a real Kotlin + Jetpack Compose Android app, not a WebView shell, and it is intended to be the native operational layer behind the public website.

`CONFIRMED:` the app is positioned around these jobs:

- consumer discovery for devices and protocols
- booking and rental intake
- support and newsletter capture
- partner/showroom discovery
- clinic-side Nexus operations for clients and fleet

`INFERRED:` the product split is:

- website = SEO, discovery, public education, public conversion entry
- Android app = faster operational workflows after intent becomes action

`DECISION:` treat `android-native/app` as the only continuation root for feature work. Do not continue active development in `android/` or `native-android/`.

## 2. WHAT EXISTS NOW

### Stack and Build Foundation

`CONFIRMED:` the Android app currently stands on:

- Android Gradle Plugin `8.13.2`
- Gradle `8.13`
- Kotlin `2.2.21`
- Java 17 / JVM target 17
- `compileSdk 36`
- `targetSdk 36`
- `minSdk 26`
- Jetpack Compose
- Material 3
- Navigation Compose `2.9.7`
- Lifecycle Compose / ViewModel `2.10.0`
- DataStore Preferences `1.2.1`

Primary files:

- `android-native/build.gradle.kts`
- `android-native/gradle/wrapper/gradle-wrapper.properties`
- `android-native/app/build.gradle.kts`

`CONFIRMED:` backend base URL is injected through a Gradle property:

- `HYLONO_API_BASE_URL`
- default fallback is `https://hylono.com`

### App Runtime Shape

`CONFIRMED:` the manifest is minimal:

- one launcher activity
- internet permission enabled
- custom Hylono theme

Primary file:

- `android-native/app/src/main/AndroidManifest.xml`

`CONFIRMED:` app entry flow:

- `MainActivity` enables edge-to-edge
- `HylonoTheme` wraps the app
- `HylonoMobileApp()` owns shell navigation

Primary files:

- `android-native/app/src/main/java/com/hylono/mobile/MainActivity.kt`
- `android-native/app/src/main/java/com/hylono/mobile/ui/HylonoApp.kt`
- `android-native/app/src/main/java/com/hylono/mobile/ui/theme/Theme.kt`

### Navigation and Screen Inventory

`CONFIRMED:` top-level navigation uses a bottom bar with these roots:

- `home`
- `catalog`
- `protocols`
- `partners`
- `nexus`

`CONFIRMED:` additional routes exist for:

- `support`
- `booking`
- `rental`
- `product/{productId}`
- `protocol/{protocolSlug}`

`CONFIRMED:` implemented screen files include:

- `ui/screens/HomeScreen.kt`
- `ui/screens/CatalogScreen.kt`
- `ui/screens/ProductDetailScreen.kt`
- `ui/screens/ProtocolsScreen.kt`
- `ui/screens/ProtocolDetailScreen.kt`
- `ui/screens/PartnersScreen.kt`
- `ui/screens/SupportScreen.kt`
- `ui/screens/BookingScreen.kt`
- `ui/screens/RentalScreen.kt`
- `ui/screens/NexusScreen.kt`

### UI Pattern System

`CONFIRMED:` the app already has a visible UI language and reusable primitives:

- `BackHeader`
- `SectionHeader`
- `GradientPanel`
- `InfoChip`
- `MetricCard`
- `SubmissionBanner`

Primary file:

- `android-native/app/src/main/java/com/hylono/mobile/ui/components/HylonoWidgets.kt`

`CONFIRMED:` visual direction already exists and should be preserved unless intentionally redesigned:

- custom Hylono light/dark color scheme
- rounded cards
- chip-based secondary actions and filters
- long-scroll sectioned screens
- a clear “operations + trust” tone rather than consumer lifestyle gloss

Primary files:

- `android-native/app/src/main/java/com/hylono/mobile/ui/theme/Theme.kt`
- `android-native/app/src/main/java/com/hylono/mobile/ui/theme/Color.kt`
- `android-native/app/src/main/java/com/hylono/mobile/ui/theme/Type.kt`

### State Management and Architecture

`CONFIRMED:` architecture is currently a lightweight single-module MVVM-style shape:

- Compose UI
- one app-level `HylonoViewModel`
- repository interface
- seed repository implementation
- HTTP intake gateway for real submissions
- DataStore-backed draft persistence

Primary files:

- `ui/HylonoViewModel.kt`
- `data/repository/HylonoRepository.kt`
- `data/repository/SeedHylonoRepository.kt`
- `data/repository/HttpIntakeGateway.kt`
- `data/repository/HylonoDraftStore.kt`

`CONFIRMED:` there is no evidence of:

- Hilt DI
- Retrofit
- OkHttp
- Room
- WorkManager
- multi-module Android architecture

This is also explicitly recorded in `android-native/docs/continuation-audit.md`.

### Data Model and Current Data Source

`CONFIRMED:` the app has typed domain models for:

- products
- protocols
- partners
- clinic clients
- fleet devices
- support info
- booking / rental / contact / newsletter drafts
- submission result states

Primary file:

- `android-native/app/src/main/java/com/hylono/mobile/data/model/HylonoModels.kt`

`CONFIRMED:` the current “content” layer is local seed data embedded directly in Android code, not loaded from the web app’s source-of-truth files at runtime.

Primary file:

- `android-native/app/src/main/java/com/hylono/mobile/data/repository/SeedHylonoRepository.kt`

`INFERRED:` README language says the Android data is “seeded from repo-derived content only”, but the present implementation is still Android-local duplication, not a shared content pipeline. That means content drift risk is real.

### Forms and Persistence

`CONFIRMED:` these user-entered draft types persist locally:

- booking draft
- rental draft
- contact draft
- newsletter draft

`CONFIRMED:` persistence is implemented through `androidx.datastore.preferences` and codec helpers.

Primary files:

- `data/repository/HylonoDraftStore.kt`
- `data/repository/HylonoDraftCodec.kt`
- `data/model/DraftContent.kt`

`CONFIRMED:` draft saves are intentionally delayed by `250ms` debounce in the ViewModel.

### Validation and Submission Feedback

`CONFIRMED:` local validation exists for:

- booking
- rental
- contact
- newsletter

Primary file:

- `ui/HylonoValidators.kt`

`CONFIRMED:` submission feedback model already supports:

- loading state
- success state
- error state
- field-level detail lines
- retry-after hints
- returned reference IDs

Primary files:

- `ui/HylonoViewModel.kt`
- `ui/components/HylonoWidgets.kt`

### Real Backend Integrations Already Wired

`CONFIRMED:` the Android app already posts to the production Next.js App Router backend for:

- `POST /api/booking`
- `POST /api/rental`
- `POST /api/contact`
- `POST /api/newsletter`

Primary files:

- `android-native/app/src/main/java/com/hylono/mobile/data/repository/HttpIntakeGateway.kt`
- `app/api/booking/route.ts`
- `app/api/rental/route.ts`
- `app/api/contact/route.ts`
- `app/api/newsletter/route.ts`

`CONFIRMED:` server-side maturity is stronger than the Android client in these flows. The web backend already has:

- Zod validation
- request sanitization
- rate limiting
- Drizzle persistence
- duplicate detection
- explicit degraded-mode responses
- downstream integration hooks to N8N / Twenty / Novu

`CONFIRMED:` Android submission handling already surfaces server-side validation and rate-limit detail instead of collapsing everything into one generic error.

### Authentication Boundary

`CONFIRMED:` `GET /api/rental` now requires a valid authenticated session from NextAuth.

Primary files:

- `app/api/rental/route.ts`
- `lib/auth.ts`

`CONFIRMED:` the Android UI explicitly warns that rental history lookup is blocked until a mobile-safe auth/session contract exists.

Primary files:

- `ui/screens/RentalScreen.kt`
- `ui/screens/SupportScreen.kt`

### Checkout Status

`CONFIRMED:` the web repo already has a serious checkout server contract at `POST /api/checkout`, including trusted pricing and Stripe PaymentIntent orchestration.

Primary file:

- `app/api/checkout/route.ts`

`CONFIRMED:` the Android app does not currently expose native checkout UI or Stripe Android integration.

### Testing and CI

`CONFIRMED:` current JVM test coverage exists for:

- validators
- draft codec round-trips
- HTTP error parsing

Primary files:

- `app/src/test/java/com/hylono/mobile/ui/HylonoValidatorsTest.kt`
- `app/src/test/java/com/hylono/mobile/data/repository/HylonoDraftCodecTest.kt`
- `app/src/test/java/com/hylono/mobile/data/repository/HttpIntakeGatewayTest.kt`

`CONFIRMED:` there is no `androidTest` instrumentation suite in the selected root.

`CONFIRMED:` CI exists specifically for `android-native/` and runs:

- assembleDebug
- lintDebug
- testDebugUnitTest

Primary file:

- `.github/workflows/android-native.yml`

## 3. WHAT IS MISSING

### Product-Critical Missing Pieces

`CONFIRMED:` no mobile-safe auth/session contract exists for Android.

Impact:

- no native sign-in
- no authenticated rental history
- no safe access to user-owned account data

`CONFIRMED:` native checkout is not implemented.

Impact:

- app can generate interest and intake
- app cannot yet complete the strongest purchase path natively

`CONFIRMED:` staff-side Nexus data is seeded only.

Impact:

- current Nexus is a UI shell, not a live operations workspace

`CONFIRMED:` content and catalog data are local seeds inside Android.

Impact:

- product / protocol / partner copy can drift away from the website
- no single source of truth for mobile content delivery

### Architecture Missing Pieces

`CONFIRMED:` there is no formal dependency injection layer.

`CONFIRMED:` there is no structured HTTP client stack like Retrofit/OkHttp.

`CONFIRMED:` there is no local database like Room for richer offline state.

`CONFIRMED:` there is no WorkManager-based background sync.

`CONFIRMED:` there is no module split for `core`, `feature`, `data`, or `domain`.

`INFERRED:` this is acceptable for the current first cut, but it will become friction as soon as auth, checkout, offline sync, and real Nexus APIs land.

### Quality Missing Pieces

`CONFIRMED:` there are no UI tests or instrumentation tests.

`CONFIRMED:` no push notification setup is present.

`CONFIRMED:` no mobile analytics or crash-reporting integration was found in the inspected Android module.

`VERIFY:` device/performance profiling hardening was not found in the selected root. The continuation audit also marks baseline profiles, macrobenchmark, LeakCanary, and StrictMode hardening as not implemented.

### UX / Product Missing Pieces

`CONFIRMED:` there is no native rental-history screen because auth is missing.

`CONFIRMED:` there is no account profile, session management, or credential flow in the Android app.

`CONFIRMED:` there is no native payment sheet.

`CONFIRMED:` there is no real-time clinic queue, ticket inbox, operator task list, or fleet action workflow beyond seeded display.

`CONFIRMED:` there is no localization pipeline.

`CONFIRMED:` there are very limited app resources beyond launcher assets and values files.

## 4. WHY IT MATTERS

The app already has enough shape to prove the product direction, but it is still between “functional prototype” and “production-first vertical slice”.

Without auth:

- Android cannot safely become the logged-in operational layer
- rental follow-up remains half-open
- user ownership stays web-bound

Without a shared content strategy:

- Android and web can silently diverge on pricing, safety wording, protocol details, partner data, and product positioning

Without real Nexus APIs:

- the strongest differentiator in the app remains demo-only

Without native checkout:

- the app supports lead capture and rental intake, but not the highest-intent transaction path

Without stronger Android infra:

- each new feature will add more duplication, manual wiring, and testing gaps

## 5. REQUIRED SUPPORTING PAGES / CONTENT / FLOWS

For this Android app to perform at elite level, the following supporting assets must exist elsewhere in the system:

### Backend / Contract Dependencies

`REQUIRED:`

- mobile-safe auth contract
- authenticated session bootstrap or token exchange flow for native
- native rental-history/list contract built on top of mobile auth
- native account/profile contract
- checkout client contract for Android payment flow
- real Nexus APIs for clients, fleet, and service actions

### Content / Source-of-Truth Dependencies

`REQUIRED:`

- one authoritative export strategy for products, protocols, partners, and support copy
- clear ownership of pricing truth between web commerce layer and mobile presentation
- explicit rule for how Android receives freshness updates when web content changes

### Operational Dependencies

`REQUIRED:`

- app analytics event map
- crash / failure observability path
- release checklist for backend base URL, auth secrets, and API environment
- QA flows for booking, rental, contact, newsletter, auth, and checkout

### Documentation Dependencies

`REQUIRED:`

- one ADR documenting the chosen Android architecture direction from this point
- one contract doc for every backend route the Android app is allowed to call
- one “content sync strategy” note so future agents do not hard-code more seed duplication

## 6. REQUIRED RESEARCH MAP

This section defines what must be researched next. It does not claim the research has already been completed.

### Research Bucket A: Mobile Auth Strategy

Goal:

- determine how Android should authenticate against a backend currently centered on NextAuth credential + cookie flows

Questions:

- should Android use token exchange, session bootstrap, magic link, or an app-specific credentials contract
- how will secure token storage work on-device
- how will session refresh and logout work

Expected output:

- one approved mobile auth contract
- one implementation sequence for backend first, Android second

### Research Bucket B: Native Checkout Strategy

Goal:

- align Android purchase flow with the existing `POST /api/checkout` backend

Questions:

- should Android use Stripe PaymentSheet or a custom Stripe flow
- what payment methods are truly in scope for mobile
- what order states must the app expose

Expected output:

- one native checkout integration decision
- one server/client contract map

### Research Bucket C: Content Synchronization Strategy

Goal:

- eliminate Android-local drift from web content

Questions:

- should Android consume generated JSON, a CMS/API, or a shared build artifact
- which content remains static seed versus remotely refreshed
- who owns pricing and compliance-sensitive copy

Expected output:

- one source-of-truth architecture for mobile content

### Research Bucket D: Android Architecture Upgrade Path

Goal:

- decide how far to evolve from the current lightweight single-module app

Questions:

- stay single-module longer or split now
- when to introduce DI
- when to move from `HttpURLConnection` to a real HTTP client
- when to introduce Room and sync

Expected output:

- one incremental architecture roadmap

### Research Bucket E: Competitive / Category Benchmarking

Goal:

- benchmark how strong clinic/device/wellness apps handle account, booking, support, rentals, and operator tools

Questions:

- what “elite” mobile experiences exist in adjacent clinic, medical-device, wellness, rental, or field-ops products
- which patterns improve clarity and trust without overbuilding

Expected output:

- benchmark pack for auth, booking, support, operations dashboard, and checkout patterns

### Research Bucket F: Trust / Compliance / Health Communication

Goal:

- keep mobile copy aligned with the repo’s existing evidence and health-adjacent safety posture

Questions:

- what medical / wellness phrasing should remain informational rather than claim-heavy
- which protocol or product descriptions require review metadata or stronger disclaimers if expanded

Expected output:

- content guardrails for mobile-specific product and protocol copy

## 7. PRIORITIZED RECOMMENDATIONS

### Priority 0: Non-Negotiable Continuation Rules

1. Continue only in `android-native/`.
2. Do not add feature work to `android/` or `native-android/`.
3. Do not hard-code more product/protocol/business data directly into Android unless it is an explicitly temporary seed.
4. Preserve the existing Compose shell, theme direction, and route structure unless a deliberate redesign is approved.

### Priority 1: Unlock the Real Logged-In App

1. Build a mobile-safe auth/session contract at the backend boundary.
2. Add Android sign-in/session handling on top of that contract.
3. Expose rental history only after auth is solved end-to-end.

Why first:

- this is the biggest blocker between “native intake shell” and “real user app”

### Priority 2: Remove Content Drift Risk

1. Replace Android-local product/protocol/partner seeds with an authoritative sync strategy.
2. Preserve Android UI models, but stop treating hard-coded Kotlin lists as the long-term content source.

Why second:

- every new screen built on current seeds increases future migration cost

### Priority 3: Turn Nexus from Demo Shell into Real Operations Surface

1. Define real APIs for clients, fleet, and service events.
2. Keep current screen shapes where possible, but swap seed repository slices for live repository slices gradually.

Why third:

- Nexus is already the strongest differentiated internal workspace in the app, but it is not live yet

### Priority 4: Native Checkout

1. Decide the mobile payment UX against the existing `/api/checkout` contract.
2. Add Android checkout only after auth and contract clarity are in place.

Why fourth:

- backend groundwork exists, but Android still lacks the payment and order UX layer

### Priority 5: Strengthen Android Infrastructure

1. Add instrumentation/UI tests for the highest-value flows.
2. Introduce stronger networking and DI only when the number of live APIs justifies it.
3. Introduce Room only when offline or cached authenticated data becomes real scope.

Why fifth:

- infra should support product progress, not get invented too early

## 8. VERIFY ITEMS

- `VERIFY:` whether the current Android screens have already been re-validated on recent physical devices after the 2026-04-12 continuation audit
- `VERIFY:` whether any production Android release signing setup exists outside the inspected repo surface
- `VERIFY:` whether a mobile-specific auth strategy has already been discussed outside the repo in product or backend planning
- `VERIFY:` whether pricing/currency rules for mobile should remain informational or become transaction-authoritative
- `VERIFY:` whether Android should support only the current EU service area or a broader regional rollout
- `VERIFY:` whether Nexus is intended for internal staff only or also partner/clinic external accounts
- `VERIFY:` whether app analytics/crash tooling are intentionally deferred or simply not added yet

## 9. DECISIONS MADE FROM EVIDENCE

- `DECISION:` `android-native/` is the authoritative Android continuation root.
- `DECISION:` treat the current app as a native vertical slice with real intake integration, not as a finished production architecture.
- `DECISION:` the next foundational milestone should be auth/session, not visual redesign.
- `DECISION:` seeded Kotlin content is now a migration target, not a stable long-term architecture.
- `DECISION:` reuse existing screen shells and route structure where possible instead of rebuilding the UX from zero.
- `DECISION:` keep server-side route contracts as authoritative; Android should adapt to those contracts, not invent parallel mobile-only semantics without backend approval.

## 10. OPTIONAL NEXT SMALLEST IMPROVEMENTS

These are the smallest high-impact moves if a full auth or checkout push cannot start immediately.

1. Add a repo doc that maps each Android screen to:
   - source data
   - backend dependency
   - current maturity
2. Add `androidTest` smoke coverage for:
   - app launch
   - booking submit happy path
   - rental validation error path
   - support/newsletter feedback banners
3. Extract seed content loading behind a cleaner interface so later API-backed replacement is less invasive.

## Direct Build-Next Guidance For The Next AI

If the next task is open-ended, build in this order:

1. auth/session contract definition
2. Android auth UI + secure session handling
3. rental history after auth
4. content sync strategy replacing hard-coded seed duplication
5. live Nexus APIs
6. native checkout
7. stronger Android infra only where newly justified

If the next task is narrower, these guardrails still apply:

- do not switch continuation root
- do not introduce speculative architecture
- do not expand seed duplication
- do not bypass existing backend contracts
- do not expose authenticated data until mobile auth is real

## One-Screen Summary

`CONFIRMED:` this app already has a credible native Compose shell, real form submission into production App Router contracts, local draft persistence, testable validation, and dedicated CI.

`CONFIRMED:` it is not yet a full production mobile platform because auth, native checkout, live Nexus data, and authoritative content sync are still missing.

`DECISION:` the next agent should treat `android-native/app` as a real product foundation worth extending, but should spend its next serious effort on identity, data authority, and live operational contracts rather than cosmetic expansion.
