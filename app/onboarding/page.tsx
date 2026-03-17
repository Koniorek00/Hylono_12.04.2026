import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { OnboardingClient } from './OnboardingClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Onboarding',
  description: 'Follow your Hylono onboarding checklist to complete setup and begin your first protocol sessions.',
  path: '/onboarding',
  forceNoIndex: true,
});

// [DECISION: SSR because onboarding flow can depend on user/session context.]
export default function OnboardingPageRoute() {
  return <OnboardingClient />;
}
