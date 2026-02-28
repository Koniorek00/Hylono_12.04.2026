import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { TermsClient } from './TermsClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Terms & Conditions',
  description: 'Review Hylono terms and conditions for orders, rentals, services, and platform usage.',
  path: '/terms',
});

export default function TermsPageRoute() {
  return <TermsClient />;
}
