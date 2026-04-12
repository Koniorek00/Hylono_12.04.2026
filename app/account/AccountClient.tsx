'use client';

import { useRouter } from 'next/navigation';
import { AccountPage } from '@/components/AuthComponents';
import { navigateToPage } from '@/src/lib/navigation';

interface AccountClientProps {
  sessionUser: {
    email?: string | null;
    name?: string | null;
  } | null;
}

export function AccountClient({ sessionUser }: AccountClientProps) {
  const router = useRouter();

  return (
    <AccountPage
      sessionUser={sessionUser}
      onNavigate={(page) => {
        navigateToPage(router, page);
      }}
    />
  );
}
