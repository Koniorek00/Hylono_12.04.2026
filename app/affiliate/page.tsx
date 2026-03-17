import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { AffiliateClient } from './AffiliateClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Affiliate Program',
  description: 'Apply to partner with Hylono and earn commissions by sharing premium bio-optimization technology.',
  path: '/affiliate',
  forceNoIndex: true,
});

// [DECISION: SSG because affiliate program details are static marketing content.]
export default function AffiliatePageRoute() {
  return <AffiliateClient />;
}
