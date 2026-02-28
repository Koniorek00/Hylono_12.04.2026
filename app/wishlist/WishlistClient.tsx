'use client';

import { useRouter } from 'next/navigation';
import { WishlistPage } from '@/components/Wishlist';

const toPath = (page: string) => {
  if (page.startsWith('/')) return page;
  return page === 'home' ? '/' : `/${page}`;
};

export function WishlistClient() {
  const router = useRouter();

  return (
    <WishlistPage
      onNavigate={(page) => {
        router.push(toPath(page));
        window.scrollTo(0, 0);
      }}
    />
  );
}
