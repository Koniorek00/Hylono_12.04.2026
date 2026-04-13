# Android Mobile Auth Contract

Last updated: 2026-04-12

## Purpose

This contract gives `android-native/app` a mobile-safe way to unlock authenticated rental history without depending on a website browser cookie.

Current scope is intentionally narrow:

- credential authority remains the same repo-configured credentials source already used by the protected website login
- mobile auth currently unlocks rental-history access for that configured account
- this is not a general multi-user consumer identity system yet

## Endpoints

### `POST /api/mobile/auth`

Creates a mobile bearer-token session from the configured credentials account.

Request JSON:

```json
{
  "email": "operator@hylono.example",
  "password": "secret"
}
```

Success response:

```json
{
  "success": true,
  "message": "Mobile session ready.",
  "session": {
    "tokenType": "Bearer",
    "accessToken": "jwt-like-token",
    "accessTokenExpiresAtEpochSeconds": 1760000000,
    "refreshToken": "jwt-like-token",
    "refreshTokenExpiresAtEpochSeconds": 1762592000,
    "scopes": ["rentals:read"],
    "user": {
      "email": "operator@hylono.example",
      "name": "Hylono User"
    }
  }
}
```

Failure modes:

- `400` invalid request payload
- `401` invalid email or password
- `429` rate limited
- `503` mobile auth not configured on the deployment

### `POST /api/mobile/auth/refresh`

Refreshes a mobile session using a valid refresh token.

Request JSON:

```json
{
  "refreshToken": "jwt-like-refresh-token"
}
```

Success response shape is the same as `POST /api/mobile/auth`.

Failure modes:

- `400` invalid request payload
- `401` refresh token invalid or expired
- `429` rate limited
- `503` mobile auth not configured on the deployment

### `GET /api/rental`

Authenticated rental-history lookup now accepts either:

- the existing website session from `NextAuth`
- `Authorization: Bearer <accessToken>` from the mobile auth contract

Rules:

- the authenticated user can only read rentals for their own normalized account email
- `userId` or `email` query params must match the authenticated account if provided
- unauthenticated access still returns `401`

## Android Storage and Refresh Rules

- access and refresh tokens are stored on-device in encrypted form via Android Keystore-backed AES/GCM
- the app refreshes the access token before it expires when possible
- if the refresh token is expired or rejected, the app clears the local session and asks the user to sign in again
- sign-out is local device logout for now; no server-side token revocation store exists yet

## Implementation Files

- backend helpers:
  - `lib/auth-credentials.ts`
  - `lib/mobile-auth.ts`
- backend routes:
  - `app/api/mobile/auth/route.ts`
  - `app/api/mobile/auth/refresh/route.ts`
  - `app/api/rental/route.ts`
- Android client:
  - `android-native/app/src/main/java/com/hylono/mobile/data/repository/HttpMobileAuthGateway.kt`
  - `android-native/app/src/main/java/com/hylono/mobile/data/repository/HylonoSessionStore.kt`
  - `android-native/app/src/main/java/com/hylono/mobile/ui/HylonoViewModel.kt`
  - `android-native/app/src/main/java/com/hylono/mobile/ui/screens/RentalScreen.kt`

## Known Limitations

- one credentials-backed account only; no customer-specific registration or profile model yet
- no server-side token revocation list
- no native checkout or broader account/profile APIs yet
