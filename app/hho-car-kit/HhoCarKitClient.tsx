'use client';

import { useRouter } from 'next/navigation';
import { HHOCarKitPage } from '@/components/HHOCarKitPage';
import { navigateToPage, navigateWithScroll } from '@/src/lib/navigation';

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

interface HhoCarKitClientProps {
  initialFuelContext: InitialFuelContext;
}

export function HhoCarKitClient({ initialFuelContext }: HhoCarKitClientProps) {
  const router = useRouter();

  return (
    <HHOCarKitPage
      initialFuelContext={initialFuelContext}
      onBack={() => {
        navigateWithScroll(router, '/store');
      }}
      onNavigate={(page) => {
        navigateToPage(router, page);
      }}
    />
  );
}
