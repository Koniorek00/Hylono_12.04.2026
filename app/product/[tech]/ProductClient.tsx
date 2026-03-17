'use client';

import { useRouter } from 'next/navigation';
import { ErrorPage } from '@/components/ErrorPage';
import { TechDetail } from '@/components/TechDetail';
import { navigateToPage, navigateWithScroll } from '@/src/lib/navigation';
import { TechType } from '@/types';

interface ProductClientProps {
  tech: string;
}

const parseTechType = (value: string): TechType | null => {
  const normalized = value.toUpperCase();
  const techValues = Object.values(TechType) as string[];
  return techValues.includes(normalized) ? (normalized as TechType) : null;
};

export function ProductClient({ tech }: ProductClientProps) {
  const router = useRouter();
  const techType = parseTechType(tech);

  const navigateTo = (page: string) => {
    navigateToPage(router, page);
  };

  if (!techType) {
    return <ErrorPage type="404" onNavigate={navigateTo} />;
  }

  return (
    <TechDetail
      techId={techType}
      onBack={() => navigateTo('home')}
      onJumpToTech={(nextTech) => {
        navigateWithScroll(router, `/product/${nextTech.toLowerCase()}`);
      }}
      onNavigate={navigateTo}
    />
  );
}