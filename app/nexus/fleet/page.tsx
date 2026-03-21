import type { Metadata } from 'next';
import { connection } from 'next/server';
import { FleetHealth } from '@/components/partner/FleetHealth';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus fleet is an authenticated operational dashboard and stays server-routed with a client leaf for service-log interactions.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Fleet',
  description:
    'Track device status, maintenance logs, and service health across the Hylono clinic fleet.',
  path: '/nexus/fleet',
  forceNoIndex: true,
});

export default async function NexusFleetPageRoute() {
  await connection();
  return <FleetHealth />;
}
