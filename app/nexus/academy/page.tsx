import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Academy } from '@/components/partner/Academy';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus academy is a private partner training surface and remains server-routed with a client leaf for future learning interactions.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Academy',
  description:
    'Access Hylono Nexus training modules, certification pathways, and clinic onboarding education.',
  path: '/nexus/academy',
  forceNoIndex: true,
});

export default async function NexusAcademyPageRoute() {
  await connection();
  return <Academy />;
}
