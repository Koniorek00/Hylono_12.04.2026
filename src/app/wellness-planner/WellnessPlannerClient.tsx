'use client';

import { useRouter } from 'next/navigation';
import { ZoneBuilder } from '@/components/ZoneBuilder';

export function WellnessPlannerClient() {
  const router = useRouter();

  return (
    <ZoneBuilder
      onComplete={() => {
        router.push('/store');
        window.scrollTo(0, 0);
      }}
    />
  );
}