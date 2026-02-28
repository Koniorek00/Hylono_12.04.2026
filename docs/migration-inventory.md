# Migration Inventory

## Stack

- Next.js 16.1.6
- React 19.2.4
- React DOM 19.2.4
- TypeScript 5.8.x

## v16 Upgrade

### Enabled features

- React Compiler enabled in `next.config.ts` (`reactCompiler: true`)
- Turbopack filesystem cache enabled for dev (`experimental.turbopackFileSystemCacheForDev: true`)
- Proxy runtime flow verified (`proxy.ts` active; build output shows `ƒ Proxy (Middleware)`)

### Production Lighthouse comparison snapshot

> Baseline note: pre-upgrade baseline source file was not present during verification (`docs/migration-inventory.md` previously missing), so this section records current v16 production measurements and marks baseline comparison as pending backfill.

| Route                        | Perf | A11y | Best Practices | SEO |   FCP |   LCP | Speed Index |   TBT |   CLS |
| ---------------------------- | ---: | ---: | -------------: | --: | ----: | ----: | ----------: | ----: | ----: |
| `/`                          |   85 |   95 |             96 | 100 | 1.99s | 3.97s |       3.32s |  33ms | 0.000 |
| `/rental` (store-equivalent) |   84 |   95 |             96 | 100 | 2.00s | 4.13s |       2.88s |  39ms | 0.000 |
| `/product/hbot`              |   73 |   91 |             96 | 100 | 2.70s | 4.19s |       4.87s | 279ms | 0.004 |

### Baseline comparison status

- Home/store/product baseline deltas vs pre-upgrade are **pending** due missing historical baseline file in workspace.
- Once historical baseline values are restored, this table should be extended with `Baseline` and `Delta` columns.
