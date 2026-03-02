import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ConditionsClient } from './ConditionsClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Conditions',
  description: 'Explore Hylono condition-focused wellness guides with protocol pathways, modality relevance, and research references.',
  path: '/conditions',
});

export default function ConditionsPageRoute() {
  return <ConditionsClient />;
}