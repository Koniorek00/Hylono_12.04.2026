'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '../../../components/Layout';
import { TechType } from '../../../types';

const getCurrentPage = (pathname: string): string => {
  if (!pathname || pathname === '/') return 'home';
  const [first] = pathname.replace(/^\//, '').split('/');
  return first || 'home';
};

const toRoute = (page: string): string => {
  if (!page || page === 'home') return '/';

  const normalized = page.trim().replace(/^\/+/, '');

  // Legacy aliases from pre-migration router
  if (normalized === 'tech' || normalized === 'detail') return '/store';
  if (normalized === 'videos') return '/learning';
  if (normalized === 'referral') return '/rewards';
  if (normalized === 'financing') return '/checkout';
  if (normalized === 'trade-in') return '/returns';
  if (normalized === 'press-kit') return '/press';
  if (normalized === 'disclaimer') return '/terms';
  if (normalized === 'accessibility') return '/support';
  if (normalized === 'sitemap') return '/';

  return `/${normalized}`;
};

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = getCurrentPage(pathname);

  const navigate = (page: string) => {
    router.push(toRoute(page));
    window.scrollTo(0, 0);
  };

  return (
    <Navbar
      setCurrentPage={navigate}
      currentPage={currentPage}
      onSelectTech={(tech: TechType) => {
        router.push(`/product/${tech.toLowerCase()}`);
        window.scrollTo(0, 0);
      }}
      onOpenCart={() => {
        router.push('/checkout');
        window.scrollTo(0, 0);
      }}
      onOpenLogin={() => {
        router.push('/account');
        window.scrollTo(0, 0);
      }}
    />
  );
}
