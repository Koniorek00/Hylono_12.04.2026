'use client';

import { useRouter } from 'next/navigation';
import { GatedView } from '@/components/GatedView';
import { PartnerPortal } from '@/components/PartnerPortal';

export function PartnersClient() {
  const router = useRouter();

  return (
    <GatedView
      title="Partner Portal"
      description="The Hylono Partner Portal is exclusively available to verified clinic partners and certified practitioners."
      onRequestLogin={() => router.push('/account')}
    >
      <PartnerPortal />
    </GatedView>
  );
}
