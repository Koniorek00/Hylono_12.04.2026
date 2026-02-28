'use client';

import { useRouter } from 'next/navigation';
import { GatedView } from '@/components/GatedView';
import { RewardsPage } from '@/components/RewardsPage';

const toPath = (page: string) => {
  if (page.startsWith('/')) return page;
  return page === 'home' ? '/' : `/${page}`;
};

export function RewardsClient() {
  const router = useRouter();

  return (
    <GatedView
      title="Rewards Program"
      description="Hylono Rewards are exclusive to active system owners and protocol practitioners."
      onRequestLogin={() => router.push('/account')}
    >
      <RewardsPage
        onNavigate={(page) => {
          router.push(toPath(page));
          window.scrollTo(0, 0);
        }}
      />
    </GatedView>
  );
}
