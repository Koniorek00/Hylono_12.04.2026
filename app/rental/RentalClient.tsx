'use client';

import { useRouter } from 'next/navigation';
import { FeatureGate } from '@/components/FeatureGate';
import { ErrorPage } from '@/components/ErrorPage';
import { RentalLandingPage } from '@/components/RentalLandingPage';

const toPath = (page: string) => {
  if (page.startsWith('/')) return page;
  return page === 'home' ? '/' : `/${page}`;
};

export function RentalClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    router.push(toPath(page));
    window.scrollTo(0, 0);
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
