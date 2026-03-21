import type { TechType } from '../../types';

export interface RouterPushLike {
  push: (href: string, options?: { scroll?: boolean }) => void;
}

type NavigationContext = 'default' | 'footer';

interface ResolveLegacyPagePathOptions {
  context?: NavigationContext;
  tech?: TechType;
}

const DEFAULT_PAGE_ALIASES: Record<string, string> = {
  home: '/',
  advisors: '/contact',
  builder: '/wellness-planner',
  product: '/store',
  videos: '/learning',
  referral: '/rewards',
  financing: '/checkout',
  'trade-in': '/returns',
  'press-kit': '/press',
  sitemap: '/',
};

const FOOTER_OVERRIDES: Record<string, string | null> = {
  sitemap: '/sitemap.xml',
};

const normalizePage = (page: string): string => page.trim().replace(/^\/+/, '').toLowerCase();

export const resolveLegacyPagePath = (
  page: string,
  options: ResolveLegacyPagePathOptions = {}
): string | null => {
  const normalized = normalizePage(page);

  if (!normalized || normalized === 'home') {
    return '/';
  }

  if (normalized === 'detail' && options.tech) {
    return `/product/${options.tech.toLowerCase()}`;
  }

  if (normalized === 'tech' || normalized === 'detail') {
    return '/store';
  }

  if (options.context === 'footer') {
    const footerOverride = FOOTER_OVERRIDES[normalized];
    if (footerOverride !== undefined) {
      return footerOverride;
    }
  }

  const alias = DEFAULT_PAGE_ALIASES[normalized];
  if (alias) {
    return alias;
  }

  return `/${normalized}`;
};

export const toAppPath = (page: string): string => {
  if (page.startsWith('/')) return page;
  return resolveLegacyPagePath(page) ?? '/';
};

export const getCurrentPageFromPathname = (pathname: string): string => {
  if (!pathname || pathname === '/') {
    return 'home';
  }

  const [firstSegment] = pathname.replace(/^\//, '').split('/');
  return firstSegment || 'home';
};

export const navigateWithScroll = (router: RouterPushLike, href: string): void => {
  router.push(href, { scroll: true });
};

export const navigateToPage = (router: RouterPushLike, page: string): void => {
  navigateWithScroll(router, toAppPath(page));
};
