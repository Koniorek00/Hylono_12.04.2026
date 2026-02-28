import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { OnboardingClient } from './OnboardingClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createPageMetadata({
  title: 'Onboarding',
  description: 'Follow your Hylono onboarding checklist to complete setup and begin your first protocol sessions.',
  path: '/onboarding',
});

export default function OnboardingPageRoute() {
  return <OnboardingClient />;
}
