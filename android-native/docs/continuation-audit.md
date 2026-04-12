# Android Continuation Audit

## Continuation Root

- Selected root: `android-native/`
- Decision basis:
  - only candidate that still assembles successfully in the current workspace: `:app:assembleDebug`, `:app:testDebugUnitTest`, and `:app:lintDebug` all passed on 2026-04-12
  - broadest implemented Compose shell: home, catalog, product detail, protocols, protocol detail, locator, booking, rental, support, and Nexus
  - only candidate already wired to concrete HTTP submission for booking, rental, contact, and newsletter instead of a purely seeded operations stub
  - smallest-diff path for continuing real intake work without restarting

## Duplicate Tree Disposition

- `android-native/`: authoritative continuation root
- `android/`: non-authoritative salvage source only; current `:app:assembleDebug` fails with missing `Theme.Material3.DayNight.NoActionBar`
- `native-android/`: non-authoritative salvage source only; current `:app:assembleDebug` fails on malformed `ic_launcher_foreground.xml`

## Current Status Matrix

| Area | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Compose shell and navigation | IMPLEMENTED | `ui/HylonoApp.kt`, `ui/screens/*` | Broadest shell lives here |
| Booking intake | IMPLEMENTED | `data/repository/HttpIntakeGateway.kt` -> `/api/booking` | Native form + HTTP submission |
| Rental intake | IMPLEMENTED | `data/repository/HttpIntakeGateway.kt` -> `/api/rental` | Native form + HTTP submission |
| Support request center | PARTIALLY IMPLEMENTED | `ui/screens/SupportScreen.kt` | Contact + newsletter wired with local draft persistence; no authenticated support inbox |
| Intake failure handling | IMPLEMENTED | `data/repository/HttpIntakeGateway.kt`, `ui/components/HylonoWidgets.kt` | Server validation, rate-limit, and degraded-backend responses surface in-app instead of collapsing into one generic error |
| Product and protocol seeded content | IMPLEMENTED | `SeedHylonoRepository.kt` | Seeded from repo-derived content only |
| Partner locator | IMPLEMENTED | `PartnersScreen.kt` | Seeded partner list |
| Nexus staff workspace | IMPLEMENTED | `NexusScreen.kt` | Seeded clients/fleet only |
| Auth/session | VERIFY | `lib/auth.ts`, `app/api/rental/route.ts` | Website uses NextAuth credential + cookie sessions; no mobile-safe token/session contract was found |
| Checkout / mobile payments | NOT IMPLEMENTED | no Stripe mobile SDK, no checkout module | Website checkout exists, but no native payment contract or SDK integration exists here |
| Push notifications | NOT IMPLEMENTED | no FCM setup found | |
| Offline sync / local persistence | PARTIALLY IMPLEMENTED | `data/repository/HylonoDraftStore.kt` | Form drafts persist locally via DataStore; no offline sync or cross-device state |
| Real clinic data APIs | NOT IMPLEMENTED | Nexus data is seeded in `SeedHylonoRepository.kt` | |
| Hilt DI | NOT IMPLEMENTED | no Hilt dependency or annotations found | |
| Retrofit / OkHttp | NOT IMPLEMENTED | `HttpURLConnection` is used directly | |
| Room | NOT IMPLEMENTED | no Room dependency or schema found | |
| DataStore | IMPLEMENTED | `app/build.gradle.kts`, `data/repository/HylonoDraftStore.kt` | Preferences DataStore stores booking/rental/contact/newsletter drafts |
| WorkManager | NOT IMPLEMENTED | no WorkManager dependency found | |
| Baseline Profiles / Macrobenchmark | NOT IMPLEMENTED | no benchmark modules found | |
| LeakCanary / StrictMode hardening | NOT IMPLEMENTED | no integration found | |
| Android unit / UI tests | PARTIALLY IMPLEMENTED | `app/src/test/java/com/hylono/mobile/**` | JVM tests added for validators and draft codec; no instrumentation/UI suite yet |
| Android CI | IMPLEMENTED | `.github/workflows/android-native.yml` | Dedicated Android workflow runs assemble, lint, and unit tests |
| Phase 0 website autopsy artifact | NOT IMPLEMENTED | no Android discovery artifact found outside this audit | |
| North Star / KPI / personas / JTBD / competitor package | NOT IMPLEMENTED | no repo-grounded Android product strategy pack found | |
| C4 model / ADR pack / MVVM-vs-MVI decision record | PARTIALLY IMPLEMENTED | code implies ViewModel + repository layering | `// VERIFY:` formal ADRs were not found before this audit |

## Build and Environment Notes

- Stack in selected root:
  - AGP `8.13.2`
  - Gradle `8.13`
  - Kotlin `2.2.21`
  - Compose BOM `2026.02.01`
  - Navigation Compose `2.9.7`
  - Lifecycle `2.10.0`
- Local verification on 2026-04-12:
  - `android-native\gradlew.bat :app:assembleDebug`
  - `android-native\gradlew.bat :app:testDebugUnitTest`
  - `android-native\gradlew.bat :app:lintDebug`
- SDK path was not configured in `android-native/local.properties` during this audit.
- `// VERIFY:` local builds in this workspace rely on `C:\Users\wikto\AppData\Local\Android\Sdk` or a caller-provided `ANDROID_SDK_ROOT`.

## Immediate Continuation Rule

- Advance `android-native/` only.
- Do not keep feature work active in `android/` or `native-android/`.
- When non-selected trees contain useful ideas, port the smallest validated piece into `android-native/` and keep the source trees untouched until an explicit archive step is executed.
