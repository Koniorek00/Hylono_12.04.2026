import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { CareersClient } from './CareersClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Careers',
  description: 'Explore open roles at Hylono and help build premium, evidence-oriented wellness technology.',
  path: '/careers',
  forceNoIndex: true,
});

// [DECISION: noindex because the current careers page is still placeholder hiring content and should remain directly accessible without being promoted as launch-ready.]
export default function CareersPageRoute() {
  return <CareersClient />;
}
