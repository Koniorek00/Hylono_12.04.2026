'use client';

import { useRouter } from 'next/navigation';
import { RewardsPage } from '@/components/RewardsPage';
import { navigateToPage, navigateWithScroll } from '@/src/lib/navigation';

interface RewardsClientProps {
  isAuthenticated: boolean;
}

export function RewardsClient({ isAuthenticated }: RewardsClientProps) {
  const router = useRouter();

  return (
    <RewardsPage
      isAuthenticated={isAuthenticated}
      onNavigate={(page) => {
        if (page === 'account') {
          navigateWithScroll(router, '/account');
          return;
        }

        navigateToPage(router, page);
      }}
    />
  );
}
