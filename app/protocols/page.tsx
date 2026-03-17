import type { Metadata } from 'next';
import { Suspense } from 'react';
import { protocols } from '@/content/protocols';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, WEBSITE_ID, createBreadcrumbSchema, createCollectionPageSchema, SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import { LEGACY_PRODUCT_ROUTE_REDIRECTS, getTechTypeFromRouteSlug } from '@/lib/product-routes';
import { TECH_DETAILS } from '@/constants';
import StructuredData from '@/src/components/StructuredData';
import { StaticStructuredData } from '@/src/components/StaticStructuredData';
import { ProtocolsClient } from './ProtocolsClient';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = createPageMetadata({
  title: 'Hylono Protocols | Guided Wellness Plans for Recovery, Stress, Sleep, and Vitality',
  description:
    'Explore structured Hylono usage protocols for recovery, stress, sleep, and vitality goals.',
  path: '/protocols',
});

// [DECISION: ISR because protocol index content is semi-dynamic and periodically updated.]
export default function ProtocolsPageRoute() {
  const protocolListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/protocols#protocol-list`,
    name: 'Hylono guided wellness protocols',
    description:
      'Structured multi-week usage protocols for recovery, stress, sleep, and vitality goals with device scheduling and evidence references.',
    url: `${SITE_URL}/protocols`,
    inLanguage: 'en',
    dateModified: SCHEMA_DATE_MODIFIED,
    isPartOf: { '@id': WEBSITE_ID() },
    publisher: { '@id': ORGANIZATION_ID() },
    numberOfItems: protocols.length,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    itemListElement: protocols.map((protocol, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/protocols/${protocol.slug}`,
      item: {
        '@type': 'HowTo',
        '@id': `${SITE_URL}/protocols/${protocol.slug}#howto`,
        name: protocol.title,
        description: protocol.shortDescription,
        url: `${SITE_URL}/protocols/${protocol.slug}`,
        inLanguage: 'en',
        about: {
          '@type': 'MedicalCondition',
          '@id': `${SITE_URL}/conditions/${protocol.goalTag}#condition`,
          name: protocol.goal,
        },
        totalTime: `P${Math.max(protocol.durationWeeks, 1)}W`,
        yield: {
          '@type': 'DefinedTerm',
          name: protocol.goal,
          url: `${SITE_URL}/conditions/${protocol.goalTag}`,
          inDefinedTermSet: `${SITE_URL}/conditions`,
        },
        publisher: { '@id': ORGANIZATION_ID() },
        isPartOf: { '@type': 'CollectionPage', '@id': `${SITE_URL}/protocols` },
        tool: protocol.requiredDevices.map((device) => {
          const routeSlug =
            LEGACY_PRODUCT_ROUTE_REDIRECTS[
              device.productId as keyof typeof LEGACY_PRODUCT_ROUTE_REDIRECTS
            ] ?? device.productId;
          const techType = getTechTypeFromRouteSlug(routeSlug);
          const toolName = techType ? `Hylono ${TECH_DETAILS[techType].name}` : routeSlug;
          return {
            '@type': 'HowToTool',
            '@id': `${SITE_URL}/product/${routeSlug}#product`,
            name: toolName,
            url: `${SITE_URL}/product/${routeSlug}`,
          };
        }),
        potentialAction: { '@type': 'ReadAction', target: [`${SITE_URL}/protocols/${protocol.slug}`] },
      },
    })),
  };

  return (
    <>
      <StaticStructuredData id="jsonld-protocols-list" data={protocolListSchema} />
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-protocols-page"
          data={{
            ...createCollectionPageSchema({
              name: 'Hylono Protocols',
              description:
                'Explore structured Hylono usage protocols for recovery, stress, sleep, and vitality goals.',
              path: '/protocols',
              dateModified: SCHEMA_DATE_MODIFIED,
            }),
            about: protocols.map((protocol) => ({
              '@type': 'HowTo',
              '@id': `${SITE_URL}/protocols/${protocol.slug}#howto`,
              name: protocol.title,
              url: `${SITE_URL}/protocols/${protocol.slug}`,
            })),
            keywords: 'wellness protocols, recovery protocol, sleep protocol, stress relief protocol, HBOT protocol, PEMF protocol, hydrogen therapy protocol, guided wellness plans',
            mainEntity: { '@id': `${SITE_URL}/protocols#protocol-list` },
            relatedLink: [`${SITE_URL}/conditions`, `${SITE_URL}/research`, `${SITE_URL}/store`],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['#protocols-hero-headline', '#protocols-hero-description'],
            },
          }}
        />
        <StructuredData
          id="jsonld-protocols-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Protocols', path: '/protocols' },
          ])}
        />
      </Suspense>
      <ProtocolsClient />
    </>
  );
}
