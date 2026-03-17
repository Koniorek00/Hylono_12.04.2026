'use client';

import { useRouter } from 'next/navigation';
import { Home } from '@/components/Home';
import { navigateWithScroll } from '@/src/lib/navigation';
import { TechType } from '@/types';

export default function HomeClient() {
  const router = useRouter();

  const handleSelectTech = (type: TechType) => {
    navigateWithScroll(router, `/product/${type.toLowerCase()}`);
  };

  const handleLaunchBuilder = () => {
    navigateWithScroll(router, '/wellness-planner');
  };

  return <Home onSelectTech={handleSelectTech} onLaunchBuilder={handleLaunchBuilder} />;
}