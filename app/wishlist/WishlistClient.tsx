'use client';

import { useRouter } from 'next/navigation';
import { WishlistPage } from '@/components/Wishlist';
import { navigateToPage } from '@/src/lib/navigation';

export function WishlistClient() {
  const router = useRouter();

  return (
    <WishlistPage
      onNavigate={(page) => {
        navigateToPage(router, page);
      }}
    />
  );
}
