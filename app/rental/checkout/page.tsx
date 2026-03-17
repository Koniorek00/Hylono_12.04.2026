import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { RentalCheckoutClient } from './RentalCheckoutClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Rental Checkout',
  description: 'Finalize your Hylono rental plan and delivery details securely.',
  path: '/rental/checkout',
  forceNoIndex: true,
});

// [DECISION: SSR because checkout is personalized and must render per-request state.]
export default function RentalCheckoutPageRoute() {
  return <RentalCheckoutClient />;
}
