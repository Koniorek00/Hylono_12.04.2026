'use client';

import { useRouter } from 'next/navigation';
import { FeatureGate } from '@/components/FeatureGate';
import { ErrorPage } from '@/components/ErrorPage';
import { ConditionsPage } from '@/components/ConditionsPage';

const toPath = (page: string) => {
  if (page.startsWith('/')) return page;
  return page === 'home' ? '/' : `/${page}`;
};

export function ConditionDetailClient({ slug }: { slug: string }) {
  const router = useRouter();

  const navigateTo = (page: string) => {
    router.push(toPath(page));
    window.scrollTo(0, 0);
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