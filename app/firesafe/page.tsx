import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { FiresafeClient } from './FiresafeClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Firesafe',
  description: 'Discover Firesafe oxygen therapy firebreak solutions for clinical and home care environments.',
  path: '/firesafe',
});

export default function FiresafePageRoute() {
  return <FiresafeClient />;
}
