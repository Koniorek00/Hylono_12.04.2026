import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { WellnessPlannerClient } from './WellnessPlannerClient';

// [DECISION: wellness planner route is static shell with interactive client island; cache components/runtime cache behavior is preferred unless server-personalized data is introduced.]

export const metadata: Metadata = createPageMetadata({
  title: 'Wellness Planner',
  description:
    'Build a guided therapy stack based on your goals, budget, and available space.',
  path: '/wellness-planner',
  forceNoIndex: true,
});

export default function WellnessPlannerPage() {
  return <WellnessPlannerClient />;
}
