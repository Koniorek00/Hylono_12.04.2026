import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { WarrantyClient } from './WarrantyClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Warranty',
  description: 'Review Hylono warranty coverage terms, conditions, and support responsibilities.',
  path: '/warranty',
});

export default function WarrantyPageRoute() {
  return <WarrantyClient />;
}
