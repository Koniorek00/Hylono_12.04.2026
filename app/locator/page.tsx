import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { LocatorClient } from './LocatorClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Partner Locator',
  description: 'Find certified Hylono partners, clinics, and distributors across Europe.',
  path: '/locator',
});

export default function LocatorPageRoute() {
  return <LocatorClient />;
}
