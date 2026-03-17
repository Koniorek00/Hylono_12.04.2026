'use client';

import { useRouter } from 'next/navigation';
import { ZoneBuilder } from '@/components/ZoneBuilder';
import { navigateWithScroll } from '@/src/lib/navigation';

export function WellnessPlannerClient() {
  const router = useRouter();

  return (
    <ZoneBuilder
      onComplete={() => {
        navigateWithScroll(router, '/store');
      }}
    />
  );
}