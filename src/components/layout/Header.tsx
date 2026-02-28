'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '../../../components/Layout';
import { TechType } from '../../../types';

const getCurrentPage = (pathname: string): string => {
  if (!pathname || pathname === '/') return 'home';
  const [first] = pathname.replace(/^\//, '').split('/');
  return first || 'home';
};

export function Header() {
  const pathname = usePathname();
  const currentPage = getCurrentPage(pathname);

  return (
    <Navbar
      setCurrentPage={() => {
        // Navigation integration is migrated in later steps.
      }}
      currentPage={currentPage}
      onSelectTech={(_: TechType) => {
        // Tech detail routing migration is handled in later steps.
      }}
      onOpenCart={() => {
        // Cart routing/state integration is handled in later steps.
      }}
      onOpenLogin={() => {
        // Auth flow integration is handled in later steps.
      }}
    />
  );
}
