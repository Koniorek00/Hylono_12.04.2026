import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { createPageMetadata } from '@/lib/seo-metadata';
import { PartnersClient } from './PartnersClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Partners',
  description: 'Partner with Hylono as a clinic, distributor, or integrator and access dedicated growth support.',
  path: '/partners',
  forceNoIndex: true,
});

// [DECISION: keep the partner route request-time because auth() makes the page user-state aware under Next.js 16 cache components without an explicit dynamic export, while the public partner overview still needs meaningful HTML for unauthenticated visitors.]
// Rendering strategy: request-time server route that checks session state, then renders a public partner overview with authenticated follow-through handled in the client leaf.
export default async function PartnersPageRoute() {
  const session = await auth();

  return <PartnersClient isAuthenticated={Boolean(session?.user?.email)} />;
}
