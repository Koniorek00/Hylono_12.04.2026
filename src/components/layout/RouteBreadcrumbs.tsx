'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/src/components/navigation/Breadcrumbs';
import {
  shouldHideBreadcrumbs,
  shouldShowBreadcrumbPageNavigator,
} from '@/src/components/layout/RouteChrome';

export function RouteBreadcrumbs() {
  const pathname = usePathname();
  const breadcrumbRef = useRef<HTMLDivElement | null>(null);
  const hideBreadcrumbs = !pathname || shouldHideBreadcrumbs(pathname);
  const showPageNavigator = pathname ? shouldShowBreadcrumbPageNavigator(pathname) : false;

  const pathParts = pathname?.split('/').filter(Boolean) ?? [];
  const breadcrumbOffset =
    'calc(var(--route-header-offset, var(--route-header-height, 72px)) - 1px)';
  const breadcrumbSpacerHeight =
    'calc(var(--route-header-height, 72px) + var(--route-breadcrumb-height, 56px) - 1px)';

  useEffect(() => {
    const root = document.documentElement;
    let animationFrameId: number | null = null;

    if (hideBreadcrumbs) {
      root.style.setProperty('--route-breadcrumb-height', '0px');
      return () => {
        root.style.setProperty('--route-breadcrumb-height', '0px');
      };
    }

    const syncBreadcrumbHeight = () => {
      const measuredHeight = breadcrumbRef.current?.offsetHeight ?? 0;
      const nextHeight = `${measuredHeight}px`;

      if (root.style.getPropertyValue('--route-breadcrumb-height') !== nextHeight) {
        root.style.setProperty('--route-breadcrumb-height', nextHeight);
      }
    };

    const scheduleSync = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = window.requestAnimationFrame(() => {
        syncBreadcrumbHeight();
        animationFrameId = null;
      });
    };

    scheduleSync();

    const observer =
      typeof ResizeObserver !== 'undefined' && breadcrumbRef.current
        ? new ResizeObserver(() => scheduleSync())
        : null;

    if (observer && breadcrumbRef.current) {
      observer.observe(breadcrumbRef.current);
    }

    window.addEventListener('resize', scheduleSync);

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      observer?.disconnect();
      window.removeEventListener('resize', scheduleSync);
      root.style.setProperty('--route-breadcrumb-height', '0px');
    };
  }, [hideBreadcrumbs, pathname]);

  if (hideBreadcrumbs) {
    return null;
  }

  return (
    <>
      <div aria-hidden="true" style={{ height: breadcrumbSpacerHeight }} />
      <div
        ref={breadcrumbRef}
        className="fixed left-0 right-0 z-40 py-2.5"
        style={{ top: breadcrumbOffset }}
      >
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-slate-200" />
        <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-b from-transparent to-slate-100/50 pointer-events-none" />
        <div className="relative">
          <Breadcrumbs pathParts={pathParts} showPageNavigator={showPageNavigator} />
        </div>
      </div>
    </>
  );
}
