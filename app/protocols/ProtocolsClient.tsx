'use client';

import { useRouter } from 'next/navigation';
import { FeatureGate } from '@/components/FeatureGate';
import { ErrorPage } from '@/components/ErrorPage';
import { ProtocolExplorer } from '@/components/ProtocolExplorer';
import { navigateToPage } from '@/src/lib/navigation';

export function ProtocolsClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    navigateToPage(router, page);
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
