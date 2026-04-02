# SKILL: SEO Medtech Playbook (Next.js 16)
**Used by**: seo-performance, content-product-writer

## Core Web Vitals Budgets
| Metric | Target |
|---|---|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| First Load JS | < 200KB gzip |
| Shared/layout chunk | < 150KB gzip |

## Page SEO Baseline
- Title (50–60 chars)
- Description (150–160 chars)
- Canonical URL
- Open Graph tags
- Structured data where applicable (Product, FAQ, Article, Organization)

## Next.js 16 SEO Rules
- Use Metadata API in server files
- Never combine metadata export with `'use client'`
- Prefer server-rendered content for indexable routes
- Use caching APIs (`cacheLife`, `cacheTag`, `revalidateTag`) with intent

## E-E-A-T (Health/Wellness)
- Author + credentials
- Last reviewed date
- Evidence-backed claims with sources
- Clear medical disclaimer where needed
- Separation between promotional copy and evidence statements

## Multi-locale SEO
- Proper hreflang mapping
- Locale-aware canonicals
- Locale-aware metadata and structured data

## Anti-Patterns
- Client-only SEO-critical pages
- Missing disclaimers on health-adjacent claims
- Structured data mismatch with visible page content
