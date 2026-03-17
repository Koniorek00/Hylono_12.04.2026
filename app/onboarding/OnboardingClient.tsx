'use client';

import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { navigateWithScroll } from '@/src/lib/navigation';

export function OnboardingClient() {
  const router = useRouter();

  return (
    <OnboardingFlow
      onComplete={() => {
        navigateWithScroll(router, '/');
      }}
    />
  );
}
