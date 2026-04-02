# SKILL: React + Next.js 16 Patterns
**Used by**: architect-orchestrator, frontend-specialist

## Component Architecture
- Keep `page.tsx` server-only; extract interaction into `*Client.tsx`
- Keep client boundaries deep and narrow
- Prefer composition over prop explosion
- One responsibility per component

## Data Fetching
- Server reads in server components by default
- Cache with `"use cache"`, `cacheLife`, `cacheTag` where appropriate
- Revalidate with `revalidateTag` / `updateTag` after mutations
- Use TanStack Query only for realtime/polling use-cases

## State Strategy
| State type | Preferred tool |
|---|---|
| Local UI state | `useState` / `useReducer` |
| URL state | `nuqs` |
| Server mutation state | Server Actions + `useTransition` |
| Realtime client data | TanStack Query |

## Performance Patterns
- Use route-level and component-level code splitting intentionally
- Avoid unnecessary memoization; profile first
- Keep bundle under workspace budgets
- Prefer server rendering for SEO-critical pages

## Accessibility Patterns
- Semantic elements first
- Keyboard operable interactions
- Visible focus styles
- Announce dynamic content where relevant (`aria-live`)

## Anti-Patterns
- Client-only page shells for indexable routes
- Sync access to request APIs in Next.js 16
- Routing with `window.location` or `react-router-dom`
- Image tags instead of `next/image`
- `framer-motion` import instead of `motion/react`
