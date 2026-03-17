# Store Faceted Canonical Matrix

_Last updated: 2026-03-10_

This document defines the canonical handling for `/store` and related listing-style states in `Hylono_MAIN - SEO BOOST`.

| URL/state type | Crawl? | Index? | Canonical target | Default handling | Notes |
|---|---:|---:|---|---|---|
| `/store` base hub | Yes | Yes | Self | Server-render as the primary merchant hub | Main canonical listing route |
| Rental vs buy UI mode | No separate crawl target | No separate index target | `/store` | Client/UI state only unless a dedicated landing page is authored | Prevents duplicate commercial states |
| Sort-only query params | Limited | No | `/store` | Preserve UX if introduced, but strip from canonicals | Avoids duplicate permutations |
| Filter-only query params (`tech`, `goal`, `budget`, `availability`) | Limited | No | `/store` | Treat as assistive state, not an indexable landing page | Only promote curated landings if unique copy is authored |
| Internal search result states | No | No | `/store` or no canonical | Exclude from index | Prevent infinite low-value crawl space |
| Pagination | Yes | Yes | Self | Not currently exposed; if added, each page self-canonicalizes | Do not collapse all pages to page 1 |
| Retired aliases (`/products`, `/shop`) | No long-term | No | Redirect to `/store` | Permanent redirect | Avoid duplicate merchant hubs |
| Thin niche commercial pages (`/firesafe`, `/hho-car-kit`, `/partners`) | Limited | No | Self with `noindex,follow` or stronger canonical route | Public but non-indexable until fully verified | Prevents thin-sprawl and unsupported merchant claims |
| Out-of-stock product hub | Yes | Usually yes | Self | Keep live if route remains useful and points to alternatives | Preserve topical graph continuity |

Current implementation policy:

- `/store` remains the only indexable listing hub.
- Query parameters do not create indexable landing pages.
- Important discovery routes should prefer canonical product hubs such as `/product/hbot` instead of query-param store permutations.
- If future curated store filters are launched, they must ship with unique copy, unique metadata, and explicit self-canonical handling before indexation.
