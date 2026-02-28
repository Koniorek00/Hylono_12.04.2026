'use client';

import { useRouter } from 'next/navigation';
import { RentalCheckoutPage } from '@/components/RentalCheckoutPage';

const toPath = (page: string) => {
  if (page.startsWith('/')) return page;
  return page === 'home' ? '/' : `/${page}`;
};

export function RentalCheckoutClient() {
  const router = useRouter();

  return (
    <RentalCheckoutPage
      onNavigate={(page) => {
        router.push(toPath(page));
        window.scrollTo(0, 0);
      }}
    />
  );
}
