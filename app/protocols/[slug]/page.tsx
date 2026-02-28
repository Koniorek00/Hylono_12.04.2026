import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { protocolBySlug } from '@/content/protocols';
import StructuredData from '@/src/components/StructuredData';
import { ProtocolDetailClient } from './ProtocolDetailClient';

export const revalidate = 3600;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hylono.eu';

const formatSlugTitle = (slug: string) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const protocolTitle = formatSlugTitle(slug);

  return createPageMetadata({
    title: `${protocolTitle} Protocol | Hylono`,
    description: `Review Hylono's ${protocolTitle} protocol schedule, modality combinations, and safety guidance designed to support wellness outcomes.`,
    path: `/protocols/${slug}`,
  });
}

export default async function ProtocolDetailPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const protocol = protocolBySlug[slug];
  const canonical = `${SITE_URL}/protocols/${slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Protocols',
        item: `${SITE_URL}/protocols`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: protocol?.title || formatSlugTitle(slug),
        item: canonical,
      },
    ],
  };

  const howToSchema = protocol
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: protocol.title,
        description: protocol.shortDescription,
        totalTime: `PT${Math.max(protocol.durationWeeks, 1)}W`,
        step: protocol.weeks.slice(0, 3).map((week) => ({
          '@type': 'HowToStep',
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
        supply: protocol.requiredDevices.map((device) => ({
          '@type': 'HowToSupply',
          name: device.productId,
        })),
      }
    : null;

  return (
    <>
      <StructuredData id="jsonld-protocol-breadcrumb" data={breadcrumbSchema} />
      {howToSchema ? <StructuredData id="jsonld-protocol-howto" data={howToSchema} /> : null}
      <ProtocolDetailClient slug={slug} />
    </>
  );
}
