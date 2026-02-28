import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { CareersClient } from './CareersClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Careers',
  description: 'Explore open roles at Hylono and help build premium, evidence-oriented wellness technology.',
  path: '/careers',
});

export default function CareersPageRoute() {
  return <CareersClient />;
}
