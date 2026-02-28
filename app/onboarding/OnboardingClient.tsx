'use client';

import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/components/OnboardingFlow';

export function OnboardingClient() {
  const router = useRouter();

  return (
    <OnboardingFlow
      onComplete={() => {
        router.push('/');
        window.scrollTo(0, 0);
      }}
    />
  );
}
