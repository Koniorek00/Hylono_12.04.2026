import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { HhoCarKitClient } from './HhoCarKitClient';

export const metadata: Metadata = createPageMetadata({
  title: 'HHO Car Kit',
  description: 'Explore Hylono HHO kits for cars and trucks with performance specs, ROI insights, and safety details.',
  path: '/hho-car-kit',
});

interface FuelData {
  petrol: number;
  diesel: number;
  currency: string;
  symbol: string;
  countryName: string;
}

interface InitialFuelContext {
  fuelData: FuelData;
  countryCode: string;
  locationStatus: 'detected' | 'fallback';
}

const DEFAULT_FUEL_DATA: FuelData = {
  petrol: 1.75,
  diesel: 1.65,
  currency: 'EUR',
  symbol: '€',
  countryName: 'your region',
};

const FUEL_REVALIDATE_SECONDS = 3600;

const FUEL_PRICES: Record<string, FuelData> = {
  DE: { petrol: 1.76, diesel: 1.65, currency: 'EUR', symbol: '€', countryName: 'Germany' },
  PL: { petrol: 1.44, diesel: 1.5, currency: 'EUR', symbol: '€', countryName: 'Poland' },
  NL: { petrol: 2.08, diesel: 1.63, currency: 'EUR', symbol: '€', countryName: 'Netherlands' },
  FR: { petrol: 1.84, diesel: 1.72, currency: 'EUR', symbol: '€', countryName: 'France' },
  BE: { petrol: 1.79, diesel: 1.68, currency: 'EUR', symbol: '€', countryName: 'Belgium' },
  ES: { petrol: 1.65, diesel: 1.52, currency: 'EUR', symbol: '€', countryName: 'Spain' },
  IT: { petrol: 1.82, diesel: 1.7, currency: 'EUR', symbol: '€', countryName: 'Italy' },
  AT: { petrol: 1.67, diesel: 1.6, currency: 'EUR', symbol: '€', countryName: 'Austria' },
  CH: { petrol: 1.88, diesel: 1.76, currency: 'CHF', symbol: 'Fr.', countryName: 'Switzerland' },
  SE: { petrol: 1.92, diesel: 1.78, currency: 'EUR', symbol: '€', countryName: 'Sweden' },
  DK: { petrol: 1.98, diesel: 1.82, currency: 'EUR', symbol: '€', countryName: 'Denmark' },
  FI: { petrol: 1.9, diesel: 1.75, currency: 'EUR', symbol: '€', countryName: 'Finland' },
  NO: { petrol: 2.08, diesel: 1.95, currency: 'EUR', symbol: '€', countryName: 'Norway' },
  CZ: { petrol: 1.52, diesel: 1.45, currency: 'EUR', symbol: '€', countryName: 'Czech Republic' },
  SK: { petrol: 1.58, diesel: 1.52, currency: 'EUR', symbol: '€', countryName: 'Slovakia' },
  HU: { petrol: 1.48, diesel: 1.42, currency: 'EUR', symbol: '€', countryName: 'Hungary' },
  RO: { petrol: 1.54, diesel: 1.48, currency: 'EUR', symbol: '€', countryName: 'Romania' },
  PT: { petrol: 1.78, diesel: 1.62, currency: 'EUR', symbol: '€', countryName: 'Portugal' },
  GR: { petrol: 1.9, diesel: 1.78, currency: 'EUR', symbol: '€', countryName: 'Greece' },
  HR: { petrol: 1.55, diesel: 1.48, currency: 'EUR', symbol: '€', countryName: 'Croatia' },
  GB: { petrol: 1.83, diesel: 1.76, currency: 'GBP', symbol: '£', countryName: 'United Kingdom' },
  IE: { petrol: 1.85, diesel: 1.72, currency: 'EUR', symbol: '€', countryName: 'Ireland' },
  US: { petrol: 0.92, diesel: 0.95, currency: 'USD', symbol: '$', countryName: 'United States' },
  CA: { petrol: 1.2, diesel: 1.24, currency: 'CAD', symbol: 'C$', countryName: 'Canada' },
  AU: { petrol: 1.68, diesel: 1.72, currency: 'AUD', symbol: 'A$', countryName: 'Australia' },
  NZ: { petrol: 2.1, diesel: 1.95, currency: 'NZD', symbol: 'NZ$', countryName: 'New Zealand' },
  ZA: { petrol: 1.45, diesel: 1.38, currency: 'USD', symbol: '$', countryName: 'South Africa' },
  AE: { petrol: 0.85, diesel: 0.72, currency: 'USD', symbol: '$', countryName: 'UAE' },
  TR: { petrol: 1.28, diesel: 1.22, currency: 'EUR', symbol: '€', countryName: 'Turkey' },
  DEFAULT: DEFAULT_FUEL_DATA,
};

const FALLBACK_FUEL_CONTEXT: InitialFuelContext = {
  fuelData: DEFAULT_FUEL_DATA,
  countryCode: 'DEFAULT',
  locationStatus: 'fallback',
};

const toPublicIp = (candidate: string | null): string | null => {
  if (!candidate) return null;

  const first = candidate.split(',')[0]?.trim();
  if (!first) return null;

  const lowered = first.toLowerCase();
  if (
    lowered === '::1' ||
    lowered.startsWith('10.') ||
    lowered.startsWith('192.168.') ||
    lowered.startsWith('172.16.') ||
    lowered.startsWith('172.17.') ||
    lowered.startsWith('172.18.') ||
    lowered.startsWith('172.19.') ||
    lowered.startsWith('172.2') ||
    lowered.startsWith('127.')
  ) {
    return null;
  }

  return first;
};

const getInitialFuelContext = async (): Promise<InitialFuelContext> => {
  try {
    const requestHeaders = await headers();
    const forwardedFor = requestHeaders.get('x-forwarded-for');
    const realIp = requestHeaders.get('x-real-ip');
    const ip = toPublicIp(forwardedFor) ?? toPublicIp(realIp);

    const endpoint = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/';

    const response = await fetch(endpoint, {
      next: { revalidate: FUEL_REVALIDATE_SECONDS },
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return FALLBACK_FUEL_CONTEXT;
    }

    const data: { country_code?: string } = await response.json();
    const code = (data.country_code ?? 'DEFAULT').toUpperCase();
    const fuelData = FUEL_PRICES[code] ?? DEFAULT_FUEL_DATA;

    return {
      fuelData,
      countryCode: code,
      locationStatus: code === 'DEFAULT' ? 'fallback' : 'detected',
    };
  } catch {
    return FALLBACK_FUEL_CONTEXT;
  }
};

export default async function HhoCarKitPageRoute() {
  const initialFuelContext = await getInitialFuelContext();

  return (
    <Suspense
      fallback={<div className="min-h-[40vh] w-full animate-pulse bg-slate-50" aria-label="Loading HHO Car Kit page" />}
    >
      <HhoCarKitClient initialFuelContext={initialFuelContext} />
    </Suspense>
  );
}
