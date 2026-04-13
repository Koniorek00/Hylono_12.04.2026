import type { Metadata } from 'next';
import { connection } from 'next/server';
import { ClientDocs } from '@/components/partner/ClientDocs';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus docs stays server-routed as a temporary public preview while the build-in-progress document workspace remains noindex and interactive behavior stays in a client leaf.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Documents',
  description:
    'Preview consent forms, intake sheets, and protocol-ready clinic documents inside Hylono Nexus while the build is in progress.',
  path: '/nexus/docs',
  forceNoIndex: true,
});

export default async function NexusDocsPageRoute() {
  await connection();
  return <ClientDocs />;
}
