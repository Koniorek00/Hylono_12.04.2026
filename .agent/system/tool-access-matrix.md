# Tool Access Matrix

## Purpose

Canonical runtime capability map for agent execution reliability checks.

## Required Runtime Capabilities

| Capability | Primary | Fallback | Required For |
|---|---|---|---|
| Package manager runtime | `pnpm` | `corepack pnpm` | Build/check/test verification |
| Node runtime | `node` | None | Local scripts/harness |
| VCS | `git` | None | Diff/history workflows |
| Formatter/Linter | `pnpm exec biome check .` | `corepack pnpm exec biome check .` | Policy gate |
| Build | `pnpm build` | `corepack pnpm build` | Verify gate |
| Test | `pnpm test` | `corepack pnpm test` | Verify gate |

## Access Zones

| Zone | Expected Access |
|---|---|
| `.agent/**` | Read/Write |
| `tools/**` | Read/Write |
| `reports/**` | Read/Write |
| Product code (`app/**`, `components/**`, `lib/**`) | Read only for system-architect |

## Notes

- If direct `pnpm` is unavailable but `corepack pnpm` works, system is **not blocked**.
- Admin-level shim repair (`corepack enable`) is optional ergonomics, not a hard blocker.