'use client';

import { useRouter } from 'next/navigation';
import { FeatureGate } from '@/components/FeatureGate';
import { ErrorPage } from '@/components/ErrorPage';
import { ProtocolExplorer } from '@/components/ProtocolExplorer';

const toPath = (page: string) => {
  if (page.startsWith('/')) return page;
  return page === 'home' ? '/' : `/${page}`;
};

export function ProtocolDetailClient({ slug }: { slug: string }) {
  const router = useRouter();

  const navigateTo = (page: string) => {
    router.push(toPath(page));
    window.scrollTo(0, 0);
  };

  return (
    <FeatureGate
      flag="feature_protocols_detail"
      fallback={<ErrorPage type="404" onNavigate={navigateTo} />}
    >
      <ProtocolExplorer slug={slug} onNavigate={navigateTo} />
    </FeatureGate>
  );
}
