import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { BlogArticleClient } from './BlogArticleClient';

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
  const title = formatSlugTitle(slug);

  return createPageMetadata({
    title: `${title} | Blog`,
    description: `Read the latest Hylono insights and guidance for ${title}.`,
    path: `/blog/${slug}`,
  });
}

export default async function BlogArticlePageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <BlogArticleClient slug={slug} />;
}
