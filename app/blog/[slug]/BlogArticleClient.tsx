'use client';

import { useRouter } from 'next/navigation';
import { BlogArticle } from '@/components/BlogArticle';
import { navigateToPage, navigateWithScroll } from '@/src/lib/navigation';

export function BlogArticleClient({ slug }: { slug: string }) {
  const router = useRouter();

  return (
    <BlogArticle
      slug={slug}
      onBack={() => {
        navigateWithScroll(router, '/blog');
      }}
      onNavigate={(page) => {
        navigateToPage(router, page);
      }}
    />
  );
}
