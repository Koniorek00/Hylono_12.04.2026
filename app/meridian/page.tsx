import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { MeridianClient } from './MeridianClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Meridian',
  description: 'Explore Hylono Meridian: the integrated access architecture for regenerative wellness modalities.',
  path: '/meridian',
  forceNoIndex: true,
});

// [DECISION: SSG because this route is static product/editorial content.]
export default function MeridianPageRoute() {
  return <MeridianClient />;
}
