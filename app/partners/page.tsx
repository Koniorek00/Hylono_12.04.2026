import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { PartnersClient } from './PartnersClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createPageMetadata({
  title: 'Partners',
  description: 'Partner with Hylono as a clinic, distributor, or integrator and access dedicated growth support.',
  path: '/partners',
});

export default function PartnersPageRoute() {
  return <PartnersClient />;
}
