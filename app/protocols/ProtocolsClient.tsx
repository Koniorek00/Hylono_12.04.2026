'use client';

import { useRouter } from 'next/navigation';
import { FeatureGate } from '@/components/FeatureGate';
import { ErrorPage } from '@/components/ErrorPage';
import { ProtocolExplorer } from '@/components/ProtocolExplorer';

const toPath = (page: string) => {
  if (page.startsWith('/')) return page;
  return page === 'home' ? '/' : `/${page}`;
};

export function ProtocolsClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    router.push(toPath(page));
    window.scrollTo(0, 0);
  };

  return (
    <FeatureGate
      flag="feature_protocols_listing"
      fallback={<ErrorPage type="404" onNavigate={navigateTo} />}
    >
      <ProtocolExplorer onNavigate={navigateTo} />
    </FeatureGate>
  );
}
