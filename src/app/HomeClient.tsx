'use client';

import { useRouter } from 'next/navigation';
import { Home } from '../../components/Home';
import { TechType } from '../../types';

export default function HomeClient() {
  const router = useRouter();

  const handleSelectTech = (type: TechType) => {
    router.push(`/product/${type}`);
    window.scrollTo(0, 0);
  };

  const handleLaunchBuilder = () => {
    router.push('/wellness-planner');
    window.scrollTo(0, 0);
  };

  return <Home onSelectTech={handleSelectTech} onLaunchBuilder={handleLaunchBuilder} />;
}