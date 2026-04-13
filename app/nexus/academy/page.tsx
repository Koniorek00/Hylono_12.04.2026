import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Academy } from '@/components/partner/Academy';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus academy stays server-routed as a temporary public preview while the build-in-progress training workspace remains noindex and interactive behavior stays in a client leaf.]

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Academy',
  description:
    'Preview the Hylono Nexus Academy for partner training, certification tracking, and clinic onboarding refreshers while the build is in progress.',
  path: '/nexus/academy',
  forceNoIndex: true,
});

export default async function NexusAcademyPageRoute() {
  await connection();
  return <Academy />;
}
