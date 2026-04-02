# SKILL: CMS Content Modeling
**Used by**: cms-content-modeler

---

## Core Principle
Model by ENTITY (what it IS), not by PAGE (where it appears).

## Key Content Types for Hylono

### Product
```typescript
interface Product {
  // Identity
  id: string;
  slug: string;
  name: LocalizedString;
  
  // Classification
  modality: 'oxygen' | 'hydrogen' | 'light' | 'signal';
  category: 'chamber' | 'generator' | 'panel' | 'mat' | 'device';
  
  // Content
  headline: LocalizedString;
  description: LocalizedRichText;
  howItWorks: LocalizedRichText;
  benefits: LocalizedString[];
  
  // MANDATORY REGULATORY FIELDS
  intendedUse: LocalizedString;           // Required
  safetyInformation: LocalizedRichText;   // Required
  contraindications: LocalizedString[];   // Required
  regulatoryStatus: 'wellness' | 'cleared' | 'pending';
  regulatoryRegion: string[];
  lastReviewedDate: Date;                 // Required
  reviewedBy: TeamMember;                 // Required
  
  // Commerce
  rentalPrice: Price;
  purchasePrice?: Price;
  inStock: boolean;
  
  // Relations
  relatedProducts: Product[];    // For stacking
  protocols: Protocol[];         // Recommended protocols
  
  // Audience
  audience: ('consumer' | 'professional' | 'partner')[];
  
  // SEO
  seoTitle: LocalizedString;
  seoDescription: LocalizedString;
  ogImage: Image;
}
```

### Protocol
```typescript
interface Protocol {
  id: string;
  slug: string;
  name: LocalizedString;
  duration: '7d' | '30d' | '60d' | '90d' | 'ongoing';
  
  // Components
  devices: Product[];          // Required devices
  optionalDevices: Product[];  // Stack additions
  
  // Content
  overview: LocalizedRichText;
  sessionGuide: ProtocolSession[];
  weekByWeekGuide: LocalizedRichText;
  expectedOutcomes: LocalizedString[]; // Compliant language only
  
  // Regulatory
  safetyNotes: LocalizedString[];
  contraindications: LocalizedString[];
  
  // Audience
  targetPersonas: Persona[];
}
```

### LocalizedString Type
```typescript
type Locale = 'en' | 'de' | 'pl' | 'nl';
type LocalizedString = Record<Locale, string>;
type LocalizedRichText = Record<Locale, RichTextBlock[]>;
```

## Editorial Workflow
```
DRAFT → IN_REVIEW → COMPLIANCE_CHECK → APPROVED → PUBLISHED
                                ↑
                    Required for any medical claims
                    Reviewed by: content-product-writer
```

**Compliance check triggers** (cannot publish without):
- Product safety information field not empty
- Medical disclaimer confirmed
- `lastReviewedDate` set to current or recent date

## Content Relationship Map
```
Product
  ├── belongs to → Modality
  ├── has → Protocol (1:many)
  ├── relates to → Product (many:many, for stacking)
  ├── has → TeamMember (reviewer)
  └── tagged with → Audience

Protocol
  ├── requires → Product (1:many)
  └── targets → Persona (many:many)

Article/Blog
  ├── covers → Modality (optional)
  ├── references → Protocol (optional)
  ├── authored by → TeamMember
  └── tagged with → Audience
```

## Anti-patterns to Always Flag
- `HomePageHeroSlot` type — delete, create `FeaturedProduct` reference instead
- Optional `safetyInformation` on products — make it required at schema level
- Unlocalized strings — all user-facing text must support all 4 locales
