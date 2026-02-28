'use client';

import { useRouter } from 'next/navigation';
import { ErrorPage } from '@/components/ErrorPage';
import { TechDetail } from '@/components/TechDetail';
import { TechType } from '@/types';

interface ProductClientProps {
  tech: string;
}

const getRoutePath = (page: string) => (page === 'home' ? '/' : `/${page}`);

const parseTechType = (value: string): TechType | null => {
  const normalized = value.toUpperCase();
  const techValues = Object.values(TechType) as string[];
  return techValues.includes(normalized) ? (normalized as TechType) : null;
};

export function ProductClient({ tech }: ProductClientProps) {
  const router = useRouter();
  const techType = parseTechType(tech);

  const navigateTo = (page: string) => {
    router.push(getRoutePath(page));
    window.scrollTo(0, 0);
  };

  if (!techType) {
    return <ErrorPage type="404" onNavigate={navigateTo} />;
  }

  return (
    <TechDetail
      techId={techType}
      onBack={() => navigateTo('home')}
      onJumpToTech={(nextTech) => {
        router.push(`/product/${nextTech.toLowerCase()}`);
        window.scrollTo(0, 0);
      }}
      onNavigate={navigateTo}
    />
  );
}