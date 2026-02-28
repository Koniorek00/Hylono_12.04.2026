'use client';

import { useRouter } from 'next/navigation';
import { BlogPage } from '@/components/BlogPage';

const toPath = (page: string) => {
  if (page.startsWith('/')) return page;
  return page === 'home' ? '/' : `/${page}`;
};

export function BlogClient() {
  const router = useRouter();

  return (
    <BlogPage
      onNavigate={(page) => {
        router.push(toPath(page));
        window.scrollTo(0, 0);
      }}
    />
  );
}
