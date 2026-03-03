# System Reliability Report

Generated: 2026-03-02T21:19:57.132Z
Score: 100/100
Passed: 6/6
Warnings: 0
Failed: 0

## Results

| ID | Group | Status | Duration (ms) | Detail |
|---|---|---|---:|---|
| SMOKE-001 | smoke | PASS | 57 | direct pnpm resolution |
| SMOKE-002 | smoke | PASS | 58 | corepack resolution |
| RESILIENCE-001 | resilience | PASS | 292 | corepack pnpm runtime availability |
| POLICY-001 | policy | PASS | 575 | biome check with fallback runtime |
| PERF-001 | performance | PASS | 40207 | full build via fallback runtime |
| PERF-002 | performance | PASS | 6872 | test suite via fallback runtime |

## Interpretation

All pressure tests passed. Agent runtime/tool access is fully operational.

## Recommended Command

Use fallback-safe verification when needed:
`corepack pnpm check`
