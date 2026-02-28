T: Complete Hylono Master Repair Plan v2.0 — safety-first multi-phase infrastructure alignment with rollback protection
You are working in F:\ag projects\Hylono_MAIN

```markdown
# 🔴 HYLONO MASTER REPAIR PLAN v2.0 — SAFETY-FIRST EDITION
# Status: NOT STARTED
# Created: 2025-02-28
# Last Updated: ___________
# REPAIR-PLAN.md → lives at project root

═══════════════════════════════════════════════════════════════════════════
## EXECUTION RULES (MANDATORY — ZERO TOLERANCE)
═══════════════════════════════════════════════════════════════════════════

1. ONE step = ONE Cline task. NEVER combine steps.
2. After each step → mark ✅ + date + commit hash in this file
3. If step FAILS → mark ❌ + error note → STOP. Do NOT proceed.
4. Before each PHASE → verify ALL prerequisites listed
5. `pnpm check` must pass after every step that touches code
6. Every step = atomic git commit: `fix(repair): P[phase]S[step] — description`
7. Agent updates THIS FILE in place after each step completion
8. 🔴 NEVER run `db:push`, `db:migrate`, or ANY database mutation
9. 🔴 NEVER delete a file without first logging its full content in commit message
10. 🔴 NEVER modify files outside the explicit scope of current step
11. 🔴 If unsure about ANYTHING → STOP and ask human

═══════════════════════════════════════════════════════════════════════════
## PHASE -1 — SAFETY NET (BEFORE ANYTHING ELSE)
═══════════════════════════════════════════════════════════════════════════
Prerequisites: NONE — this IS the first thing you do

### STEP -1.1 — Create full backup
```
ACT AS: devops-engineer | REPAIR-PLAN STEP -1.1

## CONTEXT
Starting Hylono Master Repair Plan v2.0. Before ANY changes,
we need ironclad rollback capability.

## TASK
Execute these commands in exact order:

1. `git add -A && git commit -m "pre-repair: full snapshot before master repair plan"`
2. `git tag BACKUP-PRE-REPAIR-v1 -m "Full backup before repair plan v2.0"`
3. `git push origin main --tags`
4. `git checkout -b repair/master-plan-v2`
5. `git push origin repair/master-plan-v2`

## VERIFY
- [ ] Tag `BACKUP-PRE-REPAIR-v1` exists locally: `git tag -l | grep BACKUP`
- [ ] Tag exists on remote: `git ls-remote --tags origin | grep BACKUP`
- [ ] Currently on branch `repair/master-plan-v2`
- [ ] Remote branch exists: `git branch -r | grep repair`

## ROLLBACK INSTRUCTIONS (save these for entire plan)
At ANY point if things go wrong:
- `git checkout main` → you're back to pre-repair state
- `git reset --hard BACKUP-PRE-REPAIR-v1` → nuclear option
- Remote always has clean copy

## RULES
- Do NOT touch any code files
- This is infrastructure/git only
- Commit: already done in step 1 above
```
- Completed: ✅ 2026-02-28 | Commit: fix(repair): P-1.S1 — complete safety net (SSH remote, history purge, master pushed) | Verified: ✅ | Status note: Remote set (SSH), master pushed, backup tag pushed, large files purged via git-filter-repo

### STEP -1.2 — Audit current state snapshot
```
ACT AS: qa-engineer | REPAIR-PLAN STEP -1.2

## CONTEXT
On branch `repair/master-plan-v2`. Need baseline audit before changes.

## TASK
Create file `docs/repair-audit-baseline.md` with results of:

1. **Directory structure:**
   `tree -I node_modules -I .next -I .git --dirsfirst -L 3 > /tmp/tree.txt`
   Copy output into the file.

2. **File inventory of risky directories:**
   - List ALL files in root `app/` (if exists): full paths + file sizes
   - List ALL files in `src/app/`: full paths + file sizes
   - List ALL files containing "prisma" (case insensitive):
     `grep -rl -i "prisma" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.js" src/`
   - List content of `proxy.ts` or any proxy file: FULL CONTENT copied into audit

3. **Current commands baseline:**
   - `pnpm check` → PASS/FAIL + output
   - `pnpm build` → PASS/FAIL + output (first 100 lines if error)
   - `pnpm dev` → starts YES/NO

4. **Package inventory:**
   - List all dependencies from package.json (name + version)
   - List all devDependencies from package.json (name + version)
   - Flag any that match: eslint, prettier, prisma, framer-motion

5. **Config files inventory:**
   - List ALL config files in root (*.config.*, .*, etc.)
   - Flag: .prettierrc, .eslintrc, eslint.config.*, prisma/schema.prisma

## OUTPUT FORMAT
```md
# Hylono Repair Audit Baseline
## Date: ___
## Branch: repair/master-plan-v2
## Commit: ___

### 1. Directory Structure
[tree output]

### 2. Risky Directories
#### 2a. Root app/ contents
[list or "DOES NOT EXIST"]

#### 2b. src/app/ contents
[list]

#### 2c. Files containing "prisma"
[list]

#### 2d. proxy.ts full content
[full file content]

### 3. Commands Baseline
[results]

### 4. Package Inventory
#### Dependencies
[list]
#### DevDependencies
[list]
#### 🔴 Flagged packages
[list]

### 5. Config Files
[list]
#### 🔴 Flagged configs
[list]
```

## RULES
- READ ONLY. Do not modify any existing files.
- Only CREATE the new audit file.
- Commit: `fix(repair): P-1.S2 — baseline audit snapshot`
```
- Completed: ___ | Commit: ___ | Verified: ___

═══════════════════════════════════════════════════════════════════════════
## PHASE 0 — CLEANUP TOXIC ARTIFACTS (safe deletions only)
═══════════════════════════════════════════════════════════════════════════
Prerequisites:
- [ ] PHASE -1 ALL ✅
- [ ] `docs/repair-audit-baseline.md` exists and is committed
- [ ] On branch `repair/master-plan-v2`

### STEP 0.1 — Delete dual lockfile
```
ACT AS: devops-engineer | REPAIR-PLAN STEP 0.1

## CONTEXT
Hylono uses pnpm exclusively. `package-lock.json` should not exist.

## TASK
1. Check if `package-lock.json` exists in root
2. If YES:
   - Copy its first 10 lines into commit message for reference
   - Delete `package-lock.json`
   - Add `package-lock.json` to `.gitignore` (under existing ignores)
3. If NO: note "already clean" and skip
4. Verify `pnpm-lock.yaml` exists (DO NOT delete this one!)
5. Run `pnpm install` — must complete without errors

## VERIFY
- [ ] No `package-lock.json` in root
- [ ] `package-lock.json` in `.gitignore`
- [ ] `pnpm install` succeeds
- [ ] `pnpm check` still passes (or same state as baseline)

## RULES
- DO NOT run `npm install` ever
- Commit: `fix(repair): P0.S1 — remove package-lock.json`
```
- Completed: ___ | Commit: ___ | Verified: ___

### STEP 0.2 — Remove .prettierrc
```
ACT AS: devops-engineer | REPAIR-PLAN STEP 0.2

## CONTEXT
Hylono uses Biome exclusively. Prettier must not exist in any form.

## TASK
1. Check for these files and DELETE if found:
   - `.prettierrc` (any extension: .json, .js, .cjs, .yaml, .yml, .toml)
   - `.prettierignore`
   - `prettier.config.*`
2. For EACH deleted file: copy FULL CONTENT into commit message body
3. Search `package.json` for:
   - `"prettier"` in dependencies or devDependencies → remove entry
   - Any script referencing `prettier` → remove or replace with biome equivalent
4. Search ALL files for string `prettier`:
   `grep -rl "prettier" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.js" --include="*.cjs" --include="*.mjs" .`
   - For each match: evaluate if it needs removal/replacement
   - DO NOT touch `node_modules/`
5. If `prettier` was in dependencies → run `pnpm install` after removal

## VERIFY
- [ ] No prettier config files exist
- [ ] No prettier in package.json deps
- [ ] No prettier references in scripts
- [ ] `grep -rl "prettier" --exclude-dir=node_modules --exclude-dir=.git .` returns nothing (or only this repair plan)
- [ ] `pnpm check` passes

## RULES
- Biome handles ALL formatting. Period.
- Commit: `fix(repair): P0.S2 — remove prettier completely`
```
- Completed: ___ | Commit: ___ | Verified: ___

### STEP 0.3 — Remove ESLint artifacts
```
ACT AS: devops-engineer | REPAIR-PLAN STEP 0.3

## CONTEXT
Hylono uses Biome for linting. ESLint should not exist.

## TASK
1. Check for and DELETE if found (copy FULL CONTENT to commit msg):
   - `.eslintrc` (any extension)
   - `.eslintignore`
   - `eslint.config.*`
2. Search `package.json` for:
   - Any package starting with `eslint` in deps/devDeps → list them
   - Any package starting with `@eslint/` → list them
   - Any package `@typescript-eslint/*` → list them
   - 🟡 DO NOT REMOVE THESE YET if `next` package depends on them
3. Check if `next lint` is in any script → remove it or replace with `biome lint`
4. Check `next.config.*` for eslint configuration → remove eslint config blocks

## IMPORTANT — ESLINT + NEXT.JS DEPENDENCY CHECK
Run: `pnpm why eslint`
- If eslint is ONLY a direct dependency (not required by next) → safe to remove from package.json
- If next requires it → add to `package.json` overrides to suppress, but don't uninstall
- Document finding in commit message

5. If packages were removed → `pnpm install`

## VERIFY
- [ ] No eslint config files in root
- [ ] `pnpm why eslint` output documented
- [ ] If removable: eslint not in package.json
- [ ] `pnpm check` passes
- [ ] `pnpm build` passes (Next.js may internally use eslint — must not break)

## RULES
- If `pnpm build` breaks after eslint removal → REVERT and mark step as ⚠️ PARTIAL
- Commit: `fix(repair): P0.S3 — remove eslint artifacts`
```
- Completed: ___ | Commit: ___ | Verified: ___

### STEP 0.4 — Neutralize forbidden MCPs
```
ACT AS: devops-engineer | REPAIR-PLAN STEP 0.4

## CONTEXT
`next-devtools` MCP is forbidden per .clinerules.

## TASK
1. Check for `.mcp.json` in project root
2. If exists:
   - Copy FULL CONTENT to commit message
   - Remove `next-devtools` entry
   - If file is now empty/only `{}` → delete file entirely
   - If other valid MCP entries exist → keep file with those entries
3. Check for MCP references in `package.json` scripts → remove if related to forbidden MCPs
4. Check for `@next/devtools` or `next-devtools` in package.json deps → remove

## VERIFY
- [ ] No `next-devtools` in any config
- [ ] `.mcp.json` either clean or deleted
- [ ] `pnpm install` if deps changed
- [ ] `pnpm check` passes

## RULES
- Commit: `fix(repair): P0.S4 — remove forbidden MCPs`
```
- Completed: ___ | Commit: ___ | Verified: ___

### STEP 0.5 — SAFE root app/ directory resolution
```
ACT AS: architect | REPAIR-PLAN STEP 0.5

## CONTEXT
There may be BOTH `app/` (root) and `src/app/` directories.
This is the HIGHEST RISK step in Phase 0. Proceed with extreme caution.

## TASK — READ ONLY FIRST
1. Check if root `app/` directory exists
   - If NO → mark step as "N/A — no root app/ directory" and DONE
   - If YES → continue

2. Generate COMPLETE file comparison:
   ```
   For each file in root app/:
     - Full path
     - File size
     - First 5 lines of content
     - Does equivalent exist in src/app/? YES/NO
     - If YES: are they identical? (`diff` output)
   ```

3. Create file `docs/root-app-analysis.md` with this comparison

4. STOP AND REPORT — DO NOT DELETE ANYTHING YET

## ⚠️ THIS STEP IS ANALYSIS ONLY
The actual move/delete will be STEP 0.6 AFTER human reviews the analysis.

## VERIFY
- [ ] `docs/root-app-analysis.md` created with full comparison
- [ ] NO files were moved or deleted
- [ ] Commit message contains summary of findings

## RULES
- READ AND DOCUMENT ONLY
- ZERO file modifications except creating the analysis doc
- Commit: `fix(repair): P0.S5 — root app/ analysis (read-only)`
```
- Completed: ___ | Commit: ___ | Verified: ___

### STEP 0.6 — Execute root app/ resolution (REQUIRES HUMAN APPROVAL)
```
ACT AS: architect | REPAIR-PLAN STEP 0.6

## ⚠️ PREREQUISITE: Human has reviewed `docs/root-app-analysis.md` from STEP 0.5

## CONTEXT
Based on the analysis from 0.5, we now execute the resolution.

## TASK
Read `docs/root-app-analysis.md` and execute ONE of these scenarios:

### SCENARIO A: Root app/ doesn't exist
- Skip this step entirely. Mark N/A.

### SCENARIO B: Root app/ is empty or contains only duplicates of src/app/
- Delete root `app/` directory
- Verify `next.config` does NOT reference root app/
- Verify `tsconfig.json` paths don't reference root app/

### SCENARIO C: Root app/ has UNIQUE files not in src/app/
- For EACH unique file:
  1. Copy (not move) to equivalent path in `src/app/`
  2. Verify copy is identical: `diff original copy`
  3. ONLY THEN delete original
- After ALL files handled → delete root `app/` if empty

### SCENARIO D: Root app/ IS the actual app directory (src/app/ might be wrong)
- DO NOT DELETE ANYTHING
- Mark step as ❌ BLOCKED — needs manual human decision
- Document which directory `next.config` actually points to

## VERIFY
- [ ] Only ONE `app/` directory exists (in `src/`)
- [ ] `next.config` appDir points to correct location
- [ ] `pnpm dev` starts and serves pages correctly
- [ ] `pnpm build` passes
- [ ] NO unique files were lost (compare against 0.5 analysis)

## RULES
- If ANY doubt → STOP and ask human
- Commit: `fix(repair): P0.S6 — root app/ resolved [SCENARIO X]`
```
- Completed: ___ | Commit: ___ | Verified: ___ | Scenario: ___

### STEP 0.7 — Phase 0 checkpoint
```
ACT AS: qa-engineer | REPAIR-PLAN STEP 0.7

## TASK
Run full verification:
1. `pnpm install --frozen-lockfile` → PASS/FAIL
2. `pnpm check` → PASS/FAIL
3. `pnpm build` → PASS/FAIL
4. `pnpm dev` → starts YES/NO

Compare results with baseline from STEP -1.2.
If anything REGRESSED → mark which step caused it.

## VERIFY
- [ ] All 4 commands pass
- [ ] No regression from baseline
- [ ] Update this repair plan with all Phase 0 results

## RULES
- Commit: `fix(repair): P0.S7 — phase 0 checkpoint PASS/FAIL`
```
- Completed: ___ | Commit: ___ | Results: ___

═══════════════════════════════════════════════════════════════════════════
## PHASE 1 — TYPESCRIPT STRICT MODE (code quality, no schema changes)
═══════════════════════════════════════════════════════════════════════════
Prerequisites:
- [ ] PHASE 0 ALL ✅ (or N/A)
- [ ] `pnpm build` passes

### STEP 1.1 — Enable strict mode + capture error count
```
ACT AS: typescript-engineer | REPAIR-PLAN STEP 1.1

## CONTEXT
Enabling TypeScript strict mode. This step ONLY enables it and documents errors.
Fixes come in subsequent steps.

## TASK
1. Open `tsconfig.json`
2. Set `"strict": true` in compilerOptions
3. Run `pnpm typecheck 2>&1 | tee /tmp/strict-errors.txt`
4. Count total errors
5. Create `docs/typescript-strict-errors.md`:
   ```md
   # TypeScript Strict Mode Errors
   ## Date: ___
   ## Total errors: ___

   ### Errors by category:
   - TS2322 (type assignment): ___
   - TS2345 (argument type): ___
   - TS7006 (implicit any): ___
   - TS18048 (possibly undefined): ___
   - [other codes]: ___

   ### Errors by file:
   - src/app/...: X errors
   - src/lib/...: X errors
   - [etc]

   ### Full error output:
   [paste all]
   ```

## ⚠️ IMPORTANT
If error count > 200: add note "RECOMMEND: fix in batches per-directory"
If error count > 500: set `"strict": false` BACK, mark step ⚠️, recommend incremental approach

## VERIFY
- [ ] `tsconfig.json` has `"strict": true`
- [ ] Error count documented
- [ ] `docs/typescript-strict-errors.md` created
- [ ] If errors > 500 → strict reverted and noted

## RULES
- DO NOT fix any errors yet — just enable + document
- Commit: `fix(repair): P1.S1 — enable strict mode [X errors found]`
```
- Completed: ___ | Commit: ___ | Error count: ___

### STEP 1.2 — Fix strict errors: src/lib/ (utilities first)
```
ACT AS: typescript-engineer | REPAIR-PLAN STEP 1.2

## CONTEXT
Fixing TypeScript strict errors in `src/lib/` directory only.
These are utility/shared files — fixing them first reduces cascade errors.

## TASK
1. Read `docs/typescript-strict-errors.md` for lib/ errors
2. Fix EACH error using ONLY these safe patterns:
   - Add explicit type annotations (NEVER `any` — use `unknown` + type guard)
   - Add null checks (`if (x != null)`)
   - Add non-null assertion ONLY if you can prove it's safe (document why in comment)
   - Fix function parameter types
   - Fix return types
3. After ALL lib/ fixes → run `pnpm typecheck` → record remaining count

## 🔴 FORBIDDEN FIXES
- NEVER use `as any`
- NEVER use `@ts-ignore` or `@ts-expect-error` (unless TEMPORARY with TODO + issue)
- NEVER change logic/behavior — types only
- NEVER modify function signatures that are used by other files (unless adding optional params)

## VERIFY
- [ ] All `src/lib/` errors fixed
- [ ] Zero uses of `any` type added
- [ ] `pnpm typecheck` error count decreased
- [ ] `pnpm build` still passes
- [ ] New error count documented in repair plan

## RULES
- Commit: `fix(repair): P1.S2 — strict fixes src/lib/ [X→Y errors]`
```
- Completed: ___ | Commit: ___ | Errors: ___ → ___

### STEP 1.3 — Fix strict errors: src/app/ (pages and components)
```
ACT AS: typescript-engineer | REPAIR-PLAN STEP 1.3

## CONTEXT
Fixing remaining TypeScript strict errors in `src/app/` directory.

## TASK
Same rules as STEP 1.2 but for `src/app/` files.

Additional Next.js-specific rules:
- Server Components: async functions must have proper return types
- Client Components: props interfaces must be explicit
- Route handlers: Request/Response types must be explicit
- DO NOT change 'use client' / 'use server' directives

If error count still > 50 after this step:
→ Create `docs/typescript-remaining-errors.md`
→ Mark step as ⚠️ PARTIAL

## VERIFY
- [ ] `src/app/` errors fixed (or remaining documented)
- [ ] `pnpm typecheck` → 0 errors (or documented remaining)
- [ ] `pnpm build` passes
- [ ] `pnpm dev` → app works (spot check 3 pages)

## RULES
- Same forbidden fixes as 1.2
- Commit: `fix(repair): P1.S3 — strict fixes src/app/ [X→Y errors]`
```
- Completed: ___ | Commit: ___ | Errors: ___ → ___

### STEP 1.4 — Fix remaining strict errors (if any)
```
ACT AS: typescript-engineer | REPAIR-PLAN STEP 1.4

## CONTEXT
Catch-all for any remaining TS strict errors.

## TASK
1. Run `pnpm typecheck`
2. If 0 errors → mark as ✅ CLEAN and skip
3. If errors remain:
   - Fix using same safe patterns as 1.2
   - Group by file in commit message
4. Final `pnpm typecheck` MUST be 0 errors

## VERIFY
- [ ] `pnpm typecheck` → 0 errors
- [ ] `pnpm build` passes
- [ ] `pnpm check` passes

## RULES
- Commit: `fix(repair): P1.S4 — strict mode clean [0 errors]`
```
- Completed: ___ | Commit: ___ | Final errors: ___

═══════════════════════════════════════════════════════════════════════════
## PHASE 2 — PRISMA → DRIZZLE MIGRATION (HIGHEST RISK PHASE)
═══════════════════════════════════════════════════════════════════════════
Prerequisites:
- [ ] PHASE 1 ALL ✅
- [ ] `pnpm typecheck` → 0 errors
- [ ] `pnpm build` passes

### ⚠️ PHASE 2 SAFETY RULES
- 🔴 NEVER run ANY database migration command (`db:push`, `db:migrate`, `prisma migrate`)
- 🔴 NEVER connect to production database
- 🔴 ALL changes are CODE ONLY — schema files, query files, config
- 🔴 Database schema changes will be done MANUALLY by human after code review
- 🔴 Prisma is NOT removed until EVERY query is verified working with Drizzle

### STEP 2.1 — Inventory ALL Prisma usage
```
ACT AS: architect | REPAIR-PLAN STEP 2.1

## CONTEXT
Before migrating from Prisma to Drizzle, we need complete inventory
of every Prisma touchpoint in the codebase. This is READ ONLY.

## TASK
Create `docs/prisma-inventory.md`:

### Section 1: Schema Analysis
- Read `prisma/schema.prisma` (if exists)
- List ALL models with their fields, types, relations, constraints
- List ALL enums
- Document the datasource provider and url config

### Section 2: Prisma Client Usage
Find every file that imports from `@prisma/client` or uses `prisma.`:
```bash
grep -rn "from.*@prisma/client\|from.*prisma.*client\|prisma\.\|PrismaClient" --include="*.ts" --include="*.tsx" src/
```
For EACH file found:
- Full file path
- Line numbers with Prisma usage
- What operations: findMany, create, update, delete, etc.
- What models are queried
- Copy the EXACT Prisma query code

### Section 3: Prisma Config Files
- `prisma/schema.prisma` — EXISTS/NOT
- `prisma/migrations/` — list all migration folders
- `prisma/seed.ts` or similar — EXISTS/NOT
- package.json scripts with `prisma` — list all
- `postinstall` hook with `prisma generate` — YES/NO

### Section 4: Migration Complexity Score
- Total models: ___
- Total Prisma query locations: ___
- Complex queries (includes, nested writes, transactions): ___
- Estimated migration difficulty: LOW / MEDIUM / HIGH

## VERIFY
- [ ] `docs/prisma-inventory.md` is complete
- [ ] Every Prisma import/usage found and documented
- [ ] No files were modified

## RULES
- READ ONLY — no modifications
- Commit: `fix(repair): P2.S1 — prisma usage inventory`
```
- Completed: ___ | Commit: ___ | Complexity: ___

### STEP 2.2 — Install Drizzle (alongside Prisma — NO removal yet)
```
ACT AS: backend-engineer | REPAIR-PLAN STEP 2.2

## CONTEXT
Installing Drizzle ORM alongside existing Prisma. Both will coexist
until migration is verified complete.

## TASK
1. Install Drizzle packages:
   ```bash
   pnpm add drizzle-orm @neondatabase/serverless
   pnpm add -D drizzle-kit
   ```

2. Create `drizzle.config.ts` in project root:
   ```typescript
   import { defineConfig } from 'drizzle-kit';

   export default defineConfig({
     schema: './src/db/schema/index.ts',
     out: './src/db/migrations',
     dialect: 'postgresql',
     dbCredentials: {
       url: process.env.DATABASE_URL!,
     },
   });
   ```

3. Create directory structure:
   ```
   src/db/
   ├── index.ts          (Drizzle client — DO NOT connect yet)
   ├── schema/
   │   └── index.ts      (empty barrel file)
   └── migrations/       (empty dir with .gitkeep)
   ```

4. Create `src/db/index.ts`:
   ```typescript
   import { neon } from '@neondatabase/serverless';
   import { drizzle } from 'drizzle-orm/neon-http';

   import * as schema from './schema';

   const sql = neon(process.env.DATABASE_URL!);

   export const db = drizzle(sql, { schema });
   export type Database = typeof db;
   ```

5. Create `src/db/schema/index.ts`:
   ```typescript
   // Schema will be populated in STEP 2.3
   // Each model gets its own file, re-exported from here
   ```

## ⚠️ IMPORTANT
- Prisma stays UNTOUCHED — both ORMs coexist
- DO NOT add any `db:` scripts to package.json yet
- DO NOT run drizzle-kit commands yet

## VERIFY
- [ ] Drizzle packages in package.json
- [ ] `drizzle.config.ts` exists
- [ ] `src/db/` structure created
- [ ] Prisma files UNTOUCHED
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes

## RULES
- Commit: `fix(repair): P2.S2 — install drizzle alongside prisma`
```
- Completed: ___ | Commit: ___ | Verified: ___

### STEP 2.3 — Translate Prisma schema to Drizzle (CODE ONLY — no DB)
```
ACT AS: backend-engineer | REPAIR-PLAN STEP 2.3

## CONTEXT
Translating Prisma schema models to Drizzle pgTable definitions.
This is CODE GENERATION ONLY. No database operations.

## TASK
Using `docs/prisma-inventory.md` Section 1 as reference:

1. For EACH Prisma model, create `src/db/schema/[model-name].ts`
2. Translation rules:
   - `String` → `text()` or `varchar({ length: N })`
   - `Int` → `integer()`
   - `BigInt` → `bigint()`
   - `Float` → `real()` or `doublePrecision()`
   - `Decimal` → `numeric({ precision: X, scale: Y })`
   - `Boolean` → `boolean()`
   - `DateTime` → `timestamp({ withTimezone: true })`
   - `Json` → `jsonb()`
   - `@id` → `.primaryKey()`
   - `@default(uuid())` → `.default(sql`gen_random_uuid()`)`
   - `@default(autoincrement())` → use `serial()`
   - `@unique` → add to unique constraint
   - `@relation` → use `relations()` from drizzle-orm
   - `@@index` → use `index()`
   - `enum` → use `pgEnum()`

3. Create `docs/schema-translation-map.md`:
   ```md
   # Schema Translation: Prisma → Drizzle

   ## Model: User
   | Prisma Field | Prisma Type | Drizzle Column | Notes |
   |---|---|---|---|
   | id | String @id @default(uuid()) | text('id').primaryKey().default(sql`...`) | |
   [etc for every field of every model]

   ## Potential Issues:
   - [list any ambiguous translations]
   ```

4. Update `src/db/schema/index.ts` to re-export all models

## ⚠️ CRITICAL SAFETY
- DO NOT run `drizzle-kit push` or `drizzle-kit generate`
- DO NOT connect to any database
- DO NOT modify Prisma schema
- This is PURE code generation — files on disk only

## VERIFY
- [ ] Every Prisma model has a corresponding Drizzle schema file
- [ ] `docs/schema-translation-map.md` complete with all fields mapped
- [ ] `src/db/schema/index.ts` exports all models
- [ ] `pnpm typecheck` passes (Drizzle schema compiles)
- [ ] NO Prisma files modified
- [ ] NO database commands executed

## RULES
- If ANY field translation is ambiguous → document in translation map + add TODO comment
- Commit: `fix(repair): P2.S3 — drizzle schema translation [X models]`
```
- Completed: ___ | Commit: ___ | Models: ___

### STEP 2.4 — HUMAN REVIEW CHECKPOINT
```
═══════════════════════════════════════════════════════════════════════════
⛔ STOP — HUMAN REVIEW REQUIRED
═══════════════════════════════════════════════════════════════════════════

Before proceeding, human must review:
1. `docs/schema-translation-map.md` — verify every field mapping
2. `src/db/schema/*.ts` — verify Drizzle types match Prisma intent
3. Compare side-by-side with `prisma/schema.prisma`

Human approval: ___ (date + initials)

DO NOT proceed to STEP 2.5 without human approval noted above.
═══════════════════════════════════════════════════════════════════════════
```

### STEP 2.5 — Translate Prisma queries to Drizzle (dual-write pattern)
```
ACT AS: backend-engineer | REPAIR-PLAN STEP 2.5

## CONTEXT
Translating Prisma query calls to Drizzle. Using DUAL-WRITE pattern:
new Drizzle queries are created ALONGSIDE existing Prisma queries.
Nothing is replaced yet.

## TASK
Using `docs/prisma-inventory.md` Section 2 as reference:

1. For EACH file with Prisma queries:
   - Create a parallel function with `_drizzle` suffix
   - Example:
     ```typescript
     // EXISTING — DO NOT MODIFY
     async function getUsers() {
       return prisma.user.findMany({ where: { active: true } });
     }

     // NEW — Drizzle equivalent
     async function getUsers_drizzle() {
       return db.select().from(users).where(eq(users.active, true));
     }
     ```
   - If query is inline (not a function), extract to named function first

2. Create `docs/query-translation-map.md`:
   ```md
   # Query Translation: Prisma → Drizzle

   ## File: src/app/api/users/route.ts
   | Line | Prisma Query | Drizzle Equivalent | Verified |
   |---|---|---|---|
   | 15 | prisma.user.findMany({...}) | db.select()... | ⬜ |
   [etc]
   ```

3. Mark each query as ⬜ (unverified) — verification happens in STEP 2.6

## ⚠️ CRITICAL
- DO NOT remove or modify existing Prisma queries
- DO NOT switch any route/page to use Drizzle queries yet
- Both implementations coexist
- DO NOT import `db` from `src/db/index.ts` in any active code path

## VERIFY
- [ ] Every Prisma query has a `_drizzle` parallel
- [ ] `docs/query-translation-map.md` complete
- [ ] NO existing Prisma queries modified
- [ ] NO active code paths use Drizzle yet
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes

## RULES
- Commit: `fix(repair): P2.S5 — drizzle query parallels [X queries]`
```
- Completed: ___ | Commit: ___ | Queries: ___

### STEP 2.6 — Switch active queries from Prisma to Drizzle
```
ACT AS: backend-engineer | REPAIR-PLAN STEP 2.6

## CONTEXT
Now switching active code from Prisma queries to Drizzle queries.
This is done ONE FILE AT A TIME with verification after each.

## TASK
For EACH file in `docs/query-translation-map.md`:

1. Replace Prisma query call with Drizzle equivalent
2. Remove the `_drizzle` suffix (it becomes the main function)
3. Remove the old Prisma function (keep as comment with // REMOVED: prefix)
4. Update imports: remove @prisma/client, add drizzle imports
5. Run `pnpm typecheck` — MUST PASS before moving to next file
6. Update query-translation-map.md: mark as ✅

## ORDER: Start with SIMPLEST queries first (findMany, findFirst)
then move to complex (create, update, transactions)

## ⚠️ CRITICAL
- ONE file at a time
- Typecheck after EACH file
- If typecheck fails → REVERT that file and mark ❌ in map
- Keep removed Prisma code as comments (not deleted) until Phase 2 complete

## VERIFY after ALL files done:
- [ ] No imports from `@prisma/client` remain in `src/`
- [ ] All queries use Drizzle
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes
- [ ] Old Prisma queries preserved as comments

## RULES
- Commit per file: `fix(repair): P2.S6 — switch [filename] to drizzle`
- Final commit: `fix(repair): P2.S6 — all queries migrated to drizzle`
```
- Completed: ___ | Commit: ___ | Files switched: ___

### STEP 2.7 — Remove Prisma (only after 2.6 fully verified)
```
ACT AS: backend-engineer | REPAIR-PLAN STEP 2.7

## CONTEXT
All queries are now Drizzle. Safe to remove Prisma.

## PREREQUISITES — ALL must be TRUE:
- [ ] STEP 2.6 fully ✅
- [ ] Zero imports from @prisma/client in src/
- [ ] `pnpm build` passes with Drizzle only

## TASK
1. Remove commented-out Prisma code from all files
2. Remove Prisma packages:
   ```bash
   pnpm remove prisma @prisma/client
   ```
3. Remove Prisma config (copy FULL CONTENT to commit message first):
   - `prisma/schema.prisma`
   - `prisma/migrations/` (entire directory)
   - `prisma/seed.ts` (if exists)
   - Remove `prisma/` directory entirely
4. Remove Prisma scripts from package.json:
   - `postinstall` prisma generate
   - Any `prisma:*` scripts
   - Any `db:*` scripts that use prisma
5. Add Drizzle scripts to package.json:
   ```json
   "db:generate": "drizzle-kit generate",
   "db:studio": "drizzle-kit studio"
   ```
   🔴 DO NOT add `db:push` or `db:migrate` scripts — those are manual-only

6. Run `pnpm install`

## VERIFY
- [ ] `prisma` not in package.json
- [ ] No `prisma/` directory
- [ ] No Prisma imports anywhere: `grep -r "prisma" --include="*.ts" --include="*.tsx" src/`
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes
- [ ] `pnpm check` passes

## RULES
- Commit: `fix(repair): P2.S7 — prisma fully removed`
```
- Completed: ___ | Commit: ___ | Verified: ___

═══════════════════════════════════════════════════════════════════════════
## PHASE 3 — ENVIRONMENT & SECURITY HARDENING
═══════════════════════════════════════════════════════════════════════════
Prerequisites:
- [ ] PHASE 2 ALL ✅
- [ ] `pnpm build` passes

### STEP 3.1 — Implement env validation with @t3-oss/env-nextjs
```
ACT AS: security-engineer | REPAIR-PLAN STEP 3.1

## CONTEXT
All environment variables must be validated at startup,
not accessed raw via process.env scattered across codebase.

## TASK
1. Install: `pnpm add @t3-oss/env-nextjs zod`

2. Create `src/lib/env.ts`:
   ```typescript
   import { createEnv } from '@t3-oss/env-nextjs';
   import { z } from 'zod';

   export const env = createEnv({
     server: {
       DATABASE_URL: z.string().url().startsWith('postgres'),
       // Add ALL server env vars found in codebase
     },
     client: {
       NEXT_PUBLIC_APP_URL: z.string().url(),
       // Add ALL NEXT_PUBLIC_ vars found in codebase
     },
     runtimeEnv: {
       DATABASE_URL: process.env.DATABASE_URL,
       NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
       // Map ALL vars
     },
   });
   ```

3. Find ALL `process.env.` usage in codebase:
   ```bash
   grep -rn "process\.env\." --include="*.ts" --include="*.tsx" src/
   ```

4. Add EVERY found variable to the env schema

5. Replace ALL `process.env.X` with `env.X` (import from `src/lib/env`)
   - EXCEPTION: `process.env.NODE_ENV` can stay (Next.js built-in)

6. Update `src/db/index.ts` to use `env.DATABASE_URL` instead of `process.env.DATABASE_URL`

## VERIFY
- [ ] `src/lib/env.ts` exists with all variables
- [ ] `grep -rn "process\.env\." src/` returns only NODE_ENV refs (or none)
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes

## RULES
- Commit: `fix(repair): P3.S1 — env validation with t3-env`
```
- Completed: ___ | Commit: ___ | Vars: ___

### STEP 3.2 — Update .env.example
```
ACT AS: security-engineer | REPAIR-PLAN STEP 3.2

## TASK
1. Create/update `.env.example` with ALL variables from `src/lib/env.ts`
2. Use placeholder values (never real secrets)
3. Add comments explaining each variable
4. Verify `.env` and `.env.local` are in `.gitignore`
5. Verify NO actual secrets are committed:
   `git log --all --diff-filter=A -- ".env" ".env.local" ".env.production"`

## VERIFY
- [ ] `.env.example` matches env.ts schema
- [ ] `.env` in `.gitignore`
- [ ] No secrets in git history

## RULES
- Commit: `fix(repair): P3.S2 — env.example updated`
```
- Completed: ___ | Commit: ___ | Verified: ___

═══════════════════════════════════════════════════════════════════════════
## PHASE 4 — BIOME CONFIGURATION ALIGNMENT
═══════════════════════════════════════════════════════════════════════════
Prerequisites:
- [ ] PHASE 3 ALL ✅

### STEP 4.1 — Verify and fix biome.json
```
ACT AS: devops-engineer | REPAIR-PLAN STEP 4.1

## TASK
1. Open `biome.json` (or `biome.jsonc`)
2. Ensure it includes:
   - Formatter: enabled, indentStyle: space, indentWidth: 2
   - Linter: enabled with recommended rules
   - Organizer: import sorting enabled
3. Ensure `pnpm lint` = `biome lint .`
4. Ensure `pnpm format` = `biome format . --write`
5. Ensure `pnpm check` includes biome (or biome is part of it)
6. Run `pnpm lint` → fix any issues
7. Run `pnpm format` → apply formatting

## VERIFY
- [ ] biome.json correct
- [ ] package.json scripts use biome (not eslint, not prettier)
- [ ] `pnpm lint` passes
- [ ] `pnpm format` produces no changes (already formatted)

## RULES
- Commit: `fix(repair): P4.S1 — biome configuration aligned`
```
- Completed: ___ | Commit: ___ | Verified: ___

═══════════════════════════════════════════════════════════════════════════
## PHASE 5 — MIDDLEWARE & AUTH FLOW (careful — proxy.ts risk)
═══════════════════════════════════════════════════════════════════════════
Prerequisites:
- [ ] PHASE 4 ALL ✅
- [ ] `docs/repair-audit-baseline.md` has proxy.ts full content

### STEP 5.1 — Analyze proxy.ts vs middleware.ts
```
ACT AS: architect | REPAIR-PLAN STEP 5.1

## CONTEXT
proxy.ts may contain auth/routing logic that should be in Next.js middleware.
This step is ANALYSIS ONLY.

## TASK
1. Read proxy.ts (content should be in audit baseline)
2. Read middleware.ts (if exists)
3. Create `docs/proxy-analysis.md`:
   ```md
   # proxy.ts Analysis

   ## What proxy.ts does:
   - [list every function/behavior]

   ## What middleware.ts does (if exists):
   - [list every function/behavior]

   ## Overlap:
   - [what both do]

   ## Unique to proxy.ts:
   - [what ONLY proxy does — THESE ARE RISK ITEMS]

   ## Recommendation:
   - MERGE / REPLACE / KEEP BOTH / NEEDS HUMAN DECISION
   ```

## ⚠️ ANALYSIS ONLY — DO NOT MODIFY ANY FILES

## RULES
- Commit: `fix(repair): P5.S1 — proxy.ts analysis`
```
- Completed: ___ | Commit: ___ | Recommendation: ___

### STEP 5.2 — Execute proxy.ts resolution (REQUIRES HUMAN APPROVAL)
```
═══════════════════════════════════════════════════════════════════════════
⛔ STOP — HUMAN REVIEW REQUIRED
═══════════════════════════════════════════════════════════════════════════

Human must review `docs/proxy-analysis.md` and decide:
- [ ] MERGE into middleware.ts
- [ ] KEEP proxy.ts as-is
- [ ] OTHER: ___

Human approval: ___ (date + initials)
Human decision: ___

Then execute accordingly. If MERGE:
1. Create middleware.ts with combined logic
2. Keep proxy.ts renamed to proxy.ts.backup
3. Test auth flow manually
4. Only delete backup after human confirms working

Commit: `fix(repair): P5.S2 — proxy resolution [DECISION]`
═══════════════════════════════════════════════════════════════════════════
```
- Completed: ___ | Commit: ___ | Decision: ___

═══════════════════════════════════════════════════════════════════════════
## PHASE 6 — PRISMA MCP SETUP (AI safety layer)
═══════════════════════════════════════════════════════════════════════════
Prerequisites:
- [ ] PHASE 5 ALL ✅
- [ ] Drizzle is active ORM in app code

### STEP 6.1 — Configure Prisma MCP for AI agent database safety
```
ACT AS: devops-engineer | REPAIR-PLAN STEP 6.1

## CONTEXT
Prisma MCP is used ONLY by the AI agent for safe database introspection.
It is NOT used in application code. Drizzle is the app ORM.

## TASK
1. Add Prisma MCP configuration to Cline MCP settings.
   Location: VS Code settings or `.vscode/mcp.json` (NOT project .mcp.json)

   ```json
   {
     "mcpServers": {
       "prisma": {
         "command": "npx",
         "args": ["-y", "prisma-mcp-server"],
         "env": {
           "DATABASE_URL": "${env:DATABASE_URL}"
         }
       }
     }
   }
   ```

2. Create `docs/adr/006-prisma-mcp-ai-safety.md`:
   ```md
   # ADR-006: Prisma MCP as AI Database Safety Layer

   ## Status: Accepted
   ## Date: ___

   ## Context
   Hylono uses Drizzle ORM in application code.
   AI agent needs safe database access for introspection and validation.

   ## Decision
   Use Prisma MCP server for AI agent database operations.
   - Agent can introspect schema
   - Agent can validate queries
   - Guardrails prevent destructive operations
   - NOT used in app code — zero bundle impact

   ## Consequences
   - AI agent has safe DB access
   - No Prisma in production bundle
   - Hybrid approach: Drizzle (app) + Prisma MCP (AI tooling)
   ```

3. Update `.clinerules` to document hybrid approach if not already there

## ⚠️ IMPORTANT
- NO `prisma` or `@prisma/client` in package.json
- Prisma MCP runs via npx — no install needed
- This is AGENT TOOLING, not app dependency

## VERIFY
- [ ] MCP config exists in VS Code settings
- [ ] ADR documented
- [ ] No prisma in package.json
- [ ] `pnpm build` still has zero Prisma references

## RULES
- Commit: `fix(repair): P6.S1 — prisma mcp for ai safety`
```
- Completed: ___ | Commit: ___ | Verified: ___

### STEP 6.2 — Create hybrid workflow documentation
```
ACT AS: architect | REPAIR-PLAN STEP 6.2

## TASK
Create `docs/hybrid-db-workflow.md`:
```md
# Hybrid Database Workflow

## App Code (Drizzle)
- Schema: `src/db/schema/*.ts`
- Client: `src/db/index.ts`
- Migrations: `drizzle-kit generate` → human reviews → manual apply

## AI Agent (Prisma MCP)
- Introspect: agent asks MCP to read current DB schema
- Validate: agent compares DB state with Drizzle schema files
- Prototype: agent can test queries safely via MCP

## Workflow
1. **Prototype** → Agent uses Prisma MCP to explore schema
2. **Codify** → Agent writes Drizzle schema/queries in code
3. **Validate** → Agent uses Prisma MCP to verify DB matches code

## Rules
- NEVER: prisma migrate, prisma db push
- NEVER: @prisma/client in app imports
- ALWAYS: Drizzle for app queries
- ALWAYS: Prisma MCP for agent DB introspection
```

## RULES
- Commit: `fix(repair): P6.S2 — hybrid workflow documentation`
```
- Completed: ___ | Commit: ___ | Verified: ___

═══════════════════════════════════════════════════════════════════════════
## PHASE 7 — FINAL VERIFICATION & MERGE
═══════════════════════════════════════════════════════════════════════════
Prerequisites:
- [ ] ALL previous phases ✅

### STEP 7.1 — Full system verification
```
ACT AS: qa-engineer | REPAIR-PLAN STEP 7.1

## TASK
Run and record EVERY result:
1. `pnpm install --frozen-lockfile` → PASS/FAIL: ___
2. `pnpm lint` → PASS/FAIL: ___
3. `pnpm typecheck` → PASS/FAIL: ___ (errors: ___)
4. `pnpm build` → PASS/FAIL: ___
5. `pnpm dev` → starts: YES/NO
6. `pnpm check` → PASS/FAIL: ___

Compare with baseline from STEP -1.2:
- Regressions: ___

## VERIFY
- [ ] ALL commands pass
- [ ] No regressions from baseline

## RULES
- Commit: `fix(repair): P7.S1 — full system verification`
```
- Completed: ___ | Commit: ___ | All pass: ___

### STEP 7.2 — Forbidden items final scan
```
ACT AS: qa-engineer | REPAIR-PLAN STEP 7.2

## TASK
Search ENTIRE codebase (exclude node_modules, .git, .next):

1. `eslint` config files → Expected: 0 found: ___
2. `prettier` config/refs → Expected: 0 found: ___
3. `framer-motion` → Expected: 0 found: ___
4. `@prisma/client` imports → Expected: 0 found: ___
5. `prisma` in package.json deps → Expected: 0 found: ___
6. `"npm run"` in scripts → Expected: 0 found: ___
7. `process.env.` (not NODE_ENV) → Expected: only in src/lib/env.ts found: ___
8. `package-lock.json` → Expected: only in .gitignore found: ___
9. Root `app/` directory → Expected: not exists found: ___

If ANY unexpected → FIX before proceeding.

## RULES
- Commit: `fix(repair): P7.S2 — forbidden items scan clean`
```
- Completed: ___ | Commit: ___ | All clean: ___

### STEP 7.3 — Merge repair branch
```
ACT AS: devops-engineer | REPAIR-PLAN STEP 7.3

## PREREQUISITES
- [ ] STEP 7.1 ALL PASS
- [ ] STEP 7.2 ALL CLEAN
- [ ] Human final approval: ___ (date + initials)

## TASK
1. `git log --oneline repair/master-plan-v2` → document commit count
2. `git checkout main`
3. `git merge repair/master-plan-v2 --no-ff -m "fix(repair): complete master repair plan v2.0"`
4. `git push origin main`
5. `git tag REPAIR-COMPLETE-v2.0 -m "Master repair plan v2.0 complete"`
6. `git push origin --tags`

## FINAL UPDATE
Update this REPAIR-PLAN.md:
- Status: ✅ COMPLETE
- Completion date: ___
- Total commits: ___
- Phases completed: 0-7 (all)

## RULES
- Commit: already in merge message above
```
- Completed: ___ | Commit: ___ | 🎉 DONE

═══════════════════════════════════════════════════════════════════════════
## COMPLETION SUMMARY TABLE
═══════════════════════════════════════════════════════════════════════════

| Phase | Description | Steps | Status |
|-------|------------|-------|--------|
| -1 | Safety Net | 2 | ⬜ |
| 0 | Cleanup Toxic Artifacts | 7 | ⬜ |
| 1 | TypeScript Strict Mode | 4 | ⬜ |
| 2 | Prisma → Drizzle Migration | 7 | ⬜ |
| 3 | Environment & Security | 2 | ⬜ |
| 4 | Biome Configuration | 1 | ⬜ |
| 5 | Middleware & Auth Flow | 2 | ⬜ |
| 6 | Prisma MCP Setup | 2 | ⬜ |
| 7 | Final Verification & Merge | 3 | ⬜ |
| **TOTAL** | | **30** | ⬜ |

═══════════════════════════════════════════════════════════════════════════
## EMERGENCY ROLLBACK
═══════════════════════════════════════════════════════════════════════════

At ANY point if things are broken beyond repair:

```bash
git checkout main
git reset --hard BACKUP-PRE-REPAIR-v1
git push origin main --force
```

This restores EVERYTHING to pre-repair state.
The backup tag on remote ensures it's always recoverable.

═══════════════════════════════════════════════════════════════════════════
## HUMAN APPROVAL CHECKPOINTS
═══════════════════════════════════════════════════════════════════════════

These steps REQUIRE human to review before agent proceeds:

1. ⛔ STEP 2.4 — Schema translation review
2. ⛔ STEP 5.2 — proxy.ts resolution decision
3. ⛔ STEP 7.3 — Final merge approval

Agent must STOP and WAIT at these checkpoints.
```