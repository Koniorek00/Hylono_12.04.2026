'use client';

import { useRouter } from 'next/navigation';
import { FeatureGate } from '@/components/FeatureGate';
import { ErrorPage } from '@/components/ErrorPage';
import { ConditionsPage } from '@/components/ConditionsPage';
import { navigateToPage } from '@/src/lib/navigation';

export function ConditionDetailClient({ slug }: { slug: string }) {
  const router = useRouter();

  const navigateTo = (page: string) => {
    navigateToPage(router, page);
  };

  return (
    <FeatureGate
      flag="feature_condition_pages"
      fallback={<ErrorPage type="404" onNavigate={navigateTo} />}
    >
      <ConditionsPage slug={slug} onNavigate={navigateTo} />
    </FeatureGate>
  );
}