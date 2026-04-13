'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StorePage as StorePageView } from '@/components/StorePage';
import {
  buildPlannerSearchParams,
  parsePlannerSearchParams,
  summarizePlannerSelection,
} from '@/lib/planner-state';
import { navigateWithScroll, toAppPath } from '@/src/lib/navigation';
import { TechType } from '@/types';

export function StoreClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plannerState = useMemo(() => parsePlannerSearchParams(searchParams), [searchParams]);

  const navigateFromStore = (href: string) => {
    if (typeof window !== 'undefined') {
      window.location.assign(href);
      return;
    }

    navigateWithScroll(router, href);
  };

  const navigateTo = (page: string) => {
    navigateFromStore(toAppPath(page));
  };

  const productHrefForTech = (tech: TechType) => {
    const productPath = `/product/${tech.toLowerCase()}`;
    if (!plannerState) {
      return productPath;
    }

    const params = buildPlannerSearchParams(plannerState);
    const query = params.toString();
    return query ? `${productPath}?${query}` : productPath;
  };

  return (
    <StorePageView
      onNavigate={navigateTo}
      onSelectTech={(tech: TechType) => {
        navigateFromStore(productHrefForTech(tech));
      }}
      onNavigateChambers={() => {
        navigateFromStore(productHrefForTech(TechType.HBOT));
      }}
      productHrefForTech={productHrefForTech}
      plannerSummaryLines={plannerState ? summarizePlannerSelection(plannerState).slice(0, 3) : []}
    />
  );
}
