'use client';

import { useRouter } from 'next/navigation';
import { CheckoutPage } from '@/components/CheckoutPage';

const toPath = (page: string) => {
  if (page.startsWith('/')) return page;
  return page === 'home' ? '/' : `/${page}`;
};

export function CheckoutClient() {
  const router = useRouter();

  return (
    <CheckoutPage
      onNavigate={(page) => {
        router.push(toPath(page));
        window.scrollTo(0, 0);
      }}
    />
  );
}
