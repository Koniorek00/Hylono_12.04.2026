import type { Metadata } from 'next';
import { connection } from 'next/server';
import { PartnerStudio } from '@/components/partner/PartnerStudio';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus studio is an authenticated partner creation tool and remains server-routed with a client leaf for asset and campaign editing.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Studio',
  description:
    'Create clinic-ready marketing assets, branded collateral, and campaign materials inside Hylono Nexus.',
  path: '/nexus/studio',
  forceNoIndex: true,
});

export default async function NexusStudioPageRoute() {
  await connection();
  return <PartnerStudio />;
}
