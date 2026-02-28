import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ResearchClient } from './ResearchClient';

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: 'Research',
  description: 'Review research insights, evidence summaries, and science-driven wellness resources from Hylono.',
  path: '/research',
});

export default function ResearchPageRoute() {
  return <ResearchClient />;
}
