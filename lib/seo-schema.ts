import { env } from '@/lib/env';
import { siteEntity } from '@/content/site-entity';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
const SCHEMA_COPYRIGHT_YEAR = 2026;
const SCHEMA_COPYRIGHT_NOTICE = `(c) ${SCHEMA_COPYRIGHT_YEAR} Hylono. All rights reserved.`;

// Most recent content + schema update date — update when making substantive changes.
export const SCHEMA_DATE_MODIFIED = '2026-04-12';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface FaqSchemaItem {
  question: string;
  answer: string;
}

export const ORGANIZATION_ID = () => `${SITE_URL}/#organization`;
export const WEBSITE_ID = () => `${SITE_URL}/#website`;

export const createOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'HealthAndBeautyBusiness'],
  '@id': ORGANIZATION_ID(),
  name: siteEntity.name,
  legalName: siteEntity.legalName,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.svg`,
    contentUrl: `${SITE_URL}/logo.svg`,
    name: siteEntity.name,
    width: 512,
    height: 512,
  },
  image: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/og-image.svg`,
    name: siteEntity.name,
    width: 1200,
    height: 630,
  },
  description: siteEntity.description,
  email: siteEntity.contactEmail,
  areaServed: siteEntity.serviceArea,
  knowsLanguage: { '@type': 'Language', name: 'English', alternateName: 'en' },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: siteEntity.supportEmail,
      availableLanguage: ['en'],
      areaServed: siteEntity.serviceArea,
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    },
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: siteEntity.contactEmail,
      availableLanguage: ['en'],
      areaServed: siteEntity.serviceArea,
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    },
    {
      '@type': 'ContactPoint',
      contactType: 'technical support',
      email: siteEntity.supportEmail,
      availableLanguage: ['en'],
      areaServed: siteEntity.serviceArea,
      url: `${SITE_URL}/help`,
    },
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ul. Nowy Swiat 25',
    addressLocality: 'Warsaw',
    addressRegion: 'Masovian Voivodeship',
    postalCode: '00-029',
    addressCountry: 'PL',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 52.23,
    longitude: 21.01,
  },
  currenciesAccepted: 'EUR',
  sameAs: [
    'https://www.instagram.com/hylono',
    'https://x.com/hylono',
    'https://www.linkedin.com/company/hylono',
    'https://www.youtube.com/@hylono',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Hylono wellness technology devices',
    url: `${SITE_URL}/store`,
  },
  makesOffer: [
    { '@id': `${SITE_URL}/rental#service` },
    { '@id': `${SITE_URL}/rental#rental-product` },
  ],
  brand: {
    '@type': 'Brand',
    '@id': `${SITE_URL}/#brand`,
    name: siteEntity.name,
    url: SITE_URL,
    image: `${SITE_URL}/logo.svg`,
    sameAs: [
      'https://www.instagram.com/hylono',
      'https://x.com/hylono',
      'https://www.linkedin.com/company/hylono',
      'https://www.youtube.com/@hylono',
    ],
  },
  owns: { '@type': 'Brand', '@id': `${SITE_URL}/#brand` },
  termsOfService: `${SITE_URL}/terms`,
  privacyPolicy: `${SITE_URL}/privacy`,
  publishingPrinciples: `${SITE_URL}/about`,
  subjectOf: [
    {
      '@type': 'AboutPage',
      '@id': `${SITE_URL}/about`,
      url: `${SITE_URL}/about`,
      name: 'About Hylono',
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/press`,
      url: `${SITE_URL}/press`,
      name: 'Hylono Press & Media',
    },
    {
      '@type': 'MedicalWebPage',
      '@id': `${SITE_URL}/research`,
      url: `${SITE_URL}/research`,
      name: 'Hylono Research Hub',
    },
  ],
});

export const createWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID(),
  name: siteEntity.name,
  url: SITE_URL,
  description: siteEntity.description,
  keywords: [
    'hyperbaric oxygen therapy',
    'hydrogen wellness technology',
    'red light therapy',
    'PEMF therapy',
    'wellness technology rental',
    'bio-optimization',
    'evidence-informed wellness',
    'HBOT',
  ],
  inLanguage: 'en',
  isAccessibleForFree: true,
  audience: {
    '@type': 'Audience',
    audienceType: 'Health-Conscious Consumers',
    geographicArea: { '@type': 'Place', name: 'European Union' },
  },
  dateCreated: '2022',
  image: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/og-image.svg`,
    width: 1200,
    height: 630,
    name: siteEntity.name,
  },
  publisher: { '@id': ORGANIZATION_ID() },
  author: { '@id': ORGANIZATION_ID() },
  copyrightHolder: { '@id': ORGANIZATION_ID() },
  copyrightYear: SCHEMA_COPYRIGHT_YEAR,
  copyrightNotice: SCHEMA_COPYRIGHT_NOTICE,
  maintainer: { '@id': ORGANIZATION_ID() },
  about: { '@id': ORGANIZATION_ID() },
  mainEntity: { '@id': ORGANIZATION_ID() },
  dateModified: SCHEMA_DATE_MODIFIED,
  publishingPrinciples: `${SITE_URL}/about`,
  privacyPolicy: `${SITE_URL}/privacy`,
  editorialPolicies: `${SITE_URL}/about`,
  hasPart: [
    { '@type': 'CollectionPage', '@id': `${SITE_URL}/store`, name: 'Hylono Store', url: `${SITE_URL}/store` },
    { '@type': 'CollectionPage', '@id': `${SITE_URL}/rental`, name: 'Hylono Rentals', url: `${SITE_URL}/rental` },
    { '@type': 'CollectionPage', '@id': `${SITE_URL}/protocols`, name: 'Hylono Protocols', url: `${SITE_URL}/protocols` },
    { '@type': 'CollectionPage', '@id': `${SITE_URL}/conditions`, name: 'Condition Wellness Guides', url: `${SITE_URL}/conditions` },
    { '@type': 'MedicalWebPage', '@id': `${SITE_URL}/research`, name: 'Hylono Research Hub', url: `${SITE_URL}/research` },
    { '@type': 'CollectionPage', '@id': `${SITE_URL}/blog`, name: 'Hylono Blog', url: `${SITE_URL}/blog` },
    { '@type': 'FAQPage', '@id': `${SITE_URL}/faq#faq`, name: 'Hylono FAQ', url: `${SITE_URL}/faq` },
    { '@type': 'ContactPage', '@id': `${SITE_URL}/contact`, name: 'Contact Hylono', url: `${SITE_URL}/contact` },
    { '@type': 'AboutPage', '@id': `${SITE_URL}/about`, name: 'About Hylono', url: `${SITE_URL}/about` },
  ],
});

export const createBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  const leaf = items[items.length - 1];
  const leafPath = leaf?.path ?? '/';
  const breadcrumbId =
    leafPath === '/' ? `${SITE_URL}/#breadcrumb` : `${SITE_URL}${leafPath}#breadcrumb`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path === '/' ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
};

export const createCollectionPageSchema = ({
  name,
  description,
  path,
  dateModified,
  imageUrl,
}: {
  name: string;
  description: string;
  path: string;
  dateModified?: string;
  imageUrl?: string;
}) => {
  const pageId = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  const breadcrumbId = path === '/' ? `${SITE_URL}/#breadcrumb` : `${SITE_URL}${path}#breadcrumb`;
  const resolvedImageUrl = imageUrl ?? `${SITE_URL}/og-image.svg`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': pageId,
    name,
    description,
    url: pageId,
    inLanguage: 'en',
    isAccessibleForFree: true,
    accessMode: 'textual',
    accessModeSufficient: [{ '@type': 'ItemList', itemListElement: ['textual'] }],
    accessibilityFeature: ['alternativeText', 'readingOrder', 'structuredNavigation'],
    image: {
      '@type': 'ImageObject',
      url: resolvedImageUrl,
      width: 1200,
      height: 630,
      name,
    },
    thumbnailUrl: resolvedImageUrl,
    isPartOf: { '@id': WEBSITE_ID() },
    author: { '@id': ORGANIZATION_ID() },
    publisher: { '@id': ORGANIZATION_ID() },
    copyrightHolder: { '@id': ORGANIZATION_ID() },
    copyrightYear: SCHEMA_COPYRIGHT_YEAR,
    copyrightNotice: SCHEMA_COPYRIGHT_NOTICE,
    breadcrumb: { '@id': breadcrumbId },
    potentialAction: { '@type': 'ReadAction', target: [pageId] },
    ...(dateModified ? { dateModified, datePublished: dateModified } : {}),
  };
};

export const createWebPageSchema = ({
  name,
  description,
  path,
  dateModified,
  imageUrl,
}: {
  name: string;
  description: string;
  path: string;
  dateModified?: string;
  imageUrl?: string;
}) => {
  const pageId = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  const breadcrumbId = path === '/' ? `${SITE_URL}/#breadcrumb` : `${SITE_URL}${path}#breadcrumb`;
  const resolvedImageUrl = imageUrl ?? `${SITE_URL}/og-image.svg`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': pageId,
    name,
    description,
    url: pageId,
    inLanguage: 'en',
    isAccessibleForFree: true,
    accessMode: 'textual',
    accessModeSufficient: [{ '@type': 'ItemList', itemListElement: ['textual'] }],
    accessibilityFeature: ['alternativeText', 'readingOrder', 'structuredNavigation'],
    image: {
      '@type': 'ImageObject',
      url: resolvedImageUrl,
      width: 1200,
      height: 630,
      name,
    },
    thumbnailUrl: resolvedImageUrl,
    isPartOf: { '@id': WEBSITE_ID() },
    author: { '@id': ORGANIZATION_ID() },
    publisher: { '@id': ORGANIZATION_ID() },
    copyrightHolder: { '@id': ORGANIZATION_ID() },
    copyrightYear: SCHEMA_COPYRIGHT_YEAR,
    copyrightNotice: SCHEMA_COPYRIGHT_NOTICE,
    breadcrumb: { '@id': breadcrumbId },
    potentialAction: { '@type': 'ReadAction', target: [pageId] },
    ...(dateModified ? { dateModified, datePublished: dateModified } : {}),
  };
};

export interface CitationItem {
  title: string;
  url: string;
  doi?: string;
  year?: number;
  authors?: string;
}

export const createMedicalWebPageSchema = ({
  name,
  description,
  abstract,
  path,
  about,
  citations,
  mainEntity,
  reviewedByName,
  speakableSelectors,
  dateModified,
  datePublished,
  lastReviewed,
}: {
  name: string;
  description: string;
  abstract?: string;
  path: string;
  about?: string[];
  citations?: CitationItem[];
  mainEntity?: object;
  reviewedByName?: string;
  speakableSelectors?: string[];
  dateModified?: string;
  datePublished?: string;
  lastReviewed?: string;
}) => {
  const pageId = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  const breadcrumbId = path === '/' ? `${SITE_URL}/#breadcrumb` : `${SITE_URL}${path}#breadcrumb`;
  return ({
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  '@id': pageId,
  name,
  description,
  ...(abstract ? { abstract } : {}),
  url: pageId,
  inLanguage: 'en',
  isAccessibleForFree: true,
  accessMode: 'textual',
  accessModeSufficient: [{ '@type': 'ItemList', itemListElement: ['textual'] }],
  image: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/og-image.svg`,
    width: 1200,
    height: 630,
    name,
  },
  thumbnailUrl: `${SITE_URL}/og-image.svg`,
  audience: {
    '@type': 'MedicalAudience',
    audienceType: 'Patient',
    healthCondition: { '@type': 'MedicalCondition', name: 'General Wellness' },
  },
  isPartOf: { '@id': WEBSITE_ID() },
  author: { '@id': ORGANIZATION_ID() },
  publisher: { '@id': ORGANIZATION_ID() },
  copyrightHolder: { '@id': ORGANIZATION_ID() },
  copyrightYear: SCHEMA_COPYRIGHT_YEAR,
  copyrightNotice: SCHEMA_COPYRIGHT_NOTICE,
  accessibilityFeature: ['alternativeText', 'readingOrder', 'structuredNavigation'],
  specialty: 'https://schema.org/Wellness',
  usesHealthAspectEnumeration: [
    'https://schema.org/BenefitsHealthAspect',
    'https://schema.org/HowItWorksHealthAspect',
    'https://schema.org/OverviewHealthAspect',
    'https://schema.org/SafetyHealthAspect',
    'https://schema.org/EffectivenessHealthAspect',
    'https://schema.org/UsageOrScheduleHealthAspect',
    'https://schema.org/RelatedTopicsHealthAspect',
  ],
  breadcrumb: { '@id': breadcrumbId },
  ...(datePublished ? { datePublished } : dateModified ? { datePublished: dateModified } : {}),
  ...(about && about.length > 0
    ? {
        about: about.map((term) => ({
          '@type': 'DefinedTerm',
          name: term,
        })),
      }
    : {}),
  ...(citations && citations.length > 0
    ? {
        citation: citations.map((c) => ({
          '@type': 'ScholarlyArticle',
          '@id': c.doi ? `https://doi.org/${c.doi}` : c.url,
          headline: c.title,
          url: c.url,
          ...(c.year ? { datePublished: c.year.toString() } : {}),
          ...(c.authors ? { author: { '@type': 'Person', name: c.authors } } : {}),
          ...(c.doi
            ? { identifier: { '@type': 'PropertyValue', propertyID: 'doi', value: c.doi } }
            : {}),
        })),
      }
    : {}),
  ...(mainEntity ? { mainEntity } : {}),
  ...(reviewedByName
    ? {
        reviewedBy: {
          '@type': 'Organization',
          '@id': ORGANIZATION_ID(),
          name: reviewedByName,
          url: `${SITE_URL}/about`,
        },
      }
    : {}),
  ...(speakableSelectors && speakableSelectors.length > 0
    ? {
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: speakableSelectors,
        },
      }
    : {}),
  ...(dateModified ? { dateModified } : {}),
  ...(lastReviewed ? { lastReviewed } : {}),
  potentialAction: { '@type': 'ReadAction', target: [pageId] },
});
};

export const createFaqSchema = (items: FaqSchemaItem[], path?: string, name?: string) => {
  const pageUrl = path ? (path === '/' ? SITE_URL : `${SITE_URL}${path}`) : undefined;
  return {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  ...(name ? { name } : {}),
  ...(pageUrl
    ? {
        '@id': `${pageUrl}#faq`,
        url: pageUrl,
        potentialAction: { '@type': 'ReadAction', target: [pageUrl] },
      }
    : {}),
  inLanguage: 'en',
  isAccessibleForFree: true,
  accessModeSufficient: [{ '@type': 'ItemList', itemListElement: ['textual'] }],
  accessibilityFeature: ['alternativeText', 'readingOrder', 'structuredNavigation'],
  isPartOf: { '@id': WEBSITE_ID() },
  author: { '@id': ORGANIZATION_ID() },
  publisher: { '@id': ORGANIZATION_ID() },
  dateModified: SCHEMA_DATE_MODIFIED,
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
  };
};

export const createBlogPostingSchema = ({
  articleSection,
  authorName,
  dateModified,
  datePublished,
  description,
  headline,
  path,
  wordCount,
}: {
  articleSection: string;
  authorName: string;
  dateModified?: string | null;
  datePublished: string;
  description: string;
  headline: string;
  path: string;
  wordCount?: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  '@id': `${SITE_URL}${path}#article`,
  headline,
  description,
  abstract: description,
  url: `${SITE_URL}${path}`,
  inLanguage: 'en',
  isAccessibleForFree: true,
  accessMode: 'textual',
  accessModeSufficient: [{ '@type': 'ItemList', itemListElement: ['textual'] }],
  accessibilityFeature: ['alternativeText', 'readingOrder', 'structuredNavigation'],
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}${path}`,
  },
  articleSection,
  keywords: articleSection,
  about: { '@type': 'DefinedTerm', name: articleSection },
  datePublished,
  dateModified: dateModified ?? datePublished,
  ...(wordCount ? { wordCount } : {}),
  image: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/og-image.svg`,
    contentUrl: `${SITE_URL}/og-image.svg`,
    width: 1200,
    height: 630,
    name: headline,
    caption: headline,
  },
  thumbnailUrl: `${SITE_URL}/og-image.svg`,
  author: {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID(),
    name: authorName,
    url: `${SITE_URL}/about`,
  },
  publisher: { '@id': ORGANIZATION_ID() },
  copyrightHolder: { '@id': ORGANIZATION_ID() },
  copyrightYear: SCHEMA_COPYRIGHT_YEAR,
  copyrightNotice: SCHEMA_COPYRIGHT_NOTICE,
  audience: {
    '@type': 'Audience',
    audienceType: 'Health-Conscious Consumers',
  },
  isPartOf: { '@type': 'CollectionPage', '@id': `${SITE_URL}/blog`, url: `${SITE_URL}/blog` },
});

export const createProductSchema = ({
  name,
  description,
  path,
  price,
  priceCurrency = 'EUR',
  availability,
  imageUrl,
}: {
  name: string;
  description: string;
  path: string;
  price?: number;
  priceCurrency?: string;
  availability?: 'https://schema.org/InStock' | 'https://schema.org/OutOfStock';
  imageUrl?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${SITE_URL}${path}#product`,
  name,
  description,
  brand: {
    '@type': 'Brand',
    '@id': `${SITE_URL}/#brand`,
    name: siteEntity.name,
    url: SITE_URL,
  },
  category: 'Wellness Technology',
  url: `${SITE_URL}${path}`,
  audience: {
    '@type': 'PeopleAudience',
    audienceType: 'Health-Conscious Consumers',
    geographicArea: { '@type': 'Place', name: 'European Union' },
  },
  isPartOf: { '@id': WEBSITE_ID() },
  hasWarranty: { '@id': `${SITE_URL}/warranty#standard-warranty` },
  potentialAction: [
    {
      '@type': 'RentAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/rental`,
        actionPlatform: 'https://schema.org/DesktopWebPlatform',
      },
      name: 'Rent this device',
    },
    {
      '@type': 'BuyAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}${path}`,
        actionPlatform: 'https://schema.org/DesktopWebPlatform',
      },
      name: 'Purchase this device',
    },
  ],
  ...(imageUrl
    ? {
        image: {
          '@type': 'ImageObject',
          url: `${SITE_URL}${imageUrl}`,
          caption: name,
          name,
          width: 1200,
          height: 800,
        },
      }
    : {}),
  ...(typeof price === 'number'
    ? {
        offers: {
          '@type': 'Offer',
          url: `${SITE_URL}${path}`,
          priceCurrency,
          price,
          validFrom: SCHEMA_DATE_MODIFIED,
          itemCondition: 'https://schema.org/NewCondition',
          availability: availability ?? 'https://schema.org/InStock',
          eligibleRegion: { '@type': 'Place', name: 'European Union' },
          seller: { '@id': ORGANIZATION_ID() },
          shippingDetails: { '@id': `${SITE_URL}/shipping#shipping-policy` },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            '@id': `${SITE_URL}/returns#return-policy`,
            url: `${SITE_URL}/returns`,
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 30,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn',
            refundType: 'https://schema.org/FullRefund',
            inStoreReturnsOffered: false,
          },
        },
      }
    : {}),
});

export const createRentalProductSchema = ({
  name,
  description,
  path,
  monthlyPrice,
}: {
  name: string;
  description: string;
  path: string;
  monthlyPrice: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${SITE_URL}${path}#rental-product`,
  name,
  description,
  category: 'Wellness Technology Rental',
  inLanguage: 'en',
  url: `${SITE_URL}${path}`,
  audience: {
    '@type': 'PeopleAudience',
    audienceType: 'Health-Conscious Consumers',
    geographicArea: { '@type': 'Place', name: 'European Union' },
  },
  isPartOf: { '@id': WEBSITE_ID() },
  image: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/og-image.svg`,
    contentUrl: `${SITE_URL}/og-image.svg`,
    width: 1200,
    height: 630,
    name,
  },
  brand: {
    '@type': 'Brand',
    '@id': `${SITE_URL}/#brand`,
    name: siteEntity.name,
    url: SITE_URL,
  },
  hasWarranty: { '@id': `${SITE_URL}/warranty#standard-warranty` },
  potentialAction: {
    '@type': 'RentAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}${path}`,
      actionPlatform: 'https://schema.org/DesktopWebPlatform',
    },
    name: 'Start rental plan',
  },
  offers: {
    '@type': 'Offer',
    url: `${SITE_URL}${path}`,
    priceCurrency: 'EUR',
    price: monthlyPrice,
    validFrom: SCHEMA_DATE_MODIFIED,
    itemCondition: 'https://schema.org/NewCondition',
    availability: 'https://schema.org/InStock',
    eligibleRegion: { '@type': 'Place', name: 'European Union' },
    businessFunction: 'https://purl.org/goodrelations/v1#LeaseOut',
    seller: { '@id': ORGANIZATION_ID() },
    shippingDetails: { '@id': `${SITE_URL}/shipping#shipping-policy` },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      '@id': `${SITE_URL}/returns#return-policy`,
      url: `${SITE_URL}/returns`,
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 30,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
      refundType: 'https://schema.org/FullRefund',
      inStoreReturnsOffered: false,
    },
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      priceCurrency: 'EUR',
      price: monthlyPrice,
      billingDuration: 1,
      unitText: 'month',
      referenceQuantity: {
        '@type': 'QuantitativeValue',
        value: 1,
        unitCode: 'MON',
      },
    },
  },
});

export const createRentalServiceSchema = ({
  name,
  description,
  path,
  monthlyPrice,
}: {
  name: string;
  description: string;
  path: string;
  monthlyPrice: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${SITE_URL}${path}#service`,
  name,
  description,
  serviceType: 'Wellness Equipment Rental',
  category: 'Wellness Technology',
  url: `${SITE_URL}${path}`,
  inLanguage: 'en',
  provider: { '@id': ORGANIZATION_ID() },
  areaServed: siteEntity.serviceArea,
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: `${SITE_URL}${path}`,
    serviceEmail: siteEntity.contactEmail,
    availableLanguage: ['en'],
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'EUR',
    price: monthlyPrice,
    validFrom: SCHEMA_DATE_MODIFIED,
    itemCondition: 'https://schema.org/NewCondition',
    availability: 'https://schema.org/InStock',
    eligibleRegion: { '@type': 'Place', name: 'European Union' },
    seller: { '@id': ORGANIZATION_ID() },
  },
  serviceOutput: {
    '@type': 'Product',
    '@id': `${SITE_URL}${path}#rental-product`,
    name,
    category: 'Wellness Technology Rental',
    brand: { '@type': 'Brand', '@id': `${SITE_URL}/#brand`, name: siteEntity.name },
  },
  termsOfService: `${SITE_URL}/terms`,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Hylono rental plans',
    url: `${SITE_URL}${path}`,
  },
  isRelatedTo: [
    { '@type': 'Service', name: 'Device Onboarding Support', provider: { '@id': ORGANIZATION_ID() } },
    { '@type': 'Service', name: 'Technical Support', provider: { '@id': ORGANIZATION_ID() } },
  ],
  isPartOf: { '@id': WEBSITE_ID() },
});
