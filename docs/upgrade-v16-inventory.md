# Next.js 16 Upgrade Inventory

# Generated: 2026-02-27 23:08

## Summary

- Total files needing async params fix: **0**
- Total config changes needed: **3**
- Middleware status: **`src/middleware.ts` present; exported function is `middleware`; runtime export not declared; migration action pending runtime decision**
- Parallel routes needing default.tsx: **0**
- ESLint status: **Flat config present (`eslint.config.mjs`) + legacy `.eslintrc.json` still present**
- Deprecated APIs in use: **`middleware` file convention (deprecated in v16, replacement is `proxy` unless keeping middleware for edge runtime)**
- Estimated effort (Step 1 scope only): **2–4 hours**

## 1.1 next.config.ts full key inventory

Source: `next.config.ts`

### Findings (with exact lines)

| File             | Line | Key/Pattern             | Current Value            | Next.js 16 Action                                |
| ---------------- | ---: | ----------------------- | ------------------------ | ------------------------------------------------ |
| `next.config.ts` |    4 | `images`                | object present           | Keep; valid in v16                               |
| `next.config.ts` |    5 | `images.remotePatterns` | array present            | Keep; preferred over deprecated `images.domains` |
| `next.config.ts` |    7 | `protocol`              | `'https'`                | No change                                        |
| `next.config.ts` |    8 | `hostname`              | `'images.unsplash.com'`  | No change                                        |
| `next.config.ts` |   11 | `protocol`              | `'https'`                | No change                                        |
| `next.config.ts` |   12 | `hostname`              | `'api.qrserver.com'`     | No change                                        |
| `next.config.ts` |   15 | `protocol`              | `'https'`                | No change                                        |
| `next.config.ts` |   16 | `hostname`              | `'oxyhelp.com'`          | No change                                        |
| `next.config.ts` |   19 | `protocol`              | `'https'`                | No change                                        |
| `next.config.ts` |   20 | `hostname`              | `'cdnjs.cloudflare.com'` | No change                                        |

### Explicit checks required by 1.1

| Check                                                 | Status | Evidence                                  |
| ----------------------------------------------------- | ------ | ----------------------------------------- |
| `experimental.turbopack` present                      | ❌ No  | no `experimental` key in `next.config.ts` |
| custom `webpack` config present                       | ❌ No  | no `webpack` key in `next.config.ts`      |
| `experimental.ppr` present                            | ❌ No  | no `experimental` key                     |
| `experimental.dynamicIO` present                      | ❌ No  | no `experimental` key                     |
| `eslint` option present in next config                | ❌ No  | no `eslint` key                           |
| `skipMiddlewareUrlNormalize` present                  | ❌ No  | no key present                            |
| `images.domains` present (deprecated)                 | ❌ No  | uses `images.remotePatterns`              |
| `amp` option present                                  | ❌ No  | no `amp` key                              |
| `serverRuntimeConfig` / `publicRuntimeConfig` present | ❌ No  | no keys present                           |

### 1.1 conclusion

- Config keys currently in use are minimal and mostly v16-compatible.
- Only immediate v16 adjustment visible at this stage is scripts-level Turbopack flag usage (audited in Step 1.10), not `next.config.ts` itself.

## 1.2 synchronous params access audit

Command intent (Windows-equivalent of checklist grep due unavailable `grep`/`rg`):

- `Get-ChildItem app -Recurse -Filter *.tsx | Select-String 'const.*=.*params\b' | Where-Object { $_.Line -notmatch 'await' }`

### Raw matches

| File                | Line | Pattern                                 | Assessment                                                                      | Fix Needed                                          |
| ------------------- | ---: | --------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------- |
| `app/help/page.tsx` |   23 | `const tab = resolvedSearchParams.tab;` | False positive for `params` rule (matches `resolvedSearchParams`, not `params`) | None for params; evaluate in 1.3 searchParams audit |

### 1.2 count

- Raw regex hits: **1**
- Confirmed synchronous `params` destructuring/access requiring v16 fix: **0**

## 1.3 synchronous searchParams access audit

Command intent (Windows-equivalent of checklist grep due unavailable `grep`/`rg`):

- `Get-ChildItem app -Recurse -Filter *.tsx | Select-String 'searchParams' | Where-Object { $_.Line -notmatch 'await' }`

### Raw matches

| File                | Line | Pattern                                    | Assessment                                         | Fix Needed |
| ------------------- | ---: | ------------------------------------------ | -------------------------------------------------- | ---------- |
| `app/help/page.tsx` |   18 | `searchParams,`                            | Function signature line, not access                | None       |
| `app/help/page.tsx` |   20 | `searchParams: Promise<{ tab?: string }>;` | Type declaration already async Promise             | None       |
| `app/help/page.tsx` |   23 | `const tab = resolvedSearchParams.tab;`    | Access uses awaited alias (`resolvedSearchParams`) | None       |

### 1.3 count

- Raw regex hits: **3**
- Confirmed synchronous `searchParams` access requiring v16 fix: **0**

## 1.4 cookies/headers/draftMode usage audit

Command intent (Windows-equivalent of checklist grep due unavailable `grep`):

- Searched `src/` and `app/` for `cookies()|headers()|draftMode()` in `*.ts` and `*.tsx`

### Raw matches

| File                       | Line | Pattern                                   | Assessment                      | Fix Needed |
| -------------------------- | ---: | ----------------------------------------- | ------------------------------- | ---------- |
| `app/hho-car-kit/page.tsx` |   94 | `const requestHeaders = await headers();` | Already awaited (v16-compliant) | None       |

### 1.4 count

- Total usage hits: **1**
- Non-awaited request API hits requiring v16 fix: **0**

## 1.5 middleware/proxy audit

Source file: `src/middleware.ts`

### Findings (with exact lines)

| File                | Line | Pattern                                                            | Assessment                                            | v16 Action                                                                                         |
| ------------------- | ---: | ------------------------------------------------------------------ | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `src/middleware.ts` |   49 | `export function middleware(request: NextRequest): NextResponse {` | Uses deprecated `middleware` export convention in v16 | Rename to `proxy` **if** migrating to `proxy.ts`                                                   |
| `src/middleware.ts` |  101 | `export const config = {`                                          | Standard matcher config present                       | Keep matcher config; rename `skipMiddlewareUrlNormalize` only if used in next config (not present) |

### Runtime check

- `src/middleware.ts` contains **no** `export const runtime = 'edge'` declaration.
- [VERIFY: `middleware` effective runtime defaults are framework-defined and not explicitly declared in project code.]

### Context7 confirmation (v16)

- `proxy` runtime is Node.js and cannot be configured.
- Edge runtime is not supported in `proxy`; if Edge runtime is required, keep using `middleware`.

### 1.5 conclusion

- Convention update is required at least as a decision point:
  - keep `middleware.ts` (if edge behavior required), or
  - migrate to `proxy.ts` + `export function proxy(...)`.

## 1.6 parallel routes audit

Command intent (Windows-equivalent of checklist `find src/app -name "@*" -type d`):

- `Get-ChildItem app -Recurse -Directory -Filter '@*'`

### Findings

- No `@slot` directories found under `app/`.

### 1.6 count

- Parallel route slot directories: **0**
- Missing `default.tsx` due to parallel slots: **0**

## 1.7 image config + query-string local image audit

### Config check

- `next.config.ts` already uses `images.remotePatterns` (`next.config.ts:5`).
- `images.domains` deprecated key not present.

### Query-string image usage check

Command intent (Windows-equivalent of checklist grep):

- Search `src/` and `app/` `*.tsx` for `src=.*\?`, then filter image-related lines.

### Findings

- No image-related JSX `src` query-string matches found in scanned files.

### 1.7 count

- `images.domains` occurrences: **0**
- Local/query-string image matches requiring `images.localPatterns.search`: **0**

## 1.8 ESLint configuration audit

### Findings (with exact lines)

| File             | Line | Pattern                                           | Assessment                              | v16 Action                                            |
| ---------------- | ---: | ------------------------------------------------- | --------------------------------------- | ----------------------------------------------------- |
| `.eslintrc.json` |    1 | `{` (legacy eslintrc file exists)                 | Legacy format present                   | Consolidate on flat config to avoid dual-config drift |
| `.eslintrc.json` |    3 | `"next/core-web-vitals"`                          | Legacy Next ESLint preset in eslintrc   | Keep rules only in flat config or remove legacy file  |
| `package.json`   |   10 | `"lint": "eslint ..."`                            | Uses direct ESLint CLI (v16-compatible) | Keep                                                  |
| `package.json`   |   15 | `"check": "pnpm lint && pnpm build && pnpm test"` | No `next lint` usage                    | Keep                                                  |

### 1.8 conclusion

- `next lint` removal already handled in scripts.
- Remaining cleanup: resolve duplicate lint config model (`eslint.config.mjs` + `.eslintrc.json`).

## 1.9 removed features usage audit

Command intent (Windows-equivalent of checklist grep):

- Searched `src/` and `app/` for `useAmp|next/amp|serverRuntimeConfig|publicRuntimeConfig|getConfig|next/config`

### Findings

- No matches found.

### 1.9 count

- Removed feature API usages found: **0**

## 1.10 package script turbopack flag audit

### Findings (with exact lines)

| File           | Line | Pattern                         | Assessment                           | v16 Action           |
| -------------- | ---: | ------------------------------- | ------------------------------------ | -------------------- |
| `package.json` |    7 | `"dev": "next dev --turbopack"` | Redundant in v16 (Turbopack default) | Remove `--turbopack` |
| `package.json` |    8 | `"build": "next build"`         | v16-compatible                       | Keep                 |
| `package.json` |    9 | `"start": "next start"`         | v16-compatible                       | Keep                 |

### 1.10 count

- Scripts containing `--turbopack`/`--turbo`: **1**

## 1.11 sitemap generateSitemaps audit

Source: `app/sitemap.ts`

### Findings (with exact lines)

| File             | Line | Pattern                                                      | Assessment                                           | v16 Action                        |
| ---------------- | ---: | ------------------------------------------------------------ | ---------------------------------------------------- | --------------------------------- |
| `app/sitemap.ts` |   44 | `export default function sitemap(): MetadataRoute.Sitemap {` | Uses single sitemap function, not `generateSitemaps` | No `id: Promise` migration needed |

### 1.11 count

- `generateSitemaps` usages: **0**

## 1.12 opengraph/twitter/icon/apple-icon audit

Command intent (Windows-equivalent of checklist `find src/app ...`):

- `Get-ChildItem app -Recurse -File -Include opengraph-image*,twitter-image*,icon*,apple-icon*`

### Findings

- No matching metadata image/icon convention files found.

### 1.12 count

- Matching files requiring async params review: **0**

## 1.13 GATE verification

### Required gate checks

- `docs/upgrade-v16-inventory.md` exists with complete Step 1 audit: ✅
- Zero code files modified: ✅ (audit task modified docs only)
- Summary includes totals for async params/config/middleware/parallel routes/ESLint: ✅

### Consolidated totals

- Async request API files needing update: **0**
- Config/script/lint convention updates needed before upgrade execution: **3**
  1. Remove `--turbopack` from `package.json` dev script
  2. Decide middleware strategy (`middleware.ts` keep vs migrate to `proxy.ts`)
  3. Consolidate to ESLint flat config (remove/retire `.eslintrc.json`)
- Middleware status: `src/middleware.ts` present, `middleware` export used, runtime not explicitly declared
- Parallel route slots missing `default.tsx`: **0**
- Removed API usages (AMP, next/config, runtime config APIs): **0**

---

## STEP 2.2 — Official codemod execution record

### Command path used

Primary command requested by checklist:

- `pnpm dlx @next/codemod@canary upgrade latest`

Observed behavior in this workspace:

- Interactive menu prevented non-interactive completion in this terminal session.

Fallback execution performed (official Next codemod transforms run individually):

- `pnpm dlx @next/codemod@canary remove-experimental-ppr`
  - Result: `0 errors, 630 unmodified, 10 skipped, 0 ok`
- `pnpm dlx @next/codemod@canary remove-unstable-prefix`
  - Result: `0 errors, 630 unmodified, 10 skipped, 0 ok`
- `pnpm dlx @next/codemod@canary middleware-to-proxy . --force`
  - Result: `0 errors, 629 unmodified, 11 skipped, 0 ok`

### File change summary from codemods

- No repository files were modified by codemod transforms in this run.
- `middleware.ts` → `proxy.ts` rename was not applied by codemod (0 ok).

## STEP 2.4 — Package version verification

Source: `package.json` after manual upgrade commands from Step 2.3.

- `next`: `^16.1.6`
- `react`: `^19.2.4`
- `react-dom`: `^19.2.4`
- `@types/react`: `^19.2.14`
- `@types/react-dom`: `^19.2.3`

Verification result: ✅ Required baseline met (`next` at 16.x, `react` at 19.2.x).

## STEP 2.5 — First build attempt (full capture)

Command:

- `pnpm build`

Result:

- Build status: ✅ success (exit code 0)
- Next.js: `16.1.6`
- Compile: `Compiled successfully`
- TypeScript: completed; Next auto-adjusted `tsconfig.json` (`jsx: react-jsx`, include added for `.next/dev/types/**/*.ts`)

Build warnings observed:

- `metadataBase` not set in metadata export (warning repeated twice)

Build errors observed:

- None.

## STEP 2.6 — Error categorization

From Step 2.5 build output:

- (A) Async params/searchParams errors: **0**
- (B) Config errors: **0**
- (C) Import errors (removed APIs): **0**
- (D) Type errors: **0**
- (E) Other errors: **0**

Notes:

- Non-blocking warning present: `metadataBase` missing in metadata export (not an error category item for Step 2 gate).

## STEP 2.7 — Import-level removed API fixes

Verification method:

- Search pattern: `from ['\"]next/(amp|config|legacy/image)['\"]|useAmp\(` across `*.ts,*.tsx,*.js,*.jsx`

Result:

- Matches found: **0**
- Import-level fixes required: **none**

Build check after import-level verification:

- Reused Step 2.5 build result: ✅ no import errors present.

## STEP 2.8 — Config-level error fixes

Files reviewed:

- `next.config.ts`
- `tsconfig.json` (auto-adjusted by Next during build)

Config-error status:

- Build reported **0** config errors.
- `next.config.ts` already uses `images.remotePatterns` and contains no deprecated keys flagged for Step 2.

Action taken:

- No config fix required in Step 2.

Build check after config review:

- Reused Step 2.5 build result: ✅ successful.

## STEP 2.9 — Gate verification

Gate criteria status:

- Packages upgraded to v16 baseline: ✅
- Codemod applied and documented: ✅
- Error list documented and categorized: ✅
- Config-level errors fixed/cleared: ✅ (none found)
- Import-level errors fixed/cleared: ✅ (none found)
- Remaining errors are async params only: ✅ (none remain)

Final Step 2 outcome:

- `pnpm build` passes on Next.js 16.1.6 with no errors.
- Non-blocking warning: `metadataBase` not set in metadata export.
