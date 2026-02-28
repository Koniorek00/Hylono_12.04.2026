import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { RentalClient } from './RentalClient';

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: 'Rental',
  description: 'Explore flexible rental plans for Hylono wellness technologies.',
  path: '/rental',
});

export default function RentalPageRoute() {
  return <RentalClient />;
}
