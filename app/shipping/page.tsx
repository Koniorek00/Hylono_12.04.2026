import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ShippingClient } from './ShippingClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Shipping Information',
  description: 'View Hylono shipping timelines, delivery methods, and logistics policies for your region.',
  path: '/shipping',
});

export default function ShippingPageRoute() {
  return <ShippingClient />;
}
