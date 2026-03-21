import type { Metadata } from 'next';
import { connection } from 'next/server';
import { ClientDocs } from '@/components/partner/ClientDocs';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus docs is a private document workspace and remains server-routed with a client leaf for form generation and preview tools.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Documents',
  description:
    'Generate consent forms, intake sheets, and protocol-ready clinic documents inside Hylono Nexus.',
  path: '/nexus/docs',
  forceNoIndex: true,
});

export default async function NexusDocsPageRoute() {
  await connection();
  return <ClientDocs />;
}
