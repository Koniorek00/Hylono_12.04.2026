'use client';

import { useRouter } from 'next/navigation';
import { LoginModal } from '@/components/AuthComponents';
import { navigateWithScroll } from '@/src/lib/navigation';

interface LoginClientProps {
  callbackPath: string;
}

export function LoginClient({ callbackPath }: LoginClientProps) {
  const router = useRouter();

  return (
    <LoginModal
      isOpen={true}
      redirectTo={callbackPath}
      onClose={() => {
        navigateWithScroll(router, '/');
      }}
    />
  );
}
