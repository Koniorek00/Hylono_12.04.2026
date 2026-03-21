import type { Metadata } from 'next';
import { connection } from 'next/server';
import { SupplyShop } from '@/components/partner/SupplyShop';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus supplies is a private reordering workspace and remains server-routed with a client leaf for future commerce interactions.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Supplies',
  description:
    'Reorder clinic consumables, accessories, and upgrade parts from the Hylono Nexus supplies workspace.',
  path: '/nexus/supplies',
  forceNoIndex: true,
});

export default async function NexusSuppliesPageRoute() {
  await connection();
  return <SupplyShop />;
}
