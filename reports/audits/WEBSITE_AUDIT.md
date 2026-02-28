# Full Website Audit — Hylono

**Date:** 2026-02-19  
**Scope:** Main marketing site (Vite + React SPA at hylono.com), public assets, SEO, accessibility, security, performance, and content/routing consistency.

---

## 1. Executive summary

| Area           | Status   | Notes |
|----------------|----------|--------|
| SEO (technical) | Good    | Strong meta, canonical, hreflang, schema; a few fixes below. |
| SEO (content)  | Good     | pageSEO map is comprehensive; legal URL mismatch with sitemap. |
| Accessibility  | Good     | Skip link, main landmark, reduced motion, ARIA in key components; some decorative images need review. |
| Security       | Strong   | CSP, secure headers, DOMPurify for UGC, consent-first analytics. |
| Performance    | Good     | Lazy routes, chunk splitting, Brotli/gzip, font preload; SPA caveats. |
| Routing / URLs | Issues   | Sitemap and internal links use `/legal/*` but app uses `/privacy`, `/terms`, etc. |
| Standards      | Minor    | robots.txt Crawl-delay non-standard; preload font URLs may be brittle. |

---

## 2. SEO audit

### 2.1 Strengths

- **index.html**
  - Unique `<title>`, meta description, keywords, author, `robots` (index, follow), canonical.
  - Geo tags (PL, Warsaw) and hreflang (en, de, pl, nl) with x-default.
  - Open Graph and Twitter Card meta with image, locale, alternates.
  - Preconnect/preload for fonts and key origins; theme-color and PWA manifest.
- **Structured data**
  - Organization, WebSite (with SearchAction), and example Product schema in index.html.
  - Per-route injection in `AppRouter` (Organization on home, Product on product pages) via `StructuredData.tsx`.
- **Dynamic SEO**
  - `SEO.tsx` updates title, description, keywords, robots, OG, Twitter, canonical per page; `pageSEO` covers all major routes including noIndex for checkout, account, wishlist, partner hub.
- **Sitemap & robots**
  - `public/sitemap.xml` lists core, product, info, partner, and legal URLs with lastmod/priority/changefreq.
  - `public/robots.txt` allows `/`, disallows `/api/`, `/admin/`, `/dashboard/`, `/_/`, references sitemap.

### 2.2 Issues and recommendations

| Priority | Issue | Recommendation |
|----------|--------|----------------|
| High | **Legal URL mismatch** — Sitemap and CookieConsent use `/legal/privacy`, `/legal/terms`, `/legal/cookies`. The app router uses first path segment only (`currentPage = pathParts[0]`), so routes are `/privacy`, `/terms`, `/cookie-policy`. Visiting `/legal/privacy` results in 404 (no `legal` route). | Either (a) add routing for `currentPage === 'legal'` and `pathParts[1]` (e.g. privacy, terms, cookies) and render the corresponding LegalPages, or (b) change sitemap and all internal links to `/privacy`, `/terms`, `/cookie-policy` and keep current routing. |
| Medium | **Hreflang targets** — index.html points to `https://hylono.com/de/`, `/pl/`, `/nl/`. If i18n routes are not implemented yet, these may 404 or duplicate content. | Confirm when i18n goes live; until then consider removing or pointing hreflang to the same URL as x-default to avoid broken/duplicate signals. |
| Low | **Blog/article URLs** — Sitemap does not list individual blog posts (e.g. `/blog/slug`). | If blog is public and you want them indexed, add URLs to sitemap (or generate sitemap dynamically from CMS/content source). |
| Low | **Product schema in index.html** — Single example Product (HBOT) with fixed price range. | Ensure product pages inject their own Product schema (already done via `ProductStructuredData` for tech pages); consider removing or generalizing the example in index to avoid duplication. |

---

## 3. Accessibility audit

### 3.1 Strengths

- **Skip link** — Visible on focus, targets `#main-content` (WCAG 2.4.1).
- **Main landmark** — `<main id="main-content" tabIndex={-1}>` for focus target and landmark.
- **Screen reader utility** — `.sr-only` and `.sr-only:focus` / `.not-sr-only:focus` in `index.css` for skip link and focus visibility.
- **Reduced motion** — `useReducedMotion()` in AppRouter disables motion for page transitions when user prefers reduced motion.
- **ARIA** — Many components use `aria-*`, `role=`, `tabIndex`, focus management (e.g. CookieConsent, BookDemoModal, MegaMenu, CommandPalette, useFocusTrap).
- **Accessibility page** — LegalPages includes an accessibility statement (skip links, ARIA, keyboard nav, reduced motion).

### 3.2 Issues and recommendations

| Priority | Issue | Recommendation |
|----------|--------|----------------|
| Medium | **Decorative images** — Some `<img>` usages have `alt=""` (e.g. HBOTCatalogPage5 nav background). Decorative images should have `alt=""`; meaningful images need descriptive alt. | Audit all `<img>` in ChamberDetailPage, ChamberCompare, ChamberFinder, HBOTCatalog*, PartnerStudio for correct alt (descriptive vs empty). |
| Low | **Error boundary** — App-level ErrorBoundary has a generic “Re-Initialize System” button; no `aria-live` or role for error region. | Add `role="alert"` or `aria-live="assertive"` to the error message container so screen readers announce the error. |
| Low | **Loading screen** — LoadingScreen has no `aria-live` or `aria-busy`; screen reader users may not know content is loading. | Add `aria-live="polite"` and `aria-busy="true"` to the loading container and clear when content mounts. |

---

## 4. Security audit

### 4.1 Strengths

- **Content Security Policy** — index.html and vercel.json set CSP (default-src 'self'; script/style/font/img/connect/frame tightly scoped; frame-ancestors 'none'; base-uri, form-action 'self').
- **Security headers (vercel.json)** — X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy, HSTS, COOP, CORP.
- **XSS mitigation** — User-generated HTML (blog article, blog editor preview) is sanitized with DOMPurify via `utils/sanitization.ts` (allowed tags/attrs, no dangerous protocols) before `dangerouslySetInnerHTML`.
- **API routes** — robots.txt and routing disallow indexing of `/api/`; vercel.json sets no-store for `/api/(.*)`.
- **Analytics** — PostHog is consent-gated (GDPR); lazy-loaded; opt_out_capturing_by_default; consent stored and synced across tabs.
- **Env** — Only `VITE_*` used in client (PostHog key/host, feature flags); no server secrets in client bundle.

### 4.2 Recommendations

- Ensure Stripe and any payment flows use server-side or Stripe-hosted flows so no PCI-sensitive data hits client.
- If blog or partner content can include iframes, ensure sanitization `allowIframes` is only for allowlisted origins (currently DOMPurify config is strict).

---

## 5. Performance audit

### 5.1 Strengths

- **Code splitting** — All page-level components lazy-loaded via `React.lazy()`; Suspense with LoadingScreen.
- **Vite build** — manualChunks for react-vendor, framer-motion, lucide-icons, utils, charts, pdf, partner-studio; chunk size limit 250KB; Brotli and gzip via vite-plugin-compression; cssCodeSplit; target es2020; modulePreload with polyfill.
- **Fonts** — Preconnect to Google Fonts; preload for critical woff2; main stylesheet loaded with `media="print" onload="this.media='all'"` and noscript fallback.
- **Caching** — vercel.json: long cache for `/assets/(.*)`, no-store for `/api/(.*)`.
- **SPA rewrite** — All non-api, non-asset routes serve index.html so client router can run.

### 5.2 Recommendations

- **Preload font URLs** — index.html hardcodes two specific woff2 URLs from fonts.gstatic.com. If Google Fonts CSS changes, these can break. Consider preloading only after confirming URLs match the CSS or use a single preconnect and rely on CSS font loading.
- **LCP** — Ensure hero images on home and key landing pages use `fetchpriority="high"` and appropriate `width`/`height`/`loading` (e.g. no lazy on above-the-fold hero).
- **Core Web Vitals** — If not already, add real-user monitoring (e.g. Vercel Analytics, or PostHog with consent) to track LCP, FID/INP, CLS on production.

---

## 6. Routing and content consistency

### 6.1 URL vs route mapping

- App uses **first path segment** as `currentPage` (e.g. `/store` → store, `/blog/my-slug` → blog with slug). So:
  - `/privacy`, `/terms`, `/shipping`, `/cookie-policy`, `/returns`, `/disclaimer`, `/accessibility` are valid.
  - `/legal/privacy` → currentPage `legal`, pathParts[1] `privacy` → **no route** → 404.

### 6.2 Sitemap vs app

| Sitemap URL | App route | Match? |
|-------------|-----------|--------|
| /legal/privacy | /privacy | No (404 for /legal/privacy) |
| /legal/terms | /terms | No |
| /legal/cookies | /cookie-policy | No (path also differs) |

All other sitemap URLs (/, /store, /product/..., /about, /blog, etc.) align with the router.

### 6.3 Internal links

- CookieConsent links to `/legal/privacy`; that URL currently 404s. Should link to `/privacy` or app must support `/legal/privacy`.

---

## 7. Robots.txt

- **Crawl-delay: 1** — Not part of Google’s robots.txt spec; Google ignores it. Only some other crawlers respect it. Safe to remove if you want to avoid confusion; keep if you rely on other bots honoring it.

---

## 8. PWA and manifest

- **manifest.json** — Present with name, short_name, description, start_url, display standalone, theme_color, background_color, icons, shortcuts (Shop, Protocols, Locator). No critical issues.

---

## 9. Checklist summary

| Category | Item | Done |
|----------|------|------|
| SEO | Unique title/meta per page | Yes |
| SEO | Canonical URLs | Yes |
| SEO | Sitemap + robots.txt | Yes (legal URLs wrong) |
| SEO | Structured data (Org, WebSite, Product) | Yes |
| A11y | Skip to main content | Yes |
| A11y | Main landmark | Yes |
| A11y | Reduced motion | Yes |
| A11y | Image alt audit | Partial |
| Security | CSP + security headers | Yes |
| Security | Sanitized UGC (DOMPurify) | Yes |
| Security | Consent-first analytics | Yes |
| Perf | Lazy routes + chunk splitting | Yes |
| Perf | Compression (Brotli/gzip) | Yes |
| Perf | Font preload/preconnect | Yes |
| Routing | Legal URLs vs sitemap/links | Fix required |

---

## 10. Recommended next steps (priority order)

1. **Fix legal URLs** — Either add `legal` segment routing (e.g. `currentPage === 'legal'` and render Privacy/Terms/Cookie by pathParts[1]) or change sitemap and all links to `/privacy`, `/terms`, `/cookie-policy`.
2. **Audit image alt** — Review every `<img>` in catalog, chamber, and partner components; set descriptive alt for content images and `alt=""` for decorative.
3. **Confirm hreflang** — When i18n is live, ensure /de, /pl, /nl exist and match hreflang; until then, consider simplifying hreflang.
4. **Optional** — Add `aria-live`/`aria-busy` to loading and error UI; add RUM for Core Web Vitals; review preload font URLs for longevity.

---

*End of audit.*
