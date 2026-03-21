import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { conditionGoalBySlug, conditionGoals } from '@/content/conditions';
import { evidence } from '@/content/evidence';
import { protocolBySlug } from '@/content/protocols';
import { siteOwnership } from '@/content/site-entity';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import {
  createBreadcrumbSchema,
  createFaqSchema,
  createMedicalWebPageSchema,
  SCHEMA_DATE_MODIFIED,
} from '@/lib/seo-schema';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
import StructuredData from '@/src/components/StructuredData';
import { ConditionDetailClient } from './ConditionDetailClient';

const MODALITY_SLUG_TO_PRODUCT_ROUTE: Record<string, string> = {
  HBOT: 'hbot',
  H2: 'hydrogen',
  RLT: 'rlt',
  PEMF: 'pemf',
};

const MODALITY_SLUG_TO_PRODUCT_NAME: Record<string, string> = {
  HBOT: 'Hylono HBOT',
  H2: 'Hylono Hydrogen',
  RLT: 'Hylono PBM / Red Light',
  PEMF: 'Hylono PEMF + VNS',
};

const resolveConditionSlug = (rawSlug: string) => {
  const canonicalSlug = rawSlug.toLowerCase();
  if (rawSlug !== canonicalSlug && conditionGoalBySlug[canonicalSlug]) {
    permanentRedirect(`/conditions/${canonicalSlug}`);
  }

  return canonicalSlug;
};

export function generateStaticParams() {
  return conditionGoals.map((goal) => ({
    slug: goal.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = resolveConditionSlug(rawSlug);
  const goal = conditionGoalBySlug[slug];

  if (!goal) {
    notFound();
  }

  return createPageMetadata({
    title: `${goal.title} | Technologies, Protocols and Research`,
    description: `Compare technologies, protocol options, evidence notes, and practical considerations for ${goal.title.toLowerCase()}.`,
    path: `/conditions/${slug}`,
  });
}

// [DECISION: ISR because condition detail pages are content-driven and update periodically.]
export default async function ConditionDetailPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = resolveConditionSlug(rawSlug);
  const goal = conditionGoalBySlug[slug];

  if (!goal) {
    notFound();
  }

  const faqItems = goal.faq.map((item) => ({
    answer: item.a,
    question: item.q,
  }));
  const medicalConditionSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    '@id': `${SITE_URL}/conditions/${slug}#condition`,
    name: goal.title,
    description: goal.subtitle,
    url: `${SITE_URL}/conditions/${slug}`,
    inLanguage: 'en',
    relevantSpecialty: 'https://schema.org/Wellness',
    possibleTreatment: goal.modalities.map((m) => {
      const productSlug = MODALITY_SLUG_TO_PRODUCT_ROUTE[m.slug];
      return {
        '@type': 'MedicalTherapy',
        name: m.name,
        ...(productSlug
          ? {
              url: `${SITE_URL}/product/${productSlug}`,
              medicineSystem: 'https://schema.org/WesternConventional',
              recognizingAuthority: { '@id': `${SITE_URL}/#organization` },
            }
          : {}),
      };
    }),
    associatedAnatomy: { '@type': 'AnatomicalSystem', name: 'Whole Body Wellness' },
  };
  const conditionWebPageSchema = createMedicalWebPageSchema({
    name: `${goal.title} Wellness Guide`,
    description: goal.subtitle,
    abstract: goal.subtitle,
    path: `/conditions/${slug}`,
    about: [goal.title, ...goal.modalities.map((m) => m.name)],
    citations: goal.evidenceIds
      .map((id) => evidence.find((e) => e.id === id))
      .filter((ev): ev is NonNullable<typeof ev> => Boolean(ev))
      .map((ev) => ({
        title: ev.title,
        url: ev.sourceUrl,
        doi: ev.doi,
        year: ev.year,
        authors: ev.authors,
      })),
    reviewedByName: siteOwnership.research.team,
    speakableSelectors: ['#condition-intro'],
    dateModified: SCHEMA_DATE_MODIFIED,
    lastReviewed: SCHEMA_DATE_MODIFIED,
    mainEntity: faqItems.length > 0 ? { '@id': `${SITE_URL}/conditions/${slug}#faq` } : undefined,
  });

  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id="jsonld-condition-entity" data={medicalConditionSchema} />
        <StructuredData
          id="jsonld-condition-page"
          data={{
            ...conditionWebPageSchema,
            about: [
              { '@type': 'MedicalCondition', '@id': `${SITE_URL}/conditions/${slug}#condition`, name: goal.title },
              ...goal.modalities.map((m) => {
                const productSlug = MODALITY_SLUG_TO_PRODUCT_ROUTE[m.slug];
                return productSlug
                  ? { '@type': 'Product', '@id': `${SITE_URL}/product/${productSlug}#product`, name: MODALITY_SLUG_TO_PRODUCT_NAME[m.slug] ?? m.name, url: `${SITE_URL}/product/${productSlug}` }
                  : { '@type': 'DefinedTerm', name: m.name };
              }),
            ],
            keywords: [goal.title, ...goal.modalities.map((m) => m.name)].join(', '),
            audience: {
              '@type': 'MedicalAudience',
              audienceType: 'Patient',
              healthCondition: {
                '@type': 'MedicalCondition',
                name: goal.title,
              },
            },
            mentions: [
              ...goal.modalities
                .filter((m) => Boolean(MODALITY_SLUG_TO_PRODUCT_ROUTE[m.slug]))
                .map((m) => {
                  const routeSlug = MODALITY_SLUG_TO_PRODUCT_ROUTE[m.slug]!;
                  return {
                    '@type': 'Product',
                    '@id': `${SITE_URL}/product/${routeSlug}#product`,
                    url: `${SITE_URL}/product/${routeSlug}`,
                    name: MODALITY_SLUG_TO_PRODUCT_NAME[m.slug] ?? `Hylono ${m.shortName}`,
                  };
                }),
              ...goal.protocolSlugs.map((s) => ({
                '@type': 'HowTo',
                '@id': `${SITE_URL}/protocols/${s}#howto`,
                url: `${SITE_URL}/protocols/${s}`,
                name: protocolBySlug[s]?.title ?? s,
              })),
            ],
            relatedLink: [
              `${SITE_URL}/conditions`,
              `${SITE_URL}/research`,
              ...goal.protocolSlugs.map((s) => `${SITE_URL}/protocols/${s}`),
            ],
          }}
        />
        {faqItems.length > 0 && (
          <StructuredData id="jsonld-condition-faq" data={createFaqSchema(faqItems, `/conditions/${slug}`, `${goal.title} FAQ`)} />
        )}
        <StructuredData
          id="jsonld-condition-breadcrumb"
          data={createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Conditions', path: '/conditions' },
            { name: goal.title, path: `/conditions/${slug}` },
          ])}
        />
      </Suspense>
      <ConditionDetailClient slug={slug} />
    </>
  );
}
