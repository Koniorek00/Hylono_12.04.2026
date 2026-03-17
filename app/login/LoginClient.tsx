'use client';

import { useRouter } from 'next/navigation';
import { LoginModal } from '@/components/AuthComponents';
import { navigateWithScroll } from '@/src/lib/navigation';

export function LoginClient() {
  const router = useRouter();

  return (
    <LoginModal
      isOpen={true}
      onClose={() => {
        navigateWithScroll(router, '/');
      }}
    />
  );
}
