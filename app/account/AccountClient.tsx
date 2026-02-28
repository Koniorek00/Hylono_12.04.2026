'use client';

import { useRouter } from 'next/navigation';
import { AccountPage } from '@/components/AuthComponents';

const toPath = (page: string) => {
  if (page.startsWith('/')) return page;
  return page === 'home' ? '/' : `/${page}`;
};

export function AccountClient() {
  const router = useRouter();

  return (
    <AccountPage
      onNavigate={(page) => {
        router.push(toPath(page));
        window.scrollTo(0, 0);
      }}
    />
  );
}
