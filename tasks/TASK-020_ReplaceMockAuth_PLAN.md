# Task: TASK-020 - Replace Mock Auth with Real Server Auth

## Done When
Real authentication system is operational with register/login/logout flows, and mockAuth.ts is removed from active auth flow.

## Steps

* [ ] Step 1: Analyze current mock auth implementation → Verify: read lib/mockAuth.ts and context/AuthContext.tsx
* [ ] Step 2: Design real auth architecture → Verify: decide on auth provider/strategy (JWT, session, OIDC)
* [ ] Step 3: Create server auth endpoints → Verify: create /api/auth/register, /api/auth/login, /api/auth/logout, /api/auth/session
* [ ] Step 4: Update frontend AuthContext → Verify: switch from mockAuth to backend API calls
* [ ] Step 5: Handle session persistence → Verify: implement proper session storage (cookies or token management)
* [ ] Step 6: Test auth flows → Verify: register, login, logout, session restore work correctly

## Verification (max 8, each <30 seconds)

* [ ] Check 1: New user can register via real endpoint
* [ ] Check 2: Existing user can login with correct credentials
* [ ] Check 3: Invalid credentials return proper error
* [ ] Check 4: Logout clears session properly
* [ ] Check 5: Session persists across page refresh
* [ ] Check 6: TypeScript compiles without errors
* [ ] Check 7: Mock auth no longer used in active flow
* [ ] Check 8: Auth-protected routes work correctly

## Decisions Made

* [DECISION]: Auth strategy will be JWT-based with HTTP-only cookies for session security

## Deviations

* [none yet]
