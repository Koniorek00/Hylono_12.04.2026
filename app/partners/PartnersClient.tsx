'use client';

import { useRouter } from 'next/navigation';
import { PartnerPortal } from '@/components/PartnerPortal';
import { navigateWithScroll } from '@/src/lib/navigation';

interface PartnersClientProps {
  isAuthenticated: boolean;
}

export function PartnersClient({ isAuthenticated }: PartnersClientProps) {
  const router = useRouter();

  return (
    <PartnerPortal
      isAuthenticated={isAuthenticated}
      onRequestAccess={() => navigateWithScroll(router, '/account')}
    />
  );
}
