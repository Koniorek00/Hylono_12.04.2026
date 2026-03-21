const PAGE_NAVIGATOR_HIDDEN_SEGMENTS = new Set(['contact', 'help']);

export const shouldUseAppShellRoute = (pathname: string): boolean => {
  const rootSegment = pathname.split('/').filter(Boolean)[0] ?? '';
  return rootSegment === 'nexus';
};

export const shouldHideBreadcrumbs = (pathname: string): boolean => {
  if (!pathname || pathname === '/') {
    return true;
  }

  const rootSegment = pathname.split('/').filter(Boolean)[0] ?? '';
  return rootSegment === 'partner' || rootSegment === 'meridian' || shouldUseAppShellRoute(pathname);
};

export const shouldShowBreadcrumbPageNavigator = (pathname: string): boolean => {
  if (!pathname || shouldHideBreadcrumbs(pathname)) {
    return false;
  }

  const rootSegment = pathname.split('/').filter(Boolean)[0] ?? '';
  return !PAGE_NAVIGATOR_HIDDEN_SEGMENTS.has(rootSegment);
};
