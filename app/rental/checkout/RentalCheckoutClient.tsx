'use client';

import { useRouter } from 'next/navigation';
import { RentalCheckoutPage } from '@/components/RentalCheckoutPage';
import { navigateToPage } from '@/src/lib/navigation';

export function RentalCheckoutClient() {
  const router = useRouter();

  return (
    <RentalCheckoutPage
      onNavigate={(page) => {
        navigateToPage(router, page);
      }}
    />
  );
}
