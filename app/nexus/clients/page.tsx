import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Nexus } from '@/components/partner/Nexus';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus clients is a private clinic CRM surface rendered server-first with a client module for filtering and record interaction.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Clients',
  description:
    'Review client records, session history, and protocol adherence inside the Hylono Nexus clinic workspace.',
  path: '/nexus/clients',
  forceNoIndex: true,
});

export default async function NexusClientsPageRoute() {
  await connection();
  return <Nexus />;
}
