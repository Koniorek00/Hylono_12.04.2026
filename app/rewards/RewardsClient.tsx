'use client';

import { useRouter } from 'next/navigation';
import { GatedView } from '@/components/GatedView';
import { RewardsPage } from '@/components/RewardsPage';
import { navigateToPage, navigateWithScroll } from '@/src/lib/navigation';

interface RewardsClientProps {
  isAuthenticated: boolean;
}

export function RewardsClient({ isAuthenticated }: RewardsClientProps) {
  const router = useRouter();

  return (
    <GatedView
      title="Rewards Program"
      description="Hylono Rewards are exclusive to active system owners and protocol practitioners."
      isAuthenticated={isAuthenticated}
      onRequestLogin={() => navigateWithScroll(router, '/account')}
    >
      <RewardsPage
        onNavigate={(page) => {
          navigateToPage(router, page);
        }}
      />
    </GatedView>
  );
}
