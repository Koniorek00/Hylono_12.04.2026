# SKILL: SEO Medtech Playbook
**Used by**: seo-performance, content-product-writer

---

## Core Web Vitals Targets
| Metric | Target | Measurement |
|--------|--------|------------|
| LCP (Largest Contentful Paint) | < 2.5s | Hero image/text |
| INP (Interaction to Next Paint) | < 200ms | Click response |
| CLS (Cumulative Layout Shift) | < 0.1 | No jumping content |
| Initial JS bundle | < 250KB gzip | Vite build output |
| TTI on 3G | < 5s | DevTools throttle |

## Page Metadata Standards
```tsx
// Every page must have:
<title>Primary Keyword — Hylono (50-60 chars)</title>
<meta name="description" content="Specific benefit statement with keyword. (150-160 chars)" />
<link rel="canonical" href="https://hylono.com/[path]" />
<meta property="og:title" content="[same as title]" />
<meta property="og:description" content="[same as description]" />
<meta property="og:image" content="[1200x630 product image]" />
```

## Structured Data (JSON-LD) Templates

### Product Page
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "mHBOT Chamber — Hylono",
  "description": "[product description]",
  "brand": { "@type": "Brand", "name": "Hylono" },
  "offers": [
    {
      "@type": "Offer",
      "name": "Rent",
      "price": "299",
      "priceCurrency": "EUR",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock"
    },
    {
      "@type": "Offer", 
      "name": "Purchase",
      "price": "4999",
      "priceCurrency": "EUR"
    }
  ]
}
```

### FAQ Page / FAQ Section
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is mild hyperbaric oxygen therapy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[answer text]"
      }
    }
  ]
}
```

## E-E-A-T for Health Content
Google's quality guidelines for YMYL (Your Money or Your Life) content:
- **Experience**: Personal use stories, customer testimonials (compliant)
- **Expertise**: Author credentials displayed, professional qualifications
- **Authoritativeness**: About page, founder story, certifications
- **Trustworthiness**: Citations, clear disclaimers, privacy policy

**Implementation checklist:**
- [ ] Author byline on all content (name + credentials)
- [ ] Last reviewed date on product + protocol pages
- [ ] About page with team credentials
- [ ] All health claims have citations
- [ ] Medical disclaimer on product pages
- [ ] Company registration/address in footer

## Keyword Strategy by Modality
| Modality | Primary KW | Long-tail targets |
|----------|-----------|------------------|
| mHBOT | "hyperbaric oxygen therapy home" | "mild HBOT rent", "portable hyperbaric chamber" |
| Hydrogen | "hydrogen therapy home" | "hydrogen inhalation machine rent" |
| RLT | "red light therapy panel" | "near infrared therapy home device" |
| PEMF | "PEMF mat therapy" | "pulsed electromagnetic field home" |

## Technical SEO Checklist
- [ ] `robots.txt` present and correct
- [ ] `sitemap.xml` generated and submitted
- [ ] No orphan pages (all reachable via nav)
- [ ] No duplicate content (canonical tags set)
- [ ] hreflang for all language variants
- [ ] Image alt text on all product images
- [ ] Internal linking: product pages → protocol pages → blog
- [ ] Core Web Vitals: all green in PageSpeed Insights
