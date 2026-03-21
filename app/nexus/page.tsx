import type { Metadata } from 'next';
import { connection } from 'next/server';
import { DashboardHome } from '@/components/partner/DashboardHome';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus dashboard is request-aware partner workspace UI and remains server-routed with a client leaf for session-gated operations.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus',
  description:
    'Access the Hylono Nexus workspace for clinic operations, training, fleet health, and partner resources.',
  path: '/nexus',
  forceNoIndex: true,
});

export default async function NexusPageRoute() {
  await connection();
  return <DashboardHome />;
}
