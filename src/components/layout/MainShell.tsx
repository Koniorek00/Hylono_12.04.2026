'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  shouldHideBreadcrumbs,
  shouldUseAppShellRoute,
} from '@/src/components/layout/RouteChrome';

interface MainShellProps {
  children: ReactNode;
}

export function MainShell({ children }: MainShellProps) {
  const pathname = usePathname() ?? '';
  if (shouldUseAppShellRoute(pathname)) {
    return (
      <main id="main-content" tabIndex={-1} className="relative z-0">
        {children}
      </main>
    );
  }

  const topOffsetClass = shouldHideBreadcrumbs(pathname) ? 'pt-[72px] md:pt-[104px]' : '';

  return (
    <main id="main-content" tabIndex={-1} className={`relative z-0 ${topOffsetClass}`}>
      {children}
    </main>
  );
}
