'use client';

import { useRouter } from 'next/navigation';
import { GatedView } from '@/components/GatedView';
import { AffiliatePage } from '@/components/AffiliatePage';

export function AffiliateClient() {
  const router = useRouter();

  return (
    <GatedView
      title="Affiliate Portal"
      description="The Hylono Affiliate Program is currently by-invitation only for certified bio-optimization experts."
      onRequestLogin={() => router.push('/account')}
    >
      <AffiliatePage />
    </GatedView>
  );
}
