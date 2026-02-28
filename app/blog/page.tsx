import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { BlogClient } from './BlogClient';

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: 'Blog',
  description: 'Explore Hylono insights, research-backed wellness articles, and practical protocol guidance.',
  path: '/blog',
});

export default function BlogPageRoute() {
  return <BlogClient />;
}
