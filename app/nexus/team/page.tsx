import type { Metadata } from 'next';
import { connection } from 'next/server';
import { TeamDashboard } from '@/components/partner/TeamDashboard';
import { createPageMetadata } from '@/lib/seo-metadata';

// [DECISION: nexus team is a private staff-management dashboard rendered server-first with a client leaf for interactive team controls.]
// Rendering strategy: request-time server routing via `connection()` keeps the workspace session-aware while the interactive dashboard remains in a client leaf.

export const metadata: Metadata = createPageMetadata({
  title: 'Nexus Team',
  description:
    'Monitor staff progress, certifications, and clinic compliance tasks in the Hylono Nexus team dashboard.',
  path: '/nexus/team',
  forceNoIndex: true,
});

export default async function NexusTeamPageRoute() {
  await connection();
  return <TeamDashboard />;
}
