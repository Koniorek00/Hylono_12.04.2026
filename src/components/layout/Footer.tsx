'use client';

import { useRouter } from 'next/navigation';
import { Footer as LegacyFooter } from '../../../components/Layout';
import { TechType, type NavigateFunction } from '../../../types';

const mapFooterTargetToHref = (page: string, tech?: TechType): string | null => {
  if (!page || page === 'home') return '/';

  if (page === 'detail' && tech) {
    return `/product/${tech.toLowerCase()}`;
  }

  switch (page) {
    case 'videos':
      return '/learning';
    case 'referral':
      return '/rewards';
    case 'financing':
      return '/checkout';
    case 'trade-in':
      return '/returns';
    case 'press-kit':
      return '/press';
    case 'sitemap':
      return '/sitemap.xml';
    // Missing dedicated pages in app router; keep neutral (no navigation)
    case 'advisors':
    case 'testimonials':
    case 'wholesale':
    case 'disclaimer':
    case 'accessibility':
      return null;
    default:
      return `/${page}`;
  }
};

export function Footer() {
  const router = useRouter();

  const handleNavigate: NavigateFunction = (page, tech) => {
    const href = mapFooterTargetToHref(page, tech);
    if (href) {
      router.push(href);
    }
  };

  return <LegacyFooter setCurrentPage={handleNavigate} />;
}
