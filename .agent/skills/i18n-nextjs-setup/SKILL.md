# SKILL: i18n Setup — React/Vite
**Used by**: i18n-specialist, frontend-specialist

---

## Priority Locales
| Locale | Market | Status |
|--------|--------|--------|
| `en` | Default / English | Primary |
| `de` | Germany, Austria, CH | Key EU |
| `pl` | Poland (home market) | Priority |
| `nl` | Netherlands | Expansion |

## Translation File Structure
```
/public/locales/
  en/
    common.json       # Navigation, buttons, shared UI
    products.json     # Product names, descriptions
    checkout.json     # Rental/purchase flow
    legal.json        # Disclaimers, GDPR notices
    errors.json       # Validation, API errors
  de/
    [same files]
  pl/
    [same files]
  nl/
    [same files]
```

## Key Naming Convention
```
namespace.section.element
```
```json
// products.json
{
  "hero": {
    "headline": "Breathe Deeper. Recover Faster.",
    "subheadline": "Mild Hyperbaric Oxygen Therapy for home use",
    "cta_rent": "Experience It",
    "cta_buy": "Purchase"
  },
  "safety": {
    "disclaimer": "Not intended to diagnose, treat, cure, or prevent any disease.",
    "consult": "Consult your healthcare provider before use."
  }
}
```

## ICU Message Format (plurals/variables)
```json
{
  "rental_duration": "{days, plural, one {# day} other {# days}}",
  "price_from": "From {price} / month",
  "items_in_cart": "{count, plural, =0 {Empty cart} one {# item} other {# items}}"
}
```

## React Implementation
```tsx
import { useTranslation } from 'react-i18next';

export const ProductHero = () => {
  const { t } = useTranslation('products');
  
  return (
    <section>
      <h1>{t('hero.headline')}</h1>
      <p>{t('hero.subheadline')}</p>
      <button>{t('hero.cta_rent')}</button>
    </section>
  );
};
```

## Locale-Aware Formatting
```tsx
// ✅ Always use Intl — never manual formatting
const formatPrice = (amount: number, locale: string) =>
  new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(amount / 100); // Store prices as cents

const formatDate = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { 
    dateStyle: 'long' 
  }).format(date);

// ❌ Never:
const price = `€${(amount / 100).toFixed(2)}`; // Wrong for DE (comma decimal)
```

## hreflang Implementation
```html
<!-- In <head> for every page -->
<link rel="alternate" hreflang="en" href="https://hylono.com/en/products/mhbot" />
<link rel="alternate" hreflang="de" href="https://hylono.com/de/products/mhbot" />
<link rel="alternate" hreflang="pl" href="https://hylono.com/pl/products/mhbot" />
<link rel="alternate" hreflang="nl" href="https://hylono.com/nl/products/mhbot" />
<link rel="alternate" hreflang="x-default" href="https://hylono.com/en/products/mhbot" />
```

## Medical/Legal Content Per Locale
Some content differs beyond translation (different regulatory status per country):
```json
// Each locale can have locale-specific overrides
{
  "regulatory_status": {
    "en": "For wellness use. Not a medical device.",
    "de": "Zur Wellnessunterstützung. Kein Medizinprodukt.",
    "pl": "Do użytku wellness. Nie jest wyrobem medycznym."
  }
}
```
