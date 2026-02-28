'use client';

import { useRouter } from 'next/navigation';
import { BlogArticle } from '@/components/BlogArticle';

const toPath = (page: string) => {
  if (page.startsWith('/')) return page;
  return page === 'home' ? '/' : `/${page}`;
};

export function BlogArticleClient({ slug }: { slug: string }) {
  const router = useRouter();

  return (
    <BlogArticle
      slug={slug}
      onBack={() => {
        router.push('/blog');
        window.scrollTo(0, 0);
      }}
      onNavigate={(page) => {
        router.push(toPath(page));
        window.scrollTo(0, 0);
      }}
    />
  );
}
