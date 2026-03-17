'use client';

import { useRouter } from 'next/navigation';
import { StorePage as StorePageView } from '@/components/StorePage';
import { navigateToPage, navigateWithScroll } from '@/src/lib/navigation';
import { TechType } from '@/types';

export function StoreClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    navigateToPage(router, page);
  };

  return (
    <StorePageView
      onNavigate={navigateTo}
      onSelectTech={(tech: TechType) => {
        navigateWithScroll(router, `/product/${tech.toLowerCase()}`);
      }}
      onNavigateChambers={() => {
        navigateWithScroll(router, '/product/hbot');
      }}
    />
  );
}