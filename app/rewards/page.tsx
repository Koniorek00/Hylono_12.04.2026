import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { createPageMetadata } from '@/lib/seo-metadata';
import { RewardsClient } from './RewardsClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Rewards',
  description: 'Join Hylono rewards to earn referral credits and loyalty points as you progress your wellness journey.',
  path: '/rewards',
  forceNoIndex: true,
});

// [DECISION: keep the rewards route request-time because auth() makes the page user-state aware under Next.js 16 cache components without an explicit dynamic export, while the public preview should remain visible for unauthenticated visitors.]
// Rendering strategy: request-time server route that checks session state and serves a noindex rewards preview with authenticated navigation handled in the client leaf.
export default async function RewardsPageRoute() {
  const session = await auth();

  return <RewardsClient isAuthenticated={Boolean(session?.user?.email)} />;
}
