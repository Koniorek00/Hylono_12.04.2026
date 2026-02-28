# Task: TASK-018 - Execute Backend Bootstrap (Wave 0 Foundation)

## Done When
Server directory with basic API structure exists with health endpoint, CORS, JSON parsing, and error handling is operational.

## Steps

* [ ] Step 1: Create server directory structure → Verify: /server directory with index.ts, routes/, middleware/
* [ ] Step 2: Set up Express/Hono server with CORS and JSON parsing → Verify: server starts without errors
* [ ] Step 3: Create health endpoint GET /health → Verify: returns { status: 'ok', timestamp }
* [ ] Step 4: Create shared API error envelope utility → Verify: consistent error response format
* [ ] Step 5: Test server starts → Verify: curl localhost:PORT/health returns 200

## Verification (max 8, each <30 seconds)

* [ ] Check 1: Server directory exists
* [ ] Check 2: Dependencies installed (express/hono, cors, etc.)
* [ ] Check 3: Server starts without crash
* [ ] Check 4: Health endpoint responds
* [ ] Check 5: CORS headers present
* [ ] Check 6: JSON parsing works
* [ ] Check 7: Error responses follow envelope format
* [ ] Check 8: TypeScript compiles

## Decisions Made

* [DECISION]: Using Hono for lightweight Node.js API server (matches Vite/React stack)

## Deviations

* [none yet]
