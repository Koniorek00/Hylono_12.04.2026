import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { RewardsClient } from './RewardsClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Rewards',
  description: 'Join Hylono rewards to earn referral credits and loyalty points as you progress your wellness journey.',
  path: '/rewards',
  forceNoIndex: true,
});

// [DECISION: SSR because rewards visibility can depend on authenticated user state.]
export default function RewardsPageRoute() {
  return <RewardsClient />;
}
