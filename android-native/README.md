# Hylono Native Android

Native Android application for Hylono's consumer and clinic operations workflows.

This is a real Android app project built with Kotlin and Jetpack Compose. It is not a WebView shell and it does not mirror website routes one-to-one. The app is organized around the jobs Hylono actually needs:

- Consumer discovery for devices and guided protocols
- Consultation and rental intake tied to the existing web backend
- Partner and showroom discovery
- Staff-side Nexus operations for clients and fleet health

## Stack

- Android Gradle Plugin `8.13.2`
- Gradle `8.13`
- Kotlin `2.2.21`
- Jetpack Compose BOM `2026.02.01`
- Navigation Compose `2.9.7`
- Lifecycle `2.10.0`

## Structure

- `app/src/main/java/com/hylono/mobile/data`
  Seed data and intake gateway abstractions
- `app/src/main/java/com/hylono/mobile/ui`
  View model, screens, and shared UI components
- `app/src/main/java/com/hylono/mobile/ui/theme`
  Compose theme

## Backend hooks

The app currently integrates directly with the authoritative App Router handlers under `app/api/**` for:

- `POST /api/booking`
- `POST /api/contact`
- `POST /api/newsletter`
- `POST /api/rental`
- `POST /api/mobile/auth`
- `POST /api/mobile/auth/refresh`
- `GET /api/rental` via mobile bearer token or website session

Native rental history is now exposed behind a narrow mobile-safe auth contract. The current implementation reuses the repo-configured credentials authority already used by the protected website login and stores the resulting mobile session securely on-device.

Set a different backend at build time with:

```powershell
.\gradlew.bat assembleDebug -PHYLONO_API_BASE_URL=http://10.0.2.2:3000
```

If the property is omitted, the app defaults to `https://hylono.com`.

## Build

On this machine, the Android SDK is already present under the default user path. If `ANDROID_SDK_ROOT` is not set globally, export it before building:

```powershell
$env:ANDROID_SDK_ROOT = "$env:LOCALAPPDATA\Android\Sdk"
.\gradlew.bat assembleDebug
```

## Current scope

This first native cut includes:

- Home dashboard with operational pulse
- Device catalog and detail views
- Protocol library and protocol detail views
- Partner locator
- Support request center wired to `POST /api/contact` and `POST /api/newsletter`
- Booking intake form with on-device draft persistence
- Rental intake form with on-device draft persistence
- Secure mobile sign-in for authenticated rental-history lookup
- Contact and newsletter drafts persisted locally until send or clear
- Native submission banners now surface server validation, rate-limit, and degraded-backend guidance for all repo-backed intake flows
- Nexus workspace with overview, client monitoring, and fleet health
- First JVM unit tests for validation and draft codec coverage
- GitHub Actions workflow for `android-native/` assemble, lint, and unit tests

Broader customer authentication, payment checkout, push notifications, offline sync, and real clinic data APIs are not implemented yet.

See `docs/continuation-audit.md` for the current continuation-root decision and status matrix against the original Android brief.
See `docs/mobile-auth-contract.md` for the current mobile auth and rental-history contract.
