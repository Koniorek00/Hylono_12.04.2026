import type { Metadata } from 'next';
import { DashboardHome } from '@/components/partner/DashboardHome';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus landing stays server-rendered as a static, public, noindex operator overview so the route can explain the workspace clearly while deeper modules stay interactive in client leaves.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus',
  description:
    'Explore the Hylono Nexus workspace for clinic operations, fleet health, documents, training, and partner workflows.',
  path: '/nexus',
  forceNoIndex: true,
});

export default function NexusPageRoute() {
  return <DashboardHome />;
}
