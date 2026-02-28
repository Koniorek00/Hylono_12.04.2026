import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { RentalCheckoutClient } from './RentalCheckoutClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createPageMetadata({
  title: 'Rental Checkout',
  description: 'Finalize your Hylono rental plan and delivery details securely.',
  path: '/rental/checkout',
});

export default function RentalCheckoutPageRoute() {
  return <RentalCheckoutClient />;
}
