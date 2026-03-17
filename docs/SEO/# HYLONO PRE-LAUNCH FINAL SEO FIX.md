````markdown
# HYLONO PRE-LAUNCH FINAL SEO FIX

Repository:
F:\ag projects\Hylono_MAIN - SEO BOOST

Target public host:
https://hylono.com

Current development environment:
local production runtime (`next start`) before domain connection.

Your job is to perform the **final SEO fixes required before launch**.

This is an implementation task.

Do NOT redesign the site.  
Do NOT change layout.  
Do NOT change UI composition.  
Do NOT remove premium design elements.

You may modify:

- routing logic
- metadata helpers
- schema helpers
- robots rules
- sitemap generation
- RSS generation
- heading hierarchy
- compliance-sensitive copy
- SEO support layers

---

# PRIMARY OBJECTIVE

Prepare the repository so that **once the domain is connected the site is immediately SEO-correct**.

The implementation must eliminate the blockers found in the confirmation audit.

---

# CRITICAL FIXES REQUIRED

## 1. BLOG ROUTE MUST RETURN REAL 404

Problem:

Invalid blog slugs currently return:

200 + not-found page

instead of a real 404.

Location:

app/blog/[slug]/page.tsx

Required behavior:

invalid article slug -> HTTP 404

Implementation example:

```ts
import { notFound } from "next/navigation"

if (!article) {
  notFound()
}
````

Rules:

* do not return 200 for invalid content
* do not rely on `noindex` fallback
* behavior must match product/condition/protocol routes

---

## 2. REMOVE GLOBAL GENERIC H1

Problem:

`app/layout.tsx` injects a generic `<noscript>` fallback:

Hylono wellness platform

This creates duplicate H1 headings on all pages.

Required fix:

* remove the `<h1>` element from the global noscript fallback
* replace it with a neutral paragraph

Example:

Instead of:

```html
<h1>Hylono wellness platform</h1>
```

use:

```html
<p>Hylono wellness platform</p>
```

This must not affect the visual design.

---

## 3. UPDATE PRIMARY HOST CONFIGURATION

The project currently assumes:

[https://hylono.eu](https://hylono.eu)

But the real launch host will be:

[https://hylono.com](https://hylono.com)

Update all host-dependent logic.

Files likely affected:

* lib/env.ts
* lib/seo-schema.ts
* lib/seo-metadata.ts
* app/robots.ts
* app/sitemap.ts

Requirements:

* canonical URLs must use `https://hylono.com`
* structured data URLs must use `https://hylono.com`
* sitemap URLs must use `https://hylono.com`
* RSS URLs must use `https://hylono.com`

Do not leave `.eu` anywhere in SEO output.

---

## 4. FIX RSS FEED

File:

public/rss.xml

Requirements:

* remove stale numeric URLs
* include only valid article slugs
* ensure URLs match `/blog/[slug]`

Example:

Correct:

/blog/the-science-behind-hyperbaric-oxygen-therapy

Incorrect:

/blog/1
/blog/2

---

## 5. CLEAN UP COMPLIANCE FAILURES

Run:

pnpm compliance:strict

Reduce critical/high failures in SEO-visible content.

Priority files:

* components/blog/ArticleReader.tsx
* components/ChamberCompare.tsx
* components/ChamberCompare5.tsx
* components/LegalPages.tsx
* constants/chambers.ts
* constants/knowledge.ts
* content/research.ts
* content/evidence.ts

Rules:

* remove guarantee/cure/prevent claims
* ensure language is informational, not medical advice
* preserve real evidence references
* do not add fake trust signals

---

# VERIFICATION REQUIRED

After fixes you must run:

pnpm build
pnpm check
pnpm compliance:strict

Start production runtime:

next start

Verify the following routes:

/
/store
/product/hbot
/product/pemf
/conditions/recovery
/research
/protocols/recovery-oxygen-foundation
/blog/[slug]

Test invalid URLs:

/product/not-a-real-product
/conditions/not-a-real-condition
/protocols/not-a-real-protocol
/blog/not-a-real-article

Expected result:

HTTP 404

---

# FINAL SEO CHECK

Verify:

* canonical URLs use `https://hylono.com`
* robots.txt references the correct host
* sitemap URLs match the host
* structured data uses the correct domain
* internal link graph remains intact
* pages render meaningful HTML
* no duplicate H1 remains
* RSS only lists valid articles

---

# OUTPUT FORMAT

Return a report containing:

1. files changed
2. fixes implemented
3. crawlability verification results
4. metadata/host verification results
5. structured data verification results
6. compliance result
7. design parity confirmation
8. final SEO readiness status

Final statement must be either:

PRE-LAUNCH SEO READY

or

PRE-LAUNCH SEO FIXES STILL REQUIRED

```
```
