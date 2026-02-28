'use client';

import { useRouter } from 'next/navigation';
import { StorePage as StorePageView } from '@/components/StorePage';
import { TechType } from '@/types';

export function StoreClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    router.push(page === 'home' ? '/' : `/${page}`);
    window.scrollTo(0, 0);
  };

  return (
    <StorePageView
      onNavigate={navigateTo}
      onSelectTech={(tech: TechType) => {
        router.push(`/product/${tech.toLowerCase()}`);
        window.scrollTo(0, 0);
      }}
      onNavigateChambers={() => {
        router.push('/product/hbot');
        window.scrollTo(0, 0);
      }}
    />
  );
}