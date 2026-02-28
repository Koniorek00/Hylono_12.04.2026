# SKILL: i18n Setup — Next.js 16 App Router
**Used by**: i18n-specialist, frontend-specialist, seo-performance

## Priority Locales
- `en` (default)
- `de` (key EU)
- `pl` (home market)
- `nl` (expansion)

## Principles
- No hardcoded user-facing strings
- Use translation keys (`namespace.section.element`)
- Use ICU-style pluralization/messages
- Use locale-aware `Intl` formatting for date/number/currency
- Keep legal/medical text locale-specific when regulations differ

## App Router Guidance
- Localized routes should preserve canonical + hreflang integrity
- Metadata should be generated per locale on server
- Keep locale-specific sitemaps where required

## Example Key Pattern
```json
{
  "products": {
    "hero": {
      "headline": "...",
      "cta_rent": "..."
    }
  }
}
```

## Formatting Pattern
```ts
new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(value)
```

## SEO Requirements
- `hreflang` set for all supported locales
- locale-appropriate canonical strategy
- translated metadata (title/description/OG)

## Anti-Patterns
- String concatenation for translatable sentences
- Manual currency/date formatting
- Shipping untranslated fallback text in production
