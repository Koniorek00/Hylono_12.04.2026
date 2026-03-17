'use client';

import { useRouter } from 'next/navigation';
import { CheckoutPage } from '@/components/CheckoutPage';
import { navigateToPage } from '@/src/lib/navigation';

export function CheckoutClient() {
  const router = useRouter();

  return (
    <CheckoutPage
      onNavigate={(page) => {
        navigateToPage(router, page);
      }}
    />
  );
}
