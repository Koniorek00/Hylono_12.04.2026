import type { Metadata } from 'next';
import { WellnessPlannerClient } from './WellnessPlannerClient';

export const metadata: Metadata = {
  title: 'Wellness Planner',
  description:
    'Build a guided therapy stack based on your goals, budget, and available space.',
};

export default function WellnessPlannerPage() {
  return <WellnessPlannerClient />;
}