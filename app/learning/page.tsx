import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { LearningClient } from './LearningClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Learning',
  description: 'Access Hylono Academy learning modules, implementation guidance, and practitioner knowledge paths.',
  path: '/learning',
  forceNoIndex: true,
});

// [DECISION: SSG because learning hub landing content is static informational material.]
export default function LearningPageRoute() {
  return <LearningClient />;
}
