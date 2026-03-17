'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/src/components/navigation/Breadcrumbs';

const shouldHideBreadcrumbs = (pathname: string): boolean => {
  if (!pathname || pathname === '/') {
    return true;
  }

  const rootSegment = pathname.split('/').filter(Boolean)[0] ?? '';
  return rootSegment === 'partner' || rootSegment === 'meridian';
};

export function RouteBreadcrumbs() {
  const pathname = usePathname();

  if (!pathname || shouldHideBreadcrumbs(pathname)) {
    return null;
  }

  const pathParts = pathname.split('/').filter(Boolean);

  return (
    <>
      <div className="h-[68px] md:h-[72px]" />
      <div className="sticky top-[68px] z-40 py-2.5 md:top-[72px] transition-all duration-500 ease-out">
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-slate-200" />
        <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-b from-transparent to-slate-100/50 pointer-events-none" />
        <div className="relative">
          <Breadcrumbs pathParts={pathParts} />
        </div>
      </div>
    </>
  );
}
