'use client';

import { useRouter } from 'next/navigation';
import { AccountPage } from '@/components/AuthComponents';
import { navigateToPage } from '@/src/lib/navigation';

export function AccountClient() {
  const router = useRouter();

  return (
    <AccountPage
      onNavigate={(page) => {
        navigateToPage(router, page);
      }}
    />
  );
}
