import type { Metadata } from 'next';
import { connection } from 'next/server';
import { TeamDashboard } from '@/components/partner/TeamDashboard';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus team stays server-routed as a temporary public preview while the build-in-progress staff dashboard remains noindex and interactive behavior stays in a client leaf.]
// Rendering strategy: request-time server routing via `connection()` keeps the workspace session-aware while the interactive dashboard remains in a client leaf.

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Team',
  description:
    'Preview staff progress, certifications, and clinic compliance tasks in the Hylono Nexus team dashboard while the build is in progress.',
  path: '/nexus/team',
  forceNoIndex: true,
});

export default async function NexusTeamPageRoute() {
  await connection();
  return <TeamDashboard />;
}
