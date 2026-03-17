import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { CheckoutClient } from './CheckoutClient';

// [DECISION: checkout route is transaction-sensitive and remains request-time rendered under Next.js 16 Cache Components defaults; explicit `dynamic` segment config is removed because it is incompatible when cacheComponents is enabled. Reverse only if checkout is redesigned to static-safe behavior.]

export const metadata: Metadata = createPageMetadata({
  title: 'Checkout',
  description: 'Complete your order securely with shipping, payment, and confirmation steps.',
  path: '/checkout',
  forceNoIndex: true,
});

export default function CheckoutPageRoute() {
  return <CheckoutClient />;
}
