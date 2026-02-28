import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { CheckoutClient } from './CheckoutClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createPageMetadata({
  title: 'Checkout',
  description: 'Complete your order securely with shipping, payment, and confirmation steps.',
  path: '/checkout',
});

export default function CheckoutPageRoute() {
  return <CheckoutClient />;
}
