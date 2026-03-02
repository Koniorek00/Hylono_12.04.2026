import type { Metadata } from 'next';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { TECH_DETAILS } from '@/constants';
import { TechType } from '@/types';
import StructuredData from '@/src/components/StructuredData';
import { ProductClient } from './ProductClient';

type Params = Promise<{ tech: string }>;
const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

const parseTechType = (value: string): TechType | null => {
  const normalized = value.toUpperCase();
  const values = Object.values(TechType) as string[];
  return values.includes(normalized) ? (normalized as TechType) : null;
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { tech } = await params;
  const normalizedTech = tech.toUpperCase();

  return createPageMetadata({
    title: `${normalizedTech} Technology | Hylono`,
    description: `Explore Hylono ${normalizedTech} technology details, practical usage guidance, and evidence-informed benefits designed to support wellbeing goals.`,
    path: `/product/${tech}`,
  });
}

export default async function ProductPageRoute({ params }: { params: Params }) {
  const { tech } = await params;
  const techType = parseTechType(tech);
  const techData = techType ? TECH_DETAILS[techType] : null;
  const canonical = `${SITE_URL}/product/${tech}`;

  const productSchema = techData
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `Hylono ${techData.name}`,
        description: techData.descriptionStandard,
        brand: {
          '@type': 'Brand',
          name: 'Hylono',
        },
        category: 'Wellness Technology',
        url: canonical,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: Number(techData.price.replace(/[^0-9.]/g, '')) || undefined,
          availability:
            techData.inventory.available > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
        },
      }
    : null;

  const medicalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'Hylono',
    url: SITE_URL,
    description:
      'EU medtech wellness platform offering evidence-informed technology programs designed to support wellbeing and recovery routines.',
    areaServed: 'Europe',
  };

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
        name: 'Product',
        item: `${SITE_URL}/product/${tech}`,
      },
    ],
  };

  return (
    <>
      {productSchema ? <StructuredData id="jsonld-product" data={productSchema as any} /> : null}
      <StructuredData id="jsonld-medicalbusiness" data={medicalBusinessSchema as any} />
      <StructuredData id="jsonld-breadcrumb" data={breadcrumbSchema as any} />
      <ProductClient tech={tech} />
    </>
  );
}