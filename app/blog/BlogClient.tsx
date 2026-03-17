'use client';

import { useRouter } from 'next/navigation';
import { BlogPage } from '@/components/BlogPage';
import { navigateToPage } from '@/src/lib/navigation';

export function BlogClient() {
  const router = useRouter();

  return (
    <BlogPage
      onNavigate={(page) => {
        navigateToPage(router, page);
      }}
    />
  );
}
