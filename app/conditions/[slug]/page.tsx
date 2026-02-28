import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ConditionDetailClient } from './ConditionDetailClient';

export const revalidate = 3600;

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
  const goalTitle = formatSlugTitle(slug);

  return createPageMetadata({
    title: `${goalTitle} Wellness Guide | Hylono`,
    description: `Explore Hylono's ${goalTitle} wellness guide with protocol pathways and evidence-informed technologies designed to support wellbeing.`,
    path: `/conditions/${slug}`,
  });
}

export default async function ConditionDetailPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ConditionDetailClient slug={slug} />;
}