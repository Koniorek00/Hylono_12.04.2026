import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { createPageMetadata } from '@/lib/seo-metadata';
import { PartnersClient } from './PartnersClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Partners',
  description: 'Partner with Hylono as a clinic, distributor, or integrator and access dedicated growth support.',
  path: '/partners',
  forceNoIndex: true,
});

// [DECISION: SSG because partner program overview is static business information.]
export default async function PartnersPageRoute() {
  const session = await auth();

  return <PartnersClient isAuthenticated={Boolean(session?.user?.email)} />;
}
