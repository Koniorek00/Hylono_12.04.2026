'use client';

import { useRouter } from 'next/navigation';
import { HHOCarKitPage } from '@/components/HHOCarKitPage';

interface FuelData {
  petrol: number;
  diesel: number;
  currency: string;
  symbol: string;
  countryName: string;
}

export interface InitialFuelContext {
  fuelData: FuelData;
  countryCode: string;
  locationStatus: 'detected' | 'fallback';
}

const toPath = (page: string) => {
  if (page.startsWith('/')) return page;
  return page === 'home' ? '/' : `/${page}`;
};

interface HhoCarKitClientProps {
  initialFuelContext: InitialFuelContext;
}

export function HhoCarKitClient({ initialFuelContext }: HhoCarKitClientProps) {
  const router = useRouter();

  return (
    <HHOCarKitPage
      initialFuelContext={initialFuelContext}
      onBack={() => {
        router.push('/store');
        window.scrollTo(0, 0);
      }}
      onNavigate={(page) => {
        router.push(toPath(page));
        window.scrollTo(0, 0);
      }}
    />
  );
}
