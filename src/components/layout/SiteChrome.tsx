'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/src/components/layout/Footer';
import { Header } from '@/src/components/layout/Header';
import { MainShell } from '@/src/components/layout/MainShell';
import { RouteBreadcrumbs } from '@/src/components/layout/RouteBreadcrumbs';
import { shouldUseAppShellRoute } from '@/src/components/layout/RouteChrome';

interface SiteChromeProps {
  children: ReactNode;
}

export function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname() ?? '';

  if (shouldUseAppShellRoute(pathname)) {
    return <MainShell>{children}</MainShell>;
  }

  return (
    <>
      <Header />
      <RouteBreadcrumbs />
      <MainShell>{children}</MainShell>
      <Footer />
    </>
  );
}
