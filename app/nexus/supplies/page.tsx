import type { Metadata } from 'next';
import { connection } from 'next/server';
import { SupplyShop } from '@/components/partner/SupplyShop';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus supplies stays server-routed as a temporary public preview while the build-in-progress reordering workspace remains noindex and interactive behavior stays in a client leaf.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Supplies',
  description:
    'Preview clinic consumables, accessories, and upgrade parts from the Hylono Nexus supplies workspace while the build is in progress.',
  path: '/nexus/supplies',
  forceNoIndex: true,
});

export default async function NexusSuppliesPageRoute() {
  await connection();
  return <SupplyShop />;
}
