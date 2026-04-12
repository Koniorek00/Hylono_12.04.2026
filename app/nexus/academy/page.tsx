import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Academy } from '@/components/partner/Academy';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus academy is a private partner training workspace and remains server-routed with a client leaf for interactive learning, certification, and drill flows.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Academy',
  description:
    'Access the Hylono Nexus Academy for partner training, certification tracking, and clinic onboarding refreshers.',
  path: '/nexus/academy',
  forceNoIndex: true,
});

export default async function NexusAcademyPageRoute() {
  await connection();
  return <Academy />;
}
