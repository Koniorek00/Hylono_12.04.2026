import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo-metadata';
import {
  ORGANIZATION_ID,
  createBreadcrumbSchema,
  createMedicalWebPageSchema,
  SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';
import { env } from '@/lib/env';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
import { TECH_DETAILS } from '@/constants';
import { protocolBySlug, protocols } from '@/content/protocols';
import { evidence } from '@/content/evidence';
import { LEGACY_PRODUCT_ROUTE_REDIRECTS, getTechTypeFromRouteSlug } from '@/lib/product-routes';
import StructuredData from '@/src/components/StructuredData';
import { ProtocolDetailClient } from './ProtocolDetailClient';

const resolveProtocolSlug = (rawSlug: string) => {
  const canonicalSlug = rawSlug.toLowerCase();
  if (rawSlug !== canonicalSlug && protocolBySlug[canonicalSlug]) {
    permanentRedirect(`/protocols/${canonicalSlug}`);
  }

  return canonicalSlug;
};

export function generateStaticParams() {
  return protocols.map((protocol) => ({
    slug: protocol.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = resolveProtocolSlug(rawSlug);
  const protocol = protocolBySlug[slug];

  if (!protocol) {
    notFound();
  }

  return createPageMetadata({
    title: `${protocol.title} | Schedule, Devices and Setup Guidance`,
    description: `Review the ${protocol.title.toLowerCase()} schedule, required devices, safety notes, and related research references.`,
    path: `/protocols/${slug}`,
  });
}

// [DECISION: ISR because protocol detail content is editorial and refreshed periodically.]
export default async function ProtocolDetailPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = resolveProtocolSlug(rawSlug);
  const protocol = protocolBySlug[slug];

  if (!protocol) {
    notFound();
  }

  const reviewOwnerName = protocol.reviewer?.name ?? 'Hylono Research Review';

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Protocols', path: '/protocols' },
    { name: protocol.title, path: `/protocols/${slug}` },
  ]);

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${SITE_URL}/protocols/${slug}#howto`,
    name: protocol.title,
    description: protocol.shortDescription,
    url: `${SITE_URL}/protocols/${slug}`,
    inLanguage: 'en',
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/og-image.svg`,
      width: 1200,
      height: 630,
    },
    isPartOf: { '@type': 'CollectionPage', '@id': `${SITE_URL}/protocols` },
    publisher: { '@id': ORGANIZATION_ID() },
    totalTime: `P${Math.max(protocol.durationWeeks, 1)}W`,
    step: protocol.weeks.slice(0, 3).map((week) => ({
      '@type': 'HowToStep',
      position: week.number,
      name: `Week ${week.number}: ${week.title}`,
      text: week.days
        .map((day) => {
          const sessionSummary = day.sessions
            .map((session) => `${session.modality} (${session.duration})`)
            .join(', ');
          return `Day ${day.number}: ${sessionSummary}`;
        })
        .join(' | '),
    })),
    tool: protocol.requiredDevices.map((device) => {
      const routeSlug =
        LEGACY_PRODUCT_ROUTE_REDIRECTS[
          device.productId as keyof typeof LEGACY_PRODUCT_ROUTE_REDIRECTS
        ] ?? device.productId;
      const techType = getTechTypeFromRouteSlug(routeSlug);
      const toolName = techType ? `Hylono ${TECH_DETAILS[techType].name}` : device.productId;
      return {
        '@type': 'HowToTool',
        '@id': `${SITE_URL}/product/${routeSlug}#product`,
        name: toolName,
        url: `${SITE_URL}/product/${routeSlug}`,
      };
    }),
    about: {
      '@type': 'MedicalCondition',
      '@id': `${SITE_URL}/conditions/${protocol.goalTag}#condition`,
      name: protocol.goal,
      url: `${SITE_URL}/conditions/${protocol.goalTag}`,
    },
    yield: {
      '@type': 'DefinedTerm',
      name: protocol.goal,
      url: `${SITE_URL}/conditions/${protocol.goalTag}`,
      inDefinedTermSet: `${SITE_URL}/conditions`,
    },
    teaches: protocol.goal,
    audience: {
      '@type': 'MedicalAudience',
      audienceType: protocol.targetAudience,
    },
    ...(protocol.safetyNotes
      ? { warning: protocol.safetyNotes }
      : {}),
    ...(protocol.contraindications.length > 0
      ? { contraindication: protocol.contraindications.join('; ') }
      : {}),
    author: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID(),
      name: reviewOwnerName,
      url: `${SITE_URL}/about`,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#protocol-intro'],
    },
    ...(protocol.relatedProtocolSlugs.length > 0
      ? {
          isRelatedTo: protocol.relatedProtocolSlugs.map((s) => ({
            '@type': 'HowTo',
            '@id': `${SITE_URL}/protocols/${s}#howto`,
            url: `${SITE_URL}/protocols/${s}`,
            name: protocolBySlug[s]?.title ?? s,
          })),
        }
      : {}),
  };
  return (
    <>
      <Suspense fallback={null}>
        <StructuredData
          id="jsonld-protocol-page"
          data={{
            ...createMedicalWebPageSchema({
              name: protocol.title,
              description: protocol.shortDescription,
              abstract: protocol.shortDescription,
              path: `/protocols/${slug}`,
              about: protocol.requiredDevices.map((d) => {
                const routeSlug =
                  LEGACY_PRODUCT_ROUTE_REDIRECTS[
                    d.productId as keyof typeof LEGACY_PRODUCT_ROUTE_REDIRECTS
                  ] ?? d.productId;
                const techType = getTechTypeFromRouteSlug(routeSlug);
                return techType ? TECH_DETAILS[techType].name : d.productId;
              }),
              citations: protocol.evidenceIds
                .map((id) => evidence.find((e) => e.id === id))
                .filter((ev): ev is NonNullable<typeof ev> => Boolean(ev))
                .map((ev) => ({
                  title: ev.title,
                  url: ev.sourceUrl,
                  doi: ev.doi,
                  year: ev.year,
                  authors: ev.authors,
                })),
              reviewedByName: reviewOwnerName,
              speakableSelectors: ['#protocol-intro'],
              dateModified: SCHEMA_DATE_MODIFIED,
              lastReviewed: SCHEMA_DATE_MODIFIED,
              mainEntity: { '@id': `${SITE_URL}/protocols/${slug}#howto` },
            }),
            about: [
              ...protocol.requiredDevices.map((d) => {
                const routeSlug =
                  LEGACY_PRODUCT_ROUTE_REDIRECTS[
                    d.productId as keyof typeof LEGACY_PRODUCT_ROUTE_REDIRECTS
                  ] ?? d.productId;
                return {
                  '@type': 'Product',
                  '@id': `${SITE_URL}/product/${routeSlug}#product`,
                  url: `${SITE_URL}/product/${routeSlug}`,
                };
              }),
              {
                '@type': 'MedicalCondition',
                '@id': `${SITE_URL}/conditions/${protocol.goalTag}#condition`,
                name: protocol.goal,
              },
            ],
            audience: {
              '@type': 'MedicalAudience',
              audienceType: 'Patient',
              healthCondition: {
                '@type': 'MedicalCondition',
                name: protocol.goal,
              },
            },
            mentions: [
              ...protocol.requiredDevices.map((d) => {
                const routeSlug =
                  LEGACY_PRODUCT_ROUTE_REDIRECTS[
                    d.productId as keyof typeof LEGACY_PRODUCT_ROUTE_REDIRECTS
                  ] ?? d.productId;
                const techType = getTechTypeFromRouteSlug(routeSlug);
                return {
                  '@type': 'Product',
                  '@id': `${SITE_URL}/product/${routeSlug}#product`,
                  url: `${SITE_URL}/product/${routeSlug}`,
                  name: techType ? `Hylono ${TECH_DETAILS[techType].name}` : d.productId,
                };
              }),
              {
                '@type': 'MedicalWebPage',
                '@id': `${SITE_URL}/conditions/${protocol.goalTag}`,
                url: `${SITE_URL}/conditions/${protocol.goalTag}`,
                name: `${protocol.goal} wellness guide`,
              },
            ],
            keywords: [protocol.goal, protocol.goalTag, protocol.difficulty, 'wellness protocol'].join(', '),
            relatedLink: [
              `${SITE_URL}/protocols`,
              `${SITE_URL}/conditions`,
              `${SITE_URL}/conditions/${protocol.goalTag}`,
              `${SITE_URL}/research`,
              ...protocol.relatedProtocolSlugs.map((s) => `${SITE_URL}/protocols/${s}`),
            ],
          }}
        />
        <StructuredData id="jsonld-protocol-breadcrumb" data={breadcrumbSchema} />
        <StructuredData id="jsonld-protocol-howto" data={howToSchema} />
      </Suspense>
      <ProtocolDetailClient slug={slug} />
    </>
  );
}
