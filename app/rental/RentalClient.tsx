'use client';

import { useRouter } from 'next/navigation';
import { FeatureGate } from '@/components/FeatureGate';
import { ErrorPage } from '@/components/ErrorPage';
import { RentalLandingPage } from '@/components/RentalLandingPage';
import { navigateToPage } from '@/src/lib/navigation';

export function RentalClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    navigateToPage(router, page);
  };

  return (
    <FeatureGate
      flag="feature_rental_landing"
      fallback={<ErrorPage type="404" onNavigate={navigateTo} />}
    >
      <RentalLandingPage onNavigate={navigateTo} />
    </FeatureGate>
  );
}
